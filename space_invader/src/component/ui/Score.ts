import { DARK_BROWN, MEDIUM_FONT_SIZE, MARGIN } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'

export default class Score {
  private score = 0
  private scoreText!: Phaser.GameObjects.Text
  private layer: Phaser.GameObjects.Layer

  constructor(scene: Phaser.Scene) {
    const { width } = scene.scale
    this.layer = scene.add.layer()
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
    backgroundGraphic.lineStyle(4, DARK_BROWN, 1)
    backgroundGraphic.strokeRoundedRect(
      MARGIN,
      MARGIN,
      backgroundWidth,
      MARGIN,
      MARGIN / 2,
    )
    this.layer.add(backgroundGraphic)

    const scoreLogo = scene.add.image(backgroundGraphic.x + MARGIN / 2, backgroundGraphic.y + MARGIN / 2, 'ui', 'score.png').setOrigin(0, 0);
    this.layer.add(scoreLogo)

    this.scoreText = scene.add.text(scoreLogo.x + scoreLogo.width, backgroundGraphic.y + MARGIN + 4, `${this.score}`, { fontFamily: 'Jua', color: `#${DARK_BROWN.toString(16)}` })
      .setFontSize(MEDIUM_FONT_SIZE)
    this.layer.add(this.scoreText)
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

  getLayer(): Phaser.GameObjects.Layer {
    return this.layer
  }

  getScore(): number {
    return this.score
  }
}
