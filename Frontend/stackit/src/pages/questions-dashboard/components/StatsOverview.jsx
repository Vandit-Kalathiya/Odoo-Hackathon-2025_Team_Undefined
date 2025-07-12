import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Questions',
      value: stats.totalQuestions,
      icon: 'MessageSquare',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Answered',
      value: stats.answeredQuestions,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: 'Users',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      label: 'Today\'s Questions',
      value: stats.todayQuestions,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item) => (
        <div key={item.label} className="bg-card border rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <Icon name={item.icon} size={20} className={item.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-2xl font-bold text-card-foreground">
                {formatNumber(item.value)}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {item.label}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;