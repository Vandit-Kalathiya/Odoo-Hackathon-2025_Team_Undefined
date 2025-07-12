import React, { useState, useRef, useEffect } from "react";
import Button from "../../../components/ui/Button";

const RichTextEditor = ({
  content,
  onChange,
  error,
  placeholder = "Describe your question in detail...",
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🔥", "💡", "✅", "❌", "⚠️", "📝", "💻", "🚀", "🎉"];

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || "";
    }
  }, [content]);

  const formatText = (command, value = null) => {
    editorRef.current?.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    if (command === "insertUnorderedList" || command === "insertOrderedList") {
      const success = document.execCommand(command, false, null);

      if (!success) {
        const tag = command === "insertUnorderedList" ? "ul" : "ol";
        const wrapper = document.createElement(tag);
        const li = document.createElement("li");
        li.textContent = "List item";
        wrapper.appendChild(li);

        range.deleteContents();
        range.insertNode(wrapper);

        const newRange = document.createRange();
        newRange.setStart(li.firstChild, li.firstChild.length);
        newRange.collapse(true);

        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      document.execCommand(command, false, value);
    }

    onChange(editorRef.current.innerHTML);
  };

  const insertHTMLAtCursor = (html) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const fragment = range.createContextualFragment(html);
    range.insertNode(fragment);

    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    editorRef.current?.focus();
    onChange(editorRef.current.innerHTML);
  };

  const insertEmoji = (emoji) => {
    insertHTMLAtCursor(emoji);
    setShowEmojiPicker(false);
  };

  const insertLink = () => {
    if (!linkUrl || !linkText) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const anchor = document.createElement("a");
    anchor.href = linkUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = linkText;

    range.insertNode(anchor);
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);

    editorRef.current?.focus();
    onChange(editorRef.current.innerHTML);

    setShowLinkDialog(false);
    setLinkUrl("");
    setLinkText("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgHtml = `<img src="${e.target.result}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
        insertHTMLAtCursor(imgHtml);
      };
      reader.readAsDataURL(file);
    }
  };

  const getPreviewContent = () => ({
    __html: content || '<p class="text-muted-foreground">Nothing to preview yet...</p>',
  });

  const toolbarButtons = [
    { icon: "Bold", command: "bold", tooltip: "Bold (Ctrl+B)" },
    { icon: "Italic", command: "italic", tooltip: "Italic (Ctrl+I)" },
    { icon: "Strikethrough", command: "strikethrough", tooltip: "Strikethrough" },
    { icon: "List", command: "insertUnorderedList", tooltip: "Bullet List" },
    { icon: "ListOrdered", command: "insertOrderedList", tooltip: "Numbered List" },
    { icon: "AlignLeft", command: "justifyLeft", tooltip: "Align Left" },
    { icon: "AlignCenter", command: "justifyCenter", tooltip: "Align Center" },
    { icon: "AlignRight", command: "justifyRight", tooltip: "Align Right" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Question Details <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center space-x-2">
          <Button
            variant={isPreviewMode ? "ghost" : "outline"}
            size="sm"
            onClick={() => setIsPreviewMode(false)}
            iconName="Edit"
            iconSize={14}
          >
            Write
          </Button>
          <Button
            variant={isPreviewMode ? "outline" : "ghost"}
            size="sm"
            onClick={() => setIsPreviewMode(true)}
            iconName="Eye"
            iconSize={14}
          >
            Preview
          </Button>
        </div>
      </div>

      {!isPreviewMode && (
        <div className="border rounded-lg overflow-hidden bg-background">
          <div className="border-b bg-muted/30 p-2">
            <div className="flex flex-wrap items-center gap-1">
              {toolbarButtons.map((button) => (
                <Button
                  key={button.command}
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText(button.command)}
                  iconName={button.icon}
                  iconSize={16}
                  className="h-8 w-8 p-0"
                  title={button.tooltip}
                />
              ))}

              <div className="w-px h-6 bg-border mx-1" />

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  iconName="Smile"
                  iconSize={16}
                  className="h-8 w-8 p-0"
                  title="Insert Emoji"
                />
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-popover border rounded-lg shadow-lg p-2 z-10">
                    <div className="grid grid-cols-8 gap-1 w-64">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => insertEmoji(emoji)}
                          className="p-1 hover:bg-muted rounded text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLinkDialog(true)}
                iconName="Link"
                iconSize={16}
                className="h-8 w-8 p-0"
                title="Insert Link"
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                iconName="Image"
                iconSize={16}
                className="h-8 w-8 p-0"
                title="Upload Image"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div
            ref={editorRef}
            contentEditable
            className="min-h-[300px] p-4 focus:outline-none"
            style={{ minHeight: "300px" }}
            onInput={() => onChange(editorRef.current?.innerHTML || "")}
            data-placeholder={placeholder}
          />
        </div>
      )}

      {isPreviewMode && (
        <div className="border rounded-lg p-4 min-h-[300px] bg-background">
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={getPreviewContent()} />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-sm text-muted-foreground">
        Include all the information someone would need to answer your question.
        Use formatting to make your question easier to read.
      </p>

      {showLinkDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-popover border rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowLinkDialog(false);
                    setLinkUrl("");
                    setLinkText("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={insertLink} disabled={!linkUrl || !linkText}>
                  Insert Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
