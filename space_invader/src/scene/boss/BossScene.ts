import Player from 'component/player/Player'
import InhaleGaugeRegistry from 'component/ui/InhaleGaugeRegistry'
import Score from 'component/ui/Score'
import { SingleLaserFactory } from 'component/weapon/SingleLaserFactory'
import {
    COLLECT_BULLET_COUNT,
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
import { Boss, BossCutScene, BossPhase, BossTutorialScene, ShootingPhase } from 'component/enemy/boss/Boss'
import { BossInterface } from './bossInterface'
import SoundManager from 'component/sound/SoundManager'
import { B1Boss } from 'component/enemy/boss/B1Boss'

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
	private boss!: Boss

	private bossLayer!: Phaser.GameObjects.Layer
	private isCompleteItemTutorial!: boolean
	private bulletText!: Phaser.GameObjects.Text

	private isCompleteInit = false
  private props!: BossInterface
	private bgm!: Phaser.Sound.BaseSound
	private soundManager: SoundManager

	constructor() {
		super({ key: 'bossScene' })
		this.soundManager = new SoundManager(this)
	}

	preload() {
		this.load.image('boss_background', 'assets/background/bg_boss.jpg')

		this.load.atlas(
			'player',
			'assets/character/player/mc_spritesheet.png',
			'assets/character/player/mc_spritesheet.json',
		)

		this.load.atlas(
			'b1v1',
			'assets/character/enemy/b1v1_spritesheet.png',
			'assets/character/enemy/b1v1_spritesheet.json',
		)

		this.load.atlas('bossAsset', 'assets/sprites/boss/asset_boss.png', 'assets/sprites/boss/asset_boss.json');

		this.load.atlas('ui', 'assets/ui/asset_warmup.png', 'assets/ui/asset_warmup.json');

		this.load.image('laser', 'assets/effect/mc_bullet.png')

		this.load.audio('lapChangedSound', 'sound/soundeffect_count_round.mp3')

		this.load.image('progress_bar', 'assets/ui/progress_bar.png')

		this.load.image('meteor1', 'assets/character/enemy/meteorBrown_big1.png')
    	this.load.image('meteor2', 'assets/character/enemy/meteorBrown_big2.png')
    	this.load.image('meteor3', 'assets/character/enemy/meteorBrown_big3.png')
    	this.load.image('meteor4', 'assets/character/enemy/meteorBrown_big4.png')

		this.load.svg('resume', 'assets/icon/resume.svg')

		this.load.audio('shootSound', 'sound/shooting-sound-fx-159024.mp3')
		this.load.audio('meteorDestroyedSound', 'sound/rock-destroy-6409.mp3')
		this.load.audio('chargingSound', 'sound/futuristic-beam-81215.mp3')
		this.load.audio('chargedSound', 'sound/sci-fi-charge-up-37395.mp3')
		this.load.audio('boss_bgm', 'sound/BGM_BossScene.mp3')
		this.load.audio('bossHit1', 'sound/boss-hit1.mp3')
		this.load.audio('bossHit2', 'sound/boss-hit2.mp3')
		this.load.audio('bossHit3', 'sound/boss-hit3.mp3')
		this.load.audio('bossHit4', 'sound/boss-hit4.mp3')

		this.load.scenePlugin('mergedInput', MergedInput)
		this.load.script(
			'webfont',
			'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
		)
	}

	init(props: BossInterface) {
	 this.props = props
	}

	async create() {
	  const { score,	playerX, reloadCount} = this.props
		const { width, height } = this.scale

		this.background = this.add
			.tileSprite(0, 0, width, height, 'boss_background')
			.setOrigin(0)
			.setScrollFactor(0, 0)

		this.bgm = this.sound.add('boss_bgm', {volume: 1, loop: true})
    	this.soundManager.init()
    	this.soundManager.play(this.bgm)

		this.bossLayer = this.add.layer()

		this.player = new Player(this, this.bossLayer)
		this.player.getBody().setX(playerX)
		this.player.addChargeParticle()

		new Menu(this)

		this.singleLaserFactory = new SingleLaserFactory()

	  this.score = new Score(this)
		this.score.setScore(score)

		this.reloadCount = new ReloadCount(this, width / 2, MARGIN)
    this.reloadCount.getBody().setOrigin(0.5, 0)
    this.reloadCount.setCount(reloadCount)

  //   const classRef = await importClassByName<Boss>(`${name}Boss`);
		// this.boss = new classRef(this, this.player, this.score)
		this.boss = new B1Boss(this, this.player, this.score)
		this.isCompleteInit = true

		this.gaugeRegistry = new InhaleGaugeRegistry(this)
		this.gaugeRegistry.createbyDivision(1)
		this.gaugeRegistry.get(0).setVisibleAll(false)

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
                    .text(width /2 , height - MARGIN + HOLD_BAR_BORDER, ` /${COLLECT_BULLET_COUNT}`)
                    .setFontSize(LARGE_FONT_SIZE)
                    .setOrigin(0.5, 1)
        this.bulletText.setVisible(false)
	}

	update(_: number, delta: number) {
	  if(!this.isCompleteInit) return

		const gauge = this.gaugeRegistry?.get(0)
		gauge.setVisibleAll(false)

		if (!this.boss.getIsStartAttack() && !this.boss.getIsItemPhase()) {
			// Boss Phase 1
			this.boss.startAttackPhase(BossPhase.PHASE_1)
			this.scene.launch(BossTutorialScene.ATTACK_BOSS)
		}

		if (!this.isCompleteItemTutorial && this.boss.getIsItemPhase()) {
			this.isCompleteItemTutorial = true
			this.scene.pause()
			this.scene.launch(BossCutScene.ESCAPE)
		} else if (this.boss.getIsItemPhase() && !this.player.getIsBulletFull()){
			// Collecting Item Phase
			this.meteorFactory.createByTime(this, this.player, this.score, delta)
			this.poisonFactory.createByTime(this, this.player, this.score, gauge, delta)
			this.bulletFactory.createByTime(this, this.player, this.score, gauge, delta)

			this.bulletText.setVisible(true)
        	this.bulletText.setText(` ${this.player.getBulletCount()} / ${COLLECT_BULLET_COUNT}`)

		} else if(this.player.getIsBulletFull() && !this.boss.getIsStartAttack()){
			// Boss Phase 2
			this.bulletText.setVisible(false)
			this.scene.launch(BossTutorialScene.ATTACK_BOSS)
			this.boss.startAttackPhase(BossPhase.PHASE_2)
		}

		if(this.boss.getIsSecondPhase() && !this.boss.getIsAttackPhase() && !this.boss.getIsItemPhase()){
			this.scene.launch(BossCutScene.ESCAPE2, {score: this.score.getScore(), reloadCount: this.reloadCount.getCount()})
			this.scene.pause()
			this.boss.resetState()
			setTimeout(() => {
				this.soundManager.stop(this.bgm)
			}, 5000)
			// TODO booster
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
				this.singleLaserFactory.set(ShootingPhase.BOSS_PHASE_1)
				this.player.reloadSet(ShootingPhase.BOSS_PHASE_1)
				gauge.set(ShootingPhase.BOSS_PHASE_1)
			} else {
				this.singleLaserFactory.set(ShootingPhase.BOSSV1_PHASE_2)
				this.player.reloadSet(ShootingPhase.BOSSV1_PHASE_2)
				gauge.set(ShootingPhase.BOSSV1_PHASE_2)
			}
		}
	}
}


// TODO create test
