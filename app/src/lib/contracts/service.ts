import { fetcher } from "@/lib/fetcher";

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
    const params = new URLSearchParams();

    if (filters?.search) {
      params.append("search", filters.search);
    }

    if (filters?.sortField) {
      params.append(
        "ordering",
        filters.sortDirection === "asc"
          ? filters.sortField
          : `-${filters.sortField}`
      );
    }

    if (filters?.page) {
      params.append("page", filters.page.toString());
    }

    if (filters?.pageSize) {
      params.append("page_size", filters.pageSize.toString());
    }

    const queryString = params.toString();
    const url = `/app/contratos/${queryString ? `?${queryString}` : ""}`;

    return await fetcher<ContractListResponse>(url);
  },

  getStats: async (): Promise<ContractsStats> => {
    return await fetcher<ContractsStats>(`/app/contratos/resumo/`);
  },

  getById: async (id: string): Promise<ContractDetail | null> => {
    try {
      return await fetcher<ContractDetail>(`/app/contratos/${id}/`);
    } catch (error) {
      return null;
    }
  },

  validateContract: async (contractId: number): Promise<boolean> => {
    await fetcher(`/app/contratos/${contractId}/validar/`, {
      method: "PUT",
    });
    return true;
  },

  invalidateContract: async (contractId: number): Promise<boolean> => {
    await fetcher(`/app/contratos/${contractId}/desfazer-validar/`, {
      method: "PUT",
    });
    return false;
  },

  validateRciDistribution: async (distributionId: number): Promise<boolean> => {
    await fetcher(`/app/distribuicao-rcis/${distributionId}/validar/`, {
      method: "PUT",
    });
    return true;
  },

  invalidateRciDistribution: async (
    distributionId: number
  ): Promise<boolean> => {
    await fetcher(
      `/app/distribuicao-rcis/${distributionId}/desfazer-validar/`,
      {
        method: "PUT",
      }
    );

    return false;
  },

  validateAddendum: async (addendumId: number): Promise<boolean> => {
    await fetcher(`/app/aditivos/${addendumId}/validar/`, {
      method: "PUT",
    });
    return true;
  },

  invalidateAddendum: async (addendumId: number): Promise<boolean> => {
    await fetcher(`/app/aditivos/${addendumId}/desfazer-validar/`, {
      method: "PUT",
    });
    return false;
  },
};
