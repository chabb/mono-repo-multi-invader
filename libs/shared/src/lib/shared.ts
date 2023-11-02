export interface Config {
  width: number;
  height: number;
  maxLife: number;
  turrets: number;
}

export interface Turret {
  x: number;
  y: number;
  rotationSpeed: number;
  firingRate: number;
  rotation: number;
}

export interface Player {
  id: string;
  lifePoint: number;
  bulletColor: string;
  playerColor: string;
  x: number;
  y: number;
}

export interface TankDTO {
  alpha: number;
  ax: number;
  ay: number;
  color: string;
  friction: string;
  speed: number;
  rotationSpeed: number;
  moveForward: boolean;
  vx: number;
  vy: number;
  id: string;
  x: string;
  y: string;

}

export interface State {
  turrets: Turret[];
  playerTank: Player;
  player: number;
  playerTanks: TankDTO[];
}

