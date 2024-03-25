import {
    BULLET_COUNT,
    HOLD_BAR_IDLE_COLOR,
    HOLD_DURATION_MS,
    LASER_FREQUENCY_MS,
    MARGIN,
    HOLD_BAR_BORDER,
    HOLD_BAR_HEIGHT,
    HOLD_BAR_CHARGING_COLOR,
    HOLD_BAR_CHARGED_COLOR,
    HOLD_BAR_EMPTY_COLOR, LARGE_FONT_SIZE
} from 'config'

import InhaleGauge from './InhaleGauge'
import SoundManager from 'component/sound/SoundManager'

let isReloading = false
let rectanglesBackground: Phaser.GameObjects.Rectangle[] = []
let bulletText: Phaser.GameObjects.Text
const sections = 5

export default class CenterCircleInhaleGauge extends InhaleGauge {
    private soundManager: SoundManager

    constructor(scene: Phaser.Scene, division: number, index: number) {
        super(scene, division, index)
        this.soundManager = new SoundManager(scene)
    }
    createGauge(_: number): void {
        rectanglesBackground = [...Array(sections).keys()].map((arrayIndex) => this.createBar(arrayIndex));
        this.gauge = this.scene.add.circle(this.getX(0) + this.getBarWidth()/2, this.getY(), HOLD_BAR_HEIGHT)
            .setOrigin(0.5, 1)
            .setFillStyle(HOLD_BAR_IDLE_COLOR)
            .setDepth(100)
            .setStrokeStyle(0)

        const {width} = this.scene.scale

        bulletText = this.scene.add
                    .text(width /2 , this.getY(), `⚡️: `)
                    .setFontSize(LARGE_FONT_SIZE)
                    .setOrigin(0.5, 1)
        bulletText.setVisible(false)
    }

    createBar (index: number): Phaser.GameObjects.Rectangle {
        const barWidth = this.getBarWidth()
        const x = this.getX(index)
        const bar = this.scene.add.rectangle(x, this.getY(), barWidth, HOLD_BAR_HEIGHT * 2).setOrigin(0, 1)

        bar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR)
        return bar
    }

    getY(): number {
        const { height } = this.scene.scale
        return height - MARGIN + HOLD_BAR_BORDER
    }

    getX(index: number): number {
        return 3 * MARGIN + (this.getBarWidth() * index)
    }

    getBarWidth(): number {
        const { width } = this.scene.scale
        return (width - (6 * MARGIN)) / sections
    }

    createUpDownGauge(): void {
        // TODO
    }

    hold(delta: number) {
        if(isReloading) return
        this.holdButtonDuration += delta
    }

    getHoldWithIncrement(delta: number): number {
        return ((<Phaser.GameObjects.Rectangle>this.gauge).width * 2 + HOLD_BAR_BORDER) / (HOLD_DURATION_MS / delta)
    }

    getScaleX(): number {
        return 1 + ((this.holdButtonDuration / HOLD_DURATION_MS) * (sections -1))
    }

    charge(_: number) {
        const gauge = <Phaser.GameObjects.Rectangle>this.gauge
		this.scene.tweens.add({
			targets: this.gauge,
			x: this.getX(2) + this.getBarWidth()/2,
			duration: 20,
			ease: 'sine.inout',
		})
        gauge.setFillStyle(HOLD_BAR_CHARGING_COLOR)
        gauge.setScale(this.getScaleX(), 1)
        this.soundManager.play(this.chargingSound!)
    }

    release(delta: number) {
        const gauge = <Phaser.GameObjects.Rectangle>this.gauge
        gauge.setScale(this.getScaleX(), 1)
        gauge.setFillStyle(HOLD_BAR_IDLE_COLOR)
        this.holdButtonDuration -= delta *  HOLD_DURATION_MS / (LASER_FREQUENCY_MS * BULLET_COUNT)
        this.soundManager.pause(this.chargingSound!)
    }

    setFullCharge() {
        (<Phaser.GameObjects.Rectangle>this.gauge).setFillStyle(HOLD_BAR_CHARGED_COLOR, 1)
        this.holdButtonDuration = HOLD_DURATION_MS
        this.soundManager.play(this.chargedSound!)
    }

    set(bulletCount: number) {
        let currentBulletCount = bulletCount
        isReloading = true
        this.isHoldbarReducing = true
        bulletText.setVisible(true)
        bulletText.setText(`⚡️: ${currentBulletCount}`)
        this.gauge.setVisible(false)
        rectanglesBackground.map(r => r.setVisible(false))
        setTimeout(
            () => {
                rectanglesBackground.map(r => r.setVisible(true))
                this.gauge.setVisible(true)
                bulletText.setVisible(false)
                this.holdButtonDuration = 0
                isReloading = false
            },
            LASER_FREQUENCY_MS * bulletCount,
        )

        this.setIntervalTimes(()=> {
                currentBulletCount--
            bulletText.setText(`⚡️: ${currentBulletCount}`)

            }, LASER_FREQUENCY_MS, bulletCount
        )

    }

    setIntervalTimes(callback: ()=>void, delay: number, repetitions: number) {
        let x = 0;
        const intervalId = window.setInterval(function () {

            callback();

            if (++x === repetitions) {
                window.clearInterval(intervalId);
            }
        }, delay);
    }

    resetting() {
        //        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
        this.isHoldbarReducing = true
    }

    deplete() {
        const gauge = <Phaser.GameObjects.Rectangle>this.gauge
        gauge.setFillStyle(HOLD_BAR_EMPTY_COLOR, 1)
        gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_EMPTY_COLOR);
    }
    isReducing(): boolean {
        return this.isHoldbarReducing && this.holdButtonDuration >= 0
    }

    setStep(step: number): void {
        if(step >= 2) {
            step++
        }
        this.scene.tweens.add({
            targets: this.gauge,
            x: this.getX(step) + this.getBarWidth()/2,
            duration: 20,
            ease: 'sine.inout',
        })
    }
    setVisible(_:boolean): void {
        // TODO
    }

    setVisibleAll(_: boolean): void {
		// TODO
    }
}
