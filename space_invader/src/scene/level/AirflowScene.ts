import Phaser from 'phaser'
import I18nSingleton from 'i18n/I18nSingleton'
import { LARGE_FONT_SIZE, MARGIN, MEDIUM_FONT_SIZE } from 'config'
import i18next from 'i18next'

interface DOMEvent<T extends EventTarget> extends Event {
    readonly target: T
}
export default class AirflowScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite

    constructor() {
        super('airflow')
    }

    preload() {
        this.load.html('airflowForm', 'html/level/airflow.html')
        this.load.image('background', 'assets/background/purple.png')
    }

    create() {
        const { width, height } = this.scale

        this.background = this.add
			.tileSprite(0, 0, width, height, 'background')
			.setOrigin(0)
			.setScrollFactor(0, 0)

        const i18n = I18nSingleton.getInstance()
        const title = i18n
			.createTranslatedText(this, width / 2, 3 * MARGIN, 'airflow_title')
			.setFontSize(LARGE_FONT_SIZE)
			.setOrigin(0.5, 0)
        i18n
			.createTranslatedText(
                this,
                width / 2,
                title.y + 2 * MARGIN,
                'airflow_description',
                )
			.setFontSize(MEDIUM_FONT_SIZE)
			.setOrigin(0.5, 0)

        const element = this.add
			.dom(width/2, height / 2)
			.createFromCache('airflowForm')
			.setScale(1.5)

        element.addListener('click')
        element.on('click', (event: DOMEvent<HTMLInputElement>) => {
            //			event.preventDefault()
            this.scene.stop()
            this.scene.launch('game')
        })

    }

    update() {
        this.background.tilePositionY -= 1
    }
}
