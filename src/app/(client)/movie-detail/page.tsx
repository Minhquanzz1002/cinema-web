"use client";
import React from 'react';

import MovieDetail from '@/components/Pages/MovieShow/MoiveDetail';
import IntroduceMovie from '@/components/Pages/MovieShow/IntroduceMoive';
import IntroduceMovieSoon from '@/components/Pages/MovieShow/IntroduceMoiveSoon';


const MoiveDetail = () => {
    return (
        <>
            <MovieDetail />
            <IntroduceMovie />
            <IntroduceMovieSoon />
        </>
    );
};

export default MoiveDetail;