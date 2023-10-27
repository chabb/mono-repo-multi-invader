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
  pivotX = 1;
  pivotY = 1;
  vx = 0;
  vy = 0;
  children: DisplayObject[] = [];
  parent?: DisplayObject
  shadow = false;
  shadowColor = 'rgba(100, 0100, 100, 0.5)';
  shadowOffsetX = 0.3;
  shadowOffsetY = 0.3;
  blendMode = undefined;
  loop = true;
  playing = true;

  private _layer!: number; // FIXME, check if we can remove the !
  private _draggable = undefined;
  private _currentFrame = 0;
  private _interactive = false;
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


export class Circle extends DisplayObject {

  mask = false;
  constructor(
    public diameter = 32,
    public fillStyle = 'gray',
    public strokeStyle = 'black',
    public lineWidth = 0,
    x = 0,
    y = 0
  ) {
    super();
    this.x = x;
    this.y = y;
    this.circular = true;
    Object.assign(this, {diameter, fillStyle, strokeStyle, lineWidth, x, y});
  }
  render(ctx: CanvasRenderingContext2D) {


    // we could have a prepare context method
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    const radius = (this as any).radius; // FIXME
    ctx.arc(radius + (-this.diameter * this.pivotX),
      radius + (-this.diameter * this.pivotY),
      radius,
      0, 2 * Math.PI,
      false)

    if (this.strokeStyle !== 'none')  ctx.stroke();
    if (this.fillStyle !== 'none') ctx.fill();
    if (this.mask && this.mask === true) ctx.clip();
  }
}

export class Line extends DisplayObject {

  lineJoin: CanvasLineJoin = 'round';
  constructor(
        public strokeStyle = 'none',
        public lineWidth = 0,
        public ax = 0,
        public ay = 0,
        public bx = 32,
        public by = 32
    ) {
        super();
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.lineJoin = this.lineJoin;
        ctx.beginPath();
        ctx.moveTo(this.ax, this.ay);
        ctx.lineTo(this.bx, this.by);
        if (this.strokeStyle !== 'none') ctx.stroke();
        if (this.strokeStyle !== 'none') ctx.stroke();
    }
}

export class Rectangle extends DisplayObject {

  strokeStyle: string;
  fillStyle: string;
  lineWidth: number;
  mask: boolean;
  constructor(width = 32, height = 32, strokeStyle = 'none', fillStyle = 'gray', lineWidth = 0, x = 0, y = 0) {
        super();
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.strokeStyle = 'none';
        this.fillStyle = 'gray';
        this.lineWidth = 0;
        Object.assign(this, {width, height, fillStyle, strokeStyle, lineWidth, x, y});
        this.mask = false;
    }
    render(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();
        // notice how we render above the pivot point
        ctx.rect(-this.width * this.pivotX, -this.height * this.pivotY, this.width, this.height);
        if (this.strokeStyle !== 'none')  ctx.stroke();
        if (this.fillStyle !== 'none') ctx.fill();
        if (this.mask && this.mask === true) ctx.clip();
    }
}

// a group must be able to compute its height/width on the fly
export class Group extends DisplayObject {

  private _newWidth!: number;
  private _newHeight!: number;

  constructor(...spritesToGroup: DisplayObject[]) {
    super();
    spritesToGroup.forEach(sprite => this.addChild(sprite));
  }

  override addChild(sprite: DisplayObject): void {
    if (sprite.parent) {
      sprite.parent.removeChild(sprite);
    }
    sprite.parent = this;
    this.children.push(sprite);
    this.calculateSize();
  }
  override removeChild(sprite: DisplayObject): void {

    if(sprite.parent === this) {
      this.children.splice(this.children.indexOf(sprite), 1);
      this.calculateSize();
    } else {
      throw new Error(`${sprite} not a child of ${this}`);
    }
  }

  calculateSize() {
    if (this.children.length > 0) {
      this._newHeight = 0;
      this._newWidth = 0;
      this.children.forEach(child => {
        if (child.x + child.width > this._newWidth) {
          this._newWidth = child.x + child.width;
        }
        if (child.y + child.height > this._newHeight) {
          this._newHeight = child.y + child.height;
        }
      });
    }

    this.width = this._newWidth;
    this.height = this._newHeight;
  }
}
