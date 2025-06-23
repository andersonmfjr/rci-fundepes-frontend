import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { Project } from '@/types';
import ProjectTableRow from './ProjectTableRow';

type SortField = 'name' | 'rciPercentage' | 'totalValue' | 'status' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

interface ProjectsTableProps {
  projects: Project[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  formatDate: (dateString: string) => string;
}

const ProjectsTable = ({ 
  projects, 
  sortField, 
  sortDirection, 
  onSort, 
  formatDate 
}: ProjectsTableProps) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 ml-1 text-blue-600" />
      : <ChevronDown className="w-4 h-4 ml-1 text-blue-600" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">
              <button
                onClick={() => onSort('name')}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Nome
                {getSortIcon('name')}
              </button>
            </TableHead>
            <TableHead className="min-w-[80px]">
              <button
                onClick={() => onSort('rciPercentage')}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                RCI %
                {getSortIcon('rciPercentage')}
              </button>
            </TableHead>
            <TableHead className="min-w-[120px]">
              <button
                onClick={() => onSort('totalValue')}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Valor Total
                {getSortIcon('totalValue')}
              </button>
            </TableHead>
            <TableHead className="min-w-[120px]">
              <button
                onClick={() => onSort('status')}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Status
                {getSortIcon('status')}
              </button>
            </TableHead>
            <TableHead className="min-w-[120px]">
              <button
                onClick={() => onSort('createdAt')}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Criado em
                {getSortIcon('createdAt')}
              </button>
            </TableHead>
            <TableHead className="min-w-[120px]">
              <button
                onClick={() => onSort('updatedAt')}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Atualizado em
                {getSortIcon('updatedAt')}
              </button>
            </TableHead>
            <TableHead className="text-right min-w-[100px] whitespace-nowrap">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <ProjectTableRow 
              key={project.id} 
              project={project} 
              formatDate={formatDate} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
