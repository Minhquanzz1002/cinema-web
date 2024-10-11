import React from 'react';

type CardProps = {
    variant?: string;
    extra?: string;
    children: React.ReactNode;
    [key: string]: any;
    className?: string;
}
const Card = ({ extra = '', className = '', children, ...props }: CardProps) => {
    return (
        <div
            className={`relative flex flex-col rounded-[15px] bg-white bg-clip-border shadow-2xl dark:shadow-none dark:!bg-navy-800 dark:text-white ${props.default ? 'shadow-shadow-500' : 'shadow-shadow-100'} ${extra} ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;