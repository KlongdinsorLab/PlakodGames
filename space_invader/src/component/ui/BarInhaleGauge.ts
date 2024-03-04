import {
	BULLET_COUNT,
	HOLD_BAR_BORDER,
	HOLD_BAR_CHARGED_COLOR,
	HOLD_BAR_CHARGING_COLOR,
	HOLD_BAR_COLOR,
	HOLD_BAR_EMPTY_COLOR,
	HOLD_BAR_HEIGHT,
	HOLD_BAR_IDLE_COLOR,
	HOLD_DURATION_MS,
	HOLDBAR_REDUCING_RATIO,
	LASER_FREQUENCY_MS,
	SPACE_BETWEEN_MARGIN_SCALE,
	MARGIN,
} from 'config'

import InhaleGauge from './InhaleGauge'
import SoundManager from 'component/sound/SoundManager'

export default class BarInhaleGauge extends InhaleGauge {
	private soundManager: SoundManager

	constructor(scene: Phaser.Scene, division: number, index: number) {
		super(scene, division, index)
		this.soundManager = new SoundManager(scene)
	}

	createGauge(index: number): void {
		const x = this.getX(index)
		const y = this.getY()
		const width = this.getWidth()
		this.gauge = this.create(x, y, width)
		this.scene.tweens.add({
			targets: this.gauge,
			width: HOLD_BAR_BORDER / 2,
			duration: 0,
			ease: 'sine.inout',
		})
	}

	createUpDownGauge(): void {
		const { width, height } = this.scene.scale
		this.down = this.scene.add
			.image(0, width - MARGIN / 2 - HOLD_BAR_HEIGHT, 'chevron')
			.setOrigin(0, 1)
		this.down.setScale(0.05)
		this.scene.tweens.add({
			targets: this.down,
			y: height - MARGIN / 2,
			duration: 500,
			repeat: -1,
			hold: 250,
			repeatDelay: 500,
			ease: 'bounce.out',
		})
		this.down.setVisible(false)

		this.up = this.scene.add
			.image(0, width - MARGIN / 2, 'chevron')
			.setOrigin(1, 0)
		this.up.setScale(0.05)
		this.up.setRotation(Math.PI)
		this.scene.tweens.add({
			targets: this.up,
			y: height - HOLD_BAR_HEIGHT - MARGIN / 2,
			duration: 500,
			repeat: -1,
			hold: 250,
			repeatDelay: 500,
			ease: 'bounce.out',
		})
		this.up.setVisible(false)
	}

	getWidth(): number {
		const { width } = this.scene.scale
		const totalMargin = 2 * MARGIN
		const betweenMargin =
			SPACE_BETWEEN_MARGIN_SCALE * (this.division - 1) * MARGIN
		return (width - totalMargin - betweenMargin) / this.division
	}

	getX(index: number): number {
		const width = this.getWidth()
		const spaceBetween = SPACE_BETWEEN_MARGIN_SCALE * MARGIN
		return MARGIN + index * (width + spaceBetween)
	}

	getY(): number {
		const { height } = this.scene.scale
		return height - MARGIN + HOLD_BAR_BORDER
	}

	create(x: number, y: number, width: number): Phaser.GameObjects.Rectangle {
		const holdbar = this.scene.add
			.rectangle(x, y, width, HOLD_BAR_HEIGHT, HOLD_BAR_COLOR)
			.setOrigin(0, 1)
		holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR)
		return holdbar
	}

	getHoldWithIncrement(delta: number): number {
		return (this.getWidth() + HOLD_BAR_BORDER) / (HOLD_DURATION_MS / delta)
	}

	hold(delta: number) {
		this.isHoldbarReducing = false
		this.holdButtonDuration += delta
	}

	charge(delta: number) {
		;(<Phaser.GameObjects.Shape>this.gauge).setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGING_COLOR)
		;(<Phaser.GameObjects.Shape>this.gauge).width += this.getHoldWithIncrement(delta)
		this.soundManager.play(this.chargingSound!)
	}

	release(delta: number) {
		;(<Phaser.GameObjects.Shape>this.gauge).width -=
			this.getHoldWithIncrement(delta) * HOLDBAR_REDUCING_RATIO
		this.holdButtonDuration -= delta * HOLDBAR_REDUCING_RATIO
		this.soundManager.pause(this.chargingSound!)
	}

	setFullCharge() {
		;(<Phaser.GameObjects.Shape>this.gauge).setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGED_COLOR)
		this.soundManager.play(this.chargedSound!)
	}

	reset() {
		this.scene.tweens.add({
			targets: this.gauge,
			width: HOLD_BAR_BORDER / 2,
			duration: LASER_FREQUENCY_MS * BULLET_COUNT,
			ease: 'sine.inout',
		})
		;(<Phaser.GameObjects.Shape>this.gauge).setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR)
		this.holdButtonDuration = 0
		setTimeout(
			() => (this.holdButtonDuration = 0),
			LASER_FREQUENCY_MS * BULLET_COUNT,
		)
	}

	resetting() {
		;(<Phaser.GameObjects.Shape>this.gauge).setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR)
		this.isHoldbarReducing = true
	}

	deplete() {
		;(<Phaser.GameObjects.Shape>this.gauge).setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_EMPTY_COLOR)
	}

	isReducing(): boolean {
		return this.isHoldbarReducing && (<Phaser.GameObjects.Shape>this.gauge).width > 0
	}

	showUp(): void {
		this.up.setVisible(true)
	}

	hideUp(): void {
		this.up.setVisible(false)
	}

	showDown(): void {
		this.down.setVisible(true)
	}

	hideDown(): void {
		this.down.setVisible(false)
	}

	setStep(_:number): void {
		// TODO
	}

	setVisible(_:boolean): void {
		// TODO
	}
}
