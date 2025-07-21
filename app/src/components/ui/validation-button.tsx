import React from "react";
import { CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationButtonProps {
  isValidated: boolean;
  className?: string;
  showText?: boolean;
}

const ValidationButton = ({
  isValidated,
  className,
  showText = true,
}: ValidationButtonProps) => {
  if (isValidated) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200",
          className
        )}
      >
        <CheckCircle className="w-3 h-3" />
        {showText && "Válido"}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200",
        className
      )}
    >
      <X className="w-3 h-3" />
      {showText && "Inválido"}
    </div>
  );
};

export { ValidationButton };
