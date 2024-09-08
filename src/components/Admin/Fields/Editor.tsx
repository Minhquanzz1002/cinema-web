import React, {useRef, useState} from 'react';
import JoditEditor from "jodit-react";

const Editor = () => {
    const editor = useRef(null);
    const [content, setContent] = useState<string>('');
    const config = {
        readonly: false,
        placeholder: "",
        removeButtons: ["print", "spellcheck", "symbols", "ai-commands", "paragraph", "preview", "speechRecognize", "eraser"],
        height: "300px",
    }

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