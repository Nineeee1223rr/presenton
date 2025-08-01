"use client";

import React, { useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Underline from "@tiptap/extension-underline";
import {
    Bold,
    Italic,
    Underline as UnderlinedIcon,
    Strikethrough,
    Code,
} from "lucide-react";

interface TiptapTextProps {
    content: string;
    onContentChange?: (content: string) => void;
    className?: string;
    placeholder?: string;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

const TiptapText: React.FC<TiptapTextProps> = ({
    content,
    onContentChange,
    className = "",
    placeholder = "Enter text...",
    tag = 'div',
}) => {
    const editor = useEditor({
        extensions: [StarterKit, Markdown, Underline],
        content: content || placeholder,
        editorProps: {
            attributes: {
                class: `outline-none focus:outline-none transition-all duration-200 ${className}`,
                'data-placeholder': placeholder,
            },
        },
        onBlur: ({ editor }) => {
            const markdown = editor?.storage.markdown.getMarkdown();
            if (onContentChange) {
                onContentChange(markdown);
            }
        },
        editable: true,
        immediatelyRender: false,
    });

    // Update editor content when content prop changes
    useEffect(() => {
        if (editor && content !== editor.getText()) {
            editor.commands.setContent(content || placeholder);
        }
    }, [content, editor, placeholder]);

    if (!editor) {
        return <div className={className}>{content || placeholder}</div>;
    }

    return (
        <>
            <BubbleMenu editor={editor} className='z-50' tippyOptions={{ duration: 100 }}>
                <div style={{
                    zIndex: 100
                }} className="flex text-black bg-white  rounded-lg shadow-lg p-2 gap-1 border border-gray-200 z-50">
                    <button
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${editor?.isActive("bold") ? "bg-blue-100 text-blue-600" : ""
                            }`}
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${editor?.isActive("italic") ? "bg-blue-100 text-blue-600" : ""
                            }`}
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${editor?.isActive("underline") ? "bg-blue-100 text-blue-600" : ""
                            }`}
                        title="Underline"
                    >
                        <UnderlinedIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleStrike().run()}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${editor?.isActive("strike") ? "bg-blue-100 text-blue-600" : ""
                            }`}
                        title="Strikethrough"
                    >
                        <Strikethrough className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleCode().run()}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${editor?.isActive("code") ? "bg-blue-100 text-blue-600" : ""
                            }`}
                        title="Code"
                    >
                        <Code className="h-4 w-4" />
                    </button>
                </div>
            </BubbleMenu>

            <EditorContent
                editor={editor}
                className={`tiptap-text-editor w-full`}
                style={{
                    // Ensure the editor maintains the same visual appearance
                    lineHeight: 'inherit',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    fontFamily: 'inherit',
                    color: 'inherit',
                    textAlign: 'inherit',

                }}
            />
        </>
    );
};

export default TiptapText; 