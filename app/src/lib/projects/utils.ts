import { mockProjects } from "./mockData";
import { Project, Unit } from "@/types";

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calcula o percentual RCI total de um projeto (soma dos percentuais de todas as unidades)
export const calculateTotalRciPercentage = (units: Unit[]): number => {
  return units.reduce((total, unit) => total + unit.rciPercentage, 0);
};

// Calcula o valor RCI total de um projeto
export const calculateTotalRciValue = (project: Project): number => {
  const totalPercentage = calculateTotalRciPercentage(project.units);
  return project.totalValue * (totalPercentage / 100);
};

// Calcula o valor RCI para uma unidade específica
export const calculateUnitRciValue = (
  totalValue: number,
  rciPercentage: number
): number => {
  return totalValue * (rciPercentage / 100);
};

// Formata valor em moeda brasileira
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
