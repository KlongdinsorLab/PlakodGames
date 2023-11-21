import Phaser from 'phaser'
import MergedInput, { Player as InputPlayer } from 'phaser3-merged-input'
//import Player from 'component/player/Player'
import SoundManager from 'component/sound/SoundManager'
import I18nSingleton from 'i18n/I18nSingleton'
import { MEDIUM_FONT_SIZE } from 'config'

export default class TitleScene extends Phaser.Scene {
//	private background!: Phaser.GameObjects.TileSprite
	private mergedInput?: MergedInput
	private controller1?: InputPlayer | any
//	private player?: Player
	private bgm?: Phaser.Sound.BaseSound
	private hasController = false

	constructor() {
		super('title')
	}

	preload() {
		this.load.image('titleBackground', 'assets/background/title-background.jpg')
		this.load.image('logo', 'assets/logo/logo_1-01.png')
		this.load.image('player', 'assets/character/player/playerShip1_blue.png')
		this.load.image('fire', 'assets/effect/fire03.png')
		this.load.audio('bgm', 'sound/hofman-138068.mp3')

		this.load.scenePlugin('mergedInput', MergedInput)
	}

	create() {
		const queryString = window.location.search
		const urlParams = new URLSearchParams(queryString)
		this.hasController = urlParams.get('controller') === 'true'

		const { width, height } = this.scale
		//		const i18n = I18nSingleton.getInstance()
//		this.background = this.add
//			.tileSprite(0, 0, width, height, 'titleBackground')
//			.setOrigin(0)
//			.setScrollFactor(0, 0)

		this.add
			.tileSprite(0, 0, width, height, 'titleBackground')
			.setOrigin(0)
			.setScrollFactor(0, 0)

		this.add.image(width / 2, height / 2, 'logo').setOrigin(0.5, 1)
		I18nSingleton.getInstance()
			.createTranslatedText(this, width / 2, height / 2, 'start text')
			.setFontSize(MEDIUM_FONT_SIZE)
			.setOrigin(0.5, 0)

		this.controller1 = this.mergedInput?.addPlayer(0)
		this.mergedInput
			?.defineKey(0, 'LEFT', 'LEFT')
			.defineKey(0, 'RIGHT', 'RIGHT')
			.defineKey(0, 'B0', 'SPACE')

//		this.player = new Player(this)
//		this.player.addJetEngine()

		this.bgm = this.sound.add('bgm')
		const soundManager = new SoundManager(this)
		soundManager.init()
		soundManager.play(this.bgm)

		/* TODO comment just for testing
		const isSetup = localStorage.getItem('setup') ?? false
		if (!isSetup) {
			this.scene.pause()
			this.scene.launch('setup')
		}
		*/

		if (!this.hasController && this.input?.gamepad?.total === 0) {
			this.input.gamepad.once(
				'connected',
				() => {
					this.startGame()
				},
				this,
			)
		}

	}

	update() {
		if (
			this.hasController &&
			(this.controller1?.direction.LEFT ||
				this.controller1?.direction.RIGHT ||
				this.controller1?.buttons.B0 > 0 ||
				this.input.pointer1.isDown)
		) {
			this.startGame()
		}
	}

	startGame() {
		I18nSingleton.getInstance().destroyEmitter()
		this.scene.start('game')
		new SoundManager(this).stop(this.bgm!)
	}
}
