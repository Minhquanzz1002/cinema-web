'use client';
import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import Input from '@/components/Admin/Input';
import Card from '@/components/Admin/Card';
import { array, mixed, object, string } from 'yup';
import Typography from '@/components/Admin/Typography';
import { Editor } from '@/components/Admin/Fields';
import Select, { SelectProps } from '@/components/Admin/Select';
import { AgeRating, MovieStatus, MovieStatusVietnamese } from '@/modules/movies/interface';
import { useCreateMovie, useMovieFilters } from '@/modules/movies/repository';
import { GenreFilter } from '@/modules/genres/interface';
import { ActorFilter } from '@/modules/actors/interface';
import { ProducerFilter } from '@/modules/producers/interface';
import { ButtonIcon } from '@/components/Admin/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import UploadImage, { ImageFile } from '@/components/Admin/UploadImage';
import { useRouter } from 'next/navigation';

const MovieSchema = object({
    title: string().required('Tên không được để trống'),
    trailer: string().required('Trailer không được để trống'),
    duration: string().required('Thời lượng không được để trống'),
    genres: array().required('Hãy chọn 1 thể loại').min(1, 'Thể loại không được để trống'),
    actors: array().required('Hãy chọn 1 diễn viên').min(1, 'Diễn viên không được để trống'),
    producers: array().required('Hãy chọn 1 nhà sản xuất').min(1, 'Nhà sản xuất không được để trống'),
    directors: array().required('Hãy chọn 1 đạo diễn').min(1, 'Đạo diễn không được để trống'),
    imagePortrait: array().of(
        object().shape({
            path: string().required('Ảnh bìa là bắt buộc'),
            file: mixed().optional(),
        }),
    ).min(1, 'Chọn ít nhất 1 ảnh bìa').required('Chọn ít nhất 1 ảnh bìa'),
    imageLandscape: array().of(
        object().shape({
            path: string().required('Ảnh nền là bắt buộc'),
            file: mixed().optional(),
        }),
    ).min(1, 'Chọn ít nhất 1 ảnh nền').required('Chọn ít nhất 1 ảnh nền'),
});

interface FormValues {
    title: string;
    trailer: string;
    duration: number;
    country: string;
    summary: string;
    imagePortrait: ImageFile[];
    imageLandscape: ImageFile[];
    genres: number[];
    actors: number[];
    producers: number[];
    directors: number[];
    ageRating: AgeRating;
    status: MovieStatus;
}

const initialFormValues: FormValues = {
    title: '',
    trailer: '',
    duration: 1,
    country: '',
    summary: '',
    imagePortrait: [],
    imageLandscape: [],
    ageRating: AgeRating.T18,
    genres: [],
    actors: [],
    producers: [],
    directors: [],
    status: MovieStatus.COMING_SOON,
};

const NewMoviePage = () => {
    const { data: filterData } = useMovieFilters();
    const router = useRouter();
    const [genres, setGenres] = useState<GenreFilter[]>([]);
    const [actors, setActors] = useState<ActorFilter[]>([]);
    const [producers, setProducers] = useState<ProducerFilter[]>([]);
    const [directors, setDirectors] = useState<ProducerFilter[]>([]);

    const createMovieMutation = useCreateMovie();

    useEffect(() => {
        document.title = 'B&Q Cinema - Phim mới';
    }, []);

    useEffect(() => {
        if (filterData?.data) {
            setGenres(filterData.data.genres);
            setActors(filterData.data.actors);
            setProducers(filterData.data.producers);
            setDirectors(filterData.data.directors);
        }
    }, [filterData]);

    const genreOptions: SelectProps['options'] = genres.map(genre => ({
        label: genre.name,
        value: genre.id,
    }));
    const actorOptions: SelectProps['options'] = actors.map(actor => ({
        label: actor.name,
        value: actor.id,
    }));
    const producerOptions: SelectProps['options'] = producers.map(producer => ({
        label: producer.name,
        value: producer.id,
    }));
    const directorOptions: SelectProps['options'] = directors.map(director => ({
        label: director.name,
        value: director.id,
    }));

    const handleSubmit = async (values: FormValues) => {
        console.log('submit:', values);
        try {
            const uploadedImagePortrait: string[] = [];
            await Promise.all(
                values.imagePortrait.map(async (img: ImageFile) => {
                    if (img.file) {
                        const filename = `${Date.now()}-${img.file.name}`;
                        // TODO upload image to S3
                        uploadedImagePortrait.push(filename);
                    } else {
                        uploadedImagePortrait.push(img.path);
                    }
                }),
            );

            const uploadedImageLandscape: string[] = [];
            await Promise.all(
                values.imageLandscape.map(async (img: ImageFile) => {
                    if (img.file) {
                        const filename = `${Date.now()}-${img.file.name}`;
                        // TODO upload image to S3
                        uploadedImageLandscape.push(filename);
                    } else {
                        uploadedImageLandscape.push(img.path);
                    }
                }),
            );

            await createMovieMutation.mutateAsync({
                ...values,
                imageLandscape: uploadedImageLandscape[0],
                imagePortrait: uploadedImagePortrait[0],
            });

            router.push('/admin/movies');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={MovieSchema}>
                <Form>
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-4">
                            <Card className={`p-[18px]`}>
                                <Typography.Title level={4}>Thông tin chung</Typography.Title>
                                <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                    <Input name="title" label="Tên" placeholder="Nhập tên phim" tooltip="Là tên phim"
                                           required />
                                    <Select name="ageRating" label="Nhãn" placeholder="Chọn nhãn phim" options={[
                                        { label: AgeRating.T18, value: AgeRating.T18 },
                                        { label: AgeRating.T16, value: AgeRating.T16 },
                                        { label: AgeRating.T13, value: AgeRating.T13 },
                                        { label: AgeRating.P, value: AgeRating.P },
                                        { label: AgeRating.C, value: AgeRating.C },
                                        { label: AgeRating.K, value: AgeRating.K },
                                    ]} />
                                    <Input name="trailer" label="Trailer" placeholder="Nhập URL trailer" required />
                                    <div className="grid grid-cols-2 gap-x-3">
                                        <Input name="duration" label="Thời lượng" placeholder="Nhập thời lượng"
                                               unit="Phút"
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

                                    <Select name="directors" label="Đạo diễn" placeholder="Chọn đạo diễn" multiple
                                            options={directorOptions} />

                                    <Select name="actors" label="Diễn viên" placeholder="Chọn diễn viên" multiple
                                            options={actorOptions} />

                                    <Select name="producers" label="Nhà sản xuất" placeholder="Chọn nhà sản xuất"
                                            multiple
                                            options={producerOptions} />

                                    <Select name="status" label="Trạng thái" options={[
                                        { label: MovieStatusVietnamese[MovieStatus.ACTIVE], value: MovieStatus.ACTIVE },
                                        {
                                            label: MovieStatusVietnamese[MovieStatus.INACTIVE],
                                            value: MovieStatus.INACTIVE,
                                        },
                                        {
                                            label: MovieStatusVietnamese[MovieStatus.COMING_SOON],
                                            value: MovieStatus.COMING_SOON,
                                        },
                                        {
                                            label: MovieStatusVietnamese[MovieStatus.SUSPENDED],
                                            value: MovieStatus.SUSPENDED,
                                        },
                                    ]} />
                                </div>
                            </Card>
                        </div>

                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Ảnh bìa</Typography.Title>
                            <UploadImage name="imagePortrait" />
                        </Card>

                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Ảnh nền</Typography.Title>
                            <UploadImage name="imageLandscape" />
                        </Card>

                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Mô tả</Typography.Title>
                            <Editor name="summary"/>
                        </Card>

                        <div className="mb-10 flex justify-end items-center gap-4">
                            <Link href={'/admin/movies'}>
                                <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                                    Hủy bỏ
                                </ButtonIcon>
                            </Link>
                            <ButtonIcon icon={<FaSave />} type="submit">
                                Lưu
                            </ButtonIcon>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default NewMoviePage;