import React from 'react';
import Icon from '../../../components/AppIcon';


const AnswerCard = ({ answer, onQuestionClick }) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const answerDate = new Date(date);
    const diffInHours = Math.floor((now - answerDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return answerDate.toLocaleDateString();
  };

  return (
    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 
            className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer line-clamp-2 mb-2"
            onClick={() => onQuestionClick(answer.questionId)}
          >
            {answer.questionTitle}
          </h3>
          {answer.isAccepted && (
            <div className="flex items-center space-x-1 text-success mb-2">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm font-medium">Accepted Answer</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="ThumbsUp" size={14} />
            <span className="text-sm">{answer?.votes}</span>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 border-l-4 border-primary/30 pl-4 py-2 mb-4">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {answer.excerpt}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {answer.tags.map((tag) => (
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
            <Icon name="MessageCircle" size={14} />
            <span>{answer.commentCount} comments</span>
          </div>
          {answer.isAccepted && (
            <div className="flex items-center space-x-1 text-success">
              <Icon name="Award" size={14} />
              <span>+15 rep</span>
            </div>
          )}
        </div>
        <span>Answered {formatTimeAgo(answer.createdAt)}</span>
      </div>
    </div>
  );
};

export default AnswerCard;