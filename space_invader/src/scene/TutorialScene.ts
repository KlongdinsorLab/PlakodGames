import Phaser from 'phaser'
import {
    BULLET_COUNT,
    DESTROY_METEOR_SCORE,
    HIT_METEOR_SCORE,
    HOLD_BAR_BORDER,
    HOLD_BAR_HEIGHT,
    HOLD_DURATION_MS,
    LASER_FREQUENCY_MS,
    MARGIN,
    METEOR_FREQUENCY_MS,
    METEOR_SPEED,
    METEOR_SPIN_SPEED,
    PLAYER_HIT_DELAY_MS,
    RELOAD_COUNT,
    SCREEN_HEIGHT,
    SCREEN_WIDTH
} from "../config";
import Player from "../component/player/Player"
import InhaleGaugeRegistry from "../component/ui/InhaleGaugeRegistry";
import MergedInput, {Player as PlayerInput} from 'phaser3-merged-input'
import Score from "../component/ui/Score";
import {SingleLaserFactory} from "../component/weapon/SingleLaserFactory"
import SoundManager from "../component/sound/SoundManager"

export default class TutorialScene extends Phaser.Scene {

//    private background!: Phaser.GameObjects.TileSprite
//    private player!: Player
//    private timer = 0;
//    private bulletCount = 0; // TODO Move to SingleLaserFactory
//    private isReload = false;
//    private isReloading = false;
//
//    private holdbars!: InhaleGaugeRegistry;
//    private score!: Score;
//
//    private chargeEmitter!: Phaser.GameObjects.Particles.ParticleEmitter; // TODO Move
//    private reloadCount = RELOAD_COUNT;
//    private reloadCountText!: Phaser.GameObjects.Text;
//
//    private mergedInput?: MergedInput;
//    private controller1?: PlayerInput | any;
//    //    private timerText!: Phaser.GameObjects.Text;
//    private gameover?: Phaser.GameObjects.Image;
//
//    private singleLaserFactory!: SingleLaserFactory
//    private meteorFactory!: MeteorFactory


    constructor() {
        super({key: 'tutorial'})
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

        this.load.audio('shootSound', 'sound/shooting-sound-fx-159024.mp3');
        this.load.audio('meteorDestroyedSound', 'sound/rock-destroy-6409.mp3')
        this.load.audio('chargingSound', 'sound/futuristic-beam-81215.mp3')
        this.load.audio('chargedSound', 'sound/sci-fi-charge-up-37395.mp3')

        this.load.scenePlugin('mergedInput', MergedInput);
    }

    create() {
        // TODO
    }

    update(_: number, delta: number) {
        // TODO
    }
}

// TODO crete emermy class
// TODO create test
