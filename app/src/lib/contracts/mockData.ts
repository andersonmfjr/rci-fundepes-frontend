import {
  Contract,
  Transfer,
  RciDistribution,
  ContractAddendum,
  Bank,
  Financier,
  FinancierType,
  ContractType,
  AcademicUnit,
  UnitType,
  BankAccount,
  InstitutionLegacy,
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
    id: 1,
    id_tipo_financiador: 1,
    nome: "FINEP - Financiadora de Estudos e Projetos",
    tipo: "Órgão Público",
    cnpj: "33.749.094/0001-09",
    tipo_financiador: mockFinancierTypes[0],
  },
  {
    id: 2,
    id_tipo_financiador: 1,
    nome: "CNPq - Conselho Nacional de Desenvolvimento Científico e Tecnológico",
    tipo: "Órgão Público",
    cnpj: "33.654.831/0001-04",
    tipo_financiador: mockFinancierTypes[0],
  },
  {
    id: 3,
    id_tipo_financiador: 2,
    nome: "Empresa XYZ Ltda",
    tipo: "Empresa Privada",
    cnpj: "12.345.678/0001-90",
    tipo_financiador: mockFinancierTypes[1],
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

// Unidades acadêmicas com estrutura hierárquica (removida dependência de instituições)
const mockAcademicUnits: AcademicUnit[] = [
  // Instituições raiz
  {
    id: 1,
    id_tipo_unidade: 1,
    nome: "Universidade Federal de Alagoas",
    sigla: "UFAL",
    cnpj: "12.345.678/0001-00",
    tipo_unidade: mockUnitTypes[0],
  },
  {
    id: 2,
    id_tipo_unidade: 1,
    nome: "Universidade Federal de Pernambuco",
    sigla: "UFPE",
    cnpj: "98.765.432/0001-00",
    tipo_unidade: mockUnitTypes[0],
  },
  {
    id: 3,
    id_tipo_unidade: 1,
    nome: "Universidade Federal da Bahia",
    sigla: "UFBA",
    cnpj: "11.222.333/0001-00",
    tipo_unidade: mockUnitTypes[0],
  },
  // Unidades filhas da UFAL
  {
    id: 4,
    id_unidade_pai: 1,
    id_tipo_unidade: 2,
    nome: "Instituto de Computação",
    sigla: "IC",
    tipo_unidade: mockUnitTypes[1],
  },
  {
    id: 5,
    id_unidade_pai: 1,
    id_tipo_unidade: 3,
    nome: "Faculdade de Letras",
    sigla: "FALE",
    tipo_unidade: mockUnitTypes[2],
  },
  // Unidades filhas da UFPE
  {
    id: 6,
    id_unidade_pai: 2,
    id_tipo_unidade: 4,
    nome: "Centro de Informática",
    sigla: "CIN",
    tipo_unidade: mockUnitTypes[3],
  },
];

// Estabelecer relações pai-filho
mockAcademicUnits[0].unidades_filhas = [
  mockAcademicUnits[3],
  mockAcademicUnits[4],
];
mockAcademicUnits[1].unidades_filhas = [mockAcademicUnits[5]];
mockAcademicUnits[3].unidade_pai = mockAcademicUnits[0];
mockAcademicUnits[4].unidade_pai = mockAcademicUnits[0];
mockAcademicUnits[5].unidade_pai = mockAcademicUnits[1];

const mockBankAccounts: BankAccount[] = [
  {
    id: 1,
    id_unidade: 4,
    id_banco: 1,
    agencia: "1234-5",
    numero: "123456-7",
    unidade: mockAcademicUnits[3], // IC
    banco: mockBanks[0],
  },
  {
    id: 2,
    id_unidade: 5,
    id_banco: 2,
    agencia: "5678-9",
    numero: "987654-3",
    unidade: mockAcademicUnits[4], // FALE
    banco: mockBanks[1],
  },
  {
    id: 3,
    id_unidade: 6,
    id_banco: 3,
    agencia: "9999-1",
    numero: "111111-1",
    unidade: mockAcademicUnits[5], // CIN
    banco: mockBanks[2],
  },
];

// Contratos mock (conectados com unidades acadêmicas em vez de instituições)
const mockContracts: Contract[] = [
  {
    id: 1,
    id_unidade_academica: 4, // IC
    id_financiador: 1,
    id_tipo_contrato: 3,
    valor_total: 850000.0,
    vigencia_inicio: "2024-01-01",
    vigencia_fim: "2025-12-31",
    validado: true,
    nome: "Contrato FINEP - Infraestrutura Tecnológica 2024",
    descricao:
      "Contrato de financiamento para expansão da infraestrutura tecnológica para o ano de 2024, incluindo modernização de servidores e implementação de nova rede.",
    data_criacao: "2024-01-15T10:30:00Z",
    data_atualizacao: "2024-01-20T14:22:00Z",
    unidade_academica: mockAcademicUnits[3], // IC
    financiador: mockFinanciers[0],
    tipo_contrato: mockContractTypes[2],
  },
  {
    id: 2,
    id_unidade_academica: 4, // IC
    id_financiador: 2,
    id_tipo_contrato: 4,
    valor_total: 1200000.0,
    vigencia_inicio: "2024-02-01",
    vigencia_fim: "2026-01-31",
    validado: true,
    nome: "Modernização de Sistemas",
    descricao:
      "Atualização dos sistemas legados para novas tecnologias, migração de base de dados e implementação de APIs REST.",
    data_criacao: "2024-02-01T09:15:00Z",
    data_atualizacao: "2024-02-10T16:45:00Z",
    unidade_academica: mockAcademicUnits[3], // IC
    financiador: mockFinanciers[1],
    tipo_contrato: mockContractTypes[3],
  },
];

// Distribuições RCI mock
const mockRciDistributions: RciDistribution[] = [
  {
    id: 1,
    id_unidade: 4, // IC
    id_contrato: 1,
    percentual: 15.5,
    valor_base_calculo: 850000.0,
    validado: true,
    data_criacao: "2024-01-16T10:00:00Z",
    unidade: mockAcademicUnits[3], // IC
    contrato: mockContracts[0],
  },
  {
    id: 2,
    id_unidade: 5, // FALE
    id_contrato: 1,
    percentual: 8.2,
    valor_base_calculo: 850000.0,
    validado: false,
    data_criacao: "2024-01-16T10:30:00Z",
    unidade: mockAcademicUnits[4], // FALE
    contrato: mockContracts[0],
  },
  {
    id: 3,
    id_unidade: 4, // IC
    id_contrato: 2,
    percentual: 22.0,
    valor_base_calculo: 1200000.0,
    validado: true,
    data_criacao: "2024-02-02T14:00:00Z",
    unidade: mockAcademicUnits[3], // IC
    contrato: mockContracts[1],
  },
];

// Transferências mock (conectadas com distribuições RCI em vez de contratos)
const mockTransfers: Transfer[] = [
  {
    id: 1,
    id_conta_origem: 1,
    id_conta_destino: 2,
    id_distribuicao_rci: 1,
    data: "2024-03-15",
    valor: 131750.0, // 15.5% de 850000
    observacao: "Primeira transferência RCI - Instituto de Computação",
    validada: true,
    data_criacao: "2024-03-15T08:30:00Z",
    conta_origem: mockBankAccounts[0],
    conta_destino: mockBankAccounts[1],
    distribuicao_rci: mockRciDistributions[0],
  },
  {
    id: 2,
    id_conta_origem: 1,
    id_conta_destino: 3,
    id_distribuicao_rci: 3,
    data: "2024-04-10",
    valor: 264000.0, // 22% de 1200000
    observacao: "Transferência RCI - CNPq",
    validada: false,
    data_criacao: "2024-04-10T16:20:00Z",
    conta_origem: mockBankAccounts[0],
    conta_destino: mockBankAccounts[2],
    distribuicao_rci: mockRciDistributions[2],
  },
];

// Aditivos contratuais mock
const mockContractAddendums: ContractAddendum[] = [
  {
    id: 1,
    id_contrato: 1,
    data: "2024-06-15",
    novo_total: 950000.0,
    validado: true,
    descricao:
      "Aditivo para inclusão de novos equipamentos conforme demanda do projeto",
    data_criacao: "2024-06-15T10:00:00Z",
    contrato: mockContracts[0],
  },
  {
    id: 2,
    id_contrato: 2,
    data: "2024-07-20",
    novo_total: 1350000.0,
    validado: false,
    descricao:
      "Aumento de prazo e valor para conclusão das atividades de pesquisa",
    data_criacao: "2024-07-20T14:30:00Z",
    contrato: mockContracts[1],
  },
];

// Dados legados para compatibilidade (simulando instituições)
const mockInstitutionsLegacy: InstitutionLegacy[] = [
  {
    id: 1,
    nome: "Universidade Federal de Alagoas",
    sigla: "UFAL",
    cnpj: "12.345.678/0001-00",
  },
  {
    id: 2,
    nome: "Universidade Federal de Pernambuco",
    sigla: "UFPE",
    cnpj: "98.765.432/0001-00",
  },
  {
    id: 3,
    nome: "Universidade Federal da Bahia",
    sigla: "UFBA",
    cnpj: "11.222.333/0001-00",
  },
];

export const mockContracts: Contract[] = [
  {
    id: "1",
    nome: "Contrato FINEP - Infraestrutura Tecnológica 2024",
    descricao:
      "Contrato de financiamento para expansão da infraestrutura tecnológica para o ano de 2024, incluindo modernização de servidores e implementação de nova rede.",
    valor_total: 850000.0,
    unidades: [
      { id: "u1", nome: "Instituto de Computação", percentual_rci: 15.5 },
      { id: "u2", nome: "Faculdade de Letras", percentual_rci: 8.2 },
    ],
    status: "pending",
    data_criacao: "2024-01-15T10:30:00Z",
    data_atualizacao: "2024-01-20T14:22:00Z",
    link_contrato: "https://example.com/contract-infra-2024.pdf",
    // Novos campos baseados na modelagem
    contrato: mockContracts[0],
    transferencias: [mockTransfers[0]],
    distribuicoes_rci: [mockRciDistributions[0], mockRciDistributions[1]],
    aditivos_contratuais: [mockContractAddendums[0]],
  },
  {
    id: "2",
    nome: "Modernização de Sistemas",
    descricao:
      "Atualização dos sistemas legados para novas tecnologias, migração de base de dados e implementação de APIs REST.",
    valor_total: 1200000.0,
    unidades: [
      { id: "u3", nome: "Instituto de Computação", percentual_rci: 22.0 },
    ],
    status: "validated",
    data_criacao: "2024-02-01T09:15:00Z",
    data_atualizacao: "2024-02-10T16:45:00Z",
    link_contrato: "https://example.com/contract-modernizacao.pdf",
    // Novos campos baseados na modelagem
    contrato: mockContracts[1],
    transferencias: [mockTransfers[1]],
    distribuicoes_rci: [mockRciDistributions[2]],
    aditivos_contratuais: [mockContractAddendums[1]],
  },
  {
    id: "3",
    nome: "Sistema de Gestão Documental",
    descricao:
      "Desenvolvimento de plataforma para gestão de documentos corporativos com controle de versão e workflow de aprovação.",
    valor_total: 675000.0,
    unidades: [
      { id: "u4", nome: "Instituto de Computação", percentual_rci: 12.5 },
      { id: "u5", nome: "Centro de Informática", percentual_rci: 6.25 },
    ],
    status: "validated",
    data_criacao: "2024-03-05T14:20:00Z",
    data_atualizacao: "2024-03-15T11:30:00Z",
  },
  {
    id: "4",
    nome: "Portal do Cliente",
    descricao:
      "Criação de portal web para clientes com funcionalidades de autoatendimento, consulta de pedidos e suporte online.",
    valor_total: 920000.0,
    unidades: [
      { id: "u6", nome: "Instituto de Computação", percentual_rci: 25.0 },
    ],
    status: "completed",
    data_criacao: "2024-01-10T08:00:00Z",
    data_atualizacao: "2024-04-02T16:00:00Z",
  },
  {
    id: "5",
    nome: "Aplicativo Mobile Vendas",
    descricao:
      "Desenvolvimento de aplicativo móvel para equipe de vendas com sincronização offline e GPS tracking.",
    valor_total: 450000.0,
    unidades: [
      { id: "u7", nome: "Instituto de Computação", percentual_rci: 8.5 },
      { id: "u8", nome: "Centro de Informática", percentual_rci: 3.8 },
    ],
    status: "draft",
    data_criacao: "2024-03-20T13:45:00Z",
    data_atualizacao: "2024-03-20T13:45:00Z",
  },
  {
    id: "6",
    nome: "Sistema de Monitoramento de Redes",
    descricao:
      "Implementação de sistema de monitoramento em tempo real para análise de performance de redes e infraestrutura.",
    valor_total: 780000.0,
    unidades: [
      { id: "u9", nome: "Instituto de Computação", percentual_rci: 19.2 },
    ],
    status: "pending",
    data_criacao: "2024-04-01T11:00:00Z",
    data_atualizacao: "2024-04-05T15:30:00Z",
  },
  {
    id: "7",
    nome: "Plataforma de E-learning",
    descricao:
      "Desenvolvimento de plataforma educacional online com recursos interativos, vídeos e sistema de avaliação.",
    valor_total: 1100000.0,
    unidades: [
      { id: "u10", nome: "Instituto de Computação", percentual_rci: 15.8 },
      { id: "u11", nome: "Centro de Informática", percentual_rci: 9.0 },
    ],
    status: "draft",
    data_criacao: "2024-04-10T09:20:00Z",
    data_atualizacao: "2024-04-10T09:20:00Z",
  },
  {
    id: "8",
    nome: "Sistema de Gestão Financeira",
    descricao:
      "Criação de sistema completo para gestão financeira empresarial com controle de fluxo de caixa e relatórios.",
    valor_total: 950000.0,
    unidades: [
      { id: "u12", nome: "Instituto de Computação", percentual_rci: 21.5 },
    ],
    status: "validated",
    data_criacao: "2024-04-15T14:45:00Z",
    data_atualizacao: "2024-04-20T10:15:00Z",
  },
  {
    id: "9",
    nome: "Portal de Recursos Humanos",
    descricao:
      "Desenvolvimento de portal interno para gestão de RH com funcionalidades de recrutamento, avaliação e treinamento.",
    valor_total: 620000.0,
    unidades: [
      { id: "u13", nome: "Instituto de Computação", percentual_rci: 10.7 },
      { id: "u14", nome: "Centro de Informática", percentual_rci: 6.0 },
    ],
    status: "completed",
    data_criacao: "2024-03-01T12:30:00Z",
    data_atualizacao: "2024-05-01T16:45:00Z",
  },
  {
    id: "10",
    nome: "Sistema de Automação Industrial",
    descricao:
      "Implementação de sistema de automação para controle de processos industriais com interface web moderna.",
    valor_total: 1500000.0,
    unidades: [
      { id: "u15", nome: "Instituto de Computação", percentual_rci: 18.3 },
      { id: "u16", nome: "Centro de Informática", percentual_rci: 10.0 },
    ],
    status: "pending",
    data_criacao: "2024-05-05T08:15:00Z",
    data_atualizacao: "2024-05-10T13:20:00Z",
  },
  {
    id: "11",
    nome: "App de Delivery Corporativo",
    descricao:
      "Aplicativo mobile para delivery interno da empresa com sistema de pedidos e tracking em tempo real.",
    valor_total: 380000.0,
    unidades: [
      { id: "u17", nome: "Instituto de Computação", percentual_rci: 14.9 },
    ],
    status: "draft",
    data_criacao: "2024-05-12T16:00:00Z",
    data_atualizacao: "2024-05-12T16:00:00Z",
  },
  {
    id: "12",
    nome: "Sistema de Business Intelligence",
    descricao:
      "Plataforma de BI para análise de dados empresariais com dashboards interativos e relatórios automatizados.",
    valor_total: 1350000.0,
    unidades: [
      { id: "u18", nome: "Instituto de Computação", percentual_rci: 16.4 },
      { id: "u19", nome: "Centro de Informática", percentual_rci: 10.0 },
    ],
    status: "validated",
    data_criacao: "2024-05-15T10:30:00Z",
    data_atualizacao: "2024-05-20T14:50:00Z",
  },
  {
    id: "13",
    nome: "Portal de Atendimento ao Cliente",
    descricao:
      "Sistema web para atendimento ao cliente com chat online, tickets de suporte e base de conhecimento.",
    valor_total: 720000.0,
    unidades: [
      { id: "u20", nome: "Instituto de Computação", percentual_rci: 17.8 },
    ],
    status: "pending",
    data_criacao: "2024-05-22T09:45:00Z",
    data_atualizacao: "2024-05-25T11:30:00Z",
  },
  {
    id: "14",
    nome: "Sistema de Gestão de Projetos",
    descricao:
      "Ferramenta completa para gestão de projetos com cronogramas, recursos, equipes e relatórios de progresso.",
    valor_total: 890000.0,
    unidades: [
      { id: "u21", nome: "Instituto de Computação", percentual_rci: 13.1 },
      { id: "u22", nome: "Centro de Informática", percentual_rci: 10.0 },
    ],
    status: "completed",
    data_criacao: "2024-04-20T13:15:00Z",
    data_atualizacao: "2024-06-01T17:00:00Z",
  },
  {
    id: "15",
    nome: "Plataforma de Comunicação Interna",
    descricao:
      "Sistema de comunicação corporativa com chat, videoconferência e compartilhamento de documentos.",
    valor_total: 550000.0,
    unidades: [
      { id: "u23", nome: "Instituto de Computação", percentual_rci: 12.3 },
    ],
    status: "draft",
    data_criacao: "2024-05-30T11:20:00Z",
    data_atualizacao: "2024-05-30T11:20:00Z",
  },
];

// Exports para compatibilidade
export {
  mockBanks,
  mockFinancierTypes,
  mockFinanciers,
  mockContractTypes,
  mockUnitTypes,
  mockAcademicUnits,
  mockBankAccounts,
  mockContracts,
  mockRciDistributions,
  mockTransfers,
  mockContractAddendums,
  mockInstitutionsLegacy,
};
