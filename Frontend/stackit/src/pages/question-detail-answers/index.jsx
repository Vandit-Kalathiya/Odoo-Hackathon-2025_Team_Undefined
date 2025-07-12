import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import QuestionHeader from './components/QuestionHeader';
import AnswerCard from './components/AnswerCard';
import AnswerEditor from './components/AnswerEditor';
import RelatedQuestions from './components/RelatedQuestions';
import QuestionStats from './components/QuestionStats';
import SortControls from './components/SortControls';

const QuestionDetailAnswers = () => {
  const location = useLocation();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [sortBy, setSortBy] = useState('votes');
  const [showAnswerEditor, setShowAnswerEditor] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Mock current user
  useEffect(() => {
    setCurrentUser({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      reputation: 1520,
      title: 'Senior Developer'
    });
  }, []);

  // Mock question data
  useEffect(() => {
    const mockQuestion = {
      id: 1,
      title: 'How to implement React hooks for state management in complex applications?',
      content: `<p>I'm working on a large React application and I'm struggling with state management using hooks. The application has multiple components that need to share state, and I'm finding it difficult to manage the complexity.</p>

<p>Here's what I've tried so far:</p>

<ul>
<li>Using useState in parent components and passing props down</li>
<li>Implementing useContext for global state</li>
<li>Trying useReducer for complex state logic</li>
</ul>

<p>The main issues I'm facing are:</p>

<ol>
<li><strong>Performance:</strong> Components are re-rendering unnecessarily</li>
<li><strong>Complexity:</strong> State logic is becoming hard to maintain</li>
<li><strong>Testing:</strong> Difficult to test components with complex state dependencies</li>
</ol>

<p>What are the best practices for implementing React hooks in large applications? Should I consider using a state management library like Redux Toolkit or Zustand?</p>

<p>Any code examples or architectural patterns would be greatly appreciated!</p>`,
      author: {
        id: 2,
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        reputation: 890,
        title: 'Frontend Developer',
        isOnline: true
      },
      createdAt: '2025-01-10T14:30:00Z',
      lastActivity: '2025-01-12T09:15:00Z',
      views: 1247,
      votes: 15,
      answerCount: 3,
      followers: 8,
      tags: ['react', 'hooks', 'state-management', 'javascript', 'frontend'],
      userVote: null,
      isBookmarked: false,
      isFollowing: false,
      acceptedAnswerAt: '2025-01-11T16:45:00Z'
    };

    setQuestion(mockQuestion);
  }, []);

  // Mock answers data
  useEffect(() => {
    const mockAnswers = [
      {
        id: 1,
        content: `<p>Great question! For complex React applications, I recommend a layered approach to state management using hooks. Here's a comprehensive strategy:</p>

<h3>1. State Categorization</h3>
<p>First, categorize your state into different types:</p>
<ul>
<li><strong>Local State:</strong> Use <code>useState</code> for component-specific data</li>
<li><strong>Shared State:</strong> Use <code>useContext</code> for data shared between related components</li>
<li><strong>Global State:</strong> Use Redux Toolkit or Zustand for application-wide state</li>
</ul>

<h3>2. Performance Optimization</h3>
<p>To prevent unnecessary re-renders:</p>
<pre><code>// Use React.memo for components
const MyComponent = React.memo(({ data }) => {
  return &lt;div&gt;{data.name}&lt;/div&gt;;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // handler logic
}, [dependency]);</code></pre>

<h3>3. Custom Hooks Pattern</h3>
<p>Create custom hooks to encapsulate complex state logic:</p>
<pre><code>function useUserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser().then(userData => {
      setUser(userData);
      setLoading(false);
    });
  }, []);
  
  return { user, loading, setUser };
}</code></pre>

<p>For your specific use case, I'd recommend starting with this pattern and only introducing Redux Toolkit if you need time-travel debugging or complex middleware.</p>`,
        author: {
          id: 3,
          name: 'Michael Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          reputation: 2340,
          title: 'React Specialist',
          isOnline: false
        },
        createdAt: '2025-01-11T10:20:00Z',
        editedAt: '2025-01-11T16:45:00Z',
        isEdited: true,
        votes: 23,
        userVote: 'up',
        isAccepted: true,
        commentCount: 5,
        comments: [
          {
            id: 1,
            content: 'This is exactly what I was looking for! The custom hooks pattern is brilliant.',
            author: {
              id: 2,
              name: 'Sarah Wilson',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
              reputation: 890
            },
            createdAt: '2025-01-11T11:30:00Z',
            likes: 3
          },
          {
            id: 2,
            content: 'Great explanation! Could you provide more details about when to choose Redux Toolkit over Zustand?',
            author: {
              id: 4,
              name: 'Alex Rodriguez',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
              reputation: 1200
            },
            createdAt: '2025-01-11T14:15:00Z',
            likes: 1
          }
        ]
      },
      {
        id: 2,
        content: `<p>I'd like to add to @MichaelChen's excellent answer with some practical considerations for testing:</p>

<h3>Testing Strategy for Hook-based Components</h3>
<p>When dealing with complex state management, testing becomes crucial. Here's my approach:</p>

<h4>1. Testing Custom Hooks</h4>
<pre><code>import { renderHook, act } from '@testing-library/react';
import { useUserData } from './useUserData';

test('should fetch user data', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useUserData());
  
  expect(result.current.loading).toBe(true);
  
  await waitForNextUpdate();
  
  expect(result.current.loading).toBe(false);
  expect(result.current.user).toBeDefined();
});</code></pre>

<h4>2. Testing Context Providers</h4>
<p>Create test utilities for context providers:</p>
<pre><code>const TestWrapper = ({ children }) => (
  &lt;UserContext.Provider value={mockUserValue}&gt;
    {children}
  &lt;/UserContext.Provider&gt;
);

test('component uses context correctly', () => {
  render(&lt;MyComponent /&gt;, { wrapper: TestWrapper });
  // assertions
});</code></pre>

<h3>Architecture Recommendations</h3>
<p>For large applications, I recommend this structure:</p>
<ul>
<li><strong>hooks/</strong> - Custom hooks for business logic</li>
<li><strong>contexts/</strong> - React contexts for shared state</li>
<li><strong>store/</strong> - Redux store (if needed)</li>
<li><strong>utils/</strong> - Helper functions</li>
</ul>

<p>This keeps your state management organized and testable.</p>`,
        author: {
          id: 5,
          name: 'Emma Thompson',avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',reputation: 1890,title: 'Full Stack Engineer',
          isOnline: true
        },
        createdAt: '2025-01-11T15:45:00Z',
        votes: 12,
        userVote: null,
        isAccepted: false,
        commentCount: 2,
        comments: [
          {
            id: 3,
            content: 'The testing examples are very helpful! Thanks for sharing the practical approach.',
            author: {
              id: 1,
              name: 'John Doe',avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              reputation: 1520
            },
            createdAt: '2025-01-11T16:20:00Z',
            likes: 2
          }
        ]
      },
      {
        id: 3,
        content: `<p>Both previous answers are excellent! I want to share a real-world example from a project I recently worked on.</p>

<h3>Case Study: E-commerce Dashboard</h3>
<p>We had a complex dashboard with multiple data sources and real-time updates. Here's how we structured it:</p>

<h4>1. Data Layer</h4>
<pre><code>// hooks/useProducts.js
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}</code></pre>

<h4>2. WebSocket Integration</h4>
<pre><code>// hooks/useWebSocket.js
export function useWebSocket(url) {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      setLastMessage(JSON.parse(event.data));
    };
    setSocket(ws);

    return () => ws.close();
  }, [url]);

  return { socket, lastMessage };
}</code></pre>

<h3>Performance Results</h3>
<p>After implementing this pattern:</p>
<ul>
<li>Reduced bundle size by 40% (compared to Redux)</li>
<li>Improved component render performance</li>
<li>Easier onboarding for new developers</li>
<li>Better test coverage</li>
</ul>

<p>The key is to start simple and only add complexity when needed. Don't over-engineer from the beginning!</p>`,
        author: {
          id: 6,
          name: 'David Park',avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',reputation: 1650,title: 'Senior Frontend Architect',
          isOnline: false
        },
        createdAt: '2025-01-12T08:30:00Z',
        votes: 8,
        userVote: null,
        isAccepted: false,
        commentCount: 1,
        comments: [
          {
            id: 4,
            content: 'Love the real-world example! The WebSocket integration is particularly useful.',
            author: {
              id: 2,
              name: 'Sarah Wilson',avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
              reputation: 890
            },
            createdAt: '2025-01-12T09:15:00Z',
            likes: 1
          }
        ]
      }
    ];

    setAnswers(mockAnswers);
  }, []);

  // Mock related questions
  useEffect(() => {
    const mockRelatedQuestions = [
      {
        id: 2,
        title: 'React Context vs Redux: When to use which?',
        answerCount: 7,
        votes: 24,
        views: 1890,
        createdAt: '2025-01-08T10:00:00Z',
        tags: ['react', 'redux', 'context']
      },
      {
        id: 3,
        title: 'Best practices for useEffect cleanup in React',
        answerCount: 5,
        votes: 18,
        views: 1245,
        createdAt: '2025-01-09T14:30:00Z',
        tags: ['react', 'hooks', 'useeffect']
      },
      {
        id: 4,
        title: 'How to optimize React component re-renders?',
        answerCount: 9,
        votes: 31,
        views: 2156,
        createdAt: '2025-01-07T16:45:00Z',
        tags: ['react', 'performance', 'optimization']
      },
      {
        id: 5,
        title: 'Testing React hooks with React Testing Library',
        answerCount: 4,
        votes: 15,
        views: 987,
        createdAt: '2025-01-06T11:20:00Z',
        tags: ['react', 'testing', 'hooks']
      }
    ];

    setRelatedQuestions(mockRelatedQuestions);
  }, []);

  // Sort answers based on selected criteria
  const sortedAnswers = React.useMemo(() => {
    const sorted = [...answers];
    
    switch (sortBy) {
      case 'votes':
        return sorted.sort((a, b) => {
          // Accepted answer always first
          if (a.isAccepted && !b.isAccepted) return -1;
          if (!a.isAccepted && b.isAccepted) return 1;
          // Then by votes
          return b.votes - a.votes;
        });
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'activity':
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
    setQuestion(prev => {
      if (!prev) return prev;
      
      let newVotes = prev.votes;
      let newUserVote = voteType;
      
      if (prev.userVote === voteType) {
        // Remove vote
        newUserVote = null;
        newVotes += voteType === 'up' ? -1 : 1;
      } else if (prev.userVote) {
        // Change vote
        newVotes += voteType === 'up' ? 2 : -2;
      } else {
        // New vote
        newVotes += voteType === 'up' ? 1 : -1;
      }
      
      return {
        ...prev,
        votes: newVotes,
        userVote: newUserVote
      };
    });
  };

  // Handle answer voting
  const handleAnswerVote = (answerId, voteType) => {
    setAnswers(prev => prev.map(answer => {
      if (answer.id !== answerId) return answer;
      
      let newVotes = answer.votes;
      let newUserVote = voteType;
      
      if (answer.userVote === voteType) {
        // Remove vote
        newUserVote = null;
        newVotes += voteType === 'up' ? -1 : 1;
      } else if (answer.userVote) {
        // Change vote
        newVotes += voteType === 'up' ? 2 : -2;
      } else {
        // New vote
        newVotes += voteType === 'up' ? 1 : -1;
      }
      
      return {
        ...answer,
        votes: newVotes,
        userVote: newUserVote
      };
    }));
  };

  // Handle answer acceptance
  const handleAnswerAccept = (answerId) => {
    setAnswers(prev => prev.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId
    })));
    
    setQuestion(prev => ({
      ...prev,
      acceptedAnswerAt: new Date().toISOString()
    }));
  };

  // Handle bookmark
  const handleBookmark = (questionId, isBookmarked) => {
    setQuestion(prev => ({
      ...prev,
      isBookmarked
    }));
  };

  // Handle follow
  const handleFollow = (questionId, isFollowing) => {
    setQuestion(prev => ({
      ...prev,
      isFollowing,
      followers: prev.followers + (isFollowing ? 1 : -1)
    }));
  };

  // Handle share
  const handleShare = (question) => {
    if (navigator.share) {
      navigator.share({
        title: question.title,
        url: window.location.href
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
      author: currentUser,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setAnswers(prev => prev.map(answer => {
      if (answer.id === answerId) {
        return {
          ...answer,
          comments: [...(answer.comments || []), newComment],
          commentCount: (answer.commentCount || 0) + 1
        };
      }
      return answer;
    }));
  };

  // Handle answer submission
  const handleAnswerSubmit = async (content) => {
    if (!currentUser) return;

    setIsSubmittingAnswer(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAnswer = {
        id: Date.now(),
        content,
        author: currentUser,
        createdAt: new Date().toISOString(),
        votes: 0,
        userVote: null,
        isAccepted: false,
        commentCount: 0,
        comments: []
      };

      setAnswers(prev => [...prev, newAnswer]);
      setQuestion(prev => ({
        ...prev,
        answerCount: prev.answerCount + 1
      }));
      setShowAnswerEditor(false);
    } catch (error) {
      console.error('Failed to submit answer:', error);
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
                  <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium text-card-foreground mb-2">No answers yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to answer this question!</p>
                  {currentUser && (
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
            {showAnswerEditor && currentUser && (
              <AnswerEditor
                onSubmit={handleAnswerSubmit}
                onCancel={() => setShowAnswerEditor(false)}
                isSubmitting={isSubmittingAnswer}
                currentUser={currentUser}
              />
            )}

            {/* Add Answer Button */}
            {!showAnswerEditor && currentUser && answers.length > 0 && (
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

            {/* Login Prompt for Guests */}
            {!currentUser && (
              <div className="text-center py-8 bg-card border rounded-lg">
                <Icon name="User" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">Want to answer?</h3>
                <p className="text-muted-foreground mb-4">Sign in to share your knowledge and help the community.</p>
                <Button
                  onClick={() => window.location.href = '/user-registration'}
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
      {currentUser && !showAnswerEditor && (
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