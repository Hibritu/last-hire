package payments

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type ChapaClient struct {
	BaseURL    string
	SecretKey  string
	HTTPClient *http.Client
}

type ChapaInitializeRequest struct {
	Amount      string `json:"amount"`
	Currency    string `json:"currency"`
	Email       string `json:"email"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	TxRef       string `json:"tx_ref"`
	CallbackURL string `json:"callback_url"`
	ReturnURL   string `json:"return_url"`
}

type chapaResponse struct {
	Status  string          `json:"status"`
	Message string          `json:"message"`
	Data    json.RawMessage `json:"data"`
}

type chapaInitData struct {
	CheckoutURL string `json:"checkout_url"`
}

type chapaVerifyData struct {
	TxRef  string `json:"tx_ref"`
	Status string `json:"status"`
}

func NewChapaClient(baseURL, secretKey string) *ChapaClient {
	return &ChapaClient{
		BaseURL:   baseURL,
		SecretKey: secretKey,
		HTTPClient: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

func (c *ChapaClient) Initialize(ctx context.Context, req ChapaInitializeRequest) (checkoutURL string, err error) {
	payload, _ := json.Marshal(req)
	url := fmt.Sprintf("%s/v1/transaction/initialize", c.BaseURL)
	httpReq, _ := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(payload))
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+c.SecretKey)

	resp, err := c.HTTPClient.Do(httpReq)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("chapa initialize failed: %s", string(body))
	}
	var r chapaResponse
	if err := json.Unmarshal(body, &r); err != nil {
		return "", err
	}
	if r.Status != "success" {
		return "", fmt.Errorf("chapa initialize status: %s", r.Status)
	}
	var d chapaInitData
	if err := json.Unmarshal(r.Data, &d); err != nil {
		return "", err
	}
	return d.CheckoutURL, nil
}

func (c *ChapaClient) Verify(ctx context.Context, txRef string) (success bool, err error) {
	url := fmt.Sprintf("%s/v1/transaction/verify/%s", c.BaseURL, txRef)
	httpReq, _ := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	httpReq.Header.Set("Authorization", "Bearer "+c.SecretKey)

	resp, err := c.HTTPClient.Do(httpReq)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return false, fmt.Errorf("chapa verify failed: %s", string(body))
	}
	var r chapaResponse
	if err := json.Unmarshal(body, &r); err != nil {
		return false, err
	}
	if r.Status != "success" {
		return false, nil
	}
	var d chapaVerifyData
	if err := json.Unmarshal(r.Data, &d); err != nil {
		return false, err
	}
	return d.Status == "success", nil
} 