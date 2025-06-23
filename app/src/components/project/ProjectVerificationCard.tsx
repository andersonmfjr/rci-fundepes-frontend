import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";
import { Project } from '@/types';

interface ProjectVerificationCardProps {
  project: Project;
}

const ProjectVerificationCard = ({ project }: ProjectVerificationCardProps) => {
  const verificationItems = [
    {
      label: 'Informações básicas preenchidas',
      isCompleted: Boolean(project.name && project.description && project.totalValue > 0)
    },
    {
      label: 'Contrato anexado',
      isCompleted: Boolean(project.contractFile || project.contractLink)
    },
    {
      label: `Unidades RCI configuradas (${project.units.length})`,
      isCompleted: project.units.length > 0 && project.units.every(unit => 
        unit.name.trim() !== '' && unit.rciPercentage > 0
      )
    },
    // FIXME: Bank statements verification for MVP
    /* {
      label: `Extratos bancários (${project.bankStatements.length})`,
      isCompleted: project.bankStatements.length > 0
    } */
  ];

  const allCompleted = verificationItems.every(item => item.isCompleted);

  // Status da validação baseado no status do projeto
  const getValidationStatus = () => {
    if (project.status === 'pending') {
      return {
        text: 'Projeto em validação',
        isCompleted: true,
        color: 'text-blue-600'
      };
    } else if (project.status === 'validated' || project.status === 'completed') {
      return {
        text: 'Projeto validado',
        isCompleted: true,
        color: 'text-green-600'
      };
    } else {
      return {
        text: 'Projeto em validação',
        isCompleted: false,
        color: 'text-gray-500'
      };
    }
  };

  const validationStatus = getValidationStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Verificação do Projeto</CardTitle>
        <CardDescription>
          Itens de verificação e status de validação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {verificationItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {item.isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <span className={`text-sm ${item.isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center gap-3">
            {validationStatus.isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${validationStatus.color}`}>
              {validationStatus.text}
            </span>
          </div>
        </div>

        {allCompleted && project.status === 'draft' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ✅ Projeto pronto para envio. Todas as verificações foram atendidas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectVerificationCard;
