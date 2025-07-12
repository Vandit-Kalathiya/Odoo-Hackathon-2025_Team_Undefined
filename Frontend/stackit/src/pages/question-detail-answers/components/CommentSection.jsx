import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommentSection = ({ answerId, comments, onComment, currentUser }) => {
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInMinutes = Math.floor((now - posted) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      await onComment?.(answerId, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  return (
    <div className="space-y-4">
      {/* Existing Comments */}
      {displayedComments.length > 0 && (
        <div className="space-y-3">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Image
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-card-foreground">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                  {comment.author.reputation && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-primary">{comment.author.reputation}</span>
                      <Icon name="Star" size={10} className="text-warning fill-current" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-card-foreground leading-relaxed">
                  {comment.content}
                </p>
                
                {/* Comment Actions */}
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 px-2 text-xs"
                  >
                    <Icon name="ThumbsUp" size={12} className="mr-1" />
                    {comment.likes || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 px-2 text-xs"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show More Comments Button */}
      {hasMoreComments && !showAllComments && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllComments(true)}
          className="text-primary"
        >
          Show {comments.length - 3} more comments
        </Button>
      )}

      {/* Add Comment Form */}
      {currentUser && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex items-start space-x-3">
            <Image
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
                disabled={isSubmitting}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Use @username to mention someone
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => setNewComment('')}
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="xs"
                    disabled={!newComment.trim() || isSubmitting}
                    loading={isSubmitting}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Login Prompt for Guests */}
      {!currentUser && (
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Want to add a comment?
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/user-registration'}
          >
            Sign in to comment
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;