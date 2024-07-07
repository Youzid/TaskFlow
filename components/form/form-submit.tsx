"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

interface FormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  variant?:
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "primary";
}

export const FormSubmit = ({
  children,
  disabled,
  isLoading,
  className,
  variant = "primary",
}: FormSubmitProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending || disabled || isLoading}
      type="submit"
      variant={variant}
      size="sm"
      className={cn(className)}
    >
      {pending ? <Loader2Icon className="text-white w-10 h-6 animate-spin" /> : children}
    </Button>
  );
};
