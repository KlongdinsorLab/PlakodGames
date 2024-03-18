import Player from 'component/player/Player'
import Score from 'component/ui/Score'
import { ItemFactory } from './ItemFactory'
import { Poison } from './Poison'
import InhaleGauge from 'component/ui/InhaleGauge'

export class PosionFactory extends ItemFactory {
	private poisons: Poison[] = []
	private poisonTimer = 0

	create(
		scene: Phaser.Scene,
		player: Player,
		score: Score,
		gauge: InhaleGauge,
		tutorial?: boolean,
	): Poison {
		return new Poison(scene, player, score, gauge, tutorial)
	}

	createByTime(
		scene: Phaser.Scene,
		player: Player,
		score: Score,
		gauge: InhaleGauge,
		delta: number,
	): void {
		this.poisonTimer += delta
		while (this.poisonTimer > 3000) {
			this.poisonTimer -= 3000
			const poison = this.create(scene, player, score, gauge)
			this.poisons.forEach((poison) => {
				if (!poison.isActive()) {
					this.poisons.splice(this.poisons.indexOf(poison), 1)
					return
				}
			})
			this.poisons.push(poison)
		}
	}

	getPoisons(): Poison[] {
		return this.poisons
	}
}
