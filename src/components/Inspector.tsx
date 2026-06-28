import type { CanvasElement } from '../types';

interface InspectorProps {
  element: CanvasElement | null;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onRemove: (id: string) => void;
}

export function Inspector({ element, onUpdate, onRemove }: InspectorProps) {
  if (!element) {
    return (
      <aside className="inspector">
        <h2 className="inspector-title">Propiedades</h2>
        <p className="inspector-empty">Selecciona un elemento del lienzo</p>
      </aside>
    );
  }

  return (
    <aside className="inspector">
      <h2 className="inspector-title">Propiedades</h2>

      <label className="field">
        <span>ID</span>
        <input
          value={element.id}
          onChange={e => onUpdate(element.id, { id: e.target.value })}
        />
      </label>

      <label className="field">
        <span>Tipo</span>
        <input value={element.type} disabled />
      </label>

      <label className="field">
        <span>X</span>
        <input
          type="number"
          value={element.x}
          onChange={e => onUpdate(element.id, { x: Number(e.target.value) })}
        />
      </label>

      <label className="field">
        <span>Y</span>
        <input
          type="number"
          value={element.y}
          onChange={e => onUpdate(element.id, { y: Number(e.target.value) })}
        />
      </label>

      <label className="field">
        <span>Ancho</span>
        <input
          type="number"
          value={element.width}
          onChange={e => onUpdate(element.id, { width: Number(e.target.value) })}
        />
      </label>

      <label className="field">
        <span>Alto</span>
        <input
          type="number"
          value={element.height}
          onChange={e => onUpdate(element.id, { height: Number(e.target.value) })}
        />
      </label>

      {(element.type === 'button' || element.type === 'text' || element.type === 'label' || element.type === 'combobox') && (
        <label className="field">
          <span>Texto</span>
          <input
            value={element.text || ''}
            onChange={e => onUpdate(element.id, { text: e.target.value })}
          />
        </label>
      )}

      {element.type === 'input' && (
        <label className="field">
          <span>Placeholder</span>
          <input
            value={element.placeholder || ''}
            onChange={e => onUpdate(element.id, { placeholder: e.target.value })}
          />
        </label>
      )}

      {element.type === 'combobox' && (
        <label className="field">
          <span>Opciones (separadas por coma)</span>
          <input
            value={(element.options || []).join(',')}
            onChange={e => onUpdate(element.id, { options: e.target.value.split(',') })}
          />
        </label>
      )}

      {element.type === 'grid' && (
        <label className="field">
          <span>Columnas (separadas por coma)</span>
          <input
            value={(element.columns || []).join(',')}
            onChange={e => onUpdate(element.id, { columns: e.target.value.split(',') })}
          />
        </label>
      )}

      {element.type === 'label' && (
        <label className="field">
          <span>Peso fuente</span>
          <select
            value={element.fontWeight || '500'}
            onChange={e => onUpdate(element.id, { fontWeight: e.target.value })}
            style={{ padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
          >
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi Bold (600)</option>
            <option value="700">Bold (700)</option>
          </select>
        </label>
      )}

      <label className="field">
        <span>Color texto</span>
        <input
          type="color"
          value={element.color || '#000000'}
          onChange={e => onUpdate(element.id, { color: e.target.value })}
        />
      </label>

      {(element.type !== 'text' && element.type !== 'label') && (
        <label className="field">
          <span>Color fondo</span>
          <input
            type="color"
            value={element.backgroundColor || '#ffffff'}
            onChange={e => onUpdate(element.id, { backgroundColor: e.target.value })}
          />
        </label>
      )}

      <label className="field">
        <span>Tamaño fuente</span>
        <input
          type="number"
          value={element.fontSize || 14}
          onChange={e => onUpdate(element.id, { fontSize: Number(e.target.value) })}
        />
      </label>

      <button className="remove-btn" onClick={() => onRemove(element.id)}>
        Eliminar elemento
      </button>
    </aside>
  );
}
