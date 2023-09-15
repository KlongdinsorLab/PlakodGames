import Phaser from 'phaser'
import I18nSingleton from "i18n/I18nSingleton";

export default class PauseScene extends Phaser.Scene {

    constructor() {
        super('pause');
    }

    create() {
        const {width, height} = this.scale
        this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)
        I18nSingleton.getInstance()
            .createTranslatedText(this, width / 2, height / 2, 'pause')
            .setOrigin(0.5, 0.5);

        this.input.once('pointerdown', () => {
            this.scene.resume('game')
            this.scene.stop()
        }, this);
    }
}