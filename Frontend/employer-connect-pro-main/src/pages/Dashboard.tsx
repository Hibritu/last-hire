import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { PostJobPage } from "@/components/jobs/PostJobPage";
import { JobsPage } from "@/components/jobs/JobsPage";
import { ApplicationsPage } from "@/components/applications/ApplicationsPage";
import { ChatPage } from "@/components/chat/ChatPage";
import { NotificationsPage } from "@/components/notifications/NotificationsPage";
import { PaymentsPage } from "@/components/payments/PaymentsPage";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onTabChange={setActiveTab} />;
      case 'profile':
        return <ProfilePage />;
      case 'post-job':
        return <PostJobPage onTabChange={setActiveTab} />;
      case 'jobs':
        return <JobsPage />;
      case 'applications':
        return <ApplicationsPage onTabChange={setActiveTab} />;
      case 'chat':
        return <ChatPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'payments':
        return <PaymentsPage onTabChange={setActiveTab} />;
      default:
        return <DashboardOverview onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onTabChange={setActiveTab} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}