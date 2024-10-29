import { useState } from 'react';
import { toast } from 'react-toastify';

interface UseDeleteModalReturn<T> {
    showDeleteModal: boolean;
    selectedData: T | null;
    openDeleteModal: (data: T) => void;
    closeDeleteModal: () => void;
    handleDelete: () => Promise<void>;
}

interface UseDeleteModalProps<T> {
    onDelete: (data: T) => Promise<void>;
    onSuccess?: () => void;
    canDelete?: (data: T) => boolean;
    unableDeleteMessage?: string;
}

function useDeleteModal<T>({ onDelete, onSuccess, unableDeleteMessage = "Không thể xóa", canDelete } : UseDeleteModalProps<T>) : UseDeleteModalReturn<T> {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState<T | null>(null);

    const openDeleteModal = (data: T) => {
        if (canDelete && !canDelete(data)) {
            toast.error(unableDeleteMessage);
            return;
        }
        setSelectedData(data);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedData(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        if (!selectedData) return;
        try {
            await onDelete(selectedData);
            closeDeleteModal();
            onSuccess?.();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return {
        showDeleteModal,
        selectedData,
        openDeleteModal,
        closeDeleteModal,
        handleDelete,
    };

}

export default useDeleteModal;