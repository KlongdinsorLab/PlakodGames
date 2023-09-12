import { MARGIN } from "config";

export default class Score {
    
    private score = 0;
    private scoreText!: Phaser.GameObjects.Text;
    
    constructor(scene: Phaser.Scene) {
        this.scoreText = scene.add.text(MARGIN, MARGIN, `score: ${this.score}`, {fontSize: '42px'})
    }
    
    add(added_score: number){
        this.score += added_score
        this.scoreText.text = `score: ${this.score}`
    }
    
}