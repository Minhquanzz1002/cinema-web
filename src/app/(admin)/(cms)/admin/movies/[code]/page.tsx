'use client';
import React, { useEffect } from 'react';
import Card from '@/components/Admin/Card';
import Typography from '@/components/Admin/Typography';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Loader from '@/components/Admin/Loader';
import { useMovieByCode } from '@/modules/movies/repository';
import avatar from '/public/img/avatar/avt.png';
import ItemInfo from '@/components/Admin/ItemInfo';
import { MovieStatusVietnamese } from '@/modules/movies/interface';

const MovieDetailPage = () => {
    const { code } = useParams<{ code: string }>();
    const { data: movie, isLoading } = useMovieByCode(code);

    useEffect(() => {
        document.title = 'B&Q Cinema - Chi tiết phim';
    }, []);

    if (isLoading) return (
        <Loader/>
    );

    if (!movie) return null;

    return (
        <div className="mt-5 flex flex-col gap-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã sản phẩm</div>
                    <div className="text-brand-500">#{movie.code}</div>
                </div>
            </Card>

            <div className="grid grid-cols-5 gap-4">
                <Card className="p-[18px]">
                    <Typography.Title level={4}>Hình ảnh</Typography.Title>
                    <div className="relative w-full aspect-[3/4] rounded overflow-hidden">
                        <Image
                            src={movie.imagePortrait || avatar}
                            alt={`Hình ảnh của ${movie.title}`} fill className="object-cover" />
                        <div className="absolute bottom-0 right-0 mb-1 mr-1">
                            <span className="px-2 py-1 bg-brand-300 rounded text-white">{movie.ageRating}</span>
                        </div>
                    </div>
                </Card>
                <Card className="p-[18px] col-span-4">
                    <Typography.Title level={4}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo label="Tên" value={movie.title} />
                        <ItemInfo label="Quốc gia" value={movie.country} />
                        <ItemInfo label="Thời lượng" value={`${movie.duration} phút`} />
                        <ItemInfo label="Nhà xuất bản" value={movie.producers.map(producer => producer.name).join(', ')} />
                        <ItemInfo label="Diễn viên" value={movie.actors.map(actor => actor.name).join(', ')} />
                        <ItemInfo label="Thể loại" value={movie.genres.map(genre => genre.name).join(', ')} />
                        <ItemInfo label="Trạng thái" value={MovieStatusVietnamese[movie.status]} />
                    </div>
                </Card>
            </div>
            <Card className="p-[18px]">
                <Typography.Title level={4}>Nội dung phim</Typography.Title>
                <p className="font-normal text-gray-800">
                    {movie.summary}
                </p>
            </Card>
        </div>
    );
};

export default MovieDetailPage;