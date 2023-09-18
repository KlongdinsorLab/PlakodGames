import CircleInhaleGauge from './CircleInhaleGauge'
import BarInhaleGauge from './BarInhaleGauge'

export default class InhaleGaugeRegistry {
	private scene: Phaser.Scene
	private holdbars!: Phaser.GameObjects.GameObject[] | any[]

	constructor(scene: Phaser.Scene) {
		this.scene = scene
	}

	createbyDivision(division: number) {
		this.holdbars = [...Array(division)].map(
			(_, index: number) => new CircleInhaleGauge(this.scene, division, index),
		)
	}

	get(index: number): CircleInhaleGauge | BarInhaleGauge {
		return this.holdbars[index]
	}
}
