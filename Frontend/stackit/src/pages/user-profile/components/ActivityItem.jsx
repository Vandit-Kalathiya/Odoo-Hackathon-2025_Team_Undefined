import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityItem = ({ activity, onItemClick }) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return activityDate.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'question': return 'MessageSquare';
      case 'answer': return 'MessageCircle';
      case 'vote_received': return 'ThumbsUp';
      case 'answer_accepted': return 'CheckCircle';
      case 'badge_earned': return 'Award';
      case 'comment': return 'MessageSquare';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'question': return 'text-primary';
      case 'answer': return 'text-success';
      case 'vote_received': return 'text-blue-500';
      case 'answer_accepted': return 'text-warning';
      case 'badge_earned': return 'text-purple-500';
      case 'comment': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'question':
        return `Asked a question: "${activity.title}"`;
      case 'answer':
        return `Answered: "${activity.title}"`;
      case 'vote_received':
        return `Received ${activity.voteCount} ${activity.voteType} votes on "${activity.title}"`;
      case 'answer_accepted':
        return `Answer was accepted for: "${activity.title}"`;
      case 'badge_earned':
        return `Earned the "${activity.badgeName}" badge`;
      case 'comment':
        return `Commented on: "${activity.title}"`;
      default:
        return activity.description;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-muted/30 rounded-lg transition-colors duration-150 cursor-pointer"
         onClick={() => onItemClick(activity)}>
      <div className={`flex-shrink-0 ${getActivityColor(activity.type)}`}>
        <Icon name={getActivityIcon(activity.type)} size={18} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          {getActivityDescription(activity)}
        </p>
        
        {activity.reputation && (
          <div className="flex items-center space-x-1 mt-1">
            <span className="text-xs text-success">+{activity.reputation} reputation</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
          <span>{formatTimeAgo(activity.createdAt)}</span>
          {activity.tags && activity.tags.length > 0 && (
            <>
              <span>•</span>
              <div className="flex space-x-1">
                {activity.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="bg-muted px-1 py-0.5 rounded text-xs">
                    {tag}
                  </span>
                ))}
                {activity.tags.length > 2 && (
                  <span className="text-muted-foreground">+{activity.tags.length - 2}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
      </div>
    </div>
  );
};

export default ActivityItem;