import { TripleLaser} from "./TripleLaser";
import { Laser } from "./Laser";
import { WeaponFactory} from "./WeaponFactory";
import Player from "../player/Player"

export class TripleLaserFactory extends WeaponFactory {
    createLaser(scene: Phaser.Scene, player: Player): Laser {
        return new TripleLaser(scene, player);
    }
}