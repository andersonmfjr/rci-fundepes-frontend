/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileX } from "lucide-react";
import { contractsService } from "@/lib/contracts";
import type {
  SortField,
  SortDirection,
  ContractsFilters as ContractsFiltersType,
} from "@/lib/contracts/service";
import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import ContractsFilters from "@/components/contracts/ContractsFilters";
import ContractsTable from "@/components/contracts/ContractsTable";
import ContractsPagination from "@/components/contracts/ContractsPagination";
import { usePageTitle } from "@/hooks/use-page-title";
import { TableSkeleton, ContractsPageSkeleton } from "@/components/skeletons";

type FilterKey =
  | "initialDate"
  | "finalDate"
  | "status"
  | "unity"
  | "description";

const Contracts = () => {
  usePageTitle("Contratos");
  const [searchParams, setSearchParams] = useSearchParams();
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [timer, setTimer] = useState<any>(undefined);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [sortField, setSortField] = useState<SortField>(
    (searchParams.get("sortField") as SortField) || "updated_at"
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
        const contractsResponse = await contractsService.getAll({
          sortField,
          sortDirection,
          page: currentPage,
          pageSize: itemsPerPage,
        });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      sortField,
      sortDirection,
      page: currentPage,
      pageSize: itemsPerPage,
    };

    loadContracts(filters);
  }, [sortField, sortDirection, currentPage]);

  // useEffect(() => {
  //   const newSearchParams = new URLSearchParams();
  //   if (currentPage > 1) newSearchParams.set("page", currentPage.toString());
  //   if (sortField !== "updated_at") newSearchParams.set("sortField", sortField);
  //   if (sortDirection !== "desc")
  //     newSearchParams.set("sortDirection", sortDirection);

  //   setSearchParams(newSearchParams, { replace: true });
  // }, [currentPage, sortField, sortDirection, setSearchParams]);

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
            <h1 className="text-2xl font-bold text-gray-900">Validações</h1>
            <p className="text-gray-600">
              Gerencie as validações de contratos, RCI e aditivos
            </p>
          </div>
        </div>

        {/* Filters */}
        <ContractsFilters />

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
