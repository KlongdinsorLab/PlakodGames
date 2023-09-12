import Player from "../player/Player"
import Score from "../ui/Score"

export abstract class Enemy {

    protected enemy!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    protected scene: Phaser.Scene
    protected player: Player
    protected score: Score
    protected enermyDestroyedSound?: Phaser.Sound.BaseSound;

    protected constructor(scene: Phaser.Scene, player: Player, score: Score) {
        this.scene = scene
        this.player = player
        this.score = score
        this.create()
    }

    abstract create(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    abstract move(): void
    abstract attack(): void
    abstract destroy(): void
}