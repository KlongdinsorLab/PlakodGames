import Phaser from 'phaser'
import { MARGIN, LARGE_FONT_SIZE, MODAL_BACKGROUND_COLOR } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'

export default class EndGameScene extends Phaser.Scene {
	private score!: number

	constructor() {
		super('end game')
	}

	init({ score }: { score: number }) {
		this.score = score
	}

	create() {
		const { width, height } = this.scale

		this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)

		const menu = this.add
			.rectangle(
				width / 2,
				height / 2,
				width - 4 * MARGIN,
				height / 2,
				MODAL_BACKGROUND_COLOR,
				0.8,
			)
			.setOrigin(0.5, 0.5)

		const i18n = I18nSingleton.getInstance()
		const title = i18n
			.createTranslatedText(
				this,
				width / 2,
				menu.y - menu.height / 2 + MARGIN,
				'my_score',
				undefined,
				{ fontSize: LARGE_FONT_SIZE },
			)
			.setAlign('center')
			.setOrigin(0.5, 0)
		i18n
			.createTranslatedText(
				this,
				width / 2,
				title.y + MARGIN,
				'score',
				{
					score: this.score,
				},
				{ fontSize: LARGE_FONT_SIZE },
			)
			.setAlign('center')
			.setOrigin(0.5, 0)
	}
}
