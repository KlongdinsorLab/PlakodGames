import { BossVersion } from "../BossVersion";

export class B1BossVersion1 extends BossVersion  {
	getMovePattern(): void {

	}

	isShootAttack(): boolean {
	 return false
	}

	hasObstacle(): boolean {
    return false
	}

	getDuration(): number {
	 return 0
	}
}
