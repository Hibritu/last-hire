package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"hirehub/internal/config"
	httpapi "hirehub/internal/http"
	"hirehub/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

func main() {
	cfg := config.Load()

	var db *gorm.DB
	var err error

	// Use SQLite for local development, PostgreSQL for production
	if strings.HasPrefix(cfg.DatabaseURL, "sqlite:") {
		// Extract the file path from the SQLite URL
		dbPath := strings.TrimPrefix(cfg.DatabaseURL, "sqlite:")
		db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
			NamingStrategy: schema.NamingStrategy{SingularTable: false},
			Logger:        logger.Default.LogMode(logger.Info),
		})
	} else {
		// Use PostgreSQL for production
		db, err = gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{
			NamingStrategy: schema.NamingStrategy{SingularTable: false},
			Logger:        logger.Default.LogMode(logger.Info),
		})
	}

	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// For SQLite, we don't need the pgcrypto extension
	if !strings.HasPrefix(cfg.DatabaseURL, "sqlite:") {
		// Try to ensure pgcrypto extension for gen_random_uuid(); continue if not permitted (e.g., managed DBs)
		if err := db.Exec("CREATE EXTENSION IF NOT EXISTS pgcrypto").Error; err != nil {
			log.Printf("warning: could not ensure pgcrypto extension: %v (continuing)", err)
		}
	}

	if err := db.AutoMigrate(&models.Payment{}, &models.Chat{}, &models.Message{}); err != nil {
		log.Fatalf("auto-migration failed: %v", err)
	}

	engine := httpapi.NewServer(db, cfg).Handler()

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      engine,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Println("server listening on", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("http server error: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("server forced to shutdown: %v", err)
	}

	log.Println("server exited")
}