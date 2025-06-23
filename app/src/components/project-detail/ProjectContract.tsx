import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Project } from '@/types';

interface ProjectContractProps {
  project: Project;
}

const ProjectContract = ({ project }: ProjectContractProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrato</CardTitle>
        <CardDescription>
          Documentos de contrato do projeto
        </CardDescription>
      </CardHeader>
      <CardContent>
        {project.contractFile ? (
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="flex-1">Arquivo de contrato anexado</span>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        ) : project.contractLink ? (
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="flex-1">Link do contrato</span>
            <Button size="sm" variant="outline" asChild>
              <a href={project.contractLink} target="_blank" rel="noopener noreferrer">
                Abrir Link
              </a>
            </Button>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Nenhum contrato anexado
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectContract;
