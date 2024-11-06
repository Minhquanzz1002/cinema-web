'use client';
import React, { useEffect } from 'react';
import Card from '@/components/Admin/Card';
import Typography from '@/components/Admin/Typography';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Loader from '@/components/Admin/Loader';
import { useMovieByCode } from '@/modules/movies/repository';
import ItemInfo from '@/components/Admin/ItemInfo';
import { MovieStatusVietnamese } from '@/modules/movies/interface';
import HTMLContent from '@/components/Admin/HTMLContent';
import NotFound from '@/components/Admin/NotFound';
import { NOT_FOUND_MOVIE_IMAGE } from '@/variables/images';

const MovieDetailPage = () => {
    const { code } = useParams<{ code: string }>();
    const { data: movie, isLoading } = useMovieByCode(code);

    useEffect(() => {
        document.title = 'B&Q Cinema - Chi tiết phim';
    }, []);

    if (isLoading) return (
        <Loader />
    );

    if (!movie) return <NotFound/>;

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
                            src={movie.imagePortrait || NOT_FOUND_MOVIE_IMAGE}
                            alt={`Ảnh của ${movie.title}`} fill className="object-cover" />
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
                        <ItemInfo label="Nhà xuất bản"
                                  value={movie.producers.length > 0 ? movie.producers.map(producer => producer.name).join(', ') : 'Chưa cập nhật'} />
                        <ItemInfo label="Diễn viên"
                                  value={movie.actors.length > 0 ? movie.actors.map(actor => actor.name).join(', ') : 'Chưa cập nhật'}
                        />
                        <ItemInfo label="Thể loại" value={movie.genres.map(genre => genre.name).join(', ')} />
                        <ItemInfo label="Trạng thái" value={MovieStatusVietnamese[movie.status]} />
                    </div>
                </Card>
            </div>
            <Card className="p-[18px]">
                <Typography.Title level={4}>Nội dung phim</Typography.Title>
                {
                    movie.summary && movie.summary.trim().length > 0 ? (
                        <HTMLContent content={movie.summary} />
                    ) : (
                        <p className="font-normal text-gray-400">Chưa cập nhật</p>
                    )
                }
            </Card>
        </div>
    );
};

export default MovieDetailPage;