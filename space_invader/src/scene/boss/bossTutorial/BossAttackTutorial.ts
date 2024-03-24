import { BossTutorialScene } from 'component/enemy/boss/Boss'
import { BOSS_TUTORIAL_DELAY_MS, LARGE_FONT_SIZE } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'
import WebFont from 'webfontloader'

export default class BossAttackTutorial extends Phaser.Scene {

	constructor() {
		super({ key: BossTutorialScene.ATTACK_BOSS })
	}

	preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
	}

	create() {
		const { width, height } = this.scale

		const bossText = I18nSingleton.getInstance()
			.createTranslatedText(this, width / 2, height / 2, 'boss_attack')
			.setOrigin(0.5, 1)
			.setFontSize(LARGE_FONT_SIZE).setAlpha(0)

		const bossImage = this.add.image(width / 2, -140, 'b1v1', 'b1v1_attack_00000.png').setOrigin(0.5, 1)

		WebFont.load({
			google: {
				families: ['Mali'],
			},
			active: function () {
				const bossTutorialUiStyle = {
					fontFamily: 'Mali',
				}

				bossText
					.setStyle({
						...bossTutorialUiStyle,
						color: 'white',
						fontWeight: 700,
					})
					.setFontSize('6em')
					.setStroke('#FB511C', 12)
			},
		})

        this.tweens.add({
            targets: bossText,
            duration: 200,
            alpha: 1,
        })

		this.tweens.add({
			targets: bossImage,
			y: 480,
			duration: 1000,
			repeat: 0,
			ease: 'sine.out',
		})

		setTimeout(() => {
			this.scene.stop()
		}, BOSS_TUTORIAL_DELAY_MS)
	}
}
