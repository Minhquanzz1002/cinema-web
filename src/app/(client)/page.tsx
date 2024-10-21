"use client";
import React from 'react';
import Animation from '@/components/Pages/Home/Animation';
import Movie from '@/components/Pages/Home/Movie';
import CinemaCorner from '@/components/Pages/Home/CinemaCorner';
import Promotional from '@/components/Pages/Home/Promotional';
import IntroduceBackground from '@/components/Pages/Home/IntroduceBackground';
import Introduce from '@/components/Pages/Home/Introduce';

const Page = () => {
    return (
        <>
            <Animation/>
            <Movie/>
            <CinemaCorner />
            <Promotional />
            <IntroduceBackground />
            <Introduce />
        </>
    );
};

export default Page;