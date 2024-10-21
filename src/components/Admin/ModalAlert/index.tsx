import React from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { CiCircleCheck, CiCircleRemove } from 'react-icons/ci';
import { PiWarningCircleThin } from 'react-icons/pi';

type ModalAlertProps = {
    onClose: () => void;
    content: string;
    footer?: React.ReactNode;
    title: string;
    type?: 'success' | 'error' | 'warning';
}

const ModalAlert = ({ onClose, content, footer, title, type = 'error' }: ModalAlertProps) => {
    return (
        <div className="z-50 fixed inset-0 bg-black/20">
            <div
                className="shadow-xl bg-white border border-black/20 rounded-lg w-full xl:w-1/3 mx-auto p-4 mt-48 animate-fade-up animate-duration-300 animate-ease-linear">
                <div className="flex flex-nowrap items-center justify-end">
                    <button onClick={onClose} type="button">
                        <MdOutlineClose />
                    </button>
                </div>
                <div className="flex justify-center">
                    {type === 'success' && <CiCircleCheck size={70} className="text-green-500" />}
                    {type === 'error' && <CiCircleRemove size={70} className="text-red-500" />}
                    {type === 'warning' && <PiWarningCircleThin size={70} className="text-yellow-500" />}
                </div>
                <div className="text-center text-xl font-medium mt-2">
                    {title}
                </div>
                <p className="text-center text-sm">
                    {content}
                </p>
                <div>
                    {footer}
                </div>
            </div>
        </div>
    );
};

export default ModalAlert;