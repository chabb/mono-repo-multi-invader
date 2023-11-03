export class DisplayObject {

  x = 0;
  y = 0;
  width = 0;
  height = 0;
  rotation = 0;
  alpha = 1;
  visible = true;
  scaleX = 1;
  scaleY = 1;
  pivotX = 0.5;
  pivotY = 0.5;
  vx = 0;
  vy = 0;
  children: DisplayObject[] = [];
  parent!: DisplayObject // ultimate parent is the scene
  shadow = false;
  shadowColor = 'rgba(100, 0100, 100, 0.5)';
  shadowOffsetX = 0.3;
  shadowOffsetY = 0.3;
  blendMode = undefined;
  loop = true;
  playing = true;

  private _layer!: number; // FIXME, check if we can remove the !
  // private _draggable = false; FIXME MAKE SURE IT'S NOT USED ANYMORE
  private _currentFrame = 0;
  // private _interactive = false;
  private _circular = false;

  get circular() {
    return this._circular;
  }

  set circular(value) {
    if (value === true && this._circular === false) {
      Object.defineProperties(this, {
        diameter: {
          get() {
            return this.width;
          },
          set(value) {
            this.width = value;
            this.height = value;
          },
          enumerable: true, configurable: true
        },
        radius: {
          get() {
            return this.halfWidth
          },
          set(value) {
            this.width = value * 2;
            this.height = value * 2;
          }, enumerable: true, configurable: true
        }
      });
      this._circular = true;
    }

    //FIXME, check if we can have a way to use mixins
    if (value === false && this._circular === true) {
      delete (this as any).diameter;
      delete (this as any).radius;
      this._circular = false;
    }
  }

  putCenter(b: DisplayObject, xOffset = 0, yOffset = 0) {
    b.x = (this.x + this.halfWidth - b.halfWidth) + xOffset;
    b.y = (this.y + this.halfHeight - b.halfHeight) + yOffset;
  }

  putTop(b: DisplayObject, xOffset = 0, yOffset = 0) {
    b.x = (this.x + this.halfWidth - b.halfWidth) + xOffset;
    b.y = (this.y - b.height) + yOffset;
  }
  putLeft(b: DisplayObject, xOffset = 0, yOffset = 0) {
    b.x = (this.x - b.width) + xOffset;
    b.y = (this.y + this.halfHeight - b.halfHeight) + yOffset;
  }

  putBottom(b: DisplayObject, xOffset = 0, yOffset = 0) {
    b.x = (this.x + this.halfWidth - b.halfWidth) + xOffset;
    b.y = (this.y + b.height) + yOffset;

  }

  get gx(): number {
    if (this.parent) {
      return this.x + this.parent.gx;
    } else {
      return this.x;
    }
  }
  get gy(): number {
    if (this.parent) {
      return this.y + this.parent.gy;
    } else {
      return this.y;
    }
  }

  get layer() {
    return this._layer;
  }
  set layer(value) {
    this._layer = value;
    if (this.parent) {
      // sort according to layer order
      this.parent.children.sort((a, b) => a.layer - b.layer);
    }
  }
  addChild(sprite: DisplayObject) {
    if (sprite.parent) {
      sprite.parent.removeChild(sprite)
    }
    sprite.parent = this;
    this.children.push(sprite)
  }

  removeChild(sprite: DisplayObject) {
    if (sprite.parent === this) {
      this.children.splice(this.children.indexOf(sprite), 1);

    } else {
      throw new Error(sprite + 'is not a child of ' + this);
    }
  }

  get halfWidth() {
    return this.width / 2;
  }

  get halfHeight() {
    return this.height / 2;
  }

  get centerX() {
    return this.x + this.halfWidth;
  }

  get centerY() {
    return this.y + this.halfHeight;
  }

  get currentFrame() {
    return this._currentFrame;
  }

  get localBounds() {
    return {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height
    };
  }
  get globalBounds() {
    return {
      x: this.gx,
      y: this.gy,
      width: this.gx + this.width,
      height: this.gy + this.height
    };
  }

  // a few things are missing
}

