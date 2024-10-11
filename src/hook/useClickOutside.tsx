import React, { useCallback, useEffect } from 'react';

type Event = MouseEvent | TouchEvent;

const useClickOutside = <T extends HTMLElement>(ref: React.RefObject<T>, onClickOutside: (e: Event) => void) => {
    const handleClickOutside = useCallback(
        (event: Event) => {
            if (event && ref.current && !ref.current.contains(event.target as Node)) {
                onClickOutside(event);
            }
        },
        [ref, onClickOutside],
    );

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => handleClickOutside(e);
        const handleTouchStart = (e: TouchEvent) => handleClickOutside(e);

        document.addEventListener('mousedown', handleMouseDown, true);
        document.addEventListener('touchstart', handleTouchStart, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
            document.removeEventListener('touchstart', handleClickOutside, true);
        };
    }, [handleClickOutside]);
};

export default useClickOutside;