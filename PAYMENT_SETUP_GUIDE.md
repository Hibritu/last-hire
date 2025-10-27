# 💳 HireHub Ethiopia - Payment Setup Guide

## 🎯 Payment System Overview

HireHub uses **Chapa** - Ethiopia's leading payment gateway that supports:
- **Telebirr** (Ethio Telecom mobile money)
- **CBE Birr** (Commercial Bank of Ethiopia)
- **Bank transfers**
- **Mobile banking**

---

## 📋 Payment Flow

### **When Do Payments Happen?**
Payments are required when an employer wants to post a **premium job listing**.

```
Employer posts job with "Premium" listing type
    ↓
System calculates fee (e.g., 500 ETB)
    ↓
Payment initiated → Redirect to Chapa
    ↓
User pays via Telebirr/CBE Birr/Bank
    ↓
Payment confirmed → Job listing activated
    ↓
Job appears at top of listings
```

---

## 🚀 Quick Setup (2 Options)

### **Option 1: Use Test/Demo Mode (Recommended for Development)**

For testing without real payment gateway:

1. **Set environment variables** in `backend/go/.env`:
```env
DATABASE_URL=sqlite:./database_payments.sqlite
PORT=8080
CHAPA_PUBLIC_KEY=test_key
CHAPA_SECRET_KEY=test_key
CHAPA_BASE_URL=https://api.chapa.co
RETURN_URL=http://localhost:3000/payments/return
CALLBACK_URL=http://localhost:8080/payments/confirm
```

2. **The payment service will generate mock checkout URLs** for testing

3. **Manually approve payments** in the database for testing:
```sql
UPDATE payments SET status = 'success' WHERE id = 'payment_id';
```

---

### **Option 2: Use Real Chapa Integration (Production)**

For real Ethiopian payments:

#### **Step 1: Get Chapa Account**
1. Go to https://chapa.co
2. Sign up for a business account
3. Complete verification with business documents
4. Get your API keys from the dashboard

#### **Step 2: Configure Environment**
Create `backend/go/.env`:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/hirehub?sslmode=disable
PORT=8080

# Your real Chapa credentials
CHAPA_PUBLIC_KEY=CHAPUBK_TEST-xxxxxxxxxxxxxxxxx
CHAPA_SECRET_KEY=CHASECK_TEST-xxxxxxxxxxxxxxxxx
CHAPA_BASE_URL=https://api.chapa.co

# Where users return after payment
RETURN_URL=http://localhost:3000/payments/return
CALLBACK_URL=http://localhost:8080/payments/confirm
```

**Note:** Use TEST keys for testing, LIVE keys for production.

#### **Step 3: Start Payment Service**
```bash
cd backend/go
go run cmd/server/main.go
```

---

## 🧪 Testing Payments (Development Mode)

### **Method 1: Direct API Test**

```bash
# 1. Get employer JWT token by logging in as employer
# 2. Initiate payment

curl -X POST http://localhost:8080/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "your-job-uuid",
    "employer_id": "your-employer-uuid",
    "amount": "500",
    "currency": "ETB",
    "email": "employer@gmail.com",
    "first_name": "John",
    "last_name": "Employer"
  }'

# Response:
# {
#   "payment_id": "uuid",
#   "tx_ref": "job-xxx-123456",
#   "checkout_url": "https://checkout.chapa.co/checkout/xxx"
# }
```

### **Method 2: Manual Database Approval (Fastest for Testing)**

After payment is initiated:

```sql
-- View pending payments
SELECT * FROM payments WHERE status = 'pending';

-- Approve a payment
UPDATE payments SET status = 'success' WHERE id = 'your-payment-id';

-- Or approve by transaction reference
UPDATE payments SET status = 'success' WHERE transaction_ref = 'job-xxx-123456';
```

### **Method 3: Use Chapa Test Mode**

With Chapa test credentials:
1. Payment initiated → Get checkout URL
2. Visit the checkout URL
3. Use Chapa test card numbers:
   - **Test Success:** Use card `4000 0000 0000 0077`
   - **Test Failure:** Use card `4000 0000 0000 0002`
4. Payment confirmed automatically via callback

---

## 💼 Complete Payment Flow in Employer Portal

### **Step 1: Employer Posts Premium Job**

In the employer portal job posting form:

```typescript
// When employer selects "Premium" listing type
{
  title: "Senior Developer",
  description: "...",
  listing_type: "premium",  // ← This triggers payment
  // ... other fields
}
```

### **Step 2: System Calculates Fee**

```javascript
// Common pricing (you can customize)
const PREMIUM_JOB_PRICE = 500; // ETB
const FREE_JOB_PRICE = 0;
```

### **Step 3: Payment Initiated**

Frontend calls:
```typescript
const response = await paymentService.initiatePayment({
  jobId: job.id,
  employerId: employer.id,
  amount: 500,
  currency: 'ETB',
  email: employer.email,
  firstName: employer.firstName,
  lastName: employer.lastName
});

// Response contains checkout URL
window.location.href = response.checkoutUrl;
```

### **Step 4: User Pays**

User is redirected to Chapa checkout page where they can pay via:
- **Telebirr** (mobile money)
- **CBE Birr** (bank transfer)
- **Other Ethiopian payment methods**

### **Step 5: Payment Confirmed**

After successful payment:
1. Chapa calls your callback URL: `http://localhost:8080/payments/confirm`
2. Payment status updated to "success"
3. User redirected to: `http://localhost:3000/payments/return`
4. Job listing activated and appears at top

---

## 🔧 Payment Service Endpoints

### **1. Initiate Payment**
```http
POST http://localhost:8080/payments/initiate

Request Body:
{
  "job_id": "uuid",
  "employer_id": "uuid",
  "amount": "500",
  "currency": "ETB",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe"
}

Response:
{
  "payment_id": "uuid",
  "tx_ref": "job-xxx-timestamp",
  "checkout_url": "https://checkout.chapa.co/..."
}
```

### **2. Confirm Payment** (Called by Chapa or manually)
```http
POST http://localhost:8080/payments/confirm

Request Body:
{
  "tx_ref": "job-xxx-timestamp"
}

Response:
{
  "payment_id": "uuid",
  "status": "success"
}
```

### **3. Verify Payment** (Alternative GET method)
```http
GET http://localhost:8080/payments/confirm?tx_ref=job-xxx-timestamp

Response:
{
  "payment_id": "uuid",
  "status": "success"
}
```

---

## 📊 Payment Database Schema

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL,
  employer_id UUID NOT NULL,
  amount DECIMAL(20,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ETB',
  status VARCHAR(20) DEFAULT 'pending',  -- pending, success, failed, refunded
  provider VARCHAR(20) DEFAULT 'chapa',   -- chapa, telebirr, cbe_birr
  transaction_ref VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Query Payment History**
```sql
-- All payments for an employer
SELECT * FROM payments 
WHERE employer_id = 'employer-uuid' 
ORDER BY created_at DESC;

-- Successful payments only
SELECT * FROM payments 
WHERE status = 'success' 
ORDER BY created_at DESC;

-- Pending payments (need attention)
SELECT * FROM payments 
WHERE status = 'pending' 
AND created_at < NOW() - INTERVAL '1 hour';
```

---

## 🎨 Frontend Integration Example

### **Employer Portal - Payment Component**

```typescript
import { useState } from 'react';
import PaymentService from '@/services/paymentService';

const PaymentButton = ({ job, employer }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Initiate payment
      const response = await PaymentService.initiatePayment({
        jobId: job.id,
        employerId: employer.id,
        amount: 500,
        currency: 'ETB',
        email: employer.email,
        firstName: employer.firstName,
        lastName: employer.lastName
      });

      // Redirect to Chapa checkout
      window.location.href = response.checkoutUrl;
      
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={isProcessing}
    >
      {isProcessing ? 'Processing...' : 'Pay 500 ETB'}
    </Button>
  );
};
```

### **Payment Return Page** (`/payments/return`)

```typescript
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking');
  
  useEffect(() => {
    const txRef = searchParams.get('tx_ref');
    
    // Verify payment status
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/payments/confirm?tx_ref=${txRef}`
        );
        const data = await response.json();
        
        setStatus(data.status);
        
        if (data.status === 'success') {
          toast.success('Payment successful! Your job is now live.');
          // Redirect to jobs page after 3 seconds
          setTimeout(() => {
            window.location.href = '/jobs';
          }, 3000);
        }
      } catch (error) {
        setStatus('failed');
      }
    };
    
    if (txRef) {
      verifyPayment();
    }
  }, []);

  return (
    <div className="payment-result">
      {status === 'checking' && <p>Verifying payment...</p>}
      {status === 'success' && <p>✅ Payment successful!</p>}
      {status === 'failed' && <p>❌ Payment failed. Please try again.</p>}
    </div>
  );
};
```

---

## 🔒 Security Considerations

### **Important Security Practices:**

1. **Always Verify Payments Server-Side**
   - Never trust client-side payment status
   - Always verify with Chapa API before activating features

2. **Use HTTPS in Production**
   ```env
   RETURN_URL=https://yourdomain.com/payments/return
   CALLBACK_URL=https://yourdomain.com/payments/confirm
   ```

3. **Validate Transaction References**
   - Ensure tx_ref matches expected format
   - Prevent replay attacks

4. **Store Sensitive Data Securely**
   - Never commit API keys to Git
   - Use environment variables
   - Rotate keys regularly

5. **Implement Webhooks Properly**
   ```go
   // Verify webhook signature
   func verifyWebhook(signature, payload string) bool {
     // Implement signature verification
     return true
   }
   ```

---

## 💰 Pricing Configuration

### **Update Payment Amounts**

In your frontend services (`paymentService.ts`):
```typescript
export const PRICING = {
  FREE_JOB: 0,
  PREMIUM_JOB: 500,      // ETB
  FEATURED_JOB: 1000,    // ETB
  URGENT_JOB: 750,       // ETB
};
```

### **Dynamic Pricing Based on Duration**
```typescript
const calculatePrice = (listingType: string, duration: number) => {
  const basePrice = PRICING[listingType] || 0;
  const durationMultiplier = duration > 30 ? 1.5 : 1;
  return basePrice * durationMultiplier;
};
```

---

## 🧪 Testing Checklist

- [ ] Payment service running on port 8080
- [ ] Environment variables configured
- [ ] Chapa credentials set (or test mode enabled)
- [ ] Database accessible
- [ ] Can initiate payment from employer portal
- [ ] Checkout URL generated successfully
- [ ] Payment confirmation works (manual or via Chapa)
- [ ] Job status updated after payment
- [ ] User redirected to return URL
- [ ] Payment history visible in employer portal

---

## 🐛 Troubleshooting

### **Problem: "Failed to initiate payment"**
**Solutions:**
- Check payment service is running: `curl http://localhost:8080/healthz`
- Verify database connection
- Check Chapa credentials in `.env`
- View logs: Payment service terminal

### **Problem: "Payment shows pending forever"**
**Solutions:**
- Check Chapa callback URL is accessible
- Manually confirm: `curl -X POST http://localhost:8080/payments/confirm -d '{"tx_ref":"job-xxx"}'`
- Check payment status in database: `SELECT * FROM payments WHERE status='pending'`

### **Problem: "Checkout URL not working"**
**Solutions:**
- Verify CHAPA_BASE_URL is correct
- Check API keys are valid
- Try test credentials first
- Contact Chapa support

---

## 📞 Chapa Support

- **Website:** https://chapa.co
- **Documentation:** https://developer.chapa.co
- **Support Email:** support@chapa.co
- **Test Environment:** Available with test API keys

---

## 🎉 Summary

You now have multiple options to complete payments:

### **For Development/Testing:**
1. **Use manual database approval** (fastest)
2. **Use Chapa test mode** with test credentials
3. **Mock payments** in frontend (temporary)

### **For Production:**
1. **Get Chapa business account**
2. **Add real API credentials**
3. **Test with real ETB amounts**
4. **Monitor payments in dashboard**

Need more help? Check:
- Chapa documentation: https://developer.chapa.co
- Payment service code: `backend/go/internal/payments/`
- Frontend payment service: `Frontend/employer-connect-pro-main/src/services/paymentService.ts`

**Happy processing! 💳🇪🇹**

