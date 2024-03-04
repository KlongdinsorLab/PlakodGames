import {
	BULLET_COUNT,
	FULLCHARGE_ANIMATION_MS,
	FULLCHARGE_SCALE,
	LASER_FREQUENCY_MS,
	MARGIN,
	PLAYER_SPEED,
	PLAYER_START_MARGIN,
} from 'config'

export default class Player {
	private scene: Phaser.Scene
	private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
	private playerHitTweens!: any
	private isHit = false
	private isReload = false
	private isReloading = false
	private chargeEmitter!: Phaser.GameObjects.Particles.ParticleEmitter

	constructor(scene: Phaser.Scene, gameLayer: Phaser.GameObjects.Layer) {
		this.scene = scene
		const { width, height } = this.scene.scale
		//		this.player = this.scene.physics.add.image(
		//			width / 2,
		//			height - PLAYER_START_MARGIN,
		//			'player',
		//		)

		this.player = this.scene.physics.add.sprite(
			width / 2,
			height - PLAYER_START_MARGIN,
			'player',
		)

		gameLayer.add(this.player)

		//		this.scene.anims.create({
		//			key: 'run',
		//			frames: this.scene.anims.generateFrameNames('player', {
		//				prefix: '01.2A_MC(N)_', suffix: '.png', start: 0, end: 48, zeroPad: 5
		//			}),
		//			frameRate: 24,
		//			repeat: -1
		//		});
		//
		//		this.scene.anims.create({
		//			key: 'charge',
		//			frames: this.scene.anims.generateFrameNames('player', {
		//				prefix: '01.2B_MC(I)_', suffix: '.png', start: 0, end: 48, zeroPad: 5
		//			}),
		//			frameRate: 48,
		//			repeat: -1
		//		});
		//
		//		this.scene.anims.create({
		//			key: 'attack',
		//			frames: this.scene.anims.generateFrameNames('player', {
		//				prefix: '01.2C_MC(A)_', suffix: '.png', start: 0, end: 23, zeroPad: 5
		//			}),
		//			frameRate: 24,
		//			repeat: -1
		//		});
		this.scene.anims.create({
			key: 'run',
			frames: this.scene.anims.generateFrameNames('player', {
				prefix: 'mc_normal_',
				suffix: '.png',
				start: 0,
				end: 19,
				zeroPad: 5,
			}),
			frameRate: 24,
			repeat: -1,
		})

		this.scene.anims.create({
			key: 'charge',
			frames: this.scene.anims.generateFrameNames('player', {
				prefix: 'mc_inhale_',
				suffix: '.png',
				start: 0,
				end: 22,
				zeroPad: 5,
			}),
			frameRate: 24,
			repeat: -1,
		})

		this.scene.anims.create({
			key: 'attack',
			frames: this.scene.anims.generateFrameNames('player', {
				prefix: 'mc_attack_',
				suffix: '.png',
				start: 0,
				end: 19,
				zeroPad: 5,
			}),
			frameRate: 24,
			repeat: -1,
		})

		this.player.play('run')

		this.playerHitTweens = this.scene.tweens.add({
			targets: this.player,
			scale: FULLCHARGE_SCALE,
			duration: FULLCHARGE_ANIMATION_MS,
			ease: 'sine.inout',
			yoyo: true,
			repeat: -1,
		})
		this.playerHitTweens.pause()
		this.player.setCollideWorldBounds(true)
	}

	addJetEngine() {
		const jetEngine = this.scene.add.particles(0, 0, 'fire', {
			gravityY: 200,
			speed: 100,
			scale: { start: 1, end: 0 },
			blendMode: Phaser.BlendModes.ADD,
		})
		jetEngine.startFollow(this.player, 0, MARGIN)
	}

	addChargeParticle() {
		this.chargeEmitter = this.scene.add.particles(0, 0, 'charge', {
			speed: 64,
			scale: 0.1,
			blendMode: Phaser.BlendModes.ADD,
		})
		this.chargeEmitter.startFollow(this.player)
		this.chargeEmitter.active = false
	}

	moveLeft(delta: number): void {
		this.player.x = this.player.x - (PLAYER_SPEED * delta) / 1000
	}

	moveRight(delta: number): void {
		this.player.x = this.player.x + (PLAYER_SPEED * delta) / 1000
	}

	getLaserLocation(): { x: number; y: number } {
		return { x: this.player.x, y: this.player.y - 20 }
	}

	charge(): void {
		this.player.play('charge', true)
		this.isReloading = true
		this.chargeEmitter.active = true
		this.chargeEmitter.start()
	}

	damaged(): void {
		this.playerHitTweens.resume()
		this.player.alpha = 0.8
	}

	recovered(): void {
		this.player.alpha = 1
		this.playerHitTweens.restart()
		this.playerHitTweens.pause()
	}

	isLeftOf(x: number): boolean {
		return this.player.x > x
	}

	isRightOf(x: number): boolean {
		return this.player.x < x
	}

	getBody(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
		return this.player
	}

	getIsHit(): boolean {
		return this.isHit
	}

	setIsHit(isHit: boolean): void {
		this.isHit = isHit
	}

	startReload(): void {
		this.isReload = true
		this.isReloading = false
		if (this.chargeEmitter) this.chargeEmitter.active = true
	}

	reloadReset(bulletCount: number): void {
		this.player.play('attack', true)
		this.isReload = false
		this.chargeEmitter.stop()
		setTimeout(
			() => this.player.play('run', true),
			LASER_FREQUENCY_MS * bulletCount,
		)
	}

	attack(): void {
		this.player.play('attack', true)
	}

	reloadResetting(): void {
		this.player.play('run', true)
		this.isReloading = false
		this.chargeEmitter.stop()
	}

	getIsReload(): boolean {
		return this.isReload
	}

	getIsReloading(): boolean {
		return this.isReloading
	}

	hide(): void {
		this.player.setVisible(false)
	}

	show(): void {
		this.player.setVisible(true)
	}
}
