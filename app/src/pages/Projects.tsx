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

type SortField = 'nome' | 'percentual_rci' | 'valor_total' | 'data_criacao' | 'data_atualizacao';
type SortDirection = 'asc' | 'desc';

const Projects = () => {
  usePageTitle('Contratos');
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [sortField, setSortField] = useState<SortField>(
    (searchParams.get('sortField') as SortField) || 'data_atualizacao'
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
      const matchesSearch = (project.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.descricao || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort projects
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      if (sortField === 'nome') {
        aValue = (a.nome || '').toLowerCase();
        bValue = (b.nome || '').toLowerCase();
      } else if (sortField === 'percentual_rci') {
        aValue = calculateTotalRciPercentage(a.unidades);
        bValue = calculateTotalRciPercentage(b.unidades);
      } else if (sortField === 'valor_total') {
        aValue = a.valor_total;
        bValue = b.valor_total;
      } else if (sortField === 'data_criacao') {
        aValue = new Date(a.data_criacao || '').getTime();
        bValue = new Date(b.data_criacao || '').getTime();
      } else if (sortField === 'data_atualizacao') {
        aValue = new Date(a.data_atualizacao || '').getTime();
        bValue = new Date(b.data_atualizacao || '').getTime();
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
    if (sortField !== 'data_atualizacao') newSearchParams.set('sortField', sortField);
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
                {filteredAndSortedProjects.filter(p => p.contrato?.validado).length}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {filteredAndSortedProjects.length > 0 
                  ? `${((filteredAndSortedProjects.filter(p => p.contrato?.validado).length / filteredAndSortedProjects.length) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Valor Total dos Contratos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredAndSortedProjects.reduce((total, p) => total + p.valor_total, 0).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
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
        {paginatedProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum contrato encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? "Tente ajustar os filtros ou termos de busca"
                  : "Comece criando um novo contrato"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <ProjectsTable
              projects={paginatedProjects}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              formatDate={formatDate}
            />

            <ProjectsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
