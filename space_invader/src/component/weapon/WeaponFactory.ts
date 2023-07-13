import {Laser} from "./Laser";

export abstract class WeaponFactory {
    abstract createLaser(): Laser
}