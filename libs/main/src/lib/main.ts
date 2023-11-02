import {Circle, DisplayObject, Rectangle, Group, Line, Stage, Renderable, grid} from '@chabb/sprite';
import {shoot} from "@chabb/utility";
import {hit} from "@chabb/collision";
import {Key, keyboard} from "@chabb/keyboard";
import {particleEffect, particles} from "@chabb/particle";
import {CanvasWithContext, makeCanvas, render} from "@chabb/renderer";
import {Socket} from "socket.io";
import {State, TankDTO} from "@chabb/shared";


class Tank extends Group {

  id = ''; // FIXME id should be known
  ax = 0.1;
  ay = 0.1;
  friction = 0.96;
  speed = 0;
  debug = 'tank';
  rotationSpeed = 0;
  moveForward = false;
  bulletColor = '';
  override children!: [Rectangle, Line];

  constructor(currentPlayer = true, public color: string = 'gray') {
    const box = new Rectangle(32, 32, color, color);
    const turret = new Line('red', 4, 0, 0, 32, 0);
    turret.x = 16;
    turret.y = 16;
    super(box, turret);
    this.vy = 0;
    this.vx = 0;
    if (currentPlayer) {
      playerBox = box;
    }
  }
}

class GunTurret extends Group {
  constructor(x: number, y: number, public rotationSpeed: number, public firingRate: number) {
    const box = new Rectangle(32, 32, 'gray', 'black');
    const turret = new Line('red', 4, 0, 0, 32, 0);
    super(box, turret);
    turret.x = 16;
    turret.y = 16;
    this.x = x;
    this.y = y;
    this.rotation = Math.random() * Math.PI;
  }
}


let stage: Stage, canvas: CanvasWithContext;
let playerBox: { width: number, height: number };
const tanksById: { [id: string]: Tank } = {};



function makeGunTurret({x, y, rotationSpeed, firingRate}: { x: number, y: number, rotationSpeed: number, firingRate: number }) {
    const gunTurret = new GunTurret(x, y, rotationSpeed, firingRate)
    stage.addChild(gunTurret);
    return gunTurret;
}

export function setup(config: any, socket: Socket) {
    const width = config.width
    const height = config.height;
    let frames = 0;
    canvas = makeCanvas(width, height);
    stage = (new DisplayObject()) as Stage // FIXME

    // TODO(chab) remove
    (window as any).stage = stage;

    stage.currentPosition = {
        x:0,
        y:0,
        rotation: 0
    };
    stage.width = width;
    stage.height = height;


    const tank: Tank = createTank();
    const playerTanks: Tank[] = [];

    let bullets: Rectangle[] = [];
    let foeBullets: Rectangle[] = [];


    // background grid
    grid(50, 50, 50, 50, false, 0, 0,
        () => {
            const rectangle = new Rectangle(50, 50, 'grey', 'rgba(255, 1, 1, 0.1)');
            return rectangle;
        });

    const gunTurrets: GunTurret[] = [];

    const leftArrow: Key = keyboard(37), rightArrow: Key = keyboard(39), upArrow: Key = keyboard(38);
    const space: Key = keyboard(32);

    space.press = () => {
        const bullet = shoot(tank, tank.rotation, 32, 7, bullets, () => new Circle(8, 'red'));
        socket.emit('fireBullet', {id: tank.id});
        stage.addChild(bullet);
    };

    leftArrow.press = () => {
        tank.rotationSpeed = -0.1;
        socket.emit('rotateLeft', {id: tank.id})
    }
    leftArrow.release = () => {
        if (!rightArrow.isDown) {
            socket.emit('stopRotation', {id: tank.id})
            tank.rotationSpeed = 0;
        }
    };
    rightArrow.press = () => {
        tank.rotationSpeed = 0.1;
        socket.emit('rotateRight', {id: tank.id})
    }
    rightArrow.release = () => {
        if (!leftArrow.isDown) {
            socket.emit('stopRotation', {id: tank.id})
            tank.rotationSpeed = 0;
        }
    };

    upArrow.press = () => {
        socket.emit('forward', {id: tank.id})
        tank.moveForward = true;
    }

    upArrow.release = () => {
        socket.emit('stop', {id: tank.id})
        tank.moveForward = false
    }

    /// start
    socket.emit('register', {id: socket.id});

    socket.on('getState', ({id}, callback: any) => {
        console.log('GETTING STATE', playerTanks, tank)
        const tanks = [...playerTanks ?? [], tank ?? []].map(tank => serializeTank(tank));
        callback(tanks);
    });

    socket.on('registered', ({id}, callback: any) => {
        tank.id = id;
        console.log('registered on server', tank);
        callback();
    })

    socket.on('state', (state: State, callback: any) => {
        // this is ONLY called when the game start
        console.log('[INITIAL STATE], received from server', state)
        state.turrets.forEach(turret => gunTurrets.push(makeGunTurret(turret)));
        // update player position and color
        tank.x = state.playerTank.x;
        tank.y = state.playerTank.y;
        tank.color = state.playerTank.playerColor;
        tank.children[0].strokeStyle = tank.color
        tank.children[0].fillStyle = tank.color;
        tank.id = state.playerTank.id;
        // add player
        stage.addChild(tank);
        // add already existing players
        state.playerTanks.forEach(tank => {
            console.log('[INITIAL STATE] Player tank on the field');
            const newTank = hydrateTank(tank, tank.color);
            stage.addChild(newTank);
            playerTanks.push(newTank);
        });
        callback(tank.x, tank.y);
        // start game
        gameLoop();
    })

    socket.on('player', ({id, index, player}, callback) => {
        console.log('new player to display', player);
        const newTank = new Tank(false, player.playerColor);
        newTank.id = id;
        newTank.x = player.x;
        newTank.y = player.y;
        newTank.bulletColor = player.bulletColor;
        playerTanks.push(newTank);
        tanksById[id] = newTank;
        stage.addChild(newTank);
        console.log(playerTanks, tanksById);
    });

    // player actions are not acknowledged
    socket.on('rotateLeft', ({id}) => {
        tanksById[id].rotationSpeed = -0.1;
    });
    socket.on('rotateRight', ({id}) => {
        tanksById[id].rotationSpeed = 0.1;
    });

    socket.on('stopRotation', ({id}) => {
        tanksById[id].rotationSpeed = 0;
    });

    socket.on('stop', ({id}) => {
        tanksById[id].moveForward = false;
    });
    socket.on('forward', ({id}) => {
        tanksById[id].moveForward = true;
    });


    socket.on('fireBullet', ({id}) => {
        const tank = tanksById[id];
        // TODO handle bullet colors for each tank
        // TODO handle bullet collision for tank
        const bullet = shoot(tank, tank.rotation, 32, 7, bullets, () => new Circle(8, tank.bulletColor));
        stage.addChild(bullet);
    });




    function createTank(currentPlayer = true, color = 'gray'): Tank {
        return new Tank(currentPlayer, color);
    }

    function hydrateTank(tank: TankDTO, color: string) {

        const newTank = new Tank(false, color);
        newTank.ax = tank.ax;
        newTank.ay = tank.ay;
        newTank.id = tank.id;
        newTank.vx = tank.vx;
        newTank.vy = tank.vy;
        newTank.friction = tank.friction;
        newTank.rotation = tank.rotation;
        newTank.rotationSpeed = tank.rotationSpeed;
        newTank.moveForward = tank.moveForward;
        newTank.speed = tank.speed
        newTank.alpha = tank.alpha;
        newTank.color = tank.color
        newTank.x = tank.x
        newTank.y = tank.y;

        tanksById[newTank.id] = newTank;
        console.log('Hydrated tank', newTank, tanksById);
        return newTank;
    }

    function serializeTank({alpha, ax, ay, friction, speed, rotationSpeed, moveForward, vx, vy, color, rotation, x, y, id}: Tank): TankDTO {
        return {
            alpha, ax, ay, color, friction, speed, rotationSpeed, moveForward, vx, vy, rotation, x, y, id
        }
    }

    function updateTank(tankToUpdate: Tank) {
        tankToUpdate.rotation += tankToUpdate.rotationSpeed;
        if (tankToUpdate.moveForward) {
            tankToUpdate.speed += 0.1;
        } else {
            tankToUpdate.speed *= tankToUpdate.friction;
        }

        tankToUpdate.ax = tankToUpdate.speed * Math.cos(tankToUpdate.rotation);
        tankToUpdate.ay = tankToUpdate.speed * Math.sin(tankToUpdate.rotation);

        tankToUpdate.vx = tankToUpdate.ax;
        tankToUpdate.vy = tankToUpdate.ay;

        tankToUpdate.x += tankToUpdate.vx;
        tankToUpdate.y += tankToUpdate.vy;
    }

    function gameLoop() {
        frames++;
        // note that rAF only works on active frame, so you NEED two chrome windows
        window.requestAnimationFrame(gameLoop);
        updateTank(tank);
        playerTanks.forEach(tankToUpdate => updateTank(tankToUpdate));

        stage.currentPosition.x += tank.vx;
        stage.currentPosition.y += tank.vy;
        //stage.currentPosition.rotation += tank.rotationSpeed;

        gunTurrets.forEach(turret => {
            if (frames % turret.firingRate === 0) {
                const bullet = shoot(turret, turret.rotation, 32, 4, foeBullets, () => new Circle(8, 'black'));
                stage.addChild(bullet);
            }
            turret.rotation += turret.rotationSpeed;
        });

        foeBullets = foeBullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            const collision = outsideBounds(bullet, stage.localBounds);
            if (collision) {
                // something is off there
                stage.removeChild(bullet);
                return false;
            }
            const hitPlayer = hit(tank, bullet);
            if (hitPlayer) {
                // make rectange smaller
                playerBox.width = playerBox.width - 0.5;
                playerBox.height = playerBox.height - 0.5;
                // update center

                // replace turret on center
                tank.children[1].x = tank.children[1].x - 0.25;
                tank.children[1].y = tank.children[1].y - 0.25;
                // shorten turret
                tank.children[1].bx = tank.children[1].bx - 0.25;
                tank.children[1].lineWidth = tank.children[1].lineWidth - 0.125;
                stage.removeChild(bullet);
                return false;
            } else {
                return true;
            }
        });


        bullets = bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            const collision = outsideBounds(bullet, stage.localBounds);
            if (collision) {
                stage.removeChild(bullet);
                return false;
            }
            let hitFoes = false;
            // we need to manually update hitfoes in the callback coz we do not set it in the lib
            hit(bullet, gunTurrets, false, false, false,
                (collision, sprite) => {
                    hitFoes = true;
                    stage.removeChild(bullet);
                    stage.removeChild(sprite);
                    gunTurrets.splice(gunTurrets.indexOf(sprite), 1);
                    particleEffect(sprite.x,
                        sprite.y,
                        (idx: number, total: number) => {
                            // TODO(chab) remove
                            if (!stage) {
                                stage = (window as any).stage;
                            }
                            const color = Math.floor(60 + (idx / total) * 100);
                            const fill = `rgba(${color}, ${color}, ${color}, 1)`;
                            const c = new Rectangle(10, 10, 'red', fill);
                            stage.addChild(c);
                            return c;
                        },
                        10,
                        0,
                        true,
                        0,
                        6.28, // 2 * Math.PI -> radians
                        6,
                        20,
                        0.4,
                        1.5,
                        0.01,
                        0.05,
                        0.02,
                        0.04,
                        sprite.rotationSpeed - 0.3, sprite.rotationSpeed + 0.3
                    )
                });

            return !hitFoes;
        });

        for (let i = particles.length - 1; i >= 0; i--) {
            // as we can potentially remove the particle, we iterate from the
            // end to avoid messing the iteration
            const particle = particles[i];
            particle.update();
        }

        render(canvas, stage)
    }
}

function outsideBounds(sprite: Renderable, bounds: { x: number, y: number, width: number, height: number }, extra?: (collision: boolean | string) => void): boolean | string {
    const x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
    let collision: boolean | string = false;
    if (sprite.x - stage.currentPosition.x < x - sprite.width) {
        collision = 'left';
    } else if (sprite.y - stage.currentPosition.y < y - sprite.height) {
        collision = 'top';
    } else if (sprite.x - stage.currentPosition.x > width) {
        collision = 'right';
    } else if (sprite.y - stage.currentPosition.y > height) {
        collision = 'bottom';
    }
    if (extra) {
        extra(collision);
    }
    return collision;
}

// we can update the local bounds of the stage in the getter according to the current viewport !!


