import React from "react";
import Icon from "../../../components/AppIcon";

const ActivityItem = ({ notification, onItemClick }) => {
  console.log(notification);
  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return activityDate.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "question":
        return "MessageSquare";
      case "answer":
        return "MessageCircle";
      case "vote_received":
        return "ThumbsUp";
      case "answer_accepted":
        return "CheckCircle";
      case "badge_earned":
        return "Award";
      case "comment":
        return "MessageSquare";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "question":
        return "text-primary";
      case "answer":
        return "text-success";
      case "vote_received":
        return "text-blue-500";
      case "answer_accepted":
        return "text-warning";
      case "badge_earned":
        return "text-purple-500";
      case "comment":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case "question":
        return (
          <>
            <b>Asked a question : </b> {activity.title}
          </>
        );
      case "QUESTION_ANSWERED":
        return (
          <>
            <b>Answered</b> : {activity.message}
          </>
        );
      case "VOTE_RECEIVED":
        return (
          <>
            <b>Received</b> {activity.voteCount} {activity.voteType} votes on "
            {activity.title}"
          </>
        );
      case "ANSWER_ACCEPTED":
        return (
          <>
            <b>Answer accepted : </b> {activity.message}
          </>
        );
      case "BADGE_EARNED":
        return (
          <>
            <b>Earned</b> the "{activity.badgeName}" badge
          </>
        );
      case "comment":
        return (
          <>
            <b>Commented on:</b> "{activity.title}"
          </>
        );
      default:
        return activity.description;
    }
  };


  return (
    <div
      className="flex items-start space-x-3 p-4 hover:bg-muted/30 rounded-lg transition-colors duration-150 cursor-pointer"
      onClick={() => onItemClick(notification)}
    >
      <div className={`flex-shrink-0 ${getActivityColor(notification.type)}`}>
        <Icon name={getActivityIcon(notification.type)} size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          {getActivityDescription(notification)}
        </p>

        {notification.reputation && (
          <div className="flex items-center space-x-1 mt-1">
            <span className="text-xs text-success">
              +{notification.reputation} reputation
            </span>
          </div>
        )}

        <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
          <span>{formatTimeAgo(notification.createdAt)}</span>
          {notification.tags && notification.tags.length > 0 && (
            <>
              <span>•</span>
              <div className="flex space-x-1">
                {notification.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted px-1 py-0.5 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {notification.tags.length > 2 && (
                  <span className="text-muted-foreground">
                    +{notification.tags.length - 2}
                  </span>
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
