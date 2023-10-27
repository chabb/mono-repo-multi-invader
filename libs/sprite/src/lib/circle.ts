import { DisplayObject } from './displayObject';

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
