export default class BossTransition extends Phaser.Scene {
	constructor() {
		super({ key: 'boss transition' })
	}
	preload() {
		this.load.image('smoke', 'assets/background/smoke-transition.png')
	}

	create() {
		const { width, height } = this.scale

		const smoke = this.add.image(width / 6, height / 2, 'smoke')

        this.tweens.add({
            targets: smoke,
            x: 425,
            duration: 3000,
            repeat: 0,
            ease: 'sine.out'
        })

	}

}
