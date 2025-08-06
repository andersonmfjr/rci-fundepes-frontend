interface LoginResponse {
  access: string;
  refresh: string;
}

type UserType = "P" | "A";

interface User {
  id: string;
  first_name: string;
  username: string;
  email: string;
  tipo_usuario: UserType;
  tipo_usuario_descricao: string;
  token: string;
  refresh_token: string;
  unidade_academica: null;
}

interface Alert {
  id_alerta: number;
  titulo: string;
  descricao: string;
  ignorar: boolean;
  mensagem: string;
}

interface ContractListItem {
  id: number;
  nome: string;
  descricao: string;
  valor_total: string;
  data_criacao: string;
  data_atualizacao: string | null;
  validado: boolean;
  alertas: Alert[];
}

interface ContractListResponse {
  count: number;
  previous: string | null;
  next: string | null;
  results: ContractListItem[];
}

interface Bank {
  id: number;
  codigo: string;
  nome: string;
}

interface FinancierType {
  id: number;
  descricao: string;
}

interface Financier {
  id_financiador: number;
  tipo_financiador: string;
  tipo_financiador_descricao: string;
  nome: string;
  cnpj: string | null;
}

interface ContractType {
  id: number;
  descricao: string;
}

interface UnitType {
  id: number;
  descricao: string;
}

interface AcademicUnit {
  id: number;
  nome: string;
  sigla: string | null;
  tipo_unidade: string;
  parent: AcademicUnit | null;
  cnpj: string | null;
}

interface RciDistribution {
  id_distribuicao_rci: number;
  id_unidade: AcademicUnit;
  percentual: string;
  valor_base_calculo: string;
  data_criacao: string;
  transferencias: Transfer[];
  validado: boolean;
}

interface ProjectAccount {
  id_conta_projeto: number;
  agencia: string;
  numero: string;
  id_banco: Bank;
  data_criacao: string;
}

interface RciAccount {
  id_conta_rci: number;
  agencia: string;
  numero: string;
  id_unidade: AcademicUnit;
  id_banco: Bank;
  data_criacao: string;
}

interface Transfer {
  id_transferencia: number;
  data: string;
  valor: string;
  observacao: string;
  validada: boolean;
  data_criacao: string;
  id_conta_projeto: ProjectAccount;
  id_conta_rci: RciAccount;
}

interface ContractAddendum {
  id_aditivo_contrato: number;
  data: string;
  novo_total: string;
  validado: boolean;
  data_criacao: string;
}

interface ContractDetail {
  id_contrato: number;
  valor_total: string;
  vigencia_inicio: string;
  vigencia_fim: string;
  validado: boolean;
  nome: string;
  descricao: string;
  data_criacao: string;
  data_atualizacao: string | null;
  tipo_contrato: string;
  coordenador_contrato: string;
  unidade_academica: AcademicUnit[];
  id_financiador: Financier;
  distribuicoes_rci: RciDistribution[];
  aditivos_contratuais: ContractAddendum[];
  alertas: Alert[];
}

// Business Intelligence Types
interface BiContract {
  id: number;
  contrato: string;
  financiador: string;
  inicio: string;
  fim: string;
  valor_contrato: number;
  valor_rci_reitoria: number;
}

interface BiBankTransfer {
  data: string;
  origem: string;
  destino: string;
  valor: number;
  observacao: string;
}

interface BiRciReceived {
  data: string;
  origem: string;
  destino: string;
  valor: number;
  observacao: string;
}

interface BiOverviewStats {
  valor_total_contratos: number;
  total_contratos: number;
  total_rci: number;
  contratos_rci: number;
  recebido_rci: number;
  contratos_recebidos: number;
  rci_a_receber: number;
  contratos_a_receber: number;
}

interface BiFilters {
  search?: string;
  unidade_academica?: number;
  tipo_contrato?: number;
  projeto_contrato?: number;
  periodo_inicio?: string;
  periodo_fim?: string;
  sortField?: BiSortField;
  sortDirection?: BiSortDirection;
  page?: number;
  pageSize?: number;
}

type BiSortField =
  | "contrato"
  | "financiador"
  | "inicio"
  | "fim"
  | "valor_contrato"
  | "valor_rci_reitoria";

type BiSortDirection = "asc" | "desc";

interface BiOverviewResponse {
  stats: BiOverviewStats;
  contracts: {
    count: number;
    previous: string | null;
    next: string | null;
    results: BiContract[];
  };
  bankTransfers: BiBankTransfer[];
  rciReceived: BiRciReceived[];
}

interface BiDetailsStats {
  identificador: string;
  status: string;
  financiador: string;
  unidade_academica: string;
  percentual_rci_reitoria: number;
  valor_total_projeto: number;
  contratos_projeto: number;
  rci_recebido: number;
  contratos_recebidos: number;
  rci_a_receber: number;
  contratos_a_receber: number;
  percentual_rci_unidade: number;
}

interface BiChartData {
  name: string;
  value: number;
  color?: string;
}

interface BiBarChartData {
  unidade_academica: BiChartData;
  reitoria: BiChartData;
}

interface BiDonutChartData {
  realizado: BiChartData;
  disponivel: BiChartData;
  suspenso: BiChartData;
}

interface BiDetailsResponse {
  stats: BiDetailsStats;
  barChart: BiBarChartData;
  donutChart: BiDonutChartData;
}

interface RequestInit {
  withoutAuth?: boolean;
  token?: string;
}
