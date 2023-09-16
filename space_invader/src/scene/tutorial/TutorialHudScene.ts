import Phaser from 'phaser'
import Score from "component/ui/Score";
import InhaleGauge from "component/ui/InhaleGauge";

export type Hud = {
    score: Score
    gauge: InhaleGauge
    menu: Phaser.GameObjects.Image
}

export default class TutorialHudScene extends Phaser.Scene {
 
    private score!: Score
    private gauge!: InhaleGauge
    private menu!: Phaser.GameObjects.Image
    
    constructor() {
        super('tutorial HUD');
    }
    
    init({score, gauge, menu}: Hud){
        this.score = score
        this.gauge = gauge
        this.menu = menu
    }

    create() {
        const { width, height } = this.scale
        this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)
        
        this.add.text(this.score.getBody().x, this.score.getBody().y, "score").setOrigin(0.5, 0.5)
        this.add.text(this.gauge.getBody().x, this.gauge.getBody().y, "gauge").setOrigin(0.5, 0.5)
        this.add.text(this.menu.x, this.menu.y, "menu").setOrigin(0.5, 0.5)
        
        this.input.once('pointerdown', () => {
            this.scene.resume('game')
            this.scene.setVisible(false)
        }, this);
    }
}