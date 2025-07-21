import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidationButton } from "@/components/ui/validation-button";
import { Contract } from "@/types";
import {
  calculateTotalRciPercentage,
  calculateTotalRciValue,
  formatCurrency,
  buildUnitPathString,
} from "@/lib/contracts/utils";
import { mockAcademicUnits } from "@/lib/contracts/mockData";
import { useValidation } from "@/hooks/use-validation";
import {
  Calendar,
  DollarSign,
  Building,
  User,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";

interface ContractInfoProps {
  contract: Contract;
  formatDate: (dateString: string) => string;
  onContractUpdate?: (updatedContract: Contract) => void;
}

const ContractInfo = ({
  contract,
  formatDate,
  onContractUpdate,
}: ContractInfoProps) => {
  const [contractValidation, setContractValidation] = useState(
    contract.contrato?.validado || false
  );
  const totalRciPercentage = calculateTotalRciPercentage(contract.unidades);
  const totalRciValue = calculateTotalRciValue(contract);
  const contract = contract.contrato;

  const {
    validateEntity: validateContract,
    isValidating: isValidatingContract,
  } = useValidation({
    entityType: "contract",
    onSuccess: () => {
      // Atualizar estado local
      setContractValidation(!contractValidation);

      // Notificar componente pai se callback fornecido
      if (onContractUpdate && contract) {
        const updatedContract = {
          ...contract,
          contract: {
            ...contract,
            validado: !contractValidation,
          },
        };
        onContractUpdate(updatedContract);
      }
    },
  });

  const getValidationBadge = (validado: boolean) => {
    if (validado) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-700 border-green-200"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Validado
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-yellow-100 text-yellow-700 border-yellow-200"
      >
        <Clock className="w-3 h-3 mr-1" />
        Pendente Validação
      </Badge>
    );
  };

  const getVigenciaStatus = (inicio: string, fim: string) => {
    const hoje = new Date();
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);

    if (dataFim < hoje) {
      return {
        status: "Finalizado",
        color: "bg-red-100 text-red-700 border-red-200",
      };
    } else if (dataInicio > hoje) {
      return {
        status: "Não Iniciado",
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg lg:text-xl">
            Informações do Contrato
          </CardTitle>
          {contract && (
            <ValidationButton
              isValidated={contractValidation}
              isLoading={isValidatingContract}
              onClick={() => validateContract(contract.id, contractValidation)}
              size="sm"
              className="h-6 px-2 text-xs"
            />
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
                Valor Total
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
                Valor RCI Total
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
        {contract && (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Detalhes do Contrato
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    TIPO DE CONTRATO
                  </label>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {contract.tipo_contrato.descricao}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    FINANCIADOR
                  </label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">
                        {contract.financiador.nome}
                      </div>
                      {contract.financiador.tipo && (
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
                      {formatDate(contract.data_criacao)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    UNIDADE ACADÊMICA
                  </label>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">
                        {contract.unidade_academica.sigla}
                      </div>
                      <div className="text-xs text-gray-500">
                        {contract.unidade_academica.nome}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {buildUnitPathString(
                          contract.unidade_academica,
                          mockAcademicUnits
                        )}
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
                        contract.vigencia_inicio,
                        contract.vigencia_fim
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
                        {formatDate(contract.vigencia_inicio)} até{" "}
                        {formatDate(contract.vigencia_fim)}
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
                      {formatDate(contract.data_atualizacao)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Descrição */}
        <div>
          <label className="text-sm font-medium text-gray-700">Descrição</label>
          <p className="mt-1 text-gray-900 break-words">{contract.descricao}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractInfo;
