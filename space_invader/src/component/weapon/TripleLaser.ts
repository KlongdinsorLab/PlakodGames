import { Laser } from './Laser'
import Player from 'component/player/Player'
import { LASER_SPEED, TRIPLE_LASER_X_SPEED, MARGIN } from 'config'

export class TripleLaser extends Laser {
	private scene: Phaser.Scene
	private player: Player
	private laser1!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
	private laser2!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
	private laser3!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody

	constructor(scene: Phaser.Scene, player: Player) {
		super()
		this.scene = scene
		this.player = player
	}
	shoot(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] {
		const { x, y } = this.player.getLaserLocation()
		this.laser1 = this.scene.physics.add.image(x, y, 'laser')
		this.laser2 = this.scene.physics.add.image(x + MARGIN, y, 'laser')
		this.laser3 = this.scene.physics.add.image(x - MARGIN, y, 'laser')
		this.laser1.setVelocityY(-1 * LASER_SPEED)
		this.laser2.setVelocityY(-1 * LASER_SPEED)
		this.laser2.setVelocityX(TRIPLE_LASER_X_SPEED)
		this.laser3.setVelocityY(-1 * LASER_SPEED)
		this.laser3.setVelocityX(-1 * TRIPLE_LASER_X_SPEED)

		return [this.laser1, this.laser2, this.laser3]
	}

	destroy(): void {
		this.laser1?.destroy()
		this.laser2?.destroy()
		this.laser3?.destroy()
	}
}
