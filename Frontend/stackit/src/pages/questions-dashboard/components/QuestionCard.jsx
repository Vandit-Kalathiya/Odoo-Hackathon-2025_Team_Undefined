import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const QuestionCard = ({
  question,
  onQuestionClick,
  onTagClick,
  onUserClick,
}) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getVoteColor = (score) => {
    if (score > 0) return "text-success";
    if (score < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const getAnswerBadgeColor = (count, hasAccepted) => {
    if (hasAccepted) return "bg-success text-success-foreground";
    if (count > 0) return "bg-primary text-primary-foreground";
    return "bg-muted text-muted-foreground";
  };

  // Strip HTML tags from description for preview
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  console.log("QuestionCard rendered:", question);

  return (
    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div onClick={() => onQuestionClick(question.id)} className="space-y-3">
        {/* Header with view count and answer count */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* View Count */}
            <div className="flex flex-col items-center space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                {question.viewCount || 0}
              </div>
              <div className="text-xs text-muted-foreground">views</div>
            </div>

            {/* Answer Count */}
            <div className="flex flex-col items-center space-y-1">
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${getAnswerBadgeColor(
                  question.answerCount,
                  question.hasAcceptedAnswer
                )}`}
              >
                {question.answerCount || 0}
              </div>
              <div className="text-xs text-muted-foreground">answers</div>
            </div>

            {/* Score (if available) */}
            {question.score !== null && question.score !== undefined && (
              <div className="flex flex-col items-center space-y-1">
                <div
                  className={`text-sm font-medium ${getVoteColor(
                    question.score
                  )}`}
                >
                  {question.score > 0 ? "+" : ""}
                  {question.score}
                </div>
                <div className="text-xs text-muted-foreground">score</div>
              </div>
            )}
          </div>

          {/* Solved Badge */}
          {question.hasAcceptedAnswer && (
            <div className="flex items-center space-x-1 text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="text-xs font-medium">Solved</span>
            </div>
          )}

          {/* Closed Badge */}
          {question.isClosed && (
            <div className="flex items-center space-x-1 text-destructive">
              <Icon name="Lock" size={16} />
              <span className="text-xs font-medium">Closed</span>
            </div>
          )}
        </div>

        {/* Question title */}
        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {question.title}
        </h3>

        {/* Question description (stripped of HTML) */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {stripHtml(question.description)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {question.tags &&
            question.tags.map((tag) => (
              <button
                key={tag.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors duration-150"
                style={{
                  backgroundColor: `${tag.colorCode}20`, // 20% opacity
                  color: tag.colorCode,
                  border: `1px solid ${tag.colorCode}30`,
                }}
              >
                {tag.name}
              </button>
            ))}
        </div>

        {/* Footer with user and timestamp */}
        <div className="flex items-center justify-between pt-2 border-t">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUserClick(question.user.id);
            }}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-150"
          >
            <Image
              src={question?.user?.avatarUrl || "/default-avatar.png"}
              alt={question?.user?.username}
              className="w-6 h-6 rounded-full object-cover"
              fallback={
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {question?.user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              }
            />
            <div className="text-left">
              <div className="text-xs font-medium text-card-foreground">
                {question?.user?.displayName || question?.user?.username}
              </div>
              <div className="text-xs text-muted-foreground">
                {question?.user?.reputationScore || 0} rep
              </div>
            </div>
          </button>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {/* Question status indicators */}
            <div className="flex items-center space-x-1">
              {question.updatedAt !== question.createdAt && (
                <span className="text-primary">edited</span>
              )}
              <span>asked {formatTimeAgo(question.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
