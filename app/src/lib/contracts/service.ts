import { Contract, ContractFormData, ContractStatus } from "@/types";
import { mockContracts } from "./mockData";
import { generateId } from "./utils";

// Reference to the mutable mock data
let contracts = mockContracts;

export const contractsService = {
  getAll: async (): Promise<Contract[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...contracts].sort(
      (a, b) =>
        new Date(b.data_atualizacao || "").getTime() -
        new Date(a.data_atualizacao || "").getTime()
    );
  },

  getById: async (id: string): Promise<Contract | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const contract = contracts.find((p) => p.id === id);
    return contract ? { ...contract } : null;
  },

  create: async (data: ContractFormData): Promise<Contract> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newContract: Contract = {
      id: generateId(),
      nome: data.nome,
      descricao: data.descricao,
      valor_total: data.valor_total,
      unidades: data.unidades,
      link_contrato: data.link_contrato,
      status: "draft",
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    };

    contracts.push(newContract);
    console.log("Projeto criado:", newContract);
    return { ...newContract };
  },

  update: async (
    id: string,
    data: Partial<ContractFormData>
  ): Promise<Contract> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const index = contracts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Projeto não encontrado");

    const updatedContract = {
      ...contracts[index],
      ...data,
      data_atualizacao: new Date().toISOString(),
    };

    contracts[index] = updatedContract;
    console.log("Projeto atualizado:", updatedContract);
    return { ...updatedContract };
  },

  updateStatus: async (
    id: string,
    status: ContractStatus
  ): Promise<Contract> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const index = contracts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Projeto não encontrado");

    const updatedContract = {
      ...contracts[index],
      status,
      data_atualizacao: new Date().toISOString(),
    };

    contracts[index] = updatedContract;
    console.log("Status do projeto atualizado:", { id, status });
    return { ...updatedContract };
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const initialLength = contracts.length;
    contracts = contracts.filter((p) => p.id !== id);

    if (contracts.length === initialLength) {
      throw new Error("Projeto não encontrado");
    }

    console.log("Projeto removido:", id);
  },

  // New method to simulate status progression
  progressStatus: async (id: string): Promise<Contract> => {
    const statusFlow: Record<ContractStatus, ContractStatus> = {
      draft: "pending",
      pending: "validated",
      validated: "completed",
      completed: "completed", // Already at final status
    };

    const contract = await contractsService.getById(id);
    if (!contract) throw new Error("Projeto não encontrado");

    const nextStatus = statusFlow[contract.status];
    return await contractsService.updateStatus(id, nextStatus);
  },
};
