package http

import (
	"log"
	"net/http"

	"hirehub/internal/config"
	"hirehub/internal/payments"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type Server struct {
	engine *gin.Engine
}

func NewServer(db *gorm.DB, cfg config.Config) *Server {
	engine := gin.New()
	engine.Use(gin.Recovery(), gin.Logger())

	engine.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	engine.GET("/healthz", func(c *gin.Context) { c.String(http.StatusOK, "ok") })
	engine.GET("/readyz", func(c *gin.Context) {
		if err := db.Exec("SELECT 1").Error; err != nil {
			c.Status(http.StatusServiceUnavailable)
			return
		}
		c.String(http.StatusOK, "ready")
	})

	chapa := payments.NewChapaClient(cfg.ChapaBaseURL, cfg.ChapaSecretKey)
	paySvc := &payments.Service{DB: db, Chapa: chapa, Return: cfg.ReturnURL, Callback: cfg.CallbackURL}

	engine.POST("/payments/initiate", func(c *gin.Context) {
		var body struct {
			JobID      string `json:"job_id"`
			EmployerID string `json:"employer_id"`
			Amount     string `json:"amount"`
			Currency   string `json:"currency"`
			Email      string `json:"email"`
			FirstName  string `json:"first_name"`
			LastName   string `json:"last_name"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.Status(http.StatusBadRequest)
			return
		}
		amt, err := decimal.NewFromString(body.Amount)
		if err != nil {
			c.Status(http.StatusBadRequest)
			return
		}
		out, err := paySvc.Initiate(c.Request.Context(), payments.ParseInitiateInput(body.JobID, body.EmployerID, amt, body.Currency, body.Email, body.FirstName, body.LastName))
		if err != nil {
			log.Println("initiate error:", err)
			c.Status(http.StatusBadRequest)
			return
		}
		c.JSON(http.StatusOK, out)
	})

	engine.POST("/payments/confirm", func(c *gin.Context) {
		var body struct{ TxRef string `json:"tx_ref"` }
		_ = c.ShouldBindJSON(&body)
		if body.TxRef == "" {
			c.Status(http.StatusBadRequest)
			return
		}
		out, err := paySvc.Confirm(c.Request.Context(), body.TxRef)
		if err != nil {
			c.Status(http.StatusBadRequest)
			return
		}
		c.JSON(http.StatusOK, out)
	})

	engine.GET("/payments/confirm", func(c *gin.Context) {
		txRef := c.Query("tx_ref")
		if txRef == "" {
			c.Status(http.StatusBadRequest)
			return
		}
		out, err := paySvc.Confirm(c.Request.Context(), txRef)
		if err != nil {
			c.Status(http.StatusBadRequest)
			return
		}
		c.JSON(http.StatusOK, out)
	})

	return &Server{engine: engine}
}

func (s *Server) Handler() http.Handler { return s.engine } 