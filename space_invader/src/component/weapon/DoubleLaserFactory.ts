import { DoubleLaser} from "./DoubleLaser";
import { Laser } from "./Laser";
import { WeaponFactory} from "./WeaponFactory";

export class DoubleLaserFactory extends WeaponFactory {
    createLaser(): Laser {
        return new DoubleLaser();
    }
}