/**
 * Mock Data for HireHub Employer Connect Mobile
 * This file contains sample data for development and testing
 * TODO: Remove when integrating with Node.js backend
 */

// User/Employer Types
export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  firstName?: string;
  lastName?: string;
  profileType?: 'individual' | 'company';
  verified: boolean;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  companyName?: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyDescription?: string;
}

// Job Types
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salary: string;
  category: string;
  location: string;
  expiryDate: string;
  listingType: string;
  employmentType?: string;
  status: 'active' | 'expired' | 'pending';
  employerId: string;
  applicationsCount: number;
  createdAt: string;
  views?: number;
}

// Application Types
export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  coverLetter: string;
  resume?: string;
  appliedAt: string;
  updatedAt?: string;
}

// Payment Types
export interface PaymentHistory {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  description: string;
  createdAt: string;
  jobTitle?: string;
  paymentMethod?: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'application' | 'payment' | 'job' | 'system';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  jobTitle: string;
}

// Mock Current User
export const mockCurrentUser: User = {
  id: 'employer_001',
  email: 'employer@hirehub.et',
  role: 'employer',
  name: 'Abebe Technologies',
  firstName: 'Abebe',
  lastName: 'Kebede',
  profileType: 'company',
  verified: true,
  phone: '+251911234567',
  companyName: 'Abebe Technologies',
  companyWebsite: 'https://abebetech.et',
  companyDescription: 'Leading software development company in Ethiopia, specializing in innovative tech solutions.',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
};

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: 'job_001',
    title: 'Senior Software Developer',
    description: 'We are looking for an experienced software developer to join our team. The ideal candidate will have strong skills in React, Node.js, and cloud technologies.',
    requirements: '5+ years of experience in software development\nStrong knowledge of React and Node.js\nExperience with AWS or Azure\nBachelor\'s degree in Computer Science',
    salary: '50000-80000 ETB',
    category: 'Technology',
    location: 'Addis Ababa',
    expiryDate: '2024-12-31',
    listingType: 'premium',
    employmentType: 'full_time',
    status: 'active',
    employerId: 'employer_001',
    applicationsCount: 15,
    views: 245,
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'job_002',
    title: 'Marketing Manager',
    description: 'Seeking a creative marketing manager to lead our digital marketing initiatives and brand strategy.',
    requirements: '3+ years in marketing management\nDigital marketing expertise\nStrong communication skills\nExperience with social media marketing',
    salary: '35000-55000 ETB',
    category: 'Marketing',
    location: 'Addis Ababa',
    expiryDate: '2024-11-30',
    listingType: 'basic',
    employmentType: 'full_time',
    status: 'active',
    employerId: 'employer_001',
    applicationsCount: 8,
    views: 156,
    createdAt: '2024-01-05T10:00:00Z'
  },
  {
    id: 'job_003',
    title: 'Frontend Developer',
    description: 'Join our growing team as a frontend developer. You will work on exciting projects using modern technologies.',
    requirements: 'Strong React/React Native skills\n2+ years experience\nUI/UX design understanding\nGit proficiency',
    salary: '30000-45000 ETB',
    category: 'Technology',
    location: 'Dire Dawa',
    expiryDate: '2024-10-31',
    listingType: 'featured',
    employmentType: 'full_time',
    status: 'active',
    employerId: 'employer_001',
    applicationsCount: 22,
    views: 387,
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: 'job_004',
    title: 'Sales Representative',
    description: 'Looking for motivated sales professionals to expand our customer base in the region.',
    requirements: '1+ years sales experience\nExcellent communication\nCustomer-focused mindset\nWillingness to travel',
    salary: '20000-35000 ETB + Commission',
    category: 'Sales',
    location: 'Mekelle',
    expiryDate: '2024-09-30',
    listingType: 'free',
    employmentType: 'full_time',
    status: 'active',
    employerId: 'employer_001',
    applicationsCount: 5,
    views: 98,
    createdAt: '2023-12-28T11:00:00Z'
  },
  {
    id: 'job_005',
    title: 'DevOps Engineer',
    description: 'Experienced DevOps engineer needed to manage our cloud infrastructure and CI/CD pipelines.',
    requirements: '4+ years DevOps experience\nKubernetes and Docker expertise\nAWS/Azure knowledge\nAutomation skills',
    salary: '55000-75000 ETB',
    category: 'Technology',
    location: 'Addis Ababa',
    expiryDate: '2023-12-15',
    listingType: 'premium',
    employmentType: 'full_time',
    status: 'expired',
    employerId: 'employer_001',
    applicationsCount: 12,
    views: 203,
    createdAt: '2023-11-01T08:00:00Z'
  }
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: 'app_001',
    jobId: 'job_001',
    jobTitle: 'Senior Software Developer',
    applicantId: 'applicant_001',
    applicantName: 'Tigist Alemu',
    applicantEmail: 'tigist@email.com',
    applicantPhone: '+251912345678',
    status: 'pending',
    coverLetter: 'I am excited to apply for this position. I have 6 years of experience in full-stack development...',
    resume: 'https://example.com/resume.pdf',
    appliedAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z'
  },
  {
    id: 'app_002',
    jobId: 'job_001',
    jobTitle: 'Senior Software Developer',
    applicantId: 'applicant_002',
    applicantName: 'Yohannes Haile',
    applicantEmail: 'yohannes@email.com',
    applicantPhone: '+251913456789',
    status: 'shortlisted',
    coverLetter: 'With 7 years of experience in software development and a strong background in React...',
    resume: 'https://example.com/resume2.pdf',
    appliedAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'app_003',
    jobId: 'job_002',
    jobTitle: 'Marketing Manager',
    applicantId: 'applicant_003',
    applicantName: 'Sara Tesfaye',
    applicantEmail: 'sara@email.com',
    applicantPhone: '+251914567890',
    status: 'accepted',
    coverLetter: 'I am passionate about digital marketing and have successfully led campaigns for major brands...',
    resume: 'https://example.com/resume3.pdf',
    appliedAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-17T15:30:00Z'
  },
  {
    id: 'app_004',
    jobId: 'job_003',
    jobTitle: 'Frontend Developer',
    applicantId: 'applicant_004',
    applicantName: 'Daniel Woldemariam',
    applicantEmail: 'daniel@email.com',
    status: 'rejected',
    coverLetter: 'I have been working with React for 3 years and love creating beautiful user interfaces...',
    appliedAt: '2024-01-10T08:45:00Z',
    updatedAt: '2024-01-13T09:00:00Z'
  },
  {
    id: 'app_005',
    jobId: 'job_003',
    jobTitle: 'Frontend Developer',
    applicantId: 'applicant_005',
    applicantName: 'Meron Bekele',
    applicantEmail: 'meron@email.com',
    applicantPhone: '+251915678901',
    status: 'pending',
    coverLetter: 'I am a creative developer with expertise in React Native and modern web technologies...',
    resume: 'https://example.com/resume5.pdf',
    appliedAt: '2024-01-16T13:20:00Z',
    updatedAt: '2024-01-16T13:20:00Z'
  },
  {
    id: 'app_006',
    jobId: 'job_002',
    jobTitle: 'Marketing Manager',
    applicantId: 'applicant_006',
    applicantName: 'Biniam Hailu',
    applicantEmail: 'biniam@email.com',
    status: 'shortlisted',
    coverLetter: 'With a proven track record in B2B marketing and brand development...',
    appliedAt: '2024-01-11T16:30:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  }
];

// Mock Payment History
export const mockPaymentHistory: PaymentHistory[] = [
  {
    id: 'pay_001',
    reference: 'REF_1705234567890',
    amount: 500,
    currency: 'ETB',
    status: 'success',
    description: 'Premium job listing - Senior Software Developer',
    createdAt: '2024-01-10T08:00:00Z',
    jobTitle: 'Senior Software Developer',
    paymentMethod: 'Telebirr'
  },
  {
    id: 'pay_002',
    reference: 'REF_1704134567890',
    amount: 200,
    currency: 'ETB',
    status: 'success',
    description: 'Basic job listing - Marketing Manager',
    createdAt: '2024-01-05T10:00:00Z',
    jobTitle: 'Marketing Manager',
    paymentMethod: 'CBE Birr'
  },
  {
    id: 'pay_003',
    reference: 'REF_1704034567890',
    amount: 750,
    currency: 'ETB',
    status: 'success',
    description: 'Featured job listing - Frontend Developer',
    createdAt: '2024-01-01T09:00:00Z',
    jobTitle: 'Frontend Developer',
    paymentMethod: 'Telebirr'
  },
  {
    id: 'pay_004',
    reference: 'REF_1703534567890',
    amount: 500,
    currency: 'ETB',
    status: 'pending',
    description: 'Premium job listing - DevOps Engineer',
    createdAt: '2023-11-01T08:00:00Z',
    jobTitle: 'DevOps Engineer',
    paymentMethod: 'Bank Transfer'
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    title: 'New Application Received',
    message: 'Meron Bekele applied for Frontend Developer position',
    type: 'application',
    read: false,
    createdAt: '2024-01-16T13:20:00Z',
    actionUrl: '/applications'
  },
  {
    id: 'notif_002',
    title: 'Application Status Changed',
    message: 'Sara Tesfaye\'s application was accepted for Marketing Manager',
    type: 'application',
    read: false,
    createdAt: '2024-01-17T15:30:00Z',
    actionUrl: '/applications'
  },
  {
    id: 'notif_003',
    title: 'Payment Successful',
    message: 'Your payment of 500 ETB for Senior Software Developer listing was successful',
    type: 'payment',
    read: true,
    createdAt: '2024-01-10T08:05:00Z',
    actionUrl: '/payments'
  },
  {
    id: 'notif_004',
    title: 'Job Expiring Soon',
    message: 'Your job posting "Marketing Manager" will expire in 7 days',
    type: 'job',
    read: true,
    createdAt: '2024-01-08T10:00:00Z',
    actionUrl: '/jobs'
  },
  {
    id: 'notif_005',
    title: 'New Message',
    message: 'Tigist Alemu sent you a message about Senior Software Developer',
    type: 'application',
    read: false,
    createdAt: '2024-01-15T14:45:00Z',
    actionUrl: '/chat'
  }
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv_001',
    applicantId: 'applicant_001',
    applicantName: 'Tigist Alemu',
    lastMessage: 'Thank you for considering my application. I would love to discuss the role further.',
    lastMessageTime: '2024-01-15T14:45:00Z',
    unreadCount: 2,
    jobTitle: 'Senior Software Developer'
  },
  {
    id: 'conv_002',
    applicantId: 'applicant_002',
    applicantName: 'Yohannes Haile',
    lastMessage: 'I am available for an interview any time next week.',
    lastMessageTime: '2024-01-16T09:30:00Z',
    unreadCount: 1,
    jobTitle: 'Senior Software Developer'
  },
  {
    id: 'conv_003',
    applicantId: 'applicant_003',
    applicantName: 'Sara Tesfaye',
    lastMessage: 'Thank you! I\'m excited to join the team.',
    lastMessageTime: '2024-01-17T16:00:00Z',
    unreadCount: 0,
    jobTitle: 'Marketing Manager'
  }
];

// Mock Chat Messages
export const mockChatMessages: Record<string, ChatMessage[]> = {
  conv_001: [
    {
      id: 'msg_001',
      conversationId: 'conv_001',
      senderId: 'applicant_001',
      senderName: 'Tigist Alemu',
      message: 'Hello! I just applied for the Senior Software Developer position.',
      timestamp: '2024-01-15T14:30:00Z',
      read: true
    },
    {
      id: 'msg_002',
      conversationId: 'conv_001',
      senderId: 'employer_001',
      senderName: 'Abebe Technologies',
      message: 'Thank you for your application! We will review it and get back to you soon.',
      timestamp: '2024-01-15T14:35:00Z',
      read: true
    },
    {
      id: 'msg_003',
      conversationId: 'conv_001',
      senderId: 'applicant_001',
      senderName: 'Tigist Alemu',
      message: 'Thank you for considering my application. I would love to discuss the role further.',
      timestamp: '2024-01-15T14:45:00Z',
      read: false
    }
  ],
  conv_002: [
    {
      id: 'msg_004',
      conversationId: 'conv_002',
      senderId: 'employer_001',
      senderName: 'Abebe Technologies',
      message: 'Hi Yohannes, we would like to schedule an interview with you.',
      timestamp: '2024-01-16T09:00:00Z',
      read: true
    },
    {
      id: 'msg_005',
      conversationId: 'conv_002',
      senderId: 'applicant_002',
      senderName: 'Yohannes Haile',
      message: 'I am available for an interview any time next week.',
      timestamp: '2024-01-16T09:30:00Z',
      read: false
    }
  ]
};

// Dashboard Statistics
export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  totalViews: number;
  recentActivity: Array<{
    id: string;
    type: 'application' | 'job' | 'payment';
    message: string;
    timestamp: string;
  }>;
}

export const mockDashboardStats: DashboardStats = {
  totalJobs: 5,
  activeJobs: 4,
  totalApplications: 62,
  pendingApplications: 15,
  acceptedApplications: 8,
  totalViews: 1089,
  recentActivity: [
    {
      id: '1',
      type: 'application',
      message: 'New application from Meron Bekele for Frontend Developer',
      timestamp: '2024-01-16T13:20:00Z'
    },
    {
      id: '2',
      type: 'application',
      message: 'Sara Tesfaye\'s application was accepted',
      timestamp: '2024-01-17T15:30:00Z'
    },
    {
      id: '3',
      type: 'job',
      message: 'Senior Software Developer job is performing well (245 views)',
      timestamp: '2024-01-15T10:00:00Z'
    },
    {
      id: '4',
      type: 'payment',
      message: 'Payment successful for Premium listing',
      timestamp: '2024-01-10T08:05:00Z'
    }
  ]
};

export default {
  mockCurrentUser,
  mockJobs,
  mockApplications,
  mockPaymentHistory,
  mockNotifications,
  mockConversations,
  mockChatMessages,
  mockDashboardStats
};


