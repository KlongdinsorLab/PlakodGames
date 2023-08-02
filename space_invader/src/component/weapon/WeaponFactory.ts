import {Laser} from "./Laser";
import Player from "../player/Player"

export abstract class WeaponFactory {
    abstract createLaser(scene: Phaser.Scene, player: Player): Laser
}