import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';


const QuestionCard = ({ question, onQuestionClick, onTagClick, onUserClick }) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getVoteColor = (score) => {
    if (score > 0) return 'text-success';
    if (score < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getAnswerBadgeColor = (count, hasAccepted) => {
    if (hasAccepted) return 'bg-success text-success-foreground';
    if (count > 0) return 'bg-primary text-primary-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div onClick={() => onQuestionClick(question.id)} className="space-y-3">
        {/* Header with vote score and answer count */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center space-y-1">
              <div className={`text-sm font-medium ${getVoteColor(question.voteScore)}`}>
                {question.voteScore > 0 ? '+' : ''}{question.voteScore}
              </div>
              <div className="text-xs text-muted-foreground">votes</div>
            </div>
            
            <div className="flex flex-col items-center space-y-1">
              <div className={`px-2 py-1 rounded text-xs font-medium ${getAnswerBadgeColor(question.answerCount, question.hasAcceptedAnswer)}`}>
                {question.answerCount}
              </div>
              <div className="text-xs text-muted-foreground">answers</div>
            </div>
          </div>

          {question.hasAcceptedAnswer && (
            <div className="flex items-center space-x-1 text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="text-xs font-medium">Solved</span>
            </div>
          )}
        </div>

        {/* Question title */}
        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {question.title}
        </h3>

        {/* Question description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {question.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag);
              }}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors duration-150"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Footer with author and timestamp */}
        <div className="flex items-center justify-between pt-2 border-t">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUserClick(question.author.id);
            }}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-150"
          >
            <Image
              src={question.author.avatar}
              alt={question.author.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-left">
              <div className="text-xs font-medium text-card-foreground">
                {question.author.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {question.author.reputation} rep
              </div>
            </div>
          </button>

          <div className="text-xs text-muted-foreground">
            {formatTimeAgo(question.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;