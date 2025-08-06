import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileX } from "lucide-react";
import { contractsService } from "@/lib/contracts";
import type {
  SortField,
  SortDirection,
  ContractsFilters as ContractsFiltersType,
  ContractsStats,
} from "@/lib/contracts/service";
import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import ContractsFilters from "@/components/contracts/ContractsFilters";
import ContractsTable from "@/components/contracts/ContractsTable";
import ContractsPagination from "@/components/contracts/ContractsPagination";
import { usePageTitle } from "@/hooks/use-page-title";
import { TableSkeleton, ContractsPageSkeleton } from "@/components/skeletons";

const Contracts = () => {
  usePageTitle("Contratos");
  const [searchParams, setSearchParams] = useSearchParams();
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<ContractsStats>({
    totalContracts: 0,
    validatedContracts: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [sortField, setSortField] = useState<SortField>(
    (searchParams.get("sortField") as SortField) || "data_atualizacao"
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    (searchParams.get("sortDirection") as SortDirection) || "desc"
  );

  const itemsPerPage = 10;

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [statsResponse, contractsResponse] = await Promise.all([
          contractsService.getStats(),
          contractsService.getAll({
            sortField,
            sortDirection,
            page: currentPage,
            pageSize: itemsPerPage,
          }),
        ]);
        setStats(statsResponse);
        setContracts(contractsResponse.results);
        setTotalCount(contractsResponse.count);
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

  const loadContracts = async (filters: ContractsFiltersType) => {
    try {
      setTableLoading(true);
      const response = await contractsService.getAll(filters);
      setContracts(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error("Error loading contracts:", error);
      toast({
        title: "Erro ao carregar contratos",
        description: "Não foi possível carregar a lista de contratos",
        variant: "destructive",
      });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    const filters: ContractsFiltersType = {
      search: searchTerm || undefined,
      sortField,
      sortDirection,
      page: currentPage,
      pageSize: itemsPerPage,
    };

    loadContracts(filters);
  }, [searchTerm, sortField, sortDirection, currentPage]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (searchTerm) newSearchParams.set("search", searchTerm);
    if (currentPage > 1) newSearchParams.set("page", currentPage.toString());
    if (sortField !== "data_atualizacao")
      newSearchParams.set("sortField", sortField);
    if (sortDirection !== "desc")
      newSearchParams.set("sortDirection", sortDirection);

    setSearchParams(newSearchParams, { replace: true });
  }, [searchTerm, currentPage, sortField, sortDirection, setSearchParams]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <Layout>
        <ContractsPageSkeleton />
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de contratos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContracts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Contratos validados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.validatedContracts}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {stats.totalContracts > 0
                  ? `${(
                      (stats.validatedContracts / stats.totalContracts) *
                      100
                    ).toFixed(1)}%`
                  : "0%"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Valor total dos contratos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalValue.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <ContractsFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        {/* Table */}
        {tableLoading ? (
          <TableSkeleton />
        ) : contracts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum contrato encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Tente ajustar os filtros ou termos de busca"
                  : "Comece criando um novo contrato"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <ContractsTable
              contracts={contracts}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              formatDate={formatDate}
            />

            <ContractsPagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Contracts;
