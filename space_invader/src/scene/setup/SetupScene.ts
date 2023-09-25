import Phaser from 'phaser'
import { HOLD_BAR_IDLE_COLOR, MARGIN } from 'config'

export default class SetupScene extends Phaser.Scene {
	private TOTAL_STEPS = 4
	private step = 1

	constructor() {
		super('setup')
	}

	preload() {
		this.load.image('setup1', 'assets/icon/setup/setup1.png')
		this.load.image('setup2', 'assets/icon/setup/setup2.png')
		this.load.image('setup3', 'assets/icon/setup/setup3.png')
		this.load.image('setup4', 'assets/icon/setup/setup4.png')

		this.load.svg('next', 'assets/icon/next.svg')
	}

	create() {
		this.step = 1
		const { width, height } = this.scale
		this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)
		const setup = this.add.image(width / 2, height / 2, 'setup1')

		const next = this.add
			.image(
				setup.x + setup.width / 2 - 2 * MARGIN,
				setup.y + setup.height / 2 - 2.25 * MARGIN,
				'next',
			)
			.setRotation(-Math.PI / 2)
			.setInteractive()
			.setTint(HOLD_BAR_IDLE_COLOR)

		const previous = this.add
			.image(
				setup.x - setup.width / 2 + 2 * MARGIN,
				setup.y + setup.height / 2 - 2.25 * MARGIN,
				'next',
			)
			.setRotation(Math.PI / 2)
			.setInteractive()

		next.on('pointerup', () => {
			if (this.step >= this.TOTAL_STEPS) {
				localStorage.setItem('setup', 'true')
				this.scene.resume('title')
				this.scene.stop()
				return
			}
			previous.setTint(HOLD_BAR_IDLE_COLOR)
			this.step++
			setup.setTexture(`setup${this.step}`)
		})

		previous.on('pointerup', () => {
			if (this.step <= 1) {
				return
			}
			if (this.step <= 2) {
				previous.setTint(0xffffff)
			} else {
				previous.setTint(HOLD_BAR_IDLE_COLOR)
			}
			next.setTint(HOLD_BAR_IDLE_COLOR)
			this.step--
			setup.setTexture(`setup${this.step}`)
		})
	}
}
