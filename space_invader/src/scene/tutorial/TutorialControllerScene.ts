import Phaser from 'phaser'
export default class TutorialControllerScene extends Phaser.Scene {
    constructor() {
        super('tutorial controller');
    }

    create() {
        const { width, height } = this.scale
        this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)
        
        this.add.text(width/2, height/2, "Show Controller").setOrigin(0.5, 0.5)

        this.input.once('pointerdown', () => {
            this.scene.resume('game')
            this.scene.remove('tutorial controller')
        }, this);
    }
}