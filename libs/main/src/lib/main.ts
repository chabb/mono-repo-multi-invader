import {Circle, DisplayObject, Rectangle, Group, Line} from '@chabb/sprite';
import {shoot} from "@chabb/utility";
import {hit} from "@chabb/collision";
import {keyboard} from "@chabb/keyboard";
import {particleEffect, particles} from "@chabb/particle";
import {makeCanvas, render} from "@chabb/renderer";



export function main(): void {
  console.log('--------------->>> APP STARTED, exposing objects', Circle, DisplayObject, Rectangle, render, Group, makeCanvas, Line);
  console.log('keyboard', shoot, hit, keyboard, particles, particleEffect, render, makeCanvas);
}

