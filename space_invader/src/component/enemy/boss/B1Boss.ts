import Player from 'component/player/Player'
import Score from 'component/ui/Score'

import {
	DESTROY_METEOR_SCORE,
	BOSS_HIT_DELAY_MS,
	FIRST_STAGE_BOSS_TIME_MS,
	SECOND_STAGE_BOSS_TIME_MS,
	BOSS_TUTORIAL_DELAY_MS,
} from 'config'
import SoundManager from 'component/sound/SoundManager'
import {  Boss } from './Boss'

let isHit = false

export class B1Boss extends Boss {
	private soundManager: SoundManager
	private isStartAttack!: boolean
	private isItemPhase!: boolean
	private isAttackPhase!: boolean
	private isSecondPhase!: boolean

	constructor(scene: Phaser.Scene, player: Player, score: Score) {
		super(scene, player, score)
		this.soundManager = new SoundManager(scene)
		this.isStartAttack = false
		this.isAttackPhase = true
		this.isItemPhase = false
	}

	create(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
		const { width } = this.scene.scale
		const path = new Phaser.Curves.Path(0, 0)
		this.scene.anims.create({
			key: 'boss-move',
			frames: this.scene.anims.generateFrameNames('b1v1', {
				prefix: 'b1v1_attack_',
				suffix: '.png',
				start: 0,
				end: 24,
				zeroPad: 5,
			}),
			frameRate: 18,
			repeat: -1,
		})
		this.scene.anims.create({
			key: 'boss-hit',
			frames: this.scene.anims.generateFrameNames('b1v1', {
				prefix: 'b1v1_hurt_',
				suffix: '.png',
				start: 1,
				end: 1,
				zeroPad: 5,
			}),
			frameRate: 18,
			repeat: -1,
		})

		this.enemy = this.scene.add
			.follower(path, width / 2, -140, 'b1v1')
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
		let bossTime
		if (!this.isSecondPhase) {
			bossTime = FIRST_STAGE_BOSS_TIME_MS
		} else {
			bossTime = SECOND_STAGE_BOSS_TIME_MS
		}
		this.move()
		setTimeout(() => {
			this.remove()
		}, bossTime)
	}

	hit(): void {
		if (isHit) return

		this.enemy.stop()
		// this.enemy.setTexture('boss')
		this.enemy.play('boss-hit')

		isHit = true
		this.enemy.setAlpha(0.75)
		setTimeout(() => {
			isHit = false
			this.enemy.setAlpha(1)
			this.enemy.stop()
			// this.enemy.setTexture('boss')
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
		setTimeout(() => {
			this.endAttackPhase()
		}, 1500)
	}


	startAttackPhase(bossPhase: number): void {
		this.isSecondPhase = bossPhase === 2
		this.isStartAttack = true
		setTimeout(() => {
			this.isAttackPhase = true
			this.isItemPhase = false
			this.attack()
			this.player.startReload()
		}, BOSS_TUTORIAL_DELAY_MS)
	}

	endAttackPhase(): void {
		if (!this.isSecondPhase) {
			this.isItemPhase = true
			this.isAttackPhase = false
			this.isStartAttack = false
		} else {
			this.isAttackPhase = false
			this.isItemPhase = false
		}
	}

	getIsStartAttack(): boolean {
		return this.isStartAttack
	}

	getIsAttackPhase(): boolean {
		return this.isAttackPhase
	}

	getIsItemPhase(): boolean {
		return this.isItemPhase
	}

	getIsSecondPhase(): boolean {
		return this.isSecondPhase
	}

	resetState(): void {
	  this.isStartAttack = false
		this.isAttackPhase = true
		this.isItemPhase = false
	  this.isSecondPhase = false
	}
}
