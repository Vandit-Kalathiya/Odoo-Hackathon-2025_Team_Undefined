import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import CommentSection from './CommentSection';

const AnswerCard = ({ answer, onVote, onAccept, onComment, canAccept, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return posted.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAccept = () => {
    onAccept?.(answer.id);
  };

  const truncateContent = (content, maxLength = 500) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const displayContent = isExpanded ? answer.content : truncateContent(answer.content);
  const needsTruncation = answer.content.length > 500;

  return (
    <div className={`bg-card border rounded-lg p-6 transition-all duration-300 ${
      answer.isAccepted ? 'border-success bg-success/5' : ''
    }`}>
      {/* Accepted Answer Badge */}
      {answer.isAccepted && (
        <div className="flex items-center space-x-2 mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <span className="text-sm font-medium text-success">Accepted Answer</span>
        </div>
      )}

      {/* Answer Content */}
      <div className="mb-6">
        <div 
          className="prose prose-sm md:prose-base max-w-none text-card-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
        
        {needsTruncation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-primary"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        )}
      </div>

      {/* Answer Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Vote and Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Vote Controls */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVote?.(answer.id, 'up')}
              className={`h-8 w-8 ${answer.userVote === 'up' ? 'text-success bg-success/10' : ''}`}
            >
              <Icon name="ChevronUp" size={16} />
            </Button>
            <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
              {answer.votes}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVote?.(answer.id, 'down')}
              className={`h-8 w-8 ${answer.userVote === 'down' ? 'text-destructive bg-destructive/10' : ''}`}
            >
              <Icon name="ChevronDown" size={16} />
            </Button>
          </div>

          {/* Accept Answer Button */}
          {canAccept && !answer.isAccepted && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAccept}
              iconName="Check"
              iconPosition="left"
              iconSize={14}
              className="text-success border-success hover:bg-success hover:text-white"
            >
              Accept
            </Button>
          )}

          {/* Comment Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={14}
          >
            {answer.commentCount > 0 ? `${answer.commentCount} comments` : 'Comment'}
          </Button>

          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Share2"
            iconSize={16}
          />
        </div>

        {/* Author Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {answer.isEdited ? `Edited ${formatDate(answer.editedAt)}` : `Answered ${formatDate(answer.createdAt)}`}
            </p>
            <p className="text-sm font-medium text-card-foreground">{answer.author.name}</p>
          </div>
          <div className="relative">
            <Image
              src={answer.author.avatar}
              alt={answer.author.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-border"
            />
            {answer.author.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-primary">{answer.author.reputation}</span>
              <Icon name="Star" size={12} className="text-warning fill-current" />
            </div>
            <p className="text-xs text-muted-foreground">{answer.author.title}</p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-6 pt-6 border-t">
          <CommentSection
            answerId={answer.id}
            comments={answer.comments || []}
            onComment={onComment}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
};

export default AnswerCard;