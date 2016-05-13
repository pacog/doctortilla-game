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
var actionDispatcher = require('./ActionDispatcher.singleton.js');
var layout = require('./LayoutManager.singleton.js');
var actions = require('./Actions.singleton.js');

const DEFAULT_FONT_SIZE = 8;

class ActionButton {

    constructor(phaserGame, verb, position) {
        this.phaserGame = phaserGame;
        this._position = layout.getVerbButtonPosition(position);
        this.verb = verb;

        this._createButton();
        this._createText();

    }

    _createButton() {
        this.phaserGame.add.button(
            this._position.x,
            this._position.y,
            'buttons_BG',
            this._onClick,
            this,
            1,
            0,
            2,
            3
        );
    }

    _createText() {

        this.shadowText = this.phaserGame.add.bitmapText(
            1 + this._position.x + layout.VERB_BUTTON_WIDTH / 2,
            1 + this._position.y + layout.VERB_BUTTON_HEIGHT / 2,
            'font_32_black',
            this.verb.label,
            DEFAULT_FONT_SIZE
        );
        this.shadowText.anchor.setTo(0.5, 0.5);

        this.text = this.phaserGame.add.bitmapText(
            this._position.x + layout.VERB_BUTTON_WIDTH / 2,
            this._position.y + layout.VERB_BUTTON_HEIGHT / 2,
            'font_32_white',
            this.verb.label,
            DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0.5, 0.5);
    }

    _onClick() {
        actionDispatcher.execute(actions.SELECT_VERB, this.verb);
    }

}

module.exports = ActionButton;
},{"./ActionDispatcher.singleton.js":3,"./Actions.singleton.js":4,"./LayoutManager.singleton.js":9}],3:[function(require,module,exports){
// var actions = require('./Actions.singleton.js');

class ActionDispatcher {

    constructor() {
        this._subscribers = new Map();
    }

    execute(action, params) {
        //TODO: check if action exists
        this._notifyAction(action, params);
    }

    subscribeTo(action, callback) {
        let subscribers = this._getSubscribers(action);
        subscribers.add(callback);
    }

    unsubscribeTo(action, callback) {
        let subscribers = this._getSubscribers(action);
        subscribers.delete(callback);
    }

    _getSubscribers(action) {
        let currentSubscribers = this._subscribers.get(action);
        if (!currentSubscribers) {
            currentSubscribers = new Set();
            this._subscribers.set(action, currentSubscribers);
        }
        return currentSubscribers;
    }

    _showUnknowActionError(action) {
        throw 'ERROR: executing incorrect action ' + action;
    }

    _notifyAction(action, params) {
        let subscribers = this._getSubscribers(action);
        subscribers.forEach( (callback) => callback(params) );
    }

}

let actionDispatcherInstance = new ActionDispatcher();
module.exports = actionDispatcherInstance;

},{}],4:[function(require,module,exports){
const actions = {
    ACTION_APPLIED: Symbol(),
    CLICK_STAGE: Symbol(),
    CURSOR_OUT_THING: Symbol(),
    CURSOR_OVER_THING: Symbol(),
    SELECT_THING: Symbol(),
    SELECT_VERB: Symbol()
};
module.exports = actions;
},{}],5:[function(require,module,exports){
class CurrentScene {

    get value() {
        return this._currentScene;
    }

    set value(newValue) {
        this._currentScene = newValue;
    }
}

let currentScene = new CurrentScene();
module.exports = currentScene;
},{}],6:[function(require,module,exports){
var GraphicUI = require('./GraphicUI.js');
var actionDispatcher = require('./ActionDispatcher.singleton.js');
var actions = require('./Actions.singleton.js');
var selectedVerb = require('./SelectedVerb.singleton.js');
var currentScene = require('./CurrentScene.singleton.js');

class Game {

    constructor(phaserGame, options) {

        this.options = options;
        this.phaserGame = phaserGame;

        this._createScenes();
        this._createPlayer();
        this._createUI();

        actionDispatcher.subscribeTo(actions.CLICK_STAGE, ev => this._movePlayerTo(ev) );
        actionDispatcher.subscribeTo(actions.SELECT_THING, thing => this._applyActionToThing(thing) );
    }

    _createUI() {
        this._graphicUI = new GraphicUI(this.phaserGame);
    }

    _createScenes() {
        var scenes = this.options.scenes || [];

        for (let i = 0; i < scenes.length; i++) {
            if (scenes[i] === this.options.firstScene) {
                let addedScene = new scenes[i](this.phaserGame);
                currentScene.value = addedScene;
            }
        }

    }

    _createPlayer() {
        this.player = new this.options.player(this.phaserGame);
    }

    _movePlayerTo(ev) {
        this.player.moveTo({
            x: ev.x,
            y: ev.y
        });
    }

    _applyActionToThing(thing) {
        thing.applyAction(selectedVerb.verb, this.player);
        actionDispatcher.execute(actions.ACTION_APPLIED);
    }
}

module.exports = Game;

},{"./ActionDispatcher.singleton.js":3,"./Actions.singleton.js":4,"./CurrentScene.singleton.js":5,"./GraphicUI.js":7,"./SelectedVerb.singleton.js":12}],7:[function(require,module,exports){
var UIVerbs = require('./UIVerbs.js');
var UICurrentAction = require('./UICurrentAction.js');
var layout = require('./LayoutManager.singleton.js');

class GraphicUI {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;

        this._createBackground();
        this.UIVerbs = new UIVerbs(phaserGame);
        this.UICurrentAction = new UICurrentAction(phaserGame);

    }

    _createBackground() {
        let layoutStartPosition = layout.UI_START_POSITION;
        // let layoutSize = layout.UI_SIZE;

        let background = this.phaserGame.add.sprite(
                    layoutStartPosition.x,
                    layoutStartPosition.y,
                    'UI_BG');
        background.anchor.setTo(0, 0);

        background.inputEnabled = true;

    }
}

module.exports = GraphicUI;
},{"./LayoutManager.singleton.js":9,"./UICurrentAction.js":16,"./UIVerbs.js":17}],8:[function(require,module,exports){
var actions = require('./Actions.singleton.js');
var actionDispatcher = require('./ActionDispatcher.singleton.js');

class HighlightedThing {
    constructor() {
        this._subscribers = new Set();
        this.reset();

        actionDispatcher.subscribeTo(
            actions.CURSOR_OVER_THING,
            thing => this._highlightThing(thing)
        );

        actionDispatcher.subscribeTo(
            actions.CURSOR_OUT_THING,
            thing => this._highlightThing(null)
        );
    }

    reset() {
        this._highlightThing(null);
    }

    subscribeToChange(callback) {
        this._subscribers.add(callback);
        callback(this._highlightedThing);
    }

    unsubscribeToChange(callback) {
        this._subscribers.delete(callback);
    }

    _notifySubscribers() {
        this._subscribers.forEach(callback => callback(this._highlightedThing));
    }

    _highlightThing(newThing) {
        this._highlightedThing = newThing;
        this._notifySubscribers();
    }

    get thing() {
        return this._highlightedThing;
    }

}

var highlightedThing = new HighlightedThing();
module.exports = highlightedThing;
},{"./ActionDispatcher.singleton.js":3,"./Actions.singleton.js":4}],9:[function(require,module,exports){
const LAYOUT_WIDTH = 1066;
const LAYOUT_HEIGHT = 600;
const LAYOUT_ZOOM = 2;

const VERB_BUTTON_HEIGHT = 36;
const VERB_BUTTON_WIDTH = 150;
const VERB_BUTTON_MARGIN = 1;
const VERBS_ROWS = 3;

const CURRENT_ACTION_INFO_HEIGHT = 40;
const CURRENT_ACTION_INFO_PADDING_X = 5;
const CURRENT_ACTION_INFO_PADDING_Y = 7;

class LayoutManager {

    get HEIGHT() {
        return LAYOUT_HEIGHT / LAYOUT_ZOOM;
    }

    get WIDTH() {
        return LAYOUT_WIDTH / LAYOUT_ZOOM;
    }

    get VERB_BUTTON_HEIGHT() {
        return VERB_BUTTON_HEIGHT / LAYOUT_ZOOM;
    }

    get VERB_BUTTON_WIDTH() {
        return VERB_BUTTON_WIDTH / LAYOUT_ZOOM;
    }

    get VERBS_HEIGHT() {
        let marginY = (VERBS_ROWS + 1) * VERB_BUTTON_MARGIN;
        let heightY = VERBS_ROWS * this.VERB_BUTTON_HEIGHT;
        return marginY + heightY;
    }

    get VERBS_Y_START() {
        return this.HEIGHT - this.VERBS_HEIGHT;
    }

    get UI_SIZE() {
        return {
            width: this.WIDTH,
            height: this.VERBS_HEIGHT + this.CURRENT_ACTION_INFO_HEIGHT
        };
    }

    get CURRENT_ACTION_INFO_HEIGHT() {
        return CURRENT_ACTION_INFO_HEIGHT / LAYOUT_ZOOM;
    }

    get UI_START_POSITION() {
        return {
            x: 0,
            y: this.VERBS_Y_START - this.CURRENT_ACTION_INFO_HEIGHT
        };
    }

    get CURRENT_ACTION_POSITION() {
        return {
            x: CURRENT_ACTION_INFO_PADDING_X,
            y: this.HEIGHT - this.VERBS_HEIGHT - this.CURRENT_ACTION_INFO_HEIGHT + CURRENT_ACTION_INFO_PADDING_Y
        };
    }

    getVerbButtonPosition(position) {

        let marginX = (position.x + 1) * VERB_BUTTON_MARGIN;
        let positionX = position.x * this.VERB_BUTTON_WIDTH;

        let marginY = (position.y + 1) * VERB_BUTTON_MARGIN;
        let positionY = position.y * this.VERB_BUTTON_HEIGHT;

        return {
            x: marginX + positionX,
            y: this.VERBS_Y_START + marginY + positionY
        };
    }
}

let layoutManagerInstance = new LayoutManager();
module.exports = layoutManagerInstance;
},{}],10:[function(require,module,exports){
var Directions = require('./directions.js');
var Text = require('./Text.js');
var currentScene = require('./CurrentScene.singleton.js');

class Player {

    constructor(phaserGame, options) {
        this.options = options;

        this.phaserGame = phaserGame;
        this.createSprite();

        this.direction = Directions.RIGHT;
        this._playStandAnimation();
        this.sprite.animations.stop();
    }

    createSprite() {
        this.sprite = this.phaserGame.add.sprite(
                        this.options.INITIAL_X,
                        this.options.INITIAL_Y,
                        this.options.SPRITE_ID);
        this._addSpriteAnimations();
        

        this.sprite.anchor.setTo(0.5, 0.99);
    }

    say(text) {
        new Text(this.phaserGame, {
            text: text,
            position: this._getPositionOnTop(),
            autoDestroy: true
        });
    }

    goToThing(thing) {
        this.moveTo(thing.getPositionToGoTo());
    }

    _addSpriteAnimations() {
        this.options.SPRITE_OPTIONS.forEach( (spritePosition, key) => {
            this.sprite.animations.add(key, spritePosition.frames, this.options.ANIMATION_SPEED, true);
        });
    }

    _getPositionOnTop() {
        var result = {
            x: this.sprite.x,
            y: Math.round(this.sprite.getBounds().y) - 10
        };
        return result;
    }

    moveTo(nonSafePosition) {
        let pos = currentScene.value.boundaries.getPositionInside(nonSafePosition.x, nonSafePosition.y);

        this._updateDirection(pos);
        this._cancelCurrentTween();
        this._playWalkingAnimation();
        
        let timeToAnimate = this._getTimeForAnimation(pos);

        this.tween = this.phaserGame.add.tween(this.sprite);
        this.tween.to({ x: pos.x, y: pos.y }, timeToAnimate, 'Linear', true, 0);
        this.tween.onComplete.add(this._stopAnimations, this);
    }

    _updateDirection(pos) {
        let angleBetween = this._getAngleToDesiredPosition(pos);
        let angleDegrees = (angleBetween * 180 / Math.PI);

        if ((angleDegrees >= -45) && (angleDegrees <= 45)) {
            this.direction = Directions.LEFT;
        } else if ((angleDegrees >= 45) && (angleDegrees <= 135)) {
            this.direction = Directions.UP;
        } else if ((angleDegrees >= -135) && (angleDegrees <= -45)) {
            this.direction = Directions.DOWN;
        } else {
            this.direction = Directions.RIGHT;
        }

    }

    _cancelCurrentTween() {
        if (this.tween && this.tween.isRunning) {
            this.tween.stop();
            this.tween.onComplete.removeAll();
        }
    }

    _playWalkingAnimation() {
        let directionName = Directions.getName(this.direction);
        let spriteState = 'walk_' + directionName;
        this.sprite.animations.play(spriteState);
        this._flipXIfNeeded(spriteState);
    }

    _flipXIfNeeded(spriteState) {
        let spriteStateOptions = this.options.SPRITE_OPTIONS.get(spriteState);
        if (spriteStateOptions && spriteStateOptions.inverse) {
            this.sprite.scale.x = -1;
        } else {
            this.sprite.scale.x = 1;
        }
    }

    _playStandAnimation() {
        let directionName = Directions.getName(this.direction);
        let spriteState = 'stand_' + directionName;
        this.sprite.animations.play(spriteState);
        this._flipXIfNeeded(spriteState);
    }

    _stopAnimations() {
        this._playStandAnimation();
        this.sprite.animations.stop();
    }

    _getTimeForAnimation(desiredPos) {
        let angleBetween = this._getAngleToDesiredPosition(desiredPos);
        let diff1 = this.sprite.x - desiredPos.x;
        let diff2 = this.sprite.y - desiredPos.y;
        let distance = Math.sqrt((diff1 * diff1) + (diff2 * diff2));

        let speedFromX = Math.abs(Math.cos(angleBetween)) * distance / this.options.X_SPEED;
        let speedFromY = Math.abs(Math.sin(angleBetween)) * distance / this.options.Y_SPEED;

        return 1000 * ((speedFromX + speedFromY) / 2);
    }

    _getAngleToDesiredPosition(desiredPos) {
        return Math.atan2(this.sprite.y - desiredPos.y,
                                      this.sprite.x - desiredPos.x);
    }

}

module.exports = Player;
},{"./CurrentScene.singleton.js":5,"./Text.js":14,"./directions.js":19}],11:[function(require,module,exports){
class SceneBoundaries {
    constructor(options) {
        this.options = options;
    }

    getPositionInside(x, y) {
        x = Math.max(this.options.MIN_X, x);
        x = Math.min(this.options.MAX_X, x);
        y = Math.max(this.options.MIN_Y, y);
        y = Math.min(this.options.MAX_Y, y);

        return {
            x: Math.round(x),
            y: Math.round(y)
        };

    }
}

module.exports = SceneBoundaries;

},{}],12:[function(require,module,exports){
var verbs = require('./Verbs.js');
var actions = require('./Actions.singleton.js');
var actionDispatcher = require('./ActionDispatcher.singleton.js');

class SelectedVerb {
    constructor() {
        this._subscribers = new Set();
        this.reset();
        actionDispatcher.subscribeTo(
            actions.SELECT_VERB,
            newVerb => this._selectNewVerb(newVerb)
        );
        actionDispatcher.subscribeTo(
            actions.ACTION_APPLIED,
            () => this.reset()
        );
    }

    reset() {
        this._selectNewVerb(verbs.GO_TO);
    }

    subscribeToChange(callback) {
        this._subscribers.add(callback);
        callback(this._selectedVerb);
    }

    unsubscribeToChange(callback) {
        this._subscribers.delete(callback);
    }

    _notifySubscribers() {
        this._subscribers.forEach(callback => callback(this._selectedVerb));
    }

    _selectNewVerb(newVerb) {
        this._selectedVerb = newVerb;
        this._notifySubscribers();
    }

    get verb() {
        return this._selectedVerb;
    }

}

var selectedVerb = new SelectedVerb();
module.exports = selectedVerb;
},{"./ActionDispatcher.singleton.js":3,"./Actions.singleton.js":4,"./Verbs.js":18}],13:[function(require,module,exports){
const style = Object.freeze({
    DEFAULT_FONT_SIZE: 8,
    FONT_SHADOW_X: 1,
    FONT_SHADOW_Y: 1
});

module.exports = style;
},{}],14:[function(require,module,exports){
var style = require('./Style.singleton.js');

const DEFAULT_TEXT_OPTIONS = Object.freeze({
    timePerLetter: 50,
    minDestroyTime: 2000,
    text: '',
    position: { x: 100, y: 100},
    width: 30,
    autoDestroy: false
});

class Text {

    constructor(phaserGame, options = {}) {
        this.phaserGame = phaserGame;
        this.options = Object.assign({}, DEFAULT_TEXT_OPTIONS, options);
        this._createText();
        if(this.options.autoDestroy) {
            this._autoDestroy();
        }
    }

    _createText() {

        let textInLines = this._separateTextIntoLines(this.options.text, this.options.width);
        let positionX = this._getXPositionForText(textInLines);
        let positionY = this._getYPositionForText(textInLines);

        this.shadowText = this.phaserGame.add.bitmapText(
            style.FONT_SHADOW_X + positionX,
            style.FONT_SHADOW_Y + positionY,
            'font_32_black',
            textInLines,
            style.DEFAULT_FONT_SIZE
        );
        this.shadowText.anchor.setTo(0, 0);

        this.text = this.phaserGame.add.bitmapText(
            positionX,
            positionY,
            'font_32_white',
            textInLines,
            style.DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0, 0);
    }

    _separateTextIntoLines(text = '', maxLength = 20) {

        let words = text.split(' ');
        let lines = [''];
        let currentLine = 0;

        for (let i = 0; i < words.length; i++) {
            //If a word is too big for this line, add to next
            if ((lines[currentLine].length + words[i].length) >= maxLength) {
                lines.push('' + words[i]);
                currentLine ++;
            } else {
                lines[currentLine] += ' ' + words[i];
            }
        }
        return lines.join('\n');
    }

    _getXPositionForText(text = '') {
        let longestLine = this._getLongestLine(text);
        let maxWidth = longestLine * style.DEFAULT_FONT_SIZE;

        return this.options.position.x - (maxWidth / 2);
    }

    _getYPositionForText(text = '') {
        let lines = text.split('\n').length;
        let totalHeight = lines * style.DEFAULT_FONT_SIZE;
        return this.options.position.y - totalHeight;
    }

    _getLongestLine(text = '') {
        let lines = text.split('\n');
        let maxLength = 0;
        for (let i = 0; i < lines.length; i++) {
            maxLength = Math.max(maxLength, lines[i].length);
        }
        return maxLength;
    }

    _autoDestroy() {
        let timeToDestroy = this._getTimeToDestroyFromText(this.options.text);
        this._timeoutToDestroy = setTimeout(() => this.destroy(), timeToDestroy);
    }

    _getTimeToDestroyFromText(text = '') {
        let timeToDestroy = this.options.timePerLetter * text.length;
        return Math.max(this.options.minDestroyTime, timeToDestroy);
    }

    destroy() {
        if (this.text) {
            this.text.destroy();
            this.text = null;
        }
        if (this.shadowText) {
            this.shadowText.destroy();
            this.shadowText = null;
        }
        //TODO: do callback
    }

}

module.exports = Text;
},{"./Style.singleton.js":13}],15:[function(require,module,exports){
var actionDispatcher = require('./ActionDispatcher.singleton.js');
var actions = require('./Actions.singleton.js');
var Verbs = require('./Verbs.js');

class Thing {

    constructor(phaserGame, options) {
        this.options = options;
        this.phaserGame = phaserGame;
        this._createSprite();
        this._state = new Map();
    }

    get name() {
        return this.options.name || 'thing';
    }

    applyAction(verb, player) {

        switch (verb) {

        case Verbs.GO_TO:
            player.goToThing(this);
            break;
        default:
            //TODO: depending on the verb, do one thing or another
            player.say('I cannot do that');
            break;

        }
        
    }

    getPositionToGoTo() {
        if (this.options.goToPosition) {
            return this.options.goToPosition;
        } else {
            return {
                x: this.options.x,
                y: this.options.y
            };
        }
    }

    changeAttr(attrName, value) {
        this._state.set(attrName, value);
        this._onStateChange();
    }

    getAttr(attrName) {
        return this._state.get(attrName);
    }

    _onStateChange() {}

    _createSprite() {

        this.sprite = this.phaserGame.add.sprite(
                        this.options.x,
                        this.options.y,
                        this.options.spriteId
                      );

        this.sprite.inputEnabled = true;

        this.sprite.events.onInputDown.add(this._onClick, this);
        this.sprite.events.onInputOver.add(this._onInputOver, this);
        this.sprite.events.onInputOut.add(this._onInputOut, this);
    }

    _onClick() {
        actionDispatcher.execute(actions.SELECT_THING, this);
    }

    _onInputOver() {
        actionDispatcher.execute(actions.CURSOR_OVER_THING, this);
    }

    _onInputOut() {
        actionDispatcher.execute(actions.CURSOR_OUT_THING, this);
    }
}

module.exports = Thing;
},{"./ActionDispatcher.singleton.js":3,"./Actions.singleton.js":4,"./Verbs.js":18}],16:[function(require,module,exports){
var selectedVerb = require('./SelectedVerb.singleton.js');
var layout = require('./LayoutManager.singleton.js');
var highlightedThing = require('./HighlightedThing.singleton.js');

//TODO duplicated, extract this and shadows to style singleton
const DEFAULT_FONT_SIZE = 8;

class UICurrentAction {
    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this._createText();
        selectedVerb.subscribeToChange(newVerb => this._updateText());
        highlightedThing.subscribeToChange(newThing => this._updateText());
    }

    _createText() {
        //TODO: use Text class
        this.shadowText = this.phaserGame.add.bitmapText(
            1 + layout.CURRENT_ACTION_POSITION.x,
            1 + layout.CURRENT_ACTION_POSITION.y,
            'font_32_black',
            '',
            DEFAULT_FONT_SIZE
        );
        this.shadowText.anchor.setTo(0, 0);

        this.text = this.phaserGame.add.bitmapText(
            layout.CURRENT_ACTION_POSITION.x,
            layout.CURRENT_ACTION_POSITION.y,
            'font_32_white',
            '',
            DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0, 0);
    }

    _updateText() {
        let newText = this._getVerbText() + ' ' + this._getThingText();
        this._setText(newText);
    }

    _setText(newText) {
        if(this._oldText !== newText) {
            this._oldText = newText;
            this.text.setText(newText);
            this.shadowText.setText(newText);
        }
    }

    _getVerbText() {
        let verb = selectedVerb.verb;
        let text = '';
        if (verb && verb.label) {
            text = verb.label;
        }
        return text;
    }

    _getThingText() {
        let thing = highlightedThing.thing;
        let text = '';
        if (thing && thing.name) {
            text = thing.name;
        }
        return text;
    }
}

module.exports = UICurrentAction;
},{"./HighlightedThing.singleton.js":8,"./LayoutManager.singleton.js":9,"./SelectedVerb.singleton.js":12}],17:[function(require,module,exports){
var ActionButton = require('./ActionButton.js');
var Verbs = require('./Verbs.js');

class UIVerbs {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this._createButtons();
    }

    _createButtons() {
        this.buttons = [
            new ActionButton(this.phaserGame,
                             Verbs.GO_TO,
                             {x: 0, y: 0}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.LOOK,
                             {x: 0, y: 1}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.GIVE,
                             {x: 0, y: 2}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.PUSH,
                             {x: 1, y: 0}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.TAKE,
                             {x: 1, y: 1}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.USE,
                             {x: 1, y: 2}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.SPEAK,
                             {x: 2, y: 0}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.OPEN,
                             {x: 2, y: 1}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.CLOSE,
                             {x: 2, y: 2}
                            )
        ];
    }
}

module.exports = UIVerbs;
},{"./ActionButton.js":2,"./Verbs.js":18}],18:[function(require,module,exports){
const Verbs = {
    GO_TO: {
        label: 'Go to'
    },
    LOOK: {
        label: 'Look at'
    },
    CLOSE: {
        label: 'Close'
    },
    PUSH: {
        label: 'Push'
    },
    TAKE: {
        label: 'Take'
    },
    USE: {
        label: 'Use'
    },
    SPEAK: {
        label: 'Speak to'
    },
    GIVE: {
        label: 'Give'
    },
    OPEN: {
        label: 'Open'
    }

};

module.exports = Verbs;

},{}],19:[function(require,module,exports){
'use strict';

const LEFT = Symbol();
const RIGHT = Symbol();
const UP = Symbol();
const DOWN = Symbol();


function getName(direction) {

    switch (direction) {

    case LEFT:
        return 'left';
    case RIGHT:
        return 'right';
    case UP:
        return 'up';
    case DOWN:
        return 'down';
    default:
        return 'unknown';

    }
}

let directions = {
    LEFT: LEFT,
    RIGHT: RIGHT,
    UP: UP,
    DOWN: DOWN,
    getName: getName
};

module.exports = directions;

},{}],20:[function(require,module,exports){
var actionDispatcher = require('./ActionDispatcher.singleton.js');
var actions = require('./Actions.singleton.js');

class Scene {

    constructor(phaserGame, options) {
        this.options = options;

        this.phaserGame = phaserGame;
        this._createBackground();
        this._createBoundaries();
        this._createThings();

    }

    get boundaries() {
        return this._boundaries;
    }

    _createBackground() {
        let background = this.phaserGame.add.sprite(
                    0,
                    0,
                    this.options.BG);
        background.anchor.setTo(0, 0);

        background.inputEnabled = true;
        background.pixelPerfectClick = true;
        background.events.onInputDown.add( (dest, ev) => {
            actionDispatcher.execute(actions.CLICK_STAGE, ev);
        });

    }

    _createBoundaries() {
        this._boundaries = new this.options.boundaries();
    }

    _createThings() {
        this._things = new Set();
        var things = this.options.things || [];
        for (let i = 0; i < things.length; i++) {
            this._things.add(new things[i](this.phaserGame));
        }
    }
}

module.exports = Scene;

},{"./ActionDispatcher.singleton.js":3,"./Actions.singleton.js":4}],21:[function(require,module,exports){
var Thing = require('../engine/Thing.js');
var Verbs = require('../engine/Verbs.js');

class BackstageDoorToStreet extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 150,
            y: 95,
            spriteId: 'door_sprite',
            goToPosition: {
                x: 175,
                y: 165
            }
        };
        super(phaserGame, options);
    }

    get name() {
        if (this.getAttr('OPEN')) {
            return 'street';
        } else {
            return 'door to street';
        }
    }

    applyAction(verb, player) {

        switch (verb) {

        case Verbs.GO_TO:
            player.goToThing(this);
            break;
        case Verbs.OPEN:
            this._open(player);
            break;
        case Verbs.CLOSE:
            this._close(player);
            break;
        default:
            //TODO: depending on the verb, do one thing or another
            player.say('I cannot do that');
            break;

        }
    }

    _open(player) {
        if (this.getAttr('OPEN')) {
            player.say('It is already open!');
        } else {
            this.changeAttr('OPEN', true);
        }
    }

    _close(player) {
        if (!this.getAttr('OPEN')) {
            player.say('It is already closed!');
        } else {
            this.changeAttr('OPEN', false);
        }
    }

    _onStateChange() {
        if (this.getAttr('OPEN')) {
            this.sprite.frame = 1;
        } else {
            this.sprite.frame = 0;
        }
    }
}

module.exports = BackstageDoorToStreet;
},{"../engine/Thing.js":15,"../engine/Verbs.js":18}],22:[function(require,module,exports){
var Scene = require('../engine/scene.js');
var BackstageSceneBoundaries = require('./BackstageSceneBoundaries.js');
var BackstageDoorToStreet = require('./BackstageDoorToStreet.js');
var BackstageVendingMachine = require('./BackstageVendingMachine.js');

class BackstageScene extends Scene {

    constructor(phaserGame) {
        let options = {
            BG: 'scene1_BG',
            boundaries: BackstageSceneBoundaries,
            things: [BackstageDoorToStreet, BackstageVendingMachine]
        };

        super(phaserGame, options);

    }

}

module.exports = BackstageScene;
},{"../engine/scene.js":20,"./BackstageDoorToStreet.js":21,"./BackstageSceneBoundaries.js":23,"./BackstageVendingMachine.js":24}],23:[function(require,module,exports){
var SceneBoundaries = require('../engine/SceneBoundaries.js');

class BackstageSceneBoundaries extends SceneBoundaries {
    constructor() {
        super({
            MIN_Y: 310 / 2,
            MAX_Y: 450 / 2,
            MIN_X: 180 / 2,
            MAX_X: 600 / 2
        });
    }
}

module.exports = BackstageSceneBoundaries;
},{"../engine/SceneBoundaries.js":11}],24:[function(require,module,exports){
var Thing = require('../engine/Thing.js');

class BackstageVendingMachine extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 54,
            y: 131,
            spriteId: 'vending',
            name: 'vending machine',
            goToPosition: {
                x: 80,
                y: 185
            }
        };
        super(phaserGame, options);
    }
}

module.exports = BackstageVendingMachine;
},{"../engine/Thing.js":15}],25:[function(require,module,exports){
var Game = require('../engine/Game.js');
var BackstageScene = require('./BackstageScene.js');
var DoctortillaPlayer = require('./DoctortillaPlayer.js');

class DoctortillaGame extends Game {

    constructor(phaserGame) {

        let options = {
            player: DoctortillaPlayer,
            scenes: [BackstageScene],
            firstScene: BackstageScene
        };
        super(phaserGame, options);

    }

}

module.exports = DoctortillaGame;

},{"../engine/Game.js":6,"./BackstageScene.js":22,"./DoctortillaPlayer.js":26}],26:[function(require,module,exports){
var Player = require('../engine/Player.js');

class DoctortillaPlayer extends Player {

    constructor(phaserGame) {

        let spriteOptions = new Map();

        spriteOptions.set('stand_right', { frames: [0]});
        spriteOptions.set('walk_right', { frames: [1, 2, 3, 4, 5, 6]});
        spriteOptions.set('stand_left', { frames: [0], inverse: true});
        spriteOptions.set('walk_left', { frames: [1, 2, 3, 4, 5, 6], inverse: true});
        spriteOptions.set('stand_up', { frames: [14]});
        spriteOptions.set('walk_up', { frames: [15, 16, 17, 18, 19, 20]});
        spriteOptions.set('stand_down', { frames: [7]});
        spriteOptions.set('walk_down', { frames: [8, 9, 10, 11, 12, 13]});

        let options = {
            SPRITE_ID: 'vaca_sprite',
            INITIAL_X: 200,
            INITIAL_Y: 200,
            X_SPEED: 80, //px/s
            Y_SPEED: 55, //px/s
            ANIMATION_SPEED: 6,
            SPRITE_OPTIONS: spriteOptions
        };
        super(phaserGame, options);
    }

}

module.exports = DoctortillaPlayer;
},{"../engine/Player.js":10}],27:[function(require,module,exports){
'use strict';

var PlayScene = require('./play-scene.js');
var PreloaderScene = require('./preloader-scene.js');
var BootScene = require('./boot-scene.js');
var layout = require('./engine/LayoutManager.singleton.js');

window.onload = function () {
    var game = new Phaser.Game(layout.WIDTH, layout.HEIGHT, Phaser.AUTO, 'game');

    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);

    game.state.start('boot');
};

},{"./boot-scene.js":1,"./engine/LayoutManager.singleton.js":9,"./play-scene.js":28,"./preloader-scene.js":29}],28:[function(require,module,exports){
'use strict';

var DoctortillaGame = require('./game/DoctortillaGame.js');

var PlayScene = {
    create: function () {
        this.gameModel = new DoctortillaGame(this.game);
    }
};

module.exports = PlayScene;

},{"./game/DoctortillaGame.js":25}],29:[function(require,module,exports){
'use strict';

var PreloaderScene = {
    preload: function () {
        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        this.game.load.image('scene1_BG', 'images/fondo4.png');
        this.game.load.image('UI_BG', 'images/uibg.png');
        this.game.load.bitmapFont('font_32_orange', 'images/font_32_orange.png', 'images/font_32_orange.fnt');
        this.game.load.bitmapFont('font_32_black', 'images/font_32_black.png', 'images/font_32_black.fnt');
        this.game.load.bitmapFont('font_32_white', 'images/font_32_white.png', 'images/font_32_orange.fnt');

        this.game.load.spritesheet('buttons_BG', 'images/verb_buttons.png', 75, 18);
        //Last number is optional (number of images in sprite)
        this.game.load.spritesheet('vaca_sprite', 'images/vaca_sprite10.png', 44, 61, 21);
        this.game.load.spritesheet('vending', 'images/vending.png', 26, 50, 1);
        this.game.load.spritesheet('door_sprite', 'images/puerta_1.png', 40, 60, 2);
    },

    create: function () {
        this.game.state.start('play');
    }
};

module.exports = PreloaderScene;
},{}]},{},[27]);
