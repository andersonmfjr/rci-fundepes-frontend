import { Project, ProjectFormData, ProjectStatus } from "@/types";
import { mockProjects } from "./mockData";
import { generateId } from "./utils";

// Reference to the mutable mock data
let projects = mockProjects;

export const projectsService = {
  getAll: async (): Promise<Project[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...projects].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getById: async (id: string): Promise<Project | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const project = projects.find((p) => p.id === id);
    return project ? { ...project } : null;
  },

  create: async (data: ProjectFormData): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newProject: Project = {
      id: generateId(),
      name: data.name,
      description: data.description,
      rciPercentage: data.rciPercentage,
      contractLink: data.contractLink,
      status: "draft",
      bankStatements: data.bankStatements || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.push(newProject);
    console.log("Projeto criado:", newProject);
    return { ...newProject };
  },

  update: async (
    id: string,
    data: Partial<ProjectFormData>
  ): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Projeto não encontrado");

    const updatedProject = {
      ...projects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updatedProject;
    console.log("Projeto atualizado:", updatedProject);
    return { ...updatedProject };
  },

  updateStatus: async (id: string, status: ProjectStatus): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Projeto não encontrado");

    const updatedProject = {
      ...projects[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updatedProject;
    console.log("Status do projeto atualizado:", { id, status });
    return { ...updatedProject };
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const initialLength = projects.length;
    projects = projects.filter((p) => p.id !== id);

    if (projects.length === initialLength) {
      throw new Error("Projeto não encontrado");
    }

    console.log("Projeto removido:", id);
  },

  // New method to simulate status progression
  progressStatus: async (id: string): Promise<Project> => {
    const statusFlow: Record<ProjectStatus, ProjectStatus> = {
      draft: "pending",
      pending: "validated",
      validated: "completed",
      completed: "completed", // Already at final status
    };

    const project = await projectsService.getById(id);
    if (!project) throw new Error("Projeto não encontrado");

    const nextStatus = statusFlow[project.status];
    return await projectsService.updateStatus(id, nextStatus);
  },
};
