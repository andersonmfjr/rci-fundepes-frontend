import { Project, Contract, Transfer, RciDistribution, ContractAddendum, Bank, Institution, Financier, ContractType, AcademicUnit, UnitType, BankAccount } from "@/types";

// Dados mock para as estruturas do banco de dados
const mockBanks: Bank[] = [
  { id: 1, codigo: "001", nome: "Banco do Brasil S.A." },
  { id: 2, codigo: "104", nome: "Caixa Econômica Federal" },
  { id: 3, codigo: "237", nome: "Banco Bradesco S.A." }
];

const mockInstitutions: Institution[] = [
  { id: 1, nome: "Universidade Federal de Alagoas", sigla: "UFAL", cnpj: "12.345.678/0001-00" },
  { id: 2, nome: "Universidade Federal de Pernambuco", sigla: "UFPE", cnpj: "98.765.432/0001-00" },
  { id: 3, nome: "Universidade Federal da Bahia", sigla: "UFBA", cnpj: "11.222.333/0001-00" }
];

const mockFinanciers: Financier[] = [
  { id: 1, nome: "FINEP - Financiadora de Estudos e Projetos", tipo: "Órgão Público", cnpj: "33.749.094/0001-09" },
  { id: 2, nome: "CNPq - Conselho Nacional de Desenvolvimento Científico e Tecnológico", tipo: "Órgão Público", cnpj: "33.654.831/0001-04" },
  { id: 3, nome: "Empresa XYZ Ltda", tipo: "Empresa Privada", cnpj: "12.345.678/0001-90" }
];

const mockContractTypes: ContractType[] = [
  { id: 1, descricao: "TED" },
  { id: 2, descricao: "Lei da Informática" },
  { id: 3, descricao: "FINEP" },
  { id: 4, descricao: "CNPq" }
];

const mockUnitTypes: UnitType[] = [
  { id: 1, descricao: "Instituto" },
  { id: 2, descricao: "Faculdade" },
  { id: 3, descricao: "Centro" }
];

const mockAcademicUnits: AcademicUnit[] = [
  {
    id: 1,
    id_instituicao: 1,
    id_tipo_unidade: 1,
    nome: "Instituto de Computação",
    sigla: "IC",
    instituicao: mockInstitutions[0],
    tipo_unidade: mockUnitTypes[0]
  },
  {
    id: 2,
    id_instituicao: 1,
    id_tipo_unidade: 2,
    nome: "Faculdade de Letras",
    sigla: "FALE",
    instituicao: mockInstitutions[0],
    tipo_unidade: mockUnitTypes[1]
  },
  {
    id: 3,
    id_instituicao: 2,
    id_tipo_unidade: 1,
    nome: "Centro de Informática",
    sigla: "CIN",
    instituicao: mockInstitutions[1],
    tipo_unidade: mockUnitTypes[2]
  }
];

const mockBankAccounts: BankAccount[] = [
  {
    id: 1,
    id_unidade: 1,
    id_banco: 1,
    agencia: "1234-5",
    numero: "123456-7",
    unidade: mockAcademicUnits[0],
    banco: mockBanks[0]
  },
  {
    id: 2,
    id_unidade: 2,
    id_banco: 2,
    agencia: "5678-9",
    numero: "987654-3",
    unidade: mockAcademicUnits[1],
    banco: mockBanks[1]
  },
  {
    id: 3,
    id_unidade: 3,
    id_banco: 3,
    agencia: "9999-1",
    numero: "111111-1",
    unidade: mockAcademicUnits[2],
    banco: mockBanks[2]
  }
];

// Contratos mock
const mockContracts: Contract[] = [
  {
    id: 1,
    id_instituicao: 1,
    id_financiador: 1,
    id_tipo_contrato: 3,
    valor_total: 850000.0,
    vigencia_inicio: "2024-01-01",
    vigencia_fim: "2025-12-31",
    validado: true,
    data_criacao: "2024-01-15T10:30:00Z",
    data_atualizacao: "2024-01-20T14:22:00Z",
    instituicao: mockInstitutions[0],
    financiador: mockFinanciers[0],
    tipo_contrato: mockContractTypes[2]
  },
  {
    id: 2,
    id_instituicao: 1,
    id_financiador: 2,
    id_tipo_contrato: 4,
    valor_total: 1200000.0,
    vigencia_inicio: "2024-02-01",
    vigencia_fim: "2026-01-31",
    validado: true,
    data_criacao: "2024-02-01T09:15:00Z",
    data_atualizacao: "2024-02-10T16:45:00Z",
    instituicao: mockInstitutions[0],
    financiador: mockFinanciers[1],
    tipo_contrato: mockContractTypes[3]
  }
];

// Distribuições RCI mock
const mockRciDistributions: RciDistribution[] = [
  {
    id: 1,
    id_unidade: 1,
    id_contrato: 1,
    percentual: 15.5,
    valor_base_calculo: 850000.0,
    validado: true,
    data_criacao: "2024-01-16T10:00:00Z",
    unidade: mockAcademicUnits[0],
    contrato: mockContracts[0]
  },
  {
    id: 2,
    id_unidade: 2,
    id_contrato: 1,
    percentual: 8.2,
    valor_base_calculo: 850000.0,
    validado: false,
    data_criacao: "2024-01-16T10:30:00Z",
    unidade: mockAcademicUnits[1],
    contrato: mockContracts[0]
  },
  {
    id: 3,
    id_unidade: 1,
    id_contrato: 2,
    percentual: 22.0,
    valor_base_calculo: 1200000.0,
    validado: true,
    data_criacao: "2024-02-02T14:00:00Z",
    unidade: mockAcademicUnits[0],
    contrato: mockContracts[1]
  }
];

// Transferências mock
const mockTransfers: Transfer[] = [
  {
    id: 1,
    id_conta_origem: 1,
    id_conta_destino: 2,
    id_contrato: 1,
    data: "2024-03-15",
    valor: 131750.0, // 15.5% de 850000
    observacao: "Primeira transferência RCI - Instituto de Computação",
    validada: true,
    data_criacao: "2024-03-15T08:30:00Z",
    conta_origem: mockBankAccounts[0],
    conta_destino: mockBankAccounts[1],
    contrato: mockContracts[0]
  },
  {
    id: 2,
    id_conta_origem: 1,
    id_conta_destino: 3,
    id_contrato: 2,
    data: "2024-04-10",
    valor: 264000.0, // 22% de 1200000
    observacao: "Transferência RCI - CNPq",
    validada: false,
    data_criacao: "2024-04-10T16:20:00Z",
    conta_origem: mockBankAccounts[0],
    conta_destino: mockBankAccounts[2],
    contrato: mockContracts[1]
  }
];

// Aditivos contratuais mock
const mockContractAddendums: ContractAddendum[] = [
  {
    id: 1,
    id_contrato: 1,
    data: "2024-06-15",
    novo_total: 950000.0,
    validado: true,
    descricao: "Aditivo para inclusão de novos equipamentos conforme demanda do projeto",
    data_criacao: "2024-06-15T10:00:00Z",
    contrato: mockContracts[0]
  },
  {
    id: 2,
    id_contrato: 2,
    data: "2024-07-20",
    novo_total: 1350000.0,
    validado: false,
    descricao: "Aumento de prazo e valor para conclusão das atividades de pesquisa",
    data_criacao: "2024-07-20T14:30:00Z",
    contrato: mockContracts[1]
  }
];

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Contrato FINEP - Infraestrutura Tecnológica 2024",
    description:
      "Contrato de financiamento para expansão da infraestrutura tecnológica para o ano de 2024, incluindo modernização de servidores e implementação de nova rede.",
    totalValue: 850000.0,
    units: [
      { id: "u1", name: "UFAL", rciPercentage: 15.5 },
      { id: "u2", name: "UFPE", rciPercentage: 8.2 },
    ],
    status: "pending",
    bankStatements: [],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:22:00Z",
    contractLink: "https://example.com/contract-infra-2024.pdf",
    // Novos campos baseados na modelagem
    contract: mockContracts[0],
    transfers: [mockTransfers[0]],
    rciDistributions: [mockRciDistributions[0], mockRciDistributions[1]],
    contractAddendums: [mockContractAddendums[0]]
  },
  {
    id: "2",
    name: "Modernização de Sistemas",
    description:
      "Atualização dos sistemas legados para novas tecnologias, migração de base de dados e implementação de APIs REST.",
    totalValue: 1200000.0,
    units: [{ id: "u3", name: "UFAL", rciPercentage: 22.0 }],
    status: "validated",
    bankStatements: [],
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-02-10T16:45:00Z",
    contractLink: "https://example.com/contract-modernizacao.pdf",
    // Novos campos baseados na modelagem
    contract: mockContracts[1],
    transfers: [mockTransfers[1]],
    rciDistributions: [mockRciDistributions[2]],
    contractAddendums: [mockContractAddendums[1]]
  },
  {
    id: "3",
    name: "Sistema de Gestão Documental",
    description:
      "Desenvolvimento de plataforma para gestão de documentos corporativos com controle de versão e workflow de aprovação.",
    totalValue: 675000.0,
    units: [
      { id: "u4", name: "UFAL", rciPercentage: 12.5 },
      { id: "u5", name: "UFBA", rciPercentage: 6.25 },
    ],
    status: "validated",
    bankStatements: [],
    createdAt: "2024-03-05T14:20:00Z",
    updatedAt: "2024-03-15T11:30:00Z",
  },
  {
    id: "4",
    name: "Portal do Cliente",
    description:
      "Criação de portal web para clientes com funcionalidades de autoatendimento, consulta de pedidos e suporte online.",
    totalValue: 920000.0,
    units: [{ id: "u6", name: "UFAL", rciPercentage: 25.0 }],
    status: "completed",
    bankStatements: [],
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-04-02T16:00:00Z",
  },
  {
    id: "5",
    name: "Aplicativo Mobile Vendas",
    description:
      "Desenvolvimento de aplicativo móvel para equipe de vendas com sincronização offline e GPS tracking.",
    totalValue: 450000.0,
    units: [
      { id: "u7", name: "UFAL", rciPercentage: 8.5 },
      { id: "u8", name: "UFPE", rciPercentage: 3.8 },
    ],
    status: "draft",
    bankStatements: [],
    createdAt: "2024-03-20T13:45:00Z",
    updatedAt: "2024-03-20T13:45:00Z",
  },
  {
    id: "6",
    name: "Sistema de Monitoramento de Redes",
    description:
      "Implementação de sistema de monitoramento em tempo real para análise de performance de redes e infraestrutura.",
    totalValue: 780000.0,
    units: [{ id: "u9", name: "UFAL", rciPercentage: 19.2 }],
    status: "pending",
    bankStatements: [],
    createdAt: "2024-04-01T11:00:00Z",
    updatedAt: "2024-04-05T15:30:00Z",
  },
  {
    id: "7",
    name: "Plataforma de E-learning",
    description:
      "Desenvolvimento de plataforma educacional online com recursos interativos, vídeos e sistema de avaliação.",
    totalValue: 1100000.0,
    units: [
      { id: "u10", name: "UFAL", rciPercentage: 15.8 },
      { id: "u11", name: "UFPE", rciPercentage: 9.0 },
    ],
    status: "draft",
    bankStatements: [],
    createdAt: "2024-04-10T09:20:00Z",
    updatedAt: "2024-04-10T09:20:00Z",
  },
  {
    id: "8",
    name: "Sistema de Gestão Financeira",
    description:
      "Criação de sistema completo para gestão financeira empresarial com controle de fluxo de caixa e relatórios.",
    totalValue: 950000.0,
    units: [{ id: "u12", name: "UFAL", rciPercentage: 21.5 }],
    status: "validated",
    bankStatements: [],
    createdAt: "2024-04-15T14:45:00Z",
    updatedAt: "2024-04-20T10:15:00Z",
  },
  {
    id: "9",
    name: "Portal de Recursos Humanos",
    description:
      "Desenvolvimento de portal interno para gestão de RH com funcionalidades de recrutamento, avaliação e treinamento.",
    totalValue: 620000.0,
    units: [
      { id: "u13", name: "UFAL", rciPercentage: 10.7 },
      { id: "u14", name: "UFBA", rciPercentage: 6.0 },
    ],
    status: "completed",
    bankStatements: [],
    createdAt: "2024-03-01T12:30:00Z",
    updatedAt: "2024-05-01T16:45:00Z",
  },
  {
    id: "10",
    name: "Sistema de Automação Industrial",
    description:
      "Implementação de sistema de automação para controle de processos industriais com interface web moderna.",
    totalValue: 1500000.0,
    units: [
      { id: "u15", name: "UFAL", rciPercentage: 18.3 },
      { id: "u16", name: "UFPE", rciPercentage: 10.0 },
    ],
    status: "pending",
    bankStatements: [],
    createdAt: "2024-05-05T08:15:00Z",
    updatedAt: "2024-05-10T13:20:00Z",
  },
  {
    id: "11",
    name: "App de Delivery Corporativo",
    description:
      "Aplicativo mobile para delivery interno da empresa com sistema de pedidos e tracking em tempo real.",
    totalValue: 380000.0,
    units: [{ id: "u17", name: "UFAL", rciPercentage: 14.9 }],
    status: "draft",
    bankStatements: [],
    createdAt: "2024-05-12T16:00:00Z",
    updatedAt: "2024-05-12T16:00:00Z",
  },
  {
    id: "12",
    name: "Sistema de Business Intelligence",
    description:
      "Plataforma de BI para análise de dados empresariais com dashboards interativos e relatórios automatizados.",
    totalValue: 1350000.0,
    units: [
      { id: "u18", name: "UFAL", rciPercentage: 16.4 },
      { id: "u19", name: "UFBA", rciPercentage: 10.0 },
    ],
    status: "validated",
    bankStatements: [],
    createdAt: "2024-05-15T10:30:00Z",
    updatedAt: "2024-05-20T14:50:00Z",
  },
  {
    id: "13",
    name: "Portal de Atendimento ao Cliente",
    description:
      "Sistema web para atendimento ao cliente com chat online, tickets de suporte e base de conhecimento.",
    totalValue: 720000.0,
    units: [{ id: "u20", name: "UFAL", rciPercentage: 17.8 }],
    status: "pending",
    bankStatements: [],
    createdAt: "2024-05-22T09:45:00Z",
    updatedAt: "2024-05-25T11:30:00Z",
  },
  {
    id: "14",
    name: "Sistema de Gestão de Projetos",
    description:
      "Ferramenta completa para gestão de projetos com cronogramas, recursos, equipes e relatórios de progresso.",
    totalValue: 890000.0,
    units: [
      { id: "u21", name: "UFAL", rciPercentage: 13.1 },
      { id: "u22", name: "UFPE", rciPercentage: 10.0 },
    ],
    status: "completed",
    bankStatements: [],
    createdAt: "2024-04-20T13:15:00Z",
    updatedAt: "2024-06-01T17:00:00Z",
  },
  {
    id: "15",
    name: "Plataforma de Comunicação Interna",
    description:
      "Sistema de comunicação corporativa com chat, videoconferência e compartilhamento de documentos.",
    totalValue: 550000.0,
    units: [{ id: "u23", name: "UFAL", rciPercentage: 12.3 }],
    status: "draft",
    bankStatements: [],
    createdAt: "2024-05-30T11:20:00Z",
    updatedAt: "2024-05-30T11:20:00Z",
  }
];
