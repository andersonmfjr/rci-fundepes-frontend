import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Project, ProjectStatus } from '@/types';
import { projectsService } from '@/lib/projects';
import ProjectVerificationCard from '@/components/project/ProjectVerificationCard';
import Layout from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';
import ProjectActions from '@/components/project-detail/ProjectActions';
import ProjectInfo from '@/components/project-detail/ProjectInfo';
import ProjectContract from '@/components/project-detail/ProjectContract';
import ProjectBankStatements from '@/components/project-detail/ProjectBankStatements';
import { usePageTitle } from '@/hooks/use-page-title';

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
        title: "Erro ao carregar projeto",
        description: "Não foi possível carregar os dados do projeto",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update page title when project loads
  usePageTitle(project ? `${project.name}` : 'Detalhes do Projeto');

  const handleStatusChange = async (newStatus: string) => {
    if (!project) return;
    
    setIsUpdating(true);
    try {
      let updatedProject;
      
      if (newStatus === 'progress') {
        updatedProject = await projectsService.progressStatus(project.id);
      } else {
        updatedProject = await projectsService.updateStatus(project.id, newStatus as ProjectStatus);
      }
      
      setProject(updatedProject);
      toast({
        title: "Status atualizado",
        description: `Projeto movido para: ${getStatusLabel(updatedProject.status)}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do projeto",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    
    setIsDeleting(true);
    try {
      await projectsService.delete(project.id);
      toast({
        title: "Projeto excluído",
        description: "O projeto foi removido com sucesso",
      });
      navigate('/projects');
    } catch (error) {
      toast({
        title: "Erro ao excluir projeto",
        description: "Não foi possível excluir o projeto",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'draft': 'Rascunho',
      'pending': 'Pendente',
      'validated': 'Validado',
      'completed': 'Concluído'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando projeto...</p>
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
            Projeto não encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            O projeto solicitado não existe ou foi removido
          </p>
          <Button onClick={() => navigate('/projects')}>
            Voltar para Projetos
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 break-words">{project.name}</h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">Detalhes do projeto RCI</p>
          </div>
          <div className="w-full lg:w-auto">
            <ProjectActions
              project={project}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              onStatusChange={handleStatusChange}
              onDeleteProject={handleDeleteProject}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <ProjectInfo project={project} formatDate={formatDate} />
          <ProjectVerificationCard project={project} />
        </div>

        <ProjectContract project={project} />

        <ProjectBankStatements project={project} />
      </div>
    </Layout>
  );
};

export default ProjectDetail;
