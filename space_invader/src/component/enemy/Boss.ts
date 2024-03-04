import { Enemy } from './Enemy'

export abstract class Boss extends Enemy {
	abstract remove(): void
	abstract isAttackPhase(): boolean
	abstract getIsItemPhase(): boolean
	abstract showCutscene(): void
	abstract path(): void
	abstract getIsCutSceneShown(): boolean
}
