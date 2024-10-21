import React from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

const Loader = () => {
    return (
        <div>
            <div className="flex justify-center h-screen">
                <BiLoaderAlt className="animate-spin text-brand-500 mt-32" size={30}/>
            </div>
        </div>
    );
};

export default Loader;