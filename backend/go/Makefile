APP_NAME=server
BIN_DIR=bin
PKG=./cmd/server

.PHONY: all tidy build run dev docker-up docker-down

all: build

 tidy:
	go mod tidy

 build: tidy
	mkdir -p $(BIN_DIR)
	go build -o $(BIN_DIR)/$(APP_NAME) $(PKG)

 run:
	go run $(PKG)

 dev:
	REFRESH_INTERVAL=1s reflex -r '\.go$' -s -- sh -c 'go run $(PKG)'

 docker-up:
	docker-compose up --build

 docker-down:
	docker-compose down -v 