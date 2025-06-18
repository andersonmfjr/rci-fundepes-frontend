import { mockProjects } from "./mockData";

export const generateId = (): string => {
  return (Math.max(...mockProjects.map((p) => parseInt(p.id))) + 1).toString();
};
