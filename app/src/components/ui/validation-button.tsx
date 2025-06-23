import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationButtonProps {
  isValidated: boolean;
  isLoading?: boolean;
  onClick: () => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
  showText?: boolean;
}

const ValidationButton = ({
  isValidated,
  isLoading = false,
  onClick,
  size = 'sm',
  variant = 'outline',
  className,
  disabled = false,
  showText = true
}: ValidationButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isLoading) {
      onClick();
    }
  };

  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={cn("gap-2", className)}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        {showText && "Processando..."}
      </Button>
    );
  }

  if (isValidated) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "gap-2 text-yellow-700 border-yellow-300 hover:bg-yellow-50 hover:text-yellow-800 hover:border-yellow-400",
          className
        )}
      >
        <X className="w-4 h-4" />
        {showText && "Desvalidar"}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "gap-2 text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800 hover:border-green-400",
        className
      )}
    >
      <CheckCircle className="w-4 h-4" />
      {showText && "Validar"}
    </Button>
  );
};

export { ValidationButton }; 