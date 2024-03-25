export abstract class BossPhase  {
	abstract getMovePattern(): void
	abstract isShootAttack(): boolean
	abstract hasObstacle(): boolean
	abstract getDuration(): number
}
