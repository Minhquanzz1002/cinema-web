import React, { useRef, useState } from 'react';
import Modal from '@/components/Admin/Modal';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import DatePicker from '@/components/Admin/DatePicker';
import Image from 'next/image';
import { NOT_FOUND_PRODUCT_IMAGE } from '@/variables/images';
import { MdRemoveCircleOutline } from 'react-icons/md';
import useClickOutside from '@/hook/useClickOutside';
import { AdminMovie, MovieStatus } from '@/modules/movies/interface';
import { useAllMovies } from '@/modules/movies/repository';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { FaPlus } from 'react-icons/fa6';
import * as Yup from 'yup';
import InputNumber from '@/components/Admin/InputNumber';
import ButtonAction from '@/components/Admin/ButtonAction';

interface ModalGenerateShowTimeProps {
    onClose: () => void;
}

interface FormValues {
    startDate: Date;
    endDate: Date;
    movies: {
        id: number;
        price?: number;
        code: string;
        title: string;
        imagePortrait: string;
        duration: number;
    }[];
}

const initialValues: FormValues = {
    startDate: new Date(),
    endDate: new Date(),
    movies: [],
};

interface MovieFilter extends PaginationState {
    search: string;
    status: MovieStatus;
}

const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
    endDate: Yup.date()
        .required('Ngày kết thúc không được để trống')
        .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
    movies: Yup.array().of(
        Yup.object().shape({
            price: Yup.number().required('Giá không được để trống')
                .min(0, 'Giá phải lớn hơn 0')
                .max(100000000000, 'Giá phải nhỏ hơn 100 tỷ'),
        })
    ).min(1, 'Vui lòng chọn ít nhất 1 phim'),
});

const ModalGenerateShowTime = ({ onClose }: ModalGenerateShowTimeProps) => {
    const [filters, setFilters] = useState<MovieFilter>({
        page: 1,
        search: '',
        status: MovieStatus.ACTIVE,
    });

    /**
     * React query
     */
    const moviesQuery = useAllMovies({
        page: filters.page - 1,
        search: filters.search,
        status: MovieStatus.ACTIVE,
    });

    /**
     * Custom hooks CRUD
     */
    const {
        data: moviesSearch,
    } = useFilterPagination({
        queryResult: moviesQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const FormContent = () => {
        const { values, setFieldValue, errors, touched } = useFormikContext<FormValues>();
        const [search, setSearch] = useState<string>('');
        const [showListMovie, setShowListMovie] = useState<boolean>(false);
        const dropdownRef = useRef<HTMLDivElement>(null);
        useClickOutside(dropdownRef, () => setShowListMovie(false));

        const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setSearch(newValue);
        };

        const handleAddMovie = (movie: AdminMovie) => {
            const isExist = values.movies.find(m => m.id === movie.id);
            if (!isExist) {
                const newMovie = {
                    id: movie.id,
                    code: movie.code,
                    title: movie.title,
                    imagePortrait: movie.imagePortrait || '',
                    duration: movie.duration,
                };
                setFieldValue('movies', [...values.movies, newMovie]);
            }
            setShowListMovie(false);
            setSearch('');
        };

        return (
            <Form>
                <div className="grid grid-cols-4 gap-3">
                    <DatePicker name="startDate" />
                    <DatePicker name="endDate" />
                </div>
                <div className="flex gap-2 items-center">
                    <div className="font-normal text-sm cursor-pointer">Phim áp dụng:</div>
                    {errors.movies && touched.movies && typeof errors.movies === 'string' && (
                        <div className="text-red-500 text-sm">{errors.movies}</div>
                    )}
                </div>
                <div className="border p-2 rounded">
                    <div className="flex gap-3">
                        <div className="relative w-96">
                            <input className="border rounded h-8 px-2 text-sm w-full"
                                   value={search} onChange={onChangeSearchValue}
                                   onClick={() => setShowListMovie(true)}
                                   placeholder="Tìm theo tên hoặc mã sản phẩm" />
                            {
                                showListMovie && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute z-10 left-0 right-0 py-2 bg-white shadow-lg rounded max-h-72 border overflow-auto">
                                        {
                                            moviesSearch?.map(movie => {
                                                if (values.movies.find(m => m.id === movie.id)) return null;

                                                return (
                                                    <div key={movie.id} className="p-2 hover:bg-gray-100 cursor-pointer"
                                                         onClick={() => handleAddMovie(movie)}>
                                                        <div className="flex gap-3">
                                                            <div
                                                                className="relative w-12 h-12 rounded border overflow-hidden">
                                                                <Image src={movie.imagePortrait || NOT_FOUND_PRODUCT_IMAGE}
                                                                       alt={`Ảnh của ${movie.title}`}
                                                                       fill
                                                                       className="object-cover" />
                                                            </div>
                                                            <div className="flex-1 flex flex-col justify-center">
                                                                <div className="text-sm font-medium line-clamp-1">
                                                                    #{movie.code} - {movie.title}
                                                                </div>
                                                                <div className="text-xs line-clamp-1">
                                                                    {movie.duration} phút
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-center items-center">
                                                                <button className="text-brand-500"><FaPlus /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                        {
                                            moviesSearch?.length === 0 && (
                                                <div className="text-center text-gray-400 py-2">
                                                    Không tìm thấy sản phẩm nào
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="mt-3 h-80 max-h-80 overflow-y-auto border-t">
                        <FieldArray name="movies" render={arrayHelper => (
                            <div>
                                {
                                    values.movies.map((movie, index) => (
                                        <div key={`product-${index}`}
                                             className={`flex justify-between gap-3 py-1 ${index !== 0 && 'border-t'}`}>
                                            <div className="flex gap-2">
                                                <div className="flex justify-center items-center w-8">
                                                    {index + 1}
                                                </div>
                                                <div className="relative w-14 h-14 border rounded overflow-hidden">
                                                    <Image src={movie.imagePortrait || NOT_FOUND_PRODUCT_IMAGE}
                                                           alt={`Ảnh của ${movie.title}`} fill
                                                           className="object-cover" />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <div
                                                        className="text-sm font-medium line-clamp-1">{movie.code} - {movie.title}</div>
                                                    <div className="text-xs line-clamp-1">{movie.duration} phút</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <div className="w-36">
                                                    <InputNumber name={`movies.${index}.price`} wrapperClassName=""
                                                                 placeholder="Số suất chiếu" />
                                                </div>
                                                <div className="w-14 flex items-center justify-center">
                                                    <button type="button" onClick={() => arrayHelper.remove(index)}>
                                                        <MdRemoveCircleOutline size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )} />
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <ButtonAction.Submit text="tiếp tục"/>
                </div>
            </Form>
        );
    };

    const handleSubmit = (values: FormValues) => {
        console.table(values);
    };

    return (
        <Modal onClose={onClose} open={true} title="Tạo lịch chiếu tự động" className="!w-5/6">
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormContent />
            </Formik>
        </Modal>
    );
};

export default ModalGenerateShowTime;