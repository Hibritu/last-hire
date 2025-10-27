import { apiWrapper, paymentApiClient, checkBackendAvailability, API_CONFIG } from '../lib/api';

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

export interface PaymentHistory {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  description: string;
  createdAt: string;
  jobTitle?: string;
}

/**
 * Payment Service for Employer Connect Pro
 * Handles Ethiopian payment processing (Telebirr, CBE Birr) with backend integration
 */
export class PaymentService {
  private static isBackendAvailable = true;

  /**
   * Check backend availability
   */
  static async checkBackendAvailability(): Promise<void> {
    try {
      this.isBackendAvailable = await checkBackendAvailability(API_CONFIG.PAYMENT_BASE_URL);
      if (this.isBackendAvailable) {
        console.log('✅ [PAYMENT SERVICE] Payment backend is available');
      } else {
        console.warn('⚠️ [PAYMENT SERVICE] Payment backend unavailable, using mock payments');
      }
    } catch (error) {
      console.warn('⚠️ [PAYMENT SERVICE] Payment backend unavailable, using mock payments');
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
          returnUrl: `${window.location.origin}/payments/return`,
          cancelUrl: `${window.location.origin}/payments/cancel`
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
          amount: 500, // Mock amount
          currency: 'ETB'
        };
        
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
        
        // Mock payment history
        const mockHistory: PaymentHistory[] = [
          {
            id: '1',
            reference: 'REF_1701234567',
            amount: 500,
            currency: 'ETB',
            status: 'success',
            description: 'Premium job listing - Senior Software Developer',
            createdAt: '2024-01-15T10:30:00Z',
            jobTitle: 'Senior Software Developer'
          },
          {
            id: '2',
            reference: 'REF_1701234568',
            amount: 300,
            currency: 'ETB',
            status: 'success',
            description: 'Basic job listing - Marketing Manager',
            createdAt: '2024-01-10T14:20:00Z',
            jobTitle: 'Marketing Manager'
          },
          {
            id: '3',
            reference: 'REF_1701234569',
            amount: 750,
            currency: 'ETB',
            status: 'pending',
            description: 'Featured job listing - DevOps Engineer',
            createdAt: '2024-01-20T09:15:00Z',
            jobTitle: 'DevOps Engineer'
          }
        ];
        
        return mockHistory;
      }
    } catch (error) {
      console.error('❌ [PAYMENT SERVICE] Error fetching payment history, using mock data:', error);
      
      // Return empty array or basic mock data on error
      return [{
        id: 'error_mock',
        reference: 'ERROR_REF',
        amount: 0,
        currency: 'ETB',
        status: 'failed',
        description: 'Error loading payment history',
        createdAt: new Date().toISOString()
      }];
    }
  }

  /**
   * Get payment pricing for different listing types
   */
  static getPaymentPricing(): Record<string, { amount: number; features: string[] }> {
    return {
      basic: {
        amount: 200, // ETB
        features: [
          '30 days listing duration',
          'Basic job visibility',
          'Standard applicant filtering',
          'Email notifications'
        ]
      },
      premium: {
        amount: 500, // ETB
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
        amount: 750, // ETB
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
  static getPaymentMethods(): Array<{ id: string; name: string; logo: string; available: boolean }> {
    return [
      {
        id: 'telebirr',
        name: 'Telebirr',
        logo: '/api/placeholder/40/40',
        available: true
      },
      {
        id: 'cbe_birr',
        name: 'CBE Birr',
        logo: '/api/placeholder/40/40',
        available: true
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        logo: '/api/placeholder/40/40',
        available: true
      },
      {
        id: 'mobile_banking',
        name: 'Mobile Banking',
        logo: '/api/placeholder/40/40',
        available: true
      }
    ];
  }

  /**
   * Process payment redirect (called from return URL)
   */
  static async processPaymentReturn(paymentParams: URLSearchParams): Promise<boolean> {
    try {
      const reference = paymentParams.get('reference');
      const status = paymentParams.get('status');
      
      if (!reference) {
        throw new Error('Payment reference not found');
      }

      console.log('🔄 [PAYMENT SERVICE] Processing payment return for reference:', reference);

      if (status === 'success') {
        // Verify the payment with backend
        const verification = await this.verifyPayment(reference);
        
        if (verification.status === 'success') {
          console.log('✅ [PAYMENT SERVICE] Payment completed successfully');
          return true;
        } else {
          console.warn('⚠️ [PAYMENT SERVICE] Payment verification failed');
          return false;
        }
      } else {
        console.warn('⚠️ [PAYMENT SERVICE] Payment was not successful:', status);
        return false;
      }
    } catch (error) {
      console.error('❌ [PAYMENT SERVICE] Error processing payment return:', error);
      return false;
    }
  }

  /**
   * Format Ethiopian currency
   */
  static formatCurrency(amount: number, currency: string = 'ETB'): string {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
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