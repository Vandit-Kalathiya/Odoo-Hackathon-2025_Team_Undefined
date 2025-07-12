import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import CommentSection from "./CommentSection";
import { useQuestions } from "contexts/QuestionContext";
import { useAnswers } from "contexts/AnswerContext";

const AnswerCard = ({
  answer,
  onVote,
  onAccept,
  onComment,
  canAccept,
  currentUser,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getQuestionById } = useQuestions();

  // Fetch question data based on answer.questionId
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!answer?.questionId) return;

      try {
        setLoading(true);
        const questionData = await getQuestionById(answer.questionId);
        setQuestion(questionData);
      } catch (error) {
        console.error("Error fetching question for answer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [answer?.questionId, getQuestionById]);

  const formatDate = (date) => {
    if (!date) return "Unknown";

    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return posted.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAccept = () => {
    onAccept?.(answer.id);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.href}#answer-${answer.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Answer by ${getAuthorName()}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const truncateContent = (content, maxLength = 500) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Get author data from the fetched question OR fallback to answer data
  const getAuthorData = () => {
    // First try to get from fetched question (your preference)
    if (question?.user) {
      return question.user;
    }

    // Fallback to answer's author/user data
    return answer?.author || answer?.user || null;
  };

  const getAuthorName = () => {
    const authorData = getAuthorData();
    return (
      authorData?.displayName ||
      authorData?.name ||
      authorData?.username ||
      "Anonymous"
    );
  };

  const getAuthorUsername = () => {
    const authorData = getAuthorData();
    return authorData?.username;
  };

  const getAuthorAvatar = () => {
    const authorData = getAuthorData();
    const avatar = authorData?.avatarUrl || authorData?.avatar;

    if (avatar) return avatar;

    const name = getAuthorName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=6366f1&color=ffffff&size=150`;
  };

  const getAuthorReputation = () => {
    const authorData = getAuthorData();
    return authorData?.reputationScore || authorData?.reputation || 0;
  };

  const getAuthorTitle = () => {
    const authorData = getAuthorData();
    return authorData?.role || authorData?.title || "Member";
  };

  const getAuthorOnlineStatus = () => {
    const authorData = getAuthorData();
    return authorData?.isOnline || false;
  };

  const displayContent = isExpanded
    ? answer?.content || ""
    : truncateContent(answer?.content || "");
  const needsTruncation = (answer?.content || "").length > 500;

  return (
    <div
      className={`bg-card border rounded-lg p-6 transition-all duration-300 ${
        answer?.isAccepted ? "border-success bg-success/5" : ""
      }`}
      id={`answer-${answer?.id}`}
    >
      {/* Accepted Answer Badge */}
      {answer?.isAccepted && (
        <div className="flex items-center space-x-2 mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <span className="text-sm font-medium text-success">
            Accepted Answer
          </span>
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
            {isExpanded ? "Show less" : "Show more"}
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
              onClick={() => onVote?.(answer?.id, "up")}
              className={`h-8 w-8 ${
                answer?.userVote === "up" ? "text-success bg-success/10" : ""
              }`}
              title="Upvote this answer"
            >
              <Icon name="ChevronUp" size={16} />
            </Button>
            <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
              {answer?.votes || answer?.score || 0}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVote?.(answer?.id, "down")}
              className={`h-8 w-8 ${
                answer?.userVote === "down"
                  ? "text-destructive bg-destructive/10"
                  : ""
              }`}
              title="Downvote this answer"
            >
              <Icon name="ChevronDown" size={16} />
            </Button>
          </div>

          {/* Accept Answer Button */}
          {canAccept && !answer?.isAccepted && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAccept}
              iconName="Check"
              iconPosition="left"
              iconSize={14}
              className="text-success border-success hover:bg-success hover:text-white"
              title="Accept this answer as the solution"
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
            title="View or add comments"
          >
            {(answer?.commentCount || 0) > 0
              ? `${answer.commentCount} comments`
              : "Comment"}
          </Button>

          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Share2"
            iconSize={16}
            onClick={handleShare}
            title="Share this answer"
          />
        </div>

        {/* Author Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {answer?.isEdited || answer?.editedAt
                ? `Edited ${formatDate(answer?.editedAt)}`
                : `Answered ${formatDate(answer?.createdAt)}`}
            </p>
            <div className="flex items-center space-x-1">
              <p className="text-sm font-medium text-card-foreground">
                {loading ? "Loading..." : getAuthorName()}
              </p>
              {!loading && getAuthorUsername() && (
                <p className="text-xs text-muted-foreground">
                  @{getAuthorUsername()}
                </p>
              )}
            </div>
          </div>
          <div className="relative">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse border-2 border-border" />
            ) : (
              <Image
                src={getAuthorAvatar()}
                alt={getAuthorName()}
                className="w-10 h-10 rounded-full object-cover border-2 border-border"
              />
            )}
            {!loading && getAuthorOnlineStatus() && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-primary">
                {loading ? "-" : getAuthorReputation()}
              </span>
              <Icon
                name="Star"
                size={12}
                className="text-warning fill-current"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? "Loading..." : getAuthorTitle()}
            </p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-6 pt-6 border-t">
          <CommentSection
            answerId={answer?.id}
            comments={answer?.comments || []}
            onComment={onComment}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
};

export default AnswerCard;
