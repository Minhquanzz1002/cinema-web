import React from "react";

type CardProps = {
    variant?: string;
    extra?: string;
    children: React.ReactNode;
    [key: string]: any;
}
const Card = ({variant, extra, children, ...props}: CardProps) => {
    return (
        <div
            className={`relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-2xl dark:shadow-none dark:!bg-navy-800 dark:text-white ${props.default ? 'shadow-shadow-500' : 'shadow-shadow-100'} ${extra}`} {...props}>
            {children}
        </div>
    );
};

export default Card;