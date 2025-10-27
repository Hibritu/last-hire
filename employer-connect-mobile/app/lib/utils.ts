/**
 * Utility function to merge class names
 * Simple implementation without external dependencies
 */
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('en-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

/**
 * Format Ethiopian currency
 */
export function formatCurrency(amount: number, currency: string = 'ETB'): string {
  return `${amount.toLocaleString('en-ET')} ${currency}`;
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Ethiopian phone number
 */
export function isValidEthiopianPhone(phone: string): boolean {
  const phoneRegex = /^\+251[97]\d{8}$/;
  return phoneRegex.test(phone);
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800',
    shortlisted: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

