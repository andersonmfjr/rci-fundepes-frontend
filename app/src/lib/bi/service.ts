import {
  BiContract,
  BiBankTransfer,
  BiRciReceived,
  BiOverviewStats,
  BiFilters,
  BiSortField,
  BiSortDirection,
  BiOverviewResponse,
  AcademicUnit,
  ContractType,
  BiDetailsResponse,
} from "@/types";
import {
  mockBiContracts,
  mockBiBankTransfers,
  mockBiRciReceived,
  mockBiOverviewStats,
  mockBiAcademicUnits,
  mockBiContractTypes,
  mockBiProjectContracts,
  mockBiDetailsStats,
  mockBiBarChartData,
  mockBiDonutChartData,
} from "./mockData";

// Reference to the mutable mock data
const biContracts = mockBiContracts;
const biBankTransfers = mockBiBankTransfers;
const biRciReceived = mockBiRciReceived;
const biOverviewStats = mockBiOverviewStats;

export const biService = {
  getOverview: async (filters?: BiFilters): Promise<BiOverviewResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    let filteredContracts: BiContract[] = [...biContracts];

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredContracts = filteredContracts.filter((contract) => {
        return (
          contract.contrato.toLowerCase().includes(searchTerm) ||
          contract.financiador.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Apply academic unit filter
    if (filters?.unidade_academica) {
      // In a real implementation, this would filter by academic unit
      // For now, we'll just return all contracts
    }

    // Apply contract type filter
    if (filters?.tipo_contrato) {
      // In a real implementation, this would filter by contract type
      // For now, we'll just return all contracts
    }

    // Apply project/contract filter
    if (filters?.projeto_contrato) {
      // In a real implementation, this would filter by project/contract
      // For now, we'll just return all contracts
    }

    // Apply date range filter
    if (filters?.periodo_inicio || filters?.periodo_fim) {
      // In a real implementation, this would filter by date range
      // For now, we'll just return all contracts
    }

    // Apply sorting
    if (filters?.sortField) {
      const sortField = filters.sortField;
      const sortDirection = filters.sortDirection || "desc";

      filteredContracts.sort((a, b) => {
        let aValue: string | number, bValue: string | number;

        if (sortField === "contrato") {
          aValue = a.contrato.toLowerCase();
          bValue = b.contrato.toLowerCase();
        } else if (sortField === "financiador") {
          aValue = a.financiador.toLowerCase();
          bValue = b.financiador.toLowerCase();
        } else if (sortField === "inicio") {
          aValue = new Date(a.inicio.split("/").reverse().join("-")).getTime();
          bValue = new Date(b.inicio.split("/").reverse().join("-")).getTime();
        } else if (sortField === "fim") {
          aValue = new Date(a.fim.split("/").reverse().join("-")).getTime();
          bValue = new Date(b.fim.split("/").reverse().join("-")).getTime();
        } else if (sortField === "valor_contrato") {
          aValue = a.valor_contrato;
          bValue = b.valor_contrato;
        } else if (sortField === "valor_rci_reitoria") {
          aValue = a.valor_rci_reitoria;
          bValue = b.valor_rci_reitoria;
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
      // Default sorting by contract name
      filteredContracts.sort((a, b) => a.contrato.localeCompare(b.contrato));
    }

    const totalCount = filteredContracts.length;
    const pageSize = filters?.pageSize || 5;
    const currentPage = filters?.page || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Apply pagination
    const paginatedResults = filteredContracts.slice(startIndex, endIndex);

    return {
      stats: biOverviewStats,
      contracts: {
        count: totalCount,
        previous: currentPage > 1 ? `?page=${currentPage - 1}` : null,
        next: endIndex < totalCount ? `?page=${currentPage + 1}` : null,
        results: paginatedResults,
      },
      bankTransfers: biBankTransfers,
      rciReceived: biRciReceived,
    };
  },

  getAcademicUnits: async (): Promise<AcademicUnit[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockBiAcademicUnits;
  },

  getContractTypes: async (): Promise<ContractType[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockBiContractTypes;
  },

  getProjectContracts: async (): Promise<{ id: number; nome: string }[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockBiProjectContracts;
  },

  getDetails: async (id: string): Promise<BiDetailsResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In a real implementation, this would fetch data based on the ID
    // For now, we'll return mock data
    return {
      stats: mockBiDetailsStats,
      barChart: mockBiBarChartData,
      donutChart: mockBiDonutChartData,
    };
  },
};
