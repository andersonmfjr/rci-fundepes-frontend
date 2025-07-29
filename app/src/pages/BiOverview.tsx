import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import {
  BiContract,
  BiFilters as BiFiltersType,
  BiSortField,
  BiSortDirection,
  BiOverviewStats,
} from "@/types";
import { biService } from "@/lib/bi";
import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import BiFilters from "@/components/bi/BiFilters";
import BiContractsTable from "@/components/bi/BiContractsTable";
import BiTransfersTables from "@/components/bi/BiTransfersTables";
import BiPagination from "@/components/bi/BiPagination";
import { usePageTitle } from "@/hooks/use-page-title";
import { TableSkeleton } from "@/components/skeletons";

const BiOverview = () => {
  usePageTitle("Business Intelligence - Visão Geral");
  const [searchParams, setSearchParams] = useSearchParams();
  const [contracts, setContracts] = useState<BiContract[]>([]);
  const [bankTransfers, setBankTransfers] = useState([]);
  const [rciReceived, setRciReceived] = useState([]);
  const [stats, setStats] = useState<BiOverviewStats>({
    valor_total_contratos: 0,
    total_contratos: 0,
    total_rci: 0,
    contratos_rci: 0,
    recebido_rci: 0,
    contratos_recebidos: 0,
    rci_a_receber: 0,
    contratos_a_receber: 0,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [sortField, setSortField] = useState<BiSortField>(
    (searchParams.get("sortField") as BiSortField) || "contrato"
  );
  const [sortDirection, setSortDirection] = useState<BiSortDirection>(
    (searchParams.get("sortDirection") as BiSortDirection) || "asc"
  );
  const [activeFilters, setActiveFilters] = useState<Partial<BiFiltersType>>(
    {}
  );

  const itemsPerPage = 5;

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const response = await biService.getOverview({
          sortField,
          sortDirection,
          page: currentPage,
          pageSize: itemsPerPage,
        });
        setStats(response.stats);
        setContracts(response.contracts.results);
        setTotalCount(response.contracts.count);
        setBankTransfers(response.bankTransfers);
        setRciReceived(response.rciReceived);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados iniciais",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const loadData = useCallback(async (filters: BiFiltersType) => {
    try {
      setTableLoading(true);
      const response = await biService.getOverview(filters);
      setStats(response.stats);
      setContracts(response.contracts.results);
      setTotalCount(response.contracts.count);
      setBankTransfers(response.bankTransfers);
      setRciReceived(response.rciReceived);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setTableLoading(false);
    }
  }, []);

  const filters = useMemo(
    () => ({
      search: searchTerm || undefined,
      sortField,
      sortDirection,
      page: currentPage,
      pageSize: itemsPerPage,
      ...activeFilters,
    }),
    [
      searchTerm,
      sortField,
      sortDirection,
      currentPage,
      activeFilters.unidade_academica,
      activeFilters.tipo_contrato,
      activeFilters.projeto_contrato,
      activeFilters.periodo_inicio,
      activeFilters.periodo_fim,
    ]
  );

  useEffect(() => {
    loadData(filters);
  }, [filters, loadData]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (searchTerm) newSearchParams.set("search", searchTerm);
    if (currentPage > 1) newSearchParams.set("page", currentPage.toString());
    if (sortField !== "contrato") newSearchParams.set("sortField", sortField);
    if (sortDirection !== "asc")
      newSearchParams.set("sortDirection", sortDirection);

    setSearchParams(newSearchParams, { replace: true });
  }, [searchTerm, currentPage, sortField, sortDirection, setSearchParams]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback((filters: Partial<BiFiltersType>) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback(
    (field: BiSortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
      setCurrentPage(1);
    },
    [sortField, sortDirection]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const formatCompactCurrency = useCallback(
    (value: number) => {
      if (value >= 1000000) {
        return `R$ ${(value / 1000000).toFixed(1)} mi`;
      } else if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(1)} mil`;
      }
      return formatCurrency(value);
    },
    [formatCurrency]
  );

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 space-y-6">
          <TableSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ressarcimento de Custos Indiretos
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">
                  Atualizado em 12 de jun de 2025
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              COMPARTILHAR
            </Button>
          </div>
        </div>

        {/* Filters */}
        <BiFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onFiltersChange={handleFiltersChange}
        />

        {/* Main Content */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Valor total dos contratos
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCompactCurrency(stats.valor_total_contratos)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {stats.total_contratos} contratos
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total RCI
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCompactCurrency(stats.total_rci)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {stats.contratos_rci} contratos
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Recebido RCI
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCompactCurrency(stats.recebido_rci)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {stats.contratos_recebidos} contratos
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    RCI a receber
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCompactCurrency(stats.rci_a_receber)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {stats.contratos_a_receber} contratos
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contracts Table */}
          {tableLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <BiContractsTable
                contracts={contracts}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                formatCurrency={formatCurrency}
              />

              <BiPagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalCount / itemsPerPage)}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {/* Transfers Tables */}
          <BiTransfersTables
            bankTransfers={bankTransfers}
            rciReceived={rciReceived}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </Layout>
  );
};

export default BiOverview;
