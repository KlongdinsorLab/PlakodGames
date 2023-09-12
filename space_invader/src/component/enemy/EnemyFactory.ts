import Player from "../player/Player"
import Score from "../ui/Score"
import { Enemy } from "./Enemy"

export abstract class EnemyFactory {
    abstract create(scene: Phaser.Scene, player: Player, score: Score): Enemy
}