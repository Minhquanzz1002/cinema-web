import React from 'react';
import Link from '@/components/Link';

type SquareButtonProps = {
    children?: React.ReactNode;
    title?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    htmlType?: 'button' | 'submit' | 'reset';
    type?: 'link' | 'brand';
    href?: string;
}

const SquareButton = ({ children, title, onClick, htmlType = 'button', type = 'brand', href }: SquareButtonProps) => {
    const className = `bg-brand-500 h-9 aspect-square rounded flex items-center justify-center text-white gap-x-2 text-sm`;

    if (type === 'link' && href) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <button type={htmlType}
                onClick={onClick}
                title={title}
                className={className}>
            {children}
        </button>
    );
};

export default SquareButton;