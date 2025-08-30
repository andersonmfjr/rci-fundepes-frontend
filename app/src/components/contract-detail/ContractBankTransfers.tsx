import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Building,
  CreditCard,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/contracts/utils";
import ValidateTransfersDialog from "./ValidateTransfersDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface ContractBankTransfersProps {
  contract: ContractDetail;
}

const ContractBankTransfers = ({ contract }: ContractBankTransfersProps) => {
  const transfers = contract.distribuicoes_rci.flatMap(
    (distribuicao) => distribuicao.transferencias
  );

  const [transferValidations] = useState<Record<number, boolean>>(
    transfers.reduce(
      (acc, transfer) => ({
        ...acc,
        [transfer.id_transferencia]: transfer.validada,
      }),
      {}
    )
  );

  const [selectedTransferId, setSelectedTransferId] = useState<number | null>(
    null
  );
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalTransferencias = transfers.reduce(
    (sum, transfer) => sum + parseFloat(transfer.valor),
    0
  );

  const totalPercentual = contract.distribuicoes_rci.reduce(
    (sum, dist) => sum + parseFloat(dist.percentual),
    0
  );
  const valorTotalContrato = parseFloat(contract.valor_total || "0");
  const valorTotalRci = valorTotalContrato * totalPercentual;

  const percentualRciDistribuido =
    valorTotalRci > 0 ? (totalTransferencias / valorTotalRci) * 100 : 0;
  const valorRciFaltante = valorTotalRci - totalTransferencias;
  const percentualRciFaltante = 100 - percentualRciDistribuido;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const renderBankAccount = (account: ProjectAccount | RciAccount) => (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
      <Building className="w-4 h-4 text-gray-500" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {account.id_banco.nome}
        </div>
        <div className="text-xs text-gray-500">
          Ag: {account.agencia} | CC: {account.numero}
        </div>
        {(account as RciAccount).id_unidade && (
          <div className="text-xs text-gray-600">
            {(account as RciAccount).id_unidade.sigla} -{" "}
            {(account as RciAccount).id_unidade.nome}
          </div>
        )}
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

          {/* Alerta se o valor distribuído não bate com o valor total de RCI */}
          {valorTotalRci > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">
                  Atenção: Falta distribuir {formatCurrency(valorTotalRci)}{" "}
                  (100%) do RCI total
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

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

        {/* Resumo das transferências */}
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="text-sm">
            <span className="text-gray-600">Total de Transferências: </span>
            <span className="font-semibold">{transfers.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Valor Total: </span>
            <span className="font-semibold">
              {formatCurrency(totalTransferencias)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <div
              key={transfer.id_transferencia}
              className={`border rounded-lg p-4 ${
                transferValidations[transfer.id_transferencia] || false
                  ? "border-gray-200"
                  : "border-4 border-red-400"
              }`}
            >
              {/* Cabeçalho da transferência */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    Transferência #{transfer.id_transferencia}
                  </span>
                </div>
                <div className="text-right">
                  {!transferValidations[transfer.id_transferencia] && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTransferId(transfer.id_transferencia);
                              setSelectedTransfer(transfer);
                              setDialogOpen(true);
                            }}
                            className={cn(
                              "inline-flex items-center gap-2 rounded-md text-xs font-medium border transition-colors",
                              "px-2 py-1",
                              "bg-red-50 text-red-700 border-red-200",
                              "hover:bg-red-100 cursor-pointer"
                            )}
                          >
                            <X className="w-3 h-3" />
                            Inválido
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Clique para validar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
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
                  {renderBankAccount(transfer.id_conta_projeto)}
                </div>

                <div className="flex justify-center items-center">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    CONTA DESTINO
                  </label>
                  {renderBankAccount(transfer.id_conta_rci)}
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

        {/* Alerta se o valor distribuído não bate com o valor total de RCI */}
        {totalTransferencias !== valorTotalRci && valorTotalRci > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                Atenção:{" "}
                {totalTransferencias < valorTotalRci
                  ? `Falta distribuir ${formatCurrency(
                      valorRciFaltante
                    )} (${percentualRciFaltante.toFixed(
                      0
                    )}%) do RCI total de ${formatCurrency(valorTotalRci)}`
                  : `Excede em ${formatCurrency(
                      totalTransferencias - valorTotalRci
                    )} o RCI total de ${formatCurrency(valorTotalRci)}`}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      {selectedTransferId && (
        <ValidateTransfersDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          transferId={selectedTransferId}
          contractId={contract.id_contrato}
          transfer={selectedTransfer || undefined}
        />
      )}
    </Card>
  );
};

export default ContractBankTransfers;
