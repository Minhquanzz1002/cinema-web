import React from 'react';
import Image from 'next/image';
import ItemInfo from '@/components/Admin/ItemInfo';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { BaseStatusVietnamese } from '@/modules/base/interface';
import Modal from '@/components/Admin/Modal';
import { Director } from '@/modules/directors/interface';
import { AVATAR_DEFAULT_IMAGE } from '@/variables/images';

interface ModalInfoDirectorProps {
    onClose: () => void;
    director: Director;
}

const ModalInfoDirector = ({ onClose, director }: ModalInfoDirectorProps) => {
    return (
        <Modal
            title={`Thông tin đạo diễn #${director.code}`} onClose={onClose}
            open={true}
        >
            <div className="grid grid-cols-4 gap-4">
                <div className="relative aspect-square">
                    <Image
                        src={director.image || AVATAR_DEFAULT_IMAGE} alt={director.name} fill
                        quality={85}
                        className="rounded-md object-cover"
                    />
                </div>
                <div className="flex flex-col gap-3 col-span-3">
                    <ItemInfo label="Tên" value={director.name} />
                    <ItemInfo
                        label="Ngày sinh"
                        value={director.birthday ? formatDateToLocalDate(director.birthday) : 'Chưa cập nhật'}
                    />
                    <ItemInfo label="Quốc gia" value={director.country || 'Chưa cập nhật'} />
                    <ItemInfo label="Tiểu sử" value={director.bio || 'Chưa cập nhật'} />
                    <ItemInfo label="Trạng thái" value={BaseStatusVietnamese[director.status]} />
                </div>
            </div>
        </Modal>
    );
};

export default ModalInfoDirector;