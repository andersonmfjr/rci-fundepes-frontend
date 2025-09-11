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
import { formatCurrency } from "@/lib/contracts/utils";

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
        [distribution.id_distribuicao_rci]: distribution.validado,
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

  const totalPercentual = distributions.reduce(
    (sum, dist) => sum + parseFloat(dist.percentual),
    0
  );

  const valorTotalRci = distributions.reduce(
    (total, dist) =>
      total +
      parseFloat(dist.valor_base_calculo || "0") *
        (parseFloat(dist.percentual || "0") / 100),
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
            <span className="text-gray-600">Percentual RCI: </span>
            <span className="font-semibold">{totalPercentual.toFixed(2)}%</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">RCI Total do Contrato: </span>
            <span className="font-semibold">
              {formatCurrency(valorTotalRci)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {distributions.map((distribution) => {
            const valorRci =
              parseFloat(distribution.valor_base_calculo) *
              (parseFloat(distribution.percentual) / 100);

            return (
              <div
                key={distribution.id_distribuicao_rci}
                className={`border rounded-lg p-4 ${
                  distributionValidations[distribution.id_distribuicao_rci] ||
                  false
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
                        {distribution.id_unidade.sigla}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {distribution.id_unidade.nome} |{" "}
                        {distribution.id_unidade.tipo_unidade}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <ValidationButton
                      isValidated={
                        distributionValidations[
                          distribution.id_distribuicao_rci
                        ] || false
                      }
                      className="h-6 px-2 text-xs"
                      interactive={true}
                      entityType="rciDistribution"
                      entityId={distribution.id_distribuicao_rci}
                      onValidationChange={(isValidated) =>
                        setDistributionValidations((prev) => ({
                          ...prev,
                          [distribution.id_distribuicao_rci]: isValidated,
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
                      {parseFloat(distribution.percentual).toFixed(2)}%
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
                      DATA DE CRIAÇÃO
                    </label>
                    <div className="text-xs text-gray-600">
                      {formatDate(distribution.data_criacao)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractRciDistribution;
