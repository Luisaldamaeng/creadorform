import { Rnd } from 'react-rnd';
import type { CanvasElement as CanvasElementType } from '../types';

interface Props {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CanvasElementType>) => void;
  onMoveStop: (id: string, x: number, y: number) => void;
}

export function CanvasElement({ element, isSelected, onSelect, onUpdate, onMoveStop }: Props) {
  const handleStyle: React.CSSProperties = {
    width: 10,
    height: 10,
    background: '#3b82f6',
    border: '2px solid #fff',
    borderRadius: 2,
  };

  const renderContent = () => {
    const base: React.CSSProperties = {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: element.type === 'button' ? 6 : 4,
      boxSizing: 'border-box',
      fontSize: element.fontSize,
    };

    switch (element.type) {
      case 'button':
        return (
          <button
            style={{
              ...base,
              backgroundColor: element.backgroundColor || '#3b82f6',
              color: element.color || '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {element.text || 'Botón'}
          </button>
        );
      case 'text':
        return (
          <div
            style={{
              ...base,
              color: element.color || '#1f2937',
              justifyContent: 'flex-start',
              padding: '0 4px',
            }}
          >
            {element.text || 'Texto'}
          </div>
        );
      case 'input':
        return (
          <input
            style={{
              ...base,
              backgroundColor: element.backgroundColor || '#f9fafb',
              border: '1px solid #d1d5db',
              padding: '0 8px',
              cursor: 'default',
            }}
            placeholder={element.placeholder || 'Escribe...'}
            readOnly
          />
        );
      case 'label':
        return (
          <div
            style={{
              ...base,
              color: element.color || '#1f2937',
              fontWeight: (element.fontWeight as React.CSSProperties['fontWeight']) || '500',
              justifyContent: 'flex-start',
              padding: '0 4px',
            }}
          >
            {element.text || 'Etiqueta'}
          </div>
        );
      case 'combobox':
        return (
          <div
            style={{
              ...base,
              backgroundColor: element.backgroundColor || '#fff',
              border: '1px solid #d1d5db',
              padding: '0 8px',
              cursor: 'default',
              justifyContent: 'space-between',
              borderRadius: 4,
            }}
          >
            <span style={{ color: element.color || '#1f2937', fontSize: element.fontSize || 14 }}>
              {element.text || 'Seleccionar'}
            </span>
            <span style={{ color: '#94a3b8', fontSize: 10 }}>▼</span>
          </div>
        );
      case 'container':
        return (
          <div
            style={{
              ...base,
              backgroundColor: element.backgroundColor || '#e5e7eb',
            }}
          />
        );
      case 'grid':
        const columns = element.columns && element.columns.length > 0 ? element.columns : ['Columna 1', 'Columna 2'];
        return (
          <div
            style={{
              ...base,
              backgroundColor: element.backgroundColor || '#fff',
              border: '1px solid #d1d5db',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      style={{
                        borderBottom: '1px solid #d1d5db',
                        borderRight: i < columns.length - 1 ? '1px solid #d1d5db' : 'none',
                        padding: '8px',
                        textAlign: 'left',
                        fontSize: element.fontSize || 13,
                        color: element.color || '#1f2937',
                        backgroundColor: '#f3f4f6',
                        fontWeight: '600'
                      }}
                    >
                      {col.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {columns.map((_, i) => (
                    <td
                      key={i}
                      style={{
                        padding: '8px',
                        borderRight: i < columns.length - 1 ? '1px solid #d1d5db' : 'none',
                        height: '24px' // placeholder row
                      }}
                    ></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Rnd
      position={{ x: element.x, y: element.y }}
      size={{ width: element.width, height: element.height }}
      onDragStart={() => onSelect(element.id)}
      onDrag={(_e, d) => {
        onUpdate(element.id, { x: d.x, y: d.y });
      }}
      onDragStop={(_e, d) => {
        onMoveStop(element.id, d.x, d.y);
      }}
      onResizeStop={(_e, _dir, ref, _delta, position) => {
        onUpdate(element.id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          x: position.x,
          y: position.y,
        });
      }}
      enableResizing={isSelected}
      resizeHandleStyles={{
        top: handleStyle,
        right: handleStyle,
        bottom: handleStyle,
        left: handleStyle,
        topRight: handleStyle,
        bottomRight: handleStyle,
        bottomLeft: handleStyle,
        topLeft: handleStyle,
      }}
      bounds="parent"
      onClick={() => onSelect(element.id)}
    >
      {renderContent()}
    </Rnd>
  );
}
