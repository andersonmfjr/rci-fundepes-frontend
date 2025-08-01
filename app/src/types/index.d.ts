interface User {
    id: string;
    name: string;
    email: string;
    token: string;
    refresh_token: string;
}

type ContractStatus = "draft" | "pending" | "validated" | "completed";

interface Alert {
    tipo: {
        titulo: string;
        descricao: string;
    };
    mensagem: string;
}

interface ContractUnit {
    id: string;
    nome: string;
    percentual_rci: number;
}

interface ContractListItem {
    id: number;
    nome: string;
    descricao: string;
    valor_total: number;
    porcentagem_rci: string;
    data_criacao: string;
    data_atualizacao: string;
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
    id: number;
    id_tipo_financiador: number;
    nome: string;
    tipo?: string;
    cnpj?: string;
    tipo_financiador: FinancierType;
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
    id_unidade_pai?: number;
    id_tipo_unidade: number;
    nome: string;
    sigla: string;
    cnpj?: string;
    unidade_pai?: AcademicUnit;
    tipo_unidade: UnitType;
    unidades_filhas?: AcademicUnit[];
}

interface BankAccount {
    id: number;
    id_unidade: number;
    id_banco: number;
    agencia: string;
    numero: string;
    unidade: AcademicUnit;
    banco: Bank;
}

interface RciDistribution {
    id: number;
    id_unidade: number;
    id_contrato: number;
    percentual: number;
    valor_base_calculo: number;
    validado: boolean;
    data_criacao: string;
    unidade: AcademicUnit;
}

interface Transfer {
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
}

interface ContractAddendum {
    id: number;
    id_contrato: number;
    data: string;
    novo_total: number;
    validado: boolean;
    descricao?: string;
    data_criacao: string;
}

interface ContractDetail {
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
    transferencias: Transfer[];
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


type FetchResult<T> =
    | {
        error: true;
        message: string | null;
        response: Response | null;
        data: null;
    }
    | {
        error: false;
        data: T;
        response: Response;
        message: string | null;
    };

interface RequestInit extends RequestInit {
    withoutAuth?: boolean;
}
