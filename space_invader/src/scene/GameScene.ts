import Phaser from 'phaser'
import {
    BULLET_COUNT,
    DESTROY_METEOR_SCORE,
    GAME_TIME_LIMIT_MS,
    HIT_METEOR_SCORE,
    HOLD_BAR_BORDER,
    HOLD_BAR_CHARGED_COLOR,
    HOLD_BAR_CHARGING_COLOR,
    HOLD_BAR_EMPTY_COLOR,
    HOLD_BAR_HEIGHT,
    HOLD_BAR_IDLE_COLOR,
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
import Holdbar from "../component/ui/Holdbar";
import MergedInput from 'phaser3-merged-input'
import { SingleLaserFactory } from "../component/weapon/SingleLaserFactory"
//import { TripleLaserFactory} from "../component/weapon/TripleLaserFactory";

export default class GameScene extends Phaser.Scene {

    private background!: Phaser.GameObjects.TileSprite
    private player: Player | any
//    private player!: Phaser.Physics.Arcade.Body | Phaser.GameObjects.GameObject | any
    private timer = 0;
    private meteorTimer = 0;
    private bulletCount = 0;
    private isReload = false;
    private isReloading = false;
    private holdbarWidth = 0;

    private holdbar: Holdbar;
    private holdbars!: Phaser.GameObjects.GameObject[] | any[];

    private chargeEmitter: Phaser.GameObjects.Particles.ParticleEmitter | any;
    private reloadCount = RELOAD_COUNT;
    private reloadCountText!: Phaser.GameObjects.Text;
    private isHit = false;
    private score = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private meteors: Phaser.Physics.Arcade.Body[] | Phaser.GameObjects.GameObject[] | any[] = [];
    private explosionEmitter: Phaser.GameObjects.Particles.ParticleEmitter | any;
    private holdButtonDuration = 0;
    private mergedInput?: MergedInput;
    private controller1: any;
    private timerText!: Phaser.GameObjects.Text;

    constructor() {
        super('game')
        this.holdbar = new Holdbar(this, 1)
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
        this.load.scenePlugin('mergedInput', MergedInput);
    }

    create() {
//        const params = new Proxy(new URLSearchParams(window.location.search), {
//            get: (searchParams, prop: string) => searchParams.get(prop),
//        });
        // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
//      console.log(window.location.href)

        const {width, height} = this.scale
        this.background = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0).setScrollFactor(0, 0)

        this.controller1 = this.mergedInput?.addPlayer(0);
        // https://github.com/photonstorm/phaser/blob/v3.51.0/src/input/keyboard/keys/KeyCodes.js#L7
        this.mergedInput?.defineKey(0, 'LEFT', 'LEFT')
            .defineKey(0, 'RIGHT', 'RIGHT')
            .defineKey(0, 'B0', 'SPACE')
            .defineKey(0, 'B1', 'CTRL')
            .defineKey(0, 'B2', 'ALT')

        const jetEngine = this.add.particles('fire')
        const jetEngineEmitter = jetEngine.createEmitter({
            gravityY: 200,
            speed: 100,
            scale: {start: 1, end: 0},
            blendMode: Phaser.BlendModes.ADD,
        })

        const charge = this.add.particles('charge')
        this.chargeEmitter = charge.createEmitter({
            speed: 64,
            scale: 0.1,
            blendMode: Phaser.BlendModes.ADD,
        })

        const explosion = this.add.particles('explosion')
        this.explosionEmitter = explosion.createEmitter({
            speed: 80,
            scale: 0.6,
            blendMode: Phaser.BlendModes.ADD,
            gravityY: -20,
        })
        this.explosionEmitter.active = false

        this.player = new Player(this)

        jetEngineEmitter.startFollow(this.player.getPlayer(), 0, MARGIN)
        this.chargeEmitter.startFollow(this.player.getPlayer())
        this.chargeEmitter.active = false

        this.add.rectangle(0, SCREEN_HEIGHT, width, HOLD_BAR_HEIGHT + (MARGIN * 2), 0x000000)
            .setOrigin(0, 1)
            .setAlpha(0.25);

        this.holdbarWidth = this.holdbar.getWidth();
        this.holdbars = this.holdbar.createbyDivision()

        this.reloadCountText = this.add.text(MARGIN + this.holdbarWidth + MARGIN / 2, SCREEN_HEIGHT - MARGIN + HOLD_BAR_BORDER, `${this.reloadCount}`, {fontSize: '42px'})
            .setOrigin(0, 1)

        this.scoreText = this.add.text(MARGIN, MARGIN, `score: ${this.score}`, {fontSize: '42px'})
        this.timerText = this.add.text(SCREEN_WIDTH - MARGIN, MARGIN, `time: ${Math.floor(GAME_TIME_LIMIT_MS / 1000)}`, {fontSize: '42px'}).setOrigin(1, 0)
    }

    update(time: number, delta: number) {

//        if (this.input.gamepad.total === 0) {
//            const text = this.add.text(0, SCREEN_HEIGHT / 2, START_TEXT, {fontSize: '24px'}).setOrigin(0);
//            text.x = SCREEN_WIDTH / 2 - text.width / 2
//            this.input.gamepad.once('connected', function () {
//                text.destroy();
//            }, this);
//            return;
//        }
//        const pad = this.input.gamepad.gamepads[0]

        const timeLeft = Math.floor((GAME_TIME_LIMIT_MS - time) / 1000)
        this.timerText.text = `time: ${timeLeft}`
        if (timeLeft <= 0) {
            this.scene.pause()
        }

        if (this.controller1.direction.LEFT) {
            this.player.moveLeft(delta)
        }

        if (this.controller1.direction.RIGHT) {
            this.player.moveRight(delta)
        }

        if (this.controller1.buttons.B0 > 0) {
            this.holdButtonDuration += delta;
        }

        // scroll the background
        this.background.tilePositionY -= 1

        this.meteorTimer += delta;
        let meteor;
        while (this.meteorTimer > METEOR_FREQUENCY_MS) {
            this.meteorTimer -= METEOR_FREQUENCY_MS;
            meteor = this.createRandomMeteor()
            this.meteors.forEach(meteor => {
                if (!meteor.active) {
                    this.meteors.splice(this.meteors.indexOf(meteor), 1)
                    return
                }
            })
            this.meteors.push(meteor)
        }

        this.timer += delta;
        while (this.timer > LASER_FREQUENCY_MS) {
            this.timer -= LASER_FREQUENCY_MS;
            if (this.bulletCount <= 0) return;
            const laser = new SingleLaserFactory().createLaser(this, this.player)
            const laserBodies = laser.shoot()
            this.bulletCount -= 1;
            if (!Array.isArray(this.meteors) || this.meteors.length === 0) continue;
            this.meteors.forEach(meteor => {
                laserBodies.forEach(laserBody => {
                    this.physics.add.overlap(laserBody, meteor, (_, _meteor) => {
                        this.explosionEmitter.startFollow(_meteor)
                        this.explosionEmitter.active = true
                        this.explosionEmitter.start()
                        this.time.delayedCall(200, () => {
                            this.explosionEmitter.stop()
                        })
                        _meteor.destroy();
                        this.score += DESTROY_METEOR_SCORE
                        this.scoreText.text = `score: ${this.score}`
                    })
                })
            })
            this.time.delayedCall(5000, () => {
                laser.destroy()
            })
        }

        if (this.reloadCount <= 0) {
            this.holdbars[0].setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_EMPTY_COLOR);
            return;
        }

        if (this.holdButtonDuration > HOLD_DURATION_MS && this.controller1.buttons.B0 > 0) {
            this.isReload = true
            this.isReloading = false
            this.chargeEmitter.active = true
            this.holdbars[0].setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGED_COLOR);
        } else if (this.holdButtonDuration <= HOLD_DURATION_MS && this.holdButtonDuration !== 0 && this.controller1.buttons.B0 > 0) {
            this.isReloading = true
            this.holdbars[0].width += (this.holdbarWidth + (HOLD_BAR_BORDER/2)) / (HOLD_DURATION_MS / delta)
            this.chargeEmitter.active = true
            this.chargeEmitter.start()
            this.holdbars[0].setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGING_COLOR);
        }

        if (this.isReload && !(this.controller1.buttons.B0 > 0)) {
            this.bulletCount = BULLET_COUNT
            this.isReload = false
            this.chargeEmitter.stop()
            this.tweens.add({
                targets: this.holdbars[0],
                width: HOLD_BAR_BORDER / 2,
                duration: LASER_FREQUENCY_MS * BULLET_COUNT,
                ease: 'sine.inout'
            });
            this.reloadCount -= 1
            this.reloadCountText.text = `${this.reloadCount}`
            this.holdbars[0].setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
            this.holdButtonDuration = 0
        }

        if (this.isReloading && !(this.controller1.buttons.B0 > 0)) {
            this.isReloading = false
            this.tweens.add({
                targets: this.holdbars[0],
                width: HOLD_BAR_BORDER / 2,
                duration: LASER_FREQUENCY_MS * BULLET_COUNT * (this.holdbars[0].width / this.holdbarWidth),
                ease: 'sine.inout'
            });
            this.chargeEmitter.stop()
            this.holdbars[0].setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
            this.holdButtonDuration = 0
        }

    }

    createRandomMeteor(): Phaser.Physics.Arcade.Body | Phaser.GameObjects.GameObject | any {
        const imageNumber = Math.floor(Math.random() * 4) + 1
        const startingX = Math.floor(Math.random() * SCREEN_WIDTH)
        const meteor = this.physics.add.image(startingX, -MARGIN, `meteor${imageNumber}`)
        meteor.setVelocityY(METEOR_SPEED)
        const velocityX = Math.floor(Math.random() * (METEOR_SPEED / 3) - (METEOR_SPEED / 6));
        meteor.setVelocityX(velocityX)
        meteor.setAngularVelocity(METEOR_SPIN_SPEED);

        this.physics.add.overlap(this.player, meteor, (_, _meteor) => {
            if (this.isHit) return;
            this.isHit = true
            this.player.damaged()
            this.score += HIT_METEOR_SCORE
            this.scoreText.text = `score: ${this.score}`
            this.time.delayedCall(PLAYER_HIT_DELAY_MS, () => {
                this.isHit = false
                this.player.recovered()
            })

        })
        this.time.delayedCall(5000, () => {
            meteor.destroy()
        })
        return meteor;
    }
}

// https://labs.phaser.io/view.html?src=src/physics/arcade/disable%20collider.js

// add credit to (Kenney or www.kenney.nl) for graphics

// TODO crete player, bullet, chargebar, emermy class
// Player asset, render(), shoot(), moveLeft(), moveRight(),
// TODO create test

