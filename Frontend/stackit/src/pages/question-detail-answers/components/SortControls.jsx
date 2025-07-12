import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortControls = ({ sortBy, onSortChange, answerCount }) => {
  const sortOptions = [
    {
      value: 'votes',
      label: 'Highest Score',
      icon: 'TrendingUp',
      description: 'Sort by vote count'
    },
    {
      value: 'newest',
      label: 'Newest',
      icon: 'Clock',
      description: 'Most recent first'
    },
    {
      value: 'oldest',
      label: 'Oldest',
      icon: 'Calendar',
      description: 'Oldest first'
    },
    {
      value: 'activity',
      label: 'Activity',
      icon: 'Activity',
      description: 'Most recently active'
    }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Answer Count */}
      <div className="flex items-center space-x-2">
        <Icon name="MessageSquare" size={18} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          {answerCount} {answerCount === 1 ? 'Answer' : 'Answers'}
        </h2>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground hidden sm:block">Sort by:</span>
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => onSortChange(option.value)}
              iconName={option.icon}
              iconPosition="left"
              iconSize={14}
              className="h-8"
              title={option.description}
            >
              <span className="hidden sm:inline">{option.label}</span>
              <span className="sm:hidden">
                <Icon name={option.icon} size={16} />
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortControls;