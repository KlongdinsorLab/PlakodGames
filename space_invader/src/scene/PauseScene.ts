import Phaser from 'phaser'
import i18next from 'i18next';

export default class PauseScene extends Phaser.Scene {

    constructor() {
        super('pause');
    }

    create() {
        const {width, height} = this.scale
        this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)
        this.add.text(width / 2, height / 2, i18next.t('pause')).setOrigin(0.5, 0.5)

        this.input.once('pointerdown', () => {
            this.scene.resume('game')
            this.scene.stop()
        }, this);
    }
}