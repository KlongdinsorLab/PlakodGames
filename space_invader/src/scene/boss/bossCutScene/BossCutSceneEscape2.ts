import { BossCutScene } from 'component/enemy/boss/Boss'
import { RELOAD_COUNT } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'
import WebFont from 'webfontloader'

export default class BossTransition extends Phaser.Scene {
	private score = 0
	private reloadCount = RELOAD_COUNT

	constructor() {
		super({ key: BossCutScene.ESCAPE2 })
	}

	init({ score, reloadCount }: { score: number; reloadCount: number }) {
		this.score = score
		this.reloadCount = reloadCount
	}

	preload() {
		this.load.script(
			'webfont',
			'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
		)
		this.load.image('smoke', 'assets/background/smoke-transition.png')
	}

	create() {
		const { width, height } = this.scale

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
		const boss = this.add.follower(path, width / 2, 300, 'alien').setOrigin(0.5)
		const path2 = new Phaser.Curves.Path(width / 2, 300).lineTo(width / 2, -140)
    
    const smoke = this.add.image(0, height / 2, 'smoke').setOrigin(1, 0.5)

		setTimeout(() => {
      boss.play('boss-hit')
			boss.setPath(path2).startFollow({ duration: 1000 })
		}, 1000)

		setTimeout(() => {
			this.tweens.add({
				targets: bossText,
				duration: 200,
				alpha: 1,
			})

      this.tweens.add({
        targets: smoke,
        x: smoke.width,
        duration: 3500,
        repeat: 0,
        ease: 'sine.out',
        onComplete: () => {
          if (this.reloadCount === 0) {
            this.scene.launch('end game', { score: this.score })
          } else {
            this.scene.launch('game', {
              score: this.score,
              reloadCount: this.reloadCount,
              isCompleteBoss: true,
            })
          }
          this.scene.stop()
          this.scene.stop('bossScene')
        },
      })
		}, 1000)
	}
}
