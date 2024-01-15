import {
	BULLET_COUNT,
	HOLD_BAR_BORDER,
	HOLD_BAR_CHARGED_COLOR,
	//    HOLD_BAR_CHARGING_COLOR,
	HOLD_BAR_COLOR,
	HOLD_BAR_EMPTY_COLOR,
    HOLD_DURATION_MS,
    HOLDBAR_REDUCING_RATIO,
    LASER_FREQUENCY_MS,
    CIRCLE_GAUGE_MARGIN,
    CIRCLE_GAUGE_RADUIS,
} from 'config'

import InhaleGauge from './InhaleGauge'
import SoundManager from 'component/sound/SoundManager'

let extraGauge: Phaser.GameObjects.Image
export default class CenterVerticalGauge extends InhaleGauge {
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

    createGauge(index: number): void {
        const { width, height } = this.scene.scale
        const x =
			width / (this.division + 1) +
			index * (2 * CIRCLE_GAUGE_RADUIS) +
			(this.division !== 1 ? CIRCLE_GAUGE_RADUIS : 0)
        const y = height/2 - CIRCLE_GAUGE_MARGIN

        this.gauge = this.scene.add
			.circle(x, y, CIRCLE_GAUGE_RADUIS, HOLD_BAR_COLOR)
			.setOrigin(0.5, 0.5) 
        //        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);

        this.scene.add
            .image(width/2, height/2 - CIRCLE_GAUGE_MARGIN, 'gauge_background')
            .setOrigin(0.5, 0.5)

        this.scene.tweens.add({
            targets: this.gauge,
            radius: 0,
            duration: 0,
            ease: 'sine.inout',
        })
    }

    createUpDownGauge(): void {
        //        this.gauge = this.scene.add
        //			.circle(x, y, CIRCLE_GAUGE_RADUIS, HOLD_BAR_COLOR)
        //			.setOrigin(0.5, 0.5)
        const { width } = this.scene.scale
        //        const y = height/2 - CIRCLE_GAUGE_MARGIN - 260

        extraGauge = this.scene.add
            .image(width/2, 0, 'gauge_highlight')
            .setOrigin(0.5, 0.5)
        extraGauge.setRotation(Math.PI)
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
        //        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGED_COLOR);
        (<Phaser.GameObjects.Shape>this.gauge).setFillStyle(
            HOLD_BAR_CHARGED_COLOR,
            1,
            )
        //        if (!this.shake.isPlaying()) {
        //            this.shake.resume()
        //        }
        this.soundManager.play(this.chargedSound!)
    }

    reset() {
        //        this.shake.restart()
        //        this.shake.pause()
        this.scene.tweens.add({
            targets: this.gauge,
            radius: HOLD_BAR_BORDER / 2,
            duration: LASER_FREQUENCY_MS * BULLET_COUNT,
            ease: 'sine.inout',
        })
		;(<Phaser.GameObjects.Shape>this.gauge).setFillStyle(HOLD_BAR_COLOR, 1)
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
        (<Phaser.GameObjects.Shape>this.gauge).setFillStyle(
            HOLD_BAR_EMPTY_COLOR,
            1,
            )
        //        this.gauge.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_EMPTY_COLOR);
    }

    isReducing(): boolean {
        return (
            this.isHoldbarReducing && (<Phaser.GameObjects.Arc>this.gauge).radius > 0
            )
    }

    setStep(step: number): void {
        extraGauge.setVisible(true)
        let y = 0
        const {  width, height } = this.scene.scale
        
        if(step >= 2){
            extraGauge.setRotation(Math.PI)
        } else {
            extraGauge.setRotation(2 * Math.PI)
        }

        if (step === 0) {
            y = height/2 - CIRCLE_GAUGE_MARGIN + 260
            extraGauge.setPosition(width/2, y)
        }
        
        if (step === 1) {
            y = height/2 - CIRCLE_GAUGE_MARGIN + 170
            extraGauge.setPosition(width/2, y)
        }
        
        if (step === 2) {
            y = height/2 - CIRCLE_GAUGE_MARGIN - 170
            extraGauge.setPosition(width/2, y)
        }
        
        if (step === 3) {
            y = height/2 - CIRCLE_GAUGE_MARGIN - 260
            extraGauge.setPosition(width/2, y)
        }
    }

    setVisible(isVisible: boolean) {
        extraGauge.setVisible(isVisible)
    }
}
