import Phaser from 'phaser'
import I18nSingleton from 'i18n/I18nSingleton'
import { LARGE_FONT_SIZE, MARGIN, MEDIUM_FONT_SIZE } from 'config'
import i18next from 'i18next'

interface DOMEvent<T extends EventTarget> extends Event {
	readonly target: T
}
export default class OtpScene extends Phaser.Scene {
	private background!: Phaser.GameObjects.TileSprite

	constructor() {
		super('otp')
	}

	preload() {
		this.load.html('otpForm', 'html/auth/otp.html')
		this.load.image('background', 'assets/background/purple.png')
	}

	create() {
		const { width, height } = this.scale

		this.background = this.add
			.tileSprite(0, 0, width, height, 'background')
			.setOrigin(0)
			.setScrollFactor(0, 0)

		const i18n = I18nSingleton.getInstance()
		const title = i18n
			.createTranslatedText(this, width / 2, 3 * MARGIN, 'otp_title')
			.setFontSize(LARGE_FONT_SIZE)
			.setOrigin(0.5, 0)
		i18n
			.createTranslatedText(
				this,
				width / 2,
				title.y + 2 * MARGIN,
				'otp_description',
			)
			.setFontSize(MEDIUM_FONT_SIZE)
			.setOrigin(0.5, 0)

		const element = this.add
			.dom(480, height / 2)
			.createFromCache('otpForm')
			.setScale(1.5)

		element.addListener('submit')
		element.on('submit', (event: DOMEvent<HTMLInputElement>) => {
			event.preventDefault()
			if (event?.target?.id === 'submit-form') {
				let input = ''
				for (let i = 1; i <= 6; i++) {
					const inputElement = <HTMLInputElement>element.getChildByID(`otp${i}`)
					input = input + inputElement.value
				}

				console.log(input)
				// TODO
			}
		})

		element.addListener('paste')
		element.on('paste', (event: ClipboardEvent) => {
			event.preventDefault()
			const paste = event?.clipboardData?.getData('text')
			if (!/^[0-9]{6}?$/.test(paste || '')) return
			for (let i = 1; i <= 6; i++) {
				const inputElement = <HTMLInputElement>element.getChildByID(`otp${i}`)
				inputElement.value = <string>paste?.substring(i - 1, i)
			}
		})

		element.addListener('input')
		element.on('input', (event: DOMEvent<HTMLInputElement>) => {
			const otpId = event.target.id
			const otpIndex = parseInt(otpId.substring('otp'.length, otpId.length))
			if (otpIndex > 6) return
			const nextIndex = event.target.value === '' ? otpIndex - 1 : otpIndex + 1
			const next = <HTMLInputElement>document.getElementById(`otp${nextIndex}`)
			try {
				next.focus()
				// eslint-disable-next-line no-empty
			} catch (e) {}
		})

		const label = <Element>element.getChildByID('label')
		label.textContent = i18next.t('otp_input')

		const button = <Element>element.getChildByID('button')
		button.textContent = i18next.t('otp_button')
	}

	update() {
		this.background.tilePositionY -= 1
	}
}
