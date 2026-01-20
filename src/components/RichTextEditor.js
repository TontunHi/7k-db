
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Youtube as YoutubeIcon, Heading1, Heading2, Quote, Undo, Redo } from 'lucide-react'

const MenuBar = ({ editor, addImage }) => {
    if (!editor) {
        return null
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const addYoutube = () => {
        const url = prompt('Enter YouTube URL')
        if (url) {
            editor.commands.setYoutubeVideo({ src: url })
        }
    }

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-secondary/10 rounded-t-lg">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('bold') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Bold"
                type="button"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('italic') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Italic"
                type="button"
            >
                <Italic size={18} />
            </button>
            <div className="w-px h-6 bg-border mx-1 self-center" />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Heading 1"
                type="button"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Heading 2"
                type="button"
            >
                <Heading2 size={18} />
            </button>
            <div className="w-px h-6 bg-border mx-1 self-center" />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Bullet List"
                type="button"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Ordered List"
                type="button"
            >
                <ListOrdered size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('blockquote') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Quote"
                type="button"
            >
                <Quote size={18} />
            </button>
            <div className="w-px h-6 bg-border mx-1 self-center" />
            <button
                onClick={setLink}
                className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('link') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Link"
                type="button"
            >
                <LinkIcon size={18} />
            </button>
            <button
                onClick={addImage}
                className="p-2 rounded hover:bg-secondary transition-colors text-muted-foreground"
                title="Image"
                type="button"
            >
                <ImageIcon size={18} />
            </button>
            <button
                onClick={addYoutube}
                className="p-2 rounded hover:bg-secondary transition-colors text-muted-foreground"
                title="YouTube"
                type="button"
            >
                <YoutubeIcon size={18} />
            </button>
            <div className="w-px h-6 bg-border mx-1 self-center" />
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-secondary transition-colors text-muted-foreground disabled:opacity-50"
                title="Undo"
                type="button"
            >
                <Undo size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-secondary transition-colors text-muted-foreground disabled:opacity-50"
                title="Redo"
                type="button"
            >
                <Redo size={18} />
            </button>
        </div>
    )
}

export default function RichTextEditor({ content, onChange, className }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Youtube.configure({
                controls: false,
                width: 480,
                height: 320,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-foreground/90 leading-relaxed',
            },
        },
        immediatelyRender: false
    })

    const addImage = () => {
        const url = window.prompt('Image URL');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    return (
        <div className={`border border-border rounded-lg bg-card overflow-hidden shadow-sm ${className}`}>
            <MenuBar editor={editor} addImage={addImage} />
            <EditorContent editor={editor} />
        </div>
    )
}
