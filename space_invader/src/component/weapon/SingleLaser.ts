import {Laser} from "./Laser";
import Player from "../player/Player"
import {LASER_SPEED} from "../../config"
import SoundManager from "../sound/SoundManager"

export class SingleLaser extends Laser {
    
    private scene: Phaser.Scene
    private player: Player
    private laser: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined
    private shootSound?: Phaser.Sound.BaseSound
    
    constructor(scene: Phaser.Scene, player: Player) {
        super();
        this.scene = scene
        this.player = player
        this.shootSound = this.scene.sound.add('shootSound', {volume: 2});
    }
    shoot(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] {
        const {x, y} = this.player.getLaserLocation()
        this.laser = this.scene.physics.add.image(x, y, 'laser')
        this.laser.setVelocityY(-1 * LASER_SPEED)
        new SoundManager(this.scene).play(this.shootSound)
        return [this.laser]
    }

    destroy(): void {
        this.laser?.destroy()
    }

}