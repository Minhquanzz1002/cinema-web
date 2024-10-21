import React, { useRef, useState } from 'react';
import { useField, ErrorMessage } from 'formik';
import { FiUploadCloud } from 'react-icons/fi';
import Image from 'next/image';

interface UploadImageProps {
    name: string;
    accept?: string;
    maxSize?: number;
}

const UploadImage: React.FC<UploadImageProps> = ({
                                                     name,
                                                     accept = "image/*",
                                                     maxSize = 5 * 1024 * 1024 // 5MB default
                                                 }) => {
    const [, , helpers] = useField(name);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            if (file.size > maxSize) {
                helpers.setError(`File size should not exceed ${maxSize / (1024 * 1024)}MB`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                helpers.setValue(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > maxSize) {
                helpers.setError(`File size should not exceed ${maxSize / (1024 * 1024)}MB`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                helpers.setValue(file);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="mb-4">
            <div
                className="flex items-center justify-center w-full"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <label
                    htmlFor={`dropzone-file-${name}`}
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                    {preview ? (
                        <div className="relative h-48 w-48 rounded-md border overflow-hidden" >
                            <Image src={preview} alt="Preview" fill quality={100} className="h-full object-contain" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiUploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click để upload</span> hoặc kéo và thả</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                    )}
                    <input
                        id={`dropzone-file-${name}`}
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept={accept}
                    />
                </label>
            </div>
            <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default UploadImage;