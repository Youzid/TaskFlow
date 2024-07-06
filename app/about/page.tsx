'use client';

import { useEdgeStore } from '@/lib/edgestore';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
interface FileWithPreview {
    file: File;
    preview: string;
}
export default function Page() {
    const { edgestore } = useEdgeStore();
    const [files, setFiles] = useState<FileWithPreview[]>([]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setFiles([...files, ...selectedFiles]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setFiles([...files, ...droppedFiles]);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        if (e.clipboardData.files.length > 0) {
            const pastedFiles = Array.from(e.clipboardData.files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setFiles([...files, ...pastedFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(files)
        await Promise.all(
            files.map(async (file) => {
                try {
                    const res = await edgestore.publicFiles.upload({
                        file: file.file,
                        // onProgressChange: async (progress) => {
                        //     updateFileProgress(file.key, progress);
                        //     if (progress === 100) {
                        //         // wait 1 second to set it to complete
                        //         // so that the user can see the progress bar at 100%
                        //         await new Promise((resolve) => setTimeout(resolve, 1000));
                        //         updateFileProgress(file.key, 'COMPLETE');
                        //     }
                        // },
                    });
                    console.log(res);
                    setFiles([])
                } catch (err) {
                    console.log(err)
                    // updateFileProgress(addedFileState.key, 'ERROR');
                }
            }),
        );

    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div
                    className=" rounded-lg p-4 mb-4 "
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onPaste={handlePaste}
                >
                    {files.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {files.map((file, index) => (
                                <div key={index} className="relative">
                                    <Image src={file.preview} width={60} height={60} alt="Preview" className="max-h-40 mb-2" />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                        onClick={() => handleRemoveFile(index)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.293-8.707a1 1 0 011.414-1.414L10 8.586l1.293-1.293a1 1 0 111.414 1.414L11.414 10l1.293 1.293a1 1 0 11-1.414 1.414L10 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L8.586 10 7.293 8.707a1 1 0 111.414-1.414L10 8.586l1.293-1.293a1 1 0 111.414 1.414L11.414 10l1.293 1.293a1 1 0 01-1.414 1.414L10 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L8.586 10z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <label
                        htmlFor="file-input"
                    >
                        <ImageIcon className='text-main' />
                    </label>
                </div>
                <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                />
                <button
                    type="submit"
                    className="w-full mt-4 px-4 py-2 bg-green-500 text-white text-center rounded-lg cursor-pointer"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}