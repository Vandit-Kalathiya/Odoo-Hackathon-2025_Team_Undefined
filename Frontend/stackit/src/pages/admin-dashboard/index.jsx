import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricsCard from './components/MetricsCard';
import ActivityTable from './components/ActivityTable';
import ModerationQueue from './components/ModerationQueue';
import UserManagement from './components/UserManagement';
import PlatformMessaging from './components/PlatformMessaging';
import SystemHealth from './components/SystemHealth';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const platformMetrics = [
    {
      title: 'Total Users',
      value: '1,247',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Active Questions',
      value: '3,456',
      change: '+8.2%',
      changeType: 'positive',
      icon: 'MessageSquare',
      color: 'success'
    },
    {
      title: 'Total Answers',
      value: '12,890',
      change: '+15.3%',
      changeType: 'positive',
      icon: 'MessageCircle',
      color: 'success'
    },
    {
      title: 'Flagged Content',
      value: '23',
      change: '-5.2%',
      changeType: 'negative',
      icon: 'Flag',
      color: 'warning'
    },
    {
      title: 'User Reports',
      value: '8',
      change: '-12.1%',
      changeType: 'negative',
      icon: 'AlertTriangle',
      color: 'destructive'
    },
    {
      title: 'System Uptime',
      value: '99.98%',
      change: '+0.02%',
      changeType: 'positive',
      icon: 'Activity',
      color: 'success'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'users', label: 'User Management', icon: 'Users' },
    { id: 'content', label: 'Content Moderation', icon: 'Shield' },
    { id: 'messaging', label: 'Platform Messaging', icon: 'Send' },
    { id: 'system', label: 'System Health', icon: 'Activity' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformMetrics.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  changeType={metric.changeType}
                  icon={metric.icon}
                  color={metric.color}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <ActivityTable />
              </div>
              <div>
                <ModerationQueue />
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'content':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="xl:col-span-2">
              <ActivityTable />
            </div>
            <div className="xl:col-span-2">
              <ModerationQueue />
            </div>
          </div>
        );
      case 'messaging':
        return <PlatformMessaging />;
      case 'system':
        return <SystemHealth />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive platform oversight and content moderation
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" iconName="Download" iconPosition="left" iconSize={16}>
                Export Report
              </Button>
              <Button variant="outline" iconName="RefreshCw" iconPosition="left" iconSize={16}>
                Refresh Data
              </Button>
              <Button iconName="Settings" iconPosition="left" iconSize={16}>
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Warning Banner */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={20} className="text-warning flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-warning mb-1">Administrator Access</h3>
              <p className="text-sm text-muted-foreground">
                You have administrative privileges. All actions are logged and monitored for security purposes.
              </p>
            </div>
            <Button variant="ghost" size="sm" iconName="X" iconSize={16} />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {renderTabContent()}
        </div>
      </div>

      {/* Quick Action Floating Button for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <div className="relative">
          <Button
            variant="default"
            size="lg"
            iconName="Shield"
            iconSize={20}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;