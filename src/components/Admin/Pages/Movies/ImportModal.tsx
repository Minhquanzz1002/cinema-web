import React from 'react';
import Modal from "@/components/Admin/Modal";

type ImportModalProps = {
    onClose: () => void;
}

const ImportModal = ({onClose} : ImportModalProps) => {
    return (
        <Modal title="" onClose={onClose}>
            <div className="font-semibold">
                Nhập từ file nhập liệu
                <span className="font-normal text-xs"> (Tải về file mẫu: <button>Excel file</button>)</span>
            </div>
        </Modal>
    );
};

export default ImportModal;