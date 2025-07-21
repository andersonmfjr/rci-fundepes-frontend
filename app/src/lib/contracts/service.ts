import {
  ContractListItem,
  ContractDetail,
  ContractListResponse,
  ContractStatus,
} from "@/types";
import { mockContracts, mockContractsDetail } from "./mockData";
import { generateId } from "./utils";

// Reference to the mutable mock data
const contracts = mockContracts;
const contractsDetail = mockContractsDetail;

export const contractsService = {
  getAll: async (): Promise<ContractListResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Convert legacy contracts to ContractListItem format
    const contractListItems: ContractListItem[] = contracts.map((contract) => ({
      id: contract.id,
      nome: contract.nome,
      descricao: contract.descricao,
      valor_total: contract.valor_total,
      data_criacao: contract.data_criacao,
      data_atualizacao: contract.data_atualizacao,
      unidades: contract.unidades,
      status: contract.status,
    }));

    contractListItems.sort(
      (a, b) =>
        new Date(b.data_atualizacao).getTime() -
        new Date(a.data_atualizacao).getTime()
    );

    return {
      count: contractListItems.length,
      previous: null,
      next: null,
      results: contractListItems,
    };
  },

  getById: async (id: string): Promise<ContractDetail | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const contract = contractsDetail.find((p) => p.id.toString() === id);

    if (!contract) return null;

    return contract;
  },
};
