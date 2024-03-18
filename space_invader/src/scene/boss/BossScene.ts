import Player from 'component/player/Player'
import InhaleGaugeRegistry from 'component/ui/InhaleGaugeRegistry'
import Score from 'component/ui/Score'
import { SingleLaserFactory } from 'component/weapon/SingleLaserFactory'
import {
	DARK_BROWN,
	HOLD_BAR_BORDER,
	LARGE_FONT_SIZE,
	MARGIN,
} from 'config'
import Phaser from 'phaser'
import MergedInput from 'phaser3-merged-input'
//import { TripleLaserFactory} from "../component/weapon/TripleLaserFactory";
import { MeteorFactory } from 'component/enemy/MeteorFactory'
import { PosionFactory } from 'component/item/PoisonFactory'
import { BulletFactory } from 'component/item/BulletFactory'
import Menu from 'component/ui/Menu'
import ReloadCount from 'component/ui/ReloadCount'
import WebFont from 'webfontloader'
import { AlienBoss } from '../../component/enemy/boss/AlienBoss'
import { BOSS_CUTSCENE, BOSS_PHASE, BOSS_TTSCENE, SHOOT_PHASE } from 'component/enemy/boss/Boss'

export default class BossScene extends Phaser.Scene {
	private background!: Phaser.GameObjects.TileSprite
	private player!: Player
	private gaugeRegistry!: InhaleGaugeRegistry
	private score!: Score

	private reloadCount!: ReloadCount

	private singleLaserFactory!: SingleLaserFactory
	private meteorFactory!: MeteorFactory
	private poisonFactory!: PosionFactory
	private bulletFactory!: BulletFactory
	// private menu!: Menu

	// TODO move to boss class
	private boss!: AlienBoss

	private bossLayer!: Phaser.GameObjects.Layer
	private menu!: Menu
	private isCompleteItemTutorial!: boolean
	private bulletText!: Phaser.GameObjects.Text

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
			'alien',
			'assets/character/enemy/alienV1.png',
			'assets/character/enemy/alienV1.json',
		)

		this.load.atlas('bossAsset', 'assets/sprites/boss/asset_boss.png', 'assets/sprites/boss/asset_boss.json');

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
		reloadCount,
		menu,
	}: {
		score: Score
		menu: Menu
		player: Player
		reloadCount: ReloadCount
	}) {
		this.score = score
		this.reloadCount = reloadCount
		this.menu = menu
	}

	create() {
		const { width, height } = this.scale

		this.background = this.add
			.tileSprite(0, 0, width, height, 'boss_background')
			.setOrigin(0)
			.setScrollFactor(0, 0)

		this.bossLayer = this.add.layer()

		this.menu = new Menu(this)

		this.score = new Score(this)
		
		this.singleLaserFactory = new SingleLaserFactory()

		this.reloadCount = new ReloadCount(this, width / 2, MARGIN)
    	this.reloadCount.getBody().setOrigin(0.5, 0)

		this.player = new Player(this, this.bossLayer)
		this.player.addChargeParticle()

		this.boss = new AlienBoss(this, this.player, this.score)

		this.gaugeRegistry = new InhaleGaugeRegistry(this)
		this.gaugeRegistry.createbyDivision(1)
		this.gaugeRegistry.get(0).setVisible(false)

		this.meteorFactory = new MeteorFactory()
		this.poisonFactory = new PosionFactory()
		this.bulletFactory = new BulletFactory()

		this.isCompleteItemTutorial = false

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

		// Mock bullet count, delete when finish test
		this.bulletText = this.add
                    .text(width /2 , height - MARGIN + HOLD_BAR_BORDER, ` /10`)
                    .setFontSize(LARGE_FONT_SIZE)
                    .setOrigin(0.5, 1)
        this.bulletText.setVisible(false)
	}

	update(_: number, delta: number) {
		const gauge = this.gaugeRegistry?.get(0)

		if (!this.boss.getIsStartAttack() && !this.boss.getIsItemPhase()) {
			// Boss Phase 1
			this.scene.pause()
			this.scene.launch(BOSS_CUTSCENE.VS)
			setTimeout(() => {
				this.scene.stop(BOSS_CUTSCENE.VS)
				this.scene.resume()
				this.scene.launch(BOSS_TTSCENE.ATTACK_BOSS)
				this.boss.startAttackPhase(BOSS_PHASE.PHASE_1)
				setTimeout(() => {
					this.scene.stop(BOSS_TTSCENE.ATTACK_BOSS)
				}, 2000)
			}, 3000)
		}

		if (!this.isCompleteItemTutorial && this.boss.getIsItemPhase()) {
			this.isCompleteItemTutorial = true
				setTimeout(() => {
					this.scene.pause()
					this.scene.launch(BOSS_CUTSCENE.ESCAPE)
					setTimeout(() => {
						this.scene.resume()
						this.scene.stop(BOSS_CUTSCENE.ESCAPE)
						this.scene.launch(BOSS_TTSCENE.COLLECT_ITEM)
					},3000)
				},1500)
		} else if (this.boss.getIsItemPhase() && !this.player.getIsBulletFull()){
			// Collecting Item Phase
			this.meteorFactory.createByTime(this, this.player, this.score, delta)
			this.poisonFactory.createByTime(this, this.player, this.score, gauge, delta)
			this.bulletFactory.createByTime(this, this.player, this.score, gauge, delta)
			
			gauge.setVisible(false)
			this.bulletText.setVisible(true)
        	this.bulletText.setText(` ${this.player.getBulletCount()} / 10`)

		} else if(this.player.getIsBulletFull() && !this.boss.getIsStartAttack()){
			// Boss Phase 2
			this.bulletText.setVisible(false)
			this.scene.launch(BOSS_TTSCENE.ATTACK_BOSS)
			this.boss.startAttackPhase(BOSS_PHASE.PHASE_2)
			setTimeout(() => {
				this.scene.stop(BOSS_TTSCENE.ATTACK_BOSS)
			}, 2000)
		}

		if(this.boss.getIsSecondPhase() && !this.boss.getIsAttackPhase() && !this.boss.getIsItemPhase()){
			this.scene.pause()
			this.scene.launch(BOSS_CUTSCENE.ESCAPE2)
			setTimeout(() => {
				// TODO: go back to gameScene
				this.scene.stop(BOSS_CUTSCENE.ESCAPE2)
			}, 3000)
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

		// scroll the background
		this.background.tilePositionY += 1.5

		this.singleLaserFactory.createByTime(this, this.player, [this.boss], delta)

		if (this.player.getIsReload() ) {
			if(!this.boss.getIsSecondPhase()){
				this.singleLaserFactory.set(SHOOT_PHASE.BOSS_PHASE_1)
				this.player.reloadSet(SHOOT_PHASE.BOSS_PHASE_1)
				gauge.set(SHOOT_PHASE.BOSS_PHASE_1)
			} else {
				this.singleLaserFactory.set(SHOOT_PHASE.BOSSV1_PHASE_2)
				this.player.reloadSet(SHOOT_PHASE.BOSSV1_PHASE_2)
				gauge.set(SHOOT_PHASE.BOSSV1_PHASE_2)
			}
		}
	}
}


// TODO create test
