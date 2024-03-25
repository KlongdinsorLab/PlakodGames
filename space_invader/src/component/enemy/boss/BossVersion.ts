export abstract class BossVersion {
	abstract getMovePattern(): void
	abstract isShootAttack(): boolean
	abstract hasObstacle(): boolean
	abstract getDuration(): number
}
