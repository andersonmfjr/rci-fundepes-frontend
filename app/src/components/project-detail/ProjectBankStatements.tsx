import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Project } from '@/types';

interface ProjectBankStatementsProps {
  project: Project;
}

const ProjectBankStatements = ({ project }: ProjectBankStatementsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Extratos Bancários</CardTitle>
        <CardDescription>
          Arquivos de extratos bancários anexados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {project.bankStatements.length > 0 ? (
          <div className="space-y-2">
            {project.bankStatements.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="flex-1">Extrato {index + 1}</span>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Nenhum extrato bancário anexado
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectBankStatements;
