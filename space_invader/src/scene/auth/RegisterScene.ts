import Phaser from 'phaser'
import I18nSingleton from "i18n/I18nSingleton";
import {LARGE_FONT_SIZE, MARGIN, MEDIUM_FONT_SIZE} from "config";

interface DOMEvent<T extends EventTarget> extends Event {
    readonly target: T
}
export default class RegisterScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite

    constructor() {
        super('register')
    }

    preload() {
        this.load.html('registerForm', 'html/auth/register.html');
        this.load.image('background', 'assets/background/purple.png')
    }

    create() {
        const { width, height } = this.scale

        this.background = this.add
			.tileSprite(0, 0, width, height, 'background')
			.setOrigin(0)
			.setScrollFactor(0, 0)

        const i18n = I18nSingleton.getInstance()
        const title = i18n.createTranslatedText(this, width/2, 3* MARGIN, "register_title", undefined, {fontSize:LARGE_FONT_SIZE}).setOrigin(0.5, 0)
        i18n.createTranslatedText(this, width/2, title.y + 2* MARGIN, "register_description", undefined, {fontSize:MEDIUM_FONT_SIZE}).setOrigin(0.5, 0)

        const element = this.add.dom(520, height/2).createFromCache('registerForm').setScale(1.5)

        element.addListener('submit');
        element.on('submit', (event: DOMEvent<HTMLInputElement>) => {
            event.preventDefault()
            if(event?.target?.id === 'submit-form') {
                // TODO
            }
        })

    }

    update() {
        this.background.tilePositionY -= 1
    }
}
