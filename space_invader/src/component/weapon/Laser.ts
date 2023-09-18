export abstract class Laser {
	abstract shoot(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]
	abstract destroy(): void
}
