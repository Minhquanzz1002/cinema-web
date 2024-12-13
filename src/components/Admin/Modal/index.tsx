import React, { useEffect, useRef } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import useClickOutside from '@/hook/useClickOutside';
import Typography from '@/components/Admin/Typography';

type ModalProps = {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    open: boolean;
    className?: string;
    wrapperClassName?: string;
    closeOnClickOutside?: boolean;
}

function Modal(props: ModalProps) {
    const { children, title, onClose, open, className, wrapperClassName, closeOnClickOutside = true } = props;
    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, () => {
        if (closeOnClickOutside) {
            onClose();
        }
    });

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className={`z-50 fixed inset-0 ${wrapperClassName}`}>
            <div ref={ref}
                 className={`flex flex-col shadow-xl bg-white border border-black/20 rounded-lg w-full xl:w-1/2 mx-auto md:mt-10 md-max:max-h-svh p-4 animate-fade-up animate-duration-300 animate-ease-linear ${className}`}>
                <div className="flex-none flex flex-nowrap justify-between items-center">
                    <Typography.Title level={4}>{title}</Typography.Title>
                    <button type="button" onClick={onClose}>
                        <MdOutlineClose />
                    </button>
                </div>
                <div className="md-max:overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;