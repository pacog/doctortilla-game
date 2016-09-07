import { Costume } from '../backstageScene/Costume';
import { DoctortillaPlayer } from '../DoctortillaPlayer';

class CostumeCreator {
    private costume: Costume;

    constructor() {
        this.costume = null;
    }

    addFlowers(player: DoctortillaPlayer) {
        this.createCostumeIfNeeded();
        this.costume.addFlowers(player);
    }

    addCoconut(player: DoctortillaPlayer) {
        this.createCostumeIfNeeded();
        this.costume.addCoconut(player);
    }

    addSkirt(player: DoctortillaPlayer) {
        this.createCostumeIfNeeded();
        this.costume.addSkirt(player);
    }

    private createCostumeIfNeeded(): void {
        if(!this.costume) {
            this.costume = new Costume();
        }
    }

}

export const costumeCreator = new CostumeCreator();