import { Project } from "@/types";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Projeto Infraestrutura 2024",
    description:
      "Projeto de expansão da infraestrutura tecnológica para o ano de 2024, incluindo modernização de servidores e implementação de nova rede.",
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
      "Sistema de comunicação corporativa com chat, videoconferência, compartilhamento de arquivos e calendário.",
    totalValue: 810000.0,
    units: [{ id: "u23", name: "UFAL", rciPercentage: 20.6 }],
    status: "draft",
    bankStatements: [],
    createdAt: "2024-06-01T15:20:00Z",
    updatedAt: "2024-06-01T15:20:00Z",
  },
];
