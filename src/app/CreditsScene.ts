import { phaser } from './Phaser';

export const CreditsScene = {
    preload: function() {},

    create: function () {
        this.createBG();
    },

    createBG: function() {
        this.game.add.sprite(0, 0, 'CREDITS');
    }

};