import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { ProjectStatus } from '@/types';

interface ProjectsFiltersProps {
  searchTerm: string;
  statusFilter: ProjectStatus | 'all';
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilterChange: (value: string) => void;
}

const ProjectsFilters = ({ 
  searchTerm, 
  statusFilter, 
  onSearchChange, 
  onStatusFilterChange 
}: ProjectsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar projetos..."
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="draft">Rascunho</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="validated">Validado</SelectItem>
          <SelectItem value="completed">Concluído</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectsFilters;
