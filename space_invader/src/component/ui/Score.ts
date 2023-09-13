import { MARGIN } from "config";
import i18next from 'i18next';

export default class Score {
    
    private score = 0;
    private scoreText!: Phaser.GameObjects.Text;
    
    constructor(scene: Phaser.Scene) {
        this.scoreText = scene.add.text(MARGIN, MARGIN, i18next.t("score", {score: this.score}), {fontSize: '42px'})
    }
    
    add(added_score: number){
        this.score += added_score
        this.scoreText.text = i18next.t("score", {score: this.score})
    }

    getBody(){
        return this.scoreText
    }

}