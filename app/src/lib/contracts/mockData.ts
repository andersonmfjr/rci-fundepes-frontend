import {
  ContractListItem,
  ContractDetail,
  Transfer,
  RciDistribution,
  ContractAddendum,
  Bank,
  Financier,
  FinancierType,
  ContractType,
  AcademicUnit,
  UnitType,
  ProjectAccount,
  RciAccount,
} from "@/types";

// Dados mock para as estruturas do banco de dados
const mockBanks: Bank[] = [
  { id: 1, codigo: "001", nome: "Banco do Brasil S.A." },
  { id: 2, codigo: "104", nome: "Caixa Econômica Federal" },
  { id: 3, codigo: "237", nome: "Banco Bradesco S.A." },
];

// Tipos de financiadores (nova entidade)
const mockFinancierTypes: FinancierType[] = [
  { id: 1, descricao: "Público" },
  { id: 2, descricao: "Privado" },
];

const mockFinanciers: Financier[] = [
  {
    id_financiador: 1,
    tipo_financiador: "Público",
    tipo_financiador_descricao: "Órgão Público",
    nome: "FINEP - Financiadora de Estudos e Contratos",
    cnpj: "33.749.094/0001-09",
  },
  {
    id_financiador: 2,
    tipo_financiador: "Público",
    tipo_financiador_descricao: "Órgão Público",
    nome: "CNPq - Conselho Nacional de Desenvolvimento Científico e Tecnológico",
    cnpj: "33.654.831/0001-04",
  },
  {
    id_financiador: 3,
    tipo_financiador: "Privado",
    tipo_financiador_descricao: "Empresa Privada",
    nome: "Empresa XYZ Ltda",
    cnpj: "12.345.678/0001-90",
  },
];

const mockContractTypes: ContractType[] = [
  { id: 1, descricao: "TED" },
  { id: 2, descricao: "Lei da Informática" },
  { id: 3, descricao: "FINEP" },
  { id: 4, descricao: "CNPq" },
];

const mockUnitTypes: UnitType[] = [
  { id: 1, descricao: "Instituição" },
  { id: 2, descricao: "Instituto" },
  { id: 3, descricao: "Faculdade" },
  { id: 4, descricao: "Centro" },
];

// Unidades acadêmicas com estrutura hierárquica
const mockAcademicUnits: AcademicUnit[] = [
  // Instituições raiz
  {
    id: 1,
    nome: "Universidade Federal de Alagoas",
    sigla: "UFAL",
    tipo_unidade: "Instituição",
    parent: null,
    cnpj: "12.345.678/0001-00",
  },
  {
    id: 2,
    nome: "Instituto Federal de Alagoas",
    sigla: "IFAL",
    tipo_unidade: "Instituição",
    parent: null,
    cnpj: "98.765.432/0001-00",
  },
  {
    id: 3,
    nome: "Universidade Estadual de Ciências da Saúde de Alagoas",
    sigla: "UNCISAL",
    tipo_unidade: "Instituição",
    parent: null,
    cnpj: "11.222.333/0001-00",
  },
  // Unidades filhas da UFAL
  {
    id: 4,
    nome: "Instituto de Computação",
    sigla: "IC",
    tipo_unidade: "Instituto",
    parent: null, // Will be set below
    cnpj: null,
  },
  {
    id: 5,
    nome: "Faculdade de Letras",
    sigla: "FALE",
    tipo_unidade: "Faculdade",
    parent: null, // Will be set below
    cnpj: null,
  },
  // Unidades filhas do IFAL
  {
    id: 6,
    nome: "Centro de Informática",
    sigla: "CIN",
    tipo_unidade: "Centro",
    parent: null, // Will be set below
    cnpj: null,
  },
];

// Estabelecer relações pai-filho
mockAcademicUnits[3].parent = mockAcademicUnits[0]; // IC -> UFAL
mockAcademicUnits[4].parent = mockAcademicUnits[0]; // FALE -> UFAL
mockAcademicUnits[5].parent = mockAcademicUnits[1]; // CIN -> IFAL

const mockProjectAccounts: ProjectAccount[] = [
  {
    id_conta_projeto: 1,
    agencia: "1234-5",
    numero: "123456-7",
    id_banco: mockBanks[0],
    data_criacao: "2024-01-15T10:00:00Z",
  },
  {
    id_conta_projeto: 2,
    agencia: "5678-9",
    numero: "987654-3",
    id_banco: mockBanks[1],
    data_criacao: "2024-02-01T09:00:00Z",
  },
];

const mockRciAccounts: RciAccount[] = [
  {
    id_conta_rci: 1,
    agencia: "1111-1",
    numero: "111111-1",
    id_unidade: mockAcademicUnits[3], // IC
    id_banco: mockBanks[0],
    data_criacao: "2024-01-15T10:30:00Z",
  },
  {
    id_conta_rci: 2,
    agencia: "2222-2",
    numero: "222222-2",
    id_unidade: mockAcademicUnits[4], // FALE
    id_banco: mockBanks[1],
    data_criacao: "2024-02-01T09:30:00Z",
  },
  {
    id_conta_rci: 3,
    agencia: "3333-3",
    numero: "333333-3",
    id_unidade: mockAcademicUnits[5], // CIN
    id_banco: mockBanks[2],
    data_criacao: "2024-03-01T10:00:00Z",
  },
];

// Contratos mock (conectados com unidades acadêmicas em vez de instituições)
// Removed duplicate declaration - using the one below

// Distribuições RCI mock
const mockRciDistributions: RciDistribution[] = [
  {
    id_distribuicao_rci: 1,
    id_unidade: mockAcademicUnits[3], // IC
    percentual: "15.5",
    valor_base_calculo: "850000.0",
    data_criacao: "2024-01-16T10:00:00Z",
    transferencias: [],
    validado: true,
  },
  {
    id_distribuicao_rci: 2,
    id_unidade: mockAcademicUnits[3], // IC
    percentual: "8.2",
    valor_base_calculo: "850000.0",
    data_criacao: "2024-01-16T10:30:00Z",
    transferencias: [],
    validado: true,
  },
  {
    id_distribuicao_rci: 3,
    id_unidade: mockAcademicUnits[3], // IC
    percentual: "22.0",
    valor_base_calculo: "1200000.0",
    data_criacao: "2024-02-02T14:00:00Z",
    transferencias: [],
    validado: true,
  },
  {
    id_distribuicao_rci: 4,
    id_unidade: mockAcademicUnits[3], // IC
    percentual: "12.5",
    valor_base_calculo: "675000.0",
    data_criacao: "2024-03-05T14:20:00Z",
    transferencias: [],
    validado: true,
  },
  {
    id_distribuicao_rci: 5,
    id_unidade: mockAcademicUnits[5], // CIN
    percentual: "6.25",
    valor_base_calculo: "675000.0",
    data_criacao: "2024-03-05T14:25:00Z",
    transferencias: [],
    validado: true,
  },
  {
    id_distribuicao_rci: 6,
    id_unidade: mockAcademicUnits[3], // IC
    percentual: "25.0",
    valor_base_calculo: "920000.0",
    data_criacao: "2024-01-10T08:00:00Z",
    transferencias: [],
    validado: true,
  },
  {
    id_distribuicao_rci: 7,
    id_unidade: mockAcademicUnits[4], // FALE
    percentual: "8.5",
    valor_base_calculo: "450000.0",
    data_criacao: "2024-03-20T13:45:00Z",
    transferencias: [],
    validado: true,
  },
  {
    id_distribuicao_rci: 8,
    id_unidade: mockAcademicUnits[5], // CIN
    percentual: "3.8",
    valor_base_calculo: "450000.0",
    data_criacao: "2024-03-20T13:50:00Z",
    transferencias: [],
    validado: true,
  },
];

// Transferências mock
const mockTransfers: Transfer[] = [
  {
    id_transferencia: 1,
    data: "2024-03-15",
    valor: "131750.0", // 15.5% de 850000
    observacao: "Primeira transferência RCI - Instituto de Computação",
    validada: true,
    data_criacao: "2024-03-15T08:30:00Z",
    id_conta_projeto: mockProjectAccounts[0],
    id_conta_rci: mockRciAccounts[0],
  },
  {
    id_transferencia: 2,
    data: "2024-04-10",
    valor: "264000.0", // 22% de 1200000
    observacao: "Transferência RCI - CNPq",
    validada: false,
    data_criacao: "2024-04-10T16:20:00Z",
    id_conta_projeto: mockProjectAccounts[0],
    id_conta_rci: mockRciAccounts[2],
  },
];

// Aditivos contratuais mock
const mockContractAddendums: ContractAddendum[] = [
  {
    id_aditivo_contrato: 1,
    data: "2024-06-15",
    novo_total: "950000.0",
    validado: true,
    data_criacao: "2024-06-15T10:00:00Z",
  },
  {
    id_aditivo_contrato: 2,
    data: "2024-07-20",
    novo_total: "1350000.0",
    validado: false,
    data_criacao: "2024-07-20T14:30:00Z",
  },
];

// Legacy contracts for backward compatibility
export const mockContracts: ContractListItem[] = [
  {
    id: 1,
    nome: "Contrato FINEP - Infraestrutura Tecnológica 2024",
    descricao:
      "Contrato de financiamento para expansão da infraestrutura tecnológica para o ano de 2024, incluindo modernização de servidores e implementação de nova rede.",
    valor_total: "850000.0",
    validado: true,
    data_criacao: "2024-01-15T10:30:00Z",
    data_atualizacao: "2024-01-20T14:22:00Z",
    alertas: [
      {
        id_alerta: 1,
        titulo: "Prazo vencendo",
        descricao: "Prazo de vigência próximo ao vencimento",
        ignorar: false,
        mensagem:
          "O contrato vence em 30 dias. É necessário renovar ou finalizar as atividades pendentes.",
      },
      {
        id_alerta: 2,
        titulo: "RCI Incompleto",
        descricao: "Distribuição RCI não finalizada",
        ignorar: false,
        mensagem:
          "A distribuição RCI para a Faculdade de Letras ainda não foi validada.",
      },
    ],
  },
  {
    id: 2,
    nome: "Modernização de Sistemas",
    descricao:
      "Atualização dos sistemas legados para novas tecnologias, migração de base de dados e implementação de APIs REST.",
    valor_total: "1200000.0",
    validado: true,
    data_criacao: "2024-02-01T09:15:00Z",
    data_atualizacao: "2024-02-10T16:45:00Z",
    alertas: [
      {
        id_alerta: 3,
        titulo: "Transferência pendente",
        descricao: "Transferência bancária aguardando validação",
        ignorar: false,
        mensagem:
          "Transferência de R$ 264.000,00 para o Centro de Informática está pendente de validação.",
      },
    ],
  },
  {
    id: 3,
    nome: "Sistema de Gestão Documental",
    descricao:
      "Desenvolvimento de plataforma para gestão de documentos corporativos com controle de versão e workflow de aprovação.",
    valor_total: "675000.0",
    validado: false,
    data_criacao: "2024-03-05T14:20:00Z",
    data_atualizacao: "2024-03-15T11:30:00Z",
    alertas: [],
  },
  {
    id: 4,
    nome: "Portal do Cliente",
    descricao:
      "Criação de portal web para clientes com funcionalidades de autoatendimento, consulta de pedidos e suporte online.",
    valor_total: "920000.0",
    validado: true,
    data_criacao: "2024-01-10T08:00:00Z",
    data_atualizacao: "2024-04-02T16:00:00Z",
    alertas: [],
  },
  {
    id: 5,
    nome: "Aplicativo Mobile Vendas",
    descricao:
      "Desenvolvimento de aplicativo móvel para equipe de vendas com sincronização offline e GPS tracking.",
    valor_total: "450000.0",
    validado: false,
    data_criacao: "2024-03-20T13:45:00Z",
    data_atualizacao: "2024-03-20T13:45:00Z",
    alertas: [
      {
        id_alerta: 4,
        titulo: "Contrato em Rascunho",
        descricao: "Contrato ainda não foi submetido para validação",
        ignorar: false,
        mensagem:
          "Este contrato está em modo rascunho há mais de 30 dias. Recomenda-se finalizar e submeter para validação.",
      },
      {
        id_alerta: 5,
        titulo: "Documentação Incompleta",
        descricao: "Documentos obrigatórios não anexados",
        ignorar: false,
        mensagem:
          "Faltam documentos obrigatórios: termo de compromisso e cronograma de execução.",
      },
    ],
  },
];

// Mock data for ContractDetail (used by service.getById)
export const mockContractsDetail: ContractDetail[] = [
  {
    id_contrato: 1,
    valor_total: "850000.0",
    vigencia_inicio: "2024-01-01",
    vigencia_fim: "2025-12-31",
    validado: true,
    nome: "Contrato FINEP - Infraestrutura Tecnológica 2024",
    descricao:
      "Contrato de financiamento para expansão da infraestrutura tecnológica para o ano de 2024, incluindo modernização de servidores e implementação de nova rede.",
    data_criacao: "2024-01-15T10:30:00Z",
    data_atualizacao: "2024-01-20T14:22:00Z",
    tipo_contrato: "FINEP",
    coordenador_contrato: "Prof. João Silva",
    unidade_academica: [mockAcademicUnits[3]],
    id_financiador: mockFinanciers[0],
    distribuicoes_rci: [mockRciDistributions[0], mockRciDistributions[1]],
    aditivos_contratuais: [mockContractAddendums[0]],
    alertas: [
      {
        id_alerta: 1,
        titulo: "Prazo vencendo",
        descricao: "Prazo de vigência próximo ao vencimento",
        ignorar: false,
        mensagem:
          "O contrato vence em 30 dias. É necessário renovar ou finalizar as atividades pendentes.",
      },
      {
        id_alerta: 2,
        titulo: "RCI Incompleto",
        descricao: "Distribuição RCI não finalizada",
        ignorar: false,
        mensagem:
          "A distribuição RCI para a Faculdade de Letras ainda não foi validada.",
      },
    ],
  },
  {
    id_contrato: 2,
    valor_total: "1200000.0",
    vigencia_inicio: "2024-02-01",
    vigencia_fim: "2026-01-31",
    validado: true,
    nome: "Modernização de Sistemas",
    descricao:
      "Atualização dos sistemas legados para novas tecnologias, migração de base de dados e implementação de APIs REST.",
    data_criacao: "2024-02-01T09:15:00Z",
    data_atualizacao: "2024-02-10T16:45:00Z",
    tipo_contrato: "CNPq",
    coordenador_contrato: "Prof. Maria Santos",
    unidade_academica: [mockAcademicUnits[3]],
    id_financiador: mockFinanciers[1],
    distribuicoes_rci: [mockRciDistributions[2]],
    aditivos_contratuais: [mockContractAddendums[1]],
    alertas: [
      {
        id_alerta: 3,
        titulo: "Transferência pendente",
        descricao: "Transferência bancária aguardando validação",
        ignorar: false,
        mensagem:
          "Transferência de R$ 264.000,00 para o Centro de Informática está pendente de validação.",
      },
    ],
  },
  {
    id_contrato: 3,
    valor_total: "675000.0",
    vigencia_inicio: "2024-03-01",
    vigencia_fim: "2025-02-28",
    validado: true,
    nome: "Sistema de Gestão Documental",
    descricao:
      "Desenvolvimento de plataforma para gestão de documentos corporativos com controle de versão e workflow de aprovação.",
    data_criacao: "2024-03-05T14:20:00Z",
    data_atualizacao: "2024-03-15T11:30:00Z",
    tipo_contrato: "FINEP",
    coordenador_contrato: "Prof. Carlos Lima",
    unidade_academica: [mockAcademicUnits[3]],
    id_financiador: mockFinanciers[0],
    distribuicoes_rci: [mockRciDistributions[3]],
    aditivos_contratuais: [],
    alertas: [],
  },
  {
    id_contrato: 4,
    valor_total: "920000.0",
    vigencia_inicio: "2024-01-01",
    vigencia_fim: "2025-12-31",
    validado: true,
    nome: "Portal do Cliente",
    descricao:
      "Criação de portal web para clientes com funcionalidades de autoatendimento, consulta de pedidos e suporte online.",
    data_criacao: "2024-01-10T08:00:00Z",
    data_atualizacao: "2024-04-02T16:00:00Z",
    tipo_contrato: "CNPq",
    coordenador_contrato: "Prof. Ana Costa",
    unidade_academica: [mockAcademicUnits[3]],
    id_financiador: mockFinanciers[1],
    distribuicoes_rci: [mockRciDistributions[5]],
    aditivos_contratuais: [],
    alertas: [],
  },
  {
    id_contrato: 5,
    valor_total: "450000.0",
    vigencia_inicio: "2024-03-01",
    vigencia_fim: "2025-02-28",
    validado: false,
    nome: "Aplicativo Mobile Vendas",
    descricao:
      "Desenvolvimento de aplicativo móvel para equipe de vendas com sincronização offline e GPS tracking.",
    data_criacao: "2024-03-20T13:45:00Z",
    data_atualizacao: "2024-03-20T13:45:00Z",
    tipo_contrato: "FINEP",
    coordenador_contrato: "Prof. Pedro Oliveira",
    unidade_academica: [mockAcademicUnits[5]],
    id_financiador: mockFinanciers[0],
    distribuicoes_rci: [mockRciDistributions[6], mockRciDistributions[7]],
    aditivos_contratuais: [],
    alertas: [
      {
        id_alerta: 4,
        titulo: "Contrato em Rascunho",
        descricao: "Contrato ainda não validado",
        ignorar: false,
        mensagem:
          "Este contrato ainda está em rascunho e precisa ser validado antes de prosseguir.",
      },
    ],
  },
];

// Adicionar transferências às distribuições RCI
mockRciDistributions[0].transferencias = [mockTransfers[0]];
mockRciDistributions[2].transferencias = [mockTransfers[1]];

// Exports para compatibilidade
export {
  mockBanks,
  mockFinancierTypes,
  mockFinanciers,
  mockContractTypes,
  mockUnitTypes,
  mockAcademicUnits,
  mockProjectAccounts,
  mockRciAccounts,
  mockRciDistributions,
  mockTransfers,
  mockContractAddendums,
};
