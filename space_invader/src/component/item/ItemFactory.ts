import Player from 'component/player/Player'
import { Item } from './item'
import InhaleGauge from 'component/ui/InhaleGauge'
import Score from 'component/ui/Score'


export abstract class ItemFactory {
	abstract create(scene: Phaser.Scene, player: Player, score: Score, gauge: InhaleGauge): Item
}
