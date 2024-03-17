import Player from 'component/player/Player'
import { Item } from './item'
import InhaleGauge from 'component/ui/InhaleGauge'


export abstract class ItemFactory {
	abstract create(scene: Phaser.Scene, player: Player, gauge: InhaleGauge): Item
}
