var Scene = require('../engine/models/Scene.js');
var BackstageSceneBoundaries = require('./BackstageSceneBoundaries.js');
var BackstageDoorToStreet = require('./BackstageDoorToStreet.js');
var BackstageVendingMachine = require('./BackstageVendingMachine.js');
var Broom = require('./Broom.js');
var Scissors = require('./Scissors.js');
var Cable = require('./Cable.js');
var Table = require('./Table.js');
var BandInSofa = require('./BandInSofa.js');
var Bocadillo = require('./Bocadillo.js');
var Dust = require('./Dust.js');
var Glass = require('./Glass.js');
var Coconut = require('./Coconut.js');
var Coin = require('./Coin.js');
var scenes = require('./Scenes.store.js');

class BackstageScene extends Scene {

    constructor(phaserGame, state) {
        let options = {
            BG: 'backstage_BG',
            boundaries: BackstageSceneBoundaries,
            things: [
                Table,
                BackstageDoorToStreet,
                Cable,
                BackstageVendingMachine,
                Broom,
                Bocadillo,
                BandInSofa,
                Scissors,
                Dust,
                Glass,
                Coconut,
                Coin
            ]
        };

        super(phaserGame, options, state);

    }

    static get id() {
        return scenes.BACKSTAGE;
    }

}

module.exports = BackstageScene;