// RichTextEditor.jsx or .tsx
import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Button from "../../../components/ui/Button";
import TextAlign from "@tiptap/extension-text-align";

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
  const fileInputRef = useRef(null);

  const emojis = [
    "😀",
    "😂",
    "😍",
    "🤔",
    "👍",
    "👎",
    "❤️",
    "🔥",
    "💡",
    "✅",
    "❌",
    "⚠️",
    "📝",
    "💻",
    "🚀",
    "🎉",
  ];

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[300px] p-4 focus:outline-none",
        placeholder,
      },
    },
  });

  const insertEmoji = (emoji) => {
    editor?.chain().focus().insertContent(emoji).run();
    setShowEmojiPicker(false);
  };

  const insertLink = () => {
    if (!linkUrl || !linkText) return;
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .insertContentAt(editor.state.selection, [
        {
          type: "text",
          text: linkText,
          marks: [{ type: "link", attrs: { href: linkUrl, target: "_blank" } }],
        },
      ])
      .run();
    setShowLinkDialog(false);
    setLinkUrl("");
    setLinkText("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      editor?.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
  };

  const toolbarButtons = [
    {
      icon: "Bold",
      action: () => editor?.chain().focus().toggleBold().run(),
      tooltip: "Bold",
    },
    {
      icon: "Italic",
      action: () => editor?.chain().focus().toggleItalic().run(),
      tooltip: "Italic",
    },
    {
      icon: "Strikethrough",
      action: () => editor?.chain().focus().toggleStrike().run(),
      tooltip: "Strikethrough",
    },
    {
      icon: "List",
      action: () => editor?.chain().focus().toggleBulletList().run(),
      tooltip: "Bullet List",
    },
    {
      icon: "ListOrdered",
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      tooltip: "Numbered List",
    },
    {
      icon: "AlignLeft",
      action: () => editor?.chain().focus().setTextAlign("left").run(),
      tooltip: "Align Left",
    },
    {
      icon: "AlignCenter",
      action: () => editor?.chain().focus().setTextAlign("center").run(),
      tooltip: "Align Center",
    },
    {
      icon: "AlignRight",
      action: () => editor?.chain().focus().setTextAlign("right").run(),
      tooltip: "Align Right",
    },
    {
      // icon: "H1",
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      tooltip: "Heading 1",
      label: "H1",
    },
    {
      // icon: "H2",
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      tooltip: "Heading 2",
      label: "H2",
    },
    {
      action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      tooltip: "Heading 3",
      label: "H3",
    },
    {
      action: () => editor?.chain().focus().toggleHeading({ level: 4 }).run(),
      tooltip: "Heading 4",
      label: "H4",
    },
    {
      action: () => editor?.chain().focus().toggleHeading({ level: 5 }).run(),
      tooltip: "Heading 5",
      label: "H5",
    },
    {
      action: () => editor?.chain().focus().toggleHeading({ level: 6 }).run(),
      tooltip: "Heading 6",
      label: "H6",
    },
    {
      action: () => editor?.chain().focus().toggleBlockquote().run(),
      tooltip: "Blockquote",
      label: "BQ",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Question Details <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center space-x-2">
          <Button
            variant={!isPreviewMode ? "outline" : "ghost"}
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
          <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 items-center">
            {toolbarButtons.map((btn, idx) => (
              <Button
                key={idx}
                variant="ghost"
                size="sm"
                onClick={btn.action}
                iconName={btn.icon}
                iconSize={16}
                className="h-8 w-8 p-0"
                title={btn.tooltip}
              >
                {" "}
                {btn.label || (
                  <span className="sr-only">{btn.tooltip}</span>
                )}{" "}
              </Button>
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
                    {emojis.map((emoji, idx) => (
                      <button
                        key={idx}
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
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <EditorContent editor={editor} />
        </div>
      )}

      {isPreviewMode && (
        <div
          className="border rounded-lg p-4 min-h-[300px] bg-background prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              editor?.getHTML() ||
              "<p class='text-muted-foreground'>Nothing to preview yet...</p>",
          }}
        />
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
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Enter link text"
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowLinkDialog(false)}
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
