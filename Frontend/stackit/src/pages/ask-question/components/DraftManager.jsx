import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DraftManager = ({ title, content, tags, onLoadDraft, className = '' }) => {
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const DRAFT_KEY = 'ask_question_draft';

  // Load existing draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setHasDraft(true);
        setLastSaved(new Date(draft.timestamp));
      } catch (error) {
        console.error('Error loading draft:', error);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, []);

  // Auto-save draft when content changes
  useEffect(() => {
    if (title || content || tags.length > 0) {
      setIsAutoSaving(true);
      const timer = setTimeout(() => {
        saveDraft();
        setIsAutoSaving(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [title, content, tags]);

  const saveDraft = () => {
    if (title || content || tags.length > 0) {
      const draft = {
        title,
        content,
        tags,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setHasDraft(true);
      setLastSaved(new Date());
    }
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        onLoadDraft(draft);
        setLastSaved(new Date(draft.timestamp));
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setLastSaved(null);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`bg-muted/30 border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon 
            name={isAutoSaving ? "RotateCw" : "Save"} 
            size={16} 
            className={`${isAutoSaving ? 'animate-spin text-primary' : 'text-muted-foreground'}`} 
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              {isAutoSaving ? 'Auto-saving...' : 'Draft'}
            </p>
            {lastSaved && (
              <p className="text-xs text-muted-foreground">
                Last saved {formatTimeAgo(lastSaved)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasDraft && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadDraft}
                iconName="Upload"
                iconSize={14}
                className="h-8"
              >
                Load
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDraft}
                iconName="Trash2"
                iconSize={14}
                className="h-8 text-destructive hover:text-destructive"
              >
                Clear
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={saveDraft}
            iconName="Save"
            iconSize={14}
            className="h-8"
          >
            Save now
          </Button>
        </div>
      </div>

      {hasDraft && !lastSaved && (
        <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-primary">Draft available</p>
              <p className="text-sm text-muted-foreground mt-1">
                You have a saved draft. Click "Load" to restore your previous work.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftManager;