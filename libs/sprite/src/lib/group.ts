import { DisplayObject } from './displayObject';
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


