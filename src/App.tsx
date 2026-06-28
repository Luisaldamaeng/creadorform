import './App.css';
import { useEffect, useState } from 'react';
import { useStore } from './store';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { Inspector } from './components/Inspector';
import { listProjects, type ProjectSummary } from './api';
import { exportHTML, exportReact } from './export';

function App() {
  const {
    elements, selectedId, projectName, dirty, saving,
    addElement, updateElement, removeElement, selectElement,
    newProject, save, load, setProjectName,
  } = useStore();

  const [projectList, setProjectList] = useState<ProjectSummary[]>([]);
  const [showProjects, setShowProjects] = useState(false);

  const selectedElement = selectedId ? elements.find(el => el.id === selectedId) ?? null : null;

  const refreshList = async () => {
    try {
      const list = await listProjects();
      setProjectList(list);
    } catch {}
  };

  useEffect(() => { refreshList(); }, []);

  return (
    <div className="app-container">
      <div className="toolbar">
        <div className="toolbar-left">
          <span className="toolbar-brand">creadorform</span>
          <input
            className="project-name"
            value={projectName}
            onChange={e => { setProjectName(e.target.value); }}
          />
          {dirty && <span className="badge-dirty">sin guardar</span>}
        </div>
        <div className="toolbar-right">
          <button className="toolbar-btn" onClick={newProject}>Nuevo</button>
          <button className="toolbar-btn" onClick={save} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          <button className="toolbar-btn" onClick={async () => { await refreshList(); setShowProjects(!showProjects); }}>Abrir</button>
          <button className="toolbar-btn" onClick={() => { const code = exportHTML(elements); const blob = new Blob([code], {type:'text/html'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'form.html'; a.click(); URL.revokeObjectURL(url); }}>Exportar HTML/CSS</button>
          <button className="toolbar-btn" onClick={() => { const code = exportReact(elements); const blob = new Blob([code], {type:'text/plain'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'FormComponent.tsx'; a.click(); URL.revokeObjectURL(url); }}>Exportar React</button>
        </div>
      </div>

      {showProjects && (
        <div className="projects-overlay" onClick={() => setShowProjects(false)}>
          <div className="projects-panel" onClick={e => e.stopPropagation()}>
            <h3>Proyectos</h3>
            {projectList.length === 0 ? (
              <p className="projects-empty">No hay proyectos guardados</p>
            ) : (
              <ul className="projects-list">
                {projectList.map(p => (
                  <li key={p.id} className="projects-item" onClick={async () => { await load(p.id); setShowProjects(false); }}>
                    <span>{p.name}</span>
                    <span className="projects-date">{new Date(p.updatedAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="main-area">
        <Sidebar onAddElement={addElement} />
        <Canvas
          elements={elements}
          selectedId={selectedId}
          onSelect={selectElement}
          onAddElement={addElement}
          onUpdate={updateElement}
        />
        <Inspector
          element={selectedElement}
          onUpdate={updateElement}
          onRemove={removeElement}
        />
      </div>
    </div>
  );
}

export default App;
