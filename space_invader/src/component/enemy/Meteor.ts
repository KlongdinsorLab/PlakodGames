import {Enemy} from "./Enemy"
import Player from "component/player/Player"
import Score from "component/ui/Score"

import {
    DESTROY_METEOR_SCORE,
    HIT_METEOR_SCORE,
    MARGIN,
    METEOR_SPEED,
    METEOR_SPIN_SPEED,
    PLAYER_HIT_DELAY_MS,
} from "../../config";
import SoundManager from "../sound/SoundManager";

export class Meteor extends Enemy {

    private soundManager: SoundManager
    private explosionEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(scene: Phaser.Scene, player: Player, score: Score, isTutorial?: boolean) {
        super(scene, player, score, isTutorial);
        this.move()
        this.attack()
        this.soundManager = new SoundManager(scene)
        const explosion = scene.add.particles('explosion')
        this.explosionEmitter = explosion.createEmitter({
            speed: 80,
            scale: 0.6,
            blendMode: Phaser.BlendModes.ADD,
            gravityY: -20,
        })
        this.explosionEmitter.active = false
        this.enermyDestroyedSound = this.scene.sound.add('meteorDestroyedSound')
    }

    create(isTutorial?: boolean): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
        const {width} = this.scene.scale
        const imageNumber = Math.floor(Math.random() * 4) + 1
        const startingX = isTutorial ? width / 2 : Math.floor(Math.random() * width)
        this.enemy = this.scene.physics.add.image(startingX, -MARGIN, `meteor${imageNumber}`)

        this.scene.physics.add.overlap(this.player.getBody(), this.enemy, (_, _meteor) => {
            if (this.player.getIsHit()) return;
            this.player.setIsHit(true)
            this.player.damaged()
            this.score.add(HIT_METEOR_SCORE)
            this.scene.time.delayedCall(PLAYER_HIT_DELAY_MS, () => {
                this.player.setIsHit(false)
                this.player.recovered()
            })
        })
        this.scene.time.delayedCall(5000, () => {
            this.enemy.destroy()
        })

        return this.enemy;
    }

    move(): void {
        this.enemy.setVelocityY(METEOR_SPEED)
        const velocityX = Math.floor(Math.random() * (METEOR_SPEED / 3) - (METEOR_SPEED / 6));
        this.enemy.setVelocityX(this.isTutorial ? 0 : velocityX)
        this.enemy.setAngularVelocity(METEOR_SPIN_SPEED);
    }

    attack(): void {
        // Do Nothing
//        this.scene.physics.add.overlap(this.player.getBody(), this.enemy, (_, _meteor) => {
//            if (this.player.getIsHit()) return;
//            this.player.setIsHit(true)
//            this.player.damaged()
//            this.score.add(HIT_METEOR_SCORE)
//            this.scene.time.delayedCall(PLAYER_HIT_DELAY_MS, () => {
//                this.player.setIsHit(false)
//                this.player.recovered()
//            })
//        })
//        this.scene.time.delayedCall(5000, () => {
//            this.enemy.destroy()
//        })
    }

    destroy(): void {
        this.explosionEmitter.startFollow(this.enemy)
        this.explosionEmitter.active = true
        this.explosionEmitter.start()
        this.scene.time.delayedCall(200, () => {
            this.explosionEmitter.stop()
        })
        this.enemy.destroy();
        this.soundManager.play(this.enermyDestroyedSound!, true)
        this.score.add(DESTROY_METEOR_SCORE)
    }

    getBody(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
        return this.enemy
    }

    isActive(): boolean {
        return this.enemy.active
    }

}