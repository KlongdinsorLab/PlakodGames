import CircleInhaleGauge from "./CircleInhaleGauge";

export default class InhaleGaugeRegistry {
    
    private scene: Phaser.Scene
    private holdbars!: Phaser.GameObjects.GameObject[] | any[];

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    createbyDivision(division: number) {
        this.holdbars = [...Array(division)].map((_, index: number) => new CircleInhaleGauge(this.scene, division, index));
    }

    get(index: number): Holdbar {
        return this.holdbars[index]
    }

}