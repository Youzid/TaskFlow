"use client";

import { toast } from "sonner";
import { AlignLeft, Loader2Icon, LoaderIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, ElementRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/lib/types";


import { useCallback, useMemo } from "react";

import QuillEditor from "react-quill";

import "react-quill/dist/quill.snow.css";


import { Button } from "@/components/ui/button";
import { useEdgeStore } from "@/lib/edgestore";
import { FormSubmit } from "@/components/form/form-submit";
interface EditorProps {
  data: CardWithList;

}


interface DescriptionProps {
  data: CardWithList;
}


export const Description = ({ data }: DescriptionProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState(data.description || "");
  const quill = useRef();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id],
      });
      toast.success(`Card "${data.title}" updated`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = () => {
    const description = value
    const boardId = params.boardId as string;

    execute({
      id: data.id,
      description,
      boardId,
    });
  };
  const { edgestore } = useEdgeStore();

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.size > 1 * 1024 * 1024) {
          toast.error("Image size exceeds 1MB.");
          return;
        }
        const reader = new FileReader();

        reader.onload = async () => {
          // @ts-ignore
          const quillEditor = quill.current.getEditor();
          const range = quillEditor.getSelection(true);
          try {
            setIsLoading(true)
            const res = await edgestore.publicFiles.upload({
              file: file,
            });
            if (res.url) {
              quillEditor.insertEmbed(range.index, "image", res.url);
            }
          } catch (err) {
            console.error(err);
            return false;
          } finally {
            setIsLoading(false)
          }
        };

        reader.readAsDataURL(file);
      } else {
        console.error("No file selected or file input is null.");
      }
    };
  }, []);



  const modules = useMemo(
    () => ({

      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
  ];


  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2 ">
            <div className="relative pb-14">
              {isLoading &&
                <Loader2Icon className="w-8 h-8 text-main animate-spin absolute inset-[47%] z-50" />
              }
              <QuillEditor
                // @ts-ignore
                ref={(el) => (quill.current = el)}
                className={`h-[350px] w-[500px] p-4 `}
                theme="snow"
                value={value}
                formats={formats}
                modules={modules}
                onChange={(value) => setValue(value)}
              >
              </QuillEditor>
            </div>
            <div className="flex items-center gap-x-2">
              <FormSubmit isLoading={isLoading}>Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>

        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            <div
              className="max-h-40 overflow-auto" // Limits the height to 10rem (40 pixels per line assuming 4 lines) and adds scrolling
              style={{ wordWrap: 'break-word' }} // Ensures text wraps properly
              dangerouslySetInnerHTML={{ __html: data.description || "Add a more detailed description..." }}
            />
            <style jsx>{`
        div {
          img {
            max-width: 100%;
            height: auto;
          }
        }
      `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};
