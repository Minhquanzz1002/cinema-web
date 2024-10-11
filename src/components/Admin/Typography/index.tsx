import React from 'react';

type TypographyTitleProps = {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children: React.ReactNode;
    style?: React.CSSProperties;
};

const Typography = {
    Title: ({ level, children, style }: TypographyTitleProps) => {
        const baseStyles = 'text-brand-500 dark:text-white font-nunito mb-3';
        const styles = {
            1: 'text-4xl',
            2: 'text-3xl',
            3: 'text-2xl',
            4: 'text-xl',
            5: 'text-lg',
            6: 'text-base',
        };

        const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
        return (
            <Tag className={`${styles[level]} ${baseStyles}`} style={style}>{children}</Tag>
        );
    },
    Text: () => {

    },
};

export default Typography;