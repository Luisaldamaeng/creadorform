export type ComponentType = 'button' | 'text' | 'input' | 'container' | 'combobox' | 'label' | 'grid';

export interface CanvasElement {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  backgroundColor?: string;
  placeholder?: string;
  options?: string[];
  columns?: string[];
  parentId?: string;
}
