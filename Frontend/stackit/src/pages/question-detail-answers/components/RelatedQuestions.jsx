import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedQuestions = ({ questions, onQuestionClick }) => {
  const formatStats = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getTimeSince = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return `${Math.floor(diffInDays / 7)}w`;
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="HelpCircle" size={18} className="text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">Related Questions</h3>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="group cursor-pointer"
            onClick={() => onQuestionClick?.(question)}
          >
            <div className="p-3 rounded-lg hover:bg-muted/50 transition-colors duration-150">
              {/* Question Title */}
              <h4 className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors duration-150 line-clamp-2 mb-2">
                {question.title}
              </h4>

              {/* Question Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="MessageSquare" size={12} />
                    <span>{question.answerCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="ChevronUp" size={12} />
                    <span>{formatStats(question.votes)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Eye" size={12} />
                    <span>{formatStats(question.views)}</span>
                  </div>
                </div>
                <span>{getTimeSince(question.createdAt)}</span>
              </div>

              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {question.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                  {question.tags.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{question.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="mt-4 pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={() => window.location.href = '/questions-dashboard'}
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={14}
        >
          Browse more questions
        </Button>
      </div>
    </div>
  );
};

export default RelatedQuestions;