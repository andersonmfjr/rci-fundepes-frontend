import {
  BiContract,
  BiBankTransfer,
  BiRciReceived,
  BiOverviewStats,
  AcademicUnit,
  ContractType,
} from "@/types";

// Mock data for Business Intelligence module
export const mockBiContracts: BiContract[] = [
  {
    id: 1,
    contrato: "CT-2023/0145",
    financiador: "CAPES",
    inicio: "01/01/2022",
    fim: "31/12/2025",
    valor_contrato: 12450000,
    valor_rci_reitoria: 12450000,
  },
  {
    id: 2,
    contrato: "CT-2023/0146",
    financiador: "FINEP",
    inicio: "01/01/2022",
    fim: "31/12/2025",
    valor_contrato: 12450000,
    valor_rci_reitoria: 12450000,
  },
  {
    id: 3,
    contrato: "CT-2023/0147",
    financiador: "CNPq",
    inicio: "01/01/2022",
    fim: "31/12/2025",
    valor_contrato: 12450000,
    valor_rci_reitoria: 12450000,
  },
  {
    id: 4,
    contrato: "CT-2023/0148",
    financiador: "FAPESP",
    inicio: "01/01/2022",
    fim: "31/12/2025",
    valor_contrato: 12450000,
    valor_rci_reitoria: 12450000,
  },
  {
    id: 5,
    contrato: "CT-2023/0149",
    financiador: "CAPES",
    inicio: "01/01/2022",
    fim: "31/12/2025",
    valor_contrato: 12450000,
    valor_rci_reitoria: 12450000,
  },
  {
    id: 6,
    contrato: "CT-2023/0150",
    financiador: "FINEP",
    inicio: "01/01/2022",
    fim: "31/12/2025",
    valor_contrato: 12450000,
    valor_rci_reitoria: 12450000,
  },
  {
    id: 7,
    contrato: "CT-2023/0151",
    financiador: "CNPq",
    inicio: "01/01/2022",
    fim: "31/12/2025",
    valor_contrato: 12450000,
    valor_rci_reitoria: 12450000,
  },
  {
    id: 8,
    contrato: "CT-2023/0152",
    financiador: "FAPESP",
    inicio: "01/01/2022",
    fim: "31/12/2025",
    valor_contrato: 12450000,
    valor_rci_reitoria: 12450000,
  },
  {
    id: 9,
    contrato: "CT-2023/0153",
    financiador: "CAPES",
    inicio: "01/01/2022",
    fim: "31/12/2025",
    valor_contrato: 12450000,
    valor_rci_reitoria: 12450000,
  },
  {
    id: 10,
    contrato: "CT-2023/0154",
    financiador: "FINEP",
    inicio: "01/01/2022",
    fim: "31/12/2025",
    valor_contrato: 12450000,
    valor_rci_reitoria: 12450000,
  },
];

export const mockBiBankTransfers: BiBankTransfer[] = [
  {
    data: "01/01/2022",
    origem: "Conta A",
    destino: "Conta B",
    valor: 12450000,
    observacao: "Pag. X",
  },
  {
    data: "01/01/2022",
    origem: "Conta C",
    destino: "Conta D",
    valor: 12450000,
    observacao: "Transf. Y",
  },
  {
    data: "15/02/2022",
    origem: "Conta E",
    destino: "Conta F",
    valor: 8500000,
    observacao: "Pag. Z",
  },
  {
    data: "01/03/2022",
    origem: "Conta G",
    destino: "Conta H",
    valor: 9500000,
    observacao: "Transf. W",
  },
];

export const mockBiRciReceived: BiRciReceived[] = [
  {
    data: "01/01/2022",
    origem: "Conta A",
    destino: "Conta B",
    valor: 12450000,
    observacao: "Pag. X",
  },
  {
    data: "01/01/2022",
    origem: "Conta C",
    destino: "Conta D",
    valor: 12450000,
    observacao: "Transf. Y",
  },
  {
    data: "15/02/2022",
    origem: "Conta E",
    destino: "Conta F",
    valor: 8500000,
    observacao: "Pag. Z",
  },
  {
    data: "01/03/2022",
    origem: "Conta G",
    destino: "Conta H",
    valor: 9500000,
    observacao: "Transf. W",
  },
];

export const mockBiOverviewStats: BiOverviewStats = {
  valor_total_contratos: 12000000,
  total_contratos: 247,
  total_rci: 1000000,
  contratos_rci: 247,
  recebido_rci: 24900,
  contratos_recebidos: 27,
  rci_a_receber: 300000,
  contratos_a_receber: 220,
};

// Mock filter options
export const mockBiAcademicUnits: AcademicUnit[] = [
  {
    id: 1,
    nome: "Centro de Tecnologia",
    sigla: "CTEC",
    id_tipo_unidade: 1,
    tipo_unidade: { id: 1, descricao: "Centro" },
  },
  {
    id: 2,
    nome: "Instituto de Computação",
    sigla: "IC",
    id_tipo_unidade: 2,
    tipo_unidade: { id: 2, descricao: "Instituto" },
  },
  {
    id: 3,
    nome: "Faculdade de Medicina",
    sigla: "FM",
    id_tipo_unidade: 3,
    tipo_unidade: { id: 3, descricao: "Faculdade" },
  },
];

export const mockBiContractTypes: ContractType[] = [
  {
    id: 1,
    descricao: "Pesquisa",
  },
  {
    id: 2,
    descricao: "Extensão",
  },
  {
    id: 3,
    descricao: "Ensino",
  },
  {
    id: 4,
    descricao: "Administrativo",
  },
];

export const mockBiProjectContracts = [
  { id: 1, nome: "Projeto A" },
  { id: 2, nome: "Projeto B" },
  { id: 3, nome: "Projeto C" },
  { id: 4, nome: "Projeto D" },
];

// Mock data for BI Details page
export const mockBiDetailsStats = {
  identificador: "CT-2023/01",
  status: "Ativo",
  financiador: "CAPES",
  unidade_academica: "UFAL",
  percentual_rci_reitoria: 20,
  valor_total_projeto: 300000,
  contratos_projeto: 1,
  rci_recebido: 0,
  contratos_recebidos: 1,
  rci_a_receber: 10000,
  contratos_a_receber: 1,
  percentual_rci_unidade: 2,
};

export const mockBiBarChartData = {
  unidade_academica: {
    name: "Unidade Acadêmica X",
    value: 27000,
    color: "#3B82F6",
  },
  reitoria: {
    name: "Reitoria",
    value: 3000,
    color: "#1E40AF",
  },
};

export const mockBiDonutChartData = {
  realizado: {
    name: "Realizado",
    value: 20000,
    color: "#06B6D4",
  },
  disponivel: {
    name: "Disponível",
    value: 52800,
    color: "#3B82F6",
  },
  suspenso: {
    name: "Suspenso",
    value: 7200,
    color: "#F97316",
  },
};
