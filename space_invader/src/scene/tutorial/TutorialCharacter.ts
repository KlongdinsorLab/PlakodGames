import Phaser from 'phaser'
import {Meteor} from "component/enemy/Meteor";
import Player from "component/player/Player";

export type Character = {
    meteor: Meteor
    player: Player
}

export default class TutorialCharacterScene extends Phaser.Scene {


    private meteor!: Meteor
    private player!: Player

    constructor() {
        super('tutorial character');
    }

    init({meteor, player}: Character){
        this.meteor = meteor
        this.player = player
    }

    create() {
        const { width, height } = this.scale
        this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)

        this.add.text(this.meteor.getBody().x, this.meteor.getBody().y, "meteor").setOrigin(0.5, 0.5)
        this.add.text(this.player.getBody().x, this.player.getBody().y, "player").setOrigin(0.5, 0.5)

        this.input.once('pointerdown', () => {
            this.scene.resume('game')
            this.scene.remove('tutorial character')
        }, this);
    }
}