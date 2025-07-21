import {
  ContractListItem,
  ContractDetail,
  ContractListResponse,
  ContractStatus,
} from "@/types";
import { mockContracts, mockContractsDetail } from "./mockData";

// Reference to the mutable mock data
const contracts = mockContracts;
const contractsDetail = mockContractsDetail;

export const contractsService = {
  getAll: async (): Promise<ContractListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const contractListItems: ContractListItem[] = [...contracts];

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
