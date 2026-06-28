import { useCallback } from 'react';
import type { CanvasElement as CanvasElementType, ComponentType } from '../types';
import { CanvasElement as CanvasElementRenderer } from './CanvasElement';

interface CanvasProps {
  elements: CanvasElementType[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAddElement: (type: ComponentType, x: number, y: number, parentId?: string) => void;
  onUpdate: (id: string, updates: Partial<CanvasElementType>) => void;
}

export function Canvas({ elements, selectedId, onSelect, onAddElement, onUpdate }: CanvasProps) {
  const handleMoveStop = useCallback((id: string, x: number, y: number) => {
    const element = elements.find(el => el.id === id);
    if (!element) return;
    
    let parentId = element.parentId;
    if (element.type !== 'container') {
      const targetContainer = elements.slice().reverse().find(el => 
        el.type === 'container' && el.id !== id &&
        x >= el.x && x <= el.x + el.width &&
        y >= el.y && y <= el.y + el.height
      );
      parentId = targetContainer?.id;
    }
    
    onUpdate(id, { x, y, parentId });
  }, [elements, onUpdate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType') as ComponentType;
    if (!type) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const elementX = Math.max(0, x - 80);
    const elementY = Math.max(0, y - 20);

    const targetContainer = elements.slice().reverse().find(el => 
      el.type === 'container' && 
      elementX >= el.x && elementX <= el.x + el.width &&
      elementY >= el.y && elementY <= el.y + el.height
    );

    onAddElement(type, elementX, elementY, targetContainer?.id);
  }, [onAddElement, elements]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  return (
    <div className="canvas-area">
      <div
        className="canvas-drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onSelect(null);
          }
        }}
      >
        {[...elements].sort((a, b) => {
          if (a.type === 'container' && b.type !== 'container') return -1;
          if (a.type !== 'container' && b.type === 'container') return 1;
          return 0;
        }).map(el => (
          <CanvasElementRenderer
            key={el.id}
            element={el}
            isSelected={selectedId === el.id}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onMoveStop={handleMoveStop}
          />
        ))}
      </div>
    </div>
  );
}
