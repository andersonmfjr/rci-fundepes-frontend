import { AcademicUnit } from "@/types";

// Formata valor em moeda brasileira
export const formatCurrency = (value: number | string): string => {
  if (typeof value === "string") {
    value = parseFloat(value);
  }

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
  unit: AcademicUnit
): AcademicUnit[] => {
  const path: AcademicUnit[] = [unit];

  let currentUnit = unit;
  while (currentUnit.parent) {
    const parent = currentUnit.parent;
    path.unshift(parent);
    currentUnit = parent;
  }

  return path;
};

/**
 * Encontra a unidade raiz (instituição) de uma unidade
 */
export const getRootUnit = (
  unit: AcademicUnit
): AcademicUnit => {
  const path = getUnitPath(unit);
  return path[0]; // O primeiro item é sempre a raiz
};

/**
 * Constrói uma string de caminho hierárquico para uma unidade
 */
export const buildUnitPathString = (
  unit: AcademicUnit,
  separator: string = " > "
): string => {
  const path = getUnitPath(unit);
  return path.map((u) => u.sigla || u.nome).join(separator);
};
