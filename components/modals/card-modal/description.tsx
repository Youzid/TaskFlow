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
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorComponent from 'react-froala-wysiwyg'
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/file.min.js";
import "froala-editor/js/plugins/char_counter.min.js"
import "froala-editor/js/plugins/save.min.js"
import { Button } from "@/components/ui/button";
import { useEdgeStore } from "@/lib/edgestore";
import { FormSubmit } from "@/components/form/form-submit";

interface DescriptionProps {
  data: CardWithList;
}


export const Description = ({ data }: DescriptionProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [model, setModel] = useState(data.description || "")
  const [isEditing, setIsEditing] = useState(false);
  const { edgestore } = useEdgeStore();
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

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
    const description = model
    const boardId = params.boardId as string;

    execute({
      id: data.id,
      description,
      boardId,
    });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2 ">
            <div className="relative">
              {isLoading &&
                <Loader2Icon className="w-8 h-8 text-main animate-spin absolute inset-[47%] z-50" />
              }
              <FroalaEditorComponent
                model={model}
                onModelChange={(e: string) => { setModel(e) }}
                tag='textarea'
                config={{
                  placeholderText: 'Edit Your Content Here!',
                  charCounterCount: true,
                  charCounterMax: 80,
                  imageMaxSize: 1 * 1024 * 1024,
                  imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                  events: {
                    'charCounter.exceeded': function () {
                      alert('exceeded');
                    },

                    'image.beforeUpload': async function (this: any, images: any) {
                      if (images[0].size > 1048576) {
                        toast.error("File size too large ");
                        return false;
                      }
                      const data = new FormData();
                      data.append('image', images[0]);
                      try {
                        setIsLoading(true)
                        const res = await edgestore.publicFiles.upload({
                          file: images[0],
                        });
                        if (res.url) {
                          this.image.insert(res.url, null, null, this.image.get());
                        }
                        return false;
                      } catch (err) {
                        console.error(err);
                        return false;
                      } finally {
                        setIsLoading(false)
                      }
                    } as any,
                  },
                }}
              />
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
