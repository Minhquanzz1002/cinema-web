import React, { useEffect, useRef } from 'react';
import {MdOutlineClose} from "react-icons/md";
import useClickOutside from '@/hook/useClickOutside';
import Typography from '@/components/Admin/Typography';

type ModalProps = {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    open: boolean;
}

function Modal(props: ModalProps) {
    const {children, title, onClose, open} = props;
    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, onClose);

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
        <div className="z-50 fixed inset-0 ">
            <div ref={ref} className="shadow-xl bg-white border border-black/20 rounded-lg w-full xl:w-1/2 mx-auto mt-10 p-4 animate-fade-up animate-duration-300 animate-ease-linear">
                <div className="flex flex-nowrap justify-between items-center">
                    <Typography.Title level={4}>{title}</Typography.Title>
                    <button type="button" onClick={onClose}>
                        <MdOutlineClose />
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;