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
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
        this.game.state.start('preloader');
    }
};

},{"./Phaser":2,"./engine/ui/LayoutManager.singleton":35}],2:[function(require,module,exports){
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
    render() {
        // phaserGame.value.debug.inputInfo(32, 32);
        // phaserGame.value.debug.pointer( phaserGame.value.input.activePointer );
    }
}
exports.playScene = new PlayScene();

},{"./game/DoctortillaGame":52}],4:[function(require,module,exports){
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
        this.game.state.start('startMenu');
    }
};

},{"./game/AssetsManager":50}],5:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./engine/ui/LayoutManager.singleton');
const Labels_store_1 = require('./engine/stores/Labels.store');
exports.StartMenuScene = {
    preload: function () { },
    create: function () {
        this.createLogo();
        this.createButtons();
    },
    createLogo: function () {
        let logo = this.game.add.sprite(LayoutManager_singleton_1.layout.LOGO_POSITION.x, LayoutManager_singleton_1.layout.LOGO_POSITION.y - 30, 'LOGO');
        let logoTween = this.game.add.tween(logo);
        logoTween.to({ y: LayoutManager_singleton_1.layout.LOGO_POSITION.y }, 1000, 'Elastic', true, 0);
        let theGame = this.game.add.sprite(LayoutManager_singleton_1.layout.THE_GAME_POSITION.x, LayoutManager_singleton_1.layout.THE_GAME_POSITION.y, 'THE_GAME');
        let theGameTween = this.game.add.tween(theGame);
        theGame.alpha = 0;
        theGameTween.to({ alpha: 1 }, 1000, 'Linear', true, 0);
    },
    createButtons: function () {
        this.createEnglishButton();
        this.createSpanishButton();
    },
    createEnglishButton: function () {
        var englishButton = this.game.add.button(LayoutManager_singleton_1.layout.ENGLISH_BUTTON_POSITION.x, LayoutManager_singleton_1.layout.ENGLISH_BUTTON_POSITION.y, 'ENGLISH_BUTTON', this.onEnglishButtonClick, this, 1, 0, 2, 1);
        englishButton.fixedToCamera = true;
    },
    createSpanishButton: function () {
        var spanishButton = this.game.add.button(LayoutManager_singleton_1.layout.SPANISH_BUTTON_POSITION.x, LayoutManager_singleton_1.layout.SPANISH_BUTTON_POSITION.y, 'SPANISH_BUTTON', this.onSpanishButtonClick, this, 1, 0, 2, 1);
        spanishButton.fixedToCamera = true;
    },
    onEnglishButtonClick: function () {
        Labels_store_1.labelsStore.setLanguage('en');
        this.game.state.start('play');
    },
    onSpanishButtonClick: function () {
        Labels_store_1.labelsStore.setLanguage('es');
        this.game.state.start('play');
    }
};

},{"./engine/stores/Labels.store":25,"./engine/ui/LayoutManager.singleton":35}],6:[function(require,module,exports){
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
        this.player.say(line.text(this.player))
            .then(() => {
            line.afterCallback(this.player, this.otherPerson)
                .then(() => {
                this.state = line.nextState;
            });
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

},{"../ui/ConversationUI":29,"../utils/Observable":46}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"../stores/Verbs.store":26,"../utils/ActionDispatcher":44,"./Thing":18}],9:[function(require,module,exports){
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
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.SELECT_THING, options => this.selectThing(options));
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
    selectThing(options) {
        var verb = Verbs_store_1.VerbsInfo.get(SelectedVerb_singleton_1.selectedVerb.verb);
        if (options.secondaryAction && options.thing.getPreferredAction()) {
            options.thing.applyAction(options.thing.getPreferredAction(), this.player);
            ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.ACTION_APPLIED);
        }
        else if (verb.singleObject) {
            options.thing.applyAction(SelectedVerb_singleton_1.selectedVerb.verb, this.player);
            ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.ACTION_APPLIED);
        }
        else {
            this.selectThingForMultipleObjectVerb(options.thing);
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

},{"../state/ActiveInventory.singleton":19,"../state/PhaserGame.singleton":20,"../state/Scenes.singleton":21,"../state/SelectedObjects":22,"../state/SelectedVerb.singleton":23,"../stores/Labels.store":25,"../stores/Verbs.store":26,"../ui/GraphicUI":31,"../utils/ActionDispatcher":44,"./GameCamera":10}],10:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":20,"../ui/Style":38}],11:[function(require,module,exports){
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

},{"../utils/ActionDispatcher":44,"../utils/Observable":46}],12:[function(require,module,exports){
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

},{"../utils/Observable":46}],13:[function(require,module,exports){
"use strict";
const Segment_1 = require('../utils/Segment');
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
class PathNode {
    constructor(options) {
        this.options = options;
        this.connections = [];
    }
    get id() {
        return this.options.point.x + '_' + this.options.point.y;
    }
    get point() {
        return this.options.point;
    }
    isFinal() {
        return !!this.options.finalNode;
    }
}
const SHOULD_PAINT = false;
const COLOR = 0x0033FF;
class PathFinderPainter {
    paint(firstNode, destination) {
        if (!SHOULD_PAINT) {
            return;
        }
        this.deleteCurrentGraphics();
        this.paintedNodes = new Map();
        this.paintNodeAndConnections(firstNode);
        let point1 = new Phaser.Circle(firstNode.point.x, firstNode.point.y, 4);
        PhaserGame_singleton_1.phaserGame.value.debug.geom(point1, '#0000ff');
        let point2 = new Phaser.Circle(destination.x, destination.y, 4);
        PhaserGame_singleton_1.phaserGame.value.debug.geom(point2, '#00ff00');
    }
    deleteCurrentGraphics() {
        PhaserGame_singleton_1.phaserGame.value.debug.destroy();
    }
    paintNodeAndConnections(node) {
        if (this.paintedNodes.get(node.id)) {
            return;
        }
        this.paintedNodes.set(node.id, true);
        for (let i = 0; i < node.connections.length; i++) {
            this.paintLine(node, node.connections[i]);
            this.paintNodeAndConnections(node.connections[i]);
        }
    }
    paintLine(node1, node2) {
        let line = new Phaser.Line(node1.point.x, node1.point.y, node2.point.x, node2.point.y);
        PhaserGame_singleton_1.phaserGame.value.debug.geom(line, '#ff0000');
    }
}
const pathFinderPainter = new PathFinderPainter();
class PathFinder {
    getPath(origin, destination, boundaries) {
        var insideOrigin = boundaries.getPositionInside(origin);
        var insideDestination = boundaries.getPositionInside(destination);
        if (boundaries.polygon.pointsCanSeeEachOther(insideOrigin, insideDestination)) {
            return [insideOrigin, insideDestination];
        }
        var concaveVertex = boundaries.polygon.getConcaveVertex();
        let graph = this.getGraphToSolve(insideOrigin, destination, concaveVertex, boundaries);
        return this.getSolutionToGraph(graph, destination);
    }
    getGraphToSolve(origin, destination, otherVertex, boundaries) {
        let initialNode = new PathNode({
            point: origin
        });
        let finalNode = new PathNode({
            point: destination,
            finalNode: true
        });
        let allNodes = [initialNode, finalNode];
        otherVertex.forEach((vertex) => {
            allNodes.push(new PathNode({
                point: vertex
            }));
        });
        for (let i = 0; i < allNodes.length; i++) {
            for (let j = i + 1; j < allNodes.length; j++) {
                if (boundaries.polygon.pointsCanSeeEachOther(allNodes[i].point, allNodes[j].point)) {
                    allNodes[i].connections.push(allNodes[j]);
                    allNodes[j].connections.push(allNodes[i]);
                }
            }
        }
        return initialNode;
    }
    heuristicCost(point, destination) {
        return (new Segment_1.Segment(point, destination)).length;
    }
    realCost(point, destination) {
        return (new Segment_1.Segment(point, destination)).length;
    }
    //https://en.wikipedia.org/wiki/A*_search_algorithm#Algorithm_description
    getSolutionToGraph(firstNode, destination) {
        pathFinderPainter.paint(firstNode, destination);
        let closedSet = new Set();
        let openSet = new Set();
        openSet.add(firstNode);
        // For each node, which node it can most efficiently be reached from.
        // If a node can be reached from many nodes, cameFrom will eventually contain the
        // most efficient previous step.
        let cameFrom = new Map();
        // For each node, the cost of getting from the start node to that node.
        let gScore = new Map; // default value of Infinity
        gScore.set(firstNode, 0); // The cost of going from start to start is zero.
        // For each node, the total cost of getting from the start node to the goal
        // by passing by that node. That value is partly known, partly heuristic.
        let fScore = new Map; // default value of Infinity
        fScore.set(firstNode, this.heuristicCost(firstNode.point, destination));
        while (openSet.size > 0) {
            let current = this.findLowestScore(fScore, openSet);
            if (current.isFinal()) {
                return this.reconstructPath(cameFrom, current);
            }
            openSet.delete(current);
            closedSet.add(current);
            for (let i = 0; i < current.connections.length; i++) {
                let neighbor = current.connections[i];
                if (closedSet.has(neighbor)) {
                    continue;
                }
                let tentativeGScore = this.getGScore(gScore, current) + this.realCost(current.point, neighbor.point);
                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
                else if (tentativeGScore >= this.getGScore(gScore, neighbor)) {
                    continue; // This is not a better path.
                }
                // This path is the best until now. Record it!
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                let newFScore = this.getGScore(gScore, neighbor) + this.heuristicCost(neighbor.point, destination);
                fScore.set(neighbor, newFScore);
            }
        }
        throw 'ERROR, could not find a path';
    }
    getGScore(gScore, node) {
        if (gScore.has(node)) {
            return gScore.get(node);
        }
        else {
            return Infinity;
        }
    }
    findLowestScore(scores, openSet) {
        let lowestScore, lowestNode;
        let alreadyHasValue = false;
        scores.forEach((value, node) => {
            if (openSet.has(node)) {
                if (!alreadyHasValue || (value < lowestScore)) {
                    alreadyHasValue = true;
                    lowestScore = value;
                    lowestNode = node;
                }
            }
        });
        return lowestNode;
    }
    reconstructPath(cameFrom, current) {
        let totalPath = [current.point];
        while (cameFrom.has(current)) {
            current = cameFrom.get(current);
            totalPath.push(current.point);
        }
        return totalPath.reverse();
    }
}
exports.pathFinder = new PathFinder();

},{"../state/PhaserGame.singleton":20,"../utils/Segment":49}],14:[function(require,module,exports){
"use strict";
const Inventory_1 = require('./Inventory');
const PlayerMovementHandler_1 = require('./PlayerMovementHandler');
const UILayers_singleton_1 = require('../ui/UILayers.singleton');
const Directions_1 = require('../utils/Directions');
const SpeechBubble_1 = require('../ui/SpeechBubble');
class Player {
    constructor(options) {
        this.options = options;
        this.inventory = new Inventory_1.Inventory();
        this.movementHandler = new PlayerMovementHandler_1.PlayerMovementHandler(this);
        this.createSprite();
        this.direction = Directions_1.Directions.RIGHT;
        this.playStandAnimation();
        this.speechBubble = new SpeechBubble_1.SpeechBubble({
            owner: this
        });
        this._state = new Map();
    }
    moveTo(destination) {
        return this.movementHandler.moveTo(destination);
    }
    get sprite() {
        return this._sprite;
    }
    get speed() {
        let speed = {
            x: this.options.xSpeed,
            y: this.options.ySpeed,
        };
        return speed;
    }
    get direction() {
        return this._direction;
    }
    set direction(newDirection) {
        this._direction = newDirection;
    }
    get position() {
        return {
            x: this._sprite.x,
            y: this._sprite.y
        };
    }
    goToThing(thing) {
        return this.moveTo(thing.getPositionToGoTo())
            .then(() => {
            let direction = thing.getDirectionToLook();
            if (direction) {
                this.lookAt(direction);
            }
        });
    }
    lookAt(direction) {
        this.direction = direction;
        this.playStandAnimation();
    }
    say(text) {
        this.playTalkingAnimation();
        return this.speechBubble.say(text).then(() => {
            this.stopTalkingAnimation();
        });
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
        this.movementHandler.moveToWithoutAnimation(destination);
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
    playWalkingAnimation() {
        let directionName = Directions_1.getDirectionName(this.direction);
        let spriteState = 'walk_' + directionName;
        this._sprite.animations.play(spriteState);
        this.flipXIfNeeded(spriteState);
    }
    playStandAnimation() {
        let directionName = Directions_1.getDirectionName(this.direction);
        let spriteState = 'stand_' + directionName;
        this._sprite.animations.play(spriteState);
        this.flipXIfNeeded(spriteState);
    }
    updateOnTweenMove() {
        if (this.speechBubble.isShown()) {
            this.speechBubble.updatePosition();
        }
    }
    stopAnimations() {
        this.playStandAnimation();
        this._sprite.animations.stop();
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
    getAngleToDesiredPosition(destination) {
        return Math.atan2(this.sprite.y - destination.y, this.sprite.x - destination.x);
    }
    //This method can be overwritten in child classes
    onStateChange() { }
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
    playTalkingAnimation() {
        let directionName = Directions_1.getDirectionName(this.direction);
        let spriteState = 'talk_' + directionName;
        this._sprite.animations.play(spriteState);
        this.flipXIfNeeded(spriteState);
    }
    stopTalkingAnimation() {
        if (this._sprite.animations &&
            this._sprite.animations.name &&
            (this._sprite.animations.name.indexOf('talk') === 0)) {
            this.stopAnimations();
        }
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
}
exports.Player = Player;

},{"../ui/SpeechBubble":37,"../ui/UILayers.singleton":42,"../utils/Directions":45,"./Inventory":12,"./PlayerMovementHandler":15}],15:[function(require,module,exports){
"use strict";
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const Scenes_singleton_1 = require('../state/Scenes.singleton');
const PathFinder_1 = require('./PathFinder');
class SingleMove {
    constructor(player, destination) {
        this.player = player;
        this.destination = destination;
        let timeToAnimate = this.getTimeForAnimation(destination);
        if (timeToAnimate) {
            this.player.updateDirection(destination);
            this.player.playWalkingAnimation();
            this.tween = PhaserGame_singleton_1.phaserGame.value.add.tween(this.player.sprite);
            this.tween.to({ x: destination.x, y: destination.y }, timeToAnimate, 'Linear', true, 0);
            this.tween.onUpdateCallback(this.player.updateOnTweenMove, this.player);
        }
        this.willMovePromise = this.createMovePromise(timeToAnimate);
    }
    whenFinished() {
        return this.willMovePromise.promise;
    }
    cancel() {
        this.destroy();
    }
    destroy() {
        this.cancelCurrentTween();
        this.cancelCurrentMovePromise();
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
        let angleBetween = this.player.getAngleToDesiredPosition(destination);
        let diff1 = this.player.sprite.x - destination.x;
        let diff2 = this.player.sprite.y - destination.y;
        let distance = Math.sqrt((diff1 * diff1) + (diff2 * diff2));
        let speedFromX = Math.abs(Math.cos(angleBetween)) * distance / this.player.speed.x;
        let speedFromY = Math.abs(Math.sin(angleBetween)) * distance / this.player.speed.y;
        return 1000 * ((speedFromX + speedFromY) / 2);
    }
}
class PlayerMovementHandler {
    constructor(player) {
        this.player = player;
    }
    moveTo(destination) {
        this.cancelCurrentMove();
        let promise = new Promise((resolve, reject) => {
            this.resolvePromiseCallback = resolve;
        });
        this.currentPath = PathFinder_1.pathFinder.getPath(this.player.position, destination, Scenes_singleton_1.scenes.currentScene.boundaries);
        this.goToNextPosition();
        return promise;
    }
    goToNextPosition() {
        if (this.currentPath && this.currentPath.length) {
            this.currentSingleMove = new SingleMove(this.player, this.currentPath.shift());
            this.currentSingleMove.whenFinished().then(() => {
                this.goToNextPosition();
            });
        }
        else {
            if (this.resolvePromiseCallback) {
                this.player.stopAnimations();
                this.resolvePromiseCallback();
            }
        }
    }
    moveToWithoutAnimation(destination) {
        let safePosition = Scenes_singleton_1.scenes.currentScene.boundaries.getPositionInside(destination);
        this.player.updateDirection(safePosition);
        this.cancelCurrentMove();
        this.player.playStandAnimation();
        this.player.sprite.x = safePosition.x;
        this.player.sprite.y = safePosition.y;
    }
    cancelCurrentMove() {
        if (this.currentSingleMove) {
            this.player.stopAnimations();
            this.currentSingleMove.cancel();
            this.resolvePromiseCallback = null;
        }
    }
}
exports.PlayerMovementHandler = PlayerMovementHandler;

},{"../state/PhaserGame.singleton":20,"../state/Scenes.singleton":21,"./PathFinder":13}],16:[function(require,module,exports){
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
        this._boundaries.paint();
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
        this._boundaries.unpaint();
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

},{"../ui/UILayers.singleton":42,"../utils/ActionDispatcher":44,"./SceneBoundaries":17}],17:[function(require,module,exports){
"use strict";
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const SHOULD_PAINT = false;
class SceneBoundaries {
    constructor(config) {
        this.config = config;
    }
    getPositionInside(point) {
        if (this.polygon.isPointInside(point)) {
            return point;
        }
        return this.polygon.getClosestPointTo(point);
    }
    get polygon() {
        return this.config;
    }
    paint() {
        if (SHOULD_PAINT) {
            this.graphics = this.paintPolygon(this.config, 0xFF3300, 0xffd900);
            this.boundingGraphics = this.paintPolygon(this.config.getConvexHull(), 0x0033FF, 0x00d9ff);
        }
    }
    unpaint() {
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }
    }
    paintPolygon(polygon, fillColor, lineColor) {
        let points = polygon.points;
        let graphics = PhaserGame_singleton_1.phaserGame.value.add.graphics(0, 0);
        graphics.beginFill(fillColor, 0.5);
        graphics.lineStyle(1, lineColor, 1);
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.endFill();
        return graphics;
    }
}
exports.SceneBoundaries = SceneBoundaries;

},{"../state/PhaserGame.singleton":20}],18:[function(require,module,exports){
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
        this.addSpriteAnimations();
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
        if (this.isInInventory()) {
            return this.options.preferredInventoryAction || Verbs_store_1.Verbs.LOOK;
        }
        else {
            return this.options.preferredAction || null;
        }
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
    getDirectionToLook() {
        return this.options.directionToLook || null;
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
    playAnimation(animationName) {
        if (this.options.spriteOptions.has(animationName)) {
            this.sprite.animations.play(animationName);
        }
        else {
            throw 'ERROR: trying to play animation that doesn\'t exist';
        }
    }
    playAnimationOnce(animationName) {
        let promise = new Promise((resolve, reject) => {
            if (this.options.spriteOptions.has(animationName)) {
                this.sprite.animations.play(animationName, null, false); //False so it does not loop
                this.sprite.animations.currentAnim.onComplete.add(() => {
                    resolve();
                });
            }
            else {
                reject();
            }
        });
        return promise;
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
        if (this.options.opacity) {
            this.sprite.alpha = this.options.opacity;
        }
        if (!this.options.justDecoration) {
            this.sprite.inputEnabled = true;
            this.sprite.events.onInputDown.add(this.onClick, this);
            this.sprite.events.onInputOver.add(this.onInputOver, this);
            this.sprite.events.onInputOut.add(this.onInputOut, this);
        }
    }
    onClick(receptor, pointer) {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.SELECT_THING, {
            thing: this,
            secondaryAction: !!pointer.rightButton.isDown
        });
    }
    onInputOver() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.CURSOR_OVER_THING, this);
    }
    onInputOut() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.CURSOR_OUT_THING, this);
    }
    addSpriteAnimations() {
        if (this.options.spriteOptions) {
            this.options.spriteOptions.forEach((spritePosition, key) => {
                this.sprite.animations.add(key, spritePosition.frames, this.options.animationSpeed, true);
            });
        }
    }
}
exports.Thing = Thing;

},{"../state/ActiveInventory.singleton":19,"../stores/Verbs.store":26,"../ui/UILayers.singleton":42,"../utils/ActionDispatcher":44}],19:[function(require,module,exports){
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

},{"../utils/Observable":46}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"../models/GenericHighlightedThing":11,"../stores/Verbs.store":26,"../utils/ActionDispatcher":44,"./SelectedVerb.singleton":23}],23:[function(require,module,exports){
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

},{"../stores/Verbs.store":26,"../utils/ActionDispatcher":44,"../utils/Observable":46}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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
    setLanguage(newLanguage) {
        this.currentLanguage = newLanguage;
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

},{"./DefaultLabels":24}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":20,"../stores/Labels.store":25,"../stores/Verbs.store":26,"../utils/ActionDispatcher":44,"./LayoutManager.singleton":35,"./TextWithShadow":40,"./UILayers.singleton":42}],28:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":20,"../utils/Observable":46,"./LayoutManager.singleton":35,"./TextWithShadow":40,"./UILayers.singleton":42}],29:[function(require,module,exports){
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

},{"../../engine/ui/UIBlocker.singleton":41,"./ConversationLineUI":28,"./LayoutManager.singleton":35,"./UILayers.singleton":42}],30:[function(require,module,exports){
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

},{"../state/SelectedObjects":22,"../state/SelectedVerb.singleton":23,"../stores/Labels.store":25,"../stores/Verbs.store":26,"./LayoutManager.singleton":35,"./TextWithShadow":40,"./UILayers.singleton":42}],31:[function(require,module,exports){
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

},{"./CurrentActionUI":30,"./InventoryUI":34,"./LayoutManager.singleton":35,"./ReflectButton":36,"./UILayers.singleton":42,"./VerbsUI":43}],32:[function(require,module,exports){
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
    onClick(receptor, pointer) {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.SELECT_THING, {
            thing: this.options.thing,
            secondaryAction: !!pointer.rightButton.isDown
        });
    }
    onInputOver() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.CURSOR_OVER_THING, this.options.thing);
    }
    onInputOut() {
        ActionDispatcher_1.actionDispatcher.execute(ActionDispatcher_1.Actions.CURSOR_OUT_THING, this.options.thing);
    }
}
exports.InventoryItemUI = InventoryItemUI;

},{"../utils/ActionDispatcher":44,"./LayoutManager.singleton":35,"./UILayers.singleton":42}],33:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
const Observable_1 = require('../utils/Observable');
(function (PaginationButtonType) {
    PaginationButtonType[PaginationButtonType["UP"] = 1] = "UP";
    PaginationButtonType[PaginationButtonType["DOWN"] = 2] = "DOWN";
})(exports.PaginationButtonType || (exports.PaginationButtonType = {}));
var PaginationButtonType = exports.PaginationButtonType;
;
class InventoryPaginationButton {
    constructor(options) {
        this.options = options;
        this.clickObservable = new Observable_1.Observable();
        this.createButton();
    }
    subscribeToClick(callback) {
        this.clickObservable.registerObserver(callback);
    }
    createButton() {
        let position;
        if (this.options.type === PaginationButtonType.UP) {
            position = LayoutManager_singleton_1.layout.getPaginationButtonUp();
        }
        else {
            position = LayoutManager_singleton_1.layout.getPaginationButtonDown();
        }
        this.button = PhaserGame_singleton_1.phaserGame.value.add.button(position.x, position.y, 'PAGINATION_BUTTON_UP', this.onClick, this, 1, 0, 2, 1);
        if (this.options.type === PaginationButtonType.DOWN) {
            this.button.scale.y = -1;
            this.button.anchor.setTo(0, 1);
        }
        UILayers_singleton_1.uiLayers.verbButtons.add(this.button);
        this.button.fixedToCamera = true;
    }
    onClick() {
        this.clickObservable.notifyObservers(null);
    }
}
exports.InventoryPaginationButton = InventoryPaginationButton;

},{"../state/PhaserGame.singleton":20,"../utils/Observable":46,"./LayoutManager.singleton":35,"./UILayers.singleton":42}],34:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
const InventoryItemUI_1 = require('./InventoryItemUI');
const ActiveInventory_singleton_1 = require('../state/ActiveInventory.singleton');
const InventoryPaginationButton_1 = require('./InventoryPaginationButton');
const ITEMS_PER_PAGE = 6;
class InventoryUI {
    constructor() {
        this.currentPage = 0;
        this.createBackground();
        this.createPaginationButtons();
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
    createPaginationButtons() {
        this.paginationButtonUp = new InventoryPaginationButton_1.InventoryPaginationButton({ type: InventoryPaginationButton_1.PaginationButtonType.UP });
        this.paginationButtonDown = new InventoryPaginationButton_1.InventoryPaginationButton({ type: InventoryPaginationButton_1.PaginationButtonType.DOWN });
        this.paginationButtonUp.subscribeToClick(() => {
            this.goToPrevPage();
        });
        this.paginationButtonDown.subscribeToClick(() => {
            this.goToNextPage();
        });
    }
    createItems() {
        this.destroyPrevItems();
        let index = 0;
        let arrayOfThings = Array.from(this.currentInventory.items);
        let firstPageElement = ITEMS_PER_PAGE * this.currentPage;
        let nextPageFirstElement = ITEMS_PER_PAGE * (this.currentPage + 1);
        for (let i = firstPageElement; (i < nextPageFirstElement) && (i < arrayOfThings.length); i++) {
            this.items.add(new InventoryItemUI_1.InventoryItemUI({
                thing: arrayOfThings[i],
                index: index
            }));
            index += 1;
        }
    }
    destroyPrevItems() {
        this.items.forEach(item => item.destroy());
        this.items.clear();
    }
    goToNextPage() {
        if (this.currentInventory.items.size >= (ITEMS_PER_PAGE * (this.currentPage + 1))) {
            this.currentPage++;
            this.createItems();
        }
    }
    goToPrevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.createItems();
        }
    }
}
exports.InventoryUI = InventoryUI;

},{"../state/ActiveInventory.singleton":19,"./InventoryItemUI":32,"./InventoryPaginationButton":33,"./LayoutManager.singleton":35,"./UILayers.singleton":42}],35:[function(require,module,exports){
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
const LOGO_SIZE = {
    x: 502,
    y: 175
};
const THE_GAME_SIZE = {
    x: 150,
    y: 43
};
const LANGUAGE_BUTTON_SIZE = {
    x: 136,
    y: 27
};
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
        return this.getInventoryPositionFromRowAndColumn(row, column);
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
    get LOGO_POSITION() {
        return {
            x: Math.round((this.WIDTH - LOGO_SIZE.x) / 2),
            y: 20
        };
    }
    get THE_GAME_POSITION() {
        return {
            x: Math.round((this.WIDTH - THE_GAME_SIZE.x) / 2),
            y: 155
        };
    }
    get ENGLISH_BUTTON_POSITION() {
        let x = Math.round(this.WIDTH / 2) - LANGUAGE_BUTTON_SIZE.x - 5;
        let y = this.HEIGHT - LANGUAGE_BUTTON_SIZE.y - 30;
        return {
            x: x,
            y: y
        };
    }
    get SPANISH_BUTTON_POSITION() {
        let x = Math.round(this.WIDTH / 2) + 5;
        let y = this.HEIGHT - LANGUAGE_BUTTON_SIZE.y - 30;
        return {
            x: x,
            y: y
        };
    }
    getPositionForConversationLine(index) {
        let marginY = (index + 1) * this.LAYOUT_DEFAULT_MARGIN;
        let positionY = this.CONVERSATION_LINE_HEIGHT * index;
        return {
            x: this.LAYOUT_DEFAULT_MARGIN,
            y: this.UI_START_POSITION.y + marginY + positionY
        };
    }
    getPaginationButtonUp() {
        let column = INV_COLUMNS;
        let row = 0;
        return this.getInventoryPositionFromRowAndColumn(row, column);
    }
    getPaginationButtonDown() {
        let column = INV_COLUMNS;
        let row = 1;
        return this.getInventoryPositionFromRowAndColumn(row, column);
    }
    getInventoryPositionFromRowAndColumn(row, column) {
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

},{}],36:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":20,"../stores/Labels.store":25,"../utils/ActionDispatcher":44,"./LayoutManager.singleton":35,"./TextWithShadow":40,"./UILayers.singleton":42}],37:[function(require,module,exports){
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
    isShown() {
        return !!this.textBeingSaid;
    }
    updatePosition() {
        if (!this.isShown()) {
            return;
        }
        this.textBeingSaid.setPosition(this.options.owner.getPositionOnTop());
    }
    destroyPrevText() {
        if (this.textBeingSaid) {
            this.textBeingSaid.destroy();
            this.textBeingSaid = null;
        }
    }
}
exports.SpeechBubble = SpeechBubble;

},{"./TextInScene":39}],38:[function(require,module,exports){
"use strict";
exports.style = Object.freeze({
    DEFAULT_FONT_SIZE: 8,
    FONT_SHADOW_X: 1,
    FONT_SHADOW_Y: 1,
    CAMERA_EASING_FACTOR: 0.025,
    DEFAULT_ANIMATION_SPEED: 6
});

},{}],39:[function(require,module,exports){
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
        this.position = Object.assign({}, this.options.position);
        this.createText();
        if (this.options.autoDestroy) {
            this.promiseToDestroy = this.autoDestroy();
        }
    }
    get promise() {
        return this.promiseToDestroy;
    }
    setPosition(newPosition) {
        this.position = newPosition;
        if (this.currentText) {
            let position = this.getPosition();
            this.currentText.setPosition(position);
        }
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
    getPosition() {
        return {
            x: this.getXPositionForText(this.textInLines),
            y: this.getYPositionForText(this.textInLines)
        };
    }
    createText() {
        this.textInLines = this.addLinesSeparators(this.options.text, this.options.width);
        this.currentText = new TextWithShadow_1.TextWithShadow({
            position: this.getPosition(),
            layer: UILayers_singleton_1.uiLayers.textInScene,
            initialText: this.textInLines,
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
        let result = this.position.x - (maxWidth / 2);
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
        return this.position.y - totalHeight;
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

},{"../state/Scenes.singleton":21,"./Style":38,"./TextWithShadow":40,"./UILayers.singleton":42}],40:[function(require,module,exports){
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
    setPosition(newPosition) {
        if (this.text && this.shadowText) {
            this.text.x = newPosition.x;
            this.text.y = newPosition.y;
            this.shadowText.x = newPosition.x + 1;
            this.shadowText.y = newPosition.y + 1;
        }
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

},{"../state/PhaserGame.singleton":20,"./Style":38}],41:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":20,"./LayoutManager.singleton":35,"./UILayers.singleton":42}],42:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":20}],43:[function(require,module,exports){
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
        ActionDispatcher_1.actionDispatcher.subscribeTo(ActionDispatcher_1.Actions.ACTION_APPLIED, () => this.removePreviouslyHighlightedAction());
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

},{"../stores/Verbs.store":26,"../utils/ActionDispatcher":44,"./ActionButton":27}],44:[function(require,module,exports){
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

},{"./Observable":46}],45:[function(require,module,exports){
"use strict";
(function (Directions) {
    Directions[Directions["UP"] = 1] = "UP";
    Directions[Directions["DOWN"] = 2] = "DOWN";
    Directions[Directions["LEFT"] = 3] = "LEFT";
    Directions[Directions["RIGHT"] = 4] = "RIGHT";
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
"use strict";
const Segment_1 = require('./Segment');
const MIDDLE_POINTS_TO_CHECK = 10;
const MIN_DISTANCE_TO_BE_IN_LINE = 1;
function sorterByXThenY(pointA, pointB) {
    if (pointA.x === pointB.x) {
        return pointA.y - pointB.y;
    }
    else {
        return pointA.x - pointB.x;
    }
}
function cross(pointO, pointA, pointB) {
    return (pointA.x - pointO.x) * (pointB.y - pointO.y) - (pointA.y - pointO.y) * (pointB.x - pointO.x);
}
function lineSegmentsCross(a, b, c, d) {
    let denominator = ((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x));
    if (denominator === 0) {
        return false;
    }
    let numerator1 = ((a.y - c.y) * (d.x - c.x)) - ((a.x - c.x) * (d.y - c.y));
    let numerator2 = ((a.y - c.y) * (b.x - a.x)) - ((a.x - c.x) * (b.y - a.y));
    if (numerator1 === 0 || numerator2 === 0) {
        return false;
    }
    let r = numerator1 / denominator;
    let s = numerator2 / denominator;
    return (r > 0 && r < 1) && (s > 0 && s < 1);
}
class Polygon {
    constructor(_points) {
        this._points = _points;
        if (!_points.length || _points.length < 3) {
            throw 'ERROR creating polygon, it needs at least 3 points';
        }
    }
    get points() {
        return this._points;
    }
    get segments() {
        if (!this._segments) {
            this.createSegments();
        }
        return this._segments;
    }
    getConvexHull() {
        if (!this.convexHull) {
            this.convexHull = this.calculateConvexHull();
        }
        return this.convexHull;
    }
    //Concave vertex are the ones that do not belong to the convexHull
    getConcaveVertex() {
        let convexHull = this.getConvexHull();
        let result = [];
        for (let point of this._points) {
            if (!convexHull.hasPoint(point)) {
                result.push(point);
            }
        }
        return result;
    }
    hasPoint(pointToSearch) {
        for (let point of this._points) {
            if ((point.x === pointToSearch.x) && (point.y === pointToSearch.y)) {
                return true;
            }
        }
        return false;
    }
    isPointInside(point) {
        if (this.hasPoint(point)) {
            return true;
        }
        for (let i = 0; i < this.segments.length; i++) {
            if (this.segments[i].distanceToPoint(point) < MIN_DISTANCE_TO_BE_IN_LINE) {
                return true;
            }
        }
        let phaserPolygon = new Phaser.Polygon(this.points.map((eachPoint) => {
            return new Phaser.Point(eachPoint.x, eachPoint.y);
        }));
        return phaserPolygon.contains(point.x, point.y);
    }
    getClosestPointTo(point) {
        var closestSegment = this.getClosestSegment(point);
        return closestSegment.getClosestPointTo(point);
    }
    getClosestSegment(point) {
        let segments = this.segments;
        let closestSegment = this.segments[0];
        let minDistance = closestSegment.distance2ToPoint(point);
        for (let i = 1; i < segments.length; i++) {
            let nextSegment = segments[i];
            let nextDistance = nextSegment.distance2ToPoint(point);
            if (nextDistance < minDistance) {
                closestSegment = nextSegment;
                minDistance = nextDistance;
            }
        }
        return closestSegment;
    }
    pointsCanSeeEachOther(pointA, pointB) {
        // debugger;
        if (!this.isPointInside(pointA) || !this.isPointInside(pointB)) {
            return false;
        }
        if (!this.middlePointsAreInside(pointA, pointB)) {
            return false;
        }
        let segments = this.segments;
        let segmentBetweenPoints = new Segment_1.Segment(pointA, pointB);
        for (let i = 0; i < segments.length; i++) {
            if (segments[i].isCrossedBy(segmentBetweenPoints)) {
                return false;
            }
        }
        return true;
    }
    middlePointsAreInside(pointA, pointB, pointsToCheck = MIDDLE_POINTS_TO_CHECK) {
        let point1 = new Phaser.Point(pointA.x, pointA.y);
        let point2 = new Phaser.Point(pointB.x, pointB.y);
        for (let i = 1; i <= pointsToCheck; i++) {
            let ratio = i / (pointsToCheck + 1);
            let pointInBetween = Phaser.Point.interpolate(point1, point2, ratio);
            if (!this.isPointInside({ x: pointInBetween.x, y: pointInBetween.y })) {
                return false;
            }
        }
        return true;
    }
    // Using https://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain
    calculateConvexHull() {
        let orderedPoints = Array.from(this._points);
        orderedPoints.sort(sorterByXThenY);
        var lower = [];
        for (var i = 0; i < orderedPoints.length; i++) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], orderedPoints[i]) <= 0) {
                lower.pop();
            }
            lower.push(orderedPoints[i]);
        }
        var upper = [];
        for (var i = orderedPoints.length - 1; i >= 0; i--) {
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], orderedPoints[i]) <= 0) {
                upper.pop();
            }
            upper.push(orderedPoints[i]);
        }
        upper.pop();
        lower.pop();
        return new Polygon(lower.concat(upper));
    }
    createSegments() {
        this._segments = [];
        for (let i = 0; i < (this._points.length - 1); i++) {
            this._segments.push(new Segment_1.Segment(this._points[i], this._points[i + 1]));
        }
        this._segments.push(new Segment_1.Segment(this._points[this._points.length - 1], this._points[0]));
    }
}
exports.Polygon = Polygon;

},{"./Segment":49}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
"use strict";
function sqr(x) {
    return x * x;
}
function distance2(pointA, pointB) {
    return sqr(pointA.x - pointB.x) + sqr(pointA.y - pointB.y);
}
class Segment {
    constructor(pointA, pointB) {
        this.pointA = pointA;
        this.pointB = pointB;
    }
    get length() {
        return Math.sqrt(distance2(this.pointA, this.pointB));
    }
    //Based on http://stackoverflow.com/a/1501725/3493388
    distanceToPoint(point) {
        return Math.sqrt(this.distance2ToPoint(point));
    }
    distance2ToPoint(point) {
        var length2 = distance2(this.pointA, this.pointB);
        if (length2 === 0) {
            return distance2(this.pointA, this.pointB);
        }
        var t = ((point.x - this.pointA.x) * (this.pointB.x - this.pointA.x) + (point.y - this.pointA.y) * (this.pointB.y - this.pointA.y)) / length2;
        t = Math.max(0, Math.min(1, t));
        return distance2(point, {
            x: this.pointA.x + t * (this.pointB.x - this.pointA.x),
            y: this.pointA.y + t * (this.pointB.y - this.pointA.y)
        });
    }
    //Based on http://www.java2s.com/Code/Java/2D-Graphics-GUI/Returnsclosestpointonsegmenttopoint.htm
    getClosestPointTo(point) {
        let xDelta = this.pointB.x - this.pointA.x;
        let yDelta = this.pointB.y - this.pointA.y;
        if ((xDelta === 0) && (yDelta === 0)) {
            return this.pointA; //Line is actually a point
        }
        let u = ((point.x - this.pointA.x) * xDelta + (point.y - this.pointA.y) * yDelta) / (xDelta * xDelta + yDelta * yDelta);
        if (u < 0) {
            return this.pointA;
        }
        if (u > 1) {
            return this.pointB;
        }
        return {
            x: this.pointA.x + u * xDelta,
            y: this.pointA.y + u * yDelta
        };
    }
    isCrossedBy(segment) {
        if (this.isEqual(segment)) {
            return false;
        }
        let line1 = new Phaser.Line(this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y);
        let line2 = new Phaser.Line(segment.pointA.x, segment.pointA.y, segment.pointB.x, segment.pointB.y);
        var otherSegmentInsideThis = line1.pointOnSegment(segment.pointA.x, segment.pointA.y) || line1.pointOnSegment(segment.pointB.x, segment.pointB.y);
        if (otherSegmentInsideThis) {
            return false;
        }
        var thisSegmentInsideOther = line2.pointOnSegment(this.pointA.x, this.pointA.y) || line2.pointOnSegment(this.pointB.x, this.pointB.y);
        if (thisSegmentInsideOther) {
            return false;
        }
        let intersection = line1.intersects(line2, true);
        return !!intersection;
    }
    // private lineToString(line: Phaser.Line): string {
    //     return '[(' + line.start.x + ',' + line.start.y + ')-(' + line.end.x + ',' + line.end.y + ')]';
    // }
    isEqual(segment) {
        if (this.pointsAreEqual(this.pointA, segment.pointA) && this.pointsAreEqual(this.pointB, segment.pointB)) {
            return true;
        }
        if (this.pointsAreEqual(this.pointB, segment.pointA) && this.pointsAreEqual(this.pointA, segment.pointB)) {
            return true;
        }
        return false;
    }
    pointsAreEqual(pointA, pointB) {
        return (pointA.x === pointB.x) && (pointA.y === pointB.y);
    }
}
exports.Segment = Segment;
// public static Point getClosestPointOnSegment(int sx1, int sy1, int sx2, int sy2, int px, int py)
//   {
//     double xDelta = sx2 - sx1;
//     double yDelta = sy2 - sy1;
//     if ((xDelta == 0) && (yDelta == 0))
//     {
//       throw new IllegalArgumentException("Segment start equals segment end");
//     }
//     double u = ((px - sx1) * xDelta + (py - sy1) * yDelta) / (xDelta * xDelta + yDelta * yDelta);
//     final Point closestPoint;
//     if (u < 0)
//     {
//       closestPoint = new Point(sx1, sy1);
//     }
//     else if (u > 1)
//     {
//       closestPoint = new Point(sx2, sy2);
//     }
//     else
//     {
//       closestPoint = new Point((int) Math.round(sx1 + u * xDelta), (int) Math.round(sy1 + u * yDelta));
//     }
//     return closestPoint;
//   }
// }

},{}],50:[function(require,module,exports){
"use strict";
;
;
;
const SPRITES = {
    // UI
    'BUTTON_BG': ['images/ui/BUTTON_BG_SPRITE.png', 75, 18, 3],
    'CONVERSATION_LINE_BG': ['images/ui/CONVERSATION_LINE_BG.png', 529, 20],
    'PAGINATION_BUTTON_UP': ['images/ui/PAGINATION_BUTTON_UP.png', 16, 25, 4],
    'ENGLISH_BUTTON': ['images/ui/ENGLISH_BUTTON.png', 136, 27, 3],
    'SPANISH_BUTTON': ['images/ui/SPANISH_BUTTON.png', 136, 27, 3],
    // PLAYER
    'DOCTORTILLA_PLAYER_SPRITE': ['images/player/DOCTORTILLA_PLAYER_SPRITE.png', 44, 61, 33],
    // BACKSTAGE
    'VENDING_MACHINE_SPRITE': ['images/backstage/VENDING_MACHINE_SPRITE.png', 49, 72, 3],
    'BAND_IN_SOFA_SPRITE': ['images/backstage/BAND_IN_SOFA_SPRITE.png', 70, 78, 19],
    'GLASS_INV_SPRITE': ['images/backstage/GLASS_INV_SPRITE.png', 68, 26, 4],
    'COSTUME_INV_SPRITE': ['images/backstage/COSTUME_INV_SPRITE.png', 68, 26, 4],
    'BACKSTAGE_DOOR_TO_BACKYARD_SPRITE': ['images/backstage/BACKSTAGE_DOOR_TO_BACKYARD_SPRITE.png', 61, 104, 2],
    //Backyard
    'BACKYARD_DOOR_TO_BACKSTAGE_SPRITE': ['images/backyard/BACKYARD_DOOR_TO_BACKSTAGE_SPRITE.png', 31, 104, 2],
    'BILI_SPRITE': ['images/backyard/BILI_SPRITE.png', 43, 70, 24],
    'BALLOON_SPRITE': ['images/backyard/BALLOON_SPRITE.png', 28, 59, 6]
};
const IMAGES = {
    // UI
    'UI_BG': 'images/ui/UI_BG.png',
    'UI_INV_BG': 'images/ui/UI_INV_BG.png',
    'UI_CONVERSATION_BG': 'images/ui/UI_CONVERSATION_BG.png',
    'CONVERSATION_LINE_BG': 'images/ui/CONVERSATION_LINE_BG.png',
    'LOGO': 'images/ui/LOGO.png',
    'THE_GAME': 'images/ui/THE_GAME.png',
    // Backstage scene:
    'BACKSTAGE_BG': 'images/backstage/BACKSTAGE_BG.png',
    'CABLE': 'images/backstage/CABLE.png',
    'CABLE_INV': 'images/backstage/CABLE_INV.png',
    'SKIRT': 'images/backstage/SKIRT_INV.png',
    'BROOM': 'images/backstage/BROOM.png',
    'BROOM_INV': 'images/backstage/BROOM_INV.png',
    'BACKYARD_BG': 'images/backyard/BACKYARD_BG.png',
    'CAN_INV': 'images/backstage/CAN_INV.png',
    'COIN_INV': 'images/backstage/COIN_INV.png',
    'SCISSORS': 'images/backstage/SCISSORS.png',
    'SCISSORS_INV': 'images/backstage/SCISSORS_INV.png',
    'BOCADILLO': 'images/backstage/BOCADILLO.png',
    'BOCADILLO_INV': 'images/backstage/BOCADILLO_INV.png',
    'BREAD_INV': 'images/backstage/BREAD_INV.png',
    'BACON_INV': 'images/backstage/BACON_INV.png',
    'COCONUT': 'images/backstage/COCONUT.png',
    'COCONUT_INV': 'images/backstage/COCONUT_INV.png',
    'DUST': 'images/backstage/DUST.png',
    'DUST_INV': 'images/backstage/DUST_INV.png',
    'GLASS': 'images/backstage/GLASS.png',
    'LAMP': 'images/backstage/LAMP.png',
    'BACKSTAGE_DOOR_TO_STREET': 'images/backstage/BACKSTAGE_DOOR_TO_STREET.png',
    'BACKSTAGE_DOOR_TO_STAGE': 'images/backstage/BACKSTAGE_DOOR_TO_STAGE.png',
    'FLY_CASE': 'images/backstage/FLY_CASE.png',
    // Backyard:
    'FLOWERS': 'images/backyard/FLOWERS.png',
    'FLOWERS_INV': 'images/backyard/FLOWERS_INV.png',
    'LAMP_BACKYARD': 'images/backyard/LAMP_BACKYARD.png',
    'MOON': 'images/backyard/MOON.png',
    'STAR': 'images/backyard/STAR.png',
    'CUT_FLOWERS': 'images/backyard/CUT_FLOWERS.png'
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

},{}],51:[function(require,module,exports){
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
    lookAction(player) {
        player.say('I\'m not exactly rich, but it\'s a start!');
    }
}
exports.Coin = Coin;

},{"../../engine/models/Thing":18}],52:[function(require,module,exports){
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

},{"../engine/models/Game":9,"./DoctortillaLabels":53,"./DoctortillaPlayer":54,"./backstageScene/BackstageScene":58,"./backyardScene/BackyardScene":78}],53:[function(require,module,exports){
"use strict";
exports.DOCTORTILLA_LABELS = {
    'es': {},
    'en': {}
};

},{}],54:[function(require,module,exports){
"use strict";
const Player_1 = require('../engine/models/Player');
const RandomText_1 = require('../engine/utils/RandomText');
const Coin_1 = require('./BackstageScene/Coin');
const ActiveInventory_singleton_1 = require('../engine/state/ActiveInventory.singleton');
const Style_1 = require('../engine/ui/Style');
let spriteOptions = new Map();
spriteOptions.set('stand_right', { frames: [0] });
spriteOptions.set('walk_right', { frames: [1, 2, 3, 4, 5, 6] });
spriteOptions.set('talk_right', { frames: [21, 22, 23, 24, 25, 26] });
spriteOptions.set('stand_left', { frames: [0], inverse: true });
spriteOptions.set('walk_left', { frames: [1, 2, 3, 4, 5, 6], inverse: true });
spriteOptions.set('talk_left', { frames: [21, 22, 23, 24, 25, 26], inverse: true });
spriteOptions.set('stand_up', { frames: [14] });
spriteOptions.set('walk_up', { frames: [15, 16, 17, 18, 19, 20] });
spriteOptions.set('talk_up', { frames: [14] });
spriteOptions.set('stand_down', { frames: [7] });
spriteOptions.set('walk_down', { frames: [8, 9, 10, 11, 12, 13] });
spriteOptions.set('talk_down', { frames: [27, 28, 29, 30, 31, 32] });
const options = {
    spriteId: 'DOCTORTILLA_PLAYER_SPRITE',
    initialX: 200,
    initialY: 200,
    xSpeed: 80,
    ySpeed: 55,
    animationSpeed: Style_1.style.DEFAULT_ANIMATION_SPEED,
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
        return this.getAttr('COSTUME_COMPLETE');
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

},{"../engine/models/Player":14,"../engine/state/ActiveInventory.singleton":19,"../engine/ui/Style":38,"../engine/utils/RandomText":48,"./BackstageScene/Coin":51}],55:[function(require,module,exports){
"use strict";
const Door_1 = require('../../engine/models/Door');
class BackstageDoorToBackyard extends Door_1.Door {
    constructor() {
        let options = {
            id: 'BACKSTAGE_TO_BACKYARD',
            name: 'door to backyard',
            x: 739,
            y: 111,
            spriteId: 'BACKSTAGE_DOOR_TO_BACKYARD_SPRITE',
            goToPosition: {
                x: 743,
                y: 210
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

},{"../../engine/models/Door":8}],56:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Directions_1 = require('../../engine/utils/Directions');
let options = {
    id: 'backstage_door_to_stage',
    x: 330,
    y: 67,
    spriteId: 'BACKSTAGE_DOOR_TO_STAGE',
    name: 'door to stage',
    goToPosition: {
        x: 378,
        y: 163
    }
};
class BackstageDoorToStage extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    openAction(player) {
        player.lookAt(Directions_1.Directions.DOWN);
        player.say('I can\'t go to the stage yet')
            .then(() => {
            return player.say('I first have to get the band ready');
        });
    }
}
exports.BackstageDoorToStage = BackstageDoorToStage;

},{"../../engine/models/Thing":18,"../../engine/utils/Directions":45}],57:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Directions_1 = require('../../engine/utils/Directions');
let options = {
    id: 'bacsktage_door_to_street',
    x: 59,
    y: 100,
    spriteId: 'BACKSTAGE_DOOR_TO_STREET',
    name: 'door to street',
    goToPosition: {
        x: 101,
        y: 185
    }
};
class BackstageDoorToStreet extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    openAction(player) {
        player.lookAt(Directions_1.Directions.DOWN);
        player.say('Nope, I can not go to the street')
            .then(() => {
            return player.say('We have a concert to play!');
        });
    }
}
exports.BackstageDoorToStreet = BackstageDoorToStreet;

},{"../../engine/models/Thing":18,"../../engine/utils/Directions":45}],58:[function(require,module,exports){
"use strict";
const Scene_1 = require('../../engine/models/Scene');
const Broom_1 = require('./Broom');
const VendingMachine_1 = require('./VendingMachine');
const BackstageDoorToBackyard_1 = require('./BackstageDoorToBackyard');
const BackstageDoorToStreet_1 = require('./BackstageDoorToStreet');
const BackstageDoorToStage_1 = require('./BackstageDoorToStage');
const BandInSofa_1 = require('./BandInSofa');
const Scissors_1 = require('./Scissors');
const Bocadillo_1 = require('./Bocadillo');
const Cable_1 = require('./Cable');
const Coconut_1 = require('./Coconut');
const DustInTable_1 = require('./DustInTable');
const Glass_1 = require('./Glass');
const LampLeft_1 = require('./LampLeft');
const LampRight_1 = require('./LampRight');
const FlyCase_1 = require('./FlyCase');
const Polygon_1 = require('../../engine/utils/Polygon');
const sceneOptions = {
    id: 'BACKSTAGE',
    backgroundId: 'BACKSTAGE_BG',
    boundariesConfig: new Polygon_1.Polygon([
        // {x: 50, y: 50},
        // {x: 100, y: 50},
        // {x: 120, y: 100},
        // {x: 190, y: 100},
        // {x: 150, y: 50},
        // {x: 200, y: 50},
        // {x: 200, y: 200},
        // {x: 50, y: 200},
        { x: 55, y: 218 },
        { x: 114, y: 158 },
        { x: 142, y: 158 },
        { x: 130, y: 174 },
        { x: 195, y: 171 },
        { x: 213, y: 158 },
        { x: 229, y: 158 },
        { x: 222, y: 176 },
        { x: 308, y: 180 },
        { x: 332, y: 158 },
        { x: 465, y: 158 },
        { x: 469, y: 183 },
        { x: 494, y: 193 },
        { x: 553, y: 189 },
        { x: 569, y: 181 },
        { x: 568, y: 158 },
        { x: 608, y: 160 },
        { x: 627, y: 185 },
        { x: 691, y: 184 },
        { x: 706, y: 202 },
        { x: 762, y: 200 },
        { x: 790, y: 218 }
    ]),
    things: [
        new BackstageDoorToBackyard_1.BackstageDoorToBackyard(),
        new BackstageDoorToStreet_1.BackstageDoorToStreet(),
        new BackstageDoorToStage_1.BackstageDoorToStage(),
        new Cable_1.Cable(),
        new VendingMachine_1.VendingMachine(),
        new BandInSofa_1.BandInSofa(),
        new LampLeft_1.LampLeft(),
        new LampRight_1.LampRight(),
        new FlyCase_1.FlyCase(),
        new Broom_1.Broom(),
        new Scissors_1.Scissors(),
        new Bocadillo_1.Bocadillo(),
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

},{"../../engine/models/Scene":16,"../../engine/utils/Polygon":47,"./BackstageDoorToBackyard":55,"./BackstageDoorToStage":56,"./BackstageDoorToStreet":57,"./BandInSofa":60,"./Bocadillo":61,"./Broom":63,"./Cable":64,"./Coconut":66,"./DustInTable":69,"./FlyCase":70,"./Glass":71,"./LampLeft":72,"./LampRight":73,"./Scissors":74,"./VendingMachine":76}],59:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const options = {
    id: 'bacon',
    spriteId: 'BACON',
    inventoryImageId: 'BACON_INV',
    name: 'bacon',
    directlyInInventory: true
};
class Bacon extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    lookAction(player) {
        player.say('Delicious and GREASY!');
    }
}
exports.Bacon = Bacon;

},{"../../engine/models/Thing":18}],60:[function(require,module,exports){
"use strict";
const SpeechBubble_1 = require('../../engine/ui/SpeechBubble');
const Thing_1 = require('../../engine/models/Thing');
const ConversationWithBand_1 = require('./ConversationWithBand');
const Directions_1 = require('../../engine/utils/Directions');
const Style_1 = require('../../engine/ui/Style');
let spriteOptions = new Map();
spriteOptions.set('quiet', { frames: [0] });
spriteOptions.set('juan_talking', { frames: [1, 2, 3, 4, 5, 6] });
spriteOptions.set('angel_talking', { frames: [7, 8, 9, 10, 11, 12] });
spriteOptions.set('santi_talking', { frames: [13, 14, 15, 16, 17, 18] });
class BandInSofa extends Thing_1.Thing {
    constructor() {
        let options = {
            id: 'bandInSofa',
            x: 481,
            y: 105,
            spriteId: 'BAND_IN_SOFA_SPRITE',
            name: 'rest of the band',
            goToPosition: {
                x: 459,
                y: 181
            },
            directionToLook: Directions_1.Directions.RIGHT,
            spriteOptions: spriteOptions,
            animationSpeed: Style_1.style.DEFAULT_ANIMATION_SPEED
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
    say(text, who) {
        this.playAnimation(who + '_talking');
        return this.speechBubble.say(text).then(() => {
            this.playAnimation('quiet');
        });
    }
}
exports.BandInSofa = BandInSofa;

},{"../../engine/models/Thing":18,"../../engine/ui/SpeechBubble":37,"../../engine/ui/Style":38,"../../engine/utils/Directions":45,"./ConversationWithBand":67}],61:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Bread_1 = require('./Bread');
const Bacon_1 = require('./Bacon');
const options = {
    id: 'bocadillo',
    x: 705,
    y: 145,
    spriteId: 'BOCADILLO',
    inventoryImageId: 'BOCADILLO_INV',
    name: 'bocadillo',
    goToPosition: {
        x: 692,
        y: 190
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

},{"../../engine/models/Thing":18,"./Bacon":59,"./Bread":62}],62:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const options = {
    id: 'bread',
    spriteId: 'BREAD',
    inventoryImageId: 'BREAD_INV',
    name: 'bread',
    directlyInInventory: true
};
class Bread extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    lookAction(player) {
        player.say('Todo lo que termina, termina mal.')
            .then(() => {
            return player.say('Poco a poco.');
        })
            .then(() => {
            return player.say('Y si no termina, se contamina.');
        })
            .then(() => {
            return player.say('Y eso se cubre de polvo.');
        });
    }
}
exports.Bread = Bread;

},{"../../engine/models/Thing":18}],63:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const Verbs_store_1 = require('../../engine/stores/Verbs.store');
const Skirt_1 = require('./Skirt');
const options = {
    id: 'broom',
    x: 103,
    y: 119,
    spriteId: 'BROOM',
    inventoryImageId: 'BROOM_INV',
    name: 'broom',
    goToPosition: {
        x: 117,
        y: 176
    },
    pickable: true,
    preferredAction: Verbs_store_1.Verbs.TAKE,
    preferredInventoryAction: Verbs_store_1.Verbs.LOOK
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

},{"../../engine/models/Thing":18,"../../engine/state/SelectedObjects":22,"../../engine/stores/Verbs.store":26,"./Skirt":75}],64:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Scenes_singleton_1 = require('../../engine/state/Scenes.singleton');
const options = {
    id: 'cable',
    x: 187,
    y: 125,
    spriteId: 'CABLE',
    inventoryImageId: 'CABLE_INV',
    name: 'cable',
    goToPosition: {
        x: 219,
        y: 165
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

},{"../../engine/models/Thing":18,"../../engine/state/Scenes.singleton":21}],65:[function(require,module,exports){
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

},{"../../engine/models/Thing":18,"../../engine/state/SelectedObjects":22}],66:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const CostumeCreator_1 = require('../utils/CostumeCreator');
const options = {
    id: 'coconut',
    x: 92,
    y: 195,
    spriteId: 'COCONUT',
    inventoryImageId: 'COCONUT_INV',
    name: 'coconut',
    goToPosition: {
        x: 110,
        y: 203
    },
    pickable: true,
    isForeground: true
};
class Coconut extends Thing_1.Thing {
    constructor() {
        super(options);
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
            CostumeCreator_1.costumeCreator.addFlowers(player);
            CostumeCreator_1.costumeCreator.addCoconut(player);
            SelectedObjects_1.selectedThing.thing.destroy();
            this.destroy();
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'skirt') {
            CostumeCreator_1.costumeCreator.addSkirt(player);
            CostumeCreator_1.costumeCreator.addCoconut(player);
            SelectedObjects_1.selectedThing.thing.destroy();
            this.destroy();
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'costume') {
            CostumeCreator_1.costumeCreator.addCoconut(player);
            this.destroy();
        }
        else {
            player.say('I don\'t know how to do that');
        }
    }
}
exports.Coconut = Coconut;

},{"../../engine/models/Thing":18,"../../engine/state/SelectedObjects":22,"../utils/CostumeCreator":87}],67:[function(require,module,exports){
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
        this.script = Object.assign({}, script);
        let dialogPart = [];
        dialogPart = this.script['INITIAL_AFTER_FIRST_TALK'].concat(dialogPart);
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
    return band.say('No es por alarmar pero está habiendo algunos contratiempos...', 'angel')
        .then(() => {
        return band.say('...minucias sin importancia...', 'santi');
    })
        .then(() => {
        return band.say('...impedimentos BRUTALES.', 'juan');
    });
}
function sayListOfProblems(player, band) {
    player.changeAttr('TALKED_TO_BAND_ABOUT_PROBLEMS', true);
    return band.say('Resulta que aquí el amigo Juan se ha olvidado su disfraz...', 'angel')
        .then(() => {
        return band.say('Un disfraz BRUTAL, de cowboy vintage, siglo XIV, con espuelas de...', 'juan');
    })
        .then(() => {
        return band.say('Sí, sí... pero lo ha dejado en el local de ensayo, así que hay que buscarle otro.', 'angel');
    })
        .then(() => {
        return band.say('Y tu te has olvidado el cable de corriente, así que si quieres que se oiga algo...', 'juan');
    })
        .then(() => {
        return band.say('Me tendrás que conseguir uno.', 'angel');
    })
        .then(() => {
        return band.say('Y luego está el problema con Santi.', 'angel');
    })
        .then(() => {
        return band.say('El pobre está tímido y no se atrever a salir.', 'juan');
    })
        .then(() => {
        return band.say('Dice que no ensayamos nunca y se siente inseguro.', 'angel');
    })
        .then(() => {
        return band.say('Ya sabes cómo son los zurdos con estas cosas...', 'juan');
    });
}
function sayBiliSituation(player, band) {
    return band.say('Está fuera fumando, pero como lo dejemos mucho tiempo se va a poner como las grecas.', 'angel');
}
function sayCostumeIsOk(player, band) {
    return band.say('Vaya disfraz ridículo.', 'juan')
        .then(() => {
        return band.say('El mío era mejor', 'juan');
    })
        .then(() => {
        return player.say('Te lo pones, o te lo pongo.');
    })
        .then(() => {
        band.changeAttr('HAS_COSTUME', true);
        player.changeAttr('DELIVERED_COSTUME', true);
        player.removeCostume();
        return player.say('Me lo pongo.');
    });
}
function sayCableIsOk(player, band) {
    return band.say('No voy a preguntar de dónde lo has sacado...', 'angel')
        .then(() => {
        return band.say('Lo has robado, ¿verdad?', 'santi');
    })
        .then(() => {
        band.changeAttr('HAS_CABLE', true);
        player.changeAttr('DELIVERED_CABLE', true);
        player.removeCable();
        return player.say('Digamos que tengo recursos.');
    });
}
function sayDrinkIsOk(player, band) {
    return band.say('Mmm un refrescante refresco...', 'santi')
        .then(() => {
        return band.say('Glu glu glu', 'santi');
    })
        .then(() => {
        return band.say('...', 'santi');
    })
        .then(() => {
        return band.say('(eructo)', 'santi');
    })
        .then(() => {
        return band.say('No sabía a droga ni nada', 'santi');
    })
        .then(() => {
        return band.say('Estoy empezando a sentirme listo para tocar', 'santi');
    })
        .then(() => {
        band.changeAttr('HAS_DRINK', true);
        player.changeAttr('DELIVERED_DRINK', true);
        player.removeGlass();
        return player.say('Así me gusta.');
    });
}

},{"../../engine/models/Conversation":6,"../../engine/models/ConversationLine":7}],68:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const FULL_FRAME = 3;
const FLOWER_AND_COCONUT_FRAME = 1;
const FLOWER_AND_SKIRT_FRAME = 2;
const SKIRT_AND_COCONUT_FRAME = 0;
const options = {
    id: 'costume',
    x: 137,
    y: 130,
    spriteId: 'COSTUME_INV_SPRITE',
    inventoryImageId: 'COSTUME_INV_SPRITE',
    name: 'costume',
    directlyInInventory: true
};
class Costume extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    useAction(player) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        if (SelectedObjects_1.selectedThing.thing.id === 'coconut') {
            this.addCoconut(player);
            SelectedObjects_1.selectedThing.thing.destroy();
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'flowers') {
            this.addFlowers(player);
            SelectedObjects_1.selectedThing.thing.destroy();
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'skirt') {
            this.addSkirt(player);
            SelectedObjects_1.selectedThing.thing.destroy();
        }
        else {
            player.say('I don\t know how to do that...');
        }
    }
    lookAction(player) {
        //TODO: check different states
        player.say('Almost done!');
    }
    getFrameForInventory() {
        if (this.isComplete()) {
            return FULL_FRAME;
        }
        if (this.getAttr('HAS_COCONUT') && this.getAttr('HAS_FLOWERS')) {
            return FLOWER_AND_COCONUT_FRAME;
        }
        if (this.getAttr('HAS_COCONUT') && this.getAttr('HAS_SKIRT')) {
            return SKIRT_AND_COCONUT_FRAME;
        }
        if (this.getAttr('HAS_SKIRT') && this.getAttr('HAS_FLOWERS')) {
            return FLOWER_AND_SKIRT_FRAME;
        }
        return FULL_FRAME;
    }
    addCoconut(player) {
        this.changeAttr('HAS_COCONUT', true);
        this.informPlayerIfComplete(player);
    }
    addFlowers(player) {
        this.changeAttr('HAS_FLOWERS', true);
        this.informPlayerIfComplete(player);
    }
    addSkirt(player) {
        this.changeAttr('HAS_SKIRT', true);
        this.informPlayerIfComplete(player);
    }
    isComplete() {
        return this.getAttr('HAS_COCONUT') && this.getAttr('HAS_FLOWERS') && this.getAttr('HAS_SKIRT');
    }
    informPlayerIfComplete(player) {
        if (this.isComplete()) {
            player.changeAttr('COSTUME_COMPLETE', true);
        }
    }
}
exports.Costume = Costume;

},{"../../engine/models/Thing":18,"../../engine/state/SelectedObjects":22}],69:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const options = {
    id: 'dust',
    x: 247,
    y: 128,
    spriteId: 'DUST',
    inventoryImageId: 'DUST_INV',
    name: 'dust',
    goToPosition: {
        x: 248,
        y: 177
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

},{"../../engine/models/Thing":18,"../../engine/state/SelectedObjects":22}],70:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
let options = {
    id: 'fly_case',
    x: 62,
    y: 198,
    spriteId: 'FLY_CASE',
    name: 'fly case',
    justDecoration: true,
    isForeground: true
};
class FlyCase extends Thing_1.Thing {
    constructor() {
        super(options);
    }
}
exports.FlyCase = FlyCase;

},{"../../engine/models/Thing":18}],71:[function(require,module,exports){
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
    x: 641,
    y: 128,
    spriteId: 'GLASS',
    inventoryImageId: 'GLASS_INV_SPRITE',
    name: 'glass',
    goToPosition: {
        x: 639,
        y: 189
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

},{"../../engine/models/Thing":18,"../../engine/state/ActiveInventory.singleton":19,"../../engine/state/SelectedObjects":22}],72:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
let options = {
    id: 'lamp_left',
    x: 136,
    y: 29,
    spriteId: 'LAMP',
    name: 'lamp left',
    justDecoration: true,
    isForeground: true
};
class LampLeft extends Thing_1.Thing {
    constructor() {
        super(options);
    }
}
exports.LampLeft = LampLeft;

},{"../../engine/models/Thing":18}],73:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
let options = {
    id: 'lamp_right',
    x: 450,
    y: 29,
    spriteId: 'LAMP',
    name: 'lamp right',
    justDecoration: true,
    isForeground: true
};
class LampRight extends Thing_1.Thing {
    constructor() {
        super(options);
    }
}
exports.LampRight = LampRight;

},{"../../engine/models/Thing":18}],74:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const options = {
    id: 'scissors',
    x: 291,
    y: 128,
    spriteId: 'SCISSORS',
    inventoryImageId: 'SCISSORS_INV',
    name: 'scissors',
    goToPosition: {
        x: 300,
        y: 180
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

},{"../../engine/models/Thing":18,"../../engine/state/SelectedObjects":22}],75:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const CostumeCreator_1 = require('../utils/CostumeCreator');
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
            CostumeCreator_1.costumeCreator.addSkirt(player);
            CostumeCreator_1.costumeCreator.addFlowers(player);
            SelectedObjects_1.selectedThing.thing.destroy();
            this.destroy();
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'coconut') {
            CostumeCreator_1.costumeCreator.addSkirt(player);
            CostumeCreator_1.costumeCreator.addCoconut(player);
            SelectedObjects_1.selectedThing.thing.destroy();
            this.destroy();
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'costume') {
            CostumeCreator_1.costumeCreator.addSkirt(player);
            this.destroy();
        }
        else {
            player.say('I don\'t know how to do that');
        }
    }
}
exports.Skirt = Skirt;

},{"../../engine/models/Thing":18,"../../engine/state/SelectedObjects":22,"../utils/CostumeCreator":87}],76:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const SpeechBubble_1 = require('../../engine/ui/SpeechBubble');
const Can_1 = require('./Can');
const UIBlocker_singleton_1 = require('../../engine/ui/UIBlocker.singleton');
const Directions_1 = require('../../engine/utils/Directions');
const NORMAL_FRAME = 0;
const GREASED_FRAME = 1;
const GREASED_AND_PUSHED_FRAME = 2;
class VendingMachine extends Thing_1.Thing {
    constructor() {
        let options = {
            id: 'vending',
            x: 155,
            y: 98,
            spriteId: 'VENDING_MACHINE_SPRITE',
            name: 'vending machine',
            goToPosition: {
                x: 167,
                y: 178
            },
            directionToLook: Directions_1.Directions.UP
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

},{"../../engine/models/Thing":18,"../../engine/state/SelectedObjects":22,"../../engine/ui/SpeechBubble":37,"../../engine/ui/UIBlocker.singleton":41,"../../engine/utils/Directions":45,"./Can":65}],77:[function(require,module,exports){
"use strict";
const Door_1 = require('../../engine/models/Door');
class BackyardDoorToBackstage extends Door_1.Door {
    constructor() {
        let options = {
            id: 'BACKYARD_TO_BACKSTAGE',
            name: 'door to backstage',
            x: 36,
            y: 115,
            spriteId: 'BACKYARD_DOOR_TO_BACKSTAGE_SPRITE',
            goToPosition: {
                x: 78,
                y: 207
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

},{"../../engine/models/Door":8}],78:[function(require,module,exports){
"use strict";
const Scene_1 = require('../../engine/models/Scene');
const BackyardDoorToBackstage_1 = require('./BackyardDoorToBackstage');
const Flowers_1 = require('./Flowers');
const Bili_1 = require('./Bili');
const LampBackyard_1 = require('./LampBackyard');
const Moon_1 = require('./Moon');
const Star_1 = require('./Star');
const CutFlowers_1 = require('./CutFlowers');
const Balloon_1 = require('./Balloon');
const Polygon_1 = require('../../engine/utils/Polygon');
const sceneOptions = {
    id: 'BACKYARD',
    backgroundId: 'BACKYARD_BG',
    boundariesConfig: new Polygon_1.Polygon([
        { x: 60, y: 216 },
        { x: 117, y: 173 },
        { x: 243, y: 173 },
        { x: 243, y: 197 },
        { x: 415, y: 197 },
        { x: 415, y: 216 }
    ]),
    things: [
        new BackyardDoorToBackstage_1.BackyardDoorToBackstage(),
        new CutFlowers_1.CutFlowers(),
        new Flowers_1.Flowers(),
        new Balloon_1.Balloon(),
        new Bili_1.Bili(),
        new LampBackyard_1.LampBackyard(),
        new Moon_1.Moon()
    ]
};
const STAR_NUMBER = 70;
const SKY_START = { x: 108, y: 1 };
const SKY_END = { x: 436, y: 74 };
const MIN_OPACITY = 0.2;
const MAX_OPACITY = 0.8;
class BackyardScene extends Scene_1.Scene {
    constructor() {
        super(sceneOptions);
    }
    show() {
        super.show();
        this.createSky();
    }
    destroy() {
        super.destroy();
        this.destroySky();
    }
    createSky() {
        this.stars = [];
        for (let i = 0; i < STAR_NUMBER; i++) {
            let newStar = new Star_1.Star({
                x: SKY_START.x + Math.random() * (SKY_END.x - SKY_START.x),
                y: SKY_START.y + Math.random() * (SKY_END.y - SKY_START.y),
                id: 'star_' + i,
                opacity: MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY)
            });
            newStar.show();
            this.stars.push(newStar);
        }
    }
    destroySky() {
        this.stars = this.stars || [];
        this.stars.forEach(star => star.destroy());
        this.stars = [];
    }
}
exports.BackyardScene = BackyardScene;

},{"../../engine/models/Scene":16,"../../engine/utils/Polygon":47,"./BackyardDoorToBackstage":77,"./Balloon":79,"./Bili":80,"./CutFlowers":82,"./Flowers":83,"./LampBackyard":84,"./Moon":85,"./Star":86}],79:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Directions_1 = require('../../engine/utils/Directions');
const Style_1 = require('../../engine/ui/Style');
let spriteOptions = new Map();
spriteOptions.set('quiet', { frames: [1] });
spriteOptions.set('floating', { frames: [1, 2, 3, 4, 5, 6] });
const options = {
    id: 'balloon',
    x: 252,
    y: 96,
    spriteId: 'BALLOON_SPRITE',
    name: 'balloon',
    goToPosition: {
        x: 239,
        y: 185
    },
    directionToLook: Directions_1.Directions.RIGHT,
    spriteOptions: spriteOptions,
    animationSpeed: Style_1.style.DEFAULT_ANIMATION_SPEED
};
const MIN_TIME_FOR_ANIMATION = 300;
const MAX_TIME_FOR_ANIMATION = 5000;
class Balloon extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    show() {
        super.show();
        this.playAnimationSometime();
    }
    playAnimationSometime() {
        this.playAnimation('quiet');
        setTimeout(() => {
            this.playAnimationOnce('floating').then(() => {
                this.playAnimationSometime();
            });
        }, this.getTimeForNextAnimation());
    }
    getTimeForNextAnimation() {
        return MIN_TIME_FOR_ANIMATION + Math.random() * (MAX_TIME_FOR_ANIMATION - MIN_TIME_FOR_ANIMATION);
    }
}
exports.Balloon = Balloon;

},{"../../engine/models/Thing":18,"../../engine/ui/Style":38,"../../engine/utils/Directions":45}],80:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SpeechBubble_1 = require('../../engine/ui/SpeechBubble');
const ConversationWithBili_1 = require('./ConversationWithBili');
const Directions_1 = require('../../engine/utils/Directions');
const Style_1 = require('../../engine/ui/Style');
let spriteOptions = new Map();
spriteOptions.set('quiet', { frames: [0, 1, 2, 3, 4, 5] });
spriteOptions.set('smoking', { frames: [6, 7, 8, 9, 10, 11, 12] });
spriteOptions.set('drinking', { frames: [13, 14, 15, 16, 17, 18] });
spriteOptions.set('talking', { frames: [19, 20, 21, 22, 23] });
let options = {
    id: 'bili',
    x: 265,
    y: 121,
    spriteId: 'BILI_SPRITE',
    name: 'bili',
    goToPosition: {
        x: 239,
        y: 185
    },
    directionToLook: Directions_1.Directions.RIGHT,
    spriteOptions: spriteOptions,
    animationSpeed: Style_1.style.DEFAULT_ANIMATION_SPEED
};
const MIN_TIME_FOR_ANIMATION = 1000;
const MAX_TIME_FOR_ANIMATION = 5000;
class Bili extends Thing_1.Thing {
    constructor() {
        super(options);
        this.isTalking = false;
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
        this.isTalking = true;
        if (this.currentTimeout) {
            window.clearTimeout(this.currentTimeout);
        }
        this.playAnimation('talking');
        return this.speechBubble.say(text).then(() => {
            this.isTalking = false;
            this.playAnimationSometime();
        });
    }
    show() {
        super.show();
        this.playAnimationSometime();
    }
    //Duplicated in Balloon, if we add more objects like this, consider moving to Thing model
    playAnimationSometime() {
        this.playAnimation('quiet');
        this.currentTimeout = setTimeout(() => {
            this.playAnimationOnce(this.getRandomAnimation()).then(() => {
                this.playAnimationSometime();
            });
        }, this.getTimeForNextAnimation());
    }
    getTimeForNextAnimation() {
        return MIN_TIME_FOR_ANIMATION + Math.random() * (MAX_TIME_FOR_ANIMATION - MIN_TIME_FOR_ANIMATION);
    }
    getRandomAnimation() {
        if (Math.random() > 0.5) {
            return 'smoking';
        }
        else {
            return 'drinking';
        }
    }
}
exports.Bili = Bili;

},{"../../engine/models/Thing":18,"../../engine/ui/SpeechBubble":37,"../../engine/ui/Style":38,"../../engine/utils/Directions":45,"./ConversationWithBili":81}],81:[function(require,module,exports){
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

},{"../../engine/models/Conversation":6,"../../engine/models/ConversationLine":7}],82:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
let options = {
    id: 'cut_flowers',
    x: 127,
    y: 148,
    spriteId: 'CUT_FLOWERS',
    name: 'CUT_FLOWERS',
    justDecoration: true
};
class CutFlowers extends Thing_1.Thing {
    constructor() {
        super(options);
    }
}
exports.CutFlowers = CutFlowers;

},{"../../engine/models/Thing":18}],83:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const CostumeCreator_1 = require('../utils/CostumeCreator');
const options = {
    id: 'flowers',
    x: 127,
    y: 148,
    spriteId: 'FLOWERS',
    inventoryImageId: 'FLOWERS_INV',
    name: 'flowers',
    goToPosition: {
        x: 136,
        y: 178
    },
    pickable: true
};
class Flowers extends Thing_1.Thing {
    constructor() {
        super(options);
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
            CostumeCreator_1.costumeCreator.addCoconut(player);
            CostumeCreator_1.costumeCreator.addFlowers(player);
            SelectedObjects_1.selectedThing.thing.destroy();
            this.destroy();
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'skirt') {
            CostumeCreator_1.costumeCreator.addSkirt(player);
            CostumeCreator_1.costumeCreator.addFlowers(player);
            SelectedObjects_1.selectedThing.thing.destroy();
            this.destroy();
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'costume') {
            CostumeCreator_1.costumeCreator.addFlowers(player);
            this.destroy();
        }
        else {
            player.say('I don\'t know how to do that');
        }
    }
}
exports.Flowers = Flowers;

},{"../../engine/models/Thing":18,"../../engine/state/SelectedObjects":22,"../utils/CostumeCreator":87}],84:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
let options = {
    id: 'lamp_door',
    x: 26,
    y: 75,
    spriteId: 'LAMP_BACKYARD',
    name: 'LAMP_BACKYARD',
    justDecoration: true,
    isForeground: true
};
class LampBackyard extends Thing_1.Thing {
    constructor() {
        super(options);
    }
}
exports.LampBackyard = LampBackyard;

},{"../../engine/models/Thing":18}],85:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
let options = {
    id: 'moon',
    x: 381,
    y: 22,
    spriteId: 'MOON',
    name: 'MOON',
    justDecoration: true,
    isForeground: true
};
class Moon extends Thing_1.Thing {
    constructor() {
        super(options);
    }
}
exports.Moon = Moon;

},{"../../engine/models/Thing":18}],86:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
let options = {
    id: 'star',
    x: 1,
    y: 1,
    spriteId: 'STAR',
    name: 'STAR',
    justDecoration: true
};
class Star extends Thing_1.Thing {
    constructor(extraOptions) {
        let correctOptions = Object.assign({}, options, extraOptions);
        super(correctOptions);
    }
}
exports.Star = Star;

},{"../../engine/models/Thing":18}],87:[function(require,module,exports){
"use strict";
const Costume_1 = require('../backstageScene/Costume');
class CostumeCreator {
    constructor() {
        this.costume = null;
    }
    addFlowers(player) {
        this.createCostumeIfNeeded();
        this.costume.addFlowers(player);
    }
    addCoconut(player) {
        this.createCostumeIfNeeded();
        this.costume.addCoconut(player);
    }
    addSkirt(player) {
        this.createCostumeIfNeeded();
        this.costume.addSkirt(player);
    }
    createCostumeIfNeeded() {
        if (!this.costume) {
            this.costume = new Costume_1.Costume();
        }
    }
}
exports.costumeCreator = new CostumeCreator();

},{"../backstageScene/Costume":68}],88:[function(require,module,exports){
"use strict";
const Phaser_1 = require('./Phaser');
const LayoutManager_singleton_1 = require('./engine/ui/LayoutManager.singleton');
const BootScene_1 = require('./BootScene');
const PreloaderScene_1 = require('./PreloaderScene');
const StartMenuScene_1 = require('./StartMenuScene');
const PlayScene_1 = require('./PlayScene');
const PhaserGame_singleton_1 = require('./engine/state/PhaserGame.singleton');
window.onload = function () {
    let game = new Phaser_1.phaser.Game(LayoutManager_singleton_1.layout.WIDTH, LayoutManager_singleton_1.layout.HEIGHT, Phaser_1.phaser.AUTO, 'game');
    PhaserGame_singleton_1.phaserGame.value = game;
    game.state.add('boot', BootScene_1.BootScene);
    game.state.add('preloader', PreloaderScene_1.PreloaderScene);
    game.state.add('startMenu', StartMenuScene_1.StartMenuScene);
    game.state.add('play', PlayScene_1.playScene);
    game.state.start('boot');
};

},{"./BootScene":1,"./Phaser":2,"./PlayScene":3,"./PreloaderScene":4,"./StartMenuScene":5,"./engine/state/PhaserGame.singleton":20,"./engine/ui/LayoutManager.singleton":35}]},{},[88])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0Jvb3RTY2VuZS50cyIsInNyYy9hcHAvUGhhc2VyLnRzIiwic3JjL2FwcC9QbGF5U2NlbmUudHMiLCJzcmMvYXBwL1ByZWxvYWRlclNjZW5lLnRzIiwic3JjL2FwcC9TdGFydE1lbnVTY2VuZS50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9Db252ZXJzYXRpb24udHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvQ29udmVyc2F0aW9uTGluZS50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9Eb29yLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0dhbWUudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvR2FtZUNhbWVyYS50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9HZW5lcmljSGlnaGxpZ2h0ZWRUaGluZy50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9JbnZlbnRvcnkudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvUGF0aEZpbmRlci50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9QbGF5ZXIudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvUGxheWVyTW92ZW1lbnRIYW5kbGVyLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL1NjZW5lLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL1NjZW5lQm91bmRhcmllcy50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9UaGluZy50cyIsInNyYy9hcHAvZW5naW5lL3N0YXRlL0FjdGl2ZUludmVudG9yeS5zaW5nbGV0b24udHMiLCJzcmMvYXBwL2VuZ2luZS9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbi50cyIsInNyYy9hcHAvZW5naW5lL3N0YXRlL1NjZW5lcy5zaW5nbGV0b24udHMiLCJzcmMvYXBwL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMudHMiLCJzcmMvYXBwL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZFZlcmIuc2luZ2xldG9uLnRzIiwic3JjL2FwcC9lbmdpbmUvc3RvcmVzL0RlZmF1bHRMYWJlbHMudHMiLCJzcmMvYXBwL2VuZ2luZS9zdG9yZXMvTGFiZWxzLnN0b3JlLnRzIiwic3JjL2FwcC9lbmdpbmUvc3RvcmVzL1ZlcmJzLnN0b3JlLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvQWN0aW9uQnV0dG9uLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvQ29udmVyc2F0aW9uTGluZVVJLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvQ29udmVyc2F0aW9uVUkudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9DdXJyZW50QWN0aW9uVUkudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9HcmFwaGljVUkudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9JbnZlbnRvcnlJdGVtVUkudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9JbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvSW52ZW50b3J5VUkudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbi50cyIsInNyYy9hcHAvZW5naW5lL3VpL1JlZmxlY3RCdXR0b24udHMiLCJzcmMvYXBwL2VuZ2luZS91aS9TcGVlY2hCdWJibGUudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9TdHlsZS50cyIsInNyYy9hcHAvZW5naW5lL3VpL1RleHRJblNjZW5lLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvVGV4dFdpdGhTaGFkb3cudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9VSUJsb2NrZXIuc2luZ2xldG9uLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvVUlMYXllcnMuc2luZ2xldG9uLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvVmVyYnNVSS50cyIsInNyYy9hcHAvZW5naW5lL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXIudHMiLCJzcmMvYXBwL2VuZ2luZS91dGlscy9EaXJlY3Rpb25zLnRzIiwic3JjL2FwcC9lbmdpbmUvdXRpbHMvT2JzZXJ2YWJsZS50cyIsInNyYy9hcHAvZW5naW5lL3V0aWxzL1BvbHlnb24udHMiLCJzcmMvYXBwL2VuZ2luZS91dGlscy9SYW5kb21UZXh0LnRzIiwic3JjL2FwcC9lbmdpbmUvdXRpbHMvU2VnbWVudC50cyIsInNyYy9hcHAvZ2FtZS9Bc3NldHNNYW5hZ2VyLnRzIiwic3JjL2FwcC9nYW1lL0JhY2tzdGFnZVNjZW5lL0NvaW4udHMiLCJzcmMvYXBwL2dhbWUvRG9jdG9ydGlsbGFHYW1lLnRzIiwic3JjL2FwcC9nYW1lL0RvY3RvcnRpbGxhTGFiZWxzLnRzIiwic3JjL2FwcC9nYW1lL0RvY3RvcnRpbGxhUGxheWVyLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JhY2tzdGFnZURvb3JUb0JhY2t5YXJkLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JhY2tzdGFnZURvb3JUb1N0YWdlLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JhY2tzdGFnZURvb3JUb1N0cmVldC50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9CYWNrc3RhZ2VTY2VuZS50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9CYWNvbi50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9CYW5kSW5Tb2ZhLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JvY2FkaWxsby50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9CcmVhZC50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9Ccm9vbS50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9DYWJsZS50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9DYW4udHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQ29jb251dC50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9Db252ZXJzYXRpb25XaXRoQmFuZC50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9Db3N0dW1lLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0R1c3RJblRhYmxlLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0ZseUNhc2UudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvR2xhc3MudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvTGFtcExlZnQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvTGFtcFJpZ2h0LnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL1NjaXNzb3JzLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL1NraXJ0LnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL1ZlbmRpbmdNYWNoaW5lLnRzIiwic3JjL2FwcC9nYW1lL2JhY2t5YXJkU2NlbmUvQmFja3lhcmREb29yVG9CYWNrc3RhZ2UudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9CYWNreWFyZFNjZW5lLnRzIiwic3JjL2FwcC9nYW1lL2JhY2t5YXJkU2NlbmUvQmFsbG9vbi50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL0JpbGkudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9Db252ZXJzYXRpb25XaXRoQmlsaS50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL0N1dEZsb3dlcnMudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9GbG93ZXJzLnRzIiwic3JjL2FwcC9nYW1lL2JhY2t5YXJkU2NlbmUvTGFtcEJhY2t5YXJkLnRzIiwic3JjL2FwcC9nYW1lL2JhY2t5YXJkU2NlbmUvTW9vbi50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL1N0YXIudHMiLCJzcmMvYXBwL2dhbWUvdXRpbHMvQ29zdHVtZUNyZWF0b3IudHMiLCJzcmMvYXBwL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFB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QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FDZixDQUNKLENBQUM7UUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDUixtQkFBSyxDQUFDLElBQUksRUFDVixJQUFJLDJCQUFZLENBQ1osbUJBQUssQ0FBQyxJQUFJLEVBQ1YsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FDZixDQUNKLENBQUM7UUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDUixtQkFBSyxDQUFDLElBQUksRUFDVixJQUFJLDJCQUFZLENBQ1osbUJBQUssQ0FBQyxJQUFJLEVBQ1YsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FDZixDQUNKLENBQUM7UUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDUixtQkFBSyxDQUFDLElBQUksRUFDVixJQUFJLDJCQUFZLENBQ1osbUJBQUssQ0FBQyxJQUFJLEVBQ1YsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FDZixDQUNKLENBQUM7UUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDUixtQkFBSyxDQUFDLElBQUksRUFDVixJQUFJLDJCQUFZLENBQ1osbUJBQUssQ0FBQyxJQUFJLEVBQ1YsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FDZixDQUNKLENBQUM7UUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDUixtQkFBSyxDQUFDLEdBQUcsRUFDVCxJQUFJLDJCQUFZLENBQ1osbUJBQUssQ0FBQyxHQUFHLEVBQ2IsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FDWCxDQUNKLENBQUM7UUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDUixtQkFBSyxDQUFDLEtBQUssRUFDWCxJQUFJLDJCQUFZLENBQ1osbUJBQUssQ0FBQyxLQUFLLEVBQ1gs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LEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pHLENBQUM7QUFHRCwyQkFBMkIsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztJQUNqRSxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUUsRUFBRSxDQUFDLENBQUMsV0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFBLENBQUM7UUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNFLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJ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UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7S0FDbkIsQ0FBQztJQUNGLE1BQU0sRUFBRTtRQUVKLElBQUksaURBQXVCLEVBQUU7UUFDN0IsSUFBSSw2Q0FBcUIsRUFBRTtRQUMzQixJQUFJLDJDQUFvQixFQUFFO1FBQzFCLElBQUksYUFBSyxFQUFFO1FBQ1gsSUFBSSwrQkFBYyxFQUFFO1FBQ3BCLElBQUksdUJBQVUsRUFBRTtRQUNoQixJQUFJLG1CQUFRLEVBQUU7UUFDZCxJQUFJLHFCQUFTLEVBQUU7UUFDZixJQUFJLGlCQUFPLEVBQUU7UUFDYixJQUFJLGFBQUssRUFBRTtRQUNYLElBQUksbUJBQVEsRUFBRTtRQUNkLElBQUkscUJBQVMsRUFBRTtRQUNmLElBQUksYUFBSyxFQUFFO1FBQ1gsSUFBSSxrQkFBSSxFQUFFO1FBQ1YsSUFBSSxpQkFBTyxFQUFFO0tBRWhCO0NBQ0osQ0FBQztBQUVGLDZCQUFvQyxhQUFLO0lBQ3JDO1FBQ0ksTUFBTSxZQUFZLENBQUMsQ0FBQztJQUN4QixDQUFDO0FBQ0wsQ0FBQztBQUpZLHNCQUFjLGlCQUkxQixDQUFBOzs7O0FDOUVELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBR2xELE1BQU0sT0FBTyxHQUFHO0lBQ1osRUFBRSxFQUFFLE9BQU87SUFDWCxRQUFRLEVBQUUsT0FBTztJQUNqQixnQkFBZ0IsRUFBRSxXQUFXO0lBQzdCLElBQUksRUFBRSxPQUFPO0lBQ2IsbUJBQW1CLEVBQUUsSUFBSTtDQUM1QixDQUFBO0FBRUQsb0JBQTJCLGFBQUs7SUFDNUI7UUFDSSxNQUFNLE9BQU8sQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFRCxVQUFVLENBQUMsTUFBYztRQUNyQixNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDeEMsQ0FBQztBQUNMLENBQUM7QUFSWSxhQUFLLFFBUWpCLENBQUE7Ozs7QUNuQkQsK0JBQTZCLDhCQUE4QixDQUFDLENBQUE7QUFDNUQsd0JBQXNCLDJCQUEyQixDQUFDLENBQUE7QUFFbEQsdUNBQXFDLHdCQUF3QixDQUFDLENBQUE7QUFFOUQsNkJBQTJCLCtCQUErQixDQUFDLENBQUE7QUFDM0Qsd0JBQXNCLHVCQUF1QixDQUFDLENBQUE7QUFFOUMsSUFBSSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUU5QixhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUMzQyxhQUFhLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQ2pFLGFBQWEsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDckUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUV4RSx5QkFBZ0MsYUFBSztJQUlqQztRQUNJLElBQUksT0FBTyxHQUFHO1lBQ1YsRUFBRSxFQUFFLFlBQVk7WUFDaEIsQ0FBQyxFQUFFLEdBQUc7WUFDTixDQUFDLEVBQUUsR0FBRztZQUNOLFFBQVEsRUFBRSxxQkFBcUI7WUFDL0IsSUFBSSxFQUFFLGtCQUFrQjtZQUN4QixZQUFZLEVBQUU7Z0JBQ1YsQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sQ0FBQyxFQUFFLEdBQUc7YUFDVDtZQUNELGVBQWUsRUFBRSx1QkFBVSxDQUFDLEtBQUs7WUFDakMsYUFBYSxFQUFFLGFBQWE7WUFDNUIsY0FBYyxFQUFFLGFBQUssQ0FBQyx1QkFBdUI7U0FDaEQsQ0FBQztRQUNGLE1BQU0sT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksMkJBQVksQ0FBQztZQUNqQyxLQUFLLEVBQUUsSUFBSTtTQUNkLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxVQUFVLENBQUMsTUFBeUI7UUFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxXQUFXLENBQUMsTUFBeUI7UUFDakMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQ3ZCLE1BQU0sSUFBSSwyQ0FBb0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQy9DLENBQUM7SUFDTixDQUFDO0lBRUQsR0FBRyxDQUFDLElBQVksRUFBRSxHQUFXO1FBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDcEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7QUFDTCxDQUFDO0FBekNZLGtCQUFVLGFBeUN0QixDQUFBOzs7O0FDeERELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRWxELHdCQUFzQixTQUFTLENBQUMsQ0FBQTtBQUNoQyx3QkFBc0IsU0FBUyxDQUFDLENBQUE7QUFFaEMsTUFBTSxPQUFPLEdBQUc7SUFDWixFQUFFLEVBQUUsV0FBVztJQUNmLENBQUMsRUFBRSxHQUFHO0lBQ04sQ0FBQyxFQUFFLEdBQUc7SUFDTixRQUFRLEVBQUUsV0FBVztJQUNyQixnQkFBZ0IsRUFBRSxlQUFlO0lBQ2pDLElBQUksRUFBRSxXQUFXO0lBQ2pCLFlBQVksRUFBRTtRQUNWLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7S0FDVDtJQUNELFFBQVEsRUFBRSxJQUFJO0NBQ2pCLENBQUE7QUFFRCx3QkFBK0IsYUFBSztJQUNoQztRQUNJLE1BQU0sT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVTLFVBQVUsQ0FBQyxNQUF5QjtRQUMxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDaEQsQ0FBQztJQUNMLENBQUM7SUFFUyxVQUFVLENBQUMsTUFBeUI7UUFDMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLGFBQUssRUFBRSxDQUFDO1lBQ1osSUFBSSxhQUFLLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDN0MsQ0FBQztJQUNMLENBQUM7QUFFTCxDQUFDO0FBdkJZLGlCQUFTLFlBdUJyQixDQUFBOzs7O0FDMUNELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBR2xELE1BQU0sT0FBTyxHQUFHO0lBQ1osRUFBRSxFQUFFLE9BQU87SUFDWCxRQUFRLEVBQUUsT0FBTztJQUNqQixnQkFBZ0IsRUFBRSxXQUFXO0lBQzdCLElBQUksRUFBRSxPQUFPO0lBQ2IsbUJBQW1CLEVBQUUsSUFBSTtDQUM1QixDQUFBO0FBRUQsb0JBQTJCLGFBQUs7SUFDNUI7UUFDSSxNQUFNLE9BQU8sQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFRCxVQUFVLENBQUMsTUFBYztRQUNyQixNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDO2FBQzFDLElBQUksQ0FBQztZQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ3JDLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQztZQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7UUFDdkQsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDO1lBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7QUFDTCxDQUFDO0FBakJZLGFBQUssUUFpQmpCLENBQUE7Ozs7QUM1QkQsd0JBQXNCLDJCQUEyQixDQUFDLENBQUE7QUFFbEQsa0NBQThCLG9DQUFvQyxDQUFDLENBQUE7QUFDbkUsOEJBQXNCLGlDQUFpQyxDQUFDLENBQUE7QUFFeEQsd0JBQXNCLFNBQVMsQ0FBQyxDQUFBO0FBRWhDLE1BQU0sT0FBTyxHQUFHO0lBQ1osRUFBRSxFQUFFLE9BQU87SUFDWCxDQUFDLEVBQUUsR0FBRztJQUNOLENBQUMsRUFBRSxHQUFHO0lBQ04sUUFBUSxFQUFFLE9BQU87SUFDakIsZ0JBQWdCLEVBQUUsV0FBVztJQUM3QixJQUFJLEVBQUUsT0FBTztJQUNiLFlBQVksRUFBRTtRQUNWLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7S0FDVDtJQUNELFFBQVEsRUFBRSxJQUFJO0lBQ2QsZUFBZSxFQUFFLG1CQUFLLENBQUMsSUFBSTtJQUMzQix3QkFBd0IsRUFBRSxtQkFBSyxDQUFDLElBQUk7Q0FDdkMsQ0FBQztBQUVGLG9CQUEyQixhQUFLO0lBRTVCO1FBQ0ksTUFBTSxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRVMsVUFBVSxDQUFDLE1BQXlCO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUM5QyxDQUFDO0lBQ0wsQ0FBQztJQUVTLFNBQVMsQ0FBQyxNQUF5QjtRQUN6QyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQy9DLENBQUM7SUFDTCxDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksYUFBSyxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQztBQUNMLENBQUM7QUExQlksYUFBSyxRQTBCakIsQ0FBQTs7OztBQ2pERCx3QkFBc0IsMkJBQTJCLENBQUMsQ0FBQTtBQUVsRCxtQ0FBdUIscUNBQXFDLENBQUMsQ0FBQTtBQUU3RCxNQUFNLE9BQU8sR0FBRztJQUNaLEVBQUUsRUFBRSxPQUFPO0lBQ1gsQ0FBQyxFQUFFLEdBQUc7SUFDTixDQUFDLEVBQUUsR0FBRztJQUNOLFFBQVEsRUFBRSxPQUFPO0lBQ2pCLGdCQUFnQixFQUFFLFdBQVc7SUFDN0IsSUFBSSxFQUFFLE9BQU87SUFDYixZQUFZLEVBQUU7UUFDVixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO0tBQ1Q7SUFDRCxRQUFRLEVBQUUsSUFBSTtDQUNqQixDQUFDO0FBRUYsb0JBQTJCLGFBQUs7SUFDNUI7UUFDSSxNQUFNLE9BQU8sQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFUyxVQUFVLENBQUMsTUFBeUI7UUFDMUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDeEIsSUFBSSxjQUFjLEdBQUcseUJBQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2pFLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsTUFBTSwyREFBMkQsQ0FBQztZQUN0RSxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsR0FBRyxDQUFDLG9FQUFvRSxDQUFDLENBQUM7WUFDckYsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVTLFVBQVUsQ0FBQyxNQUF5QjtRQUMxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDNUMsQ0FBQztJQUNMLENBQUM7QUFFTCxDQUFDO0FBN0JZLGFBQUssUUE2QmpCLENBQUE7Ozs7QUMvQ0Qsd0JBQXNCLDJCQUEyQixDQUFDLENBQUE7QUFFbEQsa0NBQThCLG9DQUFvQyxDQUFDLENBQUE7QUFFbkUsa0JBQXlCLGFBQUs7SUFDMUI7UUFDSSxJQUFJLE9BQU8sR0FBRztZQUNWLEVBQUUsRUFBRSxLQUFLO1lBQ1QsZ0JBQWdCLEVBQUUsU0FBUztZQUMzQixJQUFJLEVBQUUsS0FBSztZQUNYLG1CQUFtQixFQUFFLElBQUk7U0FDNUIsQ0FBQztRQUNGLE1BQU0sT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVTLFNBQVMsQ0FBQyxNQUFjO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLCtCQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBSXpDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsK0JBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNqRCxDQUFDO0lBQ0wsQ0FBQztBQUVMLENBQUM7QUF2QlksV0FBRyxNQXVCZixDQUFBOzs7O0FDM0JELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRWxELGtDQUE4QixvQ0FBb0MsQ0FBQyxDQUFBO0FBQ25FLGlDQUErQix5QkFBeUIsQ0FBQyxDQUFBO0FBRXpELE1BQU0sT0FBTyxHQUFHO0lBQ1osRUFBRSxFQUFFLFNBQVM7SUFDYixDQUFDLEVBQUUsRUFBRTtJQUNMLENBQUMsRUFBRSxHQUFHO0lBQ04sUUFBUSxFQUFFLFNBQVM7SUFDbkIsZ0JBQWdCLEVBQUUsYUFBYTtJQUMvQixJQUFJLEVBQUUsU0FBUztJQUNmLFlBQVksRUFBRTtRQUNWLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7S0FDVDtJQUNELFFBQVEsRUFBRSxJQUFJO0lBQ2QsWUFBWSxFQUFFLElBQUk7Q0FDckIsQ0FBQztBQUVGLHNCQUE2QixhQUFLO0lBRTlCO1FBQ0ksTUFBTSxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRVMsVUFBVSxDQUFDLE1BQXlCO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUMzQyxDQUFDO0lBQ0wsQ0FBQztJQUVTLFNBQVMsQ0FBQyxNQUF5QjtRQUN6QyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN2QywrQkFBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQywrQkFBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM1QywrQkFBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQywrQkFBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM5QywrQkFBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQy9DLENBQUM7SUFDTCxDQUFDO0FBRUwsQ0FBQztBQWpDWSxlQUFPLFVBaUNuQixDQUFBOzs7O0FDckRELCtCQUFrRCxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3JGLG1DQUFpQyxzQ0FBc0MsQ0FBQyxDQUFBO0FBTXhFLE1BQU0sTUFBTSxHQUF3QjtJQUNoQyxTQUFTLEVBQUU7UUFDUCxJQUFJLG1DQUFnQixDQUFDLG9DQUFvQyxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDO1FBQ2hHLHFDQUFxQztRQUNyQyxJQUFJLG1DQUFnQixDQUFDLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQztRQUMxRSxJQUFJLG1DQUFnQixDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUM7S0FDL0M7SUFDRCxrQkFBa0IsRUFBRTtRQUNoQixJQUFJLG1DQUFnQixDQUFDLGtEQUFrRCxFQUNsRCwwQkFBMEIsRUFBRSxpQkFBaUIsQ0FBQztRQUNuRSxJQUFJLG1DQUFnQixDQUFDLGtEQUFrRCxFQUNsRCwwQkFBMEIsRUFBRSxpQkFBaUIsQ0FBQztLQUN0RTtJQUNELDBCQUEwQixFQUFFO1FBQ3hCLElBQUksbUNBQWdCLENBQUMsa0JBQWtCLEVBQUUsMEJBQTBCLEVBQUUsZ0JBQWdCLENBQUM7UUFDdEYsSUFBSSxtQ0FBZ0IsQ0FBQywyQ0FBMkMsRUFBRSxLQUFLLENBQUM7S0FDM0U7SUFDRCxjQUFjLEVBQUU7UUFDWixJQUFJLG1DQUFnQixDQUFDLHlDQUF5QyxFQUFFLEtBQUssQ0FBQztLQUN6RTtDQUNKLENBQUM7QUFFRixtQ0FBMEMsMkJBQVk7SUFHbEQsWUFBc0IsTUFBeUIsRUFBWSxXQUFrQjtRQUN6RSxNQUFNLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQURULFdBQU0sR0FBTixNQUFNLENBQW1CO1FBQVksZ0JBQVcsR0FBWCxXQUFXLENBQU87SUFFN0UsQ0FBQztJQUVTLFNBQVM7UUFDZixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxDQUFDO1FBQzVELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO1FBQzNCLENBQUM7SUFDTCxDQUFDO0lBRVMsVUFBVTtRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLElBQUksVUFBVSxHQUE0QixFQUFFLENBQUM7UUFDN0MsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFeEUsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxNQUFNLENBQUMsMEJBQTBCLENBQUMsR0FBRyxVQUFVLENBQUM7SUFDekQsQ0FBQztJQUVPLGtDQUFrQyxDQUFDLFVBQW1DO1FBQzFFLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTyxjQUFjLENBQUMsVUFBbUM7UUFDdEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksbUNBQWdCLENBQ25DLGtCQUFrQixFQUNsQixRQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDNUQsY0FBYyxDQUNqQixDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVPLFlBQVksQ0FBQyxVQUFtQztRQUNwRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QixVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksbUNBQWdCLENBQ25DLGdCQUFnQixFQUNoQixRQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDNUQsWUFBWSxDQUNmLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDO0lBRU8sWUFBWSxDQUFDLFVBQW1DO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxtQ0FBZ0IsQ0FDbkMsa0NBQWtDLEVBQ2xDLFFBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUM1RCxZQUFZLENBQ2YsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLENBQUM7SUFFTyxtQ0FBbUM7UUFDdkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsY0FBYyxDQUFDO1FBQzFCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQztRQUN0QyxDQUFDO0lBQ0wsQ0FBQztBQUVMLENBQUM7QUFwRVksNEJBQW9CLHVCQW9FaEMsQ0FBQTtBQUVELDBCQUEwQixNQUF5QixFQUFFLElBQWdCO0lBQ2pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLCtEQUErRCxFQUFFLE9BQU8sQ0FBQztTQUM1RSxJQUFJLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvRCxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRUQsMkJBQTJCLE1BQXlCLEVBQUUsSUFBZ0I7SUFDbEUsTUFBTSxDQUFDLFVBQVUsQ0FBQywrQkFBK0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyw2REFBNkQsRUFBRSxPQUFPLENBQUM7U0FDMUUsSUFBSSxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMscUVBQXFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkcsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsbUZBQW1GLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEgsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsb0ZBQW9GLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEgsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMscUNBQXFDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEUsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsK0NBQStDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsbURBQW1ELEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEYsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsaURBQWlELEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0UsQ0FBQyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUVELDBCQUEwQixNQUF5QixFQUFFLElBQWdCO0lBQ2pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHNGQUFzRixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JILENBQUM7QUFFRCx3QkFBd0IsTUFBeUIsRUFBRSxJQUFnQjtJQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxNQUFNLENBQUM7U0FDcEMsSUFBSSxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUNyRCxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUM7UUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN2QixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBR0Qsc0JBQXNCLE1BQXlCLEVBQUUsSUFBZ0I7SUFDN0QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsOENBQThDLEVBQUUsT0FBTyxDQUFDO1NBQzNELElBQUksQ0FBQztRQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQztTQUNELElBQUksQ0FBQztRQUNGLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUVELHNCQUFzQixNQUF5QixFQUFFLElBQWdCO0lBQzdELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxFQUFFLE9BQU8sQ0FBQztTQUM3QyxJQUFJLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQztTQUNELElBQUksQ0FBQztRQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM1RSxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUM7UUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUMsQ0FBQztBQUNuQixDQUFDOzs7O0FDbk1ELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRWxELGtDQUE4QixvQ0FBb0MsQ0FBQyxDQUFBO0FBRW5FLE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNyQixNQUFNLHdCQUF3QixHQUFHLENBQUMsQ0FBQztBQUNuQyxNQUFNLHNCQUFzQixHQUFHLENBQUMsQ0FBQztBQUNqQyxNQUFNLHVCQUF1QixHQUFHLENBQUMsQ0FBQztBQUVsQyxNQUFNLE9BQU8sR0FBRztJQUNaLEVBQUUsRUFBRSxTQUFTO0lBQ2IsQ0FBQyxFQUFFLEdBQUc7SUFDTixDQUFDLEVBQUUsR0FBRztJQUNOLFFBQVEsRUFBRSxvQkFBb0I7SUFDOUIsZ0JBQWdCLEVBQUUsb0JBQW9CO0lBQ3RDLElBQUksRUFBRSxTQUFTO0lBQ2YsbUJBQW1CLEVBQUUsSUFBSTtDQUM1QixDQUFDO0FBRUYsc0JBQTZCLGFBQUs7SUFDOUI7UUFDSSxNQUFNLE9BQU8sQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFUyxTQUFTLENBQUMsTUFBeUI7UUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsK0JBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QiwrQkFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLCtCQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEIsK0JBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbEMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLCtCQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNqRCxDQUFDO0lBQ0wsQ0FBQztJQUVTLFVBQVUsQ0FBQyxNQUF5QjtRQUMxQyw4QkFBOEI7UUFDOUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsb0JBQW9CO1FBQ2hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN0QixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCxNQUFNLENBQUMsd0JBQXdCLENBQUM7UUFDcEMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsTUFBTSxDQUFDLHVCQUF1QixDQUFDO1FBQ25DLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBRUQsVUFBVSxDQUFDLE1BQXlCO1FBQ2hDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsVUFBVSxDQUFDLE1BQXlCO1FBQ2hDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsUUFBUSxDQUFDLE1BQXlCO1FBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU8sVUFBVTtRQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBRU8sc0JBQXNCLENBQUMsTUFBeUI7UUFDcEQsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELENBQUM7SUFDTCxDQUFDO0FBRUwsQ0FBQztBQXRFWSxlQUFPLFVBc0VuQixDQUFBOzs7O0FDekZELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRWxELGtDQUE4QixvQ0FBb0MsQ0FBQyxDQUFBO0FBR25FLE1BQU0sT0FBTyxHQUFHO0lBQ1osRUFBRSxFQUFFLE1BQU07SUFDVixDQUFDLEVBQUUsR0FBRztJQUNOLENBQUMsRUFBRSxHQUFHO0lBQ04sUUFBUSxFQUFFLE1BQU07SUFDaEIsZ0JBQWdCLEVBQUUsVUFBVTtJQUM1QixJQUFJLEVBQUUsTUFBTTtJQUNaLFlBQVksRUFBRTtRQUNWLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7S0FDVDtJQUNELFFBQVEsRUFBRSxJQUFJO0NBQ2pCLENBQUM7QUFFRixtQkFBMEIsYUFBSztJQUUzQjtRQUNJLE1BQU0sT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVTLFVBQVUsQ0FBQyxNQUF5QjtRQUMxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0RBQWdELENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7UUFDOUQsQ0FBQztJQUNMLENBQUM7SUFFUyxTQUFTLENBQUMsTUFBeUI7UUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsK0JBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxLQUFLLEdBQVcsK0JBQWEsQ0FBQyxLQUFLLENBQUM7WUFDeEMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ2pELENBQUM7SUFDTCxDQUFDO0FBRUwsQ0FBQztBQTdCWSxZQUFJLE9BNkJoQixDQUFBOzs7O0FDaERELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRWxELElBQUksT0FBTyxHQUFHO0lBQ1YsRUFBRSxFQUFFLFVBQVU7SUFDZCxDQUFDLEVBQUUsRUFBRTtJQUNMLENBQUMsRUFBRSxHQUFHO0lBQ04sUUFBUSxFQUFFLFVBQVU7SUFDcEIsSUFBSSxFQUFFLFVBQVU7SUFDaEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsWUFBWSxFQUFFLElBQUk7Q0FDckIsQ0FBQztBQUVGLHNCQUE2QixhQUFLO0lBQzlCO1FBQ0ksTUFBTSxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDO0FBQ0wsQ0FBQztBQUpZLGVBQU8sVUFJbkIsQ0FBQTs7OztBQ2hCRCx3QkFBc0IsMkJBQTJCLENBQUMsQ0FBQTtBQUVsRCxrQ0FBOEIsb0NBQW9DLENBQUMsQ0FBQTtBQUNuRSw0Q0FBZ0MsOENBQThDLENBQUMsQ0FBQTtBQUcvRSxNQUFNLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDdkIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQztBQUN2QixNQUFNLG1CQUFtQixHQUFHLENBQUMsQ0FBQztBQUU5QixNQUFNLE9BQU8sR0FBRztJQUNaLEVBQUUsRUFBRSxPQUFPO0lBQ1gsQ0FBQyxFQUFFLEdBQUc7SUFDTixDQUFDLEVBQUUsR0FBRztJQUNOLFFBQVEsRUFBRSxPQUFPO0lBQ2pCLGdCQUFnQixFQUFFLGtCQUFrQjtJQUNwQyxJQUFJLEVBQUUsT0FBTztJQUNiLFlBQVksRUFBRTtRQUNWLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7S0FDVDtJQUNELFFBQVEsRUFBRSxJQUFJO0NBQ2pCLENBQUM7QUFFRixvQkFBMkIsYUFBSztJQUM1QjtRQUNJLE1BQU0sT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVTLFNBQVMsQ0FBQyxNQUF5QjtRQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLElBQUksR0FBRywrQkFBYSxDQUFDLEtBQUssQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLCtCQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQUksR0FBRyxHQUFTLCtCQUFhLENBQUMsS0FBSyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNqRCxDQUFDO0lBQ0wsQ0FBQztJQUVTLFVBQVUsQ0FBQyxNQUF5QjtRQUMxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMseURBQXlELENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDdkMsQ0FBQztJQUNMLENBQUM7SUFFRCxZQUFZLENBQUMsTUFBeUIsRUFBRSxJQUFXO1FBQy9DLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRVMsYUFBYSxDQUFDLE1BQXlCLEVBQUUsR0FBUTtRQUN2RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hDLDJDQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDOUIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7SUFDTCxDQUFDO0lBRUQsT0FBTztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELG9CQUFvQjtRQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLG1CQUFtQixDQUFDO1lBQy9CLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ3hCLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDeEIsQ0FBQztRQUVELE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDeEIsQ0FBQztBQUVMLENBQUM7QUE3RFksYUFBSyxRQTZEakIsQ0FBQTs7OztBQ3RGRCx3QkFBc0IsMkJBQTJCLENBQUMsQ0FBQTtBQUVsRCxJQUFJLE9BQU8sR0FBRztJQUNWLEVBQUUsRUFBRSxXQUFXO0lBQ2YsQ0FBQyxFQUFFLEdBQUc7SUFDTixDQUFDLEVBQUUsRUFBRTtJQUNMLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLElBQUksRUFBRSxXQUFXO0lBQ2pCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFlBQVksRUFBRSxJQUFJO0NBQ3JCLENBQUM7QUFFRix1QkFBOEIsYUFBSztJQUMvQjtRQUNJLE1BQU0sT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztBQUNMLENBQUM7QUFKWSxnQkFBUSxXQUlwQixDQUFBOzs7O0FDaEJELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRWxELElBQUksT0FBTyxHQUFHO0lBQ1YsRUFBRSxFQUFFLFlBQVk7SUFDaEIsQ0FBQyxFQUFFLEdBQUc7SUFDTixDQUFDLEVBQUUsRUFBRTtJQUNMLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLElBQUksRUFBRSxZQUFZO0lBQ2xCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFlBQVksRUFBRSxJQUFJO0NBQ3JCLENBQUM7QUFFRix3QkFBK0IsYUFBSztJQUNoQztRQUNJLE1BQU0sT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztBQUNMLENBQUM7QUFKWSxpQkFBUyxZQUlyQixDQUFBOzs7O0FDaEJELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRWxELGtDQUE4QixvQ0FBb0MsQ0FBQyxDQUFBO0FBR25FLE1BQU0sT0FBTyxHQUFHO0lBQ1osRUFBRSxFQUFFLFVBQVU7SUFDZCxDQUFDLEVBQUUsR0FBRztJQUNOLENBQUMsRUFBRSxHQUFHO0lBQ04sUUFBUSxFQUFFLFVBQVU7SUFDcEIsZ0JBQWdCLEVBQUUsY0FBYztJQUNoQyxJQUFJLEVBQUUsVUFBVTtJQUNoQixZQUFZLEVBQUU7UUFDVixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO0tBQ1Q7SUFDRCxRQUFRLEVBQUUsSUFBSTtDQUNqQixDQUFDO0FBRUYsdUJBQThCLGFBQUs7SUFFL0I7UUFDSSxNQUFNLE9BQU8sQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFUyxVQUFVLENBQUMsTUFBeUI7UUFDMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1FBQzVELENBQUM7SUFDTCxDQUFDO0lBRVMsU0FBUyxDQUFDLE1BQXlCO1FBQ3pDLElBQUksV0FBVyxHQUFHLCtCQUFhLENBQUMsS0FBSyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLEtBQUssR0FBVyxXQUFXLENBQUM7WUFDaEMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzVCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUMvQyxDQUFDO0lBQ0wsQ0FBQztBQUVMLENBQUM7QUF4QlksZ0JBQVEsV0F3QnBCLENBQUE7Ozs7QUMzQ0Qsd0JBQXNCLDJCQUEyQixDQUFDLENBQUE7QUFFbEQsa0NBQThCLG9DQUFvQyxDQUFDLENBQUE7QUFDbkUsaUNBQStCLHlCQUF5QixDQUFDLENBQUE7QUFFekQsTUFBTSxPQUFPLEdBQUc7SUFDWixFQUFFLEVBQUUsT0FBTztJQUNYLFFBQVEsRUFBRSxPQUFPO0lBQ2pCLGdCQUFnQixFQUFFLE9BQU87SUFDekIsSUFBSSxFQUFFLE9BQU87SUFDYixtQkFBbUIsRUFBRSxJQUFJO0NBQzVCLENBQUM7QUFFRixvQkFBMkIsYUFBSztJQUU1QjtRQUNJLE1BQU0sT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVTLFVBQVUsQ0FBQyxNQUF5QjtRQUMxQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVTLFNBQVMsQ0FBQyxNQUF5QjtRQUN6QyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN2QywrQkFBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQywrQkFBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM5QywrQkFBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQywrQkFBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM5QywrQkFBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQy9DLENBQUM7SUFDTCxDQUFDO0FBRUwsQ0FBQztBQTdCWSxhQUFLLFFBNkJqQixDQUFBOzs7O0FDMUNELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRWxELGtDQUE4QixvQ0FBb0MsQ0FBQyxDQUFBO0FBQ25FLCtCQUE2Qiw4QkFBOEIsQ0FBQyxDQUFBO0FBQzVELHNCQUFvQixPQUFPLENBQUMsQ0FBQTtBQUM1QixzQ0FBMEIscUNBQXFDLENBQUMsQ0FBQTtBQUNoRSw2QkFBMkIsK0JBQStCLENBQUMsQ0FBQTtBQUUzRCxNQUFNLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDdkIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxDQUFDO0FBRW5DLDZCQUFvQyxhQUFLO0lBSXJDO1FBQ0ksSUFBSSxPQUFPLEdBQUc7WUFDVixFQUFFLEVBQUUsU0FBUztZQUNiLENBQUMsRUFBRSxHQUFHO1lBQ04sQ0FBQyxFQUFFLEVBQUU7WUFDTCxRQUFRLEVBQUUsd0JBQXdCO1lBQ2xDLElBQUksRUFBRSxpQkFBaUI7WUFDdkIsWUFBWSxFQUFFO2dCQUNWLENBQUMsRUFBRSxHQUFHO2dCQUNOLENBQUMsRUFBRSxHQUFHO2FBQ1Q7WUFDRCxlQUFlLEVBQUUsdUJBQVUsQ0FBQyxFQUFFO1NBQ2pDLENBQUM7UUFDRixNQUFNLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLDJCQUFZLENBQUM7WUFDakMsS0FBSyxFQUFFLElBQUk7U0FDZCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRVMsVUFBVSxDQUFDLE1BQWM7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztpQkFDeEIsSUFBSSxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7aUJBQ3hCLElBQUksQ0FBQztnQkFDRixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1lBQzdFLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLENBQUMsQ0FBQztZQUNyRSxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7SUFDTCxDQUFDO0lBRVMsU0FBUyxDQUFDLE1BQWM7UUFDOUIsRUFBRSxDQUFDLENBQUMsK0JBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLCtCQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLCtCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO1FBQ3pFLENBQUM7SUFDTCxDQUFDO0lBRU8sR0FBRyxDQUFDLElBQVk7UUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTyxlQUFlLENBQUMsTUFBYztRQUNsQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzthQUNqQixJQUFJLENBQUM7WUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRU8sTUFBTSxDQUFDLE1BQWMsRUFBRSxJQUFXO1FBQ3RDLCtCQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7YUFDakIsSUFBSSxDQUFDO1lBQ0YsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUM7WUFDRixJQUFJLFNBQUcsRUFBRSxDQUFDO1lBQ1YsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3ZDLCtCQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRVMsYUFBYTtRQUNuQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLHdCQUF3QixDQUFDO1lBQ2pELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7WUFDdEMsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztRQUNyQyxDQUFDO0lBQ0wsQ0FBQztBQUNMLENBQUM7QUE3Rlksc0JBQWMsaUJBNkYxQixDQUFBOzs7O0FDekdELHVCQUFxQiwwQkFBMEIsQ0FBQyxDQUFBO0FBRWhELHNDQUE2QyxXQUFJO0lBQzdDO1FBQ0ksSUFBSSxPQUFPLEdBQUc7WUFDVixFQUFFLEVBQUUsdUJBQXVCO1lBQzNCLElBQUksRUFBRSxtQkFBbUI7WUFDekIsQ0FBQyxFQUFFLEVBQUU7WUFDTCxDQUFDLEVBQUUsR0FBRztZQUNOLFFBQVEsRUFBRSxtQ0FBbUM7WUFDN0MsWUFBWSxFQUFFO2dCQUNWLENBQUMsRUFBRSxFQUFFO2dCQUNMLENBQUMsRUFBRSxHQUFHO2FBQ1Q7WUFDRCxrQkFBa0IsRUFBRSxXQUFXO1lBQy9CLGFBQWEsRUFBRSx1QkFBdUI7U0FDekMsQ0FBQztRQUNGLE1BQU0sT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksSUFBSTtRQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDdkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLG1CQUFtQixDQUFDO1FBQy9CLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQXpCWSwrQkFBdUIsMEJBeUJuQyxDQUFBOzs7O0FDM0JELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBQ2xELDBDQUF3QywyQkFBMkIsQ0FBQyxDQUFBO0FBQ3BFLDBCQUF3QixXQUFXLENBQUMsQ0FBQTtBQUNwQyx1QkFBcUIsUUFBUSxDQUFDLENBQUE7QUFDOUIsK0JBQTZCLGdCQUFnQixDQUFDLENBQUE7QUFDOUMsdUJBQXFCLFFBQVEsQ0FBQyxDQUFBO0FBQzlCLHVCQUFxQixRQUFRLENBQUMsQ0FBQTtBQUM5Qiw2QkFBMkIsY0FBYyxDQUFDLENBQUE7QUFDMUMsMEJBQXdCLFdBQVcsQ0FBQyxDQUFBO0FBQ3BDLDBCQUF3Qiw0QkFBNEIsQ0FBQyxDQUFBO0FBR3JELE1BQU0sWUFBWSxHQUFHO0lBQ2pCLEVBQUUsRUFBRSxVQUFVO0lBQ2QsWUFBWSxFQUFFLGFBQWE7SUFDM0IsZ0JBQWdCLEVBQUUsSUFBSSxpQkFBTyxDQUFDO1FBQzFCLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFDO1FBQ2YsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDaEIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7S0FDbkIsQ0FBQztJQUNGLE1BQU0sRUFBRTtRQUNKLElBQUksaURBQXVCLEVBQUU7UUFDN0IsSUFBSSx1QkFBVSxFQUFFO1FBQ2hCLElBQUksaUJBQU8sRUFBRTtRQUNiLElBQUksaUJBQU8sRUFBRTtRQUNiLElBQUksV0FBSSxFQUFFO1FBQ1YsSUFBSSwyQkFBWSxFQUFFO1FBQ2xCLElBQUksV0FBSSxFQUFFO0tBQ2I7Q0FDSixDQUFDO0FBR0YsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLE1BQU0sU0FBUyxHQUFZLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7QUFDM0MsTUFBTSxPQUFPLEdBQVksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztBQUMxQyxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDeEIsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDO0FBRXhCLDRCQUFtQyxhQUFLO0lBR3BDO1FBQ0ksTUFBTSxZQUFZLENBQUMsQ0FBQztJQUV4QixDQUFDO0lBRUQsSUFBSTtRQUNBLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsT0FBTztRQUNILEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVPLFNBQVM7UUFDYixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVoQixHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzlCLElBQUksT0FBTyxHQUFHLElBQUksV0FBSSxDQUFDO2dCQUNuQixDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxFQUFFLE9BQU8sR0FBRyxDQUFDO2dCQUNmLE9BQU8sRUFBRSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQzthQUNuRSxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixDQUFDO0lBQ0wsQ0FBQztJQUVPLFVBQVU7UUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0FBQ0wsQ0FBQztBQXRDWSxxQkFBYSxnQkFzQ3pCLENBQUE7Ozs7QUMvRUQsd0JBQXNCLDJCQUEyQixDQUFDLENBQUE7QUFDbEQsNkJBQTJCLCtCQUErQixDQUFDLENBQUE7QUFDM0Qsd0JBQXNCLHVCQUF1QixDQUFDLENBQUE7QUFFOUMsSUFBSSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUU5QixhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUMzQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBRTdELE1BQU0sT0FBTyxHQUFHO0lBQ1osRUFBRSxFQUFFLFNBQVM7SUFDYixDQUFDLEVBQUUsR0FBRztJQUNOLENBQUMsRUFBRSxFQUFFO0lBQ0wsUUFBUSxFQUFFLGdCQUFnQjtJQUMxQixJQUFJLEVBQUUsU0FBUztJQUNmLFlBQVksRUFBRTtRQUNWLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7S0FDVDtJQUNELGVBQWUsRUFBRSx1QkFBVSxDQUFDLEtBQUs7SUFDakMsYUFBYSxFQUFFLGFBQWE7SUFDNUIsY0FBYyxFQUFFLGFBQUssQ0FBQyx1QkFBdUI7Q0FDaEQsQ0FBQztBQUVGLE1BQU0sc0JBQXNCLEdBQUcsR0FBRyxDQUFDO0FBQ25DLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0FBRXBDLHNCQUE2QixhQUFLO0lBRTlCO1FBQ0ksTUFBTSxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRUQsSUFBSTtRQUNBLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFTyxxQkFBcUI7UUFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixVQUFVLENBQUM7WUFDUCxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNwQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUNqQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsRUFBRSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTyx1QkFBdUI7UUFDM0IsTUFBTSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxDQUFDLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDLENBQUM7SUFDcEcsQ0FBQztBQUVMLENBQUM7QUF4QlksZUFBTyxVQXdCbkIsQ0FBQTs7OztBQ25ERCx3QkFBc0IsMkJBQTJCLENBQUMsQ0FBQTtBQUVsRCwrQkFBNkIsOEJBQThCLENBQUMsQ0FBQTtBQUM1RCx1Q0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUM5RCw2QkFBMkIsK0JBQStCLENBQUMsQ0FBQTtBQUMzRCx3QkFBc0IsdUJBQXVCLENBQUMsQ0FBQTtBQUU5QyxJQUFJLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRTlCLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDMUQsYUFBYSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDbEUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUNuRSxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7QUFFOUQsSUFBSSxPQUFPLEdBQUc7SUFDVixFQUFFLEVBQUUsTUFBTTtJQUNWLENBQUMsRUFBRSxHQUFHO0lBQ04sQ0FBQyxFQUFFLEdBQUc7SUFDTixRQUFRLEVBQUUsYUFBYTtJQUN2QixJQUFJLEVBQUUsTUFBTTtJQUNaLFlBQVksRUFBRTtRQUNWLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7S0FDVDtJQUNELGVBQWUsRUFBRSx1QkFBVSxDQUFDLEtBQUs7SUFDakMsYUFBYSxFQUFFLGFBQWE7SUFDNUIsY0FBYyxFQUFFLGFBQUssQ0FBQyx1QkFBdUI7Q0FDaEQsQ0FBQztBQUVGLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0FBRXBDLG1CQUEwQixhQUFLO0lBTTNCO1FBQ0ksTUFBTSxPQUFPLENBQUMsQ0FBQztRQUpYLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFLL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLDJCQUFZLENBQUM7WUFDakMsS0FBSyxFQUFFLElBQUk7U0FDZCxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRVMsVUFBVSxDQUFDLE1BQXlCO1FBQzFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVTLFdBQVcsQ0FBQyxNQUF5QjtRQUMzQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDdkIsTUFBTSxJQUFJLDJDQUFvQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FDL0MsQ0FBQztJQUNOLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBWTtRQUNaLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsSUFBSTtRQUNBLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRCx5RkFBeUY7SUFDakYscUJBQXFCO1FBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNuRCxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUNqQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsRUFBRSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTyx1QkFBdUI7UUFDM0IsTUFBTSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxDQUFDLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDLENBQUM7SUFDcEcsQ0FBQztJQUVPLGtCQUFrQjtRQUN0QixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3JCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDdEIsQ0FBQztJQUNMLENBQUM7QUFDTCxDQUFDO0FBOURZLFlBQUksT0E4RGhCLENBQUE7Ozs7QUM5RkQsK0JBQWtELGtDQUFrQyxDQUFDLENBQUE7QUFDckYsbUNBQWlDLHNDQUFzQyxDQUFDLENBQUE7QUFNeEUsTUFBTSxNQUFNLEdBQXdCO0lBQ2hDLFNBQVMsRUFBRTtRQUNQLElBQUksbUNBQWdCLENBQ2hCO1lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDO1FBQzlCLENBQUMsRUFDRCxTQUFTLEVBQ1QsQ0FBQyxNQUF5QixFQUFFLElBQVU7WUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQ0o7UUFDRCxJQUFJLG1DQUFnQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUM7S0FDeEM7Q0FDSixDQUFDO0FBRUYsbUNBQTBDLDJCQUFZO0lBRWxELFlBQXNCLE1BQXlCLEVBQVksV0FBa0I7UUFDekUsTUFBTSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFEVCxXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUFZLGdCQUFXLEdBQVgsV0FBVyxDQUFPO0lBRTdFLENBQUM7SUFFUyxTQUFTO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7SUFDM0IsQ0FBQztJQUVTLFVBQVU7UUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztBQUVMLENBQUM7QUFkWSw0QkFBb0IsdUJBY2hDLENBQUE7Ozs7QUNwQ0Qsd0JBQXNCLDJCQUEyQixDQUFDLENBQUE7QUFFbEQsSUFBSSxPQUFPLEdBQUc7SUFDVixFQUFFLEVBQUUsYUFBYTtJQUNqQixDQUFDLEVBQUUsR0FBRztJQUNOLENBQUMsRUFBRSxHQUFHO0lBQ04sUUFBUSxFQUFFLGFBQWE7SUFDdkIsSUFBSSxFQUFFLGFBQWE7SUFDbkIsY0FBYyxFQUFFLElBQUk7Q0FDdkIsQ0FBQztBQUVGLHlCQUFnQyxhQUFLO0lBQ2pDO1FBQ0ksTUFBTSxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDO0FBQ0wsQ0FBQztBQUpZLGtCQUFVLGFBSXRCLENBQUE7Ozs7QUNmRCx3QkFBc0IsMkJBQTJCLENBQUMsQ0FBQTtBQUVsRCxrQ0FBOEIsb0NBQW9DLENBQUMsQ0FBQTtBQUNuRSxpQ0FBK0IseUJBQXlCLENBQUMsQ0FBQTtBQUV6RCxNQUFNLE9BQU8sR0FBRztJQUNaLEVBQUUsRUFBRSxTQUFTO0lBQ2IsQ0FBQyxFQUFFLEdBQUc7SUFDTixDQUFDLEVBQUUsR0FBRztJQUNOLFFBQVEsRUFBRSxTQUFTO0lBQ25CLGdCQUFnQixFQUFFLGFBQWE7SUFDL0IsSUFBSSxFQUFFLFNBQVM7SUFDZixZQUFZLEVBQUU7UUFDVixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO0tBQ1Q7SUFDRCxRQUFRLEVBQUUsSUFBSTtDQUNqQixDQUFDO0FBRUYsc0JBQTZCLGFBQUs7SUFFOUI7UUFDSSxNQUFNLE9BQU8sQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFUyxVQUFVLENBQUMsTUFBeUI7UUFDMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvQixDQUFDO0lBQ0wsQ0FBQztJQUVTLFNBQVMsQ0FBQyxNQUF5QjtRQUN6QyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN2QywrQkFBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQywrQkFBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM1QywrQkFBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQywrQkFBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQywrQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM5QywrQkFBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQy9DLENBQUM7SUFDTCxDQUFDO0FBRUwsQ0FBQztBQWpDWSxlQUFPLFVBaUNuQixDQUFBOzs7O0FDcERELHdCQUFzQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRWxELElBQUksT0FBTyxHQUFHO0lBQ1YsRUFBRSxFQUFFLFdBQVc7SUFDZixDQUFDLEVBQUUsRUFBRTtJQUNMLENBQUMsRUFBRSxFQUFFO0lBQ0wsUUFBUSxFQUFFLGVBQWU7SUFDekIsSUFBSSxFQUFFLGVBQWU7SUFDckIsY0FBYyxFQUFFLElBQUk7SUFDcEIsWUFBWSxFQUFFLElBQUk7Q0FDckIsQ0FBQztBQUVGLDJCQUFrQyxhQUFLO0lBQ25DO1FBQ0ksTUFBTSxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDO0FBQ0wsQ0FBQztBQUpZLG9CQUFZLGVBSXhCLENBQUE7Ozs7QUNoQkQsd0JBQXNCLDJCQUEyQixDQUFDLENBQUE7QUFFbEQsSUFBSSxPQUFPLEdBQUc7SUFDVixFQUFFLEVBQUUsTUFBTTtJQUNWLENBQUMsRUFBRSxHQUFHO0lBQ04sQ0FBQyxFQUFFLEVBQUU7SUFDTCxRQUFRLEVBQUUsTUFBTTtJQUNoQixJQUFJLEVBQUUsTUFBTTtJQUNaLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFlBQVksRUFBRSxJQUFJO0NBQ3JCLENBQUM7QUFFRixtQkFBMEIsYUFBSztJQUMzQjtRQUNJLE1BQU0sT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztBQUNMLENBQUM7QUFKWSxZQUFJLE9BSWhCLENBQUE7Ozs7QUNoQkQsd0JBQXNCLDJCQUEyQixDQUFDLENBQUE7QUFFbEQsSUFBSSxPQUFPLEdBQUc7SUFDVixFQUFFLEVBQUUsTUFBTTtJQUNWLENBQUMsRUFBRSxDQUFDO0lBQ0osQ0FBQyxFQUFFLENBQUM7SUFDSixRQUFRLEVBQUUsTUFBTTtJQUNoQixJQUFJLEVBQUUsTUFBTTtJQUNaLGNBQWMsRUFBRSxJQUFJO0NBQ3ZCLENBQUM7QUFTRixtQkFBMEIsYUFBSztJQUMzQixZQUFZLFlBQTBCO1FBQ2xDLElBQUksY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUM5RCxNQUFNLGNBQWMsQ0FBQyxDQUFDO0lBQzFCLENBQUM7QUFDTCxDQUFDO0FBTFksWUFBSSxPQUtoQixDQUFBOzs7O0FDdkJELDBCQUF3QiwyQkFBMkIsQ0FBQyxDQUFBO0FBR3BEO0lBR0k7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRUQsVUFBVSxDQUFDLE1BQXlCO1FBQ2hDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxVQUFVLENBQUMsTUFBeUI7UUFDaEMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELFFBQVEsQ0FBQyxNQUF5QjtRQUM5QixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU8scUJBQXFCO1FBQ3pCLEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQ2pDLENBQUM7SUFDTCxDQUFDO0FBRUwsQ0FBQztBQUVZLHNCQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQzs7OztBQ2pDbkQseUJBQXVCLFVBQVUsQ0FBQyxDQUFBO0FBQ2xDLDBDQUF1QixxQ0FBcUMsQ0FBQyxDQUFBO0FBQzdELDRCQUEwQixhQUFhLENBQUMsQ0FBQTtBQUN4QyxpQ0FBK0Isa0JBQWtCLENBQUMsQ0FBQTtBQUNsRCxpQ0FBK0Isa0JBQWtCLENBQUMsQ0FBQTtBQUNsRCw0QkFBMEIsYUFBYSxDQUFDLENBQUE7QUFDeEMsdUNBQTJCLHFDQUFxQyxDQUFDLENBQUE7QUFFakUsTUFBTSxDQUFDLE1BQU0sR0FBRztJQUNaLElBQUksSUFBSSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksQ0FBQyxnQ0FBTSxDQUFDLEtBQUssRUFBRSxnQ0FBTSxDQUFDLE1BQU0sRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRTdFLGlDQUFVLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUV4QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUscUJBQVMsQ0FBQyxDQUFDO0lBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSwrQkFBYyxDQUFDLENBQUM7SUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLCtCQUFjLENBQUMsQ0FBQztJQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUscUJBQVMsQ0FBQyxDQUFDO0lBRWxDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL2VuZ2luZS91aS9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBwaGFzZXIgfSBmcm9tICcuL1BoYXNlcic7XG5cbmV4cG9ydCBjb25zdCBCb290U2NlbmUgPSB7XG4gICAgcHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGxvYWQgaGVyZSBhc3NldHMgcmVxdWlyZWQgZm9yIHRoZSBsb2FkaW5nIHNjcmVlblxuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZSgncHJlbG9hZGVyX2JhcicsICdpbWFnZXMvdWkvUFJFTE9BREVSX0JBUi5wbmcnKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBwaGFzZXIuU2NhbGVNYW5hZ2VyLlVTRVJfU0NBTEU7XG5cbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNldFVzZXJTY2FsZShsYXlvdXQuTEFZT1VUX1pPT00sIGxheW91dC5MQVlPVVRfWk9PTSk7XG4gICAgICAgIC8vIGVuYWJsZSBjcmlzcCByZW5kZXJpbmdcbiAgICAgICAgdGhpcy5nYW1lLnJlbmRlcmVyLnJlbmRlclNlc3Npb24ucm91bmRQaXhlbHMgPSB0cnVlO1xuICAgICAgICBwaGFzZXIuQ2FudmFzLnNldEltYWdlUmVuZGVyaW5nQ3Jpc3AodGhpcy5nYW1lLmNhbnZhcyk7XG5cbiAgICAgICAgdGhpcy5nYW1lLmNhbnZhcy5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKGU6IEV2ZW50KSB7IGUucHJldmVudERlZmF1bHQoKTsgfVxuXG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgncHJlbG9hZGVyJyk7XG4gICAgfVxufTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdmVuZG9yL3BoYXNlci9waGFzZXIuZC50c1wiLz5cbmV4cG9ydCBjb25zdCBwaGFzZXIgPSBQaGFzZXI7IiwiaW1wb3J0IHsgRG9jdG9ydGlsbGFHYW1lIH0gZnJvbSAnLi9nYW1lL0RvY3RvcnRpbGxhR2FtZSc7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi9lbmdpbmUvc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuXG5jbGFzcyBQbGF5U2NlbmUge1xuXG4gICAgZ2FtZU1vZGVsOiBEb2N0b3J0aWxsYUdhbWU7XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZU1vZGVsID0gbmV3IERvY3RvcnRpbGxhR2FtZSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lTW9kZWwudXBkYXRlKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICAvLyBwaGFzZXJHYW1lLnZhbHVlLmRlYnVnLmlucHV0SW5mbygzMiwgMzIpO1xuICAgICAgICAvLyBwaGFzZXJHYW1lLnZhbHVlLmRlYnVnLnBvaW50ZXIoIHBoYXNlckdhbWUudmFsdWUuaW5wdXQuYWN0aXZlUG9pbnRlciApO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IHBsYXlTY2VuZSA9IG5ldyBQbGF5U2NlbmUoKTtcbiIsImltcG9ydCB7IGFzc2V0c01hbmFnZXIgfSBmcm9tICcuL2dhbWUvQXNzZXRzTWFuYWdlcic7XG5cbmV4cG9ydCBjb25zdCBQcmVsb2FkZXJTY2VuZSA9IHtcbiAgICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubG9hZGluZ0JhciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDI0MCwgJ3ByZWxvYWRlcl9iYXInKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nQmFyLmFuY2hvci5zZXRUbygwLCAwLjUpO1xuICAgICAgICB0aGlzLmxvYWQuc2V0UHJlbG9hZFNwcml0ZSh0aGlzLmxvYWRpbmdCYXIpO1xuXG4gICAgICAgIGFzc2V0c01hbmFnZXIubG9hZEFzc2V0cyg8UGhhc2VyLkdhbWU+IHRoaXMuZ2FtZSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ3N0YXJ0TWVudScpO1xuICAgIH1cbn07IiwiaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9lbmdpbmUvdWkvTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi9QaGFzZXInO1xuaW1wb3J0IHsgbGFiZWxzU3RvcmUgfSBmcm9tICcuL2VuZ2luZS9zdG9yZXMvTGFiZWxzLnN0b3JlJztcblxuZXhwb3J0IGNvbnN0IFN0YXJ0TWVudVNjZW5lID0ge1xuICAgIHByZWxvYWQ6IGZ1bmN0aW9uKCkge30sXG5cbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVMb2dvKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQnV0dG9ucygpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVMb2dvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGxvZ28gOiBQaGFzZXIuU3ByaXRlID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUobGF5b3V0LkxPR09fUE9TSVRJT04ueCwgbGF5b3V0LkxPR09fUE9TSVRJT04ueSAtIDMwLCAnTE9HTycpO1xuICAgICAgICBsZXQgbG9nb1R3ZWVuIDogUGhhc2VyLlR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2Vlbihsb2dvKTtcblxuICAgICAgICBsb2dvVHdlZW4udG8oeyB5OiBsYXlvdXQuTE9HT19QT1NJVElPTi55IH0sIDEwMDAsICdFbGFzdGljJywgdHJ1ZSwgMCk7XG5cbiAgICAgICAgbGV0IHRoZUdhbWU6IFBoYXNlci5TcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShsYXlvdXQuVEhFX0dBTUVfUE9TSVRJT04ueCwgbGF5b3V0LlRIRV9HQU1FX1BPU0lUSU9OLnksICdUSEVfR0FNRScpO1xuICAgICAgICBsZXQgdGhlR2FtZVR3ZWVuIDogUGhhc2VyLlR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2Vlbih0aGVHYW1lKTtcbiAgICAgICAgdGhlR2FtZS5hbHBoYSA9IDA7XG4gICAgICAgIHRoZUdhbWVUd2Vlbi50byh7IGFscGhhOiAxIH0sIDEwMDAsICdMaW5lYXInLCB0cnVlLCAwKTtcblxuICAgIH0sXG5cbiAgICBjcmVhdGVCdXR0b25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFbmdsaXNoQnV0dG9uKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlU3BhbmlzaEJ1dHRvbigpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVFbmdsaXNoQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVuZ2xpc2hCdXR0b24gOiBQaGFzZXIuQnV0dG9uID0gdGhpcy5nYW1lLmFkZC5idXR0b24oXG4gICAgICAgICAgICBsYXlvdXQuRU5HTElTSF9CVVRUT05fUE9TSVRJT04ueCxcbiAgICAgICAgICAgIGxheW91dC5FTkdMSVNIX0JVVFRPTl9QT1NJVElPTi55LFxuICAgICAgICAgICAgJ0VOR0xJU0hfQlVUVE9OJyxcbiAgICAgICAgICAgIHRoaXMub25FbmdsaXNoQnV0dG9uQ2xpY2ssXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAyLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICBlbmdsaXNoQnV0dG9uLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBjcmVhdGVTcGFuaXNoQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNwYW5pc2hCdXR0b24gOiBQaGFzZXIuQnV0dG9uID0gdGhpcy5nYW1lLmFkZC5idXR0b24oXG4gICAgICAgICAgICBsYXlvdXQuU1BBTklTSF9CVVRUT05fUE9TSVRJT04ueCxcbiAgICAgICAgICAgIGxheW91dC5TUEFOSVNIX0JVVFRPTl9QT1NJVElPTi55LFxuICAgICAgICAgICAgJ1NQQU5JU0hfQlVUVE9OJyxcbiAgICAgICAgICAgIHRoaXMub25TcGFuaXNoQnV0dG9uQ2xpY2ssXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAyLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICBzcGFuaXNoQnV0dG9uLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBvbkVuZ2xpc2hCdXR0b25DbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxhYmVsc1N0b3JlLnNldExhbmd1YWdlKCdlbicpO1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ3BsYXknKTtcbiAgICB9LFxuXG4gICAgb25TcGFuaXNoQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsYWJlbHNTdG9yZS5zZXRMYW5ndWFnZSgnZXMnKTtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdwbGF5Jyk7XG4gICAgfVxufTsiLCJpbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25MaW5lIH0gZnJvbSAnLi9Db252ZXJzYXRpb25MaW5lJztcbmltcG9ydCB7IENvbnZlcnNhdGlvblVJIH0gZnJvbSAnLi4vdWkvQ29udmVyc2F0aW9uVUknO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDb252ZXJzYXRpb25TY3JpcHQgeyBbczogc3RyaW5nXTogQXJyYXk8Q29udmVyc2F0aW9uTGluZT47IH1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbnZlcnNhdGlvbiB7XG5cbiAgICBwcml2YXRlIG9uQ2hhbmdlT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTtcbiAgICBwcml2YXRlIF9zdGF0ZUlkOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIHNjcmlwdDogSUNvbnZlcnNhdGlvblNjcmlwdDtcbiAgICBwcml2YXRlIHVpOiBDb252ZXJzYXRpb25VSTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBwbGF5ZXI6IFBsYXllciwgcHJvdGVjdGVkIG90aGVyUGVyc29uOiBUaGluZykge1xuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICAgICAgdGhpcy5vdGhlclBlcnNvbiA9IG90aGVyUGVyc29uO1xuICAgICAgICB0aGlzLmxvYWRTY3JpcHQoKTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLmluaXRTdGF0ZSgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNvbnZlcnNhdGlvblVJKCk7XG4gICAgfVxuXG4gICAgb25TdGF0ZUNoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLnN0YXRlKTtcbiAgICB9XG5cbiAgICBnZXQgc3RhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlSWQ7XG4gICAgfVxuXG4gICAgZ2V0TGluZXMoKTogQXJyYXk8Q29udmVyc2F0aW9uTGluZT4ge1xuICAgICAgICBsZXQgY3VycmVudFN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgaWYgKCF0aGlzLnNjcmlwdCB8fCAhdGhpcy5zY3JpcHRbY3VycmVudFN0YXRlXSkge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SLCB0aGVyZSBhcmUgbm8gbGluZXMgZm9yIHRoaXMgc3RhdGUgb2YgY29udmVyc2F0aW9uJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zY3JpcHRbY3VycmVudFN0YXRlXTtcbiAgICB9XG5cbiAgICBzZXQgc3RhdGUobmV3U3RhdGUpIHtcbiAgICAgICAgaWYgKG5ld1N0YXRlID09PSAnZW5kJykge1xuICAgICAgICAgICAgdGhpcy51aS5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZUlkID0gbmV3U3RhdGU7XG4gICAgICAgICAgICB0aGlzLmxvYWRTY3JpcHQoKTtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5U3RhdGVDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5TGluZShsaW5lOiBDb252ZXJzYXRpb25MaW5lKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGxheWVyLnNheShsaW5lLnRleHQodGhpcy5wbGF5ZXIpKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxpbmUuYWZ0ZXJDYWxsYmFjayh0aGlzLnBsYXllciwgdGhpcy5vdGhlclBlcnNvbilcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IGxpbmUubmV4dFN0YXRlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFRleHRGb3JMaW5lKGxpbmU6IENvbnZlcnNhdGlvbkxpbmUpOiBzdHJpbmcge1xuICAgICAgICB2YXIgdGV4dENhbGxiYWNrID0gbGluZS50ZXh0O1xuICAgICAgICByZXR1cm4gdGV4dENhbGxiYWNrKHt9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgbG9hZFNjcmlwdCgpOiB2b2lkO1xuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBpbml0U3RhdGUoKTogdm9pZDtcblxuICAgIHByaXZhdGUgY3JlYXRlQ29udmVyc2F0aW9uVUkoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudWkgPSBuZXcgQ29udmVyc2F0aW9uVUkodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3RpZnlTdGF0ZUNoYW5nZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUubm90aWZ5T2JzZXJ2ZXJzKHRoaXMuc3RhdGUpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcbmltcG9ydCB7IElDYWxsYmFjayB9IGZyb20gJy4uL1V0aWxzL09ic2VydmFibGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDb252ZXJzYXRpb25DYWxsYmFjayB7XG4gICAgKHBsYXllcjogUGxheWVyLCBvdGhlclBlcnNvbjogVGhpbmcpOiBhbnk7XG59XG5cbmNvbnN0IGVtcHR5RnVuY3Rpb25XaXRoUHJvbWlzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICByZXNvbHZlQ2FsbGJhY2s6IGZ1bmN0aW9uKCkge31cbiAgICB9O1xuICAgIGxldCBkZWZlcnJlZCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIHJlc3VsdC5yZXNvbHZlQ2FsbGJhY2sgPSByZXNvbHZlO1xuICAgIH0pO1xuICAgIHJlc3VsdC5yZXNvbHZlQ2FsbGJhY2soKTtcblxuICAgIHJldHVybiBkZWZlcnJlZDtcbn07XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJzYXRpb25MaW5lIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3RleHQ6IHN0cmluZyB8IElDb252ZXJzYXRpb25DYWxsYmFjayxcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9uZXh0U3RhdGU6IHN0cmluZyB8ICgoKSA9PiBzdHJpbmcpLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgX2FmdGVyQ2FsbGJhY2s6IElDb252ZXJzYXRpb25DYWxsYmFjayA9IGVtcHR5RnVuY3Rpb25XaXRoUHJvbWlzZSkge1xuXG4gICAgICAgIGlmICghdGhpcy5fdGV4dCkge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBtaXNzaW5nIHRleHQgZm9yIGNvbnZlcnNhdGlvbiBsaW5lJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX25leHRTdGF0ZSkge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBtaXNzaW5nIG5leHQgc3RhdGUgZm9yIGNvbnZlcnNhdGlvbiBsaW5lJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCB0ZXh0KCk6IElDYWxsYmFjayB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fdGV4dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiAoKCkgPT4ge3JldHVybiB0aGlzLl90ZXh0OyB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5fdGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIDxJQ2FsbGJhY2s+IHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgJ0VSUk9SOiBnZXR0aW5nIHRleHQgb2YgY29udmVyc2F0aW9uIGxpbmUsIHdpdGggaW5jb3JyZWN0IHR5cGUnO1xuICAgIH1cblxuICAgIGdldCBhZnRlckNhbGxiYWNrKCk6IElDb252ZXJzYXRpb25DYWxsYmFjayB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZnRlckNhbGxiYWNrO1xuICAgIH1cblxuICAgIGdldCBuZXh0U3RhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TmV4dFN0YXRlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROZXh0U3RhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9uZXh0U3RhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gPHN0cmluZz4gdGhpcy5fbmV4dFN0YXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICg8KCgpID0+IHN0cmluZyk+IHRoaXMuX25leHRTdGF0ZSkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgeyBJUG9pbnQsIElHb1RvU2NlbmVPcHRpb25zIH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBWZXJicyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5cbmludGVyZmFjZSBJRG9vck9wdGlvbnMge1xuICAgIGlkOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgc3ByaXRlSWQ6IHN0cmluZyxcbiAgICBnb1RvUG9zaXRpb246IElQb2ludCxcbiAgICBkZXN0aW5hdGlvblNjZW5lSWQ6IHN0cmluZyxcbiAgICByZWxhdGVkRG9vcklkOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIERvb3IgZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZG9vck9wdGlvbnM6IElEb29yT3B0aW9ucykge1xuICAgICAgICBzdXBlcihkb29yT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5uYW1lIHx8ICdkb29yJztcbiAgICB9XG5cbiAgICBnZXRQcmVmZXJyZWRBY3Rpb24oKTogVmVyYnMge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHJldHVybiBWZXJicy5DTE9TRTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBWZXJicy5PUEVOO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yY2VPcGVuKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ09QRU4nLCB0cnVlKTtcbiAgICB9XG5cbiAgICBnb1RvQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ29Ub0Rlc3RpbmF0aW9uSWZPcGVuKHBsYXllcik7XG4gICAgfVxuXG4gICAgb3BlbkFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5vcGVuKHBsYXllcikpO1xuICAgIH1cblxuICAgIGNsb3NlQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLmNsb3NlKHBsYXllcikpO1xuICAgIH1cblxuICAgIGxvb2tBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ1RoYXRcXCdzIGEgd29uZGVyZnVsIGRvb3IuIFNvIHdvb2R5LicpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb3BlbihwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0l0IGlzIGFscmVhZHkgb3BlbiEnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQXR0cignT1BFTicsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbG9zZShwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZ2V0QXR0cignT1BFTicpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJdCBpcyBhbHJlYWR5IGNsb3NlZCEnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQXR0cignT1BFTicsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvblN0YXRlQ2hhbmdlKCk6IHZvaWQge1xuICAgICAgICBpZighdGhpcy5zcHJpdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ29Ub0Rlc3RpbmF0aW9uSWZPcGVuKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZ29Ub1NjZW5lT3B0aW9uczogSUdvVG9TY2VuZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lSWQ6IHRoaXMuZG9vck9wdGlvbnMuZGVzdGluYXRpb25TY2VuZUlkLFxuICAgICAgICAgICAgICAgICAgICByZWxhdGVkRG9vcklkOiB0aGlzLmRvb3JPcHRpb25zLnJlbGF0ZWREb29ySWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLkdPX1RPX1NDRU5FLCBnb1RvU2NlbmVPcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgbGFiZWxzU3RvcmUgfSBmcm9tICcuLi9zdG9yZXMvTGFiZWxzLnN0b3JlJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi9zdGF0ZS9BY3RpdmVJbnZlbnRvcnkuc2luZ2xldG9uJztcbmltcG9ydCB7IFNjZW5lIH0gZnJvbSAnLi9TY2VuZSc7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgR3JhcGhpY1VJIH0gZnJvbSAnLi4vdWkvR3JhcGhpY1VJJztcbmltcG9ydCB7IEdhbWVDYW1lcmEgfSBmcm9tICcuL0dhbWVDYW1lcmEnO1xuaW1wb3J0IHsgc2VsZWN0ZWRWZXJiIH0gZnJvbSAnLi4vc3RhdGUvU2VsZWN0ZWRWZXJiLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBWZXJic0luZm8gfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBzY2VuZXMgfSBmcm9tICcuLi9zdGF0ZS9TY2VuZXMuc2luZ2xldG9uJztcbmltcG9ydCB7IElHb1RvU2NlbmVPcHRpb25zIH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5cbmltcG9ydCB7IElMYWJlbHMgIH0gZnJvbSAnLi4vc3RvcmVzL0xhYmVscy5zdG9yZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUdhbWVPcHRpb25zIHtcbiAgICBsYWJlbHM6IElMYWJlbHMsXG4gICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgc2NlbmVzOiBBcnJheTxTY2VuZT4sXG4gICAgaW5pdGlhbFNjZW5lSWQ6IHN0cmluZ1xufVxuXG5pbnRlcmZhY2UgSVNlbGVjdFRoaW5nT3B0aW9ucyB7XG4gICAgdGhpbmc6IFRoaW5nLFxuICAgIHNlY29uZGFyeUFjdGlvbj86IEJvb2xlYW5cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdhbWUge1xuXG4gICAgcHJpdmF0ZSBwbGF5ZXI6IFBsYXllcjtcbiAgICBwcml2YXRlIGNhbWVyYTogR2FtZUNhbWVyYTtcbiAgICBwcml2YXRlIGdyYXBoaWNVSTogR3JhcGhpY1VJO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIG9wdGlvbnM6IElHYW1lT3B0aW9ucykge1xuICAgICAgICBsYWJlbHNTdG9yZS5hZGRMYWJlbHModGhpcy5vcHRpb25zLmxhYmVscyk7XG4gICAgICAgIHRoaXMucGxheWVyID0gdGhpcy5vcHRpb25zLnBsYXllcjtcbiAgICAgICAgYWN0aXZlSW52ZW50b3J5LnNldEFjdGl2ZUludmVudG9yeSh0aGlzLnBsYXllci5pbnZlbnRvcnkpO1xuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lcyh0aGlzLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLmluaXRBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMudXBkYXRlV29ybGRCb3VuZHMoKTtcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgR2FtZUNhbWVyYSh0aGlzLnBsYXllcik7XG4gICAgICAgIHRoaXMuZ3JhcGhpY1VJID0gbmV3IEdyYXBoaWNVSSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jYW1lcmEudXBkYXRlUG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lcyhvcHRpb25zOiBJR2FtZU9wdGlvbnMpOiB2b2lkIHtcbiAgICAgICAgc2NlbmVzLmluaXQob3B0aW9ucy5zY2VuZXMpO1xuICAgICAgICBzY2VuZXMuc2V0Q3VycmVudFNjZW5lQnlJZChvcHRpb25zLmluaXRpYWxTY2VuZUlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRBY3Rpb25zKCk6IHZvaWQge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKEFjdGlvbnMuQ0xJQ0tfU1RBR0UsIGV2ID0+IHRoaXMubW92ZVBsYXllclRvKGV2KSApO1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKEFjdGlvbnMuU0VMRUNUX1RISU5HLCBvcHRpb25zID0+IHRoaXMuc2VsZWN0VGhpbmcob3B0aW9ucykgKTtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhBY3Rpb25zLkdPX1RPX1NDRU5FLCBvcHRpb25zID0+IHRoaXMuZ29Ub1NjZW5lKG9wdGlvbnMpICk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oQWN0aW9ucy5UQUtFX09CSkVDVCwgdGhpbmcgPT4gdGhpcy50YWtlT2JqZWN0KHRoaW5nKSApO1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKEFjdGlvbnMuUkVGTEVDVCwgKCkgPT4gdGhpcy5yZWZsZWN0KCkgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1vdmVQbGF5ZXJUbyhldmVudDogUGhhc2VyLlBvaW50ZXIpOiB2b2lkIHtcbiAgICAgICAgbGV0IG5vblNhZmVQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IGV2ZW50LndvcmxkWCxcbiAgICAgICAgICAgIHk6IGV2ZW50LndvcmxkWVxuICAgICAgICB9O1xuICAgICAgICBsZXQgc2FmZVBvc2l0aW9uID0gc2NlbmVzLmN1cnJlbnRTY2VuZS5ib3VuZGFyaWVzLmdldFBvc2l0aW9uSW5zaWRlKG5vblNhZmVQb3NpdGlvbik7XG4gICAgICAgIHRoaXMucGxheWVyLm1vdmVUbyhzYWZlUG9zaXRpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlV29ybGRCb3VuZHMoKTogdm9pZCB7XG4gICAgICAgIGxldCBib3VuZHMgPSBzY2VuZXMuY3VycmVudFNjZW5lLnNjZW5lQm91bmRzO1xuICAgICAgICBwaGFzZXJHYW1lLnZhbHVlLndvcmxkLnNldEJvdW5kcyhcbiAgICAgICAgICAgIGJvdW5kcy54LFxuICAgICAgICAgICAgYm91bmRzLnksXG4gICAgICAgICAgICBib3VuZHMud2lkdGgsXG4gICAgICAgICAgICBib3VuZHMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNlbGVjdFRoaW5nKG9wdGlvbnM6IElTZWxlY3RUaGluZ09wdGlvbnMpOiB2b2lkIHtcbiAgICAgICAgdmFyIHZlcmIgPSBWZXJic0luZm8uZ2V0KHNlbGVjdGVkVmVyYi52ZXJiKTtcbiAgICAgICAgaWYob3B0aW9ucy5zZWNvbmRhcnlBY3Rpb24gJiYgb3B0aW9ucy50aGluZy5nZXRQcmVmZXJyZWRBY3Rpb24oKSkge1xuICAgICAgICAgICAgb3B0aW9ucy50aGluZy5hcHBseUFjdGlvbihvcHRpb25zLnRoaW5nLmdldFByZWZlcnJlZEFjdGlvbigpLCB0aGlzLnBsYXllcik7XG4gICAgICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5BQ1RJT05fQVBQTElFRCk7XG4gICAgICAgIH0gZWxzZSBpZiAodmVyYi5zaW5nbGVPYmplY3QpIHtcbiAgICAgICAgICAgIG9wdGlvbnMudGhpbmcuYXBwbHlBY3Rpb24oc2VsZWN0ZWRWZXJiLnZlcmIsIHRoaXMucGxheWVyKTtcbiAgICAgICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLkFDVElPTl9BUFBMSUVEKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0VGhpbmdGb3JNdWx0aXBsZU9iamVjdFZlcmIob3B0aW9ucy50aGluZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRha2VPYmplY3QodGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHNjZW5lcy5jdXJyZW50U2NlbmUucmVtb3ZlT2JqZWN0KHRoaW5nKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIuYWRkT2JqZWN0VG9JbnZlbnRvcnkodGhpbmcpO1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5VUERBVEVfSU5WRU5UT1JZKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNlbGVjdFRoaW5nRm9yTXVsdGlwbGVPYmplY3RWZXJiKHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZykge1xuICAgICAgICAgICAgdGhpbmcuYXBwbHlBY3Rpb24oc2VsZWN0ZWRWZXJiLnZlcmIsIHRoaXMucGxheWVyKTtcbiAgICAgICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLkFDVElPTl9BUFBMSUVEKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGluZy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFRoaW5nLnRoaW5nID0gdGhpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdvVG9TY2VuZShvcHRpb25zOiBJR29Ub1NjZW5lT3B0aW9ucykge1xuICAgICAgICBzY2VuZXMuZ29Ub1NjZW5lV2l0aElkKG9wdGlvbnMuc2NlbmVJZCk7XG4gICAgICAgIHNjZW5lcy5jdXJyZW50U2NlbmUucGxheWVyQXJyaXZlc0F0RG9vcih0aGlzLnBsYXllciwgb3B0aW9ucy5yZWxhdGVkRG9vcklkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZmxlY3QoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGxheWVyLnJlZmxlY3QoKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBzdHlsZSB9IGZyb20gJy4uL3VpL1N0eWxlJztcblxuZXhwb3J0IGNsYXNzIEdhbWVDYW1lcmEge1xuICAgIHByaXZhdGUgY2FtZXJhOiBQaGFzZXIuQ2FtZXJhO1xuICAgIHByaXZhdGUgY2FtZXJhUG9zaXRpb246IElQb2ludDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGxheWVyOiBQbGF5ZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBsYXllcikge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBhIGNhbWVyYSBuZWVkcyBhIHBsYXllciB0byBmb2xsb3cnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FtZXJhID0gcGhhc2VyR2FtZS52YWx1ZS5jYW1lcmE7XG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICB1cGRhdGVQb3NpdGlvbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jYW1lcmFQb3NpdGlvbiA9IHRoaXMuY2FtZXJhUG9zaXRpb24gfHwgbmV3IFBoYXNlci5Qb2ludCgwLCAwKTtcblxuICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5wbGF5ZXIuc3ByaXRlO1xuICAgICAgICB0aGlzLmNhbWVyYVBvc2l0aW9uLnggKz0gKHBsYXllci54IC0gdGhpcy5jYW1lcmFQb3NpdGlvbi54KSAqIHN0eWxlLkNBTUVSQV9FQVNJTkdfRkFDVE9SO1xuICAgICAgICB0aGlzLmNhbWVyYVBvc2l0aW9uLnggPSBNYXRoLnJvdW5kKHRoaXMuY2FtZXJhUG9zaXRpb24ueCk7XG4gICAgICAgIHRoaXMuY2FtZXJhUG9zaXRpb24ueSArPSAocGxheWVyLnkgLSB0aGlzLmNhbWVyYVBvc2l0aW9uLnkpICogc3R5bGUuQ0FNRVJBX0VBU0lOR19GQUNUT1I7XG4gICAgICAgIHRoaXMuY2FtZXJhUG9zaXRpb24ueSA9IE1hdGgucm91bmQodGhpcy5jYW1lcmFQb3NpdGlvbi55KTtcbiAgICAgICAgdGhpcy5jYW1lcmEuZm9jdXNPblhZKHRoaXMuY2FtZXJhUG9zaXRpb24ueCwgdGhpcy5jYW1lcmFQb3NpdGlvbi55KTtcbiAgICB9XG59IiwiaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2VuZXJpY0hpZ2hsaWdodGVkVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBvbkNoYW5nZU9ic2VydmFibGU6IE9ic2VydmFibGU7XG4gICAgcHJpdmF0ZSBoaWdobGlnaHRlZFRoaW5nOiBUaGluZztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcblxuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKFxuICAgICAgICAgICAgQWN0aW9ucy5DVVJTT1JfT1ZFUl9USElORyxcbiAgICAgICAgICAgIHRoaW5nID0+IHRoaXMub25DdXJzb3JPdmVyVGhpbmcodGhpbmcpXG4gICAgICAgICk7XG5cbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQ1VSU09SX09VVF9USElORyxcbiAgICAgICAgICAgIHRoaW5nID0+IHRoaXMub25DdXJzb3JPdXRUaGluZyh0aGluZylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLmhpZ2hsaWdodGVkVGhpbmcpO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZS5yZW1vdmVPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZ2V0IHRoaW5nKCk6IFRoaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZWRUaGluZztcbiAgICB9XG5cbiAgICBzZXQgdGhpbmcobmV3VGhpbmc6IFRoaW5nKSB7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGhpbmcobmV3VGhpbmcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBoaWdobGlnaHRUaGluZyhuZXdUaGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRlZFRoaW5nID0gbmV3VGhpbmc7XG4gICAgICAgIHRoaXMubm90aWZ5U3Vic2NyaWJlcnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2V0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nKG51bGwpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbkN1cnNvck92ZXJUaGluZyh0aGluZzogVGhpbmcpOiB2b2lkICB7fVxuICAgIHByb3RlY3RlZCBvbkN1cnNvck91dFRoaW5nKHRoaW5nOiBUaGluZyk6IHZvaWQgIHt9XG5cbiAgICBwcml2YXRlIG5vdGlmeVN1YnNjcmliZXJzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnModGhpcy5oaWdobGlnaHRlZFRoaW5nKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUsIElDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzL09ic2VydmFibGUnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcblxuZXhwb3J0IGNsYXNzIEludmVudG9yeSB7XG5cbiAgICBwcml2YXRlIGNoYW5nZU9ic2VydmFibGUgOiBPYnNlcnZhYmxlO1xuICAgIGl0ZW1zOiBTZXQ8VGhpbmc+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjaykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjaykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLnJlbW92ZU9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBhZGQoaXRlbTogVGhpbmcpIHtcbiAgICAgICAgaXRlbS5zdGF0ZS5zZXQoJ0lTX0lOX0lOVkVOVE9SWScsIHRydWUpO1xuICAgICAgICB0aGlzLml0ZW1zLmFkZChpdGVtKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyh0aGlzKTtcbiAgICB9XG5cbiAgICByZW1vdmUoaXRlbTogVGhpbmcpIHtcbiAgICAgICAgdGhpcy5pdGVtcy5kZWxldGUoaXRlbSk7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnModGhpcyk7XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZDogc3RyaW5nKTogVGhpbmcge1xuICAgICAgICBsZXQgaXRlbUFycmF5ID0gQXJyYXkuZnJvbSh0aGlzLml0ZW1zKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpdGVtQXJyYXlbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1BcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IFNlZ21lbnQgfSBmcm9tICcuLi91dGlscy9TZWdtZW50JztcbmltcG9ydCB7IFNjZW5lQm91bmRhcmllcyB9IGZyb20gJy4vU2NlbmVCb3VuZGFyaWVzJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5cbmludGVyZmFjZSBJUGF0aE5vZGVPcHRpb25zIHtcbiAgICBwb2ludDogSVBvaW50LFxuICAgIGZpbmFsTm9kZT86IEJvb2xlYW5cbn1cblxuY2xhc3MgUGF0aE5vZGUge1xuXG4gICAgY29ubmVjdGlvbnM6IEFycmF5PFBhdGhOb2RlPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogSVBhdGhOb2RlT3B0aW9ucykge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zID0gW107XG4gICAgfVxuXG4gICAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucG9pbnQueCArICdfJyArIHRoaXMub3B0aW9ucy5wb2ludC55O1xuICAgIH1cblxuICAgIGdldCBwb2ludCgpOiBJUG9pbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnBvaW50O1xuICAgIH1cblxuICAgIGlzRmluYWwoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMub3B0aW9ucy5maW5hbE5vZGU7XG4gICAgfVxuXG59XG5cbmNvbnN0IFNIT1VMRF9QQUlOVCA9IGZhbHNlO1xuY29uc3QgQ09MT1IgPSAweDAwMzNGRjtcbmNsYXNzIFBhdGhGaW5kZXJQYWludGVyIHtcblxuICAgIHByaXZhdGUgcGFpbnRlZE5vZGVzOiBNYXA8c3RyaW5nLCBCb29sZWFuPjtcblxuICAgIHBhaW50KGZpcnN0Tm9kZTogUGF0aE5vZGUsIGRlc3RpbmF0aW9uOiBJUG9pbnQpOiB2b2lkIHtcbiAgICAgICAgaWYoIVNIT1VMRF9QQUlOVCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVsZXRlQ3VycmVudEdyYXBoaWNzKCk7XG4gICAgICAgIHRoaXMucGFpbnRlZE5vZGVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnBhaW50Tm9kZUFuZENvbm5lY3Rpb25zKGZpcnN0Tm9kZSk7XG4gICAgICAgIGxldCBwb2ludDEgPSBuZXcgUGhhc2VyLkNpcmNsZShmaXJzdE5vZGUucG9pbnQueCwgZmlyc3ROb2RlLnBvaW50LnksIDQpO1xuICAgICAgICBwaGFzZXJHYW1lLnZhbHVlLmRlYnVnLmdlb20ocG9pbnQxLCAnIzAwMDBmZicpO1xuICAgICAgICBsZXQgcG9pbnQyID0gbmV3IFBoYXNlci5DaXJjbGUoZGVzdGluYXRpb24ueCwgZGVzdGluYXRpb24ueSwgNCk7XG4gICAgICAgIHBoYXNlckdhbWUudmFsdWUuZGVidWcuZ2VvbShwb2ludDIsICcjMDBmZjAwJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWxldGVDdXJyZW50R3JhcGhpY3MoKTogdm9pZCB7XG4gICAgICAgIHBoYXNlckdhbWUudmFsdWUuZGVidWcuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFpbnROb2RlQW5kQ29ubmVjdGlvbnMobm9kZTogUGF0aE5vZGUpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5wYWludGVkTm9kZXMuZ2V0KG5vZGUuaWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWludGVkTm9kZXMuc2V0KG5vZGUuaWQsIHRydWUpO1xuICAgICAgICBmb3IobGV0IGk9MDsgaSA8IG5vZGUuY29ubmVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucGFpbnRMaW5lKG5vZGUsIG5vZGUuY29ubmVjdGlvbnNbaV0pXG4gICAgICAgICAgICB0aGlzLnBhaW50Tm9kZUFuZENvbm5lY3Rpb25zKG5vZGUuY29ubmVjdGlvbnNbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYWludExpbmUobm9kZTE6IFBhdGhOb2RlLCBub2RlMjogUGF0aE5vZGUpIHtcbiAgICAgICAgbGV0IGxpbmUgPSBuZXcgUGhhc2VyLkxpbmUobm9kZTEucG9pbnQueCwgbm9kZTEucG9pbnQueSwgbm9kZTIucG9pbnQueCwgbm9kZTIucG9pbnQueSk7XG4gICAgICAgIHBoYXNlckdhbWUudmFsdWUuZGVidWcuZ2VvbShsaW5lLCAnI2ZmMDAwMCcpO1xuICAgIH1cbn1cblxuY29uc3QgcGF0aEZpbmRlclBhaW50ZXIgPSBuZXcgUGF0aEZpbmRlclBhaW50ZXIoKTtcblxuXG5jbGFzcyBQYXRoRmluZGVyIHtcblxuICAgIGdldFBhdGgob3JpZ2luOiBJUG9pbnQsIGRlc3RpbmF0aW9uOiBJUG9pbnQsIGJvdW5kYXJpZXM6IFNjZW5lQm91bmRhcmllcyk6IEFycmF5PElQb2ludD4ge1xuICAgICAgICB2YXIgaW5zaWRlT3JpZ2luID0gYm91bmRhcmllcy5nZXRQb3NpdGlvbkluc2lkZShvcmlnaW4pO1xuICAgICAgICB2YXIgaW5zaWRlRGVzdGluYXRpb24gPSBib3VuZGFyaWVzLmdldFBvc2l0aW9uSW5zaWRlKGRlc3RpbmF0aW9uKTtcblxuICAgICAgICBpZihib3VuZGFyaWVzLnBvbHlnb24ucG9pbnRzQ2FuU2VlRWFjaE90aGVyKGluc2lkZU9yaWdpbiwgaW5zaWRlRGVzdGluYXRpb24pKSB7XG4gICAgICAgICAgICByZXR1cm4gW2luc2lkZU9yaWdpbiwgaW5zaWRlRGVzdGluYXRpb25dO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb25jYXZlVmVydGV4ID0gYm91bmRhcmllcy5wb2x5Z29uLmdldENvbmNhdmVWZXJ0ZXgoKTtcbiAgICAgICAgbGV0IGdyYXBoID0gdGhpcy5nZXRHcmFwaFRvU29sdmUoaW5zaWRlT3JpZ2luLCBkZXN0aW5hdGlvbiwgY29uY2F2ZVZlcnRleCwgYm91bmRhcmllcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U29sdXRpb25Ub0dyYXBoKGdyYXBoLCBkZXN0aW5hdGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRHcmFwaFRvU29sdmUob3JpZ2luOiBJUG9pbnQsIGRlc3RpbmF0aW9uOiBJUG9pbnQsIG90aGVyVmVydGV4OiBBcnJheTxJUG9pbnQ+LCBib3VuZGFyaWVzOiBTY2VuZUJvdW5kYXJpZXMpOiBQYXRoTm9kZSB7XG4gICAgICAgIGxldCBpbml0aWFsTm9kZSA9IG5ldyBQYXRoTm9kZSh7XG4gICAgICAgICAgICBwb2ludDogb3JpZ2luXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZmluYWxOb2RlID0gbmV3IFBhdGhOb2RlKHtcbiAgICAgICAgICAgIHBvaW50OiBkZXN0aW5hdGlvbixcbiAgICAgICAgICAgIGZpbmFsTm9kZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGFsbE5vZGVzID0gW2luaXRpYWxOb2RlLCBmaW5hbE5vZGVdO1xuICAgICAgICBvdGhlclZlcnRleC5mb3JFYWNoKCh2ZXJ0ZXgpID0+IHtcbiAgICAgICAgICAgIGFsbE5vZGVzLnB1c2gobmV3IFBhdGhOb2RlKHtcbiAgICAgICAgICAgICAgICBwb2ludDogdmVydGV4XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBhbGxOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yKGxldCBqID0gaSArIDE7IGogPCBhbGxOb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmKGJvdW5kYXJpZXMucG9seWdvbi5wb2ludHNDYW5TZWVFYWNoT3RoZXIoYWxsTm9kZXNbaV0ucG9pbnQsIGFsbE5vZGVzW2pdLnBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICBhbGxOb2Rlc1tpXS5jb25uZWN0aW9ucy5wdXNoKGFsbE5vZGVzW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgYWxsTm9kZXNbal0uY29ubmVjdGlvbnMucHVzaChhbGxOb2Rlc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluaXRpYWxOb2RlO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGV1cmlzdGljQ29zdChwb2ludDogSVBvaW50LCBkZXN0aW5hdGlvbjogSVBvaW50KTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIChuZXcgU2VnbWVudChwb2ludCwgZGVzdGluYXRpb24pKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWFsQ29zdChwb2ludDogSVBvaW50LCBkZXN0aW5hdGlvbjogSVBvaW50KTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIChuZXcgU2VnbWVudChwb2ludCwgZGVzdGluYXRpb24pKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy9odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BKl9zZWFyY2hfYWxnb3JpdGhtI0FsZ29yaXRobV9kZXNjcmlwdGlvblxuICAgIHByaXZhdGUgZ2V0U29sdXRpb25Ub0dyYXBoKGZpcnN0Tm9kZTogUGF0aE5vZGUsIGRlc3RpbmF0aW9uOiBJUG9pbnQpOiBBcnJheTxJUG9pbnQ+IHtcbiAgICAgICAgcGF0aEZpbmRlclBhaW50ZXIucGFpbnQoZmlyc3ROb2RlLCBkZXN0aW5hdGlvbik7XG4gICAgICAgIGxldCBjbG9zZWRTZXQ6IFNldDxQYXRoTm9kZT4gPSBuZXcgU2V0KCk7XG4gICAgICAgIGxldCBvcGVuU2V0OiBTZXQ8UGF0aE5vZGU+ID0gbmV3IFNldCgpO1xuICAgICAgICBvcGVuU2V0LmFkZChmaXJzdE5vZGUpO1xuXG4gICAgICAgIC8vIEZvciBlYWNoIG5vZGUsIHdoaWNoIG5vZGUgaXQgY2FuIG1vc3QgZWZmaWNpZW50bHkgYmUgcmVhY2hlZCBmcm9tLlxuICAgICAgICAvLyBJZiBhIG5vZGUgY2FuIGJlIHJlYWNoZWQgZnJvbSBtYW55IG5vZGVzLCBjYW1lRnJvbSB3aWxsIGV2ZW50dWFsbHkgY29udGFpbiB0aGVcbiAgICAgICAgLy8gbW9zdCBlZmZpY2llbnQgcHJldmlvdXMgc3RlcC5cbiAgICAgICAgbGV0IGNhbWVGcm9tOiBNYXA8UGF0aE5vZGUsIFBhdGhOb2RlPiA9IG5ldyBNYXAoKTtcblxuICAgICAgICAvLyBGb3IgZWFjaCBub2RlLCB0aGUgY29zdCBvZiBnZXR0aW5nIGZyb20gdGhlIHN0YXJ0IG5vZGUgdG8gdGhhdCBub2RlLlxuICAgICAgICBsZXQgZ1Njb3JlOiBNYXA8UGF0aE5vZGUsIG51bWJlcj4gPSBuZXcgTWFwOyAvLyBkZWZhdWx0IHZhbHVlIG9mIEluZmluaXR5XG4gICAgICAgIGdTY29yZS5zZXQoZmlyc3ROb2RlLCAwKTsgLy8gVGhlIGNvc3Qgb2YgZ29pbmcgZnJvbSBzdGFydCB0byBzdGFydCBpcyB6ZXJvLlxuXG4gICAgICAgIC8vIEZvciBlYWNoIG5vZGUsIHRoZSB0b3RhbCBjb3N0IG9mIGdldHRpbmcgZnJvbSB0aGUgc3RhcnQgbm9kZSB0byB0aGUgZ29hbFxuICAgICAgICAvLyBieSBwYXNzaW5nIGJ5IHRoYXQgbm9kZS4gVGhhdCB2YWx1ZSBpcyBwYXJ0bHkga25vd24sIHBhcnRseSBoZXVyaXN0aWMuXG4gICAgICAgIGxldCBmU2NvcmU6IE1hcDxQYXRoTm9kZSwgbnVtYmVyPiA9IG5ldyBNYXA7IC8vIGRlZmF1bHQgdmFsdWUgb2YgSW5maW5pdHlcbiAgICAgICAgZlNjb3JlLnNldChmaXJzdE5vZGUsIHRoaXMuaGV1cmlzdGljQ29zdChmaXJzdE5vZGUucG9pbnQsIGRlc3RpbmF0aW9uKSk7XG5cbiAgICAgICAgd2hpbGUob3BlblNldC5zaXplID4gMCkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ6IFBhdGhOb2RlID0gdGhpcy5maW5kTG93ZXN0U2NvcmUoZlNjb3JlLCBvcGVuU2V0KTtcbiAgICAgICAgICAgIGlmKGN1cnJlbnQuaXNGaW5hbCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVjb25zdHJ1Y3RQYXRoKGNhbWVGcm9tLCBjdXJyZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3BlblNldC5kZWxldGUoY3VycmVudCk7XG4gICAgICAgICAgICBjbG9zZWRTZXQuYWRkKGN1cnJlbnQpO1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGN1cnJlbnQuY29ubmVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbmVpZ2hib3IgPSBjdXJyZW50LmNvbm5lY3Rpb25zW2ldO1xuICAgICAgICAgICAgICAgIGlmKGNsb3NlZFNldC5oYXMobmVpZ2hib3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgdGVudGF0aXZlR1Njb3JlID0gdGhpcy5nZXRHU2NvcmUoZ1Njb3JlLCBjdXJyZW50KSArIHRoaXMucmVhbENvc3QoY3VycmVudC5wb2ludCwgbmVpZ2hib3IucG9pbnQpO1xuICAgICAgICAgICAgICAgIGlmKCFvcGVuU2V0LmhhcyhuZWlnaGJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlblNldC5hZGQobmVpZ2hib3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZih0ZW50YXRpdmVHU2NvcmUgPj0gdGhpcy5nZXRHU2NvcmUoZ1Njb3JlLCBuZWlnaGJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIFRoaXMgaXMgbm90IGEgYmV0dGVyIHBhdGguXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFRoaXMgcGF0aCBpcyB0aGUgYmVzdCB1bnRpbCBub3cuIFJlY29yZCBpdCFcbiAgICAgICAgICAgICAgICBjYW1lRnJvbS5zZXQobmVpZ2hib3IsIGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgIGdTY29yZS5zZXQobmVpZ2hib3IsIHRlbnRhdGl2ZUdTY29yZSk7XG4gICAgICAgICAgICAgICAgbGV0IG5ld0ZTY29yZSA9IHRoaXMuZ2V0R1Njb3JlKGdTY29yZSwgbmVpZ2hib3IpICsgdGhpcy5oZXVyaXN0aWNDb3N0KG5laWdoYm9yLnBvaW50LCBkZXN0aW5hdGlvbik7XG4gICAgICAgICAgICAgICAgZlNjb3JlLnNldChuZWlnaGJvciwgbmV3RlNjb3JlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyAnRVJST1IsIGNvdWxkIG5vdCBmaW5kIGEgcGF0aCc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRHU2NvcmUoZ1Njb3JlOiBNYXA8UGF0aE5vZGUsIG51bWJlcj4sIG5vZGU6IFBhdGhOb2RlKTogbnVtYmVyIHtcbiAgICAgICAgaWYoZ1Njb3JlLmhhcyhub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGdTY29yZS5nZXQobm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gSW5maW5pdHk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRMb3dlc3RTY29yZShzY29yZXM6IE1hcDxQYXRoTm9kZSwgbnVtYmVyPiwgb3BlblNldDogU2V0PFBhdGhOb2RlPikge1xuICAgICAgICBsZXQgbG93ZXN0U2NvcmU6IG51bWJlciwgbG93ZXN0Tm9kZTogUGF0aE5vZGU7XG4gICAgICAgIGxldCBhbHJlYWR5SGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgc2NvcmVzLmZvckVhY2goKHZhbHVlLCBub2RlKSA9PiB7XG4gICAgICAgICAgICBpZihvcGVuU2V0Lmhhcyhub2RlKSkge1xuICAgICAgICAgICAgICAgIGlmKCFhbHJlYWR5SGFzVmFsdWUgfHwgKHZhbHVlIDwgbG93ZXN0U2NvcmUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHlIYXNWYWx1ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGxvd2VzdFNjb3JlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGxvd2VzdE5vZGUgPSBub2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGxvd2VzdE5vZGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWNvbnN0cnVjdFBhdGgoY2FtZUZyb206IE1hcDxQYXRoTm9kZSwgUGF0aE5vZGU+LCBjdXJyZW50OiBQYXRoTm9kZSk6IEFycmF5PElQb2ludD4ge1xuICAgICAgICBsZXQgdG90YWxQYXRoID0gW2N1cnJlbnQucG9pbnRdO1xuXG4gICAgICAgIHdoaWxlKGNhbWVGcm9tLmhhcyhjdXJyZW50KSkge1xuICAgICAgICAgICAgY3VycmVudCA9IGNhbWVGcm9tLmdldChjdXJyZW50KTtcbiAgICAgICAgICAgIHRvdGFsUGF0aC5wdXNoKGN1cnJlbnQucG9pbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvdGFsUGF0aC5yZXZlcnNlKCk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBjb25zdCBwYXRoRmluZGVyID0gbmV3IFBhdGhGaW5kZXIoKTtcbiIsImltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4vSW52ZW50b3J5JztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5pbXBvcnQgeyBQbGF5ZXJNb3ZlbWVudEhhbmRsZXIgfSBmcm9tICcuL1BsYXllck1vdmVtZW50SGFuZGxlcic7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4uL3VpL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBJUG9pbnQsIElTcHJpdGVJbmZvIH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBEaXJlY3Rpb25zLCBnZXREaXJlY3Rpb25OYW1lIH0gZnJvbSAnLi4vdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyBTcGVlY2hCdWJibGUgfSBmcm9tICcuLi91aS9TcGVlY2hCdWJibGUnO1xuXG5pbnRlcmZhY2UgSVBsYXllck9wdGlvbnMge1xuICAgIHNwcml0ZUlkOiBzdHJpbmcsXG4gICAgaW5pdGlhbFg6IG51bWJlcixcbiAgICBpbml0aWFsWTogbnVtYmVyLFxuICAgIHhTcGVlZDogbnVtYmVyLCAvL3B4L3NcbiAgICB5U3BlZWQ6IG51bWJlciwgLy9weC9zXG4gICAgYW5pbWF0aW9uU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGVPcHRpb25zOiBNYXA8c3RyaW5nLCBJU3ByaXRlSW5mbz47XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQbGF5ZXIge1xuXG4gICAgaW52ZW50b3J5OiBJbnZlbnRvcnk7XG5cbiAgICBwcml2YXRlIF9zcHJpdGU6IFBoYXNlci5TcHJpdGU7XG4gICAgcHJpdmF0ZSBfZGlyZWN0aW9uOiBEaXJlY3Rpb25zO1xuICAgIHByaXZhdGUgc3BlZWNoQnViYmxlOiBTcGVlY2hCdWJibGU7XG4gICAgcHJpdmF0ZSBfc3RhdGU6IE1hcDxzdHJpbmcsIGFueT47XG4gICAgcHJpdmF0ZSBtb3ZlbWVudEhhbmRsZXI6IFBsYXllck1vdmVtZW50SGFuZGxlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9ucyA6IElQbGF5ZXJPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuaW52ZW50b3J5ID0gbmV3IEludmVudG9yeSgpO1xuICAgICAgICB0aGlzLm1vdmVtZW50SGFuZGxlciA9IG5ldyBQbGF5ZXJNb3ZlbWVudEhhbmRsZXIodGhpcyk7XG4gICAgICAgIHRoaXMuY3JlYXRlU3ByaXRlKCk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9ucy5SSUdIVDtcbiAgICAgICAgdGhpcy5wbGF5U3RhbmRBbmltYXRpb24oKTtcbiAgICAgICAgdGhpcy5zcGVlY2hCdWJibGUgPSBuZXcgU3BlZWNoQnViYmxlKHtcbiAgICAgICAgICAgIG93bmVyOiB0aGlzXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IG5ldyBNYXAoKTtcbiAgICB9XG5cbiAgICBtb3ZlVG8oZGVzdGluYXRpb246IElQb2ludCk6IFByb21pc2U8e30+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW92ZW1lbnRIYW5kbGVyLm1vdmVUbyhkZXN0aW5hdGlvbik7XG4gICAgfVxuXG4gICAgZ2V0IHNwcml0ZSgpOiBQaGFzZXIuU3ByaXRlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Nwcml0ZTtcbiAgICB9XG5cbiAgICBnZXQgc3BlZWQoKTogSVBvaW50IHtcbiAgICAgICAgbGV0IHNwZWVkID0ge1xuICAgICAgICAgICAgeDogdGhpcy5vcHRpb25zLnhTcGVlZCxcbiAgICAgICAgICAgIHk6IHRoaXMub3B0aW9ucy55U3BlZWQsXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwZWVkO1xuICAgIH1cblxuICAgIGdldCBkaXJlY3Rpb24oKTogRGlyZWN0aW9ucyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb247XG4gICAgfVxuXG4gICAgc2V0IGRpcmVjdGlvbihuZXdEaXJlY3Rpb246IERpcmVjdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gbmV3RGlyZWN0aW9uO1xuICAgIH1cblxuICAgIGdldCBwb3NpdGlvbigpOiBJUG9pbnQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5fc3ByaXRlLngsXG4gICAgICAgICAgICB5OiB0aGlzLl9zcHJpdGUueVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdvVG9UaGluZyh0aGluZzogVGhpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW92ZVRvKHRoaW5nLmdldFBvc2l0aW9uVG9Hb1RvKCkpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gdGhpbmcuZ2V0RGlyZWN0aW9uVG9Mb29rKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb29rQXQoZGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvb2tBdChkaXJlY3Rpb246IERpcmVjdGlvbnMpIHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIHRoaXMucGxheVN0YW5kQW5pbWF0aW9uKCk7XG4gICAgfVxuXG4gICAgc2F5KHRleHQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnBsYXlUYWxraW5nQW5pbWF0aW9uKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNwZWVjaEJ1YmJsZS5zYXkodGV4dCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0b3BUYWxraW5nQW5pbWF0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9uT25Ub3AoKTogSVBvaW50e1xuICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy5zcHJpdGUueCxcbiAgICAgICAgICAgIHk6IE1hdGgucm91bmQodGhpcy5zcHJpdGUuZ2V0Qm91bmRzKCkueSkgLSAxMFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFkZE9iamVjdFRvSW52ZW50b3J5KHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQodGhpbmcpO1xuICAgIH1cblxuICAgIHRlbGVwb3J0VG8oZGVzdGluYXRpb246IElQb2ludCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1vdmVtZW50SGFuZGxlci5tb3ZlVG9XaXRob3V0QW5pbWF0aW9uKGRlc3RpbmF0aW9uKTtcbiAgICB9XG5cbiAgICBnZXQgc3RhdGUoKTogTWFwPHN0cmluZywgYW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICB9XG5cbiAgICBzZXQgc3RhdGUobmV3U3RhdGU6IE1hcDxzdHJpbmcsIGFueT4pe1xuICAgICAgICBpZiAobmV3U3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYW5nZUF0dHIoYXR0ck5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9zdGF0ZS5zZXQoYXR0ck5hbWUsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5vblN0YXRlQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgZ2V0QXR0cihhdHRyTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZS5nZXQoYXR0ck5hbWUpO1xuICAgIH1cblxuICAgIHBsYXlXYWxraW5nQW5pbWF0aW9uKCk6IHZvaWQge1xuICAgICAgICBsZXQgZGlyZWN0aW9uTmFtZSA9IGdldERpcmVjdGlvbk5hbWUodGhpcy5kaXJlY3Rpb24pO1xuICAgICAgICBsZXQgc3ByaXRlU3RhdGUgPSAnd2Fsa18nICsgZGlyZWN0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5fc3ByaXRlLmFuaW1hdGlvbnMucGxheShzcHJpdGVTdGF0ZSk7XG4gICAgICAgIHRoaXMuZmxpcFhJZk5lZWRlZChzcHJpdGVTdGF0ZSk7XG4gICAgfVxuXG4gICAgcGxheVN0YW5kQW5pbWF0aW9uKCk6IHZvaWQge1xuICAgICAgICBsZXQgZGlyZWN0aW9uTmFtZSA9IGdldERpcmVjdGlvbk5hbWUodGhpcy5kaXJlY3Rpb24pO1xuICAgICAgICBsZXQgc3ByaXRlU3RhdGUgPSAnc3RhbmRfJyArIGRpcmVjdGlvbk5hbWU7XG4gICAgICAgIHRoaXMuX3Nwcml0ZS5hbmltYXRpb25zLnBsYXkoc3ByaXRlU3RhdGUpO1xuICAgICAgICB0aGlzLmZsaXBYSWZOZWVkZWQoc3ByaXRlU3RhdGUpO1xuICAgIH1cblxuICAgIHVwZGF0ZU9uVHdlZW5Nb3ZlKCk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLnNwZWVjaEJ1YmJsZS5pc1Nob3duKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc3BlZWNoQnViYmxlLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdG9wQW5pbWF0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wbGF5U3RhbmRBbmltYXRpb24oKTtcbiAgICAgICAgdGhpcy5fc3ByaXRlLmFuaW1hdGlvbnMuc3RvcCgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpcmVjdGlvbihkZXN0aW5hdGlvbjogSVBvaW50KTogdm9pZCB7XG4gICAgICAgIGxldCBhbmdsZUJldHdlZW4gPSB0aGlzLmdldEFuZ2xlVG9EZXNpcmVkUG9zaXRpb24oZGVzdGluYXRpb24pO1xuICAgICAgICBsZXQgYW5nbGVEZWdyZWVzID0gKGFuZ2xlQmV0d2VlbiAqIDE4MCAvIE1hdGguUEkpO1xuXG4gICAgICAgIGlmICgoYW5nbGVEZWdyZWVzID49IC00NSkgJiYgKGFuZ2xlRGVncmVlcyA8PSA0NSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9ucy5MRUZUO1xuICAgICAgICB9IGVsc2UgaWYgKChhbmdsZURlZ3JlZXMgPj0gNDUpICYmIChhbmdsZURlZ3JlZXMgPD0gMTM1KSkge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBEaXJlY3Rpb25zLlVQO1xuICAgICAgICB9IGVsc2UgaWYgKChhbmdsZURlZ3JlZXMgPj0gLTEzNSkgJiYgKGFuZ2xlRGVncmVlcyA8PSAtNDUpKSB7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERpcmVjdGlvbnMuRE9XTjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9ucy5SSUdIVDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEFuZ2xlVG9EZXNpcmVkUG9zaXRpb24oZGVzdGluYXRpb246IElQb2ludCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMuc3ByaXRlLnkgLSBkZXN0aW5hdGlvbi55LFxuICAgICAgICAgICAgdGhpcy5zcHJpdGUueCAtIGRlc3RpbmF0aW9uLngpO1xuICAgIH1cblxuICAgIGFic3RyYWN0IHJlZmxlY3QoKTogdm9pZFxuXG4gICAgLy9UaGlzIG1ldGhvZCBjYW4gYmUgb3ZlcndyaXR0ZW4gaW4gY2hpbGQgY2xhc3Nlc1xuICAgIHByb3RlY3RlZCBvblN0YXRlQ2hhbmdlKCkge31cblxuICAgIHByaXZhdGUgY3JlYXRlU3ByaXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9zcHJpdGUgPSB1aUxheWVycy5wbGF5ZXIuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmluaXRpYWxYLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmluaXRpYWxZLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNwcml0ZUlkXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX3Nwcml0ZS5hbmNob3Iuc2V0VG8oMC41LCAwLjk5KTtcbiAgICAgICAgdWlMYXllcnMucGxheWVyLnNvcnQoJ3onLCBQaGFzZXIuR3JvdXAuU09SVF9BU0NFTkRJTkcpO1xuICAgICAgICB0aGlzLmFkZFNwcml0ZUFuaW1hdGlvbnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFNwcml0ZUFuaW1hdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zcHJpdGVPcHRpb25zLmZvckVhY2goIChzcHJpdGVQb3NpdGlvbiwga2V5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUuYW5pbWF0aW9ucy5hZGQoa2V5LCBzcHJpdGVQb3NpdGlvbi5mcmFtZXMsIHRoaXMub3B0aW9ucy5hbmltYXRpb25TcGVlZCwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGxheVRhbGtpbmdBbmltYXRpb24oKTogdm9pZCB7XG4gICAgICAgIGxldCBkaXJlY3Rpb25OYW1lID0gZ2V0RGlyZWN0aW9uTmFtZSh0aGlzLmRpcmVjdGlvbik7XG4gICAgICAgIGxldCBzcHJpdGVTdGF0ZSA9ICd0YWxrXycgKyBkaXJlY3Rpb25OYW1lO1xuICAgICAgICB0aGlzLl9zcHJpdGUuYW5pbWF0aW9ucy5wbGF5KHNwcml0ZVN0YXRlKTtcbiAgICAgICAgdGhpcy5mbGlwWElmTmVlZGVkKHNwcml0ZVN0YXRlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0b3BUYWxraW5nQW5pbWF0aW9uKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fc3ByaXRlLmFuaW1hdGlvbnMgJiZcbiAgICAgICAgICAgIHRoaXMuX3Nwcml0ZS5hbmltYXRpb25zLm5hbWUgJiZcbiAgICAgICAgICAgICh0aGlzLl9zcHJpdGUuYW5pbWF0aW9ucy5uYW1lLmluZGV4T2YoJ3RhbGsnKSA9PT0gMCkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZmxpcFhJZk5lZWRlZChzcHJpdGVTdGF0ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGxldCBzcHJpdGVTdGF0ZU9wdGlvbnMgPSB0aGlzLm9wdGlvbnMuc3ByaXRlT3B0aW9ucy5nZXQoc3ByaXRlU3RhdGUpO1xuICAgICAgICBpZiAoc3ByaXRlU3RhdGVPcHRpb25zICYmIHNwcml0ZVN0YXRlT3B0aW9ucy5pbnZlcnNlKSB7XG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUuc2NhbGUueCA9IC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc3ByaXRlLnNjYWxlLnggPSAxO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgeyBJUG9pbnQsIElUaW1lb3V0V2l0aFByb21pc2UgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBEaXJlY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyBzY2VuZXMgfSBmcm9tICcuLi9zdGF0ZS9TY2VuZXMuc2luZ2xldG9uJztcbmltcG9ydCB7IHBhdGhGaW5kZXIgfSBmcm9tICcuL1BhdGhGaW5kZXInO1xuXG5cbmNsYXNzIFNpbmdsZU1vdmUge1xuXG4gICAgcHJpdmF0ZSB0d2VlbjogUGhhc2VyLlR3ZWVuO1xuICAgIHByaXZhdGUgd2lsbE1vdmVQcm9taXNlOiBJVGltZW91dFdpdGhQcm9taXNlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwbGF5ZXI6IFBsYXllciwgcHJpdmF0ZSBkZXN0aW5hdGlvbjogSVBvaW50KSB7XG4gICAgICAgIGxldCB0aW1lVG9BbmltYXRlID0gdGhpcy5nZXRUaW1lRm9yQW5pbWF0aW9uKGRlc3RpbmF0aW9uKTtcblxuICAgICAgICBpZiAodGltZVRvQW5pbWF0ZSkge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXIudXBkYXRlRGlyZWN0aW9uKGRlc3RpbmF0aW9uKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnBsYXlXYWxraW5nQW5pbWF0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLnR3ZWVuID0gcGhhc2VyR2FtZS52YWx1ZS5hZGQudHdlZW4odGhpcy5wbGF5ZXIuc3ByaXRlKTtcbiAgICAgICAgICAgIHRoaXMudHdlZW4udG8oeyB4OiBkZXN0aW5hdGlvbi54LCB5OiBkZXN0aW5hdGlvbi55IH0sIHRpbWVUb0FuaW1hdGUsICdMaW5lYXInLCB0cnVlLCAwKTtcbiAgICAgICAgICAgIHRoaXMudHdlZW4ub25VcGRhdGVDYWxsYmFjayh0aGlzLnBsYXllci51cGRhdGVPblR3ZWVuTW92ZSwgdGhpcy5wbGF5ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53aWxsTW92ZVByb21pc2UgPSB0aGlzLmNyZWF0ZU1vdmVQcm9taXNlKHRpbWVUb0FuaW1hdGUpO1xuICAgIH1cblxuICAgIHdoZW5GaW5pc2hlZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2lsbE1vdmVQcm9taXNlLnByb21pc2U7XG4gICAgfVxuXG4gICAgY2FuY2VsKCkge1xuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmNhbmNlbEN1cnJlbnRUd2VlbigpO1xuICAgICAgICB0aGlzLmNhbmNlbEN1cnJlbnRNb3ZlUHJvbWlzZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTW92ZVByb21pc2UodGltZVRvTW92ZTogbnVtYmVyID0gMCk6IElUaW1lb3V0V2l0aFByb21pc2Uge1xuICAgICAgICB2YXIgcmVzdWx0OiBJVGltZW91dFdpdGhQcm9taXNlID0ge1xuICAgICAgICAgICAgdGltZW91dElkOiBudWxsLFxuICAgICAgICAgICAgcHJvbWlzZTogbnVsbCxcbiAgICAgICAgICAgIHJlc29sdmVDYWxsYmFjazogbnVsbCxcbiAgICAgICAgICAgIHJlamVjdENhbGxiYWNrOiBudWxsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzdWx0LnRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5yZXNvbHZlTW92ZVByb21pc2UoKSxcbiAgICAgICAgICAgIHRpbWVUb01vdmUpO1xuXG4gICAgICAgIHJlc3VsdC5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgcmVzdWx0LnJlc29sdmVDYWxsYmFjayA9IHJlc29sdmU7XG4gICAgICAgICAgICByZXN1bHQucmVqZWN0Q2FsbGJhY2sgPSByZWplY3Q7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNvbHZlTW92ZVByb21pc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLndpbGxNb3ZlUHJvbWlzZSkge1xuICAgICAgICAgICAgdGhpcy53aWxsTW92ZVByb21pc2UucmVzb2x2ZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICB0aGlzLndpbGxNb3ZlUHJvbWlzZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbmNlbEN1cnJlbnRNb3ZlUHJvbWlzZSgpIHtcbiAgICAgICAgaWYgKHRoaXMud2lsbE1vdmVQcm9taXNlKSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMud2lsbE1vdmVQcm9taXNlLnRpbWVvdXRJZCk7XG4gICAgICAgICAgICAvLyBXZSBjb3VsZCByZWplY3QgdGhlIHByb21pc2UgbGlrZSB0aGlzLCBidXQgdGhlcmUgaXMgbm8gbmVlZFxuICAgICAgICAgICAgLy8gdGhpcy53aWxsTW92ZVByb21pc2UucmVqZWN0Q2FsbGJhY2soKTtcbiAgICAgICAgICAgIHRoaXMud2lsbE1vdmVQcm9taXNlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2FuY2VsQ3VycmVudFR3ZWVuKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50d2VlbiAmJiB0aGlzLnR3ZWVuLmlzUnVubmluZykge1xuICAgICAgICAgICAgdGhpcy50d2Vlbi5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLnR3ZWVuLm9uQ29tcGxldGUucmVtb3ZlQWxsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRpbWVGb3JBbmltYXRpb24oZGVzdGluYXRpb246IElQb2ludCk6IG51bWJlciB7XG4gICAgICAgIGxldCBhbmdsZUJldHdlZW4gPSB0aGlzLnBsYXllci5nZXRBbmdsZVRvRGVzaXJlZFBvc2l0aW9uKGRlc3RpbmF0aW9uKTtcbiAgICAgICAgbGV0IGRpZmYxID0gdGhpcy5wbGF5ZXIuc3ByaXRlLnggLSBkZXN0aW5hdGlvbi54O1xuICAgICAgICBsZXQgZGlmZjIgPSB0aGlzLnBsYXllci5zcHJpdGUueSAtIGRlc3RpbmF0aW9uLnk7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydCgoZGlmZjEgKiBkaWZmMSkgKyAoZGlmZjIgKiBkaWZmMikpO1xuICAgICAgICBsZXQgc3BlZWRGcm9tWCA9IE1hdGguYWJzKE1hdGguY29zKGFuZ2xlQmV0d2VlbikpICogZGlzdGFuY2UgLyB0aGlzLnBsYXllci5zcGVlZC54O1xuICAgICAgICBsZXQgc3BlZWRGcm9tWSA9IE1hdGguYWJzKE1hdGguc2luKGFuZ2xlQmV0d2VlbikpICogZGlzdGFuY2UgLyB0aGlzLnBsYXllci5zcGVlZC55O1xuXG4gICAgICAgIHJldHVybiAxMDAwICogKChzcGVlZEZyb21YICsgc3BlZWRGcm9tWSkgLyAyKTtcbiAgICB9XG5cbn1cblxuXG5leHBvcnQgY2xhc3MgUGxheWVyTW92ZW1lbnRIYW5kbGVyIHtcblxuICAgIHByaXZhdGUgY3VycmVudFBhdGg6IEFycmF5PElQb2ludD47XG4gICAgcHJpdmF0ZSBjdXJyZW50U2luZ2xlTW92ZTogU2luZ2xlTW92ZTtcbiAgICBwcml2YXRlIHJlc29sdmVQcm9taXNlQ2FsbGJhY2s6ICgpPT52b2lkO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwbGF5ZXI6IFBsYXllcikge31cblxuICAgIG1vdmVUbyhkZXN0aW5hdGlvbjogSVBvaW50KTogUHJvbWlzZTx7fT4ge1xuXG4gICAgICAgIHRoaXMuY2FuY2VsQ3VycmVudE1vdmUoKTtcblxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZVByb21pc2VDYWxsYmFjayA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBwYXRoRmluZGVyLmdldFBhdGgodGhpcy5wbGF5ZXIucG9zaXRpb24sIGRlc3RpbmF0aW9uLCBzY2VuZXMuY3VycmVudFNjZW5lLmJvdW5kYXJpZXMpO1xuICAgICAgICB0aGlzLmdvVG9OZXh0UG9zaXRpb24oKTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgZ29Ub05leHRQb3NpdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50UGF0aCAmJiB0aGlzLmN1cnJlbnRQYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2luZ2xlTW92ZSA9IG5ldyBTaW5nbGVNb3ZlKHRoaXMucGxheWVyLCB0aGlzLmN1cnJlbnRQYXRoLnNoaWZ0KCkpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2luZ2xlTW92ZS53aGVuRmluaXNoZWQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmdvVG9OZXh0UG9zaXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy5yZXNvbHZlUHJvbWlzZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcEFuaW1hdGlvbnMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVQcm9taXNlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdmVUb1dpdGhvdXRBbmltYXRpb24oZGVzdGluYXRpb246IElQb2ludCk6IHZvaWQge1xuICAgICAgICBsZXQgc2FmZVBvc2l0aW9uID0gc2NlbmVzLmN1cnJlbnRTY2VuZS5ib3VuZGFyaWVzLmdldFBvc2l0aW9uSW5zaWRlKGRlc3RpbmF0aW9uKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIudXBkYXRlRGlyZWN0aW9uKHNhZmVQb3NpdGlvbik7XG4gICAgICAgIHRoaXMuY2FuY2VsQ3VycmVudE1vdmUoKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIucGxheVN0YW5kQW5pbWF0aW9uKCk7XG4gICAgICAgIHRoaXMucGxheWVyLnNwcml0ZS54ID0gc2FmZVBvc2l0aW9uLng7XG4gICAgICAgIHRoaXMucGxheWVyLnNwcml0ZS55ID0gc2FmZVBvc2l0aW9uLnk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGNhbmNlbEN1cnJlbnRNb3ZlKCkge1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRTaW5nbGVNb3ZlKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXllci5zdG9wQW5pbWF0aW9ucygpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2luZ2xlTW92ZS5jYW5jZWwoKTtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZVByb21pc2VDYWxsYmFjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4uL3VpL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBJUmVjdGFuZ2xlLCBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IFBvbHlnb24gfSBmcm9tICcuLi91dGlscy9Qb2x5Z29uJztcbmltcG9ydCB7IFNjZW5lQm91bmRhcmllcyB9IGZyb20gJy4vU2NlbmVCb3VuZGFyaWVzJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgeyBEb29yIH0gZnJvbSAnLi9Eb29yJztcblxuXG5pbnRlcmZhY2UgSVNjZW5lT3B0aW9ucyB7XG4gICAgaWQ6IHN0cmluZyxcbiAgICBiYWNrZ3JvdW5kSWQ6IHN0cmluZyxcbiAgICBib3VuZGFyaWVzQ29uZmlnOiBQb2x5Z29uLFxuICAgIHRoaW5nczogQXJyYXk8VGhpbmc+XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTY2VuZSB7XG5cbiAgICBwcml2YXRlIGJhY2tncm91bmQ6IFBoYXNlci5TcHJpdGU7XG4gICAgcHJpdmF0ZSBfYm91bmRhcmllczogU2NlbmVCb3VuZGFyaWVzO1xuICAgIHByaXZhdGUgdGhpbmdzOiBTZXQ8VGhpbmc+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJU2NlbmVPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX2JvdW5kYXJpZXMgPSBuZXcgU2NlbmVCb3VuZGFyaWVzKG9wdGlvbnMuYm91bmRhcmllc0NvbmZpZyk7XG4gICAgICAgIHRoaXMuY3JlYXRlVGhpbmdzKCk7XG4gICAgfVxuXG4gICAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuaWQ7XG4gICAgfVxuXG4gICAgZ2V0IHNjZW5lQm91bmRzKCk6IElSZWN0YW5nbGUge1xuICAgICAgICByZXR1cm4gdGhpcy5iYWNrZ3JvdW5kLmdldEJvdW5kcygpO1xuICAgIH1cblxuICAgIGdldCBib3VuZGFyaWVzKCk6IFNjZW5lQm91bmRhcmllcyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ib3VuZGFyaWVzO1xuICAgIH1cblxuICAgIHNob3coKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3JlYXRlQmFja2dyb3VuZCgpO1xuICAgICAgICB0aGlzLnRoaW5ncy5mb3JFYWNoKHRoaW5nID0+IHRoaW5nLnNob3coKSk7XG4gICAgICAgIHRoaXMuX2JvdW5kYXJpZXMucGFpbnQoKTtcbiAgICB9XG5cbiAgICByZW1vdmVPYmplY3Qob2JqZWN0VG9SZW1vdmU6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGhpbmdzLmRlbGV0ZShvYmplY3RUb1JlbW92ZSk7XG4gICAgICAgIG9iamVjdFRvUmVtb3ZlLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBwbGF5ZXJBcnJpdmVzQXREb29yKHBsYXllcjogUGxheWVyLCBkb29ySWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsZXQgZG9vciA9IHRoaXMuZmluZERvb3IoZG9vcklkKTtcbiAgICAgICAgZG9vci5mb3JjZU9wZW4oKTtcbiAgICAgICAgcGxheWVyLnRlbGVwb3J0VG8oZG9vci5nZXRQb3NpdGlvblRvR29UbygpKTtcbiAgICB9XG5cbiAgICBnZXRUaGluZ0J5SWQodGhpbmdJZDogc3RyaW5nKTogVGhpbmcge1xuICAgICAgICB2YXIgZm91bmRUaGluZzogVGhpbmcgPSBudWxsO1xuICAgICAgICB0aGlzLnRoaW5ncy5mb3JFYWNoKCh0aGluZykgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaW5nLmlkID09PSB0aGluZ0lkKSB7XG4gICAgICAgICAgICAgICAgZm91bmRUaGluZyA9IHRoaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZvdW5kVGhpbmc7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy50aGluZ3MuZm9yRWFjaCh0aGluZyA9PiB0aGluZy5kZXN0cm95KCkpO1xuICAgICAgICB0aGlzLl9ib3VuZGFyaWVzLnVucGFpbnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJhY2tncm91bmQoKSB7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IHVpTGF5ZXJzLmJhY2tncm91bmQuY3JlYXRlKDAsIDAsIHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kSWQpO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQuYW5jaG9yLnNldCgwLCAwKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5ldmVudHMub25JbnB1dERvd24uYWRkKCAoZGVzdDogYW55LCBldjogYW55KSA9PiB7XG4gICAgICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5DTElDS19TVEFHRSwgZXYpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlVGhpbmdzKCkge1xuICAgICAgICB0aGlzLnRoaW5ncyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLnRoaW5ncy5mb3JFYWNoKCh0aGluZykgPT4gdGhpcy50aGluZ3MuYWRkKHRoaW5nKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kRG9vcihkb29ySWQ6IHN0cmluZyk6IERvb3Ige1xuICAgICAgICBmb3IgKGxldCB0aGluZyBvZiB0aGlzLnRoaW5ncykge1xuICAgICAgICAgICAgaWYgKHRoaW5nLmlkID09PSBkb29ySWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gPERvb3I+dGhpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgJ0VSUk9SOiBjb3VsZCBub3QgZmluZCB0aGUgcmVsYXRlZCBkb29yLic7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQb2x5Z29uIH0gZnJvbSAnLi4vdXRpbHMvUG9seWdvbic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuXG5cbmNvbnN0IFNIT1VMRF9QQUlOVCA9IGZhbHNlO1xuXG5leHBvcnQgY2xhc3MgU2NlbmVCb3VuZGFyaWVzIHtcblxuICAgIHByaXZhdGUgZ3JhcGhpY3M6IFBoYXNlci5HcmFwaGljcztcbiAgICBwcml2YXRlIGJvdW5kaW5nR3JhcGhpY3M6IFBoYXNlci5HcmFwaGljcztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBQb2x5Z29uKSB7fVxuXG4gICAgZ2V0UG9zaXRpb25JbnNpZGUocG9pbnQ6IElQb2ludCk6IElQb2ludCB7XG4gICAgICAgIGlmKHRoaXMucG9seWdvbi5pc1BvaW50SW5zaWRlKHBvaW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnBvbHlnb24uZ2V0Q2xvc2VzdFBvaW50VG8ocG9pbnQpO1xuICAgIH1cblxuICAgIGdldCBwb2x5Z29uKCk6IFBvbHlnb24ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gICAgfVxuXG4gICAgcGFpbnQoKTogdm9pZCB7XG4gICAgICAgIGlmKFNIT1VMRF9QQUlOVCkge1xuICAgICAgICAgICAgdGhpcy5ncmFwaGljcyA9IHRoaXMucGFpbnRQb2x5Z29uKHRoaXMuY29uZmlnLCAweEZGMzMwMCwgMHhmZmQ5MDApO1xuICAgICAgICAgICAgdGhpcy5ib3VuZGluZ0dyYXBoaWNzID0gdGhpcy5wYWludFBvbHlnb24odGhpcy5jb25maWcuZ2V0Q29udmV4SHVsbCgpLCAweDAwMzNGRiwgMHgwMGQ5ZmYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5wYWludCgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5ncmFwaGljcykge1xuICAgICAgICAgICAgdGhpcy5ncmFwaGljcy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhaW50UG9seWdvbihwb2x5Z29uOiBQb2x5Z29uLCBmaWxsQ29sb3I6IG51bWJlciwgbGluZUNvbG9yOiBudW1iZXIpOiBQaGFzZXIuR3JhcGhpY3Mge1xuICAgICAgICBsZXQgcG9pbnRzID0gcG9seWdvbi5wb2ludHM7XG4gICAgICAgIGxldCBncmFwaGljcyA9IHBoYXNlckdhbWUudmFsdWUuYWRkLmdyYXBoaWNzKDAsIDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoZmlsbENvbG9yLCAwLjUpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoMSwgbGluZUNvbG9yLCAxKTtcbiAgICAgICAgXG4gICAgICAgIGdyYXBoaWNzLm1vdmVUbyhwb2ludHNbMF0ueCwgcG9pbnRzWzBdLnkpO1xuXG4gICAgICAgIGZvcihsZXQgaT0xOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBncmFwaGljcy5saW5lVG8ocG9pbnRzW2ldLngsIHBvaW50c1tpXS55KTtcbiAgICAgICAgfVxuICAgICAgICBncmFwaGljcy5lbmRGaWxsKCk7XG5cbiAgICAgICAgcmV0dXJuIGdyYXBoaWNzO1xuICAgIH0gXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL215LXR5cGluZ3MvbGliLmVzNi5kLnRzXCIgLz5cbmltcG9ydCB7IElQb2ludCwgSVNwcml0ZUluZm8gfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi91dGlscy9EaXJlY3Rpb25zJztcbmltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi4vdWkvVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcbmltcG9ydCB7IGFjdGl2ZUludmVudG9yeSB9IGZyb20gJy4uL3N0YXRlL0FjdGl2ZUludmVudG9yeS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgVmVyYnMgfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcblxuXG5cbmludGVyZmFjZSBJVGhpbmdPcHRpb25zIHtcbiAgICBpZDogc3RyaW5nLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICB4PzogbnVtYmVyLFxuICAgIHk/OiBudW1iZXIsXG4gICAgZGlyZWN0bHlJbkludmVudG9yeT86IEJvb2xlYW4sXG4gICAgc3ByaXRlSWQ/OiBzdHJpbmcsXG4gICAgaW52ZW50b3J5SW1hZ2VJZD86IHN0cmluZyxcbiAgICBnb1RvUG9zaXRpb24/OiBJUG9pbnQsXG4gICAgaXNGb3JlZ3JvdW5kPzogQm9vbGVhbixcbiAgICBwcmVmZXJyZWRBY3Rpb24/OiBWZXJicyxcbiAgICBwcmVmZXJyZWRJbnZlbnRvcnlBY3Rpb24/IDogVmVyYnMsXG4gICAgcGlja2FibGU/OiBCb29sZWFuLFxuICAgIGp1c3REZWNvcmF0aW9uPzogQm9vbGVhbixcbiAgICBkaXJlY3Rpb25Ub0xvb2s/OiBEaXJlY3Rpb25zLFxuICAgIG9wYWNpdHk/OiBudW1iZXIsXG4gICAgc3ByaXRlT3B0aW9ucz86IE1hcDxzdHJpbmcsIElTcHJpdGVJbmZvPixcbiAgICBhbmltYXRpb25TcGVlZD86IG51bWJlclxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBfc3RhdGU6IE1hcDxzdHJpbmcsIGFueT47XG4gICAgcHJvdGVjdGVkIHNwcml0ZTogUGhhc2VyLlNwcml0ZTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBvcHRpb25zOiBJVGhpbmdPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXJlY3RseUluSW52ZW50b3J5KSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRvSW52ZW50b3J5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNyZWF0ZVNwcml0ZSgpO1xuICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UoKTtcbiAgICAgICAgdGhpcy5hcHBseU1vZGlmaWVyKCk7XG4gICAgICAgIHRoaXMuYWRkU3ByaXRlQW5pbWF0aW9ucygpO1xuICAgIH1cblxuICAgIGdldCBzdGF0ZSgpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgIH1cblxuICAgIHNldCBzdGF0ZShuZXdTdGF0ZSkge1xuICAgICAgICBpZiAobmV3U3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMubmFtZTtcbiAgICB9XG5cbiAgICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pZDtcbiAgICB9XG5cbiAgICBjaGFuZ2VBdHRyKGF0dHJOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fc3RhdGUuc2V0KGF0dHJOYW1lLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMub25TdGF0ZUNoYW5nZSgpO1xuICAgIH1cblxuICAgIGdldEF0dHIoYXR0ck5hbWU6IHN0cmluZyk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZS5nZXQoYXR0ck5hbWUpO1xuICAgIH1cblxuICAgIGdldFByZWZlcnJlZEFjdGlvbigpOiBWZXJicyB7XG4gICAgICAgIGlmKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnByZWZlcnJlZEludmVudG9yeUFjdGlvbiB8fCBWZXJicy5MT09LO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wcmVmZXJyZWRBY3Rpb24gfHwgbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzSW5JbnZlbnRvcnkoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUuZ2V0KCdJU19JTl9JTlZFTlRPUlknKTtcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvblRvR29UbygpOiBJUG9pbnQge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmdvVG9Qb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5nb1RvUG9zaXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHg6IHRoaXMub3B0aW9ucy54LFxuICAgICAgICAgICAgICAgIHk6IHRoaXMub3B0aW9ucy55XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UG9zaXRpb25PblRvcCgpOiBJUG9pbnQge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy5zcHJpdGUueCxcbiAgICAgICAgICAgIHk6IE1hdGgucm91bmQodGhpcy5zcHJpdGUuZ2V0Qm91bmRzKCkueSkgLSAxMFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGdldERpcmVjdGlvblRvTG9vaygpOiBEaXJlY3Rpb25zIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kaXJlY3Rpb25Ub0xvb2sgfHwgbnVsbDtcbiAgICB9XG5cbiAgICBhcHBseUFjdGlvbih2ZXJiOiBWZXJicywgcGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoICh2ZXJiKSB7XG5cbiAgICAgICAgY2FzZSBWZXJicy5HT19UTzpcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdvVG9BY3Rpb24ocGxheWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZlcmJzLlRBS0U6XG4gICAgICAgICAgICB0aGlzLnRha2VBY3Rpb24ocGxheWVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZlcmJzLkxPT0s6XG4gICAgICAgICAgICB0aGlzLmxvb2tBY3Rpb24ocGxheWVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZlcmJzLk9QRU46XG4gICAgICAgICAgICB0aGlzLm9wZW5BY3Rpb24ocGxheWVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZlcmJzLkNMT1NFOlxuICAgICAgICAgICAgdGhpcy5jbG9zZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuUFVTSDpcbiAgICAgICAgICAgIHRoaXMucHVzaEFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuVVNFOlxuICAgICAgICAgICAgdGhpcy51c2VBY3Rpb24ocGxheWVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZlcmJzLlNQRUFLOlxuICAgICAgICAgICAgdGhpcy5zcGVha0FjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuR0lWRTpcbiAgICAgICAgICAgIHRoaXMuZ2l2ZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyAnRVJST1IsIHVua25vd24gYWN0aW9uICcgKyB2ZXJiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGludmVudG9yeUltYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuaW52ZW50b3J5SW1hZ2VJZCB8fCB0aGlzLm9wdGlvbnMuc3ByaXRlSWQ7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc3ByaXRlKSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5pc0luSW52ZW50b3J5KSB7XG4gICAgICAgICAgICBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCkucmVtb3ZlKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kcyB0aGF0IGNhbiBiZSBvdmVyd3JpdHRlbiBpbiBzdWJjbGFzc2VzXG4gICAgZ2V0RnJhbWVGb3JJbnZlbnRvcnkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcGxheUFuaW1hdGlvbihhbmltYXRpb25OYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLnNwcml0ZU9wdGlvbnMuaGFzKGFuaW1hdGlvbk5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5hbmltYXRpb25zLnBsYXkoYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IHRyeWluZyB0byBwbGF5IGFuaW1hdGlvbiB0aGF0IGRvZXNuXFwndCBleGlzdCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbGF5QW5pbWF0aW9uT25jZShhbmltYXRpb25OYW1lOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmKHRoaXMub3B0aW9ucy5zcHJpdGVPcHRpb25zLmhhcyhhbmltYXRpb25OYW1lKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLmFuaW1hdGlvbnMucGxheShhbmltYXRpb25OYW1lLCBudWxsLCBmYWxzZSk7IC8vRmFsc2Ugc28gaXQgZG9lcyBub3QgbG9vcFxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLmFuaW1hdGlvbnMuY3VycmVudEFuaW0ub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uU3RhdGVDaGFuZ2UoKTogdm9pZCB7fTtcbiAgICBwcm90ZWN0ZWQgYXBwbHlNb2RpZmllcigpOiB2b2lkIHt9O1xuXG4gICAgcHJvdGVjdGVkIGdvVG9BY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdGFrZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucGlja2FibGUpIHtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2UgaWYodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0kgYWxyZWFkeSBoYXZlIGl0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxldFBsYXllckNvbWVBbmRUYWtlSXQocGxheWVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBsZXRQbGF5ZXJDb21lQW5kVGFrZUl0KHBsYXllcjogUGxheWVyKSB7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5UQUtFX09CSkVDVCwgdGhpcyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgLy9UT0RPOiBjaGVjayBpZiB0aGVyZSBhcmUgbG9vayBvcHRpb25zXG4gICAgICAgIHBsYXllci5zYXkoJ1RoYXQgaXMgcHJldHR5IG5lYXQnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb3BlbkFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnVGhhdCBjYW5ub3QgYmUgb3BlbmVkJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNsb3NlQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdUaGF0IGNhbm5vdCBiZSBjbG9zZWQnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHVzaEFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnSSBjYW5ub3QgbW92ZSB0aGF0Jyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnSSBkbyBub3Qga25vdyBob3cgdG8gdXNlIHRoYXQnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc3BlYWtBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0kgd291bGRuXFwndCBrbm93IHdoYXQgdG8gc2F5Jyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdpdmVBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0kgY2Fubm90IGRvIHRoYXQnKTtcbiAgICB9XG5cblxuICAgIC8vTWV0aG9kcyB0aGF0IHNob3VsZG4ndCBiZSBvdmVycmlkZW5cbiAgICBwcml2YXRlIGFkZFRvSW52ZW50b3J5KCk6IHZvaWQge1xuICAgICAgICBpZihhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKS5hZGQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNwcml0ZSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGxheWVyVG9Vc2VyID0gdWlMYXllcnMuYmFja2dyb3VuZE9iamVjdHM7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaXNGb3JlZ3JvdW5kKSB7XG4gICAgICAgICAgICBsYXllclRvVXNlciA9IHVpTGF5ZXJzLmZvcmVncm91bmRPYmplY3RzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3ByaXRlID0gbGF5ZXJUb1VzZXIuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLngsXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMueSxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zcHJpdGVJZFxuICAgICAgICApO1xuXG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5vcGFjaXR5KSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5hbHBoYSA9IHRoaXMub3B0aW9ucy5vcGFjaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXRoaXMub3B0aW9ucy5qdXN0RGVjb3JhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGUuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmV2ZW50cy5vbklucHV0RG93bi5hZGQodGhpcy5vbkNsaWNrLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmV2ZW50cy5vbklucHV0T3Zlci5hZGQodGhpcy5vbklucHV0T3ZlciwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5ldmVudHMub25JbnB1dE91dC5hZGQodGhpcy5vbklucHV0T3V0LCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25DbGljayhyZWNlcHRvcjogUGhhc2VyLlNwcml0ZSwgcG9pbnRlcjogUGhhc2VyLlBvaW50ZXIpOiB2b2lkIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuU0VMRUNUX1RISU5HLCB7XG4gICAgICAgICAgICB0aGluZzogdGhpcyxcbiAgICAgICAgICAgIHNlY29uZGFyeUFjdGlvbjogISFwb2ludGVyLnJpZ2h0QnV0dG9uLmlzRG93blxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uSW5wdXRPdmVyKCkge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5DVVJTT1JfT1ZFUl9USElORywgdGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbklucHV0T3V0KCkge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5DVVJTT1JfT1VUX1RISU5HLCB0aGlzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFNwcml0ZUFuaW1hdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5zcHJpdGVPcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3ByaXRlT3B0aW9ucy5mb3JFYWNoKCAoc3ByaXRlUG9zaXRpb24sIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLmFuaW1hdGlvbnMuYWRkKGtleSwgc3ByaXRlUG9zaXRpb24uZnJhbWVzLCB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBJbnZlbnRvcnkgfSBmcm9tICcuLi9tb2RlbHMvSW52ZW50b3J5JztcblxuY2xhc3MgQWN0aXZlSW52ZW50b3J5IHtcblxuICAgIHByaXZhdGUgY2hhbmdlT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTtcbiAgICBwcml2YXRlIGFjdGl2ZUludmVudG9yeTogSW52ZW50b3J5O1xuICAgIHByaXZhdGUgb25JbnZlbnRvcnlDaGFuZ2VCaW5kZWQ6IElDYWxsYmFjaztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNoYW5nZU9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLm9uSW52ZW50b3J5Q2hhbmdlQmluZGVkID0gKChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyhuZXdWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldEFjdGl2ZUludmVudG9yeShuZXdJbnZlbnRvcnk6IEludmVudG9yeSk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlbW92ZU9sZEludmVudG9yeUV2ZW50cygpO1xuICAgICAgICB0aGlzLmFjdGl2ZUludmVudG9yeSA9IG5ld0ludmVudG9yeTtcbiAgICAgICAgdGhpcy5jcmVhdGVOZXdJbnZlbnRvcnlFdmVudHMoKTtcbiAgICAgICAgdGhpcy5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgIH1cblxuICAgIGdldEFjdGl2ZUludmVudG9yeSgpOiBJbnZlbnRvcnkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVJbnZlbnRvcnk7XG4gICAgfVxuXG4gICAgcmVmcmVzaCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgIH1cblxuICAgIHN1YnNjcmliZVRvQ2hhbmdlKGNhbGxiYWNrOiBJQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLmFjdGl2ZUludmVudG9yeSk7XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5yZW1vdmVPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVPbGRJbnZlbnRvcnlFdmVudHMoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUludmVudG9yeSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVJbnZlbnRvcnkudW5zdWJzY3JpYmVUb0NoYW5nZSh0aGlzLm9uSW52ZW50b3J5Q2hhbmdlQmluZGVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTmV3SW52ZW50b3J5RXZlbnRzKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVJbnZlbnRvcnkpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSW52ZW50b3J5LnN1YnNjcmliZVRvQ2hhbmdlKHRoaXMub25JbnZlbnRvcnlDaGFuZ2VCaW5kZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3RpZnlTdWJzY3JpYmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyh0aGlzLmFjdGl2ZUludmVudG9yeSk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgYWN0aXZlSW52ZW50b3J5ID0gbmV3IEFjdGl2ZUludmVudG9yeSgpOyIsImNsYXNzIFBoYXNlckdhbWUge1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50VmFsdWU6IFBoYXNlci5HYW1lO1xuXG4gICAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBQaGFzZXIuR2FtZSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpOiBQaGFzZXIuR2FtZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRWYWx1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBwaGFzZXJHYW1lID0gbmV3IFBoYXNlckdhbWUoKTsiLCJpbXBvcnQgeyBTY2VuZSB9IGZyb20gJy4uL21vZGVscy9TY2VuZSc7XG5cbmNsYXNzIFNjZW5lc1NldCB7XG4gICAgcHJpdmF0ZSBzY2VuZXM6IE1hcDxzdHJpbmcsIFNjZW5lPjtcbiAgICBwcml2YXRlIF9jdXJyZW50U2NlbmU6IFNjZW5lO1xuXG4gICAgaW5pdChzY2VuZXM6IEFycmF5PFNjZW5lPik6IHZvaWQge1xuICAgICAgICB0aGlzLnNjZW5lcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgc2NlbmVzLmZvckVhY2goKHNjZW5lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lcy5zZXQoc2NlbmUuaWQsIHNjZW5lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRTY2VuZSgpOiBTY2VuZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50U2NlbmU7XG4gICAgfVxuXG4gICAgc2V0Q3VycmVudFNjZW5lQnlJZChuZXdDdXJyZW50U2NlbmVJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveUN1cnJlbnRTY2VuZSgpO1xuICAgICAgICBsZXQgc2NlbmUgPSB0aGlzLnNjZW5lcy5nZXQobmV3Q3VycmVudFNjZW5lSWQpO1xuICAgICAgICBpZiAoIXNjZW5lKSB7XG4gICAgICAgICAgICB0aHJvdyBgRVJST1IgdHJ5aW5nIHRvIGluaXQgc2NlbmUgdGhhdCBpcyBub3QgcHJlc2VudCAoJHtuZXdDdXJyZW50U2NlbmVJZH0pYDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBzY2VuZTtcbiAgICAgICAgc2NlbmUuc2hvdygpO1xuICAgIH1cblxuICAgIGdvVG9TY2VuZVdpdGhJZChzY2VuZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kZXN0cm95Q3VycmVudFNjZW5lKCk7XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudFNjZW5lQnlJZChzY2VuZUlkKTtcbiAgICB9ICAgXG5cbiAgICBwcml2YXRlIGRlc3Ryb3lDdXJyZW50U2NlbmUoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50U2NlbmUpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2NlbmVzID0gbmV3IFNjZW5lc1NldCgpO1xuIiwiaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuaW1wb3J0IHsgR2VuZXJpY0hpZ2hsaWdodGVkVGhpbmcgfSBmcm9tICcuLi9tb2RlbHMvR2VuZXJpY0hpZ2hsaWdodGVkVGhpbmcnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgc2VsZWN0ZWRWZXJiIH0gZnJvbSAnLi9TZWxlY3RlZFZlcmIuc2luZ2xldG9uJztcbmltcG9ydCB7IFZlcmJzSW5mbyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5cbmNsYXNzIFNlbGVjdGVkVGhpbmcgZXh0ZW5kcyBHZW5lcmljSGlnaGxpZ2h0ZWRUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oXG4gICAgICAgICAgICBBY3Rpb25zLkFDVElPTl9BUFBMSUVELFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5oaWdobGlnaHRUaGluZyhudWxsKVxuICAgICAgICApO1xuICAgIH1cbn1cblxuY2xhc3MgSGlnaGxpZ2h0ZWRUaGluZyBleHRlbmRzIEdlbmVyaWNIaWdobGlnaHRlZFRoaW5nIHtcblxuICAgIHByb3RlY3RlZCBvbkN1cnNvck92ZXJUaGluZyh0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFzZWxlY3RlZFZlcmIudmVyYikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCB2ZXJiSW5mbyA9IFZlcmJzSW5mby5nZXQoc2VsZWN0ZWRWZXJiLnZlcmIpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZFZlcmIudmVyYiAmJiB2ZXJiSW5mby5zaW5nbGVPYmplY3QpIHtcblxuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRUaGluZyh0aGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRWZXJiLnZlcmIgJiYgIXZlcmJJbmZvLnNpbmdsZU9iamVjdCkge1xuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRUaGluZ0Zvck11bHRpcGxlT2JqZWN0VmVyYih0aGluZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhpZ2hsaWdodFRoaW5nRm9yTXVsdGlwbGVPYmplY3RWZXJiKHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZykge1xuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRUaGluZyh0aGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpbmcuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nKHRoaW5nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbkN1cnNvck91dFRoaW5nKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nKG51bGwpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGhpZ2hsaWdodGVkVGhpbmcgPSBuZXcgSGlnaGxpZ2h0ZWRUaGluZygpO1xuZXhwb3J0IGNvbnN0IHNlbGVjdGVkVGhpbmcgPSBuZXcgU2VsZWN0ZWRUaGluZygpO1xuIiwiaW1wb3J0IHsgVmVyYnMgfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSAsIElDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzL09ic2VydmFibGUnO1xuXG5jbGFzcyBTZWxlY3RlZFZlcmIge1xuXG4gICAgcHJpdmF0ZSBvbkNoYW5nZU9ic2VydmFibGU6IE9ic2VydmFibGU7XG4gICAgcHJpdmF0ZSBzZWxlY3RlZFZlcmI6IFZlcmJzO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKFxuICAgICAgICAgICAgQWN0aW9ucy5TRUxFQ1RfVkVSQixcbiAgICAgICAgICAgIG5ld1ZlcmIgPT4gdGhpcy5zZWxlY3ROZXdWZXJiKG5ld1ZlcmIpXG4gICAgICAgICk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oXG4gICAgICAgICAgICBBY3Rpb25zLkFDVElPTl9BUFBMSUVELFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5yZXNldCgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ2V0IHZlcmIoKTogVmVyYnMge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFZlcmI7XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZS5yZWdpc3Rlck9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5zZWxlY3RlZFZlcmIpO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZS5yZW1vdmVPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgbm90aWZ5U3Vic2NyaWJlcnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyh0aGlzLnNlbGVjdGVkVmVyYik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZWxlY3ROZXdWZXJiKG5ld1ZlcmI6IFZlcmJzKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRWZXJiID0gbmV3VmVyYjtcbiAgICAgICAgdGhpcy5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VsZWN0TmV3VmVyYihWZXJicy5HT19UTyk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RlZFZlcmIgPSBuZXcgU2VsZWN0ZWRWZXJiKCk7XG4iLCJpbXBvcnQgeyBJTGFiZWxzICB9IGZyb20gJy4vTGFiZWxzLnN0b3JlJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTEFCRUxTOiBJTGFiZWxzID0ge1xuICAgICdlcyc6IHtcbiAgICAgICAgJ0Nsb3NlJzogJ0NlcnJhcicsXG4gICAgICAgICdHaXZlJzogJ0RhcicsXG4gICAgICAgICdHbyB0byc6ICdJciBhJyxcbiAgICAgICAgJ0xvb2sgYXQnOiAnTWlyYXInLFxuICAgICAgICAnT3Blbic6ICdBYnJpcicsXG4gICAgICAgICdQdXNoJzogJ0VtcHVqYXInLFxuICAgICAgICAnUmVmbGVjdCc6ICdQZW5zYXInLFxuICAgICAgICAnU3BlYWsgdG8nOiAnSGFibGFyIGEnLFxuICAgICAgICAnVGFrZSc6ICdDb2dlcicsXG4gICAgICAgICd0byc6ICdhJyxcbiAgICAgICAgJ1VzZSc6ICdVc2FyJyxcbiAgICAgICAgJ3dpdGgnOiAnY29uJ1xuICAgIH0sXG4gICAgJ2VuJzoge1xuICAgICAgICAnQ2xvc2UnOiAnQ2xvc2UnLFxuICAgICAgICAnR2l2ZSc6ICdHaXZlJyxcbiAgICAgICAgJ0dvIHRvJzogJ0dvIHRvJyxcbiAgICAgICAgJ0xvb2sgYXQnOiAnTG9vayBhdCcsXG4gICAgICAgICdPcGVuJzogJ09wZW4nLFxuICAgICAgICAnUHVzaCc6ICdQdXNoJyxcbiAgICAgICAgJ1JlZmxlY3QnOiAnUmVmbGVjdCcsXG4gICAgICAgICdTcGVhayB0byc6ICdTcGVhayB0bycsXG4gICAgICAgICdUYWtlJzogJ1BpY2sgdXAnLFxuICAgICAgICAndG8nOiAndG8nLFxuICAgICAgICAnVXNlJzogJ1VzZScsXG4gICAgICAgICd3aXRoJzogJ3dpdGgnXG4gICAgfVxufTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuaW1wb3J0IHsgREVGQVVMVF9MQUJFTFMgfSBmcm9tICcuL0RlZmF1bHRMYWJlbHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElMYWJlbHNQZXJMYW5ndWFnZSB7XG4gICAgW2luZGV4IDogc3RyaW5nXSA6IHN0cmluZztcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxhYmVscyB7XG4gICAgW2luZGV4IDogc3RyaW5nXSA6IElMYWJlbHNQZXJMYW5ndWFnZTtcbn07XG5cbmNvbnN0IERFRkFVTFRfTEFOR1VBR0UgPSAnZW4nO1xuXG5jbGFzcyBMYWJlbHNTdG9yZSB7XG4gICAgcHJpdmF0ZSBsYWJlbHM6IE1hcDxzdHJpbmcsIElMYWJlbHNQZXJMYW5ndWFnZT47XG4gICAgcHJpdmF0ZSBjdXJyZW50TGFuZ3VhZ2U6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxhYmVscyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50TGFuZ3VhZ2UgPSBERUZBVUxUX0xBTkdVQUdFO1xuICAgIH1cblxuICAgIHNldExhbmd1YWdlKG5ld0xhbmd1YWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGFuZ3VhZ2UgPSBuZXdMYW5ndWFnZTtcbiAgICB9XG5cbiAgICBhZGRMYWJlbHMobGFiZWxzVG9BZGQ6IElMYWJlbHMpOiB2b2lkIHtcbiAgICAgICAgZm9yKGxldCBrZXkgaW4gbGFiZWxzVG9BZGQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkTGFiZWxzRm9yTGFuZ3VhZ2Uoa2V5LCBsYWJlbHNUb0FkZFtrZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldExhYmVsKGxhYmVsTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGFsbExhbmd1YWdlTGFiZWxzID0gdGhpcy5sYWJlbHMuZ2V0KHRoaXMuY3VycmVudExhbmd1YWdlKTtcbiAgICAgICAgaWYgKCFhbGxMYW5ndWFnZUxhYmVscykge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiB0cnlpbmcgdG8gZ2V0IGxhYmVsIGZyb20gbm9uIGV4aXN0aW5nIGxhbmd1YWdlJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsTGFuZ3VhZ2VMYWJlbHNbbGFiZWxOYW1lXSB8fCBsYWJlbE5hbWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRMYWJlbHNGb3JMYW5ndWFnZShsYW5ndWFnZTogc3RyaW5nLCBsYWJlbHM6IElMYWJlbHNQZXJMYW5ndWFnZSk6IHZvaWQge1xuICAgICAgICBsZXQgcHJldmlvdXNMYWJlbHMgPSB0aGlzLmxhYmVscy5nZXQobGFuZ3VhZ2UpIHx8IHt9O1xuICAgICAgICBsZXQgbmV3TGFiZWxzID0gT2JqZWN0LmFzc2lnbih7fSwgcHJldmlvdXNMYWJlbHMsIGxhYmVscyk7XG4gICAgICAgIHRoaXMubGFiZWxzLnNldChsYW5ndWFnZSwgbmV3TGFiZWxzKTtcbiAgICB9XG59XG5sZXQgbGFiZWxzU3RvcmVTaW5nbGV0b24gPSBuZXcgTGFiZWxzU3RvcmUoKTtcblxubGFiZWxzU3RvcmVTaW5nbGV0b24uYWRkTGFiZWxzKDxJTGFiZWxzPiBERUZBVUxUX0xBQkVMUyk7XG5cbmV4cG9ydCBjb25zdCBsYWJlbCA9ICgobGFiZWxJZDogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIGxhYmVsc1N0b3JlU2luZ2xldG9uLmdldExhYmVsKGxhYmVsSWQpO1xufSk7XG5cbmV4cG9ydCBjb25zdCBsYWJlbHNTdG9yZSA9IGxhYmVsc1N0b3JlU2luZ2xldG9uO1xuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL215LXR5cGluZ3MvbGliLmVzNi5kLnRzXCIgLz5cblxuZXhwb3J0IGVudW0gVmVyYnMge1xuICAgIEdPX1RPID0gMSxcbiAgICBMT09LLFxuICAgIENMT1NFLFxuICAgIFBVU0gsXG4gICAgVEFLRSxcbiAgICBVU0UsXG4gICAgU1BFQUssXG4gICAgR0lWRSxcbiAgICBPUEVOXG59O1xuXG5pbnRlcmZhY2UgSVZlcmJJbmZvIHtcbiAgICBsYWJlbDogc3RyaW5nLFxuICAgIHNpbmdsZU9iamVjdDogQm9vbGVhbixcbiAgICBjb25qdWN0aW9uPzogc3RyaW5nXG59XG5cbmxldCB2ZXJic0luZm8gOiBNYXA8VmVyYnMsIElWZXJiSW5mbz4gPSBuZXcgTWFwKCk7XG5cbnZlcmJzSW5mby5zZXQoVmVyYnMuR09fVE8sIHtcbiAgICBsYWJlbDogJ0dvIHRvJyxcbiAgICBzaW5nbGVPYmplY3Q6IHRydWVcbn0pO1xudmVyYnNJbmZvLnNldChWZXJicy5MT09LLCB7XG4gICAgbGFiZWw6ICdMb29rIGF0JyxcbiAgICBzaW5nbGVPYmplY3Q6IHRydWVcbn0pO1xudmVyYnNJbmZvLnNldChWZXJicy5DTE9TRSwge1xuICAgIGxhYmVsOiAnQ2xvc2UnLFxuICAgIHNpbmdsZU9iamVjdDogdHJ1ZVxufSk7XG52ZXJic0luZm8uc2V0KFZlcmJzLlBVU0gsIHtcbiAgICBsYWJlbDogJ1B1c2gnLFxuICAgIHNpbmdsZU9iamVjdDogdHJ1ZVxufSk7XG52ZXJic0luZm8uc2V0KFZlcmJzLlRBS0UsIHtcbiAgICBsYWJlbDogJ1Rha2UnLFxuICAgIHNpbmdsZU9iamVjdDogdHJ1ZVxufSk7XG52ZXJic0luZm8uc2V0KFZlcmJzLlVTRSwge1xuICAgIGxhYmVsOiAnVXNlJyxcbiAgICBzaW5nbGVPYmplY3Q6IGZhbHNlLFxuICAgIGNvbmp1Y3Rpb246ICd3aXRoJ1xufSk7XG52ZXJic0luZm8uc2V0KFZlcmJzLlNQRUFLLCB7XG4gICAgbGFiZWw6ICdTcGVhayB0bycsXG4gICAgc2luZ2xlT2JqZWN0OiB0cnVlXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuR0lWRSwge1xuICAgIGxhYmVsOiAnR2l2ZScsXG4gICAgc2luZ2xlT2JqZWN0OiBmYWxzZSxcbiAgICBjb25qdWN0aW9uOiAndG8nXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuT1BFTiwge1xuICAgIGxhYmVsOiAnT3BlbicsXG4gICAgc2luZ2xlT2JqZWN0OiB0cnVlXG59KTtcbmV4cG9ydCBjb25zdCBWZXJic0luZm8gPSB2ZXJic0luZm87XG4iLCJpbXBvcnQgeyBWZXJicywgVmVyYnNJbmZvIH0gZnJvbSAnLi4vc3RvcmVzL1ZlcmJzLnN0b3JlJztcbmltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi4vLi4vUGhhc2VyJztcbmltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgbGFiZWwgfSBmcm9tICcuLi9zdG9yZXMvTGFiZWxzLnN0b3JlJztcbmltcG9ydCB7IHN0eWxlIH0gZnJvbSAnLi9TdHlsZSc7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBUZXh0V2l0aFNoYWRvdyB9IGZyb20gJy4vVGV4dFdpdGhTaGFkb3cnO1xuXG5leHBvcnQgY2xhc3MgQWN0aW9uQnV0dG9uIHtcblxuICAgIHByaXZhdGUgc2NyZWVuUG9zaXRpb246IElQb2ludDtcbiAgICBwcml2YXRlIGJ1dHRvbjogUGhhc2VyLkJ1dHRvbjtcbiAgICBwcml2YXRlIHRleHQ6IFRleHRXaXRoU2hhZG93O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB2ZXJiOiBWZXJicywgcG9zaXRpb246IElQb2ludCkge1xuICAgICAgICB0aGlzLnNjcmVlblBvc2l0aW9uID0gbGF5b3V0LmdldFZlcmJCdXR0b25Qb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgIHRoaXMuY3JlYXRlQnV0dG9uKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlVGV4dCgpO1xuICAgIH1cblxuICAgIGhpZ2hsaWdodCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5idXR0b24uZnJhbWUgPSAyO1xuICAgIH1cblxuICAgIHVuaGlnaGxpZ2h0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJ1dHRvbi5mcmFtZSA9IDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCdXR0b24oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gcGhhc2VyR2FtZS52YWx1ZS5hZGQuYnV0dG9uKFxuICAgICAgICAgICAgdGhpcy5zY3JlZW5Qb3NpdGlvbi54LFxuICAgICAgICAgICAgdGhpcy5zY3JlZW5Qb3NpdGlvbi55LFxuICAgICAgICAgICAgJ0JVVFRPTl9CRycsXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2ssXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAyLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICB1aUxheWVycy52ZXJiQnV0dG9ucy5hZGQodGhpcy5idXR0b24pO1xuICAgICAgICB0aGlzLmJ1dHRvbi5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVRleHQoKTogdm9pZCB7XG4gICAgICAgIGxldCB0ZXh0ID0gbGFiZWwoVmVyYnNJbmZvLmdldCh0aGlzLnZlcmIpLmxhYmVsKTtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5zY3JlZW5Qb3NpdGlvbi54ICsgbGF5b3V0LlZFUkJfQlVUVE9OX1dJRFRIIC8gMixcbiAgICAgICAgICAgIHk6IHRoaXMuc2NyZWVuUG9zaXRpb24ueSArIGxheW91dC5WRVJCX0JVVFRPTl9IRUlHSFQgLyAyXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudGV4dCA9IG5ldyBUZXh0V2l0aFNoYWRvdyh7XG4gICAgICAgICAgICBpbml0aWFsVGV4dDogdGV4dCxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgIGZpeGVkVG9DYW1lcmE6IHRydWUsXG4gICAgICAgICAgICBsYXllcjogdWlMYXllcnMudmVyYkJ1dHRvbnMsXG4gICAgICAgICAgICBhbmNob3I6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjUsXG4gICAgICAgICAgICAgICAgeTogMC41XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5TRUxFQ1RfVkVSQiwgdGhpcy52ZXJiKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBzdHlsZSB9IGZyb20gJy4vU3R5bGUnO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uTGluZSB9IGZyb20gJy4uL21vZGVscy9Db252ZXJzYXRpb25MaW5lJztcbmltcG9ydCB7IE9ic2VydmFibGUsIElDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzL09ic2VydmFibGUnO1xuaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBUZXh0V2l0aFNoYWRvdyB9IGZyb20gJy4vVGV4dFdpdGhTaGFkb3cnO1xuXG5leHBvcnQgY2xhc3MgQ29udmVyc2F0aW9uTGluZVVJIHtcblxuICAgIHByaXZhdGUgY2xpY2tPYnNlcnZhYmxlOiBPYnNlcnZhYmxlO1xuICAgIHByaXZhdGUgcG9zaXRpb246IElQb2ludDtcbiAgICBwcml2YXRlIGJ1dHRvbjogUGhhc2VyLkJ1dHRvbjtcbiAgICBwcml2YXRlIHRleHQ6IFRleHRXaXRoU2hhZG93O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgY29udmVyc2F0aW9uTGluZTogQ29udmVyc2F0aW9uTGluZSxcbiAgICAgICAgcHJpdmF0ZSBsaW5lVGV4dDogc3RyaW5nLFxuICAgICAgICBwcml2YXRlIGluZGV4OiBudW1iZXIpIHtcblxuICAgICAgICBpZiAoIXRoaXMuY29udmVyc2F0aW9uTGluZSkge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBjb252ZXJzYXRpb24gbGluZSBVSSwgbm8gY29udmVyc2F0aW9uTGluZSBwcm92aWRlZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmxpbmVUZXh0KSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IGNvbnZlcnNhdGlvbiBsaW5lIFVJLCBubyB0ZXh0IHByb3ZpZGVkJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IGNvbnZlcnNhdGlvbiBsaW5lIFVJLCBubyBpbmRleCBwcm92aWRlZCc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsaWNrT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBsYXlvdXQuZ2V0UG9zaXRpb25Gb3JDb252ZXJzYXRpb25MaW5lKHRoaXMuaW5kZXgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvbigpO1xuICAgICAgICB0aGlzLmNyZWF0ZVRleHQoKTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NsaWNrKGNhbGxiYWNrOiBJQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGlja09ic2VydmFibGUucmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uZGVzdHJveSgpO1xuICAgICAgICB0aGlzLnRleHQuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQnV0dG9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJ1dHRvbiA9IHBoYXNlckdhbWUudmFsdWUuYWRkLmJ1dHRvbihcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCxcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSxcbiAgICAgICAgICAgICdDT05WRVJTQVRJT05fTElORV9CRycsXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2ssXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAyLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICB1aUxheWVycy5jb252ZXJzYXRpb24uYWRkKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgdGhpcy5idXR0b24uZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVUZXh0KCk6IHZvaWQge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvc2l0aW9uLnggKyBsYXlvdXQuQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19YLFxuICAgICAgICAgICAgeTogdGhpcy5wb3NpdGlvbi55ICsgbGF5b3V0LkNPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRleHQgPSBuZXcgVGV4dFdpdGhTaGFkb3coe1xuICAgICAgICAgICAgaW5pdGlhbFRleHQ6IHRoaXMubGluZVRleHQsXG4gICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgICBmaXhlZFRvQ2FtZXJhOiB0cnVlLFxuICAgICAgICAgICAgbGF5ZXI6IHVpTGF5ZXJzLmNvbnZlcnNhdGlvblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uQ2xpY2soKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2xpY2tPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyh0aGlzLmNvbnZlcnNhdGlvbkxpbmUpO1xuICAgIH1cblxufSIsImltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlCbG9ja2VyIH0gZnJvbSAnLi4vLi4vZW5naW5lL3VpL1VJQmxvY2tlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uIH0gZnJvbSAnLi4vbW9kZWxzL0NvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25MaW5lIH0gZnJvbSAnLi4vbW9kZWxzL0NvbnZlcnNhdGlvbkxpbmUnO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uTGluZVVJIH0gZnJvbSAnLi9Db252ZXJzYXRpb25MaW5lVUknO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJzYXRpb25VSSB7XG5cbiAgICBwcml2YXRlIGJhY2tncm91bmQ6IFBoYXNlci5TcHJpdGU7XG4gICAgcHJpdmF0ZSBsaW5lczogQXJyYXk8Q29udmVyc2F0aW9uTGluZVVJPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb24pIHtcbiAgICAgICAgdWlCbG9ja2VyLmJsb2NrKCk7XG4gICAgICAgIHRoaXMubGluZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jcmVhdGVCYWNrZ3JvdW5kKCk7XG4gICAgICAgIHRoaXMuY29udmVyc2F0aW9uLm9uU3RhdGVDaGFuZ2UoKG5ld1N0YXRlKSA9PiB0aGlzLnVwZGF0ZShuZXdTdGF0ZSkpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveU9sZExpbmVzKCk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5kZXN0cm95KCk7XG4gICAgICAgIHVpQmxvY2tlci51bmJsb2NrKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgICAgICBsZXQgbGF5b3V0U3RhcnRQb3NpdGlvbiA9IGxheW91dC5VSV9TVEFSVF9QT1NJVElPTjtcblxuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSB1aUxheWVycy5jb252ZXJzYXRpb24uY3JlYXRlKFxuICAgICAgICAgICAgbGF5b3V0U3RhcnRQb3NpdGlvbi54LFxuICAgICAgICAgICAgbGF5b3V0U3RhcnRQb3NpdGlvbi55LFxuICAgICAgICAgICAgJ1VJX0NPTlZFUlNBVElPTl9CRydcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmFuY2hvci5zZXRUbygwLCAwKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlKG5ld1N0YXRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kZXN0cm95T2xkTGluZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVOZXdMaW5lcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTmV3TGluZXMoKTogdm9pZCB7XG4gICAgICAgIGxldCBuZXdMaW5lcyA9IHRoaXMuY29udmVyc2F0aW9uLmdldExpbmVzKCk7XG4gICAgICAgIG5ld0xpbmVzLmZvckVhY2goKG5ld0xpbmUsIGluZGV4KSA9PiB0aGlzLmNyZWF0ZUxpbmUobmV3TGluZSwgaW5kZXgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUxpbmUobGluZTogQ29udmVyc2F0aW9uTGluZSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBsZXQgbmV3VUlMaW5lID0gbmV3IENvbnZlcnNhdGlvbkxpbmVVSShcbiAgICAgICAgICAgIGxpbmUsXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnNhdGlvbi5nZXRUZXh0Rm9yTGluZShsaW5lKSxcbiAgICAgICAgICAgIGluZGV4KTtcbiAgICAgICAgbmV3VUlMaW5lLnN1YnNjcmliZVRvQ2xpY2soY2xpY2tlZExpbmVkID0+IHRoaXMubGluZUNsaWNrZWQoY2xpY2tlZExpbmVkKSk7XG4gICAgICAgIHRoaXMubGluZXMucHVzaChuZXdVSUxpbmUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbGluZUNsaWNrZWQobGluZTogQ29udmVyc2F0aW9uTGluZSkge1xuICAgICAgICB0aGlzLmRlc3Ryb3lPbGRMaW5lcygpO1xuICAgICAgICB0aGlzLmNvbnZlcnNhdGlvbi5hcHBseUxpbmUobGluZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95T2xkTGluZXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGluZXMuZm9yRWFjaChsaW5lID0+IGxpbmUuZGVzdHJveSgpKTtcbiAgICAgICAgdGhpcy5saW5lcyA9IFtdO1xuICAgIH1cblxuICAgIFxufVxuIiwiaW1wb3J0IHsgc2VsZWN0ZWRUaGluZywgaGlnaGxpZ2h0ZWRUaGluZyB9IGZyb20gJy4uL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBzZWxlY3RlZFZlcmIgfSBmcm9tICcuLi9zdGF0ZS9TZWxlY3RlZFZlcmIuc2luZ2xldG9uJztcbmltcG9ydCB7IFRleHRXaXRoU2hhZG93IH0gZnJvbSAnLi9UZXh0V2l0aFNoYWRvdyc7XG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgbGFiZWwgfSBmcm9tICcuLi9zdG9yZXMvTGFiZWxzLnN0b3JlJztcbmltcG9ydCB7IFZlcmJzLCBWZXJic0luZm8gfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuXG5leHBvcnQgY2xhc3MgQ3VycmVudEFjdGlvblVJIHtcblxuICAgIHByaXZhdGUgdGV4dDogVGV4dFdpdGhTaGFkb3c7XG4gICAgcHJpdmF0ZSBjdXJyZW50VGV4dDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlVGV4dCgpO1xuICAgICAgICBzZWxlY3RlZFZlcmIuc3Vic2NyaWJlVG9DaGFuZ2UobmV3VmVyYiA9PiB0aGlzLnVwZGF0ZVRleHQoKSk7XG4gICAgICAgIGhpZ2hsaWdodGVkVGhpbmcuc3Vic2NyaWJlVG9DaGFuZ2UobmV3VGhpbmcgPT4gdGhpcy51cGRhdGVUZXh0KCkpO1xuICAgICAgICBzZWxlY3RlZFRoaW5nLnN1YnNjcmliZVRvQ2hhbmdlKG5ld1RoaW5nID0+IHRoaXMudXBkYXRlVGV4dCgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVRleHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGV4dCA9IG5ldyBUZXh0V2l0aFNoYWRvdyh7XG4gICAgICAgICAgICBwb3NpdGlvbjogbGF5b3V0LkNVUlJFTlRfQUNUSU9OX1BPU0lUSU9OLFxuICAgICAgICAgICAgbGF5ZXI6IHVpTGF5ZXJzLnZlcmJCdXR0b25zLFxuICAgICAgICAgICAgZml4ZWRUb0NhbWVyYTogdHJ1ZVxuICAgICAgICB9KTtcbn1cblxuICAgIHByaXZhdGUgdXBkYXRlVGV4dCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IG5ld1RleHQgPSB0aGlzLmdldFZlcmJUZXh0KCkgKyB0aGlzLmdldFNlbGVjdGVkVGhpbmdUZXh0KCkgKyAnICcgKyB0aGlzLmdldFRoaW5nVGV4dCgpO1xuICAgICAgICB0aGlzLnNldFRleHQobmV3VGV4dCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRUZXh0KG5ld1RleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50VGV4dCAhPT0gbmV3VGV4dCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dCA9IG5ld1RleHQ7XG4gICAgICAgICAgICB0aGlzLnRleHQuc2V0VGV4dChuZXdUZXh0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VmVyYlRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHZlcmIgPSBzZWxlY3RlZFZlcmIudmVyYjtcbiAgICAgICAgcmV0dXJuIGxhYmVsKFZlcmJzSW5mby5nZXQodmVyYikubGFiZWwpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGhpbmdUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGxldCB0aGluZyA9IGhpZ2hsaWdodGVkVGhpbmcudGhpbmc7XG4gICAgICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgICAgIGlmICh0aGluZyAmJiB0aGluZy5uYW1lKSB7XG4gICAgICAgICAgICB0ZXh0ID0gbGFiZWwodGhpbmcubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RlZFRoaW5nVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgdmVyYiA9IHNlbGVjdGVkVmVyYi52ZXJiO1xuICAgICAgICBsZXQgdmVyYkluZm8gPSBWZXJic0luZm8uZ2V0KHZlcmIpO1xuICAgICAgICBpZiAoIXZlcmJJbmZvLnNpbmdsZU9iamVjdCAmJiBzZWxlY3RlZFRoaW5nLnRoaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAnICsgbGFiZWwoc2VsZWN0ZWRUaGluZy50aGluZy5uYW1lKSArICcgJyArIGxhYmVsKHZlcmJJbmZvLmNvbmp1Y3Rpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBWZXJic1VJIH0gZnJvbSAnLi9WZXJic1VJJztcbmltcG9ydCB7IEN1cnJlbnRBY3Rpb25VSSB9IGZyb20gJy4vQ3VycmVudEFjdGlvblVJJztcbmltcG9ydCB7IEludmVudG9yeVVJIH0gZnJvbSAnLi9JbnZlbnRvcnlVSSc7XG5pbXBvcnQgeyBSZWZsZWN0QnV0dG9uIH0gZnJvbSAnLi9SZWZsZWN0QnV0dG9uJztcblxuZXhwb3J0IGNsYXNzIEdyYXBoaWNVSSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVCYWNrZ3JvdW5kKCk7XG4gICAgICAgIG5ldyBWZXJic1VJKCk7XG4gICAgICAgIG5ldyBDdXJyZW50QWN0aW9uVUkoKTtcbiAgICAgICAgbmV3IEludmVudG9yeVVJKCk7XG4gICAgICAgIG5ldyBSZWZsZWN0QnV0dG9uKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgICAgICBsZXQgbGF5b3V0U3RhcnRQb3NpdGlvbiA9IGxheW91dC5VSV9TVEFSVF9QT1NJVElPTjtcbiAgICAgICAgbGV0IGJhY2tncm91bmQgPSB1aUxheWVycy5ndWlCYWNrZ3JvdW5kLmNyZWF0ZShcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0U3RhcnRQb3NpdGlvbi54LFxuICAgICAgICAgICAgICAgICAgICBsYXlvdXRTdGFydFBvc2l0aW9uLnksXG4gICAgICAgICAgICAgICAgICAgICdVSV9CRycpO1xuICAgICAgICBiYWNrZ3JvdW5kLmFuY2hvci5zZXRUbygwLCAwKTtcbiAgICAgICAgYmFja2dyb3VuZC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICAgICAgYmFja2dyb3VuZC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuXG4gICAgfVxufSIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5cbmludGVyZmFjZSBJSW52ZW50b3J5SXRlbVVJT3B0aW9ucyB7XG4gICAgdGhpbmc6IFRoaW5nLFxuICAgIGluZGV4OiBudW1iZXJcbn1cblxuZXhwb3J0IGNsYXNzIEludmVudG9yeUl0ZW1VSSB7XG5cbiAgICBwcml2YXRlIHNwcml0ZTogUGhhc2VyLlNwcml0ZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogSUludmVudG9yeUl0ZW1VSU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVTcHJpdGUoKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNwcml0ZS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTcHJpdGUoKTogdm9pZCB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IGxheW91dC5nZXRQb3NpdGlvbkZvclVJSW52ZW50b3J5SXRlbSh0aGlzLm9wdGlvbnMuaW5kZXgpO1xuICAgICAgICB0aGlzLnNwcml0ZSA9IHVpTGF5ZXJzLnZlcmJCdXR0b25zLmNyZWF0ZShcbiAgICAgICAgICAgIHBvc2l0aW9uLngsXG4gICAgICAgICAgICBwb3NpdGlvbi55LFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnRoaW5nLmludmVudG9yeUltYWdlXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5zcHJpdGUuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zcHJpdGUuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWUgPSB0aGlzLm9wdGlvbnMudGhpbmcuZ2V0RnJhbWVGb3JJbnZlbnRvcnkoKTtcblxuICAgICAgICB0aGlzLnNwcml0ZS5ldmVudHMub25JbnB1dERvd24uYWRkKHRoaXMub25DbGljaywgdGhpcyk7XG4gICAgICAgIHRoaXMuc3ByaXRlLmV2ZW50cy5vbklucHV0T3Zlci5hZGQodGhpcy5vbklucHV0T3ZlciwgdGhpcyk7XG4gICAgICAgIHRoaXMuc3ByaXRlLmV2ZW50cy5vbklucHV0T3V0LmFkZCh0aGlzLm9uSW5wdXRPdXQsIHRoaXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25DbGljayhyZWNlcHRvcjogUGhhc2VyLlNwcml0ZSwgcG9pbnRlcjogUGhhc2VyLlBvaW50ZXIpOiB2b2lkIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuU0VMRUNUX1RISU5HLCB7XG4gICAgICAgICAgICB0aGluZzogdGhpcy5vcHRpb25zLnRoaW5nLFxuICAgICAgICAgICAgc2Vjb25kYXJ5QWN0aW9uOiAhIXBvaW50ZXIucmlnaHRCdXR0b24uaXNEb3duXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25JbnB1dE92ZXIoKTogdm9pZCB7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLkNVUlNPUl9PVkVSX1RISU5HLCB0aGlzLm9wdGlvbnMudGhpbmcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25JbnB1dE91dCgpOiB2b2lkIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuQ1VSU09SX09VVF9USElORywgdGhpcy5vcHRpb25zLnRoaW5nKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcbmltcG9ydCB7IHBoYXNlciB9IGZyb20gJy4uLy4uL1BoYXNlcic7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IHN0eWxlIH0gZnJvbSAnLi9TdHlsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBJQ2FsbGJhY2sgfSBmcm9tICcuLi91dGlscy9PYnNlcnZhYmxlJztcblxuZXhwb3J0IGVudW0gUGFnaW5hdGlvbkJ1dHRvblR5cGUge1xuICAgIFVQID0gMSxcbiAgICBET1dOXG59O1xuXG5pbnRlcmZhY2UgSUludmVudG9yeVBhZ2luYXRpb25CdXR0b25PcHRpb25zIHtcbiAgICB0eXBlOiBQYWdpbmF0aW9uQnV0dG9uVHlwZVxufVxuXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5UGFnaW5hdGlvbkJ1dHRvbiB7XG5cbiAgICBwcml2YXRlIGJ1dHRvbjogUGhhc2VyLkJ1dHRvbjtcbiAgICBwcml2YXRlIGNsaWNrT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogSUludmVudG9yeVBhZ2luYXRpb25CdXR0b25PcHRpb25zKSB7XG4gICAgICAgIHRoaXMuY2xpY2tPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVCdXR0b24oKTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NsaWNrKGNhbGxiYWNrOiBJQ2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5jbGlja09ic2VydmFibGUucmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCdXR0b24oKTogdm9pZCB7XG4gICAgICAgIGxldCBwb3NpdGlvbjogSVBvaW50O1xuICAgICAgICBpZih0aGlzLm9wdGlvbnMudHlwZSA9PT0gUGFnaW5hdGlvbkJ1dHRvblR5cGUuVVApIHtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbGF5b3V0LmdldFBhZ2luYXRpb25CdXR0b25VcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zaXRpb24gPSBsYXlvdXQuZ2V0UGFnaW5hdGlvbkJ1dHRvbkRvd24oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1dHRvbiA9IHBoYXNlckdhbWUudmFsdWUuYWRkLmJ1dHRvbihcbiAgICAgICAgICAgIHBvc2l0aW9uLngsXG4gICAgICAgICAgICBwb3NpdGlvbi55LFxuICAgICAgICAgICAgJ1BBR0lOQVRJT05fQlVUVE9OX1VQJyxcbiAgICAgICAgICAgIHRoaXMub25DbGljayxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy50eXBlID09PSBQYWdpbmF0aW9uQnV0dG9uVHlwZS5ET1dOKSB7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zY2FsZS55ID0gLTE7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5hbmNob3Iuc2V0VG8oMCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgdWlMYXllcnMudmVyYkJ1dHRvbnMuYWRkKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgdGhpcy5idXR0b24uZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsaWNrT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnMobnVsbCk7XG4gICAgfVxufSIsImltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBJbnZlbnRvcnlJdGVtVUkgfSBmcm9tICcuL0ludmVudG9yeUl0ZW1VSSc7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi9zdGF0ZS9BY3RpdmVJbnZlbnRvcnkuc2luZ2xldG9uJztcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4uL21vZGVscy9JbnZlbnRvcnknO1xuaW1wb3J0IHsgUGFnaW5hdGlvbkJ1dHRvblR5cGUsIEludmVudG9yeVBhZ2luYXRpb25CdXR0b24gfSBmcm9tICcuL0ludmVudG9yeVBhZ2luYXRpb25CdXR0b24nO1xuXG5jb25zdCBJVEVNU19QRVJfUEFHRSA9IDY7XG5cbmV4cG9ydCBjbGFzcyBJbnZlbnRvcnlVSSB7XG5cbiAgICBwcml2YXRlIGN1cnJlbnRQYWdlOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBpdGVtczogU2V0PEludmVudG9yeUl0ZW1VST47XG4gICAgcHJpdmF0ZSBjdXJyZW50SW52ZW50b3J5OiBJbnZlbnRvcnk7XG4gICAgcHJpdmF0ZSBwYWdpbmF0aW9uQnV0dG9uVXA6IEludmVudG9yeVBhZ2luYXRpb25CdXR0b247XG4gICAgcHJpdmF0ZSBwYWdpbmF0aW9uQnV0dG9uRG93bjogSW52ZW50b3J5UGFnaW5hdGlvbkJ1dHRvbjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gMDtcbiAgICAgICAgdGhpcy5jcmVhdGVCYWNrZ3JvdW5kKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlUGFnaW5hdGlvbkJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBTZXQoKTtcblxuICAgICAgICBhY3RpdmVJbnZlbnRvcnkuc3Vic2NyaWJlVG9DaGFuZ2UoKG5ld0ludmVudG9yeSkgPT4gdGhpcy5pbnZlbnRvcnlDaGFuZ2VkKG5ld0ludmVudG9yeSkpXG4gICAgfVxuXG4gICAgLy8gcmVmcmVzaCgpIHtcbiAgICAvLyAgICAgdGhpcy5pbnZlbnRvcnlDaGFuZ2VkKGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKSk7XG4gICAgLy8gfVxuXG4gICAgcHJpdmF0ZSBpbnZlbnRvcnlDaGFuZ2VkKG5ld0ludmVudG9yeTogSW52ZW50b3J5KTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VycmVudEludmVudG9yeSA9IG5ld0ludmVudG9yeTtcbiAgICAgICAgdGhpcy5jcmVhdGVJdGVtcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQmFja2dyb3VuZCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGxheW91dFN0YXJ0UG9zaXRpb24gPSBsYXlvdXQuSU5WRU5UT1JZX1NUQVJUX1BPU0lUSU9OO1xuXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kID0gdWlMYXllcnMudmVyYkJ1dHRvbnMuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICBsYXlvdXRTdGFydFBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgICAgIGxheW91dFN0YXJ0UG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICAgICAgJ1VJX0lOVl9CRycpO1xuICAgICAgICBiYWNrZ3JvdW5kLmFuY2hvci5zZXRUbygwLCAwKTtcbiAgICAgICAgYmFja2dyb3VuZC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVBhZ2luYXRpb25CdXR0b25zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25VcCA9IG5ldyBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uKHt0eXBlOiBQYWdpbmF0aW9uQnV0dG9uVHlwZS5VUCB9KTtcbiAgICAgICAgdGhpcy5wYWdpbmF0aW9uQnV0dG9uRG93biA9IG5ldyBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uKHt0eXBlOiBQYWdpbmF0aW9uQnV0dG9uVHlwZS5ET1dOIH0pO1xuXG4gICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvblVwLnN1YnNjcmliZVRvQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nb1RvUHJldlBhZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wYWdpbmF0aW9uQnV0dG9uRG93bi5zdWJzY3JpYmVUb0NsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ29Ub05leHRQYWdlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlSXRlbXMoKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5kZXN0cm95UHJldkl0ZW1zKCk7XG5cbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgbGV0IGFycmF5T2ZUaGluZ3MgPSBBcnJheS5mcm9tKHRoaXMuY3VycmVudEludmVudG9yeS5pdGVtcyk7XG4gICAgICAgIGxldCBmaXJzdFBhZ2VFbGVtZW50ID0gSVRFTVNfUEVSX1BBR0UgKiB0aGlzLmN1cnJlbnRQYWdlO1xuICAgICAgICBsZXQgbmV4dFBhZ2VGaXJzdEVsZW1lbnQgPSBJVEVNU19QRVJfUEFHRSAqICh0aGlzLmN1cnJlbnRQYWdlICsgMSk7XG4gICAgICAgIGZvcihsZXQgaSA9IGZpcnN0UGFnZUVsZW1lbnQ7IChpIDwgbmV4dFBhZ2VGaXJzdEVsZW1lbnQpICYmIChpIDwgYXJyYXlPZlRoaW5ncy5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuYWRkKFxuICAgICAgICAgICAgICAgIG5ldyBJbnZlbnRvcnlJdGVtVUkoe1xuICAgICAgICAgICAgICAgICAgICB0aGluZzogYXJyYXlPZlRoaW5nc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95UHJldkl0ZW1zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiBpdGVtLmRlc3Ryb3koKSk7XG4gICAgICAgIHRoaXMuaXRlbXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdvVG9OZXh0UGFnZSgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50SW52ZW50b3J5Lml0ZW1zLnNpemUgPj0gKElURU1TX1BFUl9QQUdFICogKHRoaXMuY3VycmVudFBhZ2UgKyAxKSkpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UrKztcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlSXRlbXMoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIGdvVG9QcmV2UGFnZSgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50UGFnZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UtLTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlSXRlbXMoKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcblxuY29uc3QgVkVSQl9CVVRUT05fSEVJR0hUOiBudW1iZXIgPSAzNjtcbmNvbnN0IENVUlJFTlRfQUNUSU9OX0lORk9fSEVJR0hUID0gNDA7XG5jb25zdCBWRVJCX0JVVFRPTl9XSURUSCA9IDE1MDtcbmNvbnN0IFJFRkxFQ1RfQlVUVE9OX1dJRFRIID0gVkVSQl9CVVRUT05fV0lEVEg7XG5cbmNvbnN0IENVUlJFTlRfQUNUSU9OX0lORk9fUEFERElOR19YID0gNTtcbmNvbnN0IENVUlJFTlRfQUNUSU9OX0lORk9fUEFERElOR19ZID0gNztcblxuY29uc3QgVkVSQlNfUk9XUyA9IDM7XG5jb25zdCBWRVJCX0NPTFVNTlMgPSAzO1xuXG5jb25zdCBJTlZfUk9XUyA9IDI7XG5jb25zdCBJTlZfQ09MVU1OUyA9IDM7XG5jb25zdCBJTlZfSVRFTV9XSURUSCA9IDEzNjtcbmNvbnN0IElOVl9JVEVNX0hFSUdIVCA9IDUyO1xuXG5jb25zdCBDT05WRVJTQVRJT05fTElORV9IRUlHSFQgPSBDVVJSRU5UX0FDVElPTl9JTkZPX0hFSUdIVDtcbmNvbnN0IENPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWCA9IDU7XG5jb25zdCBDT05WRVJTQVRJT05fTElORV9QQURESU5HX1kgPSA2O1xuXG5jb25zdCBMT0dPX1NJWkU6IElQb2ludCA9IHtcbiAgICB4OiA1MDIsXG4gICAgeTogMTc1XG59O1xuY29uc3QgVEhFX0dBTUVfU0laRTogSVBvaW50ID0ge1xuICAgIHg6IDE1MCxcbiAgICB5OiA0M1xufTtcbmNvbnN0IExBTkdVQUdFX0JVVFRPTl9TSVpFOiBJUG9pbnQgPSB7XG4gICAgeDogMTM2LFxuICAgIHk6IDI3XG59O1xuXG5jbGFzcyBMYXlvdXRNYW5hZ2VyIHtcblxuICAgIExBWU9VVF9XSURUSDogbnVtYmVyID0gMTA2NjtcbiAgICBMQVlPVVRfSEVJR0hUOiBudW1iZXIgPSA2MDA7XG4gICAgTEFZT1VUX1pPT006IG51bWJlciA9IDI7XG4gICAgXG4gICAgTEFZT1VUX0RFRkFVTFRfTUFSR0lOOiBudW1iZXIgPSAxO1xuICAgIFZFUkJfQlVUVE9OX01BUkdJTjogbnVtYmVyID0gdGhpcy5MQVlPVVRfREVGQVVMVF9NQVJHSU47XG5cbiAgICBnZXQgV0lEVEgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuTEFZT1VUX1dJRFRIIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgSEVJR0hUKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkxBWU9VVF9IRUlHSFQgLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBWRVJCU19IRUlHSFQoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IG1hcmdpblkgPSAoVkVSQlNfUk9XUyArIDEpICogdGhpcy5WRVJCX0JVVFRPTl9NQVJHSU47XG4gICAgICAgIGxldCBoZWlnaHRZID0gVkVSQlNfUk9XUyAqIHRoaXMuVkVSQl9CVVRUT05fSEVJR0hUO1xuICAgICAgICByZXR1cm4gbWFyZ2luWSArIGhlaWdodFk7XG4gICAgfVxuXG4gICAgZ2V0IFZFUkJfQlVUVE9OX0hFSUdIVCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gVkVSQl9CVVRUT05fSEVJR0hUIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgVkVSQlNfWV9TVEFSVCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5IRUlHSFQgLSB0aGlzLlZFUkJTX0hFSUdIVDtcbiAgICB9XG5cbiAgICBnZXQgQ1VSUkVOVF9BQ1RJT05fSU5GT19IRUlHSFQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIENVUlJFTlRfQUNUSU9OX0lORk9fSEVJR0hUIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgVUlfU1RBUlRfUE9TSVRJT04oKTogSVBvaW50IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiB0aGlzLlZFUkJTX1lfU1RBUlQgLSB0aGlzLkNVUlJFTlRfQUNUSU9OX0lORk9fSEVJR0hUXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IFZFUkJfQlVUVE9OX1dJRFRIKCkge1xuICAgICAgICByZXR1cm4gVkVSQl9CVVRUT05fV0lEVEggLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBSRUZMRUNUX0JVVFRPTl9XSURUSCgpIHtcbiAgICAgICAgcmV0dXJuIFJFRkxFQ1RfQlVUVE9OX1dJRFRIIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgQ1VSUkVOVF9BQ1RJT05fUE9TSVRJT04oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBDVVJSRU5UX0FDVElPTl9JTkZPX1BBRERJTkdfWCxcbiAgICAgICAgICAgIHk6IHRoaXMuSEVJR0hUIC0gdGhpcy5WRVJCU19IRUlHSFQgLSB0aGlzLkNVUlJFTlRfQUNUSU9OX0lORk9fSEVJR0hUICsgQ1VSUkVOVF9BQ1RJT05fSU5GT19QQURESU5HX1lcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXQgSU5WRU5UT1JZX1NUQVJUX1BPU0lUSU9OKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRWZXJiQnV0dG9uUG9zaXRpb24oe1xuICAgICAgICAgICAgeDogVkVSQl9DT0xVTU5TLFxuICAgICAgICAgICAgeTogMFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgSU5WX0lURU1fV0lEVEgoKSB7XG4gICAgICAgIHJldHVybiBJTlZfSVRFTV9XSURUSCAvIHRoaXMuTEFZT1VUX1pPT007XG4gICAgfVxuXG4gICAgZ2V0IElOVl9JVEVNX0hFSUdIVCgpIHtcbiAgICAgICAgcmV0dXJuIElOVl9JVEVNX0hFSUdIVCAvIHRoaXMuTEFZT1VUX1pPT007XG4gICAgfVxuXG4gICAgZ2V0VmVyYkJ1dHRvblBvc2l0aW9uKHZlcmJHcmlkUG9zaXRpb246IElQb2ludCk6IElQb2ludCB7XG4gICAgICAgIGxldCBtYXJnaW5YID0gKHZlcmJHcmlkUG9zaXRpb24ueCArIDIpICogdGhpcy5WRVJCX0JVVFRPTl9NQVJHSU47XG4gICAgICAgIGxldCBwb3NpdGlvblggPSB0aGlzLlJFRkxFQ1RfQlVUVE9OX1dJRFRIICsgKHZlcmJHcmlkUG9zaXRpb24ueCAqIHRoaXMuVkVSQl9CVVRUT05fV0lEVEgpO1xuXG4gICAgICAgIGxldCBtYXJnaW5ZID0gKHZlcmJHcmlkUG9zaXRpb24ueSArIDEpICogdGhpcy5WRVJCX0JVVFRPTl9NQVJHSU47XG4gICAgICAgIGxldCBwb3NpdGlvblkgPSB2ZXJiR3JpZFBvc2l0aW9uLnkgKiB0aGlzLlZFUkJfQlVUVE9OX0hFSUdIVDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogbWFyZ2luWCArIHBvc2l0aW9uWCxcbiAgICAgICAgICAgIHk6IHRoaXMuVkVSQlNfWV9TVEFSVCArIG1hcmdpblkgKyBwb3NpdGlvbllcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvbkZvclVJSW52ZW50b3J5SXRlbShpbmRleDogbnVtYmVyKTogSVBvaW50IHtcbiAgICAgICAgbGV0IHtjb2x1bW4sIHJvd30gPSB0aGlzLmdldEludmVudG9yeUl0ZW1Qb3NpdGlvbihpbmRleCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW52ZW50b3J5UG9zaXRpb25Gcm9tUm93QW5kQ29sdW1uKHJvdywgY29sdW1uKTtcbiAgICB9XG5cbiAgICBnZXRSZWZsZWN0QnV0dG9uUG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLkxBWU9VVF9ERUZBVUxUX01BUkdJTixcbiAgICAgICAgICAgIHk6IHRoaXMuVkVSQlNfWV9TVEFSVCArIHRoaXMuTEFZT1VUX0RFRkFVTFRfTUFSR0lOXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0UmVmbGVjdEJ1dHRvblNpemUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuVkVSQlNfSEVJR0hULFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuUkVGTEVDVF9CVVRUT05fV0lEVEhcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXQgQ09OVkVSU0FUSU9OX0xJTkVfSEVJR0hUKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBDT05WRVJTQVRJT05fTElORV9IRUlHSFQgLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBDT05WRVJTQVRJT05fTElORV9QQURESU5HX1goKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIENPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWDtcbiAgICB9XG5cbiAgICBnZXQgQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19ZKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBDT05WRVJTQVRJT05fTElORV9QQURESU5HX1k7XG4gICAgfVxuXG4gICAgZ2V0IExPR09fUE9TSVRJT04oKTogSVBvaW50IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IE1hdGgucm91bmQoKHRoaXMuV0lEVEggLSBMT0dPX1NJWkUueCkvMiksXG4gICAgICAgICAgICB5OiAyMFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldCBUSEVfR0FNRV9QT1NJVElPTigpOiBJUG9pbnQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogTWF0aC5yb3VuZCgodGhpcy5XSURUSCAtIFRIRV9HQU1FX1NJWkUueCkvMiksXG4gICAgICAgICAgICB5OiAxNTVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXQgRU5HTElTSF9CVVRUT05fUE9TSVRJT04oKTogSVBvaW50IHtcbiAgICAgICAgbGV0IHggPSBNYXRoLnJvdW5kKHRoaXMuV0lEVEgvMikgLSBMQU5HVUFHRV9CVVRUT05fU0laRS54IC0gNTtcbiAgICAgICAgbGV0IHkgPSB0aGlzLkhFSUdIVCAtIExBTkdVQUdFX0JVVFRPTl9TSVpFLnkgLSAzMDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IFNQQU5JU0hfQlVUVE9OX1BPU0lUSU9OKCk6IElQb2ludCB7XG4gICAgICAgIGxldCB4ID0gTWF0aC5yb3VuZCh0aGlzLldJRFRILzIpICsgNTtcbiAgICAgICAgbGV0IHkgPSB0aGlzLkhFSUdIVCAtIExBTkdVQUdFX0JVVFRPTl9TSVpFLnkgLSAzMDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0UG9zaXRpb25Gb3JDb252ZXJzYXRpb25MaW5lKGluZGV4OiBudW1iZXIpOiBJUG9pbnQge1xuICAgICAgICBsZXQgbWFyZ2luWSA9IChpbmRleCArIDEpICogdGhpcy5MQVlPVVRfREVGQVVMVF9NQVJHSU47XG4gICAgICAgIGxldCBwb3NpdGlvblkgPSB0aGlzLkNPTlZFUlNBVElPTl9MSU5FX0hFSUdIVCAqIGluZGV4O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5MQVlPVVRfREVGQVVMVF9NQVJHSU4sXG4gICAgICAgICAgICB5OiB0aGlzLlVJX1NUQVJUX1BPU0lUSU9OLnkgKyBtYXJnaW5ZICsgcG9zaXRpb25ZXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0UGFnaW5hdGlvbkJ1dHRvblVwKCk6IElQb2ludCB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBJTlZfQ09MVU1OUztcbiAgICAgICAgbGV0IHJvdyA9IDA7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW52ZW50b3J5UG9zaXRpb25Gcm9tUm93QW5kQ29sdW1uKHJvdywgY29sdW1uKTtcbiAgICB9XG5cbiAgICBnZXRQYWdpbmF0aW9uQnV0dG9uRG93bigpOiBJUG9pbnQge1xuICAgICAgICBsZXQgY29sdW1uID0gSU5WX0NPTFVNTlM7XG4gICAgICAgIGxldCByb3cgPSAxO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmdldEludmVudG9yeVBvc2l0aW9uRnJvbVJvd0FuZENvbHVtbihyb3csIGNvbHVtbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbnZlbnRvcnlQb3NpdGlvbkZyb21Sb3dBbmRDb2x1bW4ocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKTogSVBvaW50IHtcbiAgICAgICAgbGV0IGluaXRpYWxQb3NpdGlvbiA9IHRoaXMuSU5WRU5UT1JZX1NUQVJUX1BPU0lUSU9OO1xuXG4gICAgICAgIGxldCBtYXJnaW5YID0gKGNvbHVtbiArIDEpICogdGhpcy5WRVJCX0JVVFRPTl9NQVJHSU47XG4gICAgICAgIGxldCBwb3NpdGlvblggPSBjb2x1bW4gKiB0aGlzLklOVl9JVEVNX1dJRFRIO1xuXG4gICAgICAgIGxldCBtYXJnaW5ZID0gKHJvdyArIDEpICogdGhpcy5WRVJCX0JVVFRPTl9NQVJHSU47XG4gICAgICAgIGxldCBwb3NpdGlvblkgPSByb3cgKiB0aGlzLklOVl9JVEVNX0hFSUdIVDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogbWFyZ2luWCArIHBvc2l0aW9uWCArIGluaXRpYWxQb3NpdGlvbi54LFxuICAgICAgICAgICAgeTogbWFyZ2luWSArIHBvc2l0aW9uWSArIGluaXRpYWxQb3NpdGlvbi55XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbnZlbnRvcnlJdGVtUG9zaXRpb24oaW5kZXg6IG51bWJlcik6IHtjb2x1bW46IG51bWJlciwgcm93OiBudW1iZXJ9IHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IGluZGV4ICUgSU5WX0NPTFVNTlM7XG4gICAgICAgIGxldCByb3cgPSBNYXRoLmZsb29yKGluZGV4IC8gSU5WX0NPTFVNTlMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29sdW1uOiBjb2x1bW4sXG4gICAgICAgICAgICByb3c6IHJvd1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGxheW91dCA9IG5ldyBMYXlvdXRNYW5hZ2VyKCk7IiwiaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcbmltcG9ydCB7IGxhYmVsIH0gZnJvbSAnLi4vc3RvcmVzL0xhYmVscy5zdG9yZSc7XG5pbXBvcnQgeyBUZXh0V2l0aFNoYWRvdyB9IGZyb20gJy4vVGV4dFdpdGhTaGFkb3cnO1xuaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuXG5leHBvcnQgY2xhc3MgUmVmbGVjdEJ1dHRvbiB7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbjogSVBvaW50O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBsYXlvdXQuZ2V0UmVmbGVjdEJ1dHRvblBvc2l0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVCdXR0b24oKTtcbiAgICAgICAgdGhpcy5jcmVhdGVUZXh0KCk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvbigpOiB2b2lkIHtcbiAgICAgICAgbGV0IGJ1dHRvbiA9IHBoYXNlckdhbWUudmFsdWUuYWRkLmJ1dHRvbihcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCxcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSxcbiAgICAgICAgICAgICdCVVRUT05fQkcnLFxuICAgICAgICAgICAgdGhpcy5vbkNsaWNrLFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMixcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgYnV0dG9uLnNjYWxlLnkgPSAzO1xuICAgICAgICB1aUxheWVycy52ZXJiQnV0dG9ucy5hZGQoYnV0dG9uKTtcbiAgICAgICAgYnV0dG9uLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlVGV4dCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5wb3NpdGlvbi54ICsgbGF5b3V0LmdldFJlZmxlY3RCdXR0b25TaXplKCkud2lkdGggLyAyLFxuICAgICAgICAgICAgeTogdGhpcy5wb3NpdGlvbi55ICsgbGF5b3V0LmdldFJlZmxlY3RCdXR0b25TaXplKCkuaGVpZ2h0IC8gMlxuICAgICAgICB9O1xuICAgICAgICBuZXcgVGV4dFdpdGhTaGFkb3coe1xuICAgICAgICAgICAgaW5pdGlhbFRleHQ6IGxhYmVsKCdSZWZsZWN0JyksXG4gICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgICBmaXhlZFRvQ2FtZXJhOiB0cnVlLFxuICAgICAgICAgICAgbGF5ZXI6IHVpTGF5ZXJzLnZlcmJCdXR0b25zLFxuICAgICAgICAgICAgYW5jaG9yOiB7XG4gICAgICAgICAgICAgICAgeDogMC41LFxuICAgICAgICAgICAgICAgIHk6IDAuNVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uQ2xpY2soKTogdm9pZCB7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLlJFRkxFQ1QpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuLi9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFRleHRJblNjZW5lIH0gZnJvbSAnLi9UZXh0SW5TY2VuZSc7XG5cbmludGVyZmFjZSBJU3BlZWNoQnViYmxlT3B0aW9ucyB7XG4gICAgb3duZXI6IFBsYXllciB8IFRoaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBTcGVlY2hCdWJibGUge1xuXG4gICAgcHJpdmF0ZSB0ZXh0QmVpbmdTYWlkOiBUZXh0SW5TY2VuZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogSVNwZWVjaEJ1YmJsZU9wdGlvbnMpIHt9XG5cbiAgICBzYXkodGV4dDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIC8vVE9ETyBoYW5kbGUgYW5pbWF0aW9uc1xuICAgICAgICB0aGlzLmRlc3Ryb3lQcmV2VGV4dCgpO1xuICAgICAgICB0aGlzLnRleHRCZWluZ1NhaWQgPSBuZXcgVGV4dEluU2NlbmUoe1xuICAgICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLm9wdGlvbnMub3duZXIuZ2V0UG9zaXRpb25PblRvcCgpLFxuICAgICAgICAgICAgYXV0b0Rlc3Ryb3k6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRCZWluZ1NhaWQucHJvbWlzZTtcbiAgICB9XG5cbiAgICBpc1Nob3duKCk6IEJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLnRleHRCZWluZ1NhaWQ7XG4gICAgfVxuXG4gICAgdXBkYXRlUG9zaXRpb24oKTogdm9pZCB7XG4gICAgICAgIGlmKCF0aGlzLmlzU2hvd24oKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGV4dEJlaW5nU2FpZC5zZXRQb3NpdGlvbih0aGlzLm9wdGlvbnMub3duZXIuZ2V0UG9zaXRpb25PblRvcCgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lQcmV2VGV4dCgpOnZvaWQge1xuICAgICAgICBpZiAodGhpcy50ZXh0QmVpbmdTYWlkKSB7XG4gICAgICAgICAgICB0aGlzLnRleHRCZWluZ1NhaWQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy50ZXh0QmVpbmdTYWlkID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBjb25zdCBzdHlsZSA9IE9iamVjdC5mcmVlemUoe1xuICAgIERFRkFVTFRfRk9OVF9TSVpFOiA4LFxuICAgIEZPTlRfU0hBRE9XX1g6IDEsXG4gICAgRk9OVF9TSEFET1dfWTogMSxcbiAgICBDQU1FUkFfRUFTSU5HX0ZBQ1RPUjogMC4wMjUsXG4gICAgREVGQVVMVF9BTklNQVRJT05fU1BFRUQ6IDZcbn0pO1xuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL215LXR5cGluZ3MvbGliLmVzNi5kLnRzXCIgLz5cbmltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuL1N0eWxlJztcbmltcG9ydCB7IFRleHRXaXRoU2hhZG93IH0gZnJvbSAnLi9UZXh0V2l0aFNoYWRvdyc7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IHNjZW5lcyB9IGZyb20gJy4uL3N0YXRlL1NjZW5lcy5zaW5nbGV0b24nO1xuXG5pbnRlcmZhY2UgSVRleHRJblNjZW5lT3B0aW9ucyB7XG4gICAgdGV4dDogc3RyaW5nLFxuICAgIHBvc2l0aW9uOiBJUG9pbnQsXG4gICAgdGltZVBlckxldHRlcj86IG51bWJlcixcbiAgICBtaW5EZXN0cm95VGltZT86IG51bWJlcixcbiAgICB3aWR0aD86IG51bWJlcixcbiAgICBhdXRvRGVzdHJveT86IEJvb2xlYW4sXG4gICAgYW5jaG9yPzogSVBvaW50LFxuICAgIHBhZGRpbmdJblNjcmVlbj86IG51bWJlclxufVxuXG5jb25zdCBERUZBVUxUX1RFWFRfT1BUSU9OUyA9IE9iamVjdC5mcmVlemUoe1xuICAgIHRpbWVQZXJMZXR0ZXI6IDUwLFxuICAgIG1pbkRlc3Ryb3lUaW1lOiAyMDAwLFxuICAgIHRleHQ6ICcnLFxuICAgIHBvc2l0aW9uOiB7IHg6IDEwMCwgeTogMTAwfSxcbiAgICB3aWR0aDogMzAsXG4gICAgYXV0b0Rlc3Ryb3k6IGZhbHNlLFxuICAgIGFuY2hvcjogeyB4OiAwLCB5OiAwfSxcbiAgICBwYWRkaW5nSW5TY3JlZW46IDVcbn0pO1xuXG5leHBvcnQgY2xhc3MgVGV4dEluU2NlbmUge1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50VGV4dDogVGV4dFdpdGhTaGFkb3c7XG4gICAgcHJpdmF0ZSBwcm9taXNlVG9EZXN0cm95OiBQcm9taXNlPGFueT47XG4gICAgcHJpdmF0ZSByZXNvbHZlQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XG4gICAgcHJpdmF0ZSB0aW1lb3V0VG9EZXN0cm95OiBudW1iZXI7XG4gICAgcHJpdmF0ZSB0ZXh0SW5MaW5lczogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9zaXRpb246IElQb2ludDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogSVRleHRJblNjZW5lT3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1RFWFRfT1BUSU9OUywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucy5wb3NpdGlvbik7XG4gICAgICAgIHRoaXMuY3JlYXRlVGV4dCgpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9EZXN0cm95KSB7XG4gICAgICAgICAgICB0aGlzLnByb21pc2VUb0Rlc3Ryb3kgPSB0aGlzLmF1dG9EZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgcHJvbWlzZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZVRvRGVzdHJveTtcbiAgICB9XG5cbiAgICBzZXRQb3NpdGlvbihuZXdQb3NpdGlvbjogSVBvaW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VGV4dCkge1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dC5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRleHQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlc29sdmVDYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZUNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UG9zaXRpb24oKTogSVBvaW50IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMuZ2V0WFBvc2l0aW9uRm9yVGV4dCh0aGlzLnRleHRJbkxpbmVzKSxcbiAgICAgICAgICAgIHk6IHRoaXMuZ2V0WVBvc2l0aW9uRm9yVGV4dCh0aGlzLnRleHRJbkxpbmVzKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVUZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRleHRJbkxpbmVzID0gdGhpcy5hZGRMaW5lc1NlcGFyYXRvcnModGhpcy5vcHRpb25zLnRleHQsIHRoaXMub3B0aW9ucy53aWR0aCk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VGV4dCA9IG5ldyBUZXh0V2l0aFNoYWRvdyh7XG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5nZXRQb3NpdGlvbigpLFxuICAgICAgICAgICAgbGF5ZXI6IHVpTGF5ZXJzLnRleHRJblNjZW5lLFxuICAgICAgICAgICAgaW5pdGlhbFRleHQ6IHRoaXMudGV4dEluTGluZXMsXG4gICAgICAgICAgICBhbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICBhbmNob3I6IHRoaXMub3B0aW9ucy5hbmNob3JcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRMaW5lc1NlcGFyYXRvcnModGV4dDogc3RyaW5nLCBtYXhMaW5lTGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcge1xuXG4gICAgICAgIGxldCB3b3JkcyA9IHRleHQuc3BsaXQoJyAnKTtcbiAgICAgICAgbGV0IGxpbmVzID0gWycnXTtcbiAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gMDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvL0lmIGEgd29yZCBpcyB0b28gYmlnIGZvciB0aGlzIGxpbmUsIGFkZCB0byBuZXh0XG4gICAgICAgICAgICBpZiAoKGxpbmVzW2N1cnJlbnRMaW5lXS5sZW5ndGggKyB3b3Jkc1tpXS5sZW5ndGgpID49IG1heExpbmVMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKCcnICsgd29yZHNbaV0pO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lICsrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5lc1tjdXJyZW50TGluZV0gKz0gJyAnICsgd29yZHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0WFBvc2l0aW9uRm9yVGV4dCh0ZXh0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBsZXQgbG9uZ2VzdExpbmVMZW5ndGggPSB0aGlzLmdldExvbmdlc3RMaW5lTGVuZ3RoKHRleHQpO1xuICAgICAgICBsZXQgbWF4V2lkdGggPSBsb25nZXN0TGluZUxlbmd0aCAqIHN0eWxlLkRFRkFVTFRfRk9OVF9TSVpFO1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5wb3NpdGlvbi54IC0gKG1heFdpZHRoIC8gMik7XG5cbiAgICAgICAgcmVzdWx0ID0gTWF0aC5tYXgocmVzdWx0LCB0aGlzLm9wdGlvbnMucGFkZGluZ0luU2NyZWVuKTtcbiAgICAgICAgcmVzdWx0ID0gTWF0aC5taW4ocmVzdWx0LCB0aGlzLmdldE1heFhGb3JUZXh0KG1heFdpZHRoKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE1heFhGb3JUZXh0KHRleHRXaWR0aDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHNjZW5lV2lkdGggPSBzY2VuZXMuY3VycmVudFNjZW5lLnNjZW5lQm91bmRzLndpZHRoO1xuICAgICAgICByZXR1cm4gc2NlbmVXaWR0aCAtIHRoaXMub3B0aW9ucy5wYWRkaW5nSW5TY3JlZW4gLSB0ZXh0V2lkdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRZUG9zaXRpb25Gb3JUZXh0KHRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGxldCBsaW5lcyA9IHRleHQuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICAgICAgbGV0IHRvdGFsSGVpZ2h0ID0gbGluZXMgKiBzdHlsZS5ERUZBVUxUX0ZPTlRfU0laRTtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueSAtIHRvdGFsSGVpZ2h0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TG9uZ2VzdExpbmVMZW5ndGgodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGxldCBtYXhMZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYXhMZW5ndGggPSBNYXRoLm1heChtYXhMZW5ndGgsIGxpbmVzW2ldLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1heExlbmd0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGF1dG9EZXN0cm95KCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxldCBkZWZlcnJlZCA9IG5ldyBQcm9taXNlKChyZXNvbHZlQ2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZUNhbGxiYWNrID0gcmVzb2x2ZUNhbGxiYWNrO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHRpbWVUb0Rlc3Ryb3kgPSB0aGlzLmdldFRpbWVUb0Rlc3Ryb3lGcm9tVGV4dCh0aGlzLm9wdGlvbnMudGV4dCk7XG4gICAgICAgIHRoaXMudGltZW91dFRvRGVzdHJveSA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kZXN0cm95KCksIHRpbWVUb0Rlc3Ryb3kpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaW1lVG9EZXN0cm95RnJvbVRleHQodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHRpbWVUb0Rlc3Ryb3kgPSB0aGlzLm9wdGlvbnMudGltZVBlckxldHRlciAqIHRleHQubGVuZ3RoO1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5vcHRpb25zLm1pbkRlc3Ryb3lUaW1lLCB0aW1lVG9EZXN0cm95KTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcbmltcG9ydCB7IHN0eWxlIH0gZnJvbSAnLi9TdHlsZSc7XG5cbmludGVyZmFjZSBJVGV4dFdpdGhTaGFkb3dPcHRpb25zIHtcbiAgICBwb3NpdGlvbjogSVBvaW50LFxuICAgIGxheWVyOiBQaGFzZXIuR3JvdXAsXG4gICAgaW5pdGlhbFRleHQ/OiBzdHJpbmcsXG4gICAgZml4ZWRUb0NhbWVyYT86IEJvb2xlYW4sXG4gICAgYW5jaG9yPzogSVBvaW50LFxuICAgIGFsaWduPzogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0V2l0aFNoYWRvdyB7XG4gICAgcHJpdmF0ZSBzaGFkb3dUZXh0OiBQaGFzZXIuQml0bWFwVGV4dDtcbiAgICBwcml2YXRlIHRleHQ6IFBoYXNlci5CaXRtYXBUZXh0O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJVGV4dFdpdGhTaGFkb3dPcHRpb25zKSB7XG4gICAgICAgIGxldCBhbmNob3I6IElQb2ludCA9IHRoaXMub3B0aW9ucy5hbmNob3IgfHwge1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IDBcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zaGFkb3dUZXh0ID0gcGhhc2VyR2FtZS52YWx1ZS5hZGQuYml0bWFwVGV4dChcbiAgICAgICAgICAgIDEgKyBvcHRpb25zLnBvc2l0aW9uLngsXG4gICAgICAgICAgICAxICsgb3B0aW9ucy5wb3NpdGlvbi55LFxuICAgICAgICAgICAgJ0ZPTlRfMzJfQkxBQ0snLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmluaXRpYWxUZXh0IHx8ICcnLFxuICAgICAgICAgICAgc3R5bGUuREVGQVVMVF9GT05UX1NJWkVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zaGFkb3dUZXh0LmFuY2hvci5zZXRUbyhhbmNob3IueCwgYW5jaG9yLnkpO1xuICAgICAgICB0aGlzLnNoYWRvd1RleHQuZml4ZWRUb0NhbWVyYSA9ICEhdGhpcy5vcHRpb25zLmZpeGVkVG9DYW1lcmE7XG5cbiAgICAgICAgaWYodGhpcy5vcHRpb25zLmFsaWduKSB7XG4gICAgICAgICAgICB0aGlzLnNoYWRvd1RleHQuYWxpZ24gPSB0aGlzLm9wdGlvbnMuYWxpZ247XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wdGlvbnMubGF5ZXIuYWRkKHRoaXMuc2hhZG93VGV4dCk7XG5cbiAgICAgICAgdGhpcy50ZXh0ID0gcGhhc2VyR2FtZS52YWx1ZS5hZGQuYml0bWFwVGV4dChcbiAgICAgICAgICAgIG9wdGlvbnMucG9zaXRpb24ueCxcbiAgICAgICAgICAgIG9wdGlvbnMucG9zaXRpb24ueSxcbiAgICAgICAgICAgICdGT05UXzMyX1dISVRFJyxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5pbml0aWFsVGV4dCB8fCAnJyxcbiAgICAgICAgICAgIHN0eWxlLkRFRkFVTFRfRk9OVF9TSVpFXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMudGV4dC5hbmNob3Iuc2V0VG8oYW5jaG9yLngsIGFuY2hvci55KTtcbiAgICAgICAgdGhpcy50ZXh0LmZpeGVkVG9DYW1lcmEgPSAhIXRoaXMub3B0aW9ucy5maXhlZFRvQ2FtZXJhO1xuXG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5hbGlnbikge1xuICAgICAgICAgICAgdGhpcy50ZXh0LmFsaWduID0gdGhpcy5vcHRpb25zLmFsaWduO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmxheWVyLmFkZCh0aGlzLnRleHQpO1xuICAgIH1cblxuICAgIHNldFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2hhZG93VGV4dC5zZXRUZXh0KHRleHQpO1xuICAgICAgICB0aGlzLnRleHQuc2V0VGV4dCh0ZXh0KTtcbiAgICB9XG5cbiAgICBzZXRQb3NpdGlvbihuZXdQb3NpdGlvbjogSVBvaW50KTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMudGV4dCAmJiB0aGlzLnNoYWRvd1RleHQpIHtcbiAgICAgICAgICAgIHRoaXMudGV4dC54ID0gbmV3UG9zaXRpb24ueDtcbiAgICAgICAgICAgIHRoaXMudGV4dC55ID0gbmV3UG9zaXRpb24ueTtcbiAgICAgICAgICAgIHRoaXMuc2hhZG93VGV4dC54ID0gbmV3UG9zaXRpb24ueCArIDE7XG4gICAgICAgICAgICB0aGlzLnNoYWRvd1RleHQueSA9IG5ld1Bvc2l0aW9uLnkgKyAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy50ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnRleHQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy50ZXh0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLnNoYWRvd1RleHQpIHtcbiAgICAgICAgICAgIHRoaXMuc2hhZG93VGV4dC5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnNoYWRvd1RleHQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi4vLi4vUGhhc2VyJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcblxuY2xhc3MgVUlCbG9ja2VyIHtcblxuICAgIG92ZXJsYXk6IFBoYXNlci5JbWFnZTtcblxuICAgIGJsb2NrKCkge1xuICAgICAgICBsZXQgZ3JhcGhpY092ZXJsYXkgPSBuZXcgUGhhc2VyLkdyYXBoaWNzKHBoYXNlckdhbWUudmFsdWUsIDAsIDApO1xuICAgICAgICBncmFwaGljT3ZlcmxheS5iZWdpbkZpbGwoMHgwMDAwMDAsIDAuMCk7XG4gICAgICAgIGdyYXBoaWNPdmVybGF5LmRyYXdSZWN0KDAsIDAsIGxheW91dC5XSURUSCwgbGF5b3V0LlVJX1NUQVJUX1BPU0lUSU9OLnkpO1xuICAgICAgICBncmFwaGljT3ZlcmxheS5lbmRGaWxsKCk7XG5cbiAgICAgICAgdGhpcy5vdmVybGF5ID0gcGhhc2VyR2FtZS52YWx1ZS5hZGQuaW1hZ2UoMCwgMCwgZ3JhcGhpY092ZXJsYXkuZ2VuZXJhdGVUZXh0dXJlKCkpO1xuICAgICAgICB0aGlzLm92ZXJsYXkuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgICAgIHRoaXMub3ZlcmxheS5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHVpTGF5ZXJzLnVpQmxvY2tlci5hZGQodGhpcy5vdmVybGF5KTtcbiAgICB9XG5cbiAgICB1bmJsb2NrKCkge1xuICAgICAgICB0aGlzLm92ZXJsYXkuZGVzdHJveSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVpQmxvY2tlciA9IG5ldyBVSUJsb2NrZXIoKTtcblxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL215LXR5cGluZ3MvbGliLmVzNi5kLnRzXCIgLz5cbmltcG9ydCB7IHBoYXNlciB9IGZyb20gJy4uLy4uL1BoYXNlcic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuXG5lbnVtIFVJTGF5ZXJzIHtcbiAgICBCQUNLR1JPVU5ELFxuICAgIEJBQ0tHUk9VTkRfT0JKRUNUUyxcbiAgICBQTEFZRVIsXG4gICAgRk9SRUdST1VORF9PQkpFQ1RTLFxuICAgIEZPUkVHUk9VTkQsXG4gICAgVEVYVF9JTl9TQ0VORSxcbiAgICBHVUlfQkFDS0dST1VORCxcbiAgICBWRVJCX0JVVFRPTlMsXG4gICAgQ09OVkVSU0FUSU9OLFxuICAgIFVJX0JMT0NLRVJcbn1cblxuY2xhc3MgVUlMYXllcnNNYW5hZ2VyIHtcblxuICAgIHByaXZhdGUgZ3JvdXBzOiBNYXA8VUlMYXllcnMsIFBoYXNlci5Hcm91cD47XG4gICAgcHJpdmF0ZSBpbml0aWFsaXNlZDogQm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBpbml0KCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbGlzZWQpIHtcbiAgICAgICAgICAgIGlmICghcGhhc2VyR2FtZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdFUlJPUjogaW5pdGluZyBVSUxheWVycyB3aGVuIGdhbWUgaXMgc3RpbGwgbm90IHRoZXJlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTGF5ZXJzKHBoYXNlckdhbWUudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgYmFja2dyb3VuZCgpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5CQUNLR1JPVU5EKTtcbiAgICB9XG5cbiAgICBnZXQgYmFja2dyb3VuZE9iamVjdHMoKTogUGhhc2VyLkdyb3VwIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3Vwcy5nZXQoVUlMYXllcnMuQkFDS0dST1VORF9PQkpFQ1RTKTtcbiAgICB9XG5cbiAgICBnZXQgcGxheWVyKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLlBMQVlFUik7XG4gICAgfVxuXG4gICAgZ2V0IGZvcmVncm91bmRPYmplY3RzKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLkZPUkVHUk9VTkRfT0JKRUNUUyk7XG4gICAgfVxuXG4gICAgZ2V0IGZvcmVncm91bmQoKTogUGhhc2VyLkdyb3VwIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3Vwcy5nZXQoVUlMYXllcnMuRk9SRUdST1VORCk7XG4gICAgfVxuXG4gICAgZ2V0IHRleHRJblNjZW5lKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLlRFWFRfSU5fU0NFTkUpO1xuICAgIH1cblxuICAgIGdldCBndWlCYWNrZ3JvdW5kKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLkdVSV9CQUNLR1JPVU5EKTtcbiAgICB9XG5cbiAgICBnZXQgdmVyYkJ1dHRvbnMoKTogUGhhc2VyLkdyb3VwIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3Vwcy5nZXQoVUlMYXllcnMuVkVSQl9CVVRUT05TKTtcbiAgICB9XG5cbiAgICBnZXQgY29udmVyc2F0aW9uKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLkNPTlZFUlNBVElPTik7XG4gICAgfVxuXG4gICAgZ2V0IHVpQmxvY2tlcigpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5VSV9CTE9DS0VSKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUxheWVycyhnYW1lOiBQaGFzZXIuR2FtZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmdyb3VwcyA9IG5ldyBNYXAoKTtcblxuICAgICAgICAvL1RPRE86IGRvIHRoaXMgd2l0aCBhIGxvb3BcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLkJBQ0tHUk9VTkQsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuQkFDS0dST1VORF9PQkpFQ1RTLCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLlBMQVlFUiwgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5GT1JFR1JPVU5EX09CSkVDVFMsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuRk9SRUdST1VORCwgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5URVhUX0lOX1NDRU5FLCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLkdVSV9CQUNLR1JPVU5ELCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLlZFUkJfQlVUVE9OUywgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5DT05WRVJTQVRJT04sIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuVUlfQkxPQ0tFUiwgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgdWlMYXllcnMgPSBuZXcgVUlMYXllcnNNYW5hZ2VyKCk7IiwiaW1wb3J0IHsgVmVyYnMgfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9uQnV0dG9uIH0gZnJvbSAnLi9BY3Rpb25CdXR0b24nO1xuaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi9tb2RlbHMvVGhpbmcnO1xuXG5leHBvcnQgY2xhc3MgVmVyYnNVSSB7XG5cbiAgICBwcml2YXRlIGJ1dHRvbnM6IE1hcDxWZXJicywgQWN0aW9uQnV0dG9uPjtcbiAgICBwcml2YXRlIGhpZ2hsaWdodGVkQWN0aW9uOiBWZXJicztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5saXN0ZW5Ub0V2ZW50cygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQnV0dG9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5idXR0b25zID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLkdPX1RPLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLkdPX1RPLFxuICAgICAgICAgICAgICAgICAgICB7eDogMCwgeTogMH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLkxPT0ssXG4gICAgICAgICAgICAgICAgbmV3IEFjdGlvbkJ1dHRvbihcbiAgICAgICAgICAgICAgICAgICAgVmVyYnMuTE9PSyxcbiAgICAgICAgICAgICAgICAgICAge3g6IDAsIHk6IDF9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5HSVZFLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLkdJVkUsXG4gICAgICAgICAgICAgICAgICAgIHt4OiAwLCB5OiAyfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5zZXQoXG4gICAgICAgICAgICAgICAgVmVyYnMuUFVTSCxcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5QVVNILFxuICAgICAgICAgICAgICAgICAgICB7eDogMSwgeTogMH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLlRBS0UsXG4gICAgICAgICAgICAgICAgbmV3IEFjdGlvbkJ1dHRvbihcbiAgICAgICAgICAgICAgICAgICAgVmVyYnMuVEFLRSxcbiAgICAgICAgICAgICAgICAgICAge3g6IDEsIHk6IDF9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5VU0UsXG4gICAgICAgICAgICAgICAgbmV3IEFjdGlvbkJ1dHRvbihcbiAgICAgICAgICAgICAgICAgICAgVmVyYnMuVVNFLFxuICAgICAgICAgICAgICAgIHt4OiAxLCB5OiAyfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5zZXQoXG4gICAgICAgICAgICAgICAgVmVyYnMuU1BFQUssXG4gICAgICAgICAgICAgICAgbmV3IEFjdGlvbkJ1dHRvbihcbiAgICAgICAgICAgICAgICAgICAgVmVyYnMuU1BFQUssXG4gICAgICAgICAgICAgICAgICAgIHt4OiAyLCB5OiAwfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5zZXQoXG4gICAgICAgICAgICAgICAgVmVyYnMuT1BFTixcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5PUEVOLFxuICAgICAgICAgICAgICAgICAgICB7eDogMiwgeTogMX1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLkNMT1NFLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLkNMT1NFLFxuICAgICAgICAgICAgICAgICAgICB7eDogMiwgeTogMn1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgbGlzdGVuVG9FdmVudHMoKTogdm9pZCAge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKFxuICAgICAgICAgICAgQWN0aW9ucy5DVVJTT1JfT1ZFUl9USElORyxcbiAgICAgICAgICAgICh0aGluZykgPT4gdGhpcy5oaWdobGlnaHRTZWNvbmRhcnlBY3Rpb25Gb3JUaGluZyh0aGluZylcbiAgICAgICAgKTtcblxuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKFxuICAgICAgICAgICAgQWN0aW9ucy5DVVJTT1JfT1VUX1RISU5HLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5yZW1vdmVQcmV2aW91c2x5SGlnaGxpZ2h0ZWRBY3Rpb24oKVxuICAgICAgICApO1xuXG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oXG4gICAgICAgICAgICBBY3Rpb25zLkFDVElPTl9BUFBMSUVELFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5yZW1vdmVQcmV2aW91c2x5SGlnaGxpZ2h0ZWRBY3Rpb24oKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGlnaGxpZ2h0U2Vjb25kYXJ5QWN0aW9uRm9yVGhpbmcodGhpbmc6IFRoaW5nKSA6IHZvaWR7XG4gICAgICAgIHRoaXMucmVtb3ZlUHJldmlvdXNseUhpZ2hsaWdodGVkQWN0aW9uKCk7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRBY3Rpb24gPSB0aGluZy5nZXRQcmVmZXJyZWRBY3Rpb24oKTtcbiAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0ZWRBY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9ucy5nZXQodGhpcy5oaWdobGlnaHRlZEFjdGlvbikuaGlnaGxpZ2h0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZVByZXZpb3VzbHlIaWdobGlnaHRlZEFjdGlvbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0ZWRBY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9ucy5nZXQodGhpcy5oaWdobGlnaHRlZEFjdGlvbikudW5oaWdobGlnaHQoKTtcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRBY3Rpb24gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi9PYnNlcnZhYmxlJztcblxuZXhwb3J0IGVudW0gQWN0aW9ucyB7XG4gICAgQ0xJQ0tfU1RBR0UsXG4gICAgU0VMRUNUX1ZFUkIsXG4gICAgU0VMRUNUX1RISU5HLFxuICAgIENVUlNPUl9PVkVSX1RISU5HLFxuICAgIENVUlNPUl9PVVRfVEhJTkcsXG4gICAgQUNUSU9OX0FQUExJRUQsXG4gICAgVEFLRV9PQkpFQ1QsXG4gICAgVVBEQVRFX0lOVkVOVE9SWSxcbiAgICBHT19UT19TQ0VORSxcbiAgICBSRUZMRUNUXG59XG5cbmNsYXNzIEFjdGlvbkRpc3BhdGNoZXIge1xuXG4gICAgcHJpdmF0ZSBvYnNlcnZlcnNQZXJBY3Rpb246IE1hcDxBY3Rpb25zLCBPYnNlcnZhYmxlPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm9ic2VydmVyc1BlckFjdGlvbiA9IG5ldyBNYXAoKTtcbiAgICB9XG5cbiAgICBleGVjdXRlKGFjdGlvbjogQWN0aW9ucywgcGFyYW06IGFueSA9IHt9KSB7XG4gICAgICAgIGxldCBhY3Rpb25PYnNlcnZhYmxlOiBPYnNlcnZhYmxlID0gdGhpcy5vYnNlcnZlcnNQZXJBY3Rpb24uZ2V0KGFjdGlvbik7XG4gICAgICAgIGlmIChhY3Rpb25PYnNlcnZhYmxlKSB7XG4gICAgICAgICAgICBhY3Rpb25PYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyhwYXJhbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUbyhhY3Rpb246IEFjdGlvbnMsIGNhbGxiYWNrOiBJQ2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGFjdGlvbk9ic2VydmFibGU6IE9ic2VydmFibGUgPSB0aGlzLm9ic2VydmVyc1BlckFjdGlvbi5nZXQoYWN0aW9uKTtcbiAgICAgICAgaWYgKCFhY3Rpb25PYnNlcnZhYmxlKSB7XG4gICAgICAgICAgICBhY3Rpb25PYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzUGVyQWN0aW9uLnNldChhY3Rpb24sIGFjdGlvbk9ic2VydmFibGUpO1xuICAgICAgICB9XG4gICAgICAgIGFjdGlvbk9ic2VydmFibGUucmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgYWN0aW9uRGlzcGF0Y2hlciA9IG5ldyBBY3Rpb25EaXNwYXRjaGVyKCk7IiwiZXhwb3J0IGVudW0gRGlyZWN0aW9ucyB7XG4gICAgVVAgPSAxLFxuICAgIERPV04sXG4gICAgTEVGVCxcbiAgICBSSUdIVFxufTtcblxuZXhwb3J0IGNvbnN0IGdldERpcmVjdGlvbk5hbWUgPSBmdW5jdGlvbihkaXJlY3Rpb246IERpcmVjdGlvbnMpIHtcbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgICBjYXNlIERpcmVjdGlvbnMuVVA6XG4gICAgICAgICAgICByZXR1cm4gJ3VwJztcbiAgICAgICAgY2FzZSBEaXJlY3Rpb25zLkRPV046XG4gICAgICAgICAgICByZXR1cm4gJ2Rvd24nO1xuICAgICAgICBjYXNlIERpcmVjdGlvbnMuTEVGVDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICAgICAgY2FzZSBEaXJlY3Rpb25zLlJJR0hUOlxuICAgICAgICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IGdldHRpbmcgZGlyZWN0aW9uIG5hbWUgb2YgdW5leGlzdGluZyBkaXJlY3Rpb24nO1xuICAgIH1cbn07IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL215LXR5cGluZ3MvbGliLmVzNi5kLnRzXCIgLz5cbmV4cG9ydCBpbnRlcmZhY2UgSUNhbGxiYWNrIHtcbiAgICAobmV3VmFsdWU6IGFueSk6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIE9ic2VydmFibGUge1xuICAgIHByaXZhdGUgb2JzZXJ2ZXJzOiBTZXQ8SUNhbGxiYWNrPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm9ic2VydmVycyA9IG5ldyBTZXQoKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9ic2VydmVyKGNhbGxiYWNrOiBJQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMuYWRkKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZW1vdmVPYnNlcnZlcihjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLmRlbGV0ZShjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgbm90aWZ5T2JzZXJ2ZXJzICh2YWx1ZSA6IGFueSkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMuZm9yRWFjaCgob2JzZXJ2ZXI6IElDYWxsYmFjayk9PiB7XG4gICAgICAgICAgICBvYnNlcnZlcih2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgU2VnbWVudCB9IGZyb20gJy4vU2VnbWVudCc7XG5cbmNvbnN0IE1JRERMRV9QT0lOVFNfVE9fQ0hFQ0sgPSAxMDtcbmNvbnN0IE1JTl9ESVNUQU5DRV9UT19CRV9JTl9MSU5FID0gMTtcblxuZnVuY3Rpb24gc29ydGVyQnlYVGhlblkocG9pbnRBOiBJUG9pbnQsIHBvaW50QjogSVBvaW50KTogbnVtYmVyIHtcbiAgICBpZihwb2ludEEueCA9PT0gcG9pbnRCLngpIHtcbiAgICAgICAgcmV0dXJuIHBvaW50QS55IC0gcG9pbnRCLnk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBvaW50QS54IC0gcG9pbnRCLng7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGNyb3NzKHBvaW50TzogSVBvaW50LCBwb2ludEE6IElQb2ludCwgcG9pbnRCOiBJUG9pbnQpOiBudW1iZXIge1xuICAgIHJldHVybiAocG9pbnRBLnggLSBwb2ludE8ueCkgKiAocG9pbnRCLnkgLSBwb2ludE8ueSkgLSAocG9pbnRBLnkgLSBwb2ludE8ueSkgKiAocG9pbnRCLnggLSBwb2ludE8ueCk7XG59XG5cblxuZnVuY3Rpb24gbGluZVNlZ21lbnRzQ3Jvc3MoYTogSVBvaW50LCBiOiBJUG9pbnQsIGM6IElQb2ludCwgZDogSVBvaW50KTogQm9vbGVhbiB7XG4gICAgbGV0IGRlbm9taW5hdG9yID0gKChiLnggLSBhLngpICogKGQueSAtIGMueSkpIC0gKChiLnkgLSBhLnkpICogKGQueCAtIGMueCkpO1xuICAgIGlmIChkZW5vbWluYXRvciA9PT0gMCl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgbnVtZXJhdG9yMSA9ICgoYS55IC0gYy55KSAqIChkLnggLSBjLngpKSAtICgoYS54IC0gYy54KSAqIChkLnkgLSBjLnkpKTtcbiAgICBsZXQgbnVtZXJhdG9yMiA9ICgoYS55IC0gYy55KSAqIChiLnggLSBhLngpKSAtICgoYS54IC0gYy54KSAqIChiLnkgLSBhLnkpKTtcblxuICAgIGlmIChudW1lcmF0b3IxID09PSAwIHx8IG51bWVyYXRvcjIgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCByID0gbnVtZXJhdG9yMSAvIGRlbm9taW5hdG9yO1xuICAgIGxldCBzID0gbnVtZXJhdG9yMiAvIGRlbm9taW5hdG9yO1xuXG4gICAgcmV0dXJuIChyID4gMCAmJiByIDwgMSkgJiYgKHMgPiAwICYmIHMgPCAxKTtcbn1cblxuZXhwb3J0IGNsYXNzIFBvbHlnb24ge1xuXG4gICAgcHJpdmF0ZSBjb252ZXhIdWxsOiBQb2x5Z29uO1xuICAgIHByaXZhdGUgX3NlZ21lbnRzOiBBcnJheTxTZWdtZW50PjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BvaW50czogQXJyYXk8SVBvaW50Pikge1xuICAgICAgICBpZighX3BvaW50cy5sZW5ndGggfHwgX3BvaW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1IgY3JlYXRpbmcgcG9seWdvbiwgaXQgbmVlZHMgYXQgbGVhc3QgMyBwb2ludHMnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHBvaW50cygpOiBBcnJheTxJUG9pbnQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50cztcbiAgICB9XG5cbiAgICBnZXQgc2VnbWVudHMoKTogQXJyYXk8U2VnbWVudD4ge1xuICAgICAgICBpZighdGhpcy5fc2VnbWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2VnbWVudHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc2VnbWVudHM7XG4gICAgfVxuXG4gICAgZ2V0Q29udmV4SHVsbCgpOiBQb2x5Z29uIHtcbiAgICAgICAgaWYoIXRoaXMuY29udmV4SHVsbCkge1xuICAgICAgICAgICAgdGhpcy5jb252ZXhIdWxsID0gdGhpcy5jYWxjdWxhdGVDb252ZXhIdWxsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmV4SHVsbDtcbiAgICB9XG5cbiAgICAvL0NvbmNhdmUgdmVydGV4IGFyZSB0aGUgb25lcyB0aGF0IGRvIG5vdCBiZWxvbmcgdG8gdGhlIGNvbnZleEh1bGxcbiAgICBnZXRDb25jYXZlVmVydGV4KCk6IEFycmF5PElQb2ludD4ge1xuICAgICAgICBsZXQgY29udmV4SHVsbCA9IHRoaXMuZ2V0Q29udmV4SHVsbCgpO1xuICAgICAgICBsZXQgcmVzdWx0OiBBcnJheTxJUG9pbnQ+ID0gW107XG5cbiAgICAgICAgZm9yKGxldCBwb2ludCBvZiB0aGlzLl9wb2ludHMpIHtcbiAgICAgICAgICAgIGlmKCFjb252ZXhIdWxsLmhhc1BvaW50KHBvaW50KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBvaW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgaGFzUG9pbnQocG9pbnRUb1NlYXJjaDogSVBvaW50KTogQm9vbGVhbiB7XG4gICAgICAgIGZvcihsZXQgcG9pbnQgb2YgdGhpcy5fcG9pbnRzKSB7XG4gICAgICAgICAgICBpZigocG9pbnQueCA9PT0gcG9pbnRUb1NlYXJjaC54KSAmJiAocG9pbnQueSA9PT0gcG9pbnRUb1NlYXJjaC55KSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNQb2ludEluc2lkZShwb2ludDogSVBvaW50KTogQm9vbGVhbiB7XG4gICAgICAgIGlmKHRoaXMuaGFzUG9pbnQocG9pbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZih0aGlzLnNlZ21lbnRzW2ldLmRpc3RhbmNlVG9Qb2ludChwb2ludCkgPCBNSU5fRElTVEFOQ0VfVE9fQkVfSU5fTElORSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBwaGFzZXJQb2x5Z29uID0gbmV3IFBoYXNlci5Qb2x5Z29uKHRoaXMucG9pbnRzLm1hcCgoZWFjaFBvaW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBoYXNlci5Qb2ludChlYWNoUG9pbnQueCwgZWFjaFBvaW50LnkpO1xuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBwaGFzZXJQb2x5Z29uLmNvbnRhaW5zKHBvaW50LngsIHBvaW50LnkpO1xuICAgIH1cblxuXG5cbiAgICBnZXRDbG9zZXN0UG9pbnRUbyhwb2ludDogSVBvaW50KTogSVBvaW50IHtcbiAgICAgICAgdmFyIGNsb3Nlc3RTZWdtZW50ID0gdGhpcy5nZXRDbG9zZXN0U2VnbWVudChwb2ludCk7XG4gICAgICAgIHJldHVybiBjbG9zZXN0U2VnbWVudC5nZXRDbG9zZXN0UG9pbnRUbyhwb2ludCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDbG9zZXN0U2VnbWVudChwb2ludDogSVBvaW50KTogU2VnbWVudCB7XG4gICAgICAgIGxldCBzZWdtZW50cyA9IHRoaXMuc2VnbWVudHM7XG4gICAgICAgIGxldCBjbG9zZXN0U2VnbWVudCA9IHRoaXMuc2VnbWVudHNbMF07XG4gICAgICAgIGxldCBtaW5EaXN0YW5jZSA9IGNsb3Nlc3RTZWdtZW50LmRpc3RhbmNlMlRvUG9pbnQocG9pbnQpO1xuICAgICAgICBmb3IobGV0IGkgPSAxOyBpPHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV4dFNlZ21lbnQgPSBzZWdtZW50c1tpXTtcbiAgICAgICAgICAgIGxldCBuZXh0RGlzdGFuY2UgPSBuZXh0U2VnbWVudC5kaXN0YW5jZTJUb1BvaW50KHBvaW50KTtcbiAgICAgICAgICAgIGlmKG5leHREaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VzdFNlZ21lbnQgPSBuZXh0U2VnbWVudDtcbiAgICAgICAgICAgICAgICBtaW5EaXN0YW5jZSA9IG5leHREaXN0YW5jZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbG9zZXN0U2VnbWVudDtcbiAgICB9XG5cbiAgICBwb2ludHNDYW5TZWVFYWNoT3RoZXIocG9pbnRBOiBJUG9pbnQsIHBvaW50QjogSVBvaW50KTogQm9vbGVhbiB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuXG4gICAgICAgIGlmKCF0aGlzLmlzUG9pbnRJbnNpZGUocG9pbnRBKSB8fCAhdGhpcy5pc1BvaW50SW5zaWRlKHBvaW50QikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZighdGhpcy5taWRkbGVQb2ludHNBcmVJbnNpZGUocG9pbnRBLCBwb2ludEIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2VnbWVudHMgPSB0aGlzLnNlZ21lbnRzO1xuICAgICAgICBsZXQgc2VnbWVudEJldHdlZW5Qb2ludHMgPSBuZXcgU2VnbWVudChwb2ludEEsIHBvaW50Qik7XG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZihzZWdtZW50c1tpXS5pc0Nyb3NzZWRCeShzZWdtZW50QmV0d2VlblBvaW50cykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtaWRkbGVQb2ludHNBcmVJbnNpZGUocG9pbnRBOiBJUG9pbnQsIHBvaW50QjogSVBvaW50LCBwb2ludHNUb0NoZWNrOiBudW1iZXIgPSBNSURETEVfUE9JTlRTX1RPX0NIRUNLKTogQm9vbGVhbiB7XG4gICAgICAgIGxldCBwb2ludDEgPSBuZXcgUGhhc2VyLlBvaW50KHBvaW50QS54LCBwb2ludEEueSk7XG4gICAgICAgIGxldCBwb2ludDIgPSBuZXcgUGhhc2VyLlBvaW50KHBvaW50Qi54LCBwb2ludEIueSk7XG5cbiAgICAgICAgZm9yKGxldCBpPTE7IGk8PXBvaW50c1RvQ2hlY2s7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJhdGlvID0gaS8ocG9pbnRzVG9DaGVjayArIDEpO1xuICAgICAgICAgICAgbGV0IHBvaW50SW5CZXR3ZWVuID0gUGhhc2VyLlBvaW50LmludGVycG9sYXRlKHBvaW50MSwgcG9pbnQyLCByYXRpbyk7XG4gICAgICAgICAgICBpZighdGhpcy5pc1BvaW50SW5zaWRlKHsgeDogcG9pbnRJbkJldHdlZW4ueCwgeTogcG9pbnRJbkJldHdlZW4ueX0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBcbiAgICB9XG5cbiAgICAvLyBVc2luZyBodHRwczovL2VuLndpa2lib29rcy5vcmcvd2lraS9BbGdvcml0aG1fSW1wbGVtZW50YXRpb24vR2VvbWV0cnkvQ29udmV4X2h1bGwvTW9ub3RvbmVfY2hhaW5cbiAgICBwcml2YXRlIGNhbGN1bGF0ZUNvbnZleEh1bGwoKTogUG9seWdvbiB7XG4gICAgICAgIGxldCBvcmRlcmVkUG9pbnRzID0gQXJyYXkuZnJvbSh0aGlzLl9wb2ludHMpO1xuICAgICAgICBvcmRlcmVkUG9pbnRzLnNvcnQoc29ydGVyQnlYVGhlblkpO1xuXG4gICAgICAgIHZhciBsb3dlciA6IEFycmF5PElQb2ludD4gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmRlcmVkUG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB3aGlsZSAobG93ZXIubGVuZ3RoID49IDIgJiYgY3Jvc3MobG93ZXJbbG93ZXIubGVuZ3RoIC0gMl0sIGxvd2VyW2xvd2VyLmxlbmd0aCAtIDFdLCBvcmRlcmVkUG9pbnRzW2ldKSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgbG93ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb3dlci5wdXNoKG9yZGVyZWRQb2ludHNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVwcGVyIDogQXJyYXk8SVBvaW50PiA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gb3JkZXJlZFBvaW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgd2hpbGUgKHVwcGVyLmxlbmd0aCA+PSAyICYmIGNyb3NzKHVwcGVyW3VwcGVyLmxlbmd0aCAtIDJdLCB1cHBlclt1cHBlci5sZW5ndGggLSAxXSwgb3JkZXJlZFBvaW50c1tpXSkgPD0gMCkge1xuICAgICAgICAgICAgICAgIHVwcGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBwZXIucHVzaChvcmRlcmVkUG9pbnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICB1cHBlci5wb3AoKTtcbiAgICAgICAgbG93ZXIucG9wKCk7XG4gICAgICAgIHJldHVybiBuZXcgUG9seWdvbihsb3dlci5jb25jYXQodXBwZXIpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNlZ21lbnRzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9zZWdtZW50cyA9IFtdO1xuICAgICAgICBmb3IobGV0IGk9MDsgaSA8ICh0aGlzLl9wb2ludHMubGVuZ3RoIC0gMSk7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fc2VnbWVudHMucHVzaChuZXcgU2VnbWVudCh0aGlzLl9wb2ludHNbaV0sIHRoaXMuX3BvaW50c1tpKzFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2VnbWVudHMucHVzaChuZXcgU2VnbWVudCh0aGlzLl9wb2ludHNbdGhpcy5fcG9pbnRzLmxlbmd0aCAtIDFdLCB0aGlzLl9wb2ludHNbMF0pKTtcbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuXG5jbGFzcyBSYW5kb21UZXh0IHtcbiAgICBwcml2YXRlIG9yaWdpbmFsUGhyYXNlczogQXJyYXk8c3RyaW5nPjtcbiAgICBwcml2YXRlIHBocmFzZXM6IEFycmF5PHN0cmluZz47XG4gICAgcHJpdmF0ZSBsYXN0VGV4dDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocGhyYXNlczogQXJyYXk8c3RyaW5nPikge1xuICAgICAgICB0aGlzLm9yaWdpbmFsUGhyYXNlcyA9IHBocmFzZXM7XG4gICAgICAgIHRoaXMuY3JlYXRlU2V0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTZXQoKSB7XG4gICAgICAgIHRoaXMucGhyYXNlcyA9IHRoaXMub3JpZ2luYWxQaHJhc2VzLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmVzdWx0OiBzdHJpbmc7XG5cbiAgICAgICAgaWYgKHRoaXMucGhyYXNlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMucGhyYXNlc1swXTtcbiAgICAgICAgICAgIHRoaXMubGFzdFRleHQgPSByZXN1bHQ7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNldCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcih0aGlzLnBocmFzZXMubGVuZ3RoICogTWF0aC5yYW5kb20oKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5waHJhc2VzW3JhbmRvbUluZGV4XSA9PT0gdGhpcy5sYXN0VGV4dCkge1xuICAgICAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gKHJhbmRvbUluZGV4ICsgMSkgJSB0aGlzLnBocmFzZXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5waHJhc2VzW3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHRoaXMucGhyYXNlcy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy5sYXN0VGV4dCA9IHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuXG5jbGFzcyBSYW5kb21UZXh0RmFjdG9yeSB7XG4gICAgcHJpdmF0ZSBnZW5lcmF0b3JzOiBNYXA8c3RyaW5nLCBSYW5kb21UZXh0PjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3JzID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIGdldFJhbmRvbVRleHQoLi4ucGhyYXNlczogQXJyYXk8c3RyaW5nPik6IHN0cmluZyB7XG4gICAgICAgIGxldCBwaHJhc2VzSWQgPSB0aGlzLmdldElkRnJvbVBocmFzZXMocGhyYXNlcyk7XG4gICAgICAgIGxldCBnZW5lcmF0b3IgPSB0aGlzLmdlbmVyYXRvcnMuZ2V0KHBocmFzZXNJZCk7XG4gICAgICAgIGlmICghZ2VuZXJhdG9yKSB7XG4gICAgICAgICAgICBnZW5lcmF0b3IgPSBuZXcgUmFuZG9tVGV4dChwaHJhc2VzKTtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdG9ycy5zZXQocGhyYXNlc0lkLCBnZW5lcmF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZW5lcmF0b3IuZ2V0UmFuZG9tVGV4dCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SWRGcm9tUGhyYXNlcyhwaHJhc2VzOiBBcnJheTxzdHJpbmc+ID0gW10pOiBzdHJpbmcge1xuICAgICAgICBsZXQgaWQgPSBwaHJhc2VzLmpvaW4oJyMnKTtcbiAgICAgICAgaWYgKGlkID09PSAnJykge1xuICAgICAgICAgICAgaWQgPSAnIyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxufVxuY29uc3QgdGV4dEZhY3RvcnkgPSBuZXcgUmFuZG9tVGV4dEZhY3RvcnkoKTtcbmV4cG9ydCBjb25zdCByYW5kb21UZXh0ID0gKC4uLnBocmFzZXM6IEFycmF5PHN0cmluZz4pID0+IHtcbiAgICByZXR1cm4gdGV4dEZhY3RvcnkuZ2V0UmFuZG9tVGV4dCguLi5waHJhc2VzKTtcbn07IiwiaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi9JbnRlcmZhY2VzJztcblxuZnVuY3Rpb24gc3FyKHg6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHggKiB4O1xufVxuXG5mdW5jdGlvbiBkaXN0YW5jZTIocG9pbnRBOiBJUG9pbnQsIHBvaW50QjogSVBvaW50KTogbnVtYmVyIHtcbiAgICByZXR1cm4gc3FyKHBvaW50QS54IC0gcG9pbnRCLngpICsgc3FyKHBvaW50QS55IC0gcG9pbnRCLnkpO1xufVxuXG5leHBvcnQgY2xhc3MgU2VnbWVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcG9pbnRBOiBJUG9pbnQsIHB1YmxpYyBwb2ludEI6IElQb2ludCkge31cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChkaXN0YW5jZTIodGhpcy5wb2ludEEsIHRoaXMucG9pbnRCKSk7XG4gICAgfVxuXG4gICAgLy9CYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNTAxNzI1LzM0OTMzODhcbiAgICBkaXN0YW5jZVRvUG9pbnQocG9pbnQ6IElQb2ludCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kaXN0YW5jZTJUb1BvaW50KHBvaW50KSk7XG4gICAgfVxuXG4gICAgZGlzdGFuY2UyVG9Qb2ludChwb2ludDogSVBvaW50KTogbnVtYmVyIHtcbiAgICAgICAgdmFyIGxlbmd0aDIgPSBkaXN0YW5jZTIodGhpcy5wb2ludEEsIHRoaXMucG9pbnRCKTtcbiAgICAgICAgaWYobGVuZ3RoMiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRpc3RhbmNlMih0aGlzLnBvaW50QSwgdGhpcy5wb2ludEIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0ID0gKChwb2ludC54IC0gdGhpcy5wb2ludEEueCkgKiAodGhpcy5wb2ludEIueCAtIHRoaXMucG9pbnRBLngpICsgKHBvaW50LnkgLSB0aGlzLnBvaW50QS55KSAqICh0aGlzLnBvaW50Qi55IC0gdGhpcy5wb2ludEEueSkpIC8gbGVuZ3RoMjtcbiAgICAgICAgdCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHQpKTtcblxuICAgICAgICByZXR1cm4gZGlzdGFuY2UyKHBvaW50LCB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvaW50QS54ICsgdCAqICh0aGlzLnBvaW50Qi54IC0gdGhpcy5wb2ludEEueCksXG4gICAgICAgICAgICB5OiB0aGlzLnBvaW50QS55ICsgdCAqICh0aGlzLnBvaW50Qi55IC0gdGhpcy5wb2ludEEueSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvL0Jhc2VkIG9uIGh0dHA6Ly93d3cuamF2YTJzLmNvbS9Db2RlL0phdmEvMkQtR3JhcGhpY3MtR1VJL1JldHVybnNjbG9zZXN0cG9pbnRvbnNlZ21lbnR0b3BvaW50Lmh0bVxuICAgIGdldENsb3Nlc3RQb2ludFRvKHBvaW50OiBJUG9pbnQpOiBJUG9pbnQge1xuICAgICAgICBsZXQgeERlbHRhID0gdGhpcy5wb2ludEIueCAtIHRoaXMucG9pbnRBLng7XG4gICAgICAgIGxldCB5RGVsdGEgPSB0aGlzLnBvaW50Qi55IC0gdGhpcy5wb2ludEEueTtcblxuICAgICAgICBpZigoeERlbHRhID09PSAwKSAmJiAoeURlbHRhID09PSAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRBOyAvL0xpbmUgaXMgYWN0dWFsbHkgYSBwb2ludFxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHUgPSAoKHBvaW50LnggLSB0aGlzLnBvaW50QS54KSAqIHhEZWx0YSArIChwb2ludC55IC0gdGhpcy5wb2ludEEueSkgKiB5RGVsdGEpIC8gKHhEZWx0YSAqIHhEZWx0YSArIHlEZWx0YSAqIHlEZWx0YSk7XG5cbiAgICAgICAgaWYodSA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvaW50QTtcbiAgICAgICAgfVxuICAgICAgICBpZih1ID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRCO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvaW50QS54ICsgdSAqIHhEZWx0YSxcbiAgICAgICAgICAgIHk6IHRoaXMucG9pbnRBLnkgKyB1ICogeURlbHRhXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBpc0Nyb3NzZWRCeShzZWdtZW50OiBTZWdtZW50KTogQm9vbGVhbiB7XG4gICAgICAgIGlmKHRoaXMuaXNFcXVhbChzZWdtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsaW5lMSA9IG5ldyBQaGFzZXIuTGluZSh0aGlzLnBvaW50QS54LCB0aGlzLnBvaW50QS55LCB0aGlzLnBvaW50Qi54LCB0aGlzLnBvaW50Qi55KTtcbiAgICAgICAgbGV0IGxpbmUyID0gbmV3IFBoYXNlci5MaW5lKHNlZ21lbnQucG9pbnRBLngsIHNlZ21lbnQucG9pbnRBLnksIHNlZ21lbnQucG9pbnRCLngsIHNlZ21lbnQucG9pbnRCLnkpO1xuXG4gICAgICAgIHZhciBvdGhlclNlZ21lbnRJbnNpZGVUaGlzID0gbGluZTEucG9pbnRPblNlZ21lbnQoc2VnbWVudC5wb2ludEEueCwgc2VnbWVudC5wb2ludEEueSkgfHwgbGluZTEucG9pbnRPblNlZ21lbnQoc2VnbWVudC5wb2ludEIueCwgc2VnbWVudC5wb2ludEIueSk7XG4gICAgICAgIGlmKG90aGVyU2VnbWVudEluc2lkZVRoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGhpc1NlZ21lbnRJbnNpZGVPdGhlciA9IGxpbmUyLnBvaW50T25TZWdtZW50KHRoaXMucG9pbnRBLngsIHRoaXMucG9pbnRBLnkpIHx8IGxpbmUyLnBvaW50T25TZWdtZW50KHRoaXMucG9pbnRCLngsIHRoaXMucG9pbnRCLnkpO1xuICAgICAgICBpZih0aGlzU2VnbWVudEluc2lkZU90aGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW50ZXJzZWN0aW9uID0gbGluZTEuaW50ZXJzZWN0cyhsaW5lMiwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuICEhaW50ZXJzZWN0aW9uO1xuICAgIH1cblxuICAgIC8vIHByaXZhdGUgbGluZVRvU3RyaW5nKGxpbmU6IFBoYXNlci5MaW5lKTogc3RyaW5nIHtcbiAgICAvLyAgICAgcmV0dXJuICdbKCcgKyBsaW5lLnN0YXJ0LnggKyAnLCcgKyBsaW5lLnN0YXJ0LnkgKyAnKS0oJyArIGxpbmUuZW5kLnggKyAnLCcgKyBsaW5lLmVuZC55ICsgJyldJztcbiAgICAvLyB9XG5cbiAgICBpc0VxdWFsKHNlZ21lbnQ6IFNlZ21lbnQpOiBCb29sZWFuIHtcbiAgICAgICAgaWYodGhpcy5wb2ludHNBcmVFcXVhbCh0aGlzLnBvaW50QSwgc2VnbWVudC5wb2ludEEpICYmIHRoaXMucG9pbnRzQXJlRXF1YWwodGhpcy5wb2ludEIsIHNlZ21lbnQucG9pbnRCKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5wb2ludHNBcmVFcXVhbCh0aGlzLnBvaW50Qiwgc2VnbWVudC5wb2ludEEpICYmIHRoaXMucG9pbnRzQXJlRXF1YWwodGhpcy5wb2ludEEsIHNlZ21lbnQucG9pbnRCKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgcG9pbnRzQXJlRXF1YWwocG9pbnRBOiBJUG9pbnQsIHBvaW50QjogSVBvaW50KTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAocG9pbnRBLnggPT09IHBvaW50Qi54KSAmJiAocG9pbnRBLnkgPT09IHBvaW50Qi55KTtcbiAgICB9XG5cbiAgICAvLyBnZXRNaWRkbGVQb2ludCgpOiBJUG9pbnQge1xuICAgIC8vICAgICByZXR1cm4ge1xuICAgIC8vICAgICAgICAgeDogKHRoaXMucG9pbnRBLnggKyB0aGlzLnBvaW50Qi54KSAvIDIsXG4gICAgLy8gICAgICAgICB5OiAodGhpcy5wb2ludEEueSArIHRoaXMucG9pbnRCLnkpIC8gMlxuICAgIC8vICAgICB9O1xuICAgIC8vIH1cblxuXG59XG5cblxuLy8gcHVibGljIHN0YXRpYyBQb2ludCBnZXRDbG9zZXN0UG9pbnRPblNlZ21lbnQoaW50IHN4MSwgaW50IHN5MSwgaW50IHN4MiwgaW50IHN5MiwgaW50IHB4LCBpbnQgcHkpXG4vLyAgIHtcbi8vICAgICBkb3VibGUgeERlbHRhID0gc3gyIC0gc3gxO1xuLy8gICAgIGRvdWJsZSB5RGVsdGEgPSBzeTIgLSBzeTE7XG5cbi8vICAgICBpZiAoKHhEZWx0YSA9PSAwKSAmJiAoeURlbHRhID09IDApKVxuLy8gICAgIHtcbi8vICAgICAgIHRocm93IG5ldyBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24oXCJTZWdtZW50IHN0YXJ0IGVxdWFscyBzZWdtZW50IGVuZFwiKTtcbi8vICAgICB9XG5cbi8vICAgICBkb3VibGUgdSA9ICgocHggLSBzeDEpICogeERlbHRhICsgKHB5IC0gc3kxKSAqIHlEZWx0YSkgLyAoeERlbHRhICogeERlbHRhICsgeURlbHRhICogeURlbHRhKTtcblxuLy8gICAgIGZpbmFsIFBvaW50IGNsb3Nlc3RQb2ludDtcbi8vICAgICBpZiAodSA8IDApXG4vLyAgICAge1xuLy8gICAgICAgY2xvc2VzdFBvaW50ID0gbmV3IFBvaW50KHN4MSwgc3kxKTtcbi8vICAgICB9XG4vLyAgICAgZWxzZSBpZiAodSA+IDEpXG4vLyAgICAge1xuLy8gICAgICAgY2xvc2VzdFBvaW50ID0gbmV3IFBvaW50KHN4Miwgc3kyKTtcbi8vICAgICB9XG4vLyAgICAgZWxzZVxuLy8gICAgIHtcbi8vICAgICAgIGNsb3Nlc3RQb2ludCA9IG5ldyBQb2ludCgoaW50KSBNYXRoLnJvdW5kKHN4MSArIHUgKiB4RGVsdGEpLCAoaW50KSBNYXRoLnJvdW5kKHN5MSArIHUgKiB5RGVsdGEpKTtcbi8vICAgICB9XG5cbi8vICAgICByZXR1cm4gY2xvc2VzdFBvaW50O1xuLy8gICB9XG4vLyB9XG4iLCJpbnRlcmZhY2UgSUltYWdlc0luZm8ge1xuICAgIFtpbmRleCA6IHN0cmluZ10gOiBzdHJpbmc7XG59O1xuXG5pbnRlcmZhY2UgSVNwcml0ZXNJbmZvIHtcbiAgICBbaW5kZXggOiBzdHJpbmddIDogKHN0cmluZ3xudW1iZXIpW107XG59O1xuXG5pbnRlcmZhY2UgSUZvbnRzSW5mbyB7XG4gICAgW2luZGV4IDogc3RyaW5nXSA6IEFycmF5PHN0cmluZz47XG59O1xuXG5jb25zdCBTUFJJVEVTOiBJU3ByaXRlc0luZm8gPSB7XG4gICAgLy8gVUlcbiAgICAnQlVUVE9OX0JHJzogWydpbWFnZXMvdWkvQlVUVE9OX0JHX1NQUklURS5wbmcnLDc1LCAxOCwgM10sXG4gICAgJ0NPTlZFUlNBVElPTl9MSU5FX0JHJzogWydpbWFnZXMvdWkvQ09OVkVSU0FUSU9OX0xJTkVfQkcucG5nJywgNTI5LCAyMF0sXG4gICAgJ1BBR0lOQVRJT05fQlVUVE9OX1VQJzogWydpbWFnZXMvdWkvUEFHSU5BVElPTl9CVVRUT05fVVAucG5nJywgMTYsIDI1LCA0XSxcbiAgICAnRU5HTElTSF9CVVRUT04nOiBbJ2ltYWdlcy91aS9FTkdMSVNIX0JVVFRPTi5wbmcnLCAxMzYsIDI3LCAzXSxcbiAgICAnU1BBTklTSF9CVVRUT04nOiBbJ2ltYWdlcy91aS9TUEFOSVNIX0JVVFRPTi5wbmcnLCAxMzYsIDI3LCAzXSxcblxuICAgIC8vIFBMQVlFUlxuICAgICdET0NUT1JUSUxMQV9QTEFZRVJfU1BSSVRFJzogWydpbWFnZXMvcGxheWVyL0RPQ1RPUlRJTExBX1BMQVlFUl9TUFJJVEUucG5nJywgNDQsIDYxLCAzM10sXG4gICAgXG4gICAgLy8gQkFDS1NUQUdFXG4gICAgJ1ZFTkRJTkdfTUFDSElORV9TUFJJVEUnOiBbJ2ltYWdlcy9iYWNrc3RhZ2UvVkVORElOR19NQUNISU5FX1NQUklURS5wbmcnLCA0OSwgNzIsIDNdLFxuICAgICdCQU5EX0lOX1NPRkFfU1BSSVRFJzogWydpbWFnZXMvYmFja3N0YWdlL0JBTkRfSU5fU09GQV9TUFJJVEUucG5nJywgNzAsIDc4LCAxOV0sXG4gICAgJ0dMQVNTX0lOVl9TUFJJVEUnOiBbJ2ltYWdlcy9iYWNrc3RhZ2UvR0xBU1NfSU5WX1NQUklURS5wbmcnLCA2OCwgMjYsIDRdLFxuICAgICdDT1NUVU1FX0lOVl9TUFJJVEUnOiBbJ2ltYWdlcy9iYWNrc3RhZ2UvQ09TVFVNRV9JTlZfU1BSSVRFLnBuZycsIDY4LCAyNiwgNF0sXG4gICAgJ0JBQ0tTVEFHRV9ET09SX1RPX0JBQ0tZQVJEX1NQUklURSc6IFsnaW1hZ2VzL2JhY2tzdGFnZS9CQUNLU1RBR0VfRE9PUl9UT19CQUNLWUFSRF9TUFJJVEUucG5nJywgNjEsIDEwNCwgMl0sXG5cbiAgICAvL0JhY2t5YXJkXG4gICAgJ0JBQ0tZQVJEX0RPT1JfVE9fQkFDS1NUQUdFX1NQUklURSc6IFsnaW1hZ2VzL2JhY2t5YXJkL0JBQ0tZQVJEX0RPT1JfVE9fQkFDS1NUQUdFX1NQUklURS5wbmcnLCAzMSwgMTA0LCAyXSxcbiAgICAnQklMSV9TUFJJVEUnOiBbJ2ltYWdlcy9iYWNreWFyZC9CSUxJX1NQUklURS5wbmcnLCA0MywgNzAsIDI0XSxcbiAgICAnQkFMTE9PTl9TUFJJVEUnOiBbJ2ltYWdlcy9iYWNreWFyZC9CQUxMT09OX1NQUklURS5wbmcnLCAyOCwgNTksIDZdXG59O1xuXG5jb25zdCBJTUFHRVM6IElJbWFnZXNJbmZvID0ge1xuICAgIC8vIFVJXG4gICAgJ1VJX0JHJzogJ2ltYWdlcy91aS9VSV9CRy5wbmcnLFxuICAgICdVSV9JTlZfQkcnOiAnaW1hZ2VzL3VpL1VJX0lOVl9CRy5wbmcnLFxuICAgICdVSV9DT05WRVJTQVRJT05fQkcnOiAnaW1hZ2VzL3VpL1VJX0NPTlZFUlNBVElPTl9CRy5wbmcnLFxuICAgICdDT05WRVJTQVRJT05fTElORV9CRyc6ICdpbWFnZXMvdWkvQ09OVkVSU0FUSU9OX0xJTkVfQkcucG5nJyxcbiAgICAnTE9HTyc6ICdpbWFnZXMvdWkvTE9HTy5wbmcnLFxuICAgICdUSEVfR0FNRSc6ICdpbWFnZXMvdWkvVEhFX0dBTUUucG5nJyxcblxuICAgIC8vIEJhY2tzdGFnZSBzY2VuZTpcbiAgICAnQkFDS1NUQUdFX0JHJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQkFDS1NUQUdFX0JHLnBuZycsXG4gICAgJ0NBQkxFJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQ0FCTEUucG5nJyxcbiAgICAnQ0FCTEVfSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQ0FCTEVfSU5WLnBuZycsXG4gICAgJ1NLSVJUJzogJ2ltYWdlcy9iYWNrc3RhZ2UvU0tJUlRfSU5WLnBuZycsXG4gICAgJ0JST09NJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQlJPT00ucG5nJyxcbiAgICAnQlJPT01fSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQlJPT01fSU5WLnBuZycsXG4gICAgJ0JBQ0tZQVJEX0JHJzogJ2ltYWdlcy9iYWNreWFyZC9CQUNLWUFSRF9CRy5wbmcnLFxuICAgICdDQU5fSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQ0FOX0lOVi5wbmcnLFxuICAgICdDT0lOX0lOVic6ICdpbWFnZXMvYmFja3N0YWdlL0NPSU5fSU5WLnBuZycsXG4gICAgJ1NDSVNTT1JTJzogJ2ltYWdlcy9iYWNrc3RhZ2UvU0NJU1NPUlMucG5nJyxcbiAgICAnU0NJU1NPUlNfSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvU0NJU1NPUlNfSU5WLnBuZycsXG4gICAgJ0JPQ0FESUxMTyc6ICdpbWFnZXMvYmFja3N0YWdlL0JPQ0FESUxMTy5wbmcnLFxuICAgICdCT0NBRElMTE9fSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQk9DQURJTExPX0lOVi5wbmcnLFxuICAgICdCUkVBRF9JTlYnOiAnaW1hZ2VzL2JhY2tzdGFnZS9CUkVBRF9JTlYucG5nJyxcbiAgICAnQkFDT05fSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQkFDT05fSU5WLnBuZycsXG4gICAgJ0NPQ09OVVQnOiAnaW1hZ2VzL2JhY2tzdGFnZS9DT0NPTlVULnBuZycsXG4gICAgJ0NPQ09OVVRfSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQ09DT05VVF9JTlYucG5nJyxcbiAgICAnRFVTVCc6ICdpbWFnZXMvYmFja3N0YWdlL0RVU1QucG5nJyxcbiAgICAnRFVTVF9JTlYnOiAnaW1hZ2VzL2JhY2tzdGFnZS9EVVNUX0lOVi5wbmcnLFxuICAgICdHTEFTUyc6ICdpbWFnZXMvYmFja3N0YWdlL0dMQVNTLnBuZycsXG4gICAgJ0xBTVAnOiAnaW1hZ2VzL2JhY2tzdGFnZS9MQU1QLnBuZycsXG4gICAgJ0JBQ0tTVEFHRV9ET09SX1RPX1NUUkVFVCc6ICdpbWFnZXMvYmFja3N0YWdlL0JBQ0tTVEFHRV9ET09SX1RPX1NUUkVFVC5wbmcnLFxuICAgICdCQUNLU1RBR0VfRE9PUl9UT19TVEFHRSc6ICdpbWFnZXMvYmFja3N0YWdlL0JBQ0tTVEFHRV9ET09SX1RPX1NUQUdFLnBuZycsXG4gICAgJ0ZMWV9DQVNFJzogJ2ltYWdlcy9iYWNrc3RhZ2UvRkxZX0NBU0UucG5nJyxcblxuICAgIC8vIEJhY2t5YXJkOlxuICAgICdGTE9XRVJTJzogJ2ltYWdlcy9iYWNreWFyZC9GTE9XRVJTLnBuZycsXG4gICAgJ0ZMT1dFUlNfSU5WJzogJ2ltYWdlcy9iYWNreWFyZC9GTE9XRVJTX0lOVi5wbmcnLFxuICAgICdMQU1QX0JBQ0tZQVJEJzogJ2ltYWdlcy9iYWNreWFyZC9MQU1QX0JBQ0tZQVJELnBuZycsXG4gICAgJ01PT04nOiAnaW1hZ2VzL2JhY2t5YXJkL01PT04ucG5nJyxcbiAgICAnU1RBUic6ICdpbWFnZXMvYmFja3lhcmQvU1RBUi5wbmcnLFxuICAgICdDVVRfRkxPV0VSUyc6ICdpbWFnZXMvYmFja3lhcmQvQ1VUX0ZMT1dFUlMucG5nJ1xufTtcblxuY29uc3QgRk9OVFM6IElGb250c0luZm8gPSB7XG4gICAgJ0ZPTlRfMzJfQkxBQ0snOiBbJ2ltYWdlcy9mb250cy9mb250XzMyX2JsYWNrLnBuZycsICdpbWFnZXMvZm9udHMvZm9udF8zMl9ibGFjay5mbnQnXSxcbiAgICAnRk9OVF8zMl9XSElURSc6IFsnaW1hZ2VzL2ZvbnRzL2ZvbnRfMzJfd2hpdGUucG5nJywgJ2ltYWdlcy9mb250cy9mb250XzMyX3doaXRlLmZudCddLFxuICAgICdGT05UXzMyX09SQU5HRSc6IFsnaW1hZ2VzL2ZvbnRzL2ZvbnRfMzJfb3JhbmdlLnBuZycsICdpbWFnZXMvZm9udHMvZm9udF8zMl9vcmFuZ2UuZm50J11cbn07XG5cbmNsYXNzIEFzc2V0c01hbmFnZXIge1xuXG4gICAgbG9hZEFzc2V0cyhnYW1lOiBQaGFzZXIuR2FtZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvYWRJbWFnZXMoZ2FtZSk7XG4gICAgICAgIHRoaXMubG9hZFNwcml0ZXMoZ2FtZSk7XG4gICAgICAgIHRoaXMubG9hZEZvbnRzKGdhbWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZEltYWdlcyhnYW1lOiBQaGFzZXIuR2FtZSk6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBpbWFnZUtleSBpbiBJTUFHRVMpIHtcbiAgICAgICAgICAgIGdhbWUubG9hZC5pbWFnZShpbWFnZUtleSwgSU1BR0VTW2ltYWdlS2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRTcHJpdGVzKGdhbWU6IFBoYXNlci5HYW1lKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IHNwcml0ZUtleSBpbiBTUFJJVEVTKSB7XG4gICAgICAgICAgICBnYW1lLmxvYWQuc3ByaXRlc2hlZXQoXG4gICAgICAgICAgICAgICAgc3ByaXRlS2V5LFxuICAgICAgICAgICAgICAgIDxzdHJpbmc+IFNQUklURVNbc3ByaXRlS2V5XVswXSxcbiAgICAgICAgICAgICAgICA8bnVtYmVyPiBTUFJJVEVTW3Nwcml0ZUtleV1bMV0sXG4gICAgICAgICAgICAgICAgPG51bWJlcj4gU1BSSVRFU1tzcHJpdGVLZXldWzJdLFxuICAgICAgICAgICAgICAgIDxudW1iZXI+IFNQUklURVNbc3ByaXRlS2V5XVszXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZEZvbnRzKGdhbWU6IFBoYXNlci5HYW1lKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGZvbnRLZXkgaW4gRk9OVFMpIHtcbiAgICAgICAgICAgIGdhbWUubG9hZC5iaXRtYXBGb250KFxuICAgICAgICAgICAgICAgIGZvbnRLZXksXG4gICAgICAgICAgICAgICAgRk9OVFNbZm9udEtleV1bMF0sXG4gICAgICAgICAgICAgICAgRk9OVFNbZm9udEtleV1bMV1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IGFzc2V0c01hbmFnZXIgPSBuZXcgQXNzZXRzTWFuYWdlcigpO1xuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcblxuZXhwb3J0IGNsYXNzIENvaW4gZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgaWQ6ICdjb2luJyxcbiAgICAgICAgICAgIGludmVudG9yeUltYWdlSWQ6ICdDT0lOX0lOVicsXG4gICAgICAgICAgICBuYW1lOiAnY29pbicsXG4gICAgICAgICAgICBkaXJlY3RseUluSW52ZW50b3J5OiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGxvb2tBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0lcXCdtIG5vdCBleGFjdGx5IHJpY2gsIGJ1dCBpdFxcJ3MgYSBzdGFydCEnKTtcbiAgICB9XG5cblxufVxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL2VuZ2luZS9tb2RlbHMvR2FtZSc7XG5pbXBvcnQgeyBET0NUT1JUSUxMQV9MQUJFTFMgfSBmcm9tICcuL0RvY3RvcnRpbGxhTGFiZWxzJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBCYWNrc3RhZ2VTY2VuZSB9IGZyb20gJy4vYmFja3N0YWdlU2NlbmUvQmFja3N0YWdlU2NlbmUnO1xuaW1wb3J0IHsgQmFja3lhcmRTY2VuZSB9IGZyb20gJy4vYmFja3lhcmRTY2VuZS9CYWNreWFyZFNjZW5lJztcblxuZXhwb3J0IGNsYXNzIERvY3RvcnRpbGxhR2FtZSBleHRlbmRzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGxhYmVsczogRE9DVE9SVElMTEFfTEFCRUxTLFxuICAgICAgICAgICAgcGxheWVyOiBuZXcgRG9jdG9ydGlsbGFQbGF5ZXIoKSxcbiAgICAgICAgICAgIHNjZW5lczogW1xuICAgICAgICAgICAgICAgIG5ldyBCYWNrc3RhZ2VTY2VuZSgpLFxuICAgICAgICAgICAgICAgIG5ldyBCYWNreWFyZFNjZW5lKClcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpbml0aWFsU2NlbmVJZDogJ0JBQ0tTVEFHRSdcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSUxhYmVscyAgfSBmcm9tICcuLi9lbmdpbmUvc3RvcmVzL0xhYmVscy5zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBET0NUT1JUSUxMQV9MQUJFTFM6IElMYWJlbHMgPSB7XG4gICAgJ2VzJzoge1xufSxcbiAgICAnZW4nOiB7XG4gICAgfVxufTsiLCJpbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuLi9lbmdpbmUvbW9kZWxzL1BsYXllcic7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuaW1wb3J0IHsgQ29pbiB9IGZyb20gJy4vQmFja3N0YWdlU2NlbmUvQ29pbic7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi9lbmdpbmUvc3RhdGUvQWN0aXZlSW52ZW50b3J5LnNpbmdsZXRvbic7XG5pbXBvcnQgeyBzdHlsZSB9IGZyb20gJy4uL2VuZ2luZS91aS9TdHlsZSc7XG5cbmxldCBzcHJpdGVPcHRpb25zID0gbmV3IE1hcCgpO1xuXG5zcHJpdGVPcHRpb25zLnNldCgnc3RhbmRfcmlnaHQnLCB7IGZyYW1lczogWzBdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnd2Fsa19yaWdodCcsIHsgZnJhbWVzOiBbMSwgMiwgMywgNCwgNSwgNl19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCd0YWxrX3JpZ2h0JywgeyBmcmFtZXM6IFsyMSwgMjIsIDIzLCAyNCwgMjUsIDI2XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3N0YW5kX2xlZnQnLCB7IGZyYW1lczogWzBdLCBpbnZlcnNlOiB0cnVlfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnd2Fsa19sZWZ0JywgeyBmcmFtZXM6IFsxLCAyLCAzLCA0LCA1LCA2XSwgaW52ZXJzZTogdHJ1ZX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3RhbGtfbGVmdCcsIHsgZnJhbWVzOiBbMjEsIDIyLCAyMywgMjQsIDI1LCAyNl0sIGludmVyc2U6IHRydWV9KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCdzdGFuZF91cCcsIHsgZnJhbWVzOiBbMTRdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnd2Fsa191cCcsIHsgZnJhbWVzOiBbMTUsIDE2LCAxNywgMTgsIDE5LCAyMF19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCd0YWxrX3VwJywgeyBmcmFtZXM6IFsxNF19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCdzdGFuZF9kb3duJywgeyBmcmFtZXM6IFs3XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3dhbGtfZG93bicsIHsgZnJhbWVzOiBbOCwgOSwgMTAsIDExLCAxMiwgMTNdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgndGFsa19kb3duJywgeyBmcmFtZXM6IFsyNywgMjgsIDI5LCAzMCwgMzEsIDMyXX0pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIHNwcml0ZUlkOiAnRE9DVE9SVElMTEFfUExBWUVSX1NQUklURScsXG4gICAgaW5pdGlhbFg6IDIwMCxcbiAgICBpbml0aWFsWTogMjAwLFxuICAgIHhTcGVlZDogODAsIC8vcHgvc1xuICAgIHlTcGVlZDogNTUsIC8vcHgvc1xuICAgIGFuaW1hdGlvblNwZWVkOiBzdHlsZS5ERUZBVUxUX0FOSU1BVElPTl9TUEVFRCxcbiAgICBzcHJpdGVPcHRpb25zOiBzcHJpdGVPcHRpb25zXG59O1xuXG5cbmV4cG9ydCBjbGFzcyBEb2N0b3J0aWxsYVBsYXllciBleHRlbmRzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQobmV3IENvaW4oKSk7XG4gICAgfVxuXG4gICAgcmVmbGVjdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zYXkocmFuZG9tVGV4dCgnTm93IEkgc2hvdWxkIHNheSBzb21ldGhpbmcgc21hcnQgdGhhdCBoZWxwcycsXG4gICAgICAgICAgICAnVGhpcyBpcyBhIHByZXR0eSBuaWNlIHJvb20nLFxuICAgICAgICAgICAgJ01hbiwgSSByZWFsbHkgd2FudCB0byBwbGF5IHRoYXQgY29uY2VydCcsXG4gICAgICAgICAgICAnUHJvYmFibHkgSSBzaG91bGQgZmluZCB0aGUgcmVzdCBvZiB0aGUgYmFuZC4uLicpKTtcbiAgICB9XG5cbiAgICBoYXNDb21wbGV0ZUNvc3R1bWUoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHIoJ0NPU1RVTUVfQ09NUExFVEUnKTtcbiAgICB9XG5cbiAgICBoYXNDYWJsZSgpOiBCb29sZWFuIHtcbiAgICAgICAgbGV0IGludmVudG9yeSA9IGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKTtcbiAgICAgICAgbGV0IGNhYmxlID0gaW52ZW50b3J5LmdldEJ5SWQoJ2NhYmxlJyk7XG4gICAgICAgIHJldHVybiAhIWNhYmxlO1xuICAgIH1cblxuICAgIGhhc0Z1bm55RHJpbmsoKTogQm9vbGVhbiB7XG4gICAgICAgIGxldCBpbnZlbnRvcnkgPSBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCk7XG4gICAgICAgIGxldCBnbGFzcyA9IDxhbnk+IGludmVudG9yeS5nZXRCeUlkKCdnbGFzcycpO1xuICAgICAgICByZXR1cm4gZ2xhc3MgJiYgZ2xhc3MuaXNGdW5ueSgpO1xuICAgIH1cblxuICAgIHJlbW92ZUNvc3R1bWUoKTogdm9pZCB7XG4gICAgICAgIGxldCBpbnZlbnRvcnkgPSBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCk7XG4gICAgICAgIGxldCBjb3N0dW1lID0gaW52ZW50b3J5LmdldEJ5SWQoJ2Nvc3R1bWUnKTtcbiAgICAgICAgaW52ZW50b3J5LnJlbW92ZShjb3N0dW1lKTtcbiAgICB9XG5cbiAgICByZW1vdmVDYWJsZSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGludmVudG9yeSA9IGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKTtcbiAgICAgICAgbGV0IGNhYmxlID0gaW52ZW50b3J5LmdldEJ5SWQoJ2NhYmxlJyk7XG4gICAgICAgIGludmVudG9yeS5yZW1vdmUoY2FibGUpO1xuICAgIH1cblxuICAgIHJlbW92ZUdsYXNzKCk6IHZvaWQge1xuICAgICAgICBsZXQgaW52ZW50b3J5ID0gYWN0aXZlSW52ZW50b3J5LmdldEFjdGl2ZUludmVudG9yeSgpO1xuICAgICAgICBsZXQgZ2xhc3MgPSBpbnZlbnRvcnkuZ2V0QnlJZCgnZ2xhc3MnKTtcbiAgICAgICAgaW52ZW50b3J5LnJlbW92ZShnbGFzcyk7XG4gICAgfVxuXG4gICAgZGVsaXZlcmVkRXZlcnl0aGluZygpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cignREVMSVZFUkVEX0NBQkxFJykgJiYgdGhpcy5nZXRBdHRyKCdERUxJVkVSRURfQ09TVFVNRScpICYmIHRoaXMuZ2V0QXR0cignREVMSVZFUkVEX0RSSU5LJyk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgRG9vciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvRG9vcic7XG5cbmV4cG9ydCBjbGFzcyBCYWNrc3RhZ2VEb29yVG9CYWNreWFyZCBleHRlbmRzIERvb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkOiAnQkFDS1NUQUdFX1RPX0JBQ0tZQVJEJyxcbiAgICAgICAgICAgIG5hbWU6ICdkb29yIHRvIGJhY2t5YXJkJyxcbiAgICAgICAgICAgIHg6IDczOSxcbiAgICAgICAgICAgIHk6IDExMSxcbiAgICAgICAgICAgIHNwcml0ZUlkOiAnQkFDS1NUQUdFX0RPT1JfVE9fQkFDS1lBUkRfU1BSSVRFJyxcbiAgICAgICAgICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDc0MyxcbiAgICAgICAgICAgICAgICB5OiAyMTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0aW5hdGlvblNjZW5lSWQ6ICdCQUNLWUFSRCcsXG4gICAgICAgICAgICByZWxhdGVkRG9vcklkOiAnQkFDS1lBUkRfVE9fQkFDS1NUQUdFJ1xuICAgICAgICB9O1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignT1BFTicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3N0cmVldCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Rvb3IgdG8gc3RyZWV0JztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgRGlyZWN0aW9ucyB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9EaXJlY3Rpb25zJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdiYWNrc3RhZ2VfZG9vcl90b19zdGFnZScsXG4gICAgeDogMzMwLFxuICAgIHk6IDY3LFxuICAgIHNwcml0ZUlkOiAnQkFDS1NUQUdFX0RPT1JfVE9fU1RBR0UnLFxuICAgIG5hbWU6ICdkb29yIHRvIHN0YWdlJyxcbiAgICBnb1RvUG9zaXRpb246IHtcbiAgICAgICAgeDogMzc4LFxuICAgICAgICB5OiAxNjNcbiAgICB9XG59O1xuXG5leHBvcnQgY2xhc3MgQmFja3N0YWdlRG9vclRvU3RhZ2UgZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvcGVuQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIubG9va0F0KERpcmVjdGlvbnMuRE9XTik7XG4gICAgICAgIHBsYXllci5zYXkoJ0kgY2FuXFwndCBnbyB0byB0aGUgc3RhZ2UgeWV0JylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnSSBmaXJzdCBoYXZlIHRvIGdldCB0aGUgYmFuZCByZWFkeScpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvRGlyZWN0aW9ucyc7XG5cbmxldCBvcHRpb25zID0ge1xuICAgIGlkOiAnYmFjc2t0YWdlX2Rvb3JfdG9fc3RyZWV0JyxcbiAgICB4OiA1OSxcbiAgICB5OiAxMDAsXG4gICAgc3ByaXRlSWQ6ICdCQUNLU1RBR0VfRE9PUl9UT19TVFJFRVQnLFxuICAgIG5hbWU6ICdkb29yIHRvIHN0cmVldCcsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDEwMSxcbiAgICAgICAgeTogMTg1XG4gICAgfVxufTtcblxuZXhwb3J0IGNsYXNzIEJhY2tzdGFnZURvb3JUb1N0cmVldCBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9wZW5BY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5sb29rQXQoRGlyZWN0aW9ucy5ET1dOKTtcbiAgICAgICAgcGxheWVyLnNheSgnTm9wZSwgSSBjYW4gbm90IGdvIHRvIHRoZSBzdHJlZXQnKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdXZSBoYXZlIGEgY29uY2VydCB0byBwbGF5IScpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU2NlbmUgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1NjZW5lJztcbmltcG9ydCB7IEJyb29tIH0gZnJvbSAnLi9Ccm9vbSc7XG5pbXBvcnQgeyBWZW5kaW5nTWFjaGluZSB9IGZyb20gJy4vVmVuZGluZ01hY2hpbmUnO1xuaW1wb3J0IHsgQmFja3N0YWdlRG9vclRvQmFja3lhcmQgfSBmcm9tICcuL0JhY2tzdGFnZURvb3JUb0JhY2t5YXJkJztcbmltcG9ydCB7IEJhY2tzdGFnZURvb3JUb1N0cmVldCB9IGZyb20gJy4vQmFja3N0YWdlRG9vclRvU3RyZWV0JztcbmltcG9ydCB7IEJhY2tzdGFnZURvb3JUb1N0YWdlIH0gZnJvbSAnLi9CYWNrc3RhZ2VEb29yVG9TdGFnZSc7XG5pbXBvcnQgeyBCYW5kSW5Tb2ZhIH0gZnJvbSAnLi9CYW5kSW5Tb2ZhJztcbmltcG9ydCB7IFNjaXNzb3JzIH0gZnJvbSAnLi9TY2lzc29ycyc7XG5pbXBvcnQgeyBCb2NhZGlsbG8gfSBmcm9tICcuL0JvY2FkaWxsbyc7XG5pbXBvcnQgeyBDYWJsZSB9IGZyb20gJy4vQ2FibGUnO1xuaW1wb3J0IHsgQ29jb251dCB9IGZyb20gJy4vQ29jb251dCc7XG5pbXBvcnQgeyBEdXN0IH0gZnJvbSAnLi9EdXN0SW5UYWJsZSc7XG5pbXBvcnQgeyBHbGFzcyB9IGZyb20gJy4vR2xhc3MnO1xuaW1wb3J0IHsgTGFtcExlZnQgfSBmcm9tICcuL0xhbXBMZWZ0JztcbmltcG9ydCB7IExhbXBSaWdodCB9IGZyb20gJy4vTGFtcFJpZ2h0JztcbmltcG9ydCB7IEZseUNhc2UgfSBmcm9tICcuL0ZseUNhc2UnO1xuaW1wb3J0IHsgUG9seWdvbiB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9Qb2x5Z29uJztcblxuY29uc3Qgc2NlbmVPcHRpb25zID0ge1xuICAgIGlkOiAnQkFDS1NUQUdFJyxcbiAgICBiYWNrZ3JvdW5kSWQ6ICdCQUNLU1RBR0VfQkcnLFxuICAgIGJvdW5kYXJpZXNDb25maWc6IG5ldyBQb2x5Z29uKFtcbiAgICAgICAgLy8ge3g6IDUwLCB5OiA1MH0sXG4gICAgICAgIC8vIHt4OiAxMDAsIHk6IDUwfSxcbiAgICAgICAgLy8ge3g6IDEyMCwgeTogMTAwfSxcbiAgICAgICAgLy8ge3g6IDE5MCwgeTogMTAwfSxcbiAgICAgICAgLy8ge3g6IDE1MCwgeTogNTB9LFxuICAgICAgICAvLyB7eDogMjAwLCB5OiA1MH0sXG4gICAgICAgIC8vIHt4OiAyMDAsIHk6IDIwMH0sXG4gICAgICAgIC8vIHt4OiA1MCwgeTogMjAwfSxcbiAgICAgICAge3g6IDU1LCB5OiAyMTh9LFxuICAgICAgICB7eDogMTE0LCB5OiAxNTh9LFxuICAgICAgICB7eDogMTQyLCB5OiAxNTh9LFxuICAgICAgICB7eDogMTMwLCB5OiAxNzR9LFxuICAgICAgICB7eDogMTk1LCB5OiAxNzF9LFxuICAgICAgICB7eDogMjEzLCB5OiAxNTh9LFxuICAgICAgICB7eDogMjI5LCB5OiAxNTh9LFxuICAgICAgICB7eDogMjIyLCB5OiAxNzZ9LFxuICAgICAgICB7eDogMzA4LCB5OiAxODB9LFxuICAgICAgICB7eDogMzMyLCB5OiAxNTh9LFxuICAgICAgICB7eDogNDY1LCB5OiAxNTh9LFxuICAgICAgICB7eDogNDY5LCB5OiAxODN9LFxuICAgICAgICB7eDogNDk0LCB5OiAxOTN9LFxuICAgICAgICB7eDogNTUzLCB5OiAxODl9LFxuICAgICAgICB7eDogNTY5LCB5OiAxODF9LFxuICAgICAgICB7eDogNTY4LCB5OiAxNTh9LFxuICAgICAgICB7eDogNjA4LCB5OiAxNjB9LFxuICAgICAgICB7eDogNjI3LCB5OiAxODV9LFxuICAgICAgICB7eDogNjkxLCB5OiAxODR9LFxuICAgICAgICB7eDogNzA2LCB5OiAyMDJ9LFxuICAgICAgICB7eDogNzYyLCB5OiAyMDB9LFxuICAgICAgICB7eDogNzkwLCB5OiAyMTh9XG4gICAgXSksXG4gICAgdGhpbmdzOiBbXG4gICAgICAgIFxuICAgICAgICBuZXcgQmFja3N0YWdlRG9vclRvQmFja3lhcmQoKSxcbiAgICAgICAgbmV3IEJhY2tzdGFnZURvb3JUb1N0cmVldCgpLFxuICAgICAgICBuZXcgQmFja3N0YWdlRG9vclRvU3RhZ2UoKSxcbiAgICAgICAgbmV3IENhYmxlKCksXG4gICAgICAgIG5ldyBWZW5kaW5nTWFjaGluZSgpLFxuICAgICAgICBuZXcgQmFuZEluU29mYSgpLFxuICAgICAgICBuZXcgTGFtcExlZnQoKSxcbiAgICAgICAgbmV3IExhbXBSaWdodCgpLFxuICAgICAgICBuZXcgRmx5Q2FzZSgpLFxuICAgICAgICBuZXcgQnJvb20oKSxcbiAgICAgICAgbmV3IFNjaXNzb3JzKCksXG4gICAgICAgIG5ldyBCb2NhZGlsbG8oKSxcbiAgICAgICAgbmV3IEdsYXNzKCksXG4gICAgICAgIG5ldyBEdXN0KCksXG4gICAgICAgIG5ldyBDb2NvbnV0KClcbiAgICAgICAgXG4gICAgXVxufTtcblxuZXhwb3J0IGNsYXNzIEJhY2tzdGFnZVNjZW5lIGV4dGVuZHMgU2NlbmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihzY2VuZU9wdGlvbnMpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnYmFjb24nLFxuICAgIHNwcml0ZUlkOiAnQkFDT04nLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdCQUNPTl9JTlYnLFxuICAgIG5hbWU6ICdiYWNvbicsXG4gICAgZGlyZWN0bHlJbkludmVudG9yeTogdHJ1ZVxufVxuXG5leHBvcnQgY2xhc3MgQmFjb24gZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGxvb2tBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLnNheSgnRGVsaWNpb3VzIGFuZCBHUkVBU1khJyk7XG4gICAgfVxufSIsImltcG9ydCB7IFNwZWVjaEJ1YmJsZSB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9TcGVlY2hCdWJibGUnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbldpdGhCYW5kIH0gZnJvbSAnLi9Db252ZXJzYXRpb25XaXRoQmFuZCc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyBzdHlsZSB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9TdHlsZSc7XG5cbmxldCBzcHJpdGVPcHRpb25zID0gbmV3IE1hcCgpO1xuXG5zcHJpdGVPcHRpb25zLnNldCgncXVpZXQnLCB7IGZyYW1lczogWzBdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnanVhbl90YWxraW5nJywgeyBmcmFtZXM6IFsxLCAyLCAzLCA0LCA1LCA2XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ2FuZ2VsX3RhbGtpbmcnLCB7IGZyYW1lczogWzcsIDgsIDksIDEwLCAxMSwgMTJdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnc2FudGlfdGFsa2luZycsIHsgZnJhbWVzOiBbMTMsIDE0LCAxNSwgMTYsIDE3LCAxOF19KTtcblxuZXhwb3J0IGNsYXNzIEJhbmRJblNvZmEgZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBwcml2YXRlIHNwZWVjaEJ1YmJsZTogU3BlZWNoQnViYmxlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgaWQ6ICdiYW5kSW5Tb2ZhJyxcbiAgICAgICAgICAgIHg6IDQ4MSxcbiAgICAgICAgICAgIHk6IDEwNSxcbiAgICAgICAgICAgIHNwcml0ZUlkOiAnQkFORF9JTl9TT0ZBX1NQUklURScsXG4gICAgICAgICAgICBuYW1lOiAncmVzdCBvZiB0aGUgYmFuZCcsXG4gICAgICAgICAgICBnb1RvUG9zaXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiA0NTksXG4gICAgICAgICAgICAgICAgeTogMTgxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlyZWN0aW9uVG9Mb29rOiBEaXJlY3Rpb25zLlJJR0hULFxuICAgICAgICAgICAgc3ByaXRlT3B0aW9uczogc3ByaXRlT3B0aW9ucyxcbiAgICAgICAgICAgIGFuaW1hdGlvblNwZWVkOiBzdHlsZS5ERUZBVUxUX0FOSU1BVElPTl9TUEVFRFxuICAgICAgICB9O1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5zcGVlY2hCdWJibGUgPSBuZXcgU3BlZWNoQnViYmxlKHtcbiAgICAgICAgICAgIG93bmVyOiB0aGlzXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBwbGF5ZXIuc2F5KCdUaGVyZSBpcyBteSBiYW5kLicpO1xuICAgIH1cblxuICAgIHNwZWFrQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKS50aGVuKFxuICAgICAgICAgICAgKCkgPT4gbmV3IENvbnZlcnNhdGlvbldpdGhCYW5kKHBsYXllciwgdGhpcylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzYXkodGV4dDogc3RyaW5nLCB3aG86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnBsYXlBbmltYXRpb24od2hvICsgJ190YWxraW5nJyk7XG4gICAgICAgIHJldHVybiB0aGlzLnNwZWVjaEJ1YmJsZS5zYXkodGV4dCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsYXlBbmltYXRpb24oJ3F1aWV0Jyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IEJyZWFkIH0gZnJvbSAnLi9CcmVhZCc7XG5pbXBvcnQgeyBCYWNvbiB9IGZyb20gJy4vQmFjb24nO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnYm9jYWRpbGxvJyxcbiAgICB4OiA3MDUsXG4gICAgeTogMTQ1LFxuICAgIHNwcml0ZUlkOiAnQk9DQURJTExPJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQk9DQURJTExPX0lOVicsXG4gICAgbmFtZTogJ2JvY2FkaWxsbycsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDY5MixcbiAgICAgICAgeTogMTkwXG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufVxuXG5leHBvcnQgY2xhc3MgQm9jYWRpbGxvIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSB0aGluayBJIGNhbiBvcGVuIGl0IGFuZCB0YWtlIHRoZSBiYWNvbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnQSByYW5jaWQgYW5kIEdSRUFTWSBzYW5kd2hpY2gnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvcGVuQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBuZXcgQmFjb24oKTtcbiAgICAgICAgICAgIG5ldyBCcmVhZCgpO1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJIGhhdmUgdG8gcGljayBpdCB1cCBmaXJzdCcpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnYnJlYWQnLFxuICAgIHNwcml0ZUlkOiAnQlJFQUQnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdCUkVBRF9JTlYnLFxuICAgIG5hbWU6ICdicmVhZCcsXG4gICAgZGlyZWN0bHlJbkludmVudG9yeTogdHJ1ZVxufVxuXG5leHBvcnQgY2xhc3MgQnJlYWQgZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGxvb2tBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLnNheSgnVG9kbyBsbyBxdWUgdGVybWluYSwgdGVybWluYSBtYWwuJylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnUG9jbyBhIHBvY28uJylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1kgc2kgbm8gdGVybWluYSwgc2UgY29udGFtaW5hLicpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdZIGVzbyBzZSBjdWJyZSBkZSBwb2x2by4nKVxuICAgICAgICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IFZlcmJzIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5pbXBvcnQgeyBEaXJlY3Rpb25zIH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL0RpcmVjdGlvbnMnO1xuaW1wb3J0IHsgU2tpcnQgfSBmcm9tICcuL1NraXJ0JztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2Jyb29tJyxcbiAgICB4OiAxMDMsXG4gICAgeTogMTE5LFxuICAgIHNwcml0ZUlkOiAnQlJPT00nLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdCUk9PTV9JTlYnLFxuICAgIG5hbWU6ICdicm9vbScsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDExNyxcbiAgICAgICAgeTogMTc2XG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICBwcmVmZXJyZWRBY3Rpb246IFZlcmJzLlRBS0UsXG4gICAgcHJlZmVycmVkSW52ZW50b3J5QWN0aW9uOiBWZXJicy5MT09LXG59O1xuXG5leHBvcnQgY2xhc3MgQnJvb20gZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0F3ZXNvbWUsIG5vdyBJIGhhdmUgYSBicm9vbScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnU2kgeW8gdHV2aWVyYSB1bmEgZXNjb2JhLi4uJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdzY2lzc29ycycpIHtcbiAgICAgICAgICAgIHRoaXMuY3V0V2l0aFNjaXNzb3JzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJIGRvblxcJ3Qga25vdyBob3cgdG8gZG8gdGhhdCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3V0V2l0aFNjaXNzb3JzKCkge1xuICAgICAgICBuZXcgU2tpcnQoKTtcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2NlbmVzIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NjZW5lcy5zaW5nbGV0b24nO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnY2FibGUnLFxuICAgIHg6IDE4NyxcbiAgICB5OiAxMjUsXG4gICAgc3ByaXRlSWQ6ICdDQUJMRScsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ0NBQkxFX0lOVicsXG4gICAgbmFtZTogJ2NhYmxlJyxcbiAgICBnb1RvUG9zaXRpb246IHtcbiAgICAgICAgeDogMjE5LFxuICAgICAgICB5OiAxNjVcbiAgICB9LFxuICAgIHBpY2thYmxlOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgQ2FibGUgZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB0YWtlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGxldCB2ZW5kaW5nTWFjaGluZSA9IHNjZW5lcy5jdXJyZW50U2NlbmUuZ2V0VGhpbmdCeUlkKCd2ZW5kaW5nJyk7XG4gICAgICAgICAgICBpZiAoIXZlbmRpbmdNYWNoaW5lKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiB2ZW5kaW5nIG1hY2hpbmUgc2hvdWxkIGJlIHByZXNlbnQgaW4gY3VycmVudCBzY2VuZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2ZW5kaW5nTWFjaGluZS5nZXRBdHRyKCdQVVNIRUQnKSkge1xuICAgICAgICAgICAgICAgIHBsYXllci5zYXkoJ0ZpbmFsbHksIEkgaGF2ZSB0aGUgJCUjIGNhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMubGV0UGxheWVyQ29tZUFuZFRha2VJdChwbGF5ZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc2F5KCdJdCBpcyBzdHVjayBiZWhpbmQgdGhlIHZlbmRpbmcgbWFjaGluZSwgSSBuZWVkIHRvIG1vdmUgaXQgc29tZWhvdy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0Nvb2wsIG5vdyBJIHNob3VsZCBnaXZlIHRoYXQgdG8gdGhlIGd1eXMnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ1RoaXMgaXMgdGhlIGNhYmxlIEkgbmVlZCEnKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcblxuZXhwb3J0IGNsYXNzIENhbiBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZDogJ2NhbicsXG4gICAgICAgICAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQ0FOX0lOVicsXG4gICAgICAgICAgICBuYW1lOiAnY2FuJyxcbiAgICAgICAgICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2dsYXNzJykge1xuICAgICAgICAgICAgLy8gVE9ETzogZ2xhc3MgY2xhc3MgYW5kIGNhc3RpbmdcbiAgICAgICAgICAgIC8vIGxldCBnbGFzcyA9IHNlbGVjdGVkVGhpbmcudGhpbmc7XG4gICAgICAgICAgICAvLyBnbGFzcy5maWxsV2l0aERyaW5rKHBsYXllciwgdGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2R1c3QnKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJIHNob3VsZCBwcm9iYWJseSBtaXggaXQgaW4gYSBnbGFzcycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBkb25cXHQga25vdyBob3cgdG8gZG8gdGhhdC4uLicpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBjb3N0dW1lQ3JlYXRvciB9IGZyb20gJy4uL3V0aWxzL0Nvc3R1bWVDcmVhdG9yJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2NvY29udXQnLFxuICAgIHg6IDkyLFxuICAgIHk6IDE5NSxcbiAgICBzcHJpdGVJZDogJ0NPQ09OVVQnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdDT0NPTlVUX0lOVicsXG4gICAgbmFtZTogJ2NvY29udXQnLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiAxMTAsXG4gICAgICAgIHk6IDIwM1xuICAgIH0sXG4gICAgcGlja2FibGU6IHRydWUsXG4gICAgaXNGb3JlZ3JvdW5kOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgQ29jb251dCBleHRlbmRzIFRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnRG9lcyBpdCBsb29rIGxpa2UgYSBwYWlyIG9mIHRpdHM/Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdDb21wYXJlIGPDs21wcmFtZSB1biBjb2NvJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdmbG93ZXJzJykge1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkRmxvd2VycyhwbGF5ZXIpO1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkQ29jb251dChwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnc2tpcnQnKSB7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRTa2lydChwbGF5ZXIpO1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkQ29jb251dChwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY29zdHVtZScpIHtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZENvY29udXQocGxheWVyKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBkb25cXCd0IGtub3cgaG93IHRvIGRvIHRoYXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29udmVyc2F0aW9uLCBJQ29udmVyc2F0aW9uU2NyaXB0IH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9Db252ZXJzYXRpb24nO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uTGluZSB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvQ29udmVyc2F0aW9uTGluZSc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1BsYXllcic7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBCYW5kSW5Tb2ZhIH0gZnJvbSAnLi9CYW5kSW5Tb2ZhJztcblxuY29uc3Qgc2NyaXB0OiBJQ29udmVyc2F0aW9uU2NyaXB0ID0ge1xuICAgICdpbml0aWFsJzogW1xuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnwqFEb2N0b3J0aWxsYXMhIMK/TGlzdG9zIHBhcmEgdG9jYXI/JywgJ0xJU1RfT0ZfUFJPQkxFTVMnLCBzYXlQcm9ibGVtc0ludHJvKSxcbiAgICAgICAgLy9UT0RPIGxpbmUgbGlrZSBhYm92ZSBidXQgYWdncmVzc2l2ZVxuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnwr9IYWLDqWlzIHZpc3RvIGEgQmlsaT8nLCAnaW5pdGlhbCcsIHNheUJpbGlTaXR1YXRpb24pLFxuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnwqFIYXN0YSBsdWVnbyEnLCAnZW5kJylcbiAgICBdLFxuICAgICdMSVNUX09GX1BST0JMRU1TJzogW1xuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnwr9JbXBlZGltZW50b3M/IENvbnRhZG1lIG3DoXMsIHF1ZXJpZG9zIGFtaWd1aXRvcy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnSU5JVElBTF9BRlRFUl9GSVJTVF9UQUxLJywgc2F5TGlzdE9mUHJvYmxlbXMpLFxuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnwr9Qcm9ibGVtYXM/IMK/SW1wZWRpbWVudG9zPyBObyBjb250w6lpcyBjb25taWdvLi4uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0lOSVRJQUxfQUZURVJfRklSU1RfVEFMSycsIHNheUxpc3RPZlByb2JsZW1zKVxuICAgIF0sXG4gICAgJ0lOSVRJQUxfQUZURVJfRklSU1RfVEFMSyc6IFtcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ8K/Q8OzbW8gZXN0w6EgQmlsaT8nLCAnSU5JVElBTF9BRlRFUl9GSVJTVF9UQUxLJywgc2F5QmlsaVNpdHVhdGlvbiksXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKCdNbW1tLCB2b3kgYSB2ZXIgc2kgYXJyZWdsYW1vcyBlc3RlIGZvbGzDs24nLCAnZW5kJylcbiAgICBdLFxuICAgICdXRV9BUkVfUkVBRFknOiBbXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKCfCoVRvZG8gbGlzdG8hIFZveSBhIHBvciBCaWxpIHkgZW1wZXphbW9zJywgJ2VuZCcpXG4gICAgXVxufTtcblxuZXhwb3J0IGNsYXNzIENvbnZlcnNhdGlvbldpdGhCYW5kIGV4dGVuZHMgQ29udmVyc2F0aW9uIHtcblxuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIHByb3RlY3RlZCBvdGhlclBlcnNvbjogVGhpbmcpIHtcbiAgICAgICAgc3VwZXIocGxheWVyLCBvdGhlclBlcnNvbik7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRTdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmdldEF0dHIoJ1RBTEtFRF9UT19CQU5EX0FCT1VUX1BST0JMRU1TJykpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLmdldFN0YXRlSWZQbGF5ZXJEZWxpdmVyZWRFdmVyeXRoaW5nKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2luaXRpYWwnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvYWRTY3JpcHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2NyaXB0ID0gT2JqZWN0LmFzc2lnbih7fSwgc2NyaXB0KTtcbiAgICAgICAgbGV0IGRpYWxvZ1BhcnQ6IEFycmF5PENvbnZlcnNhdGlvbkxpbmU+ID0gW107XG4gICAgICAgIGRpYWxvZ1BhcnQgPSB0aGlzLnNjcmlwdFsnSU5JVElBTF9BRlRFUl9GSVJTVF9UQUxLJ10uY29uY2F0KGRpYWxvZ1BhcnQpO1xuXG4gICAgICAgIHRoaXMubG9hZEV4dHJhT3B0aW9uc0luSW5pdGlhbEZpcnN0VGFsayhkaWFsb2dQYXJ0KTtcbiAgICAgICAgdGhpcy5zY3JpcHRbJ0lOSVRJQUxfQUZURVJfRklSU1RfVEFMSyddID0gZGlhbG9nUGFydDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRFeHRyYU9wdGlvbnNJbkluaXRpYWxGaXJzdFRhbGsoZGlhbG9nUGFydDogQXJyYXk8Q29udmVyc2F0aW9uTGluZT4pIHtcbiAgICAgICAgdGhpcy5hZGRDb3N0dW1lTGluZShkaWFsb2dQYXJ0KTtcbiAgICAgICAgdGhpcy5hZGRDYWJsZUxpbmUoZGlhbG9nUGFydCk7XG4gICAgICAgIHRoaXMuYWRkRHJpbmtMaW5lKGRpYWxvZ1BhcnQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkQ29zdHVtZUxpbmUoZGlhbG9nUGFydDogQXJyYXk8Q29udmVyc2F0aW9uTGluZT4pOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmhhc0NvbXBsZXRlQ29zdHVtZSgpKSB7XG4gICAgICAgICAgICBkaWFsb2dQYXJ0LnVuc2hpZnQobmV3IENvbnZlcnNhdGlvbkxpbmUoXG4gICAgICAgICAgICAgICAgJ1RlbmdvIGVsIGRpc2ZyYXonLFxuICAgICAgICAgICAgICAgICgpID0+IHsgcmV0dXJuIHRoaXMuZ2V0U3RhdGVJZlBsYXllckRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKTsgfSxcbiAgICAgICAgICAgICAgICBzYXlDb3N0dW1lSXNPa1xuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZENhYmxlTGluZShkaWFsb2dQYXJ0OiBBcnJheTxDb252ZXJzYXRpb25MaW5lPik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuaGFzQ2FibGUoKSkge1xuICAgICAgICAgICAgZGlhbG9nUGFydC51bnNoaWZ0KG5ldyBDb252ZXJzYXRpb25MaW5lKFxuICAgICAgICAgICAgICAgICdUZW5nbyBlbCBjYWJsZScsXG4gICAgICAgICAgICAgICAgKCkgPT4geyByZXR1cm4gdGhpcy5nZXRTdGF0ZUlmUGxheWVyRGVsaXZlcmVkRXZlcnl0aGluZygpOyB9LFxuICAgICAgICAgICAgICAgIHNheUNhYmxlSXNPa1xuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZERyaW5rTGluZShkaWFsb2dQYXJ0OiBBcnJheTxDb252ZXJzYXRpb25MaW5lPik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuaGFzRnVubnlEcmluaygpKSB7XG4gICAgICAgICAgICBkaWFsb2dQYXJ0LnVuc2hpZnQobmV3IENvbnZlcnNhdGlvbkxpbmUoXG4gICAgICAgICAgICAgICAgJ1NhbnRpIHRlIGhlIHRyYWlkbyB1biByZWZyaWdlcmlvJyxcbiAgICAgICAgICAgICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmdldFN0YXRlSWZQbGF5ZXJEZWxpdmVyZWRFdmVyeXRoaW5nKCk7IH0sXG4gICAgICAgICAgICAgICAgc2F5RHJpbmtJc09rXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3RhdGVJZlBsYXllckRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKSkge1xuICAgICAgICAgICAgcmV0dXJuICdXRV9BUkVfUkVBRFknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHNheVByb2JsZW1zSW50cm8ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmFuZDogQmFuZEluU29mYSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGJhbmQuc2F5KCdObyBlcyBwb3IgYWxhcm1hciBwZXJvIGVzdMOhIGhhYmllbmRvIGFsZ3Vub3MgY29udHJhdGllbXBvcy4uLicsICdhbmdlbCcpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJy4uLm1pbnVjaWFzIHNpbiBpbXBvcnRhbmNpYS4uLicsICdzYW50aScpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJy4uLmltcGVkaW1lbnRvcyBCUlVUQUxFUy4nLCAnanVhbicpO1xuICAgICAgICAgICAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzYXlMaXN0T2ZQcm9ibGVtcyhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiYW5kOiBCYW5kSW5Tb2ZhKTogUHJvbWlzZTxhbnk+IHtcbiAgICBwbGF5ZXIuY2hhbmdlQXR0cignVEFMS0VEX1RPX0JBTkRfQUJPVVRfUFJPQkxFTVMnLCB0cnVlKTtcbiAgICByZXR1cm4gYmFuZC5zYXkoJ1Jlc3VsdGEgcXVlIGFxdcOtIGVsIGFtaWdvIEp1YW4gc2UgaGEgb2x2aWRhZG8gc3UgZGlzZnJhei4uLicsICdhbmdlbCcpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1VuIGRpc2ZyYXogQlJVVEFMLCBkZSBjb3dib3kgdmludGFnZSwgc2lnbG8gWElWLCBjb24gZXNwdWVsYXMgZGUuLi4nLCAnanVhbicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1PDrSwgc8OtLi4uIHBlcm8gbG8gaGEgZGVqYWRvIGVuIGVsIGxvY2FsIGRlIGVuc2F5bywgYXPDrSBxdWUgaGF5IHF1ZSBidXNjYXJsZSBvdHJvLicsICdhbmdlbCcpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1kgdHUgdGUgaGFzIG9sdmlkYWRvIGVsIGNhYmxlIGRlIGNvcnJpZW50ZSwgYXPDrSBxdWUgc2kgcXVpZXJlcyBxdWUgc2Ugb2lnYSBhbGdvLi4uJywgJ2p1YW4nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdNZSB0ZW5kcsOhcyBxdWUgY29uc2VndWlyIHVuby4nLCAnYW5nZWwnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdZIGx1ZWdvIGVzdMOhIGVsIHByb2JsZW1hIGNvbiBTYW50aS4nLCAnYW5nZWwnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdFbCBwb2JyZSBlc3TDoSB0w61taWRvIHkgbm8gc2UgYXRyZXZlciBhIHNhbGlyLicsICdqdWFuJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnRGljZSBxdWUgbm8gZW5zYXlhbW9zIG51bmNhIHkgc2Ugc2llbnRlIGluc2VndXJvLicsICdhbmdlbCcpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1lhIHNhYmVzIGPDs21vIHNvbiBsb3MgenVyZG9zIGNvbiBlc3RhcyBjb3Nhcy4uLicsICdqdWFuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNheUJpbGlTaXR1YXRpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmFuZDogQmFuZEluU29mYSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGJhbmQuc2F5KCdFc3TDoSBmdWVyYSBmdW1hbmRvLCBwZXJvIGNvbW8gbG8gZGVqZW1vcyBtdWNobyB0aWVtcG8gc2UgdmEgYSBwb25lciBjb21vIGxhcyBncmVjYXMuJywgJ2FuZ2VsJyk7XG59XG5cbmZ1bmN0aW9uIHNheUNvc3R1bWVJc09rKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJhbmQ6IEJhbmRJblNvZmEpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBiYW5kLnNheSgnVmF5YSBkaXNmcmF6IHJpZMOtY3Vsby4nLCAnanVhbicpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ0VsIG3DrW8gZXJhIG1lam9yJywgJ2p1YW4nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1RlIGxvIHBvbmVzLCBvIHRlIGxvIHBvbmdvLicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBiYW5kLmNoYW5nZUF0dHIoJ0hBU19DT1NUVU1FJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5jaGFuZ2VBdHRyKCdERUxJVkVSRURfQ09TVFVNRScsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucmVtb3ZlQ29zdHVtZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnTWUgbG8gcG9uZ28uJyk7XG4gICAgICAgICAgICAgICAgfSk7XG59XG5cblxuZnVuY3Rpb24gc2F5Q2FibGVJc09rKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJhbmQ6IEJhbmRJblNvZmEpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBiYW5kLnNheSgnTm8gdm95IGEgcHJlZ3VudGFyIGRlIGTDs25kZSBsbyBoYXMgc2FjYWRvLi4uJywgJ2FuZ2VsJylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnTG8gaGFzIHJvYmFkbywgwr92ZXJkYWQ/JywgJ3NhbnRpJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGJhbmQuY2hhbmdlQXR0cignSEFTX0NBQkxFJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5jaGFuZ2VBdHRyKCdERUxJVkVSRURfQ0FCTEUnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnJlbW92ZUNhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdEaWdhbW9zIHF1ZSB0ZW5nbyByZWN1cnNvcy4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2F5RHJpbmtJc09rKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJhbmQ6IEJhbmRJblNvZmEpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBiYW5kLnNheSgnTW1tIHVuIHJlZnJlc2NhbnRlIHJlZnJlc2NvLi4uJywgJ3NhbnRpJylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnR2x1IGdsdSBnbHUnLCAnc2FudGknKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCcuLi4nLCAnc2FudGknKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCcoZXJ1Y3RvKScsICdzYW50aScpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ05vIHNhYsOtYSBhIGRyb2dhIG5pIG5hZGEnLCAnc2FudGknKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdFc3RveSBlbXBlemFuZG8gYSBzZW50aXJtZSBsaXN0byBwYXJhIHRvY2FyJywgJ3NhbnRpJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGJhbmQuY2hhbmdlQXR0cignSEFTX0RSSU5LJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5jaGFuZ2VBdHRyKCdERUxJVkVSRURfRFJJTksnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnJlbW92ZUdsYXNzKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdBc8OtIG1lIGd1c3RhLicpO1xuICAgICAgICAgICAgICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuXG5jb25zdCBGVUxMX0ZSQU1FID0gMztcbmNvbnN0IEZMT1dFUl9BTkRfQ09DT05VVF9GUkFNRSA9IDE7XG5jb25zdCBGTE9XRVJfQU5EX1NLSVJUX0ZSQU1FID0gMjtcbmNvbnN0IFNLSVJUX0FORF9DT0NPTlVUX0ZSQU1FID0gMDtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2Nvc3R1bWUnLFxuICAgIHg6IDEzNyxcbiAgICB5OiAxMzAsXG4gICAgc3ByaXRlSWQ6ICdDT1NUVU1FX0lOVl9TUFJJVEUnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdDT1NUVU1FX0lOVl9TUFJJVEUnLFxuICAgIG5hbWU6ICdjb3N0dW1lJyxcbiAgICBkaXJlY3RseUluSW52ZW50b3J5OiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgQ29zdHVtZSBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0kgaGF2ZSB0byBwaWNrIGl0IHVwIGZpcnN0Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjb2NvbnV0Jykge1xuICAgICAgICAgICAgdGhpcy5hZGRDb2NvbnV0KHBsYXllcik7XG4gICAgICAgICAgICBzZWxlY3RlZFRoaW5nLnRoaW5nLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnZmxvd2VycycpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRmxvd2VycyhwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ3NraXJ0Jykge1xuICAgICAgICAgICAgdGhpcy5hZGRTa2lydChwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJIGRvblxcdCBrbm93IGhvdyB0byBkbyB0aGF0Li4uJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIC8vVE9ETzogY2hlY2sgZGlmZmVyZW50IHN0YXRlc1xuICAgICAgICBwbGF5ZXIuc2F5KCdBbG1vc3QgZG9uZSEnKTtcbiAgICB9XG5cbiAgICBnZXRGcmFtZUZvckludmVudG9yeSgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5pc0NvbXBsZXRlKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBGVUxMX0ZSQU1FO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0hBU19DT0NPTlVUJykgJiYgdGhpcy5nZXRBdHRyKCdIQVNfRkxPV0VSUycpKSB7XG4gICAgICAgICAgICByZXR1cm4gRkxPV0VSX0FORF9DT0NPTlVUX0ZSQU1FO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0hBU19DT0NPTlVUJykgJiYgdGhpcy5nZXRBdHRyKCdIQVNfU0tJUlQnKSkge1xuICAgICAgICAgICAgcmV0dXJuIFNLSVJUX0FORF9DT0NPTlVUX0ZSQU1FO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0hBU19TS0lSVCcpICYmIHRoaXMuZ2V0QXR0cignSEFTX0ZMT1dFUlMnKSkge1xuICAgICAgICAgICAgcmV0dXJuIEZMT1dFUl9BTkRfU0tJUlRfRlJBTUU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEZVTExfRlJBTUU7XG4gICAgfVxuXG4gICAgYWRkQ29jb251dChwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlQXR0cignSEFTX0NPQ09OVVQnLCB0cnVlKTtcbiAgICAgICAgdGhpcy5pbmZvcm1QbGF5ZXJJZkNvbXBsZXRlKHBsYXllcik7XG4gICAgfVxuXG4gICAgYWRkRmxvd2VycyhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlQXR0cignSEFTX0ZMT1dFUlMnLCB0cnVlKTtcbiAgICAgICAgdGhpcy5pbmZvcm1QbGF5ZXJJZkNvbXBsZXRlKHBsYXllcik7XG4gICAgfVxuXG4gICAgYWRkU2tpcnQocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcikge1xuICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ0hBU19TS0lSVCcsIHRydWUpO1xuICAgICAgICB0aGlzLmluZm9ybVBsYXllcklmQ29tcGxldGUocGxheWVyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQ29tcGxldGUoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHIoJ0hBU19DT0NPTlVUJykgJiYgdGhpcy5nZXRBdHRyKCdIQVNfRkxPV0VSUycpICYmIHRoaXMuZ2V0QXR0cignSEFTX1NLSVJUJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbmZvcm1QbGF5ZXJJZkNvbXBsZXRlKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5pc0NvbXBsZXRlKCkpIHtcbiAgICAgICAgICAgIHBsYXllci5jaGFuZ2VBdHRyKCdDT1NUVU1FX0NPTVBMRVRFJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IEdsYXNzIH0gZnJvbSAnLi9HbGFzcyc7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdkdXN0JyxcbiAgICB4OiAyNDcsXG4gICAgeTogMTI4LFxuICAgIHNwcml0ZUlkOiAnRFVTVCcsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ0RVU1RfSU5WJyxcbiAgICBuYW1lOiAnZHVzdCcsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDI0OCxcbiAgICAgICAgeTogMTc3XG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIER1c3QgZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0kgYmV0IHRoaXMgXCJkdXN0XCIgY2FuIG1ha2UgXCJzb21lYm9keVwiIGxlc3Mgc2h5Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdUaGF0XFwncyBzb21lIGhpZ2hseSBzdXNwaWNpb3VzIHdoaXRlIHBvd2RlcicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0kgaGF2ZSB0byBwaWNrIGl0IHVwIGZpcnN0Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdnbGFzcycpIHtcbiAgICAgICAgICAgIGxldCBnbGFzcyA9IDxHbGFzcz4gc2VsZWN0ZWRUaGluZy50aGluZztcbiAgICAgICAgICAgIGdsYXNzLmZpbGxXaXRoRHVzdChwbGF5ZXIsIHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjYW4nKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJIHNob3VsZCBwcm9iYWJseSBtaXggaXQgaW4gYSBnbGFzcycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBkb25cXHQga25vdyBob3cgdG8gZG8gdGhhdC4uLicpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdmbHlfY2FzZScsXG4gICAgeDogNjIsXG4gICAgeTogMTk4LFxuICAgIHNwcml0ZUlkOiAnRkxZX0NBU0UnLFxuICAgIG5hbWU6ICdmbHkgY2FzZScsXG4gICAganVzdERlY29yYXRpb246IHRydWUsXG4gICAgaXNGb3JlZ3JvdW5kOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgRmx5Q2FzZSBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgYWN0aXZlSW52ZW50b3J5IH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL0FjdGl2ZUludmVudG9yeS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgQ2FuIH0gZnJvbSAnLi9DYW4nO1xuXG5jb25zdCBOT1JNQUxfRlJBTUUgPSAwO1xuY29uc3QgUE9XREVSX0ZSQU1FID0gMTtcbmNvbnN0IEZJTExFRF9GUkFNRSA9IDI7XG5jb25zdCBQT1dERVJfRklMTEVEX0ZSQU1FID0gMztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2dsYXNzJyxcbiAgICB4OiA2NDEsXG4gICAgeTogMTI4LFxuICAgIHNwcml0ZUlkOiAnR0xBU1MnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdHTEFTU19JTlZfU1BSSVRFJyxcbiAgICBuYW1lOiAnZ2xhc3MnLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiA2MzksXG4gICAgICAgIHk6IDE4OVxuICAgIH0sXG4gICAgcGlja2FibGU6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBHbGFzcyBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0kgaGF2ZSB0byBwaWNrIGl0IHVwIGZpcnN0Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdkdXN0Jykge1xuICAgICAgICAgICAgbGV0IGR1c3QgPSBzZWxlY3RlZFRoaW5nLnRoaW5nO1xuICAgICAgICAgICAgdGhpcy5maWxsV2l0aER1c3QocGxheWVyLCBkdXN0KTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY2FuJykge1xuICAgICAgICAgICAgbGV0IGNhbiA9IDxDYW4+IHNlbGVjdGVkVGhpbmcudGhpbmc7XG4gICAgICAgICAgICB0aGlzLmZpbGxXaXRoRHJpbmsocGxheWVyLCBjYW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBkb25cXHQga25vdyBob3cgdG8gZG8gdGhhdC4uLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ1JlYWxseSB1c2VmdWwgdG8gcHV0IGxpcXVpZHMgb3Igb3RoZXIgc3Vic3RhbmNlcyBpbnNpZGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0l0IGlzIGluZGVlZCBhIGdsYXNzJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsV2l0aER1c3QocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgZHVzdDogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VBdHRyKCdQT1dERVJfSU5TSURFJywgdHJ1ZSk7XG4gICAgICAgIGR1c3QuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBmaWxsV2l0aERyaW5rKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGNhbjogQ2FuKSB7XG4gICAgICAgIGlmICghdGhpcy5nZXRBdHRyKCdGSUxMRUQnKSkge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VBdHRyKCdGSUxMRUQnLCB0cnVlKTtcbiAgICAgICAgICAgIGFjdGl2ZUludmVudG9yeS5yZWZyZXNoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJdCBpcyBhbHJlYWR5IGZ1bGwnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRnVubnkoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHIoJ0ZJTExFRCcpICYmIHRoaXMuZ2V0QXR0cignUE9XREVSX0lOU0lERScpO1xuICAgIH1cblxuICAgIGdldEZyYW1lRm9ySW52ZW50b3J5KCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0ZJTExFRCcpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdQT1dERVJfSU5TSURFJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUE9XREVSX0ZJTExFRF9GUkFNRTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZJTExFRF9GUkFNRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdldEF0dHIoJ1BPV0RFUl9JTlNJREUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIFBPV0RFUl9GUkFNRTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBOT1JNQUxfRlJBTUU7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuXG5sZXQgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2xhbXBfbGVmdCcsXG4gICAgeDogMTM2LFxuICAgIHk6IDI5LFxuICAgIHNwcml0ZUlkOiAnTEFNUCcsXG4gICAgbmFtZTogJ2xhbXAgbGVmdCcsXG4gICAganVzdERlY29yYXRpb246IHRydWUsXG4gICAgaXNGb3JlZ3JvdW5kOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgTGFtcExlZnQgZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5cbmxldCBvcHRpb25zID0ge1xuICAgIGlkOiAnbGFtcF9yaWdodCcsXG4gICAgeDogNDUwLFxuICAgIHk6IDI5LFxuICAgIHNwcml0ZUlkOiAnTEFNUCcsXG4gICAgbmFtZTogJ2xhbXAgcmlnaHQnLFxuICAgIGp1c3REZWNvcmF0aW9uOiB0cnVlLFxuICAgIGlzRm9yZWdyb3VuZDogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIExhbXBSaWdodCBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgQnJvb20gfSBmcm9tICcuL0Jyb29tJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ3NjaXNzb3JzJyxcbiAgICB4OiAyOTEsXG4gICAgeTogMTI4LFxuICAgIHNwcml0ZUlkOiAnU0NJU1NPUlMnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdTQ0lTU09SU19JTlYnLFxuICAgIG5hbWU6ICdzY2lzc29ycycsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDMwMCxcbiAgICAgICAgeTogMTgwXG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIFNjaXNzb3JzIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdTaGlueSBhbmQgc2hhcnAhJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdOb3Qgc2FmZSBoYXZpbmcgc2Npc3NvcnMgYXJvdW5kIG11c2ljaWFucycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKSB7XG4gICAgICAgIGxldCBvdGhlck9iamVjdCA9IHNlbGVjdGVkVGhpbmcudGhpbmc7XG4gICAgICAgIGlmIChvdGhlck9iamVjdC5pZCA9PT0gJ2Jyb29tJykge1xuICAgICAgICAgICAgbGV0IGJyb29tID0gPEJyb29tPiBvdGhlck9iamVjdDtcbiAgICAgICAgICAgIGJyb29tLmN1dFdpdGhTY2lzc29ycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBkb25cXCd0IGtub3cgaG93IHRvIGRvIHRoYXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgY29zdHVtZUNyZWF0b3IgfSBmcm9tICcuLi91dGlscy9Db3N0dW1lQ3JlYXRvcic7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdza2lydCcsXG4gICAgc3ByaXRlSWQ6ICdza2lydCcsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ1NLSVJUJyxcbiAgICBuYW1lOiAnc2tpcnQnLFxuICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBTa2lydCBleHRlbmRzIFRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5zYXkoJ0kgYW0gc2Vuc2luZyBzb21lIGNvc3R1bWUgaGVyZScpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB1c2VBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2Zsb3dlcnMnKSB7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRTa2lydChwbGF5ZXIpO1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkRmxvd2VycyhwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY29jb251dCcpIHtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZFNraXJ0KHBsYXllcik7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRDb2NvbnV0KHBsYXllcik7XG4gICAgICAgICAgICBzZWxlY3RlZFRoaW5nLnRoaW5nLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjb3N0dW1lJykge1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkU2tpcnQocGxheWVyKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBkb25cXCd0IGtub3cgaG93IHRvIGRvIHRoYXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IFNwZWVjaEJ1YmJsZSB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9TcGVlY2hCdWJibGUnO1xuaW1wb3J0IHsgQ2FuIH0gZnJvbSAnLi9DYW4nO1xuaW1wb3J0IHsgdWlCbG9ja2VyIH0gZnJvbSAnLi4vLi4vZW5naW5lL3VpL1VJQmxvY2tlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgRGlyZWN0aW9ucyB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9EaXJlY3Rpb25zJztcblxuY29uc3QgTk9STUFMX0ZSQU1FID0gMDtcbmNvbnN0IEdSRUFTRURfRlJBTUUgPSAxO1xuY29uc3QgR1JFQVNFRF9BTkRfUFVTSEVEX0ZSQU1FID0gMjtcblxuZXhwb3J0IGNsYXNzIFZlbmRpbmdNYWNoaW5lIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBzcGVlY2hCdWJibGU6IFNwZWVjaEJ1YmJsZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkOiAndmVuZGluZycsXG4gICAgICAgICAgICB4OiAxNTUsXG4gICAgICAgICAgICB5OiA5OCxcbiAgICAgICAgICAgIHNwcml0ZUlkOiAnVkVORElOR19NQUNISU5FX1NQUklURScsXG4gICAgICAgICAgICBuYW1lOiAndmVuZGluZyBtYWNoaW5lJyxcbiAgICAgICAgICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDE2NyxcbiAgICAgICAgICAgICAgICB5OiAxNzhcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXJlY3Rpb25Ub0xvb2s6IERpcmVjdGlvbnMuVVBcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuc3BlZWNoQnViYmxlID0gbmV3IFNwZWVjaEJ1YmJsZSh7XG4gICAgICAgICAgICBvd25lcjogdGhpc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHVzaEFjdGlvbihwbGF5ZXI6IFBsYXllcik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdQVVNIRUQnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ0kgYWxyZWFkeSBwdXNoZWQgdG9vIG11Y2gnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdldEF0dHIoJ0dSRUFTRUQnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBsYXllci5nb1RvVGhpbmcodGhpcylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5zYXkoJ0FhYWFhcmFnYWhnYWhnaGdoZ2hnaGcnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VBdHRyKCdQVVNIRUQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnVGhlIGZsb29yIGlzIHNvIHN0aWNreSBpdCBpcyBpbXBvc3NpYmxlIHRvIG1vdmUgaXQuJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdJZiBJIGNvdWxkIGp1c3QgcHV0IHNvbWUgZ3JlYXNlIGJlbG93IGl0Li4uJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnYmFjb24nKSB7XG4gICAgICAgICAgICB0aGlzLmdyZWFzZVdpdGhCYWNvbihwbGF5ZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjb2luJykge1xuICAgICAgICAgICAgdGhpcy5nZXRDYW4ocGxheWVyLCBzZWxlY3RlZFRoaW5nLnRoaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0kgZG9uXFx0IGtub3cgaG93IHRvIHVzZSB0aGF0IHdpdGggYSB2ZW5kaW5nIG1hY2hpbmUuLi4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2F5KHRleHQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGVlY2hCdWJibGUuc2F5KHRleHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ3JlYXNlV2l0aEJhY29uKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ0dSRUFTRUQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc2F5KCdOaWNlLCBpdCB3aWxsIHNsaWRlIHJlYWxseSB3ZWxsIG5vdy4uLicpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDYW4ocGxheWVyOiBQbGF5ZXIsIGNvaW46IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHVpQmxvY2tlci5ibG9jaygpO1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29pbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2F5KCdDbG9ua1xcbiAgIGNsb25rXFxuICAgICAgY2xvbmsnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IENhbigpO1xuICAgICAgICAgICAgICAgIHBsYXllci5zYXkoJ1RoYXQgd2FzIGEgd2lzZSBwdXJjaGFzZScpO1xuICAgICAgICAgICAgICAgIHVpQmxvY2tlci51bmJsb2NrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25TdGF0ZUNoYW5nZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnNwcml0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignR1JFQVNFRCcpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdQVVNIRUQnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lID0gR1JFQVNFRF9BTkRfUFVTSEVEX0ZSQU1FO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZSA9IEdSRUFTRURfRlJBTUU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZSA9IE5PUk1BTF9GUkFNRTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBEb29yIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9Eb29yJztcblxuZXhwb3J0IGNsYXNzIEJhY2t5YXJkRG9vclRvQmFja3N0YWdlIGV4dGVuZHMgRG9vciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgaWQ6ICdCQUNLWUFSRF9UT19CQUNLU1RBR0UnLFxuICAgICAgICAgICAgbmFtZTogJ2Rvb3IgdG8gYmFja3N0YWdlJyxcbiAgICAgICAgICAgIHg6IDM2LFxuICAgICAgICAgICAgeTogMTE1LFxuICAgICAgICAgICAgc3ByaXRlSWQ6ICdCQUNLWUFSRF9ET09SX1RPX0JBQ0tTVEFHRV9TUFJJVEUnLFxuICAgICAgICAgICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogNzgsXG4gICAgICAgICAgICAgICAgeTogMjA3XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzdGluYXRpb25TY2VuZUlkOiAnQkFDS1NUQUdFJyxcbiAgICAgICAgICAgIHJlbGF0ZWREb29ySWQ6ICdCQUNLU1RBR0VfVE9fQkFDS1lBUkQnXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnYmFja3N0YWdlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnZG9vciB0byBiYWNrc3RhZ2UnO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IFNjZW5lIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9TY2VuZSc7XG5pbXBvcnQgeyBCYWNreWFyZERvb3JUb0JhY2tzdGFnZSB9IGZyb20gJy4vQmFja3lhcmREb29yVG9CYWNrc3RhZ2UnO1xuaW1wb3J0IHsgRmxvd2VycyB9IGZyb20gJy4vRmxvd2Vycyc7XG5pbXBvcnQgeyBCaWxpIH0gZnJvbSAnLi9CaWxpJztcbmltcG9ydCB7IExhbXBCYWNreWFyZCB9IGZyb20gJy4vTGFtcEJhY2t5YXJkJztcbmltcG9ydCB7IE1vb24gfSBmcm9tICcuL01vb24nO1xuaW1wb3J0IHsgU3RhciB9IGZyb20gJy4vU3Rhcic7XG5pbXBvcnQgeyBDdXRGbG93ZXJzIH0gZnJvbSAnLi9DdXRGbG93ZXJzJztcbmltcG9ydCB7IEJhbGxvb24gfSBmcm9tICcuL0JhbGxvb24nO1xuaW1wb3J0IHsgUG9seWdvbiB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9Qb2x5Z29uJztcbmltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9JbnRlcmZhY2VzJztcblxuY29uc3Qgc2NlbmVPcHRpb25zID0ge1xuICAgIGlkOiAnQkFDS1lBUkQnLFxuICAgIGJhY2tncm91bmRJZDogJ0JBQ0tZQVJEX0JHJyxcbiAgICBib3VuZGFyaWVzQ29uZmlnOiBuZXcgUG9seWdvbihbXG4gICAgICAgIHt4OiA2MCwgeTogMjE2fSxcbiAgICAgICAge3g6IDExNywgeTogMTczfSxcbiAgICAgICAge3g6IDI0MywgeTogMTczfSxcbiAgICAgICAge3g6IDI0MywgeTogMTk3fSxcbiAgICAgICAge3g6IDQxNSwgeTogMTk3fSxcbiAgICAgICAge3g6IDQxNSwgeTogMjE2fVxuICAgIF0pLFxuICAgIHRoaW5nczogW1xuICAgICAgICBuZXcgQmFja3lhcmREb29yVG9CYWNrc3RhZ2UoKSxcbiAgICAgICAgbmV3IEN1dEZsb3dlcnMoKSxcbiAgICAgICAgbmV3IEZsb3dlcnMoKSxcbiAgICAgICAgbmV3IEJhbGxvb24oKSxcbiAgICAgICAgbmV3IEJpbGkoKSxcbiAgICAgICAgbmV3IExhbXBCYWNreWFyZCgpLFxuICAgICAgICBuZXcgTW9vbigpXG4gICAgXVxufTtcblxuXG5jb25zdCBTVEFSX05VTUJFUiA9IDcwO1xuY29uc3QgU0tZX1NUQVJUIDogSVBvaW50ID0geyB4OiAxMDgsIHk6IDF9O1xuY29uc3QgU0tZX0VORCA6IElQb2ludCA9IHsgeDogNDM2LCB5OiA3NH07XG5jb25zdCBNSU5fT1BBQ0lUWSA9IDAuMjtcbmNvbnN0IE1BWF9PUEFDSVRZID0gMC44O1xuXG5leHBvcnQgY2xhc3MgQmFja3lhcmRTY2VuZSBleHRlbmRzIFNjZW5lIHtcbiAgICBwcml2YXRlIHN0YXJzOiBBcnJheTxTdGFyPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihzY2VuZU9wdGlvbnMpO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICBzdXBlci5zaG93KCk7XG4gICAgICAgIHRoaXMuY3JlYXRlU2t5KCk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3lTa3koKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNreSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGFycyA9IFtdO1xuXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPFNUQVJfTlVNQkVSOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuZXdTdGFyID0gbmV3IFN0YXIoe1xuICAgICAgICAgICAgICAgIHg6IFNLWV9TVEFSVC54ICsgTWF0aC5yYW5kb20oKSooU0tZX0VORC54IC0gU0tZX1NUQVJULngpLFxuICAgICAgICAgICAgICAgIHk6IFNLWV9TVEFSVC55ICsgTWF0aC5yYW5kb20oKSooU0tZX0VORC55IC0gU0tZX1NUQVJULnkpLFxuICAgICAgICAgICAgICAgIGlkOiAnc3Rhcl8nICsgaSxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiBNSU5fT1BBQ0lUWSArIE1hdGgucmFuZG9tKCkqKE1BWF9PUEFDSVRZIC0gTUlOX09QQUNJVFkpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5ld1N0YXIuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy5zdGFycy5wdXNoKG5ld1N0YXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95U2t5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YXJzID0gdGhpcy5zdGFycyB8fCBbXTtcbiAgICAgICAgdGhpcy5zdGFycy5mb3JFYWNoKHN0YXIgPT4gc3Rhci5kZXN0cm95KCkpO1xuICAgICAgICB0aGlzLnN0YXJzID0gW107XG4gICAgfVxufSIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEaXJlY3Rpb25zIH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL0RpcmVjdGlvbnMnO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuLi8uLi9lbmdpbmUvdWkvU3R5bGUnO1xuXG5sZXQgc3ByaXRlT3B0aW9ucyA9IG5ldyBNYXAoKTtcblxuc3ByaXRlT3B0aW9ucy5zZXQoJ3F1aWV0JywgeyBmcmFtZXM6IFsxXX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ2Zsb2F0aW5nJywgeyBmcmFtZXM6IFsxLCAyLCAzLCA0LCA1LCA2XX0pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnYmFsbG9vbicsXG4gICAgeDogMjUyLFxuICAgIHk6IDk2LFxuICAgIHNwcml0ZUlkOiAnQkFMTE9PTl9TUFJJVEUnLFxuICAgIG5hbWU6ICdiYWxsb29uJyxcbiAgICBnb1RvUG9zaXRpb246IHtcbiAgICAgICAgeDogMjM5LFxuICAgICAgICB5OiAxODVcbiAgICB9LFxuICAgIGRpcmVjdGlvblRvTG9vazogRGlyZWN0aW9ucy5SSUdIVCxcbiAgICBzcHJpdGVPcHRpb25zOiBzcHJpdGVPcHRpb25zLFxuICAgIGFuaW1hdGlvblNwZWVkOiBzdHlsZS5ERUZBVUxUX0FOSU1BVElPTl9TUEVFRFxufTtcblxuY29uc3QgTUlOX1RJTUVfRk9SX0FOSU1BVElPTiA9IDMwMDtcbmNvbnN0IE1BWF9USU1FX0ZPUl9BTklNQVRJT04gPSA1MDAwO1xuXG5leHBvcnQgY2xhc3MgQmFsbG9vbiBleHRlbmRzIFRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBzaG93KCk6IHZvaWQge1xuICAgICAgICBzdXBlci5zaG93KCk7XG4gICAgICAgIHRoaXMucGxheUFuaW1hdGlvblNvbWV0aW1lKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwbGF5QW5pbWF0aW9uU29tZXRpbWUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGxheUFuaW1hdGlvbigncXVpZXQnKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsYXlBbmltYXRpb25PbmNlKCdmbG9hdGluZycpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheUFuaW1hdGlvblNvbWV0aW1lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgdGhpcy5nZXRUaW1lRm9yTmV4dEFuaW1hdGlvbigpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRpbWVGb3JOZXh0QW5pbWF0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNSU5fVElNRV9GT1JfQU5JTUFUSU9OICsgTWF0aC5yYW5kb20oKSooTUFYX1RJTUVfRk9SX0FOSU1BVElPTiAtIE1JTl9USU1FX0ZPUl9BTklNQVRJT04pO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgU3BlZWNoQnViYmxlIH0gZnJvbSAnLi4vLi4vZW5naW5lL3VpL1NwZWVjaEJ1YmJsZSc7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25XaXRoQmlsaSB9IGZyb20gJy4vQ29udmVyc2F0aW9uV2l0aEJpbGknO1xuaW1wb3J0IHsgRGlyZWN0aW9ucyB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9EaXJlY3Rpb25zJztcbmltcG9ydCB7IHN0eWxlIH0gZnJvbSAnLi4vLi4vZW5naW5lL3VpL1N0eWxlJztcblxubGV0IHNwcml0ZU9wdGlvbnMgPSBuZXcgTWFwKCk7XG5cbnNwcml0ZU9wdGlvbnMuc2V0KCdxdWlldCcsIHsgZnJhbWVzOiBbMCwgMSwgMiwgMywgNCwgNV19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCdzbW9raW5nJywgeyBmcmFtZXM6IFs2LCA3LCA4LCA5LCAxMCwgMTEsIDEyXX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ2RyaW5raW5nJywgeyBmcmFtZXM6IFsxMywgMTQsIDE1LCAxNiwgMTcsIDE4XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3RhbGtpbmcnLCB7IGZyYW1lczogWzE5LCAyMCwgMjEsIDIyLCAyM119KTtcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdiaWxpJyxcbiAgICB4OiAyNjUsXG4gICAgeTogMTIxLFxuICAgIHNwcml0ZUlkOiAnQklMSV9TUFJJVEUnLFxuICAgIG5hbWU6ICdiaWxpJyxcbiAgICBnb1RvUG9zaXRpb246IHtcbiAgICAgICAgeDogMjM5LFxuICAgICAgICB5OiAxODVcbiAgICB9LFxuICAgIGRpcmVjdGlvblRvTG9vazogRGlyZWN0aW9ucy5SSUdIVCxcbiAgICBzcHJpdGVPcHRpb25zOiBzcHJpdGVPcHRpb25zLFxuICAgIGFuaW1hdGlvblNwZWVkOiBzdHlsZS5ERUZBVUxUX0FOSU1BVElPTl9TUEVFRFxufTtcblxuY29uc3QgTUlOX1RJTUVfRk9SX0FOSU1BVElPTiA9IDEwMDA7XG5jb25zdCBNQVhfVElNRV9GT1JfQU5JTUFUSU9OID0gNTAwMDtcblxuZXhwb3J0IGNsYXNzIEJpbGkgZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBwcml2YXRlIHNwZWVjaEJ1YmJsZTogU3BlZWNoQnViYmxlO1xuICAgIHByaXZhdGUgaXNUYWxraW5nOiBCb29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBjdXJyZW50VGltZW91dDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZSA9IG5ldyBTcGVlY2hCdWJibGUoe1xuICAgICAgICAgICAgb3duZXI6IHRoaXNcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLnNheSgnRWwgYmlsaSEnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc3BlYWtBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpLnRoZW4oXG4gICAgICAgICAgICAoKSA9PiBuZXcgQ29udmVyc2F0aW9uV2l0aEJpbGkocGxheWVyLCB0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHNheSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5pc1RhbGtpbmcgPSB0cnVlO1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRUaW1lb3V0KSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuY3VycmVudFRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGxheUFuaW1hdGlvbigndGFsa2luZycpO1xuICAgICAgICByZXR1cm4gdGhpcy5zcGVlY2hCdWJibGUuc2F5KHRleHQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc1RhbGtpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucGxheUFuaW1hdGlvblNvbWV0aW1lKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNob3coKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnNob3coKTtcbiAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uU29tZXRpbWUoKTtcbiAgICB9XG5cbiAgICAvL0R1cGxpY2F0ZWQgaW4gQmFsbG9vbiwgaWYgd2UgYWRkIG1vcmUgb2JqZWN0cyBsaWtlIHRoaXMsIGNvbnNpZGVyIG1vdmluZyB0byBUaGluZyBtb2RlbFxuICAgIHByaXZhdGUgcGxheUFuaW1hdGlvblNvbWV0aW1lKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBsYXlBbmltYXRpb24oJ3F1aWV0Jyk7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGxheUFuaW1hdGlvbk9uY2UodGhpcy5nZXRSYW5kb21BbmltYXRpb24oKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uU29tZXRpbWUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCB0aGlzLmdldFRpbWVGb3JOZXh0QW5pbWF0aW9uKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGltZUZvck5leHRBbmltYXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1JTl9USU1FX0ZPUl9BTklNQVRJT04gKyBNYXRoLnJhbmRvbSgpKihNQVhfVElNRV9GT1JfQU5JTUFUSU9OIC0gTUlOX1RJTUVfRk9SX0FOSU1BVElPTik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSYW5kb21BbmltYXRpb24oKTogc3RyaW5nIHtcbiAgICAgICAgaWYoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgICAgICAgcmV0dXJuICdzbW9raW5nJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnZHJpbmtpbmcnO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29udmVyc2F0aW9uLCBJQ29udmVyc2F0aW9uU2NyaXB0IH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9Db252ZXJzYXRpb24nO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uTGluZSB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvQ29udmVyc2F0aW9uTGluZSc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1BsYXllcic7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBCaWxpIH0gZnJvbSAnLi9CaWxpJztcblxuY29uc3Qgc2NyaXB0OiBJQ29udmVyc2F0aW9uU2NyaXB0ID0ge1xuICAgICdpbml0aWFsJzogW1xuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1F1ZSBkaXNlIGVsIHRpbz8nO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdpbml0aWFsJyxcbiAgICAgICAgICAgIChwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiaWxpOiBCaWxpKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbGkuc2F5KCdQdWVzIGFxdcOtIGVzdGFtb3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKSxcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ0FkacOzcyEnLCAnZW5kJylcbiAgICBdXG59O1xuXG5leHBvcnQgY2xhc3MgQ29udmVyc2F0aW9uV2l0aEJpbGkgZXh0ZW5kcyBDb252ZXJzYXRpb24ge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIHByb3RlY3RlZCBvdGhlclBlcnNvbjogVGhpbmcpIHtcbiAgICAgICAgc3VwZXIocGxheWVyLCBvdGhlclBlcnNvbik7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRTdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdpbml0aWFsJztcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9hZFNjcmlwdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zY3JpcHQgPSBzY3JpcHQ7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuXG5sZXQgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2N1dF9mbG93ZXJzJyxcbiAgICB4OiAxMjcsXG4gICAgeTogMTQ4LFxuICAgIHNwcml0ZUlkOiAnQ1VUX0ZMT1dFUlMnLFxuICAgIG5hbWU6ICdDVVRfRkxPV0VSUycsXG4gICAganVzdERlY29yYXRpb246IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBDdXRGbG93ZXJzIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBjb3N0dW1lQ3JlYXRvciB9IGZyb20gJy4uL3V0aWxzL0Nvc3R1bWVDcmVhdG9yJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2Zsb3dlcnMnLFxuICAgIHg6IDEyNyxcbiAgICB5OiAxNDgsXG4gICAgc3ByaXRlSWQ6ICdGTE9XRVJTJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnRkxPV0VSU19JTlYnLFxuICAgIG5hbWU6ICdmbG93ZXJzJyxcbiAgICBnb1RvUG9zaXRpb246IHtcbiAgICAgICAgeDogMTM2LFxuICAgICAgICB5OiAxNzhcbiAgICB9LFxuICAgIHBpY2thYmxlOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgRmxvd2VycyBleHRlbmRzIFRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBiZXQgSSBjb3VsZCBkbyBhIGJlYXV0aWZ1bCBjb3N0dW1lIHdpdGggdGhpcycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnTmljZSBmbG93ZXJzJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjb2NvbnV0Jykge1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkQ29jb251dChwbGF5ZXIpO1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkRmxvd2VycyhwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnc2tpcnQnKSB7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRTa2lydChwbGF5ZXIpO1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkRmxvd2VycyhwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY29zdHVtZScpIHtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZEZsb3dlcnMocGxheWVyKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSSBkb25cXCd0IGtub3cgaG93IHRvIGRvIHRoYXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdsYW1wX2Rvb3InLFxuICAgIHg6IDI2LFxuICAgIHk6IDc1LFxuICAgIHNwcml0ZUlkOiAnTEFNUF9CQUNLWUFSRCcsXG4gICAgbmFtZTogJ0xBTVBfQkFDS1lBUkQnLFxuICAgIGp1c3REZWNvcmF0aW9uOiB0cnVlLFxuICAgIGlzRm9yZWdyb3VuZDogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIExhbXBCYWNreWFyZCBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdtb29uJyxcbiAgICB4OiAzODEsXG4gICAgeTogMjIsXG4gICAgc3ByaXRlSWQ6ICdNT09OJyxcbiAgICBuYW1lOiAnTU9PTicsXG4gICAganVzdERlY29yYXRpb246IHRydWUsXG4gICAgaXNGb3JlZ3JvdW5kOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgTW9vbiBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdzdGFyJyxcbiAgICB4OiAxLFxuICAgIHk6IDEsXG4gICAgc3ByaXRlSWQ6ICdTVEFSJyxcbiAgICBuYW1lOiAnU1RBUicsXG4gICAganVzdERlY29yYXRpb246IHRydWVcbn07XG5cbmludGVyZmFjZSBJU3Rhck9wdGlvbnMge1xuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBvcGFjaXR5OiBudW1iZXJcbn1cblxuZXhwb3J0IGNsYXNzIFN0YXIgZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoZXh0cmFPcHRpb25zOiBJU3Rhck9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGNvcnJlY3RPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywgZXh0cmFPcHRpb25zKTtcbiAgICAgICAgc3VwZXIoY29ycmVjdE9wdGlvbnMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvc3R1bWUgfSBmcm9tICcuLi9iYWNrc3RhZ2VTY2VuZS9Db3N0dW1lJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuXG5jbGFzcyBDb3N0dW1lQ3JlYXRvciB7XG4gICAgcHJpdmF0ZSBjb3N0dW1lOiBDb3N0dW1lO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29zdHVtZSA9IG51bGw7XG4gICAgfVxuXG4gICAgYWRkRmxvd2VycyhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlQ29zdHVtZUlmTmVlZGVkKCk7XG4gICAgICAgIHRoaXMuY29zdHVtZS5hZGRGbG93ZXJzKHBsYXllcik7XG4gICAgfVxuXG4gICAgYWRkQ29jb251dChwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlQ29zdHVtZUlmTmVlZGVkKCk7XG4gICAgICAgIHRoaXMuY29zdHVtZS5hZGRDb2NvbnV0KHBsYXllcik7XG4gICAgfVxuXG4gICAgYWRkU2tpcnQocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcikge1xuICAgICAgICB0aGlzLmNyZWF0ZUNvc3R1bWVJZk5lZWRlZCgpO1xuICAgICAgICB0aGlzLmNvc3R1bWUuYWRkU2tpcnQocGxheWVyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNvc3R1bWVJZk5lZWRlZCgpOiB2b2lkIHtcbiAgICAgICAgaWYoIXRoaXMuY29zdHVtZSkge1xuICAgICAgICAgICAgdGhpcy5jb3N0dW1lID0gbmV3IENvc3R1bWUoKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5leHBvcnQgY29uc3QgY29zdHVtZUNyZWF0b3IgPSBuZXcgQ29zdHVtZUNyZWF0b3IoKTsiLCJpbXBvcnQgeyBwaGFzZXIgfSBmcm9tICcuL1BoYXNlcic7XG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL2VuZ2luZS91aS9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBCb290U2NlbmUgfSBmcm9tICcuL0Jvb3RTY2VuZSc7XG5pbXBvcnQgeyBQcmVsb2FkZXJTY2VuZSB9IGZyb20gJy4vUHJlbG9hZGVyU2NlbmUnO1xuaW1wb3J0IHsgU3RhcnRNZW51U2NlbmUgfSBmcm9tICcuL1N0YXJ0TWVudVNjZW5lJztcbmltcG9ydCB7IHBsYXlTY2VuZSB9IGZyb20gJy4vUGxheVNjZW5lJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuL2VuZ2luZS9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgZ2FtZSA9IG5ldyBwaGFzZXIuR2FtZShsYXlvdXQuV0lEVEgsIGxheW91dC5IRUlHSFQsIHBoYXNlci5BVVRPLCAnZ2FtZScpO1xuXG4gICAgcGhhc2VyR2FtZS52YWx1ZSA9IGdhbWU7XG5cbiAgICBnYW1lLnN0YXRlLmFkZCgnYm9vdCcsIEJvb3RTY2VuZSk7XG4gICAgZ2FtZS5zdGF0ZS5hZGQoJ3ByZWxvYWRlcicsIFByZWxvYWRlclNjZW5lKTtcbiAgICBnYW1lLnN0YXRlLmFkZCgnc3RhcnRNZW51JywgU3RhcnRNZW51U2NlbmUpO1xuICAgIGdhbWUuc3RhdGUuYWRkKCdwbGF5JywgcGxheVNjZW5lKTtcblxuICAgIGdhbWUuc3RhdGUuc3RhcnQoJ2Jvb3QnKTtcbn07XG4iXX0=
