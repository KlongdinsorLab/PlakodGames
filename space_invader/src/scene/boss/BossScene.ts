import Player from 'component/player/Player'
import InhaleGaugeRegistry from 'component/ui/InhaleGaugeRegistry'
import Score from 'component/ui/Score'
import { SingleLaserFactory } from 'component/weapon/SingleLaserFactory'
import { DARK_BROWN, MARGIN } from 'config'
import Phaser from 'phaser'
import MergedInput from 'phaser3-merged-input'
//import { TripleLaserFactory} from "../component/weapon/TripleLaserFactory";
import { MeteorFactory } from 'component/enemy/MeteorFactory'
import Menu from 'component/ui/Menu'
import ReloadCount from 'component/ui/ReloadCount'
import WebFont from 'webfontloader'
import { AlienBoss } from '../../component/enemy/boss/AlienBoss'
// import { ShootPhase } from 'component/ui/InhaleGauge'

export default class BossScene extends Phaser.Scene {
	private background!: Phaser.GameObjects.TileSprite
	private player!: Player
	private gaugeRegistry!: InhaleGaugeRegistry
	private score!: Score

	private reloadCount!: ReloadCount

	private singleLaserFactory!: SingleLaserFactory
	private meteorFactory!: MeteorFactory
	// private menu!: Menu

	// TODO move to boss class
	private boss!: AlienBoss

	private bossLayer!: Phaser.GameObjects.Layer
	private menu!: Menu

	constructor() {
		super({ key: 'alien boss scene' })
	}

	preload() {
		this.load.image('boss_background', 'assets/background/bg_boss.jpg')

		this.load.atlas(
			'player',
			'assets/character/player/mc_spritesheet.png',
			'assets/character/player/mc_spritesheet.json',
		)

		this.load.atlas(
		  'alien', 'assets/character/enemy/alienV1.png', 'assets/character/enemy/alienV1.json'
		)

		this.load.image('fire', 'assets/effect/fire03.png')
		this.load.image('laser', 'assets/effect/02.1_MCBullet.png')
		this.load.image('charge', 'assets/effect/chargeBlue.png')
		this.load.image('explosion', 'assets/effect/explosionYellow.png')
		this.load.image('chevron', 'assets/icon/chevron-down.svg')

		this.load.image('progress_bar', 'assets/ui/progress_bar.png')
		this.load.image('sensor_1', 'assets/ui/sensor_1.png')
		this.load.image('sensor_2', 'assets/ui/sensor_2.png')
		this.load.image('sensor_3', 'assets/ui/sensor_3.png')
		this.load.image('sensor_4', 'assets/ui/sensor_4.png')
		this.load.image('sensor_5', 'assets/ui/sensor_5.png')

		this.load.image('ring', 'assets/icon/chargebar_C0_normal.png')

		this.load.svg('resume', 'assets/icon/resume.svg')

		this.load.audio('shootSound', 'sound/shooting-sound-fx-159024.mp3')
		this.load.audio('meteorDestroyedSound', 'sound/rock-destroy-6409.mp3')
		this.load.audio('chargingSound', 'sound/futuristic-beam-81215.mp3')
		this.load.audio('chargedSound', 'sound/sci-fi-charge-up-37395.mp3')

		this.load.scenePlugin('mergedInput', MergedInput)
		this.load.script(
			'webfont',
			'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
		)
	}

	init({
		score,
		player,
		reloadCount,
		menu,
	}: {
		score: Score
		menu: Menu
		player: Player
		reloadCount: ReloadCount
	}) {
		// this.score = score
		// this.player = player
		// this.reloadCount = reloadCount
		// this.menu = menu
	}

	create() {
		const { width, height } = this.scale

		this.background = this.add
			.tileSprite(0, 0, width, height, 'boss_background')
			.setOrigin(0)
			.setScrollFactor(0, 0)

		this.bossLayer = this.add.layer()

		// const menu = this.menu.getBody()
		// this.bossLayer.add(menu)
	  this.player = new Player(this, this.bossLayer)
    // this.player.addChargeParticle()

		this.gaugeRegistry = new InhaleGaugeRegistry(this)
    this.gaugeRegistry.createbyDivision(1)

    this.reloadCount = new ReloadCount(this, width / 2, MARGIN)
    this.reloadCount.getBody().setOrigin(0.5, 0)

    this.score = new Score(this)
		this.menu = new Menu(this)

		this.singleLaserFactory = new SingleLaserFactory()

		// this.score
		// 	.getLayer()
		// 	.getAll()
		// 	.forEach((layer) => this.bossLayer.add(layer))

		// this.reloadCount
		// 	.getLayer()
		// 	.getAll()
		// 	.forEach((layer) => this.bossLayer.add(layer))

		// const player = this.player.getBody()
		// this.bossLayer.add(player)
		// this.player.reloadResetting()

		this.boss = new AlienBoss(this, this.player, this.score)

		// this.gaugeRegistry = new InhaleGaugeRegistry(this)
		// this.gaugeRegistry.createbyDivision(1)
		// this.gaugeRegistry.get(0).setVisible(false)

		// this.meteorFactory = new MeteorFactory()
		// this.singleLaserFactory = new SingleLaserFactory()

		const self = this
		WebFont.load({
			google: {
				families: ['Jua'],
			},
			active: function () {
				const menuUiStyle = {
					fontFamily: 'Jua',
					color: `#${DARK_BROWN.toString(16)}`,
				}
				self.score.getBody().setStyle(menuUiStyle)
				self.reloadCount.getBody().setStyle(menuUiStyle)
			},
		})
	}

	update(_: number, delta: number) {
		const gauge = this.gaugeRegistry?.get(0)

		if (!this.boss.getIsCutSceneShown()) {
			this.boss.showCutscene()
		}

		if (this.input.pointer1.isDown) {
			const { x } = this.input.pointer1
			if (this.player.isRightOf(x)) {
				this.player.moveRight(delta)
			}
			if (this.player.isLeftOf(x)) {
				this.player.moveLeft(delta)
			}
		}

		gauge.setFullCharge()

		// scroll the background
		this.background.tilePositionY += 1.5

		this.singleLaserFactory.reset()
		this.singleLaserFactory.createByTime(
			this,
			this.player,
			[this.boss],
			delta,
		)

		// if (this.player.getIsReload()) {
		// 	this.singleLaserFactory.reset(ShootPhase.BOSS_1)
		// 	this.player.reloadReset(ShootPhase.BOSS_1)
		// 	gauge.reset(ShootPhase.BOSS_1)
		// }
	}
}

// TODO create test
