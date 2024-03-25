import I18nSingleton from 'i18n/I18nSingleton'
import { LARGE_FONT_SIZE, MARGIN } from 'config'

export default abstract class InhaleGauge {
	protected scene: Phaser.Scene
	protected division: number
	protected holdButtonDuration = 0
	protected isHoldbarReducing = false
	protected gauge!: Phaser.GameObjects.Shape | Phaser.GameObjects.Graphics

	protected up!: Phaser.GameObjects.Shape | Phaser.GameObjects.Image
	protected down!: Phaser.GameObjects.Shape | Phaser.GameObjects.Image

	protected upText!: Phaser.GameObjects.Text
	protected downText!: Phaser.GameObjects.Text

	protected chargingSound?: Phaser.Sound.BaseSound
	protected chargedSound?: Phaser.Sound.BaseSound

	protected releaseText!: Phaser.GameObjects.Text

	protected steps!: Phaser.GameObjects.Shape[]

	protected constructor(scene: Phaser.Scene, division: number, index: number) {
		this.scene = scene
		this.division = division

		this.createGauge(index)
		this.createUpDownGauge()
		this.chargingSound = this.scene.sound.add('chargingSound')
		this.chargedSound = this.scene.sound.add('chargedSound')

		this.releaseText = I18nSingleton.getInstance()
			.createTranslatedText(
				this.scene,
				this.scene.scale.width / 2,
				4 * MARGIN,
				'release',
			)
			.setFontSize(LARGE_FONT_SIZE)
			.setOrigin(0.5, 0)
		scene.tweens.add({
			targets: this.releaseText,
			scale: 1.25,
			duration: 500,
			yoyo: true,
			repeat: -1,
		})
		this.releaseText.setVisible(false)
	}

	abstract createGauge(index: number): void

	abstract createUpDownGauge(): void

	abstract hold(delta: number): void

	abstract charge(delta: number): void

	abstract release(delta: number): void

	abstract setFullCharge(): void

	abstract set(bulletCount: number): void

	abstract resetting(): void

	abstract deplete(): void

	abstract isReducing(): boolean

//	abstract showUp(): void
//
//	abstract hideUp(): void
//
//	abstract showDown(): void
//
//	abstract hideDown(): void

	abstract setStep(step: number): void

	abstract setVisible(visible: boolean): void

	abstract setVisibleAll(visible: boolean): void

	getBody(): Phaser.GameObjects.Shape | Phaser.GameObjects.Graphics {
		return this.gauge
	}

	getDuratation(): number {
		return this.holdButtonDuration
	}

	//    getBulletCount(){
	//
	//    }

	// setBullet(){}
}
