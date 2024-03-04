import Phaser from 'phaser'

import GameScene from './scene/GameScene'
import TitleScene from './scene/TitleScene'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config'
import TutorialCharacterScene from './scene/tutorial/TutorialCharacter'
import TutorialHudScene from './scene/tutorial/TutorialHudScene'
import TutorialControllerScene from './scene/tutorial/TutorialControllerScene'
import PauseScene from './scene/PauseScene'
import WarmupScene from './scene/warmup/WarmupScene'
import SetupScene from './scene/setup/SetupScene'
import EndGameScene from './scene/EndGameScene'
import LoginScene from './scene/auth/LoginScene'
import OtpScene from './scene/auth/OtpScene'
import RegisterScene from './scene/auth/RegisterScene'
import DifficultyScene from './scene/level/DifficultyScene'
import AirflowScene from './scene/level/AirflowScene'
import BossScene from 'scene/boss/BossScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	input: {
		gamepad: true,
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	physics: {
		default: 'arcade',
		arcade: {},
	},
	dom: {
		createContainer: true,
	},
	scene: [
		TitleScene,
		LoginScene,
		OtpScene,
		RegisterScene,
		DifficultyScene,
		AirflowScene,
		SetupScene,
		GameScene,
		EndGameScene,
		TutorialCharacterScene,
		TutorialHudScene,
		TutorialControllerScene,
		WarmupScene,
		PauseScene,
		BossScene,
	],
}

export default new Phaser.Game(config)
