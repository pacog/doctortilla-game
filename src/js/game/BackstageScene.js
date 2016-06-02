var Scene = require('../engine/models/Scene.js');
var BackstageSceneBoundaries = require('./BackstageSceneBoundaries.js');
var BackstageDoorToStreet = require('./BackstageDoorToStreet.js');
var BackstageVendingMachine = require('./BackstageVendingMachine.js');
var Broom = require('./Broom.js');
var Cable = require('./Cable.js');
var BandInSofa = require('./BandInSofa.js');
var Bocadillo = require('./Bocadillo.js');
var scenes = require('./Scenes.store.js');

class BackstageScene extends Scene {

    constructor(phaserGame, state) {
        let options = {
            BG: 'backstage_BG',
            boundaries: BackstageSceneBoundaries,
            things: [BackstageDoorToStreet, Cable, BackstageVendingMachine, Broom, Bocadillo, BandInSofa]
        };

        super(phaserGame, options, state);

    }

    static get id() {
        return scenes.BACKSTAGE;
    }

}

module.exports = BackstageScene;