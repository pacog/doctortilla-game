(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var BootScene = {
    preload: function () {
        // load here assets required for the loading screen
        this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    },

    create: function () {
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

        this.game.scale.setUserScale(2, 2);
        // enable crisp rendering
        this.game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        this.game.state.start('preloader');
    }
};

module.exports = BootScene;
},{}],2:[function(require,module,exports){
class Player {

    constructor(phaserGame) {
        this.BG = 'vaca_sprite';
        this.INITIAL_X = 200;
        this.INITIAL_Y = 300;
        this.X_SPEED = 80; //px/s
        this.Y_SPEED = 55; //px/s
        this.phaserGame = phaserGame;
        this.createSprite();
    }

    createSprite() {
        this.sprite = this.phaserGame.add.sprite(
                    this.INITIAL_X,
                    this.INITIAL_Y,
                    this.BG);
        this.sprite.animations.add('stand_right', [0], 6, true);
        this.sprite.animations.add('walk_right', [1, 2, 3, 4, 5, 6], 6, true);

        this.sprite.anchor.setTo(0.5, 0.99);
    }

    moveTo(pos) {
        this.sprite.animations.play('walk_right');
        var timeToAnimate = this._getTime(pos);
        if (this.tween && this.tween.isRunning) {
            this.tween.stop();
            this.tween.onComplete.removeAll();
        }

        this.tween = this.phaserGame.add.tween(this.sprite);
        this.tween.to({ x: pos.x, y: pos.y }, timeToAnimate, 'Linear', true, 0);
        this.tween.onComplete.add(this._stopAnimations, this);
    }

    _stopAnimations() {
        this.sprite.animations.play('stand_right');
        this.sprite.animations.stop();
    }

    _getTime(desiredPos) {
        var angleBetween = Math.atan2(this.sprite.y - desiredPos.y,
                                      this.sprite.x - desiredPos.x);
        var diff1 = this.sprite.x - desiredPos.x;
        var diff2 = this.sprite.y - desiredPos.y;
        var distance = Math.sqrt((diff1 * diff1) + (diff2 * diff2));

        var speedFromX = Math.abs(Math.cos(angleBetween)) * distance / this.X_SPEED;
        var speedFromY = Math.abs(Math.sin(angleBetween)) * distance / this.Y_SPEED;

        return 1000 * ((speedFromX + speedFromY) / 2);
    }

}

module.exports = Player;
},{}],3:[function(require,module,exports){
class SceneBoundaries {
    constructor() {
        this.MIN_Y = 113 * 2;
        this.MAX_Y = 149 * 2;
        this.MIN_X = 43 * 2;
        this.MAX_X = 500 * 2;
    }

    getPositionInside(x, y) {
        x = Math.max(this.MIN_X, x);
        x = Math.min(this.MAX_X, x);
        y = Math.max(this.MIN_Y, y);
        y = Math.min(this.MAX_Y, y);

        return {
            x: Math.round(x),
            y: Math.round(y)
        };

    }
}

module.exports = SceneBoundaries;

},{}],4:[function(require,module,exports){
var Scene = require('./scene.js');

class Game {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this.currentScene = new Scene(this.phaserGame);
    }
}

module.exports = Game;

},{"./scene.js":5}],5:[function(require,module,exports){
var Player = require('./Player.js');
var SceneBoundaries = require('./SceneBoundaries.js');

class Scene {
    constructor(phaserGame) {
        this.BG = 'scene1_BG';

        this.phaserGame = phaserGame;
        this.createBackground();
        this.player = new Player(this.phaserGame);
        this.sceneBoundaries = new SceneBoundaries();
    }

    createBackground() {
        var background = this.phaserGame.add.sprite(
                    0,
                    0,
                    this.BG);
        background.anchor.setTo(0, 0);

        background.inputEnabled = true;
        background.pixelPerfectClick = true;
        background.events.onInputDown.add( (dest, ev) => {
            this.handleClick(ev.x, ev.y);
        });
    }


    handleClick(x, y) {
        this.player.moveTo(this.sceneBoundaries.getPositionInside(x, y));
    }
}

module.exports = Scene;

},{"./Player.js":2,"./SceneBoundaries.js":3}],6:[function(require,module,exports){
'use strict';

var PlayScene = require('./play-scene.js');
var PreloaderScene = require('./preloader-scene.js');
var BootScene = require('./boot-scene.js');

window.onload = function () {
    var game = new Phaser.Game(800 / 2, 600 / 2, Phaser.AUTO, 'game');

    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);

    game.state.start('boot');
};

},{"./boot-scene.js":1,"./play-scene.js":7,"./preloader-scene.js":8}],7:[function(require,module,exports){
'use strict';

var Game = require('./engine/model/game.js');

var PlayScene = {
    create: function () {
        this.gameModel = new Game(this.game);
    }
};

module.exports = PlayScene;

},{"./engine/model/game.js":4}],8:[function(require,module,exports){
'use strict';

var PreloaderScene = {
    preload: function () {
        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        this.game.load.image('scene1_BG', 'images/fondo2.png');
        this.game.load.image('vaca1', 'images/vaca4.png');
        //Last number is optional (number of images in sprite)
        this.game.load.spritesheet('vaca_sprite', 'images/vaca_sprite2.png', 44, 61, 7);
    },

    create: function () {
        this.game.state.start('play');
    }
};

module.exports = PreloaderScene;
},{}]},{},[6]);
