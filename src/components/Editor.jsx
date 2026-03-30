import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import {
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  Link2,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  ListOrdered,
  MessageSquareX,
} from "lucide-react";

export default function Editor({
  content,
  setContent,
  autoFocus = false,
  placeholder = "Tell your story...",
  darkMode = false, // <-- new prop for theme
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      localStorage.setItem("draft", editor.getHTML());
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("draft");
    if (saved && editor && !content) {
      editor.commands.setContent(saved);
    }
  }, [editor, content]);

  if (!editor) return null;

  const btn = (active) => ({
    ...styles.button,
    background: active ? (darkMode ? "#333" : "#e2e6ea") : "transparent",
    color: darkMode ? "#eee" : "#444",
  });

  const setLink = () => {
    const url = prompt("Enter URL");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div
      style={{
        ...styles.wrapper,
        background: darkMode ? "#111" : "#fff",
      }}
    >
      {/* TOOLBAR */}
      <div
        style={{
          ...styles.toolbar,
          borderBottom: darkMode ? "1px solid #444" : "1px solid #e5e7eb",
          background: darkMode ? "#1a1a1a" : "#f8f9fa",
        }}
      >
        <button
          style={btn(editor.isActive("bold"))}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
        >
          <Bold />
        </button>

        <button
          style={btn(editor.isActive("italic"))}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
        >
          <Italic />
        </button>

        <div style={styles.divider} />

        {/* HEADINGS */}
        <button
          style={btn(editor.isActive("heading", { level: 1 }))}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
        >
          <Heading1 />
        </button>

        <button
          style={btn(editor.isActive("heading", { level: 2 }))}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        >
          <Heading2 />
        </button>

        <button
          style={btn(editor.isActive("heading", { level: 3 }))}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
        >
          <Heading3 />
        </button>

        <div style={styles.divider} />

        {/* ALIGNMENT */}
        <button
          style={btn(editor.isActive({ textAlign: "left" }))}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("left").run();
          }}
        >
          <TextAlignStart />
        </button>

        <button
          style={btn(editor.isActive({ textAlign: "center" }))}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("center").run();
          }}
        >
          <TextAlignCenter />
        </button>

        <button
          style={btn(editor.isActive({ textAlign: "right" }))}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("right").run();
          }}
        >
          <TextAlignEnd />
        </button>

        <div style={styles.divider} />

        {/* LISTS */}
        <button
          style={btn(editor.isActive("bulletList"))}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
        >
          •
        </button>

        <button
          style={btn(editor.isActive("orderedList"))}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
        >
          <ListOrdered />
        </button>

        <div style={styles.divider} />

        {/* LINK */}
        <button
          style={btn(editor.isActive("link"))}
          onClick={(e) => {
            e.preventDefault();
            setLink();
          }}
        >
          <Link2 />
        </button>

        <button
          style={btn(false)}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().unsetLink().run();
          }}
        >
          <MessageSquareX />
        </button>

        <div style={styles.divider} />

        {/* HISTORY */}
        <button
          style={btn(false)}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
        >
          <Undo2 />
        </button>

        <button
          style={btn(false)}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
        >
          <Redo2 />
        </button>
      </div>

      {/* EDITOR CONTENT */}
      <EditorContent
        editor={editor}
        style={{
          ...styles.editor,
          background: darkMode ? "#111" : "#fff",
          color: darkMode ? "#eee" : "#111",
        }}
      />

      {/* PLACEHOLDER CSS */}
      <style>
        {`
        .ProseMirror p.is-empty::before {
          content: attr(data-placeholder);
          color: ${darkMode ? "#888" : "#9ca3af"};
        }

        .ProseMirror {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }

        .ProseMirror:focus {
          outline: none !important;
        }

        button:hover {
          background: ${darkMode ? "#333" : "#e9ecef"};
        }

        button:active {
          background: ${darkMode ? "#555" : "#dee2e6"};
        }
      `}
      </style>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    borderRadius: "6px",
    overflow: "hidden",
    background: "#fff",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "4px",
    padding: "6px 8px",
    borderBottom: "1px solid #e5e7eb",
  },
  button: {
    border: "none",
    background: "transparent",
    padding: "4px 6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#444",
    borderRadius: "3px",
    minWidth: "28px",
  },
  divider: {
    width: "1px",
    height: "18px",
    background: "#ddd",
    margin: "0 6px",
  },
  editor: {
    padding: "14px",
    minHeight: "220px",
    outline: "none",
    fontSize: "15px",
    lineHeight: "1.6",
    fontFamily: "Georgia, serif",
  },
};
