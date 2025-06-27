import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Edit } from "lucide-react";
import { Project } from '@/types';

import { calculateTotalRciPercentage, formatCurrency } from '@/lib/projects/utils';

interface ProjectTableRowProps {
  project: Project;
  formatDate: (dateString: string) => string;
}

const ProjectTableRow = ({ project, formatDate }: ProjectTableRowProps) => {
  const totalRciPercentage = calculateTotalRciPercentage(project.unidades);

  return (
    <TableRow>
      <TableCell className="min-w-[200px]">
        <div>
          <Link 
            to={`/projects/${project.id}`}
            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            {project.nome}
          </Link>
          <p className="text-sm text-gray-500 truncate max-w-xs lg:max-w-sm xl:max-w-md line-clamp-1">
            {project.descricao}
          </p>
        </div>
      </TableCell>
      <TableCell className="min-w-[80px]">
        <Badge variant="outline">
          {totalRciPercentage.toFixed(1)}%
        </Badge>
      </TableCell>
      <TableCell className="min-w-[120px]">
        <span className="font-medium text-gray-900">
          {formatCurrency(project.valor_total)}
        </span>
      </TableCell>

      <TableCell className="text-gray-600 min-w-[120px]">
        {formatDate(project.data_criacao || '')}
      </TableCell>
      <TableCell className="text-gray-600 min-w-[120px]">
        {formatDate(project.data_atualizacao || '')}
      </TableCell>
      <TableCell className="text-right min-w-[100px]">
        <div className="flex items-center justify-end gap-1 lg:gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link to={`/projects/${project.id}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
          {/* FIXME: Edit project button */}
          {/* <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link to={`/projects/${project.id}/edit`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button> */}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProjectTableRow;
