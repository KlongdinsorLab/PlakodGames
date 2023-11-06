//import CircleInhaleGauge from './CircleInhaleGauge'
import RingInhaleGauge from './RingInhaleGauge'
//import BarInhaleGauge from './BarInhaleGauge'
import InhaleGauge from './InhaleGauge'
export default class InhaleGaugeRegistry {
	private scene: Phaser.Scene
	private holdbars!: Phaser.GameObjects.GameObject[] | any[]

	constructor(scene: Phaser.Scene) {
		this.scene = scene
	}

	createbyDivision(division: number) {
		this.holdbars = [...Array(division)].map(
			(_, index: number) => new RingInhaleGauge(this.scene, division, index),
		)
	}

	get(index: number): InhaleGauge {
		return this.holdbars[index]
	}
}
