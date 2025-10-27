package config

import (
	"os"
)

type Config struct {
	DatabaseURL    string
	Port           string
	ChapaPublicKey string
	ChapaSecretKey string
	ChapaBaseURL   string
	ReturnURL      string
	CallbackURL    string
}

func Load() Config {
	cfg := Config{
		DatabaseURL:    getenv("DATABASE_URL", "sqlite:./database_payments.sqlite"),
		Port:           getenv("PORT", "8080"),
		ChapaPublicKey: getenv("CHAPA_PUBLIC_KEY", ""),
		ChapaSecretKey: getenv("CHAPA_SECRET_KEY", ""),
		ChapaBaseURL:   getenv("CHAPA_BASE_URL", "https://api.chapa.co"),
		ReturnURL:      getenv("RETURN_URL", "http://localhost:3000/payments/return"),
		CallbackURL:    getenv("CALLBACK_URL", "http://localhost:8080/payments/confirm"),
	}
	return cfg
}

func getenv(key, def string) string {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	return v
}