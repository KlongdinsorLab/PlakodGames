import Phaser from 'phaser'
import I18nSingleton from 'i18n/I18nSingleton'
import { MARGIN } from 'config'
import SoundManager from 'component/sound/SoundManager'

export type Menu = {
	menu: Phaser.GameObjects.Image
}
export default class PauseScene extends Phaser.Scene {
	private menu!: Phaser.GameObjects.Image

	constructor() {
		super('pause')
	}

	init({ menu }: Menu) {
		this.menu = menu
	}

	preload() {
		this.load.svg('mute', 'assets/icon/mute.svg')
		this.load.svg('unmute', 'assets/icon/unmute.svg')
	}

	create() {
		const soundManager = new SoundManager(this)
		soundManager.pauseAll()

		const { width, height } = this.scale

		this.add.rectangle(0, 0, width, height, 0x000000, 0.75).setOrigin(0, 0)

		const i18n = I18nSingleton.getInstance()

		const menu = this.add
			.rectangle(
				width / 2,
				height / 2,
				width - 4 * MARGIN,
				height / 2,
				0x473d4d,
				0.8,
			)
			.setOrigin(0.5, 0.5)

		i18n
			.createTranslatedText(
				this,
				width / 2,
				menu.y - menu.height / 2 - MARGIN,
				'pause',
				undefined,
				{ fontSize: '42px' },
			)
			.setOrigin(0.5, 1)

		const sound = new SoundManager(this).createSoundToggle(
			width / 2 - MARGIN,
			menu.y - menu.height / 2 + 1.5 * MARGIN,
		)

		const language = i18n.createTranslatedText(
			this,
			width / 2 + MARGIN,
			sound.y - MARGIN / 2,
			'language_flag',
			undefined,
			{ fontSize: '80px' },
		)

		language.setInteractive()
		language.on('pointerup', () => {
			i18n.setLanguage(i18n.getLanguage() === 'th' ? 'en' : 'th')
		})

		const resume = this.add
			.rectangle(
				width / 2,
				menu.y - menu.height / 2 + 4 * MARGIN,
				menu.width - 2 * MARGIN,
				96,
				0x999999,
			)
			.setOrigin(0.5, 0.5)
		i18n
			.createTranslatedText(this, resume.x, resume.y, 'resume', undefined, {
				fontSize: '42px',
			})
			.setOrigin(0.5, 0.5)
		resume.setInteractive()
		resume.on('pointerup', () => {
			soundManager.resumeAll()
			this.menu.setTexture('pause')
			this.scene.resume('game')
			this.scene.stop()
		})

		const restart = this.add
			.rectangle(
				width / 2,
				resume.y + 3 * MARGIN,
				menu.width - 2 * MARGIN,
				96,
				0x999999,
			)
			.setOrigin(0.5, 0.5)
		i18n
			.createTranslatedText(this, restart.x, restart.y, 'restart', undefined, {
				fontSize: '42px',
			})
			.setOrigin(0.5, 0.5)
		restart.setInteractive()
		restart.on('pointerup', () => {
			this.scene.stop()
			this.scene.stop('game')
			i18n.destroyEmitter()
			this.scene.start('game')
		})

		const home = this.add
			.rectangle(
				width / 2,
				restart.y + 3 * MARGIN,
				menu.width - 2 * MARGIN,
				96,
				0x999999,
			)
			.setOrigin(0.5, 0.5)
		i18n
			.createTranslatedText(this, home.x, home.y, 'home', undefined, {
				fontSize: '42px',
			})
			.setOrigin(0.5, 0.5)
		home.setInteractive()
		home.on('pointerup', () => {
			this.scene.stop()
			this.scene.stop('game')
			i18n.destroyEmitter()
			this.scene.start('title')
		})
	}
}
