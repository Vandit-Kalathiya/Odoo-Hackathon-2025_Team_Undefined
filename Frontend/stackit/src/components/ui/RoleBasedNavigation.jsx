import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleBasedNavigation = ({ user, className = '' }) => {
  const location = useLocation();

  // Only render for admin users
  if (!user || user.role !== 'admin') {
    return null;
  }

  const adminNavigationItems = [
    {
      label: 'Dashboard',
      path: '/admin-dashboard',
      icon: 'BarChart3',
      tooltip: 'Admin dashboard overview'
    },
    {
      label: 'Users',
      path: '/admin-dashboard?tab=users',
      icon: 'Users',
      tooltip: 'Manage users and permissions'
    },
    {
      label: 'Content',
      path: '/admin-dashboard?tab=content',
      icon: 'FileText',
      tooltip: 'Moderate questions and answers'
    },
    {
      label: 'Reports',
      path: '/admin-dashboard?tab=reports',
      icon: 'Flag',
      tooltip: 'Review reported content'
    },
    {
      label: 'Settings',
      path: '/admin-dashboard?tab=settings',
      icon: 'Settings',
      tooltip: 'Platform configuration'
    }
  ];

  const isActive = (path) => {
    if (path === '/admin-dashboard') {
      return location.pathname === path && !location.search;
    }
    return location.pathname === '/admin-dashboard' && location.search.includes(path.split('?tab=')[1]);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className={`bg-warning/5 border border-warning/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="Shield" size={16} className="text-warning" />
        <span className="text-sm font-medium text-warning">Admin Panel</span>
      </div>
      
      <nav className="space-y-1">
        {adminNavigationItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            size="sm"
            fullWidth
            onClick={() => handleNavigation(item.path)}
            iconName={item.icon}
            iconPosition="left"
            iconSize={14}
            className="justify-start h-8 text-xs"
            title={item.tooltip}
          >
            {item.label}
          </Button>
        ))}
      </nav>
      
      <div className="mt-3 pt-3 border-t border-warning/20">
        <p className="text-xs text-muted-foreground">
          Administrative functions are logged and monitored.
        </p>
      </div>
    </div>
  );
};

export default RoleBasedNavigation;