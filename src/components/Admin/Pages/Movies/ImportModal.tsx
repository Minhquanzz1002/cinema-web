import React, {useRef, useState} from 'react';
import Modal from "@/components/Admin/Modal";
import {MdOutlineClose} from "react-icons/md";

type ImportModalProps = {
    onClose: () => void;
}

const ImportModal = ({onClose} : ImportModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <Modal open={true} title="" onClose={onClose}>
            <div className="font-semibold tracking-wide">
                Nhập từ file nhập liệu
                <span className="font-normal text-xs tracking-wide"> (Tải về file mẫu: <button className="text-blue-500">Excel file</button>)</span>
            </div>
            <div className="flex justify-end items-center">
                <button className="btn-default" onClick={handleFileSelect}>
                    Chọn file dữ liệu
                </button>
                <input type="file" hidden={true} ref={fileInputRef} onChange={handleFileChange} accept=".xls,.xlsx"/>
            </div>
            {
                selectedFile && (
                    <div className="bg-[#EBF7FB] rounded border border-[#c1e8f5] text-sm mt-3 flex items-center justify-between h-9 px-3">
                        {selectedFile.name}
                        <button onClick={() => setSelectedFile(null)}>
                            <MdOutlineClose className="text-red-500"/>
                        </button>
                    </div>
                )
            }
        </Modal>
    );
};

export default ImportModal;