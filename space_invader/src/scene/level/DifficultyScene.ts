import Phaser from 'phaser'
import I18nSingleton from 'i18n/I18nSingleton'
import { LARGE_FONT_SIZE, MARGIN, MEDIUM_FONT_SIZE } from 'config'
import i18next from 'i18next'

interface DOMEvent<T extends EventTarget> extends Event {
	readonly target: T
}
export default class DifficultyScene extends Phaser.Scene {
	private background!: Phaser.GameObjects.TileSprite

	constructor() {
		super('difficulty')
	}

	preload() {
		this.load.html('difficultyForm', 'html/level/difficulty.html')
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
			.createTranslatedText(this, width / 2, 3 * MARGIN, 'difficulty_title')
			.setFontSize(LARGE_FONT_SIZE)
			.setOrigin(0.5, 0)
		i18n
			.createTranslatedText(
				this,
				width / 2,
				title.y + 2 * MARGIN,
				'difficulty_description',
				)
			.setFontSize(MEDIUM_FONT_SIZE)
			.setOrigin(0.5, 0)

		const element = this.add
			.dom(width/2, height / 2)
			.createFromCache('difficultyForm')
			.setScale(1.5)
		const easyButton = <HTMLButtonElement>element.getChildByID('easy')
		easyButton.textContent = i18next.t('difficulty_easy')
		
		const mediumButton = <HTMLButtonElement>element.getChildByID('medium')
		mediumButton.textContent = i18next.t('difficulty_medium')
		
		const hardButton = <HTMLButtonElement>element.getChildByID('hard')
		hardButton.textContent = i18next.t('difficulty_hard')
		
		element.addListener('click')
		element.on('click', (_: DOMEvent<HTMLInputElement>) => {
//			if(event?.target?.id === '')
//			event.preventDefault()
			this.scene.stop()
			this.scene.launch('airflow')
		})
		
		const easyLabel = <Element>element.getChildByID('easy-description')
		easyLabel.textContent = i18next.t('difficulty_easy_description')

		const mediumLabel = <Element>element.getChildByID('medium-description')
		mediumLabel.textContent = i18next.t('difficulty_medium_description')
		
		const hardLabel = <Element>element.getChildByID('hard-description')
		hardLabel.textContent = i18next.t('difficulty_hard_description')
		
	}

	update() {
		this.background.tilePositionY -= 1
	}
}
