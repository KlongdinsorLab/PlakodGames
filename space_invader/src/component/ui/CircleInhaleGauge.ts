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
<<<<<<< HEAD
	MARGIN,
=======
>>>>>>> 55535a9 (Add Warmup (#2))
} from 'config'

import InhaleGauge from './InhaleGauge'
import SoundManager from 'component/sound/SoundManager'
<<<<<<< HEAD
import I18nSingleton from 'i18n/I18nSingleton'
=======
>>>>>>> 55535a9 (Add Warmup (#2))

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

<<<<<<< HEAD
		I18nSingleton.getInstance()
			.createTranslatedText(this.scene, x, y, 'inhale', undefined, {
				fontSize: '32px',
			})
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
				undefined,
				{ fontSize: '22px' },
			)
			.setOrigin(0, 0.5)

		this.downText = i18n
			.createTranslatedText(
				this.scene,
				downX - this.down.width / 2 - MARGIN / 2,
				y,
				'inhale-',
				undefined,
				{ fontSize: '22px' },
			)
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
		(<Phaser.GameObjects.Arc>this.gauge).radius +=
			this.getHoldWithIncrement(delta)
		this.soundManager.play(this.chargingSound!)
	}

	release(delta: number) {
		(<Phaser.GameObjects.Arc>this.gauge).radius -=
			this.getHoldWithIncrement(delta) * HOLDBAR_REDUCING_RATIO
		this.holdButtonDuration -= delta * HOLDBAR_REDUCING_RATIO
		this.soundManager.pause(this.chargingSound!)
	}

	setFullCharge() {
		this.releaseText.setVisible(true)
		//        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGED_COLOR);
		this.gauge.setFillStyle(HOLD_BAR_CHARGED_COLOR, 1)
		this.shake.play()
		this.soundManager.play(this.chargedSound!)
	}

	reset() {
		this.releaseText.setVisible(false)
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

=======
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
		//        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGED_COLOR);
		this.gauge.setFillStyle(HOLD_BAR_CHARGED_COLOR, 1)
		this.shake.play()
		this.soundManager.play(this.chargedSound!)
	}

	reset() {
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

>>>>>>> 55535a9 (Add Warmup (#2))
	isReducing(): boolean {
		return (
			this.isHoldbarReducing && (<Phaser.GameObjects.Arc>this.gauge).radius > 0
		)
	}

	showUp(): void {
<<<<<<< HEAD
		this.upText?.setVisible(true)
=======
>>>>>>> 55535a9 (Add Warmup (#2))
		;(<Phaser.GameObjects.Arc>this.up).setFillStyle(HOLD_BAR_COLOR, 1)
	}

	hideUp(): void {
<<<<<<< HEAD
		this.upText?.setVisible(false)
=======
>>>>>>> 55535a9 (Add Warmup (#2))
		;(<Phaser.GameObjects.Arc>this.up).setFillStyle(HOLD_BAR_IDLE_COLOR, 1)
	}

	showDown(): void {
<<<<<<< HEAD
		this.downText?.setVisible(true)
=======
>>>>>>> 55535a9 (Add Warmup (#2))
		;(<Phaser.GameObjects.Arc>this.down).setFillStyle(HOLD_BAR_COLOR, 1)
	}

	hideDown(): void {
<<<<<<< HEAD
		this.downText?.setVisible(false)
=======
>>>>>>> 55535a9 (Add Warmup (#2))
		;(<Phaser.GameObjects.Arc>this.down).setFillStyle(HOLD_BAR_IDLE_COLOR, 1)
	}
}
