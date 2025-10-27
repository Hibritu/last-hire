package payments

import (
	"context"
	"fmt"
	"time"

	"hirehub/internal/models"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type Service struct {
	DB     *gorm.DB
	Chapa  *ChapaClient
	Return string
	Callback string
}

type InitiateInput struct {
	JobID      uuid.UUID
	EmployerID uuid.UUID
	Amount     decimal.Decimal
	Currency   string
	PayerEmail string
	PayerFirst string
	PayerLast  string
}

type InitiateOutput struct {
	PaymentID   uuid.UUID
	TxRef       string
	CheckoutURL string
}

type ConfirmOutput struct {
	PaymentID uuid.UUID
	Status    models.PaymentStatus
}

func (s *Service) Initiate(ctx context.Context, in InitiateInput) (InitiateOutput, error) {
	txRef := fmt.Sprintf("job-%s-%d", in.JobID.String(), time.Now().UnixNano())

	payment := models.Payment{
		JobID:          in.JobID,
		EmployerID:     in.EmployerID,
		Amount:         in.Amount,
		Currency:       coalesce(in.Currency, "ETB"),
		Status:         models.PaymentStatusPending,
		Provider:       models.PaymentProviderChapa,
		TransactionRef: &txRef,
	}
	if err := s.DB.WithContext(ctx).Create(&payment).Error; err != nil {
		return InitiateOutput{}, err
	}

	checkout, err := s.Chapa.Initialize(ctx, ChapaInitializeRequest{
		Amount:      payment.Amount.StringFixed(2),
		Currency:    payment.Currency,
		Email:       in.PayerEmail,
		FirstName:   in.PayerFirst,
		LastName:    in.PayerLast,
		TxRef:       txRef,
		CallbackURL: s.Callback,
		ReturnURL:   s.Return,
	})
	if err != nil {
		return InitiateOutput{}, err
	}

	return InitiateOutput{PaymentID: payment.ID, TxRef: txRef, CheckoutURL: checkout}, nil
}

func (s *Service) Confirm(ctx context.Context, txRef string) (ConfirmOutput, error) {
	var p models.Payment
	if err := s.DB.WithContext(ctx).Where("transaction_ref = ?", txRef).First(&p).Error; err != nil {
		return ConfirmOutput{}, err
	}

	success, err := s.Chapa.Verify(ctx, txRef)
	if err != nil {
		return ConfirmOutput{}, err
	}
	newStatus := models.PaymentStatusFailed
	if success {
		newStatus = models.PaymentStatusSuccess
	}
	if err := s.DB.WithContext(ctx).Model(&p).Update("status", newStatus).Error; err != nil {
		return ConfirmOutput{}, err
	}
	return ConfirmOutput{PaymentID: p.ID, Status: newStatus}, nil
}

func coalesce(v string, def string) string {
	if v == "" {
		return def
	}
	return v
} 