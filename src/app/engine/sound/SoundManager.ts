/// <reference path="../../../../my-typings/lib.es6.d.ts" />
import { phaser } from '../../Phaser';
import { phaserGame } from '../state/PhaserGame.singleton';

const LOCAL_STORAGE_ID = 'dg_sound';
const LOCAL_STORAGE_ON = 'on';
const LOCAL_STORAGE_OFF = 'off';

class SoundManager {

    private currentVolume: number;
    private on: Boolean;
    private music: Phaser.Sound;

    constructor() {
        this.restoreLastSettings();
        this.updateSoundVolume();
    }

    turnOn(): void {
        this.on = true;
        this.storeSettings();
        this.updateSoundVolume();
    }

    turnOff(): void {
        this.on = false;
        this.storeSettings();
        this.updateSoundVolume();
    }

    isOn(): Boolean {
        return this.on;
    }

    playMusic(): void {
        //TODO: receive from params in game
        this.music = phaserGame.value.add.audio('SONG1');
        this.music.play('', 0, 1, true);
    }

    private updateSoundVolume(): void {
        if(phaserGame.value && phaserGame.value.sound) {
            if(this.on) {
                phaserGame.value.sound.volume = 1;
            } else {
                phaserGame.value.sound.volume = 0;
            }
        }
    }

    private restoreLastSettings(): void {
        let result = true;

        if(window.localStorage) {
            if(window.localStorage.getItem(LOCAL_STORAGE_ID) === LOCAL_STORAGE_ON) {
                result = true;
            } else if(window.localStorage.getItem(LOCAL_STORAGE_ID) === LOCAL_STORAGE_OFF) {
                result = false;
            }
        }

        this.on = result;
    }

    private storeSettings(): void {
        if(window.localStorage) {
            try {
                let valueToStore = LOCAL_STORAGE_ON;
                if(!this.on) {
                    valueToStore = LOCAL_STORAGE_OFF;
                }
                window.localStorage.setItem(LOCAL_STORAGE_ID, valueToStore);
            } catch(error) {
                console.warn('Not able to store settings in local storage');
            }
        }
    }
}

export const sound = new SoundManager();