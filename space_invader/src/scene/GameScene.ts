import Phaser from 'phaser'
import {
    BULLET_COUNT,
    DESTROY_METEOR_SCORE,
//    GAME_TIME_LIMIT_MS,
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
import HoldbarRegistry from "../component/ui/HoldbarRegistry";
import MergedInput, {Player as PlayerInput} from 'phaser3-merged-input'
import Score from "../component/ui/Score";
import {SingleLaserFactory} from "../component/weapon/SingleLaserFactory"
//import { TripleLaserFactory} from "../component/weapon/TripleLaserFactory";

export default class GameScene extends Phaser.Scene {

    private background!: Phaser.GameObjects.TileSprite
    private player: Player | any
    private timer = 0;
    private meteorTimer = 0;
    private bulletCount = 0;
    private isReload = false;
    private isReloading = false;

    private holdbars!: HoldbarRegistry;
    private score!: Score;

    private chargeEmitter: Phaser.GameObjects.Particles.ParticleEmitter | any;
    private reloadCount = RELOAD_COUNT;
    private reloadCountText!: Phaser.GameObjects.Text;
    private isHit = false;
    private meteors: Phaser.Physics.Arcade.Body[] | Phaser.GameObjects.GameObject[] | any[] = [];
    private explosionEmitter: Phaser.GameObjects.Particles.ParticleEmitter | any;

    private mergedInput?: MergedInput;
    private controller1?: PlayerInput | any;
//    private timerText!: Phaser.GameObjects.Text;

    private controlType?: 'tilt' | 'touch'
    private tilt?: 'left' | 'right' | null

    private gameover?: Phaser.GameObjects.Image;

    constructor() {
        super({key: 'game'})
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
        this.load.scenePlugin('mergedInput', MergedInput);
    }

    create() {
//        const params = new Proxy(new URLSearchParams(window.location.search), {
//            get: (searchParams, prop: string) => searchParams.get(prop),
//        });

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.controlType = <'tilt' | 'touch'>urlParams.get('control')

//      Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
//        console.log(window.location.href)

        const {width, height} = this.scale
        this.background = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0).setScrollFactor(0, 0)

        this.controller1 = this.mergedInput?.addPlayer(0);
        // https://github.com/photonstorm/phaser/blob/v3.51.0/src/input/keyboard/keys/KeyCodes.js#L7
        this.mergedInput?.defineKey(0, 'LEFT', 'LEFT')
            .defineKey(0, 'RIGHT', 'RIGHT')
            .defineKey(0, 'B0', 'SPACE')
            .defineKey(0, 'B1', 'CTRL')
            .defineKey(0, 'B2', 'ALT')

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
        this.player.addJetEngine()

        this.chargeEmitter.startFollow(this.player.getPlayer())
        this.chargeEmitter.active = false

        this.add.rectangle(0, SCREEN_HEIGHT, width, HOLD_BAR_HEIGHT + (MARGIN * 2), 0x000000)
            .setOrigin(0, 1)
            .setAlpha(0.25);

        this.holdbars = new HoldbarRegistry(this)
        this.holdbars.createbyDivision(1)

        this.reloadCountText = this.add.text(SCREEN_WIDTH, SCREEN_HEIGHT - MARGIN + HOLD_BAR_BORDER, `${this.reloadCount}`, {fontSize: '42px'})
            .setOrigin(1, 1)

        this.score = new Score(this)
//        this.timerText = this.add.text(SCREEN_WIDTH - MARGIN, MARGIN, `time: ${Math.floor(GAME_TIME_LIMIT_MS / 1000)}`, {fontSize: '42px'}).setOrigin(1, 0)

        this.gameover = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'gameover').setOrigin(0.5, 1)
        this.gameover.visible = false

        if (this.controlType === 'tilt') {
            window.addEventListener("deviceorientation", (e) => {
                {
                    const x = <number> e.gamma
                    if(x >= -90 && x < -15) {
                        this.tilt = "left"
                        return;
                    }

                    if(x > 15 && x <= 90) {
                        this.tilt = "right"
                        return;
                    }

                    this.tilt = null

                }
            }, true);
        }
    }

    update(_: number, delta: number) {

//        if (this.input.gamepad.total === 0) {
//            const text = this.add.text(0, SCREEN_HEIGHT / 2, START_TEXT, {fontSize: '24px'}).setOrigin(0);
//            text.x = SCREEN_WIDTH / 2 - text.width / 2
//            this.input.gamepad.once('connected', function () {
//                text.destroy();
//            }, this);
//            return;
//        }
//        const pad = this.input.gamepad.gamepads[0]

        const holdbar = this.holdbars?.get(0)

//        const timeLeft = Math.floor((GAME_TIME_LIMIT_MS - time) / 1000)
//        this.timerText.text = `time: ${timeLeft}`
//        if (timeLeft <= 0) {
//            this.scene.pause()
//        }

        if (this.controller1?.direction.LEFT) {
            this.player.moveLeft(delta)
        }

        if (this.controller1?.direction.RIGHT) {
            this.player.moveRight(delta)
        }

        if (this.controller1?.buttons.B0 > 0) {
            holdbar.hold(delta)
        }

        if (this.controlType === 'tilt') {
            if(this.tilt === 'right') {
                this.player.moveRight(delta)
            }

            if(this.tilt === 'left') {
                this.player.moveLeft(delta)
            }
        }

        if (this.controlType === 'touch') {
            if (!this.input.pointer1.isDown) return
            const {x} = this.input.pointer1
            if (this.player.isRightOf(x)) {
                this.player.moveRight(delta)
            }
            if (this.player.isLeftOf(x)) {
                this.player.moveLeft(delta)
            }
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
                        this.score.add(DESTROY_METEOR_SCORE)
                    })
                })
            })
            this.time.delayedCall(5000, () => {
                laser.destroy()
            })
        }

        if (this.reloadCount <= 0) {
            holdbar.deplete()
            return;
        }

        if (holdbar.getDuratation() > HOLD_DURATION_MS && this.controller1?.buttons.B0 > 0) {
            this.isReload = true
            this.isReloading = false
            this.chargeEmitter.active = true
            holdbar.setFullCharge()
        } else if (holdbar.getDuratation() <= HOLD_DURATION_MS && holdbar.getDuratation() !== 0 && this.controller1?.buttons.B0 > 0) {
            this.isReloading = true
            this.chargeEmitter.active = true
            this.chargeEmitter.start()
            holdbar.charge(delta)
        }

        if (this.isReload && !(this.controller1?.buttons.B0 > 0)) {
            this.bulletCount = BULLET_COUNT
            this.isReload = false
            this.chargeEmitter.stop()
            holdbar.reset()
            this.reloadCount -= 1
            this.reloadCountText.text = `${this.reloadCount}`
            if (this.reloadCount === 0) {
                setTimeout(() => {
                    this.scene.pause()
                    this.gameover!.visible = true
                }, LASER_FREQUENCY_MS * BULLET_COUNT)
            }

        }

        if (this.isReloading && !(this.controller1?.buttons.B0 > 0)) {
            this.isReloading = false
            this.chargeEmitter.stop()
            holdbar.resetting()
        }

        if (holdbar.isReducing()) {
            holdbar.release(delta)
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

        this.physics.add.overlap(this.player.getPlayer(), meteor, (_, _meteor) => {
            if (this.isHit) return;
            this.isHit = true
            this.player.damaged()
            this.score.add(HIT_METEOR_SCORE)
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
