import Holdbar from "./Holdbar";

export default class HoldbarRegistry {
    
    createbyDivision(scene: Phaser.Scene, division: number): Phaser.GameObjects.GameObject[] {
        const holdbar = new Holdbar(scene, division)
        return [...Array(division)].map((_, index: number) => holdbar.createByIndex(index));
    }

}