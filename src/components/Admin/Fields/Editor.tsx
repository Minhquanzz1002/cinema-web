"use client";
import React, {useRef, useState} from 'react';
import dynamic from 'next/dynamic';
// import JoditEditor from "jodit-react";
const JoditEditor = dynamic(() => import("jodit-react"), {ssr: false});

const Editor = () => {
    const editor = useRef(null);
    const [content, setContent] = useState<string>('');
    const config = {
        readonly: false,
        placeholder: "",
        removeButtons: ["print", "spellcheck", "symbols", "ai-commands", "paragraph", "preview", "speechRecognize", "eraser"],
        height: "300px",
    };

    return (
        <div>
            <JoditEditor
                value={content}
                ref={editor}
                config={config}
                onBlur={(newContent: string) => setContent(newContent)}
            />
        </div>
    );
};

export default Editor;