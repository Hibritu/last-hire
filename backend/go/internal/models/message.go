package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Message struct {
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	ChatID     uuid.UUID `gorm:"type:uuid;not null;index:idx_msg_chat" json:"chat_id"`
	SenderID   uuid.UUID `gorm:"type:uuid;not null;index:idx_msg_sender" json:"sender_id"`
	Content    *string   `gorm:"type:text" json:"content,omitempty"`
	Attachment *string   `gorm:"type:varchar(255)" json:"attachment,omitempty"`
	CreatedAt  time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
}

func (Message) TableName() string { return "messages" }

func (m *Message) BeforeCreate(tx *gorm.DB) (err error) {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
} 