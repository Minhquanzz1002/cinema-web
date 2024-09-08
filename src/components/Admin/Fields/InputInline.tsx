import React from 'react';

type InputInlineProps = React.InputHTMLAttributes<HTMLInputElement> & {
    extra?: string;
    extraLabel?: string;
    label: string;
    suffix?: React.ReactNode;
}

const InputInline = (props: InputInlineProps) => {
    const {label, extra, id, extraLabel, suffix, ...rest} = props;
    return (
        <div className={`flex items-center gap-x-2 mb-4 ${extra}`}>
            <label className={`text-sm w-32 font-semibold flex-shrink-0 ${extraLabel}`} htmlFor={id}>{label}</label>
            <div className="flex items-center gap-x-2 border-b-2 text-sm flex-1 h-7">
                <input className={`w-full outline-none relative flex-1`} id={id} {...rest}/>
                {suffix}
            </div>
        </div>
    );
};

export default InputInline;