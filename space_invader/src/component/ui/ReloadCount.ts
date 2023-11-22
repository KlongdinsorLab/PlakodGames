import { BOSS_MULTIPLE_COUNT, LARGE_FONT_SIZE, RELOAD_COUNT } from '../../config'

export default class ReloadCount {
	private reloadCount = RELOAD_COUNT
	private body: Phaser.GameObjects.Text

	constructor(scene: Phaser.Scene, x: number, y: number) {
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
		if(count === 0)
			return false
		return count % BOSS_MULTIPLE_COUNT === 0
	}
}
