import {
    BULLET_COUNT,
    HOLD_DURATION_MS,
    LASER_FREQUENCY_MS,
    MARGIN,
    HOLD_BAR_BORDER,
    HOLD_BAR_HEIGHT,
    LARGE_FONT_SIZE,
} from 'config'

import InhaleGauge from './InhaleGauge'
import SoundManager from 'component/sound/SoundManager'

let isReloading = false
let rectanglesBackground: Phaser.GameObjects.Rectangle[] = []
let stepBar!: Phaser.GameObjects.Rectangle
let bulletText: Phaser.GameObjects.Text
const sections = 5
let progressBar: Phaser.GameObjects.Image

export default class OverlapInhaleGauge extends InhaleGauge {
    private soundManager: SoundManager

    constructor(scene: Phaser.Scene, division: number, index: number) {
        super(scene, division, index)
        this.soundManager = new SoundManager(scene)
    }
    createGauge(_: number): void {
        const { width } = this.scene.scale

        progressBar = this.scene.add
            .image(width/2, this.getY() + 16, 'progress_bar')
            .setOrigin(0.5, 1)

        rectanglesBackground = [...Array(sections).keys()].map((arrayIndex) => this.createBar(arrayIndex));
        
        this.gauge = this.scene.add
            .rectangle(width/2, this.getY(), this.getBarWidth(), HOLD_BAR_HEIGHT)
            .setOrigin(0.5, 1)
            .setDepth(100)
            .setFillStyle(0x7FCF01)
            .setVisible(false)
        
        stepBar = this.createBar(0).setFillStyle(0x7FCF01).setOrigin(0.5, 1).setDepth(200)
        
        bulletText = this.scene.add
                    .text(width /2 , this.getY(), `⚡️: `)
                    .setFontSize(LARGE_FONT_SIZE)
                    .setOrigin(0.5, 1)
        bulletText.setVisible(false)
    }

    createBar (index: number): Phaser.GameObjects.Rectangle {
        const barWidth = this.getBarWidth()
        const x = this.getX(index)
        return this.scene.add.rectangle(x, this.getY(), barWidth, HOLD_BAR_HEIGHT).setOrigin(0, 1)

//        bar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR)
    }

    getY(): number {
        const { height } = this.scene.scale
        return height - MARGIN + HOLD_BAR_BORDER
    }

    getX(index: number): number {
        const { width } = this.scene.scale
        return (width - (this.getBarWidth() * 5))/2 + (this.getBarWidth() * index)
//        return 5 * MARGIN + (this.getBarWidth() * index)
    }

    getBarWidth(): number {
//        const { width } = this.scene.scale
//        return (width - (10 * MARGIN)) / sections
        return 80
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
        if(isReloading) return
        const gauge = <Phaser.GameObjects.Rectangle>this.gauge
        gauge.setVisible(true)
        this.gauge.setAlpha(1)
        stepBar.setVisible(false)
        gauge.setFillStyle(0x7FCF01)
        gauge.setScale(this.getScaleX(), 1)
        this.soundManager.play(this.chargingSound!)
    }

    release(delta: number) {
        const gauge = <Phaser.GameObjects.Rectangle>this.gauge
        if(this.getScaleX() < 1.005) {
            gauge.setVisible(false)
        }
        gauge.setScale(this.getScaleX(), 1)
        gauge.setFillStyle(0x7FCF01)
        this.holdButtonDuration -= delta *  HOLD_DURATION_MS / (LASER_FREQUENCY_MS * BULLET_COUNT)
        this.soundManager.pause(this.chargingSound!)
    }

    setFullCharge() {
        (<Phaser.GameObjects.Rectangle>this.gauge).setFillStyle(0x7FCF01, 1)
        this.holdButtonDuration = HOLD_DURATION_MS
        this.soundManager.play(this.chargedSound!)
    }

    reset(bulletCount:number) {
        let currentBulletCount = bulletCount
        isReloading = true
        this.isHoldbarReducing = true
        bulletText.setVisible(true)
        bulletText.setText(`⚡️: ${currentBulletCount}`)
        progressBar.setVisible(false)
        this.gauge.setVisible(false)
        rectanglesBackground.map(r => r.setVisible(false))
        setTimeout(
            () => {
                progressBar.setVisible(true)
                rectanglesBackground.map(r => r.setVisible(true))
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
        gauge.setFillStyle(0x7FCF01, 1)
//        gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_EMPTY_COLOR);
    }

    isReducing(): boolean {
        return this.isHoldbarReducing && this.holdButtonDuration >= 0
    }

    stepColors = [0xFF2C34, 0xFF9243,0x7FCF01, 0xFF9243, 0xFF2C34]

    setStep(step: number): void {
        if(isReloading) {
            stepBar.setVisible(false)
            return
        }
        if(step >= 2) {
            step++
        }
        stepBar.setVisible(true)
        this.scene.tweens.add({
            targets: stepBar,
            x: this.getX(step) + this.getBarWidth()/2,
            duration: 20,
            ease: 'sine.inout',
        })
        stepBar.setFillStyle(this.stepColors[step])
        this.gauge.setAlpha(0.2)
    }

    chargeItem(_: number) {
        if(isReloading) return
        const gauge = <Phaser.GameObjects.Rectangle>this.gauge
        gauge.setVisible(true)
        this.gauge.setAlpha(1)
        stepBar.setVisible(false)
        gauge.setFillStyle(0x7FCF01)
        gauge.setScale(this.getScaleX(), 1)
        this.soundManager.play(this.chargingSound!)
    }

    setItemStep(step: number): void {
        if(isReloading) {
            stepBar.setVisible(false)
            return
        }
        if(step >= 2) {
            step++
        }
        stepBar.setVisible(true)
        this.scene.tweens.add({
            targets: stepBar,
            x: this.getX(step/2) + this.getBarWidth()/2,
            duration: 20,
            ease: 'sine.inout',
        })
        stepBar.setFillStyle(0x7FCF01)
        this.gauge.setAlpha(0.2)
    }
    
    setVisible(visible:boolean): void {
        if(isReloading) return
        stepBar.setVisible(visible)
    }
}
