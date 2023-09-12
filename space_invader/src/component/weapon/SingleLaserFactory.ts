import {SingleLaser} from './SingleLaser'
import {Laser} from "./Laser";
import {LaserFactory} from "./LaserFactory";
import Player from "../player/Player"

export class SingleLaserFactory extends LaserFactory {
    create(scene: Phaser.Scene, player: Player): Laser {
        return new SingleLaser(scene, player);
    }
}