export default abstract class InhaleGauge {

    protected scene: Phaser.Scene
    protected division: number
    protected holdButtonDuration = 0
    protected isHoldbarReducing = false
    protected gauge!: Phaser.GameObjects.Shape
    
    protected up!: Phaser.GameObjects.Shape | Phaser.GameObjects.Image;
    protected down!: Phaser.GameObjects.Shape | Phaser.GameObjects.Image;
    
    protected chargingSound?: Phaser.Sound.BaseSound
    protected chargedSound?: Phaser.Sound.BaseSound

    protected constructor(scene: Phaser.Scene, division: number, index: number) {
        this.scene = scene
        this.division = division

        this.createGauge(index)
        this.createUpDownGauge()
        this.chargingSound = this.scene.sound.add('chargingSound')
        this.chargedSound = this.scene.sound.add('chargedSound')
    }

    abstract createGauge(index: number): void;
    
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
