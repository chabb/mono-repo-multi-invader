interface CanvasWithContext extends HTMLCanvasElement {
  ctx: CanvasRenderingContext2D
}

export function makeCanvas(width = 256, heigth = 256, border = '1px dashed black', backgroundColor = 'white'): CanvasWithContext {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.width = width;
  canvas.height = heigth;
  canvas.style.border = border;
  canvas.style.backgroundColor = backgroundColor;
  document.body.appendChild(canvas);
  // not a good practice;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const canvasWithContext: CanvasWithContext = Object.assign(canvas, { ctx });
    return canvasWithContext;
  } else {
    throw new Error('unable to get canvas context');
  }
}
