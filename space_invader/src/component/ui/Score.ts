import { LARGE_FONT_SIZE, MARGIN } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'

export default class Score {
	private score = 0
	private scoreText!: Phaser.GameObjects.Text

	constructor(scene: Phaser.Scene) {
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
