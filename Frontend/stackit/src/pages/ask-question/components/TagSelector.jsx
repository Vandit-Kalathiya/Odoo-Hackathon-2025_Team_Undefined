import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TagSelector = ({ selectedTags, onChange, error, maxTags = 5 }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const predefinedTags = [
    { name: 'javascript', description: 'Programming language for web development', count: 2150 },
    { name: 'react', description: 'JavaScript library for building user interfaces', count: 1890 },
    { name: 'python', description: 'High-level programming language', count: 2340 },
    { name: 'html', description: 'Markup language for web pages', count: 1560 },
    { name: 'css', description: 'Style sheet language for web design', count: 1420 },
    { name: 'node.js', description: 'JavaScript runtime environment', count: 980 },
    { name: 'typescript', description: 'Typed superset of JavaScript', count: 750 },
    { name: 'vue.js', description: 'Progressive JavaScript framework', count: 650 },
    { name: 'angular', description: 'Platform for building web applications', count: 720 },
    { name: 'express', description: 'Web framework for Node.js', count: 540 },
    { name: 'mongodb', description: 'NoSQL document database', count: 480 },
    { name: 'sql', description: 'Language for managing databases', count: 890 },
    { name: 'git', description: 'Version control system', count: 670 },
    { name: 'api', description: 'Application Programming Interface', count: 1120 },
    { name: 'debugging', description: 'Process of finding and fixing bugs', count: 340 },
    { name: 'performance', description: 'Optimization and speed improvements', count: 290 },
    { name: 'security', description: 'Application and data protection', count: 380 },
    { name: 'testing', description: 'Software testing and quality assurance', count: 420 },
    { name: 'deployment', description: 'Application deployment and hosting', count: 310 },
    { name: 'mobile', description: 'Mobile app development', count: 450 }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (inputValue.length > 0) {
      const filtered = predefinedTags.filter(tag => 
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(tag.name)
      ).slice(0, 8);
      setFilteredTags(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredTags([]);
      setShowSuggestions(false);
    }
  }, [inputValue, selectedTags]);

  const addTag = (tagName) => {
    if (selectedTags.length < maxTags && !selectedTags.includes(tagName)) {
      onChange([...selectedTags, tagName]);
      setInputValue('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const customTag = inputValue.trim().toLowerCase();
      if (customTag.length >= 2 && customTag.length <= 25) {
        addTag(customTag);
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const popularTags = predefinedTags
    .filter(tag => !selectedTags.includes(tag.name))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="space-y-4" ref={containerRef}>
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Tags <span className="text-destructive">*</span>
        </label>
        
        <div className="border rounded-lg p-3 bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20"
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-destructive transition-colors"
                >
                  <Icon name="X" size={14} />
                </button>
              </span>
            ))}
          </div>
          
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => inputValue && setShowSuggestions(true)}
              placeholder={selectedTags.length === 0 ? "Add tags to describe your question (e.g., javascript, react)" : "Add another tag..."}
              disabled={selectedTags.length >= maxTags}
              className="w-full bg-transparent border-none outline-none placeholder:text-muted-foreground"
            />
            
            {showSuggestions && filteredTags.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => addTag(tag.name)}
                    className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-foreground">#{tag.name}</span>
                        <p className="text-sm text-muted-foreground mt-1">{tag.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{tag.count} questions</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-muted-foreground">
            Add up to {maxTags} tags to describe what your question is about
          </p>
          <span className="text-xs text-muted-foreground">
            {selectedTags.length}/{maxTags} tags
          </span>
        </div>
      </div>

      {/* Popular Tags */}
      {selectedTags.length < maxTags && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Popular Tags</h4>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Button
                key={tag.name}
                variant="outline"
                size="sm"
                onClick={() => addTag(tag.name)}
                className="h-8 text-xs"
              >
                #{tag.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;