import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidationButton } from "@/components/ui/validation-button";
import { Button } from "@/components/ui/button";
import { formatCurrency, buildUnitPathString } from "@/lib/contracts/utils";
import { mockAcademicUnits } from "@/lib/contracts/mockData";
import ContractAlertsDialog from "@/components/contracts/ContractAlertsDialog";

import {
  Calendar,
  DollarSign,
  Building,
  User,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface ContractInfoProps {
  contract: ContractDetail;
  formatDate: (dateString: string) => string;
}

const ContractInfo = ({ contract, formatDate }: ContractInfoProps) => {
  const [contractValidation, setContractValidation] = useState(
    contract.validado || false
  );
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false);
  const hasAlerts = contract.alertas && contract.alertas.length > 0;

  const totalRciPercentage =
    contract.distribuicoes_rci?.reduce(
      (total, dist) => total + (dist?.percentual || 0),
      0
    ) || 0;

  const totalRciValue =
    contract.distribuicoes_rci?.reduce(
      (total, dist) =>
        total +
        ((dist?.valor_base_calculo || 0) * (dist?.percentual || 0)) / 100,
      0
    ) || 0;

  const getVigenciaStatus = (start: string, end: string) => {
    if (!start || !end) {
      return {
        status: "Não informado",
        color: "bg-gray-100 text-gray-700 border-gray-200",
      };
    }

    const today = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return {
        status: "Data inválida",
        color: "bg-red-100 text-red-700 border-red-200",
      };
    }

    if (endDate < today) {
      return {
        status: "Finalizado",
        color: "bg-red-100 text-red-700 border-red-200",
      };
    } else if (startDate > today) {
      return {
        status: "Não iniciado",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      };
    } else {
      return {
        status: "Ativo",
        color: "bg-green-100 text-green-700 border-green-200",
      };
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg lg:text-xl">
              Informações do contrato
            </CardTitle>
            {hasAlerts && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAlertsDialogOpen(true)}
                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 p-1 h-auto"
              >
                <AlertTriangle className="w-5 h-5" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações financeiras principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Valor total
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-800">
                {formatCurrency(contract.valor_total)}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Valor RCI total
                </span>
              </div>
              <div className="text-2xl font-bold text-green-800">
                {formatCurrency(totalRciValue)}
              </div>
              <div className="text-sm text-green-600 mt-1">
                {totalRciPercentage.toFixed(1)}% do valor total
              </div>
            </div>
          </div>

          {/* Informações do contrato detalhadas */}
          <div className="space-y-4">
            <div
              className={`border rounded-lg p-4 ${contractValidation
                  ? "border-gray-200"
                  : "border-4 border-red-400"
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">
                  Detalhes do contrato
                </h4>
                <ValidationButton
                  isValidated={contractValidation}
                  className="h-6 px-2 text-xs"
                  interactive={true}
                  entityType="contract"
                  entityId={contract.id}
                  onValidationChange={setContractValidation}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    TIPO DE CONTRATO
                  </label>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {contract.tipo_contrato?.descricao || "Não informado"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    FINANCIADOR
                  </label>
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">
                        {contract.financiador?.nome || "Não informado"}
                      </div>
                      {contract.financiador?.tipo && (
                        <div className="text-xs text-gray-500">
                          {contract.financiador.tipo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    DATA DE CRIAÇÃO
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {contract.data_criacao
                        ? formatDate(contract.data_criacao)
                        : "Não informado"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    UNIDADE ACADÊMICA
                  </label>
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">
                        {contract.unidade_academica?.sigla || "Não informado"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {contract.unidade_academica?.nome || "Não informado"}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {contract.unidade_academica
                          ? buildUnitPathString(
                            contract.unidade_academica,
                            mockAcademicUnits
                          )
                          : "Não informado"}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs font-medium text-gray-600">
                      VIGÊNCIA
                    </label>
                    {(() => {
                      const vigencia = getVigenciaStatus(
                        contract.vigencia_inicio || "",
                        contract.vigencia_fim || ""
                      );
                      return (
                        <Badge
                          variant="secondary"
                          className={`text-xs ${vigencia.color}`}
                        >
                          {vigencia.status}
                        </Badge>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">
                        {contract.vigencia_inicio && contract.vigencia_fim
                          ? `${formatDate(
                            contract.vigencia_inicio
                          )} até ${formatDate(contract.vigencia_fim)}`
                          : "Não informado"}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    ÚLTIMA ATUALIZAÇÃO
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {contract.data_atualizacao
                        ? formatDate(contract.data_atualizacao)
                        : "Não informado"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Descrição
            </label>
            <p className="mt-1 text-gray-900 break-words">
              {contract.descricao || "Descrição não informada"}
            </p>
          </div>
        </CardContent>
      </Card>

      {hasAlerts && (
        <ContractAlertsDialog
          open={alertsDialogOpen}
          onOpenChange={setAlertsDialogOpen}
          alerts={contract.alertas}
          contractName={contract.nome || "Contrato"}
        />
      )}
    </>
  );
};

export default ContractInfo;
