import { RELOAD_COUNT } from "config"

export default class BossTransition extends Phaser.Scene {
  private score = 0
  private reloadCount = RELOAD_COUNT

	constructor() {
		super({ key: 'boss transition' })
	}

	init({score, reloadCount}: {score: number, reloadCount: number}) {
	  this.score = score
		this.reloadCount = reloadCount
	}

	preload() {
		this.load.image('smoke', 'assets/background/smoke-transition.png')
	}

	create() {
		const { height } = this.scale
		const smoke = this.add.image(0, height / 2, 'smoke').setOrigin(1, 0.5)
    this.tweens.add({
      targets: smoke,
      x: smoke.width,
      duration: 3000,
      repeat: 0,
      ease: 'sine.out',
      onComplete: () => {
        if(this.reloadCount === 0){
          this.scene.launch('end game', {score: this.score})
        } else {
          this.scene.launch('game', {score: this.score, reloadCount: this.reloadCount, isCompleteBoss: true })
        }
        this.scene.stop()
        this.scene.stop('bossScene')
      }
    })

	}

}
