import React from "react";
import Icon from "../../../components/AppIcon";

const QuestionStats = ({ question }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const stats = [
    {
      label: "Views",
      value: formatNumber(question.views || question.viewCount || 0),
      icon: "Eye",
      color: "text-muted-foreground",
    },
    {
      label: "Answers",
      value: question.answerCount || 0,
      icon: "MessageSquare",
      color:
        (question.answerCount || 0) > 0
          ? "text-primary"
          : "text-muted-foreground",
    },
    {
      label: "Votes",
      value: question.votes || question.score || 0,
      icon: "ChevronUp",
      color:
        (question.votes || question.score || 0) > 0
          ? "text-success"
          : (question.votes || question.score || 0) < 0
          ? "text-destructive"
          : "text-muted-foreground",
    },
    {
      label: "Followers",
      value: question.followers || 0,
      icon: "Users",
      color: "text-muted-foreground",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Question Stats
      </h3>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name={stat.icon} size={16} className={stat.color} />
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <span className={`text-lg font-semibold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Question Status */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-medium text-card-foreground mb-3">
          Status
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon
              name={question.isActive ? "CheckCircle" : "XCircle"}
              size={12}
              className={
                question.isActive ? "text-success" : "text-muted-foreground"
              }
            />
            <span className="text-xs text-muted-foreground">
              {question.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {question.isClosed && (
            <div className="flex items-center space-x-2">
              <Icon name="Lock" size={12} className="text-destructive" />
              <span className="text-xs text-destructive">Closed</span>
            </div>
          )}

          {question.hasAcceptedAnswer && (
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={12} className="text-success" />
              <span className="text-xs text-success">Has accepted answer</span>
            </div>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-medium text-card-foreground mb-3">
          Recent Activity
        </h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Clock" size={12} />
            <span>Asked {formatDate(question.createdAt)}</span>
          </div>

          {question.lastActivity &&
            question.lastActivity !== question.createdAt && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Activity" size={12} />
                <span>
                  Last active{" "}
                  {formatDate(question.lastActivity || question.updatedAt)}
                </span>
              </div>
            )}

          {question.acceptedAnswerAt && (
            <div className="flex items-center space-x-2 text-xs text-success">
              <Icon name="CheckCircle" size={12} />
              <span>
                Answer accepted {formatDate(question.acceptedAnswerAt)}
              </span>
            </div>
          )}

          {question.closeReason && (
            <div className="flex items-start space-x-2 text-xs text-destructive">
              <Icon
                name="AlertCircle"
                size={12}
                className="mt-0.5 flex-shrink-0"
              />
              <span>Closed: {question.closeReason}</span>
            </div>
          )}
        </div>
      </div>

      {/* Author Info */}
      {question.author && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-medium text-card-foreground mb-3">
            Asked by
          </h4>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {(
                  question.author.name ||
                  question.author.displayName ||
                  question.author.username ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">
                {question.author.name ||
                  question.author.displayName ||
                  question.author.username}
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-primary">
                  {question.author.reputation ||
                    question.author.reputationScore ||
                    0}
                </span>
                <Icon
                  name="Star"
                  size={10}
                  className="text-warning fill-current"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionStats;
