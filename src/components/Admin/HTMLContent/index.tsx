import React from 'react';

type HtmlContentProps = {
    content: string;
}

const HTMLContent = ({ content }: HtmlContentProps) => {
    return (
        <div className="html-content" dangerouslySetInnerHTML={{ __html: content }} />
    );
};

export default HTMLContent;