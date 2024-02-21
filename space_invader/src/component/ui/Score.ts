import { LARGE_FONT_SIZE, MARGIN } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'

export default class Score {
	private score = 0
	private scoreText!: Phaser.GameObjects.Text

	constructor(scene: Phaser.Scene) {
		//		scene.add
		//			.nineslice(
		//				0,
		//				MARGIN / 2,
		//				'ui',
		//				'score.png',
		//				242,
		//				97,
		//				96,
		//				24,
		//				16,
		//				16,
		//			)
		//			.setOrigin(0, 0)
		const { width } = scene.scale
		const backgroundGraphic = scene.add.graphics()
		const backgroundWidth = (width - 3 * MARGIN) / 3
		backgroundGraphic.fillStyle(0xffffff, 0.5)
		backgroundGraphic.fillRoundedRect(
			MARGIN,
			MARGIN,
			backgroundWidth,
			MARGIN,
			MARGIN / 2,
		)
		backgroundGraphic.lineStyle(4, 0x57453b, 1)
		backgroundGraphic.strokeRoundedRect(
			MARGIN,
			MARGIN,
			backgroundWidth,
			MARGIN,
			MARGIN / 2,
		)

		this.scoreText = I18nSingleton.getInstance()
			.createTranslatedText(scene, MARGIN, MARGIN, 'score', {
				score: this.score,
			})
			.setFontSize(LARGE_FONT_SIZE)
	}

	add(added_score: number) {
		this.score += added_score
		I18nSingleton.getInstance().setTranslatedText(this.scoreText, 'score', {
			score: this.score,
		})
	}

	getBody(): Phaser.GameObjects.Text {
		return this.scoreText
	}

	getScore(): number {
		return this.score
	}
}
