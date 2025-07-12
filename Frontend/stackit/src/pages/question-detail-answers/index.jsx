import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import QuestionHeader from "./components/QuestionHeader";
import AnswerCard from "./components/AnswerCard";
import AnswerEditor from "./components/AnswerEditor";
import RelatedQuestions from "./components/RelatedQuestions";
import QuestionStats from "./components/QuestionStats";
import SortControls from "./components/SortControls";
import { useQuestions } from "contexts/QuestionContext";
import { useAnswers } from "contexts/AnswerContext";
import { useAuth } from "contexts/AuthContext";

const QuestionDetailAnswers = () => {
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [sortBy, setSortBy] = useState("votes");
  const [showAnswerEditor, setShowAnswerEditor] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getAllQuestions, getQuestionById } = useQuestions();
  const { createAnswer, getAnswersByQuestion, acceptAnswer } = useAnswers();
  const questionId = new URLSearchParams(location.search).get("id");

  // Current user from auth context
  const currentUser = userProfile || user;

  // Transform backend answer data to component format
  const transformAnswer = (answerData) => {
    return {
      id: answerData.id,
      content: answerData.content,
      author: {
        id: answerData.user?.id,
        name: answerData.user?.displayName || answerData.user?.username,
        username: answerData.user?.username,
        avatar:
          answerData.user?.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            answerData.user?.displayName || answerData.user?.username || "U"
          )}&background=6366f1&color=ffffff`,
        reputation: answerData.user?.reputationScore || 0,
        title: answerData.user?.role || "Member",
        isOnline: true, // You might want to add this field to your backend
      },
      createdAt: answerData.createdAt,
      editedAt: answerData.editedAt,
      isEdited: !!answerData.editedAt,
      votes: answerData.score || 0,
      upvoteCount: answerData.upvoteCount || 0,
      downvoteCount: answerData.downvoteCount || 0,
      userVote: null, // You'll need to implement this based on current user's vote
      isAccepted: answerData.isAccepted || false,
      commentCount: 0, // You'll need to add comments system
      comments: [], // You'll need to add comments system
      questionId: answerData.question?.id,
    };
  };

  // Transform backend question data to component format
  const transformQuestion = (questionData) => {
    return {
      id: questionData.id,
      title: questionData.title,
      content: questionData.description,
      author: {
        id: questionData.user?.id,
        name: questionData.user?.displayName || questionData.user?.username,
        username: questionData.user?.username,
        avatar:
          questionData.user?.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            questionData.user?.displayName || questionData.user?.username || "U"
          )}&background=6366f1&color=ffffff`,
        reputation: questionData.user?.reputationScore || 0,
        title: questionData.user?.role || "Member",
        isOnline: true,
      },
      createdAt: questionData.createdAt,
      lastActivity: questionData.updatedAt,
      views: questionData.viewCount || 0,
      votes: questionData.score || 0,
      answerCount: questionData.answerCount || 0,
      followers: 0, // You might want to add this field
      tags: questionData.tags
        ? questionData.tags.map((tag) =>
            typeof tag === "string" ? tag : tag.name
          )
        : [],
      userVote: null, // You'll need to implement this
      isBookmarked: false, // You'll need to implement this
      isFollowing: false, // You'll need to implement this
      acceptedAnswerAt: questionData.acceptedAnswerId
        ? questionData.updatedAt
        : null,
      isClosed: questionData.isClosed || false,
      closeReason: questionData.closeReason,
      hasAcceptedAnswer: questionData.hasAcceptedAnswer || false,
      isActive: questionData.isActive !== false,
    };
  };

  // Load question data
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const questionData = await getQuestionById(questionId);

        if (questionData) {
          setQuestion(transformQuestion(questionData));
        } else {
          setError("Question not found");
        }
      } catch (error) {
        console.error("Error loading question:", error);
        setError("Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId, getQuestionById]);

  // Load answers for the question
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        if (questionId) {
          const answersData = await getAnswersByQuestion(questionId);
          console.log("Fetched answers:", answersData);

          if (Array.isArray(answersData)) {
            const transformedAnswers = answersData.map(transformAnswer);
            setAnswers(transformedAnswers);
          } else if (
            answersData?.content &&
            Array.isArray(answersData.content)
          ) {
            // Handle paginated response
            const transformedAnswers = answersData.content.map(transformAnswer);
            setAnswers(transformedAnswers);
          }
        }
      } catch (error) {
        console.error("Error loading answers:", error);
      }
    };

    fetchAnswers();
  }, [questionId, getAnswersByQuestion]);

  // Load related questions
  useEffect(() => {
    const fetchRelatedQuestions = async () => {
      try {
        const allQuestions = await getAllQuestions();
        if (allQuestions?.content) {
          // Filter out current question and get first few as related
          const related = allQuestions.content
            .filter((q) => q.id !== parseInt(questionId))
            .slice(0, 4)
            .map((q) => ({
              id: q.id,
              title: q.title,
              answerCount: q.answerCount || 0,
              votes: q.score || 0,
              views: q.viewCount || 0,
              createdAt: q.createdAt,
              tags: q.tags
                ? q.tags.map((tag) =>
                    typeof tag === "string" ? tag : tag.name
                  )
                : [],
            }));

          setRelatedQuestions(related);
        }
      } catch (error) {
        console.error("Error loading related questions:", error);
      }
    };

    if (questionId) {
      fetchRelatedQuestions();
    }
  }, [questionId, getAllQuestions]);

  // Sort answers based on selected criteria
  const sortedAnswers = useMemo(() => {
    const sorted = [...answers];

    switch (sortBy) {
      case "votes":
        return sorted.sort((a, b) => {
          // Accepted answer always first
          if (a.isAccepted && !b.isAccepted) return -1;
          if (!a.isAccepted && b.isAccepted) return 1;
          // Then by votes
          return b.votes - a.votes;
        });
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "activity":
        return sorted.sort((a, b) => {
          const aActivity = new Date(a.editedAt || a.createdAt);
          const bActivity = new Date(b.editedAt || b.createdAt);
          return bActivity - aActivity;
        });
      default:
        return sorted;
    }
  }, [answers, sortBy]);

  // Handle question voting
  const handleQuestionVote = (questionId, voteType) => {
    // TODO: Implement voting API call
    setQuestion((prev) => {
      if (!prev) return prev;

      let newVotes = prev.votes;
      let newUserVote = voteType;

      if (prev.userVote === voteType) {
        newUserVote = null;
        newVotes += voteType === "up" ? -1 : 1;
      } else if (prev.userVote) {
        newVotes += voteType === "up" ? 2 : -2;
      } else {
        newVotes += voteType === "up" ? 1 : -1;
      }

      return {
        ...prev,
        votes: newVotes,
        userVote: newUserVote,
      };
    });
  };

  // Handle answer voting
  const handleAnswerVote = (answerId, voteType) => {
    // TODO: Implement voting API call
    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.id !== answerId) return answer;

        let newVotes = answer.votes;
        let newUserVote = voteType;

        if (answer.userVote === voteType) {
          newUserVote = null;
          newVotes += voteType === "up" ? -1 : 1;
        } else if (answer.userVote) {
          newVotes += voteType === "up" ? 2 : -2;
        } else {
          newVotes += voteType === "up" ? 1 : -1;
        }

        return {
          ...answer,
          votes: newVotes,
          userVote: newUserVote,
        };
      })
    );
  };

  // Handle answer acceptance
  const handleAnswerAccept = async (answerId) => {
    try {
      const result = await acceptAnswer(answerId, currentUser.id);
      console.log("Answer accepted:", result);
      
      // TODO: Implement accept answer API call
      setAnswers((prev) =>
        prev.map((answer) => ({
          ...answer,
          isAccepted: answer.id === answerId,
        }))
      );

      setQuestion((prev) => ({
        ...prev,
        acceptedAnswerAt: new Date().toISOString(),
        hasAcceptedAnswer: true,
      }));
    } catch (error) {
      console.error("Error accepting answer:", error);
    }
  };

  // Handle bookmark
  const handleBookmark = (questionId, isBookmarked) => {
    // TODO: Implement bookmark API call
    setQuestion((prev) => ({
      ...prev,
      isBookmarked,
    }));
  };

  // Handle follow
  const handleFollow = (questionId, isFollowing) => {
    // TODO: Implement follow API call
    setQuestion((prev) => ({
      ...prev,
      isFollowing,
      followers: prev.followers + (isFollowing ? 1 : -1),
    }));
  };

  // Handle share
  const handleShare = (question) => {
    if (navigator.share) {
      navigator.share({
        title: question.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Handle comment submission
  const handleComment = async (answerId, content) => {
    if (!currentUser) return;

    // TODO: Implement comment API call
    const newComment = {
      id: Date.now(),
      content,
      author: {
        id: currentUser.id,
        name: currentUser.displayName || currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatarUrl || currentUser.avatar,
        reputation: currentUser.reputationScore || currentUser.reputation,
      },
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.id === answerId) {
          return {
            ...answer,
            comments: [...(answer.comments || []), newComment],
            commentCount: (answer.commentCount || 0) + 1,
          };
        }
        return answer;
      })
    );
  };

  // Handle answer submission
  const handleAnswerSubmit = async (content) => {
    if (!currentUser) return;

    setIsSubmittingAnswer(true);

    try {
      const answerData = {
        content,
        questionId: parseInt(questionId),
        userId: currentUser.id,
      };

      console.log("Submitting answer:", answerData);
      const result = await createAnswer(answerData);
      console.log("Answer submitted successfully:", result);

      if (result) {
        // Transform the new answer and add to list
        const newAnswer = transformAnswer({
          ...result,
          user: currentUser,
          question: { id: parseInt(questionId) },
        });

        setAnswers((prev) => [...prev, newAnswer]);
        setQuestion((prev) => ({
          ...prev,
          answerCount: prev.answerCount + 1,
        }));
        setShowAnswerEditor(false);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Handle related question click
  const handleRelatedQuestionClick = (relatedQuestion) => {
    window.location.href = `/question-detail-answers?id=${relatedQuestion.id}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading question...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !question) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon
                name="AlertCircle"
                size={48}
                className="mx-auto mb-4 text-destructive"
              />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                {error || "Question not found"}
              </h3>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canAcceptAnswers = currentUser && currentUser.id === question.author.id;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={16}
            className="mb-4"
          >
            Back to Questions
          </Button>
        </div>

        {/* Closed Question Banner */}
        {question.isClosed && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Lock" size={20} className="text-destructive" />
              <div>
                <p className="font-medium text-destructive">
                  This question is closed
                </p>
                {question.closeReason && (
                  <p className="text-sm text-destructive/80">
                    {question.closeReason}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question Header */}
            <QuestionHeader
              question={question}
              onVote={handleQuestionVote}
              onBookmark={handleBookmark}
              onShare={handleShare}
              onFollow={handleFollow}
              currentUser={currentUser}
            />

            {/* Answers Section */}
            <div>
              <SortControls
                sortBy={sortBy}
                onSortChange={setSortBy}
                answerCount={answers.length}
              />

              {/* Answers List */}
              <div className="space-y-6">
                {sortedAnswers.map((answer) => (
                  <AnswerCard
                    key={answer.id}
                    answer={answer}
                    onVote={handleAnswerVote}
                    onAccept={handleAnswerAccept}
                    onComment={handleComment}
                    canAccept={canAcceptAnswers}
                    currentUser={currentUser}
                  />
                ))}
              </div>

              {/* No Answers State */}
              {answers.length === 0 && (
                <div className="text-center py-12 bg-card border rounded-lg">
                  <Icon
                    name="MessageSquare"
                    size={48}
                    className="mx-auto mb-4 text-muted-foreground opacity-50"
                  />
                  <h3 className="text-lg font-medium text-card-foreground mb-2">
                    No answers yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to answer this question!
                  </p>
                  {currentUser && !question.isClosed && (
                    <Button
                      onClick={() => setShowAnswerEditor(true)}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Write an Answer
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Answer Editor */}
            {showAnswerEditor && currentUser && !question.isClosed && (
              <AnswerEditor
                onSubmit={handleAnswerSubmit}
                onCancel={() => setShowAnswerEditor(false)}
                isSubmitting={isSubmittingAnswer}
                currentUser={currentUser}
              />
            )}

            {/* Add Answer Button */}
            {!showAnswerEditor &&
              currentUser &&
              answers.length > 0 &&
              !question.isClosed && (
                <div className="text-center">
                  <Button
                    onClick={() => setShowAnswerEditor(true)}
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                    size="lg"
                  >
                    Write Your Answer
                  </Button>
                </div>
              )}

            {/* Closed Question Notice */}
            {question.isClosed && currentUser && (
              <div className="text-center py-8 bg-card border rounded-lg">
                <Icon
                  name="Lock"
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground opacity-50"
                />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  Question is closed
                </h3>
                <p className="text-muted-foreground">
                  This question is not accepting new answers.
                </p>
              </div>
            )}

            {/* Login Prompt for Guests */}
            {!currentUser && (
              <div className="text-center py-8 bg-card border rounded-lg">
                <Icon
                  name="User"
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground opacity-50"
                />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  Want to answer?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Sign in to share your knowledge and help the community.
                </p>
                <Button
                  onClick={() => (window.location.href = "/user-registration")}
                  iconName="LogIn"
                  iconPosition="left"
                  iconSize={16}
                >
                  Sign In to Answer
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Question Stats */}
            <QuestionStats question={question} />

            {/* Related Questions */}
            <RelatedQuestions
              questions={relatedQuestions}
              onQuestionClick={handleRelatedQuestionClick}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      {currentUser && !showAnswerEditor && !question.isClosed && (
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setShowAnswerEditor(true)}
            size="lg"
            iconName="Plus"
            iconSize={20}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </div>
      )}
    </div>
  );
};

export default QuestionDetailAnswers;
