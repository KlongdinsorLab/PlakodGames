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

export default abstract class InhaleGauge {

    private scene: Phaser.Scene
    private division: number
    private holdButtonDuration = 0
    private isHoldbarReducing = false
    private gauge: Phaser.GameObjects.Shape
    
    private up!: Phaser.GameObjects;
    private down!: Phaser.GameObjects;
    
    private chargingSound?: Phaser.Sound.BaseSound
    private chargedSound?: Phaser.Sound.BaseSound
    

    constructor(scene: Phaser.Scene, division: number, index: number) {
        this.scene = scene
        this.division = division

        this.createGauge(index)
        this.createUpDownGauge()
        this.chargingSound = this.scene.sound.add('chargingSound')
        this.chargedSound = this.scene.sound.add('chargedSound')
    }

    abstract createGauge(): void;
    
    abstract createUpDownGauge(): void;

    abstract hold(delta: number): void;

    abstract charge(delta: number): void;

    abstract release(delta: number): void;

    abstract setFullCharge(): void;

    abstract reset(): void;

    abstract resetting(): void;

    abstract deplete(): void;

    abstract isReducing(): boolean;
    
    abstract showUp(): void;
    
    abstract hideUp(): void;
    
    abstract showDown(): void;

    abstract hideDown(): void;
    

    getDuratation(): number {
        return this.holdButtonDuration
    }

//    getBulletCount(){
//        
//    }

    // setBullet(){}

}
