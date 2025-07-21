export interface User {
  id: string;
  nome: string;
  email: string;
  token: string;
  refresh_token: string;
}

export type ContractStatus = "draft" | "pending" | "validated" | "completed";

// Tipos baseados na nova modelagem do banco de dados

export interface Bank {
  id: number;
  codigo: string;
  nome: string;
}

export interface FinancierType {
  id: number;
  descricao: string;
}

export interface Financier {
  id: number;
  id_tipo_financiador: number;
  nome: string;
  tipo?: string;
  cnpj?: string;
  tipo_financiador: FinancierType;
}

export interface ContractType {
  id: number;
  descricao: string;
}

export interface UnitType {
  id: number;
  descricao: string;
}

export interface AcademicUnit {
  id: number;
  id_unidade_pai?: number;
  id_tipo_unidade: number;
  nome: string;
  sigla: string;
  cnpj?: string;
  unidade_pai?: AcademicUnit;
  tipo_unidade: UnitType;
  unidades_filhas?: AcademicUnit[];
}

export interface BankAccount {
  id: number;
  id_unidade: number;
  id_banco: number;
  agencia: string;
  numero: string;
  unidade: AcademicUnit;
  banco: Bank;
}

export interface Contract {
  id: number;
  id_unidade_academica: number;
  id_financiador: number;
  id_tipo_contrato: number;
  valor_total: number;
  vigencia_inicio: string;
  vigencia_fim: string;
  validado: boolean;
  nome: string;
  descricao: string;
  data_criacao: string;
  data_atualizacao: string;
  unidade_academica: AcademicUnit;
  financiador: Financier;
  tipo_contrato: ContractType;
  // Relacionamentos
  transferencias?: Transfer[];
  distribuicoes_rci?: RciDistribution[];
  aditivos_contratuais?: ContractAddendum[];
  // Campos legados para compatibilidade
  contractFile?: File | null;
  contractLink?: string;
  bankStatements?: File[];

  unidades: Unit[]; // Unidades derivadas de rciDistributions
  status: ContractStatus; // Mantido para compatibilidade com interface atual
  link_contrato?: string; // Link para o contrato
}

export interface RciDistribution {
  id: number;
  id_unidade: number;
  id_contrato: number;
  percentual: number;
  valor_base_calculo: number;
  validado: boolean;
  data_criacao: string;
  unidade: AcademicUnit;
  contrato: Contract;
}

export interface Transfer {
  id: number;
  id_conta_origem: number;
  id_conta_destino: number;
  id_distribuicao_rci: number;
  data: string;
  valor: number;
  observacao?: string;
  validada: boolean;
  data_criacao: string;
  conta_origem: BankAccount;
  conta_destino: BankAccount;
  distribuicao_rci: RciDistribution;
}

export interface ContractAddendum {
  id: number;
  id_contrato: number;
  data: string;
  novo_total: number;
  validado: boolean;
  descricao?: string;
  data_criacao: string;
  contrato: Contract;
}

// Tipos legados mantidos para compatibilidade (agora baseados em Contract)
export interface Unit {
  id: string;
  nome: string;
  percentual_rci: number;
}

export interface ContractFormData {
  nome: string;
  descricao: string;
  valor_total: number; // Valor total em reais
  unidades: Unit[]; // Unidades com seus respectivos percentuais RCI
  link_contrato?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Tipos auxiliares para trabalhar com a estrutura hierárquica
export interface UnitHierarchy {
  unidade: AcademicUnit;
  nivel: number;
  caminho: number[];
  caminho_completo: string;
  filhos: UnitHierarchy[];
}

// Interface para representar a estrutura de dados sem a entidade Institution (removida)
export interface InstitutionLegacy {
  id: number;
  nome: string;
  sigla: string;
  cnpj?: string;
}

// Mapeamento para manter compatibilidade com dados legados
export interface ContractLegacy {
  id: number;
  id_instituicao: number;
  id_financiador: number;
  id_tipo_contrato: number;
  valor_total: number;
  vigencia_inicio: string;
  vigencia_fim: string;
  validado: boolean;
  data_criacao: string;
  data_atualizacao: string;
  instituicao: InstitutionLegacy;
  financiador: Financier;
  tipo_contrato: ContractType;
}
