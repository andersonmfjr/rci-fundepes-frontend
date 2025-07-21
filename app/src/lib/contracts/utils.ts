import { mockContracts } from "./mockData";
import { Contract, Unit, AcademicUnit, UnitHierarchy } from "@/types";

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Calcula o percentual RCI total de um projeto (soma dos percentuais de todas as unidades)
export const calculateTotalRciPercentage = (unidades: Unit[] = []): number => {
  return unidades.reduce((total, unidade) => total + unidade.percentual_rci, 0);
};

// Calcula o valor RCI total de um projeto
export const calculateTotalRciValue = (contract: Contract): number => {
  const totalPercentage = calculateTotalRciPercentage(contract.unidades);
  return contract.valor_total * (totalPercentage / 100);
};

// Calcula o valor RCI para uma unidade específica
export const calculateUnitRciValue = (
  valor_total: number,
  percentual_rci: number
): number => {
  return valor_total * (percentual_rci / 100);
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
 * Constrói a hierarquia completa de unidades acadêmicas
 */
export const buildUnitHierarchy = (units: AcademicUnit[]): UnitHierarchy[] => {
  const unitMap = new Map<number, AcademicUnit>();
  const hierarchyMap = new Map<number, UnitHierarchy>();

  // Primeiro, cria o mapa de unidades
  units.forEach((unit) => {
    unitMap.set(unit.id, unit);
    hierarchyMap.set(unit.id, {
      unidade: unit,
      nivel: 0,
      caminho: [unit.id],
      caminho_completo: unit.nome,
      filhos: [],
    });
  });

  // Depois, constrói a hierarquia
  const rootUnits: UnitHierarchy[] = [];

  units.forEach((unit) => {
    const hierarchy = hierarchyMap.get(unit.id)!;

    if (unit.id_unidade_pai) {
      const parent = hierarchyMap.get(unit.id_unidade_pai);
      if (parent) {
        // Atualiza o nível e caminho baseado no pai
        hierarchy.nivel = parent.nivel + 1;
        hierarchy.caminho = [...parent.caminho, unit.id];
        hierarchy.caminho_completo = `${parent.caminho_completo} > ${unit.nome}`;

        // Adiciona como filho do pai
        parent.filhos.push(hierarchy);
      }
    } else {
      // É uma unidade raiz
      rootUnits.push(hierarchy);
    }
  });

  return rootUnits;
};

/**
 * Obtém todas as unidades filhas de uma unidade (recursivo)
 */
export const getAllChildUnits = (
  unit: AcademicUnit,
  allUnits: AcademicUnit[]
): AcademicUnit[] => {
  const children: AcademicUnit[] = [];

  allUnits.forEach((u) => {
    if (u.id_unidade_pai === unit.id) {
      children.push(u);
      // Recursivamente adiciona os filhos dos filhos
      children.push(...getAllChildUnits(u, allUnits));
    }
  });

  return children;
};

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
 * Converte uma unidade acadêmica para o formato legacy de instituição
 */
export const unitToInstitutionLegacy = (unit: AcademicUnit) => {
  return {
    id: unit.id,
    nome: unit.nome,
    sigla: unit.sigla,
    cnpj: unit.cnpj,
  };
};

/**
 * Obtém todas as unidades de um determinado tipo
 */
export const getUnitsByType = (
  units: AcademicUnit[],
  typeId: number
): AcademicUnit[] => {
  return units.filter((unit) => unit.id_tipo_unidade === typeId);
};

/**
 * Obtém todas as instituições (unidades sem pai)
 */
export const getInstitutions = (units: AcademicUnit[]): AcademicUnit[] => {
  return units.filter((unit) => !unit.id_unidade_pai);
};

/**
 * Obtém todas as unidades acadêmicas filhas diretas de uma instituição
 */
export const getDirectChildUnits = (
  parentId: number,
  units: AcademicUnit[]
): AcademicUnit[] => {
  return units.filter((unit) => unit.id_unidade_pai === parentId);
};

/**
 * Verifica se uma unidade é descendente de outra
 */
export const isDescendantOf = (
  unit: AcademicUnit,
  ancestorId: number,
  allUnits: AcademicUnit[]
): boolean => {
  const path = getUnitPath(unit, allUnits);
  return path.some((u) => u.id === ancestorId);
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
