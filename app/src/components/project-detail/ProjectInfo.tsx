import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from '@/types';
import ProjectStatus from '@/components/project/ProjectStatus';
import { calculateTotalRciPercentage, calculateTotalRciValue, calculateUnitRciValue, formatCurrency } from '@/lib/projects/utils';

interface ProjectInfoProps {
  project: Project;
  formatDate: (dateString: string) => string;
}

const ProjectInfo = ({ project, formatDate }: ProjectInfoProps) => {
  const totalRciPercentage = calculateTotalRciPercentage(project.units);
  const totalRciValue = calculateTotalRciValue(project);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Informações Gerais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1">
              <ProjectStatus status={project.status} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Percentual RCI Total</label>
            <div className="mt-1">
              <Badge variant="outline" className="text-base">
                {totalRciPercentage.toFixed(1)}%
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Valor Total</label>
            <div className="mt-1">
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(project.totalValue)}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Valor RCI Total</label>
            <div className="mt-1">
              <span className="text-base font-semibold text-green-600">
                {formatCurrency(totalRciValue)}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Data de Criação</label>
            <p className="mt-1 text-gray-900">{formatDate(project.createdAt)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Última Atualização</label>
            <p className="mt-1 text-gray-900">{formatDate(project.updatedAt)}</p>
          </div>
        </div>

        {/* Unidades RCI */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">Unidades RCI</label>
          <div className="space-y-3">
            {project.units.map((unit) => (
              <div key={unit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{unit.name}</span>
                  <Badge variant="secondary">
                    {unit.rciPercentage}%
                  </Badge>
                </div>
                <span className="font-semibold text-green-600">
                  {formatCurrency(calculateUnitRciValue(project.totalValue, unit.rciPercentage))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Descrição</label>
          <p className="mt-1 text-gray-900 break-words">{project.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;
