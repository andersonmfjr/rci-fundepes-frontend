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
  unit?: string;
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

    if (filters?.unit) params.append("unidade", filters?.unit);
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

  getBankTransfers: async (
    filters?: BankTransferFilters
  ): Promise<Pagination<BankTransferItem>> => {
    // MOCK - Remover quando API estiver pronta
    const mockData: BankTransferItem[] = [
      {
        id_transferencia: 101,
        id_conta_projeto: 1,
        data: "2024-03-15",
        valor: "15000.00",
        observacao: "Transferência referente ao mês 03/2024",
        id_extrato_bancario: 201,
        conta_projeto: {
          banco: { codigo: "001", nome: "Banco do Brasil" },
          contrato: {
            nome: "Contrato de Pesquisa XYZ",
            descricao: "Pesquisa em tecnologia",
            valor_total: "100000.00",
          },
          agencia: "1234-5",
          conta: "12345-6",
        },
        extrato_bancario: {
          descricao: "Extrato Março 2024",
          link_arquivo: "/extratos/2024-03.pdf",
          mes_referencia: "03",
          ano_referencia: "2024",
          processado: true,
          conta_rci: {
            banco: { codigo: "237", nome: "Bradesco" },
            unidade: { nome: "Instituto de Computação", sigla: "IC" },
          },
        },
      },
      {
        id_transferencia: 102,
        id_conta_projeto: 1,
        data: "2024-04-20",
        valor: "25000.00",
        observacao: "Transferência referente ao mês 04/2024",
        id_extrato_bancario: 202,
        conta_projeto: {
          banco: { codigo: "001", nome: "Banco do Brasil" },
          contrato: {
            nome: "Contrato de Pesquisa XYZ",
            descricao: "Pesquisa em tecnologia",
            valor_total: "100000.00",
          },
          agencia: "1234-5",
          conta: "12345-6",
        },
        extrato_bancario: {
          descricao: "Extrato Abril 2024",
          link_arquivo: "/extratos/2024-04.pdf",
          mes_referencia: "04",
          ano_referencia: "2024",
          processado: true,
          conta_rci: {
            banco: { codigo: "237", nome: "Bradesco" },
            unidade: { nome: "Instituto de Computação", sigla: "IC" },
          },
        },
      },
      {
        id_transferencia: 103,
        id_conta_projeto: 2,
        data: "2024-05-10",
        valor: "18500.00",
        observacao: "Transferência parcial - maio/2024",
        id_extrato_bancario: 203,
        conta_projeto: {
          banco: { codigo: "104", nome: "Caixa Econômica Federal" },
          contrato: {
            nome: "Projeto de Extensão ABC",
            descricao: "Extensão universitária",
            valor_total: "75000.00",
          },
          agencia: "0987",
          conta: "98765-4",
        },
        extrato_bancario: {
          descricao: "Extrato Maio 2024",
          link_arquivo: "/extratos/2024-05.pdf",
          mes_referencia: "05",
          ano_referencia: "2024",
          processado: false,
          conta_rci: {
            banco: { codigo: "341", nome: "Itaú" },
            unidade: { nome: "Centro de Ciências Exatas", sigla: "CCE" },
          },
        },
      },
    ];

    // Filtrar por contrato se especificado
    let filteredData = [...mockData];

    if (filters?.search) {
      filteredData = filteredData.filter(
        (t) =>
          t.observacao.toLowerCase().includes(filters.search!.toLowerCase()) ||
          t.conta_projeto.contrato.nome
            .toLowerCase()
            .includes(filters.search!.toLowerCase())
      );
    }

    if (filters?.mes_ano) {
      const [mes, ano] = filters.mes_ano.split("/");
      if (mes && ano) {
        filteredData = filteredData.filter(
          (t) =>
            t.extrato_bancario.mes_referencia === mes.padStart(2, "0") &&
            t.extrato_bancario.ano_referencia === ano
        );
      }
    }

    // Paginação
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filteredData.slice(start, end);

    return {
      count: filteredData.length,
      previous: page > 1 ? `page=${page - 1}` : null,
      next: end < filteredData.length ? `page=${page + 1}` : null,
      results: paginatedData,
    };

    // IMPLEMENTAÇÃO REAL - Descomentar quando API estiver pronta
    // const params = new URLSearchParams();

    // if (filters?.contrato) {
    //   params.append("contrato", filters.contrato.toString());
    // }

    // if (filters?.mes_ano) {
    //   params.append("mes_ano", filters.mes_ano);
    // }

    // if (filters?.conta) {
    //   params.append("conta", filters.conta.toString());
    // }

    // if (filters?.search) {
    //   params.append("search", filters.search);
    // }

    // if (filters?.page) {
    //   params.append("page", filters.page.toString());
    // }

    // if (filters?.pageSize) {
    //   params.append("page_size", filters.pageSize.toString());
    // }

    // const queryString = params.toString();
    // const url = `/app/transferencias_realizadas/${queryString ? `?${queryString}` : ""}`;

    // return await fetcher<BankTransfersResponse>(url);
  },

  validateTransfers: async (
    transferId: number,
    transferIds: number[]
  ): Promise<void> => {
    // Simular delay de requisição
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock de sucesso
    return Promise.resolve();

    // IMPLEMENTAÇÃO REAL - Descomentar quando API estiver pronta
    // await fetcher(`/app/transferencias/${transferId}/validar/`, {
    //   method: "POST",
    //   body: JSON.stringify({ transferencias: transferIds }),
    // });
  },

  getSelectedTransferIds: async (transferId: number): Promise<number[]> => {
    // MOCK - Remover quando API estiver pronta
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockSelectedIds: Record<number, number[]> = {
      1: [101, 102],
      2: [103],
      3: [],
    };

    return mockSelectedIds[transferId] || [1, 2];

    // IMPLEMENTAÇÃO REAL - Descomentar quando API estiver pronta
    // const response = await fetcher<{ transferencias: number[] }>(
    //   `/app/transferencias/${transferId}/transferencias-selecionadas/`
    // );
    // return response.transferencias;
  },
};
