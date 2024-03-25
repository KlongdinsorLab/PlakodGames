import Player from 'component/player/Player'
import InhaleGauge from 'component/ui/InhaleGauge'
import Score from 'component/ui/Score'

export abstract class Item {
	// TODO Fix any type
	protected item!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | any
	protected scene: Phaser.Scene
	protected player: Player
	protected score: Score
	protected gauge: InhaleGauge
	protected isTutorial = false

	protected constructor(
		scene: Phaser.Scene,
		player: Player,
		score: Score,
		gauge: InhaleGauge,
		isTutorial?: boolean,
	) {
		this.scene = scene
		this.player = player
		this.score = score
		this.gauge = gauge
		this.isTutorial = isTutorial ?? false
		this.create(isTutorial)
	}

	// TODO Fix any
	abstract create(
		isTutorial?: boolean,
	): Phaser.Types.Physics.Arcade.ImageWithDynamicBody | any
	abstract move(): void
	abstract hit(): void
	// TODO Fix any
	abstract getBody(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody | any
}
