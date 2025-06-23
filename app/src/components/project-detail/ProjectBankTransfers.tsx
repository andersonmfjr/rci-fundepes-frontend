import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ValidationButton } from "@/components/ui/validation-button";
import { ArrowRight, CheckCircle, Clock, Building, CreditCard } from "lucide-react";
import { Project, Transfer, BankAccount } from '@/types';
import { formatCurrency } from '@/lib/projects/utils';
import { useValidation } from '@/hooks/use-validation';

interface ProjectBankTransfersProps {
  project: Project;
}

const ProjectBankTransfers = ({ project }: ProjectBankTransfersProps) => {
  const transfers = project.transfers || [];
  const [transferValidations, setTransferValidations] = useState<Record<number, boolean>>(
    transfers.reduce((acc, transfer) => ({
      ...acc,
      [transfer.id]: transfer.validada
    }), {})
  );

  const { validateEntity: validateTransfer, isValidating: isValidatingTransfer } = useValidation({
    entityType: 'transfer'
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleValidateTransfer = async (transferId: number, currentValidation: boolean) => {
    try {
      await validateTransfer(transferId, currentValidation);
      setTransferValidations(prev => ({
        ...prev,
        [transferId]: !currentValidation
      }));
    } catch (error) {
      console.error('Erro ao validar transferência:', error);
    }
  };



  const renderBankAccount = (account: BankAccount, label: string) => (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
      <Building className="w-4 h-4 text-gray-500" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {account.banco.nome}
        </div>
        <div className="text-xs text-gray-500">
          Ag: {account.agencia} | CC: {account.numero}
        </div>
        <div className="text-xs text-gray-600">
          {account.unidade.sigla} - {account.unidade.nome}
        </div>
      </div>
    </div>
  );

  if (transfers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Transferências Bancárias
          </CardTitle>
          <CardDescription>
            Histórico de transferências de RCI relacionadas ao contrato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma transferência registrada</p>
            <p className="text-sm text-gray-400 mt-1">
              As transferências aparecerão aqui quando forem processadas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular totais
  const totalTransferencias = transfers.reduce((sum, transfer) => sum + transfer.valor, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Transferências Bancárias
        </CardTitle>
        <CardDescription>
          Histórico de transferências de RCI relacionadas ao projeto
        </CardDescription>
        
        {/* Resumo das transferências */}
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="text-sm">
            <span className="text-gray-600">Total de Transferências: </span>
            <span className="font-semibold">{transfers.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Valor Total: </span>
            <span className="font-semibold">{formatCurrency(totalTransferencias)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="border border-gray-200 rounded-lg p-4">
              {/* Cabeçalho da transferência */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    Transferência #{transfer.id}
                  </span>
                </div>
                <div className="text-right">
                  <ValidationButton
                    isValidated={transferValidations[transfer.id] || false}
                    isLoading={isValidatingTransfer}
                    onClick={() => handleValidateTransfer(transfer.id, transferValidations[transfer.id] || false)}
                    size="sm"
                    className="h-6 px-2 text-xs mb-2"
                  />
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(transfer.valor)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(transfer.data)}
                  </div>
                </div>
              </div>

              {/* Origem e Destino */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    CONTA ORIGEM
                  </label>
                  {renderBankAccount(transfer.conta_origem, "Origem")}
                </div>
                
                <div className="flex justify-center items-center">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    CONTA DESTINO
                  </label>
                  {renderBankAccount(transfer.conta_destino, "Destino")}
                </div>
              </div>

              {/* Observações se houver */}
              {transfer.observacao && (
                <div className="mt-3 p-2 bg-blue-50 rounded-md">
                  <label className="text-xs font-medium text-blue-700 mb-1 block">
                    OBSERVAÇÕES
                  </label>
                  <p className="text-sm text-blue-800">{transfer.observacao}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectBankTransfers; 