export default class HoldbarRegistry {
    
    createbyDivision(division: number): Phaser.GameObjects.GameObject[] {
        return [...Array(division)].map((_, index: number) => this.createByIndex(index, division));
    }

}