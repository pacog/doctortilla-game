/// <reference path="../../../../my-typings/lib.es6.d.ts" />
import { phaser } from '../../Phaser';
import { phaserGame } from '../state/PhaserGame.singleton';

enum UILayers {
    BACKGROUND,
    BACKGROUND_OBJECTS,
    PLAYER,
    FOREGROUND_OBJECTS,
    FOREGROUND,
    TEXT_IN_SCENE,
    GUI_BACKGROUND,
    VERB_BUTTONS,
    CONVERSATION,
    UI_BLOCKER,
    SOUND_BUTTONS
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

    get backgroundObjects(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.BACKGROUND_OBJECTS);
    }

    get player(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.PLAYER);
    }

    get foregroundObjects(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.FOREGROUND_OBJECTS);
    }

    get foreground(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.FOREGROUND);
    }

    get textInScene(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.TEXT_IN_SCENE);
    }

    get guiBackground(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.GUI_BACKGROUND);
    }

    get verbButtons(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.VERB_BUTTONS);
    }

    get conversation(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.CONVERSATION);
    }

    get uiBlocker(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.UI_BLOCKER);
    }

    get soundButtons(): Phaser.Group {
        this.init();
        return this.groups.get(UILayers.SOUND_BUTTONS);
    }

    private createLayers(game: Phaser.Game): void {
        this.groups = new Map();

        this.groups.set(UILayers.BACKGROUND, game.add.group());
        this.groups.set(UILayers.BACKGROUND_OBJECTS, game.add.group());
        this.groups.set(UILayers.PLAYER, game.add.group());
        this.groups.set(UILayers.FOREGROUND_OBJECTS, game.add.group());
        this.groups.set(UILayers.FOREGROUND, game.add.group());
        this.groups.set(UILayers.TEXT_IN_SCENE, game.add.group());
        this.groups.set(UILayers.GUI_BACKGROUND, game.add.group());
        this.groups.set(UILayers.VERB_BUTTONS, game.add.group());
        this.groups.set(UILayers.CONVERSATION, game.add.group());
        this.groups.set(UILayers.UI_BLOCKER, game.add.group());
        this.groups.set(UILayers.SOUND_BUTTONS, game.add.group());
    }
}

export const uiLayers = new UILayersManager();