import { fetcher } from "@/lib/fetcher";

export type SortField = "nome" | "valor_total" | "created_at" | "updated_at";

export type SortDirection = "asc" | "desc";

export interface ContractsFilters {
  search?: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
  page?: number;
  pageSize?: number;
  status?: string;
  from?: string;
  to?: string;
  unity?: string;
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

    if (filters?.from) params.append("vigencia_inicio_after", filters?.from);

    if (filters?.to) params.append("vigencia_fim_before", filters?.to);

    if (filters?.unity) params.append("id_unidade", filters?.unity);
    if (filters?.status) params.append("status", filters?.status);

    const queryString = params.toString();
    const url = `/app/contratos/${queryString ? `?${queryString}` : ""}`;

    return await fetcher<ContractListResponse>(url);
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
