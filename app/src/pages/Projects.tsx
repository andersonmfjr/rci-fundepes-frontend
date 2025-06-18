import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileX } from "lucide-react";
import { Project, ProjectStatus } from '@/types';
import { projectsService } from '@/lib/projects';
import Layout from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';
import ProjectsFilters from '@/components/projects/ProjectsFilters';
import ProjectsTable from '@/components/projects/ProjectsTable';
import ProjectsPagination from '@/components/projects/ProjectsPagination';
import { usePageTitle } from '@/hooks/use-page-title';

type SortField = 'name' | 'rciPercentage' | 'status' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const Projects = () => {
  usePageTitle('Projetos');
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>(
    (searchParams.get('status') as ProjectStatus) || 'all'
  );
  const [sortField, setSortField] = useState<SortField>(
    (searchParams.get('sortField') as SortField) || 'updatedAt'
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    (searchParams.get('sortDirection') as SortDirection) || 'desc'
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(searchParams.get('itemsPerPage') || '10')
  );

  // Update URL params whenever state changes
  const updateUrlParams = (updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === 'all' || (key === 'page' && value === 1) || 
          (key === 'itemsPerPage' && value === 10) ||
          (key === 'sortField' && value === 'updatedAt') ||
          (key === 'sortDirection' && value === 'desc')) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });

    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsService.getAll();
      setProjects(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar a lista de projetos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection;
    if (sortField === field) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      newDirection = 'asc';
    }
    
    setSortField(field);
    setSortDirection(newDirection);
    setCurrentPage(1);
    
    updateUrlParams({
      sortField: field,
      sortDirection: newDirection,
      page: 1
    });
  };

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortField === 'status') {
        const statusOrder = { 'draft': 0, 'pending': 1, 'validated': 2, 'completed': 3 };
        aValue = statusOrder[aValue as ProjectStatus];
        bValue = statusOrder[bValue as ProjectStatus];
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination calculations
  const totalItems = filteredAndSortedProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredAndSortedProjects.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams({ page });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
    updateUrlParams({ 
      search: newSearchTerm,
      page: 1 
    });
  };

  const handleStatusFilterChange = (value: string) => {
    const newStatus = value as ProjectStatus | 'all';
    setStatusFilter(newStatus);
    setCurrentPage(1);
    updateUrlParams({ 
      status: newStatus,
      page: 1 
    });
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = Number(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    updateUrlParams({ 
      itemsPerPage: newItemsPerPage,
      page: 1 
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando projetos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Projetos RCI</h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">Gerencie seus projetos de reembolso de custos indiretos</p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/projects/new" className="flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Projeto
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg lg:text-xl">Lista de Projetos</CardTitle>
            <CardDescription className="text-sm lg:text-base">
              {totalItems} projeto(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsFilters
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSearchChange={handleSearchChange}
              onStatusFilterChange={handleStatusFilterChange}
            />

            {currentProjects.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileX className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
                </div>
                <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'Nenhum projeto encontrado' : 'Nenhum projeto cadastrado'}
                </h3>
                <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base px-4">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando seu primeiro projeto RCI'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button asChild className="w-full sm:w-auto">
                    <Link to="/projects/new">Criar Primeiro Projeto</Link>
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <ProjectsTable
                    projects={currentProjects}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    formatDate={formatDate}
                  />
                </div>

                <ProjectsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Projects;
