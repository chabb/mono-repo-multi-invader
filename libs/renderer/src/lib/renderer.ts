import {DisplayObject, Stage, Renderable} from "@chabb/sprite";


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


export function render(canvas: CanvasWithContext, stage: Stage) {
  const ctx = canvas.ctx;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stage.children.forEach((sprite: DisplayObject) => {

    if (stage.currentPosition) {
      ctx.save();
      ctx.translate(-stage.currentPosition.x, -stage.currentPosition.y);
      ctx.rotate(stage.currentPosition.rotation);
    }
    displaySprite(sprite);
    ctx.restore();
  });


  function displaySprite(sprite: DisplayObject) {

    // now we need to update the viewport

    let dx = 0, dy = 0;
    if (stage.currentPosition) {
      dx = stage.currentPosition.x;
      dy = stage.currentPosition.y;
    }

    if (sprite.visible && sprite.gx - dx < canvas.width
        && sprite.gx + sprite.width - dx >= -sprite.width
        && sprite.gy - dy < canvas.height + sprite.height
        && sprite.gy + sprite.height - dy >= -sprite.height
    ) {
      ctx.save();

      // pivot is the pivot point of the sprite, expressed in percent
      ctx.translate(sprite.x + (sprite.width * sprite.pivotX),
          sprite.y + (sprite.height * sprite.pivotY));
      ctx.rotate(sprite.rotation);
      ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
      ctx.scale(sprite.scaleX, sprite.scaleY);
      if (sprite.shadow) {
        //TODO( shadow )
      }
      if (sprite.blendMode) {
        ctx.globalCompositeOperation = sprite.blendMode;
      }
      if ((sprite as Renderable).render) {
        // FIXME maybe use guard, I thought TS would be smart enough to know that render exists
        (sprite as Renderable).render(ctx);
      }
      if (sprite.children && sprite.children.length > 0) {
        // reset context to top of parent
        ctx.translate(-sprite.width * sprite.pivotX, -sprite.height * sprite.pivotY);
        sprite.children.forEach(child => {
          displaySprite(child);
        })
      }
      ctx.restore();
    }
  }
}


