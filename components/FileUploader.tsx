'use client';

import { useEdgeStore } from '@/lib/edgestore';
import { File, FileArchive, FileIcon, FolderClosed, ImageIcon, Loader2, PanelTopClose, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from './ui/button';

interface FileWithPreview {
    file: File;
    preview: string;
}

export interface BoxeResponse {
    textBody?: string;
    images?: string[];
}

interface FileUploaderProps {
    onSubmit: (res: BoxeResponse) => void;
}

export default function FileUploader({ onSubmit }: FileUploaderProps) {
    const { edgestore } = useEdgeStore();
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [textBody, setTextBody] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        if (e.clipboardData.files.length > 0) {
            const pastedFiles = Array.from(e.clipboardData.files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setFiles((prevFiles) => [...prevFiles, ...pastedFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const boxeResponse: BoxeResponse = {
            textBody: textBody,
            images: []
        };

        const imageUrls = await Promise.all(
            files.map(async (file) => {
                setIsLoading(true)

                try {
                    const res = await edgestore.publicFiles.upload({
                        file: file.file,
                    });
                    return res.url;
                } catch (err) {
                    console.error(err);
                    return null;
                } finally {
                    setIsLoading(false)
                }
            })
        );

        boxeResponse.images = imageUrls.filter((url) => url !== null) as string[];
        setFiles([]);
        setTextBody('');
        onSubmit(boxeResponse);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='' >
                <div className='border' onPaste={handlePaste} onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <textarea
                        onChange={(e) => setTextBody(e.target.value)}
                        value={textBody}
                        style={{ resize: "none" }}
                        className='w-full h-40 outline-none p-2'
                    />
                    <div
                        className="rounded-lg p-1   w-fit "

                    >
                        {files.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {files.map((file, index) => (
                                    <div key={index} className="relative">
                                        <div className="w-20 h-20 relative">
                                            <Image
                                                fill
                                                src={file.preview}
                                                alt="preview"
                                                className="rounded-sm object-cover"
                                            />
                                        </div>
                                        <X className='w-3 h-3 absolute right-0 top-0 bg-red-600 text-white rounded-full m-1 hover:scale-110 duration-200 cursor-pointer' onClick={() => handleRemoveFile(index)} />
                                    </div>
                                ))}
                            </div>
                        )}
                        <label htmlFor="file-input" >
                            <ImageIcon className='text-main w-4 h-4 cursor-pointer hover:scale-105 duration-200' />
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
                </div>
                <Button size={'sm'} type="submit" className='my-2' variant="primary">{isLoading ? <Loader2 className="m-2 flex  h-6 w-7 animate-spin " /> : "Submit"}</Button>
            </form>
        </div>
    );
}
