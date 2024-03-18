import { BULLET_COUNT, BOSS_PHASE1_BULLET_COUNT, BOSSV1_PHASE2_BULLET_COUNT, BOSSV2_PHASE2_BULLET_COUNT } from 'config';
import { Enemy } from '../Enemy'

export enum SHOOT_PHASE {
	NORMAL = BULLET_COUNT,
	BOSS_PHASE_1 = BOSS_PHASE1_BULLET_COUNT,
	BOSSV1_PHASE_2 = BOSSV1_PHASE2_BULLET_COUNT,
	BOSSV2_PHASE_2 = BOSSV2_PHASE2_BULLET_COUNT,
}

export enum BOSS_PHASE {
  PHASE_1 = 1,
  PHASE_2 = 2
}

// Boss Cut Scene
export enum BOSS_CUTSCENE {
	VS = 'B1V1_CUTSCENE_VS',
	ESCAPE = 'B1V1_CUTSCENE_ESCAPE1',
	ESCAPE2 = "B1V1_CUTSCENE_ESCAPE2"
}

// Boss Tutorial Scene
export enum BOSS_TTSCENE {
	ATTACK_BOSS = "B1V1_TT",
	COLLECT_ITEM = "B1V1_TT_CB",
}

export abstract class Boss extends Enemy {
	abstract remove(): void
	abstract path(): void
	abstract getIsAttackPhase(): boolean
	abstract getIsItemPhase(): boolean
	abstract getIsStartAttack(): boolean
}
