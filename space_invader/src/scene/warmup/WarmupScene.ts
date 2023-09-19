import Phaser from 'phaser'
import { MARGIN } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'
import EventEmitter = Phaser.Events.EventEmitter

export enum Step {
	EXHALE = 0,
	RELEASE = 1,
	INHALE = 2,
}

export default class WarmupScene extends Phaser.Scene {
	private exhaleCount = 3
	private event!: EventEmitter
	private step: Step = Step.EXHALE
	private releaseSprite!: Phaser.GameObjects.Sprite

	constructor() {
		super('warmup')
	}

	init({ event }: { event: EventEmitter }) {
		this.event = event
	}

	create() {
		this.exhaleCount = 3
		const { width, height } = this.scale
		const dim = this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)

		this.anims.create({
			key: 'exhale-animation',
			frames: this.anims.generateFrameNumbers('exhale', { start: 0, end: 2 }),
			frameRate: 3,
			repeat: -1,
		})

		this.anims.create({
			key: 'release-animation',
			frames: this.anims.generateFrameNumbers('release', { start: 0, end: 1 }),
			frameRate: 3,
			repeat: -1,
		})

		this.anims.create({
			key: 'inhale-animation',
			frames: this.anims.generateFrameNumbers('inhale', { start: 0, end: 2 }),
			frameRate: 3,
			repeat: -1,
		})

		const exhaleSprite = this.add.sprite(
			width / 2,
			height / 2 - 2 * MARGIN,
			'exhale',
		)

		const circle = this.add.circle(
			exhaleSprite.x,
			exhaleSprite.y - MARGIN / 2,
			exhaleSprite.width / 4 + MARGIN,
			0xffffff,
			0.5,
		)
		circle.setStrokeStyle(4, 0x58595b)

		exhaleSprite.setScale(0.5)
		exhaleSprite.play('exhale-animation')
		exhaleSprite.setDepth(1)

		const i18n = I18nSingleton.getInstance()
		const description = i18n
			.createTranslatedText(
				this,
				width / 2,
				exhaleSprite.y - exhaleSprite.height / 2,
				'warmup_exhale',
				undefined,
				{ wordWrap: { width: width / 2 }, fontSize: '32px' },
			)
			.setOrigin(0.5, 0.5)

		const continueText = i18n
			.createTranslatedText(
				this,
				width / 2,
				exhaleSprite.y + exhaleSprite.height / 2 + MARGIN,
				'warmup_continue',
				undefined,
				{ wordWrap: { width: width / 2 }, fontSize: '32px' },
			)
			.setOrigin(0.5, 0.5)
		this.tweens.add({
			targets: continueText,
			alpha: 0.5,
			yoyo: true,
			repeat: -1,
			duration: 300
		})

		this.input.on(
			'pointerup',
			() => {
				if (this.step === Step.EXHALE) {
					const countText = this.add
						.text(
							width / 2,
							exhaleSprite.y + exhaleSprite.height / 2 + MARGIN,
							`${this.exhaleCount}`,
							{ fontSize: '160px' },
						)
						.setOrigin(0.5, 0.5)

					continueText.setVisible(false)

					this.tweens.add({
						targets: countText,
						scale: 2,
						alpha: 0,
						ease: 'Sine.inOut',
						loop: 2,
						duration: 1000,
						onLoop: () => {
							this.exhaleCount--
							countText.setText(`${this.exhaleCount}`)
						},
						onComplete: () => {
							countText.setVisible(false)
							exhaleSprite.setVisible(false)
							i18n.setTranslatedText(description, 'warmup_release')

							this.releaseSprite = this.add.sprite(
								width / 2,
								height / 2 - 2 * MARGIN,
								'release',
							)
							this.releaseSprite.setScale(0.3)
							this.releaseSprite.play('release-animation')
							this.releaseSprite.setDepth(1)
							this.step = Step.RELEASE
							continueText.setVisible(true)
						},
					})
				}

				if (this.step === Step.RELEASE) {
					continueText.setVisible(false)
					dim.setVisible(false)
					i18n.setTranslatedText(description, 'warmup_inhale')
					this.scene.resume('game')
					this.releaseSprite.setVisible(false)

					const inhaleSprite = this.add.sprite(
						width / 2,
						height / 2 - 2 * MARGIN,
						'inhale',
					)
					inhaleSprite.setScale(0.4)
					inhaleSprite.play('inhale-animation')
					inhaleSprite.setDepth(1)
					this.step = Step.INHALE

					this.event.once('inhale', () => {
						this.scene.setVisible(false)
						this.event.removeListener('inhale')
					})
				}
			},
			this,
		)
	}
}
