import type { CanvasElement as CanvasElementType } from './types';

/**
 * Export the current canvas elements to a simple HTML document.
 * Uses absolute positioning to preserve layout.
 */
export function exportHTML(elements: CanvasElementType[]): string {
  const body = elements
    .map((el) => {
      const style = `position:absolute; left:${el.x}px; top:${el.y}px; width:${el.width}px; height:${el.height}px;`;
      switch (el.type) {
        case 'button':
          return `<button style="${style}">${el.text || 'Botón'}</button>`;
        case 'input':
          return `<input placeholder="${el.placeholder || ''}" style="${style}" />`;
        case 'label':
          return `<span style="${style}">${el.text || ''}</span>`;
        case 'container':
          // Container is rendered as a div; its children are also rendered separately.
          return `<div style="${style}; border:1px dashed #aaa;"></div>`;
        default:
          return `<div style="${style}"></div>`;
      }
    })
    .join('\n');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Exportado</title></head><body style="position:relative; min-height:100vh;">${body}</body></html>`;
}

/**
 * Export the canvas elements to a React functional component.
 * The component renders elements with inline absolute positioning.
 */
export function exportReact(elements: CanvasElementType[]): string {
  const imports = `import React from 'react';`;
  const componentHeader = `export const FormComponent: React.FC = () => {`;
  const componentBody = `  return (\n    <div style={{ position: 'relative', minHeight: '100vh' }}>\n${elements
    .map((el) => {
      const style = `{ position: 'absolute', left: ${el.x}, top: ${el.y}, width: ${el.width}, height: ${el.height} }`;
      switch (el.type) {
        case 'button':
          return `      <button style={${style}}>${el.text || 'Botón'}</button>`;
        case 'input':
          return `      <input placeholder="${el.placeholder || ''}" style={${style}} />`;
        case 'label':
          return `      <span style={${style}}>${el.text || ''}</span>`;
        case 'container':
          return `      <div style={${style}} className="container"></div>`;
        default:
          return `      <div style={${style}}></div>`;
      }
    })
    .join('\n')}
    </div>\n  );`;
  const componentFooter = `};`;
  return `${imports}\n\n${componentHeader}\n${componentBody}\n${componentFooter}`;
}
