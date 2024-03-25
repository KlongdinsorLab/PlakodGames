import Player from 'component/player/Player'
import Score from 'component/ui/Score'

export abstract class Enemy {
	// TODO Fix any type
	protected enemy!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | any
	protected scene: Phaser.Scene
	protected player: Player
	protected score: Score
	protected enermyDestroyedSound?: Phaser.Sound.BaseSound
	protected isTutorial = false
	protected isInItemPhase = false

	protected constructor(
		scene: Phaser.Scene,
		player: Player,
		score: Score,
		isTutorial?: boolean,
		isItemPhase?: boolean
	) {
		this.scene = scene
		this.player = player
		this.score = score
		this.isTutorial = isTutorial ?? false
		this.isInItemPhase = isItemPhase ?? false
		this.create(isTutorial)
	}

	// TODO Fix any
	abstract create(
		isTutorial?: boolean,
	): Phaser.Types.Physics.Arcade.ImageWithDynamicBody | any
	abstract move(): void
	abstract attack(): void
	abstract hit(): void
	abstract destroy(): void
	// TODO Fix any
	abstract getBody(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody | any
}
