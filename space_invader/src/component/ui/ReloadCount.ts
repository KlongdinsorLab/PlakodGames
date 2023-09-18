import { RELOAD_COUNT } from '../../config'

export default class ReloadCount {
	private reloadCount = RELOAD_COUNT
	private body: Phaser.GameObjects.Text

	constructor(scene: Phaser.Scene, x: number, y: number) {
		this.body = scene.add.text(
			x,
			y,
			`${RELOAD_COUNT - this.reloadCount}/${RELOAD_COUNT}`,
			{
				fontSize: '42px',
			},
		)
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
}
