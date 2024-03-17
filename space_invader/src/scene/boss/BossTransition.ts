export default class BossTransition extends Phaser.Scene {
	constructor() {
		super({ key: 'boss transition' })
	}
	preload() {
		this.load.image('smoke', 'assets/background/smoke-transition.png')
	}

	create() {
		const { width, height } = this.scale

		const smoke = this.add.image(width / 2 ,height/2, 'smoke')

        this.tweens.add({
            targets: smoke,
            x: width * 4,
            duration: 3000,
            repeat: 0,
            hold: 2000,
            ease: 'linear'
        })

	}

}
