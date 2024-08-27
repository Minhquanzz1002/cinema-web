import React, {useRef, useState} from 'react';

type DropdownProps = {
    button: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

const Dropdown = (props : DropdownProps) => {
    const { button, children, className } = props;
    const wrapperRef  = useRef<HTMLDivElement>(null);
    const [openWrapper, setOpenWrapper] = useState<boolean>(false);
    return (
        <div className="relative flex" ref={wrapperRef}>
            <div className="flex" onMouseDown={() => setOpenWrapper(!openWrapper)}>
                {button}
            </div>
            <div className={`${className} absolute z-10 origin-top-right transition-all duration-300 ease-in-out ${openWrapper ? 'scale-100' :  'scale-0'}`}>
                {children}
            </div>
        </div>
    );
};

export default Dropdown;