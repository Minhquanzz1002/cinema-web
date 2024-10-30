import React, { useCallback, useEffect, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { useDropzone } from 'react-dropzone';
import { BsCloudUpload } from 'react-icons/bs';
import Image from 'next/image';
import { IoCloseSharp } from 'react-icons/io5';

export interface ImageFile {
    path: string;
    file?: File;
}

type UploadImageProps = {
    name: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number;
}

const UploadImage = ({
                         name,
                         multiple = false,
                         maxFiles = 5,
                         maxSize = 5 * 1024 * 1024,
                     }: UploadImageProps,
) => {
    const [field, meta] = useField(name);
    const { setFieldValue } = useFormikContext();
    const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
        if (field.value && Array.isArray(field.value)) {
            const initialPreviews = field.value.map((file: ImageFile) => file.path);
            setPreviews(initialPreviews);
        }
    }, [field.value]);

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.slice(0, maxFiles - (field.value?.length || 0));
        try {
            const newPreviews = await Promise.all(
                newFiles.map(file => readFileAsDataURL(file)),
            );

            const filesData = newFiles.map(file => ({
                path: file.name,
                file: file,
            }));

            if (multiple) {
                setPreviews(prev => [...prev, ...newPreviews]);
                setFieldValue(name, [...(field.value || []), ...filesData]);
            } else {
                setPreviews([newPreviews[0]]);
                setFieldValue(name, [filesData[0]]);
            }
        } catch (error) {
            console.error(error);
        }
    }, [field.value, multiple, name, setFieldValue, maxFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png'],
        },
        multiple,
        maxSize,
        maxFiles,
    });

    const handleUrlSubmit = () => {
        if (imageUrl) {
            const newImage = { path: imageUrl };
            if (multiple) {
                setFieldValue(name, [...(field.value || []), newImage ]);
                setPreviews(prev => [...prev, imageUrl]);
            } else {
                setFieldValue(name, [newImage ]);
                setPreviews([imageUrl]);
            }
            setImageUrl('');
            setShowUrlInput(false);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = Array.isArray(field.value) ? field.value.filter((_, i) => i !== index) : null;
        setFieldValue(name, newFiles);
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div>
                <div className="flex gap-3 justify-center">
                    <div className="bg-gray-100 flex justify-center items-center rounded overflow-hidden">
                        <button type="button" onClick={() => setShowUrlInput(false)}
                                className={`text-gray-800 h-9 px-4 rounded ${!showUrlInput ? 'bg-brand-500 text-white' : ''}`}>
                            Upload từ máy
                        </button>
                        <button type="button" onClick={() => setShowUrlInput(true)}
                                className={`text-gray-800 h-9 px-4 rounded ${showUrlInput ? 'bg-brand-500 text-white' : ''}`}>
                            Thêm từ URL
                        </button>
                    </div>
                </div>
            </div>
            {
                showUrlInput ? (
                    <div className="flex gap-2 items-center">
                        <input type="text" value={imageUrl}
                               onChange={e => setImageUrl(e.target.value)}
                               placeholder="Nhập URL ảnh"
                               className="flex-1 border text-[15px] px-4 py-2 h-10 rounded-md focus:border-brand-500"
                        />
                        <button type="button" onClick={handleUrlSubmit}
                                className="border bg-brand-500 text-white rounded h-10 px-4 text-sm">
                            Thêm
                        </button>
                    </div>
                ) : (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed p-4 h-40">
                            <BsCloudUpload size={40} className="text-gray-600"/>
                            {
                                isDragActive ? (
                                    <p className="text-gray-600 font-medium">Thả file để tải lên...</p>
                                ) : (
                                    <>
                                        <p className="text-gray-600 font-medium">
                                            Kéo thả file hoặc click để chọn
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            PNG, JPG, GIF (tối đa {maxSize / (1024 * 1024)}MB)
                                        </p>
                                        {multiple && (
                                            <p className="text-sm text-gray-500">
                                                Tối đa {maxFiles} file
                                            </p>
                                        )}
                                    </>
                                )
                            }
                        </div>
                    </div>
                )
            }
            {
                meta.error && (
                    <div className="text-red-500 text-sm">{meta.error}</div>
                )
            }

            {
                previews.length > 0 && (
                    <div className="grid grid-cols-8 gap-4">
                        {
                            previews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100 border">
                                        <Image
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button onClick={() => removeFile(index)} type="button"
                                                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 hover:text-white">
                                            <IoCloseSharp />
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
};

export default UploadImage;