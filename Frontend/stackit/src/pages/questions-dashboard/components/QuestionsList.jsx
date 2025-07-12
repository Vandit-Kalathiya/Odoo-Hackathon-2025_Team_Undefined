import React from 'react';
import QuestionCard from './QuestionCard';
import LoadingSkeleton from './LoadingSkeleton';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuestionsList = ({ 
  questions, 
  loading, 
  hasMore, 
  onLoadMore, 
  onQuestionClick, 
  onTagClick, 
  onUserClick,
  searchQuery 
}) => {
  if (loading && questions.length === 0) {
    return <LoadingSkeleton />;
  }

  if (!loading && questions.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {searchQuery ? 'No questions found' : 'No questions yet'}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {searchQuery 
            ? `No questions match your search for "${searchQuery}". Try different keywords or browse by tags.`
            : 'Be the first to ask a question and start building our knowledge base together.'
          }
        </p>
        <Button
          variant="default"
          onClick={() => window.location.href = '/ask-question'}
          iconName="Plus"
          iconPosition="left"
        >
          Ask the First Question
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onQuestionClick={onQuestionClick}
            onTagClick={onTagClick}
            onUserClick={onUserClick}
          />
        ))}
      </div>

      {/* Loading More */}
      {loading && questions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton count={6} />
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            iconName="ChevronDown"
            iconPosition="right"
            className="min-w-32"
          >
            Load More
          </Button>
        </div>
      )}

      {/* End of Results */}
      {!loading && !hasMore && questions.length > 0 && (
        <div className="text-center py-6 border-t">
          <p className="text-sm text-muted-foreground">
            You've reached the end of the questions list
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionsList;