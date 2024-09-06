import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant: "secondary" | "success" | "link";
}

const Button = (props: ButtonProps) => {
    const { children, variant, ...rest } = props;
    if (variant === "secondary") {
        return (
            <button className={`text-white bg-[#898C8D] px-4 rounded text-sm h-8 flex items-center gap-x-2 justify-center`} {...rest}>
                {children}
            </button>
        );
    }
    if (variant === "link") {
        return (
            <button
                className={`text-blue-500 rounded text-sm h-8 flex items-center gap-x-2 justify-center`} {...rest}>
                {children}
            </button>
        )
    }
    return (
        <button
            className={`text-white bg-[#4BAC4D] px-4 rounded text-sm h-8 flex items-center gap-x-2 justify-center`} {...rest}>
            {children}
        </button>
    );
};

export default Button;