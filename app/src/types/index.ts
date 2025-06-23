export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  refreshToken: string;
}

export type ProjectStatus = "draft" | "pending" | "validated" | "completed";

export interface Unit {
  id: string;
  name: string;
  rciPercentage: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  totalValue: number; // Valor total em reais
  units: Unit[]; // Unidades com seus respectivos percentuais RCI
  status: ProjectStatus;
  contractFile?: File | null;
  contractLink?: string;
  bankStatements: File[];
  createdAt: string;
  updatedAt: string;
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
