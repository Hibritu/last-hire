package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Chat struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	JobID       uuid.UUID `gorm:"type:uuid;not null;index:idx_chat_job" json:"job_id"`
	EmployerID  uuid.UUID `gorm:"type:uuid;not null;index:idx_chat_employer" json:"employer_id"`
	CandidateID uuid.UUID `gorm:"type:uuid;not null;index:idx_chat_candidate" json:"candidate_id"`
	IsActive    bool      `gorm:"not null;default:true" json:"is_active"`
	CreatedAt   time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (Chat) TableName() string { return "chats" }

func (c *Chat) BeforeCreate(tx *gorm.DB) (err error) {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
} 