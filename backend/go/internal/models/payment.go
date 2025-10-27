package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type Payment struct {
	ID             uuid.UUID       `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	JobID          uuid.UUID       `gorm:"type:uuid;not null;index:idx_payment_job" json:"job_id"`
	EmployerID     uuid.UUID       `gorm:"type:uuid;not null;index:idx_payment_employer" json:"employer_id"`
	Amount         decimal.Decimal `gorm:"type:numeric(20,2);not null" json:"amount"`
	Currency       string          `gorm:"type:varchar(10);not null;default:ETB" json:"currency"`
	Status         PaymentStatus   `gorm:"type:varchar(20);not null;default:pending" json:"status"`
	Provider       PaymentProvider `gorm:"type:varchar(20);not null;default:chapa" json:"provider"`
	TransactionRef *string         `gorm:"type:varchar(255);uniqueIndex:idx_payment_txref" json:"transaction_ref,omitempty"`
	CreatedAt      time.Time       `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time       `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (Payment) TableName() string { return "payments" }

func (p *Payment) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
} 