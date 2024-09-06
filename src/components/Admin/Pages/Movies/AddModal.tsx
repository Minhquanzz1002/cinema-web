import React from 'react';
import Modal from "@/components/Admin/Modal";
import Button from "@/components/Admin/Modal/Button";
import {FaCheckCircle, FaSave} from "react-icons/fa";
import {FaBan} from "react-icons/fa6";

type AddModalProps = {
    onClose: () => void;
}

const AddModal = (props : AddModalProps) => {
    const { onClose } = props;

    const onClickSave = () => {
        onClose();
    }

    return (
        <Modal title="Thêm phim" onClose={onClose}>
            <div className="flex items-center justify-end mt-2 gap-x-3">
                <Button type="button" variant="success" onClick={onClickSave}>
                    <FaSave />Lưu
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                    <FaBan/>Bỏ qua
                </Button>
            </div>
        </Modal>
    );
};

export default AddModal;