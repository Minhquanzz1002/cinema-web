import React, {useEffect, useState} from 'react';
import Modal from "@/components/Admin/Modal";
import Button from "@/components/Admin/Modal/Button";
import {FaSave} from "react-icons/fa";
import {FaBan, FaCheck, FaPlus} from "react-icons/fa6";
import Tabs, {Tab} from "@/components/Admin/Tabs";
import {Editor, InputInline, SelectField} from "@/components/Admin/Fields";
import generateSampleGenres, {Genre} from "@/variables/genre";

type AddModalProps = {
    open: boolean;
    onClose: () => void;
}

const AddModal = (props: AddModalProps) => {
    const {onClose, open} = props;
    const [genres, setGenres] = useState<Genre[]>([]);
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [genre, setGenre] = useState<string>('');

    useEffect(() => {
        setGenres(generateSampleGenres(10));
    }, []);

    const onClickSave = () => {
        onClose();
    };

    if (!open) return null;

    return (
        <Modal open={open} title="Thêm phim" onClose={onClose}>
            <Tabs defaultActiveKey="info" className="mt-3">
                <Tab title="Thông tin" activeKey="info">
                    <div className="mt-5 grid grid-cols-12 gap-x-7">
                        <div className="col-span-7">
                            <InputInline id="code" label="Mã phim" placeholder="Mã phim tự động" value={code}
                                         onChange={(e) => setCode(e.target.value)}/>
                            <InputInline id="name" label="Tên phim" value={name}
                                         onChange={(e) => setName(e.target.value)}/>
                            <SelectField label="Thể loại" dataSource={genres} value={genre}
                                         renderItem={(item) => (
                                             <div className="cursor-pointer hover:bg-gray-50 py-2 px-4 flex items-center justify-between" onClick={() => setGenre(item.name)}>
                                                 <span>{item.name}</span>
                                                 {
                                                     genre === item.name && <FaCheck className="text-blue-500"/>
                                                 }
                                             </div>
                                         )}
                                         suffix={
                                             <button className="rounded-full hover:bg-gray-50 p-1">
                                                 <FaPlus/>
                                             </button>
                                         }/>
                        </div>
                        <div className="col-span-5">
                            <InputInline type="number" min={1} max={9999} id="duration" label="Thời lượng"
                                         extraLabel="!w-20" suffix="Phút"/>
                            <InputInline id="country" label="Quốc gia" extraLabel="!w-20"/>
                            <InputInline id="age" type="number" min={3} max={18} label="Độ tuổi" extraLabel="!w-20"
                                         placeholder="Từ 3 đến 18"/>
                        </div>
                    </div>
                </Tab>
                <Tab title="Mô tả chi tiết" activeKey="desc">
                    <Editor/>
                </Tab>
            </Tabs>
            <div className="flex items-center justify-end mt-2 gap-x-3">
                <Button type="button" variant="success" onClick={onClickSave}>
                    <FaSave/>Lưu
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                    <FaBan/>Bỏ qua
                </Button>
            </div>
        </Modal>
    );
};

export default AddModal;