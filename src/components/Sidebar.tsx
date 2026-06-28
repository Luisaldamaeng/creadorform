import type { ComponentType } from '../types';

const componentList: { type: ComponentType; label: string; icon: string }[] = [
  { type: 'button', label: 'Botón', icon: '⊞' },
  { type: 'text', label: 'Texto', icon: 'T' },
  { type: 'input', label: 'Input', icon: '⌨' },
  { type: 'combobox', label: 'Combo Box', icon: '▼' },
  { type: 'label', label: 'Label', icon: 'Aa' },
  { type: 'grid', label: 'Planilla', icon: '▦' },
  { type: 'container', label: 'Contenedor', icon: '▢' },
];

interface SidebarProps {
  onAddElement: (type: ComponentType, x: number, y: number, parentId?: string) => void;
}

export function Sidebar({ onAddElement }: SidebarProps) {
  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Componentes</h2>
      <p className="sidebar-hint">Arrastra al lienzo</p>
      <div className="component-list">
        {componentList.map(c => (
          <div
            key={c.type}
            className="component-item"
            draggable
            onDragStart={e => handleDragStart(e, c.type)}
            onClick={() => onAddElement(c.type, 50, 50)}
          >
            <span className="component-icon">{c.icon}</span>
            <span className="component-label">{c.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
