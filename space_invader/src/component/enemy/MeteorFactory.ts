import { METEOR_FREQUENCY_MS } from 'config'
import { EnemyFactory } from './EnemyFactory'
import { Meteor } from './Meteor'
import Player from 'component/player/Player'
import Score from 'component/ui/Score'

export class MeteorFactory extends EnemyFactory {
	private meteors: Meteor[] = []
	private meteorTimer = 0

	create(
		scene: Phaser.Scene,
		player: Player,
		score: Score,
		tutorial?: boolean,
		itemPhase?: boolean
	): Meteor {
		return new Meteor(scene, player, score, tutorial, itemPhase)
	}

	createByTime(
		scene: Phaser.Scene,
		player: Player,
		score: Score,
		delta: number,
		itemPhase?: boolean
	): void {
		this.meteorTimer += delta
		while (this.meteorTimer > METEOR_FREQUENCY_MS) {
			this.meteorTimer -= METEOR_FREQUENCY_MS
			const meteor = this.create(scene, player, score, false, itemPhase)
			this.meteors.forEach((meteor) => {
				if (!meteor.isActive()) {
					this.meteors.splice(this.meteors.indexOf(meteor), 1)
					return
				}
			})
			this.meteors.push(meteor)
		}
	}

	getMeteors(): Meteor[] {
		return this.meteors
	}
}
