import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnswerEditor = ({ onSubmit, onCancel, isSubmitting = false, currentUser }) => {
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const editorRef = useRef(null);

  const toolbarButtons = [
    { name: 'Bold', icon: 'Bold', command: 'bold' },
    { name: 'Italic', icon: 'Italic', command: 'italic' },
    { name: 'Strikethrough', icon: 'Strikethrough', command: 'strikethrough' },
    { name: 'Separator', type: 'separator' },
    { name: 'Numbered List', icon: 'ListOrdered', command: 'insertOrderedList' },
    { name: 'Bullet List', icon: 'List', command: 'insertUnorderedList' },
    { name: 'Separator', type: 'separator' },
    { name: 'Link', icon: 'Link', command: 'createLink' },
    { name: 'Image', icon: 'Image', command: 'insertImage' },
    { name: 'Separator', type: 'separator' },
    { name: 'Align Left', icon: 'AlignLeft', command: 'justifyLeft' },
    { name: 'Align Center', icon: 'AlignCenter', command: 'justifyCenter' },
    { name: 'Align Right', icon: 'AlignRight', command: 'justifyRight' }
  ];

  const handleToolbarClick = (command) => {
    if (!editorRef.current) return;

    editorRef.current.focus();

    if (command === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else if (command === 'insertImage') {
      const url = prompt('Enter image URL:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else {
      document.execCommand(command, false, null);
    }

    // Update content state
    setContent(editorRef.current.innerHTML);
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit?.(content);
  };

  const insertEmoji = (emoji) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, emoji);
      setContent(editorRef.current.innerHTML);
    }
  };

  const commonEmojis = ['😀', '😊', '👍', '👎', '❤️', '🎉', '🤔', '💡', '⚡', '🔥'];

  const renderPreview = () => {
    return (
      <div className="min-h-[200px] p-4 border rounded-lg bg-muted/30">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content || '<p class="text-muted-foreground">Nothing to preview yet...</p>' }}
        />
      </div>
    );
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">Your Answer</h3>
        <p className="text-sm text-muted-foreground">
          Share your knowledge and help the community by providing a detailed answer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Editor Tabs */}
        <div className="flex items-center space-x-1 border-b">
          <Button
            type="button"
            variant={!isPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsPreview(false)}
            className="rounded-b-none"
          >
            Write
          </Button>
          <Button
            type="button"
            variant={isPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsPreview(true)}
            className="rounded-b-none"
          >
            Preview
          </Button>
        </div>

        {!isPreview ? (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 rounded-lg border">
              {toolbarButtons.map((button, index) => (
                button.type === 'separator' ? (
                  <div key={index} className="w-px h-6 bg-border mx-1" />
                ) : (
                  <Button
                    key={button.command}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarClick(button.command)}
                    className="h-8 w-8 p-0"
                    title={button.name}
                  >
                    <Icon name={button.icon} size={14} />
                  </Button>
                )
              ))}
              
              {/* Emoji Picker */}
              <div className="relative group">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Insert Emoji"
                >
                  <Icon name="Smile" size={14} />
                </Button>
                <div className="absolute top-full left-0 mt-1 p-2 bg-popover border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="grid grid-cols-5 gap-1">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="w-8 h-8 text-lg hover:bg-muted rounded transition-colors duration-150"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleContentChange}
              className="min-h-[200px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              style={{ whiteSpace: 'pre-wrap' }}
              data-placeholder="Write your answer here... Use the toolbar above for formatting."
            />
          </>
        ) : (
          renderPreview()
        )}

        {/* Guidelines */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-card-foreground mb-2">Answer Guidelines:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Provide clear, detailed explanations</li>
            <li>• Include code examples when relevant</li>
            <li>• Reference credible sources</li>
            <li>• Be respectful and constructive</li>
            <li>• Use @username to mention other users</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              loading={isSubmitting}
              iconName="Send"
              iconPosition="left"
              iconSize={16}
            >
              Post Answer
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{content.replace(/<[^>]*>/g, '').length}</span> characters
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnswerEditor;