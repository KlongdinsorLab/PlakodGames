import {
  BOSS_MULTIPLE_COUNT,
  DARK_BROWN,
  MEDIUM_FONT_SIZE,
  MARGIN,
  RELOAD_COUNT,
} from '../../config'

export default class ReloadCount {
  private reloadCount = RELOAD_COUNT
  private body: Phaser.GameObjects.Text
  private layer: Phaser.GameObjects.Layer

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const { width } = scene.scale
    this.layer = scene.add.layer()
    const backgroundGraphic = scene.add.graphics()
    const backgroundWidth = (width - 3 * MARGIN) / 3
    const startX = width / 2 - backgroundWidth / 2 + MARGIN
    backgroundGraphic.fillStyle(0xffffff, 0.5)
    backgroundGraphic.fillRoundedRect(
      startX,
      MARGIN,
      backgroundWidth,
      MARGIN,
      MARGIN / 2,
    )
    backgroundGraphic.lineStyle(4, DARK_BROWN, 1)
    backgroundGraphic.strokeRoundedRect(
      startX,
      MARGIN,
      backgroundWidth,
      MARGIN,
      MARGIN / 2,
    )
    this.layer.add(backgroundGraphic)
    const logo = scene.add.image(backgroundGraphic.x + startX - MARGIN / 2, backgroundGraphic.y + MARGIN / 2, 'ui', 'lap.png').setOrigin(0, 0);
    this.layer.add(logo)
    this.body = scene.add
      .text(x + logo.width / 2 + MARGIN / 2, y + 4, `${RELOAD_COUNT - this.reloadCount}/${RELOAD_COUNT}`)
      .setFontSize(MEDIUM_FONT_SIZE)
    this.layer.add(this.body)
  }

  getBody(): Phaser.GameObjects.Text {
    return this.body
  }

  getLayer(): Phaser.GameObjects.Layer {
    return this.layer
  }

  private getCountText(count: number): string {
    return `${RELOAD_COUNT - count} / ${RELOAD_COUNT}`
  }

  getCount(): number {
    return this.reloadCount
  }

  setCount(count: number): void {
    this.reloadCount = count
    this.body.setText(this.getCountText(count))
  }

  decrementCount(): void {
    this.reloadCount--
    this.setCount(this.reloadCount)
  }

  isDepleted(): boolean {
    return this.reloadCount <= 0
  }

  isBossShown(): boolean {
    const count = RELOAD_COUNT - this.reloadCount
    if (count === 0) return false
    return count % BOSS_MULTIPLE_COUNT === 0
  }
}
