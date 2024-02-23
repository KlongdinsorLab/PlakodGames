import { MARGIN } from 'config'

export default class Menu {
  private menu!: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene) {
    const { width } = scene.scale
    this.menu = scene.add
      .image(width - MARGIN, MARGIN / 2, 'ui', 'pause.png')
      .setOrigin(1, 0)
    this.menu.setInteractive()
    this.menu.on('pointerup', () => {
      this.menu.setTexture('ui', 'play.png')
      scene.scene.pause()
      scene.scene.launch('pause', { menu: this.menu })
    })
  }

  getBody(): Phaser.GameObjects.Image {
    return this.menu
  }
}
