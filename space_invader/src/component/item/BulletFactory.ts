import { METEOR_FREQUENCY_MS } from 'config'
import Player from 'component/player/Player'
import Score from 'component/ui/Score'
import { ItemFactory } from './ItemFactory'
import { Bullet } from './Bullet'
import InhaleGauge from 'component/ui/InhaleGauge'

export class BulletFactory extends ItemFactory {
	private bullets: Bullet[] = []
	private bulletTimer = 0

	create(
		scene: Phaser.Scene,
		player: Player,
		gauge: InhaleGauge,
		tutorial?: boolean,
	): Bullet {
		return new Bullet(scene, player, gauge, tutorial)
	}

	createByTime(
		scene: Phaser.Scene,
		player: Player,
		gauge: InhaleGauge,
		delta: number,
	): void {
		this.bulletTimer += delta
		while (this.bulletTimer > METEOR_FREQUENCY_MS) {
			this.bulletTimer -= METEOR_FREQUENCY_MS
			const bullet = this.create(scene, player, gauge)
			this.bullets.forEach((bullet) => {
				if (!bullet.isActive()) {
					this.bullets.splice(this.bullets.indexOf(bullet), 1)
					return
				}
			})
			this.bullets.push(bullet)
		}
	}

	getBullets(): Bullet[] {
		return this.bullets
	}
}
