import {
	BULLET_COUNT,
	CIRCLE_GAUGE_MARGIN,
	CIRCLE_GAUGE_RADUIS,
	HOLD_BAR_IDLE_COLOR,
	HOLD_DURATION_MS,
	LASER_FREQUENCY_MS,
} from 'config'

import InhaleGauge from './InhaleGauge'
import SoundManager from 'component/sound/SoundManager'

let isReloading = false
export default class RingInhaleGauge extends InhaleGauge {
	private START_DEGREE = -90
	private soundManager: SoundManager

	constructor(scene: Phaser.Scene, division: number, index: number) {
		super(scene, division, index)

//		this.shake = scene.tweens.add({
//			targets: this.gauge,
//			x: this.gauge.x + CIRCLE_GAUGE_SHAKE_X,
//			duration: 30,
//			yoyo: true,
//			loop: -1,
//			ease: 'sine.inout',
//		})
//		this.shake.pause()
		const { width, height } = this.scene.scale
		const x = width / 2
		const y = height - CIRCLE_GAUGE_MARGIN

		this.scene.add.image(x, y, 'ring').setScale(0.65)
		this.soundManager = new SoundManager(scene)
	}
	
	drawArc(index: number, gauge: Phaser.GameObjects.Graphics, startDegree:number, endDegree:number, color: number = HOLD_BAR_IDLE_COLOR): Phaser.GameObjects.Graphics {
		const { width, height } = this.scene.scale
		const x =
			width / (this.division + 1) +
			index * (2 * CIRCLE_GAUGE_RADUIS) +
			(this.division !== 1 ? CIRCLE_GAUGE_RADUIS : 0)
		const y = height - CIRCLE_GAUGE_MARGIN
		
		gauge.lineStyle(16, color, 1);
		gauge.beginPath();
		gauge.arc(x, y, CIRCLE_GAUGE_RADUIS, Phaser.Math.DegToRad(startDegree), Phaser.Math.DegToRad(endDegree), true);
		gauge.strokePath();
		gauge.setDepth(1)
		return gauge
	}

	createGauge(index: number): void {
		const gauge = this.scene.add.graphics();
		this.gauge = this.drawArc(index, gauge, this.START_DEGREE, this.START_DEGREE)
	}

	createUpDownGauge(): void {
		const { width, height } = this.scene.scale
		const x = width/2
		const y = height - CIRCLE_GAUGE_MARGIN

//		this.up = this.scene.add.arc(x, y, 20, 0, 360, false);
//		this.up.setStrokeStyle(8, 0xEBCCA9);
//		this.up.setVisible(false)
//
//		this.down = this.scene.add.arc(x, y, 65, 0, 360, false);
//		this.down.setStrokeStyle(8, 0x1a65ac);
//		this.down.setVisible(false)

		const createCircle = (radius: number, color: number) => {
			const circle = this.scene.add.arc(x, y, radius, 0, 360, false);
			circle.setStrokeStyle(8, color);
			circle.setVisible(false)
			return circle
		}

		const steps = [
			{radius: 20, color: 0xEBCCA9},
			{radius: 40, color: 0xEBCCA9},
			{radius: 70, color: 0xCDC5C6},
			{radius: 80, color: 0xCDC5C6}
		]

		this.steps = steps.map(({radius, color})=> createCircle(radius, color))
//		const { width, height } = this.scene.scale
//		const y = height - CIRCLE_GAUGE_MARGIN
//		const downX = width / 2 - 2 * CIRCLE_GAUGE_RADUIS - 8
//		this.down = this.scene.add
//			.circle(downX, y, CIRCLE_OVER_GAUGE_RADUIS, HOLD_BAR_IDLE_COLOR)
//			.setOrigin(0.5, 0.5)
//
//		const upX = width / 2 + 2 * CIRCLE_GAUGE_RADUIS + 8
//		this.up = this.scene.add
//			.circle(upX, y, CIRCLE_OVER_GAUGE_RADUIS, HOLD_BAR_IDLE_COLOR)
//			.setOrigin(0.5, 0.5)
//		const i18n = I18nSingleton.getInstance()
//
//		this.upText = i18n
//			.createTranslatedText(
//				this.scene,
//				upX + this.up.width / 2 + MARGIN / 2,
//				y,
//				'inhale+',
//			)
//			.setFontSize(MEDIUM_FONT_SIZE)
//			.setOrigin(0, 0.5)
//
//		this.downText = i18n
//			.createTranslatedText(
//				this.scene,
//				downX - this.down.width / 2 - MARGIN / 2,
//				y,
//				'inhale-',
//			)
//			.setFontSize(MEDIUM_FONT_SIZE)
//			.setOrigin(1, 0.5)
	}
	
	getHoldDegree(duration: number): number {
		return (360 / (HOLD_DURATION_MS / -duration)) + this.START_DEGREE
	}

	hold(delta: number) {
		if(isReloading) return
		this.holdButtonDuration += delta
	}

	charge(_: number) {
		const gauge = <Phaser.GameObjects.Graphics>this.gauge
		gauge.clear();
		this.gauge = this.drawArc(0, gauge, this.START_DEGREE, this.getHoldDegree(this.holdButtonDuration))
		this.soundManager.play(this.chargingSound!)
	}

	release(delta: number) {
		this.isHoldbarReducing = true
		const gauge = <Phaser.GameObjects.Graphics>this.gauge
		this.holdButtonDuration -= delta * HOLD_DURATION_MS / (LASER_FREQUENCY_MS * BULLET_COUNT)
		gauge.clear();
		if(this.getHoldDegree(this.holdButtonDuration) <= this.START_DEGREE) {
			this.gauge = this.drawArc(0, gauge, this.START_DEGREE, this.getHoldDegree(this.holdButtonDuration))
		}
		
		this.soundManager.pause(this.chargingSound!)
	}

	setFullCharge() {
//		this.releaseText.setVisible(true)
//		//        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGED_COLOR);
//		this.gauge.setFillStyle(HOLD_BAR_CHARGED_COLOR, 1)
//		if (!this.shake.isPlaying()) {
//			this.shake.resume()
//		}
		this.holdButtonDuration = HOLD_DURATION_MS
		this.soundManager.play(this.chargedSound!)
	}

	reset() {
//		this.releaseText.setVisible(false)
//		this.shake.restart()
//		this.shake.pause()
//		this.scene.tweens.add({
//			targets: this.gauge,
//			radius: HOLD_BAR_BORDER / 2,
//			duration: LASER_FREQUENCY_MS * BULLET_COUNT,
//			ease: 'sine.inout',
//		})
//		this.gauge.setFillStyle(HOLD_BAR_COLOR, 1)
//		//        this.gauge.set	StrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
//		this.holdButtonDuration = 0
		isReloading = true
		this.isHoldbarReducing = true
		setTimeout(
			() => {
				this.holdButtonDuration = 0
				isReloading = false
			},
			LASER_FREQUENCY_MS * BULLET_COUNT,
		)
		
	}

	resetting() {
		//        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
		this.isHoldbarReducing = true
	}

	deplete() {
//		this.gauge.setFillStyle(HOLD_BAR_EMPTY_COLOR, 1)
		//        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_EMPTY_COLOR);
	}
	isReducing(): boolean {
		return this.isHoldbarReducing && this.holdButtonDuration >= 0
	}

	setStepVisible(step: number, visible: boolean): void {
		this.steps.map((s) => s.setVisible(false))
		this.steps[step].setVisible(visible)
	}
}
