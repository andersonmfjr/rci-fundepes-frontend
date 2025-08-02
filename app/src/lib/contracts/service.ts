import {
  ContractListItem,
  ContractDetail,
  ContractListResponse,
} from "@/types";
import { mockContracts, mockContractsDetail } from "./mockData";

// Reference to the mutable mock data
const contracts = mockContracts;
const contractsDetail = mockContractsDetail;

export type SortField =
  | "nome"
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
      (total, contract) => total + parseFloat(contract.valor_total),
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
    const contract = contractsDetail.find(
      (p) => p.id_contrato.toString() === id
    );

    if (!contract) return null;

    return contract;
  },

  validateContract: async (contractId: number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const contract = contracts.find((c) => c.id === contractId);
    const contractDetail = contractsDetail.find(
      (c) => c.id_contrato === contractId
    );

    if (!contract || !contractDetail) {
      throw new Error("Contrato não encontrado");
    }

    contract.validado = true;
    contractDetail.validado = true;
    contract.data_atualizacao = new Date().toISOString();
    contractDetail.data_atualizacao = new Date().toISOString();

    return true;
  },

  invalidateContract: async (contractId: number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const contract = contracts.find((c) => c.id === contractId);
    const contractDetail = contractsDetail.find(
      (c) => c.id_contrato === contractId
    );

    if (!contract || !contractDetail) {
      throw new Error("Contrato não encontrado");
    }

    contract.validado = false;
    contractDetail.validado = false;
    contract.data_atualizacao = new Date().toISOString();
    contractDetail.data_atualizacao = new Date().toISOString();

    return false;
  },

  validateTransfer: async (transferId: number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    for (const contract of contractsDetail) {
      for (const distribution of contract.distribuicoes_rci) {
        const transfer = distribution.transferencias?.find(
          (t) => t.id_transferencia === transferId
        );
        if (transfer) {
          transfer.validada = true;
          contract.data_atualizacao = new Date().toISOString();
          return true;
        }
      }
    }

    throw new Error("Transferência não encontrada");
  },

  invalidateTransfer: async (transferId: number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    for (const contract of contractsDetail) {
      for (const distribution of contract.distribuicoes_rci) {
        const transfer = distribution.transferencias?.find(
          (t) => t.id_transferencia === transferId
        );
        if (transfer) {
          transfer.validada = false;
          contract.data_atualizacao = new Date().toISOString();
          return false;
        }
      }
    }

    throw new Error("Transferência não encontrada");
  },

  validateRciDistribution: async (distributionId: number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    for (const contract of contractsDetail) {
      const distribution = contract.distribuicoes_rci?.find(
        (d) => d.id_distribuicao_rci === distributionId
      );
      if (distribution) {
        contract.data_atualizacao = new Date().toISOString();
        return true;
      }
    }

    throw new Error("Distribuição RCI não encontrada");
  },

  invalidateRciDistribution: async (
    distributionId: number
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    for (const contract of contractsDetail) {
      const distribution = contract.distribuicoes_rci?.find(
        (d) => d.id_distribuicao_rci === distributionId
      );
      if (distribution) {
        contract.data_atualizacao = new Date().toISOString();
        return false;
      }
    }

    throw new Error("Distribuição RCI não encontrada");
  },

  validateAddendum: async (addendumId: number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  },

  invalidateAddendum: async (addendumId: number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return false;
  },
};
