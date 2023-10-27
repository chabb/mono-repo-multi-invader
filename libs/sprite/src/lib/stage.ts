import {DisplayObject} from "./displayObject";
import {Group} from "./group";

export class Stage extends  DisplayObject {
    currentPosition!: {
        x: number,
        y: number
        rotation: number
    }
}
//A higher level wrapper for the group sprite
export function group(stage?: Stage, ...spritesToGroup: DisplayObject[]) {

    if (!stage) {
        stage = (window as any).stage; // FIXME
        if (!stage) {
            throw new Error ('no stage defined');
        }
    }
    //Create the sprite
    const sprite = new Group(...spritesToGroup);
    //Add the sprite to the stage
    stage.addChild(sprite);
    //Return the sprite to the main program
    return sprite;
}
