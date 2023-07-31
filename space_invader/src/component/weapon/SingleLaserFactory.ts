import {SingleLaser} from './SingleLaser'
import {Laser} from "./Laser";
import {WeaponFactory} from "./WeaponFactory";
import Player from "../player/Player"

export class SingleLaserFactory extends WeaponFactory {
    createLaser(scene: Phaser.Scene, player: Player): Laser {
        return new SingleLaser(scene, player);
    }
}