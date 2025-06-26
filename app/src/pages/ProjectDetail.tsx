import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Project } from '@/types';
import { projectsService } from '@/lib/projects';

import Layout from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';
import ProjectInfo from '@/components/project-detail/ProjectInfo';

import ProjectBankTransfers from '@/components/project-detail/ProjectBankTransfers';
import ProjectRciDistribution from '@/components/project-detail/ProjectRciDistribution';
import ProjectContractAddendums from '@/components/project-detail/ProjectContractAddendums';
import { usePageTitle } from '@/hooks/use-page-title';

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      const data = await projectsService.getById(projectId);
      setProject(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar contrato",
        description: "Não foi possível carregar os dados do contrato",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update page title when contract loads
  usePageTitle(project ? `${project.nome}` : 'Detalhes do Contrato');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando contrato...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Contrato não encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            O contrato solicitado não existe ou foi removido
          </p>
          <Button onClick={() => navigate('/projects')}>
            Voltar para Contratos
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 lg:space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar</span>
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 break-words">{project.nome}</h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">Detalhes do contrato RCI</p>
          </div>
        </div>

        <ProjectInfo 
          project={project} 
          formatDate={formatDate} 
          onProjectUpdate={setProject}
        />

        <ProjectContractAddendums project={project} />

        <ProjectRciDistribution project={project} />

        <ProjectBankTransfers project={project} />
      </div>
    </Layout>
  );
};

export default ProjectDetail;
