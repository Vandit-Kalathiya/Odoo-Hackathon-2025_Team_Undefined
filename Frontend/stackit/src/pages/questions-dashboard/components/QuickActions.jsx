import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onAskQuestion, onRefresh, isRefreshing }) => {
  const quickActionItems = [
    {
      label: 'Ask Question',
      icon: 'Plus',
      variant: 'default',
      action: onAskQuestion,
      description: 'Share your question with the community'
    },
    {
      label: 'Browse Tags',
      icon: 'Tag',
      variant: 'outline',
      action: () => window.location.href = '/questions-dashboard?view=tags',
      description: 'Explore questions by topic'
    },
    {
      label: 'My Activity',
      icon: 'Activity',
      variant: 'outline',
      action: () => window.location.href = '/user-profile?tab=activity',
      description: 'View your questions and answers'
    }
  ];

  return (
    <div className="bg-card border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">Get started with common tasks</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 w-8"
        >
          <Icon 
            name="RotateCcw" 
            size={16} 
            className={isRefreshing ? 'animate-spin' : ''} 
          />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActionItems.map((item) => (
          <div key={item.label} className="space-y-2">
            <Button
              variant={item.variant}
              fullWidth
              onClick={item.action}
              iconName={item.icon}
              iconPosition="left"
              iconSize={16}
              className="h-12"
            >
              {item.label}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;