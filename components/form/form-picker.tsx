"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Loader2, SearchIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { unsplash } from "@/lib/unsplash";
import { defaultImages } from "@/constants/images";

import { FormErrors } from "./form-errors";
import { toast } from "sonner";

interface FormPickerProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
    const { pending } = useFormStatus();

    const [images, setImages] =
        useState<Array<Record<string, any>>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (!searchTerm) {
            setImages(defaultImages)
        } else {

            const fetchImages = async () => {
                setIsLoading(true);

                try {
                    let result;
                    if (searchTerm) {
                        result = await unsplash.photos.getRandom({ query: searchTerm, count: 9 });
                    } else {
                        result = await unsplash.photos.getRandom({
                            collectionIds: ["317099"],
                            count: 9,
                        });
                    }

                    if (result && result.response) {
                        const newImages = result.response as Array<Record<string, any>>;
                        setImages(newImages);
                    } else {
                        toast.error("Get Premium for unlimited search");
                        setImages(defaultImages)
                    }
                } catch (error) {
                    console.log(error);
                    setImages(defaultImages);
                } finally {
                    setIsLoading(false);
                }
            };
            const timeoutId = setTimeout(fetchImages, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [searchTerm]);

    return (
        <div className="relative">
            <div className="flex items-center border rounded-md relative mb-2">
                <SearchIcon className="  w-4 h-4 absolute right-2 top-1" />
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-2 " />
            </div>
            {isLoading ?
                <div className="p-6 flex items-center justify-center h-36">
                    <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
                </div>
                :
                <div className="grid grid-cols-3 gap-2 mb-2">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className={cn(
                                "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
                                pending && "opacity-50 hover:opacity-50 cursor-auto"
                            )}
                            onClick={() => {
                                if (pending) return;
                                setSelectedImageId(image.id);
                            }}
                        >
                            <input
                                type="radio"
                                id={id}
                                name={id}
                                className="hidden"
                                checked={selectedImageId === image.id}
                                disabled={pending}
                                value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
                                readOnly
                            />
                            <Image
                                src={image.urls.thumb}
                                alt="Unsplash image"
                                className="object-cover rounded-sm"
                                fill
                            />
                            {selectedImageId === image.id && (
                                <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                                    <Check className="h-4 w-4 text-white" />
                                </div>
                            )}
                            <Link
                                href={image.links.html}
                                target="_blank"
                                className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[9px] truncate text-white hover:underline p-[2px] bg-black/50"
                            >
                                {image.user.name}
                            </Link>
                        </div>
                    ))}
                </div>
            }
            <FormErrors id="image" errors={errors} />
        </div>
    );
};
