import Phaser from 'phaser'
import I18nSingleton from 'i18n/I18nSingleton'
import { LARGE_FONT_SIZE, MARGIN, MEDIUM_FONT_SIZE } from 'config'
import i18next from 'i18next'

import {
	getAuth,
	signInWithPhoneNumber,
	RecaptchaVerifier,
	ConfirmationResult,
	browserLocalPersistence,
	setPersistence,
	browserSessionPersistence,
} from 'firebase/auth'


interface DOMEvent<T extends EventTarget> extends Event {
	readonly target: T
}
export default class LoginScene extends Phaser.Scene {
	private background!: Phaser.GameObjects.TileSprite

	constructor() {
		super('login')
	}

	preload() {
		this.load.html('loginForm', 'html/auth/login.html')
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
			.createTranslatedText(this, width / 2, 3 * MARGIN, 'login_title')
			.setFontSize(LARGE_FONT_SIZE)
			.setOrigin(0.5, 0)
		i18n
			.createTranslatedText(
				this,
				width / 2,
				title.y + 2 * MARGIN,
				'login_description',
			)
			.setFontSize(MEDIUM_FONT_SIZE)
			.setOrigin(0.5, 0)

		const element = this.add
			.dom(520, height / 2)
			.createFromCache('loginForm')
			.setScale(1.5)

		element.addListener('submit')

		element.on('submit', async (event: DOMEvent<HTMLInputElement>) => {
			event.preventDefault()
			if (event?.target?.id === 'submit-form') {
				const phoneInput = <HTMLInputElement>element.getChildByID('phone')
				const phoneNumber = this.getPhoneNumber(phoneInput.value)
				this.signIn(phoneNumber)
			}
		})

		const label = <Element>element.getChildByID('label')
		label.textContent = i18next.t('login_input')

		const button = <Element>element.getChildByID('button')
		button.textContent = i18next.t('login_button')
	}

	update() {
		this.background.tilePositionY -= 1
	}

	getPhoneNumber(phoneNumber: string): string {
		if(!phoneNumber.startsWith('0')) return `+66${phoneNumber}`
		return `+66${phoneNumber.substring(1,phoneNumber.length)}`
	}

	async signIn(phoneNumber: string): Promise<void> {
		const auth = getAuth();
		const recaptchaVerifier = new RecaptchaVerifier(auth, 'button', {
			'size': 'invisible'
		});
		try {
			await setPersistence(auth, browserSessionPersistence)
		} catch (e) {
			console.log(e)
			// TODO
		}

		try {
			const confirmationResult: ConfirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
			this.scene.stop()
			this.scene.launch('otp', {confirmationResult})
		} catch (e) {
			// TODO handle ERROR Message
			// reset recaptcha
			console.log(e)
		}

	}
}
