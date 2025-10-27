import { apiWrapper, paymentApiClient, checkBackendAvailability, API_CONFIG } from '../lib/api';
import { mockPaymentHistory, PaymentHistory } from '../lib/mockData';

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  jobId?: string;
  listingType: 'basic' | 'premium' | 'featured';
}

export interface PaymentResponse {
  id: string;
  paymentUrl: string;
  reference: string;
  status: 'pending' | 'success' | 'failed';
  amount: number;
  currency: string;
}

/**
 * Payment Service for Employer Connect Mobile
 * TODO: Remove mock fallbacks when integrating with backend
 */
export class PaymentService {
  private static isBackendAvailable = false;
  private static localPaymentHistory: PaymentHistory[] = [...mockPaymentHistory];

  /**
   * Check backend availability
   */
  static async checkBackendAvailability(): Promise<void> {
    try {
      this.isBackendAvailable = await checkBackendAvailability(API_CONFIG.PAYMENT_BASE_URL);
      if (this.isBackendAvailable) {
        console.log('✅ [PAYMENT SERVICE] Backend is available');
      } else {
        console.warn('⚠️ [PAYMENT SERVICE] Backend unavailable, using mock payments');
      }
    } catch (error) {
      console.warn('⚠️ [PAYMENT SERVICE] Backend unavailable, using mock payments');
      this.isBackendAvailable = false;
    }
  }

  /**
   * Initialize payment for job listing
   */
  static async initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      if (this.isBackendAvailable) {
        const payment = await apiWrapper.post<PaymentResponse>('/payments/initialize', {
          ...paymentData,
          currency: paymentData.currency || 'ETB',
          returnUrl: 'employerconnect://payments/return',
          cancelUrl: 'employerconnect://payments/cancel'
        }, paymentApiClient);
        
        console.log('✅ [PAYMENT SERVICE] Payment initialized successfully:', payment.reference);
        return payment;
      } else {
        console.log('🎭 [PAYMENT SERVICE] Initializing mock payment');
        
        // Mock payment response
        const mockPayment: PaymentResponse = {
          id: `pay_${Date.now()}`,
          paymentUrl: `https://mock-telebirr.et/pay?ref=${Date.now()}`,
          reference: `REF_${Date.now()}`,
          status: 'pending',
          amount: paymentData.amount,
          currency: paymentData.currency || 'ETB'
        };
        
        // Add to local payment history
        const historyEntry: PaymentHistory = {
          id: mockPayment.id,
          reference: mockPayment.reference,
          amount: mockPayment.amount,
          currency: mockPayment.currency,
          status: mockPayment.status,
          description: paymentData.description,
          createdAt: new Date().toISOString(),
          paymentMethod: 'Telebirr'
        };
        this.localPaymentHistory.unshift(historyEntry);
        
        console.log('✅ [MOCK PAYMENT SERVICE] Mock payment initialized successfully');
        return mockPayment;
      }
    } catch (error) {
      console.error('❌ [PAYMENT SERVICE] Error initializing payment:', error);
      throw new Error('Failed to initialize payment. Please try again.');
    }
  }

  /**
   * Verify payment status
   */
  static async verifyPayment(paymentReference: string): Promise<PaymentResponse> {
    try {
      if (this.isBackendAvailable) {
        const verification = await apiWrapper.post<PaymentResponse>('/payments/verify', {
          reference: paymentReference
        }, paymentApiClient);
        
        console.log('✅ [PAYMENT SERVICE] Payment verification completed:', verification.status);
        return verification;
      } else {
        console.log('🎭 [PAYMENT SERVICE] Mock payment verification for:', paymentReference);
        
        // Mock successful payment verification
        const mockVerification: PaymentResponse = {
          id: `pay_verified_${Date.now()}`,
          paymentUrl: '',
          reference: paymentReference,
          status: 'success',
          amount: 500,
          currency: 'ETB'
        };
        
        // Update local payment history
        const payment = this.localPaymentHistory.find(p => p.reference === paymentReference);
        if (payment) {
          payment.status = 'success';
        }
        
        console.log('✅ [MOCK PAYMENT SERVICE] Mock payment verified successfully');
        return mockVerification;
      }
    } catch (error) {
      console.error('❌ [PAYMENT SERVICE] Error verifying payment:', error);
      throw new Error('Failed to verify payment status');
    }
  }

  /**
   * Get payment history for the employer
   */
  static async getPaymentHistory(): Promise<PaymentHistory[]> {
    try {
      if (this.isBackendAvailable) {
        const history = await apiWrapper.get<PaymentHistory[]>('/payments/history', paymentApiClient);
        console.log('✅ [PAYMENT SERVICE] Retrieved payment history:', history.length);
        return history;
      } else {
        console.log('🎭 [PAYMENT SERVICE] Using mock payment history');
        return this.localPaymentHistory;
      }
    } catch (error) {
      console.error('❌ [PAYMENT SERVICE] Error fetching payment history, using mock data:', error);
      return this.localPaymentHistory;
    }
  }

  /**
   * Get payment pricing for different listing types
   */
  static getPaymentPricing(): Record<string, { amount: number; features: string[] }> {
    return {
      basic: {
        amount: 200,
        features: [
          '30 days listing duration',
          'Basic job visibility',
          'Standard applicant filtering',
          'Email notifications'
        ]
      },
      premium: {
        amount: 500,
        features: [
          '60 days listing duration',
          'Enhanced job visibility',
          'Priority in search results',
          'Advanced applicant filtering',
          'SMS and email notifications',
          'Application analytics'
        ]
      },
      featured: {
        amount: 750,
        features: [
          '90 days listing duration',
          'Maximum job visibility',
          'Top position in search results',
          'Highlighted job posting',
          'Premium applicant filtering',
          'SMS and email notifications',
          'Detailed application analytics',
          'Dedicated support'
        ]
      }
    };
  }

  /**
   * Get supported payment methods for Ethiopia
   */
  static getPaymentMethods(): Array<{ id: string; name: string; available: boolean }> {
    return [
      {
        id: 'telebirr',
        name: 'Telebirr',
        available: true
      },
      {
        id: 'cbe_birr',
        name: 'CBE Birr',
        available: true
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        available: true
      },
      {
        id: 'mobile_banking',
        name: 'Mobile Banking',
        available: true
      }
    ];
  }

  /**
   * Format Ethiopian currency
   */
  static formatCurrency(amount: number, currency: string = 'ETB'): string {
    return `${amount.toLocaleString('en-ET')} ${currency}`;
  }

  /**
   * Initialize payment service
   */
  static async initialize(): Promise<void> {
    await this.checkBackendAvailability();
    console.log('✅ [PAYMENT SERVICE] Payment service initialized');
  }
}

export default PaymentService;


