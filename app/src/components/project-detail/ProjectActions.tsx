import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle, RotateCcw, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Project } from '@/types';

interface ProjectActionsProps {
  project: Project;
  isUpdating: boolean;
  isDeleting: boolean;
  onStatusChange: (newStatus: string) => void;
  onDeleteProject: () => void;
}

const ProjectActions = ({ 
  project, 
  isUpdating, 
  isDeleting, 
  onStatusChange, 
  onDeleteProject 
}: ProjectActionsProps) => {
  const navigate = useNavigate();

  const getAvailableActions = () => {
    const actions = [];

    switch (project.status) {
      case 'draft':
        actions.push({
          label: 'Enviar para Análise',
          action: () => onStatusChange('pending'),
          icon: CheckCircle,
          variant: 'default' as const
        });
        break;
      case 'pending':
        actions.push({
          label: 'Validar Projeto',
          action: () => onStatusChange('validated'),
          icon: CheckCircle,
          variant: 'default' as const
        });
        actions.push({
          label: 'Voltar para Rascunho',
          action: () => onStatusChange('draft'),
          icon: RotateCcw,
          variant: 'outline' as const
        });
        break;
      case 'validated':
        actions.push({
          label: 'Marcar como Concluído',
          action: () => onStatusChange('completed'),
          icon: CheckCircle,
          variant: 'default' as const
        });
        break;
      case 'completed':
        // No status change actions for completed projects
        break;
    }

    return actions;
  };

  const statusActions = getAvailableActions();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => navigate(`/projects/${project.id}/edit`)}
        disabled={project.status === 'completed'}
      >
        <Edit className="w-4 h-4 mr-2" />
        Editar
      </Button>
      
      {statusActions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant}
          onClick={action.action}
          disabled={isUpdating}
        >
          <action.icon className="w-4 h-4 mr-2" />
          {isUpdating ? 'Atualizando...' : action.label}
        </Button>
      ))}
      
      {project.status === 'draft' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o projeto "{project.name}"? 
                Esta ação não pode ser desfeita e todos os dados do projeto serão perdidos permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteProject}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir projeto'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ProjectActions;
