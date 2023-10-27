/**
 *
 * Particle effect and particle emitters
 *
 */
import {Rectangle} from "@chabb/sprite";
import {remove} from "@chabb/utility";
interface ParticulBehavior {
  scaleSpeed: number;
  alphaSpeed: number;
  rotationSpeed: number;
  update: () => void;
}


type WipParticle = Rectangle & Partial<ParticulBehavior>
type Particle = Rectangle & ParticulBehavior

// I like this design, when the array is shared during the whole lifetime

export const particles: Particle[] = [];

export function particleEffect(
    x = 0,
    y = 0,
    spriteFunction = (idx, angles) => {

      // TODO(chab) remove
      if (!stage) {
        stage = window.stage;
      }
      const c = new Rectangle(10, 10,'red');
      stage.addChild(c);
      return c;
    },
    numberOfParticles = 10,
    gravity = 0,
    randomSpacing = true,
    minAngle = 0,
    maxAngle = 6.28, // 2 * Math.PI -> radians
    minSize = 10,
    maxSize = 30,
    minSpeed = 0.1, maxSpeed = 0.9,
    minScaleSpeed = 0.01, maxScaleSpeed = 0.05,
    minAlphaSpeed = 0.02, maxAlphaSpeed = 0.02,
    minRotationSpeed = 0.05, maxRotationSpeed = 0.1
) {
  const randomFloat = (min: number, max: number) => min + Math.random() * (max - min);
  const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
  const angles: number[] = []
  let angle;
  const spacing = (maxAngle - minAngle) / (numberOfParticles - 1);
  for (let i = 0; i < numberOfParticles; i ++) {
    if (randomSpacing) {
      angle = randomFloat(minAngle, maxAngle);
      angles.push(angle);
    } else {
      if (angle === undefined) angle = minAngle;
      angles.push(angle);
      angle += spacing;
    }
  }
  angles.forEach((angle,idx) => makeParticle(angle, idx));

  function makeParticle(angle, idx): void {
    const particle: WipParticle = spriteFunction(idx, angles.length);
    /*
    if (particle.frames.length > 0) {
      // go thru frame
      particle.goToAndStop(randomInt(0, particle.frames.length) - 1)
    }*/
    particle.x = x - particle.halfWidth;
    particle.y = y - particle.halfHeight;
    const size = randomInt(minSize, maxSize);
    particle.width = size;
    particle.height = size;
    particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);
    particle.alphaSpeed = randomFloat(minAlphaSpeed, maxAlphaSpeed);
    particle.rotationSpeed = randomFloat(minRotationSpeed, maxRotationSpeed);
    const speed = randomFloat(minSpeed, maxSpeed);
    particle.vx = speed * Math.cos(angle);
    particle.vy = speed * Math.sin(angle);

    const p = particle as Particle;

    p.update = () => {
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      if (p.scaleX - p.scaleSpeed > 0) {
        p.scaleX -= p.scaleSpeed;
      }
      if (particle.scaleY - p.scaleSpeed > 0) {
        particle.scaleY -= p.scaleSpeed;
      }
      particle.rotation += p.rotationSpeed;
      particle.alpha -= p.alphaSpeed;

      if (particle.alpha <= 0) {
        remove(particle);
        particles.splice(particles.indexOf(p), 1);
      }
    };
    particles.push(p)
  }
}

export function emitter(interval: number, particleFunction: any) {
  const emitter: { playing: boolean } = { playing:  false };
  let timerInterval: number;
  emitter.playing = false;

  function play() {
    if (!emitter.playing) {
      particleFunction();
      timerInterval = setInterval(() => emitParticle, interval);
      emitter.playing = true;
    }
  }

  function stop() {
    if (emitter.playing) {
      clearInterval(timerInterval);
      emitter.playing = false;
    }
  }

  function emitParticle() {
    particleFunction();
  }
}
