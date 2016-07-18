(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./engine/ui/LayoutManager.singleton');
const Phaser_1 = require('./Phaser');
exports.BootScene = {
    preload: function () {
        // load here assets required for the loading screen
        this.game.load.image('preloader_bar', 'images/ui/PRELOADER_BAR.png');
    },
    create: function () {
        this.game.scale.scaleMode = Phaser_1.phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale(LayoutManager_singleton_1.layout.LAYOUT_ZOOM, LayoutManager_singleton_1.layout.LAYOUT_ZOOM);
        // enable crisp rendering
        this.game.renderer.renderSession.roundPixels = true;
        Phaser_1.phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.game.state.start('preloader');
    }
};

},{"./Phaser":2,"./engine/ui/LayoutManager.singleton":31}],2:[function(require,module,exports){
"use strict";
/// <reference path="../vendor/phaser/phaser.d.ts"/>
exports.phaser = Phaser;

},{}],3:[function(require,module,exports){
"use strict";
const DoctortillaGame_1 = require('./game/DoctortillaGame');
class PlayScene {
    create() {
        this.gameModel = new DoctortillaGame_1.DoctortillaGame();
    }
    update() {
        this.gameModel.update();
    }
}
exports.playScene = new PlayScene();

},{"./game/DoctortillaGame":46}],4:[function(require,module,exports){
"use strict";
const AssetsManager_1 = require('./game/AssetsManager');
exports.PreloaderScene = {
    preload: function () {
        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);
        AssetsManager_1.assetsManager.loadAssets(this.game);
    },
    create: function () {
        this.game.state.start('play');
    }
};

},{"./game/AssetsManager":44}],5:[function(require,module,exports){
"use strict";
const Observable_1 = require('../utils/Observable');
const ConversationUI_1 = require('../ui/ConversationUI');
class Conversation {
    constructor(player, otherPerson) {
        this.player = player;
        this.otherPerson = otherPerson;
        this.player = player;
        this.otherPerson = otherPerson;
        this.loadScript();
        this.onChangeObservable = new Observable_1.Observable();
        this.initState();
        this.createConversationUI();
    }
    onStateChange(callback) {
        this.onChangeObservable.registerObserver(callback);
        callback(this.state);
    }
    get state() {
        return this._stateId;
    }
    getLines() {
        let currentState = this.state;
        if (!this.script || !this.script[currentState]) {
            throw 'ERROR, there are no lines for this state of conversation';
        }
        return this.script[currentState];
    }
    set state(newState) {
        if (newState === 'end') {
            this.ui.destroy();
        }
        else {
            this._stateId = newState;
            this.loadScript();
            this.notifyStateChange();
        }
    }
    applyLine(line) {
        line.afterCallback(this.player, this.otherPerson)
            .then(() => {
            this.state = line.nextState;
        });
    }
    getTextForLine(line) {
        var textCallback = line.text;
        return textCallback({});
    }
    createConversationUI() {
        this.ui = new ConversationUI_1.ConversationUI(this);
    }
    notifyStateChange() {
        this.onChangeObservable.notifyObservers(this.state);
    }
}
exports.Conversation = Conversation;

},{"../ui/ConversationUI":26,"../utils/Observable":42}],6:[function(require,module,exports){
"use strict";
const emptyFunctionWithPromise = function () {
    var result = {
        resolveCallback: function () { }
    };
    let deferred = new Promise(function (resolve) {
        result.resolveCallback = resolve;
    });
    result.resolveCallback();
    return deferred;
};
class ConversationLine {
    constructor(_text, _nextState, _afterCallback = emptyFunctionWithPromise) {
        this._text = _text;
        this._nextState = _nextState;
        this._afterCallback = _afterCallback;
        if (!this._text) {
            throw 'ERROR: missing text for conversation line';
        }
        if (!this._nextState) {
            throw 'ERROR: missing next state for conversation line';
        }
    }
    get text() {
        if (typeof this._text === 'string') {
            return (() => { return this._text; });
        }
        else if (typeof this._text === 'function') {
            return this._text;
        }
        throw 'ERROR: getting text of conversation line, with incorrect type';
    }
    get afterCallback() {
        return this._afterCallback;
    }
    get nextState() {
        return this.getNextState();
    }
    getNextState() {
        if (typeof this._nextState === 'string') {
            return this._nextState;
        }
        else {
            return this._nextState();
        }
    }
}
exports.ConversationLine = ConversationLine;

},{}],7:[function(require,module,exports){
"use strict";
const Thing_1 = require('./Thing');
const Verbs_store_1 = require('../stores/Verbs.store');
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
class Door extends Thing_1.Thing {
    constructor(doorOptions) {
        super(doorOptions);
        this.doorOptions = doorOptions;
    }
    get name() {
        return this.options.name || 'door';
    }
    getPreferredAction() {
        if (this.getAttr('OPEN')) {
            return Verbs_store_1.Verbs.CLOSE;
        }
        else {
            return Verbs_store_1.Verbs.OPEN;
        }
    }
    forceOpen() {
        this.changeAttr('OPEN', true);
    }
    goToAction(player) {
        this.goToDestinationIfOpen(player);
    }
    openAction(player) {
        player.goToThing(this)
            .then(() => this.open(player));
    }
    closeAction(player) {
        player.goToThing(this)
            .then(() => this.close(player));
    }
    lookAction(player) {
        player.say('That\'s a wonderful door. So woody.');
    }
    open(player) {
        if (this.getAttr('OPEN')) {
            player.say('It is already open!');
        }
        else {
            this.changeAttr('OPEN', true);
        }
    }
    close(player) {
        if (!this.getAttr('OPEN')) {
            player.say('It is already closed!');
        }
        else {
            this.changeAttr('OPEN', false);
        }
    }
    onStateChange() {
        if (!this.sprite) {
            return;
        }
        if (this.getAttr('OPEN')) {
            this.sprite.frame = 1;
        }
        else {
            this.sprite.frame = 0;
        }
    }
    goToDestinationIfOpen(player) {
        player.goToThing(this).then(() => {
            if (this.getAttr('OPEN')) {
                let goToSceneOptions = {
                    sceneId: this.doorOptions.destinationSceneId,
                    relatedDoorId: this.doorOptions.relatedDoorId
                };
                ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.GO_TO_SCENE, goToSceneOptions);
            }
        });
    }
}
exports.Door = Door;

},{"../stores/Verbs.store":23,"../utils/ActionDispatcher":40,"./Thing":15}],8:[function(require,module,exports){
"use strict";
const Labels_store_1 = require('../stores/Labels.store');
const ActiveInventory_singleton_1 = require('../state/ActiveInventory.singleton');
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const GraphicUI_1 = require('../ui/GraphicUI');
const GameCamera_1 = require('./GameCamera');
const SelectedVerb_singleton_1 = require('../state/SelectedVerb.singleton');
const Verbs_store_1 = require('../stores/Verbs.store');
const SelectedObjects_1 = require('../state/SelectedObjects');
const Scenes_singleton_1 = require('../state/Scenes.singleton');
class Game {
    constructor(options) {
        this.options = options;
        Labels_store_1.labelsStore.addLabels(this.options.labels);
        this.player = this.options.player;
        ActiveInventory_singleton_1.activeInventory.setActiveInventory(this.player.inventory);
        this.createScenes(this.options);
        this.initActions();
        this.updateWorldBounds();
        this.camera = new GameCamera_1.GameCamera(this.player);
        this.graphicUI = new GraphicUI_1.GraphicUI();
    }
    update() {
        this.camera.updatePosition();
    }
    createScenes(options) {
        Scenes_singleton_1.scenes.init(options.scenes);
        Scenes_singleton_1.scenes.setCurrentSceneById(options.initialSceneId);
    }
    initActions() {
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.CLICK_STAGE, ev => this.movePlayerTo(ev));
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.SELECT_THING, thing => this.selectThing(thing));
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.GO_TO_SCENE, options => this.goToScene(options));
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.TAKE_OBJECT, thing => this.takeObject(thing));
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.REFLECT, () => this.reflect());
    }
    movePlayerTo(event) {
        let nonSafePosition = {
            x: event.worldX,
            y: event.worldY
        };
        let safePosition = Scenes_singleton_1.scenes.currentScene.boundaries.getPositionInside(nonSafePosition);
        this.player.moveTo(safePosition);
    }
    updateWorldBounds() {
        let bounds = Scenes_singleton_1.scenes.currentScene.sceneBounds;
        PhaserGame_singleton_1.phaserGame.value.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    }
    selectThing(thing) {
        var verb = Verbs_store_1.VerbsInfo.get(SelectedVerb_singleton_1.selectedVerb.verb);
        if (verb.singleObject) {
            thing.applyAction(SelectedVerb_singleton_1.selectedVerb.verb, this.player);
            ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.ACTION_APPLIED);
        }
        else {
            this.selectThingForMultipleObjectVerb(thing);
        }
    }
    takeObject(thing) {
        Scenes_singleton_1.scenes.currentScene.removeObject(thing);
        this.player.addObjectToInventory(thing);
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.UPDATE_INVENTORY);
    }
    selectThingForMultipleObjectVerb(thing) {
        if (SelectedObjects_1.selectedThing.thing) {
            thing.applyAction(SelectedVerb_singleton_1.selectedVerb.verb, this.player);
            ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.ACTION_APPLIED);
        }
        else {
            if (thing.isInInventory()) {
                SelectedObjects_1.selectedThing.thing = thing;
            }
        }
    }
    goToScene(options) {
        Scenes_singleton_1.scenes.goToSceneWithId(options.sceneId);
        Scenes_singleton_1.scenes.currentScene.playerArrivesAtDoor(this.player, options.relatedDoorId);
    }
    reflect() {
        this.player.reflect();
    }
}
exports.Game = Game;

},{"../state/ActiveInventory.singleton":16,"../state/PhaserGame.singleton":17,"../state/Scenes.singleton":18,"../state/SelectedObjects":19,"../state/SelectedVerb.singleton":20,"../stores/Labels.store":22,"../stores/Verbs.store":23,"../ui/GraphicUI":28,"../utils/ActionDispatcher":40,"./GameCamera":9}],9:[function(require,module,exports){
"use strict";
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const Style_1 = require('../ui/Style');
class GameCamera {
    constructor(player) {
        this.player = player;
        if (!this.player) {
            throw 'ERROR: a camera needs a player to follow';
        }
        this.camera = PhaserGame_singleton_1.phaserGame.value.camera;
        this.updatePosition();
    }
    updatePosition() {
        this.cameraPosition = this.cameraPosition || new Phaser.Point(0, 0);
        let player = this.player.sprite;
        this.cameraPosition.x += (player.x - this.cameraPosition.x) * Style_1.style.CAMERA_EASING_FACTOR;
        this.cameraPosition.x = Math.round(this.cameraPosition.x);
        this.cameraPosition.y += (player.y - this.cameraPosition.y) * Style_1.style.CAMERA_EASING_FACTOR;
        this.cameraPosition.y = Math.round(this.cameraPosition.y);
        this.camera.focusOnXY(this.cameraPosition.x, this.cameraPosition.y);
    }
}
exports.GameCamera = GameCamera;

},{"../state/PhaserGame.singleton":17,"../ui/Style":34}],10:[function(require,module,exports){
"use strict";
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
const Observable_1 = require('../utils/Observable');
class GenericHighlightedThing {
    constructor() {
        this.onChangeObservable = new Observable_1.Observable();
        this.reset();
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.CURSOR_OVER_THING, thing => this.onCursorOverThing(thing));
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.CURSOR_OUT_THING, thing => this.onCursorOutThing(thing));
    }
    subscribeToChange(callback) {
        this.onChangeObservable.registerObserver(callback);
        callback(this.highlightedThing);
    }
    unsubscribeToChange(callback) {
        this.onChangeObservable.removeObserver(callback);
    }
    get thing() {
        return this.highlightedThing;
    }
    set thing(newThing) {
        this.highlightThing(newThing);
    }
    highlightThing(newThing) {
        this.highlightedThing = newThing;
        this.notifySubscribers();
    }
    reset() {
        this.highlightThing(null);
    }
    onCursorOverThing(thing) { }
    onCursorOutThing(thing) { }
    notifySubscribers() {
        this.onChangeObservable.notifyObservers(this.highlightedThing);
    }
}
exports.GenericHighlightedThing = GenericHighlightedThing;

},{"../utils/ActionDispatcher":40,"../utils/Observable":42}],11:[function(require,module,exports){
"use strict";
const Observable_1 = require('../utils/Observable');
class Inventory {
    constructor() {
        this.changeObservable = new Observable_1.Observable();
        this.items = new Set();
    }
    subscribeToChange(callback) {
        this.changeObservable.registerObserver(callback);
    }
    unsubscribeToChange(callback) {
        this.changeObservable.removeObserver(callback);
    }
    add(item) {
        item.state.set('IS_IN_INVENTORY', true);
        this.items.add(item);
        this.changeObservable.notifyObservers(this);
    }
    remove(item) {
        this.items.delete(item);
        this.changeObservable.notifyObservers(this);
    }
    getById(id) {
        let itemArray = Array.from(this.items);
        for (let i = 0; i < itemArray.length; i++) {
            if (itemArray[i].id === id) {
                return itemArray[i];
            }
        }
        return null;
    }
}
exports.Inventory = Inventory;

},{"../utils/Observable":42}],12:[function(require,module,exports){
"use strict";
const Inventory_1 = require('./Inventory');
const UILayers_singleton_1 = require('../ui/UILayers.singleton');
const Directions_1 = require('../utils/Directions');
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const SpeechBubble_1 = require('../ui/SpeechBubble');
const Scenes_singleton_1 = require('../state/Scenes.singleton');
class Player {
    constructor(options) {
        this.options = options;
        this.inventory = new Inventory_1.Inventory();
        this.createSprite();
        this.direction = Directions_1.Directions.RIGHT;
        this.playStandAnimation();
        this.speechBubble = new SpeechBubble_1.SpeechBubble({
            owner: this
        });
        this._state = new Map();
    }
    moveTo(destination) {
        this.cancelCurrentTween();
        this.cancelCurrentMovePromise();
        let timeToAnimate = this.getTimeForAnimation(destination);
        if (timeToAnimate) {
            this.updateDirection(destination);
            this.playWalkingAnimation();
            this.tween = PhaserGame_singleton_1.phaserGame.value.add.tween(this._sprite);
            this.tween.to({ x: destination.x, y: destination.y }, timeToAnimate, 'Linear', true, 0);
            this.tween.onComplete.add(this.stopAnimations, this);
        }
        this.willMovePromise = this.createMovePromise(timeToAnimate);
        return this.willMovePromise.promise;
    }
    get sprite() {
        return this._sprite;
    }
    goToThing(thing) {
        return this.moveTo(thing.getPositionToGoTo());
    }
    say(text) {
        return this.speechBubble.say(text);
    }
    getPositionOnTop() {
        var result = {
            x: this.sprite.x,
            y: Math.round(this.sprite.getBounds().y) - 10
        };
        return result;
    }
    addObjectToInventory(thing) {
        this.inventory.add(thing);
    }
    teleportTo(destination) {
        let safePosition = Scenes_singleton_1.scenes.currentScene.boundaries.getPositionInside(destination);
        return this.moveToWithoutAnimation(safePosition);
    }
    get state() {
        return this._state;
    }
    set state(newState) {
        if (newState) {
            this._state = newState;
            this.onStateChange();
        }
    }
    changeAttr(attrName, value) {
        this._state.set(attrName, value);
        this.onStateChange();
    }
    getAttr(attrName) {
        return this._state.get(attrName);
    }
    //This method can be overwritten in child classes
    onStateChange() { }
    moveToWithoutAnimation(position) {
        this.updateDirection(position);
        this.cancelCurrentTween();
        this.cancelCurrentMovePromise();
        this.playStandAnimation();
        this.sprite.x = position.x;
        this.sprite.y = position.y;
    }
    createSprite() {
        this._sprite = UILayers_singleton_1.uiLayers.player.create(this.options.initialX, this.options.initialY, this.options.spriteId);
        this._sprite.anchor.setTo(0.5, 0.99);
        UILayers_singleton_1.uiLayers.player.sort('z', Phaser.Group.SORT_ASCENDING);
        this.addSpriteAnimations();
    }
    addSpriteAnimations() {
        this.options.spriteOptions.forEach((spritePosition, key) => {
            this._sprite.animations.add(key, spritePosition.frames, this.options.animationSpeed, true);
        });
    }
    createMovePromise(timeToMove = 0) {
        var result = {
            timeoutId: null,
            promise: null,
            resolveCallback: null,
            rejectCallback: null
        };
        result.timeoutId = window.setTimeout(() => this.resolveMovePromise(), timeToMove);
        result.promise = new Promise(function (resolve, reject) {
            result.resolveCallback = resolve;
            result.rejectCallback = reject;
        });
        return result;
    }
    resolveMovePromise() {
        if (this.willMovePromise) {
            this.willMovePromise.resolveCallback();
            this.willMovePromise = null;
        }
    }
    cancelCurrentMovePromise() {
        if (this.willMovePromise) {
            window.clearTimeout(this.willMovePromise.timeoutId);
            // We could reject the promise like this, but there is no need
            // this.willMovePromise.rejectCallback();
            this.willMovePromise = null;
        }
    }
    cancelCurrentTween() {
        if (this.tween && this.tween.isRunning) {
            this.tween.stop();
            this.tween.onComplete.removeAll();
        }
    }
    getTimeForAnimation(destination) {
        let angleBetween = this.getAngleToDesiredPosition(destination);
        let diff1 = this._sprite.x - destination.x;
        let diff2 = this._sprite.y - destination.y;
        let distance = Math.sqrt((diff1 * diff1) + (diff2 * diff2));
        let speedFromX = Math.abs(Math.cos(angleBetween)) * distance / this.options.xSpeed;
        let speedFromY = Math.abs(Math.sin(angleBetween)) * distance / this.options.ySpeed;
        return 1000 * ((speedFromX + speedFromY) / 2);
    }
    getAngleToDesiredPosition(destination) {
        return Math.atan2(this._sprite.y - destination.y, this._sprite.x - destination.x);
    }
    updateDirection(destination) {
        let angleBetween = this.getAngleToDesiredPosition(destination);
        let angleDegrees = (angleBetween * 180 / Math.PI);
        if ((angleDegrees >= -45) && (angleDegrees <= 45)) {
            this.direction = Directions_1.Directions.LEFT;
        }
        else if ((angleDegrees >= 45) && (angleDegrees <= 135)) {
            this.direction = Directions_1.Directions.UP;
        }
        else if ((angleDegrees >= -135) && (angleDegrees <= -45)) {
            this.direction = Directions_1.Directions.DOWN;
        }
        else {
            this.direction = Directions_1.Directions.RIGHT;
        }
    }
    playWalkingAnimation() {
        let directionName = Directions_1.getDirectionName(this.direction);
        let spriteState = 'walk_' + directionName;
        this._sprite.animations.play(spriteState);
        this.flipXIfNeeded(spriteState);
    }
    flipXIfNeeded(spriteState) {
        let spriteStateOptions = this.options.spriteOptions.get(spriteState);
        if (spriteStateOptions && spriteStateOptions.inverse) {
            this._sprite.scale.x = -1;
        }
        else {
            this._sprite.scale.x = 1;
        }
    }
    stopAnimations() {
        this.playStandAnimation();
        this._sprite.animations.stop();
    }
    playStandAnimation() {
        let directionName = Directions_1.getDirectionName(this.direction);
        let spriteState = 'stand_' + directionName;
        this._sprite.animations.play(spriteState);
        this.flipXIfNeeded(spriteState);
    }
}
exports.Player = Player;

},{"../state/PhaserGame.singleton":17,"../state/Scenes.singleton":18,"../ui/SpeechBubble":33,"../ui/UILayers.singleton":38,"../utils/Directions":41,"./Inventory":11}],13:[function(require,module,exports){
"use strict";
const UILayers_singleton_1 = require('../ui/UILayers.singleton');
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
const SceneBoundaries_1 = require('./SceneBoundaries');
class Scene {
    constructor(options) {
        this.options = options;
        this._boundaries = new SceneBoundaries_1.SceneBoundaries(options.boundariesConfig);
        this.createThings();
    }
    get id() {
        return this.options.id;
    }
    get sceneBounds() {
        return this.background.getBounds();
    }
    get boundaries() {
        return this._boundaries;
    }
    show() {
        this.createBackground();
        this.things.forEach(thing => thing.show());
    }
    removeObject(objectToRemove) {
        this.things.delete(objectToRemove);
        objectToRemove.destroy();
    }
    playerArrivesAtDoor(player, doorId) {
        let door = this.findDoor(doorId);
        door.forceOpen();
        player.teleportTo(door.getPositionToGoTo());
    }
    getThingById(thingId) {
        var foundThing = null;
        this.things.forEach((thing) => {
            if (thing.id === thingId) {
                foundThing = thing;
            }
        });
        return foundThing;
    }
    destroy() {
        this.background.destroy();
        this.things.forEach(thing => thing.destroy());
    }
    createBackground() {
        this.background = UILayers_singleton_1.uiLayers.background.create(0, 0, this.options.backgroundId);
        this.background.anchor.set(0, 0);
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add((dest, ev) => {
            ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.CLICK_STAGE, ev);
        });
    }
    createThings() {
        this.things = new Set();
        this.options.things.forEach((thing) => this.things.add(thing));
    }
    findDoor(doorId) {
        for (let thing of this.things) {
            if (thing.id === doorId) {
                return thing;
            }
        }
        throw 'ERROR: could not find the related door.';
    }
}
exports.Scene = Scene;

},{"../ui/UILayers.singleton":38,"../utils/ActionDispatcher":40,"./SceneBoundaries":14}],14:[function(require,module,exports){
"use strict";
class SceneBoundaries {
    constructor(config) {
        this.config = config;
    }
    getPositionInside(point) {
        let x = Math.max(this.config.minX, point.x);
        x = Math.min(this.config.maxX, x);
        let y = Math.max(this.config.minY, point.y);
        y = Math.min(this.config.maxY, y);
        return {
            x: Math.round(x),
            y: Math.round(y)
        };
    }
}
exports.SceneBoundaries = SceneBoundaries;

},{}],15:[function(require,module,exports){
"use strict";
const UILayers_singleton_1 = require('../ui/UILayers.singleton');
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
const ActiveInventory_singleton_1 = require('../state/ActiveInventory.singleton');
const Verbs_store_1 = require('../stores/Verbs.store');
class Thing {
    constructor(options) {
        this.options = options;
        this.state = new Map();
        if (this.options.directlyInInventory) {
            this.addToInventory();
        }
    }
    show() {
        this.createSprite();
        this.onStateChange();
        this.applyModifier();
    }
    get state() {
        return this._state;
    }
    set state(newState) {
        if (newState) {
            this._state = newState;
            this.onStateChange();
        }
    }
    get name() {
        return this.options.name;
    }
    get id() {
        return this.options.id;
    }
    changeAttr(attrName, value) {
        this._state.set(attrName, value);
        this.onStateChange();
    }
    getAttr(attrName) {
        return this._state.get(attrName);
    }
    getPreferredAction() {
        return this.options.preferredAction || null;
    }
    isInInventory() {
        return this.state && this.state.get('IS_IN_INVENTORY');
    }
    getPositionToGoTo() {
        if (this.options.goToPosition) {
            return this.options.goToPosition;
        }
        else {
            return {
                x: this.options.x,
                y: this.options.y
            };
        }
    }
    getPositionOnTop() {
        var result = {
            x: this.sprite.x,
            y: Math.round(this.sprite.getBounds().y) - 10
        };
        return result;
    }
    applyAction(verb, player) {
        switch (verb) {
            case Verbs_store_1.Verbs.GO_TO:
                if (!this.isInInventory()) {
                    this.goToAction(player);
                }
                break;
            case Verbs_store_1.Verbs.TAKE:
                this.takeAction(player);
                break;
            case Verbs_store_1.Verbs.LOOK:
                this.lookAction(player);
                break;
            case Verbs_store_1.Verbs.OPEN:
                this.openAction(player);
                break;
            case Verbs_store_1.Verbs.CLOSE:
                this.closeAction(player);
                break;
            case Verbs_store_1.Verbs.PUSH:
                this.pushAction(player);
                break;
            case Verbs_store_1.Verbs.USE:
                this.useAction(player);
                break;
            case Verbs_store_1.Verbs.SPEAK:
                this.speakAction(player);
                break;
            case Verbs_store_1.Verbs.GIVE:
                this.giveAction(player);
                break;
            default:
                throw 'ERROR, unknown action ' + verb;
        }
    }
    get inventoryImage() {
        return this.options.inventoryImageId || this.options.spriteId;
    }
    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
        if (this.isInInventory) {
            ActiveInventory_singleton_1.activeInventory.getActiveInventory().remove(this);
        }
    }
    // Methods that can be overwritten in subclasses
    getFrameForInventory() {
        return 0;
    }
    onStateChange() { }
    ;
    applyModifier() { }
    ;
    goToAction(player) {
        player.goToThing(this);
    }
    takeAction(player) {
        if (!this.options.pickable) {
        }
        else if (this.isInInventory()) {
            player.say('I already have it');
        }
        else {
            this.letPlayerComeAndTakeIt(player);
        }
    }
    letPlayerComeAndTakeIt(player) {
        player.goToThing(this)
            .then(() => {
            ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.TAKE_OBJECT, this);
        });
    }
    lookAction(player) {
        //TODO: check if there are look options
        player.say('That is pretty neat');
    }
    openAction(player) {
        player.say('That cannot be opened');
    }
    closeAction(player) {
        player.say('That cannot be closed');
    }
    pushAction(player) {
        player.say('I cannot move that');
    }
    useAction(player) {
        player.say('I do not know how to use that');
    }
    speakAction(player) {
        player.say('I wouldn\'t know what to say');
    }
    giveAction(player) {
        player.say('I cannot do that');
    }
    //Methods that shouldn't be overriden
    addToInventory() {
        if (ActiveInventory_singleton_1.activeInventory.getActiveInventory()) {
            ActiveInventory_singleton_1.activeInventory.getActiveInventory().add(this);
        }
    }
    createSprite() {
        let layerToUser = UILayers_singleton_1.uiLayers.backgroundObjects;
        if (this.options.isForeground) {
            layerToUser = UILayers_singleton_1.uiLayers.foregroundObjects;
        }
        this.sprite = layerToUser.create(this.options.x, this.options.y, this.options.spriteId);
        if (!this.options.justDecoration) {
            this.sprite.inputEnabled = true;
            this.sprite.events.onInputDown.add(this.onClick, this);
            this.sprite.events.onInputOver.add(this.onInputOver, this);
            this.sprite.events.onInputOut.add(this.onInputOut, this);
        }
    }
    onClick() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.SELECT_THING, this);
    }
    onInputOver() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.CURSOR_OVER_THING, this);
    }
    onInputOut() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.CURSOR_OUT_THING, this);
    }
}
exports.Thing = Thing;

},{"../state/ActiveInventory.singleton":16,"../stores/Verbs.store":23,"../ui/UILayers.singleton":38,"../utils/ActionDispatcher":40}],16:[function(require,module,exports){
"use strict";
const Observable_1 = require('../utils/Observable');
class ActiveInventory {
    constructor() {
        this.changeObservable = new Observable_1.Observable();
        this.onInventoryChangeBinded = ((newValue) => {
            this.changeObservable.notifyObservers(newValue);
        });
    }
    setActiveInventory(newInventory) {
        this.removeOldInventoryEvents();
        this.activeInventory = newInventory;
        this.createNewInventoryEvents();
        this.notifySubscribers();
    }
    getActiveInventory() {
        return this.activeInventory;
    }
    refresh() {
        this.notifySubscribers();
    }
    subscribeToChange(callback) {
        this.changeObservable.registerObserver(callback);
        callback(this.activeInventory);
    }
    unsubscribeToChange(callback) {
        this.changeObservable.removeObserver(callback);
    }
    removeOldInventoryEvents() {
        if (this.activeInventory) {
            this.activeInventory.unsubscribeToChange(this.onInventoryChangeBinded);
        }
    }
    createNewInventoryEvents() {
        if (this.activeInventory) {
            this.activeInventory.subscribeToChange(this.onInventoryChangeBinded);
        }
    }
    notifySubscribers() {
        this.changeObservable.notifyObservers(this.activeInventory);
    }
}
exports.activeInventory = new ActiveInventory();

},{"../utils/Observable":42}],17:[function(require,module,exports){
"use strict";
class PhaserGame {
    set value(newValue) {
        this.currentValue = newValue;
    }
    get value() {
        return this.currentValue;
    }
}
exports.phaserGame = new PhaserGame();

},{}],18:[function(require,module,exports){
"use strict";
class ScenesSet {
    init(scenes) {
        this.scenes = new Map();
        scenes.forEach((scene) => {
            this.scenes.set(scene.id, scene);
        });
    }
    get currentScene() {
        return this._currentScene;
    }
    setCurrentSceneById(newCurrentSceneId) {
        this.destroyCurrentScene();
        let scene = this.scenes.get(newCurrentSceneId);
        if (!scene) {
            throw `ERROR trying to init scene that is not present (${newCurrentSceneId})`;
        }
        this._currentScene = scene;
        scene.show();
    }
    goToSceneWithId(sceneId) {
        this.destroyCurrentScene();
        this.setCurrentSceneById(sceneId);
    }
    destroyCurrentScene() {
        if (this._currentScene) {
            this._currentScene.destroy();
            this._currentScene = null;
        }
    }
}
exports.scenes = new ScenesSet();

},{}],19:[function(require,module,exports){
"use strict";
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
const GenericHighlightedThing_1 = require('../models/GenericHighlightedThing');
const SelectedVerb_singleton_1 = require('./SelectedVerb.singleton');
const Verbs_store_1 = require('../stores/Verbs.store');
class SelectedThing extends GenericHighlightedThing_1.GenericHighlightedThing {
    constructor() {
        super();
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.ACTION_APPLIED, () => this.highlightThing(null));
    }
}
class HighlightedThing extends GenericHighlightedThing_1.GenericHighlightedThing {
    onCursorOverThing(thing) {
        if (!SelectedVerb_singleton_1.selectedVerb.verb) {
            return;
        }
        let verbInfo = Verbs_store_1.VerbsInfo.get(SelectedVerb_singleton_1.selectedVerb.verb);
        if (SelectedVerb_singleton_1.selectedVerb.verb && verbInfo.singleObject) {
            this.highlightThing(thing);
        }
        else if (SelectedVerb_singleton_1.selectedVerb.verb && !verbInfo.singleObject) {
            this.highlightThingForMultipleObjectVerb(thing);
        }
    }
    highlightThingForMultipleObjectVerb(thing) {
        if (exports.selectedThing.thing) {
            this.highlightThing(thing);
        }
        else if (thing.isInInventory()) {
            this.highlightThing(thing);
        }
    }
    onCursorOutThing() {
        this.highlightThing(null);
    }
}
exports.highlightedThing = new HighlightedThing();
exports.selectedThing = new SelectedThing();

},{"../models/GenericHighlightedThing":10,"../stores/Verbs.store":23,"../utils/ActionDispatcher":40,"./SelectedVerb.singleton":20}],20:[function(require,module,exports){
"use strict";
const Verbs_store_1 = require('../stores/Verbs.store');
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
const Observable_1 = require('../utils/Observable');
class SelectedVerb {
    constructor() {
        this.onChangeObservable = new Observable_1.Observable();
        this.reset();
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.SELECT_VERB, newVerb => this.selectNewVerb(newVerb));
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.ACTION_APPLIED, () => this.reset());
    }
    get verb() {
        return this.selectedVerb;
    }
    subscribeToChange(callback) {
        this.onChangeObservable.registerObserver(callback);
        callback(this.selectedVerb);
    }
    unsubscribeToChange(callback) {
        this.onChangeObservable.removeObserver(callback);
    }
    notifySubscribers() {
        this.onChangeObservable.notifyObservers(this.selectedVerb);
    }
    selectNewVerb(newVerb) {
        this.selectedVerb = newVerb;
        this.notifySubscribers();
    }
    reset() {
        this.selectNewVerb(Verbs_store_1.Verbs.GO_TO);
    }
}
exports.selectedVerb = new SelectedVerb();

},{"../stores/Verbs.store":23,"../utils/ActionDispatcher":40,"../utils/Observable":42}],21:[function(require,module,exports){
"use strict";
exports.DEFAULT_LABELS = {
    'es': {
        'Close': 'Cerrar',
        'Give': 'Dar',
        'Go to': 'Ir a',
        'Look at': 'Mirar',
        'Open': 'Abrir',
        'Push': 'Empujar',
        'Reflect': 'Pensar',
        'Speak to': 'Hablar a',
        'Take': 'Coger',
        'to': 'a',
        'Use': 'Usar',
        'with': 'con'
    },
    'en': {
        'Close': 'Close',
        'Give': 'Give',
        'Go to': 'Go to',
        'Look at': 'Look at',
        'Open': 'Open',
        'Push': 'Push',
        'Reflect': 'Reflect',
        'Speak to': 'Speak to',
        'Take': 'Pick up',
        'to': 'to',
        'Use': 'Use',
        'with': 'with'
    }
};

},{}],22:[function(require,module,exports){
"use strict";
/// <reference path="../../../../my-typings/lib.es6.d.ts" />
const DefaultLabels_1 = require('./DefaultLabels');
;
;
const DEFAULT_LANGUAGE = 'en';
class LabelsStore {
    constructor() {
        this.labels = new Map();
        this.currentLanguage = DEFAULT_LANGUAGE;
    }
    addLabels(labelsToAdd) {
        for (let key in labelsToAdd) {
            this.addLabelsForLanguage(key, labelsToAdd[key]);
        }
    }
    getLabel(labelName) {
        let allLanguageLabels = this.labels.get(this.currentLanguage);
        if (!allLanguageLabels) {
            throw 'ERROR: trying to get label from non existing language';
        }
        return allLanguageLabels[labelName] || labelName;
    }
    addLabelsForLanguage(language, labels) {
        let previousLabels = this.labels.get(language) || {};
        let newLabels = Object.assign({}, previousLabels, labels);
        this.labels.set(language, newLabels);
    }
}
let labelsStoreSingleton = new LabelsStore();
labelsStoreSingleton.addLabels(DefaultLabels_1.DEFAULT_LABELS);
exports.label = ((labelId) => {
    return labelsStoreSingleton.getLabel(labelId);
});
exports.labelsStore = labelsStoreSingleton;

},{"./DefaultLabels":21}],23:[function(require,module,exports){
/// <reference path="../../../../my-typings/lib.es6.d.ts" />
"use strict";
(function (Verbs) {
    Verbs[Verbs["GO_TO"] = 1] = "GO_TO";
    Verbs[Verbs["LOOK"] = 2] = "LOOK";
    Verbs[Verbs["CLOSE"] = 3] = "CLOSE";
    Verbs[Verbs["PUSH"] = 4] = "PUSH";
    Verbs[Verbs["TAKE"] = 5] = "TAKE";
    Verbs[Verbs["USE"] = 6] = "USE";
    Verbs[Verbs["SPEAK"] = 7] = "SPEAK";
    Verbs[Verbs["GIVE"] = 8] = "GIVE";
    Verbs[Verbs["OPEN"] = 9] = "OPEN";
})(exports.Verbs || (exports.Verbs = {}));
var Verbs = exports.Verbs;
;
let verbsInfo = new Map();
verbsInfo.set(Verbs.GO_TO, {
    label: 'Go to',
    singleObject: true
});
verbsInfo.set(Verbs.LOOK, {
    label: 'Look at',
    singleObject: true
});
verbsInfo.set(Verbs.CLOSE, {
    label: 'Close',
    singleObject: true
});
verbsInfo.set(Verbs.PUSH, {
    label: 'Push',
    singleObject: true
});
verbsInfo.set(Verbs.TAKE, {
    label: 'Take',
    singleObject: true
});
verbsInfo.set(Verbs.USE, {
    label: 'Use',
    singleObject: false,
    conjuction: 'with'
});
verbsInfo.set(Verbs.SPEAK, {
    label: 'Speak to',
    singleObject: true
});
verbsInfo.set(Verbs.GIVE, {
    label: 'Give',
    singleObject: false,
    conjuction: 'to'
});
verbsInfo.set(Verbs.OPEN, {
    label: 'Open',
    singleObject: true
});
exports.VerbsInfo = verbsInfo;

},{}],24:[function(require,module,exports){
"use strict";
const Verbs_store_1 = require('../stores/Verbs.store');
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
const Labels_store_1 = require('../stores/Labels.store');
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
const TextWithShadow_1 = require('./TextWithShadow');
class ActionButton {
    constructor(verb, position) {
        this.verb = verb;
        this.screenPosition = LayoutManager_singleton_1.layout.getVerbButtonPosition(position);
        this.createButton();
        this.createText();
    }
    highlight() {
        this.button.frame = 2;
    }
    unhighlight() {
        this.button.frame = 0;
    }
    createButton() {
        this.button = PhaserGame_singleton_1.phaserGame.value.add.button(this.screenPosition.x, this.screenPosition.y, 'BUTTON_BG', this.onClick, this, 1, 0, 2, 1);
        UILayers_singleton_1.uiLayers.verbButtons.add(this.button);
        this.button.fixedToCamera = true;
    }
    createText() {
        let text = Labels_store_1.label(Verbs_store_1.VerbsInfo.get(this.verb).label);
        let position = {
            x: this.screenPosition.x + LayoutManager_singleton_1.layout.VERB_BUTTON_WIDTH / 2,
            y: this.screenPosition.y + LayoutManager_singleton_1.layout.VERB_BUTTON_HEIGHT / 2
        };
        this.text = new TextWithShadow_1.TextWithShadow({
            initialText: text,
            position: position,
            fixedToCamera: true,
            layer: UILayers_singleton_1.uiLayers.verbButtons,
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });
    }
    onClick() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.SELECT_VERB, this.verb);
    }
}
exports.ActionButton = ActionButton;

},{"../state/PhaserGame.singleton":17,"../stores/Labels.store":22,"../stores/Verbs.store":23,"../utils/ActionDispatcher":40,"./LayoutManager.singleton":31,"./TextWithShadow":36,"./UILayers.singleton":38}],25:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const Observable_1 = require('../utils/Observable');
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
const TextWithShadow_1 = require('./TextWithShadow');
class ConversationLineUI {
    constructor(conversationLine, lineText, index) {
        this.conversationLine = conversationLine;
        this.lineText = lineText;
        this.index = index;
        if (!this.conversationLine) {
            throw 'ERROR: conversation line UI, no conversationLine provided';
        }
        if (!this.lineText) {
            throw 'ERROR: conversation line UI, no text provided';
        }
        if (typeof this.index !== 'number') {
            throw 'ERROR: conversation line UI, no index provided';
        }
        this.clickObservable = new Observable_1.Observable();
        this.position = LayoutManager_singleton_1.layout.getPositionForConversationLine(this.index);
        this.createButton();
        this.createText();
    }
    subscribeToClick(callback) {
        this.clickObservable.registerObserver(callback);
    }
    destroy() {
        this.button.destroy();
        this.text.destroy();
    }
    createButton() {
        this.button = PhaserGame_singleton_1.phaserGame.value.add.button(this.position.x, this.position.y, 'CONVERSATION_LINE_BG', this.onClick, this, 1, 0, 2, 1);
        UILayers_singleton_1.uiLayers.conversation.add(this.button);
        this.button.fixedToCamera = true;
    }
    createText() {
        let position = {
            x: this.position.x + LayoutManager_singleton_1.layout.CONVERSATION_LINE_PADDING_X,
            y: this.position.y + LayoutManager_singleton_1.layout.CONVERSATION_LINE_PADDING_Y
        };
        this.text = new TextWithShadow_1.TextWithShadow({
            initialText: this.lineText,
            position: position,
            fixedToCamera: true,
            layer: UILayers_singleton_1.uiLayers.conversation
        });
    }
    onClick() {
        this.clickObservable.notifyObservers(this.conversationLine);
    }
}
exports.ConversationLineUI = ConversationLineUI;

},{"../state/PhaserGame.singleton":17,"../utils/Observable":42,"./LayoutManager.singleton":31,"./TextWithShadow":36,"./UILayers.singleton":38}],26:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const UIBlocker_singleton_1 = require('../../engine/ui/UIBlocker.singleton');
const ConversationLineUI_1 = require('./ConversationLineUI');
const UILayers_singleton_1 = require('./UILayers.singleton');
class ConversationUI {
    constructor(conversation) {
        this.conversation = conversation;
        UIBlocker_singleton_1.uiBlocker.block();
        this.lines = [];
        this.createBackground();
        this.conversation.onStateChange((newState) => this.update(newState));
    }
    destroy() {
        this.destroyOldLines();
        this.background.destroy();
        UIBlocker_singleton_1.uiBlocker.unblock();
    }
    createBackground() {
        let layoutStartPosition = LayoutManager_singleton_1.layout.UI_START_POSITION;
        this.background = UILayers_singleton_1.uiLayers.conversation.create(layoutStartPosition.x, layoutStartPosition.y, 'UI_CONVERSATION_BG');
        this.background.anchor.setTo(0, 0);
        this.background.fixedToCamera = true;
        this.background.inputEnabled = true;
    }
    update(newState) {
        this.destroyOldLines();
        this.createNewLines();
    }
    createNewLines() {
        let newLines = this.conversation.getLines();
        newLines.forEach((newLine, index) => this.createLine(newLine, index));
    }
    createLine(line, index) {
        let newUILine = new ConversationLineUI_1.ConversationLineUI(line, this.conversation.getTextForLine(line), index);
        newUILine.subscribeToClick(clickedLined => this.lineClicked(clickedLined));
        this.lines.push(newUILine);
    }
    lineClicked(line) {
        this.destroyOldLines();
        this.conversation.applyLine(line);
    }
    destroyOldLines() {
        this.lines.forEach(line => line.destroy());
        this.lines = [];
    }
}
exports.ConversationUI = ConversationUI;

},{"../../engine/ui/UIBlocker.singleton":37,"./ConversationLineUI":25,"./LayoutManager.singleton":31,"./UILayers.singleton":38}],27:[function(require,module,exports){
"use strict";
const SelectedObjects_1 = require('../state/SelectedObjects');
const SelectedVerb_singleton_1 = require('../state/SelectedVerb.singleton');
const TextWithShadow_1 = require('./TextWithShadow');
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
const Labels_store_1 = require('../stores/Labels.store');
const Verbs_store_1 = require('../stores/Verbs.store');
class CurrentActionUI {
    constructor() {
        this.createText();
        SelectedVerb_singleton_1.selectedVerb.subscribeToChange(newVerb => this.updateText());
        SelectedObjects_1.highlightedThing.subscribeToChange(newThing => this.updateText());
        SelectedObjects_1.selectedThing.subscribeToChange(newThing => this.updateText());
    }
    createText() {
        this.text = new TextWithShadow_1.TextWithShadow({
            position: LayoutManager_singleton_1.layout.CURRENT_ACTION_POSITION,
            layer: UILayers_singleton_1.uiLayers.verbButtons,
            fixedToCamera: true
        });
    }
    updateText() {
        let newText = this.getVerbText() + this.getSelectedThingText() + ' ' + this.getThingText();
        this.setText(newText);
    }
    setText(newText) {
        if (this.currentText !== newText) {
            this.currentText = newText;
            this.text.setText(newText);
        }
    }
    getVerbText() {
        let verb = SelectedVerb_singleton_1.selectedVerb.verb;
        return Labels_store_1.label(Verbs_store_1.VerbsInfo.get(verb).label);
    }
    getThingText() {
        let thing = SelectedObjects_1.highlightedThing.thing;
        let text = '';
        if (thing && thing.name) {
            text = Labels_store_1.label(thing.name);
        }
        return text;
    }
    getSelectedThingText() {
        let verb = SelectedVerb_singleton_1.selectedVerb.verb;
        let verbInfo = Verbs_store_1.VerbsInfo.get(verb);
        if (!verbInfo.singleObject && SelectedObjects_1.selectedThing.thing) {
            return ' ' + Labels_store_1.label(SelectedObjects_1.selectedThing.thing.name) + ' ' + Labels_store_1.label(verbInfo.conjuction);
        }
        else {
            return '';
        }
    }
}
exports.CurrentActionUI = CurrentActionUI;

},{"../state/SelectedObjects":19,"../state/SelectedVerb.singleton":20,"../stores/Labels.store":22,"../stores/Verbs.store":23,"./LayoutManager.singleton":31,"./TextWithShadow":36,"./UILayers.singleton":38}],28:[function(require,module,exports){
"use strict";
const UILayers_singleton_1 = require('./UILayers.singleton');
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const VerbsUI_1 = require('./VerbsUI');
const CurrentActionUI_1 = require('./CurrentActionUI');
const InventoryUI_1 = require('./InventoryUI');
const ReflectButton_1 = require('./ReflectButton');
class GraphicUI {
    constructor() {
        this.createBackground();
        new VerbsUI_1.VerbsUI();
        new CurrentActionUI_1.CurrentActionUI();
        new InventoryUI_1.InventoryUI();
        new ReflectButton_1.ReflectButton();
    }
    createBackground() {
        let layoutStartPosition = LayoutManager_singleton_1.layout.UI_START_POSITION;
        let background = UILayers_singleton_1.uiLayers.guiBackground.create(layoutStartPosition.x, layoutStartPosition.y, 'UI_BG');
        background.anchor.setTo(0, 0);
        background.fixedToCamera = true;
        background.inputEnabled = true;
    }
}
exports.GraphicUI = GraphicUI;

},{"./CurrentActionUI":27,"./InventoryUI":30,"./LayoutManager.singleton":31,"./ReflectButton":32,"./UILayers.singleton":38,"./VerbsUI":39}],29:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
class InventoryItemUI {
    constructor(options) {
        this.options = options;
        this.createSprite();
    }
    destroy() {
        this.sprite.destroy();
    }
    createSprite() {
        let position = LayoutManager_singleton_1.layout.getPositionForUIInventoryItem(this.options.index);
        this.sprite = UILayers_singleton_1.uiLayers.verbButtons.create(position.x, position.y, this.options.thing.inventoryImage);
        this.sprite.inputEnabled = true;
        this.sprite.fixedToCamera = true;
        this.sprite.frame = this.options.thing.getFrameForInventory();
        this.sprite.events.onInputDown.add(this.onClick, this);
        this.sprite.events.onInputOver.add(this.onInputOver, this);
        this.sprite.events.onInputOut.add(this.onInputOut, this);
    }
    onClick() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.SELECT_THING, this.options.thing);
    }
    onInputOver() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.CURSOR_OVER_THING, this.options.thing);
    }
    onInputOut() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.CURSOR_OUT_THING, this.options.thing);
    }
}
exports.InventoryItemUI = InventoryItemUI;

},{"../utils/ActionDispatcher":40,"./LayoutManager.singleton":31,"./UILayers.singleton":38}],30:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
const InventoryItemUI_1 = require('./InventoryItemUI');
const ActiveInventory_singleton_1 = require('../state/ActiveInventory.singleton');
class InventoryUI {
    constructor() {
        this.createBackground();
        this.items = new Set();
        ActiveInventory_singleton_1.activeInventory.subscribeToChange((newInventory) => this.inventoryChanged(newInventory));
    }
    // refresh() {
    //     this.inventoryChanged(activeInventory.getActiveInventory());
    // }
    inventoryChanged(newInventory) {
        this.currentInventory = newInventory;
        this.createItems();
    }
    createBackground() {
        let layoutStartPosition = LayoutManager_singleton_1.layout.INVENTORY_START_POSITION;
        let background = UILayers_singleton_1.uiLayers.verbButtons.create(layoutStartPosition.x, layoutStartPosition.y, 'UI_INV_BG');
        background.anchor.setTo(0, 0);
        background.fixedToCamera = true;
    }
    createItems() {
        //TODO: handle order and more than 6 inv items
        this.destroyPrevItems();
        let index = 0;
        for (let thing of this.currentInventory.items) {
            this.items.add(new InventoryItemUI_1.InventoryItemUI({
                thing: thing,
                index: index
            }));
            index += 1;
        }
    }
    destroyPrevItems() {
        this.items.forEach(item => item.destroy());
        this.items.clear();
    }
}
exports.InventoryUI = InventoryUI;

},{"../state/ActiveInventory.singleton":16,"./InventoryItemUI":29,"./LayoutManager.singleton":31,"./UILayers.singleton":38}],31:[function(require,module,exports){
"use strict";
const VERB_BUTTON_HEIGHT = 36;
const CURRENT_ACTION_INFO_HEIGHT = 40;
const VERB_BUTTON_WIDTH = 150;
const REFLECT_BUTTON_WIDTH = VERB_BUTTON_WIDTH;
const CURRENT_ACTION_INFO_PADDING_X = 5;
const CURRENT_ACTION_INFO_PADDING_Y = 7;
const VERBS_ROWS = 3;
const VERB_COLUMNS = 3;
const INV_ROWS = 2;
const INV_COLUMNS = 3;
const INV_ITEM_WIDTH = 136;
const INV_ITEM_HEIGHT = 52;
const CONVERSATION_LINE_HEIGHT = CURRENT_ACTION_INFO_HEIGHT;
const CONVERSATION_LINE_PADDING_X = 5;
const CONVERSATION_LINE_PADDING_Y = 6;
class LayoutManager {
    constructor() {
        this.LAYOUT_WIDTH = 1066;
        this.LAYOUT_HEIGHT = 600;
        this.LAYOUT_ZOOM = 2;
        this.LAYOUT_DEFAULT_MARGIN = 1;
        this.VERB_BUTTON_MARGIN = this.LAYOUT_DEFAULT_MARGIN;
    }
    get WIDTH() {
        return this.LAYOUT_WIDTH / this.LAYOUT_ZOOM;
    }
    get HEIGHT() {
        return this.LAYOUT_HEIGHT / this.LAYOUT_ZOOM;
    }
    get VERBS_HEIGHT() {
        let marginY = (VERBS_ROWS + 1) * this.VERB_BUTTON_MARGIN;
        let heightY = VERBS_ROWS * this.VERB_BUTTON_HEIGHT;
        return marginY + heightY;
    }
    get VERB_BUTTON_HEIGHT() {
        return VERB_BUTTON_HEIGHT / this.LAYOUT_ZOOM;
    }
    get VERBS_Y_START() {
        return this.HEIGHT - this.VERBS_HEIGHT;
    }
    get CURRENT_ACTION_INFO_HEIGHT() {
        return CURRENT_ACTION_INFO_HEIGHT / this.LAYOUT_ZOOM;
    }
    get UI_START_POSITION() {
        return {
            x: 0,
            y: this.VERBS_Y_START - this.CURRENT_ACTION_INFO_HEIGHT
        };
    }
    get VERB_BUTTON_WIDTH() {
        return VERB_BUTTON_WIDTH / this.LAYOUT_ZOOM;
    }
    get REFLECT_BUTTON_WIDTH() {
        return REFLECT_BUTTON_WIDTH / this.LAYOUT_ZOOM;
    }
    get CURRENT_ACTION_POSITION() {
        return {
            x: CURRENT_ACTION_INFO_PADDING_X,
            y: this.HEIGHT - this.VERBS_HEIGHT - this.CURRENT_ACTION_INFO_HEIGHT + CURRENT_ACTION_INFO_PADDING_Y
        };
    }
    get INVENTORY_START_POSITION() {
        return this.getVerbButtonPosition({
            x: VERB_COLUMNS,
            y: 0
        });
    }
    get INV_ITEM_WIDTH() {
        return INV_ITEM_WIDTH / this.LAYOUT_ZOOM;
    }
    get INV_ITEM_HEIGHT() {
        return INV_ITEM_HEIGHT / this.LAYOUT_ZOOM;
    }
    getVerbButtonPosition(verbGridPosition) {
        let marginX = (verbGridPosition.x + 2) * this.VERB_BUTTON_MARGIN;
        let positionX = this.REFLECT_BUTTON_WIDTH + (verbGridPosition.x * this.VERB_BUTTON_WIDTH);
        let marginY = (verbGridPosition.y + 1) * this.VERB_BUTTON_MARGIN;
        let positionY = verbGridPosition.y * this.VERB_BUTTON_HEIGHT;
        return {
            x: marginX + positionX,
            y: this.VERBS_Y_START + marginY + positionY
        };
    }
    getPositionForUIInventoryItem(index) {
        let { column, row } = this.getInventoryItemPosition(index);
        let initialPosition = this.INVENTORY_START_POSITION;
        let marginX = (column + 1) * this.VERB_BUTTON_MARGIN;
        let positionX = column * this.INV_ITEM_WIDTH;
        let marginY = (row + 1) * this.VERB_BUTTON_MARGIN;
        let positionY = row * this.INV_ITEM_HEIGHT;
        return {
            x: marginX + positionX + initialPosition.x,
            y: marginY + positionY + initialPosition.y
        };
    }
    getReflectButtonPosition() {
        return {
            x: this.LAYOUT_DEFAULT_MARGIN,
            y: this.VERBS_Y_START + this.LAYOUT_DEFAULT_MARGIN
        };
    }
    getReflectButtonSize() {
        return {
            height: this.VERBS_HEIGHT,
            width: this.REFLECT_BUTTON_WIDTH
        };
    }
    get CONVERSATION_LINE_HEIGHT() {
        return CONVERSATION_LINE_HEIGHT / this.LAYOUT_ZOOM;
    }
    get CONVERSATION_LINE_PADDING_X() {
        return CONVERSATION_LINE_PADDING_X;
    }
    get CONVERSATION_LINE_PADDING_Y() {
        return CONVERSATION_LINE_PADDING_Y;
    }
    getPositionForConversationLine(index) {
        let marginY = (index + 1) * this.LAYOUT_DEFAULT_MARGIN;
        let positionY = this.CONVERSATION_LINE_HEIGHT * index;
        return {
            x: this.LAYOUT_DEFAULT_MARGIN,
            y: this.UI_START_POSITION.y + marginY + positionY
        };
    }
    getInventoryItemPosition(index) {
        let column = index % INV_COLUMNS;
        let row = Math.floor(index / INV_COLUMNS);
        return {
            column: column,
            row: row
        };
    }
}
exports.layout = new LayoutManager();

},{}],32:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const Labels_store_1 = require('../stores/Labels.store');
const TextWithShadow_1 = require('./TextWithShadow');
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
class ReflectButton {
    constructor() {
        this.position = LayoutManager_singleton_1.layout.getReflectButtonPosition();
        this.createButton();
        this.createText();
    }
    createButton() {
        let button = PhaserGame_singleton_1.phaserGame.value.add.button(this.position.x, this.position.y, 'BUTTON_BG', this.onClick, this, 1, 0, 2, 1);
        button.scale.y = 3;
        UILayers_singleton_1.uiLayers.verbButtons.add(button);
        button.fixedToCamera = true;
    }
    createText() {
        let position = {
            x: this.position.x + LayoutManager_singleton_1.layout.getReflectButtonSize().width / 2,
            y: this.position.y + LayoutManager_singleton_1.layout.getReflectButtonSize().height / 2
        };
        new TextWithShadow_1.TextWithShadow({
            initialText: Labels_store_1.label('Reflect'),
            position: position,
            fixedToCamera: true,
            layer: UILayers_singleton_1.uiLayers.verbButtons,
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });
    }
    onClick() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.REFLECT);
    }
}
exports.ReflectButton = ReflectButton;

},{"../state/PhaserGame.singleton":17,"../stores/Labels.store":22,"../utils/ActionDispatcher":40,"./LayoutManager.singleton":31,"./TextWithShadow":36,"./UILayers.singleton":38}],33:[function(require,module,exports){
"use strict";
const TextInScene_1 = require('./TextInScene');
class SpeechBubble {
    constructor(options) {
        this.options = options;
    }
    say(text) {
        //TODO handle animations
        this.destroyPrevText();
        this.textBeingSaid = new TextInScene_1.TextInScene({
            text: text,
            position: this.options.owner.getPositionOnTop(),
            autoDestroy: true
        });
        return this.textBeingSaid.promise;
    }
    destroyPrevText() {
        if (this.textBeingSaid) {
            this.textBeingSaid.destroy();
            this.textBeingSaid = null;
        }
    }
}
exports.SpeechBubble = SpeechBubble;

},{"./TextInScene":35}],34:[function(require,module,exports){
"use strict";
exports.style = Object.freeze({
    DEFAULT_FONT_SIZE: 8,
    FONT_SHADOW_X: 1,
    FONT_SHADOW_Y: 1,
    CAMERA_EASING_FACTOR: 0.025
});

},{}],35:[function(require,module,exports){
"use strict";
const Style_1 = require('./Style');
const TextWithShadow_1 = require('./TextWithShadow');
const UILayers_singleton_1 = require('./UILayers.singleton');
const Scenes_singleton_1 = require('../state/Scenes.singleton');
const DEFAULT_TEXT_OPTIONS = Object.freeze({
    timePerLetter: 50,
    minDestroyTime: 2000,
    text: '',
    position: { x: 100, y: 100 },
    width: 30,
    autoDestroy: false,
    anchor: { x: 0, y: 0 },
    paddingInScreen: 5
});
class TextInScene {
    constructor(options) {
        this.options = options;
        this.options = Object.assign({}, DEFAULT_TEXT_OPTIONS, this.options);
        this.createText();
        if (this.options.autoDestroy) {
            this.promiseToDestroy = this.autoDestroy();
        }
    }
    get promise() {
        return this.promiseToDestroy;
    }
    destroy() {
        if (this.currentText) {
            this.currentText.destroy();
            this.currentText = null;
        }
        if (this.resolveCallback) {
            this.resolveCallback();
            this.resolveCallback = null;
        }
    }
    createText() {
        let textInLines = this.addLinesSeparators(this.options.text, this.options.width);
        let positionX = this.getXPositionForText(textInLines);
        let positionY = this.getYPositionForText(textInLines);
        this.currentText = new TextWithShadow_1.TextWithShadow({
            position: {
                x: positionX,
                y: positionY
            },
            layer: UILayers_singleton_1.uiLayers.textInScene,
            initialText: textInLines,
            align: 'center',
            anchor: this.options.anchor
        });
    }
    addLinesSeparators(text, maxLineLength) {
        let words = text.split(' ');
        let lines = [''];
        let currentLine = 0;
        for (let i = 0; i < words.length; i++) {
            //If a word is too big for this line, add to next
            if ((lines[currentLine].length + words[i].length) >= maxLineLength) {
                lines.push('' + words[i]);
                currentLine++;
            }
            else {
                lines[currentLine] += ' ' + words[i];
            }
        }
        return lines.join('\n');
    }
    getXPositionForText(text) {
        let longestLineLength = this.getLongestLineLength(text);
        let maxWidth = longestLineLength * Style_1.style.DEFAULT_FONT_SIZE;
        let result = this.options.position.x - (maxWidth / 2);
        result = Math.max(result, this.options.paddingInScreen);
        result = Math.min(result, this.getMaxXForText(maxWidth));
        return result;
    }
    getMaxXForText(textWidth) {
        let sceneWidth = Scenes_singleton_1.scenes.currentScene.sceneBounds.width;
        return sceneWidth - this.options.paddingInScreen - textWidth;
    }
    getYPositionForText(text) {
        let lines = text.split('\n').length;
        let totalHeight = lines * Style_1.style.DEFAULT_FONT_SIZE;
        return this.options.position.y - totalHeight;
    }
    getLongestLineLength(text) {
        let lines = text.split('\n');
        let maxLength = 0;
        for (let i = 0; i < lines.length; i++) {
            maxLength = Math.max(maxLength, lines[i].length);
        }
        return maxLength;
    }
    autoDestroy() {
        let deferred = new Promise((resolveCallback) => {
            this.resolveCallback = resolveCallback;
        });
        let timeToDestroy = this.getTimeToDestroyFromText(this.options.text);
        this.timeoutToDestroy = setTimeout(() => this.destroy(), timeToDestroy);
        return deferred;
    }
    getTimeToDestroyFromText(text) {
        let timeToDestroy = this.options.timePerLetter * text.length;
        return Math.max(this.options.minDestroyTime, timeToDestroy);
    }
}
exports.TextInScene = TextInScene;

},{"../state/Scenes.singleton":18,"./Style":34,"./TextWithShadow":36,"./UILayers.singleton":38}],36:[function(require,module,exports){
"use strict";
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const Style_1 = require('./Style');
class TextWithShadow {
    constructor(options) {
        this.options = options;
        let anchor = this.options.anchor || {
            x: 0,
            y: 0
        };
        this.shadowText = PhaserGame_singleton_1.phaserGame.value.add.bitmapText(1 + options.position.x, 1 + options.position.y, 'FONT_32_BLACK', this.options.initialText || '', Style_1.style.DEFAULT_FONT_SIZE);
        this.shadowText.anchor.setTo(anchor.x, anchor.y);
        this.shadowText.fixedToCamera = !!this.options.fixedToCamera;
        if (this.options.align) {
            this.shadowText.align = this.options.align;
        }
        this.options.layer.add(this.shadowText);
        this.text = PhaserGame_singleton_1.phaserGame.value.add.bitmapText(options.position.x, options.position.y, 'FONT_32_WHITE', this.options.initialText || '', Style_1.style.DEFAULT_FONT_SIZE);
        this.text.anchor.setTo(anchor.x, anchor.y);
        this.text.fixedToCamera = !!this.options.fixedToCamera;
        if (this.options.align) {
            this.text.align = this.options.align;
        }
        this.options.layer.add(this.text);
    }
    setText(text) {
        this.shadowText.setText(text);
        this.text.setText(text);
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
    }
}
exports.TextWithShadow = TextWithShadow;

},{"../state/PhaserGame.singleton":17,"./Style":34}],37:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
class UIBlocker {
    block() {
        let graphicOverlay = new Phaser.Graphics(PhaserGame_singleton_1.phaserGame.value, 0, 0);
        graphicOverlay.beginFill(0x000000, 0.0);
        graphicOverlay.drawRect(0, 0, LayoutManager_singleton_1.layout.WIDTH, LayoutManager_singleton_1.layout.UI_START_POSITION.y);
        graphicOverlay.endFill();
        this.overlay = PhaserGame_singleton_1.phaserGame.value.add.image(0, 0, graphicOverlay.generateTexture());
        this.overlay.fixedToCamera = true;
        this.overlay.inputEnabled = true;
        UILayers_singleton_1.uiLayers.uiBlocker.add(this.overlay);
    }
    unblock() {
        this.overlay.destroy();
    }
}
exports.uiBlocker = new UIBlocker();

},{"../state/PhaserGame.singleton":17,"./LayoutManager.singleton":31,"./UILayers.singleton":38}],38:[function(require,module,exports){
"use strict";
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
var UILayers;
(function (UILayers) {
    UILayers[UILayers["BACKGROUND"] = 0] = "BACKGROUND";
    UILayers[UILayers["BACKGROUND_OBJECTS"] = 1] = "BACKGROUND_OBJECTS";
    UILayers[UILayers["PLAYER"] = 2] = "PLAYER";
    UILayers[UILayers["FOREGROUND_OBJECTS"] = 3] = "FOREGROUND_OBJECTS";
    UILayers[UILayers["FOREGROUND"] = 4] = "FOREGROUND";
    UILayers[UILayers["TEXT_IN_SCENE"] = 5] = "TEXT_IN_SCENE";
    UILayers[UILayers["GUI_BACKGROUND"] = 6] = "GUI_BACKGROUND";
    UILayers[UILayers["VERB_BUTTONS"] = 7] = "VERB_BUTTONS";
    UILayers[UILayers["CONVERSATION"] = 8] = "CONVERSATION";
    UILayers[UILayers["UI_BLOCKER"] = 9] = "UI_BLOCKER";
})(UILayers || (UILayers = {}));
class UILayersManager {
    constructor() {
        this.initialised = false;
    }
    init() {
        if (!this.initialised) {
            if (!PhaserGame_singleton_1.phaserGame.value) {
                throw 'ERROR: initing UILayers when game is still not there';
            }
            this.createLayers(PhaserGame_singleton_1.phaserGame.value);
            this.initialised = true;
        }
    }
    get background() {
        this.init();
        return this.groups.get(UILayers.BACKGROUND);
    }
    get backgroundObjects() {
        this.init();
        return this.groups.get(UILayers.BACKGROUND_OBJECTS);
    }
    get player() {
        this.init();
        return this.groups.get(UILayers.PLAYER);
    }
    get foregroundObjects() {
        this.init();
        return this.groups.get(UILayers.FOREGROUND_OBJECTS);
    }
    get foreground() {
        this.init();
        return this.groups.get(UILayers.FOREGROUND);
    }
    get textInScene() {
        this.init();
        return this.groups.get(UILayers.TEXT_IN_SCENE);
    }
    get guiBackground() {
        this.init();
        return this.groups.get(UILayers.GUI_BACKGROUND);
    }
    get verbButtons() {
        this.init();
        return this.groups.get(UILayers.VERB_BUTTONS);
    }
    get conversation() {
        this.init();
        return this.groups.get(UILayers.CONVERSATION);
    }
    get uiBlocker() {
        this.init();
        return this.groups.get(UILayers.UI_BLOCKER);
    }
    createLayers(game) {
        this.groups = new Map();
        //TODO: do this with a loop
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
    }
}
exports.uiLayers = new UILayersManager();

},{"../state/PhaserGame.singleton":17}],39:[function(require,module,exports){
"use strict";
const Verbs_store_1 = require('../stores/Verbs.store');
const ActionButton_1 = require('./ActionButton');
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
class VerbsUI {
    constructor() {
        this.createButtons();
        this.listenToEvents();
    }
    createButtons() {
        this.buttons = new Map();
        this.buttons.set(Verbs_store_1.Verbs.GO_TO, new ActionButton_1.ActionButton(Verbs_store_1.Verbs.GO_TO, { x: 0, y: 0 }));
        this.buttons.set(Verbs_store_1.Verbs.LOOK, new ActionButton_1.ActionButton(Verbs_store_1.Verbs.LOOK, { x: 0, y: 1 }));
        this.buttons.set(Verbs_store_1.Verbs.GIVE, new ActionButton_1.ActionButton(Verbs_store_1.Verbs.GIVE, { x: 0, y: 2 }));
        this.buttons.set(Verbs_store_1.Verbs.PUSH, new ActionButton_1.ActionButton(Verbs_store_1.Verbs.PUSH, { x: 1, y: 0 }));
        this.buttons.set(Verbs_store_1.Verbs.TAKE, new ActionButton_1.ActionButton(Verbs_store_1.Verbs.TAKE, { x: 1, y: 1 }));
        this.buttons.set(Verbs_store_1.Verbs.USE, new ActionButton_1.ActionButton(Verbs_store_1.Verbs.USE, { x: 1, y: 2 }));
        this.buttons.set(Verbs_store_1.Verbs.SPEAK, new ActionButton_1.ActionButton(Verbs_store_1.Verbs.SPEAK, { x: 2, y: 0 }));
        this.buttons.set(Verbs_store_1.Verbs.OPEN, new ActionButton_1.ActionButton(Verbs_store_1.Verbs.OPEN, { x: 2, y: 1 }));
        this.buttons.set(Verbs_store_1.Verbs.CLOSE, new ActionButton_1.ActionButton(Verbs_store_1.Verbs.CLOSE, { x: 2, y: 2 }));
    }
    listenToEvents() {
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.CURSOR_OVER_THING, (thing) => this.highlightSecondaryActionForThing(thing));
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.CURSOR_OUT_THING, () => this.removePreviouslyHighlightedAction());
    }
    highlightSecondaryActionForThing(thing) {
        this.removePreviouslyHighlightedAction();
        this.highlightedAction = thing.getPreferredAction();
        if (this.highlightedAction) {
            this.buttons.get(this.highlightedAction).highlight();
        }
    }
    removePreviouslyHighlightedAction() {
        if (this.highlightedAction) {
            this.buttons.get(this.highlightedAction).unhighlight();
            this.highlightedAction = null;
        }
    }
}
exports.VerbsUI = VerbsUI;

},{"../stores/Verbs.store":23,"../utils/ActionDispatcher":40,"./ActionButton":24}],40:[function(require,module,exports){
"use strict";
const Observable_1 = require('./Observable');
(function (Actions) {
    Actions[Actions["CLICK_STAGE"] = 0] = "CLICK_STAGE";
    Actions[Actions["SELECT_VERB"] = 1] = "SELECT_VERB";
    Actions[Actions["SELECT_THING"] = 2] = "SELECT_THING";
    Actions[Actions["CURSOR_OVER_THING"] = 3] = "CURSOR_OVER_THING";
    Actions[Actions["CURSOR_OUT_THING"] = 4] = "CURSOR_OUT_THING";
    Actions[Actions["ACTION_APPLIED"] = 5] = "ACTION_APPLIED";
    Actions[Actions["TAKE_OBJECT"] = 6] = "TAKE_OBJECT";
    Actions[Actions["UPDATE_INVENTORY"] = 7] = "UPDATE_INVENTORY";
    Actions[Actions["GO_TO_SCENE"] = 8] = "GO_TO_SCENE";
    Actions[Actions["REFLECT"] = 9] = "REFLECT";
})(exports.Actions || (exports.Actions = {}));
var Actions = exports.Actions;
class ActionDispatcher {
    constructor() {
        this.observersPerAction = new Map();
    }
    execute(action, param = {}) {
        let actionObservable = this.observersPerAction.get(action);
        if (actionObservable) {
            actionObservable.notifyObservers(param);
        }
    }
    subscribeTo(action, callback) {
        let actionObservable = this.observersPerAction.get(action);
        if (!actionObservable) {
            actionObservable = new Observable_1.Observable();
            this.observersPerAction.set(action, actionObservable);
        }
        actionObservable.registerObserver(callback);
    }
}
exports.actionDispatcher = new ActionDispatcher();

},{"./Observable":42}],41:[function(require,module,exports){
"use strict";
(function (Directions) {
    Directions[Directions["UP"] = 0] = "UP";
    Directions[Directions["DOWN"] = 1] = "DOWN";
    Directions[Directions["LEFT"] = 2] = "LEFT";
    Directions[Directions["RIGHT"] = 3] = "RIGHT";
})(exports.Directions || (exports.Directions = {}));
var Directions = exports.Directions;
;
exports.getDirectionName = function (direction) {
    switch (direction) {
        case Directions.UP:
            return 'up';
        case Directions.DOWN:
            return 'down';
        case Directions.LEFT:
            return 'left';
        case Directions.RIGHT:
            return 'right';
        default:
            throw 'ERROR: getting direction name of unexisting direction';
    }
};

},{}],42:[function(require,module,exports){
"use strict";
/// <reference path="../../../../my-typings/lib.es6.d.ts" />
class Observable {
    constructor() {
        this.observers = new Set();
    }
    registerObserver(callback) {
        this.observers.add(callback);
    }
    removeObserver(callback) {
        this.observers.delete(callback);
    }
    notifyObservers(value) {
        this.observers.forEach((observer) => {
            observer(value);
        });
    }
}
exports.Observable = Observable;

},{}],43:[function(require,module,exports){
/// <reference path="../../../../my-typings/lib.es6.d.ts" />
"use strict";
class RandomText {
    constructor(phrases) {
        this.originalPhrases = phrases;
        this.createSet();
    }
    createSet() {
        this.phrases = this.originalPhrases.slice();
    }
    getRandomText() {
        let result;
        if (this.phrases.length === 1) {
            result = this.phrases[0];
            this.lastText = result;
            this.createSet();
        }
        else {
            let randomIndex = Math.floor(this.phrases.length * Math.random());
            if (this.phrases[randomIndex] === this.lastText) {
                randomIndex = (randomIndex + 1) % this.phrases.length;
            }
            result = this.phrases[randomIndex];
            this.phrases.splice(randomIndex, 1);
            this.lastText = result;
        }
        return result;
    }
}
class RandomTextFactory {
    constructor() {
        this.generators = new Map();
    }
    getRandomText(...phrases) {
        let phrasesId = this.getIdFromPhrases(phrases);
        let generator = this.generators.get(phrasesId);
        if (!generator) {
            generator = new RandomText(phrases);
            this.generators.set(phrasesId, generator);
        }
        return generator.getRandomText();
    }
    getIdFromPhrases(phrases = []) {
        let id = phrases.join('#');
        if (id === '') {
            id = '#';
        }
        return id;
    }
}
const textFactory = new RandomTextFactory();
exports.randomText = (...phrases) => {
    return textFactory.getRandomText(...phrases);
};

},{}],44:[function(require,module,exports){
"use strict";
;
;
;
const SPRITES = {
    // UI
    'BUTTON_BG': ['images/ui/BUTTON_BG_SPRITE.png', 75, 18, 3],
    'CONVERSATION_LINE_BG': ['images/ui/CONVERSATION_LINE_BG.png', 529, 20],
    // PLAYER
    'DOCTORTILLA_PLAYER_SPRITE': ['images/player/DOCTORTILLA_PLAYER_SPRITE.png', 44, 61, 21],
    // BACKSTAGE
    'DOOR_SPRITE': ['images/backstage/DOOR_SPRITE.png', 40, 60, 2],
    'VENDING_SPRITE': ['images/backstage/VENDING_SPRITE.png', 33, 57, 3],
    'BAND_IN_SOFA_SPRITE': ['images/backstage/BAND_IN_SOFA_SPRITE.png', 111, 79, 9],
    'CABLE_SPRITE': ['images/backstage/CABLE_SPRITE.png', 18, 13, 1],
    'GLASS_SPRITE': ['images/backstage/GLASS_SPRITE.png', 9, 9, 4],
    'COSTUME_SPRITE': ['images/backstage/COSTUME_SPRITE.png', 40, 28, 4],
};
const IMAGES = {
    // UI
    'UI_BG': 'images/ui/UI_BG.png',
    'UI_INV_BG': 'images/ui/UI_INV_BG.png',
    'UI_CONVERSATION_BG': 'images/ui/UI_CONVERSATION_BG.png',
    'CONVERSATION_LINE_BG': 'images/ui/CONVERSATION_LINE_BG.png',
    // Backstage scene:
    'BACKSTAGE_BG': 'images/backstage/BACKSTAGE_BG.png',
    'SKIRT': 'images/backstage/SKIRT.png',
    'BROOM': 'images/backstage/BROOM.png',
    'BROOM_INV': 'images/backstage/BROOM_INV.png',
    'BACKYARD_BG': 'images/backyard/BACKYARD_BG.png',
    'CAN_INV': 'images/backstage/CAN_INV.png',
    'COIN_INV': 'images/backstage/COIN_INV.png',
    'SCISSORS': 'images/backstage/SCISSORS.png',
    'BOCADILLO': 'images/backstage/BOCADILLO.png',
    'BREAD': 'images/backstage/BREAD.png',
    'BACON': 'images/backstage/BACON.png',
    'COCONUT': 'images/backstage/COCONUT.png',
    'DUST': 'images/backstage/DUST.png',
    'TABLE': 'images/backstage/TABLE.png',
    // Backyard:
    'FLOWERS': 'images/backyard/FLOWERS.png',
    'BILI': 'images/backyard/BILI.png'
};
const FONTS = {
    'FONT_32_BLACK': ['images/fonts/font_32_black.png', 'images/fonts/font_32_black.fnt'],
    'FONT_32_WHITE': ['images/fonts/font_32_white.png', 'images/fonts/font_32_white.fnt'],
    'FONT_32_ORANGE': ['images/fonts/font_32_orange.png', 'images/fonts/font_32_orange.fnt']
};
class AssetsManager {
    loadAssets(game) {
        this.loadImages(game);
        this.loadSprites(game);
        this.loadFonts(game);
    }
    loadImages(game) {
        for (let imageKey in IMAGES) {
            game.load.image(imageKey, IMAGES[imageKey]);
        }
    }
    loadSprites(game) {
        for (let spriteKey in SPRITES) {
            game.load.spritesheet(spriteKey, SPRITES[spriteKey][0], SPRITES[spriteKey][1], SPRITES[spriteKey][2], SPRITES[spriteKey][3]);
        }
    }
    loadFonts(game) {
        for (let fontKey in FONTS) {
            game.load.bitmapFont(fontKey, FONTS[fontKey][0], FONTS[fontKey][1]);
        }
    }
}
exports.assetsManager = new AssetsManager();

},{}],45:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
class Coin extends Thing_1.Thing {
    constructor() {
        let options = {
            id: 'coin',
            inventoryImageId: 'COIN_INV',
            name: 'coin',
            directlyInInventory: true
        };
        super(options);
    }
}
exports.Coin = Coin;

},{"../../engine/models/Thing":15}],46:[function(require,module,exports){
"use strict";
const Game_1 = require('../engine/models/Game');
const DoctortillaLabels_1 = require('./DoctortillaLabels');
const DoctortillaPlayer_1 = require('./DoctortillaPlayer');
const BackstageScene_1 = require('./backstageScene/BackstageScene');
const BackyardScene_1 = require('./backyardScene/BackyardScene');
class DoctortillaGame extends Game_1.Game {
    constructor() {
        let options = {
            labels: DoctortillaLabels_1.DOCTORTILLA_LABELS,
            player: new DoctortillaPlayer_1.DoctortillaPlayer(),
            scenes: [
                new BackstageScene_1.BackstageScene(),
                new BackyardScene_1.BackyardScene()
            ],
            initialSceneId: 'BACKSTAGE'
        };
        super(options);
    }
}
exports.DoctortillaGame = DoctortillaGame;

},{"../engine/models/Game":8,"./DoctortillaLabels":47,"./DoctortillaPlayer":48,"./backstageScene/BackstageScene":50,"./backyardScene/BackyardScene":68}],47:[function(require,module,exports){
"use strict";
exports.DOCTORTILLA_LABELS = {
    'es': {},
    'en': {}
};

},{}],48:[function(require,module,exports){
"use strict";
const Player_1 = require('../engine/models/Player');
const RandomText_1 = require('../engine/utils/RandomText');
const Coin_1 = require('./BackstageScene/Coin');
const ActiveInventory_singleton_1 = require('../engine/state/ActiveInventory.singleton');
let spriteOptions = new Map();
spriteOptions.set('stand_right', { frames: [0] });
spriteOptions.set('walk_right', { frames: [1, 2, 3, 4, 5, 6] });
spriteOptions.set('stand_left', { frames: [0], inverse: true });
spriteOptions.set('walk_left', { frames: [1, 2, 3, 4, 5, 6], inverse: true });
spriteOptions.set('stand_up', { frames: [14] });
spriteOptions.set('walk_up', { frames: [15, 16, 17, 18, 19, 20] });
spriteOptions.set('stand_down', { frames: [7] });
spriteOptions.set('walk_down', { frames: [8, 9, 10, 11, 12, 13] });
const options = {
    spriteId: 'DOCTORTILLA_PLAYER_SPRITE',
    initialX: 200,
    initialY: 200,
    xSpeed: 80,
    ySpeed: 55,
    animationSpeed: 6,
    spriteOptions: spriteOptions
};
class DoctortillaPlayer extends Player_1.Player {
    constructor() {
        super(options);
        this.inventory.add(new Coin_1.Coin());
    }
    reflect() {
        this.say(RandomText_1.randomText('Now I should say something smart that helps', 'This is a pretty nice room', 'Man, I really want to play that concert', 'Probably I should find the rest of the band...'));
    }
    hasCompleteCostume() {
        let inventory = ActiveInventory_singleton_1.activeInventory.getActiveInventory();
        let costume = inventory.getById('costume');
        return costume && costume.isComplete();
    }
    hasCable() {
        let inventory = ActiveInventory_singleton_1.activeInventory.getActiveInventory();
        let cable = inventory.getById('cable');
        return !!cable;
    }
    hasFunnyDrink() {
        let inventory = ActiveInventory_singleton_1.activeInventory.getActiveInventory();
        let glass = inventory.getById('glass');
        return glass && glass.isFunny();
    }
    removeCostume() {
        let inventory = ActiveInventory_singleton_1.activeInventory.getActiveInventory();
        let costume = inventory.getById('costume');
        inventory.remove(costume);
    }
    removeCable() {
        let inventory = ActiveInventory_singleton_1.activeInventory.getActiveInventory();
        let cable = inventory.getById('cable');
        inventory.remove(cable);
    }
    removeGlass() {
        let inventory = ActiveInventory_singleton_1.activeInventory.getActiveInventory();
        let glass = inventory.getById('glass');
        inventory.remove(glass);
    }
    deliveredEverything() {
        return this.getAttr('DELIVERED_CABLE') && this.getAttr('DELIVERED_COSTUME') && this.getAttr('DELIVERED_DRINK');
    }
}
exports.DoctortillaPlayer = DoctortillaPlayer;

},{"../engine/models/Player":12,"../engine/state/ActiveInventory.singleton":16,"../engine/utils/RandomText":43,"./BackstageScene/Coin":45}],49:[function(require,module,exports){
"use strict";
const Door_1 = require('../../engine/models/Door');
class BackstageDoorToBackyard extends Door_1.Door {
    constructor() {
        let options = {
            id: 'BACKSTAGE_TO_BACKYARD',
            name: 'door to backyard',
            x: 150,
            y: 95,
            spriteId: 'DOOR_SPRITE',
            goToPosition: {
                x: 175,
                y: 165
            },
            destinationSceneId: 'BACKYARD',
            relatedDoorId: 'BACKYARD_TO_BACKSTAGE'
        };
        super(options);
    }
    get name() {
        if (this.getAttr('OPEN')) {
            return 'street';
        }
        else {
            return 'door to street';
        }
    }
}
exports.BackstageDoorToBackyard = BackstageDoorToBackyard;

},{"../../engine/models/Door":7}],50:[function(require,module,exports){
"use strict";
const Scene_1 = require('../../engine/models/Scene');
const Broom_1 = require('./Broom');
const VendingMachine_1 = require('./VendingMachine');
const BackstageDoorToBackyard_1 = require('./BackstageDoorToBackyard');
const BandInSofa_1 = require('./BandInSofa');
const Scissors_1 = require('./Scissors');
const Bocadillo_1 = require('./Bocadillo');
const Cable_1 = require('./Cable');
const Coconut_1 = require('./Coconut');
const Table_1 = require('./Table');
const DustInTable_1 = require('./DustInTable');
const Glass_1 = require('./Glass');
const sceneOptions = {
    id: 'BACKSTAGE',
    backgroundId: 'BACKSTAGE_BG',
    boundariesConfig: {
        minY: 310 / 2,
        maxY: 450 / 2,
        minX: 180 / 2,
        maxX: 1200 / 2
    },
    things: [
        new Broom_1.Broom(),
        new BackstageDoorToBackyard_1.BackstageDoorToBackyard(),
        new Cable_1.Cable(),
        new VendingMachine_1.VendingMachine(),
        new BandInSofa_1.BandInSofa(),
        new Scissors_1.Scissors(),
        new Bocadillo_1.Bocadillo(),
        new Table_1.Table(),
        new Glass_1.Glass(),
        new DustInTable_1.Dust(),
        new Coconut_1.Coconut()
    ]
};
class BackstageScene extends Scene_1.Scene {
    constructor() {
        super(sceneOptions);
    }
}
exports.BackstageScene = BackstageScene;

},{"../../engine/models/Scene":13,"./BackstageDoorToBackyard":49,"./BandInSofa":52,"./Bocadillo":53,"./Broom":55,"./Cable":56,"./Coconut":58,"./DustInTable":61,"./Glass":62,"./Scissors":63,"./Table":65,"./VendingMachine":66}],51:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const options = {
    id: 'bacon',
    spriteId: 'BACON',
    inventoryImageId: 'BACON',
    name: 'bacon',
    directlyInInventory: true
};
class Bacon extends Thing_1.Thing {
    constructor() {
        super(options);
    }
}
exports.Bacon = Bacon;

},{"../../engine/models/Thing":15}],52:[function(require,module,exports){
"use strict";
// var ConversationWithBand = require('./ConversationWithBand.js');
const SpeechBubble_1 = require('../../engine/ui/SpeechBubble');
const Thing_1 = require('../../engine/models/Thing');
const ConversationWithBand_1 = require('./ConversationWithBand');
class BandInSofa extends Thing_1.Thing {
    constructor() {
        let options = {
            id: 'bandInSofa',
            x: 434,
            y: 116,
            spriteId: 'BAND_IN_SOFA_SPRITE',
            name: 'rest of the band',
            goToPosition: {
                x: 410,
                y: 186
            }
        };
        super(options);
        this.speechBubble = new SpeechBubble_1.SpeechBubble({
            owner: this
        });
    }
    lookAction(player) {
        player.say('There is my band.');
    }
    speakAction(player) {
        player.goToThing(this).then(() => new ConversationWithBand_1.ConversationWithBand(player, this));
    }
    say(text) {
        return this.speechBubble.say(text);
    }
}
exports.BandInSofa = BandInSofa;

},{"../../engine/models/Thing":15,"../../engine/ui/SpeechBubble":33,"./ConversationWithBand":59}],53:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Bread_1 = require('./Bread');
const Bacon_1 = require('./Bacon');
const options = {
    id: 'bocadillo',
    x: 354,
    y: 151,
    spriteId: 'BOCADILLO',
    inventoryImageId: 'BOCADILLO',
    name: 'bocadillo',
    goToPosition: {
        x: 334,
        y: 181
    },
    pickable: true
};
class Bocadillo extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('I think I can open it and take the bacon');
        }
        else {
            player.say('A rancid and GREASY sandwhich');
        }
    }
    openAction(player) {
        if (this.isInInventory()) {
            new Bacon_1.Bacon();
            new Bread_1.Bread();
            this.destroy();
        }
        else {
            player.say('I have to pick it up first');
        }
    }
}
exports.Bocadillo = Bocadillo;

},{"../../engine/models/Thing":15,"./Bacon":51,"./Bread":54}],54:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const options = {
    id: 'bread',
    spriteId: 'BREAD',
    inventoryImageId: 'BREAD',
    name: 'bread',
    directlyInInventory: true
};
class Bread extends Thing_1.Thing {
    constructor() {
        super(options);
    }
}
exports.Bread = Bread;

},{"../../engine/models/Thing":15}],55:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const Skirt_1 = require('./Skirt');
const options = {
    id: 'broom',
    x: 254,
    y: 101,
    spriteId: 'BROOM',
    inventoryImageId: 'BROOM_INV',
    name: 'broom',
    goToPosition: {
        x: 250,
        y: 175
    },
    pickable: true
};
class Broom extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('Awesome, now I have a broom');
        }
        else {
            player.say('Si yo tuviera una escoba...');
        }
    }
    useAction(player) {
        if (SelectedObjects_1.selectedThing.thing.id === 'scissors') {
            this.cutWithScissors();
        }
        else {
            player.say('I don\'t know how to do that');
        }
    }
    cutWithScissors() {
        new Skirt_1.Skirt();
        this.destroy();
    }
}
exports.Broom = Broom;

},{"../../engine/models/Thing":15,"../../engine/state/SelectedObjects":19,"./Skirt":64}],56:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Scenes_singleton_1 = require('../../engine/state/Scenes.singleton');
const options = {
    id: 'cable',
    x: 42,
    y: 165,
    spriteId: 'CABLE_SPRITE',
    inventoryImageId: 'CABLE_SPRITE',
    name: 'cable',
    goToPosition: {
        x: 72,
        y: 205
    },
    pickable: true
};
class Cable extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    takeAction(player) {
        player.goToThing(this).then(() => {
            let vendingMachine = Scenes_singleton_1.scenes.currentScene.getThingById('vending');
            if (!vendingMachine) {
                throw 'ERROR: vending machine should be present in current scene';
            }
            if (vendingMachine.getAttr('PUSHED')) {
                player.say('Finally, I have the $%# cable!');
                this.letPlayerComeAndTakeIt(player);
            }
            else {
                player.say('It is stuck behind the vending machine, I need to move it somehow.');
            }
        });
    }
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('Cool, now I should give that to the guys');
        }
        else {
            player.say('This is the cable I need!');
        }
    }
}
exports.Cable = Cable;

},{"../../engine/models/Thing":15,"../../engine/state/Scenes.singleton":18}],57:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
class Can extends Thing_1.Thing {
    constructor() {
        let options = {
            id: 'can',
            inventoryImageId: 'CAN_INV',
            name: 'can',
            directlyInInventory: true
        };
        super(options);
    }
    useAction(player) {
        if (SelectedObjects_1.selectedThing.thing.id === 'glass') {
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'dust') {
            player.say('I should probably mix it in a glass');
        }
        else {
            player.say('I don\t know how to do that...');
        }
    }
}
exports.Can = Can;

},{"../../engine/models/Thing":15,"../../engine/state/SelectedObjects":19}],58:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const Costume_1 = require('../backstageScene/Costume');
const options = {
    id: 'coconut',
    x: 120,
    y: 130,
    spriteId: 'COCONUT',
    inventoryImageId: 'COCONUT',
    name: 'coconut',
    goToPosition: {
        x: 150,
        y: 180
    },
    pickable: true
};
class Coconut extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    createCostumeFromSkirt(player, skirt) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        let costume = new Costume_1.Costume();
        costume.addSkirt(skirt);
        costume.addCoconut(this);
    }
    addCoconutToCostume(player, costume) {
        costume.addCoconut(this);
    }
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('Does it look like a pair of tits?');
        }
        else {
            player.say('Compare cómprame un coco');
        }
    }
    useAction(player) {
        if (SelectedObjects_1.selectedThing.thing.id === 'flowers') {
            let flowers = SelectedObjects_1.selectedThing.thing;
            flowers.createCostumeFromCoconut(player, this);
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'skirt') {
            this.createCostumeFromSkirt(player, SelectedObjects_1.selectedThing.thing);
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'costume') {
            this.addCoconutToCostume(player, SelectedObjects_1.selectedThing.thing);
        }
        else {
            player.say('I don\'t know how to do that');
        }
    }
}
exports.Coconut = Coconut;

},{"../../engine/models/Thing":15,"../../engine/state/SelectedObjects":19,"../backstageScene/Costume":60}],59:[function(require,module,exports){
"use strict";
const Conversation_1 = require('../../engine/models/Conversation');
const ConversationLine_1 = require('../../engine/models/ConversationLine');
const script = {
    'initial': [
        new ConversationLine_1.ConversationLine('¡Doctortillas! ¿Listos para tocar?', 'LIST_OF_PROBLEMS', sayProblemsIntro),
        //TODO line like above but aggressive
        new ConversationLine_1.ConversationLine('¿Habéis visto a Bili?', 'initial', sayBiliSituation),
        new ConversationLine_1.ConversationLine('¡Hasta luego!', 'end')
    ],
    'LIST_OF_PROBLEMS': [
        new ConversationLine_1.ConversationLine('¿Impedimentos? Contadme más, queridos amiguitos.', 'INITIAL_AFTER_FIRST_TALK', sayListOfProblems),
        new ConversationLine_1.ConversationLine('¿Problemas? ¿Impedimentos? No contéis conmigo...', 'INITIAL_AFTER_FIRST_TALK', sayListOfProblems)
    ],
    'INITIAL_AFTER_FIRST_TALK': [
        new ConversationLine_1.ConversationLine('¿Cómo está Bili?', 'INITIAL_AFTER_FIRST_TALK', sayBiliSituation),
        new ConversationLine_1.ConversationLine('Mmmm, voy a ver si arreglamos este follón', 'end')
    ],
    'WE_ARE_READY': [
        new ConversationLine_1.ConversationLine('¡Todo listo! Voy a por Bili y empezamos', 'end')
    ]
};
class ConversationWithBand extends Conversation_1.Conversation {
    constructor(player, otherPerson) {
        super(player, otherPerson);
        this.player = player;
        this.otherPerson = otherPerson;
    }
    initState() {
        if (this.player.getAttr('TALKED_TO_BAND_ABOUT_PROBLEMS')) {
            this.state = this.getStateIfPlayerDeliveredEverything();
        }
        else {
            this.state = 'initial';
        }
    }
    loadScript() {
        this.script = script;
        let dialogPart = [];
        dialogPart.push(...this.script['INITIAL_AFTER_FIRST_TALK']);
        this.loadExtraOptionsInInitialFirstTalk(dialogPart);
        this.script['INITIAL_AFTER_FIRST_TALK'] = dialogPart;
    }
    loadExtraOptionsInInitialFirstTalk(dialogPart) {
        this.addCostumeLine(dialogPart);
        this.addCableLine(dialogPart);
        this.addDrinkLine(dialogPart);
    }
    addCostumeLine(dialogPart) {
        if (this.player.hasCompleteCostume()) {
            dialogPart.unshift(new ConversationLine_1.ConversationLine('Tengo el disfraz', () => { return this.getStateIfPlayerDeliveredEverything(); }, sayCostumeIsOk));
        }
    }
    addCableLine(dialogPart) {
        if (this.player.hasCable()) {
            dialogPart.unshift(new ConversationLine_1.ConversationLine('Tengo el cable', () => { return this.getStateIfPlayerDeliveredEverything(); }, sayCableIsOk));
        }
    }
    addDrinkLine(dialogPart) {
        if (this.player.hasFunnyDrink()) {
            dialogPart.unshift(new ConversationLine_1.ConversationLine('Santi te he traido un refrigerio', () => { return this.getStateIfPlayerDeliveredEverything(); }, sayDrinkIsOk));
        }
    }
    getStateIfPlayerDeliveredEverything() {
        if (this.player.deliveredEverything()) {
            return 'WE_ARE_READY';
        }
        else {
            return 'INITIAL_AFTER_FIRST_TALK';
        }
    }
}
exports.ConversationWithBand = ConversationWithBand;
function sayProblemsIntro(player, band) {
    return band.say('ANGEL: No es por alarmar pero está habiendo algunos contratiempos...')
        .then(() => {
        return band.say('SANTI: ...minucias sin importancia...');
    })
        .then(() => {
        return band.say('JUAN: ...impedimentos BRUTALES.');
    });
}
function sayListOfProblems(player, band) {
    player.changeAttr('TALKED_TO_BAND_ABOUT_PROBLEMS', true);
    return band.say('ANGEL: Resulta que aquí el amigo Juan se ha olvidado su disfraz...')
        .then(() => {
        return band.say('JUAN: Un disfraz BRUTAL, de cowboy vintage, siglo XIV, con espuelas de...');
    })
        .then(() => {
        return band.say('ANGEL: Sí, sí... pero lo ha dejado en el local de ensayo, así que hay que buscarle otro.');
    })
        .then(() => {
        return band.say('JUAN: Y tu te has olvidado el cable de corriente, así que si quieres que se oiga algo...');
    })
        .then(() => {
        return band.say('ANGEL: Me tendrás que conseguir uno.');
    })
        .then(() => {
        return band.say('ANGEL: Y luego está el problema con Santi.');
    })
        .then(() => {
        return band.say('JUAN: El pobre está tímido y no se atrever a salir.');
    })
        .then(() => {
        return band.say('ANGEL: Dice que no ensayamos nunca y se siente inseguro.');
    })
        .then(() => {
        return band.say('JUAN: Ya sabes cómo son los zurdos con estas cosas...');
    });
}
function sayBiliSituation(player, band) {
    return band.say('ANGEL: Está fuera fumando, pero como lo dejemos mucho tiempo se va a poner como las grecas.');
}
function sayCostumeIsOk(player, band) {
    return band.say('JUAN: Vaya disfraz ridículo.')
        .then(() => {
        return band.say('JUAN: El mío era mejor');
    })
        .then(() => {
        return player.say('Te lo pones, o te lo pongo.');
    })
        .then(() => {
        band.changeAttr('HAS_COSTUME', true);
        player.changeAttr('DELIVERED_COSTUME', true);
        player.removeCostume();
        return player.say('JUAN: Me lo pongo.');
    });
}
function sayCableIsOk(player, band) {
    return band.say('ANGEL: No voy a preguntar de dónde lo has sacado...')
        .then(() => {
        return band.say('SANTI: Lo has robado, ¿verdad?');
    })
        .then(() => {
        band.changeAttr('HAS_CABLE', true);
        player.changeAttr('DELIVERED_CABLE', true);
        player.removeCable();
        return player.say('Digamos que tengo recursos.');
    });
}
function sayDrinkIsOk(player, band) {
    return band.say('SANTI: Mmm un refrescante refresco...')
        .then(() => {
        return band.say('SANTI: Glu glu glu');
    })
        .then(() => {
        return band.say('SANTI: ...');
    })
        .then(() => {
        return band.say('SANTI: (eructo)');
    })
        .then(() => {
        return band.say('SANTI: No sabía a droga ni nada');
    })
        .then(() => {
        return band.say('SANTI: Estoy empezando a sentirme listo para tocar');
    })
        .then(() => {
        band.changeAttr('HAS_DRINK', true);
        player.changeAttr('DELIVERED_DRINK', true);
        player.removeGlass();
        return player.say('Así me gusta.');
    });
}

},{"../../engine/models/Conversation":5,"../../engine/models/ConversationLine":6}],60:[function(require,module,exports){

},{}],61:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const options = {
    id: 'dust',
    x: 102,
    y: 135,
    spriteId: 'DUST',
    inventoryImageId: 'DUST',
    name: 'dust',
    goToPosition: {
        x: 132,
        y: 185
    },
    pickable: true
};
class Dust extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('I bet this "dust" can make "somebody" less shy');
        }
        else {
            player.say('That\'s some highly suspicious white powder');
        }
    }
    useAction(player) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        if (SelectedObjects_1.selectedThing.thing.id === 'glass') {
            let glass = SelectedObjects_1.selectedThing.thing;
            glass.fillWithDust(player, this);
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'can') {
            player.say('I should probably mix it in a glass');
        }
        else {
            player.say('I don\t know how to do that...');
        }
    }
}
exports.Dust = Dust;

},{"../../engine/models/Thing":15,"../../engine/state/SelectedObjects":19}],62:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const ActiveInventory_singleton_1 = require('../../engine/state/ActiveInventory.singleton');
const NORMAL_FRAME = 0;
const POWDER_FRAME = 1;
const FILLED_FRAME = 2;
const POWDER_FILLED_FRAME = 3;
const options = {
    id: 'glass',
    x: 137,
    y: 130,
    spriteId: 'GLASS_SPRITE',
    inventoryImageId: 'GLASS_SPRITE',
    name: 'glass',
    goToPosition: {
        x: 167,
        y: 180
    },
    pickable: true
};
class Glass extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    useAction(player) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        if (SelectedObjects_1.selectedThing.thing.id === 'dust') {
            let dust = SelectedObjects_1.selectedThing.thing;
            this.fillWithDust(player, dust);
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'can') {
            let can = SelectedObjects_1.selectedThing.thing;
            this.fillWithDrink(player, can);
        }
        else {
            player.say('I don\t know how to do that...');
        }
    }
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('Really useful to put liquids or other substances inside');
        }
        else {
            player.say('It is indeed a glass');
        }
    }
    fillWithDust(player, dust) {
        this.changeAttr('POWDER_INSIDE', true);
        dust.destroy();
    }
    fillWithDrink(player, can) {
        if (!this.getAttr('FILLED')) {
            this.changeAttr('FILLED', true);
            ActiveInventory_singleton_1.activeInventory.refresh();
        }
        else {
            player.say('It is already full');
        }
    }
    isFunny() {
        return this.getAttr('FILLED') && this.getAttr('POWDER_INSIDE');
    }
    getFrameForInventory() {
        if (this.getAttr('FILLED')) {
            if (this.getAttr('POWDER_INSIDE')) {
                return POWDER_FILLED_FRAME;
            }
            else {
                return FILLED_FRAME;
            }
        }
        else if (this.getAttr('POWDER_INSIDE')) {
            return POWDER_FRAME;
        }
        return NORMAL_FRAME;
    }
}
exports.Glass = Glass;

},{"../../engine/models/Thing":15,"../../engine/state/ActiveInventory.singleton":16,"../../engine/state/SelectedObjects":19}],63:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const options = {
    id: 'scissors',
    x: 142,
    y: 165,
    spriteId: 'SCISSORS',
    inventoryImageId: 'SCISSORS',
    name: 'scissors',
    goToPosition: {
        x: 172,
        y: 205
    },
    pickable: true
};
class Scissors extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('Shiny and sharp!');
        }
        else {
            player.say('Not safe having scissors around musicians');
        }
    }
    useAction(player) {
        let otherObject = SelectedObjects_1.selectedThing.thing;
        if (otherObject.id === 'broom') {
            let broom = otherObject;
            broom.cutWithScissors();
        }
        else {
            player.say('I don\'t know how to do that');
        }
    }
}
exports.Scissors = Scissors;

},{"../../engine/models/Thing":15,"../../engine/state/SelectedObjects":19}],64:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const options = {
    id: 'skirt',
    spriteId: 'skirt',
    inventoryImageId: 'SKIRT',
    name: 'skirt',
    directlyInInventory: true
};
class Skirt extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    lookAction(player) {
        player.say('I am sensing some costume here');
    }
    useAction(player) {
        if (SelectedObjects_1.selectedThing.thing.id === 'flowers') {
            let flowers = SelectedObjects_1.selectedThing.thing;
            flowers.createCostumeFromSkirt(player, this);
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'coconut') {
            let coconut = SelectedObjects_1.selectedThing.thing;
            coconut.createCostumeFromSkirt(player, this);
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'costume') {
            this.addSkirtToCostume(player, SelectedObjects_1.selectedThing.thing);
        }
        else {
            player.say('I don\'t know how to do that');
        }
    }
    addSkirtToCostume(player, costume) {
        costume.addSkirt(this);
    }
}
exports.Skirt = Skirt;

},{"../../engine/models/Thing":15,"../../engine/state/SelectedObjects":19}],65:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
let options = {
    id: 'table',
    x: 93,
    y: 130,
    spriteId: 'TABLE',
    name: 'table',
    justDecoration: true
};
class Table extends Thing_1.Thing {
    constructor() {
        super(options);
    }
}
exports.Table = Table;

},{"../../engine/models/Thing":15}],66:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const SpeechBubble_1 = require('../../engine/ui/SpeechBubble');
const Can_1 = require('./Can');
const UIBlocker_singleton_1 = require('../../engine/ui/UIBlocker.singleton');
const NORMAL_FRAME = 0;
const GREASED_FRAME = 1;
const GREASED_AND_PUSHED_FRAME = 2;
class VendingMachine extends Thing_1.Thing {
    constructor() {
        let options = {
            id: 'vending',
            x: 54,
            y: 131,
            spriteId: 'VENDING_SPRITE',
            name: 'vending machine',
            goToPosition: {
                x: 80,
                y: 185
            }
        };
        super(options);
        this.speechBubble = new SpeechBubble_1.SpeechBubble({
            owner: this
        });
    }
    pushAction(player) {
        if (this.getAttr('PUSHED')) {
            return player.say('I already pushed too much');
        }
        else if (this.getAttr('GREASED')) {
            return player.goToThing(this)
                .then(() => {
                player.say('Aaaaaragahgahghghghghg');
                this.changeAttr('PUSHED', true);
            });
        }
        else {
            return player.goToThing(this)
                .then(() => {
                return player.say('The floor is so sticky it is impossible to move it.');
            })
                .then(() => {
                return player.say('If I could just put some grease below it...');
            });
        }
    }
    useAction(player) {
        if (SelectedObjects_1.selectedThing.thing.id === 'bacon') {
            this.greaseWithBacon(player);
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'coin') {
            this.getCan(player, SelectedObjects_1.selectedThing.thing);
        }
        else {
            player.say('I don\t know how to use that with a vending machine...');
        }
    }
    say(text) {
        return this.speechBubble.say(text);
    }
    greaseWithBacon(player) {
        player.goToThing(this)
            .then(() => {
            this.changeAttr('GREASED', true);
            player.say('Nice, it will slide really well now...');
        });
    }
    getCan(player, coin) {
        UIBlocker_singleton_1.uiBlocker.block();
        player.goToThing(this)
            .then(() => {
            coin.destroy();
            return this.say('Clonk\n   clonk\n      clonk');
        })
            .then(() => {
            new Can_1.Can();
            player.say('That was a wise purchase');
            UIBlocker_singleton_1.uiBlocker.unblock();
        });
    }
    onStateChange() {
        if (!this.sprite) {
            return null;
        }
        if (this.getAttr('GREASED')) {
            if (this.getAttr('PUSHED')) {
                this.sprite.frame = GREASED_AND_PUSHED_FRAME;
            }
            else {
                this.sprite.frame = GREASED_FRAME;
            }
        }
        else {
            this.sprite.frame = NORMAL_FRAME;
        }
    }
}
exports.VendingMachine = VendingMachine;

},{"../../engine/models/Thing":15,"../../engine/state/SelectedObjects":19,"../../engine/ui/SpeechBubble":33,"../../engine/ui/UIBlocker.singleton":37,"./Can":57}],67:[function(require,module,exports){
"use strict";
const Door_1 = require('../../engine/models/Door');
class BackyardDoorToBackstage extends Door_1.Door {
    constructor() {
        let options = {
            id: 'BACKYARD_TO_BACKSTAGE',
            name: 'door to backstage',
            x: 150,
            y: 95,
            spriteId: 'DOOR_SPRITE',
            goToPosition: {
                x: 175,
                y: 165
            },
            destinationSceneId: 'BACKSTAGE',
            relatedDoorId: 'BACKSTAGE_TO_BACKYARD'
        };
        super(options);
    }
    get name() {
        if (this.getAttr('OPEN')) {
            return 'backstage';
        }
        else {
            return 'door to backstage';
        }
    }
}
exports.BackyardDoorToBackstage = BackyardDoorToBackstage;

},{"../../engine/models/Door":7}],68:[function(require,module,exports){
"use strict";
const Scene_1 = require('../../engine/models/Scene');
const BackyardDoorToBackstage_1 = require('./BackyardDoorToBackstage');
const Flowers_1 = require('./Flowers');
const Bili_1 = require('./Bili');
const sceneOptions = {
    id: 'BACKYARD',
    backgroundId: 'BACKYARD_BG',
    boundariesConfig: {
        minY: 310 / 2,
        maxY: 450 / 2,
        minX: 180 / 2,
        maxX: 1200 / 2
    },
    things: [
        new BackyardDoorToBackstage_1.BackyardDoorToBackstage(),
        new Flowers_1.Flowers(),
        new Bili_1.Bili()
    ]
};
class BackyardScene extends Scene_1.Scene {
    constructor() {
        super(sceneOptions);
    }
}
exports.BackyardScene = BackyardScene;

},{"../../engine/models/Scene":13,"./BackyardDoorToBackstage":67,"./Bili":69,"./Flowers":71}],69:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SpeechBubble_1 = require('../../engine/ui/SpeechBubble');
const ConversationWithBili_1 = require('./ConversationWithBili');
let options = {
    id: 'bili',
    x: 274,
    y: 151,
    spriteId: 'BILI',
    name: 'bili',
    goToPosition: {
        x: 260,
        y: 215
    }
};
class Bili extends Thing_1.Thing {
    constructor() {
        super(options);
        this.speechBubble = new SpeechBubble_1.SpeechBubble({
            owner: this
        });
    }
    lookAction(player) {
        player.say('El bili!');
    }
    speakAction(player) {
        player.goToThing(this).then(() => new ConversationWithBili_1.ConversationWithBili(player, this));
    }
    say(text) {
        return this.speechBubble.say(text);
    }
}
exports.Bili = Bili;

},{"../../engine/models/Thing":15,"../../engine/ui/SpeechBubble":33,"./ConversationWithBili":70}],70:[function(require,module,exports){
"use strict";
const Conversation_1 = require('../../engine/models/Conversation');
const ConversationLine_1 = require('../../engine/models/ConversationLine');
const script = {
    'initial': [
        new ConversationLine_1.ConversationLine(() => {
            return 'Que dise el tio?';
        }, 'initial', (player, bili) => {
            return bili.say('Pues aquí estamos');
        }),
        new ConversationLine_1.ConversationLine('Adiós!', 'end')
    ]
};
class ConversationWithBili extends Conversation_1.Conversation {
    constructor(player, otherPerson) {
        super(player, otherPerson);
        this.player = player;
        this.otherPerson = otherPerson;
    }
    initState() {
        this.state = 'initial';
    }
    loadScript() {
        this.script = script;
    }
}
exports.ConversationWithBili = ConversationWithBili;

},{"../../engine/models/Conversation":5,"../../engine/models/ConversationLine":6}],71:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const Costume_1 = require('../backstageScene/Costume');
const options = {
    id: 'flowers',
    x: 104,
    y: 161,
    spriteId: 'FLOWERS',
    inventoryImageId: 'FLOWERS',
    name: 'flowers',
    goToPosition: {
        x: 120,
        y: 185
    },
    pickable: true
};
class Flowers extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    createCostumeFromCoconut(player, coconut) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        let costume = new Costume_1.Costume();
        costume.addCoconut(coconut);
        costume.addFlowers(this);
    }
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('I bet I could do a beautiful costume with this');
        }
        else {
            player.say('Nice flowers');
        }
    }
    useAction(player) {
        if (SelectedObjects_1.selectedThing.thing.id === 'coconut') {
            this.createCostumeFromCoconut(player, SelectedObjects_1.selectedThing.thing);
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'skirt') {
            this.createCostumeFromSkirt(player, SelectedObjects_1.selectedThing.thing);
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'costume') {
            this.addFlowersToCostume(player, SelectedObjects_1.selectedThing.thing);
        }
        else {
            player.say('I don\'t know how to do that');
        }
    }
    createCostumeFromSkirt(player, skirt) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        let costume = new Costume_1.Costume();
        costume.addSkirt(skirt);
        costume.addFlowers(this);
    }
    addFlowersToCostume(player, costume) {
        costume.addFlowers(this);
    }
}
exports.Flowers = Flowers;

},{"../../engine/models/Thing":15,"../../engine/state/SelectedObjects":19,"../backstageScene/Costume":60}],72:[function(require,module,exports){
"use strict";
const Phaser_1 = require('./Phaser');
const LayoutManager_singleton_1 = require('./engine/ui/LayoutManager.singleton');
const BootScene_1 = require('./BootScene');
const PreloaderScene_1 = require('./PreloaderScene');
const PlayScene_1 = require('./PlayScene');
const PhaserGame_singleton_1 = require('./engine/state/PhaserGame.singleton');
window.onload = function () {
    let game = new Phaser_1.phaser.Game(LayoutManager_singleton_1.layout.WIDTH, LayoutManager_singleton_1.layout.HEIGHT, Phaser_1.phaser.AUTO, 'game');
    PhaserGame_singleton_1.phaserGame.value = game;
    game.state.add('boot', BootScene_1.BootScene);
    game.state.add('preloader', PreloaderScene_1.PreloaderScene);
    game.state.add('play', PlayScene_1.playScene);
    game.state.start('boot');
};

},{"./BootScene":1,"./Phaser":2,"./PlayScene":3,"./PreloaderScene":4,"./engine/state/PhaserGame.singleton":17,"./engine/ui/LayoutManager.singleton":31}]},{},[72])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0Jvb3RTY2VuZS50cyIsInNyYy9hcHAvUGhhc2VyLnRzIiwic3JjL2FwcC9QbGF5U2NlbmUudHMiLCJzcmMvYXBwL1ByZWxvYWRlclNjZW5lLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0NvbnZlcnNhdGlvbi50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9Db252ZXJzYXRpb25MaW5lLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0Rvb3IudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvR2FtZS50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9HYW1lQ2FtZXJhLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0dlbmVyaWNIaWdobGlnaHRlZFRoaW5nLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0ludmVudG9yeS50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9QbGF5ZXIudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvU2NlbmUudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvU2NlbmVCb3VuZGFyaWVzLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL1RoaW5nLnRzIiwic3JjL2FwcC9lbmdpbmUvc3RhdGUvQWN0aXZlSW52ZW50b3J5LnNpbmdsZXRvbi50cyIsInNyYy9hcHAvZW5naW5lL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uLnRzIiwic3JjL2FwcC9lbmdpbmUvc3RhdGUvU2NlbmVzLnNpbmdsZXRvbi50cyIsInNyYy9hcHAvZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cy50cyIsInNyYy9hcHAvZW5naW5lL3N0YXRlL1NlbGVjdGVkVmVyYi5zaW5nbGV0b24udHMiLCJzcmMvYXBwL2VuZ2luZS9zdG9yZXMvRGVmYXVsdExhYmVscy50cyIsInNyYy9hcHAvZW5naW5lL3N0b3Jlcy9MYWJlbHMuc3RvcmUudHMiLCJzcmMvYXBwL2VuZ2luZS9zdG9yZXMvVmVyYnMuc3RvcmUudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9BY3Rpb25CdXR0b24udHMiLCJzcmMvYXBwL2VuZ2luZS91aS9Db252ZXJzYXRpb25MaW5lVUkudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9Db252ZXJzYXRpb25VSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0N1cnJlbnRBY3Rpb25VSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0dyYXBoaWNVSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0ludmVudG9yeUl0ZW1VSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0ludmVudG9yeVVJLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvTGF5b3V0TWFuYWdlci5zaW5nbGV0b24udHMiLCJzcmMvYXBwL2VuZ2luZS91aS9SZWZsZWN0QnV0dG9uLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvU3BlZWNoQnViYmxlLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvU3R5bGUudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9UZXh0SW5TY2VuZS50cyIsInNyYy9hcHAvZW5naW5lL3VpL1RleHRXaXRoU2hhZG93LnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvVUlCbG9ja2VyLnNpbmdsZXRvbi50cyIsInNyYy9hcHAvZW5naW5lL3VpL1VJTGF5ZXJzLnNpbmdsZXRvbi50cyIsInNyYy9hcHAvZW5naW5lL3VpL1ZlcmJzVUkudHMiLCJzcmMvYXBwL2VuZ2luZS91dGlscy9BY3Rpb25EaXNwYXRjaGVyLnRzIiwic3JjL2FwcC9lbmdpbmUvdXRpbHMvRGlyZWN0aW9ucy50cyIsInNyYy9hcHAvZW5naW5lL3V0aWxzL09ic2VydmFibGUudHMiLCJzcmMvYXBwL2VuZ2luZS91dGlscy9SYW5kb21UZXh0LnRzIiwic3JjL2FwcC9nYW1lL0Fzc2V0c01hbmFnZXIudHMiLCJzcmMvYXBwL2dhbWUvQmFja3N0YWdlU2NlbmUvQ29pbi50cyIsInNyYy9hcHAvZ2FtZS9Eb2N0b3J0aWxsYUdhbWUudHMiLCJzcmMvYXBwL2dhbWUvRG9jdG9ydGlsbGFMYWJlbHMudHMiLCJzcmMvYXBwL2dhbWUvRG9jdG9ydGlsbGFQbGF5ZXIudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQmFja3N0YWdlRG9vclRvQmFja3lhcmQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQmFja3N0YWdlU2NlbmUudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQmFjb24udHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQmFuZEluU29mYS50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9Cb2NhZGlsbG8udHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQnJlYWQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQnJvb20udHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQ2FibGUudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQ2FuLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0NvY29udXQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQ29udmVyc2F0aW9uV2l0aEJhbmQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQ29zdHVtZS50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9EdXN0SW5UYWJsZS50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9HbGFzcy50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9TY2lzc29ycy50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9Ta2lydC50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9UYWJsZS50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9WZW5kaW5nTWFjaGluZS50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL0JhY2t5YXJkRG9vclRvQmFja3N0YWdlLnRzIiwic3JjL2FwcC9nYW1lL2JhY2t5YXJkU2NlbmUvQmFja3lhcmRTY2VuZS50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL0JpbGkudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9Db252ZXJzYXRpb25XaXRoQmlsaS50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL0Zsb3dlcnMudHMiLCJzcmMvYXBwL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEsMENBQXVCLHFDQUFxQyxDQUFDLENBQUE7QUFDN0QseUJBQXVCLFVBQVUsQ0FBQyxDQUFBO0FBRXJCLGlCQUFTLEdBQUc7SUFDckIsT0FBTyxFQUFFO1FBQ0wsbURBQW1EO1FBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsTUFBTSxFQUFFO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGVBQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1FBRTNELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxnQ0FBTSxDQUFDLFdBQVcsRUFBRSxnQ0FBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JFLHlCQUF5QjtRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUNwRCxlQUFNLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Q0FDSixDQUFDOzs7O0FDbkJGLG9EQUFvRDtBQUN2QyxjQUFNLEdBQUcsTUFBTSxDQUFDOzs7O0FDRDdCLGtDQUFnQyx3QkFB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QzdCLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL2VuZ2luZS91aS9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBwaGFzZXIgfSBmcm9tICcuL1BoYXNlcic7XG5cbmV4cG9ydCBjb25zdCBCb290U2NlbmUgPSB7XG4gICAgcHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGxvYWQgaGVyZSBhc3NldHMgcmVxdWlyZWQgZm9yIHRoZSBsb2FkaW5nIHNjcmVlblxuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZSgncHJlbG9hZGVyX2JhcicsICdpbWFnZXMvdWkvUFJFTE9BREVSX0JBUi5wbmcnKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBwaGFzZXIuU2NhbGVNYW5hZ2VyLlVTRVJfU0NBTEU7XG5cbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNldFVzZXJTY2FsZShsYXlvdXQuTEFZT1VUX1pPT00sIGxheW91dC5MQVlPVVRfWk9PTSk7XG4gICAgICAgIC8vIGVuYWJsZSBjcmlzcCByZW5kZXJpbmdcbiAgICAgICAgdGhpcy5nYW1lLnJlbmRlcmVyLnJlbmRlclNlc3Npb24ucm91bmRQaXhlbHMgPSB0cnVlO1xuICAgICAgICBwaGFzZXIuQ2FudmFzLnNldEltYWdlUmVuZGVyaW5nQ3Jpc3AodGhpcy5nYW1lLmNhbnZhcyk7XG5cbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdwcmVsb2FkZXInKTtcbiAgICB9XG59OyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi92ZW5kb3IvcGhhc2VyL3BoYXNlci5kLnRzXCIvPlxuZXhwb3J0IGNvbnN0IHBoYXNlciA9IFBoYXNlcjsiLCJpbXBvcnQgeyBEb2N0b3J0aWxsYUdhbWUgfSBmcm9tICcuL2dhbWUvRG9jdG9ydGlsbGFHYW1lJztcblxuY2xhc3MgUGxheVNjZW5lIHtcblxuICAgIGdhbWVNb2RlbDogRG9jdG9ydGlsbGFHYW1lO1xuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWVNb2RlbCA9IG5ldyBEb2N0b3J0aWxsYUdhbWUoKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZU1vZGVsLnVwZGF0ZSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IHBsYXlTY2VuZSA9IG5ldyBQbGF5U2NlbmUoKTtcbiIsImltcG9ydCB7IGFzc2V0c01hbmFnZXIgfSBmcm9tICcuL2dhbWUvQXNzZXRzTWFuYWdlcic7XG5cbmV4cG9ydCBjb25zdCBQcmVsb2FkZXJTY2VuZSA9IHtcbiAgICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubG9hZGluZ0JhciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDI0MCwgJ3ByZWxvYWRlcl9iYXInKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nQmFyLmFuY2hvci5zZXRUbygwLCAwLjUpO1xuICAgICAgICB0aGlzLmxvYWQuc2V0UHJlbG9hZFNwcml0ZSh0aGlzLmxvYWRpbmdCYXIpO1xuXG4gICAgICAgIGFzc2V0c01hbmFnZXIubG9hZEFzc2V0cyg8UGhhc2VyLkdhbWU+IHRoaXMuZ2FtZSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ3BsYXknKTtcbiAgICB9XG59OyIsImltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBJQ2FsbGJhY2sgfSBmcm9tICcuLi91dGlscy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbkxpbmUgfSBmcm9tICcuL0NvbnZlcnNhdGlvbkxpbmUnO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uVUkgfSBmcm9tICcuLi91aS9Db252ZXJzYXRpb25VSSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbnZlcnNhdGlvblNjcmlwdCB7IFtzOiBzdHJpbmddOiBBcnJheTxDb252ZXJzYXRpb25MaW5lPjsgfVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29udmVyc2F0aW9uIHtcblxuICAgIHByaXZhdGUgb25DaGFuZ2VPYnNlcnZhYmxlOiBPYnNlcnZhYmxlO1xuICAgIHByaXZhdGUgX3N0YXRlSWQ6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgc2NyaXB0OiBJQ29udmVyc2F0aW9uU2NyaXB0O1xuICAgIHByaXZhdGUgdWk6IENvbnZlcnNhdGlvblVJO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHBsYXllcjogUGxheWVyLCBwcm90ZWN0ZWQgb3RoZXJQZXJzb246IFRoaW5nKSB7XG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuICAgICAgICB0aGlzLm90aGVyUGVyc29uID0gb3RoZXJQZXJzb247XG4gICAgICAgIHRoaXMubG9hZFNjcmlwdCgpO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMuaW5pdFN0YXRlKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQ29udmVyc2F0aW9uVUkoKTtcbiAgICB9XG5cbiAgICBvblN0YXRlQ2hhbmdlKGNhbGxiYWNrOiBJQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUucmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMuc3RhdGUpO1xuICAgIH1cblxuICAgIGdldCBzdGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGVJZDtcbiAgICB9XG5cbiAgICBnZXRMaW5lcygpOiBBcnJheTxDb252ZXJzYXRpb25MaW5lPiB7XG4gICAgICAgIGxldCBjdXJyZW50U3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgICAgICBpZiAoIXRoaXMuc2NyaXB0IHx8ICF0aGlzLnNjcmlwdFtjdXJyZW50U3RhdGVdKSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1IsIHRoZXJlIGFyZSBubyBsaW5lcyBmb3IgdGhpcyBzdGF0ZSBvZiBjb252ZXJzYXRpb24nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNjcmlwdFtjdXJyZW50U3RhdGVdO1xuICAgIH1cblxuICAgIHNldCBzdGF0ZShuZXdTdGF0ZSkge1xuICAgICAgICBpZiAobmV3U3RhdGUgPT09ICdlbmQnKSB7XG4gICAgICAgICAgICB0aGlzLnVpLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlSWQgPSBuZXdTdGF0ZTtcbiAgICAgICAgICAgIHRoaXMubG9hZFNjcmlwdCgpO1xuICAgICAgICAgICAgdGhpcy5ub3RpZnlTdGF0ZUNoYW5nZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlMaW5lKGxpbmU6IENvbnZlcnNhdGlvbkxpbmUpOiB2b2lkIHtcbiAgICAgICAgbGluZS5hZnRlckNhbGxiYWNrKHRoaXMucGxheWVyLCB0aGlzLm90aGVyUGVyc29uKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBsaW5lLm5leHRTdGF0ZTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFRleHRGb3JMaW5lKGxpbmU6IENvbnZlcnNhdGlvbkxpbmUpOiBzdHJpbmcge1xuICAgICAgICB2YXIgdGV4dENhbGxiYWNrID0gbGluZS50ZXh0O1xuICAgICAgICByZXR1cm4gdGV4dENhbGxiYWNrKHt9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgbG9hZFNjcmlwdCgpOiB2b2lkO1xuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBpbml0U3RhdGUoKTogdm9pZDtcblxuICAgIHByaXZhdGUgY3JlYXRlQ29udmVyc2F0aW9uVUkoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudWkgPSBuZXcgQ29udmVyc2F0aW9uVUkodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3RpZnlTdGF0ZUNoYW5nZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUubm90aWZ5T2JzZXJ2ZXJzKHRoaXMuc3RhdGUpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcbmltcG9ydCB7IElDYWxsYmFjayB9IGZyb20gJy4uL1V0aWxzL09ic2VydmFibGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDb252ZXJzYXRpb25DYWxsYmFjayB7XG4gICAgKHBsYXllcjogUGxheWVyLCBvdGhlclBlcnNvbjogVGhpbmcpOiBhbnk7XG59XG5cbmNvbnN0IGVtcHR5RnVuY3Rpb25XaXRoUHJvbWlzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICByZXNvbHZlQ2FsbGJhY2s6IGZ1bmN0aW9uKCkge31cbiAgICB9O1xuICAgIGxldCBkZWZlcnJlZCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIHJlc3VsdC5yZXNvbHZlQ2FsbGJhY2sgPSByZXNvbHZlO1xuICAgIH0pO1xuICAgIHJlc3VsdC5yZXNvbHZlQ2FsbGJhY2soKTtcblxuICAgIHJldHVybiBkZWZlcnJlZDtcbn07XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJzYXRpb25MaW5lIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3RleHQ6IHN0cmluZyB8IElDb252ZXJzYXRpb25DYWxsYmFjayxcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9uZXh0U3RhdGU6IHN0cmluZyB8ICgoKSA9PiBzdHJpbmcpLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgX2FmdGVyQ2FsbGJhY2s6IElDb252ZXJzYXRpb25DYWxsYmFjayA9IGVtcHR5RnVuY3Rpb25XaXRoUHJvbWlzZSkge1xuXG4gICAgICAgIGlmICghdGhpcy5fdGV4dCkge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBtaXNzaW5nIHRleHQgZm9yIGNvbnZlcnNhdGlvbiBsaW5lJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX25leHRTdGF0ZSkge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBtaXNzaW5nIG5leHQgc3RhdGUgZm9yIGNvbnZlcnNhdGlvbiBsaW5lJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCB0ZXh0KCk6IElDYWxsYmFjayB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fdGV4dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiAoKCkgPT4ge3JldHVybiB0aGlzLl90ZXh0OyB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5fdGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIDxJQ2FsbGJhY2s+IHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgJ0VSUk9SOiBnZXR0aW5nIHRleHQgb2YgY29udmVyc2F0aW9uIGxpbmUsIHdpdGggaW5jb3JyZWN0IHR5cGUnO1xuICAgIH1cblxuICAgIGdldCBhZnRlckNhbGxiYWNrKCk6IElDb252ZXJzYXRpb25DYWxsYmFjayB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZnRlckNhbGxiYWNrO1xuICAgIH1cblxuICAgIGdldCBuZXh0U3RhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TmV4dFN0YXRlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROZXh0U3RhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9uZXh0U3RhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gPHN0cmluZz4gdGhpcy5fbmV4dFN0YXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICg8KCgpID0+IHN0cmluZyk+IHRoaXMuX25leHRTdGF0ZSkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgeyBJUG9pbnQsIElHb1RvU2NlbmVPcHRpb25zIH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBWZXJicyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5cbmludGVyZmFjZSBJRG9vck9wdGlvbnMge1xuICAgIGlkOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgc3ByaXRlSWQ6IHN0cmluZyxcbiAgICBnb1RvUG9zaXRpb246IElQb2ludCxcbiAgICBkZXN0aW5hdGlvblNjZW5lSWQ6IHN0cmluZyxcbiAgICByZWxhdGVkRG9vcklkOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIERvb3IgZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZG9vck9wdGlvbnM6IElEb29yT3B0aW9ucykge1xuICAgICAgICBzdXBlcihkb29yT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5uYW1lIHx8ICdkb29yJztcbiAgICB9XG5cbiAgICBnZXRQcmVmZXJyZWRBY3Rpb24oKTogVmVyYnMge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHJldHVybiBWZXJicy5DTE9TRTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBWZXJicy5PUEVOO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yY2VPcGVuKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ09QRU4nLCB0cnVlKTtcbiAgICB9XG5cbiAgICBnb1RvQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ29Ub0Rlc3RpbmF0aW9uSWZPcGVuKHBsYXllcik7XG4gICAgfVxuXG4gICAgb3BlbkFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5vcGVuKHBsYXllcikpO1xuICAgIH1cblxuICAgIGNsb3NlQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLmNsb3NlKHBsYXllcikpO1xuICAgIH1cblxuICAgIGxvb2tBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ1RoYXRcXCdzIGEgd29uZGVyZnVsIGRvb3IuIFNvIHdvb2R5LicpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb3BlbihwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0l0IGlzIGFscmVhZHkgb3BlbiEnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQXR0cignT1BFTicsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbG9zZShwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZ2V0QXR0cignT1BFTicpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJdCBpcyBhbHJlYWR5IGNsb3NlZCEnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQXR0cignT1BFTicsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvblN0YXRlQ2hhbmdlKCk6IHZvaWQge1xuICAgICAgICBpZighdGhpcy5zcHJpdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ29Ub0Rlc3RpbmF0aW9uSWZPcGVuKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZ29Ub1NjZW5lT3B0aW9uczogSUdvVG9TY2VuZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lSWQ6IHRoaXMuZG9vck9wdGlvbnMuZGVzdGluYXRpb25TY2VuZUlkLFxuICAgICAgICAgICAgICAgICAgICByZWxhdGVkRG9vcklkOiB0aGlzLmRvb3JPcHRpb25zLnJlbGF0ZWREb29ySWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLkdPX1RPX1NDRU5FLCBnb1RvU2NlbmVPcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgbGFiZWxzU3RvcmUgfSBmcm9tICcuLi9zdG9yZXMvTGFiZWxzLnN0b3JlJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi9zdGF0ZS9BY3RpdmVJbnZlbnRvcnkuc2luZ2xldG9uJztcbmltcG9ydCB7IFNjZW5lIH0gZnJvbSAnLi9TY2VuZSc7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgR3JhcGhpY1VJIH0gZnJvbSAnLi4vdWkvR3JhcGhpY1VJJztcbmltcG9ydCB7IEdhbWVDYW1lcmEgfSBmcm9tICcuL0dhbWVDYW1lcmEnO1xuaW1wb3J0IHsgc2VsZWN0ZWRWZXJiIH0gZnJvbSAnLi4vc3RhdGUvU2VsZWN0ZWRWZXJiLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBWZXJic0luZm8gfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBzY2VuZXMgfSBmcm9tICcuLi9zdGF0ZS9TY2VuZXMuc2luZ2xldG9uJztcbmltcG9ydCB7IElHb1RvU2NlbmVPcHRpb25zIH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5cbmltcG9ydCB7IElMYWJlbHMgIH0gZnJvbSAnLi4vc3RvcmVzL0xhYmVscy5zdG9yZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUdhbWVPcHRpb25zIHtcbiAgICBsYWJlbHM6IElMYWJlbHMsXG4gICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgc2NlbmVzOiBBcnJheTxTY2VuZT4sXG4gICAgaW5pdGlhbFNjZW5lSWQ6IHN0cmluZ1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2FtZSB7XG5cbiAgICBwcml2YXRlIHBsYXllcjogUGxheWVyO1xuICAgIHByaXZhdGUgY2FtZXJhOiBHYW1lQ2FtZXJhO1xuICAgIHByaXZhdGUgZ3JhcGhpY1VJOiBHcmFwaGljVUk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgb3B0aW9uczogSUdhbWVPcHRpb25zKSB7XG4gICAgICAgIGxhYmVsc1N0b3JlLmFkZExhYmVscyh0aGlzLm9wdGlvbnMubGFiZWxzKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSB0aGlzLm9wdGlvbnMucGxheWVyO1xuICAgICAgICBhY3RpdmVJbnZlbnRvcnkuc2V0QWN0aXZlSW52ZW50b3J5KHRoaXMucGxheWVyLmludmVudG9yeSk7XG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmVzKHRoaXMub3B0aW9ucyk7XG4gICAgICAgIHRoaXMuaW5pdEFjdGlvbnMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVXb3JsZEJvdW5kcygpO1xuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBHYW1lQ2FtZXJhKHRoaXMucGxheWVyKTtcbiAgICAgICAgdGhpcy5ncmFwaGljVUkgPSBuZXcgR3JhcGhpY1VJKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNhbWVyYS51cGRhdGVQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlU2NlbmVzKG9wdGlvbnM6IElHYW1lT3B0aW9ucyk6IHZvaWQge1xuICAgICAgICBzY2VuZXMuaW5pdChvcHRpb25zLnNjZW5lcyk7XG4gICAgICAgIHNjZW5lcy5zZXRDdXJyZW50U2NlbmVCeUlkKG9wdGlvbnMuaW5pdGlhbFNjZW5lSWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdEFjdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oQWN0aW9ucy5DTElDS19TVEFHRSwgZXYgPT4gdGhpcy5tb3ZlUGxheWVyVG8oZXYpICk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oQWN0aW9ucy5TRUxFQ1RfVEhJTkcsIHRoaW5nID0+IHRoaXMuc2VsZWN0VGhpbmcodGhpbmcpICk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oQWN0aW9ucy5HT19UT19TQ0VORSwgb3B0aW9ucyA9PiB0aGlzLmdvVG9TY2VuZShvcHRpb25zKSApO1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKEFjdGlvbnMuVEFLRV9PQkpFQ1QsIHRoaW5nID0+IHRoaXMudGFrZU9iamVjdCh0aGluZykgKTtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhBY3Rpb25zLlJFRkxFQ1QsICgpID0+IHRoaXMucmVmbGVjdCgpICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb3ZlUGxheWVyVG8oZXZlbnQ6IFBoYXNlci5Qb2ludGVyKTogdm9pZCB7XG4gICAgICAgIGxldCBub25TYWZlUG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiBldmVudC53b3JsZFgsXG4gICAgICAgICAgICB5OiBldmVudC53b3JsZFlcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHNhZmVQb3NpdGlvbiA9IHNjZW5lcy5jdXJyZW50U2NlbmUuYm91bmRhcmllcy5nZXRQb3NpdGlvbkluc2lkZShub25TYWZlUG9zaXRpb24pO1xuICAgICAgICB0aGlzLnBsYXllci5tb3ZlVG8oc2FmZVBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVdvcmxkQm91bmRzKCk6IHZvaWQge1xuICAgICAgICBsZXQgYm91bmRzID0gc2NlbmVzLmN1cnJlbnRTY2VuZS5zY2VuZUJvdW5kcztcbiAgICAgICAgcGhhc2VyR2FtZS52YWx1ZS53b3JsZC5zZXRCb3VuZHMoXG4gICAgICAgICAgICBib3VuZHMueCxcbiAgICAgICAgICAgIGJvdW5kcy55LFxuICAgICAgICAgICAgYm91bmRzLndpZHRoLFxuICAgICAgICAgICAgYm91bmRzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZWxlY3RUaGluZyh0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdmFyIHZlcmIgPSBWZXJic0luZm8uZ2V0KHNlbGVjdGVkVmVyYi52ZXJiKTtcbiAgICAgICAgaWYgKHZlcmIuc2luZ2xlT2JqZWN0KSB7XG4gICAgICAgICAgICB0aGluZy5hcHBseUFjdGlvbihzZWxlY3RlZFZlcmIudmVyYiwgdGhpcy5wbGF5ZXIpO1xuICAgICAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuQUNUSU9OX0FQUExJRUQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RUaGluZ0Zvck11bHRpcGxlT2JqZWN0VmVyYih0aGluZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRha2VPYmplY3QodGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHNjZW5lcy5jdXJyZW50U2NlbmUucmVtb3ZlT2JqZWN0KHRoaW5nKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIuYWRkT2JqZWN0VG9JbnZlbnRvcnkodGhpbmcpO1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5VUERBVEVfSU5WRU5UT1JZKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNlbGVjdFRoaW5nRm9yTXVsdGlwbGVPYmplY3RWZXJiKHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZykge1xuICAgICAgICAgICAgdGhpbmcuYXBwbHlBY3Rpb24oc2VsZWN0ZWRWZXJiLnZlcmIsIHRoaXMucGxheWVyKTtcbiAgICAgICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLkFDVElPTl9BUFBMSUVEKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGluZy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFRoaW5nLnRoaW5nID0gdGhpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdvVG9TY2VuZShvcHRpb25zOiBJR29Ub1NjZW5lT3B0aW9ucykge1xuICAgICAgICBzY2VuZXMuZ29Ub1NjZW5lV2l0aElkKG9wdGlvbnMuc2NlbmVJZCk7XG4gICAgICAgIHNjZW5lcy5jdXJyZW50U2NlbmUucGxheWVyQXJyaXZlc0F0RG9vcih0aGlzLnBsYXllciwgb3B0aW9ucy5yZWxhdGVkRG9vcklkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZmxlY3QoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGxheWVyLnJlZmxlY3QoKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBzdHlsZSB9IGZyb20gJy4uL3VpL1N0eWxlJztcblxuZXhwb3J0IGNsYXNzIEdhbWVDYW1lcmEge1xuICAgIHByaXZhdGUgY2FtZXJhOiBQaGFzZXIuQ2FtZXJhO1xuICAgIHByaXZhdGUgY2FtZXJhUG9zaXRpb246IElQb2ludDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGxheWVyOiBQbGF5ZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBsYXllcikge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBhIGNhbWVyYSBuZWVkcyBhIHBsYXllciB0byBmb2xsb3cnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FtZXJhID0gcGhhc2VyR2FtZS52YWx1ZS5jYW1lcmE7XG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICB1cGRhdGVQb3NpdGlvbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jYW1lcmFQb3NpdGlvbiA9IHRoaXMuY2FtZXJhUG9zaXRpb24gfHwgbmV3IFBoYXNlci5Qb2ludCgwLCAwKTtcblxuICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5wbGF5ZXIuc3ByaXRlO1xuICAgICAgICB0aGlzLmNhbWVyYVBvc2l0aW9uLnggKz0gKHBsYXllci54IC0gdGhpcy5jYW1lcmFQb3NpdGlvbi54KSAqIHN0eWxlLkNBTUVSQV9FQVNJTkdfRkFDVE9SO1xuICAgICAgICB0aGlzLmNhbWVyYVBvc2l0aW9uLnggPSBNYXRoLnJvdW5kKHRoaXMuY2FtZXJhUG9zaXRpb24ueCk7XG4gICAgICAgIHRoaXMuY2FtZXJhUG9zaXRpb24ueSArPSAocGxheWVyLnkgLSB0aGlzLmNhbWVyYVBvc2l0aW9uLnkpICogc3R5bGUuQ0FNRVJBX0VBU0lOR19GQUNUT1I7XG4gICAgICAgIHRoaXMuY2FtZXJhUG9zaXRpb24ueSA9IE1hdGgucm91bmQodGhpcy5jYW1lcmFQb3NpdGlvbi55KTtcbiAgICAgICAgdGhpcy5jYW1lcmEuZm9jdXNPblhZKHRoaXMuY2FtZXJhUG9zaXRpb24ueCwgdGhpcy5jYW1lcmFQb3NpdGlvbi55KTtcbiAgICB9XG59IiwiaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2VuZXJpY0hpZ2hsaWdodGVkVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBvbkNoYW5nZU9ic2VydmFibGU6IE9ic2VydmFibGU7XG4gICAgcHJpdmF0ZSBoaWdobGlnaHRlZFRoaW5nOiBUaGluZztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcblxuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKFxuICAgICAgICAgICAgQWN0aW9ucy5DVVJTT1JfT1ZFUl9USElORyxcbiAgICAgICAgICAgIHRoaW5nID0+IHRoaXMub25DdXJzb3JPdmVyVGhpbmcodGhpbmcpXG4gICAgICAgICk7XG5cbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQ1VSU09SX09VVF9USElORyxcbiAgICAgICAgICAgIHRoaW5nID0+IHRoaXMub25DdXJzb3JPdXRUaGluZyh0aGluZylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLmhpZ2hsaWdodGVkVGhpbmcpO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZS5yZW1vdmVPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZ2V0IHRoaW5nKCk6IFRoaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZWRUaGluZztcbiAgICB9XG5cbiAgICBzZXQgdGhpbmcobmV3VGhpbmc6IFRoaW5nKSB7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGhpbmcobmV3VGhpbmcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBoaWdobGlnaHRUaGluZyhuZXdUaGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRlZFRoaW5nID0gbmV3VGhpbmc7XG4gICAgICAgIHRoaXMubm90aWZ5U3Vic2NyaWJlcnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2V0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nKG51bGwpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbkN1cnNvck92ZXJUaGluZyh0aGluZzogVGhpbmcpOiB2b2lkICB7fVxuICAgIHByb3RlY3RlZCBvbkN1cnNvck91dFRoaW5nKHRoaW5nOiBUaGluZyk6IHZvaWQgIHt9XG5cbiAgICBwcml2YXRlIG5vdGlmeVN1YnNjcmliZXJzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnModGhpcy5oaWdobGlnaHRlZFRoaW5nKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUsIElDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzL09ic2VydmFibGUnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcblxuZXhwb3J0IGNsYXNzIEludmVudG9yeSB7XG5cbiAgICBwcml2YXRlIGNoYW5nZU9ic2VydmFibGUgOiBPYnNlcnZhYmxlO1xuICAgIGl0ZW1zOiBTZXQ8VGhpbmc+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjaykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjaykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLnJlbW92ZU9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBhZGQoaXRlbTogVGhpbmcpIHtcbiAgICAgICAgaXRlbS5zdGF0ZS5zZXQoJ0lTX0lOX0lOVkVOVE9SWScsIHRydWUpO1xuICAgICAgICB0aGlzLml0ZW1zLmFkZChpdGVtKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyh0aGlzKTtcbiAgICB9XG5cbiAgICByZW1vdmUoaXRlbTogVGhpbmcpIHtcbiAgICAgICAgdGhpcy5pdGVtcy5kZWxldGUoaXRlbSk7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnModGhpcyk7XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZDogc3RyaW5nKTogVGhpbmcge1xuICAgICAgICBsZXQgaXRlbUFycmF5ID0gQXJyYXkuZnJvbSh0aGlzLml0ZW1zKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpdGVtQXJyYXlbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1BcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJbnZlbnRvcnkgfSBmcm9tICcuL0ludmVudG9yeSc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuLi91aS9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgSVBvaW50LCBJU3ByaXRlSW5mbyB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgRGlyZWN0aW9ucywgZ2V0RGlyZWN0aW9uTmFtZSB9IGZyb20gJy4uL3V0aWxzL0RpcmVjdGlvbnMnO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcbmltcG9ydCB7IFNwZWVjaEJ1YmJsZSB9IGZyb20gJy4uL3VpL1NwZWVjaEJ1YmJsZSc7XG5pbXBvcnQgeyBzY2VuZXMgfSBmcm9tICcuLi9zdGF0ZS9TY2VuZXMuc2luZ2xldG9uJztcblxuaW50ZXJmYWNlIElQbGF5ZXJPcHRpb25zIHtcbiAgICBzcHJpdGVJZDogc3RyaW5nLFxuICAgIGluaXRpYWxYOiBudW1iZXIsXG4gICAgaW5pdGlhbFk6IG51bWJlcixcbiAgICB4U3BlZWQ6IG51bWJlciwgLy9weC9zXG4gICAgeVNwZWVkOiBudW1iZXIsIC8vcHgvc1xuICAgIGFuaW1hdGlvblNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlT3B0aW9uczogTWFwPHN0cmluZywgSVNwcml0ZUluZm8+O1xufVxuXG5pbnRlcmZhY2UgSVRpbWVvdXRXaXRoUHJvbWlzZSB7XG4gICAgdGltZW91dElkOiBudW1iZXIsXG4gICAgcHJvbWlzZTogUHJvbWlzZTxhbnk+LFxuICAgIHJlc29sdmVDYWxsYmFjazogKCkgPT4gdm9pZCxcbiAgICByZWplY3RDYWxsYmFjazogKCkgPT4gdm9pZFxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGxheWVyIHtcblxuICAgIGludmVudG9yeTogSW52ZW50b3J5O1xuXG4gICAgcHJpdmF0ZSBfc3ByaXRlOiBQaGFzZXIuU3ByaXRlO1xuICAgIHByaXZhdGUgdHdlZW46IFBoYXNlci5Ud2VlbjtcbiAgICBwcml2YXRlIGRpcmVjdGlvbjogRGlyZWN0aW9ucztcbiAgICBwcml2YXRlIHdpbGxNb3ZlUHJvbWlzZTogSVRpbWVvdXRXaXRoUHJvbWlzZTtcbiAgICBwcml2YXRlIHNwZWVjaEJ1YmJsZTogU3BlZWNoQnViYmxlO1xuICAgIHByaXZhdGUgX3N0YXRlOiBNYXA8c3RyaW5nLCBhbnk+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zIDogSVBsYXllck9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBuZXcgSW52ZW50b3J5KCk7XG4gICAgICAgIHRoaXMuY3JlYXRlU3ByaXRlKCk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9ucy5SSUdIVDtcbiAgICAgICAgdGhpcy5wbGF5U3RhbmRBbmltYXRpb24oKTtcbiAgICAgICAgdGhpcy5zcGVlY2hCdWJibGUgPSBuZXcgU3BlZWNoQnViYmxlKHtcbiAgICAgICAgICAgIG93bmVyOiB0aGlzXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IG5ldyBNYXAoKTtcbiAgICB9XG5cbiAgICBtb3ZlVG8oZGVzdGluYXRpb246IElQb2ludCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLmNhbmNlbEN1cnJlbnRUd2VlbigpO1xuICAgICAgICB0aGlzLmNhbmNlbEN1cnJlbnRNb3ZlUHJvbWlzZSgpO1xuICAgICAgICBsZXQgdGltZVRvQW5pbWF0ZSA9IHRoaXMuZ2V0VGltZUZvckFuaW1hdGlvbihkZXN0aW5hdGlvbik7XG5cbiAgICAgICAgaWYgKHRpbWVUb0FuaW1hdGUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGlyZWN0aW9uKGRlc3RpbmF0aW9uKTtcbiAgICAgICAgICAgIHRoaXMucGxheVdhbGtpbmdBbmltYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMudHdlZW4gPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC50d2Vlbih0aGlzLl9zcHJpdGUpO1xuICAgICAgICAgICAgdGhpcy50d2Vlbi50byh7IHg6IGRlc3RpbmF0aW9uLngsIHk6IGRlc3RpbmF0aW9uLnkgfSwgdGltZVRvQW5pbWF0ZSwgJ0xpbmVhcicsIHRydWUsIDApO1xuICAgICAgICAgICAgdGhpcy50d2Vlbi5vbkNvbXBsZXRlLmFkZCh0aGlzLnN0b3BBbmltYXRpb25zLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud2lsbE1vdmVQcm9taXNlID0gdGhpcy5jcmVhdGVNb3ZlUHJvbWlzZSh0aW1lVG9BbmltYXRlKTtcblxuICAgICAgICByZXR1cm4gdGhpcy53aWxsTW92ZVByb21pc2UucHJvbWlzZTtcbiAgICB9XG5cbiAgICBnZXQgc3ByaXRlKCk6IFBoYXNlci5TcHJpdGUge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3ByaXRlO1xuICAgIH1cblxuICAgIGdvVG9UaGluZyh0aGluZzogVGhpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW92ZVRvKHRoaW5nLmdldFBvc2l0aW9uVG9Hb1RvKCkpO1xuICAgIH1cblxuICAgIHNheSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BlZWNoQnViYmxlLnNheSh0ZXh0KTtcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvbk9uVG9wKCk6IElQb2ludHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuc3ByaXRlLngsXG4gICAgICAgICAgICB5OiBNYXRoLnJvdW5kKHRoaXMuc3ByaXRlLmdldEJvdW5kcygpLnkpIC0gMTBcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhZGRPYmplY3RUb0ludmVudG9yeSh0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkuYWRkKHRoaW5nKTtcbiAgICB9XG5cbiAgICB0ZWxlcG9ydFRvKGRlc3RpbmF0aW9uOiBJUG9pbnQpOiB2b2lkIHtcbiAgICAgICAgbGV0IHNhZmVQb3NpdGlvbiA9IHNjZW5lcy5jdXJyZW50U2NlbmUuYm91bmRhcmllcy5nZXRQb3NpdGlvbkluc2lkZShkZXN0aW5hdGlvbik7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVUb1dpdGhvdXRBbmltYXRpb24oc2FmZVBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBnZXQgc3RhdGUoKTogTWFwPHN0cmluZywgYW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICB9XG5cbiAgICBzZXQgc3RhdGUobmV3U3RhdGU6IE1hcDxzdHJpbmcsIGFueT4pe1xuICAgICAgICBpZiAobmV3U3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYW5nZUF0dHIoYXR0ck5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9zdGF0ZS5zZXQoYXR0ck5hbWUsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5vblN0YXRlQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgZ2V0QXR0cihhdHRyTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZS5nZXQoYXR0ck5hbWUpO1xuICAgIH1cblxuICAgIGFic3RyYWN0IHJlZmxlY3QoKTogdm9pZFxuXG4gICAgLy9UaGlzIG1ldGhvZCBjYW4gYmUgb3ZlcndyaXR0ZW4gaW4gY2hpbGQgY2xhc3Nlc1xuICAgIHByb3RlY3RlZCBvblN0YXRlQ2hhbmdlKCkge31cblxuICAgIHByaXZhdGUgbW92ZVRvV2l0aG91dEFuaW1hdGlvbihwb3NpdGlvbjogSVBvaW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMudXBkYXRlRGlyZWN0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5jYW5jZWxDdXJyZW50VHdlZW4oKTtcbiAgICAgICAgdGhpcy5jYW5jZWxDdXJyZW50TW92ZVByb21pc2UoKTtcbiAgICAgICAgdGhpcy5wbGF5U3RhbmRBbmltYXRpb24oKTtcbiAgICAgICAgdGhpcy5zcHJpdGUueCA9IHBvc2l0aW9uLng7XG4gICAgICAgIHRoaXMuc3ByaXRlLnkgPSBwb3NpdGlvbi55O1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlU3ByaXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9zcHJpdGUgPSB1aUxheWVycy5wbGF5ZXIuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmluaXRpYWxYLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmluaXRpYWxZLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNwcml0ZUlkXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX3Nwcml0ZS5hbmNob3Iuc2V0VG8oMC41LCAwLjk5KTtcbiAgICAgICAgdWlMYXllcnMucGxheWVyLnNvcnQoJ3onLCBQaGFzZXIuR3JvdXAuU09SVF9BU0NFTkRJTkcpO1xuICAgICAgICB0aGlzLmFkZFNwcml0ZUFuaW1hdGlvbnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFNwcml0ZUFuaW1hdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zcHJpdGVPcHRpb25zLmZvckVhY2goIChzcHJpdGVQb3NpdGlvbiwga2V5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUuYW5pbWF0aW9ucy5hZGQoa2V5LCBzcHJpdGVQb3NpdGlvbi5mcmFtZXMsIHRoaXMub3B0aW9ucy5hbmltYXRpb25TcGVlZCwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTW92ZVByb21pc2UodGltZVRvTW92ZTogbnVtYmVyID0gMCk6IElUaW1lb3V0V2l0aFByb21pc2Uge1xuICAgICAgICB2YXIgcmVzdWx0OiBJVGltZW91dFdpdGhQcm9taXNlID0ge1xuICAgICAgICAgICAgdGltZW91dElkOiBudWxsLFxuICAgICAgICAgICAgcHJvbWlzZTogbnVsbCxcbiAgICAgICAgICAgIHJlc29sdmVDYWxsYmFjazogbnVsbCxcbiAgICAgICAgICAgIHJlamVjdENhbGxiYWNrOiBudWxsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzdWx0LnRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5yZXNvbHZlTW92ZVByb21pc2UoKSxcbiAgICAgICAgICAgIHRpbWVUb01vdmUpO1xuXG4gICAgICAgIHJlc3VsdC5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgcmVzdWx0LnJlc29sdmVDYWxsYmFjayA9IHJlc29sdmU7XG4gICAgICAgICAgICByZXN1bHQucmVqZWN0Q2FsbGJhY2sgPSByZWplY3Q7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNvbHZlTW92ZVByb21pc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLndpbGxNb3ZlUHJvbWlzZSkge1xuICAgICAgICAgICAgdGhpcy53aWxsTW92ZVByb21pc2UucmVzb2x2ZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICB0aGlzLndpbGxNb3ZlUHJvbWlzZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbmNlbEN1cnJlbnRNb3ZlUHJvbWlzZSgpIHtcbiAgICAgICAgaWYgKHRoaXMud2lsbE1vdmVQcm9taXNlKSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMud2lsbE1vdmVQcm9taXNlLnRpbWVvdXRJZCk7XG4gICAgICAgICAgICAvLyBXZSBjb3VsZCByZWplY3QgdGhlIHByb21pc2UgbGlrZSB0aGlzLCBidXQgdGhlcmUgaXMgbm8gbmVlZFxuICAgICAgICAgICAgLy8gdGhpcy53aWxsTW92ZVByb21pc2UucmVqZWN0Q2FsbGJhY2soKTtcbiAgICAgICAgICAgIHRoaXMud2lsbE1vdmVQcm9taXNlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2FuY2VsQ3VycmVudFR3ZWVuKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50d2VlbiAmJiB0aGlzLnR3ZWVuLmlzUnVubmluZykge1xuICAgICAgICAgICAgdGhpcy50d2Vlbi5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLnR3ZWVuLm9uQ29tcGxldGUucmVtb3ZlQWxsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRpbWVGb3JBbmltYXRpb24oZGVzdGluYXRpb246IElQb2ludCk6IG51bWJlciB7XG4gICAgICAgIGxldCBhbmdsZUJldHdlZW4gPSB0aGlzLmdldEFuZ2xlVG9EZXNpcmVkUG9zaXRpb24oZGVzdGluYXRpb24pO1xuICAgICAgICBsZXQgZGlmZjEgPSB0aGlzLl9zcHJpdGUueCAtIGRlc3RpbmF0aW9uLng7XG4gICAgICAgIGxldCBkaWZmMiA9IHRoaXMuX3Nwcml0ZS55IC0gZGVzdGluYXRpb24ueTtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KChkaWZmMSAqIGRpZmYxKSArIChkaWZmMiAqIGRpZmYyKSk7XG4gICAgICAgIGxldCBzcGVlZEZyb21YID0gTWF0aC5hYnMoTWF0aC5jb3MoYW5nbGVCZXR3ZWVuKSkgKiBkaXN0YW5jZSAvIHRoaXMub3B0aW9ucy54U3BlZWQ7XG4gICAgICAgIGxldCBzcGVlZEZyb21ZID0gTWF0aC5hYnMoTWF0aC5zaW4oYW5nbGVCZXR3ZWVuKSkgKiBkaXN0YW5jZSAvIHRoaXMub3B0aW9ucy55U3BlZWQ7XG5cbiAgICAgICAgcmV0dXJuIDEwMDAgKiAoKHNwZWVkRnJvbVggKyBzcGVlZEZyb21ZKSAvIDIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0QW5nbGVUb0Rlc2lyZWRQb3NpdGlvbihkZXN0aW5hdGlvbjogSVBvaW50KTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy5fc3ByaXRlLnkgLSBkZXN0aW5hdGlvbi55LFxuICAgICAgICAgICAgdGhpcy5fc3ByaXRlLnggLSBkZXN0aW5hdGlvbi54KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZURpcmVjdGlvbihkZXN0aW5hdGlvbjogSVBvaW50KTogdm9pZCB7XG4gICAgICAgIGxldCBhbmdsZUJldHdlZW4gPSB0aGlzLmdldEFuZ2xlVG9EZXNpcmVkUG9zaXRpb24oZGVzdGluYXRpb24pO1xuICAgICAgICBsZXQgYW5nbGVEZWdyZWVzID0gKGFuZ2xlQmV0d2VlbiAqIDE4MCAvIE1hdGguUEkpO1xuXG4gICAgICAgIGlmICgoYW5nbGVEZWdyZWVzID49IC00NSkgJiYgKGFuZ2xlRGVncmVlcyA8PSA0NSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9ucy5MRUZUO1xuICAgICAgICB9IGVsc2UgaWYgKChhbmdsZURlZ3JlZXMgPj0gNDUpICYmIChhbmdsZURlZ3JlZXMgPD0gMTM1KSkge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBEaXJlY3Rpb25zLlVQO1xuICAgICAgICB9IGVsc2UgaWYgKChhbmdsZURlZ3JlZXMgPj0gLTEzNSkgJiYgKGFuZ2xlRGVncmVlcyA8PSAtNDUpKSB7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERpcmVjdGlvbnMuRE9XTjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9ucy5SSUdIVDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcGxheVdhbGtpbmdBbmltYXRpb24oKTogdm9pZCB7XG4gICAgICAgIGxldCBkaXJlY3Rpb25OYW1lID0gZ2V0RGlyZWN0aW9uTmFtZSh0aGlzLmRpcmVjdGlvbik7XG4gICAgICAgIGxldCBzcHJpdGVTdGF0ZSA9ICd3YWxrXycgKyBkaXJlY3Rpb25OYW1lO1xuICAgICAgICB0aGlzLl9zcHJpdGUuYW5pbWF0aW9ucy5wbGF5KHNwcml0ZVN0YXRlKTtcbiAgICAgICAgdGhpcy5mbGlwWElmTmVlZGVkKHNwcml0ZVN0YXRlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZsaXBYSWZOZWVkZWQoc3ByaXRlU3RhdGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsZXQgc3ByaXRlU3RhdGVPcHRpb25zID0gdGhpcy5vcHRpb25zLnNwcml0ZU9wdGlvbnMuZ2V0KHNwcml0ZVN0YXRlKTtcbiAgICAgICAgaWYgKHNwcml0ZVN0YXRlT3B0aW9ucyAmJiBzcHJpdGVTdGF0ZU9wdGlvbnMuaW52ZXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fc3ByaXRlLnNjYWxlLnggPSAtMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Nwcml0ZS5zY2FsZS54ID0gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RvcEFuaW1hdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGxheVN0YW5kQW5pbWF0aW9uKCk7XG4gICAgICAgIHRoaXMuX3Nwcml0ZS5hbmltYXRpb25zLnN0b3AoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBsYXlTdGFuZEFuaW1hdGlvbigpOiB2b2lkIHtcbiAgICAgICAgbGV0IGRpcmVjdGlvbk5hbWUgPSBnZXREaXJlY3Rpb25OYW1lKHRoaXMuZGlyZWN0aW9uKTtcbiAgICAgICAgbGV0IHNwcml0ZVN0YXRlID0gJ3N0YW5kXycgKyBkaXJlY3Rpb25OYW1lO1xuICAgICAgICB0aGlzLl9zcHJpdGUuYW5pbWF0aW9ucy5wbGF5KHNwcml0ZVN0YXRlKTtcbiAgICAgICAgdGhpcy5mbGlwWElmTmVlZGVkKHNwcml0ZVN0YXRlKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi4vdWkvVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcbmltcG9ydCB7IElSZWN0YW5nbGUgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IFNjZW5lQm91bmRhcmllcywgSUJvdW5kYXJpZXNDb25maWcgfSBmcm9tICcuL1NjZW5lQm91bmRhcmllcyc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHsgRG9vciB9IGZyb20gJy4vRG9vcic7XG5cblxuaW50ZXJmYWNlIElTY2VuZU9wdGlvbnMge1xuICAgIGlkOiBzdHJpbmcsXG4gICAgYmFja2dyb3VuZElkOiBzdHJpbmcsXG4gICAgYm91bmRhcmllc0NvbmZpZzogSUJvdW5kYXJpZXNDb25maWcsXG4gICAgdGhpbmdzOiBBcnJheTxUaGluZz5cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNjZW5lIHtcblxuICAgIHByaXZhdGUgYmFja2dyb3VuZDogUGhhc2VyLlNwcml0ZTtcbiAgICBwcml2YXRlIF9ib3VuZGFyaWVzOiBTY2VuZUJvdW5kYXJpZXM7XG4gICAgcHJpdmF0ZSB0aGluZ3M6IFNldDxUaGluZz47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9wdGlvbnM6IElTY2VuZU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fYm91bmRhcmllcyA9IG5ldyBTY2VuZUJvdW5kYXJpZXMob3B0aW9ucy5ib3VuZGFyaWVzQ29uZmlnKTtcbiAgICAgICAgdGhpcy5jcmVhdGVUaGluZ3MoKTtcbiAgICB9XG5cbiAgICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pZDtcbiAgICB9XG5cbiAgICBnZXQgc2NlbmVCb3VuZHMoKTogSVJlY3RhbmdsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhY2tncm91bmQuZ2V0Qm91bmRzKCk7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kYXJpZXMoKTogU2NlbmVCb3VuZGFyaWVzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kYXJpZXM7XG4gICAgfVxuXG4gICAgc2hvdygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jcmVhdGVCYWNrZ3JvdW5kKCk7XG4gICAgICAgIHRoaXMudGhpbmdzLmZvckVhY2godGhpbmcgPT4gdGhpbmcuc2hvdygpKTtcbiAgICB9XG5cbiAgICByZW1vdmVPYmplY3Qob2JqZWN0VG9SZW1vdmU6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGhpbmdzLmRlbGV0ZShvYmplY3RUb1JlbW92ZSk7XG4gICAgICAgIG9iamVjdFRvUmVtb3ZlLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBwbGF5ZXJBcnJpdmVzQXREb29yKHBsYXllcjogUGxheWVyLCBkb29ySWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsZXQgZG9vciA9IHRoaXMuZmluZERvb3IoZG9vcklkKTtcbiAgICAgICAgZG9vci5mb3JjZU9wZW4oKTtcbiAgICAgICAgcGxheWVyLnRlbGVwb3J0VG8oZG9vci5nZXRQb3NpdGlvblRvR29UbygpKTtcbiAgICB9XG5cbiAgICBnZXRUaGluZ0J5SWQodGhpbmdJZDogc3RyaW5nKTogVGhpbmcge1xuICAgICAgICB2YXIgZm91bmRUaGluZzogVGhpbmcgPSBudWxsO1xuICAgICAgICB0aGlzLnRoaW5ncy5mb3JFYWNoKCh0aGluZykgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaW5nLmlkID09PSB0aGluZ0lkKSB7XG4gICAgICAgICAgICAgICAgZm91bmRUaGluZyA9IHRoaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZvdW5kVGhpbmc7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy50aGluZ3MuZm9yRWFjaCh0aGluZyA9PiB0aGluZy5kZXN0cm95KCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQmFja2dyb3VuZCgpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gdWlMYXllcnMuYmFja2dyb3VuZC5jcmVhdGUoMCwgMCwgdGhpcy5vcHRpb25zLmJhY2tncm91bmRJZCk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5hbmNob3Iuc2V0KDAsIDApO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmV2ZW50cy5vbklucHV0RG93bi5hZGQoIChkZXN0OiBhbnksIGV2OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLkNMSUNLX1NUQUdFLCBldik7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVUaGluZ3MoKSB7XG4gICAgICAgIHRoaXMudGhpbmdzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLm9wdGlvbnMudGhpbmdzLmZvckVhY2goKHRoaW5nKSA9PiB0aGlzLnRoaW5ncy5hZGQodGhpbmcpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmREb29yKGRvb3JJZDogc3RyaW5nKTogRG9vciB7XG4gICAgICAgIGZvciAobGV0IHRoaW5nIG9mIHRoaXMudGhpbmdzKSB7XG4gICAgICAgICAgICBpZiAodGhpbmcuaWQgPT09IGRvb3JJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiA8RG9vcj50aGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyAnRVJST1I6IGNvdWxkIG5vdCBmaW5kIHRoZSByZWxhdGVkIGRvb3IuJztcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcblxuZXhwb3J0IGludGVyZmFjZSBJQm91bmRhcmllc0NvbmZpZyB7XG4gICAgbWluWTogbnVtYmVyLFxuICAgIG1heFk6IG51bWJlcixcbiAgICBtaW5YOiBudW1iZXIsXG4gICAgbWF4WDogbnVtYmVyXG59XG5cbmV4cG9ydCBjbGFzcyBTY2VuZUJvdW5kYXJpZXMge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IElCb3VuZGFyaWVzQ29uZmlnKSB7fVxuXG4gICAgZ2V0UG9zaXRpb25JbnNpZGUocG9pbnQ6IElQb2ludCk6IElQb2ludCB7XG4gICAgICAgIGxldCB4ID0gTWF0aC5tYXgodGhpcy5jb25maWcubWluWCwgcG9pbnQueCk7XG4gICAgICAgIHggPSBNYXRoLm1pbih0aGlzLmNvbmZpZy5tYXhYLCB4KTtcbiAgICAgICAgbGV0IHkgPSBNYXRoLm1heCh0aGlzLmNvbmZpZy5taW5ZLCBwb2ludC55KTtcbiAgICAgICAgeSA9IE1hdGgubWluKHRoaXMuY29uZmlnLm1heFksIHkpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBNYXRoLnJvdW5kKHgpLFxuICAgICAgICAgICAgeTogTWF0aC5yb3VuZCh5KVxuICAgICAgICB9O1xuXG4gICAgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9teS10eXBpbmdzL2xpYi5lczYuZC50c1wiIC8+XG5pbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi4vdWkvVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcbmltcG9ydCB7IGFjdGl2ZUludmVudG9yeSB9IGZyb20gJy4uL3N0YXRlL0FjdGl2ZUludmVudG9yeS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgVmVyYnMgfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcblxuXG5pbnRlcmZhY2UgSVRoaW5nT3B0aW9ucyB7XG4gICAgaWQ6IHN0cmluZyxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgeD86IG51bWJlcixcbiAgICB5PzogbnVtYmVyLFxuICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk/OiBCb29sZWFuLFxuICAgIHNwcml0ZUlkPzogc3RyaW5nLFxuICAgIGludmVudG9yeUltYWdlSWQ/OiBzdHJpbmcsXG4gICAgZ29Ub1Bvc2l0aW9uPzogSVBvaW50LFxuICAgIGlzRm9yZWdyb3VuZD86IEJvb2xlYW4sXG4gICAgcHJlZmVycmVkQWN0aW9uPzogVmVyYnMsXG4gICAgcGlja2FibGU/OiBCb29sZWFuLFxuICAgIGp1c3REZWNvcmF0aW9uPzogQm9vbGVhblxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBfc3RhdGU6IE1hcDxzdHJpbmcsIGFueT47XG4gICAgcHJvdGVjdGVkIHNwcml0ZTogUGhhc2VyLlNwcml0ZTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBvcHRpb25zOiBJVGhpbmdPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXJlY3RseUluSW52ZW50b3J5KSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRvSW52ZW50b3J5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNyZWF0ZVNwcml0ZSgpO1xuICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UoKTtcbiAgICAgICAgdGhpcy5hcHBseU1vZGlmaWVyKCk7XG4gICAgfVxuXG4gICAgZ2V0IHN0YXRlKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gICAgfVxuXG4gICAgc2V0IHN0YXRlKG5ld1N0YXRlKSB7XG4gICAgICAgIGlmIChuZXdTdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgICAgIHRoaXMub25TdGF0ZUNoYW5nZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5uYW1lO1xuICAgIH1cblxuICAgIGdldCBpZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmlkO1xuICAgIH1cblxuICAgIGNoYW5nZUF0dHIoYXR0ck5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9zdGF0ZS5zZXQoYXR0ck5hbWUsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5vblN0YXRlQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgZ2V0QXR0cihhdHRyTmFtZTogc3RyaW5nKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlLmdldChhdHRyTmFtZSk7XG4gICAgfVxuXG4gICAgZ2V0UHJlZmVycmVkQWN0aW9uKCk6IFZlcmJzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wcmVmZXJyZWRBY3Rpb24gfHwgbnVsbDtcbiAgICB9XG5cbiAgICBpc0luSW52ZW50b3J5KCk6IEJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZSAmJiB0aGlzLnN0YXRlLmdldCgnSVNfSU5fSU5WRU5UT1JZJyk7XG4gICAgfVxuXG4gICAgZ2V0UG9zaXRpb25Ub0dvVG8oKTogSVBvaW50IHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5nb1RvUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZ29Ub1Bvc2l0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB4OiB0aGlzLm9wdGlvbnMueCxcbiAgICAgICAgICAgICAgICB5OiB0aGlzLm9wdGlvbnMueVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFBvc2l0aW9uT25Ub3AoKTogSVBvaW50e1xuICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy5zcHJpdGUueCxcbiAgICAgICAgICAgIHk6IE1hdGgucm91bmQodGhpcy5zcHJpdGUuZ2V0Qm91bmRzKCkueSkgLSAxMFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFwcGx5QWN0aW9uKHZlcmI6IFZlcmJzLCBwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBzd2l0Y2ggKHZlcmIpIHtcblxuICAgICAgICBjYXNlIFZlcmJzLkdPX1RPOlxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ29Ub0FjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuVEFLRTpcbiAgICAgICAgICAgIHRoaXMudGFrZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuTE9PSzpcbiAgICAgICAgICAgIHRoaXMubG9va0FjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuT1BFTjpcbiAgICAgICAgICAgIHRoaXMub3BlbkFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuQ0xPU0U6XG4gICAgICAgICAgICB0aGlzLmNsb3NlQWN0aW9uKHBsYXllcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWZXJicy5QVVNIOlxuICAgICAgICAgICAgdGhpcy5wdXNoQWN0aW9uKHBsYXllcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWZXJicy5VU0U6XG4gICAgICAgICAgICB0aGlzLnVzZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuU1BFQUs6XG4gICAgICAgICAgICB0aGlzLnNwZWFrQWN0aW9uKHBsYXllcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWZXJicy5HSVZFOlxuICAgICAgICAgICAgdGhpcy5naXZlQWN0aW9uKHBsYXllcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93ICdFUlJPUiwgdW5rbm93biBhY3Rpb24gJyArIHZlcmI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgaW52ZW50b3J5SW1hZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pbnZlbnRvcnlJbWFnZUlkIHx8IHRoaXMub3B0aW9ucy5zcHJpdGVJZDtcbiAgICB9XG5cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zcHJpdGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmlzSW5JbnZlbnRvcnkpIHtcbiAgICAgICAgICAgIGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKS5yZW1vdmUodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNZXRob2RzIHRoYXQgY2FuIGJlIG92ZXJ3cml0dGVuIGluIHN1YmNsYXNzZXNcbiAgICBnZXRGcmFtZUZvckludmVudG9yeSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25TdGF0ZUNoYW5nZSgpOiB2b2lkIHt9O1xuICAgIHByb3RlY3RlZCBhcHBseU1vZGlmaWVyKCk6IHZvaWQge307XG5cbiAgICBwcm90ZWN0ZWQgZ29Ub0FjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB0YWtlQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5waWNrYWJsZSkge1xuICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSBpZih0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBhbHJlYWR5IGhhdmUgaXQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubGV0UGxheWVyQ29tZUFuZFRha2VJdChwbGF5ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxldFBsYXllckNvbWVBbmRUYWtlSXQocGxheWVyOiBQbGF5ZXIpIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLlRBS0VfT0JKRUNULCB0aGlzKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICAvL1RPRE86IGNoZWNrIGlmIHRoZXJlIGFyZSBsb29rIG9wdGlvbnNcbiAgICAgICAgcGxheWVyLnNheSgnVGhhdCBpcyBwcmV0dHkgbmVhdCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvcGVuQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdUaGF0IGNhbm5vdCBiZSBvcGVuZWQnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY2xvc2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ1RoYXQgY2Fubm90IGJlIGNsb3NlZCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwdXNoQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdJIGNhbm5vdCBtb3ZlIHRoYXQnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdJIGRvIG5vdCBrbm93IGhvdyB0byB1c2UgdGhhdCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzcGVha0FjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnSSB3b3VsZG5cXCd0IGtub3cgd2hhdCB0byBzYXknKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2l2ZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnSSBjYW5ub3QgZG8gdGhhdCcpO1xuICAgIH1cblxuXG4gICAgLy9NZXRob2RzIHRoYXQgc2hvdWxkbid0IGJlIG92ZXJyaWRlblxuICAgIHByaXZhdGUgYWRkVG9JbnZlbnRvcnkoKTogdm9pZCB7XG4gICAgICAgIGlmKGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgYWN0aXZlSW52ZW50b3J5LmdldEFjdGl2ZUludmVudG9yeSgpLmFkZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlU3ByaXRlKCk6IHZvaWQge1xuICAgICAgICBsZXQgbGF5ZXJUb1VzZXIgPSB1aUxheWVycy5iYWNrZ3JvdW5kT2JqZWN0cztcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pc0ZvcmVncm91bmQpIHtcbiAgICAgICAgICAgIGxheWVyVG9Vc2VyID0gdWlMYXllcnMuZm9yZWdyb3VuZE9iamVjdHM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zcHJpdGUgPSBsYXllclRvVXNlci5jcmVhdGUoXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMueCxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy55LFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNwcml0ZUlkXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYoIXRoaXMub3B0aW9ucy5qdXN0RGVjb3JhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGUuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmV2ZW50cy5vbklucHV0RG93bi5hZGQodGhpcy5vbkNsaWNrLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmV2ZW50cy5vbklucHV0T3Zlci5hZGQodGhpcy5vbklucHV0T3ZlciwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5ldmVudHMub25JbnB1dE91dC5hZGQodGhpcy5vbklucHV0T3V0LCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25DbGljaygpOiB2b2lkIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuU0VMRUNUX1RISU5HLCB0aGlzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uSW5wdXRPdmVyKCkge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5DVVJTT1JfT1ZFUl9USElORywgdGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbklucHV0T3V0KCkge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5DVVJTT1JfT1VUX1RISU5HLCB0aGlzKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBJbnZlbnRvcnkgfSBmcm9tICcuLi9tb2RlbHMvSW52ZW50b3J5JztcblxuY2xhc3MgQWN0aXZlSW52ZW50b3J5IHtcblxuICAgIHByaXZhdGUgY2hhbmdlT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTtcbiAgICBwcml2YXRlIGFjdGl2ZUludmVudG9yeTogSW52ZW50b3J5O1xuICAgIHByaXZhdGUgb25JbnZlbnRvcnlDaGFuZ2VCaW5kZWQ6IElDYWxsYmFjaztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNoYW5nZU9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLm9uSW52ZW50b3J5Q2hhbmdlQmluZGVkID0gKChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyhuZXdWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldEFjdGl2ZUludmVudG9yeShuZXdJbnZlbnRvcnk6IEludmVudG9yeSk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlbW92ZU9sZEludmVudG9yeUV2ZW50cygpO1xuICAgICAgICB0aGlzLmFjdGl2ZUludmVudG9yeSA9IG5ld0ludmVudG9yeTtcbiAgICAgICAgdGhpcy5jcmVhdGVOZXdJbnZlbnRvcnlFdmVudHMoKTtcbiAgICAgICAgdGhpcy5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgIH1cblxuICAgIGdldEFjdGl2ZUludmVudG9yeSgpOiBJbnZlbnRvcnkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVJbnZlbnRvcnk7XG4gICAgfVxuXG4gICAgcmVmcmVzaCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgIH1cblxuICAgIHN1YnNjcmliZVRvQ2hhbmdlKGNhbGxiYWNrOiBJQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLmFjdGl2ZUludmVudG9yeSk7XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5yZW1vdmVPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVPbGRJbnZlbnRvcnlFdmVudHMoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUludmVudG9yeSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVJbnZlbnRvcnkudW5zdWJzY3JpYmVUb0NoYW5nZSh0aGlzLm9uSW52ZW50b3J5Q2hhbmdlQmluZGVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTmV3SW52ZW50b3J5RXZlbnRzKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVJbnZlbnRvcnkpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSW52ZW50b3J5LnN1YnNjcmliZVRvQ2hhbmdlKHRoaXMub25JbnZlbnRvcnlDaGFuZ2VCaW5kZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3RpZnlTdWJzY3JpYmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyh0aGlzLmFjdGl2ZUludmVudG9yeSk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgYWN0aXZlSW52ZW50b3J5ID0gbmV3IEFjdGl2ZUludmVudG9yeSgpOyIsImNsYXNzIFBoYXNlckdhbWUge1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50VmFsdWU6IFBoYXNlci5HYW1lO1xuXG4gICAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBQaGFzZXIuR2FtZSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpOiBQaGFzZXIuR2FtZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRWYWx1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBwaGFzZXJHYW1lID0gbmV3IFBoYXNlckdhbWUoKTsiLCJpbXBvcnQgeyBTY2VuZSB9IGZyb20gJy4uL21vZGVscy9TY2VuZSc7XG5cbmNsYXNzIFNjZW5lc1NldCB7XG4gICAgcHJpdmF0ZSBzY2VuZXM6IE1hcDxzdHJpbmcsIFNjZW5lPjtcbiAgICBwcml2YXRlIF9jdXJyZW50U2NlbmU6IFNjZW5lO1xuXG4gICAgaW5pdChzY2VuZXM6IEFycmF5PFNjZW5lPik6IHZvaWQge1xuICAgICAgICB0aGlzLnNjZW5lcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgc2NlbmVzLmZvckVhY2goKHNjZW5lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lcy5zZXQoc2NlbmUuaWQsIHNjZW5lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRTY2VuZSgpOiBTY2VuZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50U2NlbmU7XG4gICAgfVxuXG4gICAgc2V0Q3VycmVudFNjZW5lQnlJZChuZXdDdXJyZW50U2NlbmVJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveUN1cnJlbnRTY2VuZSgpO1xuICAgICAgICBsZXQgc2NlbmUgPSB0aGlzLnNjZW5lcy5nZXQobmV3Q3VycmVudFNjZW5lSWQpO1xuICAgICAgICBpZiAoIXNjZW5lKSB7XG4gICAgICAgICAgICB0aHJvdyBgRVJST1IgdHJ5aW5nIHRvIGluaXQgc2NlbmUgdGhhdCBpcyBub3QgcHJlc2VudCAoJHtuZXdDdXJyZW50U2NlbmVJZH0pYDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBzY2VuZTtcbiAgICAgICAgc2NlbmUuc2hvdygpO1xuICAgIH1cblxuICAgIGdvVG9TY2VuZVdpdGhJZChzY2VuZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kZXN0cm95Q3VycmVudFNjZW5lKCk7XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudFNjZW5lQnlJZChzY2VuZUlkKTtcbiAgICB9ICAgXG5cbiAgICBwcml2YXRlIGRlc3Ryb3lDdXJyZW50U2NlbmUoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50U2NlbmUpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2NlbmVzID0gbmV3IFNjZW5lc1NldCgpO1xuIiwiaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuaW1wb3J0IHsgR2VuZXJpY0hpZ2hsaWdodGVkVGhpbmcgfSBmcm9tICcuLi9tb2RlbHMvR2VuZXJpY0hpZ2hsaWdodGVkVGhpbmcnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgc2VsZWN0ZWRWZXJiIH0gZnJvbSAnLi9TZWxlY3RlZFZlcmIuc2luZ2xldG9uJztcbmltcG9ydCB7IFZlcmJzSW5mbyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5cbmNsYXNzIFNlbGVjdGVkVGhpbmcgZXh0ZW5kcyBHZW5lcmljSGlnaGxpZ2h0ZWRUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oXG4gICAgICAgICAgICBBY3Rpb25zLkFDVElPTl9BUFBMSUVELFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5oaWdobGlnaHRUaGluZyhudWxsKVxuICAgICAgICApO1xuICAgIH1cbn1cblxuY2xhc3MgSGlnaGxpZ2h0ZWRUaGluZyBleHRlbmRzIEdlbmVyaWNIaWdobGlnaHRlZFRoaW5nIHtcblxuICAgIHByb3RlY3RlZCBvbkN1cnNvck92ZXJUaGluZyh0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFzZWxlY3RlZFZlcmIudmVyYikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCB2ZXJiSW5mbyA9IFZlcmJzSW5mby5nZXQoc2VsZWN0ZWRWZXJiLnZlcmIpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZFZlcmIudmVyYiAmJiB2ZXJiSW5mby5zaW5nbGVPYmplY3QpIHtcblxuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRUaGluZyh0aGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRWZXJiLnZlcmIgJiYgIXZlcmJJbmZvLnNpbmdsZU9iamVjdCkge1xuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRUaGluZ0Zvck11bHRpcGxlT2JqZWN0VmVyYih0aGluZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhpZ2hsaWdodFRoaW5nRm9yTXVsdGlwbGVPYmplY3RWZXJiKHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZykge1xuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRUaGluZyh0aGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpbmcuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nKHRoaW5nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbkN1cnNvck91dFRoaW5nKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nKG51bGwpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGhpZ2hsaWdodGVkVGhpbmcgPSBuZXcgSGlnaGxpZ2h0ZWRUaGluZygpO1xuZXhwb3J0IGNvbnN0IHNlbGVjdGVkVGhpbmcgPSBuZXcgU2VsZWN0ZWRUaGluZygpO1xuIiwiaW1wb3J0IHsgVmVyYnMgfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSAsIElDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzL09ic2VydmFibGUnO1xuXG5jbGFzcyBTZWxlY3RlZFZlcmIge1xuXG4gICAgcHJpdmF0ZSBvbkNoYW5nZU9ic2VydmFibGU6IE9ic2VydmFibGU7XG4gICAgcHJpdmF0ZSBzZWxlY3RlZFZlcmI6IFZlcmJzO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKFxuICAgICAgICAgICAgQWN0aW9ucy5TRUxFQ1RfVkVSQixcbiAgICAgICAgICAgIG5ld1ZlcmIgPT4gdGhpcy5zZWxlY3ROZXdWZXJiKG5ld1ZlcmIpXG4gICAgICAgICk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oXG4gICAgICAgICAgICBBY3Rpb25zLkFDVElPTl9BUFBMSUVELFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5yZXNldCgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ2V0IHZlcmIoKTogVmVyYnMge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFZlcmI7XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZS5yZWdpc3Rlck9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5zZWxlY3RlZFZlcmIpO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZS5yZW1vdmVPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgbm90aWZ5U3Vic2NyaWJlcnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyh0aGlzLnNlbGVjdGVkVmVyYik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZWxlY3ROZXdWZXJiKG5ld1ZlcmI6IFZlcmJzKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRWZXJiID0gbmV3VmVyYjtcbiAgICAgICAgdGhpcy5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VsZWN0TmV3VmVyYihWZXJicy5HT19UTyk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RlZFZlcmIgPSBuZXcgU2VsZWN0ZWRWZXJiKCk7XG4iLCJpbXBvcnQgeyBJTGFiZWxzICB9IGZyb20gJy4vTGFiZWxzLnN0b3JlJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTEFCRUxTOiBJTGFiZWxzID0ge1xuICAgICdlcyc6IHtcbiAgICAgICAgJ0Nsb3NlJzogJ0NlcnJhcicsXG4gICAgICAgICdHaXZlJzogJ0RhcicsXG4gICAgICAgICdHbyB0byc6ICdJciBhJyxcbiAgICAgICAgJ0xvb2sgYXQnOiAnTWlyYXInLFxuICAgICAgICAnT3Blbic6ICdBYnJpcicsXG4gICAgICAgICdQdXNoJzogJ0VtcHVqYXInLFxuICAgICAgICAnUmVmbGVjdCc6ICdQZW5zYXInLFxuICAgICAgICAnU3BlYWsgdG8nOiAnSGFibGFyIGEnLFxuICAgICAgICAnVGFrZSc6ICdDb2dlcicsXG4gICAgICAgICd0byc6ICdhJyxcbiAgICAgICAgJ1VzZSc6ICdVc2FyJyxcbiAgICAgICAgJ3dpdGgnOiAnY29uJ1xuICAgIH0sXG4gICAgJ2VuJzoge1xuICAgICAgICAnQ2xvc2UnOiAnQ2xvc2UnLFxuICAgICAgICAnR2l2ZSc6ICdHaXZlJyxcbiAgICAgICAgJ0dvIHRvJzogJ0dvIHRvJyxcbiAgICAgICAgJ0xvb2sgYXQnOiAnTG9vayBhdCcsXG4gICAgICAgICdPcGVuJzogJ09wZW4nLFxuICAgICAgICAnUHVzaCc6ICdQdXNoJyxcbiAgICAgICAgJ1JlZmxlY3QnOiAnUmVmbGVjdCcsXG4gICAgICAgICdTcGVhayB0byc6ICdTcGVhayB0bycsXG4gICAgICAgICdUYWtlJzogJ1BpY2sgdXAnLFxuICAgICAgICAndG8nOiAndG8nLFxuICAgICAgICAnVXNlJzogJ1VzZScsXG4gICAgICAgICd3aXRoJzogJ3dpdGgnXG4gICAgfVxufTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuaW1wb3J0IHsgREVGQVVMVF9MQUJFTFMgfSBmcm9tICcuL0RlZmF1bHRMYWJlbHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElMYWJlbHNQZXJMYW5ndWFnZSB7XG4gICAgW2luZGV4IDogc3RyaW5nXSA6IHN0cmluZztcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxhYmVscyB7XG4gICAgW2luZGV4IDogc3RyaW5nXSA6IElMYWJlbHNQZXJMYW5ndWFnZTtcbn07XG5cbmNvbnN0IERFRkFVTFRfTEFOR1VBR0UgPSAnZW4nO1xuXG5jbGFzcyBMYWJlbHNTdG9yZSB7XG4gICAgcHJpdmF0ZSBsYWJlbHM6IE1hcDxzdHJpbmcsIElMYWJlbHNQZXJMYW5ndWFnZT47XG4gICAgcHJpdmF0ZSBjdXJyZW50TGFuZ3VhZ2U6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxhYmVscyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50TGFuZ3VhZ2UgPSBERUZBVUxUX0xBTkdVQUdFO1xuICAgIH1cblxuICAgIGFkZExhYmVscyhsYWJlbHNUb0FkZDogSUxhYmVscyk6IHZvaWQge1xuICAgICAgICBmb3IobGV0IGtleSBpbiBsYWJlbHNUb0FkZCkge1xuICAgICAgICAgICAgdGhpcy5hZGRMYWJlbHNGb3JMYW5ndWFnZShrZXksIGxhYmVsc1RvQWRkW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGFiZWwobGFiZWxOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgYWxsTGFuZ3VhZ2VMYWJlbHMgPSB0aGlzLmxhYmVscy5nZXQodGhpcy5jdXJyZW50TGFuZ3VhZ2UpO1xuICAgICAgICBpZiAoIWFsbExhbmd1YWdlTGFiZWxzKSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IHRyeWluZyB0byBnZXQgbGFiZWwgZnJvbSBub24gZXhpc3RpbmcgbGFuZ3VhZ2UnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbGxMYW5ndWFnZUxhYmVsc1tsYWJlbE5hbWVdIHx8IGxhYmVsTmFtZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZExhYmVsc0Zvckxhbmd1YWdlKGxhbmd1YWdlOiBzdHJpbmcsIGxhYmVsczogSUxhYmVsc1Blckxhbmd1YWdlKTogdm9pZCB7XG4gICAgICAgIGxldCBwcmV2aW91c0xhYmVscyA9IHRoaXMubGFiZWxzLmdldChsYW5ndWFnZSkgfHwge307XG4gICAgICAgIGxldCBuZXdMYWJlbHMgPSBPYmplY3QuYXNzaWduKHt9LCBwcmV2aW91c0xhYmVscywgbGFiZWxzKTtcbiAgICAgICAgdGhpcy5sYWJlbHMuc2V0KGxhbmd1YWdlLCBuZXdMYWJlbHMpO1xuICAgIH1cbn1cbmxldCBsYWJlbHNTdG9yZVNpbmdsZXRvbiA9IG5ldyBMYWJlbHNTdG9yZSgpO1xuXG5sYWJlbHNTdG9yZVNpbmdsZXRvbi5hZGRMYWJlbHMoPElMYWJlbHM+IERFRkFVTFRfTEFCRUxTKTtcblxuZXhwb3J0IGNvbnN0IGxhYmVsID0gKChsYWJlbElkOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gbGFiZWxzU3RvcmVTaW5nbGV0b24uZ2V0TGFiZWwobGFiZWxJZCk7XG59KTtcblxuZXhwb3J0IGNvbnN0IGxhYmVsc1N0b3JlID0gbGFiZWxzU3RvcmVTaW5nbGV0b247XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuXG5leHBvcnQgZW51bSBWZXJicyB7XG4gICAgR09fVE8gPSAxLFxuICAgIExPT0ssXG4gICAgQ0xPU0UsXG4gICAgUFVTSCxcbiAgICBUQUtFLFxuICAgIFVTRSxcbiAgICBTUEVBSyxcbiAgICBHSVZFLFxuICAgIE9QRU5cbn07XG5cbmludGVyZmFjZSBJVmVyYkluZm8ge1xuICAgIGxhYmVsOiBzdHJpbmcsXG4gICAgc2luZ2xlT2JqZWN0OiBCb29sZWFuLFxuICAgIGNvbmp1Y3Rpb24/OiBzdHJpbmdcbn1cblxubGV0IHZlcmJzSW5mbyA6IE1hcDxWZXJicywgSVZlcmJJbmZvPiA9IG5ldyBNYXAoKTtcblxudmVyYnNJbmZvLnNldChWZXJicy5HT19UTywge1xuICAgIGxhYmVsOiAnR28gdG8nLFxuICAgIHNpbmdsZU9iamVjdDogdHJ1ZVxufSk7XG52ZXJic0luZm8uc2V0KFZlcmJzLkxPT0ssIHtcbiAgICBsYWJlbDogJ0xvb2sgYXQnLFxuICAgIHNpbmdsZU9iamVjdDogdHJ1ZVxufSk7XG52ZXJic0luZm8uc2V0KFZlcmJzLkNMT1NFLCB7XG4gICAgbGFiZWw6ICdDbG9zZScsXG4gICAgc2luZ2xlT2JqZWN0OiB0cnVlXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuUFVTSCwge1xuICAgIGxhYmVsOiAnUHVzaCcsXG4gICAgc2luZ2xlT2JqZWN0OiB0cnVlXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuVEFLRSwge1xuICAgIGxhYmVsOiAnVGFrZScsXG4gICAgc2luZ2xlT2JqZWN0OiB0cnVlXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuVVNFLCB7XG4gICAgbGFiZWw6ICdVc2UnLFxuICAgIHNpbmdsZU9iamVjdDogZmFsc2UsXG4gICAgY29uanVjdGlvbjogJ3dpdGgnXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuU1BFQUssIHtcbiAgICBsYWJlbDogJ1NwZWFrIHRvJyxcbiAgICBzaW5nbGVPYmplY3Q6IHRydWVcbn0pO1xudmVyYnNJbmZvLnNldChWZXJicy5HSVZFLCB7XG4gICAgbGFiZWw6ICdHaXZlJyxcbiAgICBzaW5nbGVPYmplY3Q6IGZhbHNlLFxuICAgIGNvbmp1Y3Rpb246ICd0bydcbn0pO1xudmVyYnNJbmZvLnNldChWZXJicy5PUEVOLCB7XG4gICAgbGFiZWw6ICdPcGVuJyxcbiAgICBzaW5nbGVPYmplY3Q6IHRydWVcbn0pO1xuZXhwb3J0IGNvbnN0IFZlcmJzSW5mbyA9IHZlcmJzSW5mbztcbiIsImltcG9ydCB7IFZlcmJzLCBWZXJic0luZm8gfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBwaGFzZXIgfSBmcm9tICcuLi8uLi9QaGFzZXInO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBsYWJlbCB9IGZyb20gJy4uL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuL1N0eWxlJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcbmltcG9ydCB7IFRleHRXaXRoU2hhZG93IH0gZnJvbSAnLi9UZXh0V2l0aFNoYWRvdyc7XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25CdXR0b24ge1xuXG4gICAgcHJpdmF0ZSBzY3JlZW5Qb3NpdGlvbjogSVBvaW50O1xuICAgIHByaXZhdGUgYnV0dG9uOiBQaGFzZXIuQnV0dG9uO1xuICAgIHByaXZhdGUgdGV4dDogVGV4dFdpdGhTaGFkb3c7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZlcmI6IFZlcmJzLCBwb3NpdGlvbjogSVBvaW50KSB7XG4gICAgICAgIHRoaXMuc2NyZWVuUG9zaXRpb24gPSBsYXlvdXQuZ2V0VmVyYkJ1dHRvblBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5jcmVhdGVCdXR0b24oKTtcbiAgICAgICAgdGhpcy5jcmVhdGVUZXh0KCk7XG4gICAgfVxuXG4gICAgaGlnaGxpZ2h0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJ1dHRvbi5mcmFtZSA9IDI7XG4gICAgfVxuXG4gICAgdW5oaWdobGlnaHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnV0dG9uLmZyYW1lID0gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5idXR0b24gPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC5idXR0b24oXG4gICAgICAgICAgICB0aGlzLnNjcmVlblBvc2l0aW9uLngsXG4gICAgICAgICAgICB0aGlzLnNjcmVlblBvc2l0aW9uLnksXG4gICAgICAgICAgICAnQlVUVE9OX0JHJyxcbiAgICAgICAgICAgIHRoaXMub25DbGljayxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIHVpTGF5ZXJzLnZlcmJCdXR0b25zLmFkZCh0aGlzLmJ1dHRvbik7XG4gICAgICAgIHRoaXMuYnV0dG9uLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlVGV4dCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHRleHQgPSBsYWJlbChWZXJic0luZm8uZ2V0KHRoaXMudmVyYikubGFiZWwpO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnNjcmVlblBvc2l0aW9uLnggKyBsYXlvdXQuVkVSQl9CVVRUT05fV0lEVEggLyAyLFxuICAgICAgICAgICAgeTogdGhpcy5zY3JlZW5Qb3NpdGlvbi55ICsgbGF5b3V0LlZFUkJfQlVUVE9OX0hFSUdIVCAvIDJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50ZXh0ID0gbmV3IFRleHRXaXRoU2hhZG93KHtcbiAgICAgICAgICAgIGluaXRpYWxUZXh0OiB0ZXh0LFxuICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgZml4ZWRUb0NhbWVyYTogdHJ1ZSxcbiAgICAgICAgICAgIGxheWVyOiB1aUxheWVycy52ZXJiQnV0dG9ucyxcbiAgICAgICAgICAgIGFuY2hvcjoge1xuICAgICAgICAgICAgICAgIHg6IDAuNSxcbiAgICAgICAgICAgICAgICB5OiAwLjVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIG9uQ2xpY2soKTogdm9pZCB7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLlNFTEVDVF9WRVJCLCB0aGlzLnZlcmIpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHN0eWxlIH0gZnJvbSAnLi9TdHlsZSc7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25MaW5lIH0gZnJvbSAnLi4vbW9kZWxzL0NvbnZlcnNhdGlvbkxpbmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IFRleHRXaXRoU2hhZG93IH0gZnJvbSAnLi9UZXh0V2l0aFNoYWRvdyc7XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJzYXRpb25MaW5lVUkge1xuXG4gICAgcHJpdmF0ZSBjbGlja09ic2VydmFibGU6IE9ic2VydmFibGU7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbjogSVBvaW50O1xuICAgIHByaXZhdGUgYnV0dG9uOiBQaGFzZXIuQnV0dG9uO1xuICAgIHByaXZhdGUgdGV4dDogVGV4dFdpdGhTaGFkb3c7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBjb252ZXJzYXRpb25MaW5lOiBDb252ZXJzYXRpb25MaW5lLFxuICAgICAgICBwcml2YXRlIGxpbmVUZXh0OiBzdHJpbmcsXG4gICAgICAgIHByaXZhdGUgaW5kZXg6IG51bWJlcikge1xuXG4gICAgICAgIGlmICghdGhpcy5jb252ZXJzYXRpb25MaW5lKSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IGNvbnZlcnNhdGlvbiBsaW5lIFVJLCBubyBjb252ZXJzYXRpb25MaW5lIHByb3ZpZGVkJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMubGluZVRleHQpIHtcbiAgICAgICAgICAgIHRocm93ICdFUlJPUjogY29udmVyc2F0aW9uIGxpbmUgVUksIG5vIHRleHQgcHJvdmlkZWQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbmRleCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRocm93ICdFUlJPUjogY29udmVyc2F0aW9uIGxpbmUgVUksIG5vIGluZGV4IHByb3ZpZGVkJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xpY2tPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IGxheW91dC5nZXRQb3NpdGlvbkZvckNvbnZlcnNhdGlvbkxpbmUodGhpcy5pbmRleCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQnV0dG9uKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlVGV4dCgpO1xuICAgIH1cblxuICAgIHN1YnNjcmliZVRvQ2xpY2soY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsaWNrT2JzZXJ2YWJsZS5yZWdpc3Rlck9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmJ1dHRvbi5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMudGV4dC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCdXR0b24oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gcGhhc2VyR2FtZS52YWx1ZS5hZGQuYnV0dG9uKFxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54LFxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55LFxuICAgICAgICAgICAgJ0NPTlZFUlNBVElPTl9MSU5FX0JHJyxcbiAgICAgICAgICAgIHRoaXMub25DbGljayxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIHVpTGF5ZXJzLmNvbnZlcnNhdGlvbi5hZGQodGhpcy5idXR0b24pO1xuICAgICAgICB0aGlzLmJ1dHRvbi5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVRleHQoKTogdm9pZCB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMucG9zaXRpb24ueCArIGxheW91dC5DT05WRVJTQVRJT05fTElORV9QQURESU5HX1gsXG4gICAgICAgICAgICB5OiB0aGlzLnBvc2l0aW9uLnkgKyBsYXlvdXQuQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19ZXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudGV4dCA9IG5ldyBUZXh0V2l0aFNoYWRvdyh7XG4gICAgICAgICAgICBpbml0aWFsVGV4dDogdGhpcy5saW5lVGV4dCxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgIGZpeGVkVG9DYW1lcmE6IHRydWUsXG4gICAgICAgICAgICBsYXllcjogdWlMYXllcnMuY29udmVyc2F0aW9uXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25DbGljaygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGlja09ic2VydmFibGUubm90aWZ5T2JzZXJ2ZXJzKHRoaXMuY29udmVyc2F0aW9uTGluZSk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyB1aUJsb2NrZXIgfSBmcm9tICcuLi8uLi9lbmdpbmUvdWkvVUlCbG9ja2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBDb252ZXJzYXRpb24gfSBmcm9tICcuLi9tb2RlbHMvQ29udmVyc2F0aW9uJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbkxpbmUgfSBmcm9tICcuLi9tb2RlbHMvQ29udmVyc2F0aW9uTGluZSc7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25MaW5lVUkgfSBmcm9tICcuL0NvbnZlcnNhdGlvbkxpbmVVSSc7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcblxuZXhwb3J0IGNsYXNzIENvbnZlcnNhdGlvblVJIHtcblxuICAgIHByaXZhdGUgYmFja2dyb3VuZDogUGhhc2VyLlNwcml0ZTtcbiAgICBwcml2YXRlIGxpbmVzOiBBcnJheTxDb252ZXJzYXRpb25MaW5lVUk+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbikge1xuICAgICAgICB1aUJsb2NrZXIuYmxvY2soKTtcbiAgICAgICAgdGhpcy5saW5lcyA9IFtdO1xuICAgICAgICB0aGlzLmNyZWF0ZUJhY2tncm91bmQoKTtcbiAgICAgICAgdGhpcy5jb252ZXJzYXRpb24ub25TdGF0ZUNoYW5nZSgobmV3U3RhdGUpID0+IHRoaXMudXBkYXRlKG5ld1N0YXRlKSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kZXN0cm95T2xkTGluZXMoKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmRlc3Ryb3koKTtcbiAgICAgICAgdWlCbG9ja2VyLnVuYmxvY2soKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJhY2tncm91bmQoKTogdm9pZCB7XG4gICAgICAgIGxldCBsYXlvdXRTdGFydFBvc2l0aW9uID0gbGF5b3V0LlVJX1NUQVJUX1BPU0lUSU9OO1xuXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IHVpTGF5ZXJzLmNvbnZlcnNhdGlvbi5jcmVhdGUoXG4gICAgICAgICAgICBsYXlvdXRTdGFydFBvc2l0aW9uLngsXG4gICAgICAgICAgICBsYXlvdXRTdGFydFBvc2l0aW9uLnksXG4gICAgICAgICAgICAnVUlfQ09OVkVSU0FUSU9OX0JHJ1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQuYW5jaG9yLnNldFRvKDAsIDApO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGUobmV3U3RhdGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3lPbGRMaW5lcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZU5ld0xpbmVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVOZXdMaW5lcygpOiB2b2lkIHtcbiAgICAgICAgbGV0IG5ld0xpbmVzID0gdGhpcy5jb252ZXJzYXRpb24uZ2V0TGluZXMoKTtcbiAgICAgICAgbmV3TGluZXMuZm9yRWFjaCgobmV3TGluZSwgaW5kZXgpID0+IHRoaXMuY3JlYXRlTGluZShuZXdMaW5lLCBpbmRleCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTGluZShsaW5lOiBDb252ZXJzYXRpb25MaW5lLCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGxldCBuZXdVSUxpbmUgPSBuZXcgQ29udmVyc2F0aW9uTGluZVVJKFxuICAgICAgICAgICAgbGluZSxcbiAgICAgICAgICAgIHRoaXMuY29udmVyc2F0aW9uLmdldFRleHRGb3JMaW5lKGxpbmUpLFxuICAgICAgICAgICAgaW5kZXgpO1xuICAgICAgICBuZXdVSUxpbmUuc3Vic2NyaWJlVG9DbGljayhjbGlja2VkTGluZWQgPT4gdGhpcy5saW5lQ2xpY2tlZChjbGlja2VkTGluZWQpKTtcbiAgICAgICAgdGhpcy5saW5lcy5wdXNoKG5ld1VJTGluZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsaW5lQ2xpY2tlZChsaW5lOiBDb252ZXJzYXRpb25MaW5lKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveU9sZExpbmVzKCk7XG4gICAgICAgIHRoaXMuY29udmVyc2F0aW9uLmFwcGx5TGluZShsaW5lKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lPbGRMaW5lcygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5saW5lcy5mb3JFYWNoKGxpbmUgPT4gbGluZS5kZXN0cm95KCkpO1xuICAgICAgICB0aGlzLmxpbmVzID0gW107XG4gICAgfVxuXG4gICAgXG59XG4iLCJpbXBvcnQgeyBzZWxlY3RlZFRoaW5nLCBoaWdobGlnaHRlZFRoaW5nIH0gZnJvbSAnLi4vc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IHNlbGVjdGVkVmVyYiB9IGZyb20gJy4uL3N0YXRlL1NlbGVjdGVkVmVyYi5zaW5nbGV0b24nO1xuaW1wb3J0IHsgVGV4dFdpdGhTaGFkb3cgfSBmcm9tICcuL1RleHRXaXRoU2hhZG93JztcbmltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBsYWJlbCB9IGZyb20gJy4uL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuaW1wb3J0IHsgVmVyYnMsIFZlcmJzSW5mbyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5cbmV4cG9ydCBjbGFzcyBDdXJyZW50QWN0aW9uVUkge1xuXG4gICAgcHJpdmF0ZSB0ZXh0OiBUZXh0V2l0aFNoYWRvdztcbiAgICBwcml2YXRlIGN1cnJlbnRUZXh0OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVUZXh0KCk7XG4gICAgICAgIHNlbGVjdGVkVmVyYi5zdWJzY3JpYmVUb0NoYW5nZShuZXdWZXJiID0+IHRoaXMudXBkYXRlVGV4dCgpKTtcbiAgICAgICAgaGlnaGxpZ2h0ZWRUaGluZy5zdWJzY3JpYmVUb0NoYW5nZShuZXdUaGluZyA9PiB0aGlzLnVwZGF0ZVRleHQoKSk7XG4gICAgICAgIHNlbGVjdGVkVGhpbmcuc3Vic2NyaWJlVG9DaGFuZ2UobmV3VGhpbmcgPT4gdGhpcy51cGRhdGVUZXh0KCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlVGV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gbmV3IFRleHRXaXRoU2hhZG93KHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBsYXlvdXQuQ1VSUkVOVF9BQ1RJT05fUE9TSVRJT04sXG4gICAgICAgICAgICBsYXllcjogdWlMYXllcnMudmVyYkJ1dHRvbnMsXG4gICAgICAgICAgICBmaXhlZFRvQ2FtZXJhOiB0cnVlXG4gICAgICAgIH0pO1xufVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVUZXh0KCk6IHZvaWQge1xuICAgICAgICBsZXQgbmV3VGV4dCA9IHRoaXMuZ2V0VmVyYlRleHQoKSArIHRoaXMuZ2V0U2VsZWN0ZWRUaGluZ1RleHQoKSArICcgJyArIHRoaXMuZ2V0VGhpbmdUZXh0KCk7XG4gICAgICAgIHRoaXMuc2V0VGV4dChuZXdUZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFRleHQobmV3VGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUZXh0ICE9PSBuZXdUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0ID0gbmV3VGV4dDtcbiAgICAgICAgICAgIHRoaXMudGV4dC5zZXRUZXh0KG5ld1RleHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRWZXJiVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgdmVyYiA9IHNlbGVjdGVkVmVyYi52ZXJiO1xuICAgICAgICByZXR1cm4gbGFiZWwoVmVyYnNJbmZvLmdldCh2ZXJiKS5sYWJlbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaGluZ1RleHQoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHRoaW5nID0gaGlnaGxpZ2h0ZWRUaGluZy50aGluZztcbiAgICAgICAgbGV0IHRleHQgPSAnJztcbiAgICAgICAgaWYgKHRoaW5nICYmIHRoaW5nLm5hbWUpIHtcbiAgICAgICAgICAgIHRleHQgPSBsYWJlbCh0aGluZy5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNlbGVjdGVkVGhpbmdUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGxldCB2ZXJiID0gc2VsZWN0ZWRWZXJiLnZlcmI7XG4gICAgICAgIGxldCB2ZXJiSW5mbyA9IFZlcmJzSW5mby5nZXQodmVyYik7XG4gICAgICAgIGlmICghdmVyYkluZm8uc2luZ2xlT2JqZWN0ICYmIHNlbGVjdGVkVGhpbmcudGhpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiAnICcgKyBsYWJlbChzZWxlY3RlZFRoaW5nLnRoaW5nLm5hbWUpICsgJyAnICsgbGFiZWwodmVyYkluZm8uY29uanVjdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IFZlcmJzVUkgfSBmcm9tICcuL1ZlcmJzVUknO1xuaW1wb3J0IHsgQ3VycmVudEFjdGlvblVJIH0gZnJvbSAnLi9DdXJyZW50QWN0aW9uVUknO1xuaW1wb3J0IHsgSW52ZW50b3J5VUkgfSBmcm9tICcuL0ludmVudG9yeVVJJztcbmltcG9ydCB7IFJlZmxlY3RCdXR0b24gfSBmcm9tICcuL1JlZmxlY3RCdXR0b24nO1xuXG5leHBvcnQgY2xhc3MgR3JhcGhpY1VJIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNyZWF0ZUJhY2tncm91bmQoKTtcbiAgICAgICAgbmV3IFZlcmJzVUkoKTtcbiAgICAgICAgbmV3IEN1cnJlbnRBY3Rpb25VSSgpO1xuICAgICAgICBuZXcgSW52ZW50b3J5VUkoKTtcbiAgICAgICAgbmV3IFJlZmxlY3RCdXR0b24oKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJhY2tncm91bmQoKTogdm9pZCB7XG4gICAgICAgIGxldCBsYXlvdXRTdGFydFBvc2l0aW9uID0gbGF5b3V0LlVJX1NUQVJUX1BPU0lUSU9OO1xuICAgICAgICBsZXQgYmFja2dyb3VuZCA9IHVpTGF5ZXJzLmd1aUJhY2tncm91bmQuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICBsYXlvdXRTdGFydFBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgICAgIGxheW91dFN0YXJ0UG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICAgICAgJ1VJX0JHJyk7XG4gICAgICAgIGJhY2tncm91bmQuYW5jaG9yLnNldFRvKDAsIDApO1xuICAgICAgICBiYWNrZ3JvdW5kLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgICAgICBiYWNrZ3JvdW5kLmlucHV0RW5hYmxlZCA9IHRydWU7XG5cbiAgICB9XG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcblxuaW50ZXJmYWNlIElJbnZlbnRvcnlJdGVtVUlPcHRpb25zIHtcbiAgICB0aGluZzogVGhpbmcsXG4gICAgaW5kZXg6IG51bWJlclxufVxuXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5SXRlbVVJIHtcblxuICAgIHByaXZhdGUgc3ByaXRlOiBQaGFzZXIuU3ByaXRlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJSW52ZW50b3J5SXRlbVVJT3B0aW9ucykge1xuICAgICAgICB0aGlzLmNyZWF0ZVNwcml0ZSgpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3ByaXRlLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNwcml0ZSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gbGF5b3V0LmdldFBvc2l0aW9uRm9yVUlJbnZlbnRvcnlJdGVtKHRoaXMub3B0aW9ucy5pbmRleCk7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gdWlMYXllcnMudmVyYkJ1dHRvbnMuY3JlYXRlKFxuICAgICAgICAgICAgcG9zaXRpb24ueCxcbiAgICAgICAgICAgIHBvc2l0aW9uLnksXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMudGhpbmcuaW52ZW50b3J5SW1hZ2VcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnNwcml0ZS5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNwcml0ZS5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZSA9IHRoaXMub3B0aW9ucy50aGluZy5nZXRGcmFtZUZvckludmVudG9yeSgpO1xuXG4gICAgICAgIHRoaXMuc3ByaXRlLmV2ZW50cy5vbklucHV0RG93bi5hZGQodGhpcy5vbkNsaWNrLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCh0aGlzLm9uSW5wdXRPdmVyLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKHRoaXMub25JbnB1dE91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5TRUxFQ1RfVEhJTkcsIHRoaXMub3B0aW9ucy50aGluZyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbklucHV0T3ZlcigpOiB2b2lkIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuQ1VSU09SX09WRVJfVEhJTkcsIHRoaXMub3B0aW9ucy50aGluZyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbklucHV0T3V0KCk6IHZvaWQge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5DVVJTT1JfT1VUX1RISU5HLCB0aGlzLm9wdGlvbnMudGhpbmcpO1xuICAgIH1cblxufSIsImltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBJbnZlbnRvcnlJdGVtVUkgfSBmcm9tICcuL0ludmVudG9yeUl0ZW1VSSc7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi9zdGF0ZS9BY3RpdmVJbnZlbnRvcnkuc2luZ2xldG9uJztcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4uL21vZGVscy9JbnZlbnRvcnknO1xuXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5VUkge1xuXG4gICAgcHJpdmF0ZSBpdGVtczogU2V0PEludmVudG9yeUl0ZW1VST47XG4gICAgcHJpdmF0ZSBjdXJyZW50SW52ZW50b3J5OiBJbnZlbnRvcnk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVCYWNrZ3JvdW5kKCk7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIGFjdGl2ZUludmVudG9yeS5zdWJzY3JpYmVUb0NoYW5nZSgobmV3SW52ZW50b3J5KSA9PiB0aGlzLmludmVudG9yeUNoYW5nZWQobmV3SW52ZW50b3J5KSlcbiAgICB9XG5cbiAgICAvLyByZWZyZXNoKCkge1xuICAgIC8vICAgICB0aGlzLmludmVudG9yeUNoYW5nZWQoYWN0aXZlSW52ZW50b3J5LmdldEFjdGl2ZUludmVudG9yeSgpKTtcbiAgICAvLyB9XG5cbiAgICBwcml2YXRlIGludmVudG9yeUNoYW5nZWQobmV3SW52ZW50b3J5OiBJbnZlbnRvcnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdXJyZW50SW52ZW50b3J5ID0gbmV3SW52ZW50b3J5O1xuICAgICAgICB0aGlzLmNyZWF0ZUl0ZW1zKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgICAgICBsZXQgbGF5b3V0U3RhcnRQb3NpdGlvbiA9IGxheW91dC5JTlZFTlRPUllfU1RBUlRfUE9TSVRJT047XG5cbiAgICAgICAgbGV0IGJhY2tncm91bmQgPSB1aUxheWVycy52ZXJiQnV0dG9ucy5jcmVhdGUoXG4gICAgICAgICAgICAgICAgICAgIGxheW91dFN0YXJ0UG9zaXRpb24ueCxcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0U3RhcnRQb3NpdGlvbi55LFxuICAgICAgICAgICAgICAgICAgICAnVUlfSU5WX0JHJyk7XG4gICAgICAgIGJhY2tncm91bmQuYW5jaG9yLnNldFRvKDAsIDApO1xuICAgICAgICBiYWNrZ3JvdW5kLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlSXRlbXMoKTogdm9pZCB7XG4gICAgICAgIC8vVE9ETzogaGFuZGxlIG9yZGVyIGFuZCBtb3JlIHRoYW4gNiBpbnYgaXRlbXNcbiAgICAgICAgdGhpcy5kZXN0cm95UHJldkl0ZW1zKCk7XG5cbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgZm9yIChsZXQgdGhpbmcgb2YgdGhpcy5jdXJyZW50SW52ZW50b3J5Lml0ZW1zKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zLmFkZChcbiAgICAgICAgICAgICAgICBuZXcgSW52ZW50b3J5SXRlbVVJKHtcbiAgICAgICAgICAgICAgICAgICAgdGhpbmc6IHRoaW5nLFxuICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lQcmV2SXRlbXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IGl0ZW0uZGVzdHJveSgpKTtcbiAgICAgICAgdGhpcy5pdGVtcy5jbGVhcigpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcblxuY29uc3QgVkVSQl9CVVRUT05fSEVJR0hUOiBudW1iZXIgPSAzNjtcbmNvbnN0IENVUlJFTlRfQUNUSU9OX0lORk9fSEVJR0hUID0gNDA7XG5jb25zdCBWRVJCX0JVVFRPTl9XSURUSCA9IDE1MDtcbmNvbnN0IFJFRkxFQ1RfQlVUVE9OX1dJRFRIID0gVkVSQl9CVVRUT05fV0lEVEg7XG5cbmNvbnN0IENVUlJFTlRfQUNUSU9OX0lORk9fUEFERElOR19YID0gNTtcbmNvbnN0IENVUlJFTlRfQUNUSU9OX0lORk9fUEFERElOR19ZID0gNztcblxuY29uc3QgVkVSQlNfUk9XUyA9IDM7XG5jb25zdCBWRVJCX0NPTFVNTlMgPSAzO1xuXG5jb25zdCBJTlZfUk9XUyA9IDI7XG5jb25zdCBJTlZfQ09MVU1OUyA9IDM7XG5jb25zdCBJTlZfSVRFTV9XSURUSCA9IDEzNjtcbmNvbnN0IElOVl9JVEVNX0hFSUdIVCA9IDUyO1xuXG5jb25zdCBDT05WRVJTQVRJT05fTElORV9IRUlHSFQgPSBDVVJSRU5UX0FDVElPTl9JTkZPX0hFSUdIVDtcbmNvbnN0IENPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWCA9IDU7XG5jb25zdCBDT05WRVJTQVRJT05fTElORV9QQURESU5HX1kgPSA2O1xuXG5jbGFzcyBMYXlvdXRNYW5hZ2VyIHtcblxuICAgIExBWU9VVF9XSURUSDogbnVtYmVyID0gMTA2NjtcbiAgICBMQVlPVVRfSEVJR0hUOiBudW1iZXIgPSA2MDA7XG4gICAgTEFZT1VUX1pPT006IG51bWJlciA9IDI7XG4gICAgXG4gICAgTEFZT1VUX0RFRkFVTFRfTUFSR0lOOiBudW1iZXIgPSAxO1xuICAgIFZFUkJfQlVUVE9OX01BUkdJTjogbnVtYmVyID0gdGhpcy5MQVlPVVRfREVGQVVMVF9NQVJHSU47XG5cbiAgICBnZXQgV0lEVEgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuTEFZT1VUX1dJRFRIIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgSEVJR0hUKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkxBWU9VVF9IRUlHSFQgLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBWRVJCU19IRUlHSFQoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IG1hcmdpblkgPSAoVkVSQlNfUk9XUyArIDEpICogdGhpcy5WRVJCX0JVVFRPTl9NQVJHSU47XG4gICAgICAgIGxldCBoZWlnaHRZID0gVkVSQlNfUk9XUyAqIHRoaXMuVkVSQl9CVVRUT05fSEVJR0hUO1xuICAgICAgICByZXR1cm4gbWFyZ2luWSArIGhlaWdodFk7XG4gICAgfVxuXG4gICAgZ2V0IFZFUkJfQlVUVE9OX0hFSUdIVCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gVkVSQl9CVVRUT05fSEVJR0hUIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgVkVSQlNfWV9TVEFSVCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5IRUlHSFQgLSB0aGlzLlZFUkJTX0hFSUdIVDtcbiAgICB9XG5cbiAgICBnZXQgQ1VSUkVOVF9BQ1RJT05fSU5GT19IRUlHSFQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIENVUlJFTlRfQUNUSU9OX0lORk9fSEVJR0hUIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgVUlfU1RBUlRfUE9TSVRJT04oKTogSVBvaW50IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiB0aGlzLlZFUkJTX1lfU1RBUlQgLSB0aGlzLkNVUlJFTlRfQUNUSU9OX0lORk9fSEVJR0hUXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IFZFUkJfQlVUVE9OX1dJRFRIKCkge1xuICAgICAgICByZXR1cm4gVkVSQl9CVVRUT05fV0lEVEggLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBSRUZMRUNUX0JVVFRPTl9XSURUSCgpIHtcbiAgICAgICAgcmV0dXJuIFJFRkxFQ1RfQlVUVE9OX1dJRFRIIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgQ1VSUkVOVF9BQ1RJT05fUE9TSVRJT04oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBDVVJSRU5UX0FDVElPTl9JTkZPX1BBRERJTkdfWCxcbiAgICAgICAgICAgIHk6IHRoaXMuSEVJR0hUIC0gdGhpcy5WRVJCU19IRUlHSFQgLSB0aGlzLkNVUlJFTlRfQUNUSU9OX0lORk9fSEVJR0hUICsgQ1VSUkVOVF9BQ1RJT05fSU5GT19QQURESU5HX1lcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXQgSU5WRU5UT1JZX1NUQVJUX1BPU0lUSU9OKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRWZXJiQnV0dG9uUG9zaXRpb24oe1xuICAgICAgICAgICAgeDogVkVSQl9DT0xVTU5TLFxuICAgICAgICAgICAgeTogMFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgSU5WX0lURU1fV0lEVEgoKSB7XG4gICAgICAgIHJldHVybiBJTlZfSVRFTV9XSURUSCAvIHRoaXMuTEFZT1VUX1pPT007XG4gICAgfVxuXG4gICAgZ2V0IElOVl9JVEVNX0hFSUdIVCgpIHtcbiAgICAgICAgcmV0dXJuIElOVl9JVEVNX0hFSUdIVCAvIHRoaXMuTEFZT1VUX1pPT007XG4gICAgfVxuXG4gICAgZ2V0VmVyYkJ1dHRvblBvc2l0aW9uKHZlcmJHcmlkUG9zaXRpb246IElQb2ludCk6IElQb2ludCB7XG4gICAgICAgIGxldCBtYXJnaW5YID0gKHZlcmJHcmlkUG9zaXRpb24ueCArIDIpICogdGhpcy5WRVJCX0JVVFRPTl9NQVJHSU47XG4gICAgICAgIGxldCBwb3NpdGlvblggPSB0aGlzLlJFRkxFQ1RfQlVUVE9OX1dJRFRIICsgKHZlcmJHcmlkUG9zaXRpb24ueCAqIHRoaXMuVkVSQl9CVVRUT05fV0lEVEgpO1xuXG4gICAgICAgIGxldCBtYXJnaW5ZID0gKHZlcmJHcmlkUG9zaXRpb24ueSArIDEpICogdGhpcy5WRVJCX0JVVFRPTl9NQVJHSU47XG4gICAgICAgIGxldCBwb3NpdGlvblkgPSB2ZXJiR3JpZFBvc2l0aW9uLnkgKiB0aGlzLlZFUkJfQlVUVE9OX0hFSUdIVDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogbWFyZ2luWCArIHBvc2l0aW9uWCxcbiAgICAgICAgICAgIHk6IHRoaXMuVkVSQlNfWV9TVEFSVCArIG1hcmdpblkgKyBwb3NpdGlvbllcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvbkZvclVJSW52ZW50b3J5SXRlbShpbmRleDogbnVtYmVyKTogSVBvaW50IHtcbiAgICAgICAgbGV0IHtjb2x1bW4sIHJvd30gPSB0aGlzLmdldEludmVudG9yeUl0ZW1Qb3NpdGlvbihpbmRleCk7XG5cbiAgICAgICAgbGV0IGluaXRpYWxQb3NpdGlvbiA9IHRoaXMuSU5WRU5UT1JZX1NUQVJUX1BPU0lUSU9OO1xuXG4gICAgICAgIGxldCBtYXJnaW5YID0gKGNvbHVtbiArIDEpICogdGhpcy5WRVJCX0JVVFRPTl9NQVJHSU47XG4gICAgICAgIGxldCBwb3NpdGlvblggPSBjb2x1bW4gKiB0aGlzLklOVl9JVEVNX1dJRFRIO1xuXG4gICAgICAgIGxldCBtYXJnaW5ZID0gKHJvdyArIDEpICogdGhpcy5WRVJCX0JVVFRPTl9NQVJHSU47XG4gICAgICAgIGxldCBwb3NpdGlvblkgPSByb3cgKiB0aGlzLklOVl9JVEVNX0hFSUdIVDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogbWFyZ2luWCArIHBvc2l0aW9uWCArIGluaXRpYWxQb3NpdGlvbi54LFxuICAgICAgICAgICAgeTogbWFyZ2luWSArIHBvc2l0aW9uWSArIGluaXRpYWxQb3NpdGlvbi55XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0UmVmbGVjdEJ1dHRvblBvc2l0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5MQVlPVVRfREVGQVVMVF9NQVJHSU4sXG4gICAgICAgICAgICB5OiB0aGlzLlZFUkJTX1lfU1RBUlQgKyB0aGlzLkxBWU9VVF9ERUZBVUxUX01BUkdJTlxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFJlZmxlY3RCdXR0b25TaXplKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLlZFUkJTX0hFSUdIVCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLlJFRkxFQ1RfQlVUVE9OX1dJRFRIXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IENPTlZFUlNBVElPTl9MSU5FX0hFSUdIVCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQ09OVkVSU0FUSU9OX0xJTkVfSEVJR0hUIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19YKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBDT05WRVJTQVRJT05fTElORV9QQURESU5HX1g7XG4gICAgfVxuXG4gICAgZ2V0IENPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19ZO1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9uRm9yQ29udmVyc2F0aW9uTGluZShpbmRleDogbnVtYmVyKTogSVBvaW50IHtcbiAgICAgICAgbGV0IG1hcmdpblkgPSAoaW5kZXggKyAxKSAqIHRoaXMuTEFZT1VUX0RFRkFVTFRfTUFSR0lOO1xuICAgICAgICBsZXQgcG9zaXRpb25ZID0gdGhpcy5DT05WRVJTQVRJT05fTElORV9IRUlHSFQgKiBpbmRleDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMuTEFZT1VUX0RFRkFVTFRfTUFSR0lOLFxuICAgICAgICAgICAgeTogdGhpcy5VSV9TVEFSVF9QT1NJVElPTi55ICsgbWFyZ2luWSArIHBvc2l0aW9uWVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW52ZW50b3J5SXRlbVBvc2l0aW9uKGluZGV4OiBudW1iZXIpOiB7Y29sdW1uOiBudW1iZXIsIHJvdzogbnVtYmVyfSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBpbmRleCAlIElOVl9DT0xVTU5TO1xuICAgICAgICBsZXQgcm93ID0gTWF0aC5mbG9vcihpbmRleCAvIElOVl9DT0xVTU5TKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbHVtbjogY29sdW1uLFxuICAgICAgICAgICAgcm93OiByb3dcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBsYXlvdXQgPSBuZXcgTGF5b3V0TWFuYWdlcigpOyIsImltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBsYWJlbCB9IGZyb20gJy4uL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuaW1wb3J0IHsgVGV4dFdpdGhTaGFkb3cgfSBmcm9tICcuL1RleHRXaXRoU2hhZG93JztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcblxuZXhwb3J0IGNsYXNzIFJlZmxlY3RCdXR0b24ge1xuICAgIHByaXZhdGUgcG9zaXRpb246IElQb2ludDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbGF5b3V0LmdldFJlZmxlY3RCdXR0b25Qb3NpdGlvbigpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlQnV0dG9uKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlVGV4dCgpO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCdXR0b24oKTogdm9pZCB7XG4gICAgICAgIGxldCBidXR0b24gPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC5idXR0b24oXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLngsXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnksXG4gICAgICAgICAgICAnQlVUVE9OX0JHJyxcbiAgICAgICAgICAgIHRoaXMub25DbGljayxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIGJ1dHRvbi5zY2FsZS55ID0gMztcbiAgICAgICAgdWlMYXllcnMudmVyYkJ1dHRvbnMuYWRkKGJ1dHRvbik7XG4gICAgICAgIGJ1dHRvbi5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVRleHQoKTogdm9pZCB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMucG9zaXRpb24ueCArIGxheW91dC5nZXRSZWZsZWN0QnV0dG9uU2l6ZSgpLndpZHRoIC8gMixcbiAgICAgICAgICAgIHk6IHRoaXMucG9zaXRpb24ueSArIGxheW91dC5nZXRSZWZsZWN0QnV0dG9uU2l6ZSgpLmhlaWdodCAvIDJcbiAgICAgICAgfTtcbiAgICAgICAgbmV3IFRleHRXaXRoU2hhZG93KHtcbiAgICAgICAgICAgIGluaXRpYWxUZXh0OiBsYWJlbCgnUmVmbGVjdCcpLFxuICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgZml4ZWRUb0NhbWVyYTogdHJ1ZSxcbiAgICAgICAgICAgIGxheWVyOiB1aUxheWVycy52ZXJiQnV0dG9ucyxcbiAgICAgICAgICAgIGFuY2hvcjoge1xuICAgICAgICAgICAgICAgIHg6IDAuNSxcbiAgICAgICAgICAgICAgICB5OiAwLjVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5SRUZMRUNUKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vbW9kZWxzL1BsYXllcic7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBUZXh0SW5TY2VuZSB9IGZyb20gJy4vVGV4dEluU2NlbmUnO1xuXG5pbnRlcmZhY2UgSVNwZWVjaEJ1YmJsZU9wdGlvbnMge1xuICAgIG93bmVyOiBQbGF5ZXIgfCBUaGluZ1xufVxuXG5leHBvcnQgY2xhc3MgU3BlZWNoQnViYmxlIHtcblxuICAgIHByaXZhdGUgdGV4dEJlaW5nU2FpZDogVGV4dEluU2NlbmU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9wdGlvbnM6IElTcGVlY2hCdWJibGVPcHRpb25zKSB7fVxuXG4gICAgc2F5KHRleHQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAvL1RPRE8gaGFuZGxlIGFuaW1hdGlvbnNcbiAgICAgICAgdGhpcy5kZXN0cm95UHJldlRleHQoKTtcbiAgICAgICAgdGhpcy50ZXh0QmVpbmdTYWlkID0gbmV3IFRleHRJblNjZW5lKHtcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5vcHRpb25zLm93bmVyLmdldFBvc2l0aW9uT25Ub3AoKSxcbiAgICAgICAgICAgIGF1dG9EZXN0cm95OiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0QmVpbmdTYWlkLnByb21pc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95UHJldlRleHQoKTp2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudGV4dEJlaW5nU2FpZCkge1xuICAgICAgICAgICAgdGhpcy50ZXh0QmVpbmdTYWlkLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMudGV4dEJlaW5nU2FpZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJleHBvcnQgY29uc3Qgc3R5bGUgPSBPYmplY3QuZnJlZXplKHtcbiAgICBERUZBVUxUX0ZPTlRfU0laRTogOCxcbiAgICBGT05UX1NIQURPV19YOiAxLFxuICAgIEZPTlRfU0hBRE9XX1k6IDEsXG4gICAgQ0FNRVJBX0VBU0lOR19GQUNUT1I6IDAuMDI1XG59KTtcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9teS10eXBpbmdzL2xpYi5lczYuZC50c1wiIC8+XG5pbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IHN0eWxlIH0gZnJvbSAnLi9TdHlsZSc7XG5pbXBvcnQgeyBUZXh0V2l0aFNoYWRvdyB9IGZyb20gJy4vVGV4dFdpdGhTaGFkb3cnO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBzY2VuZXMgfSBmcm9tICcuLi9zdGF0ZS9TY2VuZXMuc2luZ2xldG9uJztcblxuaW50ZXJmYWNlIElUZXh0SW5TY2VuZU9wdGlvbnMge1xuICAgIHRleHQ6IHN0cmluZyxcbiAgICBwb3NpdGlvbjogSVBvaW50LFxuICAgIHRpbWVQZXJMZXR0ZXI/OiBudW1iZXIsXG4gICAgbWluRGVzdHJveVRpbWU/OiBudW1iZXIsXG4gICAgd2lkdGg/OiBudW1iZXIsXG4gICAgYXV0b0Rlc3Ryb3k/OiBCb29sZWFuLFxuICAgIGFuY2hvcj86IElQb2ludCxcbiAgICBwYWRkaW5nSW5TY3JlZW4/OiBudW1iZXJcbn1cblxuY29uc3QgREVGQVVMVF9URVhUX09QVElPTlMgPSBPYmplY3QuZnJlZXplKHtcbiAgICB0aW1lUGVyTGV0dGVyOiA1MCxcbiAgICBtaW5EZXN0cm95VGltZTogMjAwMCxcbiAgICB0ZXh0OiAnJyxcbiAgICBwb3NpdGlvbjogeyB4OiAxMDAsIHk6IDEwMH0sXG4gICAgd2lkdGg6IDMwLFxuICAgIGF1dG9EZXN0cm95OiBmYWxzZSxcbiAgICBhbmNob3I6IHsgeDogMCwgeTogMH0sXG4gICAgcGFkZGluZ0luU2NyZWVuOiA1XG59KTtcblxuZXhwb3J0IGNsYXNzIFRleHRJblNjZW5lIHtcblxuICAgIHByaXZhdGUgY3VycmVudFRleHQ6IFRleHRXaXRoU2hhZG93O1xuICAgIHByaXZhdGUgcHJvbWlzZVRvRGVzdHJveTogUHJvbWlzZTxhbnk+O1xuICAgIHByaXZhdGUgcmVzb2x2ZUNhbGxiYWNrOiAoKSA9PiB2b2lkO1xuICAgIHByaXZhdGUgdGltZW91dFRvRGVzdHJveTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJVGV4dEluU2NlbmVPcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfVEVYVF9PUFRJT05TLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvRGVzdHJveSkge1xuICAgICAgICAgICAgdGhpcy5wcm9taXNlVG9EZXN0cm95ID0gdGhpcy5hdXRvRGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHByb21pc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb21pc2VUb0Rlc3Ryb3k7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRleHQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVzb2x2ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVDYWxsYmFjaygpO1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVUZXh0KCk6IHZvaWQge1xuICAgICAgICBsZXQgdGV4dEluTGluZXMgPSB0aGlzLmFkZExpbmVzU2VwYXJhdG9ycyh0aGlzLm9wdGlvbnMudGV4dCwgdGhpcy5vcHRpb25zLndpZHRoKTtcbiAgICAgICAgbGV0IHBvc2l0aW9uWCA9IHRoaXMuZ2V0WFBvc2l0aW9uRm9yVGV4dCh0ZXh0SW5MaW5lcyk7XG4gICAgICAgIGxldCBwb3NpdGlvblkgPSB0aGlzLmdldFlQb3NpdGlvbkZvclRleHQodGV4dEluTGluZXMpO1xuXG4gICAgICAgIHRoaXMuY3VycmVudFRleHQgPSBuZXcgVGV4dFdpdGhTaGFkb3coe1xuICAgICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiBwb3NpdGlvblgsXG4gICAgICAgICAgICAgICAgeTogcG9zaXRpb25ZXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGF5ZXI6IHVpTGF5ZXJzLnRleHRJblNjZW5lLFxuICAgICAgICAgICAgaW5pdGlhbFRleHQ6IHRleHRJbkxpbmVzLFxuICAgICAgICAgICAgYWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgYW5jaG9yOiB0aGlzLm9wdGlvbnMuYW5jaG9yXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkTGluZXNTZXBhcmF0b3JzKHRleHQ6IHN0cmluZywgbWF4TGluZUxlbmd0aDogbnVtYmVyKTogc3RyaW5nIHtcblxuICAgICAgICBsZXQgd29yZHMgPSB0ZXh0LnNwbGl0KCcgJyk7XG4gICAgICAgIGxldCBsaW5lcyA9IFsnJ107XG4gICAgICAgIGxldCBjdXJyZW50TGluZSA9IDA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy9JZiBhIHdvcmQgaXMgdG9vIGJpZyBmb3IgdGhpcyBsaW5lLCBhZGQgdG8gbmV4dFxuICAgICAgICAgICAgaWYgKChsaW5lc1tjdXJyZW50TGluZV0ubGVuZ3RoICsgd29yZHNbaV0ubGVuZ3RoKSA+PSBtYXhMaW5lTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbGluZXMucHVzaCgnJyArIHdvcmRzW2ldKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSArKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGluZXNbY3VycmVudExpbmVdICs9ICcgJyArIHdvcmRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFhQb3NpdGlvbkZvclRleHQodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGxvbmdlc3RMaW5lTGVuZ3RoID0gdGhpcy5nZXRMb25nZXN0TGluZUxlbmd0aCh0ZXh0KTtcbiAgICAgICAgbGV0IG1heFdpZHRoID0gbG9uZ2VzdExpbmVMZW5ndGggKiBzdHlsZS5ERUZBVUxUX0ZPTlRfU0laRTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMub3B0aW9ucy5wb3NpdGlvbi54IC0gKG1heFdpZHRoIC8gMik7XG5cbiAgICAgICAgcmVzdWx0ID0gTWF0aC5tYXgocmVzdWx0LCB0aGlzLm9wdGlvbnMucGFkZGluZ0luU2NyZWVuKTtcbiAgICAgICAgcmVzdWx0ID0gTWF0aC5taW4ocmVzdWx0LCB0aGlzLmdldE1heFhGb3JUZXh0KG1heFdpZHRoKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE1heFhGb3JUZXh0KHRleHRXaWR0aDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHNjZW5lV2lkdGggPSBzY2VuZXMuY3VycmVudFNjZW5lLnNjZW5lQm91bmRzLndpZHRoO1xuICAgICAgICByZXR1cm4gc2NlbmVXaWR0aCAtIHRoaXMub3B0aW9ucy5wYWRkaW5nSW5TY3JlZW4gLSB0ZXh0V2lkdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRZUG9zaXRpb25Gb3JUZXh0KHRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGxldCBsaW5lcyA9IHRleHQuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICAgICAgbGV0IHRvdGFsSGVpZ2h0ID0gbGluZXMgKiBzdHlsZS5ERUZBVUxUX0ZPTlRfU0laRTtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wb3NpdGlvbi55IC0gdG90YWxIZWlnaHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRMb25nZXN0TGluZUxlbmd0aCh0ZXh0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBsZXQgbGluZXMgPSB0ZXh0LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgbGV0IG1heExlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1heExlbmd0aCA9IE1hdGgubWF4KG1heExlbmd0aCwgbGluZXNbaV0ubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF4TGVuZ3RoO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV0b0Rlc3Ryb3koKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbGV0IGRlZmVycmVkID0gbmV3IFByb21pc2UoKHJlc29sdmVDYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlQ2FsbGJhY2sgPSByZXNvbHZlQ2FsbGJhY2s7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdGltZVRvRGVzdHJveSA9IHRoaXMuZ2V0VGltZVRvRGVzdHJveUZyb21UZXh0KHRoaXMub3B0aW9ucy50ZXh0KTtcbiAgICAgICAgdGhpcy50aW1lb3V0VG9EZXN0cm95ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmRlc3Ryb3koKSwgdGltZVRvRGVzdHJveSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRpbWVUb0Rlc3Ryb3lGcm9tVGV4dCh0ZXh0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBsZXQgdGltZVRvRGVzdHJveSA9IHRoaXMub3B0aW9ucy50aW1lUGVyTGV0dGVyICogdGV4dC5sZW5ndGg7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLm9wdGlvbnMubWluRGVzdHJveVRpbWUsIHRpbWVUb0Rlc3Ryb3kpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuL1N0eWxlJztcblxuaW50ZXJmYWNlIElUZXh0V2l0aFNoYWRvd09wdGlvbnMge1xuICAgIHBvc2l0aW9uOiBJUG9pbnQsXG4gICAgbGF5ZXI6IFBoYXNlci5Hcm91cCxcbiAgICBpbml0aWFsVGV4dD86IHN0cmluZyxcbiAgICBmaXhlZFRvQ2FtZXJhPzogQm9vbGVhbixcbiAgICBhbmNob3I/OiBJUG9pbnQsXG4gICAgYWxpZ24/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIFRleHRXaXRoU2hhZG93IHtcbiAgICBwcml2YXRlIHNoYWRvd1RleHQ6IFBoYXNlci5CaXRtYXBUZXh0O1xuICAgIHByaXZhdGUgdGV4dDogUGhhc2VyLkJpdG1hcFRleHQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9wdGlvbnM6IElUZXh0V2l0aFNoYWRvd09wdGlvbnMpIHtcbiAgICAgICAgbGV0IGFuY2hvcjogSVBvaW50ID0gdGhpcy5vcHRpb25zLmFuY2hvciB8fCB7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogMFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNoYWRvd1RleHQgPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC5iaXRtYXBUZXh0KFxuICAgICAgICAgICAgMSArIG9wdGlvbnMucG9zaXRpb24ueCxcbiAgICAgICAgICAgIDEgKyBvcHRpb25zLnBvc2l0aW9uLnksXG4gICAgICAgICAgICAnRk9OVF8zMl9CTEFDSycsXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuaW5pdGlhbFRleHQgfHwgJycsXG4gICAgICAgICAgICBzdHlsZS5ERUZBVUxUX0ZPTlRfU0laRVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnNoYWRvd1RleHQuYW5jaG9yLnNldFRvKGFuY2hvci54LCBhbmNob3IueSk7XG4gICAgICAgIHRoaXMuc2hhZG93VGV4dC5maXhlZFRvQ2FtZXJhID0gISF0aGlzLm9wdGlvbnMuZml4ZWRUb0NhbWVyYTtcblxuICAgICAgICBpZih0aGlzLm9wdGlvbnMuYWxpZ24pIHtcbiAgICAgICAgICAgIHRoaXMuc2hhZG93VGV4dC5hbGlnbiA9IHRoaXMub3B0aW9ucy5hbGlnbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5sYXllci5hZGQodGhpcy5zaGFkb3dUZXh0KTtcblxuICAgICAgICB0aGlzLnRleHQgPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC5iaXRtYXBUZXh0KFxuICAgICAgICAgICAgb3B0aW9ucy5wb3NpdGlvbi54LFxuICAgICAgICAgICAgb3B0aW9ucy5wb3NpdGlvbi55LFxuICAgICAgICAgICAgJ0ZPTlRfMzJfV0hJVEUnLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmluaXRpYWxUZXh0IHx8ICcnLFxuICAgICAgICAgICAgc3R5bGUuREVGQVVMVF9GT05UX1NJWkVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy50ZXh0LmFuY2hvci5zZXRUbyhhbmNob3IueCwgYW5jaG9yLnkpO1xuICAgICAgICB0aGlzLnRleHQuZml4ZWRUb0NhbWVyYSA9ICEhdGhpcy5vcHRpb25zLmZpeGVkVG9DYW1lcmE7XG5cbiAgICAgICAgaWYodGhpcy5vcHRpb25zLmFsaWduKSB7XG4gICAgICAgICAgICB0aGlzLnRleHQuYWxpZ24gPSB0aGlzLm9wdGlvbnMuYWxpZ247XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wdGlvbnMubGF5ZXIuYWRkKHRoaXMudGV4dCk7XG4gICAgfVxuXG4gICAgc2V0VGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zaGFkb3dUZXh0LnNldFRleHQodGV4dCk7XG4gICAgICAgIHRoaXMudGV4dC5zZXRUZXh0KHRleHQpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMudGV4dCkge1xuICAgICAgICAgICAgdGhpcy50ZXh0LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5zaGFkb3dUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnNoYWRvd1RleHQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5zaGFkb3dUZXh0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHBoYXNlciB9IGZyb20gJy4uLy4uL1BoYXNlcic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5cbmNsYXNzIFVJQmxvY2tlciB7XG5cbiAgICBvdmVybGF5OiBQaGFzZXIuSW1hZ2U7XG5cbiAgICBibG9jaygpIHtcbiAgICAgICAgbGV0IGdyYXBoaWNPdmVybGF5ID0gbmV3IFBoYXNlci5HcmFwaGljcyhwaGFzZXJHYW1lLnZhbHVlLCAwLCAwKTtcbiAgICAgICAgZ3JhcGhpY092ZXJsYXkuYmVnaW5GaWxsKDB4MDAwMDAwLCAwLjApO1xuICAgICAgICBncmFwaGljT3ZlcmxheS5kcmF3UmVjdCgwLCAwLCBsYXlvdXQuV0lEVEgsIGxheW91dC5VSV9TVEFSVF9QT1NJVElPTi55KTtcbiAgICAgICAgZ3JhcGhpY092ZXJsYXkuZW5kRmlsbCgpO1xuXG4gICAgICAgIHRoaXMub3ZlcmxheSA9IHBoYXNlckdhbWUudmFsdWUuYWRkLmltYWdlKDAsIDAsIGdyYXBoaWNPdmVybGF5LmdlbmVyYXRlVGV4dHVyZSgpKTtcbiAgICAgICAgdGhpcy5vdmVybGF5LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgICAgICB0aGlzLm92ZXJsYXkuaW5wdXRFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB1aUxheWVycy51aUJsb2NrZXIuYWRkKHRoaXMub3ZlcmxheSk7XG4gICAgfVxuXG4gICAgdW5ibG9jaygpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5LmRlc3Ryb3koKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCB1aUJsb2NrZXIgPSBuZXcgVUlCbG9ja2VyKCk7XG5cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9teS10eXBpbmdzL2xpYi5lczYuZC50c1wiIC8+XG5pbXBvcnQgeyBwaGFzZXIgfSBmcm9tICcuLi8uLi9QaGFzZXInO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcblxuZW51bSBVSUxheWVycyB7XG4gICAgQkFDS0dST1VORCxcbiAgICBCQUNLR1JPVU5EX09CSkVDVFMsXG4gICAgUExBWUVSLFxuICAgIEZPUkVHUk9VTkRfT0JKRUNUUyxcbiAgICBGT1JFR1JPVU5ELFxuICAgIFRFWFRfSU5fU0NFTkUsXG4gICAgR1VJX0JBQ0tHUk9VTkQsXG4gICAgVkVSQl9CVVRUT05TLFxuICAgIENPTlZFUlNBVElPTixcbiAgICBVSV9CTE9DS0VSXG59XG5cbmNsYXNzIFVJTGF5ZXJzTWFuYWdlciB7XG5cbiAgICBwcml2YXRlIGdyb3VwczogTWFwPFVJTGF5ZXJzLCBQaGFzZXIuR3JvdXA+O1xuICAgIHByaXZhdGUgaW5pdGlhbGlzZWQ6IEJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByaXZhdGUgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxpc2VkKSB7XG4gICAgICAgICAgICBpZiAoIXBoYXNlckdhbWUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnRVJST1I6IGluaXRpbmcgVUlMYXllcnMgd2hlbiBnYW1lIGlzIHN0aWxsIG5vdCB0aGVyZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUxheWVycyhwaGFzZXJHYW1lLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGlzZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGJhY2tncm91bmQoKTogUGhhc2VyLkdyb3VwIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3Vwcy5nZXQoVUlMYXllcnMuQkFDS0dST1VORCk7XG4gICAgfVxuXG4gICAgZ2V0IGJhY2tncm91bmRPYmplY3RzKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLkJBQ0tHUk9VTkRfT0JKRUNUUyk7XG4gICAgfVxuXG4gICAgZ2V0IHBsYXllcigpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5QTEFZRVIpO1xuICAgIH1cblxuICAgIGdldCBmb3JlZ3JvdW5kT2JqZWN0cygpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5GT1JFR1JPVU5EX09CSkVDVFMpO1xuICAgIH1cblxuICAgIGdldCBmb3JlZ3JvdW5kKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLkZPUkVHUk9VTkQpO1xuICAgIH1cblxuICAgIGdldCB0ZXh0SW5TY2VuZSgpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5URVhUX0lOX1NDRU5FKTtcbiAgICB9XG5cbiAgICBnZXQgZ3VpQmFja2dyb3VuZCgpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5HVUlfQkFDS0dST1VORCk7XG4gICAgfVxuXG4gICAgZ2V0IHZlcmJCdXR0b25zKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLlZFUkJfQlVUVE9OUyk7XG4gICAgfVxuXG4gICAgZ2V0IGNvbnZlcnNhdGlvbigpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5DT05WRVJTQVRJT04pO1xuICAgIH1cblxuICAgIGdldCB1aUJsb2NrZXIoKTogUGhhc2VyLkdyb3VwIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3Vwcy5nZXQoVUlMYXllcnMuVUlfQkxPQ0tFUik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVMYXllcnMoZ2FtZTogUGhhc2VyLkdhbWUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ncm91cHMgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgLy9UT0RPOiBkbyB0aGlzIHdpdGggYSBsb29wXG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5CQUNLR1JPVU5ELCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLkJBQ0tHUk9VTkRfT0JKRUNUUywgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5QTEFZRVIsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuRk9SRUdST1VORF9PQkpFQ1RTLCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLkZPUkVHUk9VTkQsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuVEVYVF9JTl9TQ0VORSwgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5HVUlfQkFDS0dST1VORCwgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5WRVJCX0JVVFRPTlMsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuQ09OVkVSU0FUSU9OLCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLlVJX0JMT0NLRVIsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVpTGF5ZXJzID0gbmV3IFVJTGF5ZXJzTWFuYWdlcigpOyIsImltcG9ydCB7IFZlcmJzIH0gZnJvbSAnLi4vc3RvcmVzL1ZlcmJzLnN0b3JlJztcbmltcG9ydCB7IEFjdGlvbkJ1dHRvbiB9IGZyb20gJy4vQWN0aW9uQnV0dG9uJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vbW9kZWxzL1RoaW5nJztcblxuZXhwb3J0IGNsYXNzIFZlcmJzVUkge1xuXG4gICAgcHJpdmF0ZSBidXR0b25zOiBNYXA8VmVyYnMsIEFjdGlvbkJ1dHRvbj47XG4gICAgcHJpdmF0ZSBoaWdobGlnaHRlZEFjdGlvbjogVmVyYnM7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVCdXR0b25zKCk7XG4gICAgICAgIHRoaXMubGlzdGVuVG9FdmVudHMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5HT19UTyxcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5HT19UTyxcbiAgICAgICAgICAgICAgICAgICAge3g6IDAsIHk6IDB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5MT09LLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLkxPT0ssXG4gICAgICAgICAgICAgICAgICAgIHt4OiAwLCB5OiAxfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5zZXQoXG4gICAgICAgICAgICAgICAgVmVyYnMuR0lWRSxcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5HSVZFLFxuICAgICAgICAgICAgICAgICAgICB7eDogMCwgeTogMn1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLlBVU0gsXG4gICAgICAgICAgICAgICAgbmV3IEFjdGlvbkJ1dHRvbihcbiAgICAgICAgICAgICAgICAgICAgVmVyYnMuUFVTSCxcbiAgICAgICAgICAgICAgICAgICAge3g6IDEsIHk6IDB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5UQUtFLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLlRBS0UsXG4gICAgICAgICAgICAgICAgICAgIHt4OiAxLCB5OiAxfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5zZXQoXG4gICAgICAgICAgICAgICAgVmVyYnMuVVNFLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLlVTRSxcbiAgICAgICAgICAgICAgICB7eDogMSwgeTogMn1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLlNQRUFLLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLlNQRUFLLFxuICAgICAgICAgICAgICAgICAgICB7eDogMiwgeTogMH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLk9QRU4sXG4gICAgICAgICAgICAgICAgbmV3IEFjdGlvbkJ1dHRvbihcbiAgICAgICAgICAgICAgICAgICAgVmVyYnMuT1BFTixcbiAgICAgICAgICAgICAgICAgICAge3g6IDIsIHk6IDF9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5DTE9TRSxcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5DTE9TRSxcbiAgICAgICAgICAgICAgICAgICAge3g6IDIsIHk6IDJ9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxpc3RlblRvRXZlbnRzKCk6IHZvaWQgIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQ1VSU09SX09WRVJfVEhJTkcsXG4gICAgICAgICAgICAodGhpbmcpID0+IHRoaXMuaGlnaGxpZ2h0U2Vjb25kYXJ5QWN0aW9uRm9yVGhpbmcodGhpbmcpXG4gICAgICAgICk7XG5cbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQ1VSU09SX09VVF9USElORyxcbiAgICAgICAgICAgICgpID0+IHRoaXMucmVtb3ZlUHJldmlvdXNseUhpZ2hsaWdodGVkQWN0aW9uKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhpZ2hsaWdodFNlY29uZGFyeUFjdGlvbkZvclRoaW5nKHRoaW5nOiBUaGluZykgOiB2b2lke1xuICAgICAgICB0aGlzLnJlbW92ZVByZXZpb3VzbHlIaWdobGlnaHRlZEFjdGlvbigpO1xuICAgICAgICB0aGlzLmhpZ2hsaWdodGVkQWN0aW9uID0gdGhpbmcuZ2V0UHJlZmVycmVkQWN0aW9uKCk7XG4gICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodGVkQWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnMuZ2V0KHRoaXMuaGlnaGxpZ2h0ZWRBY3Rpb24pLmhpZ2hsaWdodCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVQcmV2aW91c2x5SGlnaGxpZ2h0ZWRBY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodGVkQWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnMuZ2V0KHRoaXMuaGlnaGxpZ2h0ZWRBY3Rpb24pLnVuaGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodGVkQWN0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUsIElDYWxsYmFjayB9IGZyb20gJy4vT2JzZXJ2YWJsZSc7XG5cbmV4cG9ydCBlbnVtIEFjdGlvbnMge1xuICAgIENMSUNLX1NUQUdFLFxuICAgIFNFTEVDVF9WRVJCLFxuICAgIFNFTEVDVF9USElORyxcbiAgICBDVVJTT1JfT1ZFUl9USElORyxcbiAgICBDVVJTT1JfT1VUX1RISU5HLFxuICAgIEFDVElPTl9BUFBMSUVELFxuICAgIFRBS0VfT0JKRUNULFxuICAgIFVQREFURV9JTlZFTlRPUlksXG4gICAgR09fVE9fU0NFTkUsXG4gICAgUkVGTEVDVFxufVxuXG5jbGFzcyBBY3Rpb25EaXNwYXRjaGVyIHtcblxuICAgIHByaXZhdGUgb2JzZXJ2ZXJzUGVyQWN0aW9uOiBNYXA8QWN0aW9ucywgT2JzZXJ2YWJsZT47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnNQZXJBY3Rpb24gPSBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgZXhlY3V0ZShhY3Rpb246IEFjdGlvbnMsIHBhcmFtOiBhbnkgPSB7fSkge1xuICAgICAgICBsZXQgYWN0aW9uT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZSA9IHRoaXMub2JzZXJ2ZXJzUGVyQWN0aW9uLmdldChhY3Rpb24pO1xuICAgICAgICBpZiAoYWN0aW9uT2JzZXJ2YWJsZSkge1xuICAgICAgICAgICAgYWN0aW9uT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnMocGFyYW0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG8oYWN0aW9uOiBBY3Rpb25zLCBjYWxsYmFjazogSUNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBhY3Rpb25PYnNlcnZhYmxlOiBPYnNlcnZhYmxlID0gdGhpcy5vYnNlcnZlcnNQZXJBY3Rpb24uZ2V0KGFjdGlvbik7XG4gICAgICAgIGlmICghYWN0aW9uT2JzZXJ2YWJsZSkge1xuICAgICAgICAgICAgYWN0aW9uT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKCk7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyc1BlckFjdGlvbi5zZXQoYWN0aW9uLCBhY3Rpb25PYnNlcnZhYmxlKTtcbiAgICAgICAgfVxuICAgICAgICBhY3Rpb25PYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFjdGlvbkRpc3BhdGNoZXIgPSBuZXcgQWN0aW9uRGlzcGF0Y2hlcigpOyIsImV4cG9ydCBlbnVtIERpcmVjdGlvbnMge1xuICAgIFVQLFxuICAgIERPV04sXG4gICAgTEVGVCxcbiAgICBSSUdIVFxufTtcblxuZXhwb3J0IGNvbnN0IGdldERpcmVjdGlvbk5hbWUgPSBmdW5jdGlvbihkaXJlY3Rpb246IERpcmVjdGlvbnMpIHtcbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgICBjYXNlIERpcmVjdGlvbnMuVVA6XG4gICAgICAgICAgICByZXR1cm4gJ3VwJztcbiAgICAgICAgY2FzZSBEaXJlY3Rpb25zLkRPV046XG4gICAgICAgICAgICByZXR1cm4gJ2Rvd24nO1xuICAgICAgICBjYXNlIERpcmVjdGlvbnMuTEVGVDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICAgICAgY2FzZSBEaXJlY3Rpb25zLlJJR0hUOlxuICAgICAgICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IGdldHRpbmcgZGlyZWN0aW9uIG5hbWUgb2YgdW5leGlzdGluZyBkaXJlY3Rpb24nO1xuICAgIH1cbn07IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL215LXR5cGluZ3MvbGliLmVzNi5kLnRzXCIgLz5cbmV4cG9ydCBpbnRlcmZhY2UgSUNhbGxiYWNrIHtcbiAgICAobmV3VmFsdWU6IGFueSk6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIE9ic2VydmFibGUge1xuICAgIHByaXZhdGUgb2JzZXJ2ZXJzOiBTZXQ8SUNhbGxiYWNrPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm9ic2VydmVycyA9IG5ldyBTZXQoKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9ic2VydmVyKGNhbGxiYWNrOiBJQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMuYWRkKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZW1vdmVPYnNlcnZlcihjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLmRlbGV0ZShjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgbm90aWZ5T2JzZXJ2ZXJzICh2YWx1ZSA6IGFueSkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMuZm9yRWFjaCgob2JzZXJ2ZXI6IElDYWxsYmFjayk9PiB7XG4gICAgICAgICAgICBvYnNlcnZlcih2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuXG5jbGFzcyBSYW5kb21UZXh0IHtcbiAgICBwcml2YXRlIG9yaWdpbmFsUGhyYXNlczogQXJyYXk8c3RyaW5nPjtcbiAgICBwcml2YXRlIHBocmFzZXM6IEFycmF5PHN0cmluZz47XG4gICAgcHJpdmF0ZSBsYXN0VGV4dDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocGhyYXNlczogQXJyYXk8c3RyaW5nPikge1xuICAgICAgICB0aGlzLm9yaWdpbmFsUGhyYXNlcyA9IHBocmFzZXM7XG4gICAgICAgIHRoaXMuY3JlYXRlU2V0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTZXQoKSB7XG4gICAgICAgIHRoaXMucGhyYXNlcyA9IHRoaXMub3JpZ2luYWxQaHJhc2VzLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmVzdWx0OiBzdHJpbmc7XG5cbiAgICAgICAgaWYgKHRoaXMucGhyYXNlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMucGhyYXNlc1swXTtcbiAgICAgICAgICAgIHRoaXMubGFzdFRleHQgPSByZXN1bHQ7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNldCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcih0aGlzLnBocmFzZXMubGVuZ3RoICogTWF0aC5yYW5kb20oKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5waHJhc2VzW3JhbmRvbUluZGV4XSA9PT0gdGhpcy5sYXN0VGV4dCkge1xuICAgICAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gKHJhbmRvbUluZGV4ICsgMSkgJSB0aGlzLnBocmFzZXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5waHJhc2VzW3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHRoaXMucGhyYXNlcy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy5sYXN0VGV4dCA9IHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuXG5jbGFzcyBSYW5kb21UZXh0RmFjdG9yeSB7XG4gICAgcHJpdmF0ZSBnZW5lcmF0b3JzOiBNYXA8c3RyaW5nLCBSYW5kb21UZXh0PjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3JzID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIGdldFJhbmRvbVRleHQoLi4ucGhyYXNlczogQXJyYXk8c3RyaW5nPik6IHN0cmluZyB7XG4gICAgICAgIGxldCBwaHJhc2VzSWQgPSB0aGlzLmdldElkRnJvbVBocmFzZXMocGhyYXNlcyk7XG4gICAgICAgIGxldCBnZW5lcmF0b3IgPSB0aGlzLmdlbmVyYXRvcnMuZ2V0KHBocmFzZXNJZCk7XG4gICAgICAgIGlmICghZ2VuZXJhdG9yKSB7XG4gICAgICAgICAgICBnZW5lcmF0b3IgPSBuZXcgUmFuZG9tVGV4dChwaHJhc2VzKTtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdG9ycy5zZXQocGhyYXNlc0lkLCBnZW5lcmF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZW5lcmF0b3IuZ2V0UmFuZG9tVGV4dCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SWRGcm9tUGhyYXNlcyhwaHJhc2VzOiBBcnJheTxzdHJpbmc+ID0gW10pOiBzdHJpbmcge1xuICAgICAgICBsZXQgaWQgPSBwaHJhc2VzLmpvaW4oJyMnKTtcbiAgICAgICAgaWYgKGlkID09PSAnJykge1xuICAgICAgICAgICAgaWQgPSAnIyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxufVxuY29uc3QgdGV4dEZhY3RvcnkgPSBuZXcgUmFuZG9tVGV4dEZhY3RvcnkoKTtcbmV4cG9ydCBjb25zdCByYW5kb21UZXh0ID0gKC4uLnBocmFzZXM6IEFycmF5PHN0cmluZz4pID0+IHtcbiAgICByZXR1cm4gdGV4dEZhY3RvcnkuZ2V0UmFuZG9tVGV4dCguLi5waHJhc2VzKTtcbn07IiwiaW50ZXJmYWNlIElJbWFnZXNJbmZvIHtcbiAgICBbaW5kZXggOiBzdHJpbmddIDogc3RyaW5nO1xufTtcblxuaW50ZXJmYWNlIElTcHJpdGVzSW5mbyB7XG4gICAgW2luZGV4IDogc3RyaW5nXSA6IChzdHJpbmd8bnVtYmVyKVtdO1xufTtcblxuaW50ZXJmYWNlIElGb250c0luZm8ge1xuICAgIFtpbmRleCA6IHN0cmluZ10gOiBBcnJheTxzdHJpbmc+O1xufTtcblxuY29uc3QgU1BSSVRFUzogSVNwcml0ZXNJbmZvID0ge1xuICAgIC8vIFVJXG4gICAgJ0JVVFRPTl9CRyc6IFsnaW1hZ2VzL3VpL0JVVFRPTl9CR19TUFJJVEUucG5nJyw3NSwgMTgsIDNdLFxuICAgICdDT05WRVJTQVRJT05fTElORV9CRyc6IFsnaW1hZ2VzL3VpL0NPTlZFUlNBVElPTl9MSU5FX0JHLnBuZycsIDUyOSwgMjBdLFxuXG4gICAgLy8gUExBWUVSXG4gICAgJ0RPQ1RPUlRJTExBX1BMQVlFUl9TUFJJVEUnOiBbJ2ltYWdlcy9wbGF5ZXIvRE9DVE9SVElMTEFfUExBWUVSX1NQUklURS5wbmcnLCA0NCwgNjEsIDIxXSxcbiAgICBcbiAgICAvLyBCQUNLU1RBR0VcbiAgICAnRE9PUl9TUFJJVEUnOiBbJ2ltYWdlcy9iYWNrc3RhZ2UvRE9PUl9TUFJJVEUucG5nJywgNDAsIDYwLCAyXSxcbiAgICAnVkVORElOR19TUFJJVEUnOiBbJ2ltYWdlcy9iYWNrc3RhZ2UvVkVORElOR19TUFJJVEUucG5nJywgMzMsIDU3LCAzXSxcbiAgICAnQkFORF9JTl9TT0ZBX1NQUklURSc6IFsnaW1hZ2VzL2JhY2tzdGFnZS9CQU5EX0lOX1NPRkFfU1BSSVRFLnBuZycsIDExMSwgNzksIDldLFxuICAgICdDQUJMRV9TUFJJVEUnOiBbJ2ltYWdlcy9iYWNrc3RhZ2UvQ0FCTEVfU1BSSVRFLnBuZycsIDE4LCAxMywgMV0sXG4gICAgJ0dMQVNTX1NQUklURSc6IFsnaW1hZ2VzL2JhY2tzdGFnZS9HTEFTU19TUFJJVEUucG5nJywgOSwgOSwgNF0sXG4gICAgJ0NPU1RVTUVfU1BSSVRFJzogWydpbWFnZXMvYmFja3N0YWdlL0NPU1RVTUVfU1BSSVRFLnBuZycsIDQwLCAyOCwgNF0sXG59O1xuXG5jb25zdCBJTUFHRVM6IElJbWFnZXNJbmZvID0ge1xuICAgIC8vIFVJXG4gICAgJ1VJX0JHJzogJ2ltYWdlcy91aS9VSV9CRy5wbmcnLFxuICAgICdVSV9JTlZfQkcnOiAnaW1hZ2VzL3VpL1VJX0lOVl9CRy5wbmcnLFxuICAgICdVSV9DT05WRVJTQVRJT05fQkcnOiAnaW1hZ2VzL3VpL1VJX0NPTlZFUlNBVElPTl9CRy5wbmcnLFxuICAgICdDT05WRVJTQVRJT05fTElORV9CRyc6ICdpbWFnZXMvdWkvQ09OVkVSU0FUSU9OX0xJTkVfQkcucG5nJyxcblxuICAgIC8vIEJhY2tzdGFnZSBzY2VuZTpcbiAgICAnQkFDS1NUQUdFX0JHJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQkFDS1NUQUdFX0JHLnBuZycsXG4gICAgJ1NLSVJUJzogJ2ltYWdlcy9iYWNrc3RhZ2UvU0tJUlQucG5nJyxcbiAgICAnQlJPT00nOiAnaW1hZ2VzL2JhY2tzdGFnZS9CUk9PTS5wbmcnLFxuICAgICdCUk9PTV9JTlYnOiAnaW1hZ2VzL2JhY2tzdGFnZS9CUk9PTV9JTlYucG5nJyxcbiAgICAnQkFDS1lBUkRfQkcnOiAnaW1hZ2VzL2JhY2t5YXJkL0JBQ0tZQVJEX0JHLnBuZycsXG4gICAgJ0NBTl9JTlYnOiAnaW1hZ2VzL2JhY2tzdGFnZS9DQU5fSU5WLnBuZycsXG4gICAgJ0NPSU5fSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQ09JTl9JTlYucG5nJyxcbiAgICAnU0NJU1NPUlMnOiAnaW1hZ2VzL2JhY2tzdGFnZS9TQ0lTU09SUy5wbmcnLFxuICAgICdCT0NBRElMTE8nOiAnaW1hZ2VzL2JhY2tzdGFnZS9CT0NBRElMTE8ucG5nJyxcbiAgICAnQlJFQUQnOiAnaW1hZ2VzL2JhY2tzdGFnZS9CUkVBRC5wbmcnLFxuICAgICdCQUNPTic6ICdpbWFnZXMvYmFja3N0YWdlL0JBQ09OLnBuZycsXG4gICAgJ0NPQ09OVVQnOiAnaW1hZ2VzL2JhY2tzdGFnZS9DT0NPTlVULnBuZycsXG4gICAgJ0RVU1QnOiAnaW1hZ2VzL2JhY2tzdGFnZS9EVVNULnBuZycsXG4gICAgJ1RBQkxFJzogJ2ltYWdlcy9iYWNrc3RhZ2UvVEFCTEUucG5nJyxcblxuICAgIC8vIEJhY2t5YXJkOlxuICAgICdGTE9XRVJTJzogJ2ltYWdlcy9iYWNreWFyZC9GTE9XRVJTLnBuZycsXG4gICAgJ0JJTEknOiAnaW1hZ2VzL2JhY2t5YXJkL0JJTEkucG5nJ1xufTtcblxuY29uc3QgRk9OVFM6IElGb250c0luZm8gPSB7XG4gICAgJ0ZPTlRfMzJfQkxBQ0snOiBbJ2ltYWdlcy9mb250cy9mb250XzMyX2JsYWNrLnBuZycsICdpbWFnZXMvZm9udHMvZm9udF8zMl9ibGFjay5mbnQnXSxcbiAgICAnRk9OVF8zMl9XSElURSc6IFsnaW1hZ2VzL2ZvbnRzL2ZvbnRfMzJfd2hpdGUucG5nJywgJ2ltYWdlcy9mb250cy9mb250XzMyX3doaXRlLmZudCddLFxuICAgICdGT05UXzMyX09SQU5HRSc6IFsnaW1hZ2VzL2ZvbnRzL2ZvbnRfMzJfb3JhbmdlLnBuZycsICdpbWFnZXMvZm9udHMvZm9udF8zMl9vcmFuZ2UuZm50J11cbn07XG5cbmNsYXNzIEFzc2V0c01hbmFnZXIge1xuXG4gICAgbG9hZEFzc2V0cyhnYW1lOiBQaGFzZXIuR2FtZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvYWRJbWFnZXMoZ2FtZSk7XG4gICAgICAgIHRoaXMubG9hZFNwcml0ZXMoZ2FtZSk7XG4gICAgICAgIHRoaXMubG9hZEZvbnRzKGdhbWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZEltYWdlcyhnYW1lOiBQaGFzZXIuR2FtZSk6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBpbWFnZUtleSBpbiBJTUFHRVMpIHtcbiAgICAgICAgICAgIGdhbWUubG9hZC5pbWFnZShpbWFnZUtleSwgSU1BR0VTW2ltYWdlS2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRTcHJpdGVzKGdhbWU6IFBoYXNlci5HYW1lKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IHNwcml0ZUtleSBpbiBTUFJJVEVTKSB7XG4gICAgICAgICAgICBnYW1lLmxvYWQuc3ByaXRlc2hlZXQoXG4gICAgICAgICAgICAgICAgc3ByaXRlS2V5LFxuICAgICAgICAgICAgICAgIDxzdHJpbmc+IFNQUklURVNbc3ByaXRlS2V5XVswXSxcbiAgICAgICAgICAgICAgICA8bnVtYmVyPiBTUFJJVEVTW3Nwcml0ZUtleV1bMV0sXG4gICAgICAgICAgICAgICAgPG51bWJlcj4gU1BSSVRFU1tzcHJpdGVLZXldWzJdLFxuICAgICAgICAgICAgICAgIDxudW1iZXI+IFNQUklURVNbc3ByaXRlS2V5XVszXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZEZvbnRzKGdhbWU6IFBoYXNlci5HYW1lKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGZvbnRLZXkgaW4gRk9OVFMpIHtcbiAgICAgICAgICAgIGdhbWUubG9hZC5iaXRtYXBGb250KFxuICAgICAgICAgICAgICAgIGZvbnRLZXksXG4gICAgICAgICAgICAgICAgRk9OVFNbZm9udEtleV1bMF0sXG4gICAgICAgICAgICAgICAgRk9OVFNbZm9udEtleV1bMV1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IGFzc2V0c01hbmFnZXIgPSBuZXcgQXNzZXRzTWFuYWdlcigpO1xuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcblxuZXhwb3J0IGNsYXNzIENvaW4gZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgaWQ6ICdjb2luJyxcbiAgICAgICAgICAgIGludmVudG9yeUltYWdlSWQ6ICdDT0lOX0lOVicsXG4gICAgICAgICAgICBuYW1lOiAnY29pbicsXG4gICAgICAgICAgICBkaXJlY3RseUluSW52ZW50b3J5OiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL2VuZ2luZS9tb2RlbHMvR2FtZSc7XG5pbXBvcnQgeyBET0NUT1JUSUxMQV9MQUJFTFMgfSBmcm9tICcuL0RvY3RvcnRpbGxhTGFiZWxzJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBCYWNrc3RhZ2VTY2VuZSB9IGZyb20gJy4vYmFja3N0YWdlU2NlbmUvQmFja3N0YWdlU2NlbmUnO1xuaW1wb3J0IHsgQmFja3lhcmRTY2VuZSB9IGZyb20gJy4vYmFja3lhcmRTY2VuZS9CYWNreWFyZFNjZW5lJztcblxuZXhwb3J0IGNsYXNzIERvY3RvcnRpbGxhR2FtZSBleHRlbmRzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGxhYmVsczogRE9DVE9SVElMTEFfTEFCRUxTLFxuICAgICAgICAgICAgcGxheWVyOiBuZXcgRG9jdG9ydGlsbGFQbGF5ZXIoKSxcbiAgICAgICAgICAgIHNjZW5lczogW1xuICAgICAgICAgICAgICAgIG5ldyBCYWNrc3RhZ2VTY2VuZSgpLFxuICAgICAgICAgICAgICAgIG5ldyBCYWNreWFyZFNjZW5lKClcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpbml0aWFsU2NlbmVJZDogJ0JBQ0tTVEFHRSdcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSUxhYmVscyAgfSBmcm9tICcuLi9lbmdpbmUvc3RvcmVzL0xhYmVscy5zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBET0NUT1JUSUxMQV9MQUJFTFM6IElMYWJlbHMgPSB7XG4gICAgJ2VzJzoge1xufSxcbiAgICAnZW4nOiB7XG4gICAgfVxufTsiLCJpbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuLi9lbmdpbmUvbW9kZWxzL1BsYXllcic7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuaW1wb3J0IHsgQ29pbiB9IGZyb20gJy4vQmFja3N0YWdlU2NlbmUvQ29pbic7XG5pbXBvcnQgeyBDb3N0dW1lIH0gZnJvbSAnLi9CYWNrc3RhZ2VTY2VuZS9Db3N0dW1lJztcbmltcG9ydCB7IGFjdGl2ZUludmVudG9yeSB9IGZyb20gJy4uL2VuZ2luZS9zdGF0ZS9BY3RpdmVJbnZlbnRvcnkuc2luZ2xldG9uJztcblxubGV0IHNwcml0ZU9wdGlvbnMgPSBuZXcgTWFwKCk7XG5cbnNwcml0ZU9wdGlvbnMuc2V0KCdzdGFuZF9yaWdodCcsIHsgZnJhbWVzOiBbMF19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCd3YWxrX3JpZ2h0JywgeyBmcmFtZXM6IFsxLCAyLCAzLCA0LCA1LCA2XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3N0YW5kX2xlZnQnLCB7IGZyYW1lczogWzBdLCBpbnZlcnNlOiB0cnVlfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnd2Fsa19sZWZ0JywgeyBmcmFtZXM6IFsxLCAyLCAzLCA0LCA1LCA2XSwgaW52ZXJzZTogdHJ1ZX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3N0YW5kX3VwJywgeyBmcmFtZXM6IFsxNF19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCd3YWxrX3VwJywgeyBmcmFtZXM6IFsxNSwgMTYsIDE3LCAxOCwgMTksIDIwXX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3N0YW5kX2Rvd24nLCB7IGZyYW1lczogWzddfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnd2Fsa19kb3duJywgeyBmcmFtZXM6IFs4LCA5LCAxMCwgMTEsIDEyLCAxM119KTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBzcHJpdGVJZDogJ0RPQ1RPUlRJTExBX1BMQVlFUl9TUFJJVEUnLFxuICAgIGluaXRpYWxYOiAyMDAsXG4gICAgaW5pdGlhbFk6IDIwMCxcbiAgICB4U3BlZWQ6IDgwLCAvL3B4L3NcbiAgICB5U3BlZWQ6IDU1LCAvL3B4L3NcbiAgICBhbmltYXRpb25TcGVlZDogNixcbiAgICBzcHJpdGVPcHRpb25zOiBzcHJpdGVPcHRpb25zXG59O1xuXG5cbmV4cG9ydCBjbGFzcyBEb2N0b3J0aWxsYVBsYXllciBleHRlbmRzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQobmV3IENvaW4oKSk7XG4gICAgfVxuXG4gICAgcmVmbGVjdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zYXkocmFuZG9tVGV4dCgnTm93IEkgc2hvdWxkIHNheSBzb21ldGhpbmcgc21hcnQgdGhhdCBoZWxwcycsXG4gICAgICAgICAgICAnVGhpcyBpcyBhIHByZXR0eSBuaWNlIHJvb20nLFxuICAgICAgICAgICAgJ01hbiwgSSByZWFsbHkgd2FudCB0byBwbGF5IHRoYXQgY29uY2VydCcsXG4gICAgICAgICAgICAnUHJvYmFibHkgSSBzaG91bGQgZmluZCB0aGUgcmVzdCBvZiB0aGUgYmFuZC4uLicpKTtcbiAgICB9XG5cbiAgICBoYXNDb21wbGV0ZUNvc3R1bWUoKTogQm9vbGVhbiB7XG4gICAgICAgIGxldCBpbnZlbnRvcnkgPSBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCk7XG4gICAgICAgIGxldCBjb3N0dW1lID0gPENvc3R1bWU+IGludmVudG9yeS5nZXRCeUlkKCdjb3N0dW1lJyk7XG5cbiAgICAgICAgcmV0dXJuIGNvc3R1bWUgJiYgY29zdHVtZS5pc0NvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgaGFzQ2FibGUoKTogQm9vbGVhbiB7XG4gICAgICAgIGxldCBpbnZlbnRvcnkgPSBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCk7XG4gICAgICAgIGxldCBjYWJsZSA9IGludmVudG9yeS5nZXRCeUlkKCdjYWJsZScpO1xuICAgICAgICByZXR1cm4gISFjYWJsZTtcbiAgICB9XG5cbiAgICBoYXNGdW5ueURyaW5rKCk6IEJvb2xlYW4ge1xuICAgICAgICBsZXQgaW52ZW50b3J5ID0gYWN0aXZlSW52ZW50b3J5LmdldEFjdGl2ZUludmVudG9yeSgpO1xuICAgICAgICBsZXQgZ2xhc3MgPSA8YW55PiBpbnZlbnRvcnkuZ2V0QnlJZCgnZ2xhc3MnKTtcbiAgICAgICAgcmV0dXJuIGdsYXNzICYmIGdsYXNzLmlzRnVubnkoKTtcbiAgICB9XG5cbiAgICByZW1vdmVDb3N0dW1lKCk6IHZvaWQge1xuICAgICAgICBsZXQgaW52ZW50b3J5ID0gYWN0aXZlSW52ZW50b3J5LmdldEFjdGl2ZUludmVudG9yeSgpO1xuICAgICAgICBsZXQgY29zdHVtZSA9IGludmVudG9yeS5nZXRCeUlkKCdjb3N0dW1lJyk7XG4gICAgICAgIGludmVudG9yeS5yZW1vdmUoY29zdHVtZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2FibGUoKTogdm9pZCB7XG4gICAgICAgIGxldCBpbnZlbnRvcnkgPSBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCk7XG4gICAgICAgIGxldCBjYWJsZSA9IGludmVudG9yeS5nZXRCeUlkKCdjYWJsZScpO1xuICAgICAgICBpbnZlbnRvcnkucmVtb3ZlKGNhYmxlKTtcbiAgICB9XG5cbiAgICByZW1vdmVHbGFzcygpOiB2b2lkIHtcbiAgICAgICAgbGV0IGludmVudG9yeSA9IGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKTtcbiAgICAgICAgbGV0IGdsYXNzID0gaW52ZW50b3J5LmdldEJ5SWQoJ2dsYXNzJyk7XG4gICAgICAgIGludmVudG9yeS5yZW1vdmUoZ2xhc3MpO1xuICAgIH1cblxuICAgIGRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHIoJ0RFTElWRVJFRF9DQUJMRScpICYmIHRoaXMuZ2V0QXR0cignREVMSVZFUkVEX0NPU1RVTUUnKSAmJiB0aGlzLmdldEF0dHIoJ0RFTElWRVJFRF9EUklOSycpO1xuICAgIH1cblxufSIsImltcG9ydCB7IERvb3IgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL0Rvb3InO1xuXG5leHBvcnQgY2xhc3MgQmFja3N0YWdlRG9vclRvQmFja3lhcmQgZXh0ZW5kcyBEb29yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZDogJ0JBQ0tTVEFHRV9UT19CQUNLWUFSRCcsXG4gICAgICAgICAgICBuYW1lOiAnZG9vciB0byBiYWNreWFyZCcsXG4gICAgICAgICAgICB4OiAxNTAsXG4gICAgICAgICAgICB5OiA5NSxcbiAgICAgICAgICAgIHNwcml0ZUlkOiAnRE9PUl9TUFJJVEUnLFxuICAgICAgICAgICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMTc1LFxuICAgICAgICAgICAgICAgIHk6IDE2NVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uU2NlbmVJZDogJ0JBQ0tZQVJEJyxcbiAgICAgICAgICAgIHJlbGF0ZWREb29ySWQ6ICdCQUNLWUFSRF9UT19CQUNLU1RBR0UnXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnc3RyZWV0JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnZG9vciB0byBzdHJlZXQnO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IFNjZW5lIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9TY2VuZSc7XG5pbXBvcnQgeyBCcm9vbSB9IGZyb20gJy4vQnJvb20nO1xuaW1wb3J0IHsgVmVuZGluZ01hY2hpbmUgfSBmcm9tICcuL1ZlbmRpbmdNYWNoaW5lJztcbmltcG9ydCB7IEJhY2tzdGFnZURvb3JUb0JhY2t5YXJkIH0gZnJvbSAnLi9CYWNrc3RhZ2VEb29yVG9CYWNreWFyZCc7XG5pbXBvcnQgeyBCYW5kSW5Tb2ZhIH0gZnJvbSAnLi9CYW5kSW5Tb2ZhJztcbmltcG9ydCB7IFNjaXNzb3JzIH0gZnJvbSAnLi9TY2lzc29ycyc7XG5pbXBvcnQgeyBCb2NhZGlsbG8gfSBmcm9tICcuL0JvY2FkaWxsbyc7XG5pbXBvcnQgeyBDYWJsZSB9IGZyb20gJy4vQ2FibGUnO1xuaW1wb3J0IHsgQ29jb251dCB9IGZyb20gJy4vQ29jb251dCc7XG5pbXBvcnQgeyBUYWJsZSB9IGZyb20gJy4vVGFibGUnO1xuaW1wb3J0IHsgRHVzdCB9IGZyb20gJy4vRHVzdEluVGFibGUnO1xuaW1wb3J0IHsgR2xhc3MgfSBmcm9tICcuL0dsYXNzJztcblxuY29uc3Qgc2NlbmVPcHRpb25zID0ge1xuICAgIGlkOiAnQkFDS1NUQUdFJyxcbiAgICBiYWNrZ3JvdW5kSWQ6ICdCQUNLU1RBR0VfQkcnLFxuICAgIGJvdW5kYXJpZXNDb25maWc6IHtcbiAgICAgICAgbWluWTogMzEwIC8gMixcbiAgICAgICAgbWF4WTogNDUwIC8gMixcbiAgICAgICAgbWluWDogMTgwIC8gMixcbiAgICAgICAgbWF4WDogMTIwMCAvIDJcbiAgICB9LFxuICAgIHRoaW5nczogW1xuICAgICAgICBuZXcgQnJvb20oKSxcbiAgICAgICAgbmV3IEJhY2tzdGFnZURvb3JUb0JhY2t5YXJkKCksXG4gICAgICAgIG5ldyBDYWJsZSgpLFxuICAgICAgICBuZXcgVmVuZGluZ01hY2hpbmUoKSxcbiAgICAgICAgbmV3IEJhbmRJblNvZmEoKSxcbiAgICAgICAgbmV3IFNjaXNzb3JzKCksXG4gICAgICAgIG5ldyBCb2NhZGlsbG8oKSxcbiAgICAgICAgbmV3IFRhYmxlKCksXG4gICAgICAgIG5ldyBHbGFzcygpLFxuICAgICAgICBuZXcgRHVzdCgpLFxuICAgICAgICBuZXcgQ29jb251dCgpXG4gICAgXVxufTtcblxuZXhwb3J0IGNsYXNzIEJhY2tzdGFnZVNjZW5lIGV4dGVuZHMgU2NlbmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihzY2VuZU9wdGlvbnMpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnYmFjb24nLFxuICAgIHNwcml0ZUlkOiAnQkFDT04nLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdCQUNPTicsXG4gICAgbmFtZTogJ2JhY29uJyxcbiAgICBkaXJlY3RseUluSW52ZW50b3J5OiB0cnVlXG59XG5cbmV4cG9ydCBjbGFzcyBCYWNvbiBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufSIsIlxuLy8gdmFyIENvbnZlcnNhdGlvbldpdGhCYW5kID0gcmVxdWlyZSgnLi9Db252ZXJzYXRpb25XaXRoQmFuZC5qcycpO1xuaW1wb3J0IHsgU3BlZWNoQnViYmxlIH0gZnJvbSAnLi4vLi4vZW5naW5lL3VpL1NwZWVjaEJ1YmJsZSc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uV2l0aEJhbmQgfSBmcm9tICcuL0NvbnZlcnNhdGlvbldpdGhCYW5kJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuXG5leHBvcnQgY2xhc3MgQmFuZEluU29mYSBleHRlbmRzIFRoaW5nIHtcblxuICAgIHByaXZhdGUgc3BlZWNoQnViYmxlOiBTcGVlY2hCdWJibGU7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZDogJ2JhbmRJblNvZmEnLFxuICAgICAgICAgICAgeDogNDM0LFxuICAgICAgICAgICAgeTogMTE2LFxuICAgICAgICAgICAgc3ByaXRlSWQ6ICdCQU5EX0lOX1NPRkFfU1BSSVRFJyxcbiAgICAgICAgICAgIG5hbWU6ICdyZXN0IG9mIHRoZSBiYW5kJyxcbiAgICAgICAgICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDQxMCxcbiAgICAgICAgICAgICAgICB5OiAxODZcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuc3BlZWNoQnViYmxlID0gbmV3IFNwZWVjaEJ1YmJsZSh7XG4gICAgICAgICAgICBvd25lcjogdGhpc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLnNheSgnVGhlcmUgaXMgbXkgYmFuZC4nKTtcbiAgICB9XG5cbiAgICBzcGVha0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcykudGhlbihcbiAgICAgICAgICAgICgpID0+IG5ldyBDb252ZXJzYXRpb25XaXRoQmFuZChwbGF5ZXIsIHRoaXMpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc2F5KHRleHQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGVlY2hCdWJibGUuc2F5KHRleHQpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IEJyZWFkIH0gZnJvbSAnLi9CcmVhZCc7XG5pbXBvcnQgeyBCYWNvbiB9IGZyb20gJy4vQmFjb24nO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnYm9jYWRpbGxvJyxcbiAgICB4OiAzNTQsXG4gICAgeTogMTUxLFxuICAgIHNwcml0ZUlkOiAnQk9DQURJTExPJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQk9DQURJTExPJyxcbiAgICBuYW1lOiAnYm9jYWRpbGxvJyxcbiAgICBnb1RvUG9zaXRpb246IHtcbiAgICAgICAgeDogMzM0LFxuICAgICAgICB5OiAxODFcbiAgICB9LFxuICAgIHBpY2thYmxlOiB0cnVlXG59XG5cbmV4cG9ydCBjbGFzcyBCb2NhZGlsbG8gZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJIHRoaW5rIEkgY2FuIG9wZW4gaXQgYW5kIHRha2UgdGhlIGJhY29uJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdBIHJhbmNpZCBhbmQgR1JFQVNZIHNhbmR3aGljaCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9wZW5BY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIG5ldyBCYWNvbigpO1xuICAgICAgICAgICAgbmV3IEJyZWFkKCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0kgaGF2ZSB0byBwaWNrIGl0IHVwIGZpcnN0Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdicmVhZCcsXG4gICAgc3ByaXRlSWQ6ICdCUkVBRCcsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ0JSRUFEJyxcbiAgICBuYW1lOiAnYnJlYWQnLFxuICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk6IHRydWVcbn1cblxuZXhwb3J0IGNsYXNzIEJyZWFkIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgU2tpcnQgfSBmcm9tICcuL1NraXJ0JztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2Jyb29tJyxcbiAgICB4OiAyNTQsXG4gICAgeTogMTAxLFxuICAgIHNwcml0ZUlkOiAnQlJPT00nLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdCUk9PTV9JTlYnLFxuICAgIG5hbWU6ICdicm9vbScsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDI1MCxcbiAgICAgICAgeTogMTc1XG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIEJyb29tIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdBd2Vzb21lLCBub3cgSSBoYXZlIGEgYnJvb20nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ1NpIHlvIHR1dmllcmEgdW5hIGVzY29iYS4uLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnc2Npc3NvcnMnKSB7XG4gICAgICAgICAgICB0aGlzLmN1dFdpdGhTY2lzc29ycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBkb25cXCd0IGtub3cgaG93IHRvIGRvIHRoYXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGN1dFdpdGhTY2lzc29ycygpIHtcbiAgICAgICAgbmV3IFNraXJ0KCk7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IHNjZW5lcyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TY2VuZXMuc2luZ2xldG9uJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2NhYmxlJyxcbiAgICB4OiA0MixcbiAgICB5OiAxNjUsXG4gICAgc3ByaXRlSWQ6ICdDQUJMRV9TUFJJVEUnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdDQUJMRV9TUFJJVEUnLFxuICAgIG5hbWU6ICdjYWJsZScsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDcyLFxuICAgICAgICB5OiAyMDVcbiAgICB9LFxuICAgIHBpY2thYmxlOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgQ2FibGUgZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB0YWtlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGxldCB2ZW5kaW5nTWFjaGluZSA9IHNjZW5lcy5jdXJyZW50U2NlbmUuZ2V0VGhpbmdCeUlkKCd2ZW5kaW5nJyk7XG4gICAgICAgICAgICBpZiAoIXZlbmRpbmdNYWNoaW5lKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiB2ZW5kaW5nIG1hY2hpbmUgc2hvdWxkIGJlIHByZXNlbnQgaW4gY3VycmVudCBzY2VuZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2ZW5kaW5nTWFjaGluZS5nZXRBdHRyKCdQVVNIRUQnKSkge1xuICAgICAgICAgICAgICAgIHBsYXllci5zYXkoJ0ZpbmFsbHksIEkgaGF2ZSB0aGUgJCUjIGNhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMubGV0UGxheWVyQ29tZUFuZFRha2VJdChwbGF5ZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc2F5KCdJdCBpcyBzdHVjayBiZWhpbmQgdGhlIHZlbmRpbmcgbWFjaGluZSwgSSBuZWVkIHRvIG1vdmUgaXQgc29tZWhvdy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0Nvb2wsIG5vdyBJIHNob3VsZCBnaXZlIHRoYXQgdG8gdGhlIGd1eXMnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ1RoaXMgaXMgdGhlIGNhYmxlIEkgbmVlZCEnKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcblxuZXhwb3J0IGNsYXNzIENhbiBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZDogJ2NhbicsXG4gICAgICAgICAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQ0FOX0lOVicsXG4gICAgICAgICAgICBuYW1lOiAnY2FuJyxcbiAgICAgICAgICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2dsYXNzJykge1xuICAgICAgICAgICAgLy8gVE9ETzogZ2xhc3MgY2xhc3MgYW5kIGNhc3RpbmdcbiAgICAgICAgICAgIC8vIGxldCBnbGFzcyA9IHNlbGVjdGVkVGhpbmcudGhpbmc7XG4gICAgICAgICAgICAvLyBnbGFzcy5maWxsV2l0aERyaW5rKHBsYXllciwgdGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2R1c3QnKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJIHNob3VsZCBwcm9iYWJseSBtaXggaXQgaW4gYSBnbGFzcycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBkb25cXHQga25vdyBob3cgdG8gZG8gdGhhdC4uLicpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBDb3N0dW1lIH0gZnJvbSAnLi4vYmFja3N0YWdlU2NlbmUvQ29zdHVtZSc7XG5pbXBvcnQgeyBTa2lydCB9IGZyb20gJy4uL2JhY2tzdGFnZVNjZW5lL1NraXJ0JztcbmltcG9ydCB7IEZsb3dlcnMgfSBmcm9tICcuLi9iYWNreWFyZFNjZW5lL0Zsb3dlcnMnO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnY29jb251dCcsXG4gICAgeDogMTIwLFxuICAgIHk6IDEzMCxcbiAgICBzcHJpdGVJZDogJ0NPQ09OVVQnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdDT0NPTlVUJyxcbiAgICBuYW1lOiAnY29jb251dCcsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDE1MCxcbiAgICAgICAgeTogMTgwXG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIENvY29udXQgZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29zdHVtZUZyb21Ta2lydChwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBza2lydDogU2tpcnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBoYXZlIHRvIHBpY2sgaXQgdXAgZmlyc3QnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY29zdHVtZSA9IG5ldyBDb3N0dW1lKCk7XG4gICAgICAgIGNvc3R1bWUuYWRkU2tpcnQoc2tpcnQpO1xuICAgICAgICBjb3N0dW1lLmFkZENvY29udXQodGhpcyk7XG4gICAgfVxuXG4gICAgYWRkQ29jb251dFRvQ29zdHVtZShwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBjb3N0dW1lOiBDb3N0dW1lKSB7XG4gICAgICAgIGNvc3R1bWUuYWRkQ29jb251dCh0aGlzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnRG9lcyBpdCBsb29rIGxpa2UgYSBwYWlyIG9mIHRpdHM/Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdDb21wYXJlIGPDs21wcmFtZSB1biBjb2NvJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdmbG93ZXJzJykge1xuICAgICAgICAgICAgbGV0IGZsb3dlcnMgPSA8Rmxvd2Vycz4gc2VsZWN0ZWRUaGluZy50aGluZztcbiAgICAgICAgICAgIGZsb3dlcnMuY3JlYXRlQ29zdHVtZUZyb21Db2NvbnV0KHBsYXllciwgdGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ3NraXJ0Jykge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVDb3N0dW1lRnJvbVNraXJ0KHBsYXllciwgPFNraXJ0PiBzZWxlY3RlZFRoaW5nLnRoaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY29zdHVtZScpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ29jb251dFRvQ29zdHVtZShwbGF5ZXIsIDxDb3N0dW1lPiBzZWxlY3RlZFRoaW5nLnRoaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0kgZG9uXFwndCBrbm93IGhvdyB0byBkbyB0aGF0Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbnZlcnNhdGlvbiwgSUNvbnZlcnNhdGlvblNjcmlwdCB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvQ29udmVyc2F0aW9uJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbkxpbmUgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL0NvbnZlcnNhdGlvbkxpbmUnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgQmFuZEluU29mYSB9IGZyb20gJy4vQmFuZEluU29mYSc7XG5cbmNvbnN0IHNjcmlwdDogSUNvbnZlcnNhdGlvblNjcmlwdCA9IHtcbiAgICAnaW5pdGlhbCc6IFtcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ8KhRG9jdG9ydGlsbGFzISDCv0xpc3RvcyBwYXJhIHRvY2FyPycsICdMSVNUX09GX1BST0JMRU1TJywgc2F5UHJvYmxlbXNJbnRybyksXG4gICAgICAgIC8vVE9ETyBsaW5lIGxpa2UgYWJvdmUgYnV0IGFnZ3Jlc3NpdmVcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ8K/SGFiw6lpcyB2aXN0byBhIEJpbGk/JywgJ2luaXRpYWwnLCBzYXlCaWxpU2l0dWF0aW9uKSxcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ8KhSGFzdGEgbHVlZ28hJywgJ2VuZCcpXG4gICAgXSxcbiAgICAnTElTVF9PRl9QUk9CTEVNUyc6IFtcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ8K/SW1wZWRpbWVudG9zPyBDb250YWRtZSBtw6FzLCBxdWVyaWRvcyBhbWlndWl0b3MuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0lOSVRJQUxfQUZURVJfRklSU1RfVEFMSycsIHNheUxpc3RPZlByb2JsZW1zKSxcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ8K/UHJvYmxlbWFzPyDCv0ltcGVkaW1lbnRvcz8gTm8gY29udMOpaXMgY29ubWlnby4uLicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnLCBzYXlMaXN0T2ZQcm9ibGVtcylcbiAgICBdLFxuICAgICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnOiBbXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKCfCv0PDs21vIGVzdMOhIEJpbGk/JywgJ0lOSVRJQUxfQUZURVJfRklSU1RfVEFMSycsIHNheUJpbGlTaXR1YXRpb24pLFxuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnTW1tbSwgdm95IGEgdmVyIHNpIGFycmVnbGFtb3MgZXN0ZSBmb2xsw7NuJywgJ2VuZCcpXG4gICAgXSxcbiAgICAnV0VfQVJFX1JFQURZJzogW1xuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnwqFUb2RvIGxpc3RvISBWb3kgYSBwb3IgQmlsaSB5IGVtcGV6YW1vcycsICdlbmQnKVxuICAgIF1cbn07XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJzYXRpb25XaXRoQmFuZCBleHRlbmRzIENvbnZlcnNhdGlvbiB7XG5cblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBwcm90ZWN0ZWQgb3RoZXJQZXJzb246IFRoaW5nKSB7XG4gICAgICAgIHN1cGVyKHBsYXllciwgb3RoZXJQZXJzb24pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0U3RhdGUoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllci5nZXRBdHRyKCdUQUxLRURfVE9fQkFORF9BQk9VVF9QUk9CTEVNUycpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXRTdGF0ZUlmUGxheWVyRGVsaXZlcmVkRXZlcnl0aGluZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdpbml0aWFsJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb2FkU2NyaXB0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNjcmlwdCA9IHNjcmlwdFxuICAgICAgICBsZXQgZGlhbG9nUGFydDogQXJyYXk8Q29udmVyc2F0aW9uTGluZT4gPSBbXTtcbiAgICAgICAgZGlhbG9nUGFydC5wdXNoKC4uLnRoaXMuc2NyaXB0WydJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnXSk7XG5cbiAgICAgICAgdGhpcy5sb2FkRXh0cmFPcHRpb25zSW5Jbml0aWFsRmlyc3RUYWxrKGRpYWxvZ1BhcnQpO1xuICAgICAgICB0aGlzLnNjcmlwdFsnSU5JVElBTF9BRlRFUl9GSVJTVF9UQUxLJ10gPSBkaWFsb2dQYXJ0O1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZEV4dHJhT3B0aW9uc0luSW5pdGlhbEZpcnN0VGFsayhkaWFsb2dQYXJ0OiBBcnJheTxDb252ZXJzYXRpb25MaW5lPikge1xuICAgICAgICB0aGlzLmFkZENvc3R1bWVMaW5lKGRpYWxvZ1BhcnQpO1xuICAgICAgICB0aGlzLmFkZENhYmxlTGluZShkaWFsb2dQYXJ0KTtcbiAgICAgICAgdGhpcy5hZGREcmlua0xpbmUoZGlhbG9nUGFydCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRDb3N0dW1lTGluZShkaWFsb2dQYXJ0OiBBcnJheTxDb252ZXJzYXRpb25MaW5lPik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuaGFzQ29tcGxldGVDb3N0dW1lKCkpIHtcbiAgICAgICAgICAgIGRpYWxvZ1BhcnQudW5zaGlmdChuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICAgICAnVGVuZ28gZWwgZGlzZnJheicsXG4gICAgICAgICAgICAgICAgKCkgPT4geyByZXR1cm4gdGhpcy5nZXRTdGF0ZUlmUGxheWVyRGVsaXZlcmVkRXZlcnl0aGluZygpOyB9LFxuICAgICAgICAgICAgICAgIHNheUNvc3R1bWVJc09rXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkQ2FibGVMaW5lKGRpYWxvZ1BhcnQ6IEFycmF5PENvbnZlcnNhdGlvbkxpbmU+KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllci5oYXNDYWJsZSgpKSB7XG4gICAgICAgICAgICBkaWFsb2dQYXJ0LnVuc2hpZnQobmV3IENvbnZlcnNhdGlvbkxpbmUoXG4gICAgICAgICAgICAgICAgJ1RlbmdvIGVsIGNhYmxlJyxcbiAgICAgICAgICAgICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmdldFN0YXRlSWZQbGF5ZXJEZWxpdmVyZWRFdmVyeXRoaW5nKCk7IH0sXG4gICAgICAgICAgICAgICAgc2F5Q2FibGVJc09rXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkRHJpbmtMaW5lKGRpYWxvZ1BhcnQ6IEFycmF5PENvbnZlcnNhdGlvbkxpbmU+KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllci5oYXNGdW5ueURyaW5rKCkpIHtcbiAgICAgICAgICAgIGRpYWxvZ1BhcnQudW5zaGlmdChuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICAgICAnU2FudGkgdGUgaGUgdHJhaWRvIHVuIHJlZnJpZ2VyaW8nLFxuICAgICAgICAgICAgICAgICgpID0+IHsgcmV0dXJuIHRoaXMuZ2V0U3RhdGVJZlBsYXllckRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKTsgfSxcbiAgICAgICAgICAgICAgICBzYXlEcmlua0lzT2tcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTdGF0ZUlmUGxheWVyRGVsaXZlcmVkRXZlcnl0aGluZygpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuZGVsaXZlcmVkRXZlcnl0aGluZygpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1dFX0FSRV9SRUFEWSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ0lOSVRJQUxfQUZURVJfRklSU1RfVEFMSyc7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gc2F5UHJvYmxlbXNJbnRybyhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiYW5kOiBCYW5kSW5Tb2ZhKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gYmFuZC5zYXkoJ0FOR0VMOiBObyBlcyBwb3IgYWxhcm1hciBwZXJvIGVzdMOhIGhhYmllbmRvIGFsZ3Vub3MgY29udHJhdGllbXBvcy4uLicpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1NBTlRJOiAuLi5taW51Y2lhcyBzaW4gaW1wb3J0YW5jaWEuLi4nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdKVUFOOiAuLi5pbXBlZGltZW50b3MgQlJVVEFMRVMuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNheUxpc3RPZlByb2JsZW1zKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJhbmQ6IEJhbmRJblNvZmEpOiBQcm9taXNlPGFueT4ge1xuICAgIHBsYXllci5jaGFuZ2VBdHRyKCdUQUxLRURfVE9fQkFORF9BQk9VVF9QUk9CTEVNUycsIHRydWUpO1xuICAgIHJldHVybiBiYW5kLnNheSgnQU5HRUw6IFJlc3VsdGEgcXVlIGFxdcOtIGVsIGFtaWdvIEp1YW4gc2UgaGEgb2x2aWRhZG8gc3UgZGlzZnJhei4uLicpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ0pVQU46IFVuIGRpc2ZyYXogQlJVVEFMLCBkZSBjb3dib3kgdmludGFnZSwgc2lnbG8gWElWLCBjb24gZXNwdWVsYXMgZGUuLi4nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdBTkdFTDogU8OtLCBzw60uLi4gcGVybyBsbyBoYSBkZWphZG8gZW4gZWwgbG9jYWwgZGUgZW5zYXlvLCBhc8OtIHF1ZSBoYXkgcXVlIGJ1c2NhcmxlIG90cm8uJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnSlVBTjogWSB0dSB0ZSBoYXMgb2x2aWRhZG8gZWwgY2FibGUgZGUgY29ycmllbnRlLCBhc8OtIHF1ZSBzaSBxdWllcmVzIHF1ZSBzZSBvaWdhIGFsZ28uLi4nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdBTkdFTDogTWUgdGVuZHLDoXMgcXVlIGNvbnNlZ3VpciB1bm8uJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnQU5HRUw6IFkgbHVlZ28gZXN0w6EgZWwgcHJvYmxlbWEgY29uIFNhbnRpLicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ0pVQU46IEVsIHBvYnJlIGVzdMOhIHTDrW1pZG8geSBubyBzZSBhdHJldmVyIGEgc2FsaXIuJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnQU5HRUw6IERpY2UgcXVlIG5vIGVuc2F5YW1vcyBudW5jYSB5IHNlIHNpZW50ZSBpbnNlZ3Vyby4nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdKVUFOOiBZYSBzYWJlcyBjw7NtbyBzb24gbG9zIHp1cmRvcyBjb24gZXN0YXMgY29zYXMuLi4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2F5QmlsaVNpdHVhdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiYW5kOiBCYW5kSW5Tb2ZhKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gYmFuZC5zYXkoJ0FOR0VMOiBFc3TDoSBmdWVyYSBmdW1hbmRvLCBwZXJvIGNvbW8gbG8gZGVqZW1vcyBtdWNobyB0aWVtcG8gc2UgdmEgYSBwb25lciBjb21vIGxhcyBncmVjYXMuJyk7XG59XG5cbmZ1bmN0aW9uIHNheUNvc3R1bWVJc09rKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJhbmQ6IEJhbmRJblNvZmEpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBiYW5kLnNheSgnSlVBTjogVmF5YSBkaXNmcmF6IHJpZMOtY3Vsby4nKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdKVUFOOiBFbCBtw61vIGVyYSBtZWpvcicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnVGUgbG8gcG9uZXMsIG8gdGUgbG8gcG9uZ28uJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGJhbmQuY2hhbmdlQXR0cignSEFTX0NPU1RVTUUnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmNoYW5nZUF0dHIoJ0RFTElWRVJFRF9DT1NUVU1FJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5yZW1vdmVDb3N0dW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdKVUFOOiBNZSBsbyBwb25nby4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbn1cblxuXG5mdW5jdGlvbiBzYXlDYWJsZUlzT2socGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmFuZDogQmFuZEluU29mYSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGJhbmQuc2F5KCdBTkdFTDogTm8gdm95IGEgcHJlZ3VudGFyIGRlIGTDs25kZSBsbyBoYXMgc2FjYWRvLi4uJylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnU0FOVEk6IExvIGhhcyByb2JhZG8sIMK/dmVyZGFkPycpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBiYW5kLmNoYW5nZUF0dHIoJ0hBU19DQUJMRScsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY2hhbmdlQXR0cignREVMSVZFUkVEX0NBQkxFJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5yZW1vdmVDYWJsZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnRGlnYW1vcyBxdWUgdGVuZ28gcmVjdXJzb3MuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNheURyaW5rSXNPayhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiYW5kOiBCYW5kSW5Tb2ZhKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gYmFuZC5zYXkoJ1NBTlRJOiBNbW0gdW4gcmVmcmVzY2FudGUgcmVmcmVzY28uLi4nKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdTQU5USTogR2x1IGdsdSBnbHUnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdTQU5USTogLi4uJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnU0FOVEk6IChlcnVjdG8pJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnU0FOVEk6IE5vIHNhYsOtYSBhIGRyb2dhIG5pIG5hZGEnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdTQU5USTogRXN0b3kgZW1wZXphbmRvIGEgc2VudGlybWUgbGlzdG8gcGFyYSB0b2NhcicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBiYW5kLmNoYW5nZUF0dHIoJ0hBU19EUklOSycsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY2hhbmdlQXR0cignREVMSVZFUkVEX0RSSU5LJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5yZW1vdmVHbGFzcygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnQXPDrSBtZSBndXN0YS4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbn1cbiIsIiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IEdsYXNzIH0gZnJvbSAnLi9HbGFzcyc7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdkdXN0JyxcbiAgICB4OiAxMDIsXG4gICAgeTogMTM1LFxuICAgIHNwcml0ZUlkOiAnRFVTVCcsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ0RVU1QnLFxuICAgIG5hbWU6ICdkdXN0JyxcbiAgICBnb1RvUG9zaXRpb246IHtcbiAgICAgICAgeDogMTMyLFxuICAgICAgICB5OiAxODVcbiAgICB9LFxuICAgIHBpY2thYmxlOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgRHVzdCBleHRlbmRzIFRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBiZXQgdGhpcyBcImR1c3RcIiBjYW4gbWFrZSBcInNvbWVib2R5XCIgbGVzcyBzaHknKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ1RoYXRcXCdzIHNvbWUgaGlnaGx5IHN1c3BpY2lvdXMgd2hpdGUgcG93ZGVyJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBoYXZlIHRvIHBpY2sgaXQgdXAgZmlyc3QnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2dsYXNzJykge1xuICAgICAgICAgICAgbGV0IGdsYXNzID0gPEdsYXNzPiBzZWxlY3RlZFRoaW5nLnRoaW5nO1xuICAgICAgICAgICAgZ2xhc3MuZmlsbFdpdGhEdXN0KHBsYXllciwgdGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2NhbicpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0kgc2hvdWxkIHByb2JhYmx5IG1peCBpdCBpbiBhIGdsYXNzJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJIGRvblxcdCBrbm93IGhvdyB0byBkbyB0aGF0Li4uJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvQWN0aXZlSW52ZW50b3J5LnNpbmdsZXRvbic7XG5pbXBvcnQgeyBDYW4gfSBmcm9tICcuL0Nhbic7XG5cbmNvbnN0IE5PUk1BTF9GUkFNRSA9IDA7XG5jb25zdCBQT1dERVJfRlJBTUUgPSAxO1xuY29uc3QgRklMTEVEX0ZSQU1FID0gMjtcbmNvbnN0IFBPV0RFUl9GSUxMRURfRlJBTUUgPSAzO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnZ2xhc3MnLFxuICAgIHg6IDEzNyxcbiAgICB5OiAxMzAsXG4gICAgc3ByaXRlSWQ6ICdHTEFTU19TUFJJVEUnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdHTEFTU19TUFJJVEUnLFxuICAgIG5hbWU6ICdnbGFzcycsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDE2NyxcbiAgICAgICAgeTogMTgwXG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIEdsYXNzIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBoYXZlIHRvIHBpY2sgaXQgdXAgZmlyc3QnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2R1c3QnKSB7XG4gICAgICAgICAgICBsZXQgZHVzdCA9IHNlbGVjdGVkVGhpbmcudGhpbmc7XG4gICAgICAgICAgICB0aGlzLmZpbGxXaXRoRHVzdChwbGF5ZXIsIGR1c3QpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjYW4nKSB7XG4gICAgICAgICAgICBsZXQgY2FuID0gPENhbj4gc2VsZWN0ZWRUaGluZy50aGluZztcbiAgICAgICAgICAgIHRoaXMuZmlsbFdpdGhEcmluayhwbGF5ZXIsIGNhbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJIGRvblxcdCBrbm93IGhvdyB0byBkbyB0aGF0Li4uJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnUmVhbGx5IHVzZWZ1bCB0byBwdXQgbGlxdWlkcyBvciBvdGhlciBzdWJzdGFuY2VzIGluc2lkZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSXQgaXMgaW5kZWVkIGEgZ2xhc3MnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxXaXRoRHVzdChwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBkdXN0OiBUaGluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ1BPV0RFUl9JTlNJREUnLCB0cnVlKTtcbiAgICAgICAgZHVzdC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZpbGxXaXRoRHJpbmsocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgY2FuOiBDYW4pIHtcbiAgICAgICAgaWYgKCF0aGlzLmdldEF0dHIoJ0ZJTExFRCcpKSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ0ZJTExFRCcsIHRydWUpO1xuICAgICAgICAgICAgYWN0aXZlSW52ZW50b3J5LnJlZnJlc2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0l0IGlzIGFscmVhZHkgZnVsbCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNGdW5ueSgpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cignRklMTEVEJykgJiYgdGhpcy5nZXRBdHRyKCdQT1dERVJfSU5TSURFJyk7XG4gICAgfVxuXG4gICAgZ2V0RnJhbWVGb3JJbnZlbnRvcnkoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignRklMTEVEJykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ1BPV0RFUl9JTlNJREUnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQT1dERVJfRklMTEVEX0ZSQU1FO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRklMTEVEX0ZSQU1FO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0QXR0cignUE9XREVSX0lOU0lERScpKSB7XG4gICAgICAgICAgICByZXR1cm4gUE9XREVSX0ZSQU1FO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE5PUk1BTF9GUkFNRTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IEJyb29tIH0gZnJvbSAnLi9Ccm9vbSc7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdzY2lzc29ycycsXG4gICAgeDogMTQyLFxuICAgIHk6IDE2NSxcbiAgICBzcHJpdGVJZDogJ1NDSVNTT1JTJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnU0NJU1NPUlMnLFxuICAgIG5hbWU6ICdzY2lzc29ycycsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDE3MixcbiAgICAgICAgeTogMjA1XG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIFNjaXNzb3JzIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdTaGlueSBhbmQgc2hhcnAhJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdOb3Qgc2FmZSBoYXZpbmcgc2Npc3NvcnMgYXJvdW5kIG11c2ljaWFucycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKSB7XG4gICAgICAgIGxldCBvdGhlck9iamVjdCA9IHNlbGVjdGVkVGhpbmcudGhpbmc7XG4gICAgICAgIGlmIChvdGhlck9iamVjdC5pZCA9PT0gJ2Jyb29tJykge1xuICAgICAgICAgICAgbGV0IGJyb29tID0gPEJyb29tPiBvdGhlck9iamVjdDtcbiAgICAgICAgICAgIGJyb29tLmN1dFdpdGhTY2lzc29ycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBkb25cXCd0IGtub3cgaG93IHRvIGRvIHRoYXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgQ29zdHVtZSB9IGZyb20gJy4vQ29zdHVtZSc7XG5pbXBvcnQgeyBDb2NvbnV0IH0gZnJvbSAnLi9Db2NvbnV0JztcbmltcG9ydCB7IEZsb3dlcnMgfSBmcm9tICcuLi9iYWNreWFyZFNjZW5lL0Zsb3dlcnMnO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnc2tpcnQnLFxuICAgIHNwcml0ZUlkOiAnc2tpcnQnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdTS0lSVCcsXG4gICAgbmFtZTogJ3NraXJ0JyxcbiAgICBkaXJlY3RseUluSW52ZW50b3J5OiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgU2tpcnQgZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBwbGF5ZXIuc2F5KCdJIGFtIHNlbnNpbmcgc29tZSBjb3N0dW1lIGhlcmUnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdmbG93ZXJzJykge1xuICAgICAgICAgICAgbGV0IGZsb3dlcnMgPSA8Rmxvd2Vycz4gc2VsZWN0ZWRUaGluZy50aGluZztcbiAgICAgICAgICAgIGZsb3dlcnMuY3JlYXRlQ29zdHVtZUZyb21Ta2lydChwbGF5ZXIsIHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjb2NvbnV0Jykge1xuICAgICAgICAgICAgbGV0IGNvY29udXQgPSA8Q29jb251dD4gc2VsZWN0ZWRUaGluZy50aGluZztcbiAgICAgICAgICAgIGNvY29udXQuY3JlYXRlQ29zdHVtZUZyb21Ta2lydChwbGF5ZXIsIHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjb3N0dW1lJykge1xuICAgICAgICAgICAgdGhpcy5hZGRTa2lydFRvQ29zdHVtZShwbGF5ZXIsIDxDb3N0dW1lPiBzZWxlY3RlZFRoaW5nLnRoaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0kgZG9uXFwndCBrbm93IGhvdyB0byBkbyB0aGF0Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRTa2lydFRvQ29zdHVtZShwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBjb3N0dW1lOiBDb3N0dW1lKTogdm9pZCB7XG4gICAgICAgIGNvc3R1bWUuYWRkU2tpcnQodGhpcyk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuXG5sZXQgb3B0aW9ucyA9IHtcbiAgICBpZDogJ3RhYmxlJyxcbiAgICB4OiA5MyxcbiAgICB5OiAxMzAsXG4gICAgc3ByaXRlSWQ6ICdUQUJMRScsXG4gICAgbmFtZTogJ3RhYmxlJyxcbiAgICBqdXN0RGVjb3JhdGlvbjogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIFRhYmxlIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgU3BlZWNoQnViYmxlIH0gZnJvbSAnLi4vLi4vZW5naW5lL3VpL1NwZWVjaEJ1YmJsZSc7XG5pbXBvcnQgeyBDYW4gfSBmcm9tICcuL0Nhbic7XG5pbXBvcnQgeyB1aUJsb2NrZXIgfSBmcm9tICcuLi8uLi9lbmdpbmUvdWkvVUlCbG9ja2VyLnNpbmdsZXRvbic7XG5cbmNvbnN0IE5PUk1BTF9GUkFNRSA9IDA7XG5jb25zdCBHUkVBU0VEX0ZSQU1FID0gMTtcbmNvbnN0IEdSRUFTRURfQU5EX1BVU0hFRF9GUkFNRSA9IDI7XG5cbmV4cG9ydCBjbGFzcyBWZW5kaW5nTWFjaGluZSBleHRlbmRzIFRoaW5nIHtcblxuICAgIHByaXZhdGUgc3BlZWNoQnViYmxlOiBTcGVlY2hCdWJibGU7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZDogJ3ZlbmRpbmcnLFxuICAgICAgICAgICAgeDogNTQsXG4gICAgICAgICAgICB5OiAxMzEsXG4gICAgICAgICAgICBzcHJpdGVJZDogJ1ZFTkRJTkdfU1BSSVRFJyxcbiAgICAgICAgICAgIG5hbWU6ICd2ZW5kaW5nIG1hY2hpbmUnLFxuICAgICAgICAgICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogODAsXG4gICAgICAgICAgICAgICAgeTogMTg1XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZSA9IG5ldyBTcGVlY2hCdWJibGUoe1xuICAgICAgICAgICAgb3duZXI6IHRoaXNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHB1c2hBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignUFVTSEVEJykpIHtcbiAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdJIGFscmVhZHkgcHVzaGVkIHRvbyBtdWNoJyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5nZXRBdHRyKCdHUkVBU0VEJykpIHtcbiAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuc2F5KCdBYWFhYXJhZ2FoZ2FoZ2hnaGdoZ2hnJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlQXR0cignUFVTSEVEJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcGxheWVyLmdvVG9UaGluZyh0aGlzKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1RoZSBmbG9vciBpcyBzbyBzdGlja3kgaXQgaXMgaW1wb3NzaWJsZSB0byBtb3ZlIGl0LicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnSWYgSSBjb3VsZCBqdXN0IHB1dCBzb21lIGdyZWFzZSBiZWxvdyBpdC4uLicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2JhY29uJykge1xuICAgICAgICAgICAgdGhpcy5ncmVhc2VXaXRoQmFjb24ocGxheWVyKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY29pbicpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2FuKHBsYXllciwgc2VsZWN0ZWRUaGluZy50aGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJIGRvblxcdCBrbm93IGhvdyB0byB1c2UgdGhhdCB3aXRoIGEgdmVuZGluZyBtYWNoaW5lLi4uJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNheSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BlZWNoQnViYmxlLnNheSh0ZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdyZWFzZVdpdGhCYWNvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VBdHRyKCdHUkVBU0VEJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcGxheWVyLnNheSgnTmljZSwgaXQgd2lsbCBzbGlkZSByZWFsbHkgd2VsbCBub3cuLi4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q2FuKHBsYXllcjogUGxheWVyLCBjb2luOiBUaGluZyk6IHZvaWQge1xuICAgICAgICB1aUJsb2NrZXIuYmxvY2soKTtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvaW4uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNheSgnQ2xvbmtcXG4gICBjbG9ua1xcbiAgICAgIGNsb25rJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBDYW4oKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc2F5KCdUaGF0IHdhcyBhIHdpc2UgcHVyY2hhc2UnKTtcbiAgICAgICAgICAgICAgICB1aUJsb2NrZXIudW5ibG9jaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uU3RhdGVDaGFuZ2UoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5zcHJpdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0dSRUFTRUQnKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignUFVTSEVEJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZSA9IEdSRUFTRURfQU5EX1BVU0hFRF9GUkFNRTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWUgPSBHUkVBU0VEX0ZSQU1FO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWUgPSBOT1JNQUxfRlJBTUU7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgRG9vciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvRG9vcic7XG5cbmV4cG9ydCBjbGFzcyBCYWNreWFyZERvb3JUb0JhY2tzdGFnZSBleHRlbmRzIERvb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkOiAnQkFDS1lBUkRfVE9fQkFDS1NUQUdFJyxcbiAgICAgICAgICAgIG5hbWU6ICdkb29yIHRvIGJhY2tzdGFnZScsXG4gICAgICAgICAgICB4OiAxNTAsXG4gICAgICAgICAgICB5OiA5NSxcbiAgICAgICAgICAgIHNwcml0ZUlkOiAnRE9PUl9TUFJJVEUnLFxuICAgICAgICAgICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMTc1LFxuICAgICAgICAgICAgICAgIHk6IDE2NVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uU2NlbmVJZDogJ0JBQ0tTVEFHRScsXG4gICAgICAgICAgICByZWxhdGVkRG9vcklkOiAnQkFDS1NUQUdFX1RPX0JBQ0tZQVJEJ1xuICAgICAgICB9O1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignT1BFTicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2JhY2tzdGFnZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Rvb3IgdG8gYmFja3N0YWdlJztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBTY2VuZSB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvU2NlbmUnO1xuaW1wb3J0IHsgQmFja3lhcmREb29yVG9CYWNrc3RhZ2UgfSBmcm9tICcuL0JhY2t5YXJkRG9vclRvQmFja3N0YWdlJztcbmltcG9ydCB7IEZsb3dlcnMgfSBmcm9tICcuL0Zsb3dlcnMnO1xuaW1wb3J0IHsgQmlsaSB9IGZyb20gJy4vQmlsaSc7XG5cbmNvbnN0IHNjZW5lT3B0aW9ucyA9IHtcbiAgICBpZDogJ0JBQ0tZQVJEJyxcbiAgICBiYWNrZ3JvdW5kSWQ6ICdCQUNLWUFSRF9CRycsXG4gICAgYm91bmRhcmllc0NvbmZpZzoge1xuICAgICAgICBtaW5ZOiAzMTAgLyAyLFxuICAgICAgICBtYXhZOiA0NTAgLyAyLFxuICAgICAgICBtaW5YOiAxODAgLyAyLFxuICAgICAgICBtYXhYOiAxMjAwIC8gMlxuICAgIH0sXG4gICAgdGhpbmdzOiBbXG4gICAgICAgIG5ldyBCYWNreWFyZERvb3JUb0JhY2tzdGFnZSgpLFxuICAgICAgICBuZXcgRmxvd2VycygpLFxuICAgICAgICBuZXcgQmlsaSgpXG4gICAgXVxufTtcblxuZXhwb3J0IGNsYXNzIEJhY2t5YXJkU2NlbmUgZXh0ZW5kcyBTY2VuZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKHNjZW5lT3B0aW9ucyk7XG4gICAgfVxufSIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IFNwZWVjaEJ1YmJsZSB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9TcGVlY2hCdWJibGUnO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uV2l0aEJpbGkgfSBmcm9tICcuL0NvbnZlcnNhdGlvbldpdGhCaWxpJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdiaWxpJyxcbiAgICB4OiAyNzQsXG4gICAgeTogMTUxLFxuICAgIHNwcml0ZUlkOiAnQklMSScsXG4gICAgbmFtZTogJ2JpbGknLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiAyNjAsXG4gICAgICAgIHk6IDIxNVxuICAgIH1cbn07XG5cbmV4cG9ydCBjbGFzcyBCaWxpIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBzcGVlY2hCdWJibGU6IFNwZWVjaEJ1YmJsZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5zcGVlY2hCdWJibGUgPSBuZXcgU3BlZWNoQnViYmxlKHtcbiAgICAgICAgICAgIG93bmVyOiB0aGlzXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLnNheSgnRWwgYmlsaSEnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc3BlYWtBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpLnRoZW4oXG4gICAgICAgICAgICAoKSA9PiBuZXcgQ29udmVyc2F0aW9uV2l0aEJpbGkocGxheWVyLCB0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHNheSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BlZWNoQnViYmxlLnNheSh0ZXh0KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb252ZXJzYXRpb24sIElDb252ZXJzYXRpb25TY3JpcHQgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL0NvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25MaW5lIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9Db252ZXJzYXRpb25MaW5lJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IEJpbGkgfSBmcm9tICcuL0JpbGknO1xuXG5jb25zdCBzY3JpcHQ6IElDb252ZXJzYXRpb25TY3JpcHQgPSB7XG4gICAgJ2luaXRpYWwnOiBbXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAnUXVlIGRpc2UgZWwgdGlvPyc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2luaXRpYWwnLFxuICAgICAgICAgICAgKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJpbGk6IEJpbGkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmlsaS5zYXkoJ1B1ZXMgYXF1w60gZXN0YW1vcycpO1xuICAgICAgICAgICAgfVxuICAgICAgICApLFxuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnQWRpw7NzIScsICdlbmQnKVxuICAgIF1cbn07XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJzYXRpb25XaXRoQmlsaSBleHRlbmRzIENvbnZlcnNhdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgcHJvdGVjdGVkIG90aGVyUGVyc29uOiBUaGluZykge1xuICAgICAgICBzdXBlcihwbGF5ZXIsIG90aGVyUGVyc29uKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFN0YXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YXRlID0gJ2luaXRpYWwnO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb2FkU2NyaXB0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNjcmlwdCA9IHNjcmlwdDtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IENvc3R1bWUgfSBmcm9tICcuLi9iYWNrc3RhZ2VTY2VuZS9Db3N0dW1lJztcbmltcG9ydCB7IFNraXJ0IH0gZnJvbSAnLi4vYmFja3N0YWdlU2NlbmUvU2tpcnQnO1xuaW1wb3J0IHsgQ29jb251dCB9IGZyb20gJy4uL2JhY2tzdGFnZVNjZW5lL0NvY29udXQnO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnZmxvd2VycycsXG4gICAgeDogMTA0LFxuICAgIHk6IDE2MSxcbiAgICBzcHJpdGVJZDogJ0ZMT1dFUlMnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdGTE9XRVJTJyxcbiAgICBuYW1lOiAnZmxvd2VycycsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDEyMCxcbiAgICAgICAgeTogMTg1XG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIEZsb3dlcnMgZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29zdHVtZUZyb21Db2NvbnV0KHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGNvY29udXQ6IENvY29udXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBoYXZlIHRvIHBpY2sgaXQgdXAgZmlyc3QnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY29zdHVtZSA9IG5ldyBDb3N0dW1lKCk7XG4gICAgICAgIGNvc3R1bWUuYWRkQ29jb251dChjb2NvbnV0KTtcbiAgICAgICAgY29zdHVtZS5hZGRGbG93ZXJzKHRoaXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJIGJldCBJIGNvdWxkIGRvIGEgYmVhdXRpZnVsIGNvc3R1bWUgd2l0aCB0aGlzJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdOaWNlIGZsb3dlcnMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCB1c2VBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcikge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2NvY29udXQnKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvc3R1bWVGcm9tQ29jb251dChwbGF5ZXIsIDxDb2NvbnV0PiBzZWxlY3RlZFRoaW5nLnRoaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnc2tpcnQnKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvc3R1bWVGcm9tU2tpcnQocGxheWVyLCA8U2tpcnQ+IHNlbGVjdGVkVGhpbmcudGhpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjb3N0dW1lJykge1xuICAgICAgICAgICAgdGhpcy5hZGRGbG93ZXJzVG9Db3N0dW1lKHBsYXllciwgPENvc3R1bWU+IHNlbGVjdGVkVGhpbmcudGhpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBkb25cXCd0IGtub3cgaG93IHRvIGRvIHRoYXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvc3R1bWVGcm9tU2tpcnQocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgc2tpcnQ6IFNraXJ0KSB7XG4gICAgICAgIGlmICghdGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0kgaGF2ZSB0byBwaWNrIGl0IHVwIGZpcnN0Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvc3R1bWUgPSBuZXcgQ29zdHVtZSgpO1xuICAgICAgICBjb3N0dW1lLmFkZFNraXJ0KHNraXJ0KTtcbiAgICAgICAgY29zdHVtZS5hZGRGbG93ZXJzKHRoaXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkRmxvd2Vyc1RvQ29zdHVtZShwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBjb3N0dW1lOiBDb3N0dW1lKSB7XG4gICAgICAgIGNvc3R1bWUuYWRkRmxvd2Vycyh0aGlzKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IHBoYXNlciB9IGZyb20gJy4vUGhhc2VyJztcbmltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vZW5naW5lL3VpL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IEJvb3RTY2VuZSB9IGZyb20gJy4vQm9vdFNjZW5lJztcbmltcG9ydCB7IFByZWxvYWRlclNjZW5lIH0gZnJvbSAnLi9QcmVsb2FkZXJTY2VuZSc7XG5pbXBvcnQgeyBwbGF5U2NlbmUgfSBmcm9tICcuL1BsYXlTY2VuZSc7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi9lbmdpbmUvc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGdhbWUgPSBuZXcgcGhhc2VyLkdhbWUobGF5b3V0LldJRFRILCBsYXlvdXQuSEVJR0hULCBwaGFzZXIuQVVUTywgJ2dhbWUnKTtcblxuICAgIHBoYXNlckdhbWUudmFsdWUgPSBnYW1lO1xuXG4gICAgZ2FtZS5zdGF0ZS5hZGQoJ2Jvb3QnLCBCb290U2NlbmUpO1xuICAgIGdhbWUuc3RhdGUuYWRkKCdwcmVsb2FkZXInLCBQcmVsb2FkZXJTY2VuZSk7XG4gICAgZ2FtZS5zdGF0ZS5hZGQoJ3BsYXknLCBwbGF5U2NlbmUpO1xuXG4gICAgZ2FtZS5zdGF0ZS5zdGFydCgnYm9vdCcpO1xufTtcbiJdfQ==
