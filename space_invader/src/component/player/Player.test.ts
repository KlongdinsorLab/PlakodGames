import { beforeAll, describe, test, expect } from "vitest";
import {MARGIN, SCREEN_HEIGHT, SCREEN_WIDTH} from "config";
import GameScene from "scene/GameScene";
import WarmupScene from "../../scene/warmup/WarmupScene";


describe("describe", () => {
    
//    let game!: Phaser.Game
    
    beforeAll(() => {
//        const config: Phaser.Types.Core.GameConfig = {
//            type: Phaser.AUTO,
//            parent: 'app',
//            width: SCREEN_WIDTH,
//            height: SCREEN_HEIGHT,
//            input: {
//                gamepad: true,
//            },
//            scale: {
//                mode: Phaser.Scale.FIT,
//                autoCenter: Phaser.Scale.CENTER_BOTH,
//            },
//            physics: {
//                default: 'arcade',
//                arcade: {},
//            },
//            dom: {
//                createContainer: true,
//            },
//            scene: [
//                GameScene,
//                WarmupScene
//            ],
//        }
//        game = new Phaser.Game(config)
    });
    
    test('test', ()=> {
        expect(48).eq(MARGIN)
    })
})