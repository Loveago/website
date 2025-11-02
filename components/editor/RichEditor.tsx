"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

export default function RichEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: ["textStyle", "listItem"] }),
      TextStyle,
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CodeBlock,
      Image,
      ListItem,
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose base-content focus:outline-none min-h-[200px]",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(value || "", false);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) editor.commands.setContent(value || "", false);
  }, [value, editor]);

  async function insertImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: form });
      if (!res.ok) return;
      const data = await res.json();
      editor?.chain().focus().setImage({ src: data.url }).run();
    };
    input.click();
  }

  if (!editor) return null;

  const isActive = (name: string, attrs?: any) => editor.isActive(name as any, attrs);
  const toggle = (fn: () => void) => () => fn();

  return (
    <div className="rounded-2xl border bg-background/70 p-2 shadow-sm">
      <div className="flex flex-wrap gap-2 border-b p-2">
        <Button variant={isActive("bold") ? "default" : "outline"} onClick={toggle(() => editor.chain().focus().toggleBold().run())}>B</Button>
        <Button variant={isActive("italic") ? "default" : "outline"} onClick={toggle(() => editor.chain().focus().toggleItalic().run())}>I</Button>
        <Button variant={isActive("underline") ? "default" : "outline"} onClick={toggle(() => editor.chain().focus().toggleUnderline().run())}>U</Button>
        <Button variant={isActive("heading", { level: 1 }) ? "default" : "outline"} onClick={toggle(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}>H1</Button>
        <Button variant={isActive("heading", { level: 2 }) ? "default" : "outline"} onClick={toggle(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}>H2</Button>
        <Button variant="outline" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Clear</Button>
        <Button variant={isActive("bulletList") ? "default" : "outline"} onClick={toggle(() => editor.chain().focus().toggleBulletList().run())}>• List</Button>
        <Button variant={isActive("orderedList") ? "default" : "outline"} onClick={toggle(() => editor.chain().focus().toggleOrderedList().run())}>1. List</Button>
        <Button variant={isActive("blockquote") ? "default" : "outline"} onClick={toggle(() => editor.chain().focus().toggleBlockquote().run())}>❝</Button>
        <Button variant={isActive("codeBlock") ? "default" : "outline"} onClick={toggle(() => editor.chain().focus().toggleCodeBlock().run())}>{"</>"}</Button>
        <Button variant="outline" onClick={() => insertImage()}>Image</Button>
      </div>
      <div className={clsx("p-3")}> 
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
