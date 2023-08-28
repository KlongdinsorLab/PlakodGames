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
    MARGIN
} from "../../config";

export default class Holdbar {

    private scene: Phaser.Scene
    private SPACE_BETWEEN_MARGIN_SCALE = 0.5
    private division: number
    private holdButtonDuration = 0
    private isHoldbarReducing = false
    private holdbar: Phaser.GameObjects.Rectangle
    private chargingSound?: Phaser.Sound.BaseSound
    private chargedSound?: Phaser.Sound.BaseSound

    constructor(scene: Phaser.Scene, division: number, index: number) {
        this.scene = scene
        this.division = division

        const x = this.getX(index)
        const y = this.getY()
        const width = this.getWidth()
        this.holdbar = this.create(x, y, width)
        this.scene.tweens.add({
            targets: this.holdbar,
            width: HOLD_BAR_BORDER / 2,
            duration: 0,
            ease: 'sine.inout'
        });
        this.chargingSound = this.scene.sound.add('chargingSound')
        this.chargedSound = this.scene.sound.add('chargedSound')
    }

    getWidth(): number {
        const {width} = this.scene.scale
        const totalMargin = 2 * MARGIN
        const betweenMargin = this.SPACE_BETWEEN_MARGIN_SCALE * (this.division - 1) * MARGIN
        return (width - totalMargin - betweenMargin) / this.division
    }

    getX(index: number): number {
        const width = this.getWidth()
        const spaceBetween = this.SPACE_BETWEEN_MARGIN_SCALE * MARGIN
        return MARGIN + (index * (width + spaceBetween))
    }

    getY(): number {
        const {height} = this.scene.scale
        return height - MARGIN + HOLD_BAR_BORDER
    }

    create(x: number, y: number, width: number): Phaser.GameObjects.Rectangle {
        const holdbar = this.scene.add.rectangle(x, y, width, HOLD_BAR_HEIGHT, HOLD_BAR_COLOR)
            .setOrigin(0, 1);
        holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
        return holdbar
    }

    getHoldWithIncrement(delta: number): number {
        return (this.getWidth() + HOLD_BAR_BORDER) / (HOLD_DURATION_MS / delta)
    }

    hold(delta: number) {
        this.isHoldbarReducing = false
        this.holdButtonDuration += delta;
    }

    charge(delta: number) {
        this.holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGING_COLOR);
        this.holdbar.width += this.getHoldWithIncrement(delta)
        if(!this.chargingSound?.isPlaying) this.chargingSound?.play()
    }

    release(delta: number) {
        this.holdbar.width -= this.getHoldWithIncrement(delta) * HOLDBAR_REDUCING_RATIO
        this.holdButtonDuration -= delta * HOLDBAR_REDUCING_RATIO
        if(!this.chargingSound?.isPaused) this.chargingSound?.pause()
    }

    setFullCharge() {
        this.holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGED_COLOR);
        if(!this.chargedSound?.isPlaying) this.chargedSound?.play()
    }

    reset() {
        this.scene.tweens.add({
            targets: this.holdbar,
            width: HOLD_BAR_BORDER / 2,
            duration: LASER_FREQUENCY_MS * BULLET_COUNT,
            ease: 'sine.inout'
        });
        this.holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
        this.holdButtonDuration = 0
        setTimeout(()=> this.holdButtonDuration = 0, LASER_FREQUENCY_MS * BULLET_COUNT)
    }

    resetting(){
        this.holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
        this.isHoldbarReducing = true
    }

    deplete() {
        this.holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_EMPTY_COLOR);
    }

    isReducing(): boolean{
        return this.isHoldbarReducing && this.holdbar.width > 0
    }
    
    getDuratation(): number{
        return this.holdButtonDuration
    }

//    getBulletCount(){
//        
//    }
    
    // setBullet(){}

}
