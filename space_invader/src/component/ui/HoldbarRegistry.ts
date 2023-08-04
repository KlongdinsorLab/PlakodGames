import Holdbar from "./Holdbar";

export default class HoldbarRegistry {
    
    // TODO  private holdbars!: Phaser.GameObjects.GameObject[] | any[];

    createbyDivision(scene: Phaser.Scene, division: number): Phaser.GameObjects.GameObject[] {
        const holdbar = new Holdbar(scene, division)
        return [...Array(division)].map((_, index: number) => holdbar.createByIndex(index));
    }

}