/// <reference path="../../../../my-typings/lib.es6.d.ts" />
import { phaser } from '../../Phaser';
import { phaserGame } from '../state/PhaserGame.singleton';

enum UILayers {
    BACKGROUND,
    PLAYER,
    FOREGROUND,
    GUI_BACKGROUND,
    VERB_BUTTONS
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

    get guiBackground(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.GUI_BACKGROUND);
    }

    get verbButtons(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.VERB_BUTTONS);
    }

    private createLayers(game: Phaser.Game): void {
        this.groups = new Map();

        //TODO: do this with a loop
        this.groups.set(UILayers.BACKGROUND, game.add.group());
        this.groups.set(UILayers.PLAYER, game.add.group());
        this.groups.set(UILayers.FOREGROUND, game.add.group());
        this.groups.set(UILayers.GUI_BACKGROUND, game.add.group());
        this.groups.set(UILayers.VERB_BUTTONS, game.add.group());
    }
}

export const uiLayers = new UILayersManager();