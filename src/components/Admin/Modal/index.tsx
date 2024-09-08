import React from 'react';
import {MdOutlineClose} from "react-icons/md";

type ModalProps = {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

function Modal(props: ModalProps) {
    const {children, title, onClose} = props;
    return (
        <div className="z-50 fixed inset-0 ">
            <div className="shadow-xl bg-white border border-black/20 rounded-lg w-full xl:w-1/2 mx-auto mt-10 p-4">
                <div className="flex flex-nowrap justify-between items-center">
                    <div className="font-bold">{title}</div>
                    <button onClick={onClose}>
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