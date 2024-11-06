import React from 'react';
import { Loader2 } from 'lucide-react';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.ReactNode;
    variant?: 'primary' | 'link' | "secondary";
    isLoading?: boolean;
}

const IconButton = ({ icon, variant = 'primary', children, className = '',...props }: IconButtonProps) => {
    const baseStyle = 'h9 flex items-center justify-center rounded gap-x-2 text-sm py-1.5 px-3 font-medium';
    const styles = {
        primary: 'text-white bg-brand-500',
        link: 'text-white text-blue-500',
        secondary: 'text-gray-800 bg-smoke-300',
    };

    return (
        <button className={`${baseStyle} ${styles[variant]} ${className}`} {...props} disabled={props.disabled}>
            {props.disabled ? <><Loader2 className="animate-spin h-4 w-4 text-white" /> Đang xử lý</> : <>{icon} {children}</>}
        </button>
    );
};

export default IconButton;