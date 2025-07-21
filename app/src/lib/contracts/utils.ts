import { ContractUnit, AcademicUnit } from "@/types";

// Calcula o percentual RCI total de um contrato (soma dos percentuais de todas as unidades)
export const calculateTotalRciPercentage = (
  unidades: ContractUnit[] = []
): number => {
  return unidades.reduce((total, unidade) => total + unidade.percentual_rci, 0);
};

// Formata valor em moeda brasileira
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Utilitários para trabalhar com a estrutura hierárquica das unidades acadêmicas

/**
 * Obtém o caminho completo de uma unidade até a raiz
 */
export const getUnitPath = (
  unit: AcademicUnit,
  allUnits: AcademicUnit[]
): AcademicUnit[] => {
  const path: AcademicUnit[] = [unit];

  let currentUnit = unit;
  while (currentUnit.id_unidade_pai) {
    const parent = allUnits.find((u) => u.id === currentUnit.id_unidade_pai);
    if (parent) {
      path.unshift(parent);
      currentUnit = parent;
    } else {
      break;
    }
  }

  return path;
};

/**
 * Encontra a unidade raiz (instituição) de uma unidade
 */
export const getRootUnit = (
  unit: AcademicUnit,
  allUnits: AcademicUnit[]
): AcademicUnit => {
  const path = getUnitPath(unit, allUnits);
  return path[0]; // O primeiro item é sempre a raiz
};

/**
 * Constrói uma string de caminho hierárquico para uma unidade
 */
export const buildUnitPathString = (
  unit: AcademicUnit,
  allUnits: AcademicUnit[],
  separator: string = " > "
): string => {
  const path = getUnitPath(unit, allUnits);
  return path.map((u) => u.sigla || u.nome).join(separator);
};
