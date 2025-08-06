import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BiDetailsStatsProps {
  stats: BiDetailsStats;
  formatCurrency: (value: number) => string;
  formatCompactCurrency: (value: number) => string;
}

const BiDetailsStats: React.FC<BiDetailsStatsProps> = ({
  stats,
  formatCurrency,
  formatCompactCurrency,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Identificador */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Identificador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.identificador}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {stats.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Financiador */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Financiador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.financiador}</div>
        </CardContent>
      </Card>

      {/* Unidade Acadêmica */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Unidade Acadêmica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.unidade_academica}</div>
        </CardContent>
      </Card>

      {/* % RCI Reitoria */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            % RCI Reitoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.percentual_rci_reitoria}%
          </div>
        </CardContent>
      </Card>

      {/* Valor total projeto */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Valor total projeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCompactCurrency(stats.valor_total_projeto)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.contratos_projeto} contrato
          </div>
        </CardContent>
      </Card>

      {/* RCI recebido */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            RCI recebido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCompactCurrency(stats.rci_recebido)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.contratos_recebidos} contrato
          </div>
        </CardContent>
      </Card>

      {/* RCI a receber */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            RCI a receber
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCompactCurrency(stats.rci_a_receber)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.contratos_a_receber} contrato
          </div>
        </CardContent>
      </Card>

      {/* % RCI Unidade A. */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            % RCI Unidade A.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.percentual_rci_unidade}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiDetailsStats;
