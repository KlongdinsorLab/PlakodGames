export default class SoundManager {
	private scene: Phaser.Scene

	constructor(scene: Phaser.Scene) {
		this.scene = scene
	}

	init() {
		const mute = localStorage.getItem('mute') || false
		if (!mute) return
		this.scene.sound.mute = true
	}

	isMute(): boolean {
		return this.scene.sound.mute
	}

	mute() {
		this.scene.sound.mute = true
	}

	unmute() {
		this.scene.sound.mute = false
	}

	play(sound: Phaser.Sound.BaseSound, overlap = false) {
		if (!sound?.isPlaying || overlap) sound?.play()
	}

	stop(sound: Phaser.Sound.BaseSound) {
		sound?.stop()
	}

	pause(sound: Phaser.Sound.BaseSound) {
		sound?.pause()
	}

	pauseAll(): void {
		this.scene.sound.pauseAll()
	}

	resumeAll(): void {
		this.scene.sound.resumeAll()
	}

	createSoundToggle(
		x: number,
		y: number,
	): Phaser.GameObjects.Image | Phaser.GameObjects.Text {
		const button = this.scene.add.image(
			x,
			y,
			this.scene?.sound.mute ? 'mute' : 'unmute',
		)
		button.scale = 0.5

		button.setInteractive()
		button.on('pointerup', () => {
			this.scene.sound.mute = !this.scene.sound.mute
			localStorage.setItem('mute', !this.scene.sound.mute ? 'true' : '')
			button.setTexture(this.scene?.sound.mute ? 'unmute' : 'mute')
		})
		return button
	}
}
