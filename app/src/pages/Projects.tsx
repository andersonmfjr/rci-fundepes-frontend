import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileX } from "lucide-react";
import { Project } from '@/types';
import { projectsService } from '@/lib/projects';
import { calculateTotalRciPercentage } from '@/lib/projects/utils';
import Layout from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';
import ProjectsFilters from '@/components/projects/ProjectsFilters';
import ProjectsTable from '@/components/projects/ProjectsTable';
import ProjectsPagination from '@/components/projects/ProjectsPagination';
import { usePageTitle } from '@/hooks/use-page-title';

type SortField = 'name' | 'rciPercentage' | 'totalValue' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const Projects = () => {
  usePageTitle('Contratos');
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [sortField, setSortField] = useState<SortField>(
    (searchParams.get('sortField') as SortField) || 'updatedAt'
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    (searchParams.get('sortDirection') as SortDirection) || 'desc'
  );

  const itemsPerPage = 10;

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await projectsService.getAll();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          title: "Erro ao carregar contratos",
          description: "Não foi possível carregar a lista de contratos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = React.useMemo(() => {
    const filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort projects
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      if (sortField === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortField === 'rciPercentage') {
        aValue = calculateTotalRciPercentage(a.units);
        bValue = calculateTotalRciPercentage(b.units);
      } else if (sortField === 'totalValue') {
        aValue = a.totalValue;
        bValue = b.totalValue;
      } else if (sortField === 'createdAt') {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else if (sortField === 'updatedAt') {
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredAndSortedProjects.slice(startIndex, startIndex + itemsPerPage);

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    if (searchTerm) newSearchParams.set('search', searchTerm);
    if (currentPage > 1) newSearchParams.set('page', currentPage.toString());
    if (sortField !== 'updatedAt') newSearchParams.set('sortField', sortField);
    if (sortDirection !== 'desc') newSearchParams.set('sortDirection', sortDirection);

    setSearchParams(newSearchParams, { replace: true });
  }, [searchTerm, currentPage, sortField, sortDirection, setSearchParams]);

  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-64 mb-4 rounded"></div>
            <div className="bg-gray-200 h-96 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
            <p className="text-gray-600">
              Gerencie os contratos de ressarcimento de custos indiretos
            </p>
          </div>

          
          {/* <Button asChild>
            <Link to="/projects/new">
              <Plus className="w-4 h-4 mr-2" />
              Novo Contrato
            </Link>
          </Button> */}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Contratos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredAndSortedProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Contratos Validados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredAndSortedProjects.filter(p => p.contract?.validado).length}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {filteredAndSortedProjects.length > 0 
                  ? `${((filteredAndSortedProjects.filter(p => p.contract?.validado).length / filteredAndSortedProjects.length) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Valor Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(
                  filteredAndSortedProjects.reduce((sum, p) => sum + p.totalValue, 0)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <ProjectsFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        {/* Table */}
        {paginatedProjects.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <ProjectsTable
                projects={paginatedProjects}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                formatDate={formatDate}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileX className="w-12 h-12 text-gray-400 mb-4" />
              <CardTitle className="text-xl mb-2 text-center">
                {searchTerm ? 'Nenhum contrato encontrado' : 'Nenhum contrato cadastrado'}
              </CardTitle>
              <CardDescription className="text-center max-w-md">
                {searchTerm
                  ? 'Tente ajustar os filtros de busca para encontrar os contratos que você está procurando.'
                  : 'Comece criando seu primeiro contrato de ressarcimento de custos indiretos.'
                }
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <ProjectsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Layout>
  );
};

export default Projects;
