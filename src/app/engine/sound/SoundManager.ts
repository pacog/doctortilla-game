/// <reference path="../../../../my-typings/lib.es6.d.ts" />
import { phaser } from '../../Phaser';
import { phaserGame } from '../state/PhaserGame.singleton';
import { Observable, ICallback } from '../utils/Observable';

const LOCAL_STORAGE_ID = 'dg_sound';
const LOCAL_STORAGE_ON = 'on';
const LOCAL_STORAGE_OFF = 'off';

class SoundManager {
    onChange: Observable;
    private currentVolume: number;
    private on: Boolean;
    private music: Phaser.Sound;
    private songs: Array<string>;

    constructor() {
        this.onChange = new Observable();
        this.restoreLastSettings();
        this.onChange.notifyObservers(this.on);
        this.updateSoundVolume();
    }

    turnOn(): void {
        this.on = true;
        this.storeSettings();
        this.updateSoundVolume();
        this.onChange.notifyObservers(this.on);
    }

    turnOff(): void {
        this.on = false;
        this.storeSettings();
        this.updateSoundVolume();
        this.onChange.notifyObservers(this.on);
    }

    isOn(): Boolean {
        return this.on;
    }

    playMusic(songs: Array<string>): void {
        this.songs = songs.slice();
        let currentSongs = this.songs.slice();
        let nextSong :string = currentSongs.shift();
        this.playSong(nextSong, currentSongs);
    }

    private playSong(songName: string, restOfSongs: Array<string>): void {
        if(restOfSongs.length === 0) {
            restOfSongs = this.songs.slice();
        }
        this.destroyCurrentMusic();
        this.music = phaserGame.value.add.audio(songName);
        this.music.onStop.add(() => {
            console.log('on stop!');
            let nextSong = restOfSongs.shift();
            this.playSong(nextSong, restOfSongs);
        });
        let volume = 0;
        if(this.on) {
            volume = 1;
        }
        this.music.play('', 0, volume);
    }

    private destroyCurrentMusic(): void {
        if(this.music) {
            this.music.onStop.removeAll();
            this.music.destroy();
            this.music = null;
        }
    }

    private updateSoundVolume(): void {
        if(phaserGame.value && phaserGame.value.sound) {
            if(this.on) {
                phaserGame.value.sound.volume = 1;
                if(this.music) {
                    this.music.volume = 1;
                }
            } else {
                phaserGame.value.sound.volume = 0;
                if(this.music) {
                    this.music.volume = 0;
                }
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