package models

// PaymentStatus represents the lifecycle state of a payment
// Values mirror the JS PAYMENT_STATUS_ENUM
// "pending", "success", "failed", "refunded"
type PaymentStatus string

const (
	PaymentStatusPending  PaymentStatus = "pending"
	PaymentStatusSuccess  PaymentStatus = "success"
	PaymentStatusFailed   PaymentStatus = "failed"
	PaymentStatusRefunded PaymentStatus = "refunded"
)

// PaymentProvider denotes the upstream processor used for a payment
// Values mirror the JS PAYMENT_PROVIDER_ENUM
// "chapa", "telebirr", "cbe_birr"
type PaymentProvider string

const (
	PaymentProviderChapa    PaymentProvider = "chapa"
	PaymentProviderTelebirr PaymentProvider = "telebirr"
	PaymentProviderCBEBirr  PaymentProvider = "cbe_birr"
) 