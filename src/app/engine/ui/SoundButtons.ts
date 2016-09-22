import { IPoint } from '../utils/Interfaces';
import { layout } from './LayoutManager.singleton';
import { phaser } from '../../Phaser';
import { phaserGame } from '../state/PhaserGame.singleton';
import { uiLayers } from './UILayers.singleton';
import { sound } from '../sound/SoundManager';
import { Observable, ICallback } from '../utils/Observable';

export class SoundButtonsUI {
    private currentButton: SoundButton;

    constructor() {
        this.updateButtons(sound.isOn());
        sound.onChange.registerObserver((newValue) => {
            this.updateButtons(newValue);
        });
    }

    private updateButtons(isSoundOn: Boolean): void {
        this.destroyCurrentButton();
        if(isSoundOn) {
            this.currentButton = new DisableSoundButton();
        } else {
            this.currentButton = new EnableSoundButton();
        }
    }

    private destroyCurrentButton(): void {
        if(this.currentButton) {
            this.currentButton.destroy();
            this.currentButton = null;
        }
    }
}

interface ISoundButtonOptions {
    bg: string
}

class SoundButton {
    protected position: IPoint;
    protected button: Phaser.Button;

    constructor(private options: ISoundButtonOptions) {
        this.position = layout.getSoundButtonPosition();
        this.button = phaserGame.value.add.button(
            this.position.x,
            this.position.y,
            this.options.bg,
            this.onClick,
            this,
            1,
            0,
            2,
            1
        );
        uiLayers.soundButtons.add(this.button);
        this.button.fixedToCamera = true;
    }

    destroy(): void {
        if(this.button) {
            this.button.destroy();
        }
    }

    protected onClick(): void {}
}

class DisableSoundButton extends SoundButton {
    constructor() {
        super({ bg: 'DISABLE_BUTTON_BG' });
    }
    protected onClick(): void {
        sound.turnOff();
    }
}

class EnableSoundButton extends SoundButton  {
    constructor() {
        super({ bg: 'ENABLE_BUTTON_BG' });
    }
    protected onClick(): void {
        sound.turnOn();
    }
}