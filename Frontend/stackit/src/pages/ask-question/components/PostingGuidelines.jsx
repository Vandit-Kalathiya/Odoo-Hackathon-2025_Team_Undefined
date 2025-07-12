import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PostingGuidelines = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const guidelines = [
    {
      icon: 'Search',
      title: 'Search first',
      description: 'Check if your question has already been asked and answered'
    },
    {
      icon: 'FileText',
      title: 'Be specific',
      description: 'Include relevant details, error messages, and what you\'ve tried'
    },
    {
      icon: 'Code',
      title: 'Show your code',
      description: 'Include minimal, complete, and verifiable examples'
    },
    {
      icon: 'Tag',
      title: 'Use proper tags',
      description: 'Add relevant tags to help others find and answer your question'
    },
    {
      icon: 'MessageSquare',
      title: 'Clear title',
      description: 'Write a title that summarizes the specific problem'
    },
    {
      icon: 'CheckCircle',
      title: 'Accept answers',
      description: 'Mark the best answer as accepted to help future visitors'
    }
  ];

  const tips = [
    'Include what you expected to happen',
    'Describe what actually happened instead',
    'Show any error messages you received',
    'Mention what you\'ve already tried',
    'Keep your question focused on one problem'
  ];

  return (
    <div className={`bg-card border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center">
          <Icon name="HelpCircle" size={20} className="mr-2 text-primary" />
          How to ask a good question
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconSize={16}
          className="lg:hidden"
        >
          {isExpanded ? 'Hide' : 'Show'} tips
        </Button>
      </div>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="space-y-3">
          {guidelines.map((guideline, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name={guideline.icon} size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-card-foreground">{guideline.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{guideline.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-card-foreground mb-3">Writing tips</h4>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={16} className="text-warning mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Pro tip</p>
              <p className="text-sm text-muted-foreground mt-1">
                Questions with code examples and clear problem descriptions get answered 3x faster!
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/questions-dashboard'}
            iconName="ArrowLeft"
            iconSize={14}
          >
            Browse questions
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://stackoverflow.com/help/how-to-ask', '_blank')}
            iconName="ExternalLink"
            iconSize={14}
          >
            More help
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostingGuidelines;