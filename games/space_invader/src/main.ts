import Phaser from 'phaser'

import GameScene from './Scene/GameScene'
import {SCREEN_WIDTH, SCREEN_HEIGHT} from "./config";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	physics: {
		default: 'arcade',
		arcade: {},
	},
	scene: [GameScene],
}

export default new Phaser.Game(config)