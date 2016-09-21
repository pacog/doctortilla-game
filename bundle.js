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

},{"./Phaser":3,"./engine/ui/LayoutManager.singleton":36}],2:[function(require,module,exports){
"use strict";
exports.CreditsScene = {
    preload: function () { },
    create: function () {
        this.createBG();
    },
    createBG: function () {
        this.game.add.sprite(0, 0, 'CREDITS');
    }
};

},{}],3:[function(require,module,exports){
"use strict";
/// <reference path="../vendor/phaser/phaser.d.ts"/>
exports.phaser = Phaser;

},{}],4:[function(require,module,exports){
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

},{"./game/DoctortillaGame":55}],5:[function(require,module,exports){
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

},{"./game/AssetsManager":53}],6:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./engine/ui/LayoutManager.singleton');
const Labels_store_1 = require('./engine/stores/Labels.store');
const analytics_1 = require('./engine/utils/analytics');
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
        analytics_1.analytics.sendEvent('start_menu', 'select_language', 'english');
        analytics_1.analytics.sendEvent('game', 'start_game');
        Labels_store_1.labelsStore.setLanguage('en');
        this.game.state.start('play');
    },
    onSpanishButtonClick: function () {
        analytics_1.analytics.sendEvent('start_menu', 'select_language', 'spanish');
        analytics_1.analytics.sendEvent('game', 'start_game');
        Labels_store_1.labelsStore.setLanguage('es');
        this.game.state.start('play');
    }
};

},{"./engine/stores/Labels.store":26,"./engine/ui/LayoutManager.singleton":36,"./engine/utils/analytics":52}],7:[function(require,module,exports){
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

},{"../ui/ConversationUI":30,"../utils/Observable":48}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"../stores/Verbs.store":27,"../utils/ActionDispatcher":45,"./Thing":19}],10:[function(require,module,exports){
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
        if (this.onStart) {
            this.onStart();
        }
    }
    update() {
        this.camera.updatePosition();
    }
    //To override in child classes
    onStart() { }
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

},{"../state/ActiveInventory.singleton":20,"../state/PhaserGame.singleton":21,"../state/Scenes.singleton":22,"../state/SelectedObjects":23,"../state/SelectedVerb.singleton":24,"../stores/Labels.store":26,"../stores/Verbs.store":27,"../ui/GraphicUI":32,"../utils/ActionDispatcher":45,"./GameCamera":11}],11:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":21,"../ui/Style":39}],12:[function(require,module,exports){
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

},{"../utils/ActionDispatcher":45,"../utils/Observable":48}],13:[function(require,module,exports){
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

},{"../utils/Observable":48}],14:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":21,"../utils/Segment":51}],15:[function(require,module,exports){
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
    wait(timeMs = 1000) {
        let deferred = new Promise((resolveCallback) => {
            setTimeout(() => {
                resolveCallback();
            }, timeMs);
        });
        return deferred;
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
    playAnimationOnce(animationName) {
        let promise = new Promise((resolve, reject) => {
            if (this.options.spriteOptions.has(animationName)) {
                this.sprite.animations.play(animationName, null, false); //False so it does not loop
                if (this.sprite.animations.currentAnim && this.sprite.animations.currentAnim.onComplete) {
                    this.sprite.animations.currentAnim.onComplete.add(() => {
                        resolve();
                    });
                }
                else {
                    resolve();
                }
            }
            else {
                reject();
            }
        });
        return promise;
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

},{"../ui/SpeechBubble":38,"../ui/UILayers.singleton":43,"../utils/Directions":47,"./Inventory":13,"./PlayerMovementHandler":16}],16:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":21,"../state/Scenes.singleton":22,"./PathFinder":14}],17:[function(require,module,exports){
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

},{"../ui/UILayers.singleton":43,"../utils/ActionDispatcher":45,"./SceneBoundaries":18}],18:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":21}],19:[function(require,module,exports){
"use strict";
const UILayers_singleton_1 = require('../ui/UILayers.singleton');
const ActionDispatcher_1 = require('../utils/ActionDispatcher');
const ActiveInventory_singleton_1 = require('../state/ActiveInventory.singleton');
const Verbs_store_1 = require('../stores/Verbs.store');
const RandomText_1 = require('../utils/RandomText');
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
                if (this.sprite.animations.currentAnim && this.sprite.animations.currentAnim.onComplete) {
                    this.sprite.animations.currentAnim.onComplete.add(() => {
                        resolve();
                    });
                }
                else {
                    resolve();
                }
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
            player.say('I_ALREADY_HAVE_IT');
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
        player.say(RandomText_1.randomText('OH_LOOK_AT_THAT', 'NICE_OBJECT', 'BEAUTIFUL_SOMETHING'));
    }
    openAction(player) {
        player.say('THAT_CANNOT_BE_OPENED');
    }
    closeAction(player) {
        player.say('THAT_CANNOT_BE_CLOSED');
    }
    pushAction(player) {
        player.say('I_CANT_MOVE_THAT');
    }
    useAction(player) {
        player.say('I_DONT_KNOW_HOW_TO_DO_THAT');
    }
    speakAction(player) {
        player.say(RandomText_1.randomText('I_WOULDNT_KNOW_WHAT_TO_SAY', 'I_HAVE_BETTER_THINGS_TO_DO_THAN_TALKING', 'HI_THERE'));
    }
    giveAction(player) {
        player.say('I_CANT_DO_THAT');
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

},{"../state/ActiveInventory.singleton":20,"../stores/Verbs.store":27,"../ui/UILayers.singleton":43,"../utils/ActionDispatcher":45,"../utils/RandomText":50}],20:[function(require,module,exports){
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

},{"../utils/Observable":48}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
    getSceneById(id) {
        return this.scenes.get(id);
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

},{}],23:[function(require,module,exports){
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

},{"../models/GenericHighlightedThing":12,"../stores/Verbs.store":27,"../utils/ActionDispatcher":45,"./SelectedVerb.singleton":24}],24:[function(require,module,exports){
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

},{"../stores/Verbs.store":27,"../utils/ActionDispatcher":45,"../utils/Observable":48}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{"./DefaultLabels":25}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":21,"../stores/Labels.store":26,"../stores/Verbs.store":27,"../utils/ActionDispatcher":45,"./LayoutManager.singleton":36,"./TextWithShadow":41,"./UILayers.singleton":43}],29:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const Observable_1 = require('../utils/Observable');
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
const TextWithShadow_1 = require('./TextWithShadow');
const Labels_store_1 = require('../stores/Labels.store');
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
            initialText: Labels_store_1.label(this.lineText),
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

},{"../state/PhaserGame.singleton":21,"../stores/Labels.store":26,"../utils/Observable":48,"./LayoutManager.singleton":36,"./TextWithShadow":41,"./UILayers.singleton":43}],30:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const UIBlocker_singleton_1 = require('../../engine/ui/UIBlocker.singleton');
const ConversationLineUI_1 = require('./ConversationLineUI');
const UILayers_singleton_1 = require('./UILayers.singleton');
const InventoryPaginationButton_1 = require('./InventoryPaginationButton');
const LINES_PER_PAGE = 3;
class ConversationUI {
    constructor(conversation) {
        this.conversation = conversation;
        this.firstLineShown = 0;
        this.uiBlockerWasBlockedBefore = UIBlocker_singleton_1.uiBlocker.isBlocked();
        UIBlocker_singleton_1.uiBlocker.block();
        this.lines = [];
        this.createBackground();
        this.conversation.onStateChange((newState) => this.update(newState));
    }
    destroy() {
        this.destroyOldLines();
        this.background.destroy();
        if (!this.uiBlockerWasBlockedBefore) {
            UIBlocker_singleton_1.uiBlocker.unblock();
        }
    }
    createBackground() {
        let layoutStartPosition = LayoutManager_singleton_1.layout.UI_START_POSITION;
        this.background = UILayers_singleton_1.uiLayers.conversation.create(layoutStartPosition.x, layoutStartPosition.y, 'UI_CONVERSATION_BG');
        this.background.anchor.setTo(0, 0);
        this.background.fixedToCamera = true;
        this.background.inputEnabled = true;
    }
    update(newState) {
        this.firstLineShown = 0;
        this.destroyOldLines();
        this.createNewLines();
    }
    createNewLines() {
        let newLines = this.conversation.getLines();
        for (let i = this.firstLineShown; i < (this.firstLineShown + LINES_PER_PAGE) && (i < newLines.length); i++) {
            this.createLine(newLines[i], i - this.firstLineShown);
        }
        this.createPaginationButtons();
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
        this.destroyPaginationButtons();
    }
    createPaginationButtons() {
        this.destroyPaginationButtons();
        if (this.firstLineShown > 0) {
            this.paginationButtonUp = new InventoryPaginationButton_1.InventoryPaginationButton({
                type: InventoryPaginationButton_1.PaginationButtonType.UP,
                layer: UILayers_singleton_1.uiLayers.conversation
            });
            this.paginationButtonUp.subscribeToClick(() => {
                this.goToPrevPage();
            });
        }
        if ((this.firstLineShown + LINES_PER_PAGE) < this.conversation.getLines().length) {
            this.paginationButtonDown = new InventoryPaginationButton_1.InventoryPaginationButton({
                type: InventoryPaginationButton_1.PaginationButtonType.DOWN,
                layer: UILayers_singleton_1.uiLayers.conversation
            });
            this.paginationButtonDown.subscribeToClick(() => {
                this.goToNextPage();
            });
        }
    }
    goToPrevPage() {
        this.firstLineShown--;
        this.destroyOldLines();
        this.createNewLines();
    }
    goToNextPage() {
        this.firstLineShown++;
        this.destroyOldLines();
        this.createNewLines();
    }
    destroyPaginationButtons() {
        if (this.paginationButtonUp) {
            this.paginationButtonUp.destroy();
            this.paginationButtonUp = null;
        }
        if (this.paginationButtonDown) {
            this.paginationButtonDown.destroy();
            this.paginationButtonDown = null;
        }
    }
}
exports.ConversationUI = ConversationUI;

},{"../../engine/ui/UIBlocker.singleton":42,"./ConversationLineUI":29,"./InventoryPaginationButton":34,"./LayoutManager.singleton":36,"./UILayers.singleton":43}],31:[function(require,module,exports){
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

},{"../state/SelectedObjects":23,"../state/SelectedVerb.singleton":24,"../stores/Labels.store":26,"../stores/Verbs.store":27,"./LayoutManager.singleton":36,"./TextWithShadow":41,"./UILayers.singleton":43}],32:[function(require,module,exports){
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

},{"./CurrentActionUI":31,"./InventoryUI":35,"./LayoutManager.singleton":36,"./ReflectButton":37,"./UILayers.singleton":43,"./VerbsUI":44}],33:[function(require,module,exports){
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

},{"../utils/ActionDispatcher":45,"./LayoutManager.singleton":36,"./UILayers.singleton":43}],34:[function(require,module,exports){
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
        this.options.layer = this.options.layer || UILayers_singleton_1.uiLayers.verbButtons;
        this.createButton();
    }
    hide() {
        this.button.alpha = 0;
    }
    show() {
        this.button.alpha = 1;
    }
    subscribeToClick(callback) {
        this.clickObservable.registerObserver(callback);
    }
    destroy() {
        this.clickObservable.removeAllObservers();
        this.button.destroy();
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
        this.options.layer.add(this.button);
        this.button.fixedToCamera = true;
    }
    onClick() {
        this.clickObservable.notifyObservers(null);
    }
}
exports.InventoryPaginationButton = InventoryPaginationButton;

},{"../state/PhaserGame.singleton":21,"../utils/Observable":48,"./LayoutManager.singleton":36,"./UILayers.singleton":43}],35:[function(require,module,exports){
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
        this.makeSurePageIsInsideInv();
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
        this.showOrHideNavButtons();
    }
    showOrHideNavButtons() {
        if (this.canGoToPrevPage()) {
            this.paginationButtonUp.show();
        }
        else {
            this.paginationButtonUp.hide();
        }
        if (this.canGoToNextPage()) {
            this.paginationButtonDown.show();
        }
        else {
            this.paginationButtonDown.hide();
        }
    }
    destroyPrevItems() {
        this.items.forEach(item => item.destroy());
        this.items.clear();
    }
    goToNextPage() {
        if (this.canGoToNextPage()) {
            this.currentPage++;
            this.createItems();
        }
    }
    canGoToPrevPage() {
        return this.currentPage > 0;
    }
    canGoToNextPage() {
        return this.currentInventory.items.size > (ITEMS_PER_PAGE * (this.currentPage + 1));
    }
    makeSurePageIsInsideInv() {
        let firstPageElement = ITEMS_PER_PAGE * this.currentPage;
        if (firstPageElement >= this.currentInventory.items.size) {
            this.currentPage = 0;
        }
    }
    goToPrevPage() {
        if (this.canGoToPrevPage()) {
            this.currentPage--;
            this.createItems();
        }
    }
}
exports.InventoryUI = InventoryUI;

},{"../state/ActiveInventory.singleton":20,"./InventoryItemUI":33,"./InventoryPaginationButton":34,"./LayoutManager.singleton":36,"./UILayers.singleton":43}],36:[function(require,module,exports){
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
        let marginY = 8 + ((index + 1) * this.LAYOUT_DEFAULT_MARGIN);
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

},{}],37:[function(require,module,exports){
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
        let button = PhaserGame_singleton_1.phaserGame.value.add.button(this.position.x, this.position.y, 'REFLECT_BUTTON_BG', this.onClick, this, 1, 0, 2, 1);
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

},{"../state/PhaserGame.singleton":21,"../stores/Labels.store":26,"../utils/ActionDispatcher":45,"./LayoutManager.singleton":36,"./TextWithShadow":41,"./UILayers.singleton":43}],38:[function(require,module,exports){
"use strict";
const TextInScene_1 = require('./TextInScene');
const Labels_store_1 = require('../stores/Labels.store');
class SpeechBubble {
    constructor(options) {
        this.options = options;
    }
    say(text) {
        this.destroyPrevText();
        this.textBeingSaid = new TextInScene_1.TextInScene({
            text: Labels_store_1.label(text),
            position: this.options.owner.getPositionOnTop(),
            autoDestroy: true,
            foregroundTextStyle: this.options.foregroundTextStyle,
            shadowTextStyle: this.options.shadowTextStyle
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
    setForegroundTextStyle(newStyle) {
        this.options.foregroundTextStyle = newStyle;
    }
    setShadowTextStyle(newStyle) {
        this.options.shadowTextStyle = newStyle;
    }
    destroyPrevText() {
        if (this.textBeingSaid) {
            this.textBeingSaid.destroy();
            this.textBeingSaid = null;
        }
    }
}
exports.SpeechBubble = SpeechBubble;

},{"../stores/Labels.store":26,"./TextInScene":40}],39:[function(require,module,exports){
"use strict";
exports.style = Object.freeze({
    DEFAULT_FONT_SIZE: 8,
    FONT_SHADOW_X: 1,
    FONT_SHADOW_Y: 1,
    CAMERA_EASING_FACTOR: 0.025,
    DEFAULT_ANIMATION_SPEED: 6
});

},{}],40:[function(require,module,exports){
"use strict";
const Style_1 = require('./Style');
const TextWithShadow_1 = require('./TextWithShadow');
const UILayers_singleton_1 = require('./UILayers.singleton');
const Scenes_singleton_1 = require('../state/Scenes.singleton');
const DEFAULT_TEXT_OPTIONS = Object.freeze({
    wordsPerMinute: 120,
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
            anchor: this.options.anchor,
            foregroundTextStyle: this.options.foregroundTextStyle,
            shadowTextStyle: this.options.shadowTextStyle
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
        let wordsInText = text.split(' ').length;
        let timeToDestroy = (1000 * wordsInText * 60) / this.options.wordsPerMinute;
        return Math.max(this.options.minDestroyTime, timeToDestroy);
    }
}
exports.TextInScene = TextInScene;

},{"../state/Scenes.singleton":22,"./Style":39,"./TextWithShadow":41,"./UILayers.singleton":43}],41:[function(require,module,exports){
"use strict";
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const Style_1 = require('./Style');
const DEFAULT_FOREGROUND_TEXT = 'FONT_32_WHITE';
const DEFAULT_SHADOW_TEXT = 'FONT_32_BLACK';
class TextWithShadow {
    constructor(options) {
        this.options = options;
        let anchor = this.options.anchor || {
            x: 0,
            y: 0
        };
        this.shadowText = PhaserGame_singleton_1.phaserGame.value.add.bitmapText(1 + options.position.x, 1 + options.position.y, this.shadowTextStyle, this.options.initialText || '', Style_1.style.DEFAULT_FONT_SIZE);
        this.shadowText.anchor.setTo(anchor.x, anchor.y);
        this.shadowText.fixedToCamera = !!this.options.fixedToCamera;
        if (this.options.align) {
            this.shadowText.align = this.options.align;
        }
        this.options.layer.add(this.shadowText);
        this.text = PhaserGame_singleton_1.phaserGame.value.add.bitmapText(options.position.x, options.position.y, this.foregroundTextStyle, this.options.initialText || '', Style_1.style.DEFAULT_FONT_SIZE);
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
    get foregroundTextStyle() {
        return this.options.foregroundTextStyle || DEFAULT_FOREGROUND_TEXT;
    }
    get shadowTextStyle() {
        return this.options.shadowTextStyle || DEFAULT_SHADOW_TEXT;
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

},{"../state/PhaserGame.singleton":21,"./Style":39}],42:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
class UIBlocker {
    constructor() {
        this.blocked = false;
    }
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
    isBlocked() {
        return this.blocked;
    }
}
exports.uiBlocker = new UIBlocker();

},{"../state/PhaserGame.singleton":21,"./LayoutManager.singleton":36,"./UILayers.singleton":43}],43:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":21}],44:[function(require,module,exports){
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

},{"../stores/Verbs.store":27,"../utils/ActionDispatcher":45,"./ActionButton":28}],45:[function(require,module,exports){
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

},{"./Observable":48}],46:[function(require,module,exports){

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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
    removeAllObservers() {
        this.observers.clear();
    }
    notifyObservers(value) {
        this.observers.forEach((observer) => {
            observer(value);
        });
    }
}
exports.Observable = Observable;

},{}],49:[function(require,module,exports){
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

},{"./Segment":51}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){
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

},{}],52:[function(require,module,exports){
"use strict";
class Analytics {
    sendEvent(category, action, label = undefined) {
        if (window.ga) {
            window.ga('send', 'event', category, action, label);
        }
    }
}
exports.analytics = new Analytics();

},{}],53:[function(require,module,exports){
"use strict";
;
;
;
const SPRITES = {
    // UI
    'BUTTON_BG': ['images/ui/BUTTON_BG_SPRITE.png', 75, 18, 3],
    'REFLECT_BUTTON_BG': ['images/ui/REFLECT_BUTTON_BG_SPRITE.png', 75, 56, 3],
    'CONVERSATION_LINE_BG': ['images/ui/CONVERSATION_LINE_BG.png', 508, 20],
    'PAGINATION_BUTTON_UP': ['images/ui/PAGINATION_BUTTON_UP.png', 16, 25, 4],
    'ENGLISH_BUTTON': ['images/ui/ENGLISH_BUTTON.png', 136, 27, 3],
    'SPANISH_BUTTON': ['images/ui/SPANISH_BUTTON.png', 136, 27, 3],
    // PLAYER
    'DOCTORTILLA_PLAYER_SPRITE': ['images/player/DOCTORTILLA_PLAYER_SPRITE.png', 44, 61, 41],
    // BACKSTAGE
    'VENDING_MACHINE_SPRITE': ['images/backstage/VENDING_MACHINE_SPRITE.png', 49, 72, 3],
    'BAND_IN_SOFA_SPRITE': ['images/backstage/BAND_IN_SOFA_SPRITE.png', 70, 78, 23],
    'GLASS_INV_SPRITE': ['images/backstage/GLASS_INV_SPRITE.png', 68, 26, 4],
    'COSTUME_INV_SPRITE': ['images/backstage/COSTUME_INV_SPRITE.png', 68, 26, 4],
    'BACKSTAGE_DOOR_TO_BACKYARD_SPRITE': ['images/backstage/BACKSTAGE_DOOR_TO_BACKYARD_SPRITE.png', 61, 104, 2],
    //Backyard
    'BACKYARD_DOOR_TO_BACKSTAGE_SPRITE': ['images/backyard/BACKYARD_DOOR_TO_BACKSTAGE_SPRITE.png', 31, 104, 2],
    'BILI_SPRITE': ['images/backyard/BILI_SPRITE.png', 43, 70, 24],
    'BALLOON_SPRITE': ['images/backyard/BALLOON_SPRITE.png', 28, 59, 10]
};
const IMAGES = {
    // UI
    'UI_BG': 'images/ui/UI_BG.png',
    'UI_INV_BG': 'images/ui/UI_INV_BG.png',
    'UI_CONVERSATION_BG': 'images/ui/UI_CONVERSATION_BG.png',
    'LOGO': 'images/ui/LOGO.png',
    'THE_GAME': 'images/ui/THE_GAME.png',
    'CREDITS': 'images/ui/CREDITS.png',
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
    'FONT_32_ORANGE': ['images/fonts/font_32_orange.png', 'images/fonts/font_32_orange.fnt'],
    'FONT_32_BLUE': ['images/fonts/font_32_blue.png', 'images/fonts/font_32_blue.fnt'],
    'FONT_32_RED': ['images/fonts/font_32_red.png', 'images/fonts/font_32_red.fnt'],
    'FONT_32_YELLOW': ['images/fonts/font_32_yellow.png', 'images/fonts/font_32_yellow.fnt'],
    'FONT_32_PURPLE': ['images/fonts/font_32_purple.png', 'images/fonts/font_32_purple.fnt']
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

},{}],54:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
class Coin extends Thing_1.Thing {
    constructor() {
        let options = {
            id: 'coin',
            inventoryImageId: 'COIN_INV',
            name: 'COIN',
            directlyInInventory: true
        };
        super(options);
    }
    lookAction(player) {
        player.say('I_AM_NOT_RICH_BUT_IT_IS_A_START');
    }
}
exports.Coin = Coin;

},{"../../engine/models/Thing":19}],55:[function(require,module,exports){
"use strict";
const Game_1 = require('../engine/models/Game');
const DoctortillaLabels_1 = require('./DoctortillaLabels');
const DoctortillaPlayer_1 = require('./DoctortillaPlayer');
const BackstageScene_1 = require('./backstageScene/BackstageScene');
const BackyardScene_1 = require('./backyardScene/BackyardScene');
const Directions_1 = require('../engine/utils/Directions');
const UIBlocker_singleton_1 = require('../engine/ui/UIBlocker.singleton');
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
    onStart() {
        UIBlocker_singleton_1.uiBlocker.block();
        let player = this.options.player;
        player.moveTo({ x: 115, y: 187 })
            .then(() => {
            return player.wait(1000);
        })
            .then(() => {
            player.lookAt(Directions_1.Directions.DOWN);
            return player.say('LATE_FOR_CONCERT');
        })
            .then(() => {
            return player.wait(1000);
        })
            .then(() => {
            return player.say('AGAIN');
        })
            .then(() => {
            return player.wait(1000);
        })
            .then(() => {
            return player.say('THE_OTHERS_WILL_BE_READY');
        })
            .then(() => {
            return player.moveTo({ x: 383, y: 183 });
        })
            .then(() => {
            UIBlocker_singleton_1.uiBlocker.unblock();
        });
    }
}
exports.DoctortillaGame = DoctortillaGame;

},{"../engine/models/Game":10,"../engine/ui/UIBlocker.singleton":42,"../engine/utils/Directions":47,"./DoctortillaLabels":56,"./DoctortillaPlayer":57,"./backstageScene/BackstageScene":61,"./backyardScene/BackyardScene":81}],56:[function(require,module,exports){
"use strict";
exports.DOCTORTILLA_LABELS = {
    'es': {},
    'en': {
        'A_BROOM_THE_PERFECT_CLEANING_INSTRUMENT': 'A broom, the perfect cleaning instrument.',
        'A_RANCID_AND_GREASY_SANDWHICH': 'A rancid and GREASY sandwhich.',
        'AGAIN': 'Again...',
        'ALL_IN_ALL_HE_IS_A_GOOD_GUY': 'A nice guy, this Bili.',
        'ALL_READY_FIND_BILI': 'All is solved now! Let me grab Bili and we\'ll start.',
        'AND_EXPENSIVE': '... and expensive.',
        'AND_I_AM_NOT_GOING_TO_GIVE_HIM_ANY': 'And I am not planning on giving him any more.',
        'AND_WE_LEARNED': 'and we learned.',
        'ARGH': 'Argh!',
        'ASK_ABOUT_CABLE': 'Where do I find a cable now, you lazy bastards?',
        'ASK_ABOUT_COSTUME': 'Tell me more about that missing costume.',
        'ASK_ABOUT_SANTI': 'What\'s the matter with you Santi?',
        'BACKSTAGE': 'backstage',
        'BACKYARD': 'backyard',
        'BACON': 'bacon',
        'BALLOON': 'balloon',
        'BARELY_TASTED_LIKE_DRUG': 'Well, it barely tasted like drugs...',
        'BEAUTIFUL_SOMETHING': 'That is a beautiful something.',
        'BILI': 'Bili',
        'BILI_MUST_BE_OUT_THERE_SMOKING': 'Bili must be out there smoking.',
        'BOCADILLO': 'bacon sandwhich',
        'BURP': 'Burp!',
        'BREAD': 'bread',
        'BREAD_LEFTOVERS_NOT_USEFUL': 'Bread leftovers, not very useful.',
        'BROOM': 'broom',
        'CABLE': 'cable',
        'CAN': 'soda can',
        'CANNOT_PICK_A_DOOR_UP': 'I obviously cannot pick the door up. I would destroy the building.',
        'CLONK': 'Clonk\n   clonk\n      clonk',
        'COCONUT': 'coconut',
        'COIN': 'coin',
        'COOL_NOW_I_SHOULD_GIVE_IT_TO_THE_GUYS': 'Cool, now I should give that to the guys.',
        'COMPARE_COMPRAME_UN_COCO': 'A coconut, rough skin, delicious content.',
        'COSTUME': 'costume',
        'DELICIOUS_AND_GREASY': 'Delicious and GREASY!',
        'DOES_IT_LOOK_LIKE_A_PAIR_OF_TITS': 'Does it look like a pair of tits?',
        'DOOR_TO_BACKSTAGE': 'door to backstage',
        'DOOR_TO_BACKYARD': 'door to backyard',
        'DOOR_TO_STAGE': 'door to stage',
        'DOOR_TO_STREET': 'door to street',
        'DRUGS_ARE_BAD': '... yeah man drugs are really bad ...',
        'DRUNK_1': 'Npo amn ti am perfecytly faine.',
        'DRUNK_2': 'Sthe fuck? i havue never befen more osrbe!',
        'DRUNK_3': 'This is ea lkegendary evenngi rof hsex and drugfs!',
        'DRUNK_4': 'Shut ujp kand bring me moare b.ere',
        'DRUNK_5': 'Yuo asre kmy bsest tfrneid ancd si ldove yoiu.',
        'DRUNK_6': 'Tthe mreptilinas iare comnig for yuo now.',
        'DRUNK_BILI': 'drunk Bili',
        'FINALLY_I_GOT_THE_CABLE': 'Finally I got the cable!',
        'FIRST_ANGEL_CABLE': 'First, we need a cable to plug Angel\'s amp.',
        'FIRST_I_NEED_TO_GET_THE_BAND_READY': 'First I need to get the band ready.',
        'FLOWERS': 'flowers',
        'FOUND_THE_CABLE': 'I found a cable!',
        'GLASS': 'glass',
        'GOT_THE_COSTUME': 'I just made a costume for you.',
        'GULP_GULP_GULP': 'Gulp\n   Gulp\n      Gulp',
        'HAVE_A_DRINK_SANTI': 'Hey Santi, here, have this drink.',
        'HAVE_I_EVER_FAILED_YOU': 'Have I ever failed you?',
        'HAVE_YOU_SEEN_BILI': 'Mmm, I\'m missing Bili, where is he?',
        'HE_IS_BEING_GOOD_FOR_NOW_NO_NEED_TO_EXPLODE_IT': 'He is being good for now, no need to explode his balloon.',
        'HE_IS_DRINKING_LIKE_A_MANIAC': 'He is drinking like a maniac, I need to start the concert as soon as possible.',
        'HE_IS_OUT_SMOKING': 'He\'s outside, drinking and smoking. If we let him there too much time he\'ll be drunk as a skunk.',
        'HE_IS_DRUNK_AS_A_SKUNK': 'Yup, now he is drunk as a skunk.',
        'HEY_BILI_HOW_IS_IT_GOING': 'Hey Bili how is it going?',
        'HI_DOOR_HOW_ARE_YOU_TODAY': 'Hi door! How are you today?',
        'HI_THERE': 'Hi there.',
        'HOW_IS_BILI_DOING': 'How is Bili doing, by the way?',
        'I_ALREADY_HAVE_IT': 'I already have it.',
        'I_ALREADY_PUSHED_IT': 'I already pushed it, I don\'t wanna over do it.',
        'I_AM_AWAKE': 'Ahhhhh! I AM AWAKE!!!',
        'I_AM_JUST_KEEPING_MY_THROAT_WARM': 'I am just keeping my throat warm, no worries.',
        'I_AM_NOT_DRUNK_ANYMORE': 'Wow! I am not drunk anymore.',
        'I_AM_NOT_RICH_BUT_IT_IS_A_START': 'I\'m not exactly rich, but it\'s a start!',
        'I_AM_NOT_GOING_TO_ASK_WHERE_THIS_COMES_FROM': 'I\'m not going to ask where you got this from.',
        'I_AM_STATRING_TO_FEEL_READY_TO_PLAY': 'It\'s weird, I am suddendly starting to feel ready to play.',
        'I_BET_I_COULD_DO_A_BEAUTIFUL_COSTUME_WITH_IT': 'I bet I could do a beautiful costume with this.',
        'I_BET_THIS_DUST_CAN_MAKE_SOMEBODY_LESS_SHY': 'I bet this "dust" can make "somebody" less shy',
        'I_CAN_HEAR_THE_CROWD_WAITING_FOR_US': 'I can hear the crowd waiting for us, good thing this door is protecting us.',
        'I_CANT_MOVE_THAT': 'I can\'t move that.',
        'I_CANT_DO_THAT': 'I can\'t do that.',
        'I_COULD_MAKE_A_WIG_WITH_THIS': 'I think I could make a blonde wig with this.',
        'I_DONT_KNOW_HOW_TO_DO_THAT': 'I don\'t know how to do that.',
        'I_DONT_KNOW_HOW_TO_USE_THAT_WITH_VENDING_MACHINE': 'I don\t know how to use that with a vending machine...',
        'I_HAVE_A_CONCERT_TO_PLAY': 'I have a concert to play!',
        'I_HAVE_BETTER_THINGS_TO_DO_THAN_TALKING': 'I have better things to do than talking to objects.',
        'I_HAVE_TO_FIND_A_WAY_TO_SOBER_HIM_UP': 'I have to find a way to sober him up.',
        'I_HAVE_TO_FINISH_THE_COSTUME_FIRST': 'I have to finish the costume first.',
        'I_HAVE_TO_PICK_IT_UP_FIRST': 'I have to pick it up first.',
        'I_HEARD_THE_GUYS_ARE_HAVING_SOME_PROBLEMS': 'I heard the guys are having some problems.',
        'I_SHOULD_ADD_A_SKIRT_TO_IT': 'I should add a skirt to it.',
        'I_SHOULD_PROBABLY_MIX_IT_IN_A_GLASS': 'I should probably mix it in a glass.',
        'I_SHOULD_PUT_SOMETHING_MORE_INTERESTING_IN_THE_GLASS': 'I should put something more interesting in the glass before giving it to them.',
        'I_THINK_I_CAN_OPEN_IT_AND_TAKE_THE_BACON': 'I think I can open it and take the bacon.',
        'I_THINK_MY_MASTERPIECE_IS_COMPLETE': 'I think my masterpiece is complete.',
        'I_WILL_WAIT_FOR_THEM_TO_BE_SOLVED': 'I will wait for them to be solved automagically.',
        'I_WOULD_DO_IT_MYSELF': 'I would do it myself, but it is kind of illegal...',
        'I_WOULDNT_KNOW_WHAT_TO_SAY': 'I wouldn\'t know what to say.',
        'IF_I_ADD_SOME_BOOBS_IT_WILL_LOOK_LIKE_A_HAWAIIAN_DRESS': 'If I add some boobs it will look like a hawaiian dress.',
        'IF_I_COULD_PUT_GREASE_BELOW': 'If I could just put some grease below it...',
        'IMPLIES_MOVEMENT': '... and it implies a certain ammount of effort and movement.',
        'IT_IS_A_LONG_TIME_TRADITION_THAT_WE_ALL_DRESSED_UP': 'It is a tradition that started long time ago, dressing up for our concerts...',
        'IT_IS_ALREADY_CLOSED': 'It is already closed.',
        'IT_IS_ALREADY_FULL': 'It is already full.',
        'IT_IS_INDEED_A_GLASS': 'It is indeed a glass.',
        'IT_IS_STUCK_BEHIND_THE_VENDING_MACHINE': 'It is stuck behind the vending machine, I need to move it somehow.',
        'IT_WAS_COWBOY_COSTUME': 'It was a cowboy costume, man. A cool one.',
        'IS_SOMEHOW_DANGEROUS': '... marginally dangerous, I would say...',
        'JUST_STEAL_ONE': 'Don\'t know man, just steal one somewhere.',
        'LATE_FOR_CONCERT': 'Man I am two hours late to my own concert.',
        'LET_S_SAY_I_HAVE_MY_SOURCES': 'Let\'s say I have my sources...',
        'LETS_FIX_THIS_MESS': 'OK, let\'s see if I can fix this disaster.',
        'MADE_OF_METAL_RUST_AND_STICKY_STUFF': 'Door. Composition: 80% metal, 15% rust, 5% unidentified sticky stuff.',
        'MAN_YOU_SHOULD_KNOW_THIS': 'Man, you should know this, you started it!',
        'MINE_WAS_WAY_BETTER': 'Mine was WAY better.',
        'MMM_A_REFRESHING_BEVERAGE': 'Mmm a refreshing beverage! Thanks!',
        'NICE_COSTUME_HE_MADE': 'Hey! He made a really good costume this time!',
        'NICE_IT_WILL_SLIDE_REALLY_WELL_NOW': 'Nice, it will slide really well now...',
        'NICE_OBJECT': 'Nice object.',
        'NICE_SAFE_DOOR': 'It is door. Useful to make people feel safe and cozy inside of places.',
        'NOPE_I_CANNOT_GO_TO_THE_STREET': 'Nope, I can\'t go to the street yet.',
        'NOPE_I_CANNOT_GO_TO_THE_STAGE': 'Nope, I can\'t go to the stage yet.',
        'NOPE_I_DONT_WANT_TO_TAKE_BILIS_BALLOON': 'Nope, I don\'t wanna take Bili\'s balloon. He needs it for his costume.',
        'NOT_TO_BAD_ALL_THINGS_CONSIDERED': 'Not bad all things considered.',
        'NOT_SAFE_HAVING_SCISSORS_AROUND_MUSICIANS': 'Not safe having scissors around musicians.',
        'NOT_SAYING_WE_SHOULD_USE_THEM': 'I am not saying we should used them, but...',
        'OH_LOOK_AT_THAT': 'Oh! Look at that.',
        'OH_MY_YOU_ARE_DRUNK_ARENT_YOU': 'Oh my! Your are totally drunk, aren\'t you?',
        'OK_I_LL_PUT_IT_ON': 'Ok, boss, I\'ll put it on.',
        'OK_SEE_YOU_LATER': 'Ok man, see you later!',
        'PLEASE_DONT_DRINK_TOO_MUCH': 'Please don\'t drink too much, I will solve this really soon!',
        'PROBABLY_IF_I_SCARE_HIM_HE_WILL_WAKE_UP': 'Probably if I scared him he would sober up.',
        'PROBLEMS_I_AM_OUT': 'Problems? Complications? I\'m outta here man...',
        'PROBLEMS_LET_ME_HELP': 'Problems? Please tell me more, dear friends.',
        'READY_TO_PLAY': 'Hey guys! Ready to rock?!',
        'REALLY_USEFUL_TO_PUT_LIQUIDS_INSIDE': 'Really useful to put liquids or other substances inside.',
        'REST_OF_THE_BAND': 'rest of the band',
        'SECOND_JUAN_COSTUME': 'Second, we need a costume for Juan, he forgot his at home.',
        'SEE_YOU_SOON': 'See you soon!',
        'SCISSORS': 'scissors',
        'SHE_IS_SHY_DOESNT_WANT_TO_TALK_TO_ME': 'She is shy, doesn\'t want to talk with me today.',
        'SHINY_AND_SHARP': 'Shiny and sharp!',
        'SKIRT': 'skirt',
        'SO_PLEASE_FIND_ME_SOMETHING_ELEGANT_I_CAN_USE': 'So please find a really elegant costume that lives up to my expectations.',
        'SO_THIS_IS_THE_END_FOLKS': 'So this is the end, folks.',
        'SO_WE_SOMEHOW_DISTRACT_THE_ATTENTION': '... so we distract people from the fact that we don\'t know how to play.',
        'SOME_CULTURES_USED_DRUGS': 'You know, some cultures used drugs to encourage warriors...',
        'SOME_FLOWERS_WOULD_BE_NICE': 'Some flowers would be nice.',
        'SURE_BOSS': 'Yes, sure boss!',
        'SUSPICIOUS_DUST': 'suspicious dust',
        'TALK_TO_YOU_LATER': 'I have to go, see you later!',
        'THANKS_FOR_HELPING_ME_IN_THIS_ADVENTURE': 'Thanks for helping me in this adventure!',
        'THAT_CANNOT_BE_CLOSED': 'That cannot be closed.',
        'THAT_CANNOT_BE_OPENED': 'That cannot be opened.',
        'THAT_IS_A_HUGE_BALLOON_QUITE_SCARY_IF_IT_EXPLODES': 'That is a huge balloon, it would be quite scary if it exploded.',
        'THAT_IS_A_STUPID_COSTUME': 'Well, that is a stupid costume if I ever saw one.',
        'THAT_IS_MY_BAND_1': 'That is my band. They may be lazy and not specially skilled, but they are nice people.',
        'THAT_IS_MY_BAND_2': 'Oh my, what a band! The best from the best!',
        'THAT_IS_MY_BAND_3': 'Look at them, so peaceful, not moving a finger...',
        'THAT_S_SOME_HIGHLY_SUSPICIOUS_WHITE_POWDER': 'That\'s some highly suspicious white powder.',
        'THAT_S_THE_DOOR_TO_GO_BACK_TO_THE_BACKSTAGE': 'That\'s the door to go BACK to the BACKstage.',
        'THAT_S_THE_SPIRIT': 'That\'s the spirit!',
        'THE_FLOOR_IS_STICKY': 'The floor is so sticky it is impossible to move it.',
        'THE_ONLY_THING_HE_WANTS_RIGHT_NOW_IS_BEER': 'The only thing he wants right now is beer.',
        'THE_OTHERS_WILL_BE_READY': 'But I am sure the rest of the band will be ready, let\'s talk to them.',
        'THERE_ARE_SOME_PROBLEMS_1': 'Actually some small problems have arised...',
        'THERE_ARE_SOME_PROBLEMS_2': '... really minor complications ...',
        'THERE_ARE_SOME_PROBLEMS_3': '... a CRAZY MESS.',
        'THIRD_SANTI_SHY': 'And third, Santi just got shy. He refuses to play...',
        'THIS_CABLE_COULD_BE_USEFUL': 'This cable could be useful, maybe I can "borrow" it.',
        'TIME_TO_GIVE_IT_TO_JUAN': 'Time to give it to Juan.',
        'VENDING_MACHINE': 'vending machine',
        'VERY_BEAUTIFUL_FLOWERS': 'Very beautiful flowers.',
        'VINTAGE_PREMIUM_COSTUME': 'A vintage, really premium costume I must say.',
        'WE_CAN_PLAY_THE_CONCERT_NOW': 'We can play the concert now, my friend.',
        'WE_CRIED': 'we cried',
        'WE_DONT_REHEARSE_ENOUGH': 'Man, we haven\'t practiced enough, we are not ready to play!',
        'WE_HAVE_THREE_PROBLEMS': 'Basically we have three problems...',
        'WE_HAVENT_PRACTISED_SINCE_2012': 'I think last rehearsal was in 2012.',
        'WE_LAUGHED': 'We laughed,',
        'WELL_I_HAD_AN_AWESOME_COSTUME': 'Well I had an awesome costume, you know?',
        'WHAT_CAN_WE_DO_GUYS': 'What can we do guys? Any ideas?',
        'WHY_COSTUMES': 'Why are we all dressed up anyhow?',
        'WISE_PURCHASE': 'That was a wise purchase.',
        'YEP_I_COULD_BUILD_A_COSTUME_WITH_THIS': 'Yep, I could build a costume with this.',
        'YES_MOM': 'Yes, mom.',
        'YOU_BETTER_PUT_IT_ON': 'You better put it one before I get angry.',
        'YOU_ARE_A_COWARD_MAN_WE_HAVE_COSTUMES': 'Don\'t be a pussy man... We have our costumes, people just won\'t pay attention to the music.',
        'YOU_STOLE_IT': 'You stole it, right?',
        'YOUR_LACK_OF_CONFIDENCE_DISSAPOINTS_ME': 'Oh please! Your lack of confidence dissapoints me.'
    }
};

},{}],57:[function(require,module,exports){
"use strict";
const Player_1 = require('../engine/models/Player');
const RandomText_1 = require('../engine/utils/RandomText');
const Coin_1 = require('./BackstageScene/Coin');
const ActiveInventory_singleton_1 = require('../engine/state/ActiveInventory.singleton');
const Style_1 = require('../engine/ui/Style');
const Scenes_singleton_1 = require('../engine/state/Scenes.singleton');
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
spriteOptions.set('give_glass', { frames: [34, 35, 36, 37] });
spriteOptions.set('pierce_balloon', { frames: [38, 39, 40, 41] });
const options = {
    spriteId: 'DOCTORTILLA_PLAYER_SPRITE',
    initialX: 93,
    initialY: 184,
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
    onStateChange() {
        if (this.deliveredEverything()) {
            let bili = Scenes_singleton_1.scenes.getSceneById('BACKYARD').getThingById('bili');
            bili.changeAttr('DRUNK', true);
        }
    }
}
exports.DoctortillaPlayer = DoctortillaPlayer;

},{"../engine/models/Player":15,"../engine/state/ActiveInventory.singleton":20,"../engine/state/Scenes.singleton":22,"../engine/ui/Style":39,"../engine/utils/RandomText":50,"./BackstageScene/Coin":54}],58:[function(require,module,exports){
"use strict";
const Door_1 = require('../../engine/models/Door');
const RandomText_1 = require('../../engine/utils/RandomText');
class BackstageDoorToBackyard extends Door_1.Door {
    constructor() {
        let options = {
            id: 'BACKSTAGE_TO_BACKYARD',
            name: 'DOOR_TO_BACKYARD',
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
            return 'BACKYARD';
        }
        else {
            return 'DOOR_TO_BACKYARD';
        }
    }
    takeAction(player) {
        player.say('CANNOT_PICK_A_DOOR_UP');
    }
    speakAction(player) {
        player.say(RandomText_1.randomText('HI_DOOR_HOW_ARE_YOU_TODAY', 'SHE_IS_SHY_DOESNT_WANT_TO_TALK_TO_ME', 'I_HAVE_BETTER_THINGS_TO_DO_THAN_TALKING'));
    }
    lookAction(player) {
        player.say('BILI_MUST_BE_OUT_THERE_SMOKING');
    }
}
exports.BackstageDoorToBackyard = BackstageDoorToBackyard;

},{"../../engine/models/Door":9,"../../engine/utils/RandomText":50}],59:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Directions_1 = require('../../engine/utils/Directions');
const RandomText_1 = require('../../engine/utils/RandomText');
let options = {
    id: 'backstage_door_to_stage',
    x: 330,
    y: 67,
    spriteId: 'BACKSTAGE_DOOR_TO_STAGE',
    name: 'DOOR_TO_STAGE',
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
        player.say('NOPE_I_CANNOT_GO_TO_THE_STAGE')
            .then(() => {
            return player.say('FIRST_I_NEED_TO_GET_THE_BAND_READY');
        });
    }
    closeAction(player) {
        player.say('IT_IS_ALREADY_CLOSED');
    }
    takeAction(player) {
        player.say('CANNOT_PICK_A_DOOR_UP');
    }
    pushAction(player) {
        player.lookAt(Directions_1.Directions.DOWN);
        player.say('NOPE_I_CANNOT_GO_TO_THE_STAGE')
            .then(() => {
            return player.say('FIRST_I_NEED_TO_GET_THE_BAND_READY');
        });
    }
    speakAction(player) {
        player.say(RandomText_1.randomText('HI_DOOR_HOW_ARE_YOU_TODAY', 'SHE_IS_SHY_DOESNT_WANT_TO_TALK_TO_ME', 'I_HAVE_BETTER_THINGS_TO_DO_THAN_TALKING'));
    }
    lookAction(player) {
        player.say(RandomText_1.randomText('NICE_SAFE_DOOR', 'MADE_OF_METAL_RUST_AND_STICKY_STUFF', 'I_CAN_HEAR_THE_CROWD_WAITING_FOR_US'));
    }
}
exports.BackstageDoorToStage = BackstageDoorToStage;

},{"../../engine/models/Thing":19,"../../engine/utils/Directions":47,"../../engine/utils/RandomText":50}],60:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Directions_1 = require('../../engine/utils/Directions');
const RandomText_1 = require('../../engine/utils/RandomText');
let options = {
    id: 'bacsktage_door_to_street',
    x: 59,
    y: 100,
    spriteId: 'BACKSTAGE_DOOR_TO_STREET',
    name: 'DOOR_TO_STREET',
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
        player.say('NOPE_I_CANNOT_GO_TO_THE_STREET')
            .then(() => {
            return player.say('I_HAVE_A_CONCERT_TO_PLAY');
        });
    }
    closeAction(player) {
        player.say('IT_IS_ALREADY_CLOSED');
    }
    takeAction(player) {
        player.say('CANNOT_PICK_A_DOOR_UP');
    }
    pushAction(player) {
        player.lookAt(Directions_1.Directions.DOWN);
        player.say('NOPE_I_CANNOT_GO_TO_THE_STREET')
            .then(() => {
            return player.say('I_HAVE_A_CONCERT_TO_PLAY');
        });
    }
    speakAction(player) {
        player.lookAt(Directions_1.Directions.LEFT);
        player.say(RandomText_1.randomText('HI_DOOR_HOW_ARE_YOU_TODAY', 'SHE_IS_SHY_DOESNT_WANT_TO_TALK_TO_ME', 'I_HAVE_BETTER_THINGS_TO_DO_THAN_TALKING'));
    }
    lookAction(player) {
        player.lookAt(Directions_1.Directions.LEFT);
        player.say(RandomText_1.randomText('NICE_SAFE_DOOR', 'MADE_OF_METAL_RUST_AND_STICKY_STUFF', 'I_CAN_HEAR_THE_CROWD_WAITING_FOR_US'));
    }
}
exports.BackstageDoorToStreet = BackstageDoorToStreet;

},{"../../engine/models/Thing":19,"../../engine/utils/Directions":47,"../../engine/utils/RandomText":50}],61:[function(require,module,exports){
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
        { x: 55, y: 218 },
        { x: 101, y: 168 },
        { x: 142, y: 163 },
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

},{"../../engine/models/Scene":17,"../../engine/utils/Polygon":49,"./BackstageDoorToBackyard":58,"./BackstageDoorToStage":59,"./BackstageDoorToStreet":60,"./BandInSofa":63,"./Bocadillo":64,"./Broom":66,"./Cable":67,"./Coconut":69,"./DustInTable":72,"./FlyCase":73,"./Glass":74,"./LampLeft":75,"./LampRight":76,"./Scissors":77,"./VendingMachine":79}],62:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const options = {
    id: 'bacon',
    spriteId: 'BACON',
    inventoryImageId: 'BACON_INV',
    name: 'BACON',
    directlyInInventory: true
};
class Bacon extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    lookAction(player) {
        player.say('DELICIOUS_AND_GREASY');
    }
}
exports.Bacon = Bacon;

},{"../../engine/models/Thing":19}],63:[function(require,module,exports){
"use strict";
const SpeechBubble_1 = require('../../engine/ui/SpeechBubble');
const Thing_1 = require('../../engine/models/Thing');
const ConversationWithBand_1 = require('./ConversationWithBand');
const Directions_1 = require('../../engine/utils/Directions');
const Style_1 = require('../../engine/ui/Style');
const RandomText_1 = require('../../engine/utils/RandomText');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const Analytics_1 = require('../../engine/utils/Analytics');
let spriteOptions = new Map();
spriteOptions.set('quiet', { frames: [0] });
spriteOptions.set('juan_talking', { frames: [1, 2, 3, 4, 5, 6] });
spriteOptions.set('angel_talking', { frames: [7, 8, 9, 10, 11, 12] });
spriteOptions.set('santi_talking', { frames: [13, 14, 15, 16, 17, 18] });
spriteOptions.set('santi_drinking', { frames: [19, 20, 21, 22] });
class BandInSofa extends Thing_1.Thing {
    constructor() {
        let options = {
            id: 'bandInSofa',
            x: 481,
            y: 105,
            spriteId: 'BAND_IN_SOFA_SPRITE',
            name: 'REST_OF_THE_BAND',
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
        player.say(RandomText_1.randomText('THAT_IS_MY_BAND_1', 'THAT_IS_MY_BAND_2', 'THAT_IS_MY_BAND_3'));
    }
    speakAction(player) {
        Analytics_1.analytics.sendEvent('game', 'talk_to_band');
        this.startConversation(player);
    }
    say(text, whoTalks) {
        this.playAnimation(whoTalks + '_talking');
        this.updateSpeechBubbleStyle(whoTalks);
        return this.speechBubble.say(text).then(() => {
            this.playAnimation('quiet');
        });
    }
    getPositionOnTop() {
        var result = {
            x: this.sprite.x,
            y: Math.round(this.sprite.getBounds().y) - 10
        };
        if (this.lastPersonTalking === 'santi') {
            result.x += 70;
            result.y += 10;
        }
        if (this.lastPersonTalking === 'angel') {
            result.x += 30;
        }
        if (this.lastPersonTalking === 'juan') {
            result.x -= 20;
            result.y += 10;
        }
        return result;
    }
    giveAction(player) {
        var thing = SelectedObjects_1.selectedThing.thing;
        if (thing.id === 'cable') {
            this.startConversation(player);
        }
        else if (thing.id === 'glass') {
            if (thing.getAttr('FILLED') && thing.getAttr('POWDER_INSIDE')) {
                this.startConversation(player);
            }
            else {
                player.say('I_SHOULD_PUT_SOMETHING_MORE_INTERESTING_IN_THE_GLASS');
            }
        }
        else if (thing.id === 'costume') {
            if (player.getAttr('COSTUME_COMPLETE')) {
                this.startConversation(player);
            }
            else {
                player.say('I_HAVE_TO_FINISH_THE_COSTUME_FIRST');
            }
        }
        else {
            super.useAction(player);
        }
    }
    updateSpeechBubbleStyle(whoTalks) {
        this.lastPersonTalking = whoTalks;
        if (whoTalks === 'santi') {
            this.speechBubble.setForegroundTextStyle('FONT_32_BLUE');
            this.speechBubble.setShadowTextStyle('FONT_32_BLACK');
        }
        if (whoTalks === 'juan') {
            this.speechBubble.setForegroundTextStyle('FONT_32_ORANGE');
            this.speechBubble.setShadowTextStyle('FONT_32_BLACK');
        }
        if (whoTalks === 'angel') {
            this.speechBubble.setForegroundTextStyle('FONT_32_YELLOW');
            this.speechBubble.setShadowTextStyle('FONT_32_BLACK');
        }
    }
    startConversation(player) {
        player.goToThing(this).then(() => new ConversationWithBand_1.ConversationWithBand(player, this));
    }
}
exports.BandInSofa = BandInSofa;

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":23,"../../engine/ui/SpeechBubble":38,"../../engine/ui/Style":39,"../../engine/utils/Analytics":46,"../../engine/utils/Directions":47,"../../engine/utils/RandomText":50,"./ConversationWithBand":70}],64:[function(require,module,exports){
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
    name: 'BOCADILLO',
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
            player.say('I_THINK_I_CAN_OPEN_IT_AND_TAKE_THE_BACON');
        }
        else {
            player.say('A_RANCID_AND_GREASY_SANDWHICH');
        }
    }
    openAction(player) {
        if (this.isInInventory()) {
            new Bacon_1.Bacon();
            new Bread_1.Bread();
            this.destroy();
        }
        else {
            player.say('I_HAVE_TO_PICK_IT_UP_FIRST');
        }
    }
}
exports.Bocadillo = Bocadillo;

},{"../../engine/models/Thing":19,"./Bacon":62,"./Bread":65}],65:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const options = {
    id: 'bread',
    spriteId: 'BREAD',
    inventoryImageId: 'BREAD_INV',
    name: 'BREAD',
    directlyInInventory: true
};
class Bread extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    lookAction(player) {
        player.say('BREAD_LEFTOVERS_NOT_USEFUL');
    }
}
exports.Bread = Bread;

},{"../../engine/models/Thing":19}],66:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const Verbs_store_1 = require('../../engine/stores/Verbs.store');
const Skirt_1 = require('./Skirt');
const RandomText_1 = require('../../engine/utils/RandomText');
const options = {
    id: 'broom',
    x: 103,
    y: 119,
    spriteId: 'BROOM',
    inventoryImageId: 'BROOM_INV',
    name: 'BROOM',
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
            player.say('I_COULD_MAKE_A_WIG_WITH_THIS');
        }
        else {
            player.say(RandomText_1.randomText('A_BROOM_THE_PERFECT_CLEANING_INSTRUMENT', 'I_COULD_MAKE_A_WIG_WITH_THIS'));
        }
    }
    useAction(player) {
        if (SelectedObjects_1.selectedThing.thing.id === 'scissors') {
            this.cutWithScissors();
        }
        else {
            player.say('I_DONT_KNOW_HOW_TO_DO_THAT');
        }
    }
    cutWithScissors() {
        new Skirt_1.Skirt();
        this.destroy();
    }
}
exports.Broom = Broom;

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":23,"../../engine/stores/Verbs.store":27,"../../engine/utils/RandomText":50,"./Skirt":78}],67:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Scenes_singleton_1 = require('../../engine/state/Scenes.singleton');
const options = {
    id: 'cable',
    x: 187,
    y: 125,
    spriteId: 'CABLE',
    inventoryImageId: 'CABLE_INV',
    name: 'CABLE',
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
                player.say('FINALLY_I_GOT_THE_CABLE');
                this.letPlayerComeAndTakeIt(player);
            }
            else {
                player.say('IT_IS_STUCK_BEHIND_THE_VENDING_MACHINE');
            }
        });
    }
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('COOL_NOW_I_SHOULD_GIVE_IT_TO_THE_GUYS');
        }
        else {
            player.say('THIS_CABLE_COULD_BE_USEFUL');
        }
    }
}
exports.Cable = Cable;

},{"../../engine/models/Thing":19,"../../engine/state/Scenes.singleton":22}],68:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
class Can extends Thing_1.Thing {
    constructor() {
        let options = {
            id: 'can',
            inventoryImageId: 'CAN_INV',
            name: 'CAN',
            directlyInInventory: true
        };
        super(options);
    }
    useAction(player) {
        if (SelectedObjects_1.selectedThing.thing.id === 'glass') {
            let glass = SelectedObjects_1.selectedThing.thing;
            glass.fillWithDrink(player, this);
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'dust') {
            player.say('I_SHOULD_PROBABLY_MIX_IT_IN_A_GLASS');
        }
        else {
            super.useAction(player);
        }
    }
}
exports.Can = Can;

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":23}],69:[function(require,module,exports){
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
    name: 'COCONUT',
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
            player.say('DOES_IT_LOOK_LIKE_A_PAIR_OF_TITS');
        }
        else {
            player.say('COMPARE_COMPRAME_UN_COCO');
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
            super.useAction(player);
        }
    }
}
exports.Coconut = Coconut;

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":23,"../utils/CostumeCreator":90}],70:[function(require,module,exports){
"use strict";
const Conversation_1 = require('../../engine/models/Conversation');
const ConversationLine_1 = require('../../engine/models/ConversationLine');
const script = {
    'initial': [
        new ConversationLine_1.ConversationLine('READY_TO_PLAY', 'LIST_OF_PROBLEMS', sayProblemsIntro),
        new ConversationLine_1.ConversationLine('HAVE_YOU_SEEN_BILI', 'initial', sayBiliSituation),
        new ConversationLine_1.ConversationLine('TALK_TO_YOU_LATER', 'end')
    ],
    'LIST_OF_PROBLEMS': [
        new ConversationLine_1.ConversationLine('PROBLEMS_LET_ME_HELP', 'INITIAL_AFTER_FIRST_TALK', sayListOfProblems),
        new ConversationLine_1.ConversationLine('PROBLEMS_I_AM_OUT', 'INITIAL_AFTER_FIRST_TALK', sayListOfProblems)
    ],
    'INITIAL_AFTER_FIRST_TALK': [
        new ConversationLine_1.ConversationLine('HOW_IS_BILI_DOING', 'INITIAL_AFTER_FIRST_TALK', sayBiliSituation),
        new ConversationLine_1.ConversationLine('LETS_FIX_THIS_MESS', 'end')
    ],
    'WE_ARE_READY': [
        new ConversationLine_1.ConversationLine('ALL_READY_FIND_BILI', 'end')
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
            dialogPart.unshift(new ConversationLine_1.ConversationLine('GOT_THE_COSTUME', () => { return this.getStateIfPlayerDeliveredEverything(); }, sayCostumeIsOk));
        }
        else if (!this.player.getAttr('DELIVERED_COSTUME')) {
            dialogPart.unshift(new ConversationLine_1.ConversationLine('WHY_COSTUMES', 'INITIAL_AFTER_FIRST_TALK', sayWhyCostumes));
            dialogPart.unshift(new ConversationLine_1.ConversationLine('ASK_ABOUT_COSTUME', 'INITIAL_AFTER_FIRST_TALK', talkAboutCostume));
        }
    }
    addCableLine(dialogPart) {
        if (this.player.hasCable()) {
            dialogPart.unshift(new ConversationLine_1.ConversationLine('FOUND_THE_CABLE', () => { return this.getStateIfPlayerDeliveredEverything(); }, sayCableIsOk));
        }
        else if (!this.player.getAttr('DELIVERED_CABLE')) {
            dialogPart.unshift(new ConversationLine_1.ConversationLine('ASK_ABOUT_CABLE', 'INITIAL_AFTER_FIRST_TALK', talkAboutCable));
        }
    }
    addDrinkLine(dialogPart) {
        if (this.player.hasFunnyDrink()) {
            dialogPart.unshift(new ConversationLine_1.ConversationLine('HAVE_A_DRINK_SANTI', () => { return this.getStateIfPlayerDeliveredEverything(); }, sayDrinkIsOk));
        }
        else if (!this.player.getAttr('DELIVERED_DRINK')) {
            dialogPart.unshift(new ConversationLine_1.ConversationLine('ASK_ABOUT_SANTI', 'INITIAL_AFTER_FIRST_TALK', talkAboutSanti));
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
    return band.say('THERE_ARE_SOME_PROBLEMS_1', 'angel')
        .then(() => {
        return band.say('THERE_ARE_SOME_PROBLEMS_2', 'santi');
    })
        .then(() => {
        return band.say('THERE_ARE_SOME_PROBLEMS_3', 'juan');
    });
}
function sayListOfProblems(player, band) {
    player.changeAttr('TALKED_TO_BAND_ABOUT_PROBLEMS', true);
    return band.say('WE_HAVE_THREE_PROBLEMS', 'angel')
        .then(() => {
        return band.say('FIRST_ANGEL_CABLE', 'juan');
    })
        .then(() => {
        return band.say('SECOND_JUAN_COSTUME', 'angel');
    })
        .then(() => {
        return band.say('THIRD_SANTI_SHY', 'juan');
    });
}
function sayBiliSituation(player, band) {
    return band.say('HE_IS_OUT_SMOKING', 'angel');
}
function sayCostumeIsOk(player, band) {
    return band.say('THAT_IS_A_STUPID_COSTUME', 'juan')
        .then(() => {
        return band.say('MINE_WAS_WAY_BETTER', 'juan');
    })
        .then(() => {
        return player.say('YOU_BETTER_PUT_IT_ON');
    })
        .then(() => {
        band.changeAttr('HAS_COSTUME', true);
        player.changeAttr('DELIVERED_COSTUME', true);
        player.removeCostume();
        return band.say('OK_I_LL_PUT_IT_ON', 'juan');
    });
}
function talkAboutCostume(player, band) {
    return band.say('WELL_I_HAD_AN_AWESOME_COSTUME', 'juan')
        .then(() => {
        return band.say('IT_WAS_COWBOY_COSTUME', 'juan');
    })
        .then(() => {
        return band.say('VINTAGE_PREMIUM_COSTUME', 'juan');
    })
        .then(() => {
        return band.say('SO_PLEASE_FIND_ME_SOMETHING_ELEGANT_I_CAN_USE', 'juan');
    })
        .then(() => {
        return player.say('SURE_BOSS');
    });
}
function talkAboutCable(player, band) {
    return band.say('JUST_STEAL_ONE', 'juan')
        .then(() => {
        return band.say('I_WOULD_DO_IT_MYSELF', 'juan');
    })
        .then(() => {
        return band.say('IS_SOMEHOW_DANGEROUS', 'angel');
    })
        .then(() => {
        return band.say('IMPLIES_MOVEMENT', 'santi');
    });
}
function talkAboutSanti(player, band) {
    return band.say('WE_DONT_REHEARSE_ENOUGH', 'santi')
        .then(() => {
        return band.say('WE_HAVENT_PRACTISED_SINCE_2012', 'santi');
    })
        .then(() => {
        return player.say('YOU_ARE_A_COWARD_MAN_WE_HAVE_COSTUMES');
    })
        .then(() => {
        return player.say('WHAT_CAN_WE_DO_GUYS');
    })
        .then(() => {
        return band.say('SOME_CULTURES_USED_DRUGS', 'angel');
    })
        .then(() => {
        return band.say('NOT_SAYING_WE_SHOULD_USE_THEM', 'angel');
    })
        .then(() => {
        return band.say('DRUGS_ARE_BAD', 'juan');
    })
        .then(() => {
        return band.say('AND_EXPENSIVE', 'angel');
    });
}
function sayWhyCostumes(player, band) {
    return band.say('MAN_YOU_SHOULD_KNOW_THIS', 'santi')
        .then(() => {
        return band.say('IT_IS_A_LONG_TIME_TRADITION_THAT_WE_ALL_DRESSED_UP', 'juan');
    })
        .then(() => {
        return band.say('SO_WE_SOMEHOW_DISTRACT_THE_ATTENTION', 'angel');
    });
}
function sayCableIsOk(player, band) {
    return band.say('I_AM_NOT_GOING_TO_ASK_WHERE_THIS_COMES_FROM', 'angel')
        .then(() => {
        return band.say('YOU_STOLE_IT', 'santi');
    })
        .then(() => {
        band.changeAttr('HAS_CABLE', true);
        player.changeAttr('DELIVERED_CABLE', true);
        player.removeCable();
        return player.say('LET_S_SAY_I_HAVE_MY_SOURCES');
    });
}
function sayDrinkIsOk(player, band) {
    return player.playAnimationOnce('give_glass')
        .then(() => {
        player.playStandAnimation();
        return band.say('MMM_A_REFRESHING_BEVERAGE', 'santi');
    })
        .then(() => {
        return band.playAnimationOnce('santi_drinking');
    })
        .then(() => {
        return player.wait(2000);
    })
        .then(() => {
        return band.say('BURP', 'santi');
    })
        .then(() => {
        return band.say('BARELY_TASTED_LIKE_DRUG', 'santi');
    })
        .then(() => {
        return player.wait(2000);
    })
        .then(() => {
        return band.say('I_AM_STATRING_TO_FEEL_READY_TO_PLAY', 'santi');
    })
        .then(() => {
        band.changeAttr('HAS_DRINK', true);
        player.changeAttr('DELIVERED_DRINK', true);
        player.removeGlass();
        return player.say('THAT_S_THE_SPIRIT');
    });
}

},{"../../engine/models/Conversation":7,"../../engine/models/ConversationLine":8}],71:[function(require,module,exports){
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
    name: 'COSTUME',
    directlyInInventory: true
};
class Costume extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    useAction(player) {
        if (!this.isInInventory()) {
            player.say('I_HAVE_TO_PICK_IT_UP_FIRST');
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
            super.useAction(player);
        }
    }
    lookAction(player) {
        if (this.isComplete()) {
            player.say('I_THINK_MY_MASTERPIECE_IS_COMPLETE')
                .then(() => {
                return player.say('TIME_TO_GIVE_IT_TO_JUAN');
            });
        }
        if (this.getAttr('HAS_COCONUT') && this.getAttr('HAS_FLOWERS')) {
            player.say('I_SHOULD_ADD_A_SKIRT_TO_IT');
        }
        if (this.getAttr('HAS_COCONUT') && this.getAttr('HAS_SKIRT')) {
            player.say('SOME_FLOWERS_WOULD_BE_NICE');
        }
        if (this.getAttr('HAS_SKIRT') && this.getAttr('HAS_FLOWERS')) {
            player.say('IF_I_ADD_SOME_BOOBS_IT_WILL_LOOK_LIKE_A_HAWAIIAN_DRESS');
        }
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":23}],72:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const options = {
    id: 'dust',
    x: 247,
    y: 128,
    spriteId: 'DUST',
    inventoryImageId: 'DUST_INV',
    name: 'SUSPICIOUS_DUST',
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
            player.say('I_BET_THIS_DUST_CAN_MAKE_SOMEBODY_LESS_SHY');
        }
        else {
            player.say('THAT_S_SOME_HIGHLY_SUSPICIOUS_WHITE_POWDER');
        }
    }
    useAction(player) {
        if (!this.isInInventory()) {
            player.say('I_HAVE_TO_PICK_IT_UP_FIRST');
            return;
        }
        if (SelectedObjects_1.selectedThing.thing.id === 'glass') {
            let glass = SelectedObjects_1.selectedThing.thing;
            glass.fillWithDust(player, this);
        }
        else if (SelectedObjects_1.selectedThing.thing.id === 'can') {
            player.say('I_SHOULD_PROBABLY_MIX_IT_IN_A_GLASS');
        }
        else {
            super.useAction(player);
        }
    }
}
exports.Dust = Dust;

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":23}],73:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],74:[function(require,module,exports){
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
    name: 'GLASS',
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
            player.say('I_HAVE_TO_PICK_IT_UP_FIRST');
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
            super.useAction(player);
        }
    }
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('REALLY_USEFUL_TO_PUT_LIQUIDS_INSIDE');
        }
        else {
            player.say('IT_IS_INDEED_A_GLASS');
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
            player.say('IT_IS_ALREADY_FULL');
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

},{"../../engine/models/Thing":19,"../../engine/state/ActiveInventory.singleton":20,"../../engine/state/SelectedObjects":23}],75:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],76:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],77:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const RandomText_1 = require('../../engine/utils/RandomText');
const options = {
    id: 'scissors',
    x: 291,
    y: 128,
    spriteId: 'SCISSORS',
    inventoryImageId: 'SCISSORS_INV',
    name: 'SCISSORS',
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
            player.say('SHINY_AND_SHARP');
        }
        else {
            player.say(RandomText_1.randomText('SHINY_AND_SHARP', 'NOT_SAFE_HAVING_SCISSORS_AROUND_MUSICIANS'));
        }
    }
    useAction(player) {
        let otherObject = SelectedObjects_1.selectedThing.thing;
        if (otherObject.id === 'broom') {
            let broom = otherObject;
            broom.cutWithScissors();
        }
        else {
            super.useAction(player);
        }
    }
}
exports.Scissors = Scissors;

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":23,"../../engine/utils/RandomText":50}],78:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const CostumeCreator_1 = require('../utils/CostumeCreator');
const options = {
    id: 'skirt',
    spriteId: 'skirt',
    inventoryImageId: 'SKIRT',
    name: 'SKIRT',
    directlyInInventory: true
};
class Skirt extends Thing_1.Thing {
    constructor() {
        super(options);
    }
    lookAction(player) {
        player.say('YEP_I_COULD_BUILD_A_COSTUME_WITH_THIS');
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
            super.useAction(player);
        }
    }
}
exports.Skirt = Skirt;

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":23,"../utils/CostumeCreator":90}],79:[function(require,module,exports){
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
            name: 'VENDING_MACHINE',
            goToPosition: {
                x: 167,
                y: 178
            },
            directionToLook: Directions_1.Directions.UP
        };
        super(options);
        this.speechBubble = new SpeechBubble_1.SpeechBubble({
            owner: this,
            foregroundTextStyle: 'FONT_32_BLACK',
            shadowTextStyle: 'FONT_32_PURPLE'
        });
    }
    pushAction(player) {
        if (this.getAttr('PUSHED')) {
            return player.say('I_ALREADY_PUSHED_IT');
        }
        else if (this.getAttr('GREASED')) {
            return player.goToThing(this)
                .then(() => {
                player.say('ARGH');
                this.changeAttr('PUSHED', true);
            });
        }
        else {
            return player.goToThing(this)
                .then(() => {
                return player.say('THE_FLOOR_IS_STICKY');
            })
                .then(() => {
                return player.say('IF_I_COULD_PUT_GREASE_BELOW');
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
            player.say('I_DONT_KNOW_HOW_TO_USE_THAT_WITH_VENDING_MACHINE');
        }
    }
    say(text) {
        return this.speechBubble.say(text);
    }
    greaseWithBacon(player) {
        player.goToThing(this)
            .then(() => {
            this.changeAttr('GREASED', true);
            player.say('NICE_IT_WILL_SLIDE_REALLY_WELL_NOW');
        });
    }
    getCan(player, coin) {
        UIBlocker_singleton_1.uiBlocker.block();
        player.goToThing(this)
            .then(() => {
            coin.destroy();
            return this.say('CLONK');
        })
            .then(() => {
            new Can_1.Can();
            player.say('WISE_PURCHASE');
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":23,"../../engine/ui/SpeechBubble":38,"../../engine/ui/UIBlocker.singleton":42,"../../engine/utils/Directions":47,"./Can":68}],80:[function(require,module,exports){
"use strict";
const Door_1 = require('../../engine/models/Door');
const RandomText_1 = require('../../engine/utils/RandomText');
class BackyardDoorToBackstage extends Door_1.Door {
    constructor() {
        let options = {
            id: 'BACKYARD_TO_BACKSTAGE',
            name: 'DOOR_TO_BACKSTAGE',
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
            return 'BACKSTAGE';
        }
        else {
            return 'DOOR_TO_BACKSTAGE';
        }
    }
    takeAction(player) {
        player.say('CANNOT_PICK_A_DOOR_UP');
    }
    speakAction(player) {
        player.say(RandomText_1.randomText('HI_DOOR_HOW_ARE_YOU_TODAY', 'SHE_IS_SHY_DOESNT_WANT_TO_TALK_TO_ME', 'I_HAVE_BETTER_THINGS_TO_DO_THAN_TALKING'));
    }
    lookAction(player) {
        player.say('THAT_S_THE_DOOR_TO_GO_BACK_TO_THE_BACKSTAGE');
    }
}
exports.BackyardDoorToBackstage = BackyardDoorToBackstage;

},{"../../engine/models/Door":9,"../../engine/utils/RandomText":50}],81:[function(require,module,exports){
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

},{"../../engine/models/Scene":17,"../../engine/utils/Polygon":49,"./BackyardDoorToBackstage":80,"./Balloon":82,"./Bili":83,"./CutFlowers":85,"./Flowers":86,"./LampBackyard":87,"./Moon":88,"./Star":89}],82:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Directions_1 = require('../../engine/utils/Directions');
const Style_1 = require('../../engine/ui/Style');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const Scenes_singleton_1 = require('../../engine/state/Scenes.singleton');
const UIBlocker_singleton_1 = require('../../engine/ui/UIBlocker.singleton');
const PhaserGame_singleton_1 = require('../../engine/state/PhaserGame.singleton');
const Analytics_1 = require('../../engine/utils/Analytics');
let spriteOptions = new Map();
spriteOptions.set('quiet', { frames: [0] });
spriteOptions.set('floating', { frames: [0, 1, 2, 3, 4, 5] });
spriteOptions.set('explode', { frames: [6, 8, 9] });
const EXPLODED_FRAME = 9;
const options = {
    id: 'balloon',
    x: 252,
    y: 96,
    spriteId: 'BALLOON_SPRITE',
    name: 'BALLOON',
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
    useAction(player) {
        if (SelectedObjects_1.selectedThing.thing.id === 'scissors') {
            let bili = Scenes_singleton_1.scenes.getSceneById('BACKYARD').getThingById('bili');
            if (bili.getAttr('DRUNK')) {
                this.explodeBalloon(player, bili);
            }
            else {
                player.say('HE_IS_BEING_GOOD_FOR_NOW_NO_NEED_TO_EXPLODE_IT');
            }
        }
        else {
            super.useAction(player);
        }
    }
    lookAction(player) {
        player.say('THAT_IS_A_HUGE_BALLOON_QUITE_SCARY_IF_IT_EXPLODES');
    }
    takeAction(player) {
        player.say('NOPE_I_DONT_WANT_TO_TAKE_BILIS_BALLOON');
    }
    playAnimationSometime() {
        if (!this.getAttr('EXPLODED')) {
            this.playAnimation('quiet');
            this.lastTimeout = setTimeout(() => {
                this.playAnimationOnce('floating').then(() => {
                    this.playAnimationSometime();
                });
            }, this.getTimeForNextAnimation());
        }
    }
    getTimeForNextAnimation() {
        return MIN_TIME_FOR_ANIMATION + Math.random() * (MAX_TIME_FOR_ANIMATION - MIN_TIME_FOR_ANIMATION);
    }
    explodeBalloon(player, bili) {
        Analytics_1.analytics.sendEvent('game', 'explode_balloon');
        Analytics_1.analytics.sendEvent('game', 'end_game');
        UIBlocker_singleton_1.uiBlocker.block();
        player.goToThing(this)
            .then(() => {
            return player.playAnimationOnce('pierce_balloon');
        })
            .then(() => {
            return this.playAnimationOnce('explode');
        })
            .then(() => {
            this.changeAttr('EXPLODED', true);
            this.explode();
            return bili.say('I_AM_AWAKE');
        })
            .then(() => {
            return bili.say('I_AM_NOT_DRUNK_ANYMORE');
        })
            .then(() => {
            return bili.say('WE_CAN_PLAY_THE_CONCERT_NOW');
        })
            .then(() => {
            return player.moveTo({ x: 181, y: 212 });
        })
            .then(() => {
            player.lookAt(Directions_1.Directions.DOWN);
            return player.say('SO_THIS_IS_THE_END_FOLKS');
        })
            .then(() => {
            return player.say('WE_LAUGHED');
        })
            .then(() => {
            return player.say('WE_CRIED');
        })
            .then(() => {
            return player.say('AND_WE_LEARNED');
        })
            .then(() => {
            return player.wait(1000);
        })
            .then(() => {
            return player.say('THANKS_FOR_HELPING_ME_IN_THIS_ADVENTURE');
        })
            .then(() => {
            return player.say('SEE_YOU_SOON');
        })
            .then(() => {
            Analytics_1.analytics.sendEvent('game', 'end_game');
            UIBlocker_singleton_1.uiBlocker.unblock();
            PhaserGame_singleton_1.phaserGame.value.state.start('credits');
        });
    }
    explode() {
        if (this.lastTimeout) {
            window.clearTimeout(this.lastTimeout);
        }
        if (this.sprite.animations.currentAnim) {
            this.sprite.animations.currentAnim.stop();
        }
        this.sprite.frame = EXPLODED_FRAME;
        this.sprite.animations.stop();
    }
}
exports.Balloon = Balloon;

},{"../../engine/models/Thing":19,"../../engine/state/PhaserGame.singleton":21,"../../engine/state/Scenes.singleton":22,"../../engine/state/SelectedObjects":23,"../../engine/ui/Style":39,"../../engine/ui/UIBlocker.singleton":42,"../../engine/utils/Analytics":46,"../../engine/utils/Directions":47}],83:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SpeechBubble_1 = require('../../engine/ui/SpeechBubble');
const ConversationWithBili_1 = require('./ConversationWithBili');
const Directions_1 = require('../../engine/utils/Directions');
const Style_1 = require('../../engine/ui/Style');
const RandomText_1 = require('../../engine/utils/RandomText');
const Analytics_1 = require('../../engine/utils/Analytics');
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
    name: 'BILI',
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
            owner: this,
            foregroundTextStyle: 'FONT_32_YELLOW',
            shadowTextStyle: 'FONT_32_BLACK'
        });
    }
    get name() {
        if (this.getAttr('DRUNK')) {
            return 'DRUNK_BILI';
        }
        else {
            return 'BILI';
        }
    }
    lookAction(player) {
        if (this.getAttr('DRUNK')) {
            player.say(RandomText_1.randomText('HE_IS_DRUNK_AS_A_SKUNK', 'PROBABLY_IF_I_SCARE_HIM_HE_WILL_WAKE_UP', 'I_HAVE_TO_FIND_A_WAY_TO_SOBER_HIM_UP'));
        }
        else {
            player.say(RandomText_1.randomText('HE_IS_DRINKING_LIKE_A_MANIAC', 'ALL_IN_ALL_HE_IS_A_GOOD_GUY', 'NICE_COSTUME_HE_MADE'));
        }
    }
    speakAction(player) {
        Analytics_1.analytics.sendEvent('game', 'talk_to_bili');
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
    giveAction(player) {
        player.say('THE_ONLY_THING_HE_WANTS_RIGHT_NOW_IS_BEER')
            .then(() => {
            return player.say('AND_I_AM_NOT_GOING_TO_GIVE_HIM_ANY');
        });
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

},{"../../engine/models/Thing":19,"../../engine/ui/SpeechBubble":38,"../../engine/ui/Style":39,"../../engine/utils/Analytics":46,"../../engine/utils/Directions":47,"../../engine/utils/RandomText":50,"./ConversationWithBili":84}],84:[function(require,module,exports){
"use strict";
const Conversation_1 = require('../../engine/models/Conversation');
const ConversationLine_1 = require('../../engine/models/ConversationLine');
const Scenes_singleton_1 = require('../../engine/state/Scenes.singleton');
const RandomText_1 = require('../../engine/utils/RandomText');
const script = {
    'initial': [
        new ConversationLine_1.ConversationLine(() => {
            return 'HEY_BILI_HOW_IS_IT_GOING';
        }, 'initial', (player, bili) => {
            return bili.say('NOT_TO_BAD_ALL_THINGS_CONSIDERED')
                .then(() => {
                return bili.say('I_HEARD_THE_GUYS_ARE_HAVING_SOME_PROBLEMS');
            })
                .then(() => {
                return bili.say('I_WILL_WAIT_FOR_THEM_TO_BE_SOLVED');
            });
        }),
        new ConversationLine_1.ConversationLine(() => {
            return 'PLEASE_DONT_DRINK_TOO_MUCH';
        }, 'initial', (player, bili) => {
            return bili.say(RandomText_1.randomText('YES_MOM', 'I_AM_JUST_KEEPING_MY_THROAT_WARM', 'HAVE_I_EVER_FAILED_YOU', 'YOUR_LACK_OF_CONFIDENCE_DISSAPOINTS_ME'));
        }),
        new ConversationLine_1.ConversationLine('OK_SEE_YOU_LATER', 'end')
    ],
    'drunk': [
        new ConversationLine_1.ConversationLine(() => {
            return 'HEY_BILI_HOW_IS_IT_GOING';
        }, 'drunk', (player, bili) => {
            return bili.say(RandomText_1.randomText('DRUNK_1', 'DRUNK_2', 'DRUNK_3', 'DRUNK_4', 'DRUNK_5', 'DRUNK_6'));
        }),
        new ConversationLine_1.ConversationLine(() => {
            return 'OH_MY_YOU_ARE_DRUNK_ARENT_YOU';
        }, 'drunk', (player, bili) => {
            return bili.say(RandomText_1.randomText('DRUNK_1', 'DRUNK_2', 'DRUNK_3', 'DRUNK_4', 'DRUNK_5', 'DRUNK_6'));
        }),
        new ConversationLine_1.ConversationLine('OK_SEE_YOU_LATER', 'end')
    ]
};
class ConversationWithBili extends Conversation_1.Conversation {
    constructor(player, otherPerson) {
        super(player, otherPerson);
        this.player = player;
        this.otherPerson = otherPerson;
    }
    initState() {
        let bili = Scenes_singleton_1.scenes.getSceneById('BACKYARD').getThingById('bili');
        if (bili.getAttr('DRUNK')) {
            this.state = 'drunk';
        }
        else {
            this.state = 'initial';
        }
    }
    loadScript() {
        this.script = script;
    }
}
exports.ConversationWithBili = ConversationWithBili;

},{"../../engine/models/Conversation":7,"../../engine/models/ConversationLine":8,"../../engine/state/Scenes.singleton":22,"../../engine/utils/RandomText":50}],85:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],86:[function(require,module,exports){
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
    name: 'FLOWERS',
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
            player.say('I_BET_I_COULD_DO_A_BEAUTIFUL_COSTUME_WITH_IT');
        }
        else {
            player.say('VERY_BEAUTIFUL_FLOWERS');
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
            super.useAction(player);
        }
    }
}
exports.Flowers = Flowers;

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":23,"../utils/CostumeCreator":90}],87:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],88:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],89:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],90:[function(require,module,exports){
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

},{"../backstageScene/Costume":71}],91:[function(require,module,exports){
"use strict";
const Phaser_1 = require('./Phaser');
const LayoutManager_singleton_1 = require('./engine/ui/LayoutManager.singleton');
const BootScene_1 = require('./BootScene');
const PreloaderScene_1 = require('./PreloaderScene');
const StartMenuScene_1 = require('./StartMenuScene');
const CreditsScene_1 = require('./CreditsScene');
const PlayScene_1 = require('./PlayScene');
const PhaserGame_singleton_1 = require('./engine/state/PhaserGame.singleton');
window.onload = function () {
    if (!isMobile()) {
        let game = new Phaser_1.phaser.Game(LayoutManager_singleton_1.layout.WIDTH, LayoutManager_singleton_1.layout.HEIGHT, Phaser_1.phaser.AUTO, 'game');
        PhaserGame_singleton_1.phaserGame.value = game;
        game.state.add('boot', BootScene_1.BootScene);
        game.state.add('preloader', PreloaderScene_1.PreloaderScene);
        game.state.add('startMenu', StartMenuScene_1.StartMenuScene);
        game.state.add('play', PlayScene_1.playScene);
        game.state.add('credits', CreditsScene_1.CreditsScene);
        game.state.start('boot');
    }
};
function isMobile() {
    const MIN_WIDTH = 400;
    const MIN_HEIGHT = 400;
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (w < MIN_HEIGHT) || (h < MIN_HEIGHT);
}

},{"./BootScene":1,"./CreditsScene":2,"./Phaser":3,"./PlayScene":4,"./PreloaderScene":5,"./StartMenuScene":6,"./engine/state/PhaserGame.singleton":21,"./engine/ui/LayoutManager.singleton":36}]},{},[91])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0Jvb3RTY2VuZS50cyIsInNyYy9hcHAvQ3JlZGl0c1NjZW5lLnRzIiwic3JjL2FwcC9QaGFzZXIudHMiLCJzcmMvYXBwL1BsYXlTY2VuZS50cyIsInNyYy9hcHAvUHJlbG9hZGVyU2NlbmUudHMiLCJzcmMvYXBwL1N0YXJ0TWVudVNjZW5lLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0NvbnZlcnNhdGlvbi50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9Db252ZXJzYXRpb25MaW5lLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0Rvb3IudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvR2FtZS50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9HYW1lQ2FtZXJhLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0dlbmVyaWNIaWdobGlnaHRlZFRoaW5nLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0ludmVudG9yeS50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9QYXRoRmluZGVyLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL1BsYXllci50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9QbGF5ZXJNb3ZlbWVudEhhbmRsZXIudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvU2NlbmUudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvU2NlbmVCb3VuZGFyaWVzLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL1RoaW5nLnRzIiwic3JjL2FwcC9lbmdpbmUvc3RhdGUvQWN0aXZlSW52ZW50b3J5LnNpbmdsZXRvbi50cyIsInNyYy9hcHAvZW5naW5lL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uLnRzIiwic3JjL2FwcC9lbmdpbmUvc3RhdGUvU2NlbmVzLnNpbmdsZXRvbi50cyIsInNyYy9hcHAvZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cy50cyIsInNyYy9hcHAvZW5naW5lL3N0YXRlL1NlbGVjdGVkVmVyYi5zaW5nbGV0b24udHMiLCJzcmMvYXBwL2VuZ2luZS9zdG9yZXMvRGVmYXVsdExhYmVscy50cyIsInNyYy9hcHAvZW5naW5lL3N0b3Jlcy9MYWJlbHMuc3RvcmUudHMiLCJzcmMvYXBwL2VuZ2luZS9zdG9yZXMvVmVyYnMuc3RvcmUudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9BY3Rpb25CdXR0b24udHMiLCJzcmMvYXBwL2VuZ2luZS91aS9Db252ZXJzYXRpb25MaW5lVUkudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9Db252ZXJzYXRpb25VSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0N1cnJlbnRBY3Rpb25VSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0dyYXBoaWNVSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0ludmVudG9yeUl0ZW1VSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0ludmVudG9yeVBhZ2luYXRpb25CdXR0b24udHMiLCJzcmMvYXBwL2VuZ2luZS91aS9JbnZlbnRvcnlVSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0xheW91dE1hbmFnZXIuc2luZ2xldG9uLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvUmVmbGVjdEJ1dHRvbi50cyIsInNyYy9hcHAvZW5naW5lL3VpL1NwZWVjaEJ1YmJsZS50cyIsInNyYy9hcHAvZW5naW5lL3VpL1N0eWxlLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvVGV4dEluU2NlbmUudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9UZXh0V2l0aFNoYWRvdy50cyIsInNyYy9hcHAvZW5naW5lL3VpL1VJQmxvY2tlci5zaW5nbGV0b24udHMiLCJzcmMvYXBwL2VuZ2luZS91aS9VSUxheWVycy5zaW5nbGV0b24udHMiLCJzcmMvYXBwL2VuZ2luZS91aS9WZXJic1VJLnRzIiwic3JjL2FwcC9lbmdpbmUvdXRpbHMvQWN0aW9uRGlzcGF0Y2hlci50cyIsInNyYy9hcHAvZW5naW5lL3V0aWxzL0FuYWx5dGljcy50cyIsInNyYy9hcHAvZW5naW5lL3V0aWxzL0RpcmVjdGlvbnMudHMiLCJzcmMvYXBwL2VuZ2luZS91dGlscy9PYnNlcnZhYmxlLnRzIiwic3JjL2FwcC9lbmdpbmUvdXRpbHMvUG9seWdvbi50cyIsInNyYy9hcHAvZW5naW5lL3V0aWxzL1JhbmRvbVRleHQudHMiLCJzcmMvYXBwL2VuZ2luZS91dGlscy9TZWdtZW50LnRzIiwic3JjL2FwcC9lbmdpbmUvdXRpbHMvYW5hbHl0aWNzLnRzIiwic3JjL2FwcC9nYW1lL0Fzc2V0c01hbmFnZXIudHMiLCJzcmMvYXBwL2dhbWUvQmFja3N0YWdlU2NlbmUvQ29pbi50cyIsInNyYy9hcHAvZ2FtZS9Eb2N0b3J0aWxsYUdhbWUudHMiLCJzcmMvYXBwL2dhbWUvRG9jdG9ydGlsbGFMYWJlbHMudHMiLCJzcmMvYXBwL2dhbWUvRG9jdG9ydGlsbGFQbGF5ZXIudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQmFja3N0YWdlRG9vclRvQmFja3lhcmQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQmFja3N0YWdlRG9vclRvU3RhZ2UudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQmFja3N0YWdlRG9vclRvU3RyZWV0LnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JhY2tzdGFnZVNjZW5lLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JhY29uLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JhbmRJblNvZmEudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQm9jYWRpbGxvLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JyZWFkLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0Jyb29tLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0NhYmxlLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0Nhbi50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9Db2NvbnV0LnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0NvbnZlcnNhdGlvbldpdGhCYW5kLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0Nvc3R1bWUudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvRHVzdEluVGFibGUudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvRmx5Q2FzZS50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9HbGFzcy50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9MYW1wTGVmdC50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9MYW1wUmlnaHQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvU2Npc3NvcnMudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvU2tpcnQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvVmVuZGluZ01hY2hpbmUudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9CYWNreWFyZERvb3JUb0JhY2tzdGFnZS50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL0JhY2t5YXJkU2NlbmUudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9CYWxsb29uLnRzIiwic3JjL2FwcC9nYW1lL2JhY2t5YXJkU2NlbmUvQmlsaS50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL0NvbnZlcnNhdGlvbldpdGhCaWxpLnRzIiwic3JjL2FwcC9nYW1lL2JhY2t5YXJkU2NlbmUvQ3V0Rmxvd2Vycy50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL0Zsb3dlcnMudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9MYW1wQmFja3lhcmQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9Nb29uLnRzIiwic3JjL2FwcC9nYW1lL2JhY2t5YXJkU2NlbmUvU3Rhci50cyIsInNyYy9hcHAvZ2FtZS91dGlscy9Db3N0dW1lQ3JlYXRvci50cyIsInNyYy9hcHAvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSwwQ0FBdUIscUNBQXFDLENBQUMsQ0FBQTtBQUM3RCx5QkFBdUIsVUFBVSxDQUFDLENBQUE7QUFFckIsaUJBQVMsR0FBRztJQUNyQixPQUFPLEVBQUU7UUFDTCxtREFBbUQ7UUFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxNQUFNLEVBQUU7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsZUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7UUFFM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGdDQUFNLENBQUMsV0FBVyxFQUFFLGdDQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckUseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3BELGVBQU0sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFRLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRTVFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0osQ0FBQzs7OztBQ25CVyxvQkFBWSxHQUFHO0lBQ3hCLE9BQU8sRUFBRSxjQUFZLENBQUM7SUFFdEIsTUFBTSxFQUFFO1FBQ0osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lB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QyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDcEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3RELENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUN6RCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0Qsa0dBQWtHO0lBQ2xHLGlCQUFpQixDQUFDLEtBQWE7UUFDM0IsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFM0MsRUFBRSxDQUFBLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsMEJBQTBCO1FBQ2xELENBQUM7UUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENB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QUFZLEVBQUUsY0FBYztJQUM1QixnQkFBZ0IsRUFBRSxJQUFJLGlCQUFPLENBQUM7UUFDMUIsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUM7UUFDZixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztRQUNoQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxF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Q0FBQyxXQUFXLEVBQUUsK0JBQWMsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxxQkFBUyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLDJCQUFZLENBQUMsQ0FBQztRQUV4QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QixDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUY7SUFDSSxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFDdEIsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMvRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFakYsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO0FBQ2hELENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9lbmdpbmUvdWkvTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi9QaGFzZXInO1xuXG5leHBvcnQgY29uc3QgQm9vdFNjZW5lID0ge1xuICAgIHByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBsb2FkIGhlcmUgYXNzZXRzIHJlcXVpcmVkIGZvciB0aGUgbG9hZGluZyBzY3JlZW5cbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ3ByZWxvYWRlcl9iYXInLCAnaW1hZ2VzL3VpL1BSRUxPQURFUl9CQVIucG5nJyk7XG4gICAgfSxcblxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gcGhhc2VyLlNjYWxlTWFuYWdlci5VU0VSX1NDQUxFO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zZXRVc2VyU2NhbGUobGF5b3V0LkxBWU9VVF9aT09NLCBsYXlvdXQuTEFZT1VUX1pPT00pO1xuICAgICAgICAvLyBlbmFibGUgY3Jpc3AgcmVuZGVyaW5nXG4gICAgICAgIHRoaXMuZ2FtZS5yZW5kZXJlci5yZW5kZXJTZXNzaW9uLnJvdW5kUGl4ZWxzID0gdHJ1ZTtcbiAgICAgICAgcGhhc2VyLkNhbnZhcy5zZXRJbWFnZVJlbmRlcmluZ0NyaXNwKHRoaXMuZ2FtZS5jYW52YXMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5jYW52YXMub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChlOiBFdmVudCkgeyBlLnByZXZlbnREZWZhdWx0KCk7IH1cblxuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ3ByZWxvYWRlcicpO1xuICAgIH1cbn07IiwiaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi9QaGFzZXInO1xuXG5leHBvcnQgY29uc3QgQ3JlZGl0c1NjZW5lID0ge1xuICAgIHByZWxvYWQ6IGZ1bmN0aW9uKCkge30sXG5cbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVCRygpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVCRzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsICdDUkVESVRTJyk7XG4gICAgfVxuXG59OyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi92ZW5kb3IvcGhhc2VyL3BoYXNlci5kLnRzXCIvPlxuZXhwb3J0IGNvbnN0IHBoYXNlciA9IFBoYXNlcjsiLCJpbXBvcnQgeyBEb2N0b3J0aWxsYUdhbWUgfSBmcm9tICcuL2dhbWUvRG9jdG9ydGlsbGFHYW1lJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuL2VuZ2luZS9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5cbmNsYXNzIFBsYXlTY2VuZSB7XG5cbiAgICBnYW1lTW9kZWw6IERvY3RvcnRpbGxhR2FtZTtcblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lTW9kZWwgPSBuZXcgRG9jdG9ydGlsbGFHYW1lKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWVNb2RlbC51cGRhdGUoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIC8vIHBoYXNlckdhbWUudmFsdWUuZGVidWcuaW5wdXRJbmZvKDMyLCAzMik7XG4gICAgICAgIC8vIHBoYXNlckdhbWUudmFsdWUuZGVidWcucG9pbnRlciggcGhhc2VyR2FtZS52YWx1ZS5pbnB1dC5hY3RpdmVQb2ludGVyICk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgcGxheVNjZW5lID0gbmV3IFBsYXlTY2VuZSgpO1xuIiwiaW1wb3J0IHsgYXNzZXRzTWFuYWdlciB9IGZyb20gJy4vZ2FtZS9Bc3NldHNNYW5hZ2VyJztcblxuZXhwb3J0IGNvbnN0IFByZWxvYWRlclNjZW5lID0ge1xuICAgIHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nQmFyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMjQwLCAncHJlbG9hZGVyX2JhcicpO1xuICAgICAgICB0aGlzLmxvYWRpbmdCYXIuYW5jaG9yLnNldFRvKDAsIDAuNSk7XG4gICAgICAgIHRoaXMubG9hZC5zZXRQcmVsb2FkU3ByaXRlKHRoaXMubG9hZGluZ0Jhcik7XG5cbiAgICAgICAgYXNzZXRzTWFuYWdlci5sb2FkQXNzZXRzKDxQaGFzZXIuR2FtZT4gdGhpcy5nYW1lKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnc3RhcnRNZW51Jyk7XG4gICAgfVxufTsiLCJpbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL2VuZ2luZS91aS9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBwaGFzZXIgfSBmcm9tICcuL1BoYXNlcic7XG5pbXBvcnQgeyBsYWJlbHNTdG9yZSB9IGZyb20gJy4vZW5naW5lL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuaW1wb3J0IHsgYW5hbHl0aWNzIH0gZnJvbSAnLi9lbmdpbmUvdXRpbHMvYW5hbHl0aWNzJztcblxuZXhwb3J0IGNvbnN0IFN0YXJ0TWVudVNjZW5lID0ge1xuICAgIHByZWxvYWQ6IGZ1bmN0aW9uKCkge30sXG5cbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVMb2dvKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQnV0dG9ucygpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVMb2dvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGxvZ28gOiBQaGFzZXIuU3ByaXRlID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUobGF5b3V0LkxPR09fUE9TSVRJT04ueCwgbGF5b3V0LkxPR09fUE9TSVRJT04ueSAtIDMwLCAnTE9HTycpO1xuICAgICAgICBsZXQgbG9nb1R3ZWVuIDogUGhhc2VyLlR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2Vlbihsb2dvKTtcblxuICAgICAgICBsb2dvVHdlZW4udG8oeyB5OiBsYXlvdXQuTE9HT19QT1NJVElPTi55IH0sIDEwMDAsICdFbGFzdGljJywgdHJ1ZSwgMCk7XG5cbiAgICAgICAgbGV0IHRoZUdhbWU6IFBoYXNlci5TcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShsYXlvdXQuVEhFX0dBTUVfUE9TSVRJT04ueCwgbGF5b3V0LlRIRV9HQU1FX1BPU0lUSU9OLnksICdUSEVfR0FNRScpO1xuICAgICAgICBsZXQgdGhlR2FtZVR3ZWVuIDogUGhhc2VyLlR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2Vlbih0aGVHYW1lKTtcbiAgICAgICAgdGhlR2FtZS5hbHBoYSA9IDA7XG4gICAgICAgIHRoZUdhbWVUd2Vlbi50byh7IGFscGhhOiAxIH0sIDEwMDAsICdMaW5lYXInLCB0cnVlLCAwKTtcblxuICAgIH0sXG5cbiAgICBjcmVhdGVCdXR0b25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFbmdsaXNoQnV0dG9uKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlU3BhbmlzaEJ1dHRvbigpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVFbmdsaXNoQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVuZ2xpc2hCdXR0b24gOiBQaGFzZXIuQnV0dG9uID0gdGhpcy5nYW1lLmFkZC5idXR0b24oXG4gICAgICAgICAgICBsYXlvdXQuRU5HTElTSF9CVVRUT05fUE9TSVRJT04ueCxcbiAgICAgICAgICAgIGxheW91dC5FTkdMSVNIX0JVVFRPTl9QT1NJVElPTi55LFxuICAgICAgICAgICAgJ0VOR0xJU0hfQlVUVE9OJyxcbiAgICAgICAgICAgIHRoaXMub25FbmdsaXNoQnV0dG9uQ2xpY2ssXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAyLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICBlbmdsaXNoQnV0dG9uLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBjcmVhdGVTcGFuaXNoQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNwYW5pc2hCdXR0b24gOiBQaGFzZXIuQnV0dG9uID0gdGhpcy5nYW1lLmFkZC5idXR0b24oXG4gICAgICAgICAgICBsYXlvdXQuU1BBTklTSF9CVVRUT05fUE9TSVRJT04ueCxcbiAgICAgICAgICAgIGxheW91dC5TUEFOSVNIX0JVVFRPTl9QT1NJVElPTi55LFxuICAgICAgICAgICAgJ1NQQU5JU0hfQlVUVE9OJyxcbiAgICAgICAgICAgIHRoaXMub25TcGFuaXNoQnV0dG9uQ2xpY2ssXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAyLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICBzcGFuaXNoQnV0dG9uLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBvbkVuZ2xpc2hCdXR0b25DbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgIGFuYWx5dGljcy5zZW5kRXZlbnQoJ3N0YXJ0X21lbnUnLCAnc2VsZWN0X2xhbmd1YWdlJywgJ2VuZ2xpc2gnKTtcbiAgICAgICAgYW5hbHl0aWNzLnNlbmRFdmVudCgnZ2FtZScsICdzdGFydF9nYW1lJyk7XG4gICAgICAgIGxhYmVsc1N0b3JlLnNldExhbmd1YWdlKCdlbicpO1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ3BsYXknKTtcbiAgICB9LFxuXG4gICAgb25TcGFuaXNoQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICBhbmFseXRpY3Muc2VuZEV2ZW50KCdzdGFydF9tZW51JywgJ3NlbGVjdF9sYW5ndWFnZScsICdzcGFuaXNoJyk7XG4gICAgICAgIGFuYWx5dGljcy5zZW5kRXZlbnQoJ2dhbWUnLCAnc3RhcnRfZ2FtZScpO1xuICAgICAgICBsYWJlbHNTdG9yZS5zZXRMYW5ndWFnZSgnZXMnKTtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdwbGF5Jyk7XG4gICAgfVxufTsiLCJpbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25MaW5lIH0gZnJvbSAnLi9Db252ZXJzYXRpb25MaW5lJztcbmltcG9ydCB7IENvbnZlcnNhdGlvblVJIH0gZnJvbSAnLi4vdWkvQ29udmVyc2F0aW9uVUknO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDb252ZXJzYXRpb25TY3JpcHQgeyBbczogc3RyaW5nXTogQXJyYXk8Q29udmVyc2F0aW9uTGluZT47IH1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbnZlcnNhdGlvbiB7XG5cbiAgICBwcml2YXRlIG9uQ2hhbmdlT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTtcbiAgICBwcml2YXRlIF9zdGF0ZUlkOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIHNjcmlwdDogSUNvbnZlcnNhdGlvblNjcmlwdDtcbiAgICBwcml2YXRlIHVpOiBDb252ZXJzYXRpb25VSTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBwbGF5ZXI6IFBsYXllciwgcHJvdGVjdGVkIG90aGVyUGVyc29uOiBUaGluZykge1xuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICAgICAgdGhpcy5vdGhlclBlcnNvbiA9IG90aGVyUGVyc29uO1xuICAgICAgICB0aGlzLmxvYWRTY3JpcHQoKTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLmluaXRTdGF0ZSgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNvbnZlcnNhdGlvblVJKCk7XG4gICAgfVxuXG4gICAgb25TdGF0ZUNoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLnN0YXRlKTtcbiAgICB9XG5cbiAgICBnZXQgc3RhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlSWQ7XG4gICAgfVxuXG4gICAgZ2V0TGluZXMoKTogQXJyYXk8Q29udmVyc2F0aW9uTGluZT4ge1xuICAgICAgICBsZXQgY3VycmVudFN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgaWYgKCF0aGlzLnNjcmlwdCB8fCAhdGhpcy5zY3JpcHRbY3VycmVudFN0YXRlXSkge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SLCB0aGVyZSBhcmUgbm8gbGluZXMgZm9yIHRoaXMgc3RhdGUgb2YgY29udmVyc2F0aW9uJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zY3JpcHRbY3VycmVudFN0YXRlXTtcbiAgICB9XG5cbiAgICBzZXQgc3RhdGUobmV3U3RhdGUpIHtcbiAgICAgICAgaWYgKG5ld1N0YXRlID09PSAnZW5kJykge1xuICAgICAgICAgICAgdGhpcy51aS5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZUlkID0gbmV3U3RhdGU7XG4gICAgICAgICAgICB0aGlzLmxvYWRTY3JpcHQoKTtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5U3RhdGVDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5TGluZShsaW5lOiBDb252ZXJzYXRpb25MaW5lKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGxheWVyLnNheShsaW5lLnRleHQodGhpcy5wbGF5ZXIpKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxpbmUuYWZ0ZXJDYWxsYmFjayh0aGlzLnBsYXllciwgdGhpcy5vdGhlclBlcnNvbilcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IGxpbmUubmV4dFN0YXRlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFRleHRGb3JMaW5lKGxpbmU6IENvbnZlcnNhdGlvbkxpbmUpOiBzdHJpbmcge1xuICAgICAgICB2YXIgdGV4dENhbGxiYWNrID0gbGluZS50ZXh0O1xuICAgICAgICByZXR1cm4gdGV4dENhbGxiYWNrKHt9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgbG9hZFNjcmlwdCgpOiB2b2lkO1xuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBpbml0U3RhdGUoKTogdm9pZDtcblxuICAgIHByaXZhdGUgY3JlYXRlQ29udmVyc2F0aW9uVUkoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudWkgPSBuZXcgQ29udmVyc2F0aW9uVUkodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3RpZnlTdGF0ZUNoYW5nZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUubm90aWZ5T2JzZXJ2ZXJzKHRoaXMuc3RhdGUpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcbmltcG9ydCB7IElDYWxsYmFjayB9IGZyb20gJy4uL1V0aWxzL09ic2VydmFibGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDb252ZXJzYXRpb25DYWxsYmFjayB7XG4gICAgKHBsYXllcjogUGxheWVyLCBvdGhlclBlcnNvbjogVGhpbmcpOiBhbnk7XG59XG5cbmNvbnN0IGVtcHR5RnVuY3Rpb25XaXRoUHJvbWlzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICByZXNvbHZlQ2FsbGJhY2s6IGZ1bmN0aW9uKCkge31cbiAgICB9O1xuICAgIGxldCBkZWZlcnJlZCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIHJlc3VsdC5yZXNvbHZlQ2FsbGJhY2sgPSByZXNvbHZlO1xuICAgIH0pO1xuICAgIHJlc3VsdC5yZXNvbHZlQ2FsbGJhY2soKTtcblxuICAgIHJldHVybiBkZWZlcnJlZDtcbn07XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJzYXRpb25MaW5lIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3RleHQ6IHN0cmluZyB8IElDb252ZXJzYXRpb25DYWxsYmFjayxcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9uZXh0U3RhdGU6IHN0cmluZyB8ICgoKSA9PiBzdHJpbmcpLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgX2FmdGVyQ2FsbGJhY2s6IElDb252ZXJzYXRpb25DYWxsYmFjayA9IGVtcHR5RnVuY3Rpb25XaXRoUHJvbWlzZSkge1xuXG4gICAgICAgIGlmICghdGhpcy5fdGV4dCkge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBtaXNzaW5nIHRleHQgZm9yIGNvbnZlcnNhdGlvbiBsaW5lJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX25leHRTdGF0ZSkge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBtaXNzaW5nIG5leHQgc3RhdGUgZm9yIGNvbnZlcnNhdGlvbiBsaW5lJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCB0ZXh0KCk6IElDYWxsYmFjayB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fdGV4dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiAoKCkgPT4ge3JldHVybiB0aGlzLl90ZXh0OyB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5fdGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIDxJQ2FsbGJhY2s+IHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgJ0VSUk9SOiBnZXR0aW5nIHRleHQgb2YgY29udmVyc2F0aW9uIGxpbmUsIHdpdGggaW5jb3JyZWN0IHR5cGUnO1xuICAgIH1cblxuICAgIGdldCBhZnRlckNhbGxiYWNrKCk6IElDb252ZXJzYXRpb25DYWxsYmFjayB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZnRlckNhbGxiYWNrO1xuICAgIH1cblxuICAgIGdldCBuZXh0U3RhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TmV4dFN0YXRlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROZXh0U3RhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9uZXh0U3RhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gPHN0cmluZz4gdGhpcy5fbmV4dFN0YXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICg8KCgpID0+IHN0cmluZyk+IHRoaXMuX25leHRTdGF0ZSkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgeyBJUG9pbnQsIElHb1RvU2NlbmVPcHRpb25zIH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBWZXJicyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5cbmludGVyZmFjZSBJRG9vck9wdGlvbnMge1xuICAgIGlkOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgc3ByaXRlSWQ6IHN0cmluZyxcbiAgICBnb1RvUG9zaXRpb246IElQb2ludCxcbiAgICBkZXN0aW5hdGlvblNjZW5lSWQ6IHN0cmluZyxcbiAgICByZWxhdGVkRG9vcklkOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIERvb3IgZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZG9vck9wdGlvbnM6IElEb29yT3B0aW9ucykge1xuICAgICAgICBzdXBlcihkb29yT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5uYW1lIHx8ICdkb29yJztcbiAgICB9XG5cbiAgICBnZXRQcmVmZXJyZWRBY3Rpb24oKTogVmVyYnMge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHJldHVybiBWZXJicy5DTE9TRTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBWZXJicy5PUEVOO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yY2VPcGVuKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ09QRU4nLCB0cnVlKTtcbiAgICB9XG5cbiAgICBnb1RvQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ29Ub0Rlc3RpbmF0aW9uSWZPcGVuKHBsYXllcik7XG4gICAgfVxuXG4gICAgb3BlbkFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5vcGVuKHBsYXllcikpO1xuICAgIH1cblxuICAgIGNsb3NlQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLmNsb3NlKHBsYXllcikpO1xuICAgIH1cblxuICAgIGxvb2tBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ1RoYXRcXCdzIGEgd29uZGVyZnVsIGRvb3IuIFNvIHdvb2R5LicpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb3BlbihwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0l0IGlzIGFscmVhZHkgb3BlbiEnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQXR0cignT1BFTicsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbG9zZShwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZ2V0QXR0cignT1BFTicpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJdCBpcyBhbHJlYWR5IGNsb3NlZCEnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQXR0cignT1BFTicsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvblN0YXRlQ2hhbmdlKCk6IHZvaWQge1xuICAgICAgICBpZighdGhpcy5zcHJpdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ29Ub0Rlc3RpbmF0aW9uSWZPcGVuKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZ29Ub1NjZW5lT3B0aW9uczogSUdvVG9TY2VuZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lSWQ6IHRoaXMuZG9vck9wdGlvbnMuZGVzdGluYXRpb25TY2VuZUlkLFxuICAgICAgICAgICAgICAgICAgICByZWxhdGVkRG9vcklkOiB0aGlzLmRvb3JPcHRpb25zLnJlbGF0ZWREb29ySWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLkdPX1RPX1NDRU5FLCBnb1RvU2NlbmVPcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgbGFiZWxzU3RvcmUgfSBmcm9tICcuLi9zdG9yZXMvTGFiZWxzLnN0b3JlJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi9zdGF0ZS9BY3RpdmVJbnZlbnRvcnkuc2luZ2xldG9uJztcbmltcG9ydCB7IFNjZW5lIH0gZnJvbSAnLi9TY2VuZSc7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgR3JhcGhpY1VJIH0gZnJvbSAnLi4vdWkvR3JhcGhpY1VJJztcbmltcG9ydCB7IEdhbWVDYW1lcmEgfSBmcm9tICcuL0dhbWVDYW1lcmEnO1xuaW1wb3J0IHsgc2VsZWN0ZWRWZXJiIH0gZnJvbSAnLi4vc3RhdGUvU2VsZWN0ZWRWZXJiLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBWZXJic0luZm8gfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBzY2VuZXMgfSBmcm9tICcuLi9zdGF0ZS9TY2VuZXMuc2luZ2xldG9uJztcbmltcG9ydCB7IElHb1RvU2NlbmVPcHRpb25zIH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5cbmltcG9ydCB7IElMYWJlbHMgIH0gZnJvbSAnLi4vc3RvcmVzL0xhYmVscy5zdG9yZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUdhbWVPcHRpb25zIHtcbiAgICBsYWJlbHM6IElMYWJlbHMsXG4gICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgc2NlbmVzOiBBcnJheTxTY2VuZT4sXG4gICAgaW5pdGlhbFNjZW5lSWQ6IHN0cmluZ1xufVxuXG5pbnRlcmZhY2UgSVNlbGVjdFRoaW5nT3B0aW9ucyB7XG4gICAgdGhpbmc6IFRoaW5nLFxuICAgIHNlY29uZGFyeUFjdGlvbj86IEJvb2xlYW5cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdhbWUge1xuXG4gICAgcHJpdmF0ZSBwbGF5ZXI6IFBsYXllcjtcbiAgICBwcml2YXRlIGNhbWVyYTogR2FtZUNhbWVyYTtcbiAgICBwcml2YXRlIGdyYXBoaWNVSTogR3JhcGhpY1VJO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIG9wdGlvbnM6IElHYW1lT3B0aW9ucykge1xuICAgICAgICBsYWJlbHNTdG9yZS5hZGRMYWJlbHModGhpcy5vcHRpb25zLmxhYmVscyk7XG4gICAgICAgIHRoaXMucGxheWVyID0gdGhpcy5vcHRpb25zLnBsYXllcjtcbiAgICAgICAgYWN0aXZlSW52ZW50b3J5LnNldEFjdGl2ZUludmVudG9yeSh0aGlzLnBsYXllci5pbnZlbnRvcnkpO1xuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lcyh0aGlzLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLmluaXRBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMudXBkYXRlV29ybGRCb3VuZHMoKTtcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgR2FtZUNhbWVyYSh0aGlzLnBsYXllcik7XG4gICAgICAgIHRoaXMuZ3JhcGhpY1VJID0gbmV3IEdyYXBoaWNVSSgpO1xuICAgICAgICBpZih0aGlzLm9uU3RhcnQpIHtcbiAgICAgICAgICAgIHRoaXMub25TdGFydCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNhbWVyYS51cGRhdGVQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIC8vVG8gb3ZlcnJpZGUgaW4gY2hpbGQgY2xhc3Nlc1xuICAgIHByb3RlY3RlZCBvblN0YXJ0KCk6IHZvaWQge31cblxuICAgIHByaXZhdGUgY3JlYXRlU2NlbmVzKG9wdGlvbnM6IElHYW1lT3B0aW9ucyk6IHZvaWQge1xuICAgICAgICBzY2VuZXMuaW5pdChvcHRpb25zLnNjZW5lcyk7XG4gICAgICAgIHNjZW5lcy5zZXRDdXJyZW50U2NlbmVCeUlkKG9wdGlvbnMuaW5pdGlhbFNjZW5lSWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdEFjdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oQWN0aW9ucy5DTElDS19TVEFHRSwgZXYgPT4gdGhpcy5tb3ZlUGxheWVyVG8oZXYpICk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oQWN0aW9ucy5TRUxFQ1RfVEhJTkcsIG9wdGlvbnMgPT4gdGhpcy5zZWxlY3RUaGluZyhvcHRpb25zKSApO1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKEFjdGlvbnMuR09fVE9fU0NFTkUsIG9wdGlvbnMgPT4gdGhpcy5nb1RvU2NlbmUob3B0aW9ucykgKTtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhBY3Rpb25zLlRBS0VfT0JKRUNULCB0aGluZyA9PiB0aGlzLnRha2VPYmplY3QodGhpbmcpICk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oQWN0aW9ucy5SRUZMRUNULCAoKSA9PiB0aGlzLnJlZmxlY3QoKSApO1xuICAgIH1cblxuICAgIHByaXZhdGUgbW92ZVBsYXllclRvKGV2ZW50OiBQaGFzZXIuUG9pbnRlcik6IHZvaWQge1xuICAgICAgICBsZXQgbm9uU2FmZVBvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogZXZlbnQud29ybGRYLFxuICAgICAgICAgICAgeTogZXZlbnQud29ybGRZXG4gICAgICAgIH07XG4gICAgICAgIGxldCBzYWZlUG9zaXRpb24gPSBzY2VuZXMuY3VycmVudFNjZW5lLmJvdW5kYXJpZXMuZ2V0UG9zaXRpb25JbnNpZGUobm9uU2FmZVBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIubW92ZVRvKHNhZmVQb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVXb3JsZEJvdW5kcygpOiB2b2lkIHtcbiAgICAgICAgbGV0IGJvdW5kcyA9IHNjZW5lcy5jdXJyZW50U2NlbmUuc2NlbmVCb3VuZHM7XG4gICAgICAgIHBoYXNlckdhbWUudmFsdWUud29ybGQuc2V0Qm91bmRzKFxuICAgICAgICAgICAgYm91bmRzLngsXG4gICAgICAgICAgICBib3VuZHMueSxcbiAgICAgICAgICAgIGJvdW5kcy53aWR0aCxcbiAgICAgICAgICAgIGJvdW5kcy5oZWlnaHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2VsZWN0VGhpbmcob3B0aW9uczogSVNlbGVjdFRoaW5nT3B0aW9ucyk6IHZvaWQge1xuICAgICAgICB2YXIgdmVyYiA9IFZlcmJzSW5mby5nZXQoc2VsZWN0ZWRWZXJiLnZlcmIpO1xuICAgICAgICBpZihvcHRpb25zLnNlY29uZGFyeUFjdGlvbiAmJiBvcHRpb25zLnRoaW5nLmdldFByZWZlcnJlZEFjdGlvbigpKSB7XG4gICAgICAgICAgICBvcHRpb25zLnRoaW5nLmFwcGx5QWN0aW9uKG9wdGlvbnMudGhpbmcuZ2V0UHJlZmVycmVkQWN0aW9uKCksIHRoaXMucGxheWVyKTtcbiAgICAgICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLkFDVElPTl9BUFBMSUVEKTtcbiAgICAgICAgfSBlbHNlIGlmICh2ZXJiLnNpbmdsZU9iamVjdCkge1xuICAgICAgICAgICAgb3B0aW9ucy50aGluZy5hcHBseUFjdGlvbihzZWxlY3RlZFZlcmIudmVyYiwgdGhpcy5wbGF5ZXIpO1xuICAgICAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuQUNUSU9OX0FQUExJRUQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RUaGluZ0Zvck11bHRpcGxlT2JqZWN0VmVyYihvcHRpb25zLnRoaW5nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdGFrZU9iamVjdCh0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgc2NlbmVzLmN1cnJlbnRTY2VuZS5yZW1vdmVPYmplY3QodGhpbmcpO1xuICAgICAgICB0aGlzLnBsYXllci5hZGRPYmplY3RUb0ludmVudG9yeSh0aGluZyk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLlVQREFURV9JTlZFTlRPUlkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2VsZWN0VGhpbmdGb3JNdWx0aXBsZU9iamVjdFZlcmIodGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nKSB7XG4gICAgICAgICAgICB0aGluZy5hcHBseUFjdGlvbihzZWxlY3RlZFZlcmIudmVyYiwgdGhpcy5wbGF5ZXIpO1xuICAgICAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuQUNUSU9OX0FQUExJRUQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaW5nLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkVGhpbmcudGhpbmcgPSB0aGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ29Ub1NjZW5lKG9wdGlvbnM6IElHb1RvU2NlbmVPcHRpb25zKSB7XG4gICAgICAgIHNjZW5lcy5nb1RvU2NlbmVXaXRoSWQob3B0aW9ucy5zY2VuZUlkKTtcbiAgICAgICAgc2NlbmVzLmN1cnJlbnRTY2VuZS5wbGF5ZXJBcnJpdmVzQXREb29yKHRoaXMucGxheWVyLCBvcHRpb25zLnJlbGF0ZWREb29ySWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVmbGVjdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIucmVmbGVjdCgpO1xuICAgIH1cblxufSIsImltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IHN0eWxlIH0gZnJvbSAnLi4vdWkvU3R5bGUnO1xuXG5leHBvcnQgY2xhc3MgR2FtZUNhbWVyYSB7XG4gICAgcHJpdmF0ZSBjYW1lcmE6IFBoYXNlci5DYW1lcmE7XG4gICAgcHJpdmF0ZSBjYW1lcmFQb3NpdGlvbjogSVBvaW50O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwbGF5ZXI6IFBsYXllcikge1xuICAgICAgICBpZiAoIXRoaXMucGxheWVyKSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IGEgY2FtZXJhIG5lZWRzIGEgcGxheWVyIHRvIGZvbGxvdyc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYW1lcmEgPSBwaGFzZXJHYW1lLnZhbHVlLmNhbWVyYTtcbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIHVwZGF0ZVBvc2l0aW9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNhbWVyYVBvc2l0aW9uID0gdGhpcy5jYW1lcmFQb3NpdGlvbiB8fCBuZXcgUGhhc2VyLlBvaW50KDAsIDApO1xuXG4gICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLnBsYXllci5zcHJpdGU7XG4gICAgICAgIHRoaXMuY2FtZXJhUG9zaXRpb24ueCArPSAocGxheWVyLnggLSB0aGlzLmNhbWVyYVBvc2l0aW9uLngpICogc3R5bGUuQ0FNRVJBX0VBU0lOR19GQUNUT1I7XG4gICAgICAgIHRoaXMuY2FtZXJhUG9zaXRpb24ueCA9IE1hdGgucm91bmQodGhpcy5jYW1lcmFQb3NpdGlvbi54KTtcbiAgICAgICAgdGhpcy5jYW1lcmFQb3NpdGlvbi55ICs9IChwbGF5ZXIueSAtIHRoaXMuY2FtZXJhUG9zaXRpb24ueSkgKiBzdHlsZS5DQU1FUkFfRUFTSU5HX0ZBQ1RPUjtcbiAgICAgICAgdGhpcy5jYW1lcmFQb3NpdGlvbi55ID0gTWF0aC5yb3VuZCh0aGlzLmNhbWVyYVBvc2l0aW9uLnkpO1xuICAgICAgICB0aGlzLmNhbWVyYS5mb2N1c09uWFkodGhpcy5jYW1lcmFQb3NpdGlvbi54LCB0aGlzLmNhbWVyYVBvc2l0aW9uLnkpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBJQ2FsbGJhY2sgfSBmcm9tICcuLi91dGlscy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHZW5lcmljSGlnaGxpZ2h0ZWRUaGluZyB7XG5cbiAgICBwcml2YXRlIG9uQ2hhbmdlT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTtcbiAgICBwcml2YXRlIGhpZ2hsaWdodGVkVGhpbmc6IFRoaW5nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oXG4gICAgICAgICAgICBBY3Rpb25zLkNVUlNPUl9PVkVSX1RISU5HLFxuICAgICAgICAgICAgdGhpbmcgPT4gdGhpcy5vbkN1cnNvck92ZXJUaGluZyh0aGluZylcbiAgICAgICAgKTtcblxuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKFxuICAgICAgICAgICAgQWN0aW9ucy5DVVJTT1JfT1VUX1RISU5HLFxuICAgICAgICAgICAgdGhpbmcgPT4gdGhpcy5vbkN1cnNvck91dFRoaW5nKHRoaW5nKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHN1YnNjcmliZVRvQ2hhbmdlKGNhbGxiYWNrOiBJQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUucmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMuaGlnaGxpZ2h0ZWRUaGluZyk7XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLnJlbW92ZU9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBnZXQgdGhpbmcoKTogVGhpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRlZFRoaW5nO1xuICAgIH1cblxuICAgIHNldCB0aGluZyhuZXdUaGluZzogVGhpbmcpIHtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRUaGluZyhuZXdUaGluZyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGhpZ2hsaWdodFRoaW5nKG5ld1RoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmhpZ2hsaWdodGVkVGhpbmcgPSBuZXdUaGluZztcbiAgICAgICAgdGhpcy5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGhpbmcobnVsbCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uQ3Vyc29yT3ZlclRoaW5nKHRoaW5nOiBUaGluZyk6IHZvaWQgIHt9XG4gICAgcHJvdGVjdGVkIG9uQ3Vyc29yT3V0VGhpbmcodGhpbmc6IFRoaW5nKTogdm9pZCAge31cblxuICAgIHByaXZhdGUgbm90aWZ5U3Vic2NyaWJlcnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyh0aGlzLmhpZ2hsaWdodGVkVGhpbmcpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5IHtcblxuICAgIHByaXZhdGUgY2hhbmdlT2JzZXJ2YWJsZSA6IE9ic2VydmFibGU7XG4gICAgaXRlbXM6IFNldDxUaGluZz47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBTZXQoKTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmNoYW5nZU9ic2VydmFibGUucmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmNoYW5nZU9ic2VydmFibGUucmVtb3ZlT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGFkZChpdGVtOiBUaGluZykge1xuICAgICAgICBpdGVtLnN0YXRlLnNldCgnSVNfSU5fSU5WRU5UT1JZJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuaXRlbXMuYWRkKGl0ZW0pO1xuICAgICAgICB0aGlzLmNoYW5nZU9ic2VydmFibGUubm90aWZ5T2JzZXJ2ZXJzKHRoaXMpO1xuICAgIH1cblxuICAgIHJlbW92ZShpdGVtOiBUaGluZykge1xuICAgICAgICB0aGlzLml0ZW1zLmRlbGV0ZShpdGVtKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyh0aGlzKTtcbiAgICB9XG5cbiAgICBnZXRCeUlkKGlkOiBzdHJpbmcpOiBUaGluZyB7XG4gICAgICAgIGxldCBpdGVtQXJyYXkgPSBBcnJheS5mcm9tKHRoaXMuaXRlbXMpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGl0ZW1BcnJheVtpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbUFycmF5W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxufSIsImltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgU2VnbWVudCB9IGZyb20gJy4uL3V0aWxzL1NlZ21lbnQnO1xuaW1wb3J0IHsgU2NlbmVCb3VuZGFyaWVzIH0gZnJvbSAnLi9TY2VuZUJvdW5kYXJpZXMnO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcblxuaW50ZXJmYWNlIElQYXRoTm9kZU9wdGlvbnMge1xuICAgIHBvaW50OiBJUG9pbnQsXG4gICAgZmluYWxOb2RlPzogQm9vbGVhblxufVxuXG5jbGFzcyBQYXRoTm9kZSB7XG5cbiAgICBjb25uZWN0aW9uczogQXJyYXk8UGF0aE5vZGU+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJUGF0aE5vZGVPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMgPSBbXTtcbiAgICB9XG5cbiAgICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wb2ludC54ICsgJ18nICsgdGhpcy5vcHRpb25zLnBvaW50Lnk7XG4gICAgfVxuXG4gICAgZ2V0IHBvaW50KCk6IElQb2ludCB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucG9pbnQ7XG4gICAgfVxuXG4gICAgaXNGaW5hbCgpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5vcHRpb25zLmZpbmFsTm9kZTtcbiAgICB9XG5cbn1cblxuY29uc3QgU0hPVUxEX1BBSU5UID0gZmFsc2U7XG5jb25zdCBDT0xPUiA9IDB4MDAzM0ZGO1xuY2xhc3MgUGF0aEZpbmRlclBhaW50ZXIge1xuXG4gICAgcHJpdmF0ZSBwYWludGVkTm9kZXM6IE1hcDxzdHJpbmcsIEJvb2xlYW4+O1xuXG4gICAgcGFpbnQoZmlyc3ROb2RlOiBQYXRoTm9kZSwgZGVzdGluYXRpb246IElQb2ludCk6IHZvaWQge1xuICAgICAgICBpZighU0hPVUxEX1BBSU5UKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWxldGVDdXJyZW50R3JhcGhpY3MoKTtcbiAgICAgICAgdGhpcy5wYWludGVkTm9kZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMucGFpbnROb2RlQW5kQ29ubmVjdGlvbnMoZmlyc3ROb2RlKTtcbiAgICAgICAgbGV0IHBvaW50MSA9IG5ldyBQaGFzZXIuQ2lyY2xlKGZpcnN0Tm9kZS5wb2ludC54LCBmaXJzdE5vZGUucG9pbnQueSwgNCk7XG4gICAgICAgIHBoYXNlckdhbWUudmFsdWUuZGVidWcuZ2VvbShwb2ludDEsICcjMDAwMGZmJyk7XG4gICAgICAgIGxldCBwb2ludDIgPSBuZXcgUGhhc2VyLkNpcmNsZShkZXN0aW5hdGlvbi54LCBkZXN0aW5hdGlvbi55LCA0KTtcbiAgICAgICAgcGhhc2VyR2FtZS52YWx1ZS5kZWJ1Zy5nZW9tKHBvaW50MiwgJyMwMGZmMDAnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlbGV0ZUN1cnJlbnRHcmFwaGljcygpOiB2b2lkIHtcbiAgICAgICAgcGhhc2VyR2FtZS52YWx1ZS5kZWJ1Zy5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYWludE5vZGVBbmRDb25uZWN0aW9ucyhub2RlOiBQYXRoTm9kZSk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLnBhaW50ZWROb2Rlcy5nZXQobm9kZS5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhaW50ZWROb2Rlcy5zZXQobm9kZS5pZCwgdHJ1ZSk7XG4gICAgICAgIGZvcihsZXQgaT0wOyBpIDwgbm9kZS5jb25uZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5wYWludExpbmUobm9kZSwgbm9kZS5jb25uZWN0aW9uc1tpXSlcbiAgICAgICAgICAgIHRoaXMucGFpbnROb2RlQW5kQ29ubmVjdGlvbnMobm9kZS5jb25uZWN0aW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHBhaW50TGluZShub2RlMTogUGF0aE5vZGUsIG5vZGUyOiBQYXRoTm9kZSkge1xuICAgICAgICBsZXQgbGluZSA9IG5ldyBQaGFzZXIuTGluZShub2RlMS5wb2ludC54LCBub2RlMS5wb2ludC55LCBub2RlMi5wb2ludC54LCBub2RlMi5wb2ludC55KTtcbiAgICAgICAgcGhhc2VyR2FtZS52YWx1ZS5kZWJ1Zy5nZW9tKGxpbmUsICcjZmYwMDAwJyk7XG4gICAgfVxufVxuXG5jb25zdCBwYXRoRmluZGVyUGFpbnRlciA9IG5ldyBQYXRoRmluZGVyUGFpbnRlcigpO1xuXG5cbmNsYXNzIFBhdGhGaW5kZXIge1xuXG4gICAgZ2V0UGF0aChvcmlnaW46IElQb2ludCwgZGVzdGluYXRpb246IElQb2ludCwgYm91bmRhcmllczogU2NlbmVCb3VuZGFyaWVzKTogQXJyYXk8SVBvaW50PiB7XG4gICAgICAgIHZhciBpbnNpZGVPcmlnaW4gPSBib3VuZGFyaWVzLmdldFBvc2l0aW9uSW5zaWRlKG9yaWdpbik7XG4gICAgICAgIHZhciBpbnNpZGVEZXN0aW5hdGlvbiA9IGJvdW5kYXJpZXMuZ2V0UG9zaXRpb25JbnNpZGUoZGVzdGluYXRpb24pO1xuXG4gICAgICAgIGlmKGJvdW5kYXJpZXMucG9seWdvbi5wb2ludHNDYW5TZWVFYWNoT3RoZXIoaW5zaWRlT3JpZ2luLCBpbnNpZGVEZXN0aW5hdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiBbaW5zaWRlT3JpZ2luLCBpbnNpZGVEZXN0aW5hdGlvbl07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbmNhdmVWZXJ0ZXggPSBib3VuZGFyaWVzLnBvbHlnb24uZ2V0Q29uY2F2ZVZlcnRleCgpO1xuICAgICAgICBsZXQgZ3JhcGggPSB0aGlzLmdldEdyYXBoVG9Tb2x2ZShpbnNpZGVPcmlnaW4sIGRlc3RpbmF0aW9uLCBjb25jYXZlVmVydGV4LCBib3VuZGFyaWVzKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5nZXRTb2x1dGlvblRvR3JhcGgoZ3JhcGgsIGRlc3RpbmF0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEdyYXBoVG9Tb2x2ZShvcmlnaW46IElQb2ludCwgZGVzdGluYXRpb246IElQb2ludCwgb3RoZXJWZXJ0ZXg6IEFycmF5PElQb2ludD4sIGJvdW5kYXJpZXM6IFNjZW5lQm91bmRhcmllcyk6IFBhdGhOb2RlIHtcbiAgICAgICAgbGV0IGluaXRpYWxOb2RlID0gbmV3IFBhdGhOb2RlKHtcbiAgICAgICAgICAgIHBvaW50OiBvcmlnaW5cbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBmaW5hbE5vZGUgPSBuZXcgUGF0aE5vZGUoe1xuICAgICAgICAgICAgcG9pbnQ6IGRlc3RpbmF0aW9uLFxuICAgICAgICAgICAgZmluYWxOb2RlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgYWxsTm9kZXMgPSBbaW5pdGlhbE5vZGUsIGZpbmFsTm9kZV07XG4gICAgICAgIG90aGVyVmVydGV4LmZvckVhY2goKHZlcnRleCkgPT4ge1xuICAgICAgICAgICAgYWxsTm9kZXMucHVzaChuZXcgUGF0aE5vZGUoe1xuICAgICAgICAgICAgICAgIHBvaW50OiB2ZXJ0ZXhcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSlcblxuICAgICAgICBmb3IobGV0IGk9MDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IobGV0IGogPSBpICsgMTsgaiA8IGFsbE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYoYm91bmRhcmllcy5wb2x5Z29uLnBvaW50c0NhblNlZUVhY2hPdGhlcihhbGxOb2Rlc1tpXS5wb2ludCwgYWxsTm9kZXNbal0ucG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbE5vZGVzW2ldLmNvbm5lY3Rpb25zLnB1c2goYWxsTm9kZXNbal0pO1xuICAgICAgICAgICAgICAgICAgICBhbGxOb2Rlc1tqXS5jb25uZWN0aW9ucy5wdXNoKGFsbE5vZGVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5pdGlhbE5vZGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoZXVyaXN0aWNDb3N0KHBvaW50OiBJUG9pbnQsIGRlc3RpbmF0aW9uOiBJUG9pbnQpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gKG5ldyBTZWdtZW50KHBvaW50LCBkZXN0aW5hdGlvbikpLmxlbmd0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlYWxDb3N0KHBvaW50OiBJUG9pbnQsIGRlc3RpbmF0aW9uOiBJUG9pbnQpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gKG5ldyBTZWdtZW50KHBvaW50LCBkZXN0aW5hdGlvbikpLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvL2h0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0EqX3NlYXJjaF9hbGdvcml0aG0jQWxnb3JpdGhtX2Rlc2NyaXB0aW9uXG4gICAgcHJpdmF0ZSBnZXRTb2x1dGlvblRvR3JhcGgoZmlyc3ROb2RlOiBQYXRoTm9kZSwgZGVzdGluYXRpb246IElQb2ludCk6IEFycmF5PElQb2ludD4ge1xuICAgICAgICBwYXRoRmluZGVyUGFpbnRlci5wYWludChmaXJzdE5vZGUsIGRlc3RpbmF0aW9uKTtcbiAgICAgICAgbGV0IGNsb3NlZFNldDogU2V0PFBhdGhOb2RlPiA9IG5ldyBTZXQoKTtcbiAgICAgICAgbGV0IG9wZW5TZXQ6IFNldDxQYXRoTm9kZT4gPSBuZXcgU2V0KCk7XG4gICAgICAgIG9wZW5TZXQuYWRkKGZpcnN0Tm9kZSk7XG5cbiAgICAgICAgLy8gRm9yIGVhY2ggbm9kZSwgd2hpY2ggbm9kZSBpdCBjYW4gbW9zdCBlZmZpY2llbnRseSBiZSByZWFjaGVkIGZyb20uXG4gICAgICAgIC8vIElmIGEgbm9kZSBjYW4gYmUgcmVhY2hlZCBmcm9tIG1hbnkgbm9kZXMsIGNhbWVGcm9tIHdpbGwgZXZlbnR1YWxseSBjb250YWluIHRoZVxuICAgICAgICAvLyBtb3N0IGVmZmljaWVudCBwcmV2aW91cyBzdGVwLlxuICAgICAgICBsZXQgY2FtZUZyb206IE1hcDxQYXRoTm9kZSwgUGF0aE5vZGU+ID0gbmV3IE1hcCgpO1xuXG4gICAgICAgIC8vIEZvciBlYWNoIG5vZGUsIHRoZSBjb3N0IG9mIGdldHRpbmcgZnJvbSB0aGUgc3RhcnQgbm9kZSB0byB0aGF0IG5vZGUuXG4gICAgICAgIGxldCBnU2NvcmU6IE1hcDxQYXRoTm9kZSwgbnVtYmVyPiA9IG5ldyBNYXA7IC8vIGRlZmF1bHQgdmFsdWUgb2YgSW5maW5pdHlcbiAgICAgICAgZ1Njb3JlLnNldChmaXJzdE5vZGUsIDApOyAvLyBUaGUgY29zdCBvZiBnb2luZyBmcm9tIHN0YXJ0IHRvIHN0YXJ0IGlzIHplcm8uXG5cbiAgICAgICAgLy8gRm9yIGVhY2ggbm9kZSwgdGhlIHRvdGFsIGNvc3Qgb2YgZ2V0dGluZyBmcm9tIHRoZSBzdGFydCBub2RlIHRvIHRoZSBnb2FsXG4gICAgICAgIC8vIGJ5IHBhc3NpbmcgYnkgdGhhdCBub2RlLiBUaGF0IHZhbHVlIGlzIHBhcnRseSBrbm93biwgcGFydGx5IGhldXJpc3RpYy5cbiAgICAgICAgbGV0IGZTY29yZTogTWFwPFBhdGhOb2RlLCBudW1iZXI+ID0gbmV3IE1hcDsgLy8gZGVmYXVsdCB2YWx1ZSBvZiBJbmZpbml0eVxuICAgICAgICBmU2NvcmUuc2V0KGZpcnN0Tm9kZSwgdGhpcy5oZXVyaXN0aWNDb3N0KGZpcnN0Tm9kZS5wb2ludCwgZGVzdGluYXRpb24pKTtcblxuICAgICAgICB3aGlsZShvcGVuU2V0LnNpemUgPiAwKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudDogUGF0aE5vZGUgPSB0aGlzLmZpbmRMb3dlc3RTY29yZShmU2NvcmUsIG9wZW5TZXQpO1xuICAgICAgICAgICAgaWYoY3VycmVudC5pc0ZpbmFsKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZWNvbnN0cnVjdFBhdGgoY2FtZUZyb20sIGN1cnJlbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvcGVuU2V0LmRlbGV0ZShjdXJyZW50KTtcbiAgICAgICAgICAgIGNsb3NlZFNldC5hZGQoY3VycmVudCk7XG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgY3VycmVudC5jb25uZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBuZWlnaGJvciA9IGN1cnJlbnQuY29ubmVjdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgaWYoY2xvc2VkU2V0LmhhcyhuZWlnaGJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCB0ZW50YXRpdmVHU2NvcmUgPSB0aGlzLmdldEdTY29yZShnU2NvcmUsIGN1cnJlbnQpICsgdGhpcy5yZWFsQ29zdChjdXJyZW50LnBvaW50LCBuZWlnaGJvci5wb2ludCk7XG4gICAgICAgICAgICAgICAgaWYoIW9wZW5TZXQuaGFzKG5laWdoYm9yKSkge1xuICAgICAgICAgICAgICAgICAgICBvcGVuU2V0LmFkZChuZWlnaGJvcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHRlbnRhdGl2ZUdTY29yZSA+PSB0aGlzLmdldEdTY29yZShnU2NvcmUsIG5laWdoYm9yKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gVGhpcyBpcyBub3QgYSBiZXR0ZXIgcGF0aC5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBwYXRoIGlzIHRoZSBiZXN0IHVudGlsIG5vdy4gUmVjb3JkIGl0IVxuICAgICAgICAgICAgICAgIGNhbWVGcm9tLnNldChuZWlnaGJvciwgY3VycmVudCk7XG4gICAgICAgICAgICAgICAgZ1Njb3JlLnNldChuZWlnaGJvciwgdGVudGF0aXZlR1Njb3JlKTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3RlNjb3JlID0gdGhpcy5nZXRHU2NvcmUoZ1Njb3JlLCBuZWlnaGJvcikgKyB0aGlzLmhldXJpc3RpY0Nvc3QobmVpZ2hib3IucG9pbnQsIGRlc3RpbmF0aW9uKTtcbiAgICAgICAgICAgICAgICBmU2NvcmUuc2V0KG5laWdoYm9yLCBuZXdGU2NvcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93ICdFUlJPUiwgY291bGQgbm90IGZpbmQgYSBwYXRoJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEdTY29yZShnU2NvcmU6IE1hcDxQYXRoTm9kZSwgbnVtYmVyPiwgbm9kZTogUGF0aE5vZGUpOiBudW1iZXIge1xuICAgICAgICBpZihnU2NvcmUuaGFzKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZ1Njb3JlLmdldChub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZmluZExvd2VzdFNjb3JlKHNjb3JlczogTWFwPFBhdGhOb2RlLCBudW1iZXI+LCBvcGVuU2V0OiBTZXQ8UGF0aE5vZGU+KSB7XG4gICAgICAgIGxldCBsb3dlc3RTY29yZTogbnVtYmVyLCBsb3dlc3ROb2RlOiBQYXRoTm9kZTtcbiAgICAgICAgbGV0IGFscmVhZHlIYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICBzY29yZXMuZm9yRWFjaCgodmFsdWUsIG5vZGUpID0+IHtcbiAgICAgICAgICAgIGlmKG9wZW5TZXQuaGFzKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgaWYoIWFscmVhZHlIYXNWYWx1ZSB8fCAodmFsdWUgPCBsb3dlc3RTY29yZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeUhhc1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbG93ZXN0U2NvcmUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgbG93ZXN0Tm9kZSA9IG5vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbG93ZXN0Tm9kZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlY29uc3RydWN0UGF0aChjYW1lRnJvbTogTWFwPFBhdGhOb2RlLCBQYXRoTm9kZT4sIGN1cnJlbnQ6IFBhdGhOb2RlKTogQXJyYXk8SVBvaW50PiB7XG4gICAgICAgIGxldCB0b3RhbFBhdGggPSBbY3VycmVudC5wb2ludF07XG5cbiAgICAgICAgd2hpbGUoY2FtZUZyb20uaGFzKGN1cnJlbnQpKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gY2FtZUZyb20uZ2V0KGN1cnJlbnQpO1xuICAgICAgICAgICAgdG90YWxQYXRoLnB1c2goY3VycmVudC5wb2ludCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdG90YWxQYXRoLnJldmVyc2UoKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IHBhdGhGaW5kZXIgPSBuZXcgUGF0aEZpbmRlcigpO1xuIiwiaW1wb3J0IHsgSW52ZW50b3J5IH0gZnJvbSAnLi9JbnZlbnRvcnknO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcbmltcG9ydCB7IFBsYXllck1vdmVtZW50SGFuZGxlciB9IGZyb20gJy4vUGxheWVyTW92ZW1lbnRIYW5kbGVyJztcbmltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi4vdWkvVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IElQb2ludCwgSVNwcml0ZUluZm8gfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IERpcmVjdGlvbnMsIGdldERpcmVjdGlvbk5hbWUgfSBmcm9tICcuLi91dGlscy9EaXJlY3Rpb25zJztcbmltcG9ydCB7IFNwZWVjaEJ1YmJsZSB9IGZyb20gJy4uL3VpL1NwZWVjaEJ1YmJsZSc7XG5cbmludGVyZmFjZSBJUGxheWVyT3B0aW9ucyB7XG4gICAgc3ByaXRlSWQ6IHN0cmluZyxcbiAgICBpbml0aWFsWDogbnVtYmVyLFxuICAgIGluaXRpYWxZOiBudW1iZXIsXG4gICAgeFNwZWVkOiBudW1iZXIsIC8vcHgvc1xuICAgIHlTcGVlZDogbnVtYmVyLCAvL3B4L3NcbiAgICBhbmltYXRpb25TcGVlZDogbnVtYmVyLFxuICAgIHNwcml0ZU9wdGlvbnM6IE1hcDxzdHJpbmcsIElTcHJpdGVJbmZvPjtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBsYXllciB7XG5cbiAgICBpbnZlbnRvcnk6IEludmVudG9yeTtcblxuICAgIHByaXZhdGUgX3Nwcml0ZTogUGhhc2VyLlNwcml0ZTtcbiAgICBwcml2YXRlIF9kaXJlY3Rpb246IERpcmVjdGlvbnM7XG4gICAgcHJpdmF0ZSBzcGVlY2hCdWJibGU6IFNwZWVjaEJ1YmJsZTtcbiAgICBwcml2YXRlIF9zdGF0ZTogTWFwPHN0cmluZywgYW55PjtcbiAgICBwcml2YXRlIG1vdmVtZW50SGFuZGxlcjogUGxheWVyTW92ZW1lbnRIYW5kbGVyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zIDogSVBsYXllck9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBuZXcgSW52ZW50b3J5KCk7XG4gICAgICAgIHRoaXMubW92ZW1lbnRIYW5kbGVyID0gbmV3IFBsYXllck1vdmVtZW50SGFuZGxlcih0aGlzKTtcbiAgICAgICAgdGhpcy5jcmVhdGVTcHJpdGUoKTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBEaXJlY3Rpb25zLlJJR0hUO1xuICAgICAgICB0aGlzLnBsYXlTdGFuZEFuaW1hdGlvbigpO1xuICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZSA9IG5ldyBTcGVlY2hCdWJibGUoe1xuICAgICAgICAgICAgb3duZXI6IHRoaXNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIG1vdmVUbyhkZXN0aW5hdGlvbjogSVBvaW50KTogUHJvbWlzZTx7fT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5tb3ZlbWVudEhhbmRsZXIubW92ZVRvKGRlc3RpbmF0aW9uKTtcbiAgICB9XG5cbiAgICBnZXQgc3ByaXRlKCk6IFBoYXNlci5TcHJpdGUge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3ByaXRlO1xuICAgIH1cblxuICAgIGdldCBzcGVlZCgpOiBJUG9pbnQge1xuICAgICAgICBsZXQgc3BlZWQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLm9wdGlvbnMueFNwZWVkLFxuICAgICAgICAgICAgeTogdGhpcy5vcHRpb25zLnlTcGVlZCxcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3BlZWQ7XG4gICAgfVxuXG4gICAgZ2V0IGRpcmVjdGlvbigpOiBEaXJlY3Rpb25zIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbjtcbiAgICB9XG5cbiAgICBzZXQgZGlyZWN0aW9uKG5ld0RpcmVjdGlvbjogRGlyZWN0aW9ucykge1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBuZXdEaXJlY3Rpb247XG4gICAgfVxuXG4gICAgZ2V0IHBvc2l0aW9uKCk6IElQb2ludCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLl9zcHJpdGUueCxcbiAgICAgICAgICAgIHk6IHRoaXMuX3Nwcml0ZS55XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ29Ub1RoaW5nKHRoaW5nOiBUaGluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5tb3ZlVG8odGhpbmcuZ2V0UG9zaXRpb25Ub0dvVG8oKSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXJlY3Rpb24gPSB0aGluZy5nZXREaXJlY3Rpb25Ub0xvb2soKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvb2tBdChkaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9va0F0KGRpcmVjdGlvbjogRGlyZWN0aW9ucykge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgICAgdGhpcy5wbGF5U3RhbmRBbmltYXRpb24oKTtcbiAgICB9XG5cbiAgICBzYXkodGV4dDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMucGxheVRhbGtpbmdBbmltYXRpb24oKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BlZWNoQnViYmxlLnNheSh0ZXh0KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RvcFRhbGtpbmdBbmltYXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2FpdCh0aW1lTXMgPSAxMDAwKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbGV0IGRlZmVycmVkID0gbmV3IFByb21pc2UoKHJlc29sdmVDYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9LCB0aW1lTXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkO1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9uT25Ub3AoKTogSVBvaW50e1xuICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy5zcHJpdGUueCxcbiAgICAgICAgICAgIHk6IE1hdGgucm91bmQodGhpcy5zcHJpdGUuZ2V0Qm91bmRzKCkueSkgLSAxMFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFkZE9iamVjdFRvSW52ZW50b3J5KHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQodGhpbmcpO1xuICAgIH1cblxuICAgIHRlbGVwb3J0VG8oZGVzdGluYXRpb246IElQb2ludCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1vdmVtZW50SGFuZGxlci5tb3ZlVG9XaXRob3V0QW5pbWF0aW9uKGRlc3RpbmF0aW9uKTtcbiAgICB9XG5cbiAgICBnZXQgc3RhdGUoKTogTWFwPHN0cmluZywgYW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICB9XG5cbiAgICBzZXQgc3RhdGUobmV3U3RhdGU6IE1hcDxzdHJpbmcsIGFueT4pe1xuICAgICAgICBpZiAobmV3U3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYW5nZUF0dHIoYXR0ck5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9zdGF0ZS5zZXQoYXR0ck5hbWUsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5vblN0YXRlQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgZ2V0QXR0cihhdHRyTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZS5nZXQoYXR0ck5hbWUpO1xuICAgIH1cblxuICAgIHBsYXlXYWxraW5nQW5pbWF0aW9uKCk6IHZvaWQge1xuICAgICAgICBsZXQgZGlyZWN0aW9uTmFtZSA9IGdldERpcmVjdGlvbk5hbWUodGhpcy5kaXJlY3Rpb24pO1xuICAgICAgICBsZXQgc3ByaXRlU3RhdGUgPSAnd2Fsa18nICsgZGlyZWN0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5fc3ByaXRlLmFuaW1hdGlvbnMucGxheShzcHJpdGVTdGF0ZSk7XG4gICAgICAgIHRoaXMuZmxpcFhJZk5lZWRlZChzcHJpdGVTdGF0ZSk7XG4gICAgfVxuXG4gICAgcGxheVN0YW5kQW5pbWF0aW9uKCk6IHZvaWQge1xuICAgICAgICBsZXQgZGlyZWN0aW9uTmFtZSA9IGdldERpcmVjdGlvbk5hbWUodGhpcy5kaXJlY3Rpb24pO1xuICAgICAgICBsZXQgc3ByaXRlU3RhdGUgPSAnc3RhbmRfJyArIGRpcmVjdGlvbk5hbWU7XG4gICAgICAgIHRoaXMuX3Nwcml0ZS5hbmltYXRpb25zLnBsYXkoc3ByaXRlU3RhdGUpO1xuICAgICAgICB0aGlzLmZsaXBYSWZOZWVkZWQoc3ByaXRlU3RhdGUpO1xuICAgIH1cblxuICAgIHBsYXlBbmltYXRpb25PbmNlKGFuaW1hdGlvbk5hbWU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYodGhpcy5vcHRpb25zLnNwcml0ZU9wdGlvbnMuaGFzKGFuaW1hdGlvbk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5wbGF5KGFuaW1hdGlvbk5hbWUsIG51bGwsIGZhbHNlKTsgLy9GYWxzZSBzbyBpdCBkb2VzIG5vdCBsb29wXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5jdXJyZW50QW5pbSAmJiB0aGlzLnNwcml0ZS5hbmltYXRpb25zLmN1cnJlbnRBbmltLm9uQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5jdXJyZW50QW5pbS5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgdXBkYXRlT25Ud2Vlbk1vdmUoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMuc3BlZWNoQnViYmxlLmlzU2hvd24oKSkge1xuICAgICAgICAgICAgdGhpcy5zcGVlY2hCdWJibGUudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0b3BBbmltYXRpb25zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBsYXlTdGFuZEFuaW1hdGlvbigpO1xuICAgICAgICB0aGlzLl9zcHJpdGUuYW5pbWF0aW9ucy5zdG9wKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlyZWN0aW9uKGRlc3RpbmF0aW9uOiBJUG9pbnQpOiB2b2lkIHtcbiAgICAgICAgbGV0IGFuZ2xlQmV0d2VlbiA9IHRoaXMuZ2V0QW5nbGVUb0Rlc2lyZWRQb3NpdGlvbihkZXN0aW5hdGlvbik7XG4gICAgICAgIGxldCBhbmdsZURlZ3JlZXMgPSAoYW5nbGVCZXR3ZWVuICogMTgwIC8gTWF0aC5QSSk7XG5cbiAgICAgICAgaWYgKChhbmdsZURlZ3JlZXMgPj0gLTQ1KSAmJiAoYW5nbGVEZWdyZWVzIDw9IDQ1KSkge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBEaXJlY3Rpb25zLkxFRlQ7XG4gICAgICAgIH0gZWxzZSBpZiAoKGFuZ2xlRGVncmVlcyA+PSA0NSkgJiYgKGFuZ2xlRGVncmVlcyA8PSAxMzUpKSB7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERpcmVjdGlvbnMuVVA7XG4gICAgICAgIH0gZWxzZSBpZiAoKGFuZ2xlRGVncmVlcyA+PSAtMTM1KSAmJiAoYW5nbGVEZWdyZWVzIDw9IC00NSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9ucy5ET1dOO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBEaXJlY3Rpb25zLlJJR0hUO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QW5nbGVUb0Rlc2lyZWRQb3NpdGlvbihkZXN0aW5hdGlvbjogSVBvaW50KTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy5zcHJpdGUueSAtIGRlc3RpbmF0aW9uLnksXG4gICAgICAgICAgICB0aGlzLnNwcml0ZS54IC0gZGVzdGluYXRpb24ueCk7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgcmVmbGVjdCgpOiB2b2lkXG5cbiAgICAvL1RoaXMgbWV0aG9kIGNhbiBiZSBvdmVyd3JpdHRlbiBpbiBjaGlsZCBjbGFzc2VzXG4gICAgcHJvdGVjdGVkIG9uU3RhdGVDaGFuZ2UoKSB7fVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTcHJpdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3Nwcml0ZSA9IHVpTGF5ZXJzLnBsYXllci5jcmVhdGUoXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuaW5pdGlhbFgsXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuaW5pdGlhbFksXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3ByaXRlSWRcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fc3ByaXRlLmFuY2hvci5zZXRUbygwLjUsIDAuOTkpO1xuICAgICAgICB1aUxheWVycy5wbGF5ZXIuc29ydCgneicsIFBoYXNlci5Hcm91cC5TT1JUX0FTQ0VORElORyk7XG4gICAgICAgIHRoaXMuYWRkU3ByaXRlQW5pbWF0aW9ucygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkU3ByaXRlQW5pbWF0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNwcml0ZU9wdGlvbnMuZm9yRWFjaCggKHNwcml0ZVBvc2l0aW9uLCBrZXkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Nwcml0ZS5hbmltYXRpb25zLmFkZChrZXksIHNwcml0ZVBvc2l0aW9uLmZyYW1lcywgdGhpcy5vcHRpb25zLmFuaW1hdGlvblNwZWVkLCB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwbGF5VGFsa2luZ0FuaW1hdGlvbigpOiB2b2lkIHtcbiAgICAgICAgbGV0IGRpcmVjdGlvbk5hbWUgPSBnZXREaXJlY3Rpb25OYW1lKHRoaXMuZGlyZWN0aW9uKTtcbiAgICAgICAgbGV0IHNwcml0ZVN0YXRlID0gJ3RhbGtfJyArIGRpcmVjdGlvbk5hbWU7XG4gICAgICAgIHRoaXMuX3Nwcml0ZS5hbmltYXRpb25zLnBsYXkoc3ByaXRlU3RhdGUpO1xuICAgICAgICB0aGlzLmZsaXBYSWZOZWVkZWQoc3ByaXRlU3RhdGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RvcFRhbGtpbmdBbmltYXRpb24oKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9zcHJpdGUuYW5pbWF0aW9ucyAmJlxuICAgICAgICAgICAgdGhpcy5fc3ByaXRlLmFuaW1hdGlvbnMubmFtZSAmJlxuICAgICAgICAgICAgKHRoaXMuX3Nwcml0ZS5hbmltYXRpb25zLm5hbWUuaW5kZXhPZigndGFsaycpID09PSAwKSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wQW5pbWF0aW9ucygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmbGlwWElmTmVlZGVkKHNwcml0ZVN0YXRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgbGV0IHNwcml0ZVN0YXRlT3B0aW9ucyA9IHRoaXMub3B0aW9ucy5zcHJpdGVPcHRpb25zLmdldChzcHJpdGVTdGF0ZSk7XG4gICAgICAgIGlmIChzcHJpdGVTdGF0ZU9wdGlvbnMgJiYgc3ByaXRlU3RhdGVPcHRpb25zLmludmVyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3Nwcml0ZS5zY2FsZS54ID0gLTE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUuc2NhbGUueCA9IDE7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcbmltcG9ydCB7IElQb2ludCwgSVRpbWVvdXRXaXRoUHJvbWlzZSB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi91dGlscy9EaXJlY3Rpb25zJztcbmltcG9ydCB7IHNjZW5lcyB9IGZyb20gJy4uL3N0YXRlL1NjZW5lcy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgcGF0aEZpbmRlciB9IGZyb20gJy4vUGF0aEZpbmRlcic7XG5cblxuY2xhc3MgU2luZ2xlTW92ZSB7XG5cbiAgICBwcml2YXRlIHR3ZWVuOiBQaGFzZXIuVHdlZW47XG4gICAgcHJpdmF0ZSB3aWxsTW92ZVByb21pc2U6IElUaW1lb3V0V2l0aFByb21pc2U7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsYXllcjogUGxheWVyLCBwcml2YXRlIGRlc3RpbmF0aW9uOiBJUG9pbnQpIHtcbiAgICAgICAgbGV0IHRpbWVUb0FuaW1hdGUgPSB0aGlzLmdldFRpbWVGb3JBbmltYXRpb24oZGVzdGluYXRpb24pO1xuXG4gICAgICAgIGlmICh0aW1lVG9BbmltYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXllci51cGRhdGVEaXJlY3Rpb24oZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXIucGxheVdhbGtpbmdBbmltYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMudHdlZW4gPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC50d2Vlbih0aGlzLnBsYXllci5zcHJpdGUpO1xuICAgICAgICAgICAgdGhpcy50d2Vlbi50byh7IHg6IGRlc3RpbmF0aW9uLngsIHk6IGRlc3RpbmF0aW9uLnkgfSwgdGltZVRvQW5pbWF0ZSwgJ0xpbmVhcicsIHRydWUsIDApO1xuICAgICAgICAgICAgdGhpcy50d2Vlbi5vblVwZGF0ZUNhbGxiYWNrKHRoaXMucGxheWVyLnVwZGF0ZU9uVHdlZW5Nb3ZlLCB0aGlzLnBsYXllcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLndpbGxNb3ZlUHJvbWlzZSA9IHRoaXMuY3JlYXRlTW92ZVByb21pc2UodGltZVRvQW5pbWF0ZSk7XG4gICAgfVxuXG4gICAgd2hlbkZpbmlzaGVkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy53aWxsTW92ZVByb21pc2UucHJvbWlzZTtcbiAgICB9XG5cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsQ3VycmVudFR3ZWVuKCk7XG4gICAgICAgIHRoaXMuY2FuY2VsQ3VycmVudE1vdmVQcm9taXNlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVNb3ZlUHJvbWlzZSh0aW1lVG9Nb3ZlOiBudW1iZXIgPSAwKTogSVRpbWVvdXRXaXRoUHJvbWlzZSB7XG4gICAgICAgIHZhciByZXN1bHQ6IElUaW1lb3V0V2l0aFByb21pc2UgPSB7XG4gICAgICAgICAgICB0aW1lb3V0SWQ6IG51bGwsXG4gICAgICAgICAgICBwcm9taXNlOiBudWxsLFxuICAgICAgICAgICAgcmVzb2x2ZUNhbGxiYWNrOiBudWxsLFxuICAgICAgICAgICAgcmVqZWN0Q2FsbGJhY2s6IG51bGxcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQudGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoXG4gICAgICAgICAgICAoKSA9PiB0aGlzLnJlc29sdmVNb3ZlUHJvbWlzZSgpLFxuICAgICAgICAgICAgdGltZVRvTW92ZSk7XG5cbiAgICAgICAgcmVzdWx0LnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICByZXN1bHQucmVzb2x2ZUNhbGxiYWNrID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHJlc3VsdC5yZWplY3RDYWxsYmFjayA9IHJlamVjdDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc29sdmVNb3ZlUHJvbWlzZSgpIHtcbiAgICAgICAgaWYgKHRoaXMud2lsbE1vdmVQcm9taXNlKSB7XG4gICAgICAgICAgICB0aGlzLndpbGxNb3ZlUHJvbWlzZS5yZXNvbHZlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIHRoaXMud2lsbE1vdmVQcm9taXNlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2FuY2VsQ3VycmVudE1vdmVQcm9taXNlKCkge1xuICAgICAgICBpZiAodGhpcy53aWxsTW92ZVByb21pc2UpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy53aWxsTW92ZVByb21pc2UudGltZW91dElkKTtcbiAgICAgICAgICAgIC8vIFdlIGNvdWxkIHJlamVjdCB0aGUgcHJvbWlzZSBsaWtlIHRoaXMsIGJ1dCB0aGVyZSBpcyBubyBuZWVkXG4gICAgICAgICAgICAvLyB0aGlzLndpbGxNb3ZlUHJvbWlzZS5yZWplY3RDYWxsYmFjaygpO1xuICAgICAgICAgICAgdGhpcy53aWxsTW92ZVByb21pc2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYW5jZWxDdXJyZW50VHdlZW4oKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnR3ZWVuICYmIHRoaXMudHdlZW4uaXNSdW5uaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnR3ZWVuLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMudHdlZW4ub25Db21wbGV0ZS5yZW1vdmVBbGwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGltZUZvckFuaW1hdGlvbihkZXN0aW5hdGlvbjogSVBvaW50KTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGFuZ2xlQmV0d2VlbiA9IHRoaXMucGxheWVyLmdldEFuZ2xlVG9EZXNpcmVkUG9zaXRpb24oZGVzdGluYXRpb24pO1xuICAgICAgICBsZXQgZGlmZjEgPSB0aGlzLnBsYXllci5zcHJpdGUueCAtIGRlc3RpbmF0aW9uLng7XG4gICAgICAgIGxldCBkaWZmMiA9IHRoaXMucGxheWVyLnNwcml0ZS55IC0gZGVzdGluYXRpb24ueTtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KChkaWZmMSAqIGRpZmYxKSArIChkaWZmMiAqIGRpZmYyKSk7XG4gICAgICAgIGxldCBzcGVlZEZyb21YID0gTWF0aC5hYnMoTWF0aC5jb3MoYW5nbGVCZXR3ZWVuKSkgKiBkaXN0YW5jZSAvIHRoaXMucGxheWVyLnNwZWVkLng7XG4gICAgICAgIGxldCBzcGVlZEZyb21ZID0gTWF0aC5hYnMoTWF0aC5zaW4oYW5nbGVCZXR3ZWVuKSkgKiBkaXN0YW5jZSAvIHRoaXMucGxheWVyLnNwZWVkLnk7XG5cbiAgICAgICAgcmV0dXJuIDEwMDAgKiAoKHNwZWVkRnJvbVggKyBzcGVlZEZyb21ZKSAvIDIpO1xuICAgIH1cblxufVxuXG5cbmV4cG9ydCBjbGFzcyBQbGF5ZXJNb3ZlbWVudEhhbmRsZXIge1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50UGF0aDogQXJyYXk8SVBvaW50PjtcbiAgICBwcml2YXRlIGN1cnJlbnRTaW5nbGVNb3ZlOiBTaW5nbGVNb3ZlO1xuICAgIHByaXZhdGUgcmVzb2x2ZVByb21pc2VDYWxsYmFjazogKCk9PnZvaWQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsYXllcjogUGxheWVyKSB7fVxuXG4gICAgbW92ZVRvKGRlc3RpbmF0aW9uOiBJUG9pbnQpOiBQcm9taXNlPHt9PiB7XG5cbiAgICAgICAgdGhpcy5jYW5jZWxDdXJyZW50TW92ZSgpO1xuXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlUHJvbWlzZUNhbGxiYWNrID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IHBhdGhGaW5kZXIuZ2V0UGF0aCh0aGlzLnBsYXllci5wb3NpdGlvbiwgZGVzdGluYXRpb24sIHNjZW5lcy5jdXJyZW50U2NlbmUuYm91bmRhcmllcyk7XG4gICAgICAgIHRoaXMuZ29Ub05leHRQb3NpdGlvbigpO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnb1RvTmV4dFBvc2l0aW9uKCkge1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRQYXRoICYmIHRoaXMuY3VycmVudFBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTaW5nbGVNb3ZlID0gbmV3IFNpbmdsZU1vdmUodGhpcy5wbGF5ZXIsIHRoaXMuY3VycmVudFBhdGguc2hpZnQoKSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTaW5nbGVNb3ZlLndoZW5GaW5pc2hlZCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZ29Ub05leHRQb3NpdGlvbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0aGlzLnJlc29sdmVQcm9taXNlQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5zdG9wQW5pbWF0aW9ucygpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZVByb21pc2VDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZVRvV2l0aG91dEFuaW1hdGlvbihkZXN0aW5hdGlvbjogSVBvaW50KTogdm9pZCB7XG4gICAgICAgIGxldCBzYWZlUG9zaXRpb24gPSBzY2VuZXMuY3VycmVudFNjZW5lLmJvdW5kYXJpZXMuZ2V0UG9zaXRpb25JbnNpZGUoZGVzdGluYXRpb24pO1xuICAgICAgICB0aGlzLnBsYXllci51cGRhdGVEaXJlY3Rpb24oc2FmZVBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5jYW5jZWxDdXJyZW50TW92ZSgpO1xuICAgICAgICB0aGlzLnBsYXllci5wbGF5U3RhbmRBbmltYXRpb24oKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3ByaXRlLnggPSBzYWZlUG9zaXRpb24ueDtcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3ByaXRlLnkgPSBzYWZlUG9zaXRpb24ueTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgY2FuY2VsQ3VycmVudE1vdmUoKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudFNpbmdsZU1vdmUpIHtcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnN0b3BBbmltYXRpb25zKCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTaW5nbGVNb3ZlLmNhbmNlbCgpO1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlUHJvbWlzZUNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi4vdWkvVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcbmltcG9ydCB7IElSZWN0YW5nbGUsIElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgUG9seWdvbiB9IGZyb20gJy4uL3V0aWxzL1BvbHlnb24nO1xuaW1wb3J0IHsgU2NlbmVCb3VuZGFyaWVzIH0gZnJvbSAnLi9TY2VuZUJvdW5kYXJpZXMnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcbmltcG9ydCB7IERvb3IgfSBmcm9tICcuL0Rvb3InO1xuXG5cbmludGVyZmFjZSBJU2NlbmVPcHRpb25zIHtcbiAgICBpZDogc3RyaW5nLFxuICAgIGJhY2tncm91bmRJZDogc3RyaW5nLFxuICAgIGJvdW5kYXJpZXNDb25maWc6IFBvbHlnb24sXG4gICAgdGhpbmdzOiBBcnJheTxUaGluZz5cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNjZW5lIHtcblxuICAgIHByaXZhdGUgYmFja2dyb3VuZDogUGhhc2VyLlNwcml0ZTtcbiAgICBwcml2YXRlIF9ib3VuZGFyaWVzOiBTY2VuZUJvdW5kYXJpZXM7XG4gICAgcHJpdmF0ZSB0aGluZ3M6IFNldDxUaGluZz47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9wdGlvbnM6IElTY2VuZU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fYm91bmRhcmllcyA9IG5ldyBTY2VuZUJvdW5kYXJpZXMob3B0aW9ucy5ib3VuZGFyaWVzQ29uZmlnKTtcbiAgICAgICAgdGhpcy5jcmVhdGVUaGluZ3MoKTtcbiAgICB9XG5cbiAgICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pZDtcbiAgICB9XG5cbiAgICBnZXQgc2NlbmVCb3VuZHMoKTogSVJlY3RhbmdsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhY2tncm91bmQuZ2V0Qm91bmRzKCk7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kYXJpZXMoKTogU2NlbmVCb3VuZGFyaWVzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kYXJpZXM7XG4gICAgfVxuXG4gICAgc2hvdygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jcmVhdGVCYWNrZ3JvdW5kKCk7XG4gICAgICAgIHRoaXMudGhpbmdzLmZvckVhY2godGhpbmcgPT4gdGhpbmcuc2hvdygpKTtcbiAgICAgICAgdGhpcy5fYm91bmRhcmllcy5wYWludCgpO1xuICAgIH1cblxuICAgIHJlbW92ZU9iamVjdChvYmplY3RUb1JlbW92ZTogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50aGluZ3MuZGVsZXRlKG9iamVjdFRvUmVtb3ZlKTtcbiAgICAgICAgb2JqZWN0VG9SZW1vdmUuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHBsYXllckFycml2ZXNBdERvb3IocGxheWVyOiBQbGF5ZXIsIGRvb3JJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGxldCBkb29yID0gdGhpcy5maW5kRG9vcihkb29ySWQpO1xuICAgICAgICBkb29yLmZvcmNlT3BlbigpO1xuICAgICAgICBwbGF5ZXIudGVsZXBvcnRUbyhkb29yLmdldFBvc2l0aW9uVG9Hb1RvKCkpO1xuICAgIH1cblxuICAgIGdldFRoaW5nQnlJZCh0aGluZ0lkOiBzdHJpbmcpOiBUaGluZyB7XG4gICAgICAgIHZhciBmb3VuZFRoaW5nOiBUaGluZyA9IG51bGw7XG4gICAgICAgIHRoaXMudGhpbmdzLmZvckVhY2goKHRoaW5nKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpbmcuaWQgPT09IHRoaW5nSWQpIHtcbiAgICAgICAgICAgICAgICBmb3VuZFRoaW5nID0gdGhpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZm91bmRUaGluZztcbiAgICB9XG5cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJhY2tncm91bmQuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLnRoaW5ncy5mb3JFYWNoKHRoaW5nID0+IHRoaW5nLmRlc3Ryb3koKSk7XG4gICAgICAgIHRoaXMuX2JvdW5kYXJpZXMudW5wYWludCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQmFja2dyb3VuZCgpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gdWlMYXllcnMuYmFja2dyb3VuZC5jcmVhdGUoMCwgMCwgdGhpcy5vcHRpb25zLmJhY2tncm91bmRJZCk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5hbmNob3Iuc2V0KDAsIDApO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmV2ZW50cy5vbklucHV0RG93bi5hZGQoIChkZXN0OiBhbnksIGV2OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLkNMSUNLX1NUQUdFLCBldik7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVUaGluZ3MoKSB7XG4gICAgICAgIHRoaXMudGhpbmdzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLm9wdGlvbnMudGhpbmdzLmZvckVhY2goKHRoaW5nKSA9PiB0aGlzLnRoaW5ncy5hZGQodGhpbmcpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmREb29yKGRvb3JJZDogc3RyaW5nKTogRG9vciB7XG4gICAgICAgIGZvciAobGV0IHRoaW5nIG9mIHRoaXMudGhpbmdzKSB7XG4gICAgICAgICAgICBpZiAodGhpbmcuaWQgPT09IGRvb3JJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiA8RG9vcj50aGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyAnRVJST1I6IGNvdWxkIG5vdCBmaW5kIHRoZSByZWxhdGVkIGRvb3IuJztcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IFBvbHlnb24gfSBmcm9tICcuLi91dGlscy9Qb2x5Z29uJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5cblxuY29uc3QgU0hPVUxEX1BBSU5UID0gZmFsc2U7XG5cbmV4cG9ydCBjbGFzcyBTY2VuZUJvdW5kYXJpZXMge1xuXG4gICAgcHJpdmF0ZSBncmFwaGljczogUGhhc2VyLkdyYXBoaWNzO1xuICAgIHByaXZhdGUgYm91bmRpbmdHcmFwaGljczogUGhhc2VyLkdyYXBoaWNzO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IFBvbHlnb24pIHt9XG5cbiAgICBnZXRQb3NpdGlvbkluc2lkZShwb2ludDogSVBvaW50KTogSVBvaW50IHtcbiAgICAgICAgaWYodGhpcy5wb2x5Z29uLmlzUG9pbnRJbnNpZGUocG9pbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucG9seWdvbi5nZXRDbG9zZXN0UG9pbnRUbyhwb2ludCk7XG4gICAgfVxuXG4gICAgZ2V0IHBvbHlnb24oKTogUG9seWdvbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgICB9XG5cbiAgICBwYWludCgpOiB2b2lkIHtcbiAgICAgICAgaWYoU0hPVUxEX1BBSU5UKSB7XG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzID0gdGhpcy5wYWludFBvbHlnb24odGhpcy5jb25maWcsIDB4RkYzMzAwLCAweGZmZDkwMCk7XG4gICAgICAgICAgICB0aGlzLmJvdW5kaW5nR3JhcGhpY3MgPSB0aGlzLnBhaW50UG9seWdvbih0aGlzLmNvbmZpZy5nZXRDb252ZXhIdWxsKCksIDB4MDAzM0ZGLCAweDAwZDlmZik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bnBhaW50KCk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLmdyYXBoaWNzKSB7XG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFpbnRQb2x5Z29uKHBvbHlnb246IFBvbHlnb24sIGZpbGxDb2xvcjogbnVtYmVyLCBsaW5lQ29sb3I6IG51bWJlcik6IFBoYXNlci5HcmFwaGljcyB7XG4gICAgICAgIGxldCBwb2ludHMgPSBwb2x5Z29uLnBvaW50cztcbiAgICAgICAgbGV0IGdyYXBoaWNzID0gcGhhc2VyR2FtZS52YWx1ZS5hZGQuZ3JhcGhpY3MoMCwgMCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbChmaWxsQ29sb3IsIDAuNSk7XG4gICAgICAgIGdyYXBoaWNzLmxpbmVTdHlsZSgxLCBsaW5lQ29sb3IsIDEpO1xuICAgICAgICBcbiAgICAgICAgZ3JhcGhpY3MubW92ZVRvKHBvaW50c1swXS54LCBwb2ludHNbMF0ueSk7XG5cbiAgICAgICAgZm9yKGxldCBpPTE7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVUbyhwb2ludHNbaV0ueCwgcG9pbnRzW2ldLnkpO1xuICAgICAgICB9XG4gICAgICAgIGdyYXBoaWNzLmVuZEZpbGwoKTtcblxuICAgICAgICByZXR1cm4gZ3JhcGhpY3M7XG4gICAgfSBcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuaW1wb3J0IHsgSVBvaW50LCBJU3ByaXRlSW5mbyB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgRGlyZWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0RpcmVjdGlvbnMnO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuLi91aS9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuaW1wb3J0IHsgYWN0aXZlSW52ZW50b3J5IH0gZnJvbSAnLi4vc3RhdGUvQWN0aXZlSW52ZW50b3J5LnNpbmdsZXRvbic7XG5pbXBvcnQgeyBWZXJicyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHsgcmFuZG9tVGV4dCB9IGZyb20gJy4uL3V0aWxzL1JhbmRvbVRleHQnO1xuXG5cbmludGVyZmFjZSBJVGhpbmdPcHRpb25zIHtcbiAgICBpZDogc3RyaW5nLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICB4PzogbnVtYmVyLFxuICAgIHk/OiBudW1iZXIsXG4gICAgZGlyZWN0bHlJbkludmVudG9yeT86IEJvb2xlYW4sXG4gICAgc3ByaXRlSWQ/OiBzdHJpbmcsXG4gICAgaW52ZW50b3J5SW1hZ2VJZD86IHN0cmluZyxcbiAgICBnb1RvUG9zaXRpb24/OiBJUG9pbnQsXG4gICAgaXNGb3JlZ3JvdW5kPzogQm9vbGVhbixcbiAgICBwcmVmZXJyZWRBY3Rpb24/OiBWZXJicyxcbiAgICBwcmVmZXJyZWRJbnZlbnRvcnlBY3Rpb24/IDogVmVyYnMsXG4gICAgcGlja2FibGU/OiBCb29sZWFuLFxuICAgIGp1c3REZWNvcmF0aW9uPzogQm9vbGVhbixcbiAgICBkaXJlY3Rpb25Ub0xvb2s/OiBEaXJlY3Rpb25zLFxuICAgIG9wYWNpdHk/OiBudW1iZXIsXG4gICAgc3ByaXRlT3B0aW9ucz86IE1hcDxzdHJpbmcsIElTcHJpdGVJbmZvPixcbiAgICBhbmltYXRpb25TcGVlZD86IG51bWJlclxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBfc3RhdGU6IE1hcDxzdHJpbmcsIGFueT47XG4gICAgcHJvdGVjdGVkIHNwcml0ZTogUGhhc2VyLlNwcml0ZTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBvcHRpb25zOiBJVGhpbmdPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXJlY3RseUluSW52ZW50b3J5KSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRvSW52ZW50b3J5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNyZWF0ZVNwcml0ZSgpO1xuICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UoKTtcbiAgICAgICAgdGhpcy5hcHBseU1vZGlmaWVyKCk7XG4gICAgICAgIHRoaXMuYWRkU3ByaXRlQW5pbWF0aW9ucygpO1xuICAgIH1cblxuICAgIGdldCBzdGF0ZSgpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgIH1cblxuICAgIHNldCBzdGF0ZShuZXdTdGF0ZSkge1xuICAgICAgICBpZiAobmV3U3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMubmFtZTtcbiAgICB9XG5cbiAgICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pZDtcbiAgICB9XG5cbiAgICBjaGFuZ2VBdHRyKGF0dHJOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fc3RhdGUuc2V0KGF0dHJOYW1lLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMub25TdGF0ZUNoYW5nZSgpO1xuICAgIH1cblxuICAgIGdldEF0dHIoYXR0ck5hbWU6IHN0cmluZyk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZS5nZXQoYXR0ck5hbWUpO1xuICAgIH1cblxuICAgIGdldFByZWZlcnJlZEFjdGlvbigpOiBWZXJicyB7XG4gICAgICAgIGlmKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnByZWZlcnJlZEludmVudG9yeUFjdGlvbiB8fCBWZXJicy5MT09LO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wcmVmZXJyZWRBY3Rpb24gfHwgbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzSW5JbnZlbnRvcnkoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUuZ2V0KCdJU19JTl9JTlZFTlRPUlknKTtcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvblRvR29UbygpOiBJUG9pbnQge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmdvVG9Qb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5nb1RvUG9zaXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHg6IHRoaXMub3B0aW9ucy54LFxuICAgICAgICAgICAgICAgIHk6IHRoaXMub3B0aW9ucy55XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UG9zaXRpb25PblRvcCgpOiBJUG9pbnQge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy5zcHJpdGUueCxcbiAgICAgICAgICAgIHk6IE1hdGgucm91bmQodGhpcy5zcHJpdGUuZ2V0Qm91bmRzKCkueSkgLSAxMFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGdldERpcmVjdGlvblRvTG9vaygpOiBEaXJlY3Rpb25zIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kaXJlY3Rpb25Ub0xvb2sgfHwgbnVsbDtcbiAgICB9XG5cbiAgICBhcHBseUFjdGlvbih2ZXJiOiBWZXJicywgcGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoICh2ZXJiKSB7XG5cbiAgICAgICAgY2FzZSBWZXJicy5HT19UTzpcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdvVG9BY3Rpb24ocGxheWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZlcmJzLlRBS0U6XG4gICAgICAgICAgICB0aGlzLnRha2VBY3Rpb24ocGxheWVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZlcmJzLkxPT0s6XG4gICAgICAgICAgICB0aGlzLmxvb2tBY3Rpb24ocGxheWVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZlcmJzLk9QRU46XG4gICAgICAgICAgICB0aGlzLm9wZW5BY3Rpb24ocGxheWVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZlcmJzLkNMT1NFOlxuICAgICAgICAgICAgdGhpcy5jbG9zZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuUFVTSDpcbiAgICAgICAgICAgIHRoaXMucHVzaEFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuVVNFOlxuICAgICAgICAgICAgdGhpcy51c2VBY3Rpb24ocGxheWVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZlcmJzLlNQRUFLOlxuICAgICAgICAgICAgdGhpcy5zcGVha0FjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuR0lWRTpcbiAgICAgICAgICAgIHRoaXMuZ2l2ZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyAnRVJST1IsIHVua25vd24gYWN0aW9uICcgKyB2ZXJiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGludmVudG9yeUltYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuaW52ZW50b3J5SW1hZ2VJZCB8fCB0aGlzLm9wdGlvbnMuc3ByaXRlSWQ7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc3ByaXRlKSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5pc0luSW52ZW50b3J5KSB7XG4gICAgICAgICAgICBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCkucmVtb3ZlKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kcyB0aGF0IGNhbiBiZSBvdmVyd3JpdHRlbiBpbiBzdWJjbGFzc2VzXG4gICAgZ2V0RnJhbWVGb3JJbnZlbnRvcnkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcGxheUFuaW1hdGlvbihhbmltYXRpb25OYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLnNwcml0ZU9wdGlvbnMuaGFzKGFuaW1hdGlvbk5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5hbmltYXRpb25zLnBsYXkoYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IHRyeWluZyB0byBwbGF5IGFuaW1hdGlvbiB0aGF0IGRvZXNuXFwndCBleGlzdCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbGF5QW5pbWF0aW9uT25jZShhbmltYXRpb25OYW1lOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmKHRoaXMub3B0aW9ucy5zcHJpdGVPcHRpb25zLmhhcyhhbmltYXRpb25OYW1lKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLmFuaW1hdGlvbnMucGxheShhbmltYXRpb25OYW1lLCBudWxsLCBmYWxzZSk7IC8vRmFsc2Ugc28gaXQgZG9lcyBub3QgbG9vcFxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc3ByaXRlLmFuaW1hdGlvbnMuY3VycmVudEFuaW0gJiYgdGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5jdXJyZW50QW5pbS5vbkNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLmFuaW1hdGlvbnMuY3VycmVudEFuaW0ub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvblN0YXRlQ2hhbmdlKCk6IHZvaWQge307XG4gICAgcHJvdGVjdGVkIGFwcGx5TW9kaWZpZXIoKTogdm9pZCB7fTtcblxuICAgIHByb3RlY3RlZCBnb1RvQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRha2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnBpY2thYmxlKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIGlmKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX0FMUkVBRFlfSEFWRV9JVCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sZXRQbGF5ZXJDb21lQW5kVGFrZUl0KHBsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbGV0UGxheWVyQ29tZUFuZFRha2VJdChwbGF5ZXI6IFBsYXllcikge1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuVEFLRV9PQkpFQ1QsIHRoaXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkocmFuZG9tVGV4dChcbiAgICAgICAgICAgICAgICAnT0hfTE9PS19BVF9USEFUJyxcbiAgICAgICAgICAgICAgICAnTklDRV9PQkpFQ1QnLFxuICAgICAgICAgICAgICAgICdCRUFVVElGVUxfU09NRVRISU5HJ1xuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvcGVuQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdUSEFUX0NBTk5PVF9CRV9PUEVORUQnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY2xvc2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ1RIQVRfQ0FOTk9UX0JFX0NMT1NFRCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwdXNoQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdJX0NBTlRfTU9WRV9USEFUJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnSV9ET05UX0tOT1dfSE9XX1RPX0RPX1RIQVQnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc3BlYWtBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkocmFuZG9tVGV4dChcbiAgICAgICAgICAgICdJX1dPVUxETlRfS05PV19XSEFUX1RPX1NBWScsXG4gICAgICAgICAgICAnSV9IQVZFX0JFVFRFUl9USElOR1NfVE9fRE9fVEhBTl9UQUxLSU5HJyxcbiAgICAgICAgICAgICdISV9USEVSRSdcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdpdmVBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0lfQ0FOVF9ET19USEFUJyk7XG4gICAgfVxuXG5cbiAgICAvL01ldGhvZHMgdGhhdCBzaG91bGRuJ3QgYmUgb3ZlcnJpZGVuXG4gICAgcHJpdmF0ZSBhZGRUb0ludmVudG9yeSgpOiB2b2lkIHtcbiAgICAgICAgaWYoYWN0aXZlSW52ZW50b3J5LmdldEFjdGl2ZUludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCkuYWRkKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTcHJpdGUoKTogdm9pZCB7XG4gICAgICAgIGxldCBsYXllclRvVXNlciA9IHVpTGF5ZXJzLmJhY2tncm91bmRPYmplY3RzO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlzRm9yZWdyb3VuZCkge1xuICAgICAgICAgICAgbGF5ZXJUb1VzZXIgPSB1aUxheWVycy5mb3JlZ3JvdW5kT2JqZWN0cztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNwcml0ZSA9IGxheWVyVG9Vc2VyLmNyZWF0ZShcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy54LFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnksXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3ByaXRlSWRcbiAgICAgICAgKTtcblxuICAgICAgICBpZih0aGlzLm9wdGlvbnMub3BhY2l0eSkge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGUuYWxwaGEgPSB0aGlzLm9wdGlvbnMub3BhY2l0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCF0aGlzLm9wdGlvbnMuanVzdERlY29yYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5ldmVudHMub25JbnB1dERvd24uYWRkKHRoaXMub25DbGljaywgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5ldmVudHMub25JbnB1dE92ZXIuYWRkKHRoaXMub25JbnB1dE92ZXIsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zcHJpdGUuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKHRoaXMub25JbnB1dE91dCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG9uQ2xpY2socmVjZXB0b3I6IFBoYXNlci5TcHJpdGUsIHBvaW50ZXI6IFBoYXNlci5Qb2ludGVyKTogdm9pZCB7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLlNFTEVDVF9USElORywge1xuICAgICAgICAgICAgdGhpbmc6IHRoaXMsXG4gICAgICAgICAgICBzZWNvbmRhcnlBY3Rpb246ICEhcG9pbnRlci5yaWdodEJ1dHRvbi5pc0Rvd25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbklucHV0T3ZlcigpIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuQ1VSU09SX09WRVJfVEhJTkcsIHRoaXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25JbnB1dE91dCgpIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuQ1VSU09SX09VVF9USElORywgdGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRTcHJpdGVBbmltYXRpb25zKCk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLm9wdGlvbnMuc3ByaXRlT3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNwcml0ZU9wdGlvbnMuZm9yRWFjaCggKHNwcml0ZVBvc2l0aW9uLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS5hbmltYXRpb25zLmFkZChrZXksIHNwcml0ZVBvc2l0aW9uLmZyYW1lcywgdGhpcy5vcHRpb25zLmFuaW1hdGlvblNwZWVkLCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IE9ic2VydmFibGUsIElDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzL09ic2VydmFibGUnO1xuaW1wb3J0IHsgSW52ZW50b3J5IH0gZnJvbSAnLi4vbW9kZWxzL0ludmVudG9yeSc7XG5cbmNsYXNzIEFjdGl2ZUludmVudG9yeSB7XG5cbiAgICBwcml2YXRlIGNoYW5nZU9ic2VydmFibGU6IE9ic2VydmFibGU7XG4gICAgcHJpdmF0ZSBhY3RpdmVJbnZlbnRvcnk6IEludmVudG9yeTtcbiAgICBwcml2YXRlIG9uSW52ZW50b3J5Q2hhbmdlQmluZGVkOiBJQ2FsbGJhY2s7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5vbkludmVudG9yeUNoYW5nZUJpbmRlZCA9ICgobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnMobmV3VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXRBY3RpdmVJbnZlbnRvcnkobmV3SW52ZW50b3J5OiBJbnZlbnRvcnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW1vdmVPbGRJbnZlbnRvcnlFdmVudHMoKTtcbiAgICAgICAgdGhpcy5hY3RpdmVJbnZlbnRvcnkgPSBuZXdJbnZlbnRvcnk7XG4gICAgICAgIHRoaXMuY3JlYXRlTmV3SW52ZW50b3J5RXZlbnRzKCk7XG4gICAgICAgIHRoaXMubm90aWZ5U3Vic2NyaWJlcnMoKTtcbiAgICB9XG5cbiAgICBnZXRBY3RpdmVJbnZlbnRvcnkoKTogSW52ZW50b3J5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlSW52ZW50b3J5O1xuICAgIH1cblxuICAgIHJlZnJlc2goKTogdm9pZCB7XG4gICAgICAgIHRoaXMubm90aWZ5U3Vic2NyaWJlcnMoKTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5yZWdpc3Rlck9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5hY3RpdmVJbnZlbnRvcnkpO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoYW5nZU9ic2VydmFibGUucmVtb3ZlT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlT2xkSW52ZW50b3J5RXZlbnRzKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVJbnZlbnRvcnkpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSW52ZW50b3J5LnVuc3Vic2NyaWJlVG9DaGFuZ2UodGhpcy5vbkludmVudG9yeUNoYW5nZUJpbmRlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZU5ld0ludmVudG9yeUV2ZW50cygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlSW52ZW50b3J5KSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUludmVudG9yeS5zdWJzY3JpYmVUb0NoYW5nZSh0aGlzLm9uSW52ZW50b3J5Q2hhbmdlQmluZGVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbm90aWZ5U3Vic2NyaWJlcnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnModGhpcy5hY3RpdmVJbnZlbnRvcnkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFjdGl2ZUludmVudG9yeSA9IG5ldyBBY3RpdmVJbnZlbnRvcnkoKTsiLCJjbGFzcyBQaGFzZXJHYW1lIHtcblxuICAgIHByaXZhdGUgY3VycmVudFZhbHVlOiBQaGFzZXIuR2FtZTtcblxuICAgIHNldCB2YWx1ZShuZXdWYWx1ZTogUGhhc2VyLkdhbWUpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWUoKTogUGhhc2VyLkdhbWUge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VmFsdWU7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgcGhhc2VyR2FtZSA9IG5ldyBQaGFzZXJHYW1lKCk7IiwiaW1wb3J0IHsgU2NlbmUgfSBmcm9tICcuLi9tb2RlbHMvU2NlbmUnO1xuXG5jbGFzcyBTY2VuZXNTZXQge1xuICAgIHByaXZhdGUgc2NlbmVzOiBNYXA8c3RyaW5nLCBTY2VuZT47XG4gICAgcHJpdmF0ZSBfY3VycmVudFNjZW5lOiBTY2VuZTtcblxuICAgIGluaXQoc2NlbmVzOiBBcnJheTxTY2VuZT4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zY2VuZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHNjZW5lcy5mb3JFYWNoKChzY2VuZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY2VuZXMuc2V0KHNjZW5lLmlkLCBzY2VuZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBjdXJyZW50U2NlbmUoKTogU2NlbmUge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFNjZW5lO1xuICAgIH1cblxuICAgIGdldFNjZW5lQnlJZChpZDogc3RyaW5nKTogU2NlbmUge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2VuZXMuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBzZXRDdXJyZW50U2NlbmVCeUlkKG5ld0N1cnJlbnRTY2VuZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kZXN0cm95Q3VycmVudFNjZW5lKCk7XG4gICAgICAgIGxldCBzY2VuZSA9IHRoaXMuc2NlbmVzLmdldChuZXdDdXJyZW50U2NlbmVJZCk7XG4gICAgICAgIGlmICghc2NlbmUpIHtcbiAgICAgICAgICAgIHRocm93IGBFUlJPUiB0cnlpbmcgdG8gaW5pdCBzY2VuZSB0aGF0IGlzIG5vdCBwcmVzZW50ICgke25ld0N1cnJlbnRTY2VuZUlkfSlgO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZSA9IHNjZW5lO1xuICAgICAgICBzY2VuZS5zaG93KCk7XG4gICAgfVxuXG4gICAgZ29Ub1NjZW5lV2l0aElkKHNjZW5lSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3lDdXJyZW50U2NlbmUoKTtcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50U2NlbmVCeUlkKHNjZW5lSWQpO1xuICAgIH0gICBcblxuICAgIHByaXZhdGUgZGVzdHJveUN1cnJlbnRTY2VuZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRTY2VuZSkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBzY2VuZXMgPSBuZXcgU2NlbmVzU2V0KCk7XG4iLCJpbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBHZW5lcmljSGlnaGxpZ2h0ZWRUaGluZyB9IGZyb20gJy4uL21vZGVscy9HZW5lcmljSGlnaGxpZ2h0ZWRUaGluZyc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBzZWxlY3RlZFZlcmIgfSBmcm9tICcuL1NlbGVjdGVkVmVyYi5zaW5nbGV0b24nO1xuaW1wb3J0IHsgVmVyYnNJbmZvIH0gZnJvbSAnLi4vc3RvcmVzL1ZlcmJzLnN0b3JlJztcblxuY2xhc3MgU2VsZWN0ZWRUaGluZyBleHRlbmRzIEdlbmVyaWNIaWdobGlnaHRlZFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQUNUSU9OX0FQUExJRUQsXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmhpZ2hsaWdodFRoaW5nKG51bGwpXG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jbGFzcyBIaWdobGlnaHRlZFRoaW5nIGV4dGVuZHMgR2VuZXJpY0hpZ2hsaWdodGVkVGhpbmcge1xuXG4gICAgcHJvdGVjdGVkIG9uQ3Vyc29yT3ZlclRoaW5nKHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICBpZiAoIXNlbGVjdGVkVmVyYi52ZXJiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHZlcmJJbmZvID0gVmVyYnNJbmZvLmdldChzZWxlY3RlZFZlcmIudmVyYik7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkVmVyYi52ZXJiICYmIHZlcmJJbmZvLnNpbmdsZU9iamVjdCkge1xuXG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nKHRoaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFZlcmIudmVyYiAmJiAhdmVyYkluZm8uc2luZ2xlT2JqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nRm9yTXVsdGlwbGVPYmplY3RWZXJiKHRoaW5nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGlnaGxpZ2h0VGhpbmdGb3JNdWx0aXBsZU9iamVjdFZlcmIodGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nKHRoaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGluZy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0VGhpbmcodGhpbmcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uQ3Vyc29yT3V0VGhpbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGhpbmcobnVsbCk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgaGlnaGxpZ2h0ZWRUaGluZyA9IG5ldyBIaWdobGlnaHRlZFRoaW5nKCk7XG5leHBvcnQgY29uc3Qgc2VsZWN0ZWRUaGluZyA9IG5ldyBTZWxlY3RlZFRoaW5nKCk7XG4iLCJpbXBvcnQgeyBWZXJicyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlICwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5cbmNsYXNzIFNlbGVjdGVkVmVyYiB7XG5cbiAgICBwcml2YXRlIG9uQ2hhbmdlT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTtcbiAgICBwcml2YXRlIHNlbGVjdGVkVmVyYjogVmVyYnM7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oXG4gICAgICAgICAgICBBY3Rpb25zLlNFTEVDVF9WRVJCLFxuICAgICAgICAgICAgbmV3VmVyYiA9PiB0aGlzLnNlbGVjdE5ld1ZlcmIobmV3VmVyYilcbiAgICAgICAgKTtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQUNUSU9OX0FQUExJRUQsXG4gICAgICAgICAgICAoKSA9PiB0aGlzLnJlc2V0KClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXQgdmVyYigpOiBWZXJicyB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkVmVyYjtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLnNlbGVjdGVkVmVyYik7XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLnJlbW92ZU9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBub3RpZnlTdWJzY3JpYmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUubm90aWZ5T2JzZXJ2ZXJzKHRoaXMuc2VsZWN0ZWRWZXJiKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNlbGVjdE5ld1ZlcmIobmV3VmVyYjogVmVyYnMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFZlcmIgPSBuZXdWZXJiO1xuICAgICAgICB0aGlzLm5vdGlmeVN1YnNjcmliZXJzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWxlY3ROZXdWZXJiKFZlcmJzLkdPX1RPKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IHNlbGVjdGVkVmVyYiA9IG5ldyBTZWxlY3RlZFZlcmIoKTtcbiIsImltcG9ydCB7IElMYWJlbHMgIH0gZnJvbSAnLi9MYWJlbHMuc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9MQUJFTFM6IElMYWJlbHMgPSB7XG4gICAgJ2VzJzoge1xuICAgICAgICAnQ2xvc2UnOiAnQ2VycmFyJyxcbiAgICAgICAgJ0dpdmUnOiAnRGFyJyxcbiAgICAgICAgJ0dvIHRvJzogJ0lyIGEnLFxuICAgICAgICAnTG9vayBhdCc6ICdNaXJhcicsXG4gICAgICAgICdPcGVuJzogJ0FicmlyJyxcbiAgICAgICAgJ1B1c2gnOiAnRW1wdWphcicsXG4gICAgICAgICdSZWZsZWN0JzogJ1BlbnNhcicsXG4gICAgICAgICdTcGVhayB0byc6ICdIYWJsYXIgYScsXG4gICAgICAgICdUYWtlJzogJ0NvZ2VyJyxcbiAgICAgICAgJ3RvJzogJ2EnLFxuICAgICAgICAnVXNlJzogJ1VzYXInLFxuICAgICAgICAnd2l0aCc6ICdjb24nXG4gICAgfSxcbiAgICAnZW4nOiB7XG4gICAgICAgICdDbG9zZSc6ICdDbG9zZScsXG4gICAgICAgICdHaXZlJzogJ0dpdmUnLFxuICAgICAgICAnR28gdG8nOiAnR28gdG8nLFxuICAgICAgICAnTG9vayBhdCc6ICdMb29rIGF0JyxcbiAgICAgICAgJ09wZW4nOiAnT3BlbicsXG4gICAgICAgICdQdXNoJzogJ1B1c2gnLFxuICAgICAgICAnUmVmbGVjdCc6ICdSZWZsZWN0JyxcbiAgICAgICAgJ1NwZWFrIHRvJzogJ1NwZWFrIHRvJyxcbiAgICAgICAgJ1Rha2UnOiAnUGljayB1cCcsXG4gICAgICAgICd0byc6ICd0bycsXG4gICAgICAgICdVc2UnOiAnVXNlJyxcbiAgICAgICAgJ3dpdGgnOiAnd2l0aCdcbiAgICB9XG59OyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9teS10eXBpbmdzL2xpYi5lczYuZC50c1wiIC8+XG5pbXBvcnQgeyBERUZBVUxUX0xBQkVMUyB9IGZyb20gJy4vRGVmYXVsdExhYmVscyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxhYmVsc1Blckxhbmd1YWdlIHtcbiAgICBbaW5kZXggOiBzdHJpbmddIDogc3RyaW5nO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBJTGFiZWxzIHtcbiAgICBbaW5kZXggOiBzdHJpbmddIDogSUxhYmVsc1Blckxhbmd1YWdlO1xufTtcblxuY29uc3QgREVGQVVMVF9MQU5HVUFHRSA9ICdlbic7XG5cbmNsYXNzIExhYmVsc1N0b3JlIHtcbiAgICBwcml2YXRlIGxhYmVsczogTWFwPHN0cmluZywgSUxhYmVsc1Blckxhbmd1YWdlPjtcbiAgICBwcml2YXRlIGN1cnJlbnRMYW5ndWFnZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubGFiZWxzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRMYW5ndWFnZSA9IERFRkFVTFRfTEFOR1VBR0U7XG4gICAgfVxuXG4gICAgc2V0TGFuZ3VhZ2UobmV3TGFuZ3VhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmN1cnJlbnRMYW5ndWFnZSA9IG5ld0xhbmd1YWdlO1xuICAgIH1cblxuICAgIGFkZExhYmVscyhsYWJlbHNUb0FkZDogSUxhYmVscyk6IHZvaWQge1xuICAgICAgICBmb3IobGV0IGtleSBpbiBsYWJlbHNUb0FkZCkge1xuICAgICAgICAgICAgdGhpcy5hZGRMYWJlbHNGb3JMYW5ndWFnZShrZXksIGxhYmVsc1RvQWRkW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGFiZWwobGFiZWxOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgYWxsTGFuZ3VhZ2VMYWJlbHMgPSB0aGlzLmxhYmVscy5nZXQodGhpcy5jdXJyZW50TGFuZ3VhZ2UpO1xuICAgICAgICBpZiAoIWFsbExhbmd1YWdlTGFiZWxzKSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IHRyeWluZyB0byBnZXQgbGFiZWwgZnJvbSBub24gZXhpc3RpbmcgbGFuZ3VhZ2UnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbGxMYW5ndWFnZUxhYmVsc1tsYWJlbE5hbWVdIHx8IGxhYmVsTmFtZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZExhYmVsc0Zvckxhbmd1YWdlKGxhbmd1YWdlOiBzdHJpbmcsIGxhYmVsczogSUxhYmVsc1Blckxhbmd1YWdlKTogdm9pZCB7XG4gICAgICAgIGxldCBwcmV2aW91c0xhYmVscyA9IHRoaXMubGFiZWxzLmdldChsYW5ndWFnZSkgfHwge307XG4gICAgICAgIGxldCBuZXdMYWJlbHMgPSBPYmplY3QuYXNzaWduKHt9LCBwcmV2aW91c0xhYmVscywgbGFiZWxzKTtcbiAgICAgICAgdGhpcy5sYWJlbHMuc2V0KGxhbmd1YWdlLCBuZXdMYWJlbHMpO1xuICAgIH1cbn1cbmxldCBsYWJlbHNTdG9yZVNpbmdsZXRvbiA9IG5ldyBMYWJlbHNTdG9yZSgpO1xuXG5sYWJlbHNTdG9yZVNpbmdsZXRvbi5hZGRMYWJlbHMoPElMYWJlbHM+IERFRkFVTFRfTEFCRUxTKTtcblxuZXhwb3J0IGNvbnN0IGxhYmVsID0gKChsYWJlbElkOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gbGFiZWxzU3RvcmVTaW5nbGV0b24uZ2V0TGFiZWwobGFiZWxJZCk7XG59KTtcblxuZXhwb3J0IGNvbnN0IGxhYmVsc1N0b3JlID0gbGFiZWxzU3RvcmVTaW5nbGV0b247XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuXG5leHBvcnQgZW51bSBWZXJicyB7XG4gICAgR09fVE8gPSAxLFxuICAgIExPT0ssXG4gICAgQ0xPU0UsXG4gICAgUFVTSCxcbiAgICBUQUtFLFxuICAgIFVTRSxcbiAgICBTUEVBSyxcbiAgICBHSVZFLFxuICAgIE9QRU5cbn07XG5cbmludGVyZmFjZSBJVmVyYkluZm8ge1xuICAgIGxhYmVsOiBzdHJpbmcsXG4gICAgc2luZ2xlT2JqZWN0OiBCb29sZWFuLFxuICAgIGNvbmp1Y3Rpb24/OiBzdHJpbmdcbn1cblxubGV0IHZlcmJzSW5mbyA6IE1hcDxWZXJicywgSVZlcmJJbmZvPiA9IG5ldyBNYXAoKTtcblxudmVyYnNJbmZvLnNldChWZXJicy5HT19UTywge1xuICAgIGxhYmVsOiAnR28gdG8nLFxuICAgIHNpbmdsZU9iamVjdDogdHJ1ZVxufSk7XG52ZXJic0luZm8uc2V0KFZlcmJzLkxPT0ssIHtcbiAgICBsYWJlbDogJ0xvb2sgYXQnLFxuICAgIHNpbmdsZU9iamVjdDogdHJ1ZVxufSk7XG52ZXJic0luZm8uc2V0KFZlcmJzLkNMT1NFLCB7XG4gICAgbGFiZWw6ICdDbG9zZScsXG4gICAgc2luZ2xlT2JqZWN0OiB0cnVlXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuUFVTSCwge1xuICAgIGxhYmVsOiAnUHVzaCcsXG4gICAgc2luZ2xlT2JqZWN0OiB0cnVlXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuVEFLRSwge1xuICAgIGxhYmVsOiAnVGFrZScsXG4gICAgc2luZ2xlT2JqZWN0OiB0cnVlXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuVVNFLCB7XG4gICAgbGFiZWw6ICdVc2UnLFxuICAgIHNpbmdsZU9iamVjdDogZmFsc2UsXG4gICAgY29uanVjdGlvbjogJ3dpdGgnXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuU1BFQUssIHtcbiAgICBsYWJlbDogJ1NwZWFrIHRvJyxcbiAgICBzaW5nbGVPYmplY3Q6IHRydWVcbn0pO1xudmVyYnNJbmZvLnNldChWZXJicy5HSVZFLCB7XG4gICAgbGFiZWw6ICdHaXZlJyxcbiAgICBzaW5nbGVPYmplY3Q6IGZhbHNlLFxuICAgIGNvbmp1Y3Rpb246ICd0bydcbn0pO1xudmVyYnNJbmZvLnNldChWZXJicy5PUEVOLCB7XG4gICAgbGFiZWw6ICdPcGVuJyxcbiAgICBzaW5nbGVPYmplY3Q6IHRydWVcbn0pO1xuZXhwb3J0IGNvbnN0IFZlcmJzSW5mbyA9IHZlcmJzSW5mbztcbiIsImltcG9ydCB7IFZlcmJzLCBWZXJic0luZm8gfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBwaGFzZXIgfSBmcm9tICcuLi8uLi9QaGFzZXInO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBsYWJlbCB9IGZyb20gJy4uL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuL1N0eWxlJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcbmltcG9ydCB7IFRleHRXaXRoU2hhZG93IH0gZnJvbSAnLi9UZXh0V2l0aFNoYWRvdyc7XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25CdXR0b24ge1xuXG4gICAgcHJpdmF0ZSBzY3JlZW5Qb3NpdGlvbjogSVBvaW50O1xuICAgIHByaXZhdGUgYnV0dG9uOiBQaGFzZXIuQnV0dG9uO1xuICAgIHByaXZhdGUgdGV4dDogVGV4dFdpdGhTaGFkb3c7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZlcmI6IFZlcmJzLCBwb3NpdGlvbjogSVBvaW50KSB7XG4gICAgICAgIHRoaXMuc2NyZWVuUG9zaXRpb24gPSBsYXlvdXQuZ2V0VmVyYkJ1dHRvblBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5jcmVhdGVCdXR0b24oKTtcbiAgICAgICAgdGhpcy5jcmVhdGVUZXh0KCk7XG4gICAgfVxuXG4gICAgaGlnaGxpZ2h0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJ1dHRvbi5mcmFtZSA9IDI7XG4gICAgfVxuXG4gICAgdW5oaWdobGlnaHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnV0dG9uLmZyYW1lID0gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5idXR0b24gPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC5idXR0b24oXG4gICAgICAgICAgICB0aGlzLnNjcmVlblBvc2l0aW9uLngsXG4gICAgICAgICAgICB0aGlzLnNjcmVlblBvc2l0aW9uLnksXG4gICAgICAgICAgICAnQlVUVE9OX0JHJyxcbiAgICAgICAgICAgIHRoaXMub25DbGljayxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIHVpTGF5ZXJzLnZlcmJCdXR0b25zLmFkZCh0aGlzLmJ1dHRvbik7XG4gICAgICAgIHRoaXMuYnV0dG9uLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlVGV4dCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHRleHQgPSBsYWJlbChWZXJic0luZm8uZ2V0KHRoaXMudmVyYikubGFiZWwpO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnNjcmVlblBvc2l0aW9uLnggKyBsYXlvdXQuVkVSQl9CVVRUT05fV0lEVEggLyAyLFxuICAgICAgICAgICAgeTogdGhpcy5zY3JlZW5Qb3NpdGlvbi55ICsgbGF5b3V0LlZFUkJfQlVUVE9OX0hFSUdIVCAvIDJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50ZXh0ID0gbmV3IFRleHRXaXRoU2hhZG93KHtcbiAgICAgICAgICAgIGluaXRpYWxUZXh0OiB0ZXh0LFxuICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgZml4ZWRUb0NhbWVyYTogdHJ1ZSxcbiAgICAgICAgICAgIGxheWVyOiB1aUxheWVycy52ZXJiQnV0dG9ucyxcbiAgICAgICAgICAgIGFuY2hvcjoge1xuICAgICAgICAgICAgICAgIHg6IDAuNSxcbiAgICAgICAgICAgICAgICB5OiAwLjVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIG9uQ2xpY2soKTogdm9pZCB7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLlNFTEVDVF9WRVJCLCB0aGlzLnZlcmIpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHN0eWxlIH0gZnJvbSAnLi9TdHlsZSc7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25MaW5lIH0gZnJvbSAnLi4vbW9kZWxzL0NvbnZlcnNhdGlvbkxpbmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IFRleHRXaXRoU2hhZG93IH0gZnJvbSAnLi9UZXh0V2l0aFNoYWRvdyc7XG5pbXBvcnQgeyBsYWJlbCB9IGZyb20gJy4uL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuXG5leHBvcnQgY2xhc3MgQ29udmVyc2F0aW9uTGluZVVJIHtcblxuICAgIHByaXZhdGUgY2xpY2tPYnNlcnZhYmxlOiBPYnNlcnZhYmxlO1xuICAgIHByaXZhdGUgcG9zaXRpb246IElQb2ludDtcbiAgICBwcml2YXRlIGJ1dHRvbjogUGhhc2VyLkJ1dHRvbjtcbiAgICBwcml2YXRlIHRleHQ6IFRleHRXaXRoU2hhZG93O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgY29udmVyc2F0aW9uTGluZTogQ29udmVyc2F0aW9uTGluZSxcbiAgICAgICAgcHJpdmF0ZSBsaW5lVGV4dDogc3RyaW5nLFxuICAgICAgICBwcml2YXRlIGluZGV4OiBudW1iZXIpIHtcblxuICAgICAgICBpZiAoIXRoaXMuY29udmVyc2F0aW9uTGluZSkge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBjb252ZXJzYXRpb24gbGluZSBVSSwgbm8gY29udmVyc2F0aW9uTGluZSBwcm92aWRlZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmxpbmVUZXh0KSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IGNvbnZlcnNhdGlvbiBsaW5lIFVJLCBubyB0ZXh0IHByb3ZpZGVkJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IGNvbnZlcnNhdGlvbiBsaW5lIFVJLCBubyBpbmRleCBwcm92aWRlZCc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsaWNrT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBsYXlvdXQuZ2V0UG9zaXRpb25Gb3JDb252ZXJzYXRpb25MaW5lKHRoaXMuaW5kZXgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvbigpO1xuICAgICAgICB0aGlzLmNyZWF0ZVRleHQoKTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NsaWNrKGNhbGxiYWNrOiBJQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGlja09ic2VydmFibGUucmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uZGVzdHJveSgpO1xuICAgICAgICB0aGlzLnRleHQuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQnV0dG9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJ1dHRvbiA9IHBoYXNlckdhbWUudmFsdWUuYWRkLmJ1dHRvbihcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCxcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSxcbiAgICAgICAgICAgICdDT05WRVJTQVRJT05fTElORV9CRycsXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2ssXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAyLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICB1aUxheWVycy5jb252ZXJzYXRpb24uYWRkKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgdGhpcy5idXR0b24uZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVUZXh0KCk6IHZvaWQge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvc2l0aW9uLnggKyBsYXlvdXQuQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19YLFxuICAgICAgICAgICAgeTogdGhpcy5wb3NpdGlvbi55ICsgbGF5b3V0LkNPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRleHQgPSBuZXcgVGV4dFdpdGhTaGFkb3coe1xuICAgICAgICAgICAgaW5pdGlhbFRleHQ6IGxhYmVsKHRoaXMubGluZVRleHQpLFxuICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgZml4ZWRUb0NhbWVyYTogdHJ1ZSxcbiAgICAgICAgICAgIGxheWVyOiB1aUxheWVycy5jb252ZXJzYXRpb25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsaWNrT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnModGhpcy5jb252ZXJzYXRpb25MaW5lKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHVpQmxvY2tlciB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9VSUJsb2NrZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbiB9IGZyb20gJy4uL21vZGVscy9Db252ZXJzYXRpb24nO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uTGluZSB9IGZyb20gJy4uL21vZGVscy9Db252ZXJzYXRpb25MaW5lJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbkxpbmVVSSB9IGZyb20gJy4vQ29udmVyc2F0aW9uTGluZVVJJztcbmltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgUGFnaW5hdGlvbkJ1dHRvblR5cGUsIEludmVudG9yeVBhZ2luYXRpb25CdXR0b24gfSBmcm9tICcuL0ludmVudG9yeVBhZ2luYXRpb25CdXR0b24nO1xuXG5jb25zdCBMSU5FU19QRVJfUEFHRSA9IDM7XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJzYXRpb25VSSB7XG5cbiAgICBwcml2YXRlIGJhY2tncm91bmQ6IFBoYXNlci5TcHJpdGU7XG4gICAgcHJpdmF0ZSBsaW5lczogQXJyYXk8Q29udmVyc2F0aW9uTGluZVVJPjtcbiAgICBwcml2YXRlIHVpQmxvY2tlcldhc0Jsb2NrZWRCZWZvcmU6IEJvb2xlYW47XG4gICAgcHJpdmF0ZSBmaXJzdExpbmVTaG93bjogbnVtYmVyO1xuICAgIHByaXZhdGUgcGFnaW5hdGlvbkJ1dHRvblVwOiBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uO1xuICAgIHByaXZhdGUgcGFnaW5hdGlvbkJ1dHRvbkRvd246IEludmVudG9yeVBhZ2luYXRpb25CdXR0b247XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uKSB7XG4gICAgICAgIHRoaXMuZmlyc3RMaW5lU2hvd24gPSAwO1xuICAgICAgICB0aGlzLnVpQmxvY2tlcldhc0Jsb2NrZWRCZWZvcmUgPSB1aUJsb2NrZXIuaXNCbG9ja2VkKCk7XG4gICAgICAgIHVpQmxvY2tlci5ibG9jaygpO1xuICAgICAgICB0aGlzLmxpbmVzID0gW107XG4gICAgICAgIHRoaXMuY3JlYXRlQmFja2dyb3VuZCgpO1xuICAgICAgICB0aGlzLmNvbnZlcnNhdGlvbi5vblN0YXRlQ2hhbmdlKChuZXdTdGF0ZSkgPT4gdGhpcy51cGRhdGUobmV3U3RhdGUpKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3lPbGRMaW5lcygpO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQuZGVzdHJveSgpO1xuICAgICAgICBpZighdGhpcy51aUJsb2NrZXJXYXNCbG9ja2VkQmVmb3JlKSB7XG4gICAgICAgICAgICB1aUJsb2NrZXIudW5ibG9jaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgICAgICBsZXQgbGF5b3V0U3RhcnRQb3NpdGlvbiA9IGxheW91dC5VSV9TVEFSVF9QT1NJVElPTjtcblxuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSB1aUxheWVycy5jb252ZXJzYXRpb24uY3JlYXRlKFxuICAgICAgICAgICAgbGF5b3V0U3RhcnRQb3NpdGlvbi54LFxuICAgICAgICAgICAgbGF5b3V0U3RhcnRQb3NpdGlvbi55LFxuICAgICAgICAgICAgJ1VJX0NPTlZFUlNBVElPTl9CRydcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmFuY2hvci5zZXRUbygwLCAwKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlKG5ld1N0YXRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5maXJzdExpbmVTaG93biA9IDA7XG4gICAgICAgIHRoaXMuZGVzdHJveU9sZExpbmVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlTmV3TGluZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZU5ld0xpbmVzKCk6IHZvaWQge1xuICAgICAgICBsZXQgbmV3TGluZXMgPSB0aGlzLmNvbnZlcnNhdGlvbi5nZXRMaW5lcygpO1xuICAgICAgICBmb3IobGV0IGk9dGhpcy5maXJzdExpbmVTaG93bjsgaTwodGhpcy5maXJzdExpbmVTaG93biArIExJTkVTX1BFUl9QQUdFKSAmJiAoaTxuZXdMaW5lcy5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTGluZShuZXdMaW5lc1tpXSwgaSAtIHRoaXMuZmlyc3RMaW5lU2hvd24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlUGFnaW5hdGlvbkJ1dHRvbnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUxpbmUobGluZTogQ29udmVyc2F0aW9uTGluZSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBsZXQgbmV3VUlMaW5lID0gbmV3IENvbnZlcnNhdGlvbkxpbmVVSShcbiAgICAgICAgICAgIGxpbmUsXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnNhdGlvbi5nZXRUZXh0Rm9yTGluZShsaW5lKSxcbiAgICAgICAgICAgIGluZGV4KTtcbiAgICAgICAgbmV3VUlMaW5lLnN1YnNjcmliZVRvQ2xpY2soY2xpY2tlZExpbmVkID0+IHRoaXMubGluZUNsaWNrZWQoY2xpY2tlZExpbmVkKSk7XG4gICAgICAgIHRoaXMubGluZXMucHVzaChuZXdVSUxpbmUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbGluZUNsaWNrZWQobGluZTogQ29udmVyc2F0aW9uTGluZSkge1xuICAgICAgICB0aGlzLmRlc3Ryb3lPbGRMaW5lcygpO1xuICAgICAgICB0aGlzLmNvbnZlcnNhdGlvbi5hcHBseUxpbmUobGluZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95T2xkTGluZXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGluZXMuZm9yRWFjaChsaW5lID0+IGxpbmUuZGVzdHJveSgpKTtcbiAgICAgICAgdGhpcy5saW5lcyA9IFtdO1xuICAgICAgICB0aGlzLmRlc3Ryb3lQYWdpbmF0aW9uQnV0dG9ucygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUGFnaW5hdGlvbkJ1dHRvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveVBhZ2luYXRpb25CdXR0b25zKCk7XG4gICAgICAgIGlmKHRoaXMuZmlyc3RMaW5lU2hvd24gPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25VcCA9IG5ldyBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBQYWdpbmF0aW9uQnV0dG9uVHlwZS5VUCxcbiAgICAgICAgICAgICAgICBsYXllcjogdWlMYXllcnMuY29udmVyc2F0aW9uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvblVwLnN1YnNjcmliZVRvQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZ29Ub1ByZXZQYWdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZigodGhpcy5maXJzdExpbmVTaG93biArIExJTkVTX1BFUl9QQUdFKSA8IHRoaXMuY29udmVyc2F0aW9uLmdldExpbmVzKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25Eb3duID0gbmV3IEludmVudG9yeVBhZ2luYXRpb25CdXR0b24oe1xuICAgICAgICAgICAgICAgIHR5cGU6IFBhZ2luYXRpb25CdXR0b25UeXBlLkRPV04sXG4gICAgICAgICAgICAgICAgbGF5ZXI6IHVpTGF5ZXJzLmNvbnZlcnNhdGlvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25Eb3duLnN1YnNjcmliZVRvQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZ29Ub05leHRQYWdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ29Ub1ByZXZQYWdlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZpcnN0TGluZVNob3duLS07XG4gICAgICAgIHRoaXMuZGVzdHJveU9sZExpbmVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlTmV3TGluZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdvVG9OZXh0UGFnZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5maXJzdExpbmVTaG93bisrO1xuICAgICAgICB0aGlzLmRlc3Ryb3lPbGRMaW5lcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZU5ld0xpbmVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95UGFnaW5hdGlvbkJ1dHRvbnMoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMucGFnaW5hdGlvbkJ1dHRvblVwKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25VcC5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25VcCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLnBhZ2luYXRpb25CdXR0b25Eb3duKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25Eb3duLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvbkRvd24gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgXG59XG4iLCJpbXBvcnQgeyBzZWxlY3RlZFRoaW5nLCBoaWdobGlnaHRlZFRoaW5nIH0gZnJvbSAnLi4vc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IHNlbGVjdGVkVmVyYiB9IGZyb20gJy4uL3N0YXRlL1NlbGVjdGVkVmVyYi5zaW5nbGV0b24nO1xuaW1wb3J0IHsgVGV4dFdpdGhTaGFkb3cgfSBmcm9tICcuL1RleHRXaXRoU2hhZG93JztcbmltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBsYWJlbCB9IGZyb20gJy4uL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuaW1wb3J0IHsgVmVyYnMsIFZlcmJzSW5mbyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5cbmV4cG9ydCBjbGFzcyBDdXJyZW50QWN0aW9uVUkge1xuXG4gICAgcHJpdmF0ZSB0ZXh0OiBUZXh0V2l0aFNoYWRvdztcbiAgICBwcml2YXRlIGN1cnJlbnRUZXh0OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVUZXh0KCk7XG4gICAgICAgIHNlbGVjdGVkVmVyYi5zdWJzY3JpYmVUb0NoYW5nZShuZXdWZXJiID0+IHRoaXMudXBkYXRlVGV4dCgpKTtcbiAgICAgICAgaGlnaGxpZ2h0ZWRUaGluZy5zdWJzY3JpYmVUb0NoYW5nZShuZXdUaGluZyA9PiB0aGlzLnVwZGF0ZVRleHQoKSk7XG4gICAgICAgIHNlbGVjdGVkVGhpbmcuc3Vic2NyaWJlVG9DaGFuZ2UobmV3VGhpbmcgPT4gdGhpcy51cGRhdGVUZXh0KCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlVGV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gbmV3IFRleHRXaXRoU2hhZG93KHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBsYXlvdXQuQ1VSUkVOVF9BQ1RJT05fUE9TSVRJT04sXG4gICAgICAgICAgICBsYXllcjogdWlMYXllcnMudmVyYkJ1dHRvbnMsXG4gICAgICAgICAgICBmaXhlZFRvQ2FtZXJhOiB0cnVlXG4gICAgICAgIH0pO1xufVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVUZXh0KCk6IHZvaWQge1xuICAgICAgICBsZXQgbmV3VGV4dCA9IHRoaXMuZ2V0VmVyYlRleHQoKSArIHRoaXMuZ2V0U2VsZWN0ZWRUaGluZ1RleHQoKSArICcgJyArIHRoaXMuZ2V0VGhpbmdUZXh0KCk7XG4gICAgICAgIHRoaXMuc2V0VGV4dChuZXdUZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFRleHQobmV3VGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUZXh0ICE9PSBuZXdUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0ID0gbmV3VGV4dDtcbiAgICAgICAgICAgIHRoaXMudGV4dC5zZXRUZXh0KG5ld1RleHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRWZXJiVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgdmVyYiA9IHNlbGVjdGVkVmVyYi52ZXJiO1xuICAgICAgICByZXR1cm4gbGFiZWwoVmVyYnNJbmZvLmdldCh2ZXJiKS5sYWJlbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaGluZ1RleHQoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHRoaW5nID0gaGlnaGxpZ2h0ZWRUaGluZy50aGluZztcbiAgICAgICAgbGV0IHRleHQgPSAnJztcbiAgICAgICAgaWYgKHRoaW5nICYmIHRoaW5nLm5hbWUpIHtcbiAgICAgICAgICAgIHRleHQgPSBsYWJlbCh0aGluZy5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNlbGVjdGVkVGhpbmdUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGxldCB2ZXJiID0gc2VsZWN0ZWRWZXJiLnZlcmI7XG4gICAgICAgIGxldCB2ZXJiSW5mbyA9IFZlcmJzSW5mby5nZXQodmVyYik7XG4gICAgICAgIGlmICghdmVyYkluZm8uc2luZ2xlT2JqZWN0ICYmIHNlbGVjdGVkVGhpbmcudGhpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiAnICcgKyBsYWJlbChzZWxlY3RlZFRoaW5nLnRoaW5nLm5hbWUpICsgJyAnICsgbGFiZWwodmVyYkluZm8uY29uanVjdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IFZlcmJzVUkgfSBmcm9tICcuL1ZlcmJzVUknO1xuaW1wb3J0IHsgQ3VycmVudEFjdGlvblVJIH0gZnJvbSAnLi9DdXJyZW50QWN0aW9uVUknO1xuaW1wb3J0IHsgSW52ZW50b3J5VUkgfSBmcm9tICcuL0ludmVudG9yeVVJJztcbmltcG9ydCB7IFJlZmxlY3RCdXR0b24gfSBmcm9tICcuL1JlZmxlY3RCdXR0b24nO1xuXG5leHBvcnQgY2xhc3MgR3JhcGhpY1VJIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNyZWF0ZUJhY2tncm91bmQoKTtcbiAgICAgICAgbmV3IFZlcmJzVUkoKTtcbiAgICAgICAgbmV3IEN1cnJlbnRBY3Rpb25VSSgpO1xuICAgICAgICBuZXcgSW52ZW50b3J5VUkoKTtcbiAgICAgICAgbmV3IFJlZmxlY3RCdXR0b24oKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJhY2tncm91bmQoKTogdm9pZCB7XG4gICAgICAgIGxldCBsYXlvdXRTdGFydFBvc2l0aW9uID0gbGF5b3V0LlVJX1NUQVJUX1BPU0lUSU9OO1xuICAgICAgICBsZXQgYmFja2dyb3VuZCA9IHVpTGF5ZXJzLmd1aUJhY2tncm91bmQuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICBsYXlvdXRTdGFydFBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgICAgIGxheW91dFN0YXJ0UG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICAgICAgJ1VJX0JHJyk7XG4gICAgICAgIGJhY2tncm91bmQuYW5jaG9yLnNldFRvKDAsIDApO1xuICAgICAgICBiYWNrZ3JvdW5kLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgICAgICBiYWNrZ3JvdW5kLmlucHV0RW5hYmxlZCA9IHRydWU7XG5cbiAgICB9XG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcblxuaW50ZXJmYWNlIElJbnZlbnRvcnlJdGVtVUlPcHRpb25zIHtcbiAgICB0aGluZzogVGhpbmcsXG4gICAgaW5kZXg6IG51bWJlclxufVxuXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5SXRlbVVJIHtcblxuICAgIHByaXZhdGUgc3ByaXRlOiBQaGFzZXIuU3ByaXRlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJSW52ZW50b3J5SXRlbVVJT3B0aW9ucykge1xuICAgICAgICB0aGlzLmNyZWF0ZVNwcml0ZSgpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3ByaXRlLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNwcml0ZSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gbGF5b3V0LmdldFBvc2l0aW9uRm9yVUlJbnZlbnRvcnlJdGVtKHRoaXMub3B0aW9ucy5pbmRleCk7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gdWlMYXllcnMudmVyYkJ1dHRvbnMuY3JlYXRlKFxuICAgICAgICAgICAgcG9zaXRpb24ueCxcbiAgICAgICAgICAgIHBvc2l0aW9uLnksXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMudGhpbmcuaW52ZW50b3J5SW1hZ2VcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnNwcml0ZS5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNwcml0ZS5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZSA9IHRoaXMub3B0aW9ucy50aGluZy5nZXRGcmFtZUZvckludmVudG9yeSgpO1xuXG4gICAgICAgIHRoaXMuc3ByaXRlLmV2ZW50cy5vbklucHV0RG93bi5hZGQodGhpcy5vbkNsaWNrLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCh0aGlzLm9uSW5wdXRPdmVyLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKHRoaXMub25JbnB1dE91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNsaWNrKHJlY2VwdG9yOiBQaGFzZXIuU3ByaXRlLCBwb2ludGVyOiBQaGFzZXIuUG9pbnRlcik6IHZvaWQge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5TRUxFQ1RfVEhJTkcsIHtcbiAgICAgICAgICAgIHRoaW5nOiB0aGlzLm9wdGlvbnMudGhpbmcsXG4gICAgICAgICAgICBzZWNvbmRhcnlBY3Rpb246ICEhcG9pbnRlci5yaWdodEJ1dHRvbi5pc0Rvd25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbklucHV0T3ZlcigpOiB2b2lkIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuQ1VSU09SX09WRVJfVEhJTkcsIHRoaXMub3B0aW9ucy50aGluZyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbklucHV0T3V0KCk6IHZvaWQge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5DVVJTT1JfT1VUX1RISU5HLCB0aGlzLm9wdGlvbnMudGhpbmcpO1xuICAgIH1cblxufSIsImltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi4vLi4vUGhhc2VyJztcbmltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuL1N0eWxlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIElDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzL09ic2VydmFibGUnO1xuXG5leHBvcnQgZW51bSBQYWdpbmF0aW9uQnV0dG9uVHlwZSB7XG4gICAgVVAgPSAxLFxuICAgIERPV05cbn07XG5cbmludGVyZmFjZSBJSW52ZW50b3J5UGFnaW5hdGlvbkJ1dHRvbk9wdGlvbnMge1xuICAgIHR5cGU6IFBhZ2luYXRpb25CdXR0b25UeXBlLFxuICAgIGxheWVyPzogUGhhc2VyLkdyb3VwXG59XG5cbmV4cG9ydCBjbGFzcyBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uIHtcblxuICAgIHByaXZhdGUgYnV0dG9uOiBQaGFzZXIuQnV0dG9uO1xuICAgIHByaXZhdGUgY2xpY2tPYnNlcnZhYmxlOiBPYnNlcnZhYmxlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJSW52ZW50b3J5UGFnaW5hdGlvbkJ1dHRvbk9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5jbGlja09ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLm9wdGlvbnMubGF5ZXIgPSB0aGlzLm9wdGlvbnMubGF5ZXIgfHwgdWlMYXllcnMudmVyYkJ1dHRvbnM7XG4gICAgICAgIHRoaXMuY3JlYXRlQnV0dG9uKCk7XG4gICAgfVxuXG4gICAgaGlkZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWxwaGEgPSAwO1xuICAgIH1cblxuICAgIHNob3coKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFscGhhID0gMTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NsaWNrKGNhbGxiYWNrOiBJQ2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5jbGlja09ic2VydmFibGUucmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGlja09ic2VydmFibGUucmVtb3ZlQWxsT2JzZXJ2ZXJzKCk7XG4gICAgICAgIHRoaXMuYnV0dG9uLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvbigpOiB2b2lkIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uOiBJUG9pbnQ7XG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy50eXBlID09PSBQYWdpbmF0aW9uQnV0dG9uVHlwZS5VUCkge1xuICAgICAgICAgICAgcG9zaXRpb24gPSBsYXlvdXQuZ2V0UGFnaW5hdGlvbkJ1dHRvblVwKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGxheW91dC5nZXRQYWdpbmF0aW9uQnV0dG9uRG93bigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnV0dG9uID0gcGhhc2VyR2FtZS52YWx1ZS5hZGQuYnV0dG9uKFxuICAgICAgICAgICAgcG9zaXRpb24ueCxcbiAgICAgICAgICAgIHBvc2l0aW9uLnksXG4gICAgICAgICAgICAnUEFHSU5BVElPTl9CVVRUT05fVVAnLFxuICAgICAgICAgICAgdGhpcy5vbkNsaWNrLFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMixcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLnR5cGUgPT09IFBhZ2luYXRpb25CdXR0b25UeXBlLkRPV04pIHtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNjYWxlLnkgPSAtMTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLmFuY2hvci5zZXRUbygwLCAxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMubGF5ZXIuYWRkKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgdGhpcy5idXR0b24uZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsaWNrT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnMobnVsbCk7XG4gICAgfVxufSIsImltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBJbnZlbnRvcnlJdGVtVUkgfSBmcm9tICcuL0ludmVudG9yeUl0ZW1VSSc7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi9zdGF0ZS9BY3RpdmVJbnZlbnRvcnkuc2luZ2xldG9uJztcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4uL21vZGVscy9JbnZlbnRvcnknO1xuaW1wb3J0IHsgUGFnaW5hdGlvbkJ1dHRvblR5cGUsIEludmVudG9yeVBhZ2luYXRpb25CdXR0b24gfSBmcm9tICcuL0ludmVudG9yeVBhZ2luYXRpb25CdXR0b24nO1xuXG5jb25zdCBJVEVNU19QRVJfUEFHRSA9IDY7XG5cbmV4cG9ydCBjbGFzcyBJbnZlbnRvcnlVSSB7XG5cbiAgICBwcml2YXRlIGN1cnJlbnRQYWdlOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBpdGVtczogU2V0PEludmVudG9yeUl0ZW1VST47XG4gICAgcHJpdmF0ZSBjdXJyZW50SW52ZW50b3J5OiBJbnZlbnRvcnk7XG4gICAgcHJpdmF0ZSBwYWdpbmF0aW9uQnV0dG9uVXA6IEludmVudG9yeVBhZ2luYXRpb25CdXR0b247XG4gICAgcHJpdmF0ZSBwYWdpbmF0aW9uQnV0dG9uRG93bjogSW52ZW50b3J5UGFnaW5hdGlvbkJ1dHRvbjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gMDtcbiAgICAgICAgdGhpcy5jcmVhdGVCYWNrZ3JvdW5kKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlUGFnaW5hdGlvbkJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBTZXQoKTtcblxuICAgICAgICBhY3RpdmVJbnZlbnRvcnkuc3Vic2NyaWJlVG9DaGFuZ2UoKG5ld0ludmVudG9yeSkgPT4gdGhpcy5pbnZlbnRvcnlDaGFuZ2VkKG5ld0ludmVudG9yeSkpXG4gICAgfVxuXG4gICAgLy8gcmVmcmVzaCgpIHtcbiAgICAvLyAgICAgdGhpcy5pbnZlbnRvcnlDaGFuZ2VkKGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKSk7XG4gICAgLy8gfVxuXG4gICAgcHJpdmF0ZSBpbnZlbnRvcnlDaGFuZ2VkKG5ld0ludmVudG9yeTogSW52ZW50b3J5KTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VycmVudEludmVudG9yeSA9IG5ld0ludmVudG9yeTtcbiAgICAgICAgdGhpcy5jcmVhdGVJdGVtcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQmFja2dyb3VuZCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGxheW91dFN0YXJ0UG9zaXRpb24gPSBsYXlvdXQuSU5WRU5UT1JZX1NUQVJUX1BPU0lUSU9OO1xuXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kID0gdWlMYXllcnMudmVyYkJ1dHRvbnMuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICBsYXlvdXRTdGFydFBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgICAgIGxheW91dFN0YXJ0UG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICAgICAgJ1VJX0lOVl9CRycpO1xuICAgICAgICBiYWNrZ3JvdW5kLmFuY2hvci5zZXRUbygwLCAwKTtcbiAgICAgICAgYmFja2dyb3VuZC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVBhZ2luYXRpb25CdXR0b25zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25VcCA9IG5ldyBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uKHt0eXBlOiBQYWdpbmF0aW9uQnV0dG9uVHlwZS5VUCB9KTtcbiAgICAgICAgdGhpcy5wYWdpbmF0aW9uQnV0dG9uRG93biA9IG5ldyBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uKHt0eXBlOiBQYWdpbmF0aW9uQnV0dG9uVHlwZS5ET1dOIH0pO1xuXG4gICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvblVwLnN1YnNjcmliZVRvQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nb1RvUHJldlBhZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wYWdpbmF0aW9uQnV0dG9uRG93bi5zdWJzY3JpYmVUb0NsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ29Ub05leHRQYWdlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlSXRlbXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveVByZXZJdGVtcygpO1xuICAgICAgICB0aGlzLm1ha2VTdXJlUGFnZUlzSW5zaWRlSW52KCk7XG5cbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgbGV0IGFycmF5T2ZUaGluZ3MgPSBBcnJheS5mcm9tKHRoaXMuY3VycmVudEludmVudG9yeS5pdGVtcyk7XG4gICAgICAgIGxldCBmaXJzdFBhZ2VFbGVtZW50ID0gSVRFTVNfUEVSX1BBR0UgKiB0aGlzLmN1cnJlbnRQYWdlO1xuICAgICAgICBsZXQgbmV4dFBhZ2VGaXJzdEVsZW1lbnQgPSBJVEVNU19QRVJfUEFHRSAqICh0aGlzLmN1cnJlbnRQYWdlICsgMSk7XG4gICAgICAgIGZvcihsZXQgaSA9IGZpcnN0UGFnZUVsZW1lbnQ7IChpIDwgbmV4dFBhZ2VGaXJzdEVsZW1lbnQpICYmIChpIDwgYXJyYXlPZlRoaW5ncy5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuYWRkKFxuICAgICAgICAgICAgICAgIG5ldyBJbnZlbnRvcnlJdGVtVUkoe1xuICAgICAgICAgICAgICAgICAgICB0aGluZzogYXJyYXlPZlRoaW5nc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93T3JIaWRlTmF2QnV0dG9ucygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvd09ySGlkZU5hdkJ1dHRvbnMoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMuY2FuR29Ub1ByZXZQYWdlKCkpIHtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvblVwLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvblVwLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuY2FuR29Ub05leHRQYWdlKCkpIHtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvbkRvd24uc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uQnV0dG9uRG93bi5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lQcmV2SXRlbXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IGl0ZW0uZGVzdHJveSgpKTtcbiAgICAgICAgdGhpcy5pdGVtcy5jbGVhcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ29Ub05leHRQYWdlKCk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLmNhbkdvVG9OZXh0UGFnZSgpKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlKys7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUl0ZW1zKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbkdvVG9QcmV2UGFnZSgpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2UgPiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FuR29Ub05leHRQYWdlKCk6IEJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50SW52ZW50b3J5Lml0ZW1zLnNpemUgPiAoSVRFTVNfUEVSX1BBR0UgKiAodGhpcy5jdXJyZW50UGFnZSArIDEpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1ha2VTdXJlUGFnZUlzSW5zaWRlSW52KCk6IHZvaWQge1xuICAgICAgICBsZXQgZmlyc3RQYWdlRWxlbWVudCA9IElURU1TX1BFUl9QQUdFICogdGhpcy5jdXJyZW50UGFnZTtcbiAgICAgICAgaWYoZmlyc3RQYWdlRWxlbWVudCA+PSB0aGlzLmN1cnJlbnRJbnZlbnRvcnkuaXRlbXMuc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdvVG9QcmV2UGFnZSgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5jYW5Hb1RvUHJldlBhZ2UoKSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZS0tO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVJdGVtcygpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuXG5jb25zdCBWRVJCX0JVVFRPTl9IRUlHSFQ6IG51bWJlciA9IDM2O1xuY29uc3QgQ1VSUkVOVF9BQ1RJT05fSU5GT19IRUlHSFQgPSA0MDtcbmNvbnN0IFZFUkJfQlVUVE9OX1dJRFRIID0gMTUwO1xuY29uc3QgUkVGTEVDVF9CVVRUT05fV0lEVEggPSBWRVJCX0JVVFRPTl9XSURUSDtcblxuY29uc3QgQ1VSUkVOVF9BQ1RJT05fSU5GT19QQURESU5HX1ggPSA1O1xuY29uc3QgQ1VSUkVOVF9BQ1RJT05fSU5GT19QQURESU5HX1kgPSA3O1xuXG5jb25zdCBWRVJCU19ST1dTID0gMztcbmNvbnN0IFZFUkJfQ09MVU1OUyA9IDM7XG5cbmNvbnN0IElOVl9ST1dTID0gMjtcbmNvbnN0IElOVl9DT0xVTU5TID0gMztcbmNvbnN0IElOVl9JVEVNX1dJRFRIID0gMTM2O1xuY29uc3QgSU5WX0lURU1fSEVJR0hUID0gNTI7XG5cbmNvbnN0IENPTlZFUlNBVElPTl9MSU5FX0hFSUdIVCA9IENVUlJFTlRfQUNUSU9OX0lORk9fSEVJR0hUO1xuY29uc3QgQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19YID0gNTtcbmNvbnN0IENPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWSA9IDY7XG5cbmNvbnN0IExPR09fU0laRTogSVBvaW50ID0ge1xuICAgIHg6IDUwMixcbiAgICB5OiAxNzVcbn07XG5jb25zdCBUSEVfR0FNRV9TSVpFOiBJUG9pbnQgPSB7XG4gICAgeDogMTUwLFxuICAgIHk6IDQzXG59O1xuY29uc3QgTEFOR1VBR0VfQlVUVE9OX1NJWkU6IElQb2ludCA9IHtcbiAgICB4OiAxMzYsXG4gICAgeTogMjdcbn07XG5cbmNsYXNzIExheW91dE1hbmFnZXIge1xuXG4gICAgTEFZT1VUX1dJRFRIOiBudW1iZXIgPSAxMDY2O1xuICAgIExBWU9VVF9IRUlHSFQ6IG51bWJlciA9IDYwMDtcbiAgICBMQVlPVVRfWk9PTTogbnVtYmVyID0gMjtcbiAgICBcbiAgICBMQVlPVVRfREVGQVVMVF9NQVJHSU46IG51bWJlciA9IDE7XG4gICAgVkVSQl9CVVRUT05fTUFSR0lOOiBudW1iZXIgPSB0aGlzLkxBWU9VVF9ERUZBVUxUX01BUkdJTjtcblxuICAgIGdldCBXSURUSCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5MQVlPVVRfV0lEVEggLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBIRUlHSFQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuTEFZT1VUX0hFSUdIVCAvIHRoaXMuTEFZT1VUX1pPT007XG4gICAgfVxuXG4gICAgZ2V0IFZFUkJTX0hFSUdIVCgpOiBudW1iZXIge1xuICAgICAgICBsZXQgbWFyZ2luWSA9IChWRVJCU19ST1dTICsgMSkgKiB0aGlzLlZFUkJfQlVUVE9OX01BUkdJTjtcbiAgICAgICAgbGV0IGhlaWdodFkgPSBWRVJCU19ST1dTICogdGhpcy5WRVJCX0JVVFRPTl9IRUlHSFQ7XG4gICAgICAgIHJldHVybiBtYXJnaW5ZICsgaGVpZ2h0WTtcbiAgICB9XG5cbiAgICBnZXQgVkVSQl9CVVRUT05fSEVJR0hUKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBWRVJCX0JVVFRPTl9IRUlHSFQgLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBWRVJCU19ZX1NUQVJUKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkhFSUdIVCAtIHRoaXMuVkVSQlNfSEVJR0hUO1xuICAgIH1cblxuICAgIGdldCBDVVJSRU5UX0FDVElPTl9JTkZPX0hFSUdIVCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQ1VSUkVOVF9BQ1RJT05fSU5GT19IRUlHSFQgLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBVSV9TVEFSVF9QT1NJVElPTigpOiBJUG9pbnQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IHRoaXMuVkVSQlNfWV9TVEFSVCAtIHRoaXMuQ1VSUkVOVF9BQ1RJT05fSU5GT19IRUlHSFRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXQgVkVSQl9CVVRUT05fV0lEVEgoKSB7XG4gICAgICAgIHJldHVybiBWRVJCX0JVVFRPTl9XSURUSCAvIHRoaXMuTEFZT1VUX1pPT007XG4gICAgfVxuXG4gICAgZ2V0IFJFRkxFQ1RfQlVUVE9OX1dJRFRIKCkge1xuICAgICAgICByZXR1cm4gUkVGTEVDVF9CVVRUT05fV0lEVEggLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBDVVJSRU5UX0FDVElPTl9QT1NJVElPTigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IENVUlJFTlRfQUNUSU9OX0lORk9fUEFERElOR19YLFxuICAgICAgICAgICAgeTogdGhpcy5IRUlHSFQgLSB0aGlzLlZFUkJTX0hFSUdIVCAtIHRoaXMuQ1VSUkVOVF9BQ1RJT05fSU5GT19IRUlHSFQgKyBDVVJSRU5UX0FDVElPTl9JTkZPX1BBRERJTkdfWVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldCBJTlZFTlRPUllfU1RBUlRfUE9TSVRJT04oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFZlcmJCdXR0b25Qb3NpdGlvbih7XG4gICAgICAgICAgICB4OiBWRVJCX0NPTFVNTlMsXG4gICAgICAgICAgICB5OiAwXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBJTlZfSVRFTV9XSURUSCgpIHtcbiAgICAgICAgcmV0dXJuIElOVl9JVEVNX1dJRFRIIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgSU5WX0lURU1fSEVJR0hUKCkge1xuICAgICAgICByZXR1cm4gSU5WX0lURU1fSEVJR0hUIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXRWZXJiQnV0dG9uUG9zaXRpb24odmVyYkdyaWRQb3NpdGlvbjogSVBvaW50KTogSVBvaW50IHtcbiAgICAgICAgbGV0IG1hcmdpblggPSAodmVyYkdyaWRQb3NpdGlvbi54ICsgMikgKiB0aGlzLlZFUkJfQlVUVE9OX01BUkdJTjtcbiAgICAgICAgbGV0IHBvc2l0aW9uWCA9IHRoaXMuUkVGTEVDVF9CVVRUT05fV0lEVEggKyAodmVyYkdyaWRQb3NpdGlvbi54ICogdGhpcy5WRVJCX0JVVFRPTl9XSURUSCk7XG5cbiAgICAgICAgbGV0IG1hcmdpblkgPSAodmVyYkdyaWRQb3NpdGlvbi55ICsgMSkgKiB0aGlzLlZFUkJfQlVUVE9OX01BUkdJTjtcbiAgICAgICAgbGV0IHBvc2l0aW9uWSA9IHZlcmJHcmlkUG9zaXRpb24ueSAqIHRoaXMuVkVSQl9CVVRUT05fSEVJR0hUO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBtYXJnaW5YICsgcG9zaXRpb25YLFxuICAgICAgICAgICAgeTogdGhpcy5WRVJCU19ZX1NUQVJUICsgbWFyZ2luWSArIHBvc2l0aW9uWVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9uRm9yVUlJbnZlbnRvcnlJdGVtKGluZGV4OiBudW1iZXIpOiBJUG9pbnQge1xuICAgICAgICBsZXQge2NvbHVtbiwgcm93fSA9IHRoaXMuZ2V0SW52ZW50b3J5SXRlbVBvc2l0aW9uKGluZGV4KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnZlbnRvcnlQb3NpdGlvbkZyb21Sb3dBbmRDb2x1bW4ocm93LCBjb2x1bW4pO1xuICAgIH1cblxuICAgIGdldFJlZmxlY3RCdXR0b25Qb3NpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMuTEFZT1VUX0RFRkFVTFRfTUFSR0lOLFxuICAgICAgICAgICAgeTogdGhpcy5WRVJCU19ZX1NUQVJUICsgdGhpcy5MQVlPVVRfREVGQVVMVF9NQVJHSU5cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRSZWZsZWN0QnV0dG9uU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5WRVJCU19IRUlHSFQsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5SRUZMRUNUX0JVVFRPTl9XSURUSFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldCBDT05WRVJTQVRJT05fTElORV9IRUlHSFQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIENPTlZFUlNBVElPTl9MSU5FX0hFSUdIVCAvIHRoaXMuTEFZT1VUX1pPT007XG4gICAgfVxuXG4gICAgZ2V0IENPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19YO1xuICAgIH1cblxuICAgIGdldCBDT05WRVJTQVRJT05fTElORV9QQURESU5HX1koKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIENPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWTtcbiAgICB9XG5cbiAgICBnZXQgTE9HT19QT1NJVElPTigpOiBJUG9pbnQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogTWF0aC5yb3VuZCgodGhpcy5XSURUSCAtIExPR09fU0laRS54KS8yKSxcbiAgICAgICAgICAgIHk6IDIwXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IFRIRV9HQU1FX1BPU0lUSU9OKCk6IElQb2ludCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBNYXRoLnJvdW5kKCh0aGlzLldJRFRIIC0gVEhFX0dBTUVfU0laRS54KS8yKSxcbiAgICAgICAgICAgIHk6IDE1NVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldCBFTkdMSVNIX0JVVFRPTl9QT1NJVElPTigpOiBJUG9pbnQge1xuICAgICAgICBsZXQgeCA9IE1hdGgucm91bmQodGhpcy5XSURUSC8yKSAtIExBTkdVQUdFX0JVVFRPTl9TSVpFLnggLSA1O1xuICAgICAgICBsZXQgeSA9IHRoaXMuSEVJR0hUIC0gTEFOR1VBR0VfQlVUVE9OX1NJWkUueSAtIDMwO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXQgU1BBTklTSF9CVVRUT05fUE9TSVRJT04oKTogSVBvaW50IHtcbiAgICAgICAgbGV0IHggPSBNYXRoLnJvdW5kKHRoaXMuV0lEVEgvMikgKyA1O1xuICAgICAgICBsZXQgeSA9IHRoaXMuSEVJR0hUIC0gTEFOR1VBR0VfQlVUVE9OX1NJWkUueSAtIDMwO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvbkZvckNvbnZlcnNhdGlvbkxpbmUoaW5kZXg6IG51bWJlcik6IElQb2ludCB7XG4gICAgICAgIGxldCBtYXJnaW5ZID0gOCArICgoaW5kZXggKyAxKSAqIHRoaXMuTEFZT1VUX0RFRkFVTFRfTUFSR0lOKTtcbiAgICAgICAgbGV0IHBvc2l0aW9uWSA9IHRoaXMuQ09OVkVSU0FUSU9OX0xJTkVfSEVJR0hUICogaW5kZXg7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLkxBWU9VVF9ERUZBVUxUX01BUkdJTixcbiAgICAgICAgICAgIHk6IHRoaXMuVUlfU1RBUlRfUE9TSVRJT04ueSArIG1hcmdpblkgKyBwb3NpdGlvbllcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRQYWdpbmF0aW9uQnV0dG9uVXAoKTogSVBvaW50IHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IElOVl9DT0xVTU5TO1xuICAgICAgICBsZXQgcm93ID0gMDtcblxuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnZlbnRvcnlQb3NpdGlvbkZyb21Sb3dBbmRDb2x1bW4ocm93LCBjb2x1bW4pO1xuICAgIH1cblxuICAgIGdldFBhZ2luYXRpb25CdXR0b25Eb3duKCk6IElQb2ludCB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBJTlZfQ09MVU1OUztcbiAgICAgICAgbGV0IHJvdyA9IDE7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW52ZW50b3J5UG9zaXRpb25Gcm9tUm93QW5kQ29sdW1uKHJvdywgY29sdW1uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEludmVudG9yeVBvc2l0aW9uRnJvbVJvd0FuZENvbHVtbihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpOiBJUG9pbnQge1xuICAgICAgICBsZXQgaW5pdGlhbFBvc2l0aW9uID0gdGhpcy5JTlZFTlRPUllfU1RBUlRfUE9TSVRJT047XG5cbiAgICAgICAgbGV0IG1hcmdpblggPSAoY29sdW1uICsgMSkgKiB0aGlzLlZFUkJfQlVUVE9OX01BUkdJTjtcbiAgICAgICAgbGV0IHBvc2l0aW9uWCA9IGNvbHVtbiAqIHRoaXMuSU5WX0lURU1fV0lEVEg7XG5cbiAgICAgICAgbGV0IG1hcmdpblkgPSAocm93ICsgMSkgKiB0aGlzLlZFUkJfQlVUVE9OX01BUkdJTjtcbiAgICAgICAgbGV0IHBvc2l0aW9uWSA9IHJvdyAqIHRoaXMuSU5WX0lURU1fSEVJR0hUO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBtYXJnaW5YICsgcG9zaXRpb25YICsgaW5pdGlhbFBvc2l0aW9uLngsXG4gICAgICAgICAgICB5OiBtYXJnaW5ZICsgcG9zaXRpb25ZICsgaW5pdGlhbFBvc2l0aW9uLnlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEludmVudG9yeUl0ZW1Qb3NpdGlvbihpbmRleDogbnVtYmVyKToge2NvbHVtbjogbnVtYmVyLCByb3c6IG51bWJlcn0ge1xuICAgICAgICBsZXQgY29sdW1uID0gaW5kZXggJSBJTlZfQ09MVU1OUztcbiAgICAgICAgbGV0IHJvdyA9IE1hdGguZmxvb3IoaW5kZXggLyBJTlZfQ09MVU1OUyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2x1bW46IGNvbHVtbixcbiAgICAgICAgICAgIHJvdzogcm93XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgbGF5b3V0ID0gbmV3IExheW91dE1hbmFnZXIoKTsiLCJpbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgbGFiZWwgfSBmcm9tICcuLi9zdG9yZXMvTGFiZWxzLnN0b3JlJztcbmltcG9ydCB7IFRleHRXaXRoU2hhZG93IH0gZnJvbSAnLi9UZXh0V2l0aFNoYWRvdyc7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5cbmV4cG9ydCBjbGFzcyBSZWZsZWN0QnV0dG9uIHtcbiAgICBwcml2YXRlIHBvc2l0aW9uOiBJUG9pbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IGxheW91dC5nZXRSZWZsZWN0QnV0dG9uUG9zaXRpb24oKTtcblxuICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvbigpO1xuICAgICAgICB0aGlzLmNyZWF0ZVRleHQoKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQnV0dG9uKCk6IHZvaWQge1xuICAgICAgICBsZXQgYnV0dG9uID0gcGhhc2VyR2FtZS52YWx1ZS5hZGQuYnV0dG9uKFxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54LFxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55LFxuICAgICAgICAgICAgJ1JFRkxFQ1RfQlVUVE9OX0JHJyxcbiAgICAgICAgICAgIHRoaXMub25DbGljayxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIHVpTGF5ZXJzLnZlcmJCdXR0b25zLmFkZChidXR0b24pO1xuICAgICAgICBidXR0b24uZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVUZXh0KCk6IHZvaWQge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvc2l0aW9uLnggKyBsYXlvdXQuZ2V0UmVmbGVjdEJ1dHRvblNpemUoKS53aWR0aCAvIDIsXG4gICAgICAgICAgICB5OiB0aGlzLnBvc2l0aW9uLnkgKyBsYXlvdXQuZ2V0UmVmbGVjdEJ1dHRvblNpemUoKS5oZWlnaHQgLyAyXG4gICAgICAgIH07XG4gICAgICAgIG5ldyBUZXh0V2l0aFNoYWRvdyh7XG4gICAgICAgICAgICBpbml0aWFsVGV4dDogbGFiZWwoJ1JlZmxlY3QnKSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgIGZpeGVkVG9DYW1lcmE6IHRydWUsXG4gICAgICAgICAgICBsYXllcjogdWlMYXllcnMudmVyYkJ1dHRvbnMsXG4gICAgICAgICAgICBhbmNob3I6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjUsXG4gICAgICAgICAgICAgICAgeTogMC41XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25DbGljaygpOiB2b2lkIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuUkVGTEVDVCk7XG4gICAgfVxufSIsImltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgVGV4dEluU2NlbmUgfSBmcm9tICcuL1RleHRJblNjZW5lJztcbmltcG9ydCB7IGxhYmVsIH0gZnJvbSAnLi4vc3RvcmVzL0xhYmVscy5zdG9yZSc7XG5cbmludGVyZmFjZSBJU3BlZWNoQnViYmxlT3B0aW9ucyB7XG4gICAgb3duZXI6IFBsYXllciB8IFRoaW5nLFxuICAgIGZvcmVncm91bmRUZXh0U3R5bGU/OiBzdHJpbmcsXG4gICAgc2hhZG93VGV4dFN0eWxlPzogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBTcGVlY2hCdWJibGUge1xuXG4gICAgcHJpdmF0ZSB0ZXh0QmVpbmdTYWlkOiBUZXh0SW5TY2VuZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogSVNwZWVjaEJ1YmJsZU9wdGlvbnMpIHt9XG5cbiAgICBzYXkodGV4dDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMuZGVzdHJveVByZXZUZXh0KCk7XG4gICAgICAgIHRoaXMudGV4dEJlaW5nU2FpZCA9IG5ldyBUZXh0SW5TY2VuZSh7XG4gICAgICAgICAgICB0ZXh0OiBsYWJlbCh0ZXh0KSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLm9wdGlvbnMub3duZXIuZ2V0UG9zaXRpb25PblRvcCgpLFxuICAgICAgICAgICAgYXV0b0Rlc3Ryb3k6IHRydWUsXG4gICAgICAgICAgICBmb3JlZ3JvdW5kVGV4dFN0eWxlOiB0aGlzLm9wdGlvbnMuZm9yZWdyb3VuZFRleHRTdHlsZSxcbiAgICAgICAgICAgIHNoYWRvd1RleHRTdHlsZTogdGhpcy5vcHRpb25zLnNoYWRvd1RleHRTdHlsZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dEJlaW5nU2FpZC5wcm9taXNlO1xuICAgIH1cblxuICAgIGlzU2hvd24oKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMudGV4dEJlaW5nU2FpZDtcbiAgICB9XG5cbiAgICB1cGRhdGVQb3NpdGlvbigpOiB2b2lkIHtcbiAgICAgICAgaWYoIXRoaXMuaXNTaG93bigpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ZXh0QmVpbmdTYWlkLnNldFBvc2l0aW9uKHRoaXMub3B0aW9ucy5vd25lci5nZXRQb3NpdGlvbk9uVG9wKCkpO1xuICAgIH1cblxuICAgIHNldEZvcmVncm91bmRUZXh0U3R5bGUobmV3U3R5bGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZm9yZWdyb3VuZFRleHRTdHlsZSA9IG5ld1N0eWxlO1xuICAgIH1cblxuICAgIHNldFNoYWRvd1RleHRTdHlsZShuZXdTdHlsZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zaGFkb3dUZXh0U3R5bGUgPSBuZXdTdHlsZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lQcmV2VGV4dCgpOnZvaWQge1xuICAgICAgICBpZiAodGhpcy50ZXh0QmVpbmdTYWlkKSB7XG4gICAgICAgICAgICB0aGlzLnRleHRCZWluZ1NhaWQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy50ZXh0QmVpbmdTYWlkID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBjb25zdCBzdHlsZSA9IE9iamVjdC5mcmVlemUoe1xuICAgIERFRkFVTFRfRk9OVF9TSVpFOiA4LFxuICAgIEZPTlRfU0hBRE9XX1g6IDEsXG4gICAgRk9OVF9TSEFET1dfWTogMSxcbiAgICBDQU1FUkFfRUFTSU5HX0ZBQ1RPUjogMC4wMjUsXG4gICAgREVGQVVMVF9BTklNQVRJT05fU1BFRUQ6IDZcbn0pO1xuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL215LXR5cGluZ3MvbGliLmVzNi5kLnRzXCIgLz5cbmltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuL1N0eWxlJztcbmltcG9ydCB7IFRleHRXaXRoU2hhZG93IH0gZnJvbSAnLi9UZXh0V2l0aFNoYWRvdyc7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IHNjZW5lcyB9IGZyb20gJy4uL3N0YXRlL1NjZW5lcy5zaW5nbGV0b24nO1xuXG5pbnRlcmZhY2UgSVRleHRJblNjZW5lT3B0aW9ucyB7XG4gICAgdGV4dDogc3RyaW5nLFxuICAgIHBvc2l0aW9uOiBJUG9pbnQsXG4gICAgd29yZHNQZXJNaW51dGU/OiBudW1iZXIsXG4gICAgbWluRGVzdHJveVRpbWU/OiBudW1iZXIsXG4gICAgd2lkdGg/OiBudW1iZXIsXG4gICAgYXV0b0Rlc3Ryb3k/OiBCb29sZWFuLFxuICAgIGFuY2hvcj86IElQb2ludCxcbiAgICBwYWRkaW5nSW5TY3JlZW4/OiBudW1iZXIsXG4gICAgZm9yZWdyb3VuZFRleHRTdHlsZT86IHN0cmluZyxcbiAgICBzaGFkb3dUZXh0U3R5bGU/OiBzdHJpbmdcbn1cblxuY29uc3QgREVGQVVMVF9URVhUX09QVElPTlMgPSBPYmplY3QuZnJlZXplKHtcbiAgICB3b3Jkc1Blck1pbnV0ZTogMTIwLFxuICAgIG1pbkRlc3Ryb3lUaW1lOiAyMDAwLFxuICAgIHRleHQ6ICcnLFxuICAgIHBvc2l0aW9uOiB7IHg6IDEwMCwgeTogMTAwfSxcbiAgICB3aWR0aDogMzAsXG4gICAgYXV0b0Rlc3Ryb3k6IGZhbHNlLFxuICAgIGFuY2hvcjogeyB4OiAwLCB5OiAwfSxcbiAgICBwYWRkaW5nSW5TY3JlZW46IDVcbn0pO1xuXG5leHBvcnQgY2xhc3MgVGV4dEluU2NlbmUge1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50VGV4dDogVGV4dFdpdGhTaGFkb3c7XG4gICAgcHJpdmF0ZSBwcm9taXNlVG9EZXN0cm95OiBQcm9taXNlPGFueT47XG4gICAgcHJpdmF0ZSByZXNvbHZlQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XG4gICAgcHJpdmF0ZSB0aW1lb3V0VG9EZXN0cm95OiBudW1iZXI7XG4gICAgcHJpdmF0ZSB0ZXh0SW5MaW5lczogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9zaXRpb246IElQb2ludDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogSVRleHRJblNjZW5lT3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1RFWFRfT1BUSU9OUywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucy5wb3NpdGlvbik7XG4gICAgICAgIHRoaXMuY3JlYXRlVGV4dCgpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9EZXN0cm95KSB7XG4gICAgICAgICAgICB0aGlzLnByb21pc2VUb0Rlc3Ryb3kgPSB0aGlzLmF1dG9EZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgcHJvbWlzZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZVRvRGVzdHJveTtcbiAgICB9XG5cbiAgICBzZXRQb3NpdGlvbihuZXdQb3NpdGlvbjogSVBvaW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VGV4dCkge1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dC5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRleHQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlc29sdmVDYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZUNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UG9zaXRpb24oKTogSVBvaW50IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMuZ2V0WFBvc2l0aW9uRm9yVGV4dCh0aGlzLnRleHRJbkxpbmVzKSxcbiAgICAgICAgICAgIHk6IHRoaXMuZ2V0WVBvc2l0aW9uRm9yVGV4dCh0aGlzLnRleHRJbkxpbmVzKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVUZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRleHRJbkxpbmVzID0gdGhpcy5hZGRMaW5lc1NlcGFyYXRvcnModGhpcy5vcHRpb25zLnRleHQsIHRoaXMub3B0aW9ucy53aWR0aCk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VGV4dCA9IG5ldyBUZXh0V2l0aFNoYWRvdyh7XG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5nZXRQb3NpdGlvbigpLFxuICAgICAgICAgICAgbGF5ZXI6IHVpTGF5ZXJzLnRleHRJblNjZW5lLFxuICAgICAgICAgICAgaW5pdGlhbFRleHQ6IHRoaXMudGV4dEluTGluZXMsXG4gICAgICAgICAgICBhbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICBhbmNob3I6IHRoaXMub3B0aW9ucy5hbmNob3IsXG4gICAgICAgICAgICBmb3JlZ3JvdW5kVGV4dFN0eWxlOiB0aGlzLm9wdGlvbnMuZm9yZWdyb3VuZFRleHRTdHlsZSxcbiAgICAgICAgICAgIHNoYWRvd1RleHRTdHlsZTogdGhpcy5vcHRpb25zLnNoYWRvd1RleHRTdHlsZVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgYWRkTGluZXNTZXBhcmF0b3JzKHRleHQ6IHN0cmluZywgbWF4TGluZUxlbmd0aDogbnVtYmVyKTogc3RyaW5nIHtcblxuICAgICAgICBsZXQgd29yZHMgPSB0ZXh0LnNwbGl0KCcgJyk7XG4gICAgICAgIGxldCBsaW5lcyA9IFsnJ107XG4gICAgICAgIGxldCBjdXJyZW50TGluZSA9IDA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy9JZiBhIHdvcmQgaXMgdG9vIGJpZyBmb3IgdGhpcyBsaW5lLCBhZGQgdG8gbmV4dFxuICAgICAgICAgICAgaWYgKChsaW5lc1tjdXJyZW50TGluZV0ubGVuZ3RoICsgd29yZHNbaV0ubGVuZ3RoKSA+PSBtYXhMaW5lTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbGluZXMucHVzaCgnJyArIHdvcmRzW2ldKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSArKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGluZXNbY3VycmVudExpbmVdICs9ICcgJyArIHdvcmRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFhQb3NpdGlvbkZvclRleHQodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGxvbmdlc3RMaW5lTGVuZ3RoID0gdGhpcy5nZXRMb25nZXN0TGluZUxlbmd0aCh0ZXh0KTtcbiAgICAgICAgbGV0IG1heFdpZHRoID0gbG9uZ2VzdExpbmVMZW5ndGggKiBzdHlsZS5ERUZBVUxUX0ZPTlRfU0laRTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMucG9zaXRpb24ueCAtIChtYXhXaWR0aCAvIDIpO1xuXG4gICAgICAgIHJlc3VsdCA9IE1hdGgubWF4KHJlc3VsdCwgdGhpcy5vcHRpb25zLnBhZGRpbmdJblNjcmVlbik7XG4gICAgICAgIHJlc3VsdCA9IE1hdGgubWluKHJlc3VsdCwgdGhpcy5nZXRNYXhYRm9yVGV4dChtYXhXaWR0aCkpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRNYXhYRm9yVGV4dCh0ZXh0V2lkdGg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGxldCBzY2VuZVdpZHRoID0gc2NlbmVzLmN1cnJlbnRTY2VuZS5zY2VuZUJvdW5kcy53aWR0aDtcbiAgICAgICAgcmV0dXJuIHNjZW5lV2lkdGggLSB0aGlzLm9wdGlvbnMucGFkZGluZ0luU2NyZWVuIC0gdGV4dFdpZHRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0WVBvc2l0aW9uRm9yVGV4dCh0ZXh0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBsZXQgbGluZXMgPSB0ZXh0LnNwbGl0KCdcXG4nKS5sZW5ndGg7XG4gICAgICAgIGxldCB0b3RhbEhlaWdodCA9IGxpbmVzICogc3R5bGUuREVGQVVMVF9GT05UX1NJWkU7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLnkgLSB0b3RhbEhlaWdodDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldExvbmdlc3RMaW5lTGVuZ3RoKHRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGxldCBsaW5lcyA9IHRleHQuc3BsaXQoJ1xcbicpO1xuICAgICAgICBsZXQgbWF4TGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbWF4TGVuZ3RoID0gTWF0aC5tYXgobWF4TGVuZ3RoLCBsaW5lc1tpXS5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXhMZW5ndGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXRvRGVzdHJveSgpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgZGVmZXJyZWQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZUNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVDYWxsYmFjayA9IHJlc29sdmVDYWxsYmFjaztcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aW1lVG9EZXN0cm95ID0gdGhpcy5nZXRUaW1lVG9EZXN0cm95RnJvbVRleHQodGhpcy5vcHRpb25zLnRleHQpO1xuICAgICAgICB0aGlzLnRpbWVvdXRUb0Rlc3Ryb3kgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZGVzdHJveSgpLCB0aW1lVG9EZXN0cm95KTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGltZVRvRGVzdHJveUZyb21UZXh0KHRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGxldCB3b3Jkc0luVGV4dCA9IHRleHQuc3BsaXQoJyAnKS5sZW5ndGg7XG4gICAgICAgIGxldCB0aW1lVG9EZXN0cm95ID0gKDEwMDAgKiB3b3Jkc0luVGV4dCAqIDYwKSAvIHRoaXMub3B0aW9ucy53b3Jkc1Blck1pbnV0ZTtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRoaXMub3B0aW9ucy5taW5EZXN0cm95VGltZSwgdGltZVRvRGVzdHJveSk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBzdHlsZSB9IGZyb20gJy4vU3R5bGUnO1xuXG5pbnRlcmZhY2UgSVRleHRXaXRoU2hhZG93T3B0aW9ucyB7XG4gICAgcG9zaXRpb246IElQb2ludCxcbiAgICBsYXllcjogUGhhc2VyLkdyb3VwLFxuICAgIGluaXRpYWxUZXh0Pzogc3RyaW5nLFxuICAgIGZpeGVkVG9DYW1lcmE/OiBCb29sZWFuLFxuICAgIGFuY2hvcj86IElQb2ludCxcbiAgICBhbGlnbj86IHN0cmluZyxcbiAgICBmb3JlZ3JvdW5kVGV4dFN0eWxlPzogc3RyaW5nLFxuICAgIHNoYWRvd1RleHRTdHlsZT86IHN0cmluZ1xufVxuXG5jb25zdCBERUZBVUxUX0ZPUkVHUk9VTkRfVEVYVCA9ICdGT05UXzMyX1dISVRFJztcbmNvbnN0IERFRkFVTFRfU0hBRE9XX1RFWFQgPSAnRk9OVF8zMl9CTEFDSyc7XG5cblxuZXhwb3J0IGNsYXNzIFRleHRXaXRoU2hhZG93IHtcbiAgICBwcml2YXRlIHNoYWRvd1RleHQ6IFBoYXNlci5CaXRtYXBUZXh0O1xuICAgIHByaXZhdGUgdGV4dDogUGhhc2VyLkJpdG1hcFRleHQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9wdGlvbnM6IElUZXh0V2l0aFNoYWRvd09wdGlvbnMpIHtcbiAgICAgICAgbGV0IGFuY2hvcjogSVBvaW50ID0gdGhpcy5vcHRpb25zLmFuY2hvciB8fCB7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogMFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNoYWRvd1RleHQgPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC5iaXRtYXBUZXh0KFxuICAgICAgICAgICAgMSArIG9wdGlvbnMucG9zaXRpb24ueCxcbiAgICAgICAgICAgIDEgKyBvcHRpb25zLnBvc2l0aW9uLnksXG4gICAgICAgICAgICB0aGlzLnNoYWRvd1RleHRTdHlsZSxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5pbml0aWFsVGV4dCB8fCAnJyxcbiAgICAgICAgICAgIHN0eWxlLkRFRkFVTFRfRk9OVF9TSVpFXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc2hhZG93VGV4dC5hbmNob3Iuc2V0VG8oYW5jaG9yLngsIGFuY2hvci55KTtcbiAgICAgICAgdGhpcy5zaGFkb3dUZXh0LmZpeGVkVG9DYW1lcmEgPSAhIXRoaXMub3B0aW9ucy5maXhlZFRvQ2FtZXJhO1xuXG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5hbGlnbikge1xuICAgICAgICAgICAgdGhpcy5zaGFkb3dUZXh0LmFsaWduID0gdGhpcy5vcHRpb25zLmFsaWduO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmxheWVyLmFkZCh0aGlzLnNoYWRvd1RleHQpO1xuXG4gICAgICAgIHRoaXMudGV4dCA9IHBoYXNlckdhbWUudmFsdWUuYWRkLmJpdG1hcFRleHQoXG4gICAgICAgICAgICBvcHRpb25zLnBvc2l0aW9uLngsXG4gICAgICAgICAgICBvcHRpb25zLnBvc2l0aW9uLnksXG4gICAgICAgICAgICB0aGlzLmZvcmVncm91bmRUZXh0U3R5bGUsXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuaW5pdGlhbFRleHQgfHwgJycsXG4gICAgICAgICAgICBzdHlsZS5ERUZBVUxUX0ZPTlRfU0laRVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnRleHQuYW5jaG9yLnNldFRvKGFuY2hvci54LCBhbmNob3IueSk7XG4gICAgICAgIHRoaXMudGV4dC5maXhlZFRvQ2FtZXJhID0gISF0aGlzLm9wdGlvbnMuZml4ZWRUb0NhbWVyYTtcblxuICAgICAgICBpZih0aGlzLm9wdGlvbnMuYWxpZ24pIHtcbiAgICAgICAgICAgIHRoaXMudGV4dC5hbGlnbiA9IHRoaXMub3B0aW9ucy5hbGlnbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5sYXllci5hZGQodGhpcy50ZXh0KTtcbiAgICB9XG5cbiAgICBzZXRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnNoYWRvd1RleHQuc2V0VGV4dCh0ZXh0KTtcbiAgICAgICAgdGhpcy50ZXh0LnNldFRleHQodGV4dCk7XG4gICAgfVxuXG4gICAgc2V0UG9zaXRpb24obmV3UG9zaXRpb246IElQb2ludCk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLnRleHQgJiYgdGhpcy5zaGFkb3dUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnRleHQueCA9IG5ld1Bvc2l0aW9uLng7XG4gICAgICAgICAgICB0aGlzLnRleHQueSA9IG5ld1Bvc2l0aW9uLnk7XG4gICAgICAgICAgICB0aGlzLnNoYWRvd1RleHQueCA9IG5ld1Bvc2l0aW9uLnggKyAxO1xuICAgICAgICAgICAgdGhpcy5zaGFkb3dUZXh0LnkgPSBuZXdQb3NpdGlvbi55ICsgMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGZvcmVncm91bmRUZXh0U3R5bGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5mb3JlZ3JvdW5kVGV4dFN0eWxlIHx8IERFRkFVTFRfRk9SRUdST1VORF9URVhUO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IHNoYWRvd1RleHRTdHlsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNoYWRvd1RleHRTdHlsZSB8fCBERUZBVUxUX1NIQURPV19URVhUO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMudGV4dCkge1xuICAgICAgICAgICAgdGhpcy50ZXh0LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5zaGFkb3dUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnNoYWRvd1RleHQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5zaGFkb3dUZXh0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHBoYXNlciB9IGZyb20gJy4uLy4uL1BoYXNlcic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5cbmNsYXNzIFVJQmxvY2tlciB7XG5cbiAgICBwcml2YXRlIG92ZXJsYXk6IFBoYXNlci5JbWFnZTtcbiAgICBwcml2YXRlIGJsb2NrZWQ6IEJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ibG9ja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYmxvY2soKTogdm9pZCB7XG4gICAgICAgIGxldCBncmFwaGljT3ZlcmxheSA9IG5ldyBQaGFzZXIuR3JhcGhpY3MocGhhc2VyR2FtZS52YWx1ZSwgMCwgMCk7XG4gICAgICAgIGdyYXBoaWNPdmVybGF5LmJlZ2luRmlsbCgweDAwMDAwMCwgMC4wKTtcbiAgICAgICAgZ3JhcGhpY092ZXJsYXkuZHJhd1JlY3QoMCwgMCwgbGF5b3V0LldJRFRILCBsYXlvdXQuVUlfU1RBUlRfUE9TSVRJT04ueSk7XG4gICAgICAgIGdyYXBoaWNPdmVybGF5LmVuZEZpbGwoKTtcblxuICAgICAgICB0aGlzLm92ZXJsYXkgPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC5pbWFnZSgwLCAwLCBncmFwaGljT3ZlcmxheS5nZW5lcmF0ZVRleHR1cmUoKSk7XG4gICAgICAgIHRoaXMub3ZlcmxheS5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vdmVybGF5LmlucHV0RW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdWlMYXllcnMudWlCbG9ja2VyLmFkZCh0aGlzLm92ZXJsYXkpO1xuICAgIH1cblxuICAgIHVuYmxvY2soKTogdm9pZCB7XG4gICAgICAgIHRoaXMub3ZlcmxheS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgaXNCbG9ja2VkKCk6IEJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9ja2VkO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVpQmxvY2tlciA9IG5ldyBVSUJsb2NrZXIoKTtcblxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL215LXR5cGluZ3MvbGliLmVzNi5kLnRzXCIgLz5cbmltcG9ydCB7IHBoYXNlciB9IGZyb20gJy4uLy4uL1BoYXNlcic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuXG5lbnVtIFVJTGF5ZXJzIHtcbiAgICBCQUNLR1JPVU5ELFxuICAgIEJBQ0tHUk9VTkRfT0JKRUNUUyxcbiAgICBQTEFZRVIsXG4gICAgRk9SRUdST1VORF9PQkpFQ1RTLFxuICAgIEZPUkVHUk9VTkQsXG4gICAgVEVYVF9JTl9TQ0VORSxcbiAgICBHVUlfQkFDS0dST1VORCxcbiAgICBWRVJCX0JVVFRPTlMsXG4gICAgQ09OVkVSU0FUSU9OLFxuICAgIFVJX0JMT0NLRVJcbn1cblxuY2xhc3MgVUlMYXllcnNNYW5hZ2VyIHtcblxuICAgIHByaXZhdGUgZ3JvdXBzOiBNYXA8VUlMYXllcnMsIFBoYXNlci5Hcm91cD47XG4gICAgcHJpdmF0ZSBpbml0aWFsaXNlZDogQm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBpbml0KCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbGlzZWQpIHtcbiAgICAgICAgICAgIGlmICghcGhhc2VyR2FtZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdFUlJPUjogaW5pdGluZyBVSUxheWVycyB3aGVuIGdhbWUgaXMgc3RpbGwgbm90IHRoZXJlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTGF5ZXJzKHBoYXNlckdhbWUudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgYmFja2dyb3VuZCgpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5CQUNLR1JPVU5EKTtcbiAgICB9XG5cbiAgICBnZXQgYmFja2dyb3VuZE9iamVjdHMoKTogUGhhc2VyLkdyb3VwIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3Vwcy5nZXQoVUlMYXllcnMuQkFDS0dST1VORF9PQkpFQ1RTKTtcbiAgICB9XG5cbiAgICBnZXQgcGxheWVyKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLlBMQVlFUik7XG4gICAgfVxuXG4gICAgZ2V0IGZvcmVncm91bmRPYmplY3RzKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLkZPUkVHUk9VTkRfT0JKRUNUUyk7XG4gICAgfVxuXG4gICAgZ2V0IGZvcmVncm91bmQoKTogUGhhc2VyLkdyb3VwIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3Vwcy5nZXQoVUlMYXllcnMuRk9SRUdST1VORCk7XG4gICAgfVxuXG4gICAgZ2V0IHRleHRJblNjZW5lKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLlRFWFRfSU5fU0NFTkUpO1xuICAgIH1cblxuICAgIGdldCBndWlCYWNrZ3JvdW5kKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLkdVSV9CQUNLR1JPVU5EKTtcbiAgICB9XG5cbiAgICBnZXQgdmVyYkJ1dHRvbnMoKTogUGhhc2VyLkdyb3VwIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3Vwcy5nZXQoVUlMYXllcnMuVkVSQl9CVVRUT05TKTtcbiAgICB9XG5cbiAgICBnZXQgY29udmVyc2F0aW9uKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLkNPTlZFUlNBVElPTik7XG4gICAgfVxuXG4gICAgZ2V0IHVpQmxvY2tlcigpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5VSV9CTE9DS0VSKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUxheWVycyhnYW1lOiBQaGFzZXIuR2FtZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmdyb3VwcyA9IG5ldyBNYXAoKTtcblxuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuQkFDS0dST1VORCwgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5CQUNLR1JPVU5EX09CSkVDVFMsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuUExBWUVSLCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLkZPUkVHUk9VTkRfT0JKRUNUUywgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5GT1JFR1JPVU5ELCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLlRFWFRfSU5fU0NFTkUsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuR1VJX0JBQ0tHUk9VTkQsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuVkVSQl9CVVRUT05TLCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLkNPTlZFUlNBVElPTiwgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5VSV9CTE9DS0VSLCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCB1aUxheWVycyA9IG5ldyBVSUxheWVyc01hbmFnZXIoKTsiLCJpbXBvcnQgeyBWZXJicyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5pbXBvcnQgeyBBY3Rpb25CdXR0b24gfSBmcm9tICcuL0FjdGlvbkJ1dHRvbic7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uL21vZGVscy9UaGluZyc7XG5cbmV4cG9ydCBjbGFzcyBWZXJic1VJIHtcblxuICAgIHByaXZhdGUgYnV0dG9uczogTWFwPFZlcmJzLCBBY3Rpb25CdXR0b24+O1xuICAgIHByaXZhdGUgaGlnaGxpZ2h0ZWRBY3Rpb246IFZlcmJzO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlQnV0dG9ucygpO1xuICAgICAgICB0aGlzLmxpc3RlblRvRXZlbnRzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCdXR0b25zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5zZXQoXG4gICAgICAgICAgICAgICAgVmVyYnMuR09fVE8sXG4gICAgICAgICAgICAgICAgbmV3IEFjdGlvbkJ1dHRvbihcbiAgICAgICAgICAgICAgICAgICAgVmVyYnMuR09fVE8sXG4gICAgICAgICAgICAgICAgICAgIHt4OiAwLCB5OiAwfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5zZXQoXG4gICAgICAgICAgICAgICAgVmVyYnMuTE9PSyxcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5MT09LLFxuICAgICAgICAgICAgICAgICAgICB7eDogMCwgeTogMX1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLkdJVkUsXG4gICAgICAgICAgICAgICAgbmV3IEFjdGlvbkJ1dHRvbihcbiAgICAgICAgICAgICAgICAgICAgVmVyYnMuR0lWRSxcbiAgICAgICAgICAgICAgICAgICAge3g6IDAsIHk6IDJ9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5QVVNILFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLlBVU0gsXG4gICAgICAgICAgICAgICAgICAgIHt4OiAxLCB5OiAwfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5zZXQoXG4gICAgICAgICAgICAgICAgVmVyYnMuVEFLRSxcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5UQUtFLFxuICAgICAgICAgICAgICAgICAgICB7eDogMSwgeTogMX1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLlVTRSxcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5VU0UsXG4gICAgICAgICAgICAgICAge3g6IDEsIHk6IDJ9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5TUEVBSyxcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5TUEVBSyxcbiAgICAgICAgICAgICAgICAgICAge3g6IDIsIHk6IDB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5PUEVOLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLk9QRU4sXG4gICAgICAgICAgICAgICAgICAgIHt4OiAyLCB5OiAxfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5zZXQoXG4gICAgICAgICAgICAgICAgVmVyYnMuQ0xPU0UsXG4gICAgICAgICAgICAgICAgbmV3IEFjdGlvbkJ1dHRvbihcbiAgICAgICAgICAgICAgICAgICAgVmVyYnMuQ0xPU0UsXG4gICAgICAgICAgICAgICAgICAgIHt4OiAyLCB5OiAyfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsaXN0ZW5Ub0V2ZW50cygpOiB2b2lkICB7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oXG4gICAgICAgICAgICBBY3Rpb25zLkNVUlNPUl9PVkVSX1RISU5HLFxuICAgICAgICAgICAgKHRoaW5nKSA9PiB0aGlzLmhpZ2hsaWdodFNlY29uZGFyeUFjdGlvbkZvclRoaW5nKHRoaW5nKVxuICAgICAgICApO1xuXG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oXG4gICAgICAgICAgICBBY3Rpb25zLkNVUlNPUl9PVVRfVEhJTkcsXG4gICAgICAgICAgICAoKSA9PiB0aGlzLnJlbW92ZVByZXZpb3VzbHlIaWdobGlnaHRlZEFjdGlvbigpXG4gICAgICAgICk7XG5cbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQUNUSU9OX0FQUExJRUQsXG4gICAgICAgICAgICAoKSA9PiB0aGlzLnJlbW92ZVByZXZpb3VzbHlIaWdobGlnaHRlZEFjdGlvbigpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoaWdobGlnaHRTZWNvbmRhcnlBY3Rpb25Gb3JUaGluZyh0aGluZzogVGhpbmcpIDogdm9pZHtcbiAgICAgICAgdGhpcy5yZW1vdmVQcmV2aW91c2x5SGlnaGxpZ2h0ZWRBY3Rpb24oKTtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRlZEFjdGlvbiA9IHRoaW5nLmdldFByZWZlcnJlZEFjdGlvbigpO1xuICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRlZEFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5idXR0b25zLmdldCh0aGlzLmhpZ2hsaWdodGVkQWN0aW9uKS5oaWdobGlnaHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlUHJldmlvdXNseUhpZ2hsaWdodGVkQWN0aW9uKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRlZEFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5idXR0b25zLmdldCh0aGlzLmhpZ2hsaWdodGVkQWN0aW9uKS51bmhpZ2hsaWdodCgpO1xuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRlZEFjdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlLCBJQ2FsbGJhY2sgfSBmcm9tICcuL09ic2VydmFibGUnO1xuXG5leHBvcnQgZW51bSBBY3Rpb25zIHtcbiAgICBDTElDS19TVEFHRSxcbiAgICBTRUxFQ1RfVkVSQixcbiAgICBTRUxFQ1RfVEhJTkcsXG4gICAgQ1VSU09SX09WRVJfVEhJTkcsXG4gICAgQ1VSU09SX09VVF9USElORyxcbiAgICBBQ1RJT05fQVBQTElFRCxcbiAgICBUQUtFX09CSkVDVCxcbiAgICBVUERBVEVfSU5WRU5UT1JZLFxuICAgIEdPX1RPX1NDRU5FLFxuICAgIFJFRkxFQ1Rcbn1cblxuY2xhc3MgQWN0aW9uRGlzcGF0Y2hlciB7XG5cbiAgICBwcml2YXRlIG9ic2VydmVyc1BlckFjdGlvbjogTWFwPEFjdGlvbnMsIE9ic2VydmFibGU+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzUGVyQWN0aW9uID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIGV4ZWN1dGUoYWN0aW9uOiBBY3Rpb25zLCBwYXJhbTogYW55ID0ge30pIHtcbiAgICAgICAgbGV0IGFjdGlvbk9ic2VydmFibGU6IE9ic2VydmFibGUgPSB0aGlzLm9ic2VydmVyc1BlckFjdGlvbi5nZXQoYWN0aW9uKTtcbiAgICAgICAgaWYgKGFjdGlvbk9ic2VydmFibGUpIHtcbiAgICAgICAgICAgIGFjdGlvbk9ic2VydmFibGUubm90aWZ5T2JzZXJ2ZXJzKHBhcmFtKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN1YnNjcmliZVRvKGFjdGlvbjogQWN0aW9ucywgY2FsbGJhY2s6IElDYWxsYmFjaykge1xuICAgICAgICBsZXQgYWN0aW9uT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZSA9IHRoaXMub2JzZXJ2ZXJzUGVyQWN0aW9uLmdldChhY3Rpb24pO1xuICAgICAgICBpZiAoIWFjdGlvbk9ic2VydmFibGUpIHtcbiAgICAgICAgICAgIGFjdGlvbk9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlcnNQZXJBY3Rpb24uc2V0KGFjdGlvbiwgYWN0aW9uT2JzZXJ2YWJsZSk7XG4gICAgICAgIH1cbiAgICAgICAgYWN0aW9uT2JzZXJ2YWJsZS5yZWdpc3Rlck9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBhY3Rpb25EaXNwYXRjaGVyID0gbmV3IEFjdGlvbkRpc3BhdGNoZXIoKTsiLCIiLCJleHBvcnQgZW51bSBEaXJlY3Rpb25zIHtcbiAgICBVUCA9IDEsXG4gICAgRE9XTixcbiAgICBMRUZULFxuICAgIFJJR0hUXG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RGlyZWN0aW9uTmFtZSA9IGZ1bmN0aW9uKGRpcmVjdGlvbjogRGlyZWN0aW9ucykge1xuICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICAgIGNhc2UgRGlyZWN0aW9ucy5VUDpcbiAgICAgICAgICAgIHJldHVybiAndXAnO1xuICAgICAgICBjYXNlIERpcmVjdGlvbnMuRE9XTjpcbiAgICAgICAgICAgIHJldHVybiAnZG93bic7XG4gICAgICAgIGNhc2UgRGlyZWN0aW9ucy5MRUZUOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2xlZnQnO1xuICAgICAgICBjYXNlIERpcmVjdGlvbnMuUklHSFQ6XG4gICAgICAgICAgICByZXR1cm4gJ3JpZ2h0JztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93ICdFUlJPUjogZ2V0dGluZyBkaXJlY3Rpb24gbmFtZSBvZiB1bmV4aXN0aW5nIGRpcmVjdGlvbic7XG4gICAgfVxufTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuZXhwb3J0IGludGVyZmFjZSBJQ2FsbGJhY2sge1xuICAgIChuZXdWYWx1ZTogYW55KTogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgT2JzZXJ2YWJsZSB7XG4gICAgcHJpdmF0ZSBvYnNlcnZlcnM6IFNldDxJQ2FsbGJhY2s+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gbmV3IFNldCgpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLm9ic2VydmVycy5hZGQoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJlbW92ZU9ic2VydmVyKGNhbGxiYWNrOiBJQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZW1vdmVBbGxPYnNlcnZlcnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgbm90aWZ5T2JzZXJ2ZXJzICh2YWx1ZSA6IGFueSkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMuZm9yRWFjaCgob2JzZXJ2ZXI6IElDYWxsYmFjayk9PiB7XG4gICAgICAgICAgICBvYnNlcnZlcih2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgU2VnbWVudCB9IGZyb20gJy4vU2VnbWVudCc7XG5cbmNvbnN0IE1JRERMRV9QT0lOVFNfVE9fQ0hFQ0sgPSAxMDtcbmNvbnN0IE1JTl9ESVNUQU5DRV9UT19CRV9JTl9MSU5FID0gMTtcblxuZnVuY3Rpb24gc29ydGVyQnlYVGhlblkocG9pbnRBOiBJUG9pbnQsIHBvaW50QjogSVBvaW50KTogbnVtYmVyIHtcbiAgICBpZihwb2ludEEueCA9PT0gcG9pbnRCLngpIHtcbiAgICAgICAgcmV0dXJuIHBvaW50QS55IC0gcG9pbnRCLnk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBvaW50QS54IC0gcG9pbnRCLng7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGNyb3NzKHBvaW50TzogSVBvaW50LCBwb2ludEE6IElQb2ludCwgcG9pbnRCOiBJUG9pbnQpOiBudW1iZXIge1xuICAgIHJldHVybiAocG9pbnRBLnggLSBwb2ludE8ueCkgKiAocG9pbnRCLnkgLSBwb2ludE8ueSkgLSAocG9pbnRBLnkgLSBwb2ludE8ueSkgKiAocG9pbnRCLnggLSBwb2ludE8ueCk7XG59XG5cblxuZnVuY3Rpb24gbGluZVNlZ21lbnRzQ3Jvc3MoYTogSVBvaW50LCBiOiBJUG9pbnQsIGM6IElQb2ludCwgZDogSVBvaW50KTogQm9vbGVhbiB7XG4gICAgbGV0IGRlbm9taW5hdG9yID0gKChiLnggLSBhLngpICogKGQueSAtIGMueSkpIC0gKChiLnkgLSBhLnkpICogKGQueCAtIGMueCkpO1xuICAgIGlmIChkZW5vbWluYXRvciA9PT0gMCl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgbnVtZXJhdG9yMSA9ICgoYS55IC0gYy55KSAqIChkLnggLSBjLngpKSAtICgoYS54IC0gYy54KSAqIChkLnkgLSBjLnkpKTtcbiAgICBsZXQgbnVtZXJhdG9yMiA9ICgoYS55IC0gYy55KSAqIChiLnggLSBhLngpKSAtICgoYS54IC0gYy54KSAqIChiLnkgLSBhLnkpKTtcblxuICAgIGlmIChudW1lcmF0b3IxID09PSAwIHx8IG51bWVyYXRvcjIgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCByID0gbnVtZXJhdG9yMSAvIGRlbm9taW5hdG9yO1xuICAgIGxldCBzID0gbnVtZXJhdG9yMiAvIGRlbm9taW5hdG9yO1xuXG4gICAgcmV0dXJuIChyID4gMCAmJiByIDwgMSkgJiYgKHMgPiAwICYmIHMgPCAxKTtcbn1cblxuZXhwb3J0IGNsYXNzIFBvbHlnb24ge1xuXG4gICAgcHJpdmF0ZSBjb252ZXhIdWxsOiBQb2x5Z29uO1xuICAgIHByaXZhdGUgX3NlZ21lbnRzOiBBcnJheTxTZWdtZW50PjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BvaW50czogQXJyYXk8SVBvaW50Pikge1xuICAgICAgICBpZighX3BvaW50cy5sZW5ndGggfHwgX3BvaW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1IgY3JlYXRpbmcgcG9seWdvbiwgaXQgbmVlZHMgYXQgbGVhc3QgMyBwb2ludHMnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHBvaW50cygpOiBBcnJheTxJUG9pbnQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50cztcbiAgICB9XG5cbiAgICBnZXQgc2VnbWVudHMoKTogQXJyYXk8U2VnbWVudD4ge1xuICAgICAgICBpZighdGhpcy5fc2VnbWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2VnbWVudHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc2VnbWVudHM7XG4gICAgfVxuXG4gICAgZ2V0Q29udmV4SHVsbCgpOiBQb2x5Z29uIHtcbiAgICAgICAgaWYoIXRoaXMuY29udmV4SHVsbCkge1xuICAgICAgICAgICAgdGhpcy5jb252ZXhIdWxsID0gdGhpcy5jYWxjdWxhdGVDb252ZXhIdWxsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmV4SHVsbDtcbiAgICB9XG5cbiAgICAvL0NvbmNhdmUgdmVydGV4IGFyZSB0aGUgb25lcyB0aGF0IGRvIG5vdCBiZWxvbmcgdG8gdGhlIGNvbnZleEh1bGxcbiAgICBnZXRDb25jYXZlVmVydGV4KCk6IEFycmF5PElQb2ludD4ge1xuICAgICAgICBsZXQgY29udmV4SHVsbCA9IHRoaXMuZ2V0Q29udmV4SHVsbCgpO1xuICAgICAgICBsZXQgcmVzdWx0OiBBcnJheTxJUG9pbnQ+ID0gW107XG5cbiAgICAgICAgZm9yKGxldCBwb2ludCBvZiB0aGlzLl9wb2ludHMpIHtcbiAgICAgICAgICAgIGlmKCFjb252ZXhIdWxsLmhhc1BvaW50KHBvaW50KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBvaW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgaGFzUG9pbnQocG9pbnRUb1NlYXJjaDogSVBvaW50KTogQm9vbGVhbiB7XG4gICAgICAgIGZvcihsZXQgcG9pbnQgb2YgdGhpcy5fcG9pbnRzKSB7XG4gICAgICAgICAgICBpZigocG9pbnQueCA9PT0gcG9pbnRUb1NlYXJjaC54KSAmJiAocG9pbnQueSA9PT0gcG9pbnRUb1NlYXJjaC55KSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNQb2ludEluc2lkZShwb2ludDogSVBvaW50KTogQm9vbGVhbiB7XG4gICAgICAgIGlmKHRoaXMuaGFzUG9pbnQocG9pbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZih0aGlzLnNlZ21lbnRzW2ldLmRpc3RhbmNlVG9Qb2ludChwb2ludCkgPCBNSU5fRElTVEFOQ0VfVE9fQkVfSU5fTElORSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBwaGFzZXJQb2x5Z29uID0gbmV3IFBoYXNlci5Qb2x5Z29uKHRoaXMucG9pbnRzLm1hcCgoZWFjaFBvaW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBoYXNlci5Qb2ludChlYWNoUG9pbnQueCwgZWFjaFBvaW50LnkpO1xuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBwaGFzZXJQb2x5Z29uLmNvbnRhaW5zKHBvaW50LngsIHBvaW50LnkpO1xuICAgIH1cblxuXG5cbiAgICBnZXRDbG9zZXN0UG9pbnRUbyhwb2ludDogSVBvaW50KTogSVBvaW50IHtcbiAgICAgICAgdmFyIGNsb3Nlc3RTZWdtZW50ID0gdGhpcy5nZXRDbG9zZXN0U2VnbWVudChwb2ludCk7XG4gICAgICAgIHJldHVybiBjbG9zZXN0U2VnbWVudC5nZXRDbG9zZXN0UG9pbnRUbyhwb2ludCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDbG9zZXN0U2VnbWVudChwb2ludDogSVBvaW50KTogU2VnbWVudCB7XG4gICAgICAgIGxldCBzZWdtZW50cyA9IHRoaXMuc2VnbWVudHM7XG4gICAgICAgIGxldCBjbG9zZXN0U2VnbWVudCA9IHRoaXMuc2VnbWVudHNbMF07XG4gICAgICAgIGxldCBtaW5EaXN0YW5jZSA9IGNsb3Nlc3RTZWdtZW50LmRpc3RhbmNlMlRvUG9pbnQocG9pbnQpO1xuICAgICAgICBmb3IobGV0IGkgPSAxOyBpPHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV4dFNlZ21lbnQgPSBzZWdtZW50c1tpXTtcbiAgICAgICAgICAgIGxldCBuZXh0RGlzdGFuY2UgPSBuZXh0U2VnbWVudC5kaXN0YW5jZTJUb1BvaW50KHBvaW50KTtcbiAgICAgICAgICAgIGlmKG5leHREaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VzdFNlZ21lbnQgPSBuZXh0U2VnbWVudDtcbiAgICAgICAgICAgICAgICBtaW5EaXN0YW5jZSA9IG5leHREaXN0YW5jZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbG9zZXN0U2VnbWVudDtcbiAgICB9XG5cbiAgICBwb2ludHNDYW5TZWVFYWNoT3RoZXIocG9pbnRBOiBJUG9pbnQsIHBvaW50QjogSVBvaW50KTogQm9vbGVhbiB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuXG4gICAgICAgIGlmKCF0aGlzLmlzUG9pbnRJbnNpZGUocG9pbnRBKSB8fCAhdGhpcy5pc1BvaW50SW5zaWRlKHBvaW50QikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZighdGhpcy5taWRkbGVQb2ludHNBcmVJbnNpZGUocG9pbnRBLCBwb2ludEIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2VnbWVudHMgPSB0aGlzLnNlZ21lbnRzO1xuICAgICAgICBsZXQgc2VnbWVudEJldHdlZW5Qb2ludHMgPSBuZXcgU2VnbWVudChwb2ludEEsIHBvaW50Qik7XG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZihzZWdtZW50c1tpXS5pc0Nyb3NzZWRCeShzZWdtZW50QmV0d2VlblBvaW50cykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtaWRkbGVQb2ludHNBcmVJbnNpZGUocG9pbnRBOiBJUG9pbnQsIHBvaW50QjogSVBvaW50LCBwb2ludHNUb0NoZWNrOiBudW1iZXIgPSBNSURETEVfUE9JTlRTX1RPX0NIRUNLKTogQm9vbGVhbiB7XG4gICAgICAgIGxldCBwb2ludDEgPSBuZXcgUGhhc2VyLlBvaW50KHBvaW50QS54LCBwb2ludEEueSk7XG4gICAgICAgIGxldCBwb2ludDIgPSBuZXcgUGhhc2VyLlBvaW50KHBvaW50Qi54LCBwb2ludEIueSk7XG5cbiAgICAgICAgZm9yKGxldCBpPTE7IGk8PXBvaW50c1RvQ2hlY2s7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJhdGlvID0gaS8ocG9pbnRzVG9DaGVjayArIDEpO1xuICAgICAgICAgICAgbGV0IHBvaW50SW5CZXR3ZWVuID0gUGhhc2VyLlBvaW50LmludGVycG9sYXRlKHBvaW50MSwgcG9pbnQyLCByYXRpbyk7XG4gICAgICAgICAgICBpZighdGhpcy5pc1BvaW50SW5zaWRlKHsgeDogcG9pbnRJbkJldHdlZW4ueCwgeTogcG9pbnRJbkJldHdlZW4ueX0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBcbiAgICB9XG5cbiAgICAvLyBVc2luZyBodHRwczovL2VuLndpa2lib29rcy5vcmcvd2lraS9BbGdvcml0aG1fSW1wbGVtZW50YXRpb24vR2VvbWV0cnkvQ29udmV4X2h1bGwvTW9ub3RvbmVfY2hhaW5cbiAgICBwcml2YXRlIGNhbGN1bGF0ZUNvbnZleEh1bGwoKTogUG9seWdvbiB7XG4gICAgICAgIGxldCBvcmRlcmVkUG9pbnRzID0gQXJyYXkuZnJvbSh0aGlzLl9wb2ludHMpO1xuICAgICAgICBvcmRlcmVkUG9pbnRzLnNvcnQoc29ydGVyQnlYVGhlblkpO1xuXG4gICAgICAgIHZhciBsb3dlciA6IEFycmF5PElQb2ludD4gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmRlcmVkUG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB3aGlsZSAobG93ZXIubGVuZ3RoID49IDIgJiYgY3Jvc3MobG93ZXJbbG93ZXIubGVuZ3RoIC0gMl0sIGxvd2VyW2xvd2VyLmxlbmd0aCAtIDFdLCBvcmRlcmVkUG9pbnRzW2ldKSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgbG93ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb3dlci5wdXNoKG9yZGVyZWRQb2ludHNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVwcGVyIDogQXJyYXk8SVBvaW50PiA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gb3JkZXJlZFBvaW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgd2hpbGUgKHVwcGVyLmxlbmd0aCA+PSAyICYmIGNyb3NzKHVwcGVyW3VwcGVyLmxlbmd0aCAtIDJdLCB1cHBlclt1cHBlci5sZW5ndGggLSAxXSwgb3JkZXJlZFBvaW50c1tpXSkgPD0gMCkge1xuICAgICAgICAgICAgICAgIHVwcGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBwZXIucHVzaChvcmRlcmVkUG9pbnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICB1cHBlci5wb3AoKTtcbiAgICAgICAgbG93ZXIucG9wKCk7XG4gICAgICAgIHJldHVybiBuZXcgUG9seWdvbihsb3dlci5jb25jYXQodXBwZXIpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNlZ21lbnRzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9zZWdtZW50cyA9IFtdO1xuICAgICAgICBmb3IobGV0IGk9MDsgaSA8ICh0aGlzLl9wb2ludHMubGVuZ3RoIC0gMSk7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fc2VnbWVudHMucHVzaChuZXcgU2VnbWVudCh0aGlzLl9wb2ludHNbaV0sIHRoaXMuX3BvaW50c1tpKzFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2VnbWVudHMucHVzaChuZXcgU2VnbWVudCh0aGlzLl9wb2ludHNbdGhpcy5fcG9pbnRzLmxlbmd0aCAtIDFdLCB0aGlzLl9wb2ludHNbMF0pKTtcbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuXG5jbGFzcyBSYW5kb21UZXh0IHtcbiAgICBwcml2YXRlIG9yaWdpbmFsUGhyYXNlczogQXJyYXk8c3RyaW5nPjtcbiAgICBwcml2YXRlIHBocmFzZXM6IEFycmF5PHN0cmluZz47XG4gICAgcHJpdmF0ZSBsYXN0VGV4dDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocGhyYXNlczogQXJyYXk8c3RyaW5nPikge1xuICAgICAgICB0aGlzLm9yaWdpbmFsUGhyYXNlcyA9IHBocmFzZXM7XG4gICAgICAgIHRoaXMuY3JlYXRlU2V0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTZXQoKSB7XG4gICAgICAgIHRoaXMucGhyYXNlcyA9IHRoaXMub3JpZ2luYWxQaHJhc2VzLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmVzdWx0OiBzdHJpbmc7XG5cbiAgICAgICAgaWYgKHRoaXMucGhyYXNlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMucGhyYXNlc1swXTtcbiAgICAgICAgICAgIHRoaXMubGFzdFRleHQgPSByZXN1bHQ7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNldCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcih0aGlzLnBocmFzZXMubGVuZ3RoICogTWF0aC5yYW5kb20oKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5waHJhc2VzW3JhbmRvbUluZGV4XSA9PT0gdGhpcy5sYXN0VGV4dCkge1xuICAgICAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gKHJhbmRvbUluZGV4ICsgMSkgJSB0aGlzLnBocmFzZXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5waHJhc2VzW3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHRoaXMucGhyYXNlcy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy5sYXN0VGV4dCA9IHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuXG5jbGFzcyBSYW5kb21UZXh0RmFjdG9yeSB7XG4gICAgcHJpdmF0ZSBnZW5lcmF0b3JzOiBNYXA8c3RyaW5nLCBSYW5kb21UZXh0PjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3JzID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIGdldFJhbmRvbVRleHQoLi4ucGhyYXNlczogQXJyYXk8c3RyaW5nPik6IHN0cmluZyB7XG4gICAgICAgIGxldCBwaHJhc2VzSWQgPSB0aGlzLmdldElkRnJvbVBocmFzZXMocGhyYXNlcyk7XG4gICAgICAgIGxldCBnZW5lcmF0b3IgPSB0aGlzLmdlbmVyYXRvcnMuZ2V0KHBocmFzZXNJZCk7XG4gICAgICAgIGlmICghZ2VuZXJhdG9yKSB7XG4gICAgICAgICAgICBnZW5lcmF0b3IgPSBuZXcgUmFuZG9tVGV4dChwaHJhc2VzKTtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdG9ycy5zZXQocGhyYXNlc0lkLCBnZW5lcmF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZW5lcmF0b3IuZ2V0UmFuZG9tVGV4dCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SWRGcm9tUGhyYXNlcyhwaHJhc2VzOiBBcnJheTxzdHJpbmc+ID0gW10pOiBzdHJpbmcge1xuICAgICAgICBsZXQgaWQgPSBwaHJhc2VzLmpvaW4oJyMnKTtcbiAgICAgICAgaWYgKGlkID09PSAnJykge1xuICAgICAgICAgICAgaWQgPSAnIyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxufVxuY29uc3QgdGV4dEZhY3RvcnkgPSBuZXcgUmFuZG9tVGV4dEZhY3RvcnkoKTtcbmV4cG9ydCBjb25zdCByYW5kb21UZXh0ID0gKC4uLnBocmFzZXM6IEFycmF5PHN0cmluZz4pID0+IHtcbiAgICByZXR1cm4gdGV4dEZhY3RvcnkuZ2V0UmFuZG9tVGV4dCguLi5waHJhc2VzKTtcbn07IiwiaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi9JbnRlcmZhY2VzJztcblxuZnVuY3Rpb24gc3FyKHg6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHggKiB4O1xufVxuXG5mdW5jdGlvbiBkaXN0YW5jZTIocG9pbnRBOiBJUG9pbnQsIHBvaW50QjogSVBvaW50KTogbnVtYmVyIHtcbiAgICByZXR1cm4gc3FyKHBvaW50QS54IC0gcG9pbnRCLngpICsgc3FyKHBvaW50QS55IC0gcG9pbnRCLnkpO1xufVxuXG5leHBvcnQgY2xhc3MgU2VnbWVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcG9pbnRBOiBJUG9pbnQsIHB1YmxpYyBwb2ludEI6IElQb2ludCkge31cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChkaXN0YW5jZTIodGhpcy5wb2ludEEsIHRoaXMucG9pbnRCKSk7XG4gICAgfVxuXG4gICAgLy9CYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNTAxNzI1LzM0OTMzODhcbiAgICBkaXN0YW5jZVRvUG9pbnQocG9pbnQ6IElQb2ludCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kaXN0YW5jZTJUb1BvaW50KHBvaW50KSk7XG4gICAgfVxuXG4gICAgZGlzdGFuY2UyVG9Qb2ludChwb2ludDogSVBvaW50KTogbnVtYmVyIHtcbiAgICAgICAgdmFyIGxlbmd0aDIgPSBkaXN0YW5jZTIodGhpcy5wb2ludEEsIHRoaXMucG9pbnRCKTtcbiAgICAgICAgaWYobGVuZ3RoMiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRpc3RhbmNlMih0aGlzLnBvaW50QSwgdGhpcy5wb2ludEIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0ID0gKChwb2ludC54IC0gdGhpcy5wb2ludEEueCkgKiAodGhpcy5wb2ludEIueCAtIHRoaXMucG9pbnRBLngpICsgKHBvaW50LnkgLSB0aGlzLnBvaW50QS55KSAqICh0aGlzLnBvaW50Qi55IC0gdGhpcy5wb2ludEEueSkpIC8gbGVuZ3RoMjtcbiAgICAgICAgdCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHQpKTtcblxuICAgICAgICByZXR1cm4gZGlzdGFuY2UyKHBvaW50LCB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvaW50QS54ICsgdCAqICh0aGlzLnBvaW50Qi54IC0gdGhpcy5wb2ludEEueCksXG4gICAgICAgICAgICB5OiB0aGlzLnBvaW50QS55ICsgdCAqICh0aGlzLnBvaW50Qi55IC0gdGhpcy5wb2ludEEueSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvL0Jhc2VkIG9uIGh0dHA6Ly93d3cuamF2YTJzLmNvbS9Db2RlL0phdmEvMkQtR3JhcGhpY3MtR1VJL1JldHVybnNjbG9zZXN0cG9pbnRvbnNlZ21lbnR0b3BvaW50Lmh0bVxuICAgIGdldENsb3Nlc3RQb2ludFRvKHBvaW50OiBJUG9pbnQpOiBJUG9pbnQge1xuICAgICAgICBsZXQgeERlbHRhID0gdGhpcy5wb2ludEIueCAtIHRoaXMucG9pbnRBLng7XG4gICAgICAgIGxldCB5RGVsdGEgPSB0aGlzLnBvaW50Qi55IC0gdGhpcy5wb2ludEEueTtcblxuICAgICAgICBpZigoeERlbHRhID09PSAwKSAmJiAoeURlbHRhID09PSAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRBOyAvL0xpbmUgaXMgYWN0dWFsbHkgYSBwb2ludFxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHUgPSAoKHBvaW50LnggLSB0aGlzLnBvaW50QS54KSAqIHhEZWx0YSArIChwb2ludC55IC0gdGhpcy5wb2ludEEueSkgKiB5RGVsdGEpIC8gKHhEZWx0YSAqIHhEZWx0YSArIHlEZWx0YSAqIHlEZWx0YSk7XG5cbiAgICAgICAgaWYodSA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvaW50QTtcbiAgICAgICAgfVxuICAgICAgICBpZih1ID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRCO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvaW50QS54ICsgdSAqIHhEZWx0YSxcbiAgICAgICAgICAgIHk6IHRoaXMucG9pbnRBLnkgKyB1ICogeURlbHRhXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBpc0Nyb3NzZWRCeShzZWdtZW50OiBTZWdtZW50KTogQm9vbGVhbiB7XG4gICAgICAgIGlmKHRoaXMuaXNFcXVhbChzZWdtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsaW5lMSA9IG5ldyBQaGFzZXIuTGluZSh0aGlzLnBvaW50QS54LCB0aGlzLnBvaW50QS55LCB0aGlzLnBvaW50Qi54LCB0aGlzLnBvaW50Qi55KTtcbiAgICAgICAgbGV0IGxpbmUyID0gbmV3IFBoYXNlci5MaW5lKHNlZ21lbnQucG9pbnRBLngsIHNlZ21lbnQucG9pbnRBLnksIHNlZ21lbnQucG9pbnRCLngsIHNlZ21lbnQucG9pbnRCLnkpO1xuXG4gICAgICAgIHZhciBvdGhlclNlZ21lbnRJbnNpZGVUaGlzID0gbGluZTEucG9pbnRPblNlZ21lbnQoc2VnbWVudC5wb2ludEEueCwgc2VnbWVudC5wb2ludEEueSkgfHwgbGluZTEucG9pbnRPblNlZ21lbnQoc2VnbWVudC5wb2ludEIueCwgc2VnbWVudC5wb2ludEIueSk7XG4gICAgICAgIGlmKG90aGVyU2VnbWVudEluc2lkZVRoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGhpc1NlZ21lbnRJbnNpZGVPdGhlciA9IGxpbmUyLnBvaW50T25TZWdtZW50KHRoaXMucG9pbnRBLngsIHRoaXMucG9pbnRBLnkpIHx8IGxpbmUyLnBvaW50T25TZWdtZW50KHRoaXMucG9pbnRCLngsIHRoaXMucG9pbnRCLnkpO1xuICAgICAgICBpZih0aGlzU2VnbWVudEluc2lkZU90aGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW50ZXJzZWN0aW9uID0gbGluZTEuaW50ZXJzZWN0cyhsaW5lMiwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuICEhaW50ZXJzZWN0aW9uO1xuICAgIH1cblxuICAgIC8vIHByaXZhdGUgbGluZVRvU3RyaW5nKGxpbmU6IFBoYXNlci5MaW5lKTogc3RyaW5nIHtcbiAgICAvLyAgICAgcmV0dXJuICdbKCcgKyBsaW5lLnN0YXJ0LnggKyAnLCcgKyBsaW5lLnN0YXJ0LnkgKyAnKS0oJyArIGxpbmUuZW5kLnggKyAnLCcgKyBsaW5lLmVuZC55ICsgJyldJztcbiAgICAvLyB9XG5cbiAgICBpc0VxdWFsKHNlZ21lbnQ6IFNlZ21lbnQpOiBCb29sZWFuIHtcbiAgICAgICAgaWYodGhpcy5wb2ludHNBcmVFcXVhbCh0aGlzLnBvaW50QSwgc2VnbWVudC5wb2ludEEpICYmIHRoaXMucG9pbnRzQXJlRXF1YWwodGhpcy5wb2ludEIsIHNlZ21lbnQucG9pbnRCKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5wb2ludHNBcmVFcXVhbCh0aGlzLnBvaW50Qiwgc2VnbWVudC5wb2ludEEpICYmIHRoaXMucG9pbnRzQXJlRXF1YWwodGhpcy5wb2ludEEsIHNlZ21lbnQucG9pbnRCKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgcG9pbnRzQXJlRXF1YWwocG9pbnRBOiBJUG9pbnQsIHBvaW50QjogSVBvaW50KTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAocG9pbnRBLnggPT09IHBvaW50Qi54KSAmJiAocG9pbnRBLnkgPT09IHBvaW50Qi55KTtcbiAgICB9XG5cbiAgICAvLyBnZXRNaWRkbGVQb2ludCgpOiBJUG9pbnQge1xuICAgIC8vICAgICByZXR1cm4ge1xuICAgIC8vICAgICAgICAgeDogKHRoaXMucG9pbnRBLnggKyB0aGlzLnBvaW50Qi54KSAvIDIsXG4gICAgLy8gICAgICAgICB5OiAodGhpcy5wb2ludEEueSArIHRoaXMucG9pbnRCLnkpIC8gMlxuICAgIC8vICAgICB9O1xuICAgIC8vIH1cblxuXG59XG5cblxuLy8gcHVibGljIHN0YXRpYyBQb2ludCBnZXRDbG9zZXN0UG9pbnRPblNlZ21lbnQoaW50IHN4MSwgaW50IHN5MSwgaW50IHN4MiwgaW50IHN5MiwgaW50IHB4LCBpbnQgcHkpXG4vLyAgIHtcbi8vICAgICBkb3VibGUgeERlbHRhID0gc3gyIC0gc3gxO1xuLy8gICAgIGRvdWJsZSB5RGVsdGEgPSBzeTIgLSBzeTE7XG5cbi8vICAgICBpZiAoKHhEZWx0YSA9PSAwKSAmJiAoeURlbHRhID09IDApKVxuLy8gICAgIHtcbi8vICAgICAgIHRocm93IG5ldyBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24oXCJTZWdtZW50IHN0YXJ0IGVxdWFscyBzZWdtZW50IGVuZFwiKTtcbi8vICAgICB9XG5cbi8vICAgICBkb3VibGUgdSA9ICgocHggLSBzeDEpICogeERlbHRhICsgKHB5IC0gc3kxKSAqIHlEZWx0YSkgLyAoeERlbHRhICogeERlbHRhICsgeURlbHRhICogeURlbHRhKTtcblxuLy8gICAgIGZpbmFsIFBvaW50IGNsb3Nlc3RQb2ludDtcbi8vICAgICBpZiAodSA8IDApXG4vLyAgICAge1xuLy8gICAgICAgY2xvc2VzdFBvaW50ID0gbmV3IFBvaW50KHN4MSwgc3kxKTtcbi8vICAgICB9XG4vLyAgICAgZWxzZSBpZiAodSA+IDEpXG4vLyAgICAge1xuLy8gICAgICAgY2xvc2VzdFBvaW50ID0gbmV3IFBvaW50KHN4Miwgc3kyKTtcbi8vICAgICB9XG4vLyAgICAgZWxzZVxuLy8gICAgIHtcbi8vICAgICAgIGNsb3Nlc3RQb2ludCA9IG5ldyBQb2ludCgoaW50KSBNYXRoLnJvdW5kKHN4MSArIHUgKiB4RGVsdGEpLCAoaW50KSBNYXRoLnJvdW5kKHN5MSArIHUgKiB5RGVsdGEpKTtcbi8vICAgICB9XG5cbi8vICAgICByZXR1cm4gY2xvc2VzdFBvaW50O1xuLy8gICB9XG4vLyB9XG4iLCJjbGFzcyBBbmFseXRpY3Mge1xuXG4gICAgc2VuZEV2ZW50KGNhdGVnb3J5OiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nLCBsYWJlbDogc3RyaW5nID0gdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgICAgIGlmKCg8YW55PndpbmRvdykuZ2EpIHtcbiAgICAgICAgICAgICg8YW55PndpbmRvdykuZ2EoJ3NlbmQnLCAnZXZlbnQnLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBhbmFseXRpY3MgPSBuZXcgQW5hbHl0aWNzKCk7IiwiaW50ZXJmYWNlIElJbWFnZXNJbmZvIHtcbiAgICBbaW5kZXggOiBzdHJpbmddIDogc3RyaW5nO1xufTtcblxuaW50ZXJmYWNlIElTcHJpdGVzSW5mbyB7XG4gICAgW2luZGV4IDogc3RyaW5nXSA6IChzdHJpbmd8bnVtYmVyKVtdO1xufTtcblxuaW50ZXJmYWNlIElGb250c0luZm8ge1xuICAgIFtpbmRleCA6IHN0cmluZ10gOiBBcnJheTxzdHJpbmc+O1xufTtcblxuY29uc3QgU1BSSVRFUzogSVNwcml0ZXNJbmZvID0ge1xuICAgIC8vIFVJXG4gICAgJ0JVVFRPTl9CRyc6IFsnaW1hZ2VzL3VpL0JVVFRPTl9CR19TUFJJVEUucG5nJyw3NSwgMTgsIDNdLFxuICAgICdSRUZMRUNUX0JVVFRPTl9CRyc6IFsnaW1hZ2VzL3VpL1JFRkxFQ1RfQlVUVE9OX0JHX1NQUklURS5wbmcnLCA3NSwgNTYsIDNdLFxuICAgICdDT05WRVJTQVRJT05fTElORV9CRyc6IFsnaW1hZ2VzL3VpL0NPTlZFUlNBVElPTl9MSU5FX0JHLnBuZycsIDUwOCwgMjBdLFxuICAgICdQQUdJTkFUSU9OX0JVVFRPTl9VUCc6IFsnaW1hZ2VzL3VpL1BBR0lOQVRJT05fQlVUVE9OX1VQLnBuZycsIDE2LCAyNSwgNF0sXG4gICAgJ0VOR0xJU0hfQlVUVE9OJzogWydpbWFnZXMvdWkvRU5HTElTSF9CVVRUT04ucG5nJywgMTM2LCAyNywgM10sXG4gICAgJ1NQQU5JU0hfQlVUVE9OJzogWydpbWFnZXMvdWkvU1BBTklTSF9CVVRUT04ucG5nJywgMTM2LCAyNywgM10sXG5cbiAgICAvLyBQTEFZRVJcbiAgICAnRE9DVE9SVElMTEFfUExBWUVSX1NQUklURSc6IFsnaW1hZ2VzL3BsYXllci9ET0NUT1JUSUxMQV9QTEFZRVJfU1BSSVRFLnBuZycsIDQ0LCA2MSwgNDFdLFxuICAgIFxuICAgIC8vIEJBQ0tTVEFHRVxuICAgICdWRU5ESU5HX01BQ0hJTkVfU1BSSVRFJzogWydpbWFnZXMvYmFja3N0YWdlL1ZFTkRJTkdfTUFDSElORV9TUFJJVEUucG5nJywgNDksIDcyLCAzXSxcbiAgICAnQkFORF9JTl9TT0ZBX1NQUklURSc6IFsnaW1hZ2VzL2JhY2tzdGFnZS9CQU5EX0lOX1NPRkFfU1BSSVRFLnBuZycsIDcwLCA3OCwgMjNdLFxuICAgICdHTEFTU19JTlZfU1BSSVRFJzogWydpbWFnZXMvYmFja3N0YWdlL0dMQVNTX0lOVl9TUFJJVEUucG5nJywgNjgsIDI2LCA0XSxcbiAgICAnQ09TVFVNRV9JTlZfU1BSSVRFJzogWydpbWFnZXMvYmFja3N0YWdlL0NPU1RVTUVfSU5WX1NQUklURS5wbmcnLCA2OCwgMjYsIDRdLFxuICAgICdCQUNLU1RBR0VfRE9PUl9UT19CQUNLWUFSRF9TUFJJVEUnOiBbJ2ltYWdlcy9iYWNrc3RhZ2UvQkFDS1NUQUdFX0RPT1JfVE9fQkFDS1lBUkRfU1BSSVRFLnBuZycsIDYxLCAxMDQsIDJdLFxuXG4gICAgLy9CYWNreWFyZFxuICAgICdCQUNLWUFSRF9ET09SX1RPX0JBQ0tTVEFHRV9TUFJJVEUnOiBbJ2ltYWdlcy9iYWNreWFyZC9CQUNLWUFSRF9ET09SX1RPX0JBQ0tTVEFHRV9TUFJJVEUucG5nJywgMzEsIDEwNCwgMl0sXG4gICAgJ0JJTElfU1BSSVRFJzogWydpbWFnZXMvYmFja3lhcmQvQklMSV9TUFJJVEUucG5nJywgNDMsIDcwLCAyNF0sXG4gICAgJ0JBTExPT05fU1BSSVRFJzogWydpbWFnZXMvYmFja3lhcmQvQkFMTE9PTl9TUFJJVEUucG5nJywgMjgsIDU5LCAxMF1cbn07XG5cbmNvbnN0IElNQUdFUzogSUltYWdlc0luZm8gPSB7XG4gICAgLy8gVUlcbiAgICAnVUlfQkcnOiAnaW1hZ2VzL3VpL1VJX0JHLnBuZycsXG4gICAgJ1VJX0lOVl9CRyc6ICdpbWFnZXMvdWkvVUlfSU5WX0JHLnBuZycsXG4gICAgJ1VJX0NPTlZFUlNBVElPTl9CRyc6ICdpbWFnZXMvdWkvVUlfQ09OVkVSU0FUSU9OX0JHLnBuZycsXG4gICAgJ0xPR08nOiAnaW1hZ2VzL3VpL0xPR08ucG5nJyxcbiAgICAnVEhFX0dBTUUnOiAnaW1hZ2VzL3VpL1RIRV9HQU1FLnBuZycsXG4gICAgJ0NSRURJVFMnOiAnaW1hZ2VzL3VpL0NSRURJVFMucG5nJyxcblxuICAgIC8vIEJhY2tzdGFnZSBzY2VuZTpcbiAgICAnQkFDS1NUQUdFX0JHJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQkFDS1NUQUdFX0JHLnBuZycsXG4gICAgJ0NBQkxFJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQ0FCTEUucG5nJyxcbiAgICAnQ0FCTEVfSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQ0FCTEVfSU5WLnBuZycsXG4gICAgJ1NLSVJUJzogJ2ltYWdlcy9iYWNrc3RhZ2UvU0tJUlRfSU5WLnBuZycsXG4gICAgJ0JST09NJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQlJPT00ucG5nJyxcbiAgICAnQlJPT01fSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQlJPT01fSU5WLnBuZycsXG4gICAgJ0JBQ0tZQVJEX0JHJzogJ2ltYWdlcy9iYWNreWFyZC9CQUNLWUFSRF9CRy5wbmcnLFxuICAgICdDQU5fSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQ0FOX0lOVi5wbmcnLFxuICAgICdDT0lOX0lOVic6ICdpbWFnZXMvYmFja3N0YWdlL0NPSU5fSU5WLnBuZycsXG4gICAgJ1NDSVNTT1JTJzogJ2ltYWdlcy9iYWNrc3RhZ2UvU0NJU1NPUlMucG5nJyxcbiAgICAnU0NJU1NPUlNfSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvU0NJU1NPUlNfSU5WLnBuZycsXG4gICAgJ0JPQ0FESUxMTyc6ICdpbWFnZXMvYmFja3N0YWdlL0JPQ0FESUxMTy5wbmcnLFxuICAgICdCT0NBRElMTE9fSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQk9DQURJTExPX0lOVi5wbmcnLFxuICAgICdCUkVBRF9JTlYnOiAnaW1hZ2VzL2JhY2tzdGFnZS9CUkVBRF9JTlYucG5nJyxcbiAgICAnQkFDT05fSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQkFDT05fSU5WLnBuZycsXG4gICAgJ0NPQ09OVVQnOiAnaW1hZ2VzL2JhY2tzdGFnZS9DT0NPTlVULnBuZycsXG4gICAgJ0NPQ09OVVRfSU5WJzogJ2ltYWdlcy9iYWNrc3RhZ2UvQ09DT05VVF9JTlYucG5nJyxcbiAgICAnRFVTVCc6ICdpbWFnZXMvYmFja3N0YWdlL0RVU1QucG5nJyxcbiAgICAnRFVTVF9JTlYnOiAnaW1hZ2VzL2JhY2tzdGFnZS9EVVNUX0lOVi5wbmcnLFxuICAgICdHTEFTUyc6ICdpbWFnZXMvYmFja3N0YWdlL0dMQVNTLnBuZycsXG4gICAgJ0xBTVAnOiAnaW1hZ2VzL2JhY2tzdGFnZS9MQU1QLnBuZycsXG4gICAgJ0JBQ0tTVEFHRV9ET09SX1RPX1NUUkVFVCc6ICdpbWFnZXMvYmFja3N0YWdlL0JBQ0tTVEFHRV9ET09SX1RPX1NUUkVFVC5wbmcnLFxuICAgICdCQUNLU1RBR0VfRE9PUl9UT19TVEFHRSc6ICdpbWFnZXMvYmFja3N0YWdlL0JBQ0tTVEFHRV9ET09SX1RPX1NUQUdFLnBuZycsXG4gICAgJ0ZMWV9DQVNFJzogJ2ltYWdlcy9iYWNrc3RhZ2UvRkxZX0NBU0UucG5nJyxcblxuICAgIC8vIEJhY2t5YXJkOlxuICAgICdGTE9XRVJTJzogJ2ltYWdlcy9iYWNreWFyZC9GTE9XRVJTLnBuZycsXG4gICAgJ0ZMT1dFUlNfSU5WJzogJ2ltYWdlcy9iYWNreWFyZC9GTE9XRVJTX0lOVi5wbmcnLFxuICAgICdMQU1QX0JBQ0tZQVJEJzogJ2ltYWdlcy9iYWNreWFyZC9MQU1QX0JBQ0tZQVJELnBuZycsXG4gICAgJ01PT04nOiAnaW1hZ2VzL2JhY2t5YXJkL01PT04ucG5nJyxcbiAgICAnU1RBUic6ICdpbWFnZXMvYmFja3lhcmQvU1RBUi5wbmcnLFxuICAgICdDVVRfRkxPV0VSUyc6ICdpbWFnZXMvYmFja3lhcmQvQ1VUX0ZMT1dFUlMucG5nJ1xufTtcblxuY29uc3QgRk9OVFM6IElGb250c0luZm8gPSB7XG4gICAgJ0ZPTlRfMzJfQkxBQ0snOiBbJ2ltYWdlcy9mb250cy9mb250XzMyX2JsYWNrLnBuZycsICdpbWFnZXMvZm9udHMvZm9udF8zMl9ibGFjay5mbnQnXSxcbiAgICAnRk9OVF8zMl9XSElURSc6IFsnaW1hZ2VzL2ZvbnRzL2ZvbnRfMzJfd2hpdGUucG5nJywgJ2ltYWdlcy9mb250cy9mb250XzMyX3doaXRlLmZudCddLFxuICAgICdGT05UXzMyX09SQU5HRSc6IFsnaW1hZ2VzL2ZvbnRzL2ZvbnRfMzJfb3JhbmdlLnBuZycsICdpbWFnZXMvZm9udHMvZm9udF8zMl9vcmFuZ2UuZm50J10sXG4gICAgJ0ZPTlRfMzJfQkxVRSc6IFsnaW1hZ2VzL2ZvbnRzL2ZvbnRfMzJfYmx1ZS5wbmcnLCAnaW1hZ2VzL2ZvbnRzL2ZvbnRfMzJfYmx1ZS5mbnQnXSxcbiAgICAnRk9OVF8zMl9SRUQnOiBbJ2ltYWdlcy9mb250cy9mb250XzMyX3JlZC5wbmcnLCAnaW1hZ2VzL2ZvbnRzL2ZvbnRfMzJfcmVkLmZudCddLFxuICAgICdGT05UXzMyX1lFTExPVyc6IFsnaW1hZ2VzL2ZvbnRzL2ZvbnRfMzJfeWVsbG93LnBuZycsICdpbWFnZXMvZm9udHMvZm9udF8zMl95ZWxsb3cuZm50J10sXG4gICAgJ0ZPTlRfMzJfUFVSUExFJzogWydpbWFnZXMvZm9udHMvZm9udF8zMl9wdXJwbGUucG5nJywgJ2ltYWdlcy9mb250cy9mb250XzMyX3B1cnBsZS5mbnQnXVxufTtcblxuY2xhc3MgQXNzZXRzTWFuYWdlciB7XG5cbiAgICBsb2FkQXNzZXRzKGdhbWU6IFBoYXNlci5HYW1lKTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9hZEltYWdlcyhnYW1lKTtcbiAgICAgICAgdGhpcy5sb2FkU3ByaXRlcyhnYW1lKTtcbiAgICAgICAgdGhpcy5sb2FkRm9udHMoZ2FtZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkSW1hZ2VzKGdhbWU6IFBoYXNlci5HYW1lKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGltYWdlS2V5IGluIElNQUdFUykge1xuICAgICAgICAgICAgZ2FtZS5sb2FkLmltYWdlKGltYWdlS2V5LCBJTUFHRVNbaW1hZ2VLZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZFNwcml0ZXMoZ2FtZTogUGhhc2VyLkdhbWUpOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQgc3ByaXRlS2V5IGluIFNQUklURVMpIHtcbiAgICAgICAgICAgIGdhbWUubG9hZC5zcHJpdGVzaGVldChcbiAgICAgICAgICAgICAgICBzcHJpdGVLZXksXG4gICAgICAgICAgICAgICAgPHN0cmluZz4gU1BSSVRFU1tzcHJpdGVLZXldWzBdLFxuICAgICAgICAgICAgICAgIDxudW1iZXI+IFNQUklURVNbc3ByaXRlS2V5XVsxXSxcbiAgICAgICAgICAgICAgICA8bnVtYmVyPiBTUFJJVEVTW3Nwcml0ZUtleV1bMl0sXG4gICAgICAgICAgICAgICAgPG51bWJlcj4gU1BSSVRFU1tzcHJpdGVLZXldWzNdXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkRm9udHMoZ2FtZTogUGhhc2VyLkdhbWUpOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQgZm9udEtleSBpbiBGT05UUykge1xuICAgICAgICAgICAgZ2FtZS5sb2FkLmJpdG1hcEZvbnQoXG4gICAgICAgICAgICAgICAgZm9udEtleSxcbiAgICAgICAgICAgICAgICBGT05UU1tmb250S2V5XVswXSxcbiAgICAgICAgICAgICAgICBGT05UU1tmb250S2V5XVsxXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5leHBvcnQgY29uc3QgYXNzZXRzTWFuYWdlciA9IG5ldyBBc3NldHNNYW5hZ2VyKCk7XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuXG5leHBvcnQgY2xhc3MgQ29pbiBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZDogJ2NvaW4nLFxuICAgICAgICAgICAgaW52ZW50b3J5SW1hZ2VJZDogJ0NPSU5fSU5WJyxcbiAgICAgICAgICAgIG5hbWU6ICdDT0lOJyxcbiAgICAgICAgICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgbG9va0FjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnSV9BTV9OT1RfUklDSF9CVVRfSVRfSVNfQV9TVEFSVCcpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL2VuZ2luZS9tb2RlbHMvR2FtZSc7XG5pbXBvcnQgeyBET0NUT1JUSUxMQV9MQUJFTFMgfSBmcm9tICcuL0RvY3RvcnRpbGxhTGFiZWxzJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBCYWNrc3RhZ2VTY2VuZSB9IGZyb20gJy4vYmFja3N0YWdlU2NlbmUvQmFja3N0YWdlU2NlbmUnO1xuaW1wb3J0IHsgQmFja3lhcmRTY2VuZSB9IGZyb20gJy4vYmFja3lhcmRTY2VuZS9CYWNreWFyZFNjZW5lJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi9lbmdpbmUvdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyB1aUJsb2NrZXIgfSBmcm9tICcuLi9lbmdpbmUvdWkvVUlCbG9ja2VyLnNpbmdsZXRvbic7XG5cbmV4cG9ydCBjbGFzcyBEb2N0b3J0aWxsYUdhbWUgZXh0ZW5kcyBHYW1lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBsYWJlbHM6IERPQ1RPUlRJTExBX0xBQkVMUyxcbiAgICAgICAgICAgIHBsYXllcjogbmV3IERvY3RvcnRpbGxhUGxheWVyKCksXG4gICAgICAgICAgICBzY2VuZXM6IFtcbiAgICAgICAgICAgICAgICBuZXcgQmFja3N0YWdlU2NlbmUoKSxcbiAgICAgICAgICAgICAgICBuZXcgQmFja3lhcmRTY2VuZSgpXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaW5pdGlhbFNjZW5lSWQ6ICdCQUNLU1RBR0UnXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvblN0YXJ0KCk6IHZvaWQge1xuICAgICAgICB1aUJsb2NrZXIuYmxvY2soKTtcbiAgICAgICAgbGV0IHBsYXllciA9IHRoaXMub3B0aW9ucy5wbGF5ZXI7XG4gICAgICAgIHBsYXllci5tb3ZlVG8oeyB4OiAxMTUsIHk6IDE4N30pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLndhaXQoMTAwMCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHBsYXllci5sb29rQXQoRGlyZWN0aW9ucy5ET1dOKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnTEFURV9GT1JfQ09OQ0VSVCcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIud2FpdCgxMDAwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnQUdBSU4nKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLndhaXQoMTAwMCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1RIRV9PVEhFUlNfV0lMTF9CRV9SRUFEWScpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIubW92ZVRvKHsgeDogMzgzLCB5OiAxODN9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdWlCbG9ja2VyLnVuYmxvY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IElMYWJlbHMgIH0gZnJvbSAnLi4vZW5naW5lL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgRE9DVE9SVElMTEFfTEFCRUxTOiBJTGFiZWxzID0ge1xuICAgICdlcyc6IHtcbiAgICB9LFxuICAgICdlbic6IHtcbiAgICAgICAgJ0FfQlJPT01fVEhFX1BFUkZFQ1RfQ0xFQU5JTkdfSU5TVFJVTUVOVCc6ICdBIGJyb29tLCB0aGUgcGVyZmVjdCBjbGVhbmluZyBpbnN0cnVtZW50LicsXG4gICAgICAgICdBX1JBTkNJRF9BTkRfR1JFQVNZX1NBTkRXSElDSCc6ICdBIHJhbmNpZCBhbmQgR1JFQVNZIHNhbmR3aGljaC4nLFxuICAgICAgICAnQUdBSU4nOiAnQWdhaW4uLi4nLFxuICAgICAgICAnQUxMX0lOX0FMTF9IRV9JU19BX0dPT0RfR1VZJzogJ0EgbmljZSBndXksIHRoaXMgQmlsaS4nLFxuICAgICAgICAnQUxMX1JFQURZX0ZJTkRfQklMSSc6ICdBbGwgaXMgc29sdmVkIG5vdyEgTGV0IG1lIGdyYWIgQmlsaSBhbmQgd2VcXCdsbCBzdGFydC4nLFxuICAgICAgICAnQU5EX0VYUEVOU0lWRSc6ICcuLi4gYW5kIGV4cGVuc2l2ZS4nLFxuICAgICAgICAnQU5EX0lfQU1fTk9UX0dPSU5HX1RPX0dJVkVfSElNX0FOWSc6ICdBbmQgSSBhbSBub3QgcGxhbm5pbmcgb24gZ2l2aW5nIGhpbSBhbnkgbW9yZS4nLFxuICAgICAgICAnQU5EX1dFX0xFQVJORUQnOiAnYW5kIHdlIGxlYXJuZWQuJyxcbiAgICAgICAgJ0FSR0gnOiAnQXJnaCEnLFxuICAgICAgICAnQVNLX0FCT1VUX0NBQkxFJzogJ1doZXJlIGRvIEkgZmluZCBhIGNhYmxlIG5vdywgeW91IGxhenkgYmFzdGFyZHM/JyxcbiAgICAgICAgJ0FTS19BQk9VVF9DT1NUVU1FJzogJ1RlbGwgbWUgbW9yZSBhYm91dCB0aGF0IG1pc3NpbmcgY29zdHVtZS4nLFxuICAgICAgICAnQVNLX0FCT1VUX1NBTlRJJzogJ1doYXRcXCdzIHRoZSBtYXR0ZXIgd2l0aCB5b3UgU2FudGk/JyxcbiAgICAgICAgJ0JBQ0tTVEFHRSc6ICdiYWNrc3RhZ2UnLFxuICAgICAgICAnQkFDS1lBUkQnOiAnYmFja3lhcmQnLFxuICAgICAgICAnQkFDT04nOiAnYmFjb24nLFxuICAgICAgICAnQkFMTE9PTic6ICdiYWxsb29uJyxcbiAgICAgICAgJ0JBUkVMWV9UQVNURURfTElLRV9EUlVHJzogJ1dlbGwsIGl0IGJhcmVseSB0YXN0ZWQgbGlrZSBkcnVncy4uLicsXG4gICAgICAgICdCRUFVVElGVUxfU09NRVRISU5HJzogJ1RoYXQgaXMgYSBiZWF1dGlmdWwgc29tZXRoaW5nLicsXG4gICAgICAgICdCSUxJJzogJ0JpbGknLFxuICAgICAgICAnQklMSV9NVVNUX0JFX09VVF9USEVSRV9TTU9LSU5HJzogJ0JpbGkgbXVzdCBiZSBvdXQgdGhlcmUgc21va2luZy4nLFxuICAgICAgICAnQk9DQURJTExPJzogJ2JhY29uIHNhbmR3aGljaCcsXG4gICAgICAgICdCVVJQJzogJ0J1cnAhJyxcbiAgICAgICAgJ0JSRUFEJzogJ2JyZWFkJyxcbiAgICAgICAgJ0JSRUFEX0xFRlRPVkVSU19OT1RfVVNFRlVMJzogJ0JyZWFkIGxlZnRvdmVycywgbm90IHZlcnkgdXNlZnVsLicsXG4gICAgICAgICdCUk9PTSc6ICdicm9vbScsXG4gICAgICAgICdDQUJMRSc6ICdjYWJsZScsXG4gICAgICAgICdDQU4nOiAnc29kYSBjYW4nLFxuICAgICAgICAnQ0FOTk9UX1BJQ0tfQV9ET09SX1VQJzogJ0kgb2J2aW91c2x5IGNhbm5vdCBwaWNrIHRoZSBkb29yIHVwLiBJIHdvdWxkIGRlc3Ryb3kgdGhlIGJ1aWxkaW5nLicsXG4gICAgICAgICdDTE9OSyc6ICdDbG9ua1xcbiAgIGNsb25rXFxuICAgICAgY2xvbmsnLFxuICAgICAgICAnQ09DT05VVCc6ICdjb2NvbnV0JyxcbiAgICAgICAgJ0NPSU4nOiAnY29pbicsXG4gICAgICAgICdDT09MX05PV19JX1NIT1VMRF9HSVZFX0lUX1RPX1RIRV9HVVlTJzogJ0Nvb2wsIG5vdyBJIHNob3VsZCBnaXZlIHRoYXQgdG8gdGhlIGd1eXMuJyxcbiAgICAgICAgJ0NPTVBBUkVfQ09NUFJBTUVfVU5fQ09DTyc6ICdBIGNvY29udXQsIHJvdWdoIHNraW4sIGRlbGljaW91cyBjb250ZW50LicsXG4gICAgICAgICdDT1NUVU1FJzogJ2Nvc3R1bWUnLFxuICAgICAgICAnREVMSUNJT1VTX0FORF9HUkVBU1knIDogJ0RlbGljaW91cyBhbmQgR1JFQVNZIScsXG4gICAgICAgICdET0VTX0lUX0xPT0tfTElLRV9BX1BBSVJfT0ZfVElUUyc6ICdEb2VzIGl0IGxvb2sgbGlrZSBhIHBhaXIgb2YgdGl0cz8nLFxuICAgICAgICAnRE9PUl9UT19CQUNLU1RBR0UnOiAnZG9vciB0byBiYWNrc3RhZ2UnLFxuICAgICAgICAnRE9PUl9UT19CQUNLWUFSRCc6ICdkb29yIHRvIGJhY2t5YXJkJyxcbiAgICAgICAgJ0RPT1JfVE9fU1RBR0UnOiAnZG9vciB0byBzdGFnZScsXG4gICAgICAgICdET09SX1RPX1NUUkVFVCc6ICdkb29yIHRvIHN0cmVldCcsXG4gICAgICAgICdEUlVHU19BUkVfQkFEJzogJy4uLiB5ZWFoIG1hbiBkcnVncyBhcmUgcmVhbGx5IGJhZCAuLi4nLFxuICAgICAgICAnRFJVTktfMSc6ICdOcG8gYW1uIHRpIGFtIHBlcmZlY3l0bHkgZmFpbmUuJyxcbiAgICAgICAgJ0RSVU5LXzInOiAnU3RoZSBmdWNrPyBpIGhhdnVlIG5ldmVyIGJlZmVuIG1vcmUgb3NyYmUhJyxcbiAgICAgICAgJ0RSVU5LXzMnOiAnVGhpcyBpcyBlYSBsa2VnZW5kYXJ5IGV2ZW5uZ2kgcm9mIGhzZXggYW5kIGRydWdmcyEnLFxuICAgICAgICAnRFJVTktfNCc6ICdTaHV0IHVqcCBrYW5kIGJyaW5nIG1lIG1vYXJlIGIuZXJlJyxcbiAgICAgICAgJ0RSVU5LXzUnOiAnWXVvIGFzcmUga215IGJzZXN0IHRmcm5laWQgYW5jZCBzaSBsZG92ZSB5b2l1LicsXG4gICAgICAgICdEUlVOS182JzogJ1R0aGUgbXJlcHRpbGluYXMgaWFyZSBjb21uaWcgZm9yIHl1byBub3cuJyxcbiAgICAgICAgJ0RSVU5LX0JJTEknOiAnZHJ1bmsgQmlsaScsXG4gICAgICAgICdGSU5BTExZX0lfR09UX1RIRV9DQUJMRSc6ICdGaW5hbGx5IEkgZ290IHRoZSBjYWJsZSEnLFxuICAgICAgICAnRklSU1RfQU5HRUxfQ0FCTEUnIDogJ0ZpcnN0LCB3ZSBuZWVkIGEgY2FibGUgdG8gcGx1ZyBBbmdlbFxcJ3MgYW1wLicsXG4gICAgICAgICdGSVJTVF9JX05FRURfVE9fR0VUX1RIRV9CQU5EX1JFQURZJyA6ICdGaXJzdCBJIG5lZWQgdG8gZ2V0IHRoZSBiYW5kIHJlYWR5LicsXG4gICAgICAgICdGTE9XRVJTJzogJ2Zsb3dlcnMnLFxuICAgICAgICAnRk9VTkRfVEhFX0NBQkxFJzogJ0kgZm91bmQgYSBjYWJsZSEnLFxuICAgICAgICAnR0xBU1MnOiAnZ2xhc3MnLFxuICAgICAgICAnR09UX1RIRV9DT1NUVU1FJzogJ0kganVzdCBtYWRlIGEgY29zdHVtZSBmb3IgeW91LicsXG4gICAgICAgICdHVUxQX0dVTFBfR1VMUCc6ICdHdWxwXFxuICAgR3VscFxcbiAgICAgIEd1bHAnLFxuICAgICAgICAnSEFWRV9BX0RSSU5LX1NBTlRJJzogJ0hleSBTYW50aSwgaGVyZSwgaGF2ZSB0aGlzIGRyaW5rLicsXG4gICAgICAgICdIQVZFX0lfRVZFUl9GQUlMRURfWU9VJzogJ0hhdmUgSSBldmVyIGZhaWxlZCB5b3U/JyxcbiAgICAgICAgJ0hBVkVfWU9VX1NFRU5fQklMSSc6ICdNbW0sIElcXCdtIG1pc3NpbmcgQmlsaSwgd2hlcmUgaXMgaGU/JyxcbiAgICAgICAgJ0hFX0lTX0JFSU5HX0dPT0RfRk9SX05PV19OT19ORUVEX1RPX0VYUExPREVfSVQnOiAnSGUgaXMgYmVpbmcgZ29vZCBmb3Igbm93LCBubyBuZWVkIHRvIGV4cGxvZGUgaGlzIGJhbGxvb24uJyxcbiAgICAgICAgJ0hFX0lTX0RSSU5LSU5HX0xJS0VfQV9NQU5JQUMnOiAnSGUgaXMgZHJpbmtpbmcgbGlrZSBhIG1hbmlhYywgSSBuZWVkIHRvIHN0YXJ0IHRoZSBjb25jZXJ0IGFzIHNvb24gYXMgcG9zc2libGUuJyxcbiAgICAgICAgJ0hFX0lTX09VVF9TTU9LSU5HJzogJ0hlXFwncyBvdXRzaWRlLCBkcmlua2luZyBhbmQgc21va2luZy4gSWYgd2UgbGV0IGhpbSB0aGVyZSB0b28gbXVjaCB0aW1lIGhlXFwnbGwgYmUgZHJ1bmsgYXMgYSBza3Vuay4nLFxuICAgICAgICAnSEVfSVNfRFJVTktfQVNfQV9TS1VOSyc6ICdZdXAsIG5vdyBoZSBpcyBkcnVuayBhcyBhIHNrdW5rLicsXG4gICAgICAgICdIRVlfQklMSV9IT1dfSVNfSVRfR09JTkcnOiAnSGV5IEJpbGkgaG93IGlzIGl0IGdvaW5nPycsXG4gICAgICAgICdISV9ET09SX0hPV19BUkVfWU9VX1RPREFZJzogJ0hpIGRvb3IhIEhvdyBhcmUgeW91IHRvZGF5PycsXG4gICAgICAgICdISV9USEVSRSc6ICdIaSB0aGVyZS4nLFxuICAgICAgICAnSE9XX0lTX0JJTElfRE9JTkcnOiAnSG93IGlzIEJpbGkgZG9pbmcsIGJ5IHRoZSB3YXk/JyxcbiAgICAgICAgJ0lfQUxSRUFEWV9IQVZFX0lUJzogJ0kgYWxyZWFkeSBoYXZlIGl0LicsXG4gICAgICAgICdJX0FMUkVBRFlfUFVTSEVEX0lUJzogJ0kgYWxyZWFkeSBwdXNoZWQgaXQsIEkgZG9uXFwndCB3YW5uYSBvdmVyIGRvIGl0LicsXG4gICAgICAgICdJX0FNX0FXQUtFJzogJ0FoaGhoaCEgSSBBTSBBV0FLRSEhIScsXG4gICAgICAgICdJX0FNX0pVU1RfS0VFUElOR19NWV9USFJPQVRfV0FSTSc6ICdJIGFtIGp1c3Qga2VlcGluZyBteSB0aHJvYXQgd2FybSwgbm8gd29ycmllcy4nLFxuICAgICAgICAnSV9BTV9OT1RfRFJVTktfQU5ZTU9SRSc6ICdXb3chIEkgYW0gbm90IGRydW5rIGFueW1vcmUuJyxcbiAgICAgICAgJ0lfQU1fTk9UX1JJQ0hfQlVUX0lUX0lTX0FfU1RBUlQnOiAnSVxcJ20gbm90IGV4YWN0bHkgcmljaCwgYnV0IGl0XFwncyBhIHN0YXJ0IScsXG4gICAgICAgICdJX0FNX05PVF9HT0lOR19UT19BU0tfV0hFUkVfVEhJU19DT01FU19GUk9NJzogJ0lcXCdtIG5vdCBnb2luZyB0byBhc2sgd2hlcmUgeW91IGdvdCB0aGlzIGZyb20uJyxcbiAgICAgICAgJ0lfQU1fU1RBVFJJTkdfVE9fRkVFTF9SRUFEWV9UT19QTEFZJzogJ0l0XFwncyB3ZWlyZCwgSSBhbSBzdWRkZW5kbHkgc3RhcnRpbmcgdG8gZmVlbCByZWFkeSB0byBwbGF5LicsXG4gICAgICAgICdJX0JFVF9JX0NPVUxEX0RPX0FfQkVBVVRJRlVMX0NPU1RVTUVfV0lUSF9JVCc6ICdJIGJldCBJIGNvdWxkIGRvIGEgYmVhdXRpZnVsIGNvc3R1bWUgd2l0aCB0aGlzLicsXG4gICAgICAgICdJX0JFVF9USElTX0RVU1RfQ0FOX01BS0VfU09NRUJPRFlfTEVTU19TSFknOiAnSSBiZXQgdGhpcyBcImR1c3RcIiBjYW4gbWFrZSBcInNvbWVib2R5XCIgbGVzcyBzaHknLFxuICAgICAgICAnSV9DQU5fSEVBUl9USEVfQ1JPV0RfV0FJVElOR19GT1JfVVMnOiAnSSBjYW4gaGVhciB0aGUgY3Jvd2Qgd2FpdGluZyBmb3IgdXMsIGdvb2QgdGhpbmcgdGhpcyBkb29yIGlzIHByb3RlY3RpbmcgdXMuJyxcbiAgICAgICAgJ0lfQ0FOVF9NT1ZFX1RIQVQnOiAnSSBjYW5cXCd0IG1vdmUgdGhhdC4nLFxuICAgICAgICAnSV9DQU5UX0RPX1RIQVQnOiAnSSBjYW5cXCd0IGRvIHRoYXQuJyxcbiAgICAgICAgJ0lfQ09VTERfTUFLRV9BX1dJR19XSVRIX1RISVMnOiAnSSB0aGluayBJIGNvdWxkIG1ha2UgYSBibG9uZGUgd2lnIHdpdGggdGhpcy4nLFxuICAgICAgICAnSV9ET05UX0tOT1dfSE9XX1RPX0RPX1RIQVQnOiAnSSBkb25cXCd0IGtub3cgaG93IHRvIGRvIHRoYXQuJyxcbiAgICAgICAgJ0lfRE9OVF9LTk9XX0hPV19UT19VU0VfVEhBVF9XSVRIX1ZFTkRJTkdfTUFDSElORSc6ICdJIGRvblxcdCBrbm93IGhvdyB0byB1c2UgdGhhdCB3aXRoIGEgdmVuZGluZyBtYWNoaW5lLi4uJyxcbiAgICAgICAgJ0lfSEFWRV9BX0NPTkNFUlRfVE9fUExBWSc6ICdJIGhhdmUgYSBjb25jZXJ0IHRvIHBsYXkhJyxcbiAgICAgICAgJ0lfSEFWRV9CRVRURVJfVEhJTkdTX1RPX0RPX1RIQU5fVEFMS0lORyc6ICdJIGhhdmUgYmV0dGVyIHRoaW5ncyB0byBkbyB0aGFuIHRhbGtpbmcgdG8gb2JqZWN0cy4nLFxuICAgICAgICAnSV9IQVZFX1RPX0ZJTkRfQV9XQVlfVE9fU09CRVJfSElNX1VQJzogJ0kgaGF2ZSB0byBmaW5kIGEgd2F5IHRvIHNvYmVyIGhpbSB1cC4nLFxuICAgICAgICAnSV9IQVZFX1RPX0ZJTklTSF9USEVfQ09TVFVNRV9GSVJTVCc6ICdJIGhhdmUgdG8gZmluaXNoIHRoZSBjb3N0dW1lIGZpcnN0LicsXG4gICAgICAgICdJX0hBVkVfVE9fUElDS19JVF9VUF9GSVJTVCc6ICdJIGhhdmUgdG8gcGljayBpdCB1cCBmaXJzdC4nLFxuICAgICAgICAnSV9IRUFSRF9USEVfR1VZU19BUkVfSEFWSU5HX1NPTUVfUFJPQkxFTVMnOiAnSSBoZWFyZCB0aGUgZ3V5cyBhcmUgaGF2aW5nIHNvbWUgcHJvYmxlbXMuJyxcbiAgICAgICAgJ0lfU0hPVUxEX0FERF9BX1NLSVJUX1RPX0lUJzogJ0kgc2hvdWxkIGFkZCBhIHNraXJ0IHRvIGl0LicsXG4gICAgICAgICdJX1NIT1VMRF9QUk9CQUJMWV9NSVhfSVRfSU5fQV9HTEFTUyc6ICdJIHNob3VsZCBwcm9iYWJseSBtaXggaXQgaW4gYSBnbGFzcy4nLFxuICAgICAgICAnSV9TSE9VTERfUFVUX1NPTUVUSElOR19NT1JFX0lOVEVSRVNUSU5HX0lOX1RIRV9HTEFTUyc6ICdJIHNob3VsZCBwdXQgc29tZXRoaW5nIG1vcmUgaW50ZXJlc3RpbmcgaW4gdGhlIGdsYXNzIGJlZm9yZSBnaXZpbmcgaXQgdG8gdGhlbS4nLFxuICAgICAgICAnSV9USElOS19JX0NBTl9PUEVOX0lUX0FORF9UQUtFX1RIRV9CQUNPTic6ICdJIHRoaW5rIEkgY2FuIG9wZW4gaXQgYW5kIHRha2UgdGhlIGJhY29uLicsXG4gICAgICAgICdJX1RISU5LX01ZX01BU1RFUlBJRUNFX0lTX0NPTVBMRVRFJzogJ0kgdGhpbmsgbXkgbWFzdGVycGllY2UgaXMgY29tcGxldGUuJyxcbiAgICAgICAgJ0lfV0lMTF9XQUlUX0ZPUl9USEVNX1RPX0JFX1NPTFZFRCc6ICdJIHdpbGwgd2FpdCBmb3IgdGhlbSB0byBiZSBzb2x2ZWQgYXV0b21hZ2ljYWxseS4nLFxuICAgICAgICAnSV9XT1VMRF9ET19JVF9NWVNFTEYnOiAnSSB3b3VsZCBkbyBpdCBteXNlbGYsIGJ1dCBpdCBpcyBraW5kIG9mIGlsbGVnYWwuLi4nLFxuICAgICAgICAnSV9XT1VMRE5UX0tOT1dfV0hBVF9UT19TQVknOiAnSSB3b3VsZG5cXCd0IGtub3cgd2hhdCB0byBzYXkuJyxcbiAgICAgICAgJ0lGX0lfQUREX1NPTUVfQk9PQlNfSVRfV0lMTF9MT09LX0xJS0VfQV9IQVdBSUlBTl9EUkVTUyc6ICdJZiBJIGFkZCBzb21lIGJvb2JzIGl0IHdpbGwgbG9vayBsaWtlIGEgaGF3YWlpYW4gZHJlc3MuJyxcbiAgICAgICAgJ0lGX0lfQ09VTERfUFVUX0dSRUFTRV9CRUxPVyc6ICdJZiBJIGNvdWxkIGp1c3QgcHV0IHNvbWUgZ3JlYXNlIGJlbG93IGl0Li4uJyxcbiAgICAgICAgJ0lNUExJRVNfTU9WRU1FTlQnOiAnLi4uIGFuZCBpdCBpbXBsaWVzIGEgY2VydGFpbiBhbW1vdW50IG9mIGVmZm9ydCBhbmQgbW92ZW1lbnQuJyxcbiAgICAgICAgJ0lUX0lTX0FfTE9OR19USU1FX1RSQURJVElPTl9USEFUX1dFX0FMTF9EUkVTU0VEX1VQJzogJ0l0IGlzIGEgdHJhZGl0aW9uIHRoYXQgc3RhcnRlZCBsb25nIHRpbWUgYWdvLCBkcmVzc2luZyB1cCBmb3Igb3VyIGNvbmNlcnRzLi4uJyxcbiAgICAgICAgJ0lUX0lTX0FMUkVBRFlfQ0xPU0VEJzogJ0l0IGlzIGFscmVhZHkgY2xvc2VkLicsXG4gICAgICAgICdJVF9JU19BTFJFQURZX0ZVTEwnOiAnSXQgaXMgYWxyZWFkeSBmdWxsLicsXG4gICAgICAgICdJVF9JU19JTkRFRURfQV9HTEFTUyc6ICdJdCBpcyBpbmRlZWQgYSBnbGFzcy4nLFxuICAgICAgICAnSVRfSVNfU1RVQ0tfQkVISU5EX1RIRV9WRU5ESU5HX01BQ0hJTkUnOiAnSXQgaXMgc3R1Y2sgYmVoaW5kIHRoZSB2ZW5kaW5nIG1hY2hpbmUsIEkgbmVlZCB0byBtb3ZlIGl0IHNvbWVob3cuJyxcbiAgICAgICAgJ0lUX1dBU19DT1dCT1lfQ09TVFVNRSc6ICdJdCB3YXMgYSBjb3dib3kgY29zdHVtZSwgbWFuLiBBIGNvb2wgb25lLicsXG4gICAgICAgICdJU19TT01FSE9XX0RBTkdFUk9VUyc6ICcuLi4gbWFyZ2luYWxseSBkYW5nZXJvdXMsIEkgd291bGQgc2F5Li4uJyxcbiAgICAgICAgJ0pVU1RfU1RFQUxfT05FJzogJ0RvblxcJ3Qga25vdyBtYW4sIGp1c3Qgc3RlYWwgb25lIHNvbWV3aGVyZS4nLFxuICAgICAgICAnTEFURV9GT1JfQ09OQ0VSVCc6ICdNYW4gSSBhbSB0d28gaG91cnMgbGF0ZSB0byBteSBvd24gY29uY2VydC4nLFxuICAgICAgICAnTEVUX1NfU0FZX0lfSEFWRV9NWV9TT1VSQ0VTJzogJ0xldFxcJ3Mgc2F5IEkgaGF2ZSBteSBzb3VyY2VzLi4uJyxcbiAgICAgICAgJ0xFVFNfRklYX1RISVNfTUVTUyc6ICdPSywgbGV0XFwncyBzZWUgaWYgSSBjYW4gZml4IHRoaXMgZGlzYXN0ZXIuJyxcbiAgICAgICAgJ01BREVfT0ZfTUVUQUxfUlVTVF9BTkRfU1RJQ0tZX1NUVUZGJzogJ0Rvb3IuIENvbXBvc2l0aW9uOiA4MCUgbWV0YWwsIDE1JSBydXN0LCA1JSB1bmlkZW50aWZpZWQgc3RpY2t5IHN0dWZmLicsXG4gICAgICAgICdNQU5fWU9VX1NIT1VMRF9LTk9XX1RISVMnOiAnTWFuLCB5b3Ugc2hvdWxkIGtub3cgdGhpcywgeW91IHN0YXJ0ZWQgaXQhJyxcbiAgICAgICAgJ01JTkVfV0FTX1dBWV9CRVRURVInOiAnTWluZSB3YXMgV0FZIGJldHRlci4nLFxuICAgICAgICAnTU1NX0FfUkVGUkVTSElOR19CRVZFUkFHRSc6ICdNbW0gYSByZWZyZXNoaW5nIGJldmVyYWdlISBUaGFua3MhJyxcbiAgICAgICAgJ05JQ0VfQ09TVFVNRV9IRV9NQURFJzogJ0hleSEgSGUgbWFkZSBhIHJlYWxseSBnb29kIGNvc3R1bWUgdGhpcyB0aW1lIScsXG4gICAgICAgICdOSUNFX0lUX1dJTExfU0xJREVfUkVBTExZX1dFTExfTk9XJzogJ05pY2UsIGl0IHdpbGwgc2xpZGUgcmVhbGx5IHdlbGwgbm93Li4uJyxcbiAgICAgICAgJ05JQ0VfT0JKRUNUJzogJ05pY2Ugb2JqZWN0LicsXG4gICAgICAgICdOSUNFX1NBRkVfRE9PUic6ICdJdCBpcyBkb29yLiBVc2VmdWwgdG8gbWFrZSBwZW9wbGUgZmVlbCBzYWZlIGFuZCBjb3p5IGluc2lkZSBvZiBwbGFjZXMuJyxcbiAgICAgICAgJ05PUEVfSV9DQU5OT1RfR09fVE9fVEhFX1NUUkVFVCc6ICdOb3BlLCBJIGNhblxcJ3QgZ28gdG8gdGhlIHN0cmVldCB5ZXQuJyxcbiAgICAgICAgJ05PUEVfSV9DQU5OT1RfR09fVE9fVEhFX1NUQUdFJzogJ05vcGUsIEkgY2FuXFwndCBnbyB0byB0aGUgc3RhZ2UgeWV0LicsXG4gICAgICAgICdOT1BFX0lfRE9OVF9XQU5UX1RPX1RBS0VfQklMSVNfQkFMTE9PTic6ICdOb3BlLCBJIGRvblxcJ3Qgd2FubmEgdGFrZSBCaWxpXFwncyBiYWxsb29uLiBIZSBuZWVkcyBpdCBmb3IgaGlzIGNvc3R1bWUuJyxcbiAgICAgICAgJ05PVF9UT19CQURfQUxMX1RISU5HU19DT05TSURFUkVEJzogJ05vdCBiYWQgYWxsIHRoaW5ncyBjb25zaWRlcmVkLicsXG4gICAgICAgICdOT1RfU0FGRV9IQVZJTkdfU0NJU1NPUlNfQVJPVU5EX01VU0lDSUFOUyc6ICdOb3Qgc2FmZSBoYXZpbmcgc2Npc3NvcnMgYXJvdW5kIG11c2ljaWFucy4nLFxuICAgICAgICAnTk9UX1NBWUlOR19XRV9TSE9VTERfVVNFX1RIRU0nOiAnSSBhbSBub3Qgc2F5aW5nIHdlIHNob3VsZCB1c2VkIHRoZW0sIGJ1dC4uLicsXG4gICAgICAgICdPSF9MT09LX0FUX1RIQVQnOiAnT2ghIExvb2sgYXQgdGhhdC4nLFxuICAgICAgICAnT0hfTVlfWU9VX0FSRV9EUlVOS19BUkVOVF9ZT1UnOiAnT2ggbXkhIFlvdXIgYXJlIHRvdGFsbHkgZHJ1bmssIGFyZW5cXCd0IHlvdT8nLFxuICAgICAgICAnT0tfSV9MTF9QVVRfSVRfT04nOiAnT2ssIGJvc3MsIElcXCdsbCBwdXQgaXQgb24uJyxcbiAgICAgICAgJ09LX1NFRV9ZT1VfTEFURVInOiAnT2sgbWFuLCBzZWUgeW91IGxhdGVyIScsXG4gICAgICAgICdQTEVBU0VfRE9OVF9EUklOS19UT09fTVVDSCc6ICdQbGVhc2UgZG9uXFwndCBkcmluayB0b28gbXVjaCwgSSB3aWxsIHNvbHZlIHRoaXMgcmVhbGx5IHNvb24hJyxcbiAgICAgICAgJ1BST0JBQkxZX0lGX0lfU0NBUkVfSElNX0hFX1dJTExfV0FLRV9VUCc6ICdQcm9iYWJseSBpZiBJIHNjYXJlZCBoaW0gaGUgd291bGQgc29iZXIgdXAuJyxcbiAgICAgICAgJ1BST0JMRU1TX0lfQU1fT1VUJzogJ1Byb2JsZW1zPyBDb21wbGljYXRpb25zPyBJXFwnbSBvdXR0YSBoZXJlIG1hbi4uLicsXG4gICAgICAgICdQUk9CTEVNU19MRVRfTUVfSEVMUCc6ICdQcm9ibGVtcz8gUGxlYXNlIHRlbGwgbWUgbW9yZSwgZGVhciBmcmllbmRzLicsXG4gICAgICAgICdSRUFEWV9UT19QTEFZJzogJ0hleSBndXlzISBSZWFkeSB0byByb2NrPyEnLFxuICAgICAgICAnUkVBTExZX1VTRUZVTF9UT19QVVRfTElRVUlEU19JTlNJREUnOiAnUmVhbGx5IHVzZWZ1bCB0byBwdXQgbGlxdWlkcyBvciBvdGhlciBzdWJzdGFuY2VzIGluc2lkZS4nLFxuICAgICAgICAnUkVTVF9PRl9USEVfQkFORCc6ICdyZXN0IG9mIHRoZSBiYW5kJyxcbiAgICAgICAgJ1NFQ09ORF9KVUFOX0NPU1RVTUUnOiAnU2Vjb25kLCB3ZSBuZWVkIGEgY29zdHVtZSBmb3IgSnVhbiwgaGUgZm9yZ290IGhpcyBhdCBob21lLicsXG4gICAgICAgICdTRUVfWU9VX1NPT04nOiAnU2VlIHlvdSBzb29uIScsXG4gICAgICAgICdTQ0lTU09SUyc6ICdzY2lzc29ycycsXG4gICAgICAgICdTSEVfSVNfU0hZX0RPRVNOVF9XQU5UX1RPX1RBTEtfVE9fTUUnOiAnU2hlIGlzIHNoeSwgZG9lc25cXCd0IHdhbnQgdG8gdGFsayB3aXRoIG1lIHRvZGF5LicsXG4gICAgICAgICdTSElOWV9BTkRfU0hBUlAnOiAnU2hpbnkgYW5kIHNoYXJwIScsXG4gICAgICAgICdTS0lSVCc6ICdza2lydCcsXG4gICAgICAgICdTT19QTEVBU0VfRklORF9NRV9TT01FVEhJTkdfRUxFR0FOVF9JX0NBTl9VU0UnOiAnU28gcGxlYXNlIGZpbmQgYSByZWFsbHkgZWxlZ2FudCBjb3N0dW1lIHRoYXQgbGl2ZXMgdXAgdG8gbXkgZXhwZWN0YXRpb25zLicsXG4gICAgICAgICdTT19USElTX0lTX1RIRV9FTkRfRk9MS1MnOiAnU28gdGhpcyBpcyB0aGUgZW5kLCBmb2xrcy4nLFxuICAgICAgICAnU09fV0VfU09NRUhPV19ESVNUUkFDVF9USEVfQVRURU5USU9OJzogJy4uLiBzbyB3ZSBkaXN0cmFjdCBwZW9wbGUgZnJvbSB0aGUgZmFjdCB0aGF0IHdlIGRvblxcJ3Qga25vdyBob3cgdG8gcGxheS4nLFxuICAgICAgICAnU09NRV9DVUxUVVJFU19VU0VEX0RSVUdTJzogJ1lvdSBrbm93LCBzb21lIGN1bHR1cmVzIHVzZWQgZHJ1Z3MgdG8gZW5jb3VyYWdlIHdhcnJpb3JzLi4uJyxcbiAgICAgICAgJ1NPTUVfRkxPV0VSU19XT1VMRF9CRV9OSUNFJzogJ1NvbWUgZmxvd2VycyB3b3VsZCBiZSBuaWNlLicsXG4gICAgICAgICdTVVJFX0JPU1MnOiAnWWVzLCBzdXJlIGJvc3MhJyxcbiAgICAgICAgJ1NVU1BJQ0lPVVNfRFVTVCc6ICdzdXNwaWNpb3VzIGR1c3QnLFxuICAgICAgICAnVEFMS19UT19ZT1VfTEFURVInOiAnSSBoYXZlIHRvIGdvLCBzZWUgeW91IGxhdGVyIScsXG4gICAgICAgICdUSEFOS1NfRk9SX0hFTFBJTkdfTUVfSU5fVEhJU19BRFZFTlRVUkUnOiAnVGhhbmtzIGZvciBoZWxwaW5nIG1lIGluIHRoaXMgYWR2ZW50dXJlIScsXG4gICAgICAgICdUSEFUX0NBTk5PVF9CRV9DTE9TRUQnOiAnVGhhdCBjYW5ub3QgYmUgY2xvc2VkLicsXG4gICAgICAgICdUSEFUX0NBTk5PVF9CRV9PUEVORUQnOiAnVGhhdCBjYW5ub3QgYmUgb3BlbmVkLicsXG4gICAgICAgICdUSEFUX0lTX0FfSFVHRV9CQUxMT09OX1FVSVRFX1NDQVJZX0lGX0lUX0VYUExPREVTJzogJ1RoYXQgaXMgYSBodWdlIGJhbGxvb24sIGl0IHdvdWxkIGJlIHF1aXRlIHNjYXJ5IGlmIGl0IGV4cGxvZGVkLicsXG4gICAgICAgICdUSEFUX0lTX0FfU1RVUElEX0NPU1RVTUUnOiAnV2VsbCwgdGhhdCBpcyBhIHN0dXBpZCBjb3N0dW1lIGlmIEkgZXZlciBzYXcgb25lLicsXG4gICAgICAgICdUSEFUX0lTX01ZX0JBTkRfMSc6ICdUaGF0IGlzIG15IGJhbmQuIFRoZXkgbWF5IGJlIGxhenkgYW5kIG5vdCBzcGVjaWFsbHkgc2tpbGxlZCwgYnV0IHRoZXkgYXJlIG5pY2UgcGVvcGxlLicsXG4gICAgICAgICdUSEFUX0lTX01ZX0JBTkRfMic6ICdPaCBteSwgd2hhdCBhIGJhbmQhIFRoZSBiZXN0IGZyb20gdGhlIGJlc3QhJyxcbiAgICAgICAgJ1RIQVRfSVNfTVlfQkFORF8zJzogJ0xvb2sgYXQgdGhlbSwgc28gcGVhY2VmdWwsIG5vdCBtb3ZpbmcgYSBmaW5nZXIuLi4nLFxuICAgICAgICAnVEhBVF9TX1NPTUVfSElHSExZX1NVU1BJQ0lPVVNfV0hJVEVfUE9XREVSJzogJ1RoYXRcXCdzIHNvbWUgaGlnaGx5IHN1c3BpY2lvdXMgd2hpdGUgcG93ZGVyLicsXG4gICAgICAgICdUSEFUX1NfVEhFX0RPT1JfVE9fR09fQkFDS19UT19USEVfQkFDS1NUQUdFJzogJ1RoYXRcXCdzIHRoZSBkb29yIHRvIGdvIEJBQ0sgdG8gdGhlIEJBQ0tzdGFnZS4nLFxuICAgICAgICAnVEhBVF9TX1RIRV9TUElSSVQnOiAnVGhhdFxcJ3MgdGhlIHNwaXJpdCEnLFxuICAgICAgICAnVEhFX0ZMT09SX0lTX1NUSUNLWSc6ICdUaGUgZmxvb3IgaXMgc28gc3RpY2t5IGl0IGlzIGltcG9zc2libGUgdG8gbW92ZSBpdC4nLFxuICAgICAgICAnVEhFX09OTFlfVEhJTkdfSEVfV0FOVFNfUklHSFRfTk9XX0lTX0JFRVInOiAnVGhlIG9ubHkgdGhpbmcgaGUgd2FudHMgcmlnaHQgbm93IGlzIGJlZXIuJyxcbiAgICAgICAgJ1RIRV9PVEhFUlNfV0lMTF9CRV9SRUFEWSc6ICdCdXQgSSBhbSBzdXJlIHRoZSByZXN0IG9mIHRoZSBiYW5kIHdpbGwgYmUgcmVhZHksIGxldFxcJ3MgdGFsayB0byB0aGVtLicsXG4gICAgICAgICdUSEVSRV9BUkVfU09NRV9QUk9CTEVNU18xJzogJ0FjdHVhbGx5IHNvbWUgc21hbGwgcHJvYmxlbXMgaGF2ZSBhcmlzZWQuLi4nLFxuICAgICAgICAnVEhFUkVfQVJFX1NPTUVfUFJPQkxFTVNfMic6ICcuLi4gcmVhbGx5IG1pbm9yIGNvbXBsaWNhdGlvbnMgLi4uJyxcbiAgICAgICAgJ1RIRVJFX0FSRV9TT01FX1BST0JMRU1TXzMnOiAnLi4uIGEgQ1JBWlkgTUVTUy4nLFxuICAgICAgICAnVEhJUkRfU0FOVElfU0hZJzogJ0FuZCB0aGlyZCwgU2FudGkganVzdCBnb3Qgc2h5LiBIZSByZWZ1c2VzIHRvIHBsYXkuLi4nLFxuICAgICAgICAnVEhJU19DQUJMRV9DT1VMRF9CRV9VU0VGVUwnOiAnVGhpcyBjYWJsZSBjb3VsZCBiZSB1c2VmdWwsIG1heWJlIEkgY2FuIFwiYm9ycm93XCIgaXQuJyxcbiAgICAgICAgJ1RJTUVfVE9fR0lWRV9JVF9UT19KVUFOJzogJ1RpbWUgdG8gZ2l2ZSBpdCB0byBKdWFuLicsXG4gICAgICAgICdWRU5ESU5HX01BQ0hJTkUnOiAndmVuZGluZyBtYWNoaW5lJyxcbiAgICAgICAgJ1ZFUllfQkVBVVRJRlVMX0ZMT1dFUlMnOiAnVmVyeSBiZWF1dGlmdWwgZmxvd2Vycy4nLFxuICAgICAgICAnVklOVEFHRV9QUkVNSVVNX0NPU1RVTUUnOiAnQSB2aW50YWdlLCByZWFsbHkgcHJlbWl1bSBjb3N0dW1lIEkgbXVzdCBzYXkuJyxcbiAgICAgICAgJ1dFX0NBTl9QTEFZX1RIRV9DT05DRVJUX05PVyc6ICdXZSBjYW4gcGxheSB0aGUgY29uY2VydCBub3csIG15IGZyaWVuZC4nLFxuICAgICAgICAnV0VfQ1JJRUQnOiAnd2UgY3JpZWQnLFxuICAgICAgICAnV0VfRE9OVF9SRUhFQVJTRV9FTk9VR0gnOiAnTWFuLCB3ZSBoYXZlblxcJ3QgcHJhY3RpY2VkIGVub3VnaCwgd2UgYXJlIG5vdCByZWFkeSB0byBwbGF5IScsXG4gICAgICAgICdXRV9IQVZFX1RIUkVFX1BST0JMRU1TJzogJ0Jhc2ljYWxseSB3ZSBoYXZlIHRocmVlIHByb2JsZW1zLi4uJyxcbiAgICAgICAgJ1dFX0hBVkVOVF9QUkFDVElTRURfU0lOQ0VfMjAxMic6ICdJIHRoaW5rIGxhc3QgcmVoZWFyc2FsIHdhcyBpbiAyMDEyLicsXG4gICAgICAgICdXRV9MQVVHSEVEJzogJ1dlIGxhdWdoZWQsJyxcbiAgICAgICAgJ1dFTExfSV9IQURfQU5fQVdFU09NRV9DT1NUVU1FJzogJ1dlbGwgSSBoYWQgYW4gYXdlc29tZSBjb3N0dW1lLCB5b3Uga25vdz8nLFxuICAgICAgICAnV0hBVF9DQU5fV0VfRE9fR1VZUyc6ICdXaGF0IGNhbiB3ZSBkbyBndXlzPyBBbnkgaWRlYXM/JyxcbiAgICAgICAgJ1dIWV9DT1NUVU1FUyc6ICdXaHkgYXJlIHdlIGFsbCBkcmVzc2VkIHVwIGFueWhvdz8nLFxuICAgICAgICAnV0lTRV9QVVJDSEFTRSc6ICdUaGF0IHdhcyBhIHdpc2UgcHVyY2hhc2UuJyxcbiAgICAgICAgJ1lFUF9JX0NPVUxEX0JVSUxEX0FfQ09TVFVNRV9XSVRIX1RISVMnOiAnWWVwLCBJIGNvdWxkIGJ1aWxkIGEgY29zdHVtZSB3aXRoIHRoaXMuJyxcbiAgICAgICAgJ1lFU19NT00nOiAnWWVzLCBtb20uJyxcbiAgICAgICAgJ1lPVV9CRVRURVJfUFVUX0lUX09OJzogJ1lvdSBiZXR0ZXIgcHV0IGl0IG9uZSBiZWZvcmUgSSBnZXQgYW5ncnkuJyxcbiAgICAgICAgJ1lPVV9BUkVfQV9DT1dBUkRfTUFOX1dFX0hBVkVfQ09TVFVNRVMnOiAnRG9uXFwndCBiZSBhIHB1c3N5IG1hbi4uLiBXZSBoYXZlIG91ciBjb3N0dW1lcywgcGVvcGxlIGp1c3Qgd29uXFwndCBwYXkgYXR0ZW50aW9uIHRvIHRoZSBtdXNpYy4nLFxuICAgICAgICAnWU9VX1NUT0xFX0lUJzogJ1lvdSBzdG9sZSBpdCwgcmlnaHQ/JyxcbiAgICAgICAgJ1lPVVJfTEFDS19PRl9DT05GSURFTkNFX0RJU1NBUE9JTlRTX01FJzogJ09oIHBsZWFzZSEgWW91ciBsYWNrIG9mIGNvbmZpZGVuY2UgZGlzc2Fwb2ludHMgbWUuJ1xuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuLi9lbmdpbmUvbW9kZWxzL1BsYXllcic7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuaW1wb3J0IHsgQ29pbiB9IGZyb20gJy4vQmFja3N0YWdlU2NlbmUvQ29pbic7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi9lbmdpbmUvc3RhdGUvQWN0aXZlSW52ZW50b3J5LnNpbmdsZXRvbic7XG5pbXBvcnQgeyBzdHlsZSB9IGZyb20gJy4uL2VuZ2luZS91aS9TdHlsZSc7XG5pbXBvcnQgeyBzY2VuZXMgfSBmcm9tICcuLi9lbmdpbmUvc3RhdGUvU2NlbmVzLnNpbmdsZXRvbic7XG5cbmxldCBzcHJpdGVPcHRpb25zID0gbmV3IE1hcCgpO1xuXG5zcHJpdGVPcHRpb25zLnNldCgnc3RhbmRfcmlnaHQnLCB7IGZyYW1lczogWzBdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnd2Fsa19yaWdodCcsIHsgZnJhbWVzOiBbMSwgMiwgMywgNCwgNSwgNl19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCd0YWxrX3JpZ2h0JywgeyBmcmFtZXM6IFsyMSwgMjIsIDIzLCAyNCwgMjUsIDI2XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3N0YW5kX2xlZnQnLCB7IGZyYW1lczogWzBdLCBpbnZlcnNlOiB0cnVlfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnd2Fsa19sZWZ0JywgeyBmcmFtZXM6IFsxLCAyLCAzLCA0LCA1LCA2XSwgaW52ZXJzZTogdHJ1ZX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3RhbGtfbGVmdCcsIHsgZnJhbWVzOiBbMjEsIDIyLCAyMywgMjQsIDI1LCAyNl0sIGludmVyc2U6IHRydWV9KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCdzdGFuZF91cCcsIHsgZnJhbWVzOiBbMTRdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnd2Fsa191cCcsIHsgZnJhbWVzOiBbMTUsIDE2LCAxNywgMTgsIDE5LCAyMF19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCd0YWxrX3VwJywgeyBmcmFtZXM6IFsxNF19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCdzdGFuZF9kb3duJywgeyBmcmFtZXM6IFs3XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3dhbGtfZG93bicsIHsgZnJhbWVzOiBbOCwgOSwgMTAsIDExLCAxMiwgMTNdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgndGFsa19kb3duJywgeyBmcmFtZXM6IFsyNywgMjgsIDI5LCAzMCwgMzEsIDMyXX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ2dpdmVfZ2xhc3MnLCB7IGZyYW1lczogWzM0LCAzNSwgMzYsIDM3XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3BpZXJjZV9iYWxsb29uJywgeyBmcmFtZXM6IFszOCwgMzksIDQwLCA0MV19KTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBzcHJpdGVJZDogJ0RPQ1RPUlRJTExBX1BMQVlFUl9TUFJJVEUnLFxuICAgIGluaXRpYWxYOiA5MyxcbiAgICBpbml0aWFsWTogMTg0LFxuICAgIHhTcGVlZDogODAsIC8vcHgvc1xuICAgIHlTcGVlZDogNTUsIC8vcHgvc1xuICAgIGFuaW1hdGlvblNwZWVkOiBzdHlsZS5ERUZBVUxUX0FOSU1BVElPTl9TUEVFRCxcbiAgICBzcHJpdGVPcHRpb25zOiBzcHJpdGVPcHRpb25zXG59O1xuXG5cbmV4cG9ydCBjbGFzcyBEb2N0b3J0aWxsYVBsYXllciBleHRlbmRzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQobmV3IENvaW4oKSk7XG4gICAgfVxuXG4gICAgcmVmbGVjdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zYXkocmFuZG9tVGV4dCgnTm93IEkgc2hvdWxkIHNheSBzb21ldGhpbmcgc21hcnQgdGhhdCBoZWxwcycsXG4gICAgICAgICAgICAnVGhpcyBpcyBhIHByZXR0eSBuaWNlIHJvb20nLFxuICAgICAgICAgICAgJ01hbiwgSSByZWFsbHkgd2FudCB0byBwbGF5IHRoYXQgY29uY2VydCcsXG4gICAgICAgICAgICAnUHJvYmFibHkgSSBzaG91bGQgZmluZCB0aGUgcmVzdCBvZiB0aGUgYmFuZC4uLicpKTtcbiAgICB9XG5cbiAgICBoYXNDb21wbGV0ZUNvc3R1bWUoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHIoJ0NPU1RVTUVfQ09NUExFVEUnKTtcbiAgICB9XG5cbiAgICBoYXNDYWJsZSgpOiBCb29sZWFuIHtcbiAgICAgICAgbGV0IGludmVudG9yeSA9IGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKTtcbiAgICAgICAgbGV0IGNhYmxlID0gaW52ZW50b3J5LmdldEJ5SWQoJ2NhYmxlJyk7XG4gICAgICAgIHJldHVybiAhIWNhYmxlO1xuICAgIH1cblxuICAgIGhhc0Z1bm55RHJpbmsoKTogQm9vbGVhbiB7XG4gICAgICAgIGxldCBpbnZlbnRvcnkgPSBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCk7XG4gICAgICAgIGxldCBnbGFzcyA9IDxhbnk+IGludmVudG9yeS5nZXRCeUlkKCdnbGFzcycpO1xuICAgICAgICByZXR1cm4gZ2xhc3MgJiYgZ2xhc3MuaXNGdW5ueSgpO1xuICAgIH1cblxuICAgIHJlbW92ZUNvc3R1bWUoKTogdm9pZCB7XG4gICAgICAgIGxldCBpbnZlbnRvcnkgPSBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCk7XG4gICAgICAgIGxldCBjb3N0dW1lID0gaW52ZW50b3J5LmdldEJ5SWQoJ2Nvc3R1bWUnKTtcbiAgICAgICAgaW52ZW50b3J5LnJlbW92ZShjb3N0dW1lKTtcbiAgICB9XG5cbiAgICByZW1vdmVDYWJsZSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGludmVudG9yeSA9IGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKTtcbiAgICAgICAgbGV0IGNhYmxlID0gaW52ZW50b3J5LmdldEJ5SWQoJ2NhYmxlJyk7XG4gICAgICAgIGludmVudG9yeS5yZW1vdmUoY2FibGUpO1xuICAgIH1cblxuICAgIHJlbW92ZUdsYXNzKCk6IHZvaWQge1xuICAgICAgICBsZXQgaW52ZW50b3J5ID0gYWN0aXZlSW52ZW50b3J5LmdldEFjdGl2ZUludmVudG9yeSgpO1xuICAgICAgICBsZXQgZ2xhc3MgPSBpbnZlbnRvcnkuZ2V0QnlJZCgnZ2xhc3MnKTtcbiAgICAgICAgaW52ZW50b3J5LnJlbW92ZShnbGFzcyk7XG4gICAgfVxuXG4gICAgZGVsaXZlcmVkRXZlcnl0aGluZygpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cignREVMSVZFUkVEX0NBQkxFJykgJiYgdGhpcy5nZXRBdHRyKCdERUxJVkVSRURfQ09TVFVNRScpICYmIHRoaXMuZ2V0QXR0cignREVMSVZFUkVEX0RSSU5LJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uU3RhdGVDaGFuZ2UoKSB7XG4gICAgICAgIGlmKHRoaXMuZGVsaXZlcmVkRXZlcnl0aGluZygpKSB7XG4gICAgICAgICAgICBsZXQgYmlsaSA9IHNjZW5lcy5nZXRTY2VuZUJ5SWQoJ0JBQ0tZQVJEJykuZ2V0VGhpbmdCeUlkKCdiaWxpJyk7XG4gICAgICAgICAgICBiaWxpLmNoYW5nZUF0dHIoJ0RSVU5LJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBEb29yIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9Eb29yJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IHJhbmRvbVRleHQgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvUmFuZG9tVGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBCYWNrc3RhZ2VEb29yVG9CYWNreWFyZCBleHRlbmRzIERvb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkOiAnQkFDS1NUQUdFX1RPX0JBQ0tZQVJEJyxcbiAgICAgICAgICAgIG5hbWU6ICdET09SX1RPX0JBQ0tZQVJEJyxcbiAgICAgICAgICAgIHg6IDczOSxcbiAgICAgICAgICAgIHk6IDExMSxcbiAgICAgICAgICAgIHNwcml0ZUlkOiAnQkFDS1NUQUdFX0RPT1JfVE9fQkFDS1lBUkRfU1BSSVRFJyxcbiAgICAgICAgICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDc0MyxcbiAgICAgICAgICAgICAgICB5OiAyMTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0aW5hdGlvblNjZW5lSWQ6ICdCQUNLWUFSRCcsXG4gICAgICAgICAgICByZWxhdGVkRG9vcklkOiAnQkFDS1lBUkRfVE9fQkFDS1NUQUdFJ1xuICAgICAgICB9O1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignT1BFTicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ0JBQ0tZQVJEJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnRE9PUl9UT19CQUNLWUFSRCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdGFrZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnQ0FOTk9UX1BJQ0tfQV9ET09SX1VQJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNwZWFrQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAnSElfRE9PUl9IT1dfQVJFX1lPVV9UT0RBWScsXG4gICAgICAgICAgICAnU0hFX0lTX1NIWV9ET0VTTlRfV0FOVF9UT19UQUxLX1RPX01FJyxcbiAgICAgICAgICAgICdJX0hBVkVfQkVUVEVSX1RISU5HU19UT19ET19USEFOX1RBTEtJTkcnXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdCSUxJX01VU1RfQkVfT1VUX1RIRVJFX1NNT0tJTkcnKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuXG5sZXQgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2JhY2tzdGFnZV9kb29yX3RvX3N0YWdlJyxcbiAgICB4OiAzMzAsXG4gICAgeTogNjcsXG4gICAgc3ByaXRlSWQ6ICdCQUNLU1RBR0VfRE9PUl9UT19TVEFHRScsXG4gICAgbmFtZTogJ0RPT1JfVE9fU1RBR0UnLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiAzNzgsXG4gICAgICAgIHk6IDE2M1xuICAgIH1cbn07XG5cbmV4cG9ydCBjbGFzcyBCYWNrc3RhZ2VEb29yVG9TdGFnZSBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9wZW5BY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5sb29rQXQoRGlyZWN0aW9ucy5ET1dOKTtcbiAgICAgICAgcGxheWVyLnNheSgnTk9QRV9JX0NBTk5PVF9HT19UT19USEVfU1RBR0UnKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdGSVJTVF9JX05FRURfVE9fR0VUX1RIRV9CQU5EX1JFQURZJyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY2xvc2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0lUX0lTX0FMUkVBRFlfQ0xPU0VEJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRha2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0NBTk5PVF9QSUNLX0FfRE9PUl9VUCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwdXNoQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIubG9va0F0KERpcmVjdGlvbnMuRE9XTik7XG4gICAgICAgIHBsYXllci5zYXkoJ05PUEVfSV9DQU5OT1RfR09fVE9fVEhFX1NUQUdFJylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnRklSU1RfSV9ORUVEX1RPX0dFVF9USEVfQkFORF9SRUFEWScpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNwZWFrQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAnSElfRE9PUl9IT1dfQVJFX1lPVV9UT0RBWScsXG4gICAgICAgICAgICAnU0hFX0lTX1NIWV9ET0VTTlRfV0FOVF9UT19UQUxLX1RPX01FJyxcbiAgICAgICAgICAgICdJX0hBVkVfQkVUVEVSX1RISU5HU19UT19ET19USEFOX1RBTEtJTkcnXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAnTklDRV9TQUZFX0RPT1InLFxuICAgICAgICAgICAgJ01BREVfT0ZfTUVUQUxfUlVTVF9BTkRfU1RJQ0tZX1NUVUZGJyxcbiAgICAgICAgICAgICdJX0NBTl9IRUFSX1RIRV9DUk9XRF9XQUlUSU5HX0ZPUl9VUydcbiAgICAgICAgKSk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgRGlyZWN0aW9ucyB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9EaXJlY3Rpb25zJztcbmltcG9ydCB7IHJhbmRvbVRleHQgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvUmFuZG9tVGV4dCc7XG5cbmxldCBvcHRpb25zID0ge1xuICAgIGlkOiAnYmFjc2t0YWdlX2Rvb3JfdG9fc3RyZWV0JyxcbiAgICB4OiA1OSxcbiAgICB5OiAxMDAsXG4gICAgc3ByaXRlSWQ6ICdCQUNLU1RBR0VfRE9PUl9UT19TVFJFRVQnLFxuICAgIG5hbWU6ICdET09SX1RPX1NUUkVFVCcsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDEwMSxcbiAgICAgICAgeTogMTg1XG4gICAgfVxufTtcblxuZXhwb3J0IGNsYXNzIEJhY2tzdGFnZURvb3JUb1N0cmVldCBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9wZW5BY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5sb29rQXQoRGlyZWN0aW9ucy5ET1dOKTtcbiAgICAgICAgcGxheWVyLnNheSgnTk9QRV9JX0NBTk5PVF9HT19UT19USEVfU1RSRUVUJylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnSV9IQVZFX0FfQ09OQ0VSVF9UT19QTEFZJyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY2xvc2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0lUX0lTX0FMUkVBRFlfQ0xPU0VEJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRha2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0NBTk5PVF9QSUNLX0FfRE9PUl9VUCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwdXNoQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIubG9va0F0KERpcmVjdGlvbnMuRE9XTik7XG4gICAgICAgIHBsYXllci5zYXkoJ05PUEVfSV9DQU5OT1RfR09fVE9fVEhFX1NUUkVFVCcpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ0lfSEFWRV9BX0NPTkNFUlRfVE9fUExBWScpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNwZWFrQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIubG9va0F0KERpcmVjdGlvbnMuTEVGVCk7XG4gICAgICAgIHBsYXllci5zYXkocmFuZG9tVGV4dChcbiAgICAgICAgICAgICdISV9ET09SX0hPV19BUkVfWU9VX1RPREFZJyxcbiAgICAgICAgICAgICdTSEVfSVNfU0hZX0RPRVNOVF9XQU5UX1RPX1RBTEtfVE9fTUUnLFxuICAgICAgICAgICAgJ0lfSEFWRV9CRVRURVJfVEhJTkdTX1RPX0RPX1RIQU5fVEFMS0lORydcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5sb29rQXQoRGlyZWN0aW9ucy5MRUZUKTtcbiAgICAgICAgcGxheWVyLnNheShyYW5kb21UZXh0KFxuICAgICAgICAgICAgJ05JQ0VfU0FGRV9ET09SJyxcbiAgICAgICAgICAgICdNQURFX09GX01FVEFMX1JVU1RfQU5EX1NUSUNLWV9TVFVGRicsXG4gICAgICAgICAgICAnSV9DQU5fSEVBUl9USEVfQ1JPV0RfV0FJVElOR19GT1JfVVMnXG4gICAgICAgICkpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFNjZW5lIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9TY2VuZSc7XG5pbXBvcnQgeyBCcm9vbSB9IGZyb20gJy4vQnJvb20nO1xuaW1wb3J0IHsgVmVuZGluZ01hY2hpbmUgfSBmcm9tICcuL1ZlbmRpbmdNYWNoaW5lJztcbmltcG9ydCB7IEJhY2tzdGFnZURvb3JUb0JhY2t5YXJkIH0gZnJvbSAnLi9CYWNrc3RhZ2VEb29yVG9CYWNreWFyZCc7XG5pbXBvcnQgeyBCYWNrc3RhZ2VEb29yVG9TdHJlZXQgfSBmcm9tICcuL0JhY2tzdGFnZURvb3JUb1N0cmVldCc7XG5pbXBvcnQgeyBCYWNrc3RhZ2VEb29yVG9TdGFnZSB9IGZyb20gJy4vQmFja3N0YWdlRG9vclRvU3RhZ2UnO1xuaW1wb3J0IHsgQmFuZEluU29mYSB9IGZyb20gJy4vQmFuZEluU29mYSc7XG5pbXBvcnQgeyBTY2lzc29ycyB9IGZyb20gJy4vU2Npc3NvcnMnO1xuaW1wb3J0IHsgQm9jYWRpbGxvIH0gZnJvbSAnLi9Cb2NhZGlsbG8nO1xuaW1wb3J0IHsgQ2FibGUgfSBmcm9tICcuL0NhYmxlJztcbmltcG9ydCB7IENvY29udXQgfSBmcm9tICcuL0NvY29udXQnO1xuaW1wb3J0IHsgRHVzdCB9IGZyb20gJy4vRHVzdEluVGFibGUnO1xuaW1wb3J0IHsgR2xhc3MgfSBmcm9tICcuL0dsYXNzJztcbmltcG9ydCB7IExhbXBMZWZ0IH0gZnJvbSAnLi9MYW1wTGVmdCc7XG5pbXBvcnQgeyBMYW1wUmlnaHQgfSBmcm9tICcuL0xhbXBSaWdodCc7XG5pbXBvcnQgeyBGbHlDYXNlIH0gZnJvbSAnLi9GbHlDYXNlJztcbmltcG9ydCB7IFBvbHlnb24gfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvUG9seWdvbic7XG5cbmNvbnN0IHNjZW5lT3B0aW9ucyA9IHtcbiAgICBpZDogJ0JBQ0tTVEFHRScsXG4gICAgYmFja2dyb3VuZElkOiAnQkFDS1NUQUdFX0JHJyxcbiAgICBib3VuZGFyaWVzQ29uZmlnOiBuZXcgUG9seWdvbihbXG4gICAgICAgIHt4OiA1NSwgeTogMjE4fSxcbiAgICAgICAge3g6IDEwMSwgeTogMTY4fSxcbiAgICAgICAge3g6IDE0MiwgeTogMTYzfSxcbiAgICAgICAge3g6IDEzMCwgeTogMTc0fSxcbiAgICAgICAge3g6IDE5NSwgeTogMTcxfSxcbiAgICAgICAge3g6IDIxMywgeTogMTU4fSxcbiAgICAgICAge3g6IDIyOSwgeTogMTU4fSxcbiAgICAgICAge3g6IDIyMiwgeTogMTc2fSxcbiAgICAgICAge3g6IDMwOCwgeTogMTgwfSxcbiAgICAgICAge3g6IDMzMiwgeTogMTU4fSxcbiAgICAgICAge3g6IDQ2NSwgeTogMTU4fSxcbiAgICAgICAge3g6IDQ2OSwgeTogMTgzfSxcbiAgICAgICAge3g6IDQ5NCwgeTogMTkzfSxcbiAgICAgICAge3g6IDU1MywgeTogMTg5fSxcbiAgICAgICAge3g6IDU2OSwgeTogMTgxfSxcbiAgICAgICAge3g6IDU2OCwgeTogMTU4fSxcbiAgICAgICAge3g6IDYwOCwgeTogMTYwfSxcbiAgICAgICAge3g6IDYyNywgeTogMTg1fSxcbiAgICAgICAge3g6IDY5MSwgeTogMTg0fSxcbiAgICAgICAge3g6IDcwNiwgeTogMjAyfSxcbiAgICAgICAge3g6IDc2MiwgeTogMjAwfSxcbiAgICAgICAge3g6IDc5MCwgeTogMjE4fVxuICAgIF0pLFxuICAgIHRoaW5nczogW1xuICAgICAgICBcbiAgICAgICAgbmV3IEJhY2tzdGFnZURvb3JUb0JhY2t5YXJkKCksXG4gICAgICAgIG5ldyBCYWNrc3RhZ2VEb29yVG9TdHJlZXQoKSxcbiAgICAgICAgbmV3IEJhY2tzdGFnZURvb3JUb1N0YWdlKCksXG4gICAgICAgIG5ldyBDYWJsZSgpLFxuICAgICAgICBuZXcgVmVuZGluZ01hY2hpbmUoKSxcbiAgICAgICAgbmV3IEJhbmRJblNvZmEoKSxcbiAgICAgICAgbmV3IExhbXBMZWZ0KCksXG4gICAgICAgIG5ldyBMYW1wUmlnaHQoKSxcbiAgICAgICAgbmV3IEZseUNhc2UoKSxcbiAgICAgICAgbmV3IEJyb29tKCksXG4gICAgICAgIG5ldyBTY2lzc29ycygpLFxuICAgICAgICBuZXcgQm9jYWRpbGxvKCksXG4gICAgICAgIG5ldyBHbGFzcygpLFxuICAgICAgICBuZXcgRHVzdCgpLFxuICAgICAgICBuZXcgQ29jb251dCgpXG4gICAgICAgIFxuICAgIF1cbn07XG5cbmV4cG9ydCBjbGFzcyBCYWNrc3RhZ2VTY2VuZSBleHRlbmRzIFNjZW5lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoc2NlbmVPcHRpb25zKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2JhY29uJyxcbiAgICBzcHJpdGVJZDogJ0JBQ09OJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQkFDT05fSU5WJyxcbiAgICBuYW1lOiAnQkFDT04nLFxuICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk6IHRydWVcbn1cblxuZXhwb3J0IGNsYXNzIEJhY29uIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5zYXkoJ0RFTElDSU9VU19BTkRfR1JFQVNZJyk7XG4gICAgfVxufSIsImltcG9ydCB7IFNwZWVjaEJ1YmJsZSB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9TcGVlY2hCdWJibGUnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbldpdGhCYW5kIH0gZnJvbSAnLi9Db252ZXJzYXRpb25XaXRoQmFuZCc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyBzdHlsZSB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9TdHlsZSc7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgYW5hbHl0aWNzIH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL0FuYWx5dGljcyc7XG5cbmxldCBzcHJpdGVPcHRpb25zID0gbmV3IE1hcCgpO1xuXG5zcHJpdGVPcHRpb25zLnNldCgncXVpZXQnLCB7IGZyYW1lczogWzBdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnanVhbl90YWxraW5nJywgeyBmcmFtZXM6IFsxLCAyLCAzLCA0LCA1LCA2XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ2FuZ2VsX3RhbGtpbmcnLCB7IGZyYW1lczogWzcsIDgsIDksIDEwLCAxMSwgMTJdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnc2FudGlfdGFsa2luZycsIHsgZnJhbWVzOiBbMTMsIDE0LCAxNSwgMTYsIDE3LCAxOF19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCdzYW50aV9kcmlua2luZycsIHsgZnJhbWVzOiBbMTksIDIwLCAyMSwgMjJdfSk7XG5cbmV4cG9ydCBjbGFzcyBCYW5kSW5Tb2ZhIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBzcGVlY2hCdWJibGU6IFNwZWVjaEJ1YmJsZTtcbiAgICBwcml2YXRlIGxhc3RQZXJzb25UYWxraW5nOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZDogJ2JhbmRJblNvZmEnLFxuICAgICAgICAgICAgeDogNDgxLFxuICAgICAgICAgICAgeTogMTA1LFxuICAgICAgICAgICAgc3ByaXRlSWQ6ICdCQU5EX0lOX1NPRkFfU1BSSVRFJyxcbiAgICAgICAgICAgIG5hbWU6ICdSRVNUX09GX1RIRV9CQU5EJyxcbiAgICAgICAgICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDQ1OSxcbiAgICAgICAgICAgICAgICB5OiAxODFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXJlY3Rpb25Ub0xvb2s6IERpcmVjdGlvbnMuUklHSFQsXG4gICAgICAgICAgICBzcHJpdGVPcHRpb25zOiBzcHJpdGVPcHRpb25zLFxuICAgICAgICAgICAgYW5pbWF0aW9uU3BlZWQ6IHN0eWxlLkRFRkFVTFRfQU5JTUFUSU9OX1NQRUVEXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZSA9IG5ldyBTcGVlY2hCdWJibGUoe1xuICAgICAgICAgICAgb3duZXI6IHRoaXNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5zYXkocmFuZG9tVGV4dChcbiAgICAgICAgICAgICdUSEFUX0lTX01ZX0JBTkRfMScsXG4gICAgICAgICAgICAnVEhBVF9JU19NWV9CQU5EXzInLFxuICAgICAgICAgICAgJ1RIQVRfSVNfTVlfQkFORF8zJ1xuICAgICAgICApKTtcbiAgICB9XG5cbiAgICBzcGVha0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGFuYWx5dGljcy5zZW5kRXZlbnQoJ2dhbWUnLCAndGFsa190b19iYW5kJyk7XG4gICAgICAgIHRoaXMuc3RhcnRDb252ZXJzYXRpb24ocGxheWVyKTtcbiAgICB9XG5cbiAgICBzYXkodGV4dDogc3RyaW5nLCB3aG9UYWxrczogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMucGxheUFuaW1hdGlvbih3aG9UYWxrcyArICdfdGFsa2luZycpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNwZWVjaEJ1YmJsZVN0eWxlKHdob1RhbGtzKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5zcGVlY2hCdWJibGUuc2F5KHRleHQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uKCdxdWlldCcpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvbk9uVG9wKCk6IElQb2ludCB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnNwcml0ZS54LFxuICAgICAgICAgICAgeTogTWF0aC5yb3VuZCh0aGlzLnNwcml0ZS5nZXRCb3VuZHMoKS55KSAtIDEwXG4gICAgICAgIH07XG4gICAgICAgIGlmKHRoaXMubGFzdFBlcnNvblRhbGtpbmcgPT09ICdzYW50aScpIHtcbiAgICAgICAgICAgIHJlc3VsdC54ICs9IDcwO1xuICAgICAgICAgICAgcmVzdWx0LnkgKz0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5sYXN0UGVyc29uVGFsa2luZyA9PT0gJ2FuZ2VsJykge1xuICAgICAgICAgICAgcmVzdWx0LnggKz0gMzA7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5sYXN0UGVyc29uVGFsa2luZyA9PT0gJ2p1YW4nKSB7XG4gICAgICAgICAgICByZXN1bHQueCAtPSAyMDtcbiAgICAgICAgICAgIHJlc3VsdC55ICs9IDEwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdpdmVBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICB2YXIgdGhpbmcgPSBzZWxlY3RlZFRoaW5nLnRoaW5nO1xuICAgICAgICBpZiAodGhpbmcuaWQgPT09ICdjYWJsZScpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRDb252ZXJzYXRpb24ocGxheWVyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGluZy5pZCA9PT0gJ2dsYXNzJykge1xuICAgICAgICAgICAgaWYodGhpbmcuZ2V0QXR0cignRklMTEVEJykgJiYgdGhpbmcuZ2V0QXR0cignUE9XREVSX0lOU0lERScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydENvbnZlcnNhdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX1NIT1VMRF9QVVRfU09NRVRISU5HX01PUkVfSU5URVJFU1RJTkdfSU5fVEhFX0dMQVNTJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpbmcuaWQgPT09ICdjb3N0dW1lJykge1xuICAgICAgICAgICAgaWYocGxheWVyLmdldEF0dHIoJ0NPU1RVTUVfQ09NUExFVEUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRDb252ZXJzYXRpb24ocGxheWVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnNheSgnSV9IQVZFX1RPX0ZJTklTSF9USEVfQ09TVFVNRV9GSVJTVCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIudXNlQWN0aW9uKHBsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNwZWVjaEJ1YmJsZVN0eWxlKHdob1RhbGtzOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sYXN0UGVyc29uVGFsa2luZyA9IHdob1RhbGtzO1xuICAgICAgICBpZih3aG9UYWxrcyA9PT0gJ3NhbnRpJykge1xuICAgICAgICAgICAgdGhpcy5zcGVlY2hCdWJibGUuc2V0Rm9yZWdyb3VuZFRleHRTdHlsZSgnRk9OVF8zMl9CTFVFJyk7XG4gICAgICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZS5zZXRTaGFkb3dUZXh0U3R5bGUoJ0ZPTlRfMzJfQkxBQ0snKTtcbiAgICAgICAgfVxuICAgICAgICBpZih3aG9UYWxrcyA9PT0gJ2p1YW4nKSB7XG4gICAgICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZS5zZXRGb3JlZ3JvdW5kVGV4dFN0eWxlKCdGT05UXzMyX09SQU5HRScpO1xuICAgICAgICAgICAgdGhpcy5zcGVlY2hCdWJibGUuc2V0U2hhZG93VGV4dFN0eWxlKCdGT05UXzMyX0JMQUNLJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYod2hvVGFsa3MgPT09ICdhbmdlbCcpIHtcbiAgICAgICAgICAgIHRoaXMuc3BlZWNoQnViYmxlLnNldEZvcmVncm91bmRUZXh0U3R5bGUoJ0ZPTlRfMzJfWUVMTE9XJyk7XG4gICAgICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZS5zZXRTaGFkb3dUZXh0U3R5bGUoJ0ZPTlRfMzJfQkxBQ0snKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcblxuICAgIHByaXZhdGUgc3RhcnRDb252ZXJzYXRpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcikgOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKS50aGVuKFxuICAgICAgICAgICAgKCkgPT4gbmV3IENvbnZlcnNhdGlvbldpdGhCYW5kKHBsYXllciwgdGhpcylcbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBCcmVhZCB9IGZyb20gJy4vQnJlYWQnO1xuaW1wb3J0IHsgQmFjb24gfSBmcm9tICcuL0JhY29uJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2JvY2FkaWxsbycsXG4gICAgeDogNzA1LFxuICAgIHk6IDE0NSxcbiAgICBzcHJpdGVJZDogJ0JPQ0FESUxMTycsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ0JPQ0FESUxMT19JTlYnLFxuICAgIG5hbWU6ICdCT0NBRElMTE8nLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiA2OTIsXG4gICAgICAgIHk6IDE5MFxuICAgIH0sXG4gICAgcGlja2FibGU6IHRydWVcbn1cblxuZXhwb3J0IGNsYXNzIEJvY2FkaWxsbyBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfVEhJTktfSV9DQU5fT1BFTl9JVF9BTkRfVEFLRV9USEVfQkFDT04nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0FfUkFOQ0lEX0FORF9HUkVBU1lfU0FORFdISUNIJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb3BlbkFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgbmV3IEJhY29uKCk7XG4gICAgICAgICAgICBuZXcgQnJlYWQoKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSV9IQVZFX1RPX1BJQ0tfSVRfVVBfRklSU1QnKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2JyZWFkJyxcbiAgICBzcHJpdGVJZDogJ0JSRUFEJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQlJFQURfSU5WJyxcbiAgICBuYW1lOiAnQlJFQUQnLFxuICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk6IHRydWVcbn1cblxuZXhwb3J0IGNsYXNzIEJyZWFkIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5zYXkoJ0JSRUFEX0xFRlRPVkVSU19OT1RfVVNFRlVMJyk7XG4gICAgfVxufSIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IFZlcmJzIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5pbXBvcnQgeyBEaXJlY3Rpb25zIH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL0RpcmVjdGlvbnMnO1xuaW1wb3J0IHsgU2tpcnQgfSBmcm9tICcuL1NraXJ0JztcbmltcG9ydCB7IHJhbmRvbVRleHQgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvUmFuZG9tVGV4dCc7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdicm9vbScsXG4gICAgeDogMTAzLFxuICAgIHk6IDExOSxcbiAgICBzcHJpdGVJZDogJ0JST09NJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQlJPT01fSU5WJyxcbiAgICBuYW1lOiAnQlJPT00nLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiAxMTcsXG4gICAgICAgIHk6IDE3NlxuICAgIH0sXG4gICAgcGlja2FibGU6IHRydWUsXG4gICAgcHJlZmVycmVkQWN0aW9uOiBWZXJicy5UQUtFLFxuICAgIHByZWZlcnJlZEludmVudG9yeUFjdGlvbjogVmVyYnMuTE9PS1xufTtcblxuZXhwb3J0IGNsYXNzIEJyb29tIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX0NPVUxEX01BS0VfQV9XSUdfV0lUSF9USElTJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAgICAgJ0FfQlJPT01fVEhFX1BFUkZFQ1RfQ0xFQU5JTkdfSU5TVFJVTUVOVCcsXG4gICAgICAgICAgICAgICAgJ0lfQ09VTERfTUFLRV9BX1dJR19XSVRIX1RISVMnXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCB1c2VBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ3NjaXNzb3JzJykge1xuICAgICAgICAgICAgdGhpcy5jdXRXaXRoU2Npc3NvcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfRE9OVF9LTk9XX0hPV19UT19ET19USEFUJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjdXRXaXRoU2Npc3NvcnMoKSB7XG4gICAgICAgIG5ldyBTa2lydCgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBzY2VuZXMgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2NlbmVzLnNpbmdsZXRvbic7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdjYWJsZScsXG4gICAgeDogMTg3LFxuICAgIHk6IDEyNSxcbiAgICBzcHJpdGVJZDogJ0NBQkxFJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQ0FCTEVfSU5WJyxcbiAgICBuYW1lOiAnQ0FCTEUnLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiAyMTksXG4gICAgICAgIHk6IDE2NVxuICAgIH0sXG4gICAgcGlja2FibGU6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBDYWJsZSBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRha2VBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHZlbmRpbmdNYWNoaW5lID0gc2NlbmVzLmN1cnJlbnRTY2VuZS5nZXRUaGluZ0J5SWQoJ3ZlbmRpbmcnKTtcbiAgICAgICAgICAgIGlmICghdmVuZGluZ01hY2hpbmUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnRVJST1I6IHZlbmRpbmcgbWFjaGluZSBzaG91bGQgYmUgcHJlc2VudCBpbiBjdXJyZW50IHNjZW5lJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZlbmRpbmdNYWNoaW5lLmdldEF0dHIoJ1BVU0hFRCcpKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnNheSgnRklOQUxMWV9JX0dPVF9USEVfQ0FCTEUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxldFBsYXllckNvbWVBbmRUYWtlSXQocGxheWVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnNheSgnSVRfSVNfU1RVQ0tfQkVISU5EX1RIRV9WRU5ESU5HX01BQ0hJTkUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0NPT0xfTk9XX0lfU0hPVUxEX0dJVkVfSVRfVE9fVEhFX0dVWVMnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ1RISVNfQ0FCTEVfQ09VTERfQkVfVVNFRlVMJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1BsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5cbmV4cG9ydCBjbGFzcyBDYW4gZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgaWQ6ICdjYW4nLFxuICAgICAgICAgICAgaW52ZW50b3J5SW1hZ2VJZDogJ0NBTl9JTlYnLFxuICAgICAgICAgICAgbmFtZTogJ0NBTicsXG4gICAgICAgICAgICBkaXJlY3RseUluSW52ZW50b3J5OiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB1c2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdnbGFzcycpIHtcbiAgICAgICAgICAgIGxldCBnbGFzcyA9IDxhbnk+IHNlbGVjdGVkVGhpbmcudGhpbmc7XG4gICAgICAgICAgICBnbGFzcy5maWxsV2l0aERyaW5rKHBsYXllciwgdGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2R1c3QnKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX1NIT1VMRF9QUk9CQUJMWV9NSVhfSVRfSU5fQV9HTEFTUycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIudXNlQWN0aW9uKHBsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IGNvc3R1bWVDcmVhdG9yIH0gZnJvbSAnLi4vdXRpbHMvQ29zdHVtZUNyZWF0b3InO1xuaW1wb3J0IHsgcmFuZG9tVGV4dCB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9SYW5kb21UZXh0JztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2NvY29udXQnLFxuICAgIHg6IDkyLFxuICAgIHk6IDE5NSxcbiAgICBzcHJpdGVJZDogJ0NPQ09OVVQnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdDT0NPTlVUX0lOVicsXG4gICAgbmFtZTogJ0NPQ09OVVQnLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiAxMTAsXG4gICAgICAgIHk6IDIwM1xuICAgIH0sXG4gICAgcGlja2FibGU6IHRydWUsXG4gICAgaXNGb3JlZ3JvdW5kOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgQ29jb251dCBleHRlbmRzIFRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnRE9FU19JVF9MT09LX0xJS0VfQV9QQUlSX09GX1RJVFMnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0NPTVBBUkVfQ09NUFJBTUVfVU5fQ09DTycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnZmxvd2VycycpIHtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZEZsb3dlcnMocGxheWVyKTtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZENvY29udXQocGxheWVyKTtcbiAgICAgICAgICAgIHNlbGVjdGVkVGhpbmcudGhpbmcuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ3NraXJ0Jykge1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkU2tpcnQocGxheWVyKTtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZENvY29udXQocGxheWVyKTtcbiAgICAgICAgICAgIHNlbGVjdGVkVGhpbmcudGhpbmcuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2Nvc3R1bWUnKSB7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRDb2NvbnV0KHBsYXllcik7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1cGVyLnVzZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb252ZXJzYXRpb24sIElDb252ZXJzYXRpb25TY3JpcHQgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL0NvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25MaW5lIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9Db252ZXJzYXRpb25MaW5lJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IEJhbmRJblNvZmEgfSBmcm9tICcuL0JhbmRJblNvZmEnO1xuXG5jb25zdCBzY3JpcHQ6IElDb252ZXJzYXRpb25TY3JpcHQgPSB7XG4gICAgJ2luaXRpYWwnOiBbXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKCdSRUFEWV9UT19QTEFZJywgJ0xJU1RfT0ZfUFJPQkxFTVMnLCBzYXlQcm9ibGVtc0ludHJvKSxcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ0hBVkVfWU9VX1NFRU5fQklMSScsICdpbml0aWFsJywgc2F5QmlsaVNpdHVhdGlvbiksXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKCdUQUxLX1RPX1lPVV9MQVRFUicsICdlbmQnKVxuICAgIF0sXG4gICAgJ0xJU1RfT0ZfUFJPQkxFTVMnOiBbXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKCdQUk9CTEVNU19MRVRfTUVfSEVMUCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnLCBzYXlMaXN0T2ZQcm9ibGVtcyksXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKCdQUk9CTEVNU19JX0FNX09VVCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnLCBzYXlMaXN0T2ZQcm9ibGVtcylcbiAgICBdLFxuICAgICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnOiBbXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKCdIT1dfSVNfQklMSV9ET0lORycsICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnLCBzYXlCaWxpU2l0dWF0aW9uKSxcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ0xFVFNfRklYX1RISVNfTUVTUycsICdlbmQnKVxuICAgIF0sXG4gICAgJ1dFX0FSRV9SRUFEWSc6IFtcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ0FMTF9SRUFEWV9GSU5EX0JJTEknLCAnZW5kJylcbiAgICBdXG59O1xuXG5leHBvcnQgY2xhc3MgQ29udmVyc2F0aW9uV2l0aEJhbmQgZXh0ZW5kcyBDb252ZXJzYXRpb24ge1xuXG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgcHJvdGVjdGVkIG90aGVyUGVyc29uOiBUaGluZykge1xuICAgICAgICBzdXBlcihwbGF5ZXIsIG90aGVyUGVyc29uKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFN0YXRlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuZ2V0QXR0cignVEFMS0VEX1RPX0JBTkRfQUJPVVRfUFJPQkxFTVMnKSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuZ2V0U3RhdGVJZlBsYXllckRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAnaW5pdGlhbCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9hZFNjcmlwdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zY3JpcHQgPSBPYmplY3QuYXNzaWduKHt9LCBzY3JpcHQpO1xuICAgICAgICBsZXQgZGlhbG9nUGFydDogQXJyYXk8Q29udmVyc2F0aW9uTGluZT4gPSBbXTtcbiAgICAgICAgZGlhbG9nUGFydCA9IHRoaXMuc2NyaXB0WydJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnXS5jb25jYXQoZGlhbG9nUGFydCk7XG5cbiAgICAgICAgdGhpcy5sb2FkRXh0cmFPcHRpb25zSW5Jbml0aWFsRmlyc3RUYWxrKGRpYWxvZ1BhcnQpO1xuICAgICAgICB0aGlzLnNjcmlwdFsnSU5JVElBTF9BRlRFUl9GSVJTVF9UQUxLJ10gPSBkaWFsb2dQYXJ0O1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZEV4dHJhT3B0aW9uc0luSW5pdGlhbEZpcnN0VGFsayhkaWFsb2dQYXJ0OiBBcnJheTxDb252ZXJzYXRpb25MaW5lPikge1xuICAgICAgICB0aGlzLmFkZENvc3R1bWVMaW5lKGRpYWxvZ1BhcnQpO1xuICAgICAgICB0aGlzLmFkZENhYmxlTGluZShkaWFsb2dQYXJ0KTtcbiAgICAgICAgdGhpcy5hZGREcmlua0xpbmUoZGlhbG9nUGFydCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRDb3N0dW1lTGluZShkaWFsb2dQYXJ0OiBBcnJheTxDb252ZXJzYXRpb25MaW5lPik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuaGFzQ29tcGxldGVDb3N0dW1lKCkpIHtcbiAgICAgICAgICAgIGRpYWxvZ1BhcnQudW5zaGlmdChuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICAgICAnR09UX1RIRV9DT1NUVU1FJyxcbiAgICAgICAgICAgICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmdldFN0YXRlSWZQbGF5ZXJEZWxpdmVyZWRFdmVyeXRoaW5nKCk7IH0sXG4gICAgICAgICAgICAgICAgc2F5Q29zdHVtZUlzT2tcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9IGVsc2UgaWYoIXRoaXMucGxheWVyLmdldEF0dHIoJ0RFTElWRVJFRF9DT1NUVU1FJykpIHtcbiAgICAgICAgICAgIGRpYWxvZ1BhcnQudW5zaGlmdChuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICAgICAnV0hZX0NPU1RVTUVTJyxcbiAgICAgICAgICAgICAgICAnSU5JVElBTF9BRlRFUl9GSVJTVF9UQUxLJyxcbiAgICAgICAgICAgICAgICBzYXlXaHlDb3N0dW1lc1xuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICBkaWFsb2dQYXJ0LnVuc2hpZnQobmV3IENvbnZlcnNhdGlvbkxpbmUoXG4gICAgICAgICAgICAgICAgJ0FTS19BQk9VVF9DT1NUVU1FJyxcbiAgICAgICAgICAgICAgICAnSU5JVElBTF9BRlRFUl9GSVJTVF9UQUxLJyxcbiAgICAgICAgICAgICAgICB0YWxrQWJvdXRDb3N0dW1lXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkQ2FibGVMaW5lKGRpYWxvZ1BhcnQ6IEFycmF5PENvbnZlcnNhdGlvbkxpbmU+KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllci5oYXNDYWJsZSgpKSB7XG4gICAgICAgICAgICBkaWFsb2dQYXJ0LnVuc2hpZnQobmV3IENvbnZlcnNhdGlvbkxpbmUoXG4gICAgICAgICAgICAgICAgJ0ZPVU5EX1RIRV9DQUJMRScsXG4gICAgICAgICAgICAgICAgKCkgPT4geyByZXR1cm4gdGhpcy5nZXRTdGF0ZUlmUGxheWVyRGVsaXZlcmVkRXZlcnl0aGluZygpOyB9LFxuICAgICAgICAgICAgICAgIHNheUNhYmxlSXNPa1xuICAgICAgICAgICAgKSk7XG4gICAgICAgIH0gZWxzZSBpZighdGhpcy5wbGF5ZXIuZ2V0QXR0cignREVMSVZFUkVEX0NBQkxFJykpIHtcbiAgICAgICAgICAgIGRpYWxvZ1BhcnQudW5zaGlmdChuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICAgICAnQVNLX0FCT1VUX0NBQkxFJyxcbiAgICAgICAgICAgICAgICAnSU5JVElBTF9BRlRFUl9GSVJTVF9UQUxLJyxcbiAgICAgICAgICAgICAgICB0YWxrQWJvdXRDYWJsZVxuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZERyaW5rTGluZShkaWFsb2dQYXJ0OiBBcnJheTxDb252ZXJzYXRpb25MaW5lPik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuaGFzRnVubnlEcmluaygpKSB7XG4gICAgICAgICAgICBkaWFsb2dQYXJ0LnVuc2hpZnQobmV3IENvbnZlcnNhdGlvbkxpbmUoXG4gICAgICAgICAgICAgICAgJ0hBVkVfQV9EUklOS19TQU5USScsXG4gICAgICAgICAgICAgICAgKCkgPT4geyByZXR1cm4gdGhpcy5nZXRTdGF0ZUlmUGxheWVyRGVsaXZlcmVkRXZlcnl0aGluZygpOyB9LFxuICAgICAgICAgICAgICAgIHNheURyaW5rSXNPa1xuICAgICAgICAgICAgKSk7XG4gICAgICAgIH0gZWxzZSBpZighdGhpcy5wbGF5ZXIuZ2V0QXR0cignREVMSVZFUkVEX0RSSU5LJykpIHtcbiAgICAgICAgICAgIGRpYWxvZ1BhcnQudW5zaGlmdChuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICAgICAnQVNLX0FCT1VUX1NBTlRJJyxcbiAgICAgICAgICAgICAgICAnSU5JVElBTF9BRlRFUl9GSVJTVF9UQUxLJyxcbiAgICAgICAgICAgICAgICB0YWxrQWJvdXRTYW50aVxuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFN0YXRlSWZQbGF5ZXJEZWxpdmVyZWRFdmVyeXRoaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllci5kZWxpdmVyZWRFdmVyeXRoaW5nKCkpIHtcbiAgICAgICAgICAgIHJldHVybiAnV0VfQVJFX1JFQURZJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnSU5JVElBTF9BRlRFUl9GSVJTVF9UQUxLJztcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBzYXlQcm9ibGVtc0ludHJvKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJhbmQ6IEJhbmRJblNvZmEpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBiYW5kLnNheSgnVEhFUkVfQVJFX1NPTUVfUFJPQkxFTVNfMScsICdhbmdlbCcpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1RIRVJFX0FSRV9TT01FX1BST0JMRU1TXzInLCAnc2FudGknKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdUSEVSRV9BUkVfU09NRV9QUk9CTEVNU18zJywgJ2p1YW4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2F5TGlzdE9mUHJvYmxlbXMocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmFuZDogQmFuZEluU29mYSk6IFByb21pc2U8YW55PiB7XG4gICAgcGxheWVyLmNoYW5nZUF0dHIoJ1RBTEtFRF9UT19CQU5EX0FCT1VUX1BST0JMRU1TJywgdHJ1ZSk7XG4gICAgcmV0dXJuIGJhbmQuc2F5KCdXRV9IQVZFX1RIUkVFX1BST0JMRU1TJywgJ2FuZ2VsJylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnRklSU1RfQU5HRUxfQ0FCTEUnLCAnanVhbicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1NFQ09ORF9KVUFOX0NPU1RVTUUnLCAnYW5nZWwnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdUSElSRF9TQU5USV9TSFknLCAnanVhbicpO1xuICAgICAgICAgICAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzYXlCaWxpU2l0dWF0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJhbmQ6IEJhbmRJblNvZmEpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBiYW5kLnNheSgnSEVfSVNfT1VUX1NNT0tJTkcnLCAnYW5nZWwnKTtcbn1cblxuZnVuY3Rpb24gc2F5Q29zdHVtZUlzT2socGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmFuZDogQmFuZEluU29mYSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGJhbmQuc2F5KCdUSEFUX0lTX0FfU1RVUElEX0NPU1RVTUUnLCAnanVhbicpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ01JTkVfV0FTX1dBWV9CRVRURVInLCAnanVhbicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnWU9VX0JFVFRFUl9QVVRfSVRfT04nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYmFuZC5jaGFuZ2VBdHRyKCdIQVNfQ09TVFVNRScsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY2hhbmdlQXR0cignREVMSVZFUkVEX0NPU1RVTUUnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnJlbW92ZUNvc3R1bWUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdPS19JX0xMX1BVVF9JVF9PTicsICdqdWFuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHRhbGtBYm91dENvc3R1bWUocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmFuZDogQmFuZEluU29mYSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGJhbmQuc2F5KCdXRUxMX0lfSEFEX0FOX0FXRVNPTUVfQ09TVFVNRScsICdqdWFuJylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnSVRfV0FTX0NPV0JPWV9DT1NUVU1FJywgJ2p1YW4nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdWSU5UQUdFX1BSRU1JVU1fQ09TVFVNRScsICdqdWFuJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnU09fUExFQVNFX0ZJTkRfTUVfU09NRVRISU5HX0VMRUdBTlRfSV9DQU5fVVNFJywgJ2p1YW4nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1NVUkVfQk9TUycpO1xuICAgICAgICAgICAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiB0YWxrQWJvdXRDYWJsZShwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiYW5kOiBCYW5kSW5Tb2ZhKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gYmFuZC5zYXkoJ0pVU1RfU1RFQUxfT05FJywgJ2p1YW4nKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdJX1dPVUxEX0RPX0lUX01ZU0VMRicsICdqdWFuJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnSVNfU09NRUhPV19EQU5HRVJPVVMnLCAnYW5nZWwnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdJTVBMSUVTX01PVkVNRU5UJywgJ3NhbnRpJyk7XG4gICAgICAgICAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHRhbGtBYm91dFNhbnRpKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJhbmQ6IEJhbmRJblNvZmEpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBiYW5kLnNheSgnV0VfRE9OVF9SRUhFQVJTRV9FTk9VR0gnLCAnc2FudGknKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdXRV9IQVZFTlRfUFJBQ1RJU0VEX1NJTkNFXzIwMTInLCAnc2FudGknKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1lPVV9BUkVfQV9DT1dBUkRfTUFOX1dFX0hBVkVfQ09TVFVNRVMnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1dIQVRfQ0FOX1dFX0RPX0dVWVMnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdTT01FX0NVTFRVUkVTX1VTRURfRFJVR1MnLCAnYW5nZWwnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdOT1RfU0FZSU5HX1dFX1NIT1VMRF9VU0VfVEhFTScsICdhbmdlbCcpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ0RSVUdTX0FSRV9CQUQnLCAnanVhbicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ0FORF9FWFBFTlNJVkUnLCAnYW5nZWwnKTtcbiAgICAgICAgICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2F5V2h5Q29zdHVtZXMocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmFuZDogQmFuZEluU29mYSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGJhbmQuc2F5KCdNQU5fWU9VX1NIT1VMRF9LTk9XX1RISVMnLCAnc2FudGknKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdJVF9JU19BX0xPTkdfVElNRV9UUkFESVRJT05fVEhBVF9XRV9BTExfRFJFU1NFRF9VUCcsICdqdWFuJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnU09fV0VfU09NRUhPV19ESVNUUkFDVF9USEVfQVRURU5USU9OJywgJ2FuZ2VsJyk7XG4gICAgICAgICAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNheUNhYmxlSXNPayhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiYW5kOiBCYW5kSW5Tb2ZhKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gYmFuZC5zYXkoJ0lfQU1fTk9UX0dPSU5HX1RPX0FTS19XSEVSRV9USElTX0NPTUVTX0ZST00nLCAnYW5nZWwnKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdZT1VfU1RPTEVfSVQnLCAnc2FudGknKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYmFuZC5jaGFuZ2VBdHRyKCdIQVNfQ0FCTEUnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmNoYW5nZUF0dHIoJ0RFTElWRVJFRF9DQUJMRScsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucmVtb3ZlQ2FibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ0xFVF9TX1NBWV9JX0hBVkVfTVlfU09VUkNFUycpO1xuICAgICAgICAgICAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzYXlEcmlua0lzT2socGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmFuZDogQmFuZEluU29mYSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIHBsYXllci5wbGF5QW5pbWF0aW9uT25jZSgnZ2l2ZV9nbGFzcycpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGxheVN0YW5kQW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnTU1NX0FfUkVGUkVTSElOR19CRVZFUkFHRScsICdzYW50aScpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5wbGF5QW5pbWF0aW9uT25jZSgnc2FudGlfZHJpbmtpbmcnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci53YWl0KDIwMDApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ0JVUlAnLCAnc2FudGknKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdCQVJFTFlfVEFTVEVEX0xJS0VfRFJVRycsICdzYW50aScpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLndhaXQoMjAwMCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnSV9BTV9TVEFUUklOR19UT19GRUVMX1JFQURZX1RPX1BMQVknLCAnc2FudGknKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYmFuZC5jaGFuZ2VBdHRyKCdIQVNfRFJJTksnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmNoYW5nZUF0dHIoJ0RFTElWRVJFRF9EUklOSycsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucmVtb3ZlR2xhc3MoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1RIQVRfU19USEVfU1BJUklUJyk7XG4gICAgICAgICAgICAgICAgfSk7XG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5cbmNvbnN0IEZVTExfRlJBTUUgPSAzO1xuY29uc3QgRkxPV0VSX0FORF9DT0NPTlVUX0ZSQU1FID0gMTtcbmNvbnN0IEZMT1dFUl9BTkRfU0tJUlRfRlJBTUUgPSAyO1xuY29uc3QgU0tJUlRfQU5EX0NPQ09OVVRfRlJBTUUgPSAwO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnY29zdHVtZScsXG4gICAgeDogMTM3LFxuICAgIHk6IDEzMCxcbiAgICBzcHJpdGVJZDogJ0NPU1RVTUVfSU5WX1NQUklURScsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ0NPU1RVTUVfSU5WX1NQUklURScsXG4gICAgbmFtZTogJ0NPU1RVTUUnLFxuICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBDb3N0dW1lIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSV9IQVZFX1RPX1BJQ0tfSVRfVVBfRklSU1QnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2NvY29udXQnKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENvY29udXQocGxheWVyKTtcbiAgICAgICAgICAgIHNlbGVjdGVkVGhpbmcudGhpbmcuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdmbG93ZXJzJykge1xuICAgICAgICAgICAgdGhpcy5hZGRGbG93ZXJzKHBsYXllcik7XG4gICAgICAgICAgICBzZWxlY3RlZFRoaW5nLnRoaW5nLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnc2tpcnQnKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFNraXJ0KHBsYXllcik7XG4gICAgICAgICAgICBzZWxlY3RlZFRoaW5nLnRoaW5nLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1cGVyLnVzZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0NvbXBsZXRlKCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfVEhJTktfTVlfTUFTVEVSUElFQ0VfSVNfQ09NUExFVEUnKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1RJTUVfVE9fR0lWRV9JVF9UT19KVUFOJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignSEFTX0NPQ09OVVQnKSAmJiB0aGlzLmdldEF0dHIoJ0hBU19GTE9XRVJTJykpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfU0hPVUxEX0FERF9BX1NLSVJUX1RPX0lUJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignSEFTX0NPQ09OVVQnKSAmJiB0aGlzLmdldEF0dHIoJ0hBU19TS0lSVCcpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdTT01FX0ZMT1dFUlNfV09VTERfQkVfTklDRScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0hBU19TS0lSVCcpICYmIHRoaXMuZ2V0QXR0cignSEFTX0ZMT1dFUlMnKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSUZfSV9BRERfU09NRV9CT09CU19JVF9XSUxMX0xPT0tfTElLRV9BX0hBV0FJSUFOX0RSRVNTJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRGcmFtZUZvckludmVudG9yeSgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5pc0NvbXBsZXRlKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBGVUxMX0ZSQU1FO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0hBU19DT0NPTlVUJykgJiYgdGhpcy5nZXRBdHRyKCdIQVNfRkxPV0VSUycpKSB7XG4gICAgICAgICAgICByZXR1cm4gRkxPV0VSX0FORF9DT0NPTlVUX0ZSQU1FO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0hBU19DT0NPTlVUJykgJiYgdGhpcy5nZXRBdHRyKCdIQVNfU0tJUlQnKSkge1xuICAgICAgICAgICAgcmV0dXJuIFNLSVJUX0FORF9DT0NPTlVUX0ZSQU1FO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0hBU19TS0lSVCcpICYmIHRoaXMuZ2V0QXR0cignSEFTX0ZMT1dFUlMnKSkge1xuICAgICAgICAgICAgcmV0dXJuIEZMT1dFUl9BTkRfU0tJUlRfRlJBTUU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEZVTExfRlJBTUU7XG4gICAgfVxuXG4gICAgYWRkQ29jb251dChwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlQXR0cignSEFTX0NPQ09OVVQnLCB0cnVlKTtcbiAgICAgICAgdGhpcy5pbmZvcm1QbGF5ZXJJZkNvbXBsZXRlKHBsYXllcik7XG4gICAgfVxuXG4gICAgYWRkRmxvd2VycyhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlQXR0cignSEFTX0ZMT1dFUlMnLCB0cnVlKTtcbiAgICAgICAgdGhpcy5pbmZvcm1QbGF5ZXJJZkNvbXBsZXRlKHBsYXllcik7XG4gICAgfVxuXG4gICAgYWRkU2tpcnQocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcikge1xuICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ0hBU19TS0lSVCcsIHRydWUpO1xuICAgICAgICB0aGlzLmluZm9ybVBsYXllcklmQ29tcGxldGUocGxheWVyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQ29tcGxldGUoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHIoJ0hBU19DT0NPTlVUJykgJiYgdGhpcy5nZXRBdHRyKCdIQVNfRkxPV0VSUycpICYmIHRoaXMuZ2V0QXR0cignSEFTX1NLSVJUJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbmZvcm1QbGF5ZXJJZkNvbXBsZXRlKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5pc0NvbXBsZXRlKCkpIHtcbiAgICAgICAgICAgIHBsYXllci5jaGFuZ2VBdHRyKCdDT1NUVU1FX0NPTVBMRVRFJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IEdsYXNzIH0gZnJvbSAnLi9HbGFzcyc7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdkdXN0JyxcbiAgICB4OiAyNDcsXG4gICAgeTogMTI4LFxuICAgIHNwcml0ZUlkOiAnRFVTVCcsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ0RVU1RfSU5WJyxcbiAgICBuYW1lOiAnU1VTUElDSU9VU19EVVNUJyxcbiAgICBnb1RvUG9zaXRpb246IHtcbiAgICAgICAgeDogMjQ4LFxuICAgICAgICB5OiAxNzdcbiAgICB9LFxuICAgIHBpY2thYmxlOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgRHVzdCBleHRlbmRzIFRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSV9CRVRfVEhJU19EVVNUX0NBTl9NQUtFX1NPTUVCT0RZX0xFU1NfU0hZJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdUSEFUX1NfU09NRV9ISUdITFlfU1VTUElDSU9VU19XSElURV9QT1dERVInKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCB1c2VBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX0hBVkVfVE9fUElDS19JVF9VUF9GSVJTVCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnZ2xhc3MnKSB7XG4gICAgICAgICAgICBsZXQgZ2xhc3MgPSA8R2xhc3M+IHNlbGVjdGVkVGhpbmcudGhpbmc7XG4gICAgICAgICAgICBnbGFzcy5maWxsV2l0aER1c3QocGxheWVyLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY2FuJykge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSV9TSE9VTERfUFJPQkFCTFlfTUlYX0lUX0lOX0FfR0xBU1MnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1cGVyLnVzZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdmbHlfY2FzZScsXG4gICAgeDogNjIsXG4gICAgeTogMTk4LFxuICAgIHNwcml0ZUlkOiAnRkxZX0NBU0UnLFxuICAgIG5hbWU6ICdmbHkgY2FzZScsXG4gICAganVzdERlY29yYXRpb246IHRydWUsXG4gICAgaXNGb3JlZ3JvdW5kOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgRmx5Q2FzZSBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgYWN0aXZlSW52ZW50b3J5IH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL0FjdGl2ZUludmVudG9yeS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgQ2FuIH0gZnJvbSAnLi9DYW4nO1xuXG5jb25zdCBOT1JNQUxfRlJBTUUgPSAwO1xuY29uc3QgUE9XREVSX0ZSQU1FID0gMTtcbmNvbnN0IEZJTExFRF9GUkFNRSA9IDI7XG5jb25zdCBQT1dERVJfRklMTEVEX0ZSQU1FID0gMztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2dsYXNzJyxcbiAgICB4OiA2NDEsXG4gICAgeTogMTI4LFxuICAgIHNwcml0ZUlkOiAnR0xBU1MnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdHTEFTU19JTlZfU1BSSVRFJyxcbiAgICBuYW1lOiAnR0xBU1MnLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiA2MzksXG4gICAgICAgIHk6IDE4OVxuICAgIH0sXG4gICAgcGlja2FibGU6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBHbGFzcyBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfSEFWRV9UT19QSUNLX0lUX1VQX0ZJUlNUJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdkdXN0Jykge1xuICAgICAgICAgICAgbGV0IGR1c3QgPSBzZWxlY3RlZFRoaW5nLnRoaW5nO1xuICAgICAgICAgICAgdGhpcy5maWxsV2l0aER1c3QocGxheWVyLCBkdXN0KTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY2FuJykge1xuICAgICAgICAgICAgbGV0IGNhbiA9IDxDYW4+IHNlbGVjdGVkVGhpbmcudGhpbmc7XG4gICAgICAgICAgICB0aGlzLmZpbGxXaXRoRHJpbmsocGxheWVyLCBjYW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIudXNlQWN0aW9uKHBsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnUkVBTExZX1VTRUZVTF9UT19QVVRfTElRVUlEU19JTlNJREUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lUX0lTX0lOREVFRF9BX0dMQVNTJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsV2l0aER1c3QocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgZHVzdDogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VBdHRyKCdQT1dERVJfSU5TSURFJywgdHJ1ZSk7XG4gICAgICAgIGR1c3QuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBmaWxsV2l0aERyaW5rKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGNhbjogQ2FuKSB7XG4gICAgICAgIGlmICghdGhpcy5nZXRBdHRyKCdGSUxMRUQnKSkge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VBdHRyKCdGSUxMRUQnLCB0cnVlKTtcbiAgICAgICAgICAgIGFjdGl2ZUludmVudG9yeS5yZWZyZXNoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJVF9JU19BTFJFQURZX0ZVTEwnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRnVubnkoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHIoJ0ZJTExFRCcpICYmIHRoaXMuZ2V0QXR0cignUE9XREVSX0lOU0lERScpO1xuICAgIH1cblxuICAgIGdldEZyYW1lRm9ySW52ZW50b3J5KCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0ZJTExFRCcpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdQT1dERVJfSU5TSURFJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUE9XREVSX0ZJTExFRF9GUkFNRTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZJTExFRF9GUkFNRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdldEF0dHIoJ1BPV0RFUl9JTlNJREUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIFBPV0RFUl9GUkFNRTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBOT1JNQUxfRlJBTUU7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuXG5sZXQgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2xhbXBfbGVmdCcsXG4gICAgeDogMTM2LFxuICAgIHk6IDI5LFxuICAgIHNwcml0ZUlkOiAnTEFNUCcsXG4gICAgbmFtZTogJ2xhbXAgbGVmdCcsXG4gICAganVzdERlY29yYXRpb246IHRydWUsXG4gICAgaXNGb3JlZ3JvdW5kOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgTGFtcExlZnQgZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5cbmxldCBvcHRpb25zID0ge1xuICAgIGlkOiAnbGFtcF9yaWdodCcsXG4gICAgeDogNDUwLFxuICAgIHk6IDI5LFxuICAgIHNwcml0ZUlkOiAnTEFNUCcsXG4gICAgbmFtZTogJ2xhbXAgcmlnaHQnLFxuICAgIGp1c3REZWNvcmF0aW9uOiB0cnVlLFxuICAgIGlzRm9yZWdyb3VuZDogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIExhbXBSaWdodCBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgQnJvb20gfSBmcm9tICcuL0Jyb29tJztcbmltcG9ydCB7IHJhbmRvbVRleHQgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvUmFuZG9tVGV4dCc7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdzY2lzc29ycycsXG4gICAgeDogMjkxLFxuICAgIHk6IDEyOCxcbiAgICBzcHJpdGVJZDogJ1NDSVNTT1JTJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnU0NJU1NPUlNfSU5WJyxcbiAgICBuYW1lOiAnU0NJU1NPUlMnLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiAzMDAsXG4gICAgICAgIHk6IDE4MFxuICAgIH0sXG4gICAgcGlja2FibGU6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBTY2lzc29ycyBleHRlbmRzIFRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnU0hJTllfQU5EX1NIQVJQJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAgICAgJ1NISU5ZX0FORF9TSEFSUCcsXG4gICAgICAgICAgICAgICAgJ05PVF9TQUZFX0hBVklOR19TQ0lTU09SU19BUk9VTkRfTVVTSUNJQU5TJ1xuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpIHtcbiAgICAgICAgbGV0IG90aGVyT2JqZWN0ID0gc2VsZWN0ZWRUaGluZy50aGluZztcbiAgICAgICAgaWYgKG90aGVyT2JqZWN0LmlkID09PSAnYnJvb20nKSB7XG4gICAgICAgICAgICBsZXQgYnJvb20gPSA8QnJvb20+IG90aGVyT2JqZWN0O1xuICAgICAgICAgICAgYnJvb20uY3V0V2l0aFNjaXNzb3JzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdXBlci51c2VBY3Rpb24ocGxheWVyKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgY29zdHVtZUNyZWF0b3IgfSBmcm9tICcuLi91dGlscy9Db3N0dW1lQ3JlYXRvcic7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdza2lydCcsXG4gICAgc3ByaXRlSWQ6ICdza2lydCcsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ1NLSVJUJyxcbiAgICBuYW1lOiAnU0tJUlQnLFxuICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBTa2lydCBleHRlbmRzIFRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5zYXkoJ1lFUF9JX0NPVUxEX0JVSUxEX0FfQ09TVFVNRV9XSVRIX1RISVMnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdmbG93ZXJzJykge1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkU2tpcnQocGxheWVyKTtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZEZsb3dlcnMocGxheWVyKTtcbiAgICAgICAgICAgIHNlbGVjdGVkVGhpbmcudGhpbmcuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2NvY29udXQnKSB7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRTa2lydChwbGF5ZXIpO1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkQ29jb251dChwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY29zdHVtZScpIHtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZFNraXJ0KHBsYXllcik7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1cGVyLnVzZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgU3BlZWNoQnViYmxlIH0gZnJvbSAnLi4vLi4vZW5naW5lL3VpL1NwZWVjaEJ1YmJsZSc7XG5pbXBvcnQgeyBDYW4gfSBmcm9tICcuL0Nhbic7XG5pbXBvcnQgeyB1aUJsb2NrZXIgfSBmcm9tICcuLi8uLi9lbmdpbmUvdWkvVUlCbG9ja2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBEaXJlY3Rpb25zIH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL0RpcmVjdGlvbnMnO1xuaW1wb3J0IHsgcmFuZG9tVGV4dCB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9SYW5kb21UZXh0JztcblxuY29uc3QgTk9STUFMX0ZSQU1FID0gMDtcbmNvbnN0IEdSRUFTRURfRlJBTUUgPSAxO1xuY29uc3QgR1JFQVNFRF9BTkRfUFVTSEVEX0ZSQU1FID0gMjtcblxuZXhwb3J0IGNsYXNzIFZlbmRpbmdNYWNoaW5lIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBzcGVlY2hCdWJibGU6IFNwZWVjaEJ1YmJsZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkOiAndmVuZGluZycsXG4gICAgICAgICAgICB4OiAxNTUsXG4gICAgICAgICAgICB5OiA5OCxcbiAgICAgICAgICAgIHNwcml0ZUlkOiAnVkVORElOR19NQUNISU5FX1NQUklURScsXG4gICAgICAgICAgICBuYW1lOiAnVkVORElOR19NQUNISU5FJyxcbiAgICAgICAgICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDE2NyxcbiAgICAgICAgICAgICAgICB5OiAxNzhcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXJlY3Rpb25Ub0xvb2s6IERpcmVjdGlvbnMuVVBcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuc3BlZWNoQnViYmxlID0gbmV3IFNwZWVjaEJ1YmJsZSh7XG4gICAgICAgICAgICBvd25lcjogdGhpcyxcbiAgICAgICAgICAgIGZvcmVncm91bmRUZXh0U3R5bGU6ICdGT05UXzMyX0JMQUNLJyxcbiAgICAgICAgICAgIHNoYWRvd1RleHRTdHlsZTogJ0ZPTlRfMzJfUFVSUExFJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHVzaEFjdGlvbihwbGF5ZXI6IFBsYXllcik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdQVVNIRUQnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ0lfQUxSRUFEWV9QVVNIRURfSVQnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdldEF0dHIoJ0dSRUFTRUQnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBsYXllci5nb1RvVGhpbmcodGhpcylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5zYXkoJ0FSR0gnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VBdHRyKCdQVVNIRUQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnVEhFX0ZMT09SX0lTX1NUSUNLWScpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnSUZfSV9DT1VMRF9QVVRfR1JFQVNFX0JFTE9XJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnYmFjb24nKSB7XG4gICAgICAgICAgICB0aGlzLmdyZWFzZVdpdGhCYWNvbihwbGF5ZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjb2luJykge1xuICAgICAgICAgICAgdGhpcy5nZXRDYW4ocGxheWVyLCBzZWxlY3RlZFRoaW5nLnRoaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfRE9OVF9LTk9XX0hPV19UT19VU0VfVEhBVF9XSVRIX1ZFTkRJTkdfTUFDSElORScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXkodGV4dDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwZWVjaEJ1YmJsZS5zYXkodGV4dCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBncmVhc2VXaXRoQmFjb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlQXR0cignR1JFQVNFRCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIHBsYXllci5zYXkoJ05JQ0VfSVRfV0lMTF9TTElERV9SRUFMTFlfV0VMTF9OT1cnKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q2FuKHBsYXllcjogUGxheWVyLCBjb2luOiBUaGluZyk6IHZvaWQge1xuICAgICAgICB1aUJsb2NrZXIuYmxvY2soKTtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvaW4uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNheSgnQ0xPTksnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IENhbigpO1xuICAgICAgICAgICAgICAgIHBsYXllci5zYXkoJ1dJU0VfUFVSQ0hBU0UnKTtcbiAgICAgICAgICAgICAgICB1aUJsb2NrZXIudW5ibG9jaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uU3RhdGVDaGFuZ2UoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5zcHJpdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0dSRUFTRUQnKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignUFVTSEVEJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZSA9IEdSRUFTRURfQU5EX1BVU0hFRF9GUkFNRTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWUgPSBHUkVBU0VEX0ZSQU1FO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWUgPSBOT1JNQUxfRlJBTUU7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgRG9vciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvRG9vcic7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1BsYXllcic7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuXG5leHBvcnQgY2xhc3MgQmFja3lhcmREb29yVG9CYWNrc3RhZ2UgZXh0ZW5kcyBEb29yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZDogJ0JBQ0tZQVJEX1RPX0JBQ0tTVEFHRScsXG4gICAgICAgICAgICBuYW1lOiAnRE9PUl9UT19CQUNLU1RBR0UnLFxuICAgICAgICAgICAgeDogMzYsXG4gICAgICAgICAgICB5OiAxMTUsXG4gICAgICAgICAgICBzcHJpdGVJZDogJ0JBQ0tZQVJEX0RPT1JfVE9fQkFDS1NUQUdFX1NQUklURScsXG4gICAgICAgICAgICBnb1RvUG9zaXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiA3OCxcbiAgICAgICAgICAgICAgICB5OiAyMDdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0aW5hdGlvblNjZW5lSWQ6ICdCQUNLU1RBR0UnLFxuICAgICAgICAgICAgcmVsYXRlZERvb3JJZDogJ0JBQ0tTVEFHRV9UT19CQUNLWUFSRCdcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ09QRU4nKSkge1xuICAgICAgICAgICAgcmV0dXJuICdCQUNLU1RBR0UnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICdET09SX1RPX0JBQ0tTVEFHRSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdGFrZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnQ0FOTk9UX1BJQ0tfQV9ET09SX1VQJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNwZWFrQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAnSElfRE9PUl9IT1dfQVJFX1lPVV9UT0RBWScsXG4gICAgICAgICAgICAnU0hFX0lTX1NIWV9ET0VTTlRfV0FOVF9UT19UQUxLX1RPX01FJyxcbiAgICAgICAgICAgICdJX0hBVkVfQkVUVEVSX1RISU5HU19UT19ET19USEFOX1RBTEtJTkcnXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdUSEFUX1NfVEhFX0RPT1JfVE9fR09fQkFDS19UT19USEVfQkFDS1NUQUdFJyk7XG4gICAgfVxufSIsImltcG9ydCB7IFNjZW5lIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9TY2VuZSc7XG5pbXBvcnQgeyBCYWNreWFyZERvb3JUb0JhY2tzdGFnZSB9IGZyb20gJy4vQmFja3lhcmREb29yVG9CYWNrc3RhZ2UnO1xuaW1wb3J0IHsgRmxvd2VycyB9IGZyb20gJy4vRmxvd2Vycyc7XG5pbXBvcnQgeyBCaWxpIH0gZnJvbSAnLi9CaWxpJztcbmltcG9ydCB7IExhbXBCYWNreWFyZCB9IGZyb20gJy4vTGFtcEJhY2t5YXJkJztcbmltcG9ydCB7IE1vb24gfSBmcm9tICcuL01vb24nO1xuaW1wb3J0IHsgU3RhciB9IGZyb20gJy4vU3Rhcic7XG5pbXBvcnQgeyBDdXRGbG93ZXJzIH0gZnJvbSAnLi9DdXRGbG93ZXJzJztcbmltcG9ydCB7IEJhbGxvb24gfSBmcm9tICcuL0JhbGxvb24nO1xuaW1wb3J0IHsgUG9seWdvbiB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9Qb2x5Z29uJztcbmltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9JbnRlcmZhY2VzJztcblxuY29uc3Qgc2NlbmVPcHRpb25zID0ge1xuICAgIGlkOiAnQkFDS1lBUkQnLFxuICAgIGJhY2tncm91bmRJZDogJ0JBQ0tZQVJEX0JHJyxcbiAgICBib3VuZGFyaWVzQ29uZmlnOiBuZXcgUG9seWdvbihbXG4gICAgICAgIHt4OiA2MCwgeTogMjE2fSxcbiAgICAgICAge3g6IDExNywgeTogMTczfSxcbiAgICAgICAge3g6IDI0MywgeTogMTczfSxcbiAgICAgICAge3g6IDI0MywgeTogMTk3fSxcbiAgICAgICAge3g6IDQxNSwgeTogMTk3fSxcbiAgICAgICAge3g6IDQxNSwgeTogMjE2fVxuICAgIF0pLFxuICAgIHRoaW5nczogW1xuICAgICAgICBuZXcgQmFja3lhcmREb29yVG9CYWNrc3RhZ2UoKSxcbiAgICAgICAgbmV3IEN1dEZsb3dlcnMoKSxcbiAgICAgICAgbmV3IEZsb3dlcnMoKSxcbiAgICAgICAgbmV3IEJhbGxvb24oKSxcbiAgICAgICAgbmV3IEJpbGkoKSxcbiAgICAgICAgbmV3IExhbXBCYWNreWFyZCgpLFxuICAgICAgICBuZXcgTW9vbigpXG4gICAgXVxufTtcblxuXG5jb25zdCBTVEFSX05VTUJFUiA9IDcwO1xuY29uc3QgU0tZX1NUQVJUIDogSVBvaW50ID0geyB4OiAxMDgsIHk6IDF9O1xuY29uc3QgU0tZX0VORCA6IElQb2ludCA9IHsgeDogNDM2LCB5OiA3NH07XG5jb25zdCBNSU5fT1BBQ0lUWSA9IDAuMjtcbmNvbnN0IE1BWF9PUEFDSVRZID0gMC44O1xuXG5leHBvcnQgY2xhc3MgQmFja3lhcmRTY2VuZSBleHRlbmRzIFNjZW5lIHtcbiAgICBwcml2YXRlIHN0YXJzOiBBcnJheTxTdGFyPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihzY2VuZU9wdGlvbnMpO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICBzdXBlci5zaG93KCk7XG4gICAgICAgIHRoaXMuY3JlYXRlU2t5KCk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3lTa3koKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNreSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGFycyA9IFtdO1xuXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPFNUQVJfTlVNQkVSOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuZXdTdGFyID0gbmV3IFN0YXIoe1xuICAgICAgICAgICAgICAgIHg6IFNLWV9TVEFSVC54ICsgTWF0aC5yYW5kb20oKSooU0tZX0VORC54IC0gU0tZX1NUQVJULngpLFxuICAgICAgICAgICAgICAgIHk6IFNLWV9TVEFSVC55ICsgTWF0aC5yYW5kb20oKSooU0tZX0VORC55IC0gU0tZX1NUQVJULnkpLFxuICAgICAgICAgICAgICAgIGlkOiAnc3Rhcl8nICsgaSxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiBNSU5fT1BBQ0lUWSArIE1hdGgucmFuZG9tKCkqKE1BWF9PUEFDSVRZIC0gTUlOX09QQUNJVFkpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5ld1N0YXIuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy5zdGFycy5wdXNoKG5ld1N0YXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95U2t5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YXJzID0gdGhpcy5zdGFycyB8fCBbXTtcbiAgICAgICAgdGhpcy5zdGFycy5mb3JFYWNoKHN0YXIgPT4gc3Rhci5kZXN0cm95KCkpO1xuICAgICAgICB0aGlzLnN0YXJzID0gW107XG4gICAgfVxufSIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEaXJlY3Rpb25zIH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL0RpcmVjdGlvbnMnO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuLi8uLi9lbmdpbmUvdWkvU3R5bGUnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBzY2VuZXMgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2NlbmVzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBCaWxpIH0gZnJvbSAnLi9CaWxpJztcbmltcG9ydCB7IHVpQmxvY2tlciB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9VSUJsb2NrZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgYW5hbHl0aWNzIH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL0FuYWx5dGljcyc7XG5cbmxldCBzcHJpdGVPcHRpb25zID0gbmV3IE1hcCgpO1xuXG5zcHJpdGVPcHRpb25zLnNldCgncXVpZXQnLCB7IGZyYW1lczogWzBdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnZmxvYXRpbmcnLCB7IGZyYW1lczogWzAsIDEsIDIsIDMsIDQsIDVdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnZXhwbG9kZScsIHsgZnJhbWVzOiBbNiwgOCwgOV19KTtcbmNvbnN0IEVYUExPREVEX0ZSQU1FID0gOTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2JhbGxvb24nLFxuICAgIHg6IDI1MixcbiAgICB5OiA5NixcbiAgICBzcHJpdGVJZDogJ0JBTExPT05fU1BSSVRFJyxcbiAgICBuYW1lOiAnQkFMTE9PTicsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDIzOSxcbiAgICAgICAgeTogMTg1XG4gICAgfSxcbiAgICBkaXJlY3Rpb25Ub0xvb2s6IERpcmVjdGlvbnMuUklHSFQsXG4gICAgc3ByaXRlT3B0aW9uczogc3ByaXRlT3B0aW9ucyxcbiAgICBhbmltYXRpb25TcGVlZDogc3R5bGUuREVGQVVMVF9BTklNQVRJT05fU1BFRURcbn07XG5cbmNvbnN0IE1JTl9USU1FX0ZPUl9BTklNQVRJT04gPSAzMDA7XG5jb25zdCBNQVhfVElNRV9GT1JfQU5JTUFUSU9OID0gNTAwMDtcblxuZXhwb3J0IGNsYXNzIEJhbGxvb24gZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBwcml2YXRlIGxhc3RUaW1lb3V0OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc2hvdygpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIuc2hvdygpO1xuICAgICAgICB0aGlzLnBsYXlBbmltYXRpb25Tb21ldGltZSgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB1c2VBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ3NjaXNzb3JzJykge1xuICAgICAgICAgICAgbGV0IGJpbGkgPSA8QmlsaT4gc2NlbmVzLmdldFNjZW5lQnlJZCgnQkFDS1lBUkQnKS5nZXRUaGluZ0J5SWQoJ2JpbGknKTtcbiAgICAgICAgICAgIGlmKGJpbGkuZ2V0QXR0cignRFJVTksnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhwbG9kZUJhbGxvb24ocGxheWVyLCBiaWxpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnNheSgnSEVfSVNfQkVJTkdfR09PRF9GT1JfTk9XX05PX05FRURfVE9fRVhQTE9ERV9JVCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIudXNlQWN0aW9uKHBsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5zYXkoJ1RIQVRfSVNfQV9IVUdFX0JBTExPT05fUVVJVEVfU0NBUllfSUZfSVRfRVhQTE9ERVMnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdGFrZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdOT1BFX0lfRE9OVF9XQU5UX1RPX1RBS0VfQklMSVNfQkFMTE9PTicpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGxheUFuaW1hdGlvblNvbWV0aW1lKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZ2V0QXR0cignRVhQTE9ERUQnKSkge1xuICAgICAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uKCdxdWlldCcpO1xuICAgICAgICAgICAgdGhpcy5sYXN0VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheUFuaW1hdGlvbk9uY2UoJ2Zsb2F0aW5nJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxheUFuaW1hdGlvblNvbWV0aW1lKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCB0aGlzLmdldFRpbWVGb3JOZXh0QW5pbWF0aW9uKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaW1lRm9yTmV4dEFuaW1hdGlvbigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTUlOX1RJTUVfRk9SX0FOSU1BVElPTiArIE1hdGgucmFuZG9tKCkqKE1BWF9USU1FX0ZPUl9BTklNQVRJT04gLSBNSU5fVElNRV9GT1JfQU5JTUFUSU9OKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGV4cGxvZGVCYWxsb29uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJpbGk6IEJpbGkpOiB2b2lkIHtcbiAgICAgICAgYW5hbHl0aWNzLnNlbmRFdmVudCgnZ2FtZScsICdleHBsb2RlX2JhbGxvb24nKTtcbiAgICAgICAgYW5hbHl0aWNzLnNlbmRFdmVudCgnZ2FtZScsICdlbmRfZ2FtZScpO1xuICAgICAgICB1aUJsb2NrZXIuYmxvY2soKTtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIucGxheUFuaW1hdGlvbk9uY2UoJ3BpZXJjZV9iYWxsb29uJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXlBbmltYXRpb25PbmNlKCdleHBsb2RlJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlQXR0cignRVhQTE9ERUQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cGxvZGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmlsaS5zYXkoJ0lfQU1fQVdBS0UnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbGkuc2F5KCdJX0FNX05PVF9EUlVOS19BTllNT1JFJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaWxpLnNheSgnV0VfQ0FOX1BMQVlfVEhFX0NPTkNFUlRfTk9XJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIubW92ZVRvKHsgeDogMTgxLCB5OiAyMTJ9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcGxheWVyLmxvb2tBdChEaXJlY3Rpb25zLkRPV04pO1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdTT19USElTX0lTX1RIRV9FTkRfRk9MS1MnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1dFX0xBVUdIRUQnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1dFX0NSSUVEJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdBTkRfV0VfTEVBUk5FRCcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLndhaXQoMTAwMCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdUSEFOS1NfRk9SX0hFTFBJTkdfTUVfSU5fVEhJU19BRFZFTlRVUkUnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1NFRV9ZT1VfU09PTicpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBhbmFseXRpY3Muc2VuZEV2ZW50KCdnYW1lJywgJ2VuZF9nYW1lJyk7XG4gICAgICAgICAgICAgICAgdWlCbG9ja2VyLnVuYmxvY2soKTtcbiAgICAgICAgICAgICAgICBwaGFzZXJHYW1lLnZhbHVlLnN0YXRlLnN0YXJ0KCdjcmVkaXRzJyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGV4cGxvZGUoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMubGFzdFRpbWVvdXQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5sYXN0VGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5jdXJyZW50QW5pbSkge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5jdXJyZW50QW5pbS5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWUgPSBFWFBMT0RFRF9GUkFNRTtcbiAgICAgICAgdGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5zdG9wKCk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBTcGVlY2hCdWJibGUgfSBmcm9tICcuLi8uLi9lbmdpbmUvdWkvU3BlZWNoQnViYmxlJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbldpdGhCaWxpIH0gZnJvbSAnLi9Db252ZXJzYXRpb25XaXRoQmlsaSc7XG5pbXBvcnQgeyBEaXJlY3Rpb25zIH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL0RpcmVjdGlvbnMnO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuLi8uLi9lbmdpbmUvdWkvU3R5bGUnO1xuaW1wb3J0IHsgcmFuZG9tVGV4dCB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9SYW5kb21UZXh0JztcbmltcG9ydCB7IGFuYWx5dGljcyB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9BbmFseXRpY3MnO1xuXG5sZXQgc3ByaXRlT3B0aW9ucyA9IG5ldyBNYXAoKTtcblxuc3ByaXRlT3B0aW9ucy5zZXQoJ3F1aWV0JywgeyBmcmFtZXM6IFswLCAxLCAyLCAzLCA0LCA1XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3Ntb2tpbmcnLCB7IGZyYW1lczogWzYsIDcsIDgsIDksIDEwLCAxMSwgMTJdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnZHJpbmtpbmcnLCB7IGZyYW1lczogWzEzLCAxNCwgMTUsIDE2LCAxNywgMThdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgndGFsa2luZycsIHsgZnJhbWVzOiBbMTksIDIwLCAyMSwgMjIsIDIzXX0pO1xuXG5sZXQgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2JpbGknLFxuICAgIHg6IDI2NSxcbiAgICB5OiAxMjEsXG4gICAgc3ByaXRlSWQ6ICdCSUxJX1NQUklURScsXG4gICAgbmFtZTogJ0JJTEknLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiAyMzksXG4gICAgICAgIHk6IDE4NVxuICAgIH0sXG4gICAgZGlyZWN0aW9uVG9Mb29rOiBEaXJlY3Rpb25zLlJJR0hULFxuICAgIHNwcml0ZU9wdGlvbnM6IHNwcml0ZU9wdGlvbnMsXG4gICAgYW5pbWF0aW9uU3BlZWQ6IHN0eWxlLkRFRkFVTFRfQU5JTUFUSU9OX1NQRUVEXG59O1xuXG5jb25zdCBNSU5fVElNRV9GT1JfQU5JTUFUSU9OID0gMTAwMDtcbmNvbnN0IE1BWF9USU1FX0ZPUl9BTklNQVRJT04gPSA1MDAwO1xuXG5leHBvcnQgY2xhc3MgQmlsaSBleHRlbmRzIFRoaW5nIHtcblxuICAgIHByaXZhdGUgc3BlZWNoQnViYmxlOiBTcGVlY2hCdWJibGU7XG4gICAgcHJpdmF0ZSBpc1RhbGtpbmc6IEJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIGN1cnJlbnRUaW1lb3V0OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuc3BlZWNoQnViYmxlID0gbmV3IFNwZWVjaEJ1YmJsZSh7XG4gICAgICAgICAgICBvd25lcjogdGhpcyxcbiAgICAgICAgICAgIGZvcmVncm91bmRUZXh0U3R5bGU6ICdGT05UXzMyX1lFTExPVycsXG4gICAgICAgICAgICBzaGFkb3dUZXh0U3R5bGU6ICdGT05UXzMyX0JMQUNLJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignRFJVTksnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdEUlVOS19CSUxJJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnQklMSSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ0RSVU5LJykpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkocmFuZG9tVGV4dChcbiAgICAgICAgICAgICAgICAnSEVfSVNfRFJVTktfQVNfQV9TS1VOSycsXG4gICAgICAgICAgICAgICAgJ1BST0JBQkxZX0lGX0lfU0NBUkVfSElNX0hFX1dJTExfV0FLRV9VUCcsXG4gICAgICAgICAgICAgICAgJ0lfSEFWRV9UT19GSU5EX0FfV0FZX1RPX1NPQkVSX0hJTV9VUCdcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheShyYW5kb21UZXh0KFxuICAgICAgICAgICAgICAgICdIRV9JU19EUklOS0lOR19MSUtFX0FfTUFOSUFDJyxcbiAgICAgICAgICAgICAgICAnQUxMX0lOX0FMTF9IRV9JU19BX0dPT0RfR1VZJyxcbiAgICAgICAgICAgICAgICAnTklDRV9DT1NUVU1FX0hFX01BREUnXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc3BlYWtBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBhbmFseXRpY3Muc2VuZEV2ZW50KCdnYW1lJywgJ3RhbGtfdG9fYmlsaScpO1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpLnRoZW4oXG4gICAgICAgICAgICAoKSA9PiBuZXcgQ29udmVyc2F0aW9uV2l0aEJpbGkocGxheWVyLCB0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHNheSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5pc1RhbGtpbmcgPSB0cnVlO1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRUaW1lb3V0KSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuY3VycmVudFRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGxheUFuaW1hdGlvbigndGFsa2luZycpO1xuICAgICAgICByZXR1cm4gdGhpcy5zcGVlY2hCdWJibGUuc2F5KHRleHQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc1RhbGtpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucGxheUFuaW1hdGlvblNvbWV0aW1lKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNob3coKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnNob3coKTtcbiAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uU29tZXRpbWUoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2l2ZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5zYXkoJ1RIRV9PTkxZX1RISU5HX0hFX1dBTlRTX1JJR0hUX05PV19JU19CRUVSJylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnQU5EX0lfQU1fTk9UX0dPSU5HX1RPX0dJVkVfSElNX0FOWScpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9EdXBsaWNhdGVkIGluIEJhbGxvb24sIGlmIHdlIGFkZCBtb3JlIG9iamVjdHMgbGlrZSB0aGlzLCBjb25zaWRlciBtb3ZpbmcgdG8gVGhpbmcgbW9kZWxcbiAgICBwcml2YXRlIHBsYXlBbmltYXRpb25Tb21ldGltZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uKCdxdWlldCcpO1xuICAgICAgICB0aGlzLmN1cnJlbnRUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsYXlBbmltYXRpb25PbmNlKHRoaXMuZ2V0UmFuZG9tQW5pbWF0aW9uKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheUFuaW1hdGlvblNvbWV0aW1lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgdGhpcy5nZXRUaW1lRm9yTmV4dEFuaW1hdGlvbigpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRpbWVGb3JOZXh0QW5pbWF0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNSU5fVElNRV9GT1JfQU5JTUFUSU9OICsgTWF0aC5yYW5kb20oKSooTUFYX1RJTUVfRk9SX0FOSU1BVElPTiAtIE1JTl9USU1FX0ZPUl9BTklNQVRJT04pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UmFuZG9tQW5pbWF0aW9uKCk6IHN0cmluZyB7XG4gICAgICAgIGlmKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgICAgICAgIHJldHVybiAnc21va2luZyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ2RyaW5raW5nJztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbnZlcnNhdGlvbiwgSUNvbnZlcnNhdGlvblNjcmlwdCB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvQ29udmVyc2F0aW9uJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbkxpbmUgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL0NvbnZlcnNhdGlvbkxpbmUnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgQmlsaSB9IGZyb20gJy4vQmlsaSc7XG5pbXBvcnQgeyBzY2VuZXMgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2NlbmVzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuXG5jb25zdCBzY3JpcHQ6IElDb252ZXJzYXRpb25TY3JpcHQgPSB7XG4gICAgJ2luaXRpYWwnOiBbXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAnSEVZX0JJTElfSE9XX0lTX0lUX0dPSU5HJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnaW5pdGlhbCcsXG4gICAgICAgICAgICAocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmlsaTogQmlsaSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaWxpLnNheSgnTk9UX1RPX0JBRF9BTExfVEhJTkdTX0NPTlNJREVSRUQnKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmlsaS5zYXkoJ0lfSEVBUkRfVEhFX0dVWVNfQVJFX0hBVklOR19TT01FX1BST0JMRU1TJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiaWxpLnNheSgnSV9XSUxMX1dBSVRfRk9SX1RIRU1fVE9fQkVfU09MVkVEJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApLFxuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1BMRUFTRV9ET05UX0RSSU5LX1RPT19NVUNIJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnaW5pdGlhbCcsXG4gICAgICAgICAgICAocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmlsaTogQmlsaSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaWxpLnNheShyYW5kb21UZXh0KFxuICAgICAgICAgICAgICAgICAgICAnWUVTX01PTScsXG4gICAgICAgICAgICAgICAgICAgICdJX0FNX0pVU1RfS0VFUElOR19NWV9USFJPQVRfV0FSTScsXG4gICAgICAgICAgICAgICAgICAgICdIQVZFX0lfRVZFUl9GQUlMRURfWU9VJyxcbiAgICAgICAgICAgICAgICAgICAgJ1lPVVJfTEFDS19PRl9DT05GSURFTkNFX0RJU1NBUE9JTlRTX01FJ1xuICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgfVxuICAgICAgICApLFxuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnT0tfU0VFX1lPVV9MQVRFUicsICdlbmQnKVxuICAgIF0sXG4gICAgJ2RydW5rJzogW1xuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ0hFWV9CSUxJX0hPV19JU19JVF9HT0lORyc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2RydW5rJyxcbiAgICAgICAgICAgIChwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiaWxpOiBCaWxpKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbGkuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAgICAgICAgICdEUlVOS18xJyxcbiAgICAgICAgICAgICAgICAgICAgJ0RSVU5LXzInLFxuICAgICAgICAgICAgICAgICAgICAnRFJVTktfMycsXG4gICAgICAgICAgICAgICAgICAgICdEUlVOS180JyxcbiAgICAgICAgICAgICAgICAgICAgJ0RSVU5LXzUnLFxuICAgICAgICAgICAgICAgICAgICAnRFJVTktfNidcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKSxcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdPSF9NWV9ZT1VfQVJFX0RSVU5LX0FSRU5UX1lPVSc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2RydW5rJyxcbiAgICAgICAgICAgIChwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiaWxpOiBCaWxpKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbGkuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAgICAgICAgICdEUlVOS18xJyxcbiAgICAgICAgICAgICAgICAgICAgJ0RSVU5LXzInLFxuICAgICAgICAgICAgICAgICAgICAnRFJVTktfMycsXG4gICAgICAgICAgICAgICAgICAgICdEUlVOS180JyxcbiAgICAgICAgICAgICAgICAgICAgJ0RSVU5LXzUnLFxuICAgICAgICAgICAgICAgICAgICAnRFJVTktfNidcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKSxcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ09LX1NFRV9ZT1VfTEFURVInLCAnZW5kJylcbiAgICBdXG59O1xuXG5leHBvcnQgY2xhc3MgQ29udmVyc2F0aW9uV2l0aEJpbGkgZXh0ZW5kcyBDb252ZXJzYXRpb24ge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIHByb3RlY3RlZCBvdGhlclBlcnNvbjogVGhpbmcpIHtcbiAgICAgICAgc3VwZXIocGxheWVyLCBvdGhlclBlcnNvbik7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRTdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGJpbGkgPSBzY2VuZXMuZ2V0U2NlbmVCeUlkKCdCQUNLWUFSRCcpLmdldFRoaW5nQnlJZCgnYmlsaScpO1xuICAgICAgICBpZiAoYmlsaS5nZXRBdHRyKCdEUlVOSycpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2RydW5rJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAnaW5pdGlhbCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9hZFNjcmlwdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zY3JpcHQgPSBzY3JpcHQ7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuXG5sZXQgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2N1dF9mbG93ZXJzJyxcbiAgICB4OiAxMjcsXG4gICAgeTogMTQ4LFxuICAgIHNwcml0ZUlkOiAnQ1VUX0ZMT1dFUlMnLFxuICAgIG5hbWU6ICdDVVRfRkxPV0VSUycsXG4gICAganVzdERlY29yYXRpb246IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBDdXRGbG93ZXJzIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBjb3N0dW1lQ3JlYXRvciB9IGZyb20gJy4uL3V0aWxzL0Nvc3R1bWVDcmVhdG9yJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2Zsb3dlcnMnLFxuICAgIHg6IDEyNyxcbiAgICB5OiAxNDgsXG4gICAgc3ByaXRlSWQ6ICdGTE9XRVJTJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnRkxPV0VSU19JTlYnLFxuICAgIG5hbWU6ICdGTE9XRVJTJyxcbiAgICBnb1RvUG9zaXRpb246IHtcbiAgICAgICAgeDogMTM2LFxuICAgICAgICB5OiAxNzhcbiAgICB9LFxuICAgIHBpY2thYmxlOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgRmxvd2VycyBleHRlbmRzIFRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSV9CRVRfSV9DT1VMRF9ET19BX0JFQVVUSUZVTF9DT1NUVU1FX1dJVEhfSVQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ1ZFUllfQkVBVVRJRlVMX0ZMT1dFUlMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCB1c2VBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcikge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2NvY29udXQnKSB7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRDb2NvbnV0KHBsYXllcik7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRGbG93ZXJzKHBsYXllcik7XG4gICAgICAgICAgICBzZWxlY3RlZFRoaW5nLnRoaW5nLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdza2lydCcpIHtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZFNraXJ0KHBsYXllcik7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRGbG93ZXJzKHBsYXllcik7XG4gICAgICAgICAgICBzZWxlY3RlZFRoaW5nLnRoaW5nLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjb3N0dW1lJykge1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkRmxvd2VycyhwbGF5ZXIpO1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdXBlci51c2VBY3Rpb24ocGxheWVyKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdsYW1wX2Rvb3InLFxuICAgIHg6IDI2LFxuICAgIHk6IDc1LFxuICAgIHNwcml0ZUlkOiAnTEFNUF9CQUNLWUFSRCcsXG4gICAgbmFtZTogJ0xBTVBfQkFDS1lBUkQnLFxuICAgIGp1c3REZWNvcmF0aW9uOiB0cnVlLFxuICAgIGlzRm9yZWdyb3VuZDogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIExhbXBCYWNreWFyZCBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdtb29uJyxcbiAgICB4OiAzODEsXG4gICAgeTogMjIsXG4gICAgc3ByaXRlSWQ6ICdNT09OJyxcbiAgICBuYW1lOiAnTU9PTicsXG4gICAganVzdERlY29yYXRpb246IHRydWUsXG4gICAgaXNGb3JlZ3JvdW5kOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgTW9vbiBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdzdGFyJyxcbiAgICB4OiAxLFxuICAgIHk6IDEsXG4gICAgc3ByaXRlSWQ6ICdTVEFSJyxcbiAgICBuYW1lOiAnU1RBUicsXG4gICAganVzdERlY29yYXRpb246IHRydWVcbn07XG5cbmludGVyZmFjZSBJU3Rhck9wdGlvbnMge1xuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBvcGFjaXR5OiBudW1iZXJcbn1cblxuZXhwb3J0IGNsYXNzIFN0YXIgZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoZXh0cmFPcHRpb25zOiBJU3Rhck9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGNvcnJlY3RPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywgZXh0cmFPcHRpb25zKTtcbiAgICAgICAgc3VwZXIoY29ycmVjdE9wdGlvbnMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvc3R1bWUgfSBmcm9tICcuLi9iYWNrc3RhZ2VTY2VuZS9Db3N0dW1lJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuXG5jbGFzcyBDb3N0dW1lQ3JlYXRvciB7XG4gICAgcHJpdmF0ZSBjb3N0dW1lOiBDb3N0dW1lO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29zdHVtZSA9IG51bGw7XG4gICAgfVxuXG4gICAgYWRkRmxvd2VycyhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlQ29zdHVtZUlmTmVlZGVkKCk7XG4gICAgICAgIHRoaXMuY29zdHVtZS5hZGRGbG93ZXJzKHBsYXllcik7XG4gICAgfVxuXG4gICAgYWRkQ29jb251dChwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlQ29zdHVtZUlmTmVlZGVkKCk7XG4gICAgICAgIHRoaXMuY29zdHVtZS5hZGRDb2NvbnV0KHBsYXllcik7XG4gICAgfVxuXG4gICAgYWRkU2tpcnQocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcikge1xuICAgICAgICB0aGlzLmNyZWF0ZUNvc3R1bWVJZk5lZWRlZCgpO1xuICAgICAgICB0aGlzLmNvc3R1bWUuYWRkU2tpcnQocGxheWVyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNvc3R1bWVJZk5lZWRlZCgpOiB2b2lkIHtcbiAgICAgICAgaWYoIXRoaXMuY29zdHVtZSkge1xuICAgICAgICAgICAgdGhpcy5jb3N0dW1lID0gbmV3IENvc3R1bWUoKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5leHBvcnQgY29uc3QgY29zdHVtZUNyZWF0b3IgPSBuZXcgQ29zdHVtZUNyZWF0b3IoKTsiLCJpbXBvcnQgeyBwaGFzZXIgfSBmcm9tICcuL1BoYXNlcic7XG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL2VuZ2luZS91aS9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBCb290U2NlbmUgfSBmcm9tICcuL0Jvb3RTY2VuZSc7XG5pbXBvcnQgeyBQcmVsb2FkZXJTY2VuZSB9IGZyb20gJy4vUHJlbG9hZGVyU2NlbmUnO1xuaW1wb3J0IHsgU3RhcnRNZW51U2NlbmUgfSBmcm9tICcuL1N0YXJ0TWVudVNjZW5lJztcbmltcG9ydCB7IENyZWRpdHNTY2VuZSB9IGZyb20gJy4vQ3JlZGl0c1NjZW5lJztcbmltcG9ydCB7IHBsYXlTY2VuZSB9IGZyb20gJy4vUGxheVNjZW5lJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuL2VuZ2luZS9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZighaXNNb2JpbGUoKSkge1xuICAgICAgICBsZXQgZ2FtZSA9IG5ldyBwaGFzZXIuR2FtZShsYXlvdXQuV0lEVEgsIGxheW91dC5IRUlHSFQsIHBoYXNlci5BVVRPLCAnZ2FtZScpO1xuXG4gICAgICAgIHBoYXNlckdhbWUudmFsdWUgPSBnYW1lO1xuXG4gICAgICAgIGdhbWUuc3RhdGUuYWRkKCdib290JywgQm9vdFNjZW5lKTtcbiAgICAgICAgZ2FtZS5zdGF0ZS5hZGQoJ3ByZWxvYWRlcicsIFByZWxvYWRlclNjZW5lKTtcbiAgICAgICAgZ2FtZS5zdGF0ZS5hZGQoJ3N0YXJ0TWVudScsIFN0YXJ0TWVudVNjZW5lKTtcbiAgICAgICAgZ2FtZS5zdGF0ZS5hZGQoJ3BsYXknLCBwbGF5U2NlbmUpO1xuICAgICAgICBnYW1lLnN0YXRlLmFkZCgnY3JlZGl0cycsIENyZWRpdHNTY2VuZSk7XG5cbiAgICAgICAgZ2FtZS5zdGF0ZS5zdGFydCgnYm9vdCcpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGlzTW9iaWxlKCkge1xuICAgIGNvbnN0IE1JTl9XSURUSCA9IDQwMDtcbiAgICBjb25zdCBNSU5fSEVJR0hUID0gNDAwO1xuICAgIGxldCB3ID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcbiAgICBsZXQgaCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKTtcblxuICAgIHJldHVybiAodyA8IE1JTl9IRUlHSFQpIHx8IChoIDwgTUlOX0hFSUdIVCk7XG59XG4iXX0=
