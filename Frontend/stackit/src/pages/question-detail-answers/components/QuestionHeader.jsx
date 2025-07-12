import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const QuestionHeader = ({
  question,
  onVote,
  onBookmark,
  onShare,
  onFollow,
  currentUser,
}) => {
  const [isFollowing, setIsFollowing] = useState(question.isFollowing || false);
  const [isBookmarked, setIsBookmarked] = useState(
    question.isBookmarked || false
  );

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow?.(question.id, !isFollowing);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(question.id, !isBookmarked);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeSince = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(date);
  };

  // Handle potential missing avatar
  const getAvatarSrc = () => {
    if (question.author.avatar) return question.author.avatar;
    if (question.author.avatarUrl) return question.author.avatarUrl;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      question.author.name || question.author.displayName
    )}&background=6366f1&color=ffffff`;
  };

  const getAuthorName = () => {
    return (
      question.author.name ||
      question.author.displayName ||
      question.author.username
    );
  };

  const getAuthorTitle = () => {
    return question.author.title || question.author.role || "Member";
  };

  const getAuthorReputation = () => {
    return question.author.reputation || question.author.reputationScore || 0;
  };

  return (
    <div className="bg-card border rounded-lg p-6 mb-6">
      {/* Question Title */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-card-foreground leading-tight">
          {question.title}
        </h1>
      </div>

      {/* Question Meta Info */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={14} />
          <span>Asked {getTimeSince(question.createdAt)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Eye" size={14} />
          <span>{question.views.toLocaleString()} views</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="MessageSquare" size={14} />
          <span>{question.answerCount} answers</span>
        </div>
        {question.lastActivity && (
          <div className="flex items-center space-x-1">
            <Icon name="Activity" size={14} />
            <span>Active {getTimeSince(question.lastActivity)}</span>
          </div>
        )}
        {question.hasAcceptedAnswer && (
          <div className="flex items-center space-x-1 text-success">
            <Icon name="CheckCircle" size={14} />
            <span>Has accepted answer</span>
          </div>
        )}
      </div>

      {/* Question Content */}
      <div className="prose prose-sm md:prose-base max-w-none mb-6">
        <div
          className="text-card-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question.content }}
        />
      </div>

      {/* Question Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-150 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Question Status Indicators */}
      <div className="flex flex-wrap gap-2 mb-6">
        {question.isClosed && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-destructive/10 text-destructive">
            <Icon name="Lock" size={12} className="mr-1" />
            Closed
          </span>
        )}
        {question.hasAcceptedAnswer && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">
            <Icon name="CheckCircle" size={12} className="mr-1" />
            Answered
          </span>
        )}
        {!question.isActive && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
            <Icon name="Archive" size={12} className="mr-1" />
            Inactive
          </span>
        )}
      </div>

      {/* Question Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Vote and Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Vote Controls */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVote?.(question.id, "up")}
              className={`h-8 w-8 ${
                question.userVote === "up" ? "text-success bg-success/10" : ""
              }`}
              disabled={question.isClosed}
            >
              <Icon name="ChevronUp" size={16} />
            </Button>
            <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
              {question.votes}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVote?.(question.id, "down")}
              className={`h-8 w-8 ${
                question.userVote === "down"
                  ? "text-destructive bg-destructive/10"
                  : ""
              }`}
              disabled={question.isClosed}
            >
              <Icon name="ChevronDown" size={16} />
            </Button>
          </div>

          {/* Bookmark Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={isBookmarked ? "text-warning" : ""}
          >
            <Icon name={isBookmarked ? "Bookmark" : "BookmarkPlus"} size={16} />
          </Button>

          {/* Follow Button */}
          {currentUser && (
            <Button
              variant={isFollowing ? "default" : "outline"}
              size="sm"
              onClick={handleFollow}
              iconName={isFollowing ? "UserCheck" : "UserPlus"}
              iconPosition="left"
              iconSize={14}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}

          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare?.(question)}
            iconName="Share2"
            iconSize={16}
          />
        </div>

        {/* Author Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Asked by</p>
            <div className="flex items-center space-x-1">
              <p className="text-sm font-medium text-card-foreground">
                {getAuthorName()}
              </p>
              {question.author.username && (
                <p className="text-xs text-muted-foreground">
                  @{question.author.username}
                </p>
              )}
            </div>
          </div>
          <div className="relative">
            <Image
              src={getAvatarSrc()}
              alt={getAuthorName()}
              className="w-10 h-10 rounded-full object-cover border-2 border-border"
            />
            {question.author.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-primary">
                {getAuthorReputation()}
              </span>
              <Icon
                name="Star"
                size={12}
                className="text-warning fill-current"
              />
            </div>
            <p className="text-xs text-muted-foreground">{getAuthorTitle()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
