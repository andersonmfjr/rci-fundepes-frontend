import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ValidationButton } from "@/components/ui/validation-button";
import { Clock, Building2, Percent } from "lucide-react";
import {
  formatCurrency,
  getRootUnit,
  buildUnitPathString,
} from "@/lib/contracts/utils";
import { mockAcademicUnits } from "@/lib/contracts/mockData";

interface ContractRciDistributionProps {
  contract: ContractDetail;
}

const ContractRciDistribution = ({
  contract,
}: ContractRciDistributionProps) => {
  const distributions = contract.distribuicoes_rci || [];
  const [distributionValidations, setDistributionValidations] = useState<
    Record<number, boolean>
  >(
    distributions.reduce(
      (acc, distribution) => ({
        ...acc,
        [distribution.id]: distribution.validado,
      }),
      {}
    )
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (distributions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Distribuição RCI
          </CardTitle>
          <CardDescription>
            Distribuição do Ressarcimento de Custos Indiretos entre unidades
            acadêmicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Percent className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma distribuição configurada</p>
            <p className="text-sm text-gray-400 mt-1">
              A distribuição RCI será configurada após a validação do contrato
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular totais
  const totalPercentual = distributions.reduce(
    (sum, dist) => sum + dist.percentual,
    0
  );
  const totalValorBase = distributions.reduce(
    (sum, dist) => sum + dist.valor_base_calculo,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="w-5 h-5" />
          Distribuição RCI
        </CardTitle>
        <CardDescription>
          Distribuição do Ressarcimento de Custos Indiretos entre unidades
          acadêmicas
        </CardDescription>

        {/* Resumo da distribuição */}
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="text-sm">
            <span className="text-gray-600">Total de Unidades: </span>
            <span className="font-semibold">{distributions.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Percentual Total: </span>
            <span className="font-semibold">{totalPercentual.toFixed(1)}%</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Valor Base Total: </span>
            <span className="font-semibold">
              {formatCurrency(totalValorBase)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {distributions.map((distribution) => {
            const valorRci =
              (distribution.valor_base_calculo * distribution.percentual) / 100;

            return (
              <div
                key={distribution.id}
                className={`border rounded-lg p-4 ${distributionValidations[distribution.id] || false
                    ? "border-gray-200"
                    : "border-4 border-red-400"
                  }`}
              >
                {/* Cabeçalho da distribuição */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {distribution.unidade.sigla}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {distribution.unidade.nome}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <ValidationButton
                      isValidated={
                        distributionValidations[distribution.id] || false
                      }
                      className="h-6 px-2 text-xs"
                      interactive={true}
                      entityType="rciDistribution"
                      entityId={distribution.id}
                      onValidationChange={(isValidated) =>
                        setDistributionValidations((prev) => ({
                          ...prev,
                          [distribution.id]: isValidated,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Informações da distribuição */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <label className="text-xs font-medium text-blue-700 mb-1 block">
                      PERCENTUAL RCI
                    </label>
                    <div className="text-lg font-bold text-blue-800">
                      {distribution.percentual}%
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-md">
                    <label className="text-xs font-medium text-green-700 mb-1 block">
                      VALOR BASE
                    </label>
                    <div className="text-sm font-semibold text-green-800">
                      {formatCurrency(distribution.valor_base_calculo)}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-md">
                    <label className="text-xs font-medium text-purple-700 mb-1 block">
                      VALOR RCI
                    </label>
                    <div className="text-sm font-semibold text-purple-800">
                      {formatCurrency(valorRci)}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      DATA CRIAÇÃO
                    </label>
                    <div className="text-xs text-gray-600">
                      {formatDate(distribution.data_criacao)}
                    </div>
                  </div>
                </div>

                {/* Informações da unidade e hierarquia */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Instituição:</span>{" "}
                    {(() => {
                      const rootUnit = getRootUnit(
                        distribution.unidade,
                        mockAcademicUnits
                      );
                      return `${rootUnit.sigla} - ${rootUnit.nome}`;
                    })()}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Hierarquia:</span>{" "}
                    {buildUnitPathString(
                      distribution.unidade,
                      mockAcademicUnits
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Tipo de Unidade:</span>{" "}
                    {distribution.unidade.tipo_unidade.descricao}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alerta se percentual não bate 100% */}
        {totalPercentual !== 100 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                Atenção: O percentual total de distribuição é{" "}
                {totalPercentual.toFixed(1)}%
                {totalPercentual < 100
                  ? " (faltam " + (100 - totalPercentual).toFixed(1) + "%)"
                  : " (excede em " + (totalPercentual - 100).toFixed(1) + "%)"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractRciDistribution;
