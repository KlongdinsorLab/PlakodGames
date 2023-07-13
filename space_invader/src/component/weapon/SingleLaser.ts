import {Laser} from "./Laser";

export class SingleLaser extends Laser {
    
//    private scene: Phaser.Scene
    
//    constructor(scene: Phaser.Scene) {
//        super();
//        this.scene = scene
//        scene.physics.add.image(laserX, laserY, 'laser')
//    }
    shoot(): void {
        console.log('single shoot')
    }
    
}