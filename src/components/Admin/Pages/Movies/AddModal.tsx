import React, {useEffect, useState} from 'react';
import Modal from "@/components/Admin/Modal";
import Button from "@/components/Admin/Modal/Button";
import {FaSave} from "react-icons/fa";
import {FaBan, FaPlus} from "react-icons/fa6";
import Tabs, {Tab} from "@/components/Admin/Tabs";
import {InputInline, SelectField} from "@/components/Admin/Fields";
import generateSampleGenres, {Genre} from "@/variables/genre";

type AddModalProps = {
    onClose: () => void;
}

const AddModal = (props : AddModalProps) => {
    const { onClose } = props;
    const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        setGenres(generateSampleGenres(10));
    }, []);

    const onClickSave = () => {
        onClose();
    }

    return (
        <Modal title="Thêm phim" onClose={onClose}>
            <Tabs defaultActiveKey="info" className="mt-3">
                <Tab title="Thông tin" activeKey="info">
                    <div className="mt-5 grid grid-cols-12 gap-x-7">
                        <div className="col-span-7">
                            <InputInline id="code" label="Mã phim" placeholder="Mã phim tự động"/>
                            <InputInline id="name" label="Tên phim"/>
                            <SelectField label="Thể loại" data={genres} suffix={
                                <button className="rounded-full hover:bg-gray-50 p-1">
                                    <FaPlus />
                                </button>
                            }/>
                        </div>
                        <div className="col-span-5">
                            <InputInline type="number" min={1} max={9999} id="duration" label="Thời lượng" extraLabel="!w-20" suffix="Phút"/>
                            <InputInline id="country" label="Quốc gia" extraLabel="!w-20"/>
                            <InputInline id="age" type="number" min={3} max={18} label="Độ tuổi" extraLabel="!w-20" placeholder="Từ 3 đến 18"/>
                        </div>
                    </div>
                </Tab>
                <Tab title="Mô tả chi tiết" activeKey="desc">
                    Xin
                </Tab>
            </Tabs>
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