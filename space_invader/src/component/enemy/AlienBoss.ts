import Player from 'component/player/Player'
import Score from 'component/ui/Score'

import {
	DESTROY_METEOR_SCORE,
	BOSS_HIT_DELAY_MS,
	FIRST_STAGE_BOSS_TIME_MS,
	SECOND_STAGE_BOSS_TIME_MS,
	LARGE_FONT_SIZE,
} from 'config'
import SoundManager from 'component/sound/SoundManager'
import I18nSingleton from 'i18n/I18nSingleton'
import { Boss } from './Boss'

let isHit = false

export enum BOSS {
	ALIEN = 'alien',
}

export class AlienBoss extends Boss {
	private soundManager: SoundManager
	private bossText!: Phaser.GameObjects.Text
	private isCutSceneShown!: boolean
	private isItemPhase!: boolean

	constructor(scene: Phaser.Scene, player: Player, score: Score) {
		const { width, height } = scene.scale
		super(scene, player, score)
		this.soundManager = new SoundManager(scene)

		this.bossText = I18nSingleton.getInstance()
			.createTranslatedText(this.scene, width / 2, height / 2, 'boss_attack')
			.setOrigin(0.5, 1)
			.setFontSize(LARGE_FONT_SIZE)
		this.scene.tweens.add({
			targets: this.bossText,
			scale: 1.25,
			duration: 500,
			yoyo: true,
			repeat: -1,
		})
		this.bossText.setVisible(false)
		this.isCutSceneShown = false
	}

	create(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
		const { width } = this.scene.scale
		const path = new Phaser.Curves.Path(0, 0)
		this.scene.anims.create({
			key: 'boss-move',
			frames: this.scene.anims.generateFrameNames('bossMove', {
				prefix: 'alienv1_attack_',
				suffix: '.png',
				start: 0,
				end: 24,
				zeroPad: 5,
			}),
			frameRate: 24,
			repeat: -1,
		})
		this.scene.anims.create({
			key: 'boss-hit',
			frames: this.scene.anims.generateFrameNames('bossHit', {
				prefix: 'alienv1_hurt_',
				suffix: '.png',
				start: 2,
				end: 2,
				zeroPad: 5,
			}),
			frameRate: 24,
			repeat: -1,
		})

		this.enemy = this.scene.add
			.follower(path, width / 2, -140, 'bossMove')
			.setOrigin(0.5)
		this.enemy.play('boss-move')

		this.scene.physics.world.enable(this.enemy)
		return this.enemy
	}

	path(): void {}

	move(): void {
		const { width } = this.scene.scale
		const randomVector = [...Array(5)].map((_) => {
			return new Phaser.Math.Vector2(
				Math.floor(Math.random() * width),
				Math.floor(Math.random() * width),
			)
		})
		const path = new Phaser.Curves.Path(this.enemy.x, this.enemy.y)
			.lineTo(width / 2, 350)
			.circleTo(100)
			.splineTo(randomVector)
			.circleTo(60)
			.lineTo(width / 2, 100)
			.lineTo(width + 200, 400)
			.lineTo(-200, 400)
		this.enemy.setPath(path)
		this.enemy.startFollow({
			positionOnPath: true,
			duration: 7000,
			yoyo: true,
			repeat: -1,
			rotateToPath: false,
		})
	}

	attack(): void {
		this.move()
		setTimeout(() => {
			this.remove()
			this.isItemPhase = true
		}, FIRST_STAGE_BOSS_TIME_MS)
	}

	hit(): void {
		if (isHit) return

		this.enemy.stop()
		this.enemy.setTexture('bossHit')
		this.enemy.play('boss-hit')

		isHit = true
		this.enemy.setAlpha(0.75)
		setTimeout(() => {
			isHit = false
			this.enemy.setAlpha(1)
			this.enemy.stop()
			this.enemy.setTexture('bossMove')
			this.enemy.play('boss-move')
		}, BOSS_HIT_DELAY_MS)
		this.soundManager.play(this.enermyDestroyedSound!, true)
		this.score.add(DESTROY_METEOR_SCORE)
	}

	destroy() {
		// TODO
	}

	getBody(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
		return this.enemy
	}

	isActive(): boolean {
		return this.enemy.active
	}

	remove(): void {
		const { width } = this.scene.scale
		const path = new Phaser.Curves.Path(this.enemy.x, this.enemy.y).lineTo(
			width / 2,
			-140,
		)
		this.enemy.setPath(path).startFollow({ duration: 200 })
	}

	showCutscene(): void {
		this.bossText.setVisible(true)
		this.isCutSceneShown = true

		setTimeout(() => {
			this.bossText.setVisible(false)
			this.attack()
			this.player.startReload()
		}, 5000)
	}

	getIsCutSceneShown(): boolean {
		return this.isCutSceneShown
	}

	enterItemPhase(): void {
		this.isItemPhase = false
	}

	isAttackPhase(): boolean {
		return false
	}

	getIsItemPhase(): boolean {
		return this.isItemPhase
	}
}
