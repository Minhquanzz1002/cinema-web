import { ErrorMessage, useField } from 'formik';
import React, { useId } from 'react';
import Tooltip from '@/components/Admin/Tooltip';

type TextAreaProps = {
    name: string;
    label: string;
    placeholder?: string;
    tooltip?: string;
    autoFocus?: boolean;
    rows?: number;
    required?: boolean;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    readOnly?: boolean;
};

const TextArea = ({
                      name,
                      label,
                      placeholder = '',
                      tooltip,
                      autoFocus = false,
                      rows = 3,
                      required = false,
                      resize = 'vertical',
                      readOnly = false,
                  }: TextAreaProps) => {
    const id = useId();
    const [field] = useField(name);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const handleContainerClick = () => {
        textareaRef.current?.focus();
    };

    return (
        <div className="mb-3">
            <div className="mb-1 inline-flex gap-x-1 h-6">
                <label className="font-normal text-sm cursor-pointer after:content-[':']"
                       htmlFor={id} title={label}>{label}</label>
                {required && <span className="text-red-500">*</span>}
                {tooltip && <Tooltip text={tooltip} />}
            </div>
            <div
                onClick={handleContainerClick}
                className={`border rounded-md p-3 dark:text-white dark:bg-navy-900 w-full text-[16px] focus-within:border-brand-500 flex items-start group`}>
                <textarea
                    readOnly={readOnly}
                    ref={textareaRef}
                    id={id}
                    placeholder={placeholder}
                    className={`flex-1 w-full bg-transparent outline-none`}
                    style={{ resize: resize }}
                    rows={rows}
                    autoFocus={autoFocus}
                    {...field}
                />
            </div>
            <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default TextArea;