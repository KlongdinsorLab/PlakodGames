import {
	BULLET_COUNT,
	HOLD_BAR_BORDER,
	HOLD_BAR_CHARGED_COLOR,
	//    HOLD_BAR_CHARGING_COLOR,
	HOLD_BAR_COLOR,
	HOLD_BAR_EMPTY_COLOR,
	HOLD_BAR_IDLE_COLOR,
	HOLD_DURATION_MS,
	HOLDBAR_REDUCING_RATIO,
	LASER_FREQUENCY_MS,
	CIRCLE_GAUGE_MARGIN,
	CIRCLE_GAUGE_RADUIS,
	CIRCLE_OVER_GAUGE_RADUIS,
	CIRCLE_GAUGE_SHAKE_X,
	MARGIN,
	MEDIUM_FONT_SIZE,
	LARGE_FONT_SIZE,
} from 'config'

import InhaleGauge from './InhaleGauge'
import SoundManager from 'component/sound/SoundManager'
import I18nSingleton from 'i18n/I18nSingleton'

export default class CircleInhaleGauge extends InhaleGauge {
	private shake: Phaser.Tweens.Tween
	private soundManager: SoundManager

	constructor(scene: Phaser.Scene, division: number, index: number) {
		super(scene, division, index)

		this.shake = scene.tweens.add({
			targets: this.gauge,
			x: this.gauge.x + CIRCLE_GAUGE_SHAKE_X,
			duration: 30,
			yoyo: true,
			loop: -1,
			ease: 'sine.inout',
		})
		this.shake.pause()
		this.soundManager = new SoundManager(scene)
	}

	createGauge(index: number): void {
		const { width, height } = this.scene.scale
		const x =
			width / (this.division + 1) +
			index * (2 * CIRCLE_GAUGE_RADUIS) +
			(this.division !== 1 ? CIRCLE_GAUGE_RADUIS : 0)
		const y = height - CIRCLE_GAUGE_MARGIN

		this.scene.add
			.circle(x, y, CIRCLE_GAUGE_RADUIS, HOLD_BAR_IDLE_COLOR)
			.setOrigin(0.5, 0.5)

		I18nSingleton.getInstance()
			.createTranslatedText(this.scene, x, y, 'inhale')
			.setFontSize(LARGE_FONT_SIZE)
			.setOrigin(0.5, 0.5)

		this.gauge = this.scene.add
			.circle(x, y, CIRCLE_GAUGE_RADUIS, HOLD_BAR_COLOR)
			.setOrigin(0.5, 0.5)
		//        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
		this.scene.tweens.add({
			targets: this.gauge,
			radius: 0,
			duration: 0,
			ease: 'sine.inout',
		})
	}

	createUpDownGauge(): void {
		const { width, height } = this.scene.scale
		const y = height - CIRCLE_GAUGE_MARGIN
		const downX = width / 2 - 2 * CIRCLE_GAUGE_RADUIS - 8
		this.down = this.scene.add
			.circle(downX, y, CIRCLE_OVER_GAUGE_RADUIS, HOLD_BAR_IDLE_COLOR)
			.setOrigin(0.5, 0.5)

		const upX = width / 2 + 2 * CIRCLE_GAUGE_RADUIS + 8
		this.up = this.scene.add
			.circle(upX, y, CIRCLE_OVER_GAUGE_RADUIS, HOLD_BAR_IDLE_COLOR)
			.setOrigin(0.5, 0.5)
		const i18n = I18nSingleton.getInstance()

		this.upText = i18n
			.createTranslatedText(
				this.scene,
				upX + this.up.width / 2 + MARGIN / 2,
				y,
				'inhale+',
			)
			.setFontSize(MEDIUM_FONT_SIZE)
			.setOrigin(0, 0.5)

		this.downText = i18n
			.createTranslatedText(
				this.scene,
				downX - this.down.width / 2 - MARGIN / 2,
				y,
				'inhale-',
			)
			.setFontSize(MEDIUM_FONT_SIZE)
			.setOrigin(1, 0.5)
	}

	getHoldWithIncrement(delta: number): number {
		return CIRCLE_GAUGE_RADUIS / (HOLD_DURATION_MS / delta)
	}

	hold(delta: number) {
		this.isHoldbarReducing = false
		this.holdButtonDuration += delta
	}

	charge(delta: number) {
		//        this.gauge.setFillStyle(HOLD_BAR_CHARGING_COLOR, 1)
		//        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGING_COLOR);
		;(<Phaser.GameObjects.Arc>this.gauge).radius +=
			this.getHoldWithIncrement(delta)
		this.soundManager.play(this.chargingSound!)
	}

	release(delta: number) {
		;(<Phaser.GameObjects.Arc>this.gauge).radius -=
			this.getHoldWithIncrement(delta) * HOLDBAR_REDUCING_RATIO
		this.holdButtonDuration -= delta * HOLDBAR_REDUCING_RATIO
		this.soundManager.pause(this.chargingSound!)
	}

	setFullCharge() {
		this.releaseText.setVisible(true)
		//        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGED_COLOR);
		this.gauge.setFillStyle(HOLD_BAR_CHARGED_COLOR, 1)
		if (!this.shake.isPlaying()) {
			this.shake.resume()
		}
		this.soundManager.play(this.chargedSound!)
	}

	reset() {
		this.releaseText.setVisible(false)
		this.shake.restart()
		this.shake.pause()
		this.scene.tweens.add({
			targets: this.gauge,
			radius: HOLD_BAR_BORDER / 2,
			duration: LASER_FREQUENCY_MS * BULLET_COUNT,
			ease: 'sine.inout',
		})
		this.gauge.setFillStyle(HOLD_BAR_COLOR, 1)
		//        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
		this.holdButtonDuration = 0
		setTimeout(
			() => (this.holdButtonDuration = 0),
			LASER_FREQUENCY_MS * BULLET_COUNT,
		)
	}

	resetting() {
		//        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
		this.isHoldbarReducing = true
	}

	deplete() {
		this.gauge.setFillStyle(HOLD_BAR_EMPTY_COLOR, 1)
		//        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_EMPTY_COLOR);
	}

	isReducing(): boolean {
		return (
			this.isHoldbarReducing && (<Phaser.GameObjects.Arc>this.gauge).radius > 0
		)
	}

	showUp(): void {
		this.upText?.setVisible(true)
		;(<Phaser.GameObjects.Arc>this.up).setFillStyle(HOLD_BAR_COLOR, 1)
	}

	hideUp(): void {
		this.upText?.setVisible(false)
		;(<Phaser.GameObjects.Arc>this.up).setFillStyle(HOLD_BAR_IDLE_COLOR, 1)
	}

	showDown(): void {
		this.downText?.setVisible(true)
		;(<Phaser.GameObjects.Arc>this.down).setFillStyle(HOLD_BAR_COLOR, 1)
	}

	hideDown(): void {
		this.downText?.setVisible(false)
		;(<Phaser.GameObjects.Arc>this.down).setFillStyle(HOLD_BAR_IDLE_COLOR, 1)
	}
}
