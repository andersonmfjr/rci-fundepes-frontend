import { Badge } from "@/components/ui/badge";
import { ProjectStatus as Status } from "@/types";

interface ProjectStatusProps {
  status: Status;
}

const ProjectStatus = ({ status }: ProjectStatusProps) => {
  const statusConfig = {
    draft: { label: 'Rascunho', variant: 'secondary' as const, className: undefined },
    pending: { label: 'Pendente', variant: 'default' as const, className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    validated: { label: 'Validado', variant: 'default' as const, className: 'bg-green-500 hover:bg-green-600 text-white' },
    completed: { label: 'Concluído', variant: 'default' as const, className: undefined }
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant} 
      className={`capitalize ${config.className || ''}`}
    >
      {config.label}
    </Badge>
  );
};

export default ProjectStatus;
