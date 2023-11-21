import { Enemy } from './Enemy'
import Player from 'component/player/Player'
import Score from 'component/ui/Score'

import {
    DESTROY_METEOR_SCORE,
    BOSS_HIT_DELAY_MS,
} from 'config'
import SoundManager from 'component/sound/SoundManager'

let isHit = false

export class Boss extends Enemy {
	private soundManager: SoundManager

	constructor(scene: Phaser.Scene, player: Player, score: Score) {
		super(scene, player, score)
		this.move()
		this.attack()
		this.soundManager = new SoundManager(scene)
	}

	create(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
		const { width } = this.scene.scale
        const path = new Phaser.Curves.Path(0, 0)
		this.scene.anims.create({
			key: 'boss-move',
			frames: this.scene.anims.generateFrameNames('bossMove', { prefix: 'Enemy Normal_', suffix:'.png', start: 0, end: 47, zeroPad: 5 }),
			frameRate: 24,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'boss-hit',
			frames: this.scene.anims.generateFrameNames('bossHit', { prefix: 'Enemy Being hit_', suffix:'.png', start: 0, end: 47, zeroPad: 5 }),
			frameRate: 24,
			repeat: -1
		});
		
		this.enemy = this.scene.add.follower(path, width / 2, -40, 'bossMove').setOrigin(0.5)
		this.enemy.play('boss-move')
		
		this.scene.physics.world.enable(this.enemy)
		return this.enemy
	}

	move(): void {
        const { width } = this.scene.scale
		const randomVector = [...Array(5).keys()].map((i: number) => {
			return new Phaser.Math.Vector2(Math.floor(Math.random() * width), Math.floor(Math.random() * width))
		})
		const path = new Phaser.Curves.Path(this.enemy.x, this.enemy.y)
			.lineTo(width / 2, 350)
			.circleTo(100)
			.splineTo(randomVector)
			.circleTo(60)
			.lineTo(width / 2, 100)
			.lineTo(width + 200, 400)
			.lineTo(-200, 400)
        this.enemy.setPath(path)
        this.enemy.startFollow({
            positionOnPath: true,
            duration: 10000,
            yoyo: true,
            repeat: -1,
            rotateToPath: false,
        })
	}

	attack(): void {
		// TODO
	}

	hit(): void {
		// this.enemy.destroy()
		if (isHit) return
		
		this.enemy.stop()
		this.enemy.setTexture('bossHit')
		this.enemy.play('boss-hit')
		
		isHit = true
		this.enemy.setAlpha(0.75)
		setTimeout(() => {
			isHit = false
			this.enemy.setAlpha(1)
			this.enemy.stop()
			this.enemy.setTexture('bossMove')
			this.enemy.play('boss-move')
		}, BOSS_HIT_DELAY_MS)
		this.soundManager.play(this.enermyDestroyedSound!, true)
		this.score.add(DESTROY_METEOR_SCORE)
	}

	destroy() {
        // TODO
    }

	getBody(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
		return this.enemy
	}

	isActive(): boolean {
		return this.enemy.active
	}

	remove(): void {
		const { width } = this.scene.scale
        const path = new Phaser.Curves.Path(this.enemy.x, this.enemy.y).lineTo(width/2, -40)
		this.enemy.setPath(path).startFollow({duration: 200})
	}
}
