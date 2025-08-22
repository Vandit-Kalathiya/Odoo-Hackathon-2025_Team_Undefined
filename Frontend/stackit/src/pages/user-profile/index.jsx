import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import UserHeader from "./components/UserHeader";
import ProfileTabs from "./components/ProfileTabs";
import QuestionCard from "./components/QuestionCard";
import AnswerCard from "./components/AnswerCard";
import ActivityItem from "./components/ActivityItem";
import BadgeCard from "./components/BadgeCard";
import EditProfileModal from "./components/EditProfileModal";
import ProfileSidebar from "./components/ProfileSidebar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useAuth } from "contexts/AuthContext";
import axios from "axios";
import { useNotifications } from "contexts/AppProvider";
import { useLocation } from "react-router-dom";

const UserProfile = () => {
  const location = useLocation();
  const active = location.state?.active;
  console.log(active);
  
  const {
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      loading,
      setNotifications,
    } = useNotifications();
  const [activeTab, setActiveTab] = useState(active != null ? active : "questions");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  // const [activities, setActivities] = useState(notifications);
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getCurrentUser } = useAuth();

  const token = localStorage.getItem("token");

  // Make a different function and call it in useEffect
  const fetchUserData = async () => {
    const newUser = await getCurrentUser(token);

    const response = await axios.get(
      `http://localhost:7000/api/auth/getuser/${newUser.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(newUser);
    setUser(response.data)
    console.log(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Mock user data
  // useEffect(() => {

  //   const mockQuestions = [
  //     {
  //       id: 1,
  //       title:
  //         "How to implement efficient state management in large React applications?",
  //       excerpt:
  //         "I'm working on a large React application with multiple components that need to share state. What are the best practices for state management?",
  //       tags: ["react", "state-management", "redux", "context"],
  //       votes: 24,
  //       answerCount: 8,
  //       views: 342,
  //       status: "answered",
  //       createdAt: "2024-07-10T10:30:00Z",
  //     },
  //     {
  //       id: 2,
  //       title: "Best practices for API error handling in React applications",
  //       excerpt:
  //         "What's the recommended approach for handling API errors gracefully in React apps? Should I use try-catch blocks or error boundaries?",
  //       tags: ["react", "api", "error-handling", "javascript"],
  //       votes: 18,
  //       answerCount: 5,
  //       views: 256,
  //       status: "accepted",
  //       createdAt: "2024-07-08T14:15:00Z",
  //     },
  //     {
  //       id: 3,
  //       title: "TypeScript generic constraints with React components",
  //       excerpt:
  //         "I'm struggling with TypeScript generic constraints when creating reusable React components. How can I properly type generic props?",
  //       tags: ["typescript", "react", "generics", "components"],
  //       votes: 12,
  //       answerCount: 3,
  //       views: 189,
  //       status: "unanswered",
  //       createdAt: "2024-07-06T09:45:00Z",
  //     },
  //   ];

  //   const mockAnswers = [
  //     {
  //       id: 1,
  //       questionId: 101,
  //       questionTitle: "How to optimize React component re-renders?",
  //       excerpt:
  //         "You can use React.memo for functional components and useMemo/useCallback hooks to prevent unnecessary re-renders. Here's a comprehensive approach...",
  //       tags: ["react", "performance", "optimization"],
  //       votes: 35,
  //       commentCount: 4,
  //       isAccepted: true,
  //       createdAt: "2024-07-11T16:20:00Z",
  //     },
  //     {
  //       id: 2,
  //       questionId: 102,
  //       questionTitle: "Best way to handle form validation in React?",
  //       excerpt:
  //         "I recommend using react-hook-form with yup for schema validation. It provides excellent performance and developer experience...",
  //       tags: ["react", "forms", "validation"],
  //       votes: 28,
  //       commentCount: 6,
  //       isAccepted: false,
  //       createdAt: "2024-07-09T11:30:00Z",
  //     },
  //     {
  //       id: 3,
  //       questionId: 103,
  //       questionTitle: "Understanding React useEffect cleanup functions",
  //       excerpt:
  //         "Cleanup functions are essential for preventing memory leaks. They run when the component unmounts or before the effect runs again...",
  //       tags: ["react", "hooks", "useeffect"],
  //       votes: 22,
  //       commentCount: 2,
  //       isAccepted: true,
  //       createdAt: "2024-07-07T13:45:00Z",
  //     },
  //   ];

  //   const mockActivities = [
  //     {
  //       id: 1,
  //       type: "answer_accepted",
  //       title: "How to optimize React component re-renders?",
  //       reputation: 15,
  //       tags: ["react", "performance"],
  //       createdAt: "2024-07-11T16:20:00Z",
  //     },
  //     {
  //       id: 2,
  //       type: "vote_received",
  //       title: "Best way to handle form validation in React?",
  //       voteCount: 3,
  //       voteType: "up",
  //       tags: ["react", "forms"],
  //       createdAt: "2024-07-11T14:30:00Z",
  //     },
  //     {
  //       id: 3,
  //       type: "question",
  //       title: "TypeScript generic constraints with React components",
  //       tags: ["typescript", "react"],
  //       createdAt: "2024-07-06T09:45:00Z",
  //     },
  //     {
  //       id: 4,
  //       type: "badge_earned",
  //       badgeName: "Good Answer",
  //       reputation: 5,
  //       createdAt: "2024-07-05T18:20:00Z",
  //     },
  //     {
  //       id: 5,
  //       type: "comment",
  //       title: "Understanding React useEffect cleanup functions",
  //       tags: ["react", "hooks"],
  //       createdAt: "2024-07-04T12:15:00Z",
  //     },
  //   ];

  //   const mockBadges = [
  //     {
  //       id: 1,
  //       name: "Good Answer",
  //       description: "Answer score of 25 or more",
  //       type: "gold",
  //       category: "answer",
  //       count: 3,
  //       earnedAt: "2024-07-05T18:20:00Z",
  //     },
  //     {
  //       id: 2,
  //       name: "Helpful",
  //       description: "First answer was accepted",
  //       type: "silver",
  //       category: "answer",
  //       count: 1,
  //       earnedAt: "2024-06-15T10:30:00Z",
  //     },
  //     {
  //       id: 3,
  //       name: "Teacher",
  //       description: "Answer score of 1 or more",
  //       type: "bronze",
  //       category: "answer",
  //       count: 12,
  //       earnedAt: "2024-05-20T14:45:00Z",
  //     },
  //     {
  //       id: 4,
  //       name: "Student",
  //       description: "First question with score of 1 or more",
  //       type: "bronze",
  //       category: "question",
  //       count: 1,
  //       earnedAt: "2024-02-10T09:15:00Z",
  //     },
  //   ];

  //   // Simulate API loading
  //   setTimeout(() => {
  //     // setUser(mockUser);
  //     setQuestions(mockQuestions);
  //     setAnswers(mockAnswers);
  //     setActivities(mockActivities);
  //     setBadges(mockBadges);
  //     setIsLoading(false);
  //   }, 1000);
  // }, []);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (updatedData) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const handleQuestionClick = (questionId) => {
    window.location.href = "/question-detail-answers";
  };

  const handleActivityClick = (activity) => {
    if (
      activity.type === "question" ||
      activity.type === "answer" ||
      activity.type === "comment"
    ) {
      window.location.href = "/question-detail-answers";
    }
  };

  const isOwnProfile = true; // In real app, check if current user matches profile user

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center space-x-6">
                <div className="w-32 h-32 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-12 bg-muted rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "questions":
        return (
          <div className="space-y-4">
            {questions.length > 0 ? (
              questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onQuestionClick={handleQuestionClick}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Icon
                  name="MessageSquare"
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground opacity-50"
                />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No questions yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isOwnProfile
                    ? "You haven't asked any questions yet."
                    : "This user hasn't asked any questions yet."}
                </p>
                {isOwnProfile && (
                  <Button
                    onClick={() => (window.location.href = "/ask-question")}
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Ask Your First Question
                  </Button>
                )}
              </div>
            )}
          </div>
        );

      case "answers":
        return (
          <div className="space-y-4">
            {answers.length > 0 ? (
              answers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  onQuestionClick={handleQuestionClick}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Icon
                  name="MessageCircle"
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground opacity-50"
                />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No answers yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isOwnProfile
                    ? "You haven't answered any questions yet."
                    : "This user hasn't answered any questions yet."}
                </p>
                {isOwnProfile && (
                  <Button
                    onClick={() =>
                      (window.location.href = "/questions-dashboard")
                    }
                    iconName="Search"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Browse Questions
                  </Button>
                )}
              </div>
            )}
          </div>
        );

      case "notifications":
        return (
          <div className="bg-card border rounded-lg">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <ActivityItem
                    key={notification.id}
                    notification={notification}
                    onItemClick={handleActivityClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon
                  name="Activity"
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground opacity-50"
                />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Notification yet
                </h3>
                <p className="text-muted-foreground">
                  {isOwnProfile
                    ? "Your activity will appear here."
                    : "This user's activity will appear here."}
                </p>
              </div>
            )}
          </div>
        );

      case "badges":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.length > 0 ? (
              badges.map((badge) => <BadgeCard key={badge.id} badge={badge} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <Icon
                  name="Award"
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground opacity-50"
                />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No badges yet
                </h3>
                <p className="text-muted-foreground">
                  {isOwnProfile
                    ? "Earn badges by participating in the community."
                    : "This user hasn't earned any badges yet."}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <UserHeader
            user={user}
            isOwnProfile={isOwnProfile}
            onEditProfile={handleEditProfile}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                questionCount={questions.length}
                answerCount={answers.length}
                activityCount={notifications.length}
              />

              <div className="mt-6">{renderTabContent()}</div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar user={user} />
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default UserProfile;
