import {
    BULLET_COUNT,
    //    HOLD_BAR_CHARGING_COLOR,
    HOLD_BAR_EMPTY_COLOR,
    HOLD_DURATION_MS,
    LASER_FREQUENCY_MS,
    CIRCLE_GAUGE_MARGIN,
    CIRCLE_GAUGE_RADUIS, MARGIN
} from 'config'

import InhaleGauge from './InhaleGauge'
import SoundManager from 'component/sound/SoundManager'

const START_DEGREE = 60
const END_DEGREE = 300
let charge: Phaser.GameObjects.Image
const gaugeColor = 0x00ff00
const gaugeReducingColor = 0xcccccc
let isReloading = false
let gaugeY = 0
let backgroundGauge: Phaser.GameObjects.Graphics

export default class RightVerticalGauge extends InhaleGauge {
    //    private shake: Phaser.Tweens.Tween
    private soundManager: SoundManager
    
    constructor(scene: Phaser.Scene, division: number, index: number) {
        super(scene, division, index)

        //        this.shake = scene.tweens.add({
        //            targets: this.gauge,
        //            x: this.gauge.x + CIRCLE_GAUGE_SHAKE_X,
        //            duration: 30,
        //            yoyo: true,
        //            loop: -1,
        //            ease: 'sine.inout',
        //        })
        //        this.shake.pause()
        this.soundManager = new SoundManager(scene)
    }

    createGauge(_: number): void {
        const { width, height } = this.scene.scale
//        const x =
//			width / (this.division + 1) +
//			index * (2 * CIRCLE_GAUGE_RADUIS) +
//			(this.division !== 1 ? CIRCLE_GAUGE_RADUIS : 0)

//        this.gauge = this.scene.add
//			.arc(x, y, CIRCLE_GAUGE_RADUIS, HOLD_BAR_COLOR)
//			.setOrigin(0.5, 0.5)
        
        gaugeY = height/2 - CIRCLE_GAUGE_MARGIN
        
        this.scene.add
            .image(width - MARGIN/2, height/2 - CIRCLE_GAUGE_MARGIN, 'bar')
            .setOrigin(1, 0.5)
        
        charge = this.scene.add
            .image(width - MARGIN/2, height/2 - CIRCLE_GAUGE_MARGIN, 'charge-gauge')
            .setOrigin(1, 0.5)
        
//        const backgroundGauge = this.scene.add.graphics();
//        this.drawArc(backgroundGauge, charge.x - 96, gaugeY, 0xffffff, START_DEGREE, END_DEGREE)
//        
//        const gauge = this.scene.add.graphics();
//        this.gauge = this.drawArc(gauge, charge.x - 96, gaugeY, gaugeColor, START_DEGREE, START_DEGREE)
        const gauge = this.scene.add.graphics();
        backgroundGauge = this.scene.add.graphics();
        this.drawGauge(gauge, charge.x - 96, gaugeY, gaugeColor, START_DEGREE, START_DEGREE)
        
//        this.scene.tweens.add({
//            targets: this.gauge,
//            radius: 0,
//            duration: 0,
//            ease: 'sine.inout',
//        })
    }
    
    drawArc(gauge: Phaser.GameObjects.Graphics, x: number, y: number, color: number, startDegree:number, endDegree:number): Phaser.GameObjects.Graphics {
        gauge.lineStyle(16, color, 1);
        gauge.beginPath();
        gauge.arc(x, y, CIRCLE_GAUGE_RADUIS, Phaser.Math.DegToRad(startDegree), Phaser.Math.DegToRad(endDegree), false);
        gauge.strokePath();
        gauge.setDepth(1)
        return gauge
    }
    
    drawGauge(gauge: Phaser.GameObjects.Graphics, x: number, y: number, color: number, startDegree:number, endDegree:number): Phaser.GameObjects.Graphics {
        gauge.clear();
        backgroundGauge.clear()
        this.drawArc(backgroundGauge, x, y, 0xffffff, START_DEGREE, END_DEGREE)
        this.gauge = this.drawArc(gauge, x, y, color, startDegree, endDegree).setDepth(100)
        return this.gauge
    }

    createUpDownGauge(): void {
        //        this.gauge = this.scene.add
        //			.circle(x, y, CIRCLE_GAUGE_RADUIS, HOLD_BAR_COLOR)
        //			.setOrigin(0.5, 0.5)
        //        const y = height/2 - CIRCLE_GAUGE_MARGIN - 260
    }

    getHoldWithIncrement(delta: number): number {
        return CIRCLE_GAUGE_RADUIS / (HOLD_DURATION_MS / delta)
    }

    hold(delta: number) {
        if(isReloading) return
        this.isHoldbarReducing = false
        this.holdButtonDuration += delta
    }

    charge(_: number) {
        const { height } = this.scene.scale
        
        const gauge = <Phaser.GameObjects.Graphics>this.gauge
        gaugeY = height/2 - CIRCLE_GAUGE_MARGIN
        charge.setY(gaugeY)
        
        this.gauge = this.drawGauge(gauge, charge.x - 96, gaugeY,gaugeColor, START_DEGREE,  this.getHoldDegree(this.holdButtonDuration))
        this.soundManager.play(this.chargingSound!)
    }

    getHoldDegree(duration: number): number {
        return START_DEGREE + ((END_DEGREE - START_DEGREE) / (HOLD_DURATION_MS / duration))
    }

    release(delta: number) {
        this.isHoldbarReducing = true
		const gauge = <Phaser.GameObjects.Graphics>this.gauge
		this.holdButtonDuration -= delta * HOLD_DURATION_MS / (LASER_FREQUENCY_MS * BULLET_COUNT)
        if(this.getHoldDegree(this.holdButtonDuration) >= START_DEGREE) {
            this.gauge = this.drawGauge(gauge, charge.x - 96, gaugeY, gaugeReducingColor, START_DEGREE, this.getHoldDegree(this.holdButtonDuration))
        }

        this.soundManager.pause(this.chargingSound!)
    }

    setFullCharge() {
        //        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGED_COLOR);
//        (<Phaser.GameObjects.Shape>this.gauge).setFillStyle(
//            HOLD_BAR_CHARGED_COLOR,
//            1,
//        )
        //        if (!this.shake.isPlaying()) {
        //            this.shake.resume()
        //        }
        this.holdButtonDuration = HOLD_DURATION_MS
        this.soundManager.play(this.chargedSound!)
    }

    reset() {
        //        this.shake.restart()
        //        this.shake.pause()
//        this.scene.tweens.add({
//            targets: this.gauge,
//            radius: HOLD_BAR_BORDER / 2,
//            duration: LASER_FREQUENCY_MS * BULLET_COUNT,
//            ease: 'sine.inout',
//        })
//        this.holdButtonDuration = 0
        isReloading = true
        this.isHoldbarReducing = true
        setTimeout(
            () => {
                this.holdButtonDuration = 0
                isReloading = false
                this.isHoldbarReducing = false
            },
            LASER_FREQUENCY_MS * BULLET_COUNT,
        )
    }

    resetting() {
        // TODO
        //        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
        this.isHoldbarReducing = true
    }

    deplete() {
        (<Phaser.GameObjects.Shape>this.gauge).setFillStyle(
            HOLD_BAR_EMPTY_COLOR,
            1,
            )
        //        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_EMPTY_COLOR);
    }

    isReducing(): boolean {
        return this.isHoldbarReducing && this.holdButtonDuration >= 0
    }

    setStep(step: number): void {
        const {  height } = this.scene.scale

        if (step === 0) {
            gaugeY = height/2 - CIRCLE_GAUGE_MARGIN + 200
        }
        
        if (step === 1) {
            gaugeY = height/2 - CIRCLE_GAUGE_MARGIN + 120
        }
        
        if (step === 2) {
            gaugeY = height/2 - CIRCLE_GAUGE_MARGIN - 120
        }
        
        if (step === 3) {
            gaugeY = height/2 - CIRCLE_GAUGE_MARGIN - 200
        }
        
        backgroundGauge.clear()
        charge.setY(gaugeY);
    }

    setVisible(_: boolean) {
    }
}
