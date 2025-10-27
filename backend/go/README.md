# HireHub Go Backend (Gin)

## Requirements
- Go 1.23+
- PostgreSQL 14+

## Configuration
Environment variables (see `env.example`):
- `DATABASE_URL` (default: postgres://postgres:postgres@localhost:5432/hirehub?sslmode=disable)
- `PORT` (default: 8080)
- `CHAPA_PUBLIC_KEY`
- `CHAPA_SECRET_KEY`
- `CHAPA_BASE_URL` (default: https://api.chapa.co)
- `RETURN_URL` (default: http://localhost:3000/payments/return)
- `CALLBACK_URL` (default: http://localhost:8080/payments/confirm)

## Run Locally
```bash
cp env.example .env
make dev
```

## Build and Run
```bash
make build
./bin/server
```

## Docker
```bash
docker-compose up --build
```

## Health Checks
- `GET /healthz` -> ok
- `GET /readyz` -> ready

## Payments
- `POST /payments/initiate`
- `POST /payments/confirm`
- `GET  /payments/confirm?tx_ref=...` 