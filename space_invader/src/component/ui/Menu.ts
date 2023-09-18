import { MARGIN } from 'config'

export default class Menu {
	private menu!: Phaser.GameObjects.Image

	constructor(scene: Phaser.Scene) {
		const { width } = scene.scale
		this.menu = scene.add
			.image(width - MARGIN / 2, MARGIN / 2, 'pause')
			.setOrigin(1, 0)
		this.menu.scale = 0.5
		this.menu.setInteractive()
		this.menu.on('pointerup', () => {
			this.menu.setTexture('resume')
			scene.scene.pause()
			scene.scene.launch('pause', { menu: this.menu })
		})
	}

	getBody(): Phaser.GameObjects.Image {
		return this.menu
	}
}
