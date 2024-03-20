import { Laser } from './Laser'
import Player from '../player/Player'
import { LASER_FREQUENCY_MS } from 'config'
import { Scene } from 'phaser'
import { Enemy } from '../enemy/Enemy'

export abstract class LaserFactory {
	protected bulletCount = 0
	protected timer = 0

	abstract create(scene: Phaser.Scene, player: Player): Laser

	createByTime(
		scene: Scene,
		player: Player,
		enemies: Enemy[],
		delta: number,
	): void {
		this.timer += delta
		while (this.timer > LASER_FREQUENCY_MS) {
			this.timer -= LASER_FREQUENCY_MS
			if (this.bulletCount <= 0) return
			const laser = this.create(scene, player)
			const laserBodies = laser.shoot()
			this.bulletCount -= 1
			this.setEnemiesCollision(scene, laserBodies, enemies)
			scene.time.delayedCall(5000, () => {
				laser.destroy()
			})
		}
	}

	setEnemiesCollision(
		scene: Phaser.Scene,
		lasers: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[],
		enemies: Enemy[],
	) {
		if (!Array.isArray(enemies) || enemies.length === 0) return
		enemies.forEach((enemy) => {
			lasers.forEach((laser) => {
				scene.physics.add.overlap(laser, enemy.getBody(), () =>
					enemy.hit()
				)
			})
		})
	}

	set(bulletCount:number): void {
		this.bulletCount = bulletCount
	}
}
