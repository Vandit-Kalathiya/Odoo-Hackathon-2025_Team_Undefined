import React from 'react';
import Icon from '../../../components/AppIcon';

const BadgeCard = ({ badge }) => {
  const getBadgeColor = (type) => {
    switch (type) {
      case 'gold': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'silver': return 'text-gray-500 bg-gray-50 border-gray-200';
      case 'bronze': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getBadgeIcon = (category) => {
    switch (category) {
      case 'participation': return 'Users';
      case 'moderation': return 'Shield';
      case 'editing': return 'Edit';
      case 'question': return 'MessageSquare';
      case 'answer': return 'MessageCircle';
      case 'tag': return 'Tag';
      default: return 'Award';
    }
  };

  const formatEarnedDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className={`border rounded-lg p-4 ${getBadgeColor(badge.type)} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getBadgeColor(badge.type)}`}>
            <Icon name={getBadgeIcon(badge.category)} size={24} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-foreground">{badge.name}</h3>
            {badge.count > 1 && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                ×{badge.count}
              </span>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {badge.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Earned {formatEarnedDate(badge.earnedAt)}</span>
            <span className="capitalize">{badge.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeCard;