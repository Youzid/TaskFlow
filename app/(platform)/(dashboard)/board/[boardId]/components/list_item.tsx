"use client";

import { ElementRef, useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { ListHeader } from "./list-header";
import { ListWithCards } from "@/lib/types";
import { CardItem } from "./card-item";
import { CardForm } from "./card-form";
import { updateListColor } from "@/actions/update-list-color";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import { Palette } from "lucide-react";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";



interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [colorsOpen, setColorsOpen] = useState(false)
  const { execute } = useAction(updateListColor, {
    onError: (error) => {
      toast.error(error);
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };
  const ListColors = [
    '#fce6cc',
    '#cfe7f6',
    '#f2cfd0',
    '#c4f3aa',
    '#f1f2f4'
  ];
  const [listColor, setListColor] = useState(data.color)

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >

          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md  shadow-md pb-2 bg-white"
            style={{ backgroundColor: `${listColor}` }}
          >
            <div onMouseEnter={() => setColorsOpen(true)} onMouseLeave={() => setColorsOpen(false)} className="flex justify-end pt-1 items-center gap-2 px-1 relative h-5  ">

              <Palette className={`w-4 h-4 absolute right-1 cursor-pointer ${colorsOpen && "text-main scale-105"}  duration-200`} />
              {colorsOpen &&
                ListColors.map((color, i) => (
                  <div onClick={() => { execute({ boardId: data.boardId, color, id: data.id }); setListColor(color) }} key={i} className={`w-4 h-4 animate-slowfade -translate-x-6 shadow-md duration-150 cursor-pointer rounded  hover:scale-105 saturate-[3] ${color === listColor && "scale-105 border border-black"}`} style={{ backgroundColor: color }}></div>
                ))}
            </div>
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2 ",
                    data.cards.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data.cards.map((card, index) => (
                    <CardItem index={index} key={card.id} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};
