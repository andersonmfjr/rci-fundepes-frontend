import React, { useState } from "react";
import { CheckCircle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ValidationButtonProps {
  isValidated: boolean;
  className?: string;
  showText?: boolean;
  interactive?: boolean;
  entityType?: "contract" | "transfer" | "rciDistribution" | "addendum";
  entityId?: number;
  onValidationChange?: (isValidated: boolean) => void;
}

const ValidationButton = ({
  isValidated,
  className,
  showText = true,
  interactive = false,
  entityType,
  entityId,
  onValidationChange,
}: ValidationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localIsValidated, setLocalIsValidated] = useState(isValidated);

  // Atualizar estado local quando prop externa mudar
  React.useEffect(() => {
    setLocalIsValidated(isValidated);
  }, [isValidated]);

  const handleValidationToggle = async () => {
    if (!interactive || !entityType || !entityId) return;

    setIsLoading(true);

    try {
      const { contractsService } = await import("@/lib/contracts/service");

      let result: boolean;

      if (localIsValidated) {
        // Invalidar
        switch (entityType) {
          case "contract":
            result = await contractsService.invalidateContract(entityId);
            break;
          case "rciDistribution":
            result = await contractsService.invalidateRciDistribution(entityId);
            break;
          case "addendum":
            result = await contractsService.invalidateAddendum(entityId);
            break;
          default:
            throw new Error("Tipo de entidade não suportado");
        }
      } else {
        // Validar
        switch (entityType) {
          case "contract":
            result = await contractsService.validateContract(entityId);
            break;
          case "rciDistribution":
            result = await contractsService.validateRciDistribution(entityId);
            break;
          case "addendum":
            result = await contractsService.validateAddendum(entityId);
            break;
          default:
            throw new Error("Tipo de entidade não suportado");
        }
      }

      setLocalIsValidated(result);
      onValidationChange?.(result);

      toast({
        title: result ? "Validação realizada" : "Invalidação realizada",
        description: result
          ? "Item validado com sucesso"
          : "Item invalidado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao alterar validação:", error);
      toast({
        title: "Erro na validação",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentIsValidated = interactive ? localIsValidated : isValidated;
  const tooltipText = interactive
    ? currentIsValidated
      ? "Clique para invalidar"
      : "Clique para validar"
    : undefined;

  const buttonContent = (
    <>
      {isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <CheckCircle className="w-3 h-3" />
      )}
      {showText && "Válido"}
    </>
  );

  const buttonElement = (
    <button
      type="button"
      onClick={interactive ? handleValidationToggle : undefined}
      disabled={isLoading || !interactive}
      className={cn(
        "inline-flex items-center gap-2 rounded-md text-xs font-medium border transition-colors",
        "px-2 py-1",
        currentIsValidated
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-red-50 text-red-700 border-red-200",
        interactive &&
          currentIsValidated &&
          "hover:bg-green-100 cursor-pointer",
        interactive && !currentIsValidated && "hover:bg-red-100 cursor-pointer",
        !interactive && "cursor-default",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {buttonContent}
    </button>
  );

  if (currentIsValidated) {
    if (interactive && tooltipText) {
      return (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return buttonElement;
  }

  const invalidButtonContent = (
    <>
      {isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <X className="w-3 h-3" />
      )}
      {showText && "Inválido"}
    </>
  );

  const invalidButtonElement = (
    <button
      type="button"
      onClick={interactive ? handleValidationToggle : undefined}
      disabled={isLoading || !interactive}
      className={cn(
        "inline-flex items-center gap-2 rounded-md text-xs font-medium border transition-colors",
        "px-2 py-1",
        "bg-red-50 text-red-700 border-red-200",
        interactive && "hover:bg-red-100 cursor-pointer",
        !interactive && "cursor-default",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {invalidButtonContent}
    </button>
  );

  if (interactive && tooltipText) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>{invalidButtonElement}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return invalidButtonElement;
};

export { ValidationButton };
