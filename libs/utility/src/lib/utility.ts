import {DisplayObject, Renderable} from "@chabb/sprite";

export function findAngle(s1: DisplayObject, s2: DisplayObject) {
  return Math.atan2(s2.centerY - s1.centerY, s2.centerX - s1.centerX)
}

export function rotateSprite(rotatingSprite: DisplayObject, centerSprite: DisplayObject, distance: number, angle: number) {
  rotatingSprite.x = centerSprite.centerX - rotatingSprite.parent.x
      + ( distance * Math.cos(angle))
      - rotatingSprite.halfWidth;
  rotatingSprite.y = centerSprite.centerY - rotatingSprite.parent.y
      + (distance * Math.sin(angle))
      - rotatingSprite.halfWidth;
}

export function shoot(shooter: DisplayObject, angle: number, offsetFromCenter: number, bulletSpeed:number, bulletArray: Renderable[], bulletSprite: (...args: any[]) => Renderable) {
  const bullet = bulletSprite();
  bullet.x = shooter.centerX - bullet.halfWidth + (offsetFromCenter * Math.cos(angle));
  bullet.y = shooter.centerY - bullet.halfHeight + (offsetFromCenter * Math.sin(angle));
  bullet.vx = Math.cos(angle) * bulletSpeed;
  bullet.vy = Math.sin(angle) * bulletSpeed;

  bulletArray.push(bullet);
  return bullet;
}

export function remove(...spritesToRemove: DisplayObject[]) {
  spritesToRemove.forEach(sprite => {
    sprite.parent.removeChild(sprite);
  });
}
