import { LuTrash } from 'react-icons/lu';
import React, { MouseEventHandler } from 'react';
import { FaEdit, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { FaFileImport, FaPlus } from 'react-icons/fa6';
import { RiFileExcel2Line, RiRefund2Line } from 'react-icons/ri';

type DeleteButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}

type UpdateButtonProps = {
    href?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}

type ViewButtonProps = {
    href?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>
}

type RefundButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>
}

type AddButtonProps = {
    text?: string;
    href?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>
}

type ImportButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>
}

type ExportButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>
}

type SubmitButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    text?: string;
    isLoading?: boolean;
}

type SubmitDeleteButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>
}

type CancelButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>
}

type ConfirmButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>
}

const ButtonAction = {
    Delete: ({ onClick, disabled }: DeleteButtonProps) => {
        return (
            <button type="button" disabled={disabled} onClick={onClick} className="text-red-400 hover:text-red-600"
                    title="Xóa">
                <LuTrash size={18} />
            </button>
        );
    },
    Update: ({ href = '#', onClick, disabled }: UpdateButtonProps) => {
        if (onClick) {
            return (
                <button type="button" onClick={onClick} disabled={disabled}
                        className="text-blue-400 hover:text-blue-600" title="Chỉnh sửa">
                    <FaEdit size={18} />
                </button>
            );
        }
        return (
            <Link href={href} type="button" className="text-blue-400 hover:text-blue-600" title="Chỉnh sửa">
                <FaEdit size={18} />
            </Link>
        );
    },
    View: ({ href = '#', onClick }: ViewButtonProps) => {
        if (onClick) {
            return (
                <button type="button" onClick={onClick} className="text-gray-400 hover:text-gray-600" title="Chi tiết">
                    <FaEye size={18} />
                </button>
            );
        }
        return (
            <Link href={href} type="button" title="Chi tiết" className="text-gray-400 hover:text-gray-600">
                <FaEye size={18} />
            </Link>
        );
    },
    Refund: ({ onClick }: RefundButtonProps) => {
        return (
            <button type="button" onClick={onClick} className="text-blue-400 hover:text-blue-600" title="Hoàn trả">
                <RiRefund2Line size={18} />
            </button>
        );

    },
    Add: ({ href = '#', onClick, text = 'Thêm' }: AddButtonProps) => {
        if (onClick) {
            return (
                <button type="button" onClick={onClick}
                        className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                    <FaPlus className="h-4 w-4" /> {text}
                </button>
            );
        }
        return (
            <Link href={href}
                  className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                <FaPlus className="h-4 w-4" /> {text}
            </Link>
        );
    },
    Import: ({ onClick }: ImportButtonProps) => {
        return (
            <button type="button"
                    onClick={onClick}
                    className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                <FaFileImport className="h-4 w-4" /> Import
            </button>
        );
    },
    Export: ({ onClick }: ExportButtonProps) => {
        return (
            <button type="button"
                    onClick={onClick}
                    className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                <RiFileExcel2Line className="h-5 w-5" /> Export
            </button>
        );
    },
    Submit: ({ onClick, text = 'Xác nhận', isLoading = false }: SubmitButtonProps) => {
        return (
            <button
                className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm"
                disabled={isLoading}
                onClick={onClick} type="submit">
                {isLoading ? 'Đang xử lý...' : text}
            </button>
        );
    },
    SubmitDelete: ({ onClick }: SubmitDeleteButtonProps) => {
        return (
            <button
                className="bg-red-500 py-1.5 px-3 min-w-14 rounded flex items-center justify-center text-white gap-x-2 text-sm"
                onClick={onClick} type="button">Xóa</button>
        );
    },
    Cancel: ({ onClick }: CancelButtonProps) => {
        return (
            <button
                className="bg-smoke-300 py-1.5 px-2 rounded flex items-center justify-center text-gray-800 gap-x-2 text-sm"
                onClick={onClick} type="button"
            >
                Hủy
            </button>
        );
    },
    Confirm: ({ onClick }: ConfirmButtonProps) => {
        return (
            <button
                className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm"
                onClick={onClick} type="button">Xác nhận</button>
        );
    },
};

export default ButtonAction;