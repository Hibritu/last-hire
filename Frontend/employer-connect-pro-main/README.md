# Employer Connect Pro

A modern web application designed to facilitate connections between employers and job applicants. Built with React, TypeScript, and Tailwind CSS.

## Getting Started

To get started with development, follow these steps:

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd employer-connect-pro-main

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run build:dev` - Build the project in development mode
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Technologies Used

This project is built with modern web technologies:

- **React 18** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable UI components built on Radix UI
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

## Features

- **Dashboard** - Overview of jobs, applications, and analytics
- **Job Management** - Post, edit, and manage job listings
- **Applications** - Track and manage job applications
- **Chat System** - Real-time messaging between employers and candidates
- **Notifications** - Stay updated with important alerts
- **Payment Management** - Handle subscription and payment tracking
- **Profile Management** - Comprehensive user profile system

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── dashboard/      # Dashboard-specific components
│   ├── jobs/           # Job management components
│   ├── applications/   # Application management components
│   ├── chat/           # Chat system components
│   ├── notifications/  # Notification components
│   ├── payments/       # Payment management components
│   └── profile/        # Profile management components
├── pages/              # Top-level route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and mock data
└── main.tsx           # Application entry point
```

## Development

The application uses Vite for fast development with Hot Module Replacement (HMR). The development server will automatically reload when you make changes to the code.

## Building for Production

To build the application for production:

```sh
npm run build
```

This will create an optimized build in the `dist` directory.
