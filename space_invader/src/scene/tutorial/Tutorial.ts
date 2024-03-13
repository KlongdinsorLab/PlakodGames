import { TUTORIAL_DELAY_MS } from 'config'
import { Hud } from './TutorialHudScene'
import { Character } from './TutorialCharacter'
import { Controller } from './TutorialControllerScene'

export enum Step {
  CHARACTER = 0,
  HUD = 1,
  CONTROLLER = 2,
}

export default class Tutorial {
  private timer = 0
  private step = 0
  private scene!: Phaser.Scene

  private tutorialScreens = [
    { step: Step.CHARACTER, scene: 'tutorial character' },
    { step: Step.HUD, scene: 'tutorial HUD' },
    { step: Step.CONTROLLER, scene: 'tutorial controller' },
  ]

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  launchTutorial(step: number, delta: number, options?: Character | Hud | Controller) {
    this.timer += delta
    if (this.timer > TUTORIAL_DELAY_MS && this.step === step) {
      this.scene.scene.pause()
      this.step += 1
      this.timer = 0
      const sceneName = this.tutorialScreens.filter(
        (tutorialScreen) => tutorialScreen.step === step,
      )[0]['scene']
      this.scene.scene.launch(sceneName, options)
    }
  }

  getStep(): number {
    return this.step
  }
}
