import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Input from './Input';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Mock search suggestions
  const mockSuggestions = [
    {
      type: 'question',
      title: 'How to implement React hooks?',
      tags: ['react', 'hooks', 'javascript'],
      answers: 5,
      votes: 12
    },
    {
      type: 'question',
      title: 'Best practices for state management',
      tags: ['react', 'state', 'redux'],
      answers: 8,
      votes: 24
    },
    {
      type: 'tag',
      name: 'react',
      count: 1250,
      description: 'A JavaScript library for building user interfaces'
    },
    {
      type: 'tag',
      name: 'javascript',
      count: 2100,
      description: 'High-level programming language'
    },
    {
      type: 'user',
      name: 'John Developer',
      reputation: 1520,
      avatar: '/assets/images/avatar.jpg'
    }
  ];

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simulate search API call
  useEffect(() => {
    if (query.length > 1) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const filtered = mockSuggestions.filter(item => {
          if (item.type === 'question') {
            return item.title.toLowerCase().includes(query.toLowerCase()) ||
                   item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
          } else if (item.type === 'tag') {
            return item.name.toLowerCase().includes(query.toLowerCase());
          } else if (item.type === 'user') {
            return item.name.toLowerCase().includes(query.toLowerCase());
          }
          return false;
        });
        setSuggestions(filtered.slice(0, 6));
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      window.location.href = `/questions-dashboard?search=${encodeURIComponent(searchQuery.trim())}`;
      setIsExpanded(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'question') {
      window.location.href = '/question-detail-answers';
    } else if (suggestion.type === 'tag') {
      window.location.href = `/questions-dashboard?tag=${suggestion.name}`;
    } else if (suggestion.type === 'user') {
      window.location.href = '/user-profile';
    }
    setIsExpanded(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setSuggestions([]);
      inputRef.current?.blur();
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'question': return 'MessageSquare';
      case 'tag': return 'Tag';
      case 'user': return 'User';
      default: return 'Search';
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search questions, tags, users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4"
        />
        <Icon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {isExpanded && (query.length > 1 || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-muted-foreground">Searching...</span>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors duration-150 flex items-start space-x-3"
                >
                  <Icon 
                    name={getSuggestionIcon(suggestion.type)} 
                    size={16} 
                    className="text-muted-foreground mt-0.5 flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    {suggestion.type === 'question' && (
                      <>
                        <p className="text-sm font-medium text-popover-foreground truncate">
                          {suggestion.title}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {suggestion.answers} answers
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {suggestion.votes} votes
                          </span>
                          <div className="flex items-center space-x-1">
                            {suggestion.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {suggestion.type === 'tag' && (
                      <>
                        <p className="text-sm font-medium text-popover-foreground">
                          #{suggestion.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {suggestion.count} questions • {suggestion.description}
                        </p>
                      </>
                    )}
                    {suggestion.type === 'user' && (
                      <>
                        <p className="text-sm font-medium text-popover-foreground">
                          {suggestion.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {suggestion.reputation} reputation
                        </p>
                      </>
                    )}
                  </div>
                </button>
              ))}
              
              {query.trim() && (
                <div className="border-t mt-2 pt-2">
                  <button
                    onClick={() => handleSearch()}
                    className="w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors duration-150 flex items-center space-x-3"
                  >
                    <Icon name="Search" size={16} className="text-primary" />
                    <span className="text-sm text-primary font-medium">
                      Search for "{query}"
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : query.length > 1 ? (
            <div className="p-4 text-center">
              <Icon name="Search" size={32} className="mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No results found</p>
              <button
                onClick={() => handleSearch()}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Search anyway
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;