import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from '@/types';
import ProjectStatus from '@/components/project/ProjectStatus';

interface ProjectInfoProps {
  project: Project;
  formatDate: (dateString: string) => string;
}

const ProjectInfo = ({ project, formatDate }: ProjectInfoProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

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
            <label className="text-sm font-medium text-gray-700">Percentual RCI</label>
            <div className="mt-1">
              <Badge variant="outline" className="text-base">
                {project.rciPercentage}%
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
            <label className="text-sm font-medium text-gray-700">Valor RCI</label>
            <div className="mt-1">
              <span className="text-base font-semibold text-green-600">
                {formatCurrency(project.totalValue * (project.rciPercentage / 100))}
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
        <div>
          <label className="text-sm font-medium text-gray-700">Descrição</label>
          <p className="mt-1 text-gray-900 break-words">{project.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;
