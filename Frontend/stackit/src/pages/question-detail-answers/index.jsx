import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  transformQuestionForDisplay,
  transformCurrentUser,
} from "../../utils/userHelpers";
import { all } from "axios";

const QuestionDetailAnswers = () => {
  const location = useLocation();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [sortBy, setSortBy] = useState("votes");
  const [showAnswerEditor, setShowAnswerEditor] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { getAllQuestions } = useQuestions();
  const questionId = new URLSearchParams(location.search).get("id");

  // Mock current user - update this to match your user structure
  useEffect(() => {
    const mockUserData = {
      id: 1,
      username: "john_doe",
      displayName: "John Doe",
      email: "john@example.com",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      reputationScore: 1520,
      role: "USER",
    };

    setCurrentUser(transformCurrentUser(mockUserData));
  }, []);

  // Transform your question object to match component expectations
  const transformQuestion = (questionData) => {
    return transformQuestionForDisplay(questionData);
  };

  // Load question data
  useEffect(async () => {
    try {
      const allQuestions = await getAllQuestions();
      console.log(allQuestions);
      
      const foundQuestion = allQuestions.content.find(
        (q) => q.id === parseInt(questionId)
      );

      if (foundQuestion) {
        setQuestion(transformQuestion(foundQuestion));
      } else {
        // Fallback mock question if not found
        const mockQuestion = {
          id: parseInt(questionId) || 1,
          title: "How to implement WebSocket in Spring Boot?",
          content: `<p>I'm trying to implement <strong>real-time messaging</strong> in my Spring Boot application. Can someone guide me through the process?</p><ul><li>WebSocket configuration</li><li>Message handling</li><li>Client-side integration</li></ul>`,
          author: {
            id: 1,
            name: "John Doe",
            username: "john_doe",
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            reputation: 100,
            title: "USER",
            isOnline: true,
          },
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          views: 0,
          votes: 0,
          answerCount: 1,
          followers: 0,
          tags: ["java", "spring-boot", "websocket", "real-time"],
          userVote: null,
          isBookmarked: false,
          isFollowing: false,
          acceptedAnswerAt: null,
          isClosed: false,
          closeReason: null,
          hasAcceptedAnswer: false,
        };
        setQuestion(mockQuestion);
      }
    } catch (error) {
      console.error("Error loading question:", error);
    }
  }, [questionId, getAllQuestions]);

  // Mock answers data - you'll want to replace this with actual API calls
//   useEffect(() => {
//     const mockAnswers = [
//       {
//         id: 1,
//         content: `<p>Here's a comprehensive guide to implementing WebSocket in Spring Boot:</p>

// <h3>1. Add Dependencies</h3>
// <p>First, add the WebSocket dependency to your <code>pom.xml</code>:</p>
// <pre><code>&lt;dependency&gt;
//     &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
//     &lt;artifactId&gt;spring-boot-starter-websocket&lt;/artifactId&gt;
// &lt;/dependency&gt;</code></pre>

// <h3>2. WebSocket Configuration</h3>
// <pre><code>@Configuration
// @EnableWebSocket
// public class WebSocketConfig implements WebSocketConfigurer {

//     @Override
//     public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//         registry.addHandler(new MyWebSocketHandler(), "/websocket")
//                 .setAllowedOrigins("*");
//     }
// }</code></pre>

// <h3>3. WebSocket Handler</h3>
// <pre><code>@Component
// public class MyWebSocketHandler extends TextWebSocketHandler {

//     @Override
//     public void afterConnectionEstablished(WebSocketSession session) {
//         System.out.println("Connection established: " + session.getId());
//     }

//     @Override
//     protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//         String payload = message.getPayload();
//         session.sendMessage(new TextMessage("Echo: " + payload));
//     }

//     @Override
//     public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
//         System.out.println("Connection closed: " + session.getId());
//     }
// }</code></pre>

// <p>This setup provides a basic WebSocket implementation that echoes messages back to the client.</p>`,
//         author: {
//           id: 2,
//           name: "Spring Expert",
//           username: "spring_expert",
//           avatar:
//             "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//           reputation: 2340,
//           title: "Spring Specialist",
//           isOnline: false,
//         },
//         createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
//         editedAt: null,
//         isEdited: false,
//         votes: 23,
//         userVote: null,
//         isAccepted: false,
//         commentCount: 2,
//         comments: [
//           {
//             id: 1,
//             content:
//               "Great explanation! Could you also show how to handle STOMP protocol?",
//             author: {
//               id: 1,
//               name: "John Doe",
//               username: "john_doe",
//               avatar:
//                 "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
//               reputation: 100,
//             },
//             createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
//             likes: 3,
//           },
//         ],
//       },
//     ];

//     setAnswers(mockAnswers);
//   }, []);

  // Mock related questions
  useEffect(() => {
    const mockRelatedQuestions = [
      {
        id: 2,
        title: "Spring Boot WebSocket with STOMP protocol",
        answerCount: 5,
        votes: 18,
        views: 890,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        tags: ["spring-boot", "websocket", "stomp"],
      },
      {
        id: 3,
        title: "Real-time chat application with Spring Boot",
        answerCount: 7,
        votes: 24,
        views: 1245,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        tags: ["spring-boot", "websocket", "chat"],
      },
    ];

    setRelatedQuestions(mockRelatedQuestions);
  }, []);

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
    setQuestion((prev) => {
      if (!prev) return prev;

      let newVotes = prev.votes;
      let newUserVote = voteType;

      if (prev.userVote === voteType) {
        // Remove vote
        newUserVote = null;
        newVotes += voteType === "up" ? -1 : 1;
      } else if (prev.userVote) {
        // Change vote
        newVotes += voteType === "up" ? 2 : -2;
      } else {
        // New vote
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
    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.id !== answerId) return answer;

        let newVotes = answer.votes;
        let newUserVote = voteType;

        if (answer.userVote === voteType) {
          // Remove vote
          newUserVote = null;
          newVotes += voteType === "up" ? -1 : 1;
        } else if (answer.userVote) {
          // Change vote
          newVotes += voteType === "up" ? 2 : -2;
        } else {
          // New vote
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
  const handleAnswerAccept = (answerId) => {
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
  };

  // Handle bookmark
  const handleBookmark = (questionId, isBookmarked) => {
    setQuestion((prev) => ({
      ...prev,
      isBookmarked,
    }));
  };

  // Handle follow
  const handleFollow = (questionId, isFollowing) => {
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
      // You could show a toast notification here
    }
  };

  // Handle comment submission
  const handleComment = async (answerId, content) => {
    const newComment = {
      id: Date.now(),
      content,
      author: {
        id: currentUser.id,
        name: currentUser.displayName,
        username: currentUser.username,
        avatar: currentUser.avatarUrl,
        reputation: currentUser.reputationScore,
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newAnswer = {
        id: Date.now(),
        content,
        author: {
          id: currentUser.id,
          name: currentUser.displayName,
          username: currentUser.username,
          avatar: currentUser.avatarUrl,
          reputation: currentUser.reputationScore,
          title: currentUser.role,
          isOnline: true,
        },
        createdAt: new Date().toISOString(),
        votes: 0,
        userVote: null,
        isAccepted: false,
        commentCount: 0,
        comments: [],
      };

      setAnswers((prev) => [...prev, newAnswer]);
      setQuestion((prev) => ({
        ...prev,
        answerCount: prev.answerCount + 1,
      }));
      setShowAnswerEditor(false);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Handle related question click
  const handleRelatedQuestionClick = (relatedQuestion) => {
    // In a real app, this would navigate to the question
    window.location.href = `/question-detail-answers?id=${relatedQuestion.id}`;
  };

  if (!question) {
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
                answerCount={question.answerCount}
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
