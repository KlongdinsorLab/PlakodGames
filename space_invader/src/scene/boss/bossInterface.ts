import { BossName } from 'component/enemy/boss/Boss'

export interface BossInterface {
	  name: BossName,
		score: number,
		playerX: number,
		reloadCount: number, // TODO change name and class to lap
}
