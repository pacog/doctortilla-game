/// <reference path="../../../../my-typings/lib.es6.d.ts" />
import { phaser } from '../../Phaser';
import { phaserGame } from '../state/PhaserGame.singleton';

enum UILayers {
    BACKGROUND,
    PLAYER,
    FOREGROUND
}

class UILayersManager {

    private groups: Map<UILayers, Phaser.Group>;
    private initialised: Boolean = false;

    private init(): void {
        if (!this.initialised) {
            if (!phaserGame.value) {
                throw 'ERROR: initing UILayers when game is still not there';
            }
            this.createLayers(phaserGame.value);
            this.initialised = true;
        }
    }

    get background(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.BACKGROUND);
    }

    get player(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.PLAYER);
    }

    get foreground(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.FOREGROUND);
    }

    private createLayers(game: Phaser.Game): void {
        this.groups = new Map();
        this.groups.set(UILayers.BACKGROUND, game.add.group());
        this.groups.set(UILayers.PLAYER, game.add.group());
        this.groups.set(UILayers.FOREGROUND, game.add.group());
    }
}

export const uiLayers = new UILayersManager();