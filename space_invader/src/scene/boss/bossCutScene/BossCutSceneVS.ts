import { BossCutScene, BossName } from 'component/enemy/boss/Boss'
import I18nSingleton from 'i18n/I18nSingleton'
import WebFont from 'webfontloader'
import { BossInterface } from '../bossInterface'

export default class BossCutSceneVS extends Phaser.Scene {
	private background!: Phaser.GameObjects.TileSprite
	private props!: BossInterface

	constructor() {
		super({ key: BossCutScene.VS })
	}

	preload() {
		this.load.image('boss_cutscene_background', 'assets/background/bg_set5_cutscene.png')
		this.load.atlas(
			'player',
			'assets/character/player/mc_spritesheet.png',
			'assets/character/player/mc_spritesheet.json',
		)

		this.load.atlas(
			'b1v1',
			'assets/character/enemy/b1v1_spritesheet.png',
			'assets/character/enemy/b1v1_spritesheet.json',
		)
	}

	init(props: BossInterface) {
		this.props = props
	}

	create() {
		const { width, height } = this.scale
		const { score,	playerX, reloadCount} = this.props

		this.background = this.add
			.tileSprite(0, 0, width, height, 'boss_cutscene_background')
			.setOrigin(0)
			.setScrollFactor(0, 0)

		this.background.tilePositionY = 1

		const bossImage = this.add.image(-350, 500, 'b1v1', 'b1v1_attack_00000.png').setOrigin(0.5, 1).setScale(2.0);
		const playerImage = this.add.image(850, 1200, 'player', 'mc_attack_00001.png').setOrigin(0.5, 1).setScale(2.5);
		const rectangleBox = this.add.rectangle(width / 2, 630, 2 * width, 50, 0x000000)
		rectangleBox.angle = -30

		const bossText = this.add.text(width / 2, 760, "VS",)
			.setOrigin(0.5, 1)
		const bossName = I18nSingleton.getInstance()
			.createTranslatedText(this, -320, 280, 'alien_boss_name')
			.setOrigin(0.5, 1)
		const playerName = I18nSingleton.getInstance()
			.createTranslatedText(this, 800, 950, 'player_name')
			.setOrigin(0.5, 1)

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
						fontWeight: 900,
					})
					.setFontSize('200px')
					.setStroke('#000000', 36)

				bossName.setStyle({
					...bossTutorialUiStyle,
					color: 'white',
					fontWeight: 800,
				})
				.setFontSize('7em')
				.setStroke('#FB511C', 18)

				playerName.setStyle({
					...bossTutorialUiStyle,
					color: 'white',
					fontWeight: 800,
				})
				.setFontSize('7em')
				.setStroke('#FB511C', 18)
			},
		})

		this.tweens.add({
			targets: bossImage,
			x: 220,
			duration: 1000,
			repeat: 0,
			ease: 'bounce.out',
		})
		this.tweens.add({
			targets: bossName,
			x: 530,
			duration: 1000,
			repeat: 0,
			ease: 'bounce.out',
		})
		this.tweens.add({
			targets: playerImage,
			x: 500,
			duration: 1000,
			repeat: 0,
			ease: 'bounce.out',
		})
		this.tweens.add({
			targets: playerName,
			x: 220,
			duration: 1000,
			repeat: 0,
			ease: 'bounce.out',
		})

		setTimeout(() => {
			this.scene.stop()
			this.scene.start("bossScene", {
				name: BossName.B1,
				score: score,
				playerX: playerX,
				reloadCount: reloadCount,
			  	}
			  )
		}, 3000)
	}
}
