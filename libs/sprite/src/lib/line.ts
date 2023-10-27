import { DisplayObject } from './displayObject';

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
