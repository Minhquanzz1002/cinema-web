'use client';
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useField } from 'formik';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

type EditorProps = {
    name: string;
}

const Editor = ({ name }: EditorProps) => {
    const editor = useRef(null);
    const [field, , helpers] = useField(name);
    const config = {
        readonly: false,
        placeholder: '',
        removeButtons: ['print', 'spellcheck', 'symbols', 'ai-commands', 'paragraph', 'preview', 'speechRecognize', 'eraser'],
        height: '300px',
    };

    return (
        <div>
            <JoditEditor
                value={field.value}
                ref={editor}
                config={config}
                onBlur={(newContent: string) => helpers.setValue(newContent)}
            />
        </div>
    );
};

export default Editor;