import Phaser from 'phaser'
import {
	LARGE_FONT_SIZE,
	MARGIN,
	PLAYER_START_MARGIN,
	TUTORIAL_DELAY_MS,
} from 'config'
import I18nSingleton from 'i18n/I18nSingleton'
import SoundManager from 'component/sound/SoundManager'

export default class TutorialControllerScene extends Phaser.Scene {
	constructor() {
		super('tutorial controller')
	}

	create() {
		const soundManager = new SoundManager(this)
		const isMute = soundManager.isMute()
		soundManager.mute()

		const { width, height } = this.scale
		this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)

		const graphics = this.add.graphics({ fillStyle: { color: 0xffffff } })

		const i18n = I18nSingleton.getInstance()
		const controlInstruction = i18n
			.createTranslatedText(this, width / 2, 3 * MARGIN, 'tutorial_controller')
			.setFontSize(LARGE_FONT_SIZE)
			.setOrigin(0.5, 0)

		const line = new Phaser.Geom.Line(
			width / 2,
			controlInstruction.y + MARGIN,
			width / 2,
			height - PLAYER_START_MARGIN - MARGIN,
		)

		const points = line.getPoints(32)

		for (let i = 0; i < points.length; i++) {
			const p = points[i]
			graphics.fillRect(p.x - 2, p.y - 2, 4, 16)
			graphics.setAlpha(0.5)
		}

		const move1 = this.add.image(
			width / 2 + MARGIN,
			height - PLAYER_START_MARGIN,
			'player',
		)
		move1.alpha = 0.8

		const move2 = this.add.image(
			width / 2 + 2 * MARGIN,
			height - PLAYER_START_MARGIN,
			'player',
		)
		move2.alpha = 0.5

		const move3 = this.add.image(
			width / 2 - 2 * MARGIN,
			height - PLAYER_START_MARGIN,
			'player',
		)
		move3.alpha = 0.5

		const move4 = this.add.image(
			width / 2 - MARGIN,
			height - PLAYER_START_MARGIN,
			'player',
		)
		move4.alpha = 0.8

		this.add.image(width / 2, height - PLAYER_START_MARGIN, 'player')

		const finger = this.add
			.image(width / 2 + width / 4, height / 2, 'finger press')
			.setOrigin(0.5, 0.5)
		finger.setRotation(-Math.PI / 8)

		const fingerAnimation = this.tweens.add({
			targets: finger,
			scale: 0.9,
			duration: 500,
			ease: 'sine.inout',
			yoyo: true,
			loop: -1,
			onLoop: () => {
				fingerAnimation.pause()
				const moveToX =
					finger.x === width / 4 ? width / 2 + width / 4 : width / 4
				this.tweens.add({
					targets: finger,
					x: moveToX,
					duration: 1000,
					loopDelay: 500,
					ease: 'sine.inout',
					onComplete: () => {
						fingerAnimation.resume()
					},
				})
			},
		})

		this.input.once(
			'pointerdown',
			() => {
				this.scene.resume('game')
				isMute ? soundManager.mute() : soundManager.unmute()
				i18n.removeAllListeners(this)
				this.scene.stop()
				setTimeout(
					() => localStorage.setItem('tutorial', 'true'),
					TUTORIAL_DELAY_MS,
				)
			},
			this,
		)
	}
}
