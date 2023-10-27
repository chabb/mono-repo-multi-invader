import {DisplayObject} from "@chabb/sprite";

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
