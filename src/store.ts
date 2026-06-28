import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { CanvasElement, ComponentType } from './types';
import { createProject, saveProject, loadProject } from './api';

const defaultElements: CanvasElement[] = [
  {
    id: uuidv4(),
    type: 'button',
    x: 120,
    y: 80,
    width: 120,
    height: 40,
    text: 'Enviar',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    fontSize: 14,
  },
  {
    id: uuidv4(),
    type: 'text',
    x: 50,
    y: 20,
    width: 200,
    height: 30,
    text: 'Hola Mundo',
    color: '#1f2937',
    fontSize: 16,
  },
  {
    id: uuidv4(),
    type: 'input',
    x: 120,
    y: 140,
    width: 200,
    height: 36,
    placeholder: 'Escribe algo...',
    backgroundColor: '#f9fafb',
  },
];

export function useStore() {
  const [elements, setElements] = useState<CanvasElement[]>(defaultElements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Sin título');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const addElement = useCallback((type: ComponentType, x: number, y: number, parentId?: string) => {
    const base: Omit<CanvasElement, 'id' | 'type' | 'x' | 'y'> = {
      width: 160,
      height: 40,
    };

    switch (type) {
      case 'button':
        Object.assign(base, { text: 'Botón', color: '#ffffff', backgroundColor: '#3b82f6', fontSize: 14 });
        break;
      case 'text':
        Object.assign(base, { text: 'Texto', color: '#1f2937', fontSize: 16, width: 200, height: 28 });
        break;
      case 'input':
        Object.assign(base, { placeholder: 'Escribe...', backgroundColor: '#f9fafb', width: 200, height: 36 });
        break;
      case 'label':
        Object.assign(base, { text: 'Etiqueta', color: '#1f2937', fontSize: 14, fontWeight: '500', width: 120, height: 24 });
        break;
      case 'combobox':
        Object.assign(base, { text: 'Seleccionar', color: '#1f2937', backgroundColor: '#ffffff', width: 200, height: 36, options: ['Opción 1', 'Opción 2', 'Opción 3'] });
        break;
      case 'container':
        Object.assign(base, { backgroundColor: '#e5e7eb', width: 300, height: 200 });
        break;
    }

    const newEl: CanvasElement = { id: uuidv4(), type, x, y, parentId, ...base } as CanvasElement;
    setElements(prev => [...prev, newEl]);
    setDirty(true);
    return newEl.id;
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => {
      const element = prev.find(el => el.id === id);
      if (!element) return prev;
      
      const dx = updates.x !== undefined ? updates.x - element.x : 0;
      const dy = updates.y !== undefined ? updates.y - element.y : 0;
      
      return prev.map(el => {
        if (el.id === id) {
          return { ...el, ...updates };
        }
        if (el.parentId === id && (dx !== 0 || dy !== 0)) {
          return { ...el, x: el.x + dx, y: el.y + dy };
        }
        return el;
      });
    });
    setDirty(true);
  }, []);

  const removeElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id && el.parentId !== id));
    setSelectedId(prev => prev === id ? null : prev);
    setDirty(true);
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const newProject = useCallback(async () => {
    try {
      const project = await createProject();
      setProjectId(project.id);
      setProjectName(project.name);
      setElements([]);
      setSelectedId(null);
      setDirty(false);
    } catch {
      alert('Error al crear proyecto');
    }
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      if (projectId) {
        await saveProject(projectId, projectName, elements);
      } else {
        const project = await createProject(projectName);
        setProjectId(project.id);
        await saveProject(project.id, projectName, elements);
      }
      setDirty(false);
    } catch {
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  }, [projectId, projectName, elements]);

  const load = useCallback(async (id: string) => {
    try {
      const project = await loadProject(id);
      setProjectId(project.id);
      setProjectName(project.name);
      setElements(project.elements as CanvasElement[]);
      setSelectedId(null);
      setDirty(false);
    } catch {
      alert('Error al cargar proyecto');
    }
  }, []);

  return {
    elements,
    selectedId,
    projectId,
    projectName,
    dirty,
    saving,
    addElement,
    updateElement,
    removeElement,
    selectElement,
    newProject,
    save,
    load,
    setProjectName,
  };
}
