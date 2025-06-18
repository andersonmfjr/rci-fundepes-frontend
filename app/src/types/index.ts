export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  refreshToken: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  rciPercentage: number;
  status: ProjectStatus;
  contractFile?: File | null;
  contractLink?: string;
  bankStatements: File[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = "draft" | "pending" | "validated" | "completed";

export interface ProjectFormData {
  name: string;
  description: string;
  rciPercentage: number;
  contractFile?: File | null;
  contractLink?: string;
  bankStatements: File[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
