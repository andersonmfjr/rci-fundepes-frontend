import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidationButton } from "@/components/ui/validation-button";
import { FileText, TrendingUp, TrendingDown } from "lucide-react";
import { Project, ContractAddendum } from '@/types';
import { formatCurrency } from '@/lib/projects/utils';
import { useValidation } from '@/hooks/use-validation';

interface ProjectContractAddendumsProps {
  project: Project;
}

const ProjectContractAddendums = ({ project }: ProjectContractAddendumsProps) => {
  const addendums = project.aditivos_contratuais || [];
  const [addendumValidations, setAddendumValidations] = useState<Record<number, boolean>>(
    addendums.reduce((acc, addendum) => ({
      ...acc,
      [addendum.id]: addendum.validado
    }), {})
  );

  const { validateEntity: validateAddendum, isValidating: isValidatingAddendum } = useValidation({
    entityType: 'addendum'
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleValidateAddendum = async (addendumId: number, currentValidation: boolean) => {
    try {
      await validateAddendum(addendumId, currentValidation);
      setAddendumValidations(prev => ({
        ...prev,
        [addendumId]: !currentValidation
      }));
    } catch (error) {
      console.error('Erro ao validar aditivo:', error);
    }
  };



  const getValueChangeIndicator = (addendum: ContractAddendum, previousValue: number) => {
    const difference = addendum.novo_total - previousValue;
    const isIncrease = difference > 0;
    const percentage = ((Math.abs(difference) / previousValue) * 100).toFixed(1);

    return {
      difference,
      isIncrease,
      percentage,
      icon: isIncrease ? TrendingUp : TrendingDown,
      color: isIncrease ? 'text-green-600' : 'text-red-600',
      bgColor: isIncrease ? 'bg-green-50' : 'bg-red-50'
    };
  };

  if (addendums.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Aditivos Contratuais
          </CardTitle>
          <CardDescription>
            Histórico de aditivos e alterações no valor do contrato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum aditivo registrado</p>
            <p className="text-sm text-gray-400 mt-1">
              Os aditivos contratuais aparecerão aqui quando forem processados
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ordenar aditivos por data
  const sortedAddendums = [...addendums].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  // Calcular valores iniciais e totais
  const valorOriginal = project.contrato?.valor_total || project.valor_total;
  const valorAtual = sortedAddendums.length > 0 
    ? sortedAddendums[sortedAddendums.length - 1].novo_total 
    : valorOriginal;
  const totalAumento = valorAtual - valorOriginal;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Aditivos Contratuais
          </CardTitle>
        </div>
        <CardDescription>
          Histórico de aditivos e alterações no valor do contrato
        </CardDescription>
        
        {/* Resumo dos aditivos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="text-sm">
            <span className="text-gray-600 block">Total de Aditivos</span>
            <span className="font-semibold text-lg">{addendums.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600 block">Valor Original</span>
            <span className="font-semibold text-lg">{formatCurrency(valorOriginal)}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600 block">Valor Atual</span>
            <span className={`font-semibold text-lg ${totalAumento >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(valorAtual)}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Linha de valor original */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">0</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Valor Original do Contrato</h3>
                  <p className="text-sm text-gray-600">Valor inicial conforme contrato base</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(valorOriginal)}
                </div>
              </div>
            </div>
          </div>

          {/* Aditivos */}
          {sortedAddendums.map((addendum, index) => {
            const previousValue = index === 0 ? valorOriginal : sortedAddendums[index - 1].novo_total;
            const changeInfo = getValueChangeIndicator(addendum, previousValue);
            const ChangeIcon = changeInfo.icon;

            return (
              <div key={addendum.id} className="border border-gray-200 rounded-lg p-4">
                {/* Cabeçalho do aditivo */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Aditivo #{addendum.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(addendum.data)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <ValidationButton
                      isValidated={addendumValidations[addendum.id] || false}
                      isLoading={isValidatingAddendum}
                      onClick={() => handleValidateAddendum(addendum.id, addendumValidations[addendum.id] || false)}
                      size="sm"
                      className="h-6 px-2 text-xs mb-2"
                    />
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(addendum.novo_total)}
                    </div>
                  </div>
                </div>

                {/* Alteração de valor */}
                <div className={`p-3 rounded-md ${changeInfo.bgColor} mb-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChangeIcon className={`w-4 h-4 ${changeInfo.color}`} />
                      <span className={`text-sm font-medium ${changeInfo.color}`}>
                        {changeInfo.isIncrease ? 'Aumento' : 'Redução'} de {formatCurrency(Math.abs(changeInfo.difference))}
                      </span>
                    </div>
                    <div className={`text-sm font-semibold ${changeInfo.color}`}>
                      {changeInfo.isIncrease ? '+' : '-'}{changeInfo.percentage}%
                    </div>
                  </div>
                </div>

                {/* Descrição do aditivo */}
                {addendum.descricao && (
                  <div className="p-2 bg-blue-50 rounded-md">
                    <label className="text-xs font-medium text-blue-700 mb-1 block">
                      DESCRIÇÃO
                    </label>
                    <p className="text-sm text-blue-800">{addendum.descricao}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Resumo final */}
          <div className="border-t-2 border-gray-300 pt-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Resumo Final</h3>
                  <p className="text-sm text-gray-600">
                    {totalAumento >= 0 
                      ? `Aumento total de ${formatCurrency(totalAumento)}`
                      : `Redução total de ${formatCurrency(Math.abs(totalAumento))}`
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Valor Final</div>
                  <div className={`text-xl font-bold ${totalAumento >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(valorAtual)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectContractAddendums; 