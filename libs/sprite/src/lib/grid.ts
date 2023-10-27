import {group} from "./stage";
import { DisplayObject } from './displayObject';

export function grid(
    columns = 0, rows = 0, cellWidth = 32, cellHeight = 32,
    centerCell = false, xOffset = 0, yOffset = 0,
    makeSprite: () => DisplayObject,
    extra: (sprite: DisplayObject) => void
){

    //Create an empty group called `container`. This `container`
    //group is what the function returns back to the main program.
    //All the sprites in the grid cells will be added
    //as children to this container
    const container = group();

    //The `create` method plots the grid

    const createGrid = () => {

        //Figure out the number of cells in the grid
        const length = columns * rows;

        //Create a sprite for each cell
        for(let i = 0; i < length; i++) {

            //Figure out the sprite's x/y placement in the grid
            const x = (i % columns) * cellWidth,
                y = Math.floor(i / columns) * cellHeight;

            //Use the `makeSprite` function supplied in the constructor
            //to make a sprite for the grid cell
            const sprite = makeSprite();

            //Add the sprite to the `container`
            container.addChild(sprite);

            //Should the sprite be centered in the cell?
            //No, it shouldn't be centered
            if (!centerCell) {
                sprite.x = x + xOffset;
                sprite.y = y + yOffset;
            }
            //Yes, it should be centered
            else {
                sprite.x
                    = x + (cellWidth / 2)
                    - sprite.halfWidth + xOffset;
                sprite.y
                    = y + (cellHeight / 2)
                    - sprite.halfHeight + yOffset;
            }

            //Run any optional extra code. This calls the
            //`extra` function supplied by the constructor
            if (extra) {
                extra(sprite);
            }
        }
    };

    //Run the `createGrid` method
    createGrid();

    //Return the `container` group back to the main program
    return container;
}
