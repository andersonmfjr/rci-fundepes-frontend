import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export type ValidatableEntity = 'contract' | 'rci-distribution' | 'transfer' | 'addendum';

interface UseValidationProps {
  entityType: ValidatableEntity;
  onSuccess?: () => void;
}

export const useValidation = ({ entityType, onSuccess }: UseValidationProps) => {
  const [isValidating, setIsValidating] = useState(false);

  const validateEntity = async (entityId: string | number, currentValidation: boolean) => {
    setIsValidating(true);
    
    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar chamadas reais para API quando backend estiver disponível
      console.log(`${currentValidation ? 'Desvalidando' : 'Validando'} ${entityType} ID: ${entityId}`);
      
      const entityNames = {
        'contract': 'Contrato',
        'rci-distribution': 'Distribuição RCI',
        'transfer': 'Transferência',
        'addendum': 'Aditivo Contratual'
      };
      
      toast({
        title: `${entityNames[entityType]} ${currentValidation ? 'desvalidado' : 'validado'}`,
        description: `O ${entityNames[entityType]} foi ${currentValidation ? 'desvalidado' : 'validado'} com sucesso`,
        variant: "default",
      });
      
      onSuccess?.();
      
      return !currentValidation; // Retorna o novo estado de validação
      
    } catch (error) {
      const entityNames = {
        'contract': 'Contrato',
        'rci-distribution': 'Distribuição RCI',
        'transfer': 'Transferência',
        'addendum': 'Aditivo Contratual'
      };
      
      toast({
        title: "Erro na validação",
        description: `Não foi possível ${currentValidation ? 'invalidar' : 'validar'} o ${entityNames[entityType]}`,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    validateEntity,
    isValidating
  };
}; 