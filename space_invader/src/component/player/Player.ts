import {
	FULLCHARGE_ANIMATION_MS,
	FULLCHARGE_SCALE,
	MARGIN,
	PLAYER_SPEED,
	PLAYER_START_MARGIN,
} from 'config'

export default class Player {
	private scene: Phaser.Scene
	private player!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
	private playerHitTweens!: any
	private isHit = false
	private isReload = false
	private isReloading = false
	private chargeEmitter!: Phaser.GameObjects.Particles.ParticleEmitter

	constructor(scene: Phaser.Scene) {
		this.scene = scene
		const { width, height } = this.scene.scale
		this.player = this.scene.physics.add.image(
			width / 2,
			height - PLAYER_START_MARGIN,
			'player',
		)
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

	reloadReset(): void {
		this.isReload = false
		this.chargeEmitter.stop()
	}

	reloadResetting(): void {
		this.isReloading = false
		this.chargeEmitter.stop()
	}

	getIsReload(): boolean {
		return this.isReload
	}

	getIsReloading(): boolean {
		return this.isReloading
	}
}
