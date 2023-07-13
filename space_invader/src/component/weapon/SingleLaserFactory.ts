import { SingleLaser } from './SingleLaser'
import { Laser } from "./Laser";
import { WeaponFactory} from "./WeaponFactory";

export class SingleLaserFactory extends WeaponFactory {
    createLaser(): Laser {
        return new SingleLaser();
    }
}