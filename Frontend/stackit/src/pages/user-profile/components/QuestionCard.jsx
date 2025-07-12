import React from 'react';
import Icon from '../../../components/AppIcon';


const QuestionCard = ({ question, onQuestionClick }) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const questionDate = new Date(date);
    const diffInHours = Math.floor((now - questionDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return questionDate.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'text-success';
      case 'accepted': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered': return 'MessageCircle';
      case 'accepted': return 'CheckCircle';
      default: return 'Clock';
    }
  };

  return (
    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <h3 
          className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer line-clamp-2"
          onClick={() => onQuestionClick(question.id)}
        >
          {question.title}
        </h3>
        <div className={`flex items-center space-x-1 ${getStatusColor(question.status)}`}>
          <Icon name={getStatusIcon(question.status)} size={16} />
          <span className="text-sm capitalize">{question.status}</span>
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {question.excerpt}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors duration-150"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="ThumbsUp" size={14} />
            <span>{question.votes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MessageCircle" size={14} />
            <span>{question.answerCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Eye" size={14} />
            <span>{question.views}</span>
          </div>
        </div>
        <span>{formatTimeAgo(question.createdAt)}</span>
      </div>
    </div>
  );
};

export default QuestionCard;