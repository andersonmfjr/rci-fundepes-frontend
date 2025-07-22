import {
  ContractListItem,
  ContractDetail,
  ContractListResponse,
  ContractStatus,
} from "@/types";
import { mockContracts, mockContractsDetail } from "./mockData";
import { calculateTotalRciPercentage } from "./utils";

// Reference to the mutable mock data
const contracts = mockContracts;
const contractsDetail = mockContractsDetail;

export type SortField =
  | "nome"
  | "percentual_rci"
  | "valor_total"
  | "data_criacao"
  | "data_atualizacao";

export type SortDirection = "asc" | "desc";

export interface ContractsFilters {
  search?: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
  page?: number;
  pageSize?: number;
}

export interface ContractsStats {
  totalContracts: number;
  validatedContracts: number;
  totalValue: number;
}

export const contractsService = {
  getAll: async (filters?: ContractsFilters): Promise<ContractListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let contractListItems: ContractListItem[] = [...contracts];

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      contractListItems = contractListItems.filter((contract) => {
        return (
          (contract.nome || "").toLowerCase().includes(searchTerm) ||
          (contract.descricao || "").toLowerCase().includes(searchTerm)
        );
      });
    }

    // Apply sorting
    if (filters?.sortField) {
      const sortField = filters.sortField;
      const sortDirection = filters.sortDirection || "desc";

      contractListItems.sort((a, b) => {
        let aValue: string | number, bValue: string | number;

        if (sortField === "nome") {
          aValue = (a.nome || "").toLowerCase();
          bValue = (b.nome || "").toLowerCase();
        } else if (sortField === "valor_total") {
          aValue = a.valor_total;
          bValue = b.valor_total;
        } else if (sortField === "data_criacao") {
          aValue = new Date(a.data_criacao || "").getTime();
          bValue = new Date(b.data_criacao || "").getTime();
        } else if (sortField === "data_atualizacao") {
          aValue = new Date(a.data_atualizacao || "").getTime();
          bValue = new Date(b.data_atualizacao || "").getTime();
        } else {
          return 0;
        }

        if (sortDirection === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    } else {
      // Default sorting by data_atualizacao desc
      contractListItems.sort(
        (a, b) =>
          new Date(b.data_atualizacao).getTime() -
          new Date(a.data_atualizacao).getTime()
      );
    }

    const totalCount = contractListItems.length;
    const pageSize = filters?.pageSize || 10;
    const currentPage = filters?.page || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Apply pagination
    const paginatedResults = contractListItems.slice(startIndex, endIndex);

    return {
      count: totalCount,
      previous: currentPage > 1 ? `?page=${currentPage - 1}` : null,
      next: endIndex < totalCount ? `?page=${currentPage + 1}` : null,
      results: paginatedResults,
    };
  },

  getStats: async (): Promise<ContractsStats> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const contractListItems: ContractListItem[] = [...contracts];

    const totalContracts = contractListItems.length;
    const validatedContracts = contractListItems.filter(
      (contract) => contract.validado
    ).length;
    const totalValue = contractListItems.reduce(
      (total, contract) => total + contract.valor_total,
      0
    );

    return {
      totalContracts,
      validatedContracts,
      totalValue,
    };
  },

  getById: async (id: string): Promise<ContractDetail | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const contract = contractsDetail.find((p) => p.id.toString() === id);

    if (!contract) return null;

    return contract;
  },
};
