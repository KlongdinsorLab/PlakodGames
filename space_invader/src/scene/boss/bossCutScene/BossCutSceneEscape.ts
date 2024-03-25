import { BossCutScene, BossTutorialScene } from 'component/enemy/boss/Boss'
import SoundManager from 'component/sound/SoundManager'
import { BOSS_CUTSCENE_DELAY_MS } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'
import WebFont from 'webfontloader'

export default class BossCutSceneEscape extends Phaser.Scene {
	constructor() {
		super({ key: BossCutScene.ESCAPE })
	}

	preload() {
		this.load.script(
			'webfont',
			'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
		)
    this.load.audio('bossEscape', 'sound/boss-escape.mp3')
	}

	create() {
		const { width } = this.scale

    const soundManager = new SoundManager(this)
    const bossEscape = this.sound.add('bossEscape')
    soundManager.play(bossEscape, false)

		const bossText = I18nSingleton.getInstance()
			.createTranslatedText(this, width / 2, 600, 'boss_escape')
			.setOrigin(0.5, 1)
			.setAlpha(0)

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
					.setFontSize('80px')
					.setStroke('#FB511C', 16)
			},
		})

		const path = new Phaser.Curves.Path(0, 0)
		const boss = this.add.follower(path, width / 2, 300, 'b1v1').setOrigin(0.5)

		boss.play('boss-hit')

        const path2 = new Phaser.Curves.Path(width / 2, 300).lineTo(
            width / 2,
            -140,
        )

        setTimeout(() => {
            boss.setPath(path2).startFollow({ duration: 1500 })
        }, 1000)

		setTimeout(() => {
			this.tweens.add({
				targets: bossText,
				duration: 200,
				alpha: 1,
			})
		}, 1500)

		setTimeout(() => {
			this.scene.stop()
			this.scene.launch(BossTutorialScene.COLLECT_ITEM)
			this.scene.resume("bossScene")
		}, BOSS_CUTSCENE_DELAY_MS)
	}
}
