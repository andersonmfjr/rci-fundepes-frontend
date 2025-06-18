import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Project } from '@/types';

interface ProjectVerificationCardProps {
  project: Project;
}

const ProjectVerificationCard = ({ project }: ProjectVerificationCardProps) => {
  const verificationItems = [
    {
      label: 'Informações básicas preenchidas',
      isCompleted: Boolean(project.name && project.description && project.rciPercentage > 0)
    },
    {
      label: 'Contrato anexado',
      isCompleted: Boolean(project.contractFile || project.contractLink)
    },
    {
      label: `Extratos bancários (${project.bankStatements.length})`,
      isCompleted: project.bankStatements.length > 0
    }
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
        <CardTitle>Lista de verificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {verificationItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle 
              className={`w-5 h-5 ${item.isCompleted ? 'text-green-600' : 'text-gray-300'}`}
            />
            <span className={`${item.isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </div>
        ))}
        
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center gap-3">
            <CheckCircle 
              className={`w-5 h-5 ${validationStatus.isCompleted ? validationStatus.color : 'text-gray-300'}`}
            />
            <span className={`font-medium ${validationStatus.isCompleted ? validationStatus.color : 'text-gray-500'}`}>
              {validationStatus.text}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectVerificationCard;
