const API = 'http://localhost:3001/api';

export interface ProjectSummary {
  id: string;
  name: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  elements: unknown[];
  createdAt: string;
  updatedAt: string;
}

export async function listProjects(): Promise<ProjectSummary[]> {
  const res = await fetch(`${API}/projects`);
  return res.json();
}

export async function loadProject(id: string): Promise<Project> {
  const res = await fetch(`${API}/projects/${id}`);
  if (!res.ok) throw new Error('Project not found');
  return res.json();
}

export async function createProject(name?: string): Promise<Project> {
  const res = await fetch(`${API}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, elements: [] }),
  });
  return res.json();
}

export async function saveProject(id: string, name: string, elements: unknown[]): Promise<Project> {
  const res = await fetch(`${API}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, elements }),
  });
  return res.json();
}
