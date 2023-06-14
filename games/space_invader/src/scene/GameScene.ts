import Phaser from 'phaser'
import {
    RELOAD_COUNT,
    BULLET_COUNT,
    FULLCHARGE_ANIMATION_MS,
    FULLCHARGE_SCALE,
    HOLD_BAR_BORDER,
    HOLD_BAR_HEIGHT,
    HOLD_DURATION_MS,
    LASER_FREQUENCY_MS,
    LASER_SPEED,
    MARGIN,
    PLAYER_SPEED,
    PLAYER_START_MARGIN,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    HOLD_BAR_IDLE_COLOR,
    HOLD_BAR_CHARGING_COLOR,
    HOLD_BAR_CHARGED_COLOR,
    HOLD_BAR_EMPTY_COLOR,
} from "../config";

export default class GameScene extends Phaser.Scene {

    private background!: Phaser.GameObjects.TileSprite
    private player!: Phaser.Physics.Arcade.Body | Phaser.GameObjects.GameObject | any
    private timer = 0;
    private bulletCount = 0;
    private bulletKey!: Phaser.Input.Keyboard.Key;
    private holdbar!: Phaser.GameObjects.GameObject | any;
    private isReload = false;
    private isReloading = false;
    private holdbarWidth = 0;
    private chargeEmitter: Phaser.GameObjects.Particles.ParticleEmitter | any;
    private fullChargeTweens!: any;
    private reloadCount = RELOAD_COUNT;
    private reloadCountText!: Phaser.GameObjects.Text;

    constructor() {
        super('game')
    }

    preload() {
        this.load.image('background', 'assets/background/purple.png')
        this.load.image('player', 'assets/character/player/playerShip1_blue.png')
        this.load.image('jetEngine', 'assets/effect/fire03.png')
        this.load.image('laser', 'assets/effect/laserBlue02.png')
        this.load.image('charge', 'assets/effect/chargeBlue.png')
    }

    create() {
        const {width, height} = this.scale
        this.background = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0).setScrollFactor(0, 0)

        const particles = this.add.particles('jetEngine')

        const emitter = particles.createEmitter({
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

        this.player = this.physics.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT - PLAYER_START_MARGIN, 'player')
        this.fullChargeTweens = this.tweens.add({
            targets: this.player,
            scale: FULLCHARGE_SCALE,
            duration: FULLCHARGE_ANIMATION_MS,
            ease: 'sine.inout',
            yoyo: true,
            repeat: -1
        })
        this.fullChargeTweens.pause()

        this.input.keyboard.on('keydown-RIGHT', () => {
            this.player.setVelocityX(PLAYER_SPEED);
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            this.player.setVelocityX(-1 * PLAYER_SPEED);
        });

        this.input.keyboard.on('keyup-RIGHT', () => {
            this.player.setVelocityX(0);
        });

        this.input.keyboard.on('keyup-LEFT', () => {
            this.player.setVelocityX(0);
        });

        this.bulletKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.player.setCollideWorldBounds(true)

        emitter.startFollow(this.player, 0, MARGIN)
        this.chargeEmitter.startFollow(this.player)

        this.chargeEmitter.active = false

        this.add.rectangle(0, SCREEN_HEIGHT - (HOLD_BAR_HEIGHT / 2) - (2 * MARGIN), width, HOLD_BAR_HEIGHT + (MARGIN * 2), 0x000000)
            .setOrigin(0)
            .setAlpha(0.25);

        this.reloadCountText = this.add.text(width - (MARGIN + MARGIN/2), SCREEN_HEIGHT - (HOLD_BAR_HEIGHT / 2) - MARGIN - HOLD_BAR_BORDER, `${this.reloadCount}`, {fontSize: '42px'})

        this.holdbar = this.add.rectangle(MARGIN, SCREEN_HEIGHT - (HOLD_BAR_HEIGHT / 2) - MARGIN - HOLD_BAR_BORDER, width - (3 * MARGIN), HOLD_BAR_HEIGHT, 0x9966ff)
            .setOrigin(0);
        this.holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
        this.holdbarWidth = this.holdbar.width
        this.tweens.add({
            targets: this.holdbar,
            width: HOLD_BAR_BORDER / 2,
            duration: 0,
            ease: 'sine.inout'
        });
    }

    update(time: number, delta: number) {
        // scroll the background
        this.background.tilePositionY -= 1

        this.timer += delta;
        while (this.timer > LASER_FREQUENCY_MS) {
            this.timer -= LASER_FREQUENCY_MS;
            if (this.bulletCount <= 0) return;
            const laser = this.physics.add.image(this.player.x, this.player.y - 20, 'laser')
            laser.setVelocityY(-1 * LASER_SPEED)
            this.bulletCount -= 1;
            this.fullChargeTweens.restart()
            this.fullChargeTweens.pause()
        }

        if (this.reloadCount <= 0) {
            this.holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_EMPTY_COLOR);
            return;
        }
        
        const duration = this.bulletKey.getDuration();
        if (duration > HOLD_DURATION_MS) {
            this.isReload = true
            this.isReloading = false
            this.chargeEmitter.active = true
            this.chargeEmitter.start()
            this.fullChargeTweens.play()
            this.holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGED_COLOR);
        } else if (duration <= HOLD_DURATION_MS && duration !== 0) {
            this.isReloading = true
            this.holdbar.width += (this.holdbarWidth + (HOLD_BAR_BORDER * 2)) / (HOLD_DURATION_MS / delta)
            this.chargeEmitter.active = true
            this.chargeEmitter.start()
            this.holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_CHARGING_COLOR);
        }

        if (this.isReload && this.bulletKey.isUp) {
            this.bulletCount = BULLET_COUNT
            this.isReload = false
            this.chargeEmitter.stop()
            this.tweens.add({
                targets: this.holdbar,
                width: HOLD_BAR_BORDER / 2,
                duration: LASER_FREQUENCY_MS * BULLET_COUNT,
                ease: 'sine.inout'
            });
            this.reloadCount -= 1
            this.reloadCountText.text = `${this.reloadCount}`
            this.holdbar.setStrokeStyle(HOLD_BAR_BORDER, HOLD_BAR_IDLE_COLOR);
        }

        if (this.isReloading && this.bulletKey.isUp) {
            this.tweens.add({
                targets: this.holdbar,
                width: HOLD_BAR_BORDER / 2,
                duration: LASER_FREQUENCY_MS * BULLET_COUNT * (this.holdbar.width / this.holdbarWidth),
                ease: 'sine.inout'
            });
            this.isReloading = false
            this.chargeEmitter.stop()
        }

    }
}

// add credit to (Kenney or www.kenney.nl) for graphics
