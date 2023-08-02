import {HOLD_BAR_BORDER, HOLD_BAR_COLOR, HOLD_BAR_HEIGHT, HOLD_BAR_IDLE_COLOR, MARGIN} from "../../config";

export default class Holdbar {

    private scene: Phaser.Scene
    private SPACE_BETWEEN_MARGIN_SCALE = 0.5
    private division: number

    constructor(scene: Phaser.Scene, division: number) {
        this.scene = scene
        this.division = division
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

    create(x: number, y: number, width: number): Phaser.GameObjects.GameObject {
        const holdbar = this.scene.add.rectangle(x, y, width, HOLD_BAR_HEIGHT, HOLD_BAR_COLOR)
            .setOrigin(0, 1);
        holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
        return holdbar
    }

    createByIndex(index: number): Phaser.GameObjects.GameObject {
        const x = this.getX(index)
        const y = this.getY()
        const width = this.getWidth()
        const holdbar = this.create(x, y, width)
        this.scene.tweens.add({
            targets: holdbar,
            width: HOLD_BAR_BORDER / 2,
            duration: 0,
            ease: 'sine.inout'
        });
        return holdbar
    }

    createbyDivision(): Phaser.GameObjects.GameObject[] {
        return [...Array(this.division)].map((_, index: number) => this.createByIndex(index));
    }
    
    
    charge() {
        console.log("charge")
    }
    
    release() {
        console.log("release")
    }
    
//    getBulletCount(){
//        
//    }
    
    // setBullet(){}
    
    // reset() {}
    
    

}