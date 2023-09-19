import i18next from 'i18next'
import en from 'i18n/translation/en.json' assert { type: 'json' }
import th from 'i18n/translation/th.json' assert { type: 'json' }

export default class I18nSingleton {
	private static instance: I18nSingleton
	private emitter!: Phaser.Events.EventEmitter

	private constructor() {
		if (i18next.isInitialized) return
		i18next?.init({
			lng: localStorage.getItem('language') || navigator.language,
			debug: false,
			resources: {
				en: {
					translation: en,
				},
				th: {
					translation: th,
				},
			},
		})
		this.emitter = new Phaser.Events.EventEmitter()
	}

	public static getInstance(): I18nSingleton {
		if (!I18nSingleton.instance) {
			I18nSingleton.instance = new I18nSingleton()
		}

		return I18nSingleton.instance
	}

	getLanguage(): string {
		return i18next?.language
	}

	setLanguage(language: string) {
		localStorage.setItem('language', language)
		i18next?.changeLanguage(language, () => this.emitter.emit('setText'))
	}

	setTranslatedText(
		text: Phaser.GameObjects.Text,
		key: string,
		options?: any,
	): void {
		this.setTextByKey(text, key, options)
		this.emitter.on('setText', () => this.setTextByKey(text, key, options))
	}

	private setTextByKey(
		text: Phaser.GameObjects.Text,
		key: string,
		options?: any,
	): void {
		text.setText(i18next.t(key, options))
	}

	createTranslatedText(
		scene: Phaser.Scene,
		x: number,
		y: number,
		key: string,
		options?: any,
		style?: Phaser.Types.GameObjects.Text.TextStyle,
	): Phaser.GameObjects.Text {
		const text = scene.add.text(x, y, i18next.t(key, options), style)
		this.emitter.on('setText', () => this.setTextByKey(text, key, options))
		return text
	}

	destroyEmitter() {
		this.emitter.removeListener('setText')
	}

	removeAllListeners(scene: Phaser.Scene) {
		scene.events.removeAllListeners()
	}
}
