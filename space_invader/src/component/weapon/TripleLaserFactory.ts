import { TripleLaser} from "./TripleLaser";
import { Laser } from "./Laser";
import { LaserFactory} from "./LaserFactory";
import Player from "../player/Player"

export class TripleLaserFactory extends LaserFactory {
    create(scene: Phaser.Scene, player: Player): Laser {
        return new TripleLaser(scene, player);
    }
}