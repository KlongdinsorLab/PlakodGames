import Phaser from 'phaser'
import MergedInput, {Player as InputPlayer} from 'phaser3-merged-input'
import Player from "../component/player/Player"
import {START_TEXT} from "../config";

export default class TitleScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite
    private mergedInput?: MergedInput;
    private controller1?: InputPlayer | any;
    private player?: Player

    constructor() {
        super('title')
    }

    preload() {
        this.load.image('background', 'assets/background/purple.png')
        this.load.image('logo', 'assets/logo/logo.png')
        this.load.image('player', 'assets/character/player/playerShip1_blue.png')
        this.load.image('fire', 'assets/effect/fire03.png')
        this.load.scenePlugin('mergedInput', MergedInput);
    }

    create() {
        const {width, height} = this.scale
        this.background = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0).setScrollFactor(0, 0)
        this.add.image(width / 2, height / 2, 'logo').setOrigin(0.5, 1)
        this.add.text(width / 2, height / 2, START_TEXT, {fontSize: '24px'}).setOrigin(0.5, 0)

        this.controller1 = this.mergedInput?.addPlayer(0);
        this.mergedInput?.defineKey(0, 'LEFT', 'LEFT')
            .defineKey(0, 'RIGHT', 'RIGHT')
            .defineKey(0, 'B0', 'SPACE')
            .defineKey(0, 'B1', 'CTRL')
            .defineKey(0, 'B2', 'ALT')

        this.player = new Player(this)
        this.player.addJetEngine()
    }

    update() {

        this.background.tilePositionY -= 1

        if (this.controller1?.direction.LEFT || this.controller1?.direction.RIGHT || this.controller1?.buttons.B0 > 0) {
            this.scene.start('game');
        }

        if (this.input.pointer1.isDown) {
            this.scene.start('game');
        }

    }
}