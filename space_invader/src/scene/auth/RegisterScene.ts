import Phaser from 'phaser'
import I18nSingleton from 'i18n/I18nSingleton'
import { LARGE_FONT_SIZE, MARGIN, MEDIUM_FONT_SIZE } from 'config'
import i18next from "i18next";
import { getAuth, updateProfile } from 'firebase/auth'

interface DOMEvent<T extends EventTarget> extends Event {
	readonly target: T
}
export default class RegisterScene extends Phaser.Scene {
	private background!: Phaser.GameObjects.TileSprite

	constructor() {
		super('register')
	}

	preload() {
		this.load.html('registerForm', 'html/auth/register.html')
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
			.createTranslatedText(this, width / 2, 3 * MARGIN, 'register_title')
			.setFontSize(LARGE_FONT_SIZE)
			.setOrigin(0.5, 0)
		i18n
			.createTranslatedText(
				this,
				width / 2,
				title.y + 2 * MARGIN,
				'register_description',
			)
			.setFontSize(MEDIUM_FONT_SIZE)
			.setOrigin(0.5, 0)

		const element = this.add
			.dom(width/2, height / 2)
			.createFromCache('registerForm')
			.setScale(1.5)

		element.addListener('submit')

		element.on('submit', (event: DOMEvent<HTMLInputElement>) => {
			event.preventDefault()
			if (event?.target?.id !== 'submit-form') return
			const birthdayElement = <HTMLInputElement>element.getChildByID('birthday')
			const birthday = birthdayElement.value
			birthdayElement.classList.remove("input-error");

			const genderElement = <HTMLInputElement>element.getChildByID('gender')
			const gender = genderElement.value

			const diseaseElement = <HTMLInputElement>element.getChildByID('disease')
			const disease = diseaseElement.value

			const birthdayRegex = /^((?:19|20)[0-9]{2})-[0-1][0-2]-[0-3][0-9]?$/
			if(!birthdayRegex.test(birthday)) {
				birthdayElement.classList.add("input-error");
				// TODO
				console.log('Please select your birthday')
				return
			}

			this.updateProfile(birthday, gender, disease)
		})

		const birthday = <Element>element.getChildByID('label-birthday')
		birthday.textContent = i18next.t('register_birthday_title')

		const gender = <Element>element.getChildByID('label-gender')
		gender.textContent = i18next.t('register_gender_title')

		const disease = <Element>element.getChildByID('label-disease')
		disease.textContent = i18next.t('register_disease_title')
	}

	update() {
		this.background.tilePositionY -= 1
	}

	async updateProfile(birthday: string, gender: string, disease: string) {
// 		TODO add database
		const auth = getAuth()
		const user = auth.currentUser;
//		await updateProfile(user!, {
//			displayName: "Test User"
//		})
		this.scene.stop()
		this.scene.launch('difficulty')
	}
}
