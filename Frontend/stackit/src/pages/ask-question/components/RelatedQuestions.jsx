import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedQuestions = ({ questionTitle, className = '' }) => {
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const mockQuestions = [
    {
      id: 1,
      title: 'How to handle state in React functional components?',
      votes: 45,
      answers: 8,
      views: 1200,
      tags: ['react', 'hooks', 'state'],
      isAnswered: true,
      timeAgo: '2 hours ago'
    },
    {
      id: 2,
      title: 'React useEffect dependency array best practices',
      votes: 32,
      answers: 5,
      views: 890,
      tags: ['react', 'hooks', 'useeffect'],
      isAnswered: true,
      timeAgo: '4 hours ago'
    },
    {
      id: 3,
      title: 'Difference between useState and useReducer in React',
      votes: 28,
      answers: 3,
      views: 650,
      tags: ['react', 'hooks', 'state-management'],
      isAnswered: false,
      timeAgo: '1 day ago'
    },
    {
      id: 4,
      title: 'How to optimize React component re-renders?',
      votes: 67,
      answers: 12,
      views: 2100,
      tags: ['react', 'performance', 'optimization'],
      isAnswered: true,
      timeAgo: '2 days ago'
    },
    {
      id: 5,
      title: 'React Context vs Redux for state management',
      votes: 89,
      answers: 15,
      views: 3400,
      tags: ['react', 'context', 'redux', 'state-management'],
      isAnswered: true,
      timeAgo: '3 days ago'
    }
  ];

  useEffect(() => {
    if (questionTitle && questionTitle.length > 10) {
      setIsLoading(true);
      // Simulate API call to find related questions
      const timer = setTimeout(() => {
        const filtered = mockQuestions.filter(q => 
          q.title.toLowerCase().includes('react') || 
          q.tags.some(tag => questionTitle.toLowerCase().includes(tag))
        );
        setRelatedQuestions(filtered.slice(0, 4));
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setRelatedQuestions([]);
    }
  }, [questionTitle]);

  const handleQuestionClick = (questionId) => {
    window.location.href = '/question-detail-answers';
  };

  if (!questionTitle || questionTitle.length <= 10) {
    return (
      <div className={`bg-card border rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
          <Icon name="Search" size={20} className="mr-2 text-primary" />
          Related Questions
        </h3>
        <div className="text-center py-8">
          <Icon name="MessageSquare" size={48} className="mx-auto text-muted-foreground opacity-50 mb-4" />
          <p className="text-muted-foreground">
            Start typing your question title to see related questions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
        <Icon name="Search" size={20} className="mr-2 text-primary" />
        Related Questions
      </h3>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : relatedQuestions.length > 0 ? (
        <div className="space-y-4">
          {relatedQuestions.map((question) => (
            <div
              key={question.id}
              className="border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => handleQuestionClick(question.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-card-foreground line-clamp-2 flex-1 mr-2">
                  {question.title}
                </h4>
                {question.isAnswered && (
                  <Icon name="CheckCircle" size={16} className="text-success flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Icon name="ArrowUp" size={12} className="mr-1" />
                    {question.votes}
                  </span>
                  <span className="flex items-center">
                    <Icon name="MessageSquare" size={12} className="mr-1" />
                    {question.answers}
                  </span>
                  <span className="flex items-center">
                    <Icon name="Eye" size={12} className="mr-1" />
                    {question.views}
                  </span>
                </div>
                <span>{question.timeAgo}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {question.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => window.location.href = '/questions-dashboard'}
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={14}
            className="mt-4"
          >
            View all questions
          </Button>
        </div>
      ) : (
        <div className="text-center py-6">
          <Icon name="Search" size={32} className="mx-auto text-muted-foreground opacity-50 mb-3" />
          <p className="text-sm text-muted-foreground">
            No related questions found. Your question might be unique!
          </p>
        </div>
      )}
    </div>
  );
};

export default RelatedQuestions;