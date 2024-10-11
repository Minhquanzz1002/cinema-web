'use client';
import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import Input from '@/components/Admin/Input';
import Card from '@/components/Admin/Card';
import { array, object, string } from 'yup';
import Typography from '@/components/Admin/Typography';
import { Editor } from '@/components/Admin/Fields';
import Select, { SelectProps } from '@/components/Admin/Select';
import { MovieStatus } from '@/modules/movies/interface';
import { useMovieFilters } from '@/modules/movies/repository';
import { GenreFilter } from '@/modules/genres/interface';
import { ActorFilter } from '@/modules/actors/interface';
import { ProducerFilter } from '@/modules/producers/interface';
import { ButtonIcon } from '@/components/Admin/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';

const MovieSchema = object({
    title: string().required('Tên không được để trống'),
    slug: string().required('Đường dẫn không được để trống'),
    trailer: string().required('Trailer không được để trống'),
    duration: string().required('Thời lượng không được để trống'),
    genres: array().required('Hãy chọn 1 thể loại').min(1, 'Thể loại không được để trống'),
    actors: array().required('Hãy chọn 1 diễn viên').min(1, 'Diễn viên không được để trống'),
    producers: array().required('Hãy chọn 1 nhà sản xuất').min(1, 'Nhà sản xuất không được để trống'),
});

const initialFormValues = {
    title: '',
    slug: '',
    trailer: '',
    duration: 1,
    country: '',
    genres: [],
    actors: [],
    producers: [],
    status: MovieStatus.ACTIVE,
};

const NewMoviePage = () => {
    const { data: filterData } = useMovieFilters();
    const [genres, setGenres] = useState<GenreFilter[]>([]);
    const [actors, setActors] = useState<ActorFilter[]>([]);
    const [producers, setProducers] = useState<ProducerFilter[]>([]);

    useEffect(() => {
        document.title = 'B&Q Cinema - Phim mới';
    }, []);

    useEffect(() => {
        if (filterData?.data) {
            setGenres(filterData.data.genres);
            setActors(filterData.data.actors);
            setProducers(filterData.data.producers);
        }
    }, [filterData]);

    const genreOptions: SelectProps['options'] = genres.map(genre => ({
        label: genre.name,
        value: genre.id.toString(),
    }));
    const actorOptions: SelectProps['options'] = actors.map(actor => ({
        label: actor.name,
        value: actor.id.toString(),
    }));
    const producerOptions: SelectProps['options'] = producers.map(producer => ({
        label: producer.name,
        value: producer.id.toString(),
    }));

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={(values) => console.log(values)}
                    validationSchema={MovieSchema}>
                <Form>
                    <div className="grid grid-cols-2 gap-x-3">
                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <Input name="title" label="Tên" placeholder="Nhập tên phim" tooltip="Là tên phim"
                                       required />
                                <Input name="slug" label="Đường dẫn" placeholder="Tạo tự động nếu không nhập" />
                                <Input name="trailer" label="Trailer" placeholder="Nhập URL trailer" required />
                                <div className="grid grid-cols-2 gap-x-3">
                                    <Input name="duration" label="Thời lượng" placeholder="Nhập thời lượng" unit="Phút"
                                           type="number" min={1} max={999} required />
                                    <Input name="country" label="Quốc gia" placeholder="Nhập quốc gia" required />
                                </div>
                            </div>
                        </Card>

                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Danh mục & Trạng thái</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <Select name="genres" label="Thể loại" placeholder="Chọn thể loại" multiple
                                        options={genreOptions} />

                                <Select name="actors" label="Diễn viên" placeholder="Chọn diễn viên" multiple
                                        options={actorOptions} />

                                <Select name="producers" label="Nhà sản xuất" placeholder="Chọn nhà sản xuất" multiple
                                        options={producerOptions} />

                                <Select name="status" label="Trạng thái" options={[
                                    { label: MovieStatus.ACTIVE, value: MovieStatus.ACTIVE },
                                    { label: MovieStatus.INACTIVE, value: MovieStatus.INACTIVE },
                                    { label: MovieStatus.COMING_SOON, value: MovieStatus.COMING_SOON },
                                    { label: MovieStatus.SUSPENDED, value: MovieStatus.SUSPENDED },
                                ]} />
                            </div>
                        </Card>
                    </div>
                    <div className="mt-5">
                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Mô tả</Typography.Title>
                            <Editor />
                        </Card>
                    </div>
                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/admin/movies'}>
                            <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                                Hủy bỏ
                            </ButtonIcon>
                        </Link>
                        <ButtonIcon icon={<FaSave />} type="submit">
                            Lưu
                        </ButtonIcon>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default NewMoviePage;