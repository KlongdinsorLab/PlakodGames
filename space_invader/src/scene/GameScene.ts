import Phaser from 'phaser'
import {
	BULLET_COUNT,
	HOLD_BAR_HEIGHT,
	HOLD_DURATION_MS,
	LASER_FREQUENCY_MS,
	MARGIN,
} from 'config'
import Player from 'component/player/Player'
import InhaleGaugeRegistry from 'component/ui/InhaleGaugeRegistry'
import MergedInput, { Player as PlayerInput } from 'phaser3-merged-input'
import Score from 'component/ui/Score'
import { SingleLaserFactory } from 'component/weapon/SingleLaserFactory'
//import { TripleLaserFactory} from "../component/weapon/TripleLaserFactory";
import { MeteorFactory } from 'component/enemy/MeteorFactory'
import Tutorial, { Step } from './tutorial/Tutorial'
import { Meteor } from 'component/enemy/Meteor'
import ReloadCount from 'component/ui/ReloadCount'
import Menu from 'component/ui/Menu'
import EventEmitter = Phaser.Events.EventEmitter

export default class GameScene extends Phaser.Scene {
	private background!: Phaser.GameObjects.TileSprite
	private player!: Player
	private gaugeRegistry!: InhaleGaugeRegistry
	private score!: Score

	private reloadCount!: ReloadCount
	//	private reloadCount = RELOAD_COUNT
	//	private reloadCountText!: Phaser.GameObjects.Text

	private mergedInput?: MergedInput
	private controller1!: PlayerInput | undefined | any
	//    private timerText!: Phaser.GameObjects.Text;
	private gameover?: Phaser.GameObjects.Image

	private singleLaserFactory!: SingleLaserFactory
	private meteorFactory!: MeteorFactory
	private tutorial!: Tutorial
	private tutorialMeteor!: Meteor
	private isCompleteWarmup = false
	private menu!: Menu

	private event!: EventEmitter

	constructor() {
		super({ key: 'game' })
	}

	preload() {
		this.load.image('background', 'assets/background/purple.png')
		this.load.image('player', 'assets/character/player/playerShip1_blue.png')
		this.load.image('fire', 'assets/effect/fire03.png')
		this.load.image('laser', 'assets/effect/laserBlue02.png')
		this.load.image('charge', 'assets/effect/chargeBlue.png')
		this.load.image('meteor1', 'assets/character/enemy/meteorBrown_big1.png')
		this.load.image('meteor2', 'assets/character/enemy/meteorBrown_big2.png')
		this.load.image('meteor3', 'assets/character/enemy/meteorBrown_big3.png')
		this.load.image('meteor4', 'assets/character/enemy/meteorBrown_big4.png')
		this.load.image('explosion', 'assets/effect/explosionYellow.png')
		this.load.image('gameover', 'assets/logo/gameover.png')
		this.load.image('chevron', 'assets/icon/chevron-down.svg')

		this.load.svg('pause', 'assets/icon/pause.svg')
		this.load.svg('resume', 'assets/icon/resume.svg')
		this.load.svg('finger press', 'assets/icon/finger-press.svg')

		this.load.audio('shootSound', 'sound/shooting-sound-fx-159024.mp3')
		this.load.audio('meteorDestroyedSound', 'sound/rock-destroy-6409.mp3')
		this.load.audio('chargingSound', 'sound/futuristic-beam-81215.mp3')
		this.load.audio('chargedSound', 'sound/sci-fi-charge-up-37395.mp3')

		this.load.scenePlugin('mergedInput', MergedInput)
	}

	create() {
		const { width, height } = this.scale
		// const queryString = window.location.search;
		// const urlParams = new URLSearchParams(queryString);
		// this.controlType = <'tilt' | 'touch'>urlParams.get('control')

		this.background = this.add
			.tileSprite(0, 0, width, height, 'background')
			.setOrigin(0)
			.setScrollFactor(0, 0)

		this.controller1 = this.mergedInput?.addPlayer(0)
		// https://github.com/photonstorm/phaser/blob/v3.51.0/src/input/keyboard/keys/KeyCodes.js#L7
		this.mergedInput
			?.defineKey(0, 'LEFT', 'LEFT')
			.defineKey(0, 'RIGHT', 'RIGHT')
			.defineKey(0, 'B0', 'SPACE') // A
			//            .defineKey(0, 'B1', 'CTRL')
			//            .defineKey(0, 'B2', 'ALT')
			.defineKey(0, 'B1', 'UP') // B
			.defineKey(0, 'B2', 'DOWN') // X

		this.player = new Player(this)
		this.player.addJetEngine()

		this.player.addChargeParticle()

		// TODO Move to UI
		this.add
			.rectangle(0, height, width, HOLD_BAR_HEIGHT + MARGIN * 2, 0x000000)
			.setOrigin(0, 1)
			.setAlpha(0.25)

		this.gaugeRegistry = new InhaleGaugeRegistry(this)
		this.gaugeRegistry.createbyDivision(1)

		this.reloadCount = new ReloadCount(this, width / 2, MARGIN)
		this.reloadCount.getBody().setOrigin(0.5, 0)

		this.score = new Score(this)
		// this.timerText = this.add.text(width - MARGIN, MARGIN, `time: ${Math.floor(GAME_TIME_LIMIT_MS / 1000)}`, {fontSize: '42px'}).setOrigin(1, 0)

		this.gameover = this.add
			.image(width / 2, height / 2, 'gameover')
			.setOrigin(0.5, 1)
		this.gameover.visible = false

		this.meteorFactory = new MeteorFactory()
		this.singleLaserFactory = new SingleLaserFactory()
		this.tutorial = new Tutorial(this)

		this.menu = new Menu(this)

		if (!this.isCompleteTutorial()) {
			this.tutorialMeteor = this.meteorFactory.create(
				this,
				this.player,
				this.score,
				true,
			)
		}

		this.isCompleteWarmup = false
		this.event = new EventEmitter()
	}

	isCompleteTutorial = () => localStorage.getItem('tutorial') || false
	isCompleteControlerTutorial = () =>
		this.tutorial.getStep() > Step.CONTROLLER || this.isCompleteTutorial()

	update(_: number, delta: number) {
		//        if (this.input.gamepad.total === 0) {
		//            const text = this.add.text(0, height / 2, START_TEXT, {fontSize: '24px'}).setOrigin(0);
		//            text.x = width / 2 - text.width / 2
		//            this.input.gamepad.once('connected', function () {
		//                text.destroy();
		//            }, this);
		//            return;
		//        }
		//        const pad = this.input.gamepad.gamepads[0]

		const gauge = this.gaugeRegistry?.get(0)

		//        const timeLeft = Math.floor((GAME_TIME_LIMIT_MS - time) / 1000)
		//        this.timerText.text = `time: ${timeLeft}`
		//        if (timeLeft <= 0) {
		//            this.scene.pause()
		//        }

		// Tutorial
		if (!this.isCompleteTutorial()) {
			this.tutorial.launchTutorial(Step.CHARACTER, delta, {
				meteor: this.tutorialMeteor,
				player: this.player,
			})

			this.tutorial.launchTutorial(Step.HUD, delta, {
				score: this.score,
				gauge: gauge,
				menu: this.menu,
				reloadCount: this.reloadCount,
			})

			this.tutorial.launchTutorial(Step.CONTROLLER, delta)
		}

		if (!this.isCompleteWarmup && this.isCompleteTutorial()) {
			this.scene.pause()
			this.isCompleteWarmup = true
			this.scene.launch('warmup', { event: this.event })
		}

		if (this.isCompleteTutorial() && this.isCompleteWarmup) {
			this.meteorFactory.createByTime(this, this.player, this.score, delta)
		}

		// TODO move to controller class
		if (!this.controller1) return

		if (this.controller1?.direction.LEFT) {
			this.player.moveLeft(delta)
		}

		if (this.controller1?.direction.RIGHT) {
			this.player.moveRight(delta)
		}

		if (this.controller1?.buttons.B1 > 0) {
			gauge.showUp()
		} else {
			gauge.hideUp()
		}

		if (this.controller1?.buttons.B2 > 0) {
			gauge.showDown()
		} else {
			gauge.hideDown()
		}

		if (this.controller1?.buttons.B0 > 0) {
			gauge.hold(delta)
		}

		if (this.input.pointer1.isDown) {
			const { x } = this.input.pointer1
			if (this.player.isRightOf(x) && this.isCompleteControlerTutorial()) {
				this.player.moveRight(delta)
			}
			if (this.player.isLeftOf(x) && this.isCompleteControlerTutorial()) {
				this.player.moveLeft(delta)
			}
		}

		// scroll the background
		this.background.tilePositionY -= 1

		this.singleLaserFactory.createByTime(
			this,
			this.player,
			this.meteorFactory.getMeteors(),
			delta,
		)

		if (this.reloadCount.isDepleted()) {
			gauge.deplete()
			return
		}

		if (
			gauge.getDuratation() > HOLD_DURATION_MS &&
			this.controller1?.buttons.B0 > 0
		) {
			this.player.startReload()
			gauge.setFullCharge()
			this.event.emit('inhale')
		} else if (
			gauge.getDuratation() <= HOLD_DURATION_MS &&
			gauge.getDuratation() !== 0 &&
			this.controller1?.buttons.B0 > 0
		) {
			this.player.charge()
			gauge.charge(delta)
		}

		if (this.player.getIsReload() && !(this.controller1?.buttons.B0 > 0)) {
			this.singleLaserFactory.reset()
			this.player.reloadReset()
			gauge.reset()
			this.reloadCount.decrementCount()

			if (this.reloadCount.isDepleted()) {
				setTimeout(() => {
					this.scene.pause()
					this.gameover!.visible = true
				}, LASER_FREQUENCY_MS * BULLET_COUNT)
			}
		}

		if (this.player.getIsReloading() && !(this.controller1?.buttons.B0 > 0)) {
			this.player.reloadResetting()
			gauge.resetting()
		}

		if (gauge.isReducing()) {
			gauge.release(delta)
		}
	}
}

// TODO create test
