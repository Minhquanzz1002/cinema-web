import React, {useEffect, useState} from 'react';
import Modal from "@/components/Admin/Modal";
import Button from "@/components/Admin/Modal/Button";
import {FaBan} from "react-icons/fa6";
import {FaCheckCircle} from "react-icons/fa";
import generateSampleGenres, {Genres} from "@/variables/genres";
import {MdCheckBox, MdCheckBoxOutlineBlank, MdIndeterminateCheckBox} from "react-icons/md";

type FilterModalProps = {
    onClose: () => void;
}

const FilterModal = React.memo((props: FilterModalProps) => {
    const {onClose} = props;
    const [genres, setGenres] = useState<Genres[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<Genres[]>([]);

    useEffect(() => {
        setGenres(generateSampleGenres(10));
    }, []);

    const onClickConfirm = () => {
        onClose();
    }

    const toggleGenreSelection = (genre: Genres) => {
        setSelectedGenres((prevSelected) => {
            if (prevSelected.some(selected => selected.id === genre.id)) {
                return prevSelected.filter(selected => selected.id !== genre.id);
            } else {
                return [...prevSelected, genre];
            }
        });
    };

    const toggleSelectAll = () => {
        if (selectedGenres.length === genres.length) {
            setSelectedGenres([]);
        } else {
            setSelectedGenres(genres);
        }
    };

    return (
        <Modal title="Lọc theo danh mục" onClose={onClose}>
            <div className="mt-2">
                <div className="flex flex-col gap-y-2">
                    <div>
                        <div className="flex items-center gap-x-2 cursor-pointer w-fit" onClick={toggleSelectAll}>
                            <div className="">
                                {
                                    selectedGenres.length === genres.length && selectedGenres.length > 0 ?
                                        <MdIndeterminateCheckBox className="h-5 w-5 text-[#4BAC4D]"/> :
                                        <MdCheckBoxOutlineBlank className="h-5 w-5"/>
                                }
                            </div>
                            <div className="text-sm select-none">Tất cả thể loại</div>
                        </div>
                    </div>
                    <div className="h-[200px] flex flex-col gap-y-2 overflow-x-hidden overflow-y-auto">
                        {
                            genres.map((genre) => (
                                <div key={genre.id}>
                                    <div className="flex items-center gap-x-2 cursor-pointer w-fit"
                                         onClick={() => toggleGenreSelection(genre)}>
                                        <div className="">
                                            {
                                                selectedGenres.includes(genre) ?
                                                    <MdCheckBox className="h-5 w-5 text-[#4BAC4D]"/> :
                                                    <MdCheckBoxOutlineBlank className="h-5 w-5"/>
                                            }
                                        </div>
                                        <div className="text-sm select-none">{genre.name}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <Button type="button" variant="link">
                    Xóa tất cả
                </Button>
                <div className="flex items-center gap-x-3">
                    <Button type="button" variant="success" onClick={onClickConfirm}>
                        <FaCheckCircle/>Hoàn thành
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        <FaBan/>Bỏ qua
                    </Button>
                </div>
            </div>
        </Modal>
    );
});

FilterModal.displayName = "FilterModal";

export default FilterModal;