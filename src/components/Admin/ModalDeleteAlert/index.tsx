import React from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { CiCircleRemove } from 'react-icons/ci';
import ButtonAction from '@/components/Admin/ButtonAction';

type ModalDeleteAlertProps = {
    title?: string;
    content?: string | React.ReactNode;
    onConfirm: () => Promise<void>;
    onClose: () => void;
    isOpen: boolean;
}

const ModalDeleteAlert = ({
                              title = 'Xác nhận xóa?',
                              content = 'Bạn có chắc chắn muốn xóa mục này không?',
                              onClose,
                              isOpen,
                              onConfirm,
                          }: ModalDeleteAlertProps) => {
    if (!isOpen) return null;
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
                    <CiCircleRemove size={70} className="text-red-500" />
                </div>
                <div className="text-center text-xl font-medium mt-2">
                    {title}
                </div>
                <p className="text-center text-sm">
                    {content}
                </p>
                <div>
                    <div className="flex justify-center items-center gap-3 mt-4">
                        <ButtonAction.Cancel  onClick={onClose} />
                        <ButtonAction.SubmitDelete onClick={onConfirm} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalDeleteAlert;