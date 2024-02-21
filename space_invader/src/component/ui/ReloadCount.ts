import {
	BOSS_MULTIPLE_COUNT,
	LARGE_FONT_SIZE,
	MARGIN,
	RELOAD_COUNT,
} from '../../config'

export default class ReloadCount {
	private reloadCount = RELOAD_COUNT
	private body: Phaser.GameObjects.Text

	constructor(scene: Phaser.Scene, x: number, y: number) {
		//		const { width } = scene.scale
		//		scene.add
		//			.nineslice(
		//				width / 2,
		//				MARGIN / 2,
		//				'ui',
		//				'lap.png',
		//				208,
		//				77,
		//				96,
		//				24,
		//				16,
		//				16,
		//			)
		//			.setOrigin(0.5, 0)
		const { width } = scene.scale
		const backgroundGraphic = scene.add.graphics()
		const backgroundWidth = (width - 3 * MARGIN) / 3
		backgroundGraphic.fillStyle(0xffffff, 0.5)
		backgroundGraphic.fillRoundedRect(
			width / 2 - backgroundWidth/2 + MARGIN,
			MARGIN,
			backgroundWidth,
			MARGIN,
			MARGIN / 2,
		)
		backgroundGraphic.lineStyle(4, 0x57453b, 1)
		backgroundGraphic.strokeRoundedRect(
			width / 2 - backgroundWidth/2 + MARGIN,
			MARGIN,
			backgroundWidth,
			MARGIN,
			MARGIN / 2,
		)
		this.body = scene.add
			.text(x, y, `${RELOAD_COUNT - this.reloadCount}/${RELOAD_COUNT}`)
			.setFontSize(LARGE_FONT_SIZE)
	}

	getBody(): Phaser.GameObjects.Text {
		return this.body
	}

	private getCountText(count: number): string {
		return `${RELOAD_COUNT - count}/${RELOAD_COUNT}`
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
