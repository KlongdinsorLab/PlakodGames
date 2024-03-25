import Player from 'component/player/Player'
import Score from 'component/ui/Score'
import {
	HIT_POISON_SCORE,
	MARGIN,
	POISON_SPEED,
} from 'config'
// import SoundManager from 'component/sound/SoundManager'
import { Item } from './Item'
import InhaleGauge from 'component/ui/InhaleGauge'

export class Poison extends Item {
	// private soundManager: SoundManager

	constructor(
		scene: Phaser.Scene,
		player: Player,
    score: Score,
    gauge: InhaleGauge,
		isTutorial?: boolean,
	) {
		super(scene, player, score, gauge, isTutorial)
		this.move()
		// this.soundManager = new SoundManager(scene)
	}

	create(
		isTutorial?: boolean,
	): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
		const { width } = this.scene.scale
		const startingX = isTutorial ? width / 2 : Math.floor(Math.random() * width)
		this.item = this.scene.physics.add.image(
			startingX,
			-MARGIN,
			'bossAsset',
			'item_poison.png',
		)

		const poisonCollider = this.scene.physics.add.overlap(
			this.item,
			this.player.getBody(),
			() => {
        this.score.add(HIT_POISON_SCORE)
				this.scene.tweens.add({ targets: this.item, duration: 200, alpha: 0 })
        poisonCollider.active = false
			},
		)

		return this.item
	}

	move(): void {
		this.item.setVelocityY(POISON_SPEED)
		const velocityX = Math.floor(
			Math.random() * (POISON_SPEED / 3) - POISON_SPEED / 6,
		)
		this.item.setVelocityX(this.isTutorial ? -120 : velocityX)
	}

	hit(): void {
	}

	getBody(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
		return this.item
	}

	isActive(): boolean {
		return this.item.active
	}
}
