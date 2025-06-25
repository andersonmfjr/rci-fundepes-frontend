export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  refreshToken: string;
}

export type ProjectStatus = "draft" | "pending" | "validated" | "completed";

// Tipos baseados na modelagem do banco de dados

export interface Bank {
  id: number;
  codigo: string;
  nome: string;
}

export interface Institution {
  id: number;
  nome: string;
  sigla: string;
  cnpj?: string;
}

export interface Financier {
  id: number;
  nome: string;
  tipo?: string;
  cnpj?: string;
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
  id_instituicao: number;
  id_tipo_unidade: number;
  nome: string;
  sigla: string;
  instituicao: Institution;
  tipo_unidade: UnitType;
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
  id_instituicao: number;
  id_financiador: number;
  id_tipo_contrato: number;
  valor_total: number;
  vigencia_inicio: string;
  vigencia_fim: string;
  validado: boolean;
  data_criacao: string;
  data_atualizacao: string;
  instituicao: Institution;
  financiador: Financier;
  tipo_contrato: ContractType;
  // Campos adicionais para compatibilidade com a interface atual
  name?: string; // Pode ser derivado de uma combinação de campos
  description?: string; // Descrição adicional se necessário
  // Relacionamentos
  transfers?: Transfer[];
  rciDistributions?: RciDistribution[];
  contractAddendums?: ContractAddendum[];
  // Campos legados para compatibilidade
  contractFile?: File | null;
  contractLink?: string;
  bankStatements?: File[];
  createdAt?: string; // Mapeado de data_criacao
  updatedAt?: string; // Mapeado de data_atualizacao
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
  id_contrato: number;
  data: string;
  valor: number;
  observacao?: string;
  validada: boolean;
  data_criacao: string;
  conta_origem: BankAccount;
  conta_destino: BankAccount;
  contrato: Contract;
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
  name: string;
  rciPercentage: number;
}

// Project agora é um alias para Contract com campos adicionais para compatibilidade
export interface Project extends Partial<Omit<Contract, 'id'>> {
  id: string; // Convertido de number para string para compatibilidade
  name?: string; // Nome do contrato
  description?: string; // Descrição do contrato
  totalValue: number; // Alias para valor_total
  units: Unit[]; // Unidades derivadas de rciDistributions
  status: ProjectStatus; // Mantido para compatibilidade com interface atual
  contractFile?: File | null;
  contractLink?: string;
  bankStatements?: File[];
  createdAt?: string;
  updatedAt?: string;
  contract?: Contract; // Referência ao contrato completo
}

export interface ProjectFormData {
  name: string;
  description: string;
  totalValue: number; // Valor total em reais
  units: Unit[]; // Unidades com seus respectivos percentuais RCI
  contractFile?: File | null;
  contractLink?: string;
  bankStatements: File[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
