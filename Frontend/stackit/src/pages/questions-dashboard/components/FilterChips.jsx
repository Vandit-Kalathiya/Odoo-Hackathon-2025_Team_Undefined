import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterChips = ({ 
  selectedTags, 
  selectedStatus, 
  selectedSort, 
  onTagFilter, 
  onStatusFilter, 
  onSortChange,
  onClearFilters 
}) => {
  const popularTags = [
    'react', 'javascript', 'python', 'java', 'css', 'html', 
    'nodejs', 'typescript', 'angular', 'vue', 'php', 'sql'
  ];

  const statusFilters = [
    { value: 'all', label: 'All Questions', icon: 'MessageSquare' },
    { value: 'unanswered', label: 'Unanswered', icon: 'HelpCircle' },
    { value: 'answered', label: 'Answered', icon: 'MessageCircle' },
    { value: 'accepted', label: 'Solved', icon: 'CheckCircle' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: 'Clock' },
    { value: 'votes', label: 'Most Voted', icon: 'TrendingUp' },
    { value: 'answers', label: 'Most Answered', icon: 'MessageSquare' },
    { value: 'trending', label: 'Trending', icon: 'Flame' }
  ];

  const hasActiveFilters = selectedTags.length > 0 || selectedStatus !== 'all' || selectedSort !== 'newest';

  return (
    <div className="space-y-4">
      {/* Status Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {statusFilters.map((status) => (
          <Button
            key={status.value}
            variant={selectedStatus === status.value ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusFilter(status.value)}
            iconName={status.icon}
            iconPosition="left"
            iconSize={14}
            className="whitespace-nowrap flex-shrink-0"
          >
            {status.label}
          </Button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {sortOptions.map((sort) => (
            <Button
              key={sort.value}
              variant={selectedSort === sort.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onSortChange(sort.value)}
              iconName={sort.icon}
              iconPosition="left"
              iconSize={14}
              className="whitespace-nowrap flex-shrink-0"
            >
              {sort.label}
            </Button>
          ))}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={14}
            className="text-destructive hover:text-destructive flex-shrink-0"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Popular Tags */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Popular Tags</h4>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagFilter(tag)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
                selectedTags.includes(tag)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              #{tag}
              {selectedTags.includes(tag) && (
                <Icon name="X" size={12} className="ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <div className="flex-1 text-sm text-muted-foreground">
            {selectedTags.length > 0 && (
              <span>Tags: {selectedTags.join(', ')} • </span>
            )}
            {selectedStatus !== 'all' && (
              <span>Status: {statusFilters.find(s => s.value === selectedStatus)?.label} • </span>
            )}
            <span>Sort: {sortOptions.find(s => s.value === selectedSort)?.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterChips;