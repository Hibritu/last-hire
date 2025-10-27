package payments

import (
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type invalidInputError struct{ msg string }

func (e invalidInputError) Error() string { return e.msg }

func ParseInitiateInput(jobID, employerID string, amount decimal.Decimal, currency, email, first, last string) InitiateInput {
	jid, _ := uuid.Parse(jobID)
	eid, _ := uuid.Parse(employerID)
	return InitiateInput{
		JobID:      jid,
		EmployerID: eid,
		Amount:     amount,
		Currency:   currency,
		PayerEmail: email,
		PayerFirst: first,
		PayerLast:  last,
	}
} 