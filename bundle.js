(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./engine/ui/LayoutManager.singleton');
const Phaser_1 = require('./Phaser');
exports.BootScene = {
    preload: function () {
        // load here assets required for the loading screen
        this.game.load.image('preloader_bar', 'assets/images/ui/PRELOADER_BAR.png');
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

},{"./Phaser":3,"./engine/ui/LayoutManager.singleton":37}],2:[function(require,module,exports){
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

},{"./game/DoctortillaGame":56}],5:[function(require,module,exports){
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

},{"./game/AssetsManager":54}],6:[function(require,module,exports){
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

},{"./engine/stores/Labels.store":27,"./engine/ui/LayoutManager.singleton":37,"./engine/utils/analytics":53}],7:[function(require,module,exports){
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

},{"../ui/ConversationUI":31,"../utils/Observable":49}],8:[function(require,module,exports){
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

},{"../stores/Verbs.store":28,"../utils/ActionDispatcher":47,"./Thing":19}],10:[function(require,module,exports){
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
const SoundManager_1 = require('../sound/SoundManager');
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
        if (this.options.songs) {
            SoundManager_1.sound.playMusic(this.options.songs);
        }
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

},{"../sound/SoundManager":20,"../state/ActiveInventory.singleton":21,"../state/PhaserGame.singleton":22,"../state/Scenes.singleton":23,"../state/SelectedObjects":24,"../state/SelectedVerb.singleton":25,"../stores/Labels.store":27,"../stores/Verbs.store":28,"../ui/GraphicUI":33,"../utils/ActionDispatcher":47,"./GameCamera":11}],11:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":22,"../ui/Style":41}],12:[function(require,module,exports){
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

},{"../utils/ActionDispatcher":47,"../utils/Observable":49}],13:[function(require,module,exports){
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

},{"../utils/Observable":49}],14:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":22,"../utils/Segment":52}],15:[function(require,module,exports){
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

},{"../ui/SpeechBubble":40,"../ui/UILayers.singleton":45,"../utils/Directions":48,"./Inventory":13,"./PlayerMovementHandler":16}],16:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":22,"../state/Scenes.singleton":23,"./PathFinder":14}],17:[function(require,module,exports){
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

},{"../ui/UILayers.singleton":45,"../utils/ActionDispatcher":47,"./SceneBoundaries":18}],18:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":22}],19:[function(require,module,exports){
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

},{"../state/ActiveInventory.singleton":21,"../stores/Verbs.store":28,"../ui/UILayers.singleton":45,"../utils/ActionDispatcher":47,"../utils/RandomText":51}],20:[function(require,module,exports){
"use strict";
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const Observable_1 = require('../utils/Observable');
const LOCAL_STORAGE_ID = 'dg_sound';
const LOCAL_STORAGE_ON = 'on';
const LOCAL_STORAGE_OFF = 'off';
class SoundManager {
    constructor() {
        this.onChange = new Observable_1.Observable();
        this.restoreLastSettings();
        this.onChange.notifyObservers(this.on);
        this.updateSoundVolume();
    }
    turnOn() {
        this.on = true;
        this.storeSettings();
        this.updateSoundVolume();
        this.onChange.notifyObservers(this.on);
    }
    turnOff() {
        this.on = false;
        this.storeSettings();
        this.updateSoundVolume();
        this.onChange.notifyObservers(this.on);
    }
    isOn() {
        return this.on;
    }
    playMusic(songs) {
        this.songs = songs.slice();
        let currentSongs = this.songs.slice();
        let nextSong = currentSongs.shift();
        this.playSong(nextSong, currentSongs);
    }
    playSong(songName, restOfSongs) {
        if (restOfSongs.length === 0) {
            restOfSongs = this.songs.slice();
        }
        this.destroyCurrentMusic();
        this.music = PhaserGame_singleton_1.phaserGame.value.add.audio(songName);
        this.music.onStop.add(() => {
            let nextSong = restOfSongs.shift();
            this.playSong(nextSong, restOfSongs);
        });
        let volume = 0;
        if (this.on) {
            volume = 1;
        }
        this.music.play('', 0, volume);
    }
    destroyCurrentMusic() {
        if (this.music) {
            this.music.onStop.removeAll();
            this.music.destroy();
            this.music = null;
        }
    }
    updateSoundVolume() {
        if (PhaserGame_singleton_1.phaserGame.value && PhaserGame_singleton_1.phaserGame.value.sound) {
            if (this.on) {
                PhaserGame_singleton_1.phaserGame.value.sound.volume = 1;
                if (this.music) {
                    this.music.volume = 1;
                }
            }
            else {
                PhaserGame_singleton_1.phaserGame.value.sound.volume = 0;
                if (this.music) {
                    this.music.volume = 0;
                }
            }
        }
    }
    restoreLastSettings() {
        let result = true;
        if (window.localStorage) {
            if (window.localStorage.getItem(LOCAL_STORAGE_ID) === LOCAL_STORAGE_ON) {
                result = true;
            }
            else if (window.localStorage.getItem(LOCAL_STORAGE_ID) === LOCAL_STORAGE_OFF) {
                result = false;
            }
        }
        this.on = result;
    }
    storeSettings() {
        if (window.localStorage) {
            try {
                let valueToStore = LOCAL_STORAGE_ON;
                if (!this.on) {
                    valueToStore = LOCAL_STORAGE_OFF;
                }
                window.localStorage.setItem(LOCAL_STORAGE_ID, valueToStore);
            }
            catch (error) {
                console.warn('Not able to store settings in local storage');
            }
        }
    }
}
exports.sound = new SoundManager();

},{"../state/PhaserGame.singleton":22,"../utils/Observable":49}],21:[function(require,module,exports){
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

},{"../utils/Observable":49}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"../models/GenericHighlightedThing":12,"../stores/Verbs.store":28,"../utils/ActionDispatcher":47,"./SelectedVerb.singleton":25}],25:[function(require,module,exports){
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

},{"../stores/Verbs.store":28,"../utils/ActionDispatcher":47,"../utils/Observable":49}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{"./DefaultLabels":26}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":22,"../stores/Labels.store":27,"../stores/Verbs.store":28,"../utils/ActionDispatcher":47,"./LayoutManager.singleton":37,"./TextWithShadow":43,"./UILayers.singleton":45}],30:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":22,"../stores/Labels.store":27,"../utils/Observable":49,"./LayoutManager.singleton":37,"./TextWithShadow":43,"./UILayers.singleton":45}],31:[function(require,module,exports){
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

},{"../../engine/ui/UIBlocker.singleton":44,"./ConversationLineUI":30,"./InventoryPaginationButton":35,"./LayoutManager.singleton":37,"./UILayers.singleton":45}],32:[function(require,module,exports){
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

},{"../state/SelectedObjects":24,"../state/SelectedVerb.singleton":25,"../stores/Labels.store":27,"../stores/Verbs.store":28,"./LayoutManager.singleton":37,"./TextWithShadow":43,"./UILayers.singleton":45}],33:[function(require,module,exports){
"use strict";
const UILayers_singleton_1 = require('./UILayers.singleton');
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const VerbsUI_1 = require('./VerbsUI');
const CurrentActionUI_1 = require('./CurrentActionUI');
const InventoryUI_1 = require('./InventoryUI');
const ReflectButton_1 = require('./ReflectButton');
const SoundButtons_1 = require('./SoundButtons');
class GraphicUI {
    constructor() {
        this.createBackground();
        new VerbsUI_1.VerbsUI();
        new CurrentActionUI_1.CurrentActionUI();
        new InventoryUI_1.InventoryUI();
        new ReflectButton_1.ReflectButton();
        new SoundButtons_1.SoundButtonsUI();
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

},{"./CurrentActionUI":32,"./InventoryUI":36,"./LayoutManager.singleton":37,"./ReflectButton":38,"./SoundButtons":39,"./UILayers.singleton":45,"./VerbsUI":46}],34:[function(require,module,exports){
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

},{"../utils/ActionDispatcher":47,"./LayoutManager.singleton":37,"./UILayers.singleton":45}],35:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":22,"../utils/Observable":49,"./LayoutManager.singleton":37,"./UILayers.singleton":45}],36:[function(require,module,exports){
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

},{"../state/ActiveInventory.singleton":21,"./InventoryItemUI":34,"./InventoryPaginationButton":35,"./LayoutManager.singleton":37,"./UILayers.singleton":45}],37:[function(require,module,exports){
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
const SOUND_BUTTON_SIZE = {
    x: 36,
    y: 36
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
    getSoundButtonPosition() {
        return {
            x: this.WIDTH - SOUND_BUTTON_SIZE.x - this.LAYOUT_DEFAULT_MARGIN,
            y: this.LAYOUT_DEFAULT_MARGIN
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

},{}],38:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":22,"../stores/Labels.store":27,"../utils/ActionDispatcher":47,"./LayoutManager.singleton":37,"./TextWithShadow":43,"./UILayers.singleton":45}],39:[function(require,module,exports){
"use strict";
const LayoutManager_singleton_1 = require('./LayoutManager.singleton');
const PhaserGame_singleton_1 = require('../state/PhaserGame.singleton');
const UILayers_singleton_1 = require('./UILayers.singleton');
const SoundManager_1 = require('../sound/SoundManager');
class SoundButtonsUI {
    constructor() {
        this.updateButtons(SoundManager_1.sound.isOn());
        SoundManager_1.sound.onChange.registerObserver((newValue) => {
            this.updateButtons(newValue);
        });
    }
    updateButtons(isSoundOn) {
        this.destroyCurrentButton();
        if (isSoundOn) {
            this.currentButton = new DisableSoundButton();
        }
        else {
            this.currentButton = new EnableSoundButton();
        }
    }
    destroyCurrentButton() {
        if (this.currentButton) {
            this.currentButton.destroy();
            this.currentButton = null;
        }
    }
}
exports.SoundButtonsUI = SoundButtonsUI;
class SoundButton {
    constructor(options) {
        this.options = options;
        this.position = LayoutManager_singleton_1.layout.getSoundButtonPosition();
        this.button = PhaserGame_singleton_1.phaserGame.value.add.button(this.position.x, this.position.y, this.options.bg, this.onClick, this, 1, 0, 2, 1);
        UILayers_singleton_1.uiLayers.soundButtons.add(this.button);
        this.button.fixedToCamera = true;
    }
    destroy() {
        if (this.button) {
            this.button.destroy();
        }
    }
    onClick() { }
}
class DisableSoundButton extends SoundButton {
    constructor() {
        super({ bg: 'DISABLE_BUTTON_BG' });
    }
    onClick() {
        SoundManager_1.sound.turnOff();
    }
}
class EnableSoundButton extends SoundButton {
    constructor() {
        super({ bg: 'ENABLE_BUTTON_BG' });
    }
    onClick() {
        SoundManager_1.sound.turnOn();
    }
}

},{"../sound/SoundManager":20,"../state/PhaserGame.singleton":22,"./LayoutManager.singleton":37,"./UILayers.singleton":45}],40:[function(require,module,exports){
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

},{"../stores/Labels.store":27,"./TextInScene":42}],41:[function(require,module,exports){
"use strict";
exports.style = Object.freeze({
    DEFAULT_FONT_SIZE: 8,
    FONT_SHADOW_X: 1,
    FONT_SHADOW_Y: 1,
    CAMERA_EASING_FACTOR: 0.025,
    DEFAULT_ANIMATION_SPEED: 6
});

},{}],42:[function(require,module,exports){
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

},{"../state/Scenes.singleton":23,"./Style":41,"./TextWithShadow":43,"./UILayers.singleton":45}],43:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":22,"./Style":41}],44:[function(require,module,exports){
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

},{"../state/PhaserGame.singleton":22,"./LayoutManager.singleton":37,"./UILayers.singleton":45}],45:[function(require,module,exports){
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
    UILayers[UILayers["SOUND_BUTTONS"] = 10] = "SOUND_BUTTONS";
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
    get soundButtons() {
        this.init();
        return this.groups.get(UILayers.SOUND_BUTTONS);
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
        this.groups.set(UILayers.SOUND_BUTTONS, game.add.group());
    }
}
exports.uiLayers = new UILayersManager();

},{"../state/PhaserGame.singleton":22}],46:[function(require,module,exports){
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

},{"../stores/Verbs.store":28,"../utils/ActionDispatcher":47,"./ActionButton":29}],47:[function(require,module,exports){
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

},{"./Observable":49}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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

},{"./Segment":52}],51:[function(require,module,exports){
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

},{}],52:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
"use strict";
class Analytics {
    sendEvent(category, action, label = undefined) {
        if (window.ga) {
            window.ga('send', 'event', category, action, label);
        }
    }
}
exports.analytics = new Analytics();

},{}],54:[function(require,module,exports){
"use strict";
const IMAGES_ROOT = 'assets/images/';
const SOUNDS_ROOT = 'assets/sounds/';
;
;
;
;
const SPRITES = {
    // UI
    'BUTTON_BG': [IMAGES_ROOT + 'ui/BUTTON_BG_SPRITE.png', 75, 18, 3],
    'REFLECT_BUTTON_BG': [IMAGES_ROOT + 'ui/REFLECT_BUTTON_BG_SPRITE.png', 75, 56, 3],
    'CONVERSATION_LINE_BG': [IMAGES_ROOT + 'ui/CONVERSATION_LINE_BG.png', 508, 20],
    'PAGINATION_BUTTON_UP': [IMAGES_ROOT + 'ui/PAGINATION_BUTTON_UP.png', 16, 25, 4],
    'ENGLISH_BUTTON': [IMAGES_ROOT + 'ui/ENGLISH_BUTTON.png', 136, 27, 3],
    'SPANISH_BUTTON': [IMAGES_ROOT + 'ui/SPANISH_BUTTON.png', 136, 27, 3],
    'ENABLE_BUTTON_BG': [IMAGES_ROOT + 'ui/ENABLE_SOUND_BUTTON.png', 36, 36, 3],
    'DISABLE_BUTTON_BG': [IMAGES_ROOT + 'ui/DISABLE_SOUND_BUTTON.png', 36, 36, 3],
    // PLAYER
    'DOCTORTILLA_PLAYER_SPRITE': [IMAGES_ROOT + 'player/DOCTORTILLA_PLAYER_SPRITE.png', 44, 61, 41],
    // BACKSTAGE
    'VENDING_MACHINE_SPRITE': [IMAGES_ROOT + 'backstage/VENDING_MACHINE_SPRITE.png', 49, 72, 3],
    'BAND_IN_SOFA_SPRITE': [IMAGES_ROOT + 'backstage/BAND_IN_SOFA_SPRITE.png', 70, 78, 23],
    'GLASS_INV_SPRITE': [IMAGES_ROOT + 'backstage/GLASS_INV_SPRITE.png', 68, 26, 4],
    'COSTUME_INV_SPRITE': [IMAGES_ROOT + 'backstage/COSTUME_INV_SPRITE.png', 68, 26, 4],
    'BACKSTAGE_DOOR_TO_BACKYARD_SPRITE': [IMAGES_ROOT + 'backstage/BACKSTAGE_DOOR_TO_BACKYARD_SPRITE.png', 61, 104, 2],
    //Backyard
    'BACKYARD_DOOR_TO_BACKSTAGE_SPRITE': [IMAGES_ROOT + 'backyard/BACKYARD_DOOR_TO_BACKSTAGE_SPRITE.png', 31, 104, 2],
    'BILI_SPRITE': [IMAGES_ROOT + 'backyard/BILI_SPRITE.png', 43, 70, 24],
    'BALLOON_SPRITE': [IMAGES_ROOT + 'backyard/BALLOON_SPRITE.png', 28, 59, 10]
};
const IMAGES = {
    // UI
    'UI_BG': IMAGES_ROOT + 'ui/UI_BG.png',
    'UI_INV_BG': IMAGES_ROOT + 'ui/UI_INV_BG.png',
    'UI_CONVERSATION_BG': IMAGES_ROOT + 'ui/UI_CONVERSATION_BG.png',
    'LOGO': IMAGES_ROOT + 'ui/LOGO.png',
    'THE_GAME': IMAGES_ROOT + 'ui/THE_GAME.png',
    'CREDITS': IMAGES_ROOT + 'ui/CREDITS.png',
    // Backstage scene:
    'BACKSTAGE_BG': IMAGES_ROOT + 'backstage/BACKSTAGE_BG.png',
    'CABLE': IMAGES_ROOT + 'backstage/CABLE.png',
    'CABLE_INV': IMAGES_ROOT + 'backstage/CABLE_INV.png',
    'SKIRT': IMAGES_ROOT + 'backstage/SKIRT_INV.png',
    'BROOM': IMAGES_ROOT + 'backstage/BROOM.png',
    'BROOM_INV': IMAGES_ROOT + 'backstage/BROOM_INV.png',
    'BACKYARD_BG': IMAGES_ROOT + 'backyard/BACKYARD_BG.png',
    'CAN_INV': IMAGES_ROOT + 'backstage/CAN_INV.png',
    'COIN_INV': IMAGES_ROOT + 'backstage/COIN_INV.png',
    'SCISSORS': IMAGES_ROOT + 'backstage/SCISSORS.png',
    'SCISSORS_INV': IMAGES_ROOT + 'backstage/SCISSORS_INV.png',
    'BOCADILLO': IMAGES_ROOT + 'backstage/BOCADILLO.png',
    'BOCADILLO_INV': IMAGES_ROOT + 'backstage/BOCADILLO_INV.png',
    'BREAD_INV': IMAGES_ROOT + 'backstage/BREAD_INV.png',
    'BACON_INV': IMAGES_ROOT + 'backstage/BACON_INV.png',
    'COCONUT': IMAGES_ROOT + 'backstage/COCONUT.png',
    'COCONUT_INV': IMAGES_ROOT + 'backstage/COCONUT_INV.png',
    'DUST': IMAGES_ROOT + 'backstage/DUST.png',
    'DUST_INV': IMAGES_ROOT + 'backstage/DUST_INV.png',
    'GLASS': IMAGES_ROOT + 'backstage/GLASS.png',
    'LAMP': IMAGES_ROOT + 'backstage/LAMP.png',
    'BACKSTAGE_DOOR_TO_STREET': IMAGES_ROOT + 'backstage/BACKSTAGE_DOOR_TO_STREET.png',
    'BACKSTAGE_DOOR_TO_STAGE': IMAGES_ROOT + 'backstage/BACKSTAGE_DOOR_TO_STAGE.png',
    'FLY_CASE': IMAGES_ROOT + 'backstage/FLY_CASE.png',
    // Backyard:
    'FLOWERS': IMAGES_ROOT + 'backyard/FLOWERS.png',
    'FLOWERS_INV': IMAGES_ROOT + 'backyard/FLOWERS_INV.png',
    'LAMP_BACKYARD': IMAGES_ROOT + 'backyard/LAMP_BACKYARD.png',
    'MOON': IMAGES_ROOT + 'backyard/MOON.png',
    'STAR': IMAGES_ROOT + 'backyard/STAR.png',
    'CUT_FLOWERS': IMAGES_ROOT + 'backyard/CUT_FLOWERS.png'
};
const FONTS = {
    'FONT_32_BLACK': [IMAGES_ROOT + 'fonts/font_32_black.png', IMAGES_ROOT + 'fonts/font_32_black.fnt'],
    'FONT_32_WHITE': [IMAGES_ROOT + 'fonts/font_32_white.png', IMAGES_ROOT + 'fonts/font_32_white.fnt'],
    'FONT_32_ORANGE': [IMAGES_ROOT + 'fonts/font_32_orange.png', IMAGES_ROOT + 'fonts/font_32_orange.fnt'],
    'FONT_32_BLUE': [IMAGES_ROOT + 'fonts/font_32_blue.png', IMAGES_ROOT + 'fonts/font_32_blue.fnt'],
    'FONT_32_RED': [IMAGES_ROOT + 'fonts/font_32_red.png', IMAGES_ROOT + 'fonts/font_32_red.fnt'],
    'FONT_32_YELLOW': [IMAGES_ROOT + 'fonts/font_32_yellow.png', IMAGES_ROOT + 'fonts/font_32_yellow.fnt'],
    'FONT_32_PURPLE': [IMAGES_ROOT + 'fonts/font_32_purple.png', IMAGES_ROOT + 'fonts/font_32_purple.fnt']
};
const AUDIO = {
    'SUBETE': SOUNDS_ROOT + 'subete_el_midi.ogg',
    'ALLI_DONDE': SOUNDS_ROOT + 'alli_donde_game.ogg'
};
class AssetsManager {
    loadAssets(game) {
        this.loadImages(game);
        this.loadSprites(game);
        this.loadFonts(game);
        this.loadSounds(game);
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
    loadSounds(game) {
        for (let soundKey in AUDIO) {
            game.load.audio(soundKey, AUDIO[soundKey]);
        }
    }
}
exports.assetsManager = new AssetsManager();

},{}],55:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],56:[function(require,module,exports){
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
            initialSceneId: 'BACKSTAGE',
            songs: ['ALLI_DONDE', 'SUBETE']
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

},{"../engine/models/Game":10,"../engine/ui/UIBlocker.singleton":44,"../engine/utils/Directions":48,"./DoctortillaLabels":57,"./DoctortillaPlayer":58,"./backstageScene/BackstageScene":62,"./backyardScene/BackyardScene":82}],57:[function(require,module,exports){
"use strict";
exports.DOCTORTILLA_LABELS = {
    'es': {
        'A_BROOM_THE_PERFECT_CLEANING_INSTRUMENT': 'Una escoba, el instrumento de limpieza perfecto.',
        'A_RANCID_AND_GREASY_SANDWHICH': 'Un bocadillo rancio y GRASIENTO.',
        'AGAIN': 'Otra vez...',
        'ALL_IN_ALL_HE_IS_A_GOOD_GUY': 'Buena gente el Bili.',
        'ALL_READY_FIND_BILI': '¡Todo arreglado! Voy a buscar a Bili y empezamos.',
        'AND_EXPENSIVE': '... y caras.',
        'AND_I_AM_NOT_GOING_TO_GIVE_HIM_ANY': 'Y no le voy a dar más.',
        'AND_WE_LEARNED': 'y hemos aprendido.',
        'ARGH': '¡Argh!',
        'ASK_ABOUT_CABLE': '¿Y ahora dónde encuentro un cable, so vagos?',
        'ASK_ABOUT_COSTUME': 'Dime más acerca del disfraz que falta.',
        'ASK_ABOUT_SANTI': '¿Qué te pasa, Santi?',
        'BACKSTAGE': 'backstage',
        'BACKYARD': 'descampado',
        'BACON': 'panceta',
        'BALLOON': 'globo',
        'BARELY_TASTED_LIKE_DRUG': 'Bah, no sabía a droga apenas...',
        'BEAUTIFUL_SOMETHING': 'Es un coso muy bonito.',
        'BILI': 'Bili',
        'BILI_MUST_BE_OUT_THERE_SMOKING': 'Bili debe estar fuera fumando.',
        'BOCADILLO': 'bocadillo de panceta',
        'BURP': '¡Burp!',
        'BREAD': 'pan',
        'BREAD_LEFTOVERS_NOT_USEFUL': 'Sobras de pan, nada útil.',
        'BROOM': 'escoba',
        'CABLE': 'cable',
        'CAN': 'lata de refresco',
        'CANNOT_PICK_A_DOOR_UP': 'No puedo coger la puerta, rompería todo el edificio.',
        'CLONK': 'Clonk\n   clonk\n      clonk',
        'COCONUT': 'coco',
        'COIN': 'moneda',
        'COOL_NOW_I_SHOULD_GIVE_IT_TO_THE_GUYS': 'Bien, ahora debería dárselo a los chicos.',
        'COMPARE_COMPRAME_UN_COCO': 'Compare cómprame un coco.',
        'COSTUME': 'disfraz',
        'DELICIOUS_AND_GREASY': '¡Delicioso y GRASIENTO!',
        'DOES_IT_LOOK_LIKE_A_PAIR_OF_TITS': '¿No parecen dos tetas?',
        'DOOR_TO_BACKSTAGE': 'puerta al backstage',
        'DOOR_TO_BACKYARD': 'puerta al descampado',
        'DOOR_TO_STAGE': 'puerta al escenario',
        'DOOR_TO_STREET': 'puerta a la calle',
        'DRUGS_ARE_BAD': '... sí tío las drogas son malas ...',
        'DRUNK_1': 'Eftoy de fluta mareeee.',
        'DRUNK_2': '¿GHJSHJ? tdoo ftennnn mpaeee!',
        'DRUNK_3': '¡A ope en las drijijijiijis!',
        'DRUNK_4': '¡Birrrrrrrraaaaaaaaamasssssss!',
        'DRUNK_5': '¿Berrererererberecho! ¡Catafafastrofico!',
        'DRUNK_6': 'Mstaaan fuscandio reptlianderee.',
        'DRUNK_BILI': 'Bili borracho',
        'FINALLY_I_GOT_THE_CABLE': '¡Por fin tengo el cable!',
        'FIRST_ANGEL_CABLE': 'Primero, necesitamos un cable para el ampli de Ángel',
        'FIRST_I_NEED_TO_GET_THE_BAND_READY': 'Primero tengo que preparar a la banda.',
        'FIRST_OF_ALL_I_SHOULD_TALK_TO_THE_BAND': 'Primero debería hablar con el grupo.',
        'FLOWERS': 'flores',
        'FOUND_THE_CABLE': '¡Tengo un cable!',
        'GLASS': 'vaso',
        'GOT_THE_COSTUME': 'Te he hecho un disfraz.',
        'GULP_GULP_GULP': 'Glup\n   Glup\n      Glup',
        'HAVE_A_DRINK_SANTI': 'Eh Santi, toma esta bebida.',
        'HAVE_I_EVER_FAILED_YOU': '¿Te he fallado alguna vez (hoy)?',
        'HAVE_YOU_SEEN_BILI': 'Mmm, ¿dónde está Bili?',
        'HE_IS_BEING_GOOD_FOR_NOW_NO_NEED_TO_EXPLODE_IT': 'Se está portando bien por ahora, no hace falta explotarle el globo.',
        'HE_IS_DRINKING_LIKE_A_MANIAC': 'Está bebiendo como si no hubiera un mañana, habría que empezar el concierto ya.',
        'HE_IS_OUT_SMOKING': 'Está fuera, fumando y bebiendo. O empezamos pronto o se va a poner como las Grecas.',
        'HE_IS_DRUNK_AS_A_SKUNK': 'Sip, ciego como una perra.',
        'HEY_BILI_HOW_IS_IT_GOING': '¡Ey Bili! ¿Cómo va eso?',
        'HEY_BILI_READY_TO_PLAY': '¡Ey Bili! ¿Listo para tocar?',
        'HI_DOOR_HOW_ARE_YOU_TODAY': '¡Hola puerta! ¿Cómo andas hoy?',
        'HI_THERE': 'Hola holita.',
        'HOW_IS_BILI_DOING': '¿Cómo va Bili, por cierto?',
        'I_ALREADY_HAVE_IT': 'Ya está en mi posesión.',
        'I_ALREADY_PUSHED_IT': 'Ya la he empujado no querría pasarme.',
        'I_AM_AWAKE': '¡Ahhhhh! ¡¡¡ESTOY DESPIERTO!!!',
        'I_AM_JUST_KEEPING_MY_THROAT_WARM': 'Solo estoy calentando la garganta, no te preocupes.',
        'I_AM_NOT_DRUNK_ANYMORE': '¡Guau! Ya no estoy borracho.',
        'I_AM_NOT_RICH_BUT_IT_IS_A_START': 'No soy rico, pero por algo se empieza.',
        'I_AM_NOT_GOING_TO_ASK_WHERE_THIS_COMES_FROM': 'No te voy a preguntar de dónde lo has sacado...',
        'I_AM_STATRING_TO_FEEL_READY_TO_PLAY': 'Qué raro, de repente me noto listo para tocar.',
        'I_BET_I_COULD_DO_A_BEAUTIFUL_COSTUME_WITH_IT': 'Creo que podría hacer un buen disfraz con esto.',
        'I_BET_THAT_SUSPICIOS_WHITE_POWDER_FROM_THE_TABLE_CAN_MAKE_SOMEBODY_LESS_SHY': 'Seguro que ese polvo sospechoso de la mesa puede hacer que "alguien" sea menos tímido.',
        'I_BET_THIS_DUST_CAN_MAKE_SOMEBODY_LESS_SHY': 'Seguro que este "polvo" puede hacer a "alguien" menos tímido.',
        'I_CAN_HEAR_THE_CROWD_WAITING_FOR_US': 'Puedo oir a la muchedumbre gritando, menos mal que esta puerta nos protege.',
        'I_CANT_MOVE_THAT': 'No puedo mover eso.',
        'I_CANT_DO_THAT': 'No puedo hacer eso.',
        'I_COULD_MAKE_A_HAWAIIAN_COSTUME': 'Podría hacer un disfraz de hawaiana.',
        'I_COULD_MAKE_A_WIG_WITH_THIS': 'Podría hacer una peluca rubia con esto.',
        'I_DONT_KNOW_HOW_TO_DO_THAT': 'No sé hacer eso.',
        'I_DONT_KNOW_HOW_TO_USE_THAT_WITH_VENDING_MACHINE': 'No sé cómo usar eso con una máquina expendedora...',
        'I_HAVE_A_CONCERT_TO_PLAY': '¡Tengo un concierto que tocar!',
        'I_HAVE_BETTER_THINGS_TO_DO_THAN_TALKING': 'Tengo cosas mejores que hacer que hablar con objetos.',
        'I_HAVE_TO_FIND_A_WAY_TO_SOBER_HIM_UP': 'Tengo que encontrar una forma de espabilarlo.',
        'I_HAVE_TO_FINISH_THE_COSTUME_FIRST': 'Tengo que terminar el disfraz primero.',
        'I_HAVE_TO_PICK_IT_UP_FIRST': 'Tengo que cogerlo primero.',
        'I_HEARD_THE_GUYS_ARE_HAVING_SOME_PROBLEMS': 'He oído que los chicos están teniendo algunos problemas.',
        'I_SHOULD_ADD_A_SKIRT_TO_IT': 'Debería añadirle una falda.',
        'I_SHOULD_GO_FIND_BILI': 'Tengo que buscar a Bili para que empecemos a tocar.',
        'I_SHOULD_PROBABLY_MIX_IT_IN_A_GLASS': 'Debería mezclarlo en un vaso, como las personas.',
        'I_SHOULD_PUT_SOMETHING_MORE_INTERESTING_IN_THE_GLASS': 'Debería poner cosas más interesantes en el vaso.',
        'I_SHOULD_SOBER_BILI_UP': 'Debería hacer que Bili se le pasar la cogorza.',
        'I_SHOULD_TAKE_THE_BACON_OUT_OF_THE_BREAD_FIRST': 'Debería sacar la panceta del pan.',
        'I_THINK_I_CAN_OPEN_IT_AND_TAKE_THE_BACON': 'Creo que puedo abrirlo y sacar la panceta.',
        'I_THINK_MY_MASTERPIECE_IS_COMPLETE': 'Mi obra de arte está terminada.',
        'I_WILL_WAIT_FOR_THEM_TO_BE_SOLVED': 'Esperaré que se resuelva todo por arte de magia.',
        'I_WONDER_IF_THE_GUYS_HAVE_EVERYTHING_READY': 'Me pregunto si los chicos lo tendrán todo listo...',
        'I_WOULD_DO_IT_MYSELF': 'Lo haría yo, pero es un poco ilegal...',
        'I_WOULDNT_KNOW_WHAT_TO_SAY': 'No sabría qué decir.',
        'IF_I_ADD_SOME_BOOBS_IT_WILL_LOOK_LIKE_A_HAWAIIAN_DRESS': 'Si le añado unas tetas, parece un disfraz hawaiano.',
        'IF_I_COULD_PUT_GREASE_BELOW': 'Si pudiera engrasarla un poco...',
        'IMPLIES_MOVEMENT': '... y requiere una cierta cantidad de esfuerzo y movimiento.',
        'IT_IS_A_LONG_TIME_TRADITION_THAT_WE_ALL_DRESSED_UP': 'Es una tradición que empezamos hace tiempo, disfrazarnos para los conciertos...',
        'IT_IS_ALREADY_CLOSED': 'Ya está cerrada.',
        'IT_IS_ALREADY_FULL': 'Ya está lleno.',
        'IT_IS_INDEED_A_GLASS': 'Es un vaso. Un vaso fetén.',
        'IT_IS_STUCK_BEHIND_THE_VENDING_MACHINE': 'Está atrapado detrás de la máquina expendedora, necesito moverla de alguna forma.',
        'IT_WAS_COWBOY_COSTUME': 'Un disfraz de vaquero, de los buenos.',
        'IS_SOMEHOW_DANGEROUS': '... marginalmente peligroso, diría yo ...',
        'IS_THAT_A_CABLE_BEHIND_THE_VENDING_MACHINE': '¿Hay un cable detrás de la máquina expendedora?',
        'JUST_STEAL_ONE': 'No sé tío, roba alguno donde sea.',
        'LATE_FOR_CONCERT': 'Puff, llego dos horas tarde a mi propio concierto.',
        'LET_S_SAY_I_HAVE_MY_SOURCES': 'Digamos que tengo mis recursos...',
        'LETS_FIX_THIS_MESS': 'Vale, me voy a ver si arreglo esto.',
        'MADE_OF_METAL_RUST_AND_STICKY_STUFF': 'Puerta. Composición: 80% metal, 15% óxido, 5% algo pegajoso sin identificar.',
        'MAN_YOU_SHOULD_KNOW_THIS': '¡Compae, deberías saberlo, lo empezaste tú!',
        'MAYBE_I_CAN_BUILD_A_COSTUME_MYSELF': 'A lo mejor puedo hacer un disfraz con las cosas que hay por aquí.',
        'MAYBE_I_CAN_SCARE_HIM_SO_HE_GETS_SOBER': 'Igual lo puedo asustar a ver si se espabila.',
        'MAYBE_SANTI_NEEDS_SOMETHING_TO_DRINK': 'Creo que Santi necesita algo de beber.',
        'MINE_WAS_WAY_BETTER': 'El mío era mucho mejor.',
        'MMM_A_REFRESHING_BEVERAGE': '¡Mmm un refrescante refresco! ¡Gracias!',
        'MY_GRANDFATHER_SAID_A_COSTUME_MUST_HAVE_3_THINGS': 'Mi abuelo siempre decía: "Un buen disfraz debe tener al menos 3 componentes".',
        'NICE_COSTUME_HE_MADE': '¡Esta ve se ha currado el disfraz!',
        'NICE_IT_WILL_SLIDE_REALLY_WELL_NOW': 'Bien, ahora escurrirá sin problema...',
        'NICE_OBJECT': 'Precioso objeto.',
        'NICE_SAFE_DOOR': 'Es una puerta. Útil para delimitar áreas.',
        'NOPE_I_CANNOT_GO_TO_THE_STREET': 'No, no puedo ir a la calle aún.',
        'NOPE_I_CANNOT_GO_TO_THE_STAGE': 'No, no puedo ir al escenario aún.',
        'NOPE_I_DONT_WANT_TO_TAKE_BILIS_BALLOON': 'No, no quiero coger el globo de Bili, le queda bien en su disfraz.',
        'NOT_TO_BAD_ALL_THINGS_CONSIDERED': 'No va mal la cosa.',
        'NOT_SAFE_HAVING_SCISSORS_AROUND_MUSICIANS': 'No es seguro dejar unas tijeras en un sitio con músicos.',
        'NOT_SAYING_WE_SHOULD_USE_THEM': 'No digo que las usemos, pero...',
        'NOW_I_COULD_PUSH_THIS_MACHINE': 'Ahora puedo empujar la máquina.',
        'NOW_I_SHOULD_SAY_SOMETHING_SMART_THAT_HELPS': 'Ahora debería decir algo inteligente que ayudara.',
        'OH_LOOK_AT_THAT': '¡Anda! ¡Mira eso!',
        'OH_MY_YOU_ARE_DRUNK_ARENT_YOU': 'Madre mía, ¿estás como una cuba, no?',
        'OK_I_LL_PUT_IT_ON': 'Vale jefe, me lo pongo.',
        'OK_SEE_YOU_LATER': 'Venga, nos vemos.',
        'ONE_CONCERT_A_YEAR_IS_TOO_MUCH_PRESSURE': 'Un concierto al año, qué presión.',
        'PLEASE_DONT_DRINK_TOO_MUCH': 'Por favor, no bebas mucho, tocamos en breve.',
        'PROBABLY_IF_I_SCARE_HIM_HE_WILL_WAKE_UP': 'Seguro que si lo asusto un poco se espabila.',
        'PROBLEMS_I_AM_OUT': '¿Problemas? ¿Complicaciones? Yo paso de esto...',
        'PROBLEMS_LET_ME_HELP': '¿Problemas? Por favor, contadme más, amiguitos.',
        'READY_TO_PLAY': '¡Eh chavales! ¿Todo listo?',
        'REALLY_USEFUL_TO_PUT_LIQUIDS_INSIDE': 'Muy útil para poner líquidos y otras cosas dentro.',
        'REST_OF_THE_BAND': 'resto del grupo, Juan, Ángel y Santi',
        'SECOND_JUAN_COSTUME': 'Lo segundo, necesitamos un disfraz para Juan, que se lo ha dejado en casa.',
        'SEE_YOU_SOON': '¡Nos vemos!',
        'SCISSORS': 'tijeras',
        'SHE_IS_SHY_DOESNT_WANT_TO_TALK_TO_ME': 'Es tímida, no quiere hablar conmigo.',
        'SHINY_AND_SHARP': '¡Brillantes y afiladas!',
        'SKIRT': 'falda',
        'SO_PLEASE_FIND_ME_SOMETHING_ELEGANT_I_CAN_USE': 'Así que búscame uno bueno que cumpla mis expectativas.',
        'SO_THIS_IS_THE_END_FOLKS': 'Esto es todo amigos.',
        'SO_WE_SOMEHOW_DISTRACT_THE_ATTENTION': '... y así la gente no se da cuenta de que no sabemos tocar.',
        'SOME_CULTURES_USED_DRUGS': 'Sabes, algunas culturas utilizan drogas para inspirar a los guerreros...',
        'SOME_FLOWERS_WOULD_BE_NICE': 'Unas flores le quedarían bien.',
        'SURE_BOSS': '¡Sí, bwana!',
        'SUSPICIOUS_DUST': 'polvo sospechoso',
        'TALK_TO_YOU_LATER': '¡Me voy, nos vemos luego!',
        'THANKS_FOR_HELPING_ME_IN_THIS_ADVENTURE': '¡Gracias por ayudarme en esta aventura!',
        'THAT_CANNOT_BE_CLOSED': 'Eso no se puede cerrar.',
        'THAT_CANNOT_BE_OPENED': 'Eso no se puede abrir.',
        'THAT_IS_A_HUGE_BALLOON_QUITE_SCARY_IF_IT_EXPLODES': 'Un globo enorme, menudo susto si explotase.',
        'THAT_IS_A_STUPID_COSTUME': 'Vaya disfraz penco.',
        'THAT_IS_MY_BAND_1': 'Mi grupo: vagos, no tocan muy bien, pero son buena gente.',
        'THAT_IS_MY_BAND_2': '¡Qué pedazo de grupo! ¡Lo mejor de lo mejor!',
        'THAT_IS_MY_BAND_3': 'Míralos, tan buenos, sin mover un dedo...',
        'THAT_S_SOME_HIGHLY_SUSPICIOUS_WHITE_POWDER': 'Es un polvo blanco muy sospechoso.',
        'THAT_S_THE_DOOR_TO_GO_BACK_TO_THE_BACKSTAGE': 'Esa es la puerta para volver al backstage.',
        'THAT_S_THE_SPIRIT': '¡Esa es la actitud!',
        'THE_FLOOR_IS_STICKY': 'El suelo está tan pegajoso que es imposble moverla.',
        'THE_ONLY_THING_HE_WANTS_RIGHT_NOW_IS_BEER': 'Lo único que quiere ahora es más cerveza.',
        'THE_OTHERS_WILL_BE_READY': 'Pero seguro que el resto del grupo está listo, voy a hablar con ellos.',
        'THERE_ARE_SOME_PROBLEMS_1': 'Pues han habido unas pequeñas complicaciones...',
        'THERE_ARE_SOME_PROBLEMS_2': '... minucias, pequeñeces ...',
        'THERE_ARE_SOME_PROBLEMS_3': '... problemas BU-RU-TALES.',
        'THERE_IS_A_CABLE_STUCK_BEHIND_THE_MACHINE': 'Hay un cable pillado detrás de la máquina.',
        'THINK_PACO_THINK': 'Piensa, Paco, piensa.',
        'THIRD_SANTI_SHY': 'Y por último, Santi se ha puesto tímido. No quiere tocar...',
        'THIS_CABLE_COULD_BE_USEFUL': 'Este cable parece útil, igual lo puedo "pedir prestado"',
        'THIS_IS_YOUR_STANDARD_VENDING_MACHINE': 'Es una máquina expendedora normal. Si acaso más sucia que la media.',
        'TIME_TO_GIVE_IT_TO_JUAN': 'Ya se lo puedo dar a Juan.',
        'VENDING_MACHINE': 'máquina expendedora',
        'VERY_BEAUTIFUL_FLOWERS': 'Unas flores muy bonitas.',
        'VINTAGE_PREMIUM_COSTUME': 'Un disfraz vintage, muy premium.',
        'WE_CAN_PLAY_THE_CONCERT_NOW': 'Ya podemos dar el concierto, amigo mío.',
        'WE_CRIED': 'hemos llorado',
        'WE_DONT_REHEARSE_ENOUGH': 'Gañante, no hemos ensayado lo suficiente, no estamos listos!',
        'WE_HAVE_THREE_PROBLEMS': 'Básicamente tenemos tres problemas...',
        'WE_HAVENT_PRACTISED_SINCE_2012': 'Creo que el último ensayo fue en el 2012.',
        'WE_LAUGHED': 'Hemos reído,',
        'WELL_I_HAD_AN_AWESOME_COSTUME': 'Tenía un disfraz brutal, ¿sabes?',
        'WHAT_CAN_WE_DO_GUYS': '¿Qué podemos hacer? ¿Alguna idea?',
        'WHERE_COULD_I_FIND_A_CABLE': '¿Dónde puedo encontrar un cable para Ángel?',
        'WHY_COSTUMES': '¿Por qué vamos todos disfrazados?',
        'WHY_IS_EVERYTHING_SO_PIXELY': '¿Por qué está todo pixelado?',
        'WISE_PURCHASE': 'Buena compra.',
        'YEP_I_COULD_BUILD_A_COSTUME_WITH_THIS': 'Sip, podría hacer un disfraz con esto.',
        'YES_MOM': 'Sí mamá.',
        'YOU_BETTER_PUT_IT_ON': 'O te lo pones o te lo pongo.',
        'YOU_ARE_A_COWARD_MAN_WE_HAVE_COSTUMES': 'No seas pusilánime, hombre. Tenemos nuestros disfraces, nadie se va a dar cuenta de cómo tocamos.',
        'YOU_STOLE_IT': '¿De dónde lo has sacado? ¿Lo has robado?',
        'YOUR_LACK_OF_CONFIDENCE_DISSAPOINTS_ME': '¡Venga, hombre! Tu falta de confianza es un insulto a mi persona.'
    },
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
        'FIRST_OF_ALL_I_SHOULD_TALK_TO_THE_BAND': 'First of all I should talk with the band.',
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
        'HEY_BILI_READY_TO_PLAY': 'Hey Bili, ready to play?',
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
        'I_BET_THAT_SUSPICIOS_WHITE_POWDER_FROM_THE_TABLE_CAN_MAKE_SOMEBODY_LESS_SHY': 'I bet that suspicious white powder from the table can make "somebody" less shy',
        'I_BET_THIS_DUST_CAN_MAKE_SOMEBODY_LESS_SHY': 'I bet this "dust" can make "somebody" less shy',
        'I_CAN_HEAR_THE_CROWD_WAITING_FOR_US': 'I can hear the crowd waiting for us, good thing this door is protecting us.',
        'I_CANT_MOVE_THAT': 'I can\'t move that.',
        'I_CANT_DO_THAT': 'I can\'t do that.',
        'I_COULD_MAKE_A_HAWAIIAN_COSTUME': 'I could make a hawaiian costume',
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
        'I_SHOULD_GO_FIND_BILI': 'I must find Bili so we can start playing.',
        'I_SHOULD_PROBABLY_MIX_IT_IN_A_GLASS': 'I should probably mix it in a glass.',
        'I_SHOULD_PUT_SOMETHING_MORE_INTERESTING_IN_THE_GLASS': 'I should put something more interesting in the glass before giving it to them.',
        'I_SHOULD_SOBER_BILI_UP': 'I should sober Bili up so we can play.',
        'I_SHOULD_TAKE_THE_BACON_OUT_OF_THE_BREAD_FIRST': 'I should take the bacon out of the bread first',
        'I_THINK_I_CAN_OPEN_IT_AND_TAKE_THE_BACON': 'I think I can open it and take the bacon.',
        'I_THINK_MY_MASTERPIECE_IS_COMPLETE': 'I think my masterpiece is complete.',
        'I_WILL_WAIT_FOR_THEM_TO_BE_SOLVED': 'I will wait for them to be solved automagically.',
        'I_WONDER_IF_THE_GUYS_HAVE_EVERYTHING_READY': 'I wonder if the guys have everything ready...',
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
        'IS_THAT_A_CABLE_BEHIND_THE_VENDING_MACHINE': 'Is that a cable behind the vending machine?',
        'JUST_STEAL_ONE': 'Don\'t know man, just steal one somewhere.',
        'LATE_FOR_CONCERT': 'Man I am two hours late to my own concert.',
        'LET_S_SAY_I_HAVE_MY_SOURCES': 'Let\'s say I have my sources...',
        'LETS_FIX_THIS_MESS': 'OK, let\'s see if I can fix this disaster.',
        'MADE_OF_METAL_RUST_AND_STICKY_STUFF': 'Door. Composition: 80% metal, 15% rust, 5% unidentified sticky stuff.',
        'MAN_YOU_SHOULD_KNOW_THIS': 'Man, you should know this, you started it!',
        'MAYBE_I_CAN_BUILD_A_COSTUME_MYSELF': 'Maybe I can build a costume myself with whatever I find around.',
        'MAYBE_I_CAN_SCARE_HIM_SO_HE_GETS_SOBER': 'Maybe I can scare him so he gets sober.',
        'MAYBE_SANTI_NEEDS_SOMETHING_TO_DRINK': 'Maybe Santi needs something to drink.',
        'MINE_WAS_WAY_BETTER': 'Mine was WAY better.',
        'MMM_A_REFRESHING_BEVERAGE': 'Mmm a refreshing beverage! Thanks!',
        'MY_GRANDFATHER_SAID_A_COSTUME_MUST_HAVE_3_THINGS': 'My grandfather always said: "A good costume must have at least 3 elements".',
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
        'NOW_I_COULD_PUSH_THIS_MACHINE': 'Now I could push this machine.',
        'NOW_I_SHOULD_SAY_SOMETHING_SMART_THAT_HELPS': 'Now I should something smart that helps.',
        'OH_LOOK_AT_THAT': 'Oh! Look at that.',
        'OH_MY_YOU_ARE_DRUNK_ARENT_YOU': 'Oh my! Your are totally drunk, aren\'t you?',
        'OK_I_LL_PUT_IT_ON': 'Ok, boss, I\'ll put it on.',
        'OK_SEE_YOU_LATER': 'Ok man, see you later!',
        'ONE_CONCERT_A_YEAR_IS_TOO_MUCH_PRESSURE': 'One concert a year, too much pressure...',
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
        'THERE_IS_A_CABLE_STUCK_BEHIND_THE_MACHINE': 'There is a cable stuck behind the machine.',
        'THINK_PACO_THINK': 'Think, Paco, think!',
        'THIRD_SANTI_SHY': 'And third, Santi just got shy. He refuses to play...',
        'THIS_CABLE_COULD_BE_USEFUL': 'This cable could be useful, maybe I can "borrow" it.',
        'THIS_IS_YOUR_STANDARD_VENDING_MACHINE': 'It is just a standard vending machine. Only dirtier than average.',
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
        'WHERE_COULD_I_FIND_A_CABLE': 'Where could I find a cable for Ángel?',
        'WHY_COSTUMES': 'Why are we all dressed up anyhow?',
        'WHY_IS_EVERYTHING_SO_PIXELY': 'Why is everything so pixely?',
        'WISE_PURCHASE': 'That was a wise purchase.',
        'YEP_I_COULD_BUILD_A_COSTUME_WITH_THIS': 'Yep, I could build a costume with this.',
        'YES_MOM': 'Yes, mom.',
        'YOU_BETTER_PUT_IT_ON': 'You better put it one before I get angry.',
        'YOU_ARE_A_COWARD_MAN_WE_HAVE_COSTUMES': 'Don\'t be a pussy man... We have our costumes, people just won\'t pay attention to the music.',
        'YOU_STOLE_IT': 'You stole it, right?',
        'YOUR_LACK_OF_CONFIDENCE_DISSAPOINTS_ME': 'Oh please! Your lack of confidence dissapoints me.'
    }
};

},{}],58:[function(require,module,exports){
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
spriteOptions.set('give_glass', { frames: [33, 34, 35, 36] });
spriteOptions.set('pierce_balloon', { frames: [37, 38, 39, 40] });
const options = {
    spriteId: 'DOCTORTILLA_PLAYER_SPRITE',
    initialX: 93,
    initialY: 184,
    xSpeed: 80,
    ySpeed: 55,
    animationSpeed: Style_1.style.DEFAULT_ANIMATION_SPEED,
    spriteOptions: spriteOptions
};
const MIN_REFLECT_ANSWERS = 4;
class DoctortillaPlayer extends Player_1.Player {
    constructor() {
        super(options);
        this.inventory.add(new Coin_1.Coin());
    }
    reflect() {
        let possibleReflections = this.getPossibleReflections();
        this.say(RandomText_1.randomText.apply(this, possibleReflections));
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
    getPossibleReflections() {
        const FILLERS = [
            'NOW_I_SHOULD_SAY_SOMETHING_SMART_THAT_HELPS',
            'WHY_IS_EVERYTHING_SO_PIXELY',
            'ONE_CONCERT_A_YEAR_IS_TOO_MUCH_PRESSURE',
            'THINK_PACO_THINK'
        ];
        let thingsToSay = this.getThingsToSayForSituation();
        return fillArrayWithFillers(thingsToSay, FILLERS);
    }
    getThingsToSayForSituation() {
        if (!this.getAttr('TALKED_TO_THE_BAND')) {
            return ['FIRST_OF_ALL_I_SHOULD_TALK_TO_THE_BAND', 'I_WONDER_IF_THE_GUYS_HAVE_EVERYTHING_READY'];
        }
        if (!this.deliveredEverything()) {
            let result = [];
            if (!this.getAttr('DELIVERED_CABLE')) {
                result.push('WHERE_COULD_I_FIND_A_CABLE');
                result.push('IS_THAT_A_CABLE_BEHIND_THE_VENDING_MACHINE');
            }
            if (!this.getAttr('DELIVERED_COSTUME')) {
                result.push('MY_GRANDFATHER_SAID_A_COSTUME_MUST_HAVE_3_THINGS');
                result.push('MAYBE_I_CAN_BUILD_A_COSTUME_MYSELF');
                result.push('I_COULD_MAKE_A_HAWAIIAN_COSTUME');
            }
            if (!this.getAttr('DELIVERED_DRINK')) {
                result.push('MAYBE_SANTI_NEEDS_SOMETHING_TO_DRINK');
                result.push('I_BET_THAT_SUSPICIOS_WHITE_POWDER_FROM_THE_TABLE_CAN_MAKE_SOMEBODY_LESS_SHY');
            }
            return result;
        }
        else {
            if (this.getAttr('TALKED_TO_DRUNK_BILI')) {
                return ['I_SHOULD_SOBER_BILI_UP', 'MAYBE_I_CAN_SCARE_HIM_SO_HE_GETS_SOBER'];
            }
            else {
                return ['I_SHOULD_GO_FIND_BILI'];
            }
        }
    }
}
exports.DoctortillaPlayer = DoctortillaPlayer;
function fillArrayWithFillers(arrayToFill, fillers, minSize = MIN_REFLECT_ANSWERS) {
    let result = arrayToFill.slice();
    if ((result.length + fillers.length) < minSize) {
        throw 'ERROR there are not enough fillers.';
    }
    let fillersCopy = fillers.slice();
    while (result.length < minSize) {
        result.push(extractRandomMemberOfArray(fillersCopy));
    }
    return result;
}
function extractRandomMemberOfArray(mutableArray) {
    if (!mutableArray || !mutableArray.length) {
        throw 'ERROR trying to extract element from empty array';
    }
    let randomIndex = Math.floor(Math.random() * mutableArray.length);
    let result = mutableArray[randomIndex];
    mutableArray.splice(randomIndex, 1);
    return result;
}

},{"../engine/models/Player":15,"../engine/state/ActiveInventory.singleton":21,"../engine/state/Scenes.singleton":23,"../engine/ui/Style":41,"../engine/utils/RandomText":51,"./BackstageScene/Coin":55}],59:[function(require,module,exports){
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

},{"../../engine/models/Door":9,"../../engine/utils/RandomText":51}],60:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/utils/Directions":48,"../../engine/utils/RandomText":51}],61:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/utils/Directions":48,"../../engine/utils/RandomText":51}],62:[function(require,module,exports){
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

},{"../../engine/models/Scene":17,"../../engine/utils/Polygon":50,"./BackstageDoorToBackyard":59,"./BackstageDoorToStage":60,"./BackstageDoorToStreet":61,"./BandInSofa":64,"./Bocadillo":65,"./Broom":67,"./Cable":68,"./Coconut":70,"./DustInTable":73,"./FlyCase":74,"./Glass":75,"./LampLeft":76,"./LampRight":77,"./Scissors":78,"./VendingMachine":80}],63:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],64:[function(require,module,exports){
"use strict";
const SpeechBubble_1 = require('../../engine/ui/SpeechBubble');
const Thing_1 = require('../../engine/models/Thing');
const ConversationWithBand_1 = require('./ConversationWithBand');
const Directions_1 = require('../../engine/utils/Directions');
const Style_1 = require('../../engine/ui/Style');
const RandomText_1 = require('../../engine/utils/RandomText');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const analytics_1 = require('../../engine/utils/analytics');
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
        player.changeAttr('TALKED_TO_THE_BAND', true);
        analytics_1.analytics.sendEvent('game', 'talk_to_band');
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":24,"../../engine/ui/SpeechBubble":40,"../../engine/ui/Style":41,"../../engine/utils/Directions":48,"../../engine/utils/RandomText":51,"../../engine/utils/analytics":53,"./ConversationWithBand":71}],65:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"./Bacon":63,"./Bread":66}],66:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],67:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":24,"../../engine/stores/Verbs.store":28,"../../engine/utils/RandomText":51,"./Skirt":79}],68:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/state/Scenes.singleton":23}],69:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":24}],70:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":24,"../utils/CostumeCreator":91}],71:[function(require,module,exports){
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

},{"../../engine/models/Conversation":7,"../../engine/models/ConversationLine":8}],72:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":24}],73:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":24}],74:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],75:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/state/ActiveInventory.singleton":21,"../../engine/state/SelectedObjects":24}],76:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],77:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],78:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":24,"../../engine/utils/RandomText":51}],79:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":24,"../utils/CostumeCreator":91}],80:[function(require,module,exports){
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
        else if (SelectedObjects_1.selectedThing.thing.id === 'bocadillo') {
            player.say('I_SHOULD_TAKE_THE_BACON_OUT_OF_THE_BREAD_FIRST');
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
    lookAction(player) {
        if (!this.getAttr('GREASED')) {
            player.say('THERE_IS_A_CABLE_STUCK_BEHIND_THE_MACHINE');
        }
        else {
            if (this.getAttr('PUSHED')) {
                player.say('THIS_IS_YOUR_STANDARD_VENDING_MACHINE');
            }
            else {
                player.say('NOW_I_COULD_PUSH_THIS_MACHINE');
            }
        }
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":24,"../../engine/ui/SpeechBubble":40,"../../engine/ui/UIBlocker.singleton":44,"../../engine/utils/Directions":48,"./Can":69}],81:[function(require,module,exports){
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

},{"../../engine/models/Door":9,"../../engine/utils/RandomText":51}],82:[function(require,module,exports){
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

},{"../../engine/models/Scene":17,"../../engine/utils/Polygon":50,"./BackyardDoorToBackstage":81,"./Balloon":83,"./Bili":84,"./CutFlowers":86,"./Flowers":87,"./LampBackyard":88,"./Moon":89,"./Star":90}],83:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const Directions_1 = require('../../engine/utils/Directions');
const Style_1 = require('../../engine/ui/Style');
const SelectedObjects_1 = require('../../engine/state/SelectedObjects');
const Scenes_singleton_1 = require('../../engine/state/Scenes.singleton');
const UIBlocker_singleton_1 = require('../../engine/ui/UIBlocker.singleton');
const PhaserGame_singleton_1 = require('../../engine/state/PhaserGame.singleton');
const analytics_1 = require('../../engine/utils/analytics');
let spriteOptions = new Map();
spriteOptions.set('quiet', { frames: [0] });
spriteOptions.set('floating', { frames: [0, 1, 2, 3, 4, 5] });
spriteOptions.set('explode', { frames: [6, 7, 8, 9] });
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
    destroy() {
        this.stopEverything();
        super.destroy();
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
        analytics_1.analytics.sendEvent('game', 'explode_balloon');
        analytics_1.analytics.sendEvent('game', 'end_game');
        UIBlocker_singleton_1.uiBlocker.block();
        player.goToThing(this)
            .then(() => {
            return player.playAnimationOnce('pierce_balloon');
        })
            .then(() => {
            this.changeAttr('EXPLODED', true);
            this.stopEverything();
            return this.playAnimationOnce('explode');
        })
            .then(() => {
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
            analytics_1.analytics.sendEvent('game', 'end_game');
            UIBlocker_singleton_1.uiBlocker.unblock();
            PhaserGame_singleton_1.phaserGame.value.state.start('credits');
        });
    }
    explode() {
        this.sprite.frame = EXPLODED_FRAME;
        this.sprite.animations.stop();
        this.sprite.frame = EXPLODED_FRAME;
    }
    stopEverything() {
        if (this.lastTimeout) {
            window.clearTimeout(this.lastTimeout);
        }
        if (this.sprite.animations.currentAnim) {
            this.sprite.animations.currentAnim.stop();
        }
        this.sprite.animations.stop();
    }
}
exports.Balloon = Balloon;

},{"../../engine/models/Thing":19,"../../engine/state/PhaserGame.singleton":22,"../../engine/state/Scenes.singleton":23,"../../engine/state/SelectedObjects":24,"../../engine/ui/Style":41,"../../engine/ui/UIBlocker.singleton":44,"../../engine/utils/Directions":48,"../../engine/utils/analytics":53}],84:[function(require,module,exports){
"use strict";
const Thing_1 = require('../../engine/models/Thing');
const SpeechBubble_1 = require('../../engine/ui/SpeechBubble');
const ConversationWithBili_1 = require('./ConversationWithBili');
const Directions_1 = require('../../engine/utils/Directions');
const Style_1 = require('../../engine/ui/Style');
const RandomText_1 = require('../../engine/utils/RandomText');
const analytics_1 = require('../../engine/utils/analytics');
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
        if (this.getAttr('DRUNK')) {
            player.changeAttr('TALKED_TO_DRUNK_BILI', true);
        }
        player.goToThing(this).then(() => new ConversationWithBili_1.ConversationWithBili(player, this));
        analytics_1.analytics.sendEvent('game', 'talk_to_bili');
    }
    say(text) {
        this.isTalking = true;
        this.destroyCurrentTimeout();
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
    destroy() {
        super.destroy();
        this.destroyCurrentTimeout();
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
    destroyCurrentTimeout() {
        if (this.currentTimeout) {
            window.clearTimeout(this.currentTimeout);
        }
    }
}
exports.Bili = Bili;

},{"../../engine/models/Thing":19,"../../engine/ui/SpeechBubble":40,"../../engine/ui/Style":41,"../../engine/utils/Directions":48,"../../engine/utils/RandomText":51,"../../engine/utils/analytics":53,"./ConversationWithBili":85}],85:[function(require,module,exports){
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
            return 'HEY_BILI_READY_TO_PLAY';
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

},{"../../engine/models/Conversation":7,"../../engine/models/ConversationLine":8,"../../engine/state/Scenes.singleton":23,"../../engine/utils/RandomText":51}],86:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],87:[function(require,module,exports){
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

},{"../../engine/models/Thing":19,"../../engine/state/SelectedObjects":24,"../utils/CostumeCreator":91}],88:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],89:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],90:[function(require,module,exports){
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

},{"../../engine/models/Thing":19}],91:[function(require,module,exports){
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

},{"../backstageScene/Costume":72}],92:[function(require,module,exports){
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

},{"./BootScene":1,"./CreditsScene":2,"./Phaser":3,"./PlayScene":4,"./PreloaderScene":5,"./StartMenuScene":6,"./engine/state/PhaserGame.singleton":22,"./engine/ui/LayoutManager.singleton":37}]},{},[92])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0Jvb3RTY2VuZS50cyIsInNyYy9hcHAvQ3JlZGl0c1NjZW5lLnRzIiwic3JjL2FwcC9QaGFzZXIudHMiLCJzcmMvYXBwL1BsYXlTY2VuZS50cyIsInNyYy9hcHAvUHJlbG9hZGVyU2NlbmUudHMiLCJzcmMvYXBwL1N0YXJ0TWVudVNjZW5lLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0NvbnZlcnNhdGlvbi50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9Db252ZXJzYXRpb25MaW5lLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0Rvb3IudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvR2FtZS50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9HYW1lQ2FtZXJhLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0dlbmVyaWNIaWdobGlnaHRlZFRoaW5nLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL0ludmVudG9yeS50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9QYXRoRmluZGVyLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL1BsYXllci50cyIsInNyYy9hcHAvZW5naW5lL21vZGVscy9QbGF5ZXJNb3ZlbWVudEhhbmRsZXIudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvU2NlbmUudHMiLCJzcmMvYXBwL2VuZ2luZS9tb2RlbHMvU2NlbmVCb3VuZGFyaWVzLnRzIiwic3JjL2FwcC9lbmdpbmUvbW9kZWxzL1RoaW5nLnRzIiwic3JjL2FwcC9lbmdpbmUvc291bmQvU291bmRNYW5hZ2VyLnRzIiwic3JjL2FwcC9lbmdpbmUvc3RhdGUvQWN0aXZlSW52ZW50b3J5LnNpbmdsZXRvbi50cyIsInNyYy9hcHAvZW5naW5lL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uLnRzIiwic3JjL2FwcC9lbmdpbmUvc3RhdGUvU2NlbmVzLnNpbmdsZXRvbi50cyIsInNyYy9hcHAvZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cy50cyIsInNyYy9hcHAvZW5naW5lL3N0YXRlL1NlbGVjdGVkVmVyYi5zaW5nbGV0b24udHMiLCJzcmMvYXBwL2VuZ2luZS9zdG9yZXMvRGVmYXVsdExhYmVscy50cyIsInNyYy9hcHAvZW5naW5lL3N0b3Jlcy9MYWJlbHMuc3RvcmUudHMiLCJzcmMvYXBwL2VuZ2luZS9zdG9yZXMvVmVyYnMuc3RvcmUudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9BY3Rpb25CdXR0b24udHMiLCJzcmMvYXBwL2VuZ2luZS91aS9Db252ZXJzYXRpb25MaW5lVUkudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9Db252ZXJzYXRpb25VSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0N1cnJlbnRBY3Rpb25VSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0dyYXBoaWNVSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0ludmVudG9yeUl0ZW1VSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0ludmVudG9yeVBhZ2luYXRpb25CdXR0b24udHMiLCJzcmMvYXBwL2VuZ2luZS91aS9JbnZlbnRvcnlVSS50cyIsInNyYy9hcHAvZW5naW5lL3VpL0xheW91dE1hbmFnZXIuc2luZ2xldG9uLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvUmVmbGVjdEJ1dHRvbi50cyIsInNyYy9hcHAvZW5naW5lL3VpL1NvdW5kQnV0dG9ucy50cyIsInNyYy9hcHAvZW5naW5lL3VpL1NwZWVjaEJ1YmJsZS50cyIsInNyYy9hcHAvZW5naW5lL3VpL1N0eWxlLnRzIiwic3JjL2FwcC9lbmdpbmUvdWkvVGV4dEluU2NlbmUudHMiLCJzcmMvYXBwL2VuZ2luZS91aS9UZXh0V2l0aFNoYWRvdy50cyIsInNyYy9hcHAvZW5naW5lL3VpL1VJQmxvY2tlci5zaW5nbGV0b24udHMiLCJzcmMvYXBwL2VuZ2luZS91aS9VSUxheWVycy5zaW5nbGV0b24udHMiLCJzcmMvYXBwL2VuZ2luZS91aS9WZXJic1VJLnRzIiwic3JjL2FwcC9lbmdpbmUvdXRpbHMvQWN0aW9uRGlzcGF0Y2hlci50cyIsInNyYy9hcHAvZW5naW5lL3V0aWxzL0RpcmVjdGlvbnMudHMiLCJzcmMvYXBwL2VuZ2luZS91dGlscy9PYnNlcnZhYmxlLnRzIiwic3JjL2FwcC9lbmdpbmUvdXRpbHMvUG9seWdvbi50cyIsInNyYy9hcHAvZW5naW5lL3V0aWxzL1JhbmRvbVRleHQudHMiLCJzcmMvYXBwL2VuZ2luZS91dGlscy9TZWdtZW50LnRzIiwic3JjL2FwcC9lbmdpbmUvdXRpbHMvYW5hbHl0aWNzLnRzIiwic3JjL2FwcC9nYW1lL0Fzc2V0c01hbmFnZXIudHMiLCJzcmMvYXBwL2dhbWUvQmFja3N0YWdlU2NlbmUvQ29pbi50cyIsInNyYy9hcHAvZ2FtZS9Eb2N0b3J0aWxsYUdhbWUudHMiLCJzcmMvYXBwL2dhbWUvRG9jdG9ydGlsbGFMYWJlbHMudHMiLCJzcmMvYXBwL2dhbWUvRG9jdG9ydGlsbGFQbGF5ZXIudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQmFja3N0YWdlRG9vclRvQmFja3lhcmQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQmFja3N0YWdlRG9vclRvU3RhZ2UudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQmFja3N0YWdlRG9vclRvU3RyZWV0LnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JhY2tzdGFnZVNjZW5lLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JhY29uLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JhbmRJblNvZmEudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvQm9jYWRpbGxvLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0JyZWFkLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0Jyb29tLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0NhYmxlLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0Nhbi50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9Db2NvbnV0LnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0NvbnZlcnNhdGlvbldpdGhCYW5kLnRzIiwic3JjL2FwcC9nYW1lL2JhY2tzdGFnZVNjZW5lL0Nvc3R1bWUudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvRHVzdEluVGFibGUudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvRmx5Q2FzZS50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9HbGFzcy50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9MYW1wTGVmdC50cyIsInNyYy9hcHAvZ2FtZS9iYWNrc3RhZ2VTY2VuZS9MYW1wUmlnaHQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvU2Npc3NvcnMudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvU2tpcnQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3N0YWdlU2NlbmUvVmVuZGluZ01hY2hpbmUudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9CYWNreWFyZERvb3JUb0JhY2tzdGFnZS50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL0JhY2t5YXJkU2NlbmUudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9CYWxsb29uLnRzIiwic3JjL2FwcC9nYW1lL2JhY2t5YXJkU2NlbmUvQmlsaS50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL0NvbnZlcnNhdGlvbldpdGhCaWxpLnRzIiwic3JjL2FwcC9nYW1lL2JhY2t5YXJkU2NlbmUvQ3V0Rmxvd2Vycy50cyIsInNyYy9hcHAvZ2FtZS9iYWNreWFyZFNjZW5lL0Zsb3dlcnMudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9MYW1wQmFja3lhcmQudHMiLCJzcmMvYXBwL2dhbWUvYmFja3lhcmRTY2VuZS9Nb29uLnRzIiwic3JjL2FwcC9nYW1lL2JhY2t5YXJkU2NlbmUvU3Rhci50cyIsInNyYy9hcHAvZ2FtZS91dGlscy9Db3N0dW1lQ3JlYXRvci50cyIsInNyYy9hcHAvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSwwQ0FBdUIscUNBQXFDLENBQUMsQ0FBQTtBQUM3RCx5QkFBdUIsVUFBVSxDQUFDLENBQUE7QUFFckIsaUJBQVMsR0FBRztJQUNyQixPQUFPLEVBQUU7UUFDTCxtREFBbUQ7UUFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRCxNQUFNLEVBQUU7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsZUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7UUFFM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGdDQUFNLENBQUMsV0FBVyxFQUFFLGdDQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckUseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3BELGVBQU0sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFRLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRTVFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0osQ0FBQzs7OztBQ25CVyxvQkFBWSxHQUFHO0lBQ3hCLE9BQU8sRUFBRSxjQUFZLENBQUM7SUFFdEIsTUFB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LENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsR0FBRyxD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QyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDOUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDcEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3RELENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUN6RCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0Qsa0dBQWtHO0lBQ2xHLGlCQUFpQixDQUFDLEtBQWE7UUFDM0IsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFM0MsRUFBRSxDQUFBLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxJQUFJ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QUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO0FBQ2hELENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9lbmdpbmUvdWkvTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi9QaGFzZXInO1xuXG5leHBvcnQgY29uc3QgQm9vdFNjZW5lID0ge1xuICAgIHByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBsb2FkIGhlcmUgYXNzZXRzIHJlcXVpcmVkIGZvciB0aGUgbG9hZGluZyBzY3JlZW5cbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ3ByZWxvYWRlcl9iYXInLCAnYXNzZXRzL2ltYWdlcy91aS9QUkVMT0FERVJfQkFSLnBuZycpO1xuICAgIH0sXG5cbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IHBoYXNlci5TY2FsZU1hbmFnZXIuVVNFUl9TQ0FMRTtcblxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2V0VXNlclNjYWxlKGxheW91dC5MQVlPVVRfWk9PTSwgbGF5b3V0LkxBWU9VVF9aT09NKTtcbiAgICAgICAgLy8gZW5hYmxlIGNyaXNwIHJlbmRlcmluZ1xuICAgICAgICB0aGlzLmdhbWUucmVuZGVyZXIucmVuZGVyU2Vzc2lvbi5yb3VuZFBpeGVscyA9IHRydWU7XG4gICAgICAgIHBoYXNlci5DYW52YXMuc2V0SW1hZ2VSZW5kZXJpbmdDcmlzcCh0aGlzLmdhbWUuY2FudmFzKTtcblxuICAgICAgICB0aGlzLmdhbWUuY2FudmFzLm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbiAoZTogRXZlbnQpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB9XG5cbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdwcmVsb2FkZXInKTtcbiAgICB9XG59OyIsImltcG9ydCB7IHBoYXNlciB9IGZyb20gJy4vUGhhc2VyJztcblxuZXhwb3J0IGNvbnN0IENyZWRpdHNTY2VuZSA9IHtcbiAgICBwcmVsb2FkOiBmdW5jdGlvbigpIHt9LFxuXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlQkcoKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlQkc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCAnQ1JFRElUUycpO1xuICAgIH1cblxufTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdmVuZG9yL3BoYXNlci9waGFzZXIuZC50c1wiLz5cbmV4cG9ydCBjb25zdCBwaGFzZXIgPSBQaGFzZXI7IiwiaW1wb3J0IHsgRG9jdG9ydGlsbGFHYW1lIH0gZnJvbSAnLi9nYW1lL0RvY3RvcnRpbGxhR2FtZSc7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi9lbmdpbmUvc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuXG5jbGFzcyBQbGF5U2NlbmUge1xuXG4gICAgZ2FtZU1vZGVsOiBEb2N0b3J0aWxsYUdhbWU7XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZU1vZGVsID0gbmV3IERvY3RvcnRpbGxhR2FtZSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lTW9kZWwudXBkYXRlKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICAvLyBwaGFzZXJHYW1lLnZhbHVlLmRlYnVnLmlucHV0SW5mbygzMiwgMzIpO1xuICAgICAgICAvLyBwaGFzZXJHYW1lLnZhbHVlLmRlYnVnLnBvaW50ZXIoIHBoYXNlckdhbWUudmFsdWUuaW5wdXQuYWN0aXZlUG9pbnRlciApO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IHBsYXlTY2VuZSA9IG5ldyBQbGF5U2NlbmUoKTtcbiIsImltcG9ydCB7IGFzc2V0c01hbmFnZXIgfSBmcm9tICcuL2dhbWUvQXNzZXRzTWFuYWdlcic7XG5cbmV4cG9ydCBjb25zdCBQcmVsb2FkZXJTY2VuZSA9IHtcbiAgICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubG9hZGluZ0JhciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDI0MCwgJ3ByZWxvYWRlcl9iYXInKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nQmFyLmFuY2hvci5zZXRUbygwLCAwLjUpO1xuICAgICAgICB0aGlzLmxvYWQuc2V0UHJlbG9hZFNwcml0ZSh0aGlzLmxvYWRpbmdCYXIpO1xuXG4gICAgICAgIGFzc2V0c01hbmFnZXIubG9hZEFzc2V0cyg8UGhhc2VyLkdhbWU+IHRoaXMuZ2FtZSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ3N0YXJ0TWVudScpO1xuICAgIH1cbn07IiwiaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9lbmdpbmUvdWkvTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi9QaGFzZXInO1xuaW1wb3J0IHsgbGFiZWxzU3RvcmUgfSBmcm9tICcuL2VuZ2luZS9zdG9yZXMvTGFiZWxzLnN0b3JlJztcbmltcG9ydCB7IGFuYWx5dGljcyB9IGZyb20gJy4vZW5naW5lL3V0aWxzL2FuYWx5dGljcyc7XG5cbmV4cG9ydCBjb25zdCBTdGFydE1lbnVTY2VuZSA9IHtcbiAgICBwcmVsb2FkOiBmdW5jdGlvbigpIHt9LFxuXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlTG9nbygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvbnMoKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlTG9nbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBsb2dvIDogUGhhc2VyLlNwcml0ZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKGxheW91dC5MT0dPX1BPU0lUSU9OLngsIGxheW91dC5MT0dPX1BPU0lUSU9OLnkgLSAzMCwgJ0xPR08nKTtcbiAgICAgICAgbGV0IGxvZ29Ud2VlbiA6IFBoYXNlci5Ud2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4obG9nbyk7XG5cbiAgICAgICAgbG9nb1R3ZWVuLnRvKHsgeTogbGF5b3V0LkxPR09fUE9TSVRJT04ueSB9LCAxMDAwLCAnRWxhc3RpYycsIHRydWUsIDApO1xuXG4gICAgICAgIGxldCB0aGVHYW1lOiBQaGFzZXIuU3ByaXRlID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUobGF5b3V0LlRIRV9HQU1FX1BPU0lUSU9OLngsIGxheW91dC5USEVfR0FNRV9QT1NJVElPTi55LCAnVEhFX0dBTUUnKTtcbiAgICAgICAgbGV0IHRoZUdhbWVUd2VlbiA6IFBoYXNlci5Ud2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4odGhlR2FtZSk7XG4gICAgICAgIHRoZUdhbWUuYWxwaGEgPSAwO1xuICAgICAgICB0aGVHYW1lVHdlZW4udG8oeyBhbHBoYTogMSB9LCAxMDAwLCAnTGluZWFyJywgdHJ1ZSwgMCk7XG5cbiAgICB9LFxuXG4gICAgY3JlYXRlQnV0dG9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRW5nbGlzaEJ1dHRvbigpO1xuICAgICAgICB0aGlzLmNyZWF0ZVNwYW5pc2hCdXR0b24oKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlRW5nbGlzaEJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbmdsaXNoQnV0dG9uIDogUGhhc2VyLkJ1dHRvbiA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKFxuICAgICAgICAgICAgbGF5b3V0LkVOR0xJU0hfQlVUVE9OX1BPU0lUSU9OLngsXG4gICAgICAgICAgICBsYXlvdXQuRU5HTElTSF9CVVRUT05fUE9TSVRJT04ueSxcbiAgICAgICAgICAgICdFTkdMSVNIX0JVVFRPTicsXG4gICAgICAgICAgICB0aGlzLm9uRW5nbGlzaEJ1dHRvbkNsaWNrLFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMixcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgZW5nbGlzaEJ1dHRvbi5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgY3JlYXRlU3BhbmlzaEJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzcGFuaXNoQnV0dG9uIDogUGhhc2VyLkJ1dHRvbiA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKFxuICAgICAgICAgICAgbGF5b3V0LlNQQU5JU0hfQlVUVE9OX1BPU0lUSU9OLngsXG4gICAgICAgICAgICBsYXlvdXQuU1BBTklTSF9CVVRUT05fUE9TSVRJT04ueSxcbiAgICAgICAgICAgICdTUEFOSVNIX0JVVFRPTicsXG4gICAgICAgICAgICB0aGlzLm9uU3BhbmlzaEJ1dHRvbkNsaWNrLFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMixcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgc3BhbmlzaEJ1dHRvbi5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgb25FbmdsaXNoQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICBhbmFseXRpY3Muc2VuZEV2ZW50KCdzdGFydF9tZW51JywgJ3NlbGVjdF9sYW5ndWFnZScsICdlbmdsaXNoJyk7XG4gICAgICAgIGFuYWx5dGljcy5zZW5kRXZlbnQoJ2dhbWUnLCAnc3RhcnRfZ2FtZScpO1xuICAgICAgICBsYWJlbHNTdG9yZS5zZXRMYW5ndWFnZSgnZW4nKTtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdwbGF5Jyk7XG4gICAgfSxcblxuICAgIG9uU3BhbmlzaEJ1dHRvbkNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgYW5hbHl0aWNzLnNlbmRFdmVudCgnc3RhcnRfbWVudScsICdzZWxlY3RfbGFuZ3VhZ2UnLCAnc3BhbmlzaCcpO1xuICAgICAgICBhbmFseXRpY3Muc2VuZEV2ZW50KCdnYW1lJywgJ3N0YXJ0X2dhbWUnKTtcbiAgICAgICAgbGFiZWxzU3RvcmUuc2V0TGFuZ3VhZ2UoJ2VzJyk7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgncGxheScpO1xuICAgIH1cbn07IiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcbmltcG9ydCB7IE9ic2VydmFibGUsIElDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzL09ic2VydmFibGUnO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uTGluZSB9IGZyb20gJy4vQ29udmVyc2F0aW9uTGluZSc7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25VSSB9IGZyb20gJy4uL3VpL0NvbnZlcnNhdGlvblVJJztcblxuZXhwb3J0IGludGVyZmFjZSBJQ29udmVyc2F0aW9uU2NyaXB0IHsgW3M6IHN0cmluZ106IEFycmF5PENvbnZlcnNhdGlvbkxpbmU+OyB9XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb252ZXJzYXRpb24ge1xuXG4gICAgcHJpdmF0ZSBvbkNoYW5nZU9ic2VydmFibGU6IE9ic2VydmFibGU7XG4gICAgcHJpdmF0ZSBfc3RhdGVJZDogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBzY3JpcHQ6IElDb252ZXJzYXRpb25TY3JpcHQ7XG4gICAgcHJpdmF0ZSB1aTogQ29udmVyc2F0aW9uVUk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcGxheWVyOiBQbGF5ZXIsIHByb3RlY3RlZCBvdGhlclBlcnNvbjogVGhpbmcpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICAgIHRoaXMub3RoZXJQZXJzb24gPSBvdGhlclBlcnNvbjtcbiAgICAgICAgdGhpcy5sb2FkU2NyaXB0KCk7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5pbml0U3RhdGUoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVDb252ZXJzYXRpb25VSSgpO1xuICAgIH1cblxuICAgIG9uU3RhdGVDaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZS5yZWdpc3Rlck9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5zdGF0ZSk7XG4gICAgfVxuXG4gICAgZ2V0IHN0YXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZUlkO1xuICAgIH1cblxuICAgIGdldExpbmVzKCk6IEFycmF5PENvbnZlcnNhdGlvbkxpbmU+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRTdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGlmICghdGhpcy5zY3JpcHQgfHwgIXRoaXMuc2NyaXB0W2N1cnJlbnRTdGF0ZV0pIHtcbiAgICAgICAgICAgIHRocm93ICdFUlJPUiwgdGhlcmUgYXJlIG5vIGxpbmVzIGZvciB0aGlzIHN0YXRlIG9mIGNvbnZlcnNhdGlvbic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2NyaXB0W2N1cnJlbnRTdGF0ZV07XG4gICAgfVxuXG4gICAgc2V0IHN0YXRlKG5ld1N0YXRlKSB7XG4gICAgICAgIGlmIChuZXdTdGF0ZSA9PT0gJ2VuZCcpIHtcbiAgICAgICAgICAgIHRoaXMudWkuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGVJZCA9IG5ld1N0YXRlO1xuICAgICAgICAgICAgdGhpcy5sb2FkU2NyaXB0KCk7XG4gICAgICAgICAgICB0aGlzLm5vdGlmeVN0YXRlQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseUxpbmUobGluZTogQ29udmVyc2F0aW9uTGluZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnBsYXllci5zYXkobGluZS50ZXh0KHRoaXMucGxheWVyKSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsaW5lLmFmdGVyQ2FsbGJhY2sodGhpcy5wbGF5ZXIsIHRoaXMub3RoZXJQZXJzb24pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBsaW5lLm5leHRTdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRUZXh0Rm9yTGluZShsaW5lOiBDb252ZXJzYXRpb25MaW5lKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIHRleHRDYWxsYmFjayA9IGxpbmUudGV4dDtcbiAgICAgICAgcmV0dXJuIHRleHRDYWxsYmFjayh7fSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IGxvYWRTY3JpcHQoKTogdm9pZDtcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgaW5pdFN0YXRlKCk6IHZvaWQ7XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNvbnZlcnNhdGlvblVJKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnVpID0gbmV3IENvbnZlcnNhdGlvblVJKHRoaXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbm90aWZ5U3RhdGVDaGFuZ2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLm5vdGlmeU9ic2VydmVycyh0aGlzLnN0YXRlKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5pbXBvcnQgeyBJQ2FsbGJhY2sgfSBmcm9tICcuLi9VdGlscy9PYnNlcnZhYmxlJztcblxuZXhwb3J0IGludGVyZmFjZSBJQ29udmVyc2F0aW9uQ2FsbGJhY2sge1xuICAgIChwbGF5ZXI6IFBsYXllciwgb3RoZXJQZXJzb246IFRoaW5nKTogYW55O1xufVxuXG5jb25zdCBlbXB0eUZ1bmN0aW9uV2l0aFByb21pc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgcmVzb2x2ZUNhbGxiYWNrOiBmdW5jdGlvbigpIHt9XG4gICAgfTtcbiAgICBsZXQgZGVmZXJyZWQgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICByZXN1bHQucmVzb2x2ZUNhbGxiYWNrID0gcmVzb2x2ZTtcbiAgICB9KTtcbiAgICByZXN1bHQucmVzb2x2ZUNhbGxiYWNrKCk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQ7XG59O1xuXG5leHBvcnQgY2xhc3MgQ29udmVyc2F0aW9uTGluZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF90ZXh0OiBzdHJpbmcgfCBJQ29udmVyc2F0aW9uQ2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBfbmV4dFN0YXRlOiBzdHJpbmcgfCAoKCkgPT4gc3RyaW5nKSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9hZnRlckNhbGxiYWNrOiBJQ29udmVyc2F0aW9uQ2FsbGJhY2sgPSBlbXB0eUZ1bmN0aW9uV2l0aFByb21pc2UpIHtcblxuICAgICAgICBpZiAoIXRoaXMuX3RleHQpIHtcbiAgICAgICAgICAgIHRocm93ICdFUlJPUjogbWlzc2luZyB0ZXh0IGZvciBjb252ZXJzYXRpb24gbGluZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9uZXh0U3RhdGUpIHtcbiAgICAgICAgICAgIHRocm93ICdFUlJPUjogbWlzc2luZyBuZXh0IHN0YXRlIGZvciBjb252ZXJzYXRpb24gbGluZSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgdGV4dCgpOiBJQ2FsbGJhY2sge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX3RleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gKCgpID0+IHtyZXR1cm4gdGhpcy5fdGV4dDsgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuX3RleHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiA8SUNhbGxiYWNrPiB0aGlzLl90ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHRocm93ICdFUlJPUjogZ2V0dGluZyB0ZXh0IG9mIGNvbnZlcnNhdGlvbiBsaW5lLCB3aXRoIGluY29ycmVjdCB0eXBlJztcbiAgICB9XG5cbiAgICBnZXQgYWZ0ZXJDYWxsYmFjaygpOiBJQ29udmVyc2F0aW9uQ2FsbGJhY2sge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWZ0ZXJDYWxsYmFjaztcbiAgICB9XG5cbiAgICBnZXQgbmV4dFN0YXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE5leHRTdGF0ZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TmV4dFN0YXRlKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fbmV4dFN0YXRlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIDxzdHJpbmc+IHRoaXMuX25leHRTdGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoPCgoKSA9PiBzdHJpbmcpPiB0aGlzLl9uZXh0U3RhdGUpKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHsgSVBvaW50LCBJR29Ub1NjZW5lT3B0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgVmVyYnMgfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuXG5pbnRlcmZhY2UgSURvb3JPcHRpb25zIHtcbiAgICBpZDogc3RyaW5nLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHNwcml0ZUlkOiBzdHJpbmcsXG4gICAgZ29Ub1Bvc2l0aW9uOiBJUG9pbnQsXG4gICAgZGVzdGluYXRpb25TY2VuZUlkOiBzdHJpbmcsXG4gICAgcmVsYXRlZERvb3JJZDogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBEb29yIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRvb3JPcHRpb25zOiBJRG9vck9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoZG9vck9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMubmFtZSB8fCAnZG9vcic7XG4gICAgfVxuXG4gICAgZ2V0UHJlZmVycmVkQWN0aW9uKCk6IFZlcmJzIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignT1BFTicpKSB7XG4gICAgICAgICAgICByZXR1cm4gVmVyYnMuQ0xPU0U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gVmVyYnMuT1BFTjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvcmNlT3BlbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VBdHRyKCdPUEVOJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZ29Ub0FjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICB0aGlzLmdvVG9EZXN0aW5hdGlvbklmT3BlbihwbGF5ZXIpO1xuICAgIH1cblxuICAgIG9wZW5BY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMub3BlbihwbGF5ZXIpKTtcbiAgICB9XG5cbiAgICBjbG9zZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5jbG9zZShwbGF5ZXIpKTtcbiAgICB9XG5cbiAgICBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdUaGF0XFwncyBhIHdvbmRlcmZ1bCBkb29yLiBTbyB3b29keS4nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9wZW4ocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignT1BFTicpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJdCBpcyBhbHJlYWR5IG9wZW4hJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ09QRU4nLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xvc2UocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmdldEF0dHIoJ09QRU4nKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSXQgaXMgYWxyZWFkeSBjbG9zZWQhJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ09QRU4nLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25TdGF0ZUNoYW5nZSgpOiB2b2lkIHtcbiAgICAgICAgaWYoIXRoaXMuc3ByaXRlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignT1BFTicpKSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZSA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZSA9IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdvVG9EZXN0aW5hdGlvbklmT3BlbihwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignT1BFTicpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGdvVG9TY2VuZU9wdGlvbnM6IElHb1RvU2NlbmVPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBzY2VuZUlkOiB0aGlzLmRvb3JPcHRpb25zLmRlc3RpbmF0aW9uU2NlbmVJZCxcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRlZERvb3JJZDogdGhpcy5kb29yT3B0aW9ucy5yZWxhdGVkRG9vcklkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5HT19UT19TQ0VORSwgZ29Ub1NjZW5lT3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGxhYmVsc1N0b3JlIH0gZnJvbSAnLi4vc3RvcmVzL0xhYmVscy5zdG9yZSc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuaW1wb3J0IHsgYWN0aXZlSW52ZW50b3J5IH0gZnJvbSAnLi4vc3RhdGUvQWN0aXZlSW52ZW50b3J5LnNpbmdsZXRvbic7XG5pbXBvcnQgeyBTY2VuZSB9IGZyb20gJy4vU2NlbmUnO1xuaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcbmltcG9ydCB7IEdyYXBoaWNVSSB9IGZyb20gJy4uL3VpL0dyYXBoaWNVSSc7XG5pbXBvcnQgeyBHYW1lQ2FtZXJhIH0gZnJvbSAnLi9HYW1lQ2FtZXJhJztcbmltcG9ydCB7IHNlbGVjdGVkVmVyYiB9IGZyb20gJy4uL3N0YXRlL1NlbGVjdGVkVmVyYi5zaW5nbGV0b24nO1xuaW1wb3J0IHsgVmVyYnNJbmZvIH0gZnJvbSAnLi4vc3RvcmVzL1ZlcmJzLnN0b3JlJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgc2NlbmVzIH0gZnJvbSAnLi4vc3RhdGUvU2NlbmVzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBJR29Ub1NjZW5lT3B0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgc291bmQgfSBmcm9tICcuLi9zb3VuZC9Tb3VuZE1hbmFnZXInO1xuaW1wb3J0IHsgSUxhYmVscyAgfSBmcm9tICcuLi9zdG9yZXMvTGFiZWxzLnN0b3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBJR2FtZU9wdGlvbnMge1xuICAgIGxhYmVsczogSUxhYmVscyxcbiAgICBwbGF5ZXI6IFBsYXllcixcbiAgICBzY2VuZXM6IEFycmF5PFNjZW5lPixcbiAgICBpbml0aWFsU2NlbmVJZDogc3RyaW5nLFxuICAgIHNvbmdzPzogQXJyYXk8c3RyaW5nPlxufVxuXG5pbnRlcmZhY2UgSVNlbGVjdFRoaW5nT3B0aW9ucyB7XG4gICAgdGhpbmc6IFRoaW5nLFxuICAgIHNlY29uZGFyeUFjdGlvbj86IEJvb2xlYW5cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdhbWUge1xuXG4gICAgcHJpdmF0ZSBwbGF5ZXI6IFBsYXllcjtcbiAgICBwcml2YXRlIGNhbWVyYTogR2FtZUNhbWVyYTtcbiAgICBwcml2YXRlIGdyYXBoaWNVSTogR3JhcGhpY1VJO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIG9wdGlvbnM6IElHYW1lT3B0aW9ucykge1xuICAgICAgICBsYWJlbHNTdG9yZS5hZGRMYWJlbHModGhpcy5vcHRpb25zLmxhYmVscyk7XG4gICAgICAgIHRoaXMucGxheWVyID0gdGhpcy5vcHRpb25zLnBsYXllcjtcbiAgICAgICAgYWN0aXZlSW52ZW50b3J5LnNldEFjdGl2ZUludmVudG9yeSh0aGlzLnBsYXllci5pbnZlbnRvcnkpO1xuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lcyh0aGlzLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLmluaXRBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMudXBkYXRlV29ybGRCb3VuZHMoKTtcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgR2FtZUNhbWVyYSh0aGlzLnBsYXllcik7XG4gICAgICAgIHRoaXMuZ3JhcGhpY1VJID0gbmV3IEdyYXBoaWNVSSgpO1xuICAgICAgICBpZih0aGlzLm9wdGlvbnMuc29uZ3MpIHtcbiAgICAgICAgICAgIHNvdW5kLnBsYXlNdXNpYyh0aGlzLm9wdGlvbnMuc29uZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMub25TdGFydCkge1xuICAgICAgICAgICAgdGhpcy5vblN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfVxuXG4gICAgLy9UbyBvdmVycmlkZSBpbiBjaGlsZCBjbGFzc2VzXG4gICAgcHJvdGVjdGVkIG9uU3RhcnQoKTogdm9pZCB7fVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZXMob3B0aW9uczogSUdhbWVPcHRpb25zKTogdm9pZCB7XG4gICAgICAgIHNjZW5lcy5pbml0KG9wdGlvbnMuc2NlbmVzKTtcbiAgICAgICAgc2NlbmVzLnNldEN1cnJlbnRTY2VuZUJ5SWQob3B0aW9ucy5pbml0aWFsU2NlbmVJZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0QWN0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhBY3Rpb25zLkNMSUNLX1NUQUdFLCBldiA9PiB0aGlzLm1vdmVQbGF5ZXJUbyhldikgKTtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhBY3Rpb25zLlNFTEVDVF9USElORywgb3B0aW9ucyA9PiB0aGlzLnNlbGVjdFRoaW5nKG9wdGlvbnMpICk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oQWN0aW9ucy5HT19UT19TQ0VORSwgb3B0aW9ucyA9PiB0aGlzLmdvVG9TY2VuZShvcHRpb25zKSApO1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKEFjdGlvbnMuVEFLRV9PQkpFQ1QsIHRoaW5nID0+IHRoaXMudGFrZU9iamVjdCh0aGluZykgKTtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhBY3Rpb25zLlJFRkxFQ1QsICgpID0+IHRoaXMucmVmbGVjdCgpICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb3ZlUGxheWVyVG8oZXZlbnQ6IFBoYXNlci5Qb2ludGVyKTogdm9pZCB7XG4gICAgICAgIGxldCBub25TYWZlUG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiBldmVudC53b3JsZFgsXG4gICAgICAgICAgICB5OiBldmVudC53b3JsZFlcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHNhZmVQb3NpdGlvbiA9IHNjZW5lcy5jdXJyZW50U2NlbmUuYm91bmRhcmllcy5nZXRQb3NpdGlvbkluc2lkZShub25TYWZlUG9zaXRpb24pO1xuICAgICAgICB0aGlzLnBsYXllci5tb3ZlVG8oc2FmZVBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVdvcmxkQm91bmRzKCk6IHZvaWQge1xuICAgICAgICBsZXQgYm91bmRzID0gc2NlbmVzLmN1cnJlbnRTY2VuZS5zY2VuZUJvdW5kcztcbiAgICAgICAgcGhhc2VyR2FtZS52YWx1ZS53b3JsZC5zZXRCb3VuZHMoXG4gICAgICAgICAgICBib3VuZHMueCxcbiAgICAgICAgICAgIGJvdW5kcy55LFxuICAgICAgICAgICAgYm91bmRzLndpZHRoLFxuICAgICAgICAgICAgYm91bmRzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZWxlY3RUaGluZyhvcHRpb25zOiBJU2VsZWN0VGhpbmdPcHRpb25zKTogdm9pZCB7XG4gICAgICAgIHZhciB2ZXJiID0gVmVyYnNJbmZvLmdldChzZWxlY3RlZFZlcmIudmVyYik7XG4gICAgICAgIGlmKG9wdGlvbnMuc2Vjb25kYXJ5QWN0aW9uICYmIG9wdGlvbnMudGhpbmcuZ2V0UHJlZmVycmVkQWN0aW9uKCkpIHtcbiAgICAgICAgICAgIG9wdGlvbnMudGhpbmcuYXBwbHlBY3Rpb24ob3B0aW9ucy50aGluZy5nZXRQcmVmZXJyZWRBY3Rpb24oKSwgdGhpcy5wbGF5ZXIpO1xuICAgICAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuQUNUSU9OX0FQUExJRUQpO1xuICAgICAgICB9IGVsc2UgaWYgKHZlcmIuc2luZ2xlT2JqZWN0KSB7XG4gICAgICAgICAgICBvcHRpb25zLnRoaW5nLmFwcGx5QWN0aW9uKHNlbGVjdGVkVmVyYi52ZXJiLCB0aGlzLnBsYXllcik7XG4gICAgICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5BQ1RJT05fQVBQTElFRCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFRoaW5nRm9yTXVsdGlwbGVPYmplY3RWZXJiKG9wdGlvbnMudGhpbmcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0YWtlT2JqZWN0KHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICBzY2VuZXMuY3VycmVudFNjZW5lLnJlbW92ZU9iamVjdCh0aGluZyk7XG4gICAgICAgIHRoaXMucGxheWVyLmFkZE9iamVjdFRvSW52ZW50b3J5KHRoaW5nKTtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuVVBEQVRFX0lOVkVOVE9SWSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZWxlY3RUaGluZ0Zvck11bHRpcGxlT2JqZWN0VmVyYih0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcpIHtcbiAgICAgICAgICAgIHRoaW5nLmFwcGx5QWN0aW9uKHNlbGVjdGVkVmVyYi52ZXJiLCB0aGlzLnBsYXllcik7XG4gICAgICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5BQ1RJT05fQVBQTElFRCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpbmcuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZyA9IHRoaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnb1RvU2NlbmUob3B0aW9uczogSUdvVG9TY2VuZU9wdGlvbnMpIHtcbiAgICAgICAgc2NlbmVzLmdvVG9TY2VuZVdpdGhJZChvcHRpb25zLnNjZW5lSWQpO1xuICAgICAgICBzY2VuZXMuY3VycmVudFNjZW5lLnBsYXllckFycml2ZXNBdERvb3IodGhpcy5wbGF5ZXIsIG9wdGlvbnMucmVsYXRlZERvb3JJZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWZsZWN0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBsYXllci5yZWZsZWN0KCk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcbmltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuLi91aS9TdHlsZSc7XG5cbmV4cG9ydCBjbGFzcyBHYW1lQ2FtZXJhIHtcbiAgICBwcml2YXRlIGNhbWVyYTogUGhhc2VyLkNhbWVyYTtcbiAgICBwcml2YXRlIGNhbWVyYVBvc2l0aW9uOiBJUG9pbnQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsYXllcjogUGxheWVyKSB7XG4gICAgICAgIGlmICghdGhpcy5wbGF5ZXIpIHtcbiAgICAgICAgICAgIHRocm93ICdFUlJPUjogYSBjYW1lcmEgbmVlZHMgYSBwbGF5ZXIgdG8gZm9sbG93JztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbWVyYSA9IHBoYXNlckdhbWUudmFsdWUuY2FtZXJhO1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlUG9zaXRpb24oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2FtZXJhUG9zaXRpb24gPSB0aGlzLmNhbWVyYVBvc2l0aW9uIHx8IG5ldyBQaGFzZXIuUG9pbnQoMCwgMCk7XG5cbiAgICAgICAgbGV0IHBsYXllciA9IHRoaXMucGxheWVyLnNwcml0ZTtcbiAgICAgICAgdGhpcy5jYW1lcmFQb3NpdGlvbi54ICs9IChwbGF5ZXIueCAtIHRoaXMuY2FtZXJhUG9zaXRpb24ueCkgKiBzdHlsZS5DQU1FUkFfRUFTSU5HX0ZBQ1RPUjtcbiAgICAgICAgdGhpcy5jYW1lcmFQb3NpdGlvbi54ID0gTWF0aC5yb3VuZCh0aGlzLmNhbWVyYVBvc2l0aW9uLngpO1xuICAgICAgICB0aGlzLmNhbWVyYVBvc2l0aW9uLnkgKz0gKHBsYXllci55IC0gdGhpcy5jYW1lcmFQb3NpdGlvbi55KSAqIHN0eWxlLkNBTUVSQV9FQVNJTkdfRkFDVE9SO1xuICAgICAgICB0aGlzLmNhbWVyYVBvc2l0aW9uLnkgPSBNYXRoLnJvdW5kKHRoaXMuY2FtZXJhUG9zaXRpb24ueSk7XG4gICAgICAgIHRoaXMuY2FtZXJhLmZvY3VzT25YWSh0aGlzLmNhbWVyYVBvc2l0aW9uLngsIHRoaXMuY2FtZXJhUG9zaXRpb24ueSk7XG4gICAgfVxufSIsImltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUsIElDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzL09ic2VydmFibGUnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdlbmVyaWNIaWdobGlnaHRlZFRoaW5nIHtcblxuICAgIHByaXZhdGUgb25DaGFuZ2VPYnNlcnZhYmxlOiBPYnNlcnZhYmxlO1xuICAgIHByaXZhdGUgaGlnaGxpZ2h0ZWRUaGluZzogVGhpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQ1VSU09SX09WRVJfVEhJTkcsXG4gICAgICAgICAgICB0aGluZyA9PiB0aGlzLm9uQ3Vyc29yT3ZlclRoaW5nKHRoaW5nKVxuICAgICAgICApO1xuXG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oXG4gICAgICAgICAgICBBY3Rpb25zLkNVUlNPUl9PVVRfVEhJTkcsXG4gICAgICAgICAgICB0aGluZyA9PiB0aGlzLm9uQ3Vyc29yT3V0VGhpbmcodGhpbmcpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlT2JzZXJ2YWJsZS5yZWdpc3Rlck9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5oaWdobGlnaHRlZFRoaW5nKTtcbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZVRvQ2hhbmdlKGNhbGxiYWNrOiBJQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUucmVtb3ZlT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGdldCB0aGluZygpOiBUaGluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZ2hsaWdodGVkVGhpbmc7XG4gICAgfVxuXG4gICAgc2V0IHRoaW5nKG5ld1RoaW5nOiBUaGluZykge1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nKG5ld1RoaW5nKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaGlnaGxpZ2h0VGhpbmcobmV3VGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRUaGluZyA9IG5ld1RoaW5nO1xuICAgICAgICB0aGlzLm5vdGlmeVN1YnNjcmliZXJzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRUaGluZyhudWxsKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25DdXJzb3JPdmVyVGhpbmcodGhpbmc6IFRoaW5nKTogdm9pZCAge31cbiAgICBwcm90ZWN0ZWQgb25DdXJzb3JPdXRUaGluZyh0aGluZzogVGhpbmcpOiB2b2lkICB7fVxuXG4gICAgcHJpdmF0ZSBub3RpZnlTdWJzY3JpYmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUubm90aWZ5T2JzZXJ2ZXJzKHRoaXMuaGlnaGxpZ2h0ZWRUaGluZyk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlLCBJQ2FsbGJhY2sgfSBmcm9tICcuLi91dGlscy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5cbmV4cG9ydCBjbGFzcyBJbnZlbnRvcnkge1xuXG4gICAgcHJpdmF0ZSBjaGFuZ2VPYnNlcnZhYmxlIDogT2JzZXJ2YWJsZTtcbiAgICBpdGVtczogU2V0PFRoaW5nPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNoYW5nZU9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLml0ZW1zID0gbmV3IFNldCgpO1xuICAgIH1cblxuICAgIHN1YnNjcmliZVRvQ2hhbmdlKGNhbGxiYWNrOiBJQ2FsbGJhY2spIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5yZWdpc3Rlck9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZVRvQ2hhbmdlKGNhbGxiYWNrOiBJQ2FsbGJhY2spIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5yZW1vdmVPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgYWRkKGl0ZW06IFRoaW5nKSB7XG4gICAgICAgIGl0ZW0uc3RhdGUuc2V0KCdJU19JTl9JTlZFTlRPUlknLCB0cnVlKTtcbiAgICAgICAgdGhpcy5pdGVtcy5hZGQoaXRlbSk7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnModGhpcyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGl0ZW06IFRoaW5nKSB7XG4gICAgICAgIHRoaXMuaXRlbXMuZGVsZXRlKGl0ZW0pO1xuICAgICAgICB0aGlzLmNoYW5nZU9ic2VydmFibGUubm90aWZ5T2JzZXJ2ZXJzKHRoaXMpO1xuICAgIH1cblxuICAgIGdldEJ5SWQoaWQ6IHN0cmluZyk6IFRoaW5nIHtcbiAgICAgICAgbGV0IGl0ZW1BcnJheSA9IEFycmF5LmZyb20odGhpcy5pdGVtcyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaXRlbUFycmF5W2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtQXJyYXlbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBTZWdtZW50IH0gZnJvbSAnLi4vdXRpbHMvU2VnbWVudCc7XG5pbXBvcnQgeyBTY2VuZUJvdW5kYXJpZXMgfSBmcm9tICcuL1NjZW5lQm91bmRhcmllcyc7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuXG5pbnRlcmZhY2UgSVBhdGhOb2RlT3B0aW9ucyB7XG4gICAgcG9pbnQ6IElQb2ludCxcbiAgICBmaW5hbE5vZGU/OiBCb29sZWFuXG59XG5cbmNsYXNzIFBhdGhOb2RlIHtcblxuICAgIGNvbm5lY3Rpb25zOiBBcnJheTxQYXRoTm9kZT47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9wdGlvbnM6IElQYXRoTm9kZU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucyA9IFtdO1xuICAgIH1cblxuICAgIGdldCBpZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnBvaW50LnggKyAnXycgKyB0aGlzLm9wdGlvbnMucG9pbnQueTtcbiAgICB9XG5cbiAgICBnZXQgcG9pbnQoKTogSVBvaW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wb2ludDtcbiAgICB9XG5cbiAgICBpc0ZpbmFsKCk6IEJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLm9wdGlvbnMuZmluYWxOb2RlO1xuICAgIH1cblxufVxuXG5jb25zdCBTSE9VTERfUEFJTlQgPSBmYWxzZTtcbmNvbnN0IENPTE9SID0gMHgwMDMzRkY7XG5jbGFzcyBQYXRoRmluZGVyUGFpbnRlciB7XG5cbiAgICBwcml2YXRlIHBhaW50ZWROb2RlczogTWFwPHN0cmluZywgQm9vbGVhbj47XG5cbiAgICBwYWludChmaXJzdE5vZGU6IFBhdGhOb2RlLCBkZXN0aW5hdGlvbjogSVBvaW50KTogdm9pZCB7XG4gICAgICAgIGlmKCFTSE9VTERfUEFJTlQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlbGV0ZUN1cnJlbnRHcmFwaGljcygpO1xuICAgICAgICB0aGlzLnBhaW50ZWROb2RlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5wYWludE5vZGVBbmRDb25uZWN0aW9ucyhmaXJzdE5vZGUpO1xuICAgICAgICBsZXQgcG9pbnQxID0gbmV3IFBoYXNlci5DaXJjbGUoZmlyc3ROb2RlLnBvaW50LngsIGZpcnN0Tm9kZS5wb2ludC55LCA0KTtcbiAgICAgICAgcGhhc2VyR2FtZS52YWx1ZS5kZWJ1Zy5nZW9tKHBvaW50MSwgJyMwMDAwZmYnKTtcbiAgICAgICAgbGV0IHBvaW50MiA9IG5ldyBQaGFzZXIuQ2lyY2xlKGRlc3RpbmF0aW9uLngsIGRlc3RpbmF0aW9uLnksIDQpO1xuICAgICAgICBwaGFzZXJHYW1lLnZhbHVlLmRlYnVnLmdlb20ocG9pbnQyLCAnIzAwZmYwMCcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsZXRlQ3VycmVudEdyYXBoaWNzKCk6IHZvaWQge1xuICAgICAgICBwaGFzZXJHYW1lLnZhbHVlLmRlYnVnLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhaW50Tm9kZUFuZENvbm5lY3Rpb25zKG5vZGU6IFBhdGhOb2RlKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMucGFpbnRlZE5vZGVzLmdldChub2RlLmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFpbnRlZE5vZGVzLnNldChub2RlLmlkLCB0cnVlKTtcbiAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBub2RlLmNvbm5lY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnBhaW50TGluZShub2RlLCBub2RlLmNvbm5lY3Rpb25zW2ldKVxuICAgICAgICAgICAgdGhpcy5wYWludE5vZGVBbmRDb25uZWN0aW9ucyhub2RlLmNvbm5lY3Rpb25zW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcGFpbnRMaW5lKG5vZGUxOiBQYXRoTm9kZSwgbm9kZTI6IFBhdGhOb2RlKSB7XG4gICAgICAgIGxldCBsaW5lID0gbmV3IFBoYXNlci5MaW5lKG5vZGUxLnBvaW50LngsIG5vZGUxLnBvaW50LnksIG5vZGUyLnBvaW50LngsIG5vZGUyLnBvaW50LnkpO1xuICAgICAgICBwaGFzZXJHYW1lLnZhbHVlLmRlYnVnLmdlb20obGluZSwgJyNmZjAwMDAnKTtcbiAgICB9XG59XG5cbmNvbnN0IHBhdGhGaW5kZXJQYWludGVyID0gbmV3IFBhdGhGaW5kZXJQYWludGVyKCk7XG5cblxuY2xhc3MgUGF0aEZpbmRlciB7XG5cbiAgICBnZXRQYXRoKG9yaWdpbjogSVBvaW50LCBkZXN0aW5hdGlvbjogSVBvaW50LCBib3VuZGFyaWVzOiBTY2VuZUJvdW5kYXJpZXMpOiBBcnJheTxJUG9pbnQ+IHtcbiAgICAgICAgdmFyIGluc2lkZU9yaWdpbiA9IGJvdW5kYXJpZXMuZ2V0UG9zaXRpb25JbnNpZGUob3JpZ2luKTtcbiAgICAgICAgdmFyIGluc2lkZURlc3RpbmF0aW9uID0gYm91bmRhcmllcy5nZXRQb3NpdGlvbkluc2lkZShkZXN0aW5hdGlvbik7XG5cbiAgICAgICAgaWYoYm91bmRhcmllcy5wb2x5Z29uLnBvaW50c0NhblNlZUVhY2hPdGhlcihpbnNpZGVPcmlnaW4sIGluc2lkZURlc3RpbmF0aW9uKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtpbnNpZGVPcmlnaW4sIGluc2lkZURlc3RpbmF0aW9uXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29uY2F2ZVZlcnRleCA9IGJvdW5kYXJpZXMucG9seWdvbi5nZXRDb25jYXZlVmVydGV4KCk7XG4gICAgICAgIGxldCBncmFwaCA9IHRoaXMuZ2V0R3JhcGhUb1NvbHZlKGluc2lkZU9yaWdpbiwgZGVzdGluYXRpb24sIGNvbmNhdmVWZXJ0ZXgsIGJvdW5kYXJpZXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmdldFNvbHV0aW9uVG9HcmFwaChncmFwaCwgZGVzdGluYXRpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0R3JhcGhUb1NvbHZlKG9yaWdpbjogSVBvaW50LCBkZXN0aW5hdGlvbjogSVBvaW50LCBvdGhlclZlcnRleDogQXJyYXk8SVBvaW50PiwgYm91bmRhcmllczogU2NlbmVCb3VuZGFyaWVzKTogUGF0aE5vZGUge1xuICAgICAgICBsZXQgaW5pdGlhbE5vZGUgPSBuZXcgUGF0aE5vZGUoe1xuICAgICAgICAgICAgcG9pbnQ6IG9yaWdpblxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGZpbmFsTm9kZSA9IG5ldyBQYXRoTm9kZSh7XG4gICAgICAgICAgICBwb2ludDogZGVzdGluYXRpb24sXG4gICAgICAgICAgICBmaW5hbE5vZGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBhbGxOb2RlcyA9IFtpbml0aWFsTm9kZSwgZmluYWxOb2RlXTtcbiAgICAgICAgb3RoZXJWZXJ0ZXguZm9yRWFjaCgodmVydGV4KSA9PiB7XG4gICAgICAgICAgICBhbGxOb2Rlcy5wdXNoKG5ldyBQYXRoTm9kZSh7XG4gICAgICAgICAgICAgICAgcG9pbnQ6IHZlcnRleFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KVxuXG4gICAgICAgIGZvcihsZXQgaT0wOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IGkgKyAxOyBqIDwgYWxsTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZihib3VuZGFyaWVzLnBvbHlnb24ucG9pbnRzQ2FuU2VlRWFjaE90aGVyKGFsbE5vZGVzW2ldLnBvaW50LCBhbGxOb2Rlc1tqXS5wb2ludCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsTm9kZXNbaV0uY29ubmVjdGlvbnMucHVzaChhbGxOb2Rlc1tqXSk7XG4gICAgICAgICAgICAgICAgICAgIGFsbE5vZGVzW2pdLmNvbm5lY3Rpb25zLnB1c2goYWxsTm9kZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbml0aWFsTm9kZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhldXJpc3RpY0Nvc3QocG9pbnQ6IElQb2ludCwgZGVzdGluYXRpb246IElQb2ludCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAobmV3IFNlZ21lbnQocG9pbnQsIGRlc3RpbmF0aW9uKSkubGVuZ3RoO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVhbENvc3QocG9pbnQ6IElQb2ludCwgZGVzdGluYXRpb246IElQb2ludCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAobmV3IFNlZ21lbnQocG9pbnQsIGRlc3RpbmF0aW9uKSkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQSpfc2VhcmNoX2FsZ29yaXRobSNBbGdvcml0aG1fZGVzY3JpcHRpb25cbiAgICBwcml2YXRlIGdldFNvbHV0aW9uVG9HcmFwaChmaXJzdE5vZGU6IFBhdGhOb2RlLCBkZXN0aW5hdGlvbjogSVBvaW50KTogQXJyYXk8SVBvaW50PiB7XG4gICAgICAgIHBhdGhGaW5kZXJQYWludGVyLnBhaW50KGZpcnN0Tm9kZSwgZGVzdGluYXRpb24pO1xuICAgICAgICBsZXQgY2xvc2VkU2V0OiBTZXQ8UGF0aE5vZGU+ID0gbmV3IFNldCgpO1xuICAgICAgICBsZXQgb3BlblNldDogU2V0PFBhdGhOb2RlPiA9IG5ldyBTZXQoKTtcbiAgICAgICAgb3BlblNldC5hZGQoZmlyc3ROb2RlKTtcblxuICAgICAgICAvLyBGb3IgZWFjaCBub2RlLCB3aGljaCBub2RlIGl0IGNhbiBtb3N0IGVmZmljaWVudGx5IGJlIHJlYWNoZWQgZnJvbS5cbiAgICAgICAgLy8gSWYgYSBub2RlIGNhbiBiZSByZWFjaGVkIGZyb20gbWFueSBub2RlcywgY2FtZUZyb20gd2lsbCBldmVudHVhbGx5IGNvbnRhaW4gdGhlXG4gICAgICAgIC8vIG1vc3QgZWZmaWNpZW50IHByZXZpb3VzIHN0ZXAuXG4gICAgICAgIGxldCBjYW1lRnJvbTogTWFwPFBhdGhOb2RlLCBQYXRoTm9kZT4gPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgLy8gRm9yIGVhY2ggbm9kZSwgdGhlIGNvc3Qgb2YgZ2V0dGluZyBmcm9tIHRoZSBzdGFydCBub2RlIHRvIHRoYXQgbm9kZS5cbiAgICAgICAgbGV0IGdTY29yZTogTWFwPFBhdGhOb2RlLCBudW1iZXI+ID0gbmV3IE1hcDsgLy8gZGVmYXVsdCB2YWx1ZSBvZiBJbmZpbml0eVxuICAgICAgICBnU2NvcmUuc2V0KGZpcnN0Tm9kZSwgMCk7IC8vIFRoZSBjb3N0IG9mIGdvaW5nIGZyb20gc3RhcnQgdG8gc3RhcnQgaXMgemVyby5cblxuICAgICAgICAvLyBGb3IgZWFjaCBub2RlLCB0aGUgdG90YWwgY29zdCBvZiBnZXR0aW5nIGZyb20gdGhlIHN0YXJ0IG5vZGUgdG8gdGhlIGdvYWxcbiAgICAgICAgLy8gYnkgcGFzc2luZyBieSB0aGF0IG5vZGUuIFRoYXQgdmFsdWUgaXMgcGFydGx5IGtub3duLCBwYXJ0bHkgaGV1cmlzdGljLlxuICAgICAgICBsZXQgZlNjb3JlOiBNYXA8UGF0aE5vZGUsIG51bWJlcj4gPSBuZXcgTWFwOyAvLyBkZWZhdWx0IHZhbHVlIG9mIEluZmluaXR5XG4gICAgICAgIGZTY29yZS5zZXQoZmlyc3ROb2RlLCB0aGlzLmhldXJpc3RpY0Nvc3QoZmlyc3ROb2RlLnBvaW50LCBkZXN0aW5hdGlvbikpO1xuXG4gICAgICAgIHdoaWxlKG9wZW5TZXQuc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50OiBQYXRoTm9kZSA9IHRoaXMuZmluZExvd2VzdFNjb3JlKGZTY29yZSwgb3BlblNldCk7XG4gICAgICAgICAgICBpZihjdXJyZW50LmlzRmluYWwoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlY29uc3RydWN0UGF0aChjYW1lRnJvbSwgY3VycmVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9wZW5TZXQuZGVsZXRlKGN1cnJlbnQpO1xuICAgICAgICAgICAgY2xvc2VkU2V0LmFkZChjdXJyZW50KTtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjdXJyZW50LmNvbm5lY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5laWdoYm9yID0gY3VycmVudC5jb25uZWN0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICBpZihjbG9zZWRTZXQuaGFzKG5laWdoYm9yKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHRlbnRhdGl2ZUdTY29yZSA9IHRoaXMuZ2V0R1Njb3JlKGdTY29yZSwgY3VycmVudCkgKyB0aGlzLnJlYWxDb3N0KGN1cnJlbnQucG9pbnQsIG5laWdoYm9yLnBvaW50KTtcbiAgICAgICAgICAgICAgICBpZighb3BlblNldC5oYXMobmVpZ2hib3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5TZXQuYWRkKG5laWdoYm9yKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYodGVudGF0aXZlR1Njb3JlID49IHRoaXMuZ2V0R1Njb3JlKGdTY29yZSwgbmVpZ2hib3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBUaGlzIGlzIG5vdCBhIGJldHRlciBwYXRoLlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBUaGlzIHBhdGggaXMgdGhlIGJlc3QgdW50aWwgbm93LiBSZWNvcmQgaXQhXG4gICAgICAgICAgICAgICAgY2FtZUZyb20uc2V0KG5laWdoYm9yLCBjdXJyZW50KTtcbiAgICAgICAgICAgICAgICBnU2NvcmUuc2V0KG5laWdoYm9yLCB0ZW50YXRpdmVHU2NvcmUpO1xuICAgICAgICAgICAgICAgIGxldCBuZXdGU2NvcmUgPSB0aGlzLmdldEdTY29yZShnU2NvcmUsIG5laWdoYm9yKSArIHRoaXMuaGV1cmlzdGljQ29zdChuZWlnaGJvci5wb2ludCwgZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgICAgIGZTY29yZS5zZXQobmVpZ2hib3IsIG5ld0ZTY29yZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgJ0VSUk9SLCBjb3VsZCBub3QgZmluZCBhIHBhdGgnO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0R1Njb3JlKGdTY29yZTogTWFwPFBhdGhOb2RlLCBudW1iZXI+LCBub2RlOiBQYXRoTm9kZSk6IG51bWJlciB7XG4gICAgICAgIGlmKGdTY29yZS5oYXMobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBnU2NvcmUuZ2V0KG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kTG93ZXN0U2NvcmUoc2NvcmVzOiBNYXA8UGF0aE5vZGUsIG51bWJlcj4sIG9wZW5TZXQ6IFNldDxQYXRoTm9kZT4pIHtcbiAgICAgICAgbGV0IGxvd2VzdFNjb3JlOiBudW1iZXIsIGxvd2VzdE5vZGU6IFBhdGhOb2RlO1xuICAgICAgICBsZXQgYWxyZWFkeUhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgIHNjb3Jlcy5mb3JFYWNoKCh2YWx1ZSwgbm9kZSkgPT4ge1xuICAgICAgICAgICAgaWYob3BlblNldC5oYXMobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBpZighYWxyZWFkeUhhc1ZhbHVlIHx8ICh2YWx1ZSA8IGxvd2VzdFNjb3JlKSkge1xuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5SGFzVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBsb3dlc3RTY29yZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBsb3dlc3ROb2RlID0gbm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBsb3dlc3ROb2RlO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVjb25zdHJ1Y3RQYXRoKGNhbWVGcm9tOiBNYXA8UGF0aE5vZGUsIFBhdGhOb2RlPiwgY3VycmVudDogUGF0aE5vZGUpOiBBcnJheTxJUG9pbnQ+IHtcbiAgICAgICAgbGV0IHRvdGFsUGF0aCA9IFtjdXJyZW50LnBvaW50XTtcblxuICAgICAgICB3aGlsZShjYW1lRnJvbS5oYXMoY3VycmVudCkpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjYW1lRnJvbS5nZXQoY3VycmVudCk7XG4gICAgICAgICAgICB0b3RhbFBhdGgucHVzaChjdXJyZW50LnBvaW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0b3RhbFBhdGgucmV2ZXJzZSgpO1xuICAgIH1cblxufVxuXG5leHBvcnQgY29uc3QgcGF0aEZpbmRlciA9IG5ldyBQYXRoRmluZGVyKCk7XG4iLCJpbXBvcnQgeyBJbnZlbnRvcnkgfSBmcm9tICcuL0ludmVudG9yeSc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyTW92ZW1lbnRIYW5kbGVyIH0gZnJvbSAnLi9QbGF5ZXJNb3ZlbWVudEhhbmRsZXInO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuLi91aS9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgSVBvaW50LCBJU3ByaXRlSW5mbyB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgRGlyZWN0aW9ucywgZ2V0RGlyZWN0aW9uTmFtZSB9IGZyb20gJy4uL3V0aWxzL0RpcmVjdGlvbnMnO1xuaW1wb3J0IHsgU3BlZWNoQnViYmxlIH0gZnJvbSAnLi4vdWkvU3BlZWNoQnViYmxlJztcblxuaW50ZXJmYWNlIElQbGF5ZXJPcHRpb25zIHtcbiAgICBzcHJpdGVJZDogc3RyaW5nLFxuICAgIGluaXRpYWxYOiBudW1iZXIsXG4gICAgaW5pdGlhbFk6IG51bWJlcixcbiAgICB4U3BlZWQ6IG51bWJlciwgLy9weC9zXG4gICAgeVNwZWVkOiBudW1iZXIsIC8vcHgvc1xuICAgIGFuaW1hdGlvblNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlT3B0aW9uczogTWFwPHN0cmluZywgSVNwcml0ZUluZm8+O1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGxheWVyIHtcblxuICAgIGludmVudG9yeTogSW52ZW50b3J5O1xuXG4gICAgcHJpdmF0ZSBfc3ByaXRlOiBQaGFzZXIuU3ByaXRlO1xuICAgIHByaXZhdGUgX2RpcmVjdGlvbjogRGlyZWN0aW9ucztcbiAgICBwcml2YXRlIHNwZWVjaEJ1YmJsZTogU3BlZWNoQnViYmxlO1xuICAgIHByaXZhdGUgX3N0YXRlOiBNYXA8c3RyaW5nLCBhbnk+O1xuICAgIHByaXZhdGUgbW92ZW1lbnRIYW5kbGVyOiBQbGF5ZXJNb3ZlbWVudEhhbmRsZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9wdGlvbnMgOiBJUGxheWVyT3B0aW9ucykge1xuICAgICAgICB0aGlzLmludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoKTtcbiAgICAgICAgdGhpcy5tb3ZlbWVudEhhbmRsZXIgPSBuZXcgUGxheWVyTW92ZW1lbnRIYW5kbGVyKHRoaXMpO1xuICAgICAgICB0aGlzLmNyZWF0ZVNwcml0ZSgpO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERpcmVjdGlvbnMuUklHSFQ7XG4gICAgICAgIHRoaXMucGxheVN0YW5kQW5pbWF0aW9uKCk7XG4gICAgICAgIHRoaXMuc3BlZWNoQnViYmxlID0gbmV3IFNwZWVjaEJ1YmJsZSh7XG4gICAgICAgICAgICBvd25lcjogdGhpc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgbW92ZVRvKGRlc3RpbmF0aW9uOiBJUG9pbnQpOiBQcm9taXNlPHt9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVtZW50SGFuZGxlci5tb3ZlVG8oZGVzdGluYXRpb24pO1xuICAgIH1cblxuICAgIGdldCBzcHJpdGUoKTogUGhhc2VyLlNwcml0ZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcHJpdGU7XG4gICAgfVxuXG4gICAgZ2V0IHNwZWVkKCk6IElQb2ludCB7XG4gICAgICAgIGxldCBzcGVlZCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMub3B0aW9ucy54U3BlZWQsXG4gICAgICAgICAgICB5OiB0aGlzLm9wdGlvbnMueVNwZWVkLFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcGVlZDtcbiAgICB9XG5cbiAgICBnZXQgZGlyZWN0aW9uKCk6IERpcmVjdGlvbnMge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlyZWN0aW9uO1xuICAgIH1cblxuICAgIHNldCBkaXJlY3Rpb24obmV3RGlyZWN0aW9uOiBEaXJlY3Rpb25zKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IG5ld0RpcmVjdGlvbjtcbiAgICB9XG5cbiAgICBnZXQgcG9zaXRpb24oKTogSVBvaW50IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMuX3Nwcml0ZS54LFxuICAgICAgICAgICAgeTogdGhpcy5fc3ByaXRlLnlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnb1RvVGhpbmcodGhpbmc6IFRoaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVUbyh0aGluZy5nZXRQb3NpdGlvblRvR29UbygpKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpcmVjdGlvbiA9IHRoaW5nLmdldERpcmVjdGlvblRvTG9vaygpO1xuICAgICAgICAgICAgICAgICAgICBpZihkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9va0F0KGRpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb29rQXQoZGlyZWN0aW9uOiBEaXJlY3Rpb25zKSB7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICB0aGlzLnBsYXlTdGFuZEFuaW1hdGlvbigpO1xuICAgIH1cblxuICAgIHNheSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5wbGF5VGFsa2luZ0FuaW1hdGlvbigpO1xuICAgICAgICByZXR1cm4gdGhpcy5zcGVlY2hCdWJibGUuc2F5KHRleHQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdG9wVGFsa2luZ0FuaW1hdGlvbigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB3YWl0KHRpbWVNcyA9IDEwMDApOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgZGVmZXJyZWQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZUNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0sIHRpbWVNcyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQ7XG4gICAgfVxuXG4gICAgZ2V0UG9zaXRpb25PblRvcCgpOiBJUG9pbnR7XG4gICAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnNwcml0ZS54LFxuICAgICAgICAgICAgeTogTWF0aC5yb3VuZCh0aGlzLnNwcml0ZS5nZXRCb3VuZHMoKS55KSAtIDEwXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgYWRkT2JqZWN0VG9JbnZlbnRvcnkodGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW52ZW50b3J5LmFkZCh0aGluZyk7XG4gICAgfVxuXG4gICAgdGVsZXBvcnRUbyhkZXN0aW5hdGlvbjogSVBvaW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMubW92ZW1lbnRIYW5kbGVyLm1vdmVUb1dpdGhvdXRBbmltYXRpb24oZGVzdGluYXRpb24pO1xuICAgIH1cblxuICAgIGdldCBzdGF0ZSgpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgIH1cblxuICAgIHNldCBzdGF0ZShuZXdTdGF0ZTogTWFwPHN0cmluZywgYW55Pil7XG4gICAgICAgIGlmIChuZXdTdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgICAgIHRoaXMub25TdGF0ZUNoYW5nZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hhbmdlQXR0cihhdHRyTmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX3N0YXRlLnNldChhdHRyTmFtZSwgdmFsdWUpO1xuICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBnZXRBdHRyKGF0dHJOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlLmdldChhdHRyTmFtZSk7XG4gICAgfVxuXG4gICAgcGxheVdhbGtpbmdBbmltYXRpb24oKTogdm9pZCB7XG4gICAgICAgIGxldCBkaXJlY3Rpb25OYW1lID0gZ2V0RGlyZWN0aW9uTmFtZSh0aGlzLmRpcmVjdGlvbik7XG4gICAgICAgIGxldCBzcHJpdGVTdGF0ZSA9ICd3YWxrXycgKyBkaXJlY3Rpb25OYW1lO1xuICAgICAgICB0aGlzLl9zcHJpdGUuYW5pbWF0aW9ucy5wbGF5KHNwcml0ZVN0YXRlKTtcbiAgICAgICAgdGhpcy5mbGlwWElmTmVlZGVkKHNwcml0ZVN0YXRlKTtcbiAgICB9XG5cbiAgICBwbGF5U3RhbmRBbmltYXRpb24oKTogdm9pZCB7XG4gICAgICAgIGxldCBkaXJlY3Rpb25OYW1lID0gZ2V0RGlyZWN0aW9uTmFtZSh0aGlzLmRpcmVjdGlvbik7XG4gICAgICAgIGxldCBzcHJpdGVTdGF0ZSA9ICdzdGFuZF8nICsgZGlyZWN0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5fc3ByaXRlLmFuaW1hdGlvbnMucGxheShzcHJpdGVTdGF0ZSk7XG4gICAgICAgIHRoaXMuZmxpcFhJZk5lZWRlZChzcHJpdGVTdGF0ZSk7XG4gICAgfVxuXG4gICAgcGxheUFuaW1hdGlvbk9uY2UoYW5pbWF0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZih0aGlzLm9wdGlvbnMuc3ByaXRlT3B0aW9ucy5oYXMoYW5pbWF0aW9uTmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS5hbmltYXRpb25zLnBsYXkoYW5pbWF0aW9uTmFtZSwgbnVsbCwgZmFsc2UpOyAvL0ZhbHNlIHNvIGl0IGRvZXMgbm90IGxvb3BcbiAgICAgICAgICAgICAgICBpZih0aGlzLnNwcml0ZS5hbmltYXRpb25zLmN1cnJlbnRBbmltICYmIHRoaXMuc3ByaXRlLmFuaW1hdGlvbnMuY3VycmVudEFuaW0ub25Db21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS5hbmltYXRpb25zLmN1cnJlbnRBbmltLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICB1cGRhdGVPblR3ZWVuTW92ZSgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5zcGVlY2hCdWJibGUuaXNTaG93bigpKSB7XG4gICAgICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZS51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RvcEFuaW1hdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGxheVN0YW5kQW5pbWF0aW9uKCk7XG4gICAgICAgIHRoaXMuX3Nwcml0ZS5hbmltYXRpb25zLnN0b3AoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXJlY3Rpb24oZGVzdGluYXRpb246IElQb2ludCk6IHZvaWQge1xuICAgICAgICBsZXQgYW5nbGVCZXR3ZWVuID0gdGhpcy5nZXRBbmdsZVRvRGVzaXJlZFBvc2l0aW9uKGRlc3RpbmF0aW9uKTtcbiAgICAgICAgbGV0IGFuZ2xlRGVncmVlcyA9IChhbmdsZUJldHdlZW4gKiAxODAgLyBNYXRoLlBJKTtcblxuICAgICAgICBpZiAoKGFuZ2xlRGVncmVlcyA+PSAtNDUpICYmIChhbmdsZURlZ3JlZXMgPD0gNDUpKSB7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERpcmVjdGlvbnMuTEVGVDtcbiAgICAgICAgfSBlbHNlIGlmICgoYW5nbGVEZWdyZWVzID49IDQ1KSAmJiAoYW5nbGVEZWdyZWVzIDw9IDEzNSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9ucy5VUDtcbiAgICAgICAgfSBlbHNlIGlmICgoYW5nbGVEZWdyZWVzID49IC0xMzUpICYmIChhbmdsZURlZ3JlZXMgPD0gLTQ1KSkge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBEaXJlY3Rpb25zLkRPV047XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERpcmVjdGlvbnMuUklHSFQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRBbmdsZVRvRGVzaXJlZFBvc2l0aW9uKGRlc3RpbmF0aW9uOiBJUG9pbnQpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnNwcml0ZS55IC0gZGVzdGluYXRpb24ueSxcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnggLSBkZXN0aW5hdGlvbi54KTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCByZWZsZWN0KCk6IHZvaWRcblxuICAgIC8vVGhpcyBtZXRob2QgY2FuIGJlIG92ZXJ3cml0dGVuIGluIGNoaWxkIGNsYXNzZXNcbiAgICBwcm90ZWN0ZWQgb25TdGF0ZUNoYW5nZSgpIHt9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNwcml0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fc3ByaXRlID0gdWlMYXllcnMucGxheWVyLmNyZWF0ZShcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5pbml0aWFsWCxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5pbml0aWFsWSxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zcHJpdGVJZFxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9zcHJpdGUuYW5jaG9yLnNldFRvKDAuNSwgMC45OSk7XG4gICAgICAgIHVpTGF5ZXJzLnBsYXllci5zb3J0KCd6JywgUGhhc2VyLkdyb3VwLlNPUlRfQVNDRU5ESU5HKTtcbiAgICAgICAgdGhpcy5hZGRTcHJpdGVBbmltYXRpb25zKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRTcHJpdGVBbmltYXRpb25zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc3ByaXRlT3B0aW9ucy5mb3JFYWNoKCAoc3ByaXRlUG9zaXRpb24sIGtleSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc3ByaXRlLmFuaW1hdGlvbnMuYWRkKGtleSwgc3ByaXRlUG9zaXRpb24uZnJhbWVzLCB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBsYXlUYWxraW5nQW5pbWF0aW9uKCk6IHZvaWQge1xuICAgICAgICBsZXQgZGlyZWN0aW9uTmFtZSA9IGdldERpcmVjdGlvbk5hbWUodGhpcy5kaXJlY3Rpb24pO1xuICAgICAgICBsZXQgc3ByaXRlU3RhdGUgPSAndGFsa18nICsgZGlyZWN0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5fc3ByaXRlLmFuaW1hdGlvbnMucGxheShzcHJpdGVTdGF0ZSk7XG4gICAgICAgIHRoaXMuZmxpcFhJZk5lZWRlZChzcHJpdGVTdGF0ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdG9wVGFsa2luZ0FuaW1hdGlvbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX3Nwcml0ZS5hbmltYXRpb25zICYmXG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUuYW5pbWF0aW9ucy5uYW1lICYmXG4gICAgICAgICAgICAodGhpcy5fc3ByaXRlLmFuaW1hdGlvbnMubmFtZS5pbmRleE9mKCd0YWxrJykgPT09IDApKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BBbmltYXRpb25zKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZsaXBYSWZOZWVkZWQoc3ByaXRlU3RhdGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsZXQgc3ByaXRlU3RhdGVPcHRpb25zID0gdGhpcy5vcHRpb25zLnNwcml0ZU9wdGlvbnMuZ2V0KHNwcml0ZVN0YXRlKTtcbiAgICAgICAgaWYgKHNwcml0ZVN0YXRlT3B0aW9ucyAmJiBzcHJpdGVTdGF0ZU9wdGlvbnMuaW52ZXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fc3ByaXRlLnNjYWxlLnggPSAtMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Nwcml0ZS5zY2FsZS54ID0gMTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHsgSVBvaW50LCBJVGltZW91dFdpdGhQcm9taXNlIH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgRGlyZWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0RpcmVjdGlvbnMnO1xuaW1wb3J0IHsgc2NlbmVzIH0gZnJvbSAnLi4vc3RhdGUvU2NlbmVzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBwYXRoRmluZGVyIH0gZnJvbSAnLi9QYXRoRmluZGVyJztcblxuXG5jbGFzcyBTaW5nbGVNb3ZlIHtcblxuICAgIHByaXZhdGUgdHdlZW46IFBoYXNlci5Ud2VlbjtcbiAgICBwcml2YXRlIHdpbGxNb3ZlUHJvbWlzZTogSVRpbWVvdXRXaXRoUHJvbWlzZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGxheWVyOiBQbGF5ZXIsIHByaXZhdGUgZGVzdGluYXRpb246IElQb2ludCkge1xuICAgICAgICBsZXQgdGltZVRvQW5pbWF0ZSA9IHRoaXMuZ2V0VGltZUZvckFuaW1hdGlvbihkZXN0aW5hdGlvbik7XG5cbiAgICAgICAgaWYgKHRpbWVUb0FuaW1hdGUpIHtcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnVwZGF0ZURpcmVjdGlvbihkZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB0aGlzLnBsYXllci5wbGF5V2Fsa2luZ0FuaW1hdGlvbigpO1xuICAgICAgICAgICAgdGhpcy50d2VlbiA9IHBoYXNlckdhbWUudmFsdWUuYWRkLnR3ZWVuKHRoaXMucGxheWVyLnNwcml0ZSk7XG4gICAgICAgICAgICB0aGlzLnR3ZWVuLnRvKHsgeDogZGVzdGluYXRpb24ueCwgeTogZGVzdGluYXRpb24ueSB9LCB0aW1lVG9BbmltYXRlLCAnTGluZWFyJywgdHJ1ZSwgMCk7XG4gICAgICAgICAgICB0aGlzLnR3ZWVuLm9uVXBkYXRlQ2FsbGJhY2sodGhpcy5wbGF5ZXIudXBkYXRlT25Ud2Vlbk1vdmUsIHRoaXMucGxheWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud2lsbE1vdmVQcm9taXNlID0gdGhpcy5jcmVhdGVNb3ZlUHJvbWlzZSh0aW1lVG9BbmltYXRlKTtcbiAgICB9XG5cbiAgICB3aGVuRmluaXNoZWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLndpbGxNb3ZlUHJvbWlzZS5wcm9taXNlO1xuICAgIH1cblxuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5jYW5jZWxDdXJyZW50VHdlZW4oKTtcbiAgICAgICAgdGhpcy5jYW5jZWxDdXJyZW50TW92ZVByb21pc2UoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZU1vdmVQcm9taXNlKHRpbWVUb01vdmU6IG51bWJlciA9IDApOiBJVGltZW91dFdpdGhQcm9taXNlIHtcbiAgICAgICAgdmFyIHJlc3VsdDogSVRpbWVvdXRXaXRoUHJvbWlzZSA9IHtcbiAgICAgICAgICAgIHRpbWVvdXRJZDogbnVsbCxcbiAgICAgICAgICAgIHByb21pc2U6IG51bGwsXG4gICAgICAgICAgICByZXNvbHZlQ2FsbGJhY2s6IG51bGwsXG4gICAgICAgICAgICByZWplY3RDYWxsYmFjazogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC50aW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dChcbiAgICAgICAgICAgICgpID0+IHRoaXMucmVzb2x2ZU1vdmVQcm9taXNlKCksXG4gICAgICAgICAgICB0aW1lVG9Nb3ZlKTtcblxuICAgICAgICByZXN1bHQucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHJlc3VsdC5yZXNvbHZlQ2FsbGJhY2sgPSByZXNvbHZlO1xuICAgICAgICAgICAgcmVzdWx0LnJlamVjdENhbGxiYWNrID0gcmVqZWN0O1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzb2x2ZU1vdmVQcm9taXNlKCkge1xuICAgICAgICBpZiAodGhpcy53aWxsTW92ZVByb21pc2UpIHtcbiAgICAgICAgICAgIHRoaXMud2lsbE1vdmVQcm9taXNlLnJlc29sdmVDYWxsYmFjaygpO1xuICAgICAgICAgICAgdGhpcy53aWxsTW92ZVByb21pc2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYW5jZWxDdXJyZW50TW92ZVByb21pc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLndpbGxNb3ZlUHJvbWlzZSkge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLndpbGxNb3ZlUHJvbWlzZS50aW1lb3V0SWQpO1xuICAgICAgICAgICAgLy8gV2UgY291bGQgcmVqZWN0IHRoZSBwcm9taXNlIGxpa2UgdGhpcywgYnV0IHRoZXJlIGlzIG5vIG5lZWRcbiAgICAgICAgICAgIC8vIHRoaXMud2lsbE1vdmVQcm9taXNlLnJlamVjdENhbGxiYWNrKCk7XG4gICAgICAgICAgICB0aGlzLndpbGxNb3ZlUHJvbWlzZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbmNlbEN1cnJlbnRUd2VlbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudHdlZW4gJiYgdGhpcy50d2Vlbi5pc1J1bm5pbmcpIHtcbiAgICAgICAgICAgIHRoaXMudHdlZW4uc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy50d2Vlbi5vbkNvbXBsZXRlLnJlbW92ZUFsbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaW1lRm9yQW5pbWF0aW9uKGRlc3RpbmF0aW9uOiBJUG9pbnQpOiBudW1iZXIge1xuICAgICAgICBsZXQgYW5nbGVCZXR3ZWVuID0gdGhpcy5wbGF5ZXIuZ2V0QW5nbGVUb0Rlc2lyZWRQb3NpdGlvbihkZXN0aW5hdGlvbik7XG4gICAgICAgIGxldCBkaWZmMSA9IHRoaXMucGxheWVyLnNwcml0ZS54IC0gZGVzdGluYXRpb24ueDtcbiAgICAgICAgbGV0IGRpZmYyID0gdGhpcy5wbGF5ZXIuc3ByaXRlLnkgLSBkZXN0aW5hdGlvbi55O1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQoKGRpZmYxICogZGlmZjEpICsgKGRpZmYyICogZGlmZjIpKTtcbiAgICAgICAgbGV0IHNwZWVkRnJvbVggPSBNYXRoLmFicyhNYXRoLmNvcyhhbmdsZUJldHdlZW4pKSAqIGRpc3RhbmNlIC8gdGhpcy5wbGF5ZXIuc3BlZWQueDtcbiAgICAgICAgbGV0IHNwZWVkRnJvbVkgPSBNYXRoLmFicyhNYXRoLnNpbihhbmdsZUJldHdlZW4pKSAqIGRpc3RhbmNlIC8gdGhpcy5wbGF5ZXIuc3BlZWQueTtcblxuICAgICAgICByZXR1cm4gMTAwMCAqICgoc3BlZWRGcm9tWCArIHNwZWVkRnJvbVkpIC8gMik7XG4gICAgfVxuXG59XG5cblxuZXhwb3J0IGNsYXNzIFBsYXllck1vdmVtZW50SGFuZGxlciB7XG5cbiAgICBwcml2YXRlIGN1cnJlbnRQYXRoOiBBcnJheTxJUG9pbnQ+O1xuICAgIHByaXZhdGUgY3VycmVudFNpbmdsZU1vdmU6IFNpbmdsZU1vdmU7XG4gICAgcHJpdmF0ZSByZXNvbHZlUHJvbWlzZUNhbGxiYWNrOiAoKT0+dm9pZDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGxheWVyOiBQbGF5ZXIpIHt9XG5cbiAgICBtb3ZlVG8oZGVzdGluYXRpb246IElQb2ludCk6IFByb21pc2U8e30+IHtcblxuICAgICAgICB0aGlzLmNhbmNlbEN1cnJlbnRNb3ZlKCk7XG5cbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVQcm9taXNlQ2FsbGJhY2sgPSByZXNvbHZlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gcGF0aEZpbmRlci5nZXRQYXRoKHRoaXMucGxheWVyLnBvc2l0aW9uLCBkZXN0aW5hdGlvbiwgc2NlbmVzLmN1cnJlbnRTY2VuZS5ib3VuZGFyaWVzKTtcbiAgICAgICAgdGhpcy5nb1RvTmV4dFBvc2l0aW9uKCk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIGdvVG9OZXh0UG9zaXRpb24oKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudFBhdGggJiYgdGhpcy5jdXJyZW50UGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNpbmdsZU1vdmUgPSBuZXcgU2luZ2xlTW92ZSh0aGlzLnBsYXllciwgdGhpcy5jdXJyZW50UGF0aC5zaGlmdCgpKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNpbmdsZU1vdmUud2hlbkZpbmlzaGVkKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5nb1RvTmV4dFBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMucmVzb2x2ZVByb21pc2VDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnN0b3BBbmltYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlUHJvbWlzZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlVG9XaXRob3V0QW5pbWF0aW9uKGRlc3RpbmF0aW9uOiBJUG9pbnQpOiB2b2lkIHtcbiAgICAgICAgbGV0IHNhZmVQb3NpdGlvbiA9IHNjZW5lcy5jdXJyZW50U2NlbmUuYm91bmRhcmllcy5nZXRQb3NpdGlvbkluc2lkZShkZXN0aW5hdGlvbik7XG4gICAgICAgIHRoaXMucGxheWVyLnVwZGF0ZURpcmVjdGlvbihzYWZlUG9zaXRpb24pO1xuICAgICAgICB0aGlzLmNhbmNlbEN1cnJlbnRNb3ZlKCk7XG4gICAgICAgIHRoaXMucGxheWVyLnBsYXlTdGFuZEFuaW1hdGlvbigpO1xuICAgICAgICB0aGlzLnBsYXllci5zcHJpdGUueCA9IHNhZmVQb3NpdGlvbi54O1xuICAgICAgICB0aGlzLnBsYXllci5zcHJpdGUueSA9IHNhZmVQb3NpdGlvbi55O1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBjYW5jZWxDdXJyZW50TW92ZSgpIHtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50U2luZ2xlTW92ZSkge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcEFuaW1hdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNpbmdsZU1vdmUuY2FuY2VsKCk7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVQcm9taXNlQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuLi91aS9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgYWN0aW9uRGlzcGF0Y2hlciwgQWN0aW9ucyB9IGZyb20gJy4uL3V0aWxzL0FjdGlvbkRpc3BhdGNoZXInO1xuaW1wb3J0IHsgSVJlY3RhbmdsZSwgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQb2x5Z29uIH0gZnJvbSAnLi4vdXRpbHMvUG9seWdvbic7XG5pbXBvcnQgeyBTY2VuZUJvdW5kYXJpZXMgfSBmcm9tICcuL1NjZW5lQm91bmRhcmllcyc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHsgRG9vciB9IGZyb20gJy4vRG9vcic7XG5cblxuaW50ZXJmYWNlIElTY2VuZU9wdGlvbnMge1xuICAgIGlkOiBzdHJpbmcsXG4gICAgYmFja2dyb3VuZElkOiBzdHJpbmcsXG4gICAgYm91bmRhcmllc0NvbmZpZzogUG9seWdvbixcbiAgICB0aGluZ3M6IEFycmF5PFRoaW5nPlxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2NlbmUge1xuXG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kOiBQaGFzZXIuU3ByaXRlO1xuICAgIHByaXZhdGUgX2JvdW5kYXJpZXM6IFNjZW5lQm91bmRhcmllcztcbiAgICBwcml2YXRlIHRoaW5nczogU2V0PFRoaW5nPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogSVNjZW5lT3B0aW9ucykge1xuICAgICAgICB0aGlzLl9ib3VuZGFyaWVzID0gbmV3IFNjZW5lQm91bmRhcmllcyhvcHRpb25zLmJvdW5kYXJpZXNDb25maWcpO1xuICAgICAgICB0aGlzLmNyZWF0ZVRoaW5ncygpO1xuICAgIH1cblxuICAgIGdldCBpZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmlkO1xuICAgIH1cblxuICAgIGdldCBzY2VuZUJvdW5kcygpOiBJUmVjdGFuZ2xlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFja2dyb3VuZC5nZXRCb3VuZHMoKTtcbiAgICB9XG5cbiAgICBnZXQgYm91bmRhcmllcygpOiBTY2VuZUJvdW5kYXJpZXMge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRhcmllcztcbiAgICB9XG5cbiAgICBzaG93KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNyZWF0ZUJhY2tncm91bmQoKTtcbiAgICAgICAgdGhpcy50aGluZ3MuZm9yRWFjaCh0aGluZyA9PiB0aGluZy5zaG93KCkpO1xuICAgICAgICB0aGlzLl9ib3VuZGFyaWVzLnBhaW50KCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlT2JqZWN0KG9iamVjdFRvUmVtb3ZlOiBUaGluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnRoaW5ncy5kZWxldGUob2JqZWN0VG9SZW1vdmUpO1xuICAgICAgICBvYmplY3RUb1JlbW92ZS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgcGxheWVyQXJyaXZlc0F0RG9vcihwbGF5ZXI6IFBsYXllciwgZG9vcklkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgbGV0IGRvb3IgPSB0aGlzLmZpbmREb29yKGRvb3JJZCk7XG4gICAgICAgIGRvb3IuZm9yY2VPcGVuKCk7XG4gICAgICAgIHBsYXllci50ZWxlcG9ydFRvKGRvb3IuZ2V0UG9zaXRpb25Ub0dvVG8oKSk7XG4gICAgfVxuXG4gICAgZ2V0VGhpbmdCeUlkKHRoaW5nSWQ6IHN0cmluZyk6IFRoaW5nIHtcbiAgICAgICAgdmFyIGZvdW5kVGhpbmc6IFRoaW5nID0gbnVsbDtcbiAgICAgICAgdGhpcy50aGluZ3MuZm9yRWFjaCgodGhpbmcpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGluZy5pZCA9PT0gdGhpbmdJZCkge1xuICAgICAgICAgICAgICAgIGZvdW5kVGhpbmcgPSB0aGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmb3VuZFRoaW5nO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMudGhpbmdzLmZvckVhY2godGhpbmcgPT4gdGhpbmcuZGVzdHJveSgpKTtcbiAgICAgICAgdGhpcy5fYm91bmRhcmllcy51bnBhaW50KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCYWNrZ3JvdW5kKCkge1xuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSB1aUxheWVycy5iYWNrZ3JvdW5kLmNyZWF0ZSgwLCAwLCB0aGlzLm9wdGlvbnMuYmFja2dyb3VuZElkKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmFuY2hvci5zZXQoMCwgMCk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQuZXZlbnRzLm9uSW5wdXREb3duLmFkZCggKGRlc3Q6IGFueSwgZXY6IGFueSkgPT4ge1xuICAgICAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuQ0xJQ0tfU1RBR0UsIGV2KTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVRoaW5ncygpIHtcbiAgICAgICAgdGhpcy50aGluZ3MgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMub3B0aW9ucy50aGluZ3MuZm9yRWFjaCgodGhpbmcpID0+IHRoaXMudGhpbmdzLmFkZCh0aGluZykpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmluZERvb3IoZG9vcklkOiBzdHJpbmcpOiBEb29yIHtcbiAgICAgICAgZm9yIChsZXQgdGhpbmcgb2YgdGhpcy50aGluZ3MpIHtcbiAgICAgICAgICAgIGlmICh0aGluZy5pZCA9PT0gZG9vcklkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxEb29yPnRoaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93ICdFUlJPUjogY291bGQgbm90IGZpbmQgdGhlIHJlbGF0ZWQgZG9vci4nO1xuICAgIH1cblxufSIsImltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgUG9seWdvbiB9IGZyb20gJy4uL3V0aWxzL1BvbHlnb24nO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcblxuXG5jb25zdCBTSE9VTERfUEFJTlQgPSBmYWxzZTtcblxuZXhwb3J0IGNsYXNzIFNjZW5lQm91bmRhcmllcyB7XG5cbiAgICBwcml2YXRlIGdyYXBoaWNzOiBQaGFzZXIuR3JhcGhpY3M7XG4gICAgcHJpdmF0ZSBib3VuZGluZ0dyYXBoaWNzOiBQaGFzZXIuR3JhcGhpY3M7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogUG9seWdvbikge31cblxuICAgIGdldFBvc2l0aW9uSW5zaWRlKHBvaW50OiBJUG9pbnQpOiBJUG9pbnQge1xuICAgICAgICBpZih0aGlzLnBvbHlnb24uaXNQb2ludEluc2lkZShwb2ludCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwb2ludDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wb2x5Z29uLmdldENsb3Nlc3RQb2ludFRvKHBvaW50KTtcbiAgICB9XG5cbiAgICBnZXQgcG9seWdvbigpOiBQb2x5Z29uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICAgIH1cblxuICAgIHBhaW50KCk6IHZvaWQge1xuICAgICAgICBpZihTSE9VTERfUEFJTlQpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3MgPSB0aGlzLnBhaW50UG9seWdvbih0aGlzLmNvbmZpZywgMHhGRjMzMDAsIDB4ZmZkOTAwKTtcbiAgICAgICAgICAgIHRoaXMuYm91bmRpbmdHcmFwaGljcyA9IHRoaXMucGFpbnRQb2x5Z29uKHRoaXMuY29uZmlnLmdldENvbnZleEh1bGwoKSwgMHgwMDMzRkYsIDB4MDBkOWZmKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVucGFpbnQoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMuZ3JhcGhpY3MpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3MuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5ncmFwaGljcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYWludFBvbHlnb24ocG9seWdvbjogUG9seWdvbiwgZmlsbENvbG9yOiBudW1iZXIsIGxpbmVDb2xvcjogbnVtYmVyKTogUGhhc2VyLkdyYXBoaWNzIHtcbiAgICAgICAgbGV0IHBvaW50cyA9IHBvbHlnb24ucG9pbnRzO1xuICAgICAgICBsZXQgZ3JhcGhpY3MgPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC5ncmFwaGljcygwLCAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKGZpbGxDb2xvciwgMC41KTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDEsIGxpbmVDb2xvciwgMSk7XG4gICAgICAgIFxuICAgICAgICBncmFwaGljcy5tb3ZlVG8ocG9pbnRzWzBdLngsIHBvaW50c1swXS55KTtcblxuICAgICAgICBmb3IobGV0IGk9MTsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSk7XG4gICAgICAgIH1cbiAgICAgICAgZ3JhcGhpY3MuZW5kRmlsbCgpO1xuXG4gICAgICAgIHJldHVybiBncmFwaGljcztcbiAgICB9IFxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9teS10eXBpbmdzL2xpYi5lczYuZC50c1wiIC8+XG5pbXBvcnQgeyBJUG9pbnQsIElTcHJpdGVJbmZvIH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBEaXJlY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4uL3VpL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi9zdGF0ZS9BY3RpdmVJbnZlbnRvcnkuc2luZ2xldG9uJztcbmltcG9ydCB7IFZlcmJzIH0gZnJvbSAnLi4vc3RvcmVzL1ZlcmJzLnN0b3JlJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vdXRpbHMvUmFuZG9tVGV4dCc7XG5cblxuaW50ZXJmYWNlIElUaGluZ09wdGlvbnMge1xuICAgIGlkOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHg/OiBudW1iZXIsXG4gICAgeT86IG51bWJlcixcbiAgICBkaXJlY3RseUluSW52ZW50b3J5PzogQm9vbGVhbixcbiAgICBzcHJpdGVJZD86IHN0cmluZyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkPzogc3RyaW5nLFxuICAgIGdvVG9Qb3NpdGlvbj86IElQb2ludCxcbiAgICBpc0ZvcmVncm91bmQ/OiBCb29sZWFuLFxuICAgIHByZWZlcnJlZEFjdGlvbj86IFZlcmJzLFxuICAgIHByZWZlcnJlZEludmVudG9yeUFjdGlvbj8gOiBWZXJicyxcbiAgICBwaWNrYWJsZT86IEJvb2xlYW4sXG4gICAganVzdERlY29yYXRpb24/OiBCb29sZWFuLFxuICAgIGRpcmVjdGlvblRvTG9vaz86IERpcmVjdGlvbnMsXG4gICAgb3BhY2l0eT86IG51bWJlcixcbiAgICBzcHJpdGVPcHRpb25zPzogTWFwPHN0cmluZywgSVNwcml0ZUluZm8+LFxuICAgIGFuaW1hdGlvblNwZWVkPzogbnVtYmVyXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUaGluZyB7XG5cbiAgICBwcml2YXRlIF9zdGF0ZTogTWFwPHN0cmluZywgYW55PjtcbiAgICBwcm90ZWN0ZWQgc3ByaXRlOiBQaGFzZXIuU3ByaXRlO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIG9wdGlvbnM6IElUaGluZ09wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG5ldyBNYXAoKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRpcmVjdGx5SW5JbnZlbnRvcnkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9JbnZlbnRvcnkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3coKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3JlYXRlU3ByaXRlKCk7XG4gICAgICAgIHRoaXMub25TdGF0ZUNoYW5nZSgpO1xuICAgICAgICB0aGlzLmFwcGx5TW9kaWZpZXIoKTtcbiAgICAgICAgdGhpcy5hZGRTcHJpdGVBbmltYXRpb25zKCk7XG4gICAgfVxuXG4gICAgZ2V0IHN0YXRlKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gICAgfVxuXG4gICAgc2V0IHN0YXRlKG5ld1N0YXRlKSB7XG4gICAgICAgIGlmIChuZXdTdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgICAgIHRoaXMub25TdGF0ZUNoYW5nZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5uYW1lO1xuICAgIH1cblxuICAgIGdldCBpZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmlkO1xuICAgIH1cblxuICAgIGNoYW5nZUF0dHIoYXR0ck5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9zdGF0ZS5zZXQoYXR0ck5hbWUsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5vblN0YXRlQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgZ2V0QXR0cihhdHRyTmFtZTogc3RyaW5nKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlLmdldChhdHRyTmFtZSk7XG4gICAgfVxuXG4gICAgZ2V0UHJlZmVycmVkQWN0aW9uKCk6IFZlcmJzIHtcbiAgICAgICAgaWYodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucHJlZmVycmVkSW52ZW50b3J5QWN0aW9uIHx8IFZlcmJzLkxPT0s7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnByZWZlcnJlZEFjdGlvbiB8fCBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNJbkludmVudG9yeSgpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUgJiYgdGhpcy5zdGF0ZS5nZXQoJ0lTX0lOX0lOVkVOVE9SWScpO1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9uVG9Hb1RvKCk6IElQb2ludCB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZ29Ub1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmdvVG9Qb3NpdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgeDogdGhpcy5vcHRpb25zLngsXG4gICAgICAgICAgICAgICAgeTogdGhpcy5vcHRpb25zLnlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvbk9uVG9wKCk6IElQb2ludCB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnNwcml0ZS54LFxuICAgICAgICAgICAgeTogTWF0aC5yb3VuZCh0aGlzLnNwcml0ZS5nZXRCb3VuZHMoKS55KSAtIDEwXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZ2V0RGlyZWN0aW9uVG9Mb29rKCk6IERpcmVjdGlvbnMge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmRpcmVjdGlvblRvTG9vayB8fCBudWxsO1xuICAgIH1cblxuICAgIGFwcGx5QWN0aW9uKHZlcmI6IFZlcmJzLCBwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBzd2l0Y2ggKHZlcmIpIHtcblxuICAgICAgICBjYXNlIFZlcmJzLkdPX1RPOlxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ29Ub0FjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuVEFLRTpcbiAgICAgICAgICAgIHRoaXMudGFrZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuTE9PSzpcbiAgICAgICAgICAgIHRoaXMubG9va0FjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuT1BFTjpcbiAgICAgICAgICAgIHRoaXMub3BlbkFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuQ0xPU0U6XG4gICAgICAgICAgICB0aGlzLmNsb3NlQWN0aW9uKHBsYXllcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWZXJicy5QVVNIOlxuICAgICAgICAgICAgdGhpcy5wdXNoQWN0aW9uKHBsYXllcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWZXJicy5VU0U6XG4gICAgICAgICAgICB0aGlzLnVzZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVmVyYnMuU1BFQUs6XG4gICAgICAgICAgICB0aGlzLnNwZWFrQWN0aW9uKHBsYXllcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWZXJicy5HSVZFOlxuICAgICAgICAgICAgdGhpcy5naXZlQWN0aW9uKHBsYXllcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93ICdFUlJPUiwgdW5rbm93biBhY3Rpb24gJyArIHZlcmI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgaW52ZW50b3J5SW1hZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pbnZlbnRvcnlJbWFnZUlkIHx8IHRoaXMub3B0aW9ucy5zcHJpdGVJZDtcbiAgICB9XG5cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zcHJpdGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmlzSW5JbnZlbnRvcnkpIHtcbiAgICAgICAgICAgIGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKS5yZW1vdmUodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNZXRob2RzIHRoYXQgY2FuIGJlIG92ZXJ3cml0dGVuIGluIHN1YmNsYXNzZXNcbiAgICBnZXRGcmFtZUZvckludmVudG9yeSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwbGF5QW5pbWF0aW9uKGFuaW1hdGlvbk5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLm9wdGlvbnMuc3ByaXRlT3B0aW9ucy5oYXMoYW5pbWF0aW9uTmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmFuaW1hdGlvbnMucGxheShhbmltYXRpb25OYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93ICdFUlJPUjogdHJ5aW5nIHRvIHBsYXkgYW5pbWF0aW9uIHRoYXQgZG9lc25cXCd0IGV4aXN0JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBsYXlBbmltYXRpb25PbmNlKGFuaW1hdGlvbk5hbWU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYodGhpcy5vcHRpb25zLnNwcml0ZU9wdGlvbnMuaGFzKGFuaW1hdGlvbk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5wbGF5KGFuaW1hdGlvbk5hbWUsIG51bGwsIGZhbHNlKTsgLy9GYWxzZSBzbyBpdCBkb2VzIG5vdCBsb29wXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5jdXJyZW50QW5pbSAmJiB0aGlzLnNwcml0ZS5hbmltYXRpb25zLmN1cnJlbnRBbmltLm9uQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5jdXJyZW50QW5pbS5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uU3RhdGVDaGFuZ2UoKTogdm9pZCB7fTtcbiAgICBwcm90ZWN0ZWQgYXBwbHlNb2RpZmllcigpOiB2b2lkIHt9O1xuXG4gICAgcHJvdGVjdGVkIGdvVG9BY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLmdvVG9UaGluZyh0aGlzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdGFrZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucGlja2FibGUpIHtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2UgaWYodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfQUxSRUFEWV9IQVZFX0lUJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxldFBsYXllckNvbWVBbmRUYWtlSXQocGxheWVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBsZXRQbGF5ZXJDb21lQW5kVGFrZUl0KHBsYXllcjogUGxheWVyKSB7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5UQUtFX09CSkVDVCwgdGhpcyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheShyYW5kb21UZXh0KFxuICAgICAgICAgICAgICAgICdPSF9MT09LX0FUX1RIQVQnLFxuICAgICAgICAgICAgICAgICdOSUNFX09CSkVDVCcsXG4gICAgICAgICAgICAgICAgJ0JFQVVUSUZVTF9TT01FVEhJTkcnXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9wZW5BY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ1RIQVRfQ0FOTk9UX0JFX09QRU5FRCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBjbG9zZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnVEhBVF9DQU5OT1RfQkVfQ0xPU0VEJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHB1c2hBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0lfQ0FOVF9NT1ZFX1RIQVQnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdJX0RPTlRfS05PV19IT1dfVE9fRE9fVEhBVCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzcGVha0FjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheShyYW5kb21UZXh0KFxuICAgICAgICAgICAgJ0lfV09VTEROVF9LTk9XX1dIQVRfVE9fU0FZJyxcbiAgICAgICAgICAgICdJX0hBVkVfQkVUVEVSX1RISU5HU19UT19ET19USEFOX1RBTEtJTkcnLFxuICAgICAgICAgICAgJ0hJX1RIRVJFJ1xuICAgICAgICApKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2l2ZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnSV9DQU5UX0RPX1RIQVQnKTtcbiAgICB9XG5cblxuICAgIC8vTWV0aG9kcyB0aGF0IHNob3VsZG4ndCBiZSBvdmVycmlkZW5cbiAgICBwcml2YXRlIGFkZFRvSW52ZW50b3J5KCk6IHZvaWQge1xuICAgICAgICBpZihhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKS5hZGQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNwcml0ZSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGxheWVyVG9Vc2VyID0gdWlMYXllcnMuYmFja2dyb3VuZE9iamVjdHM7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaXNGb3JlZ3JvdW5kKSB7XG4gICAgICAgICAgICBsYXllclRvVXNlciA9IHVpTGF5ZXJzLmZvcmVncm91bmRPYmplY3RzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3ByaXRlID0gbGF5ZXJUb1VzZXIuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLngsXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMueSxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zcHJpdGVJZFxuICAgICAgICApO1xuXG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5vcGFjaXR5KSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5hbHBoYSA9IHRoaXMub3B0aW9ucy5vcGFjaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXRoaXMub3B0aW9ucy5qdXN0RGVjb3JhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGUuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmV2ZW50cy5vbklucHV0RG93bi5hZGQodGhpcy5vbkNsaWNrLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmV2ZW50cy5vbklucHV0T3Zlci5hZGQodGhpcy5vbklucHV0T3ZlciwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5ldmVudHMub25JbnB1dE91dC5hZGQodGhpcy5vbklucHV0T3V0LCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25DbGljayhyZWNlcHRvcjogUGhhc2VyLlNwcml0ZSwgcG9pbnRlcjogUGhhc2VyLlBvaW50ZXIpOiB2b2lkIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuU0VMRUNUX1RISU5HLCB7XG4gICAgICAgICAgICB0aGluZzogdGhpcyxcbiAgICAgICAgICAgIHNlY29uZGFyeUFjdGlvbjogISFwb2ludGVyLnJpZ2h0QnV0dG9uLmlzRG93blxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uSW5wdXRPdmVyKCkge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5DVVJTT1JfT1ZFUl9USElORywgdGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbklucHV0T3V0KCkge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5DVVJTT1JfT1VUX1RISU5HLCB0aGlzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFNwcml0ZUFuaW1hdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5zcHJpdGVPcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3ByaXRlT3B0aW9ucy5mb3JFYWNoKCAoc3ByaXRlUG9zaXRpb24sIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLmFuaW1hdGlvbnMuYWRkKGtleSwgc3ByaXRlUG9zaXRpb24uZnJhbWVzLCB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL215LXR5cGluZ3MvbGliLmVzNi5kLnRzXCIgLz5cbmltcG9ydCB7IHBoYXNlciB9IGZyb20gJy4uLy4uL1BoYXNlcic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5cbmNvbnN0IExPQ0FMX1NUT1JBR0VfSUQgPSAnZGdfc291bmQnO1xuY29uc3QgTE9DQUxfU1RPUkFHRV9PTiA9ICdvbic7XG5jb25zdCBMT0NBTF9TVE9SQUdFX09GRiA9ICdvZmYnO1xuXG5jbGFzcyBTb3VuZE1hbmFnZXIge1xuICAgIG9uQ2hhbmdlOiBPYnNlcnZhYmxlO1xuICAgIHByaXZhdGUgY3VycmVudFZvbHVtZTogbnVtYmVyO1xuICAgIHByaXZhdGUgb246IEJvb2xlYW47XG4gICAgcHJpdmF0ZSBtdXNpYzogUGhhc2VyLlNvdW5kO1xuICAgIHByaXZhdGUgc29uZ3M6IEFycmF5PHN0cmluZz47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IG5ldyBPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMucmVzdG9yZUxhc3RTZXR0aW5ncygpO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlLm5vdGlmeU9ic2VydmVycyh0aGlzLm9uKTtcbiAgICAgICAgdGhpcy51cGRhdGVTb3VuZFZvbHVtZSgpO1xuICAgIH1cblxuICAgIHR1cm5PbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbiA9IHRydWU7XG4gICAgICAgIHRoaXMuc3RvcmVTZXR0aW5ncygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNvdW5kVm9sdW1lKCk7XG4gICAgICAgIHRoaXMub25DaGFuZ2Uubm90aWZ5T2JzZXJ2ZXJzKHRoaXMub24pO1xuICAgIH1cblxuICAgIHR1cm5PZmYoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdG9yZVNldHRpbmdzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU291bmRWb2x1bWUoKTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZS5ub3RpZnlPYnNlcnZlcnModGhpcy5vbik7XG4gICAgfVxuXG4gICAgaXNPbigpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub247XG4gICAgfVxuXG4gICAgcGxheU11c2ljKHNvbmdzOiBBcnJheTxzdHJpbmc+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuc29uZ3MgPSBzb25ncy5zbGljZSgpO1xuICAgICAgICBsZXQgY3VycmVudFNvbmdzID0gdGhpcy5zb25ncy5zbGljZSgpO1xuICAgICAgICBsZXQgbmV4dFNvbmcgOnN0cmluZyA9IGN1cnJlbnRTb25ncy5zaGlmdCgpO1xuICAgICAgICB0aGlzLnBsYXlTb25nKG5leHRTb25nLCBjdXJyZW50U29uZ3MpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGxheVNvbmcoc29uZ05hbWU6IHN0cmluZywgcmVzdE9mU29uZ3M6IEFycmF5PHN0cmluZz4pOiB2b2lkIHtcbiAgICAgICAgaWYocmVzdE9mU29uZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXN0T2ZTb25ncyA9IHRoaXMuc29uZ3Muc2xpY2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlc3Ryb3lDdXJyZW50TXVzaWMoKTtcbiAgICAgICAgdGhpcy5tdXNpYyA9IHBoYXNlckdhbWUudmFsdWUuYWRkLmF1ZGlvKHNvbmdOYW1lKTtcbiAgICAgICAgdGhpcy5tdXNpYy5vblN0b3AuYWRkKCgpID0+IHtcbiAgICAgICAgICAgIGxldCBuZXh0U29uZyA9IHJlc3RPZlNvbmdzLnNoaWZ0KCk7XG4gICAgICAgICAgICB0aGlzLnBsYXlTb25nKG5leHRTb25nLCByZXN0T2ZTb25ncyk7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdm9sdW1lID0gMDtcbiAgICAgICAgaWYodGhpcy5vbikge1xuICAgICAgICAgICAgdm9sdW1lID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm11c2ljLnBsYXkoJycsIDAsIHZvbHVtZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95Q3VycmVudE11c2ljKCk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLm11c2ljKSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm9uU3RvcC5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIHRoaXMubXVzaWMuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5tdXNpYyA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNvdW5kVm9sdW1lKCk6IHZvaWQge1xuICAgICAgICBpZihwaGFzZXJHYW1lLnZhbHVlICYmIHBoYXNlckdhbWUudmFsdWUuc291bmQpIHtcbiAgICAgICAgICAgIGlmKHRoaXMub24pIHtcbiAgICAgICAgICAgICAgICBwaGFzZXJHYW1lLnZhbHVlLnNvdW5kLnZvbHVtZSA9IDE7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5tdXNpYykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwaGFzZXJHYW1lLnZhbHVlLnNvdW5kLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5tdXNpYykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXN0b3JlTGFzdFNldHRpbmdzKCk6IHZvaWQge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcblxuICAgICAgICBpZih3aW5kb3cubG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgICBpZih3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oTE9DQUxfU1RPUkFHRV9JRCkgPT09IExPQ0FMX1NUT1JBR0VfT04pIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShMT0NBTF9TVE9SQUdFX0lEKSA9PT0gTE9DQUxfU1RPUkFHRV9PRkYpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub24gPSByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdG9yZVNldHRpbmdzKCk6IHZvaWQge1xuICAgICAgICBpZih3aW5kb3cubG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZVRvU3RvcmUgPSBMT0NBTF9TVE9SQUdFX09OO1xuICAgICAgICAgICAgICAgIGlmKCF0aGlzLm9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVG9TdG9yZSA9IExPQ0FMX1NUT1JBR0VfT0ZGO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oTE9DQUxfU1RPUkFHRV9JRCwgdmFsdWVUb1N0b3JlKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ05vdCBhYmxlIHRvIHN0b3JlIHNldHRpbmdzIGluIGxvY2FsIHN0b3JhZ2UnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IHNvdW5kID0gbmV3IFNvdW5kTWFuYWdlcigpOyIsImltcG9ydCB7IE9ic2VydmFibGUsIElDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzL09ic2VydmFibGUnO1xuaW1wb3J0IHsgSW52ZW50b3J5IH0gZnJvbSAnLi4vbW9kZWxzL0ludmVudG9yeSc7XG5cbmNsYXNzIEFjdGl2ZUludmVudG9yeSB7XG5cbiAgICBwcml2YXRlIGNoYW5nZU9ic2VydmFibGU6IE9ic2VydmFibGU7XG4gICAgcHJpdmF0ZSBhY3RpdmVJbnZlbnRvcnk6IEludmVudG9yeTtcbiAgICBwcml2YXRlIG9uSW52ZW50b3J5Q2hhbmdlQmluZGVkOiBJQ2FsbGJhY2s7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5vbkludmVudG9yeUNoYW5nZUJpbmRlZCA9ICgobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnMobmV3VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXRBY3RpdmVJbnZlbnRvcnkobmV3SW52ZW50b3J5OiBJbnZlbnRvcnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW1vdmVPbGRJbnZlbnRvcnlFdmVudHMoKTtcbiAgICAgICAgdGhpcy5hY3RpdmVJbnZlbnRvcnkgPSBuZXdJbnZlbnRvcnk7XG4gICAgICAgIHRoaXMuY3JlYXRlTmV3SW52ZW50b3J5RXZlbnRzKCk7XG4gICAgICAgIHRoaXMubm90aWZ5U3Vic2NyaWJlcnMoKTtcbiAgICB9XG5cbiAgICBnZXRBY3RpdmVJbnZlbnRvcnkoKTogSW52ZW50b3J5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlSW52ZW50b3J5O1xuICAgIH1cblxuICAgIHJlZnJlc2goKTogdm9pZCB7XG4gICAgICAgIHRoaXMubm90aWZ5U3Vic2NyaWJlcnMoKTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5yZWdpc3Rlck9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5hY3RpdmVJbnZlbnRvcnkpO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlVG9DaGFuZ2UoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoYW5nZU9ic2VydmFibGUucmVtb3ZlT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlT2xkSW52ZW50b3J5RXZlbnRzKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVJbnZlbnRvcnkpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSW52ZW50b3J5LnVuc3Vic2NyaWJlVG9DaGFuZ2UodGhpcy5vbkludmVudG9yeUNoYW5nZUJpbmRlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZU5ld0ludmVudG9yeUV2ZW50cygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlSW52ZW50b3J5KSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUludmVudG9yeS5zdWJzY3JpYmVUb0NoYW5nZSh0aGlzLm9uSW52ZW50b3J5Q2hhbmdlQmluZGVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbm90aWZ5U3Vic2NyaWJlcnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnModGhpcy5hY3RpdmVJbnZlbnRvcnkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFjdGl2ZUludmVudG9yeSA9IG5ldyBBY3RpdmVJbnZlbnRvcnkoKTsiLCJjbGFzcyBQaGFzZXJHYW1lIHtcblxuICAgIHByaXZhdGUgY3VycmVudFZhbHVlOiBQaGFzZXIuR2FtZTtcblxuICAgIHNldCB2YWx1ZShuZXdWYWx1ZTogUGhhc2VyLkdhbWUpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWUoKTogUGhhc2VyLkdhbWUge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VmFsdWU7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgcGhhc2VyR2FtZSA9IG5ldyBQaGFzZXJHYW1lKCk7IiwiaW1wb3J0IHsgU2NlbmUgfSBmcm9tICcuLi9tb2RlbHMvU2NlbmUnO1xuXG5jbGFzcyBTY2VuZXNTZXQge1xuICAgIHByaXZhdGUgc2NlbmVzOiBNYXA8c3RyaW5nLCBTY2VuZT47XG4gICAgcHJpdmF0ZSBfY3VycmVudFNjZW5lOiBTY2VuZTtcblxuICAgIGluaXQoc2NlbmVzOiBBcnJheTxTY2VuZT4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zY2VuZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHNjZW5lcy5mb3JFYWNoKChzY2VuZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY2VuZXMuc2V0KHNjZW5lLmlkLCBzY2VuZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBjdXJyZW50U2NlbmUoKTogU2NlbmUge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFNjZW5lO1xuICAgIH1cblxuICAgIGdldFNjZW5lQnlJZChpZDogc3RyaW5nKTogU2NlbmUge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2VuZXMuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBzZXRDdXJyZW50U2NlbmVCeUlkKG5ld0N1cnJlbnRTY2VuZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kZXN0cm95Q3VycmVudFNjZW5lKCk7XG4gICAgICAgIGxldCBzY2VuZSA9IHRoaXMuc2NlbmVzLmdldChuZXdDdXJyZW50U2NlbmVJZCk7XG4gICAgICAgIGlmICghc2NlbmUpIHtcbiAgICAgICAgICAgIHRocm93IGBFUlJPUiB0cnlpbmcgdG8gaW5pdCBzY2VuZSB0aGF0IGlzIG5vdCBwcmVzZW50ICgke25ld0N1cnJlbnRTY2VuZUlkfSlgO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZSA9IHNjZW5lO1xuICAgICAgICBzY2VuZS5zaG93KCk7XG4gICAgfVxuXG4gICAgZ29Ub1NjZW5lV2l0aElkKHNjZW5lSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3lDdXJyZW50U2NlbmUoKTtcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50U2NlbmVCeUlkKHNjZW5lSWQpO1xuICAgIH0gICBcblxuICAgIHByaXZhdGUgZGVzdHJveUN1cnJlbnRTY2VuZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRTY2VuZSkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBzY2VuZXMgPSBuZXcgU2NlbmVzU2V0KCk7XG4iLCJpbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBHZW5lcmljSGlnaGxpZ2h0ZWRUaGluZyB9IGZyb20gJy4uL21vZGVscy9HZW5lcmljSGlnaGxpZ2h0ZWRUaGluZyc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBzZWxlY3RlZFZlcmIgfSBmcm9tICcuL1NlbGVjdGVkVmVyYi5zaW5nbGV0b24nO1xuaW1wb3J0IHsgVmVyYnNJbmZvIH0gZnJvbSAnLi4vc3RvcmVzL1ZlcmJzLnN0b3JlJztcblxuY2xhc3MgU2VsZWN0ZWRUaGluZyBleHRlbmRzIEdlbmVyaWNIaWdobGlnaHRlZFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQUNUSU9OX0FQUExJRUQsXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmhpZ2hsaWdodFRoaW5nKG51bGwpXG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jbGFzcyBIaWdobGlnaHRlZFRoaW5nIGV4dGVuZHMgR2VuZXJpY0hpZ2hsaWdodGVkVGhpbmcge1xuXG4gICAgcHJvdGVjdGVkIG9uQ3Vyc29yT3ZlclRoaW5nKHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICBpZiAoIXNlbGVjdGVkVmVyYi52ZXJiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHZlcmJJbmZvID0gVmVyYnNJbmZvLmdldChzZWxlY3RlZFZlcmIudmVyYik7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkVmVyYi52ZXJiICYmIHZlcmJJbmZvLnNpbmdsZU9iamVjdCkge1xuXG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nKHRoaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFZlcmIudmVyYiAmJiAhdmVyYkluZm8uc2luZ2xlT2JqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nRm9yTXVsdGlwbGVPYmplY3RWZXJiKHRoaW5nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGlnaGxpZ2h0VGhpbmdGb3JNdWx0aXBsZU9iamVjdFZlcmIodGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFRoaW5nKHRoaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGluZy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0VGhpbmcodGhpbmcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uQ3Vyc29yT3V0VGhpbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGhpbmcobnVsbCk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgaGlnaGxpZ2h0ZWRUaGluZyA9IG5ldyBIaWdobGlnaHRlZFRoaW5nKCk7XG5leHBvcnQgY29uc3Qgc2VsZWN0ZWRUaGluZyA9IG5ldyBTZWxlY3RlZFRoaW5nKCk7XG4iLCJpbXBvcnQgeyBWZXJicyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5pbXBvcnQgeyBhY3Rpb25EaXNwYXRjaGVyLCBBY3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvQWN0aW9uRGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlICwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5cbmNsYXNzIFNlbGVjdGVkVmVyYiB7XG5cbiAgICBwcml2YXRlIG9uQ2hhbmdlT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTtcbiAgICBwcml2YXRlIHNlbGVjdGVkVmVyYjogVmVyYnM7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuc3Vic2NyaWJlVG8oXG4gICAgICAgICAgICBBY3Rpb25zLlNFTEVDVF9WRVJCLFxuICAgICAgICAgICAgbmV3VmVyYiA9PiB0aGlzLnNlbGVjdE5ld1ZlcmIobmV3VmVyYilcbiAgICAgICAgKTtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQUNUSU9OX0FQUExJRUQsXG4gICAgICAgICAgICAoKSA9PiB0aGlzLnJlc2V0KClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXQgdmVyYigpOiBWZXJicyB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkVmVyYjtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLnNlbGVjdGVkVmVyYik7XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVUb0NoYW5nZShjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VPYnNlcnZhYmxlLnJlbW92ZU9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBub3RpZnlTdWJzY3JpYmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZU9ic2VydmFibGUubm90aWZ5T2JzZXJ2ZXJzKHRoaXMuc2VsZWN0ZWRWZXJiKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNlbGVjdE5ld1ZlcmIobmV3VmVyYjogVmVyYnMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFZlcmIgPSBuZXdWZXJiO1xuICAgICAgICB0aGlzLm5vdGlmeVN1YnNjcmliZXJzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWxlY3ROZXdWZXJiKFZlcmJzLkdPX1RPKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IHNlbGVjdGVkVmVyYiA9IG5ldyBTZWxlY3RlZFZlcmIoKTtcbiIsImltcG9ydCB7IElMYWJlbHMgIH0gZnJvbSAnLi9MYWJlbHMuc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9MQUJFTFM6IElMYWJlbHMgPSB7XG4gICAgJ2VzJzoge1xuICAgICAgICAnQ2xvc2UnOiAnQ2VycmFyJyxcbiAgICAgICAgJ0dpdmUnOiAnRGFyJyxcbiAgICAgICAgJ0dvIHRvJzogJ0lyIGEnLFxuICAgICAgICAnTG9vayBhdCc6ICdNaXJhcicsXG4gICAgICAgICdPcGVuJzogJ0FicmlyJyxcbiAgICAgICAgJ1B1c2gnOiAnRW1wdWphcicsXG4gICAgICAgICdSZWZsZWN0JzogJ1BlbnNhcicsXG4gICAgICAgICdTcGVhayB0byc6ICdIYWJsYXIgYScsXG4gICAgICAgICdUYWtlJzogJ0NvZ2VyJyxcbiAgICAgICAgJ3RvJzogJ2EnLFxuICAgICAgICAnVXNlJzogJ1VzYXInLFxuICAgICAgICAnd2l0aCc6ICdjb24nXG4gICAgfSxcbiAgICAnZW4nOiB7XG4gICAgICAgICdDbG9zZSc6ICdDbG9zZScsXG4gICAgICAgICdHaXZlJzogJ0dpdmUnLFxuICAgICAgICAnR28gdG8nOiAnR28gdG8nLFxuICAgICAgICAnTG9vayBhdCc6ICdMb29rIGF0JyxcbiAgICAgICAgJ09wZW4nOiAnT3BlbicsXG4gICAgICAgICdQdXNoJzogJ1B1c2gnLFxuICAgICAgICAnUmVmbGVjdCc6ICdSZWZsZWN0JyxcbiAgICAgICAgJ1NwZWFrIHRvJzogJ1NwZWFrIHRvJyxcbiAgICAgICAgJ1Rha2UnOiAnUGljayB1cCcsXG4gICAgICAgICd0byc6ICd0bycsXG4gICAgICAgICdVc2UnOiAnVXNlJyxcbiAgICAgICAgJ3dpdGgnOiAnd2l0aCdcbiAgICB9XG59OyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9teS10eXBpbmdzL2xpYi5lczYuZC50c1wiIC8+XG5pbXBvcnQgeyBERUZBVUxUX0xBQkVMUyB9IGZyb20gJy4vRGVmYXVsdExhYmVscyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxhYmVsc1Blckxhbmd1YWdlIHtcbiAgICBbaW5kZXggOiBzdHJpbmddIDogc3RyaW5nO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBJTGFiZWxzIHtcbiAgICBbaW5kZXggOiBzdHJpbmddIDogSUxhYmVsc1Blckxhbmd1YWdlO1xufTtcblxuY29uc3QgREVGQVVMVF9MQU5HVUFHRSA9ICdlbic7XG5cbmNsYXNzIExhYmVsc1N0b3JlIHtcbiAgICBwcml2YXRlIGxhYmVsczogTWFwPHN0cmluZywgSUxhYmVsc1Blckxhbmd1YWdlPjtcbiAgICBwcml2YXRlIGN1cnJlbnRMYW5ndWFnZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubGFiZWxzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRMYW5ndWFnZSA9IERFRkFVTFRfTEFOR1VBR0U7XG4gICAgfVxuXG4gICAgc2V0TGFuZ3VhZ2UobmV3TGFuZ3VhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmN1cnJlbnRMYW5ndWFnZSA9IG5ld0xhbmd1YWdlO1xuICAgIH1cblxuICAgIGFkZExhYmVscyhsYWJlbHNUb0FkZDogSUxhYmVscyk6IHZvaWQge1xuICAgICAgICBmb3IobGV0IGtleSBpbiBsYWJlbHNUb0FkZCkge1xuICAgICAgICAgICAgdGhpcy5hZGRMYWJlbHNGb3JMYW5ndWFnZShrZXksIGxhYmVsc1RvQWRkW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGFiZWwobGFiZWxOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgYWxsTGFuZ3VhZ2VMYWJlbHMgPSB0aGlzLmxhYmVscy5nZXQodGhpcy5jdXJyZW50TGFuZ3VhZ2UpO1xuICAgICAgICBpZiAoIWFsbExhbmd1YWdlTGFiZWxzKSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IHRyeWluZyB0byBnZXQgbGFiZWwgZnJvbSBub24gZXhpc3RpbmcgbGFuZ3VhZ2UnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbGxMYW5ndWFnZUxhYmVsc1tsYWJlbE5hbWVdIHx8IGxhYmVsTmFtZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZExhYmVsc0Zvckxhbmd1YWdlKGxhbmd1YWdlOiBzdHJpbmcsIGxhYmVsczogSUxhYmVsc1Blckxhbmd1YWdlKTogdm9pZCB7XG4gICAgICAgIGxldCBwcmV2aW91c0xhYmVscyA9IHRoaXMubGFiZWxzLmdldChsYW5ndWFnZSkgfHwge307XG4gICAgICAgIGxldCBuZXdMYWJlbHMgPSBPYmplY3QuYXNzaWduKHt9LCBwcmV2aW91c0xhYmVscywgbGFiZWxzKTtcbiAgICAgICAgdGhpcy5sYWJlbHMuc2V0KGxhbmd1YWdlLCBuZXdMYWJlbHMpO1xuICAgIH1cbn1cbmxldCBsYWJlbHNTdG9yZVNpbmdsZXRvbiA9IG5ldyBMYWJlbHNTdG9yZSgpO1xuXG5sYWJlbHNTdG9yZVNpbmdsZXRvbi5hZGRMYWJlbHMoPElMYWJlbHM+IERFRkFVTFRfTEFCRUxTKTtcblxuZXhwb3J0IGNvbnN0IGxhYmVsID0gKChsYWJlbElkOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gbGFiZWxzU3RvcmVTaW5nbGV0b24uZ2V0TGFiZWwobGFiZWxJZCk7XG59KTtcblxuZXhwb3J0IGNvbnN0IGxhYmVsc1N0b3JlID0gbGFiZWxzU3RvcmVTaW5nbGV0b247XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuXG5leHBvcnQgZW51bSBWZXJicyB7XG4gICAgR09fVE8gPSAxLFxuICAgIExPT0ssXG4gICAgQ0xPU0UsXG4gICAgUFVTSCxcbiAgICBUQUtFLFxuICAgIFVTRSxcbiAgICBTUEVBSyxcbiAgICBHSVZFLFxuICAgIE9QRU5cbn07XG5cbmludGVyZmFjZSBJVmVyYkluZm8ge1xuICAgIGxhYmVsOiBzdHJpbmcsXG4gICAgc2luZ2xlT2JqZWN0OiBCb29sZWFuLFxuICAgIGNvbmp1Y3Rpb24/OiBzdHJpbmdcbn1cblxubGV0IHZlcmJzSW5mbyA6IE1hcDxWZXJicywgSVZlcmJJbmZvPiA9IG5ldyBNYXAoKTtcblxudmVyYnNJbmZvLnNldChWZXJicy5HT19UTywge1xuICAgIGxhYmVsOiAnR28gdG8nLFxuICAgIHNpbmdsZU9iamVjdDogdHJ1ZVxufSk7XG52ZXJic0luZm8uc2V0KFZlcmJzLkxPT0ssIHtcbiAgICBsYWJlbDogJ0xvb2sgYXQnLFxuICAgIHNpbmdsZU9iamVjdDogdHJ1ZVxufSk7XG52ZXJic0luZm8uc2V0KFZlcmJzLkNMT1NFLCB7XG4gICAgbGFiZWw6ICdDbG9zZScsXG4gICAgc2luZ2xlT2JqZWN0OiB0cnVlXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuUFVTSCwge1xuICAgIGxhYmVsOiAnUHVzaCcsXG4gICAgc2luZ2xlT2JqZWN0OiB0cnVlXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuVEFLRSwge1xuICAgIGxhYmVsOiAnVGFrZScsXG4gICAgc2luZ2xlT2JqZWN0OiB0cnVlXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuVVNFLCB7XG4gICAgbGFiZWw6ICdVc2UnLFxuICAgIHNpbmdsZU9iamVjdDogZmFsc2UsXG4gICAgY29uanVjdGlvbjogJ3dpdGgnXG59KTtcbnZlcmJzSW5mby5zZXQoVmVyYnMuU1BFQUssIHtcbiAgICBsYWJlbDogJ1NwZWFrIHRvJyxcbiAgICBzaW5nbGVPYmplY3Q6IHRydWVcbn0pO1xudmVyYnNJbmZvLnNldChWZXJicy5HSVZFLCB7XG4gICAgbGFiZWw6ICdHaXZlJyxcbiAgICBzaW5nbGVPYmplY3Q6IGZhbHNlLFxuICAgIGNvbmp1Y3Rpb246ICd0bydcbn0pO1xudmVyYnNJbmZvLnNldChWZXJicy5PUEVOLCB7XG4gICAgbGFiZWw6ICdPcGVuJyxcbiAgICBzaW5nbGVPYmplY3Q6IHRydWVcbn0pO1xuZXhwb3J0IGNvbnN0IFZlcmJzSW5mbyA9IHZlcmJzSW5mbztcbiIsImltcG9ydCB7IFZlcmJzLCBWZXJic0luZm8gfSBmcm9tICcuLi9zdG9yZXMvVmVyYnMuc3RvcmUnO1xuaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBwaGFzZXIgfSBmcm9tICcuLi8uLi9QaGFzZXInO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBsYWJlbCB9IGZyb20gJy4uL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuL1N0eWxlJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcbmltcG9ydCB7IFRleHRXaXRoU2hhZG93IH0gZnJvbSAnLi9UZXh0V2l0aFNoYWRvdyc7XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25CdXR0b24ge1xuXG4gICAgcHJpdmF0ZSBzY3JlZW5Qb3NpdGlvbjogSVBvaW50O1xuICAgIHByaXZhdGUgYnV0dG9uOiBQaGFzZXIuQnV0dG9uO1xuICAgIHByaXZhdGUgdGV4dDogVGV4dFdpdGhTaGFkb3c7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZlcmI6IFZlcmJzLCBwb3NpdGlvbjogSVBvaW50KSB7XG4gICAgICAgIHRoaXMuc2NyZWVuUG9zaXRpb24gPSBsYXlvdXQuZ2V0VmVyYkJ1dHRvblBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5jcmVhdGVCdXR0b24oKTtcbiAgICAgICAgdGhpcy5jcmVhdGVUZXh0KCk7XG4gICAgfVxuXG4gICAgaGlnaGxpZ2h0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJ1dHRvbi5mcmFtZSA9IDI7XG4gICAgfVxuXG4gICAgdW5oaWdobGlnaHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnV0dG9uLmZyYW1lID0gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5idXR0b24gPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC5idXR0b24oXG4gICAgICAgICAgICB0aGlzLnNjcmVlblBvc2l0aW9uLngsXG4gICAgICAgICAgICB0aGlzLnNjcmVlblBvc2l0aW9uLnksXG4gICAgICAgICAgICAnQlVUVE9OX0JHJyxcbiAgICAgICAgICAgIHRoaXMub25DbGljayxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIHVpTGF5ZXJzLnZlcmJCdXR0b25zLmFkZCh0aGlzLmJ1dHRvbik7XG4gICAgICAgIHRoaXMuYnV0dG9uLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlVGV4dCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHRleHQgPSBsYWJlbChWZXJic0luZm8uZ2V0KHRoaXMudmVyYikubGFiZWwpO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnNjcmVlblBvc2l0aW9uLnggKyBsYXlvdXQuVkVSQl9CVVRUT05fV0lEVEggLyAyLFxuICAgICAgICAgICAgeTogdGhpcy5zY3JlZW5Qb3NpdGlvbi55ICsgbGF5b3V0LlZFUkJfQlVUVE9OX0hFSUdIVCAvIDJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50ZXh0ID0gbmV3IFRleHRXaXRoU2hhZG93KHtcbiAgICAgICAgICAgIGluaXRpYWxUZXh0OiB0ZXh0LFxuICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgZml4ZWRUb0NhbWVyYTogdHJ1ZSxcbiAgICAgICAgICAgIGxheWVyOiB1aUxheWVycy52ZXJiQnV0dG9ucyxcbiAgICAgICAgICAgIGFuY2hvcjoge1xuICAgICAgICAgICAgICAgIHg6IDAuNSxcbiAgICAgICAgICAgICAgICB5OiAwLjVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIG9uQ2xpY2soKTogdm9pZCB7XG4gICAgICAgIGFjdGlvbkRpc3BhdGNoZXIuZXhlY3V0ZShBY3Rpb25zLlNFTEVDVF9WRVJCLCB0aGlzLnZlcmIpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHN0eWxlIH0gZnJvbSAnLi9TdHlsZSc7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25MaW5lIH0gZnJvbSAnLi4vbW9kZWxzL0NvbnZlcnNhdGlvbkxpbmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgSUNhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IFRleHRXaXRoU2hhZG93IH0gZnJvbSAnLi9UZXh0V2l0aFNoYWRvdyc7XG5pbXBvcnQgeyBsYWJlbCB9IGZyb20gJy4uL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuXG5leHBvcnQgY2xhc3MgQ29udmVyc2F0aW9uTGluZVVJIHtcblxuICAgIHByaXZhdGUgY2xpY2tPYnNlcnZhYmxlOiBPYnNlcnZhYmxlO1xuICAgIHByaXZhdGUgcG9zaXRpb246IElQb2ludDtcbiAgICBwcml2YXRlIGJ1dHRvbjogUGhhc2VyLkJ1dHRvbjtcbiAgICBwcml2YXRlIHRleHQ6IFRleHRXaXRoU2hhZG93O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgY29udmVyc2F0aW9uTGluZTogQ29udmVyc2F0aW9uTGluZSxcbiAgICAgICAgcHJpdmF0ZSBsaW5lVGV4dDogc3RyaW5nLFxuICAgICAgICBwcml2YXRlIGluZGV4OiBudW1iZXIpIHtcblxuICAgICAgICBpZiAoIXRoaXMuY29udmVyc2F0aW9uTGluZSkge1xuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBjb252ZXJzYXRpb24gbGluZSBVSSwgbm8gY29udmVyc2F0aW9uTGluZSBwcm92aWRlZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmxpbmVUZXh0KSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IGNvbnZlcnNhdGlvbiBsaW5lIFVJLCBubyB0ZXh0IHByb3ZpZGVkJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0aHJvdyAnRVJST1I6IGNvbnZlcnNhdGlvbiBsaW5lIFVJLCBubyBpbmRleCBwcm92aWRlZCc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsaWNrT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBsYXlvdXQuZ2V0UG9zaXRpb25Gb3JDb252ZXJzYXRpb25MaW5lKHRoaXMuaW5kZXgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvbigpO1xuICAgICAgICB0aGlzLmNyZWF0ZVRleHQoKTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NsaWNrKGNhbGxiYWNrOiBJQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGlja09ic2VydmFibGUucmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uZGVzdHJveSgpO1xuICAgICAgICB0aGlzLnRleHQuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQnV0dG9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJ1dHRvbiA9IHBoYXNlckdhbWUudmFsdWUuYWRkLmJ1dHRvbihcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCxcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSxcbiAgICAgICAgICAgICdDT05WRVJTQVRJT05fTElORV9CRycsXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2ssXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAyLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICB1aUxheWVycy5jb252ZXJzYXRpb24uYWRkKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgdGhpcy5idXR0b24uZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVUZXh0KCk6IHZvaWQge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnBvc2l0aW9uLnggKyBsYXlvdXQuQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19YLFxuICAgICAgICAgICAgeTogdGhpcy5wb3NpdGlvbi55ICsgbGF5b3V0LkNPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRleHQgPSBuZXcgVGV4dFdpdGhTaGFkb3coe1xuICAgICAgICAgICAgaW5pdGlhbFRleHQ6IGxhYmVsKHRoaXMubGluZVRleHQpLFxuICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgZml4ZWRUb0NhbWVyYTogdHJ1ZSxcbiAgICAgICAgICAgIGxheWVyOiB1aUxheWVycy5jb252ZXJzYXRpb25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsaWNrT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnModGhpcy5jb252ZXJzYXRpb25MaW5lKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHVpQmxvY2tlciB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9VSUJsb2NrZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbiB9IGZyb20gJy4uL21vZGVscy9Db252ZXJzYXRpb24nO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uTGluZSB9IGZyb20gJy4uL21vZGVscy9Db252ZXJzYXRpb25MaW5lJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbkxpbmVVSSB9IGZyb20gJy4vQ29udmVyc2F0aW9uTGluZVVJJztcbmltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgUGFnaW5hdGlvbkJ1dHRvblR5cGUsIEludmVudG9yeVBhZ2luYXRpb25CdXR0b24gfSBmcm9tICcuL0ludmVudG9yeVBhZ2luYXRpb25CdXR0b24nO1xuXG5jb25zdCBMSU5FU19QRVJfUEFHRSA9IDM7XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJzYXRpb25VSSB7XG5cbiAgICBwcml2YXRlIGJhY2tncm91bmQ6IFBoYXNlci5TcHJpdGU7XG4gICAgcHJpdmF0ZSBsaW5lczogQXJyYXk8Q29udmVyc2F0aW9uTGluZVVJPjtcbiAgICBwcml2YXRlIHVpQmxvY2tlcldhc0Jsb2NrZWRCZWZvcmU6IEJvb2xlYW47XG4gICAgcHJpdmF0ZSBmaXJzdExpbmVTaG93bjogbnVtYmVyO1xuICAgIHByaXZhdGUgcGFnaW5hdGlvbkJ1dHRvblVwOiBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uO1xuICAgIHByaXZhdGUgcGFnaW5hdGlvbkJ1dHRvbkRvd246IEludmVudG9yeVBhZ2luYXRpb25CdXR0b247XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uKSB7XG4gICAgICAgIHRoaXMuZmlyc3RMaW5lU2hvd24gPSAwO1xuICAgICAgICB0aGlzLnVpQmxvY2tlcldhc0Jsb2NrZWRCZWZvcmUgPSB1aUJsb2NrZXIuaXNCbG9ja2VkKCk7XG4gICAgICAgIHVpQmxvY2tlci5ibG9jaygpO1xuICAgICAgICB0aGlzLmxpbmVzID0gW107XG4gICAgICAgIHRoaXMuY3JlYXRlQmFja2dyb3VuZCgpO1xuICAgICAgICB0aGlzLmNvbnZlcnNhdGlvbi5vblN0YXRlQ2hhbmdlKChuZXdTdGF0ZSkgPT4gdGhpcy51cGRhdGUobmV3U3RhdGUpKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3lPbGRMaW5lcygpO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQuZGVzdHJveSgpO1xuICAgICAgICBpZighdGhpcy51aUJsb2NrZXJXYXNCbG9ja2VkQmVmb3JlKSB7XG4gICAgICAgICAgICB1aUJsb2NrZXIudW5ibG9jaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgICAgICBsZXQgbGF5b3V0U3RhcnRQb3NpdGlvbiA9IGxheW91dC5VSV9TVEFSVF9QT1NJVElPTjtcblxuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSB1aUxheWVycy5jb252ZXJzYXRpb24uY3JlYXRlKFxuICAgICAgICAgICAgbGF5b3V0U3RhcnRQb3NpdGlvbi54LFxuICAgICAgICAgICAgbGF5b3V0U3RhcnRQb3NpdGlvbi55LFxuICAgICAgICAgICAgJ1VJX0NPTlZFUlNBVElPTl9CRydcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmFuY2hvci5zZXRUbygwLCAwKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlKG5ld1N0YXRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5maXJzdExpbmVTaG93biA9IDA7XG4gICAgICAgIHRoaXMuZGVzdHJveU9sZExpbmVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlTmV3TGluZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZU5ld0xpbmVzKCk6IHZvaWQge1xuICAgICAgICBsZXQgbmV3TGluZXMgPSB0aGlzLmNvbnZlcnNhdGlvbi5nZXRMaW5lcygpO1xuICAgICAgICBmb3IobGV0IGk9dGhpcy5maXJzdExpbmVTaG93bjsgaTwodGhpcy5maXJzdExpbmVTaG93biArIExJTkVTX1BFUl9QQUdFKSAmJiAoaTxuZXdMaW5lcy5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTGluZShuZXdMaW5lc1tpXSwgaSAtIHRoaXMuZmlyc3RMaW5lU2hvd24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlUGFnaW5hdGlvbkJ1dHRvbnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUxpbmUobGluZTogQ29udmVyc2F0aW9uTGluZSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBsZXQgbmV3VUlMaW5lID0gbmV3IENvbnZlcnNhdGlvbkxpbmVVSShcbiAgICAgICAgICAgIGxpbmUsXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnNhdGlvbi5nZXRUZXh0Rm9yTGluZShsaW5lKSxcbiAgICAgICAgICAgIGluZGV4KTtcbiAgICAgICAgbmV3VUlMaW5lLnN1YnNjcmliZVRvQ2xpY2soY2xpY2tlZExpbmVkID0+IHRoaXMubGluZUNsaWNrZWQoY2xpY2tlZExpbmVkKSk7XG4gICAgICAgIHRoaXMubGluZXMucHVzaChuZXdVSUxpbmUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbGluZUNsaWNrZWQobGluZTogQ29udmVyc2F0aW9uTGluZSkge1xuICAgICAgICB0aGlzLmRlc3Ryb3lPbGRMaW5lcygpO1xuICAgICAgICB0aGlzLmNvbnZlcnNhdGlvbi5hcHBseUxpbmUobGluZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95T2xkTGluZXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGluZXMuZm9yRWFjaChsaW5lID0+IGxpbmUuZGVzdHJveSgpKTtcbiAgICAgICAgdGhpcy5saW5lcyA9IFtdO1xuICAgICAgICB0aGlzLmRlc3Ryb3lQYWdpbmF0aW9uQnV0dG9ucygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUGFnaW5hdGlvbkJ1dHRvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveVBhZ2luYXRpb25CdXR0b25zKCk7XG4gICAgICAgIGlmKHRoaXMuZmlyc3RMaW5lU2hvd24gPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25VcCA9IG5ldyBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBQYWdpbmF0aW9uQnV0dG9uVHlwZS5VUCxcbiAgICAgICAgICAgICAgICBsYXllcjogdWlMYXllcnMuY29udmVyc2F0aW9uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvblVwLnN1YnNjcmliZVRvQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZ29Ub1ByZXZQYWdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZigodGhpcy5maXJzdExpbmVTaG93biArIExJTkVTX1BFUl9QQUdFKSA8IHRoaXMuY29udmVyc2F0aW9uLmdldExpbmVzKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25Eb3duID0gbmV3IEludmVudG9yeVBhZ2luYXRpb25CdXR0b24oe1xuICAgICAgICAgICAgICAgIHR5cGU6IFBhZ2luYXRpb25CdXR0b25UeXBlLkRPV04sXG4gICAgICAgICAgICAgICAgbGF5ZXI6IHVpTGF5ZXJzLmNvbnZlcnNhdGlvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25Eb3duLnN1YnNjcmliZVRvQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZ29Ub05leHRQYWdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ29Ub1ByZXZQYWdlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZpcnN0TGluZVNob3duLS07XG4gICAgICAgIHRoaXMuZGVzdHJveU9sZExpbmVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlTmV3TGluZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdvVG9OZXh0UGFnZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5maXJzdExpbmVTaG93bisrO1xuICAgICAgICB0aGlzLmRlc3Ryb3lPbGRMaW5lcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZU5ld0xpbmVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95UGFnaW5hdGlvbkJ1dHRvbnMoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMucGFnaW5hdGlvbkJ1dHRvblVwKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25VcC5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25VcCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLnBhZ2luYXRpb25CdXR0b25Eb3duKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25Eb3duLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvbkRvd24gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgXG59XG4iLCJpbXBvcnQgeyBzZWxlY3RlZFRoaW5nLCBoaWdobGlnaHRlZFRoaW5nIH0gZnJvbSAnLi4vc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcbmltcG9ydCB7IHNlbGVjdGVkVmVyYiB9IGZyb20gJy4uL3N0YXRlL1NlbGVjdGVkVmVyYi5zaW5nbGV0b24nO1xuaW1wb3J0IHsgVGV4dFdpdGhTaGFkb3cgfSBmcm9tICcuL1RleHRXaXRoU2hhZG93JztcbmltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBsYWJlbCB9IGZyb20gJy4uL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuaW1wb3J0IHsgVmVyYnMsIFZlcmJzSW5mbyB9IGZyb20gJy4uL3N0b3Jlcy9WZXJicy5zdG9yZSc7XG5cbmV4cG9ydCBjbGFzcyBDdXJyZW50QWN0aW9uVUkge1xuXG4gICAgcHJpdmF0ZSB0ZXh0OiBUZXh0V2l0aFNoYWRvdztcbiAgICBwcml2YXRlIGN1cnJlbnRUZXh0OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVUZXh0KCk7XG4gICAgICAgIHNlbGVjdGVkVmVyYi5zdWJzY3JpYmVUb0NoYW5nZShuZXdWZXJiID0+IHRoaXMudXBkYXRlVGV4dCgpKTtcbiAgICAgICAgaGlnaGxpZ2h0ZWRUaGluZy5zdWJzY3JpYmVUb0NoYW5nZShuZXdUaGluZyA9PiB0aGlzLnVwZGF0ZVRleHQoKSk7XG4gICAgICAgIHNlbGVjdGVkVGhpbmcuc3Vic2NyaWJlVG9DaGFuZ2UobmV3VGhpbmcgPT4gdGhpcy51cGRhdGVUZXh0KCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlVGV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gbmV3IFRleHRXaXRoU2hhZG93KHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBsYXlvdXQuQ1VSUkVOVF9BQ1RJT05fUE9TSVRJT04sXG4gICAgICAgICAgICBsYXllcjogdWlMYXllcnMudmVyYkJ1dHRvbnMsXG4gICAgICAgICAgICBmaXhlZFRvQ2FtZXJhOiB0cnVlXG4gICAgICAgIH0pO1xufVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVUZXh0KCk6IHZvaWQge1xuICAgICAgICBsZXQgbmV3VGV4dCA9IHRoaXMuZ2V0VmVyYlRleHQoKSArIHRoaXMuZ2V0U2VsZWN0ZWRUaGluZ1RleHQoKSArICcgJyArIHRoaXMuZ2V0VGhpbmdUZXh0KCk7XG4gICAgICAgIHRoaXMuc2V0VGV4dChuZXdUZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFRleHQobmV3VGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUZXh0ICE9PSBuZXdUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0ID0gbmV3VGV4dDtcbiAgICAgICAgICAgIHRoaXMudGV4dC5zZXRUZXh0KG5ld1RleHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRWZXJiVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgdmVyYiA9IHNlbGVjdGVkVmVyYi52ZXJiO1xuICAgICAgICByZXR1cm4gbGFiZWwoVmVyYnNJbmZvLmdldCh2ZXJiKS5sYWJlbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaGluZ1RleHQoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHRoaW5nID0gaGlnaGxpZ2h0ZWRUaGluZy50aGluZztcbiAgICAgICAgbGV0IHRleHQgPSAnJztcbiAgICAgICAgaWYgKHRoaW5nICYmIHRoaW5nLm5hbWUpIHtcbiAgICAgICAgICAgIHRleHQgPSBsYWJlbCh0aGluZy5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNlbGVjdGVkVGhpbmdUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGxldCB2ZXJiID0gc2VsZWN0ZWRWZXJiLnZlcmI7XG4gICAgICAgIGxldCB2ZXJiSW5mbyA9IFZlcmJzSW5mby5nZXQodmVyYik7XG4gICAgICAgIGlmICghdmVyYkluZm8uc2luZ2xlT2JqZWN0ICYmIHNlbGVjdGVkVGhpbmcudGhpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiAnICcgKyBsYWJlbChzZWxlY3RlZFRoaW5nLnRoaW5nLm5hbWUpICsgJyAnICsgbGFiZWwodmVyYkluZm8uY29uanVjdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IFZlcmJzVUkgfSBmcm9tICcuL1ZlcmJzVUknO1xuaW1wb3J0IHsgQ3VycmVudEFjdGlvblVJIH0gZnJvbSAnLi9DdXJyZW50QWN0aW9uVUknO1xuaW1wb3J0IHsgSW52ZW50b3J5VUkgfSBmcm9tICcuL0ludmVudG9yeVVJJztcbmltcG9ydCB7IFJlZmxlY3RCdXR0b24gfSBmcm9tICcuL1JlZmxlY3RCdXR0b24nO1xuaW1wb3J0IHsgU291bmRCdXR0b25zVUkgfSBmcm9tICcuL1NvdW5kQnV0dG9ucyc7XG5cbmV4cG9ydCBjbGFzcyBHcmFwaGljVUkge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlQmFja2dyb3VuZCgpO1xuICAgICAgICBuZXcgVmVyYnNVSSgpO1xuICAgICAgICBuZXcgQ3VycmVudEFjdGlvblVJKCk7XG4gICAgICAgIG5ldyBJbnZlbnRvcnlVSSgpO1xuICAgICAgICBuZXcgUmVmbGVjdEJ1dHRvbigpO1xuICAgICAgICBuZXcgU291bmRCdXR0b25zVUkoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJhY2tncm91bmQoKTogdm9pZCB7XG4gICAgICAgIGxldCBsYXlvdXRTdGFydFBvc2l0aW9uID0gbGF5b3V0LlVJX1NUQVJUX1BPU0lUSU9OO1xuICAgICAgICBsZXQgYmFja2dyb3VuZCA9IHVpTGF5ZXJzLmd1aUJhY2tncm91bmQuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICBsYXlvdXRTdGFydFBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgICAgIGxheW91dFN0YXJ0UG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICAgICAgJ1VJX0JHJyk7XG4gICAgICAgIGJhY2tncm91bmQuYW5jaG9yLnNldFRvKDAsIDApO1xuICAgICAgICBiYWNrZ3JvdW5kLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgICAgICBiYWNrZ3JvdW5kLmlucHV0RW5hYmxlZCA9IHRydWU7XG5cbiAgICB9XG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcblxuaW50ZXJmYWNlIElJbnZlbnRvcnlJdGVtVUlPcHRpb25zIHtcbiAgICB0aGluZzogVGhpbmcsXG4gICAgaW5kZXg6IG51bWJlclxufVxuXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5SXRlbVVJIHtcblxuICAgIHByaXZhdGUgc3ByaXRlOiBQaGFzZXIuU3ByaXRlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJSW52ZW50b3J5SXRlbVVJT3B0aW9ucykge1xuICAgICAgICB0aGlzLmNyZWF0ZVNwcml0ZSgpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3ByaXRlLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNwcml0ZSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gbGF5b3V0LmdldFBvc2l0aW9uRm9yVUlJbnZlbnRvcnlJdGVtKHRoaXMub3B0aW9ucy5pbmRleCk7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gdWlMYXllcnMudmVyYkJ1dHRvbnMuY3JlYXRlKFxuICAgICAgICAgICAgcG9zaXRpb24ueCxcbiAgICAgICAgICAgIHBvc2l0aW9uLnksXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMudGhpbmcuaW52ZW50b3J5SW1hZ2VcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnNwcml0ZS5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNwcml0ZS5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZSA9IHRoaXMub3B0aW9ucy50aGluZy5nZXRGcmFtZUZvckludmVudG9yeSgpO1xuXG4gICAgICAgIHRoaXMuc3ByaXRlLmV2ZW50cy5vbklucHV0RG93bi5hZGQodGhpcy5vbkNsaWNrLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCh0aGlzLm9uSW5wdXRPdmVyLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKHRoaXMub25JbnB1dE91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNsaWNrKHJlY2VwdG9yOiBQaGFzZXIuU3ByaXRlLCBwb2ludGVyOiBQaGFzZXIuUG9pbnRlcik6IHZvaWQge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5TRUxFQ1RfVEhJTkcsIHtcbiAgICAgICAgICAgIHRoaW5nOiB0aGlzLm9wdGlvbnMudGhpbmcsXG4gICAgICAgICAgICBzZWNvbmRhcnlBY3Rpb246ICEhcG9pbnRlci5yaWdodEJ1dHRvbi5pc0Rvd25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbklucHV0T3ZlcigpOiB2b2lkIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5leGVjdXRlKEFjdGlvbnMuQ1VSU09SX09WRVJfVEhJTkcsIHRoaXMub3B0aW9ucy50aGluZyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbklucHV0T3V0KCk6IHZvaWQge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5DVVJTT1JfT1VUX1RISU5HLCB0aGlzLm9wdGlvbnMudGhpbmcpO1xuICAgIH1cblxufSIsImltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9MYXlvdXRNYW5hZ2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi4vLi4vUGhhc2VyJztcbmltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuL1N0eWxlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIElDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzL09ic2VydmFibGUnO1xuXG5leHBvcnQgZW51bSBQYWdpbmF0aW9uQnV0dG9uVHlwZSB7XG4gICAgVVAgPSAxLFxuICAgIERPV05cbn07XG5cbmludGVyZmFjZSBJSW52ZW50b3J5UGFnaW5hdGlvbkJ1dHRvbk9wdGlvbnMge1xuICAgIHR5cGU6IFBhZ2luYXRpb25CdXR0b25UeXBlLFxuICAgIGxheWVyPzogUGhhc2VyLkdyb3VwXG59XG5cbmV4cG9ydCBjbGFzcyBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uIHtcblxuICAgIHByaXZhdGUgYnV0dG9uOiBQaGFzZXIuQnV0dG9uO1xuICAgIHByaXZhdGUgY2xpY2tPYnNlcnZhYmxlOiBPYnNlcnZhYmxlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJSW52ZW50b3J5UGFnaW5hdGlvbkJ1dHRvbk9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5jbGlja09ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLm9wdGlvbnMubGF5ZXIgPSB0aGlzLm9wdGlvbnMubGF5ZXIgfHwgdWlMYXllcnMudmVyYkJ1dHRvbnM7XG4gICAgICAgIHRoaXMuY3JlYXRlQnV0dG9uKCk7XG4gICAgfVxuXG4gICAgaGlkZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWxwaGEgPSAwO1xuICAgIH1cblxuICAgIHNob3coKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFscGhhID0gMTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NsaWNrKGNhbGxiYWNrOiBJQ2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5jbGlja09ic2VydmFibGUucmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGlja09ic2VydmFibGUucmVtb3ZlQWxsT2JzZXJ2ZXJzKCk7XG4gICAgICAgIHRoaXMuYnV0dG9uLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvbigpOiB2b2lkIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uOiBJUG9pbnQ7XG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy50eXBlID09PSBQYWdpbmF0aW9uQnV0dG9uVHlwZS5VUCkge1xuICAgICAgICAgICAgcG9zaXRpb24gPSBsYXlvdXQuZ2V0UGFnaW5hdGlvbkJ1dHRvblVwKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGxheW91dC5nZXRQYWdpbmF0aW9uQnV0dG9uRG93bigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnV0dG9uID0gcGhhc2VyR2FtZS52YWx1ZS5hZGQuYnV0dG9uKFxuICAgICAgICAgICAgcG9zaXRpb24ueCxcbiAgICAgICAgICAgIHBvc2l0aW9uLnksXG4gICAgICAgICAgICAnUEFHSU5BVElPTl9CVVRUT05fVVAnLFxuICAgICAgICAgICAgdGhpcy5vbkNsaWNrLFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMixcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLnR5cGUgPT09IFBhZ2luYXRpb25CdXR0b25UeXBlLkRPV04pIHtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNjYWxlLnkgPSAtMTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLmFuY2hvci5zZXRUbygwLCAxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMubGF5ZXIuYWRkKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgdGhpcy5idXR0b24uZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsaWNrT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnMobnVsbCk7XG4gICAgfVxufSIsImltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBJbnZlbnRvcnlJdGVtVUkgfSBmcm9tICcuL0ludmVudG9yeUl0ZW1VSSc7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi9zdGF0ZS9BY3RpdmVJbnZlbnRvcnkuc2luZ2xldG9uJztcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4uL21vZGVscy9JbnZlbnRvcnknO1xuaW1wb3J0IHsgUGFnaW5hdGlvbkJ1dHRvblR5cGUsIEludmVudG9yeVBhZ2luYXRpb25CdXR0b24gfSBmcm9tICcuL0ludmVudG9yeVBhZ2luYXRpb25CdXR0b24nO1xuXG5jb25zdCBJVEVNU19QRVJfUEFHRSA9IDY7XG5cbmV4cG9ydCBjbGFzcyBJbnZlbnRvcnlVSSB7XG5cbiAgICBwcml2YXRlIGN1cnJlbnRQYWdlOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBpdGVtczogU2V0PEludmVudG9yeUl0ZW1VST47XG4gICAgcHJpdmF0ZSBjdXJyZW50SW52ZW50b3J5OiBJbnZlbnRvcnk7XG4gICAgcHJpdmF0ZSBwYWdpbmF0aW9uQnV0dG9uVXA6IEludmVudG9yeVBhZ2luYXRpb25CdXR0b247XG4gICAgcHJpdmF0ZSBwYWdpbmF0aW9uQnV0dG9uRG93bjogSW52ZW50b3J5UGFnaW5hdGlvbkJ1dHRvbjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gMDtcbiAgICAgICAgdGhpcy5jcmVhdGVCYWNrZ3JvdW5kKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlUGFnaW5hdGlvbkJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBTZXQoKTtcblxuICAgICAgICBhY3RpdmVJbnZlbnRvcnkuc3Vic2NyaWJlVG9DaGFuZ2UoKG5ld0ludmVudG9yeSkgPT4gdGhpcy5pbnZlbnRvcnlDaGFuZ2VkKG5ld0ludmVudG9yeSkpXG4gICAgfVxuXG4gICAgLy8gcmVmcmVzaCgpIHtcbiAgICAvLyAgICAgdGhpcy5pbnZlbnRvcnlDaGFuZ2VkKGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKSk7XG4gICAgLy8gfVxuXG4gICAgcHJpdmF0ZSBpbnZlbnRvcnlDaGFuZ2VkKG5ld0ludmVudG9yeTogSW52ZW50b3J5KTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VycmVudEludmVudG9yeSA9IG5ld0ludmVudG9yeTtcbiAgICAgICAgdGhpcy5jcmVhdGVJdGVtcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQmFja2dyb3VuZCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGxheW91dFN0YXJ0UG9zaXRpb24gPSBsYXlvdXQuSU5WRU5UT1JZX1NUQVJUX1BPU0lUSU9OO1xuXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kID0gdWlMYXllcnMudmVyYkJ1dHRvbnMuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICBsYXlvdXRTdGFydFBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgICAgIGxheW91dFN0YXJ0UG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICAgICAgJ1VJX0lOVl9CRycpO1xuICAgICAgICBiYWNrZ3JvdW5kLmFuY2hvci5zZXRUbygwLCAwKTtcbiAgICAgICAgYmFja2dyb3VuZC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVBhZ2luYXRpb25CdXR0b25zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25VcCA9IG5ldyBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uKHt0eXBlOiBQYWdpbmF0aW9uQnV0dG9uVHlwZS5VUCB9KTtcbiAgICAgICAgdGhpcy5wYWdpbmF0aW9uQnV0dG9uRG93biA9IG5ldyBJbnZlbnRvcnlQYWdpbmF0aW9uQnV0dG9uKHt0eXBlOiBQYWdpbmF0aW9uQnV0dG9uVHlwZS5ET1dOIH0pO1xuXG4gICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvblVwLnN1YnNjcmliZVRvQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nb1RvUHJldlBhZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wYWdpbmF0aW9uQnV0dG9uRG93bi5zdWJzY3JpYmVUb0NsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ29Ub05leHRQYWdlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlSXRlbXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveVByZXZJdGVtcygpO1xuICAgICAgICB0aGlzLm1ha2VTdXJlUGFnZUlzSW5zaWRlSW52KCk7XG5cbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgbGV0IGFycmF5T2ZUaGluZ3MgPSBBcnJheS5mcm9tKHRoaXMuY3VycmVudEludmVudG9yeS5pdGVtcyk7XG4gICAgICAgIGxldCBmaXJzdFBhZ2VFbGVtZW50ID0gSVRFTVNfUEVSX1BBR0UgKiB0aGlzLmN1cnJlbnRQYWdlO1xuICAgICAgICBsZXQgbmV4dFBhZ2VGaXJzdEVsZW1lbnQgPSBJVEVNU19QRVJfUEFHRSAqICh0aGlzLmN1cnJlbnRQYWdlICsgMSk7XG4gICAgICAgIGZvcihsZXQgaSA9IGZpcnN0UGFnZUVsZW1lbnQ7IChpIDwgbmV4dFBhZ2VGaXJzdEVsZW1lbnQpICYmIChpIDwgYXJyYXlPZlRoaW5ncy5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuYWRkKFxuICAgICAgICAgICAgICAgIG5ldyBJbnZlbnRvcnlJdGVtVUkoe1xuICAgICAgICAgICAgICAgICAgICB0aGluZzogYXJyYXlPZlRoaW5nc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93T3JIaWRlTmF2QnV0dG9ucygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvd09ySGlkZU5hdkJ1dHRvbnMoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMuY2FuR29Ub1ByZXZQYWdlKCkpIHtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvblVwLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvblVwLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuY2FuR29Ub05leHRQYWdlKCkpIHtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkJ1dHRvbkRvd24uc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uQnV0dG9uRG93bi5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lQcmV2SXRlbXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IGl0ZW0uZGVzdHJveSgpKTtcbiAgICAgICAgdGhpcy5pdGVtcy5jbGVhcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ29Ub05leHRQYWdlKCk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLmNhbkdvVG9OZXh0UGFnZSgpKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlKys7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUl0ZW1zKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbkdvVG9QcmV2UGFnZSgpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2UgPiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FuR29Ub05leHRQYWdlKCk6IEJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50SW52ZW50b3J5Lml0ZW1zLnNpemUgPiAoSVRFTVNfUEVSX1BBR0UgKiAodGhpcy5jdXJyZW50UGFnZSArIDEpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1ha2VTdXJlUGFnZUlzSW5zaWRlSW52KCk6IHZvaWQge1xuICAgICAgICBsZXQgZmlyc3RQYWdlRWxlbWVudCA9IElURU1TX1BFUl9QQUdFICogdGhpcy5jdXJyZW50UGFnZTtcbiAgICAgICAgaWYoZmlyc3RQYWdlRWxlbWVudCA+PSB0aGlzLmN1cnJlbnRJbnZlbnRvcnkuaXRlbXMuc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdvVG9QcmV2UGFnZSgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5jYW5Hb1RvUHJldlBhZ2UoKSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZS0tO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVJdGVtcygpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuXG5jb25zdCBWRVJCX0JVVFRPTl9IRUlHSFQ6IG51bWJlciA9IDM2O1xuY29uc3QgQ1VSUkVOVF9BQ1RJT05fSU5GT19IRUlHSFQgPSA0MDtcbmNvbnN0IFZFUkJfQlVUVE9OX1dJRFRIID0gMTUwO1xuY29uc3QgUkVGTEVDVF9CVVRUT05fV0lEVEggPSBWRVJCX0JVVFRPTl9XSURUSDtcblxuY29uc3QgQ1VSUkVOVF9BQ1RJT05fSU5GT19QQURESU5HX1ggPSA1O1xuY29uc3QgQ1VSUkVOVF9BQ1RJT05fSU5GT19QQURESU5HX1kgPSA3O1xuXG5jb25zdCBWRVJCU19ST1dTID0gMztcbmNvbnN0IFZFUkJfQ09MVU1OUyA9IDM7XG5cbmNvbnN0IElOVl9ST1dTID0gMjtcbmNvbnN0IElOVl9DT0xVTU5TID0gMztcbmNvbnN0IElOVl9JVEVNX1dJRFRIID0gMTM2O1xuY29uc3QgSU5WX0lURU1fSEVJR0hUID0gNTI7XG5cbmNvbnN0IENPTlZFUlNBVElPTl9MSU5FX0hFSUdIVCA9IENVUlJFTlRfQUNUSU9OX0lORk9fSEVJR0hUO1xuY29uc3QgQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19YID0gNTtcbmNvbnN0IENPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWSA9IDY7XG5cbmNvbnN0IExPR09fU0laRTogSVBvaW50ID0ge1xuICAgIHg6IDUwMixcbiAgICB5OiAxNzVcbn07XG5jb25zdCBUSEVfR0FNRV9TSVpFOiBJUG9pbnQgPSB7XG4gICAgeDogMTUwLFxuICAgIHk6IDQzXG59O1xuY29uc3QgTEFOR1VBR0VfQlVUVE9OX1NJWkU6IElQb2ludCA9IHtcbiAgICB4OiAxMzYsXG4gICAgeTogMjdcbn07XG5cbmNvbnN0IFNPVU5EX0JVVFRPTl9TSVpFOiBJUG9pbnQgPSB7XG4gICAgeDogMzYsXG4gICAgeTogMzZcbn07XG5cbmNsYXNzIExheW91dE1hbmFnZXIge1xuXG4gICAgTEFZT1VUX1dJRFRIOiBudW1iZXIgPSAxMDY2O1xuICAgIExBWU9VVF9IRUlHSFQ6IG51bWJlciA9IDYwMDtcbiAgICBMQVlPVVRfWk9PTTogbnVtYmVyID0gMjtcbiAgICBcbiAgICBMQVlPVVRfREVGQVVMVF9NQVJHSU46IG51bWJlciA9IDE7XG4gICAgVkVSQl9CVVRUT05fTUFSR0lOOiBudW1iZXIgPSB0aGlzLkxBWU9VVF9ERUZBVUxUX01BUkdJTjtcblxuICAgIGdldCBXSURUSCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5MQVlPVVRfV0lEVEggLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBIRUlHSFQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuTEFZT1VUX0hFSUdIVCAvIHRoaXMuTEFZT1VUX1pPT007XG4gICAgfVxuXG4gICAgZ2V0IFZFUkJTX0hFSUdIVCgpOiBudW1iZXIge1xuICAgICAgICBsZXQgbWFyZ2luWSA9IChWRVJCU19ST1dTICsgMSkgKiB0aGlzLlZFUkJfQlVUVE9OX01BUkdJTjtcbiAgICAgICAgbGV0IGhlaWdodFkgPSBWRVJCU19ST1dTICogdGhpcy5WRVJCX0JVVFRPTl9IRUlHSFQ7XG4gICAgICAgIHJldHVybiBtYXJnaW5ZICsgaGVpZ2h0WTtcbiAgICB9XG5cbiAgICBnZXQgVkVSQl9CVVRUT05fSEVJR0hUKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBWRVJCX0JVVFRPTl9IRUlHSFQgLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBWRVJCU19ZX1NUQVJUKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLkhFSUdIVCAtIHRoaXMuVkVSQlNfSEVJR0hUO1xuICAgIH1cblxuICAgIGdldCBDVVJSRU5UX0FDVElPTl9JTkZPX0hFSUdIVCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQ1VSUkVOVF9BQ1RJT05fSU5GT19IRUlHSFQgLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBVSV9TVEFSVF9QT1NJVElPTigpOiBJUG9pbnQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IHRoaXMuVkVSQlNfWV9TVEFSVCAtIHRoaXMuQ1VSUkVOVF9BQ1RJT05fSU5GT19IRUlHSFRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXQgVkVSQl9CVVRUT05fV0lEVEgoKSB7XG4gICAgICAgIHJldHVybiBWRVJCX0JVVFRPTl9XSURUSCAvIHRoaXMuTEFZT1VUX1pPT007XG4gICAgfVxuXG4gICAgZ2V0IFJFRkxFQ1RfQlVUVE9OX1dJRFRIKCkge1xuICAgICAgICByZXR1cm4gUkVGTEVDVF9CVVRUT05fV0lEVEggLyB0aGlzLkxBWU9VVF9aT09NO1xuICAgIH1cblxuICAgIGdldCBDVVJSRU5UX0FDVElPTl9QT1NJVElPTigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IENVUlJFTlRfQUNUSU9OX0lORk9fUEFERElOR19YLFxuICAgICAgICAgICAgeTogdGhpcy5IRUlHSFQgLSB0aGlzLlZFUkJTX0hFSUdIVCAtIHRoaXMuQ1VSUkVOVF9BQ1RJT05fSU5GT19IRUlHSFQgKyBDVVJSRU5UX0FDVElPTl9JTkZPX1BBRERJTkdfWVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldCBJTlZFTlRPUllfU1RBUlRfUE9TSVRJT04oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFZlcmJCdXR0b25Qb3NpdGlvbih7XG4gICAgICAgICAgICB4OiBWRVJCX0NPTFVNTlMsXG4gICAgICAgICAgICB5OiAwXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBJTlZfSVRFTV9XSURUSCgpIHtcbiAgICAgICAgcmV0dXJuIElOVl9JVEVNX1dJRFRIIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgSU5WX0lURU1fSEVJR0hUKCkge1xuICAgICAgICByZXR1cm4gSU5WX0lURU1fSEVJR0hUIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXRWZXJiQnV0dG9uUG9zaXRpb24odmVyYkdyaWRQb3NpdGlvbjogSVBvaW50KTogSVBvaW50IHtcbiAgICAgICAgbGV0IG1hcmdpblggPSAodmVyYkdyaWRQb3NpdGlvbi54ICsgMikgKiB0aGlzLlZFUkJfQlVUVE9OX01BUkdJTjtcbiAgICAgICAgbGV0IHBvc2l0aW9uWCA9IHRoaXMuUkVGTEVDVF9CVVRUT05fV0lEVEggKyAodmVyYkdyaWRQb3NpdGlvbi54ICogdGhpcy5WRVJCX0JVVFRPTl9XSURUSCk7XG5cbiAgICAgICAgbGV0IG1hcmdpblkgPSAodmVyYkdyaWRQb3NpdGlvbi55ICsgMSkgKiB0aGlzLlZFUkJfQlVUVE9OX01BUkdJTjtcbiAgICAgICAgbGV0IHBvc2l0aW9uWSA9IHZlcmJHcmlkUG9zaXRpb24ueSAqIHRoaXMuVkVSQl9CVVRUT05fSEVJR0hUO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBtYXJnaW5YICsgcG9zaXRpb25YLFxuICAgICAgICAgICAgeTogdGhpcy5WRVJCU19ZX1NUQVJUICsgbWFyZ2luWSArIHBvc2l0aW9uWVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9uRm9yVUlJbnZlbnRvcnlJdGVtKGluZGV4OiBudW1iZXIpOiBJUG9pbnQge1xuICAgICAgICBsZXQge2NvbHVtbiwgcm93fSA9IHRoaXMuZ2V0SW52ZW50b3J5SXRlbVBvc2l0aW9uKGluZGV4KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnZlbnRvcnlQb3NpdGlvbkZyb21Sb3dBbmRDb2x1bW4ocm93LCBjb2x1bW4pO1xuICAgIH1cblxuICAgIGdldFJlZmxlY3RCdXR0b25Qb3NpdGlvbigpOiBJUG9pbnQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5MQVlPVVRfREVGQVVMVF9NQVJHSU4sXG4gICAgICAgICAgICB5OiB0aGlzLlZFUkJTX1lfU1RBUlQgKyB0aGlzLkxBWU9VVF9ERUZBVUxUX01BUkdJTlxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFJlZmxlY3RCdXR0b25TaXplKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLlZFUkJTX0hFSUdIVCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLlJFRkxFQ1RfQlVUVE9OX1dJRFRIXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0U291bmRCdXR0b25Qb3NpdGlvbigpOiBJUG9pbnQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5XSURUSCAtIFNPVU5EX0JVVFRPTl9TSVpFLnggLSB0aGlzLkxBWU9VVF9ERUZBVUxUX01BUkdJTixcbiAgICAgICAgICAgIHk6IHRoaXMuTEFZT1VUX0RFRkFVTFRfTUFSR0lOXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IENPTlZFUlNBVElPTl9MSU5FX0hFSUdIVCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQ09OVkVSU0FUSU9OX0xJTkVfSEVJR0hUIC8gdGhpcy5MQVlPVVRfWk9PTTtcbiAgICB9XG5cbiAgICBnZXQgQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19YKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBDT05WRVJTQVRJT05fTElORV9QQURESU5HX1g7XG4gICAgfVxuXG4gICAgZ2V0IENPTlZFUlNBVElPTl9MSU5FX1BBRERJTkdfWSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gQ09OVkVSU0FUSU9OX0xJTkVfUEFERElOR19ZO1xuICAgIH1cblxuICAgIGdldCBMT0dPX1BPU0lUSU9OKCk6IElQb2ludCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBNYXRoLnJvdW5kKCh0aGlzLldJRFRIIC0gTE9HT19TSVpFLngpLzIpLFxuICAgICAgICAgICAgeTogMjBcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXQgVEhFX0dBTUVfUE9TSVRJT04oKTogSVBvaW50IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IE1hdGgucm91bmQoKHRoaXMuV0lEVEggLSBUSEVfR0FNRV9TSVpFLngpLzIpLFxuICAgICAgICAgICAgeTogMTU1XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IEVOR0xJU0hfQlVUVE9OX1BPU0lUSU9OKCk6IElQb2ludCB7XG4gICAgICAgIGxldCB4ID0gTWF0aC5yb3VuZCh0aGlzLldJRFRILzIpIC0gTEFOR1VBR0VfQlVUVE9OX1NJWkUueCAtIDU7XG4gICAgICAgIGxldCB5ID0gdGhpcy5IRUlHSFQgLSBMQU5HVUFHRV9CVVRUT05fU0laRS55IC0gMzA7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldCBTUEFOSVNIX0JVVFRPTl9QT1NJVElPTigpOiBJUG9pbnQge1xuICAgICAgICBsZXQgeCA9IE1hdGgucm91bmQodGhpcy5XSURUSC8yKSArIDU7XG4gICAgICAgIGxldCB5ID0gdGhpcy5IRUlHSFQgLSBMQU5HVUFHRV9CVVRUT05fU0laRS55IC0gMzA7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9uRm9yQ29udmVyc2F0aW9uTGluZShpbmRleDogbnVtYmVyKTogSVBvaW50IHtcbiAgICAgICAgbGV0IG1hcmdpblkgPSA4ICsgKChpbmRleCArIDEpICogdGhpcy5MQVlPVVRfREVGQVVMVF9NQVJHSU4pO1xuICAgICAgICBsZXQgcG9zaXRpb25ZID0gdGhpcy5DT05WRVJTQVRJT05fTElORV9IRUlHSFQgKiBpbmRleDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMuTEFZT1VUX0RFRkFVTFRfTUFSR0lOLFxuICAgICAgICAgICAgeTogdGhpcy5VSV9TVEFSVF9QT1NJVElPTi55ICsgbWFyZ2luWSArIHBvc2l0aW9uWVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFBhZ2luYXRpb25CdXR0b25VcCgpOiBJUG9pbnQge1xuICAgICAgICBsZXQgY29sdW1uID0gSU5WX0NPTFVNTlM7XG4gICAgICAgIGxldCByb3cgPSAwO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmdldEludmVudG9yeVBvc2l0aW9uRnJvbVJvd0FuZENvbHVtbihyb3csIGNvbHVtbik7XG4gICAgfVxuXG4gICAgZ2V0UGFnaW5hdGlvbkJ1dHRvbkRvd24oKTogSVBvaW50IHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IElOVl9DT0xVTU5TO1xuICAgICAgICBsZXQgcm93ID0gMTtcblxuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnZlbnRvcnlQb3NpdGlvbkZyb21Sb3dBbmRDb2x1bW4ocm93LCBjb2x1bW4pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW52ZW50b3J5UG9zaXRpb25Gcm9tUm93QW5kQ29sdW1uKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlcik6IElQb2ludCB7XG4gICAgICAgIGxldCBpbml0aWFsUG9zaXRpb24gPSB0aGlzLklOVkVOVE9SWV9TVEFSVF9QT1NJVElPTjtcblxuICAgICAgICBsZXQgbWFyZ2luWCA9IChjb2x1bW4gKyAxKSAqIHRoaXMuVkVSQl9CVVRUT05fTUFSR0lOO1xuICAgICAgICBsZXQgcG9zaXRpb25YID0gY29sdW1uICogdGhpcy5JTlZfSVRFTV9XSURUSDtcblxuICAgICAgICBsZXQgbWFyZ2luWSA9IChyb3cgKyAxKSAqIHRoaXMuVkVSQl9CVVRUT05fTUFSR0lOO1xuICAgICAgICBsZXQgcG9zaXRpb25ZID0gcm93ICogdGhpcy5JTlZfSVRFTV9IRUlHSFQ7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IG1hcmdpblggKyBwb3NpdGlvblggKyBpbml0aWFsUG9zaXRpb24ueCxcbiAgICAgICAgICAgIHk6IG1hcmdpblkgKyBwb3NpdGlvblkgKyBpbml0aWFsUG9zaXRpb24ueVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW52ZW50b3J5SXRlbVBvc2l0aW9uKGluZGV4OiBudW1iZXIpOiB7Y29sdW1uOiBudW1iZXIsIHJvdzogbnVtYmVyfSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBpbmRleCAlIElOVl9DT0xVTU5TO1xuICAgICAgICBsZXQgcm93ID0gTWF0aC5mbG9vcihpbmRleCAvIElOVl9DT0xVTU5TKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbHVtbjogY29sdW1uLFxuICAgICAgICAgICAgcm93OiByb3dcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBsYXlvdXQgPSBuZXcgTGF5b3V0TWFuYWdlcigpOyIsImltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi91dGlscy9JbnRlcmZhY2VzJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBsYWJlbCB9IGZyb20gJy4uL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuaW1wb3J0IHsgVGV4dFdpdGhTaGFkb3cgfSBmcm9tICcuL1RleHRXaXRoU2hhZG93JztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcblxuZXhwb3J0IGNsYXNzIFJlZmxlY3RCdXR0b24ge1xuICAgIHByaXZhdGUgcG9zaXRpb246IElQb2ludDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbGF5b3V0LmdldFJlZmxlY3RCdXR0b25Qb3NpdGlvbigpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlQnV0dG9uKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlVGV4dCgpO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCdXR0b24oKTogdm9pZCB7XG4gICAgICAgIGxldCBidXR0b24gPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC5idXR0b24oXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLngsXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnksXG4gICAgICAgICAgICAnUkVGTEVDVF9CVVRUT05fQkcnLFxuICAgICAgICAgICAgdGhpcy5vbkNsaWNrLFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMixcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgdWlMYXllcnMudmVyYkJ1dHRvbnMuYWRkKGJ1dHRvbik7XG4gICAgICAgIGJ1dHRvbi5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVRleHQoKTogdm9pZCB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMucG9zaXRpb24ueCArIGxheW91dC5nZXRSZWZsZWN0QnV0dG9uU2l6ZSgpLndpZHRoIC8gMixcbiAgICAgICAgICAgIHk6IHRoaXMucG9zaXRpb24ueSArIGxheW91dC5nZXRSZWZsZWN0QnV0dG9uU2l6ZSgpLmhlaWdodCAvIDJcbiAgICAgICAgfTtcbiAgICAgICAgbmV3IFRleHRXaXRoU2hhZG93KHtcbiAgICAgICAgICAgIGluaXRpYWxUZXh0OiBsYWJlbCgnUmVmbGVjdCcpLFxuICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgZml4ZWRUb0NhbWVyYTogdHJ1ZSxcbiAgICAgICAgICAgIGxheWVyOiB1aUxheWVycy52ZXJiQnV0dG9ucyxcbiAgICAgICAgICAgIGFuY2hvcjoge1xuICAgICAgICAgICAgICAgIHg6IDAuNSxcbiAgICAgICAgICAgICAgICB5OiAwLjVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLmV4ZWN1dGUoQWN0aW9ucy5SRUZMRUNUKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tICcuL0xheW91dE1hbmFnZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IHBoYXNlciB9IGZyb20gJy4uLy4uL1BoYXNlcic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgdWlMYXllcnMgfSBmcm9tICcuL1VJTGF5ZXJzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBzb3VuZCB9IGZyb20gJy4uL3NvdW5kL1NvdW5kTWFuYWdlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBJQ2FsbGJhY2sgfSBmcm9tICcuLi91dGlscy9PYnNlcnZhYmxlJztcblxuZXhwb3J0IGNsYXNzIFNvdW5kQnV0dG9uc1VJIHtcbiAgICBwcml2YXRlIGN1cnJlbnRCdXR0b246IFNvdW5kQnV0dG9uO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQnV0dG9ucyhzb3VuZC5pc09uKCkpO1xuICAgICAgICBzb3VuZC5vbkNoYW5nZS5yZWdpc3Rlck9ic2VydmVyKChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b25zKG5ld1ZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVCdXR0b25zKGlzU291bmRPbjogQm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3lDdXJyZW50QnV0dG9uKCk7XG4gICAgICAgIGlmKGlzU291bmRPbikge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uID0gbmV3IERpc2FibGVTb3VuZEJ1dHRvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uID0gbmV3IEVuYWJsZVNvdW5kQnV0dG9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lDdXJyZW50QnV0dG9uKCk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRCdXR0b24pIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b24gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgSVNvdW5kQnV0dG9uT3B0aW9ucyB7XG4gICAgYmc6IHN0cmluZ1xufVxuXG5jbGFzcyBTb3VuZEJ1dHRvbiB7XG4gICAgcHJvdGVjdGVkIHBvc2l0aW9uOiBJUG9pbnQ7XG4gICAgcHJvdGVjdGVkIGJ1dHRvbjogUGhhc2VyLkJ1dHRvbjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogSVNvdW5kQnV0dG9uT3B0aW9ucykge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbGF5b3V0LmdldFNvdW5kQnV0dG9uUG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5idXR0b24gPSBwaGFzZXJHYW1lLnZhbHVlLmFkZC5idXR0b24oXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLngsXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnksXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuYmcsXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2ssXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAyLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICB1aUxheWVycy5zb3VuZEJ1dHRvbnMuYWRkKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgdGhpcy5idXR0b24uZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5idXR0b24pIHtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbkNsaWNrKCk6IHZvaWQge31cbn1cblxuY2xhc3MgRGlzYWJsZVNvdW5kQnV0dG9uIGV4dGVuZHMgU291bmRCdXR0b24ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih7IGJnOiAnRElTQUJMRV9CVVRUT05fQkcnIH0pO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgb25DbGljaygpOiB2b2lkIHtcbiAgICAgICAgc291bmQudHVybk9mZigpO1xuICAgIH1cbn1cblxuY2xhc3MgRW5hYmxlU291bmRCdXR0b24gZXh0ZW5kcyBTb3VuZEJ1dHRvbiAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih7IGJnOiAnRU5BQkxFX0JVVFRPTl9CRycgfSk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICBzb3VuZC50dXJuT24oKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vbW9kZWxzL1BsYXllcic7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBUZXh0SW5TY2VuZSB9IGZyb20gJy4vVGV4dEluU2NlbmUnO1xuaW1wb3J0IHsgbGFiZWwgfSBmcm9tICcuLi9zdG9yZXMvTGFiZWxzLnN0b3JlJztcblxuaW50ZXJmYWNlIElTcGVlY2hCdWJibGVPcHRpb25zIHtcbiAgICBvd25lcjogUGxheWVyIHwgVGhpbmcsXG4gICAgZm9yZWdyb3VuZFRleHRTdHlsZT86IHN0cmluZyxcbiAgICBzaGFkb3dUZXh0U3R5bGU/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIFNwZWVjaEJ1YmJsZSB7XG5cbiAgICBwcml2YXRlIHRleHRCZWluZ1NhaWQ6IFRleHRJblNjZW5lO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJU3BlZWNoQnViYmxlT3B0aW9ucykge31cblxuICAgIHNheSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5kZXN0cm95UHJldlRleHQoKTtcbiAgICAgICAgdGhpcy50ZXh0QmVpbmdTYWlkID0gbmV3IFRleHRJblNjZW5lKHtcbiAgICAgICAgICAgIHRleHQ6IGxhYmVsKHRleHQpLFxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMub3B0aW9ucy5vd25lci5nZXRQb3NpdGlvbk9uVG9wKCksXG4gICAgICAgICAgICBhdXRvRGVzdHJveTogdHJ1ZSxcbiAgICAgICAgICAgIGZvcmVncm91bmRUZXh0U3R5bGU6IHRoaXMub3B0aW9ucy5mb3JlZ3JvdW5kVGV4dFN0eWxlLFxuICAgICAgICAgICAgc2hhZG93VGV4dFN0eWxlOiB0aGlzLm9wdGlvbnMuc2hhZG93VGV4dFN0eWxlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0QmVpbmdTYWlkLnByb21pc2U7XG4gICAgfVxuXG4gICAgaXNTaG93bigpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy50ZXh0QmVpbmdTYWlkO1xuICAgIH1cblxuICAgIHVwZGF0ZVBvc2l0aW9uKCk6IHZvaWQge1xuICAgICAgICBpZighdGhpcy5pc1Nob3duKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRleHRCZWluZ1NhaWQuc2V0UG9zaXRpb24odGhpcy5vcHRpb25zLm93bmVyLmdldFBvc2l0aW9uT25Ub3AoKSk7XG4gICAgfVxuXG4gICAgc2V0Rm9yZWdyb3VuZFRleHRTdHlsZShuZXdTdHlsZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5mb3JlZ3JvdW5kVGV4dFN0eWxlID0gbmV3U3R5bGU7XG4gICAgfVxuXG4gICAgc2V0U2hhZG93VGV4dFN0eWxlKG5ld1N0eWxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNoYWRvd1RleHRTdHlsZSA9IG5ld1N0eWxlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVzdHJveVByZXZUZXh0KCk6dm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRleHRCZWluZ1NhaWQpIHtcbiAgICAgICAgICAgIHRoaXMudGV4dEJlaW5nU2FpZC5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnRleHRCZWluZ1NhaWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IHN0eWxlID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgREVGQVVMVF9GT05UX1NJWkU6IDgsXG4gICAgRk9OVF9TSEFET1dfWDogMSxcbiAgICBGT05UX1NIQURPV19ZOiAxLFxuICAgIENBTUVSQV9FQVNJTkdfRkFDVE9SOiAwLjAyNSxcbiAgICBERUZBVUxUX0FOSU1BVElPTl9TUEVFRDogNlxufSk7XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vdXRpbHMvSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBzdHlsZSB9IGZyb20gJy4vU3R5bGUnO1xuaW1wb3J0IHsgVGV4dFdpdGhTaGFkb3cgfSBmcm9tICcuL1RleHRXaXRoU2hhZG93JztcbmltcG9ydCB7IHVpTGF5ZXJzIH0gZnJvbSAnLi9VSUxheWVycy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgc2NlbmVzIH0gZnJvbSAnLi4vc3RhdGUvU2NlbmVzLnNpbmdsZXRvbic7XG5cbmludGVyZmFjZSBJVGV4dEluU2NlbmVPcHRpb25zIHtcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgcG9zaXRpb246IElQb2ludCxcbiAgICB3b3Jkc1Blck1pbnV0ZT86IG51bWJlcixcbiAgICBtaW5EZXN0cm95VGltZT86IG51bWJlcixcbiAgICB3aWR0aD86IG51bWJlcixcbiAgICBhdXRvRGVzdHJveT86IEJvb2xlYW4sXG4gICAgYW5jaG9yPzogSVBvaW50LFxuICAgIHBhZGRpbmdJblNjcmVlbj86IG51bWJlcixcbiAgICBmb3JlZ3JvdW5kVGV4dFN0eWxlPzogc3RyaW5nLFxuICAgIHNoYWRvd1RleHRTdHlsZT86IHN0cmluZ1xufVxuXG5jb25zdCBERUZBVUxUX1RFWFRfT1BUSU9OUyA9IE9iamVjdC5mcmVlemUoe1xuICAgIHdvcmRzUGVyTWludXRlOiAxMjAsXG4gICAgbWluRGVzdHJveVRpbWU6IDIwMDAsXG4gICAgdGV4dDogJycsXG4gICAgcG9zaXRpb246IHsgeDogMTAwLCB5OiAxMDB9LFxuICAgIHdpZHRoOiAzMCxcbiAgICBhdXRvRGVzdHJveTogZmFsc2UsXG4gICAgYW5jaG9yOiB7IHg6IDAsIHk6IDB9LFxuICAgIHBhZGRpbmdJblNjcmVlbjogNVxufSk7XG5cbmV4cG9ydCBjbGFzcyBUZXh0SW5TY2VuZSB7XG5cbiAgICBwcml2YXRlIGN1cnJlbnRUZXh0OiBUZXh0V2l0aFNoYWRvdztcbiAgICBwcml2YXRlIHByb21pc2VUb0Rlc3Ryb3k6IFByb21pc2U8YW55PjtcbiAgICBwcml2YXRlIHJlc29sdmVDYWxsYmFjazogKCkgPT4gdm9pZDtcbiAgICBwcml2YXRlIHRpbWVvdXRUb0Rlc3Ryb3k6IG51bWJlcjtcbiAgICBwcml2YXRlIHRleHRJbkxpbmVzOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbjogSVBvaW50O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJVGV4dEluU2NlbmVPcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfVEVYVF9PUFRJT05TLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zLnBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5jcmVhdGVUZXh0KCk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b0Rlc3Ryb3kpIHtcbiAgICAgICAgICAgIHRoaXMucHJvbWlzZVRvRGVzdHJveSA9IHRoaXMuYXV0b0Rlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBwcm9taXNlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlVG9EZXN0cm95O1xuICAgIH1cblxuICAgIHNldFBvc2l0aW9uKG5ld1Bvc2l0aW9uOiBJUG9pbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1Bvc2l0aW9uO1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRUZXh0KSB7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0LnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRleHQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVzb2x2ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVDYWxsYmFjaygpO1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQb3NpdGlvbigpOiBJUG9pbnQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5nZXRYUG9zaXRpb25Gb3JUZXh0KHRoaXMudGV4dEluTGluZXMpLFxuICAgICAgICAgICAgeTogdGhpcy5nZXRZUG9zaXRpb25Gb3JUZXh0KHRoaXMudGV4dEluTGluZXMpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVRleHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGV4dEluTGluZXMgPSB0aGlzLmFkZExpbmVzU2VwYXJhdG9ycyh0aGlzLm9wdGlvbnMudGV4dCwgdGhpcy5vcHRpb25zLndpZHRoKTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRUZXh0ID0gbmV3IFRleHRXaXRoU2hhZG93KHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLmdldFBvc2l0aW9uKCksXG4gICAgICAgICAgICBsYXllcjogdWlMYXllcnMudGV4dEluU2NlbmUsXG4gICAgICAgICAgICBpbml0aWFsVGV4dDogdGhpcy50ZXh0SW5MaW5lcyxcbiAgICAgICAgICAgIGFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGFuY2hvcjogdGhpcy5vcHRpb25zLmFuY2hvcixcbiAgICAgICAgICAgIGZvcmVncm91bmRUZXh0U3R5bGU6IHRoaXMub3B0aW9ucy5mb3JlZ3JvdW5kVGV4dFN0eWxlLFxuICAgICAgICAgICAgc2hhZG93VGV4dFN0eWxlOiB0aGlzLm9wdGlvbnMuc2hhZG93VGV4dFN0eWxlXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBhZGRMaW5lc1NlcGFyYXRvcnModGV4dDogc3RyaW5nLCBtYXhMaW5lTGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcge1xuXG4gICAgICAgIGxldCB3b3JkcyA9IHRleHQuc3BsaXQoJyAnKTtcbiAgICAgICAgbGV0IGxpbmVzID0gWycnXTtcbiAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gMDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvL0lmIGEgd29yZCBpcyB0b28gYmlnIGZvciB0aGlzIGxpbmUsIGFkZCB0byBuZXh0XG4gICAgICAgICAgICBpZiAoKGxpbmVzW2N1cnJlbnRMaW5lXS5sZW5ndGggKyB3b3Jkc1tpXS5sZW5ndGgpID49IG1heExpbmVMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKCcnICsgd29yZHNbaV0pO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lICsrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5lc1tjdXJyZW50TGluZV0gKz0gJyAnICsgd29yZHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0WFBvc2l0aW9uRm9yVGV4dCh0ZXh0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBsZXQgbG9uZ2VzdExpbmVMZW5ndGggPSB0aGlzLmdldExvbmdlc3RMaW5lTGVuZ3RoKHRleHQpO1xuICAgICAgICBsZXQgbWF4V2lkdGggPSBsb25nZXN0TGluZUxlbmd0aCAqIHN0eWxlLkRFRkFVTFRfRk9OVF9TSVpFO1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5wb3NpdGlvbi54IC0gKG1heFdpZHRoIC8gMik7XG5cbiAgICAgICAgcmVzdWx0ID0gTWF0aC5tYXgocmVzdWx0LCB0aGlzLm9wdGlvbnMucGFkZGluZ0luU2NyZWVuKTtcbiAgICAgICAgcmVzdWx0ID0gTWF0aC5taW4ocmVzdWx0LCB0aGlzLmdldE1heFhGb3JUZXh0KG1heFdpZHRoKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE1heFhGb3JUZXh0KHRleHRXaWR0aDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHNjZW5lV2lkdGggPSBzY2VuZXMuY3VycmVudFNjZW5lLnNjZW5lQm91bmRzLndpZHRoO1xuICAgICAgICByZXR1cm4gc2NlbmVXaWR0aCAtIHRoaXMub3B0aW9ucy5wYWRkaW5nSW5TY3JlZW4gLSB0ZXh0V2lkdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRZUG9zaXRpb25Gb3JUZXh0KHRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGxldCBsaW5lcyA9IHRleHQuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICAgICAgbGV0IHRvdGFsSGVpZ2h0ID0gbGluZXMgKiBzdHlsZS5ERUZBVUxUX0ZPTlRfU0laRTtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueSAtIHRvdGFsSGVpZ2h0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TG9uZ2VzdExpbmVMZW5ndGgodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGxldCBtYXhMZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYXhMZW5ndGggPSBNYXRoLm1heChtYXhMZW5ndGgsIGxpbmVzW2ldLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1heExlbmd0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGF1dG9EZXN0cm95KCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxldCBkZWZlcnJlZCA9IG5ldyBQcm9taXNlKChyZXNvbHZlQ2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZUNhbGxiYWNrID0gcmVzb2x2ZUNhbGxiYWNrO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHRpbWVUb0Rlc3Ryb3kgPSB0aGlzLmdldFRpbWVUb0Rlc3Ryb3lGcm9tVGV4dCh0aGlzLm9wdGlvbnMudGV4dCk7XG4gICAgICAgIHRoaXMudGltZW91dFRvRGVzdHJveSA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kZXN0cm95KCksIHRpbWVUb0Rlc3Ryb3kpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaW1lVG9EZXN0cm95RnJvbVRleHQodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHdvcmRzSW5UZXh0ID0gdGV4dC5zcGxpdCgnICcpLmxlbmd0aDtcbiAgICAgICAgbGV0IHRpbWVUb0Rlc3Ryb3kgPSAoMTAwMCAqIHdvcmRzSW5UZXh0ICogNjApIC8gdGhpcy5vcHRpb25zLndvcmRzUGVyTWludXRlO1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5vcHRpb25zLm1pbkRlc3Ryb3lUaW1lLCB0aW1lVG9EZXN0cm95KTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IElQb2ludCB9IGZyb20gJy4uL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgcGhhc2VyR2FtZSB9IGZyb20gJy4uL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcbmltcG9ydCB7IHN0eWxlIH0gZnJvbSAnLi9TdHlsZSc7XG5cbmludGVyZmFjZSBJVGV4dFdpdGhTaGFkb3dPcHRpb25zIHtcbiAgICBwb3NpdGlvbjogSVBvaW50LFxuICAgIGxheWVyOiBQaGFzZXIuR3JvdXAsXG4gICAgaW5pdGlhbFRleHQ/OiBzdHJpbmcsXG4gICAgZml4ZWRUb0NhbWVyYT86IEJvb2xlYW4sXG4gICAgYW5jaG9yPzogSVBvaW50LFxuICAgIGFsaWduPzogc3RyaW5nLFxuICAgIGZvcmVncm91bmRUZXh0U3R5bGU/OiBzdHJpbmcsXG4gICAgc2hhZG93VGV4dFN0eWxlPzogc3RyaW5nXG59XG5cbmNvbnN0IERFRkFVTFRfRk9SRUdST1VORF9URVhUID0gJ0ZPTlRfMzJfV0hJVEUnO1xuY29uc3QgREVGQVVMVF9TSEFET1dfVEVYVCA9ICdGT05UXzMyX0JMQUNLJztcblxuXG5leHBvcnQgY2xhc3MgVGV4dFdpdGhTaGFkb3cge1xuICAgIHByaXZhdGUgc2hhZG93VGV4dDogUGhhc2VyLkJpdG1hcFRleHQ7XG4gICAgcHJpdmF0ZSB0ZXh0OiBQaGFzZXIuQml0bWFwVGV4dDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogSVRleHRXaXRoU2hhZG93T3B0aW9ucykge1xuICAgICAgICBsZXQgYW5jaG9yOiBJUG9pbnQgPSB0aGlzLm9wdGlvbnMuYW5jaG9yIHx8IHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2hhZG93VGV4dCA9IHBoYXNlckdhbWUudmFsdWUuYWRkLmJpdG1hcFRleHQoXG4gICAgICAgICAgICAxICsgb3B0aW9ucy5wb3NpdGlvbi54LFxuICAgICAgICAgICAgMSArIG9wdGlvbnMucG9zaXRpb24ueSxcbiAgICAgICAgICAgIHRoaXMuc2hhZG93VGV4dFN0eWxlLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmluaXRpYWxUZXh0IHx8ICcnLFxuICAgICAgICAgICAgc3R5bGUuREVGQVVMVF9GT05UX1NJWkVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zaGFkb3dUZXh0LmFuY2hvci5zZXRUbyhhbmNob3IueCwgYW5jaG9yLnkpO1xuICAgICAgICB0aGlzLnNoYWRvd1RleHQuZml4ZWRUb0NhbWVyYSA9ICEhdGhpcy5vcHRpb25zLmZpeGVkVG9DYW1lcmE7XG5cbiAgICAgICAgaWYodGhpcy5vcHRpb25zLmFsaWduKSB7XG4gICAgICAgICAgICB0aGlzLnNoYWRvd1RleHQuYWxpZ24gPSB0aGlzLm9wdGlvbnMuYWxpZ247XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wdGlvbnMubGF5ZXIuYWRkKHRoaXMuc2hhZG93VGV4dCk7XG5cbiAgICAgICAgdGhpcy50ZXh0ID0gcGhhc2VyR2FtZS52YWx1ZS5hZGQuYml0bWFwVGV4dChcbiAgICAgICAgICAgIG9wdGlvbnMucG9zaXRpb24ueCxcbiAgICAgICAgICAgIG9wdGlvbnMucG9zaXRpb24ueSxcbiAgICAgICAgICAgIHRoaXMuZm9yZWdyb3VuZFRleHRTdHlsZSxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5pbml0aWFsVGV4dCB8fCAnJyxcbiAgICAgICAgICAgIHN0eWxlLkRFRkFVTFRfRk9OVF9TSVpFXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMudGV4dC5hbmNob3Iuc2V0VG8oYW5jaG9yLngsIGFuY2hvci55KTtcbiAgICAgICAgdGhpcy50ZXh0LmZpeGVkVG9DYW1lcmEgPSAhIXRoaXMub3B0aW9ucy5maXhlZFRvQ2FtZXJhO1xuXG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5hbGlnbikge1xuICAgICAgICAgICAgdGhpcy50ZXh0LmFsaWduID0gdGhpcy5vcHRpb25zLmFsaWduO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmxheWVyLmFkZCh0aGlzLnRleHQpO1xuICAgIH1cblxuICAgIHNldFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2hhZG93VGV4dC5zZXRUZXh0KHRleHQpO1xuICAgICAgICB0aGlzLnRleHQuc2V0VGV4dCh0ZXh0KTtcbiAgICB9XG5cbiAgICBzZXRQb3NpdGlvbihuZXdQb3NpdGlvbjogSVBvaW50KTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMudGV4dCAmJiB0aGlzLnNoYWRvd1RleHQpIHtcbiAgICAgICAgICAgIHRoaXMudGV4dC54ID0gbmV3UG9zaXRpb24ueDtcbiAgICAgICAgICAgIHRoaXMudGV4dC55ID0gbmV3UG9zaXRpb24ueTtcbiAgICAgICAgICAgIHRoaXMuc2hhZG93VGV4dC54ID0gbmV3UG9zaXRpb24ueCArIDE7XG4gICAgICAgICAgICB0aGlzLnNoYWRvd1RleHQueSA9IG5ld1Bvc2l0aW9uLnkgKyAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgZm9yZWdyb3VuZFRleHRTdHlsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZvcmVncm91bmRUZXh0U3R5bGUgfHwgREVGQVVMVF9GT1JFR1JPVU5EX1RFWFQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgc2hhZG93VGV4dFN0eWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2hhZG93VGV4dFN0eWxlIHx8IERFRkFVTFRfU0hBRE9XX1RFWFQ7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy50ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnRleHQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy50ZXh0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLnNoYWRvd1RleHQpIHtcbiAgICAgICAgICAgIHRoaXMuc2hhZG93VGV4dC5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnNoYWRvd1RleHQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGxheW91dCB9IGZyb20gJy4vTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi4vLi4vUGhhc2VyJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5pbXBvcnQgeyB1aUxheWVycyB9IGZyb20gJy4vVUlMYXllcnMuc2luZ2xldG9uJztcblxuY2xhc3MgVUlCbG9ja2VyIHtcblxuICAgIHByaXZhdGUgb3ZlcmxheTogUGhhc2VyLkltYWdlO1xuICAgIHByaXZhdGUgYmxvY2tlZDogQm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmJsb2NrZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBibG9jaygpOiB2b2lkIHtcbiAgICAgICAgbGV0IGdyYXBoaWNPdmVybGF5ID0gbmV3IFBoYXNlci5HcmFwaGljcyhwaGFzZXJHYW1lLnZhbHVlLCAwLCAwKTtcbiAgICAgICAgZ3JhcGhpY092ZXJsYXkuYmVnaW5GaWxsKDB4MDAwMDAwLCAwLjApO1xuICAgICAgICBncmFwaGljT3ZlcmxheS5kcmF3UmVjdCgwLCAwLCBsYXlvdXQuV0lEVEgsIGxheW91dC5VSV9TVEFSVF9QT1NJVElPTi55KTtcbiAgICAgICAgZ3JhcGhpY092ZXJsYXkuZW5kRmlsbCgpO1xuXG4gICAgICAgIHRoaXMub3ZlcmxheSA9IHBoYXNlckdhbWUudmFsdWUuYWRkLmltYWdlKDAsIDAsIGdyYXBoaWNPdmVybGF5LmdlbmVyYXRlVGV4dHVyZSgpKTtcbiAgICAgICAgdGhpcy5vdmVybGF5LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgICAgICB0aGlzLm92ZXJsYXkuaW5wdXRFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB1aUxheWVycy51aUJsb2NrZXIuYWRkKHRoaXMub3ZlcmxheSk7XG4gICAgfVxuXG4gICAgdW5ibG9jaygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vdmVybGF5LmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBpc0Jsb2NrZWQoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsb2NrZWQ7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgdWlCbG9ja2VyID0gbmV3IFVJQmxvY2tlcigpO1xuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vbXktdHlwaW5ncy9saWIuZXM2LmQudHNcIiAvPlxuaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi4vLi4vUGhhc2VyJztcbmltcG9ydCB7IHBoYXNlckdhbWUgfSBmcm9tICcuLi9zdGF0ZS9QaGFzZXJHYW1lLnNpbmdsZXRvbic7XG5cbmVudW0gVUlMYXllcnMge1xuICAgIEJBQ0tHUk9VTkQsXG4gICAgQkFDS0dST1VORF9PQkpFQ1RTLFxuICAgIFBMQVlFUixcbiAgICBGT1JFR1JPVU5EX09CSkVDVFMsXG4gICAgRk9SRUdST1VORCxcbiAgICBURVhUX0lOX1NDRU5FLFxuICAgIEdVSV9CQUNLR1JPVU5ELFxuICAgIFZFUkJfQlVUVE9OUyxcbiAgICBDT05WRVJTQVRJT04sXG4gICAgVUlfQkxPQ0tFUixcbiAgICBTT1VORF9CVVRUT05TXG59XG5cbmNsYXNzIFVJTGF5ZXJzTWFuYWdlciB7XG5cbiAgICBwcml2YXRlIGdyb3VwczogTWFwPFVJTGF5ZXJzLCBQaGFzZXIuR3JvdXA+O1xuICAgIHByaXZhdGUgaW5pdGlhbGlzZWQ6IEJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByaXZhdGUgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxpc2VkKSB7XG4gICAgICAgICAgICBpZiAoIXBoYXNlckdhbWUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnRVJST1I6IGluaXRpbmcgVUlMYXllcnMgd2hlbiBnYW1lIGlzIHN0aWxsIG5vdCB0aGVyZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUxheWVycyhwaGFzZXJHYW1lLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGlzZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGJhY2tncm91bmQoKTogUGhhc2VyLkdyb3VwIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3Vwcy5nZXQoVUlMYXllcnMuQkFDS0dST1VORCk7XG4gICAgfVxuXG4gICAgZ2V0IGJhY2tncm91bmRPYmplY3RzKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLkJBQ0tHUk9VTkRfT0JKRUNUUyk7XG4gICAgfVxuXG4gICAgZ2V0IHBsYXllcigpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5QTEFZRVIpO1xuICAgIH1cblxuICAgIGdldCBmb3JlZ3JvdW5kT2JqZWN0cygpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5GT1JFR1JPVU5EX09CSkVDVFMpO1xuICAgIH1cblxuICAgIGdldCBmb3JlZ3JvdW5kKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLkZPUkVHUk9VTkQpO1xuICAgIH1cblxuICAgIGdldCB0ZXh0SW5TY2VuZSgpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5URVhUX0lOX1NDRU5FKTtcbiAgICB9XG5cbiAgICBnZXQgZ3VpQmFja2dyb3VuZCgpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5HVUlfQkFDS0dST1VORCk7XG4gICAgfVxuXG4gICAgZ2V0IHZlcmJCdXR0b25zKCk6IFBoYXNlci5Hcm91cCB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cHMuZ2V0KFVJTGF5ZXJzLlZFUkJfQlVUVE9OUyk7XG4gICAgfVxuXG4gICAgZ2V0IGNvbnZlcnNhdGlvbigpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5DT05WRVJTQVRJT04pO1xuICAgIH1cblxuICAgIGdldCB1aUJsb2NrZXIoKTogUGhhc2VyLkdyb3VwIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3Vwcy5nZXQoVUlMYXllcnMuVUlfQkxPQ0tFUik7XG4gICAgfVxuXG4gICAgZ2V0IHNvdW5kQnV0dG9ucygpOiBQaGFzZXIuR3JvdXAge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLmdldChVSUxheWVycy5TT1VORF9CVVRUT05TKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUxheWVycyhnYW1lOiBQaGFzZXIuR2FtZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmdyb3VwcyA9IG5ldyBNYXAoKTtcblxuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuQkFDS0dST1VORCwgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5CQUNLR1JPVU5EX09CSkVDVFMsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuUExBWUVSLCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLkZPUkVHUk9VTkRfT0JKRUNUUywgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5GT1JFR1JPVU5ELCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLlRFWFRfSU5fU0NFTkUsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuR1VJX0JBQ0tHUk9VTkQsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgICAgICB0aGlzLmdyb3Vwcy5zZXQoVUlMYXllcnMuVkVSQl9CVVRUT05TLCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLkNPTlZFUlNBVElPTiwgZ2FtZS5hZGQuZ3JvdXAoKSk7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnNldChVSUxheWVycy5VSV9CTE9DS0VSLCBnYW1lLmFkZC5ncm91cCgpKTtcbiAgICAgICAgdGhpcy5ncm91cHMuc2V0KFVJTGF5ZXJzLlNPVU5EX0JVVFRPTlMsIGdhbWUuYWRkLmdyb3VwKCkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVpTGF5ZXJzID0gbmV3IFVJTGF5ZXJzTWFuYWdlcigpOyIsImltcG9ydCB7IFZlcmJzIH0gZnJvbSAnLi4vc3RvcmVzL1ZlcmJzLnN0b3JlJztcbmltcG9ydCB7IEFjdGlvbkJ1dHRvbiB9IGZyb20gJy4vQWN0aW9uQnV0dG9uJztcbmltcG9ydCB7IGFjdGlvbkRpc3BhdGNoZXIsIEFjdGlvbnMgfSBmcm9tICcuLi91dGlscy9BY3Rpb25EaXNwYXRjaGVyJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vbW9kZWxzL1RoaW5nJztcblxuZXhwb3J0IGNsYXNzIFZlcmJzVUkge1xuXG4gICAgcHJpdmF0ZSBidXR0b25zOiBNYXA8VmVyYnMsIEFjdGlvbkJ1dHRvbj47XG4gICAgcHJpdmF0ZSBoaWdobGlnaHRlZEFjdGlvbjogVmVyYnM7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVCdXR0b25zKCk7XG4gICAgICAgIHRoaXMubGlzdGVuVG9FdmVudHMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5HT19UTyxcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5HT19UTyxcbiAgICAgICAgICAgICAgICAgICAge3g6IDAsIHk6IDB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5MT09LLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLkxPT0ssXG4gICAgICAgICAgICAgICAgICAgIHt4OiAwLCB5OiAxfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5zZXQoXG4gICAgICAgICAgICAgICAgVmVyYnMuR0lWRSxcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5HSVZFLFxuICAgICAgICAgICAgICAgICAgICB7eDogMCwgeTogMn1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLlBVU0gsXG4gICAgICAgICAgICAgICAgbmV3IEFjdGlvbkJ1dHRvbihcbiAgICAgICAgICAgICAgICAgICAgVmVyYnMuUFVTSCxcbiAgICAgICAgICAgICAgICAgICAge3g6IDEsIHk6IDB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5UQUtFLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLlRBS0UsXG4gICAgICAgICAgICAgICAgICAgIHt4OiAxLCB5OiAxfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5zZXQoXG4gICAgICAgICAgICAgICAgVmVyYnMuVVNFLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLlVTRSxcbiAgICAgICAgICAgICAgICB7eDogMSwgeTogMn1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLlNQRUFLLFxuICAgICAgICAgICAgICAgIG5ldyBBY3Rpb25CdXR0b24oXG4gICAgICAgICAgICAgICAgICAgIFZlcmJzLlNQRUFLLFxuICAgICAgICAgICAgICAgICAgICB7eDogMiwgeTogMH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB0aGlzLmJ1dHRvbnMuc2V0KFxuICAgICAgICAgICAgICAgIFZlcmJzLk9QRU4sXG4gICAgICAgICAgICAgICAgbmV3IEFjdGlvbkJ1dHRvbihcbiAgICAgICAgICAgICAgICAgICAgVmVyYnMuT1BFTixcbiAgICAgICAgICAgICAgICAgICAge3g6IDIsIHk6IDF9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5idXR0b25zLnNldChcbiAgICAgICAgICAgICAgICBWZXJicy5DTE9TRSxcbiAgICAgICAgICAgICAgICBuZXcgQWN0aW9uQnV0dG9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJicy5DTE9TRSxcbiAgICAgICAgICAgICAgICAgICAge3g6IDIsIHk6IDJ9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxpc3RlblRvRXZlbnRzKCk6IHZvaWQgIHtcbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQ1VSU09SX09WRVJfVEhJTkcsXG4gICAgICAgICAgICAodGhpbmcpID0+IHRoaXMuaGlnaGxpZ2h0U2Vjb25kYXJ5QWN0aW9uRm9yVGhpbmcodGhpbmcpXG4gICAgICAgICk7XG5cbiAgICAgICAgYWN0aW9uRGlzcGF0Y2hlci5zdWJzY3JpYmVUbyhcbiAgICAgICAgICAgIEFjdGlvbnMuQ1VSU09SX09VVF9USElORyxcbiAgICAgICAgICAgICgpID0+IHRoaXMucmVtb3ZlUHJldmlvdXNseUhpZ2hsaWdodGVkQWN0aW9uKClcbiAgICAgICAgKTtcblxuICAgICAgICBhY3Rpb25EaXNwYXRjaGVyLnN1YnNjcmliZVRvKFxuICAgICAgICAgICAgQWN0aW9ucy5BQ1RJT05fQVBQTElFRCxcbiAgICAgICAgICAgICgpID0+IHRoaXMucmVtb3ZlUHJldmlvdXNseUhpZ2hsaWdodGVkQWN0aW9uKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhpZ2hsaWdodFNlY29uZGFyeUFjdGlvbkZvclRoaW5nKHRoaW5nOiBUaGluZykgOiB2b2lke1xuICAgICAgICB0aGlzLnJlbW92ZVByZXZpb3VzbHlIaWdobGlnaHRlZEFjdGlvbigpO1xuICAgICAgICB0aGlzLmhpZ2hsaWdodGVkQWN0aW9uID0gdGhpbmcuZ2V0UHJlZmVycmVkQWN0aW9uKCk7XG4gICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodGVkQWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnMuZ2V0KHRoaXMuaGlnaGxpZ2h0ZWRBY3Rpb24pLmhpZ2hsaWdodCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVQcmV2aW91c2x5SGlnaGxpZ2h0ZWRBY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodGVkQWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnMuZ2V0KHRoaXMuaGlnaGxpZ2h0ZWRBY3Rpb24pLnVuaGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodGVkQWN0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUsIElDYWxsYmFjayB9IGZyb20gJy4vT2JzZXJ2YWJsZSc7XG5cbmV4cG9ydCBlbnVtIEFjdGlvbnMge1xuICAgIENMSUNLX1NUQUdFLFxuICAgIFNFTEVDVF9WRVJCLFxuICAgIFNFTEVDVF9USElORyxcbiAgICBDVVJTT1JfT1ZFUl9USElORyxcbiAgICBDVVJTT1JfT1VUX1RISU5HLFxuICAgIEFDVElPTl9BUFBMSUVELFxuICAgIFRBS0VfT0JKRUNULFxuICAgIFVQREFURV9JTlZFTlRPUlksXG4gICAgR09fVE9fU0NFTkUsXG4gICAgUkVGTEVDVFxufVxuXG5jbGFzcyBBY3Rpb25EaXNwYXRjaGVyIHtcblxuICAgIHByaXZhdGUgb2JzZXJ2ZXJzUGVyQWN0aW9uOiBNYXA8QWN0aW9ucywgT2JzZXJ2YWJsZT47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnNQZXJBY3Rpb24gPSBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgZXhlY3V0ZShhY3Rpb246IEFjdGlvbnMsIHBhcmFtOiBhbnkgPSB7fSkge1xuICAgICAgICBsZXQgYWN0aW9uT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZSA9IHRoaXMub2JzZXJ2ZXJzUGVyQWN0aW9uLmdldChhY3Rpb24pO1xuICAgICAgICBpZiAoYWN0aW9uT2JzZXJ2YWJsZSkge1xuICAgICAgICAgICAgYWN0aW9uT2JzZXJ2YWJsZS5ub3RpZnlPYnNlcnZlcnMocGFyYW0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG8oYWN0aW9uOiBBY3Rpb25zLCBjYWxsYmFjazogSUNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBhY3Rpb25PYnNlcnZhYmxlOiBPYnNlcnZhYmxlID0gdGhpcy5vYnNlcnZlcnNQZXJBY3Rpb24uZ2V0KGFjdGlvbik7XG4gICAgICAgIGlmICghYWN0aW9uT2JzZXJ2YWJsZSkge1xuICAgICAgICAgICAgYWN0aW9uT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKCk7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyc1BlckFjdGlvbi5zZXQoYWN0aW9uLCBhY3Rpb25PYnNlcnZhYmxlKTtcbiAgICAgICAgfVxuICAgICAgICBhY3Rpb25PYnNlcnZhYmxlLnJlZ2lzdGVyT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFjdGlvbkRpc3BhdGNoZXIgPSBuZXcgQWN0aW9uRGlzcGF0Y2hlcigpOyIsImV4cG9ydCBlbnVtIERpcmVjdGlvbnMge1xuICAgIFVQID0gMSxcbiAgICBET1dOLFxuICAgIExFRlQsXG4gICAgUklHSFRcbn07XG5cbmV4cG9ydCBjb25zdCBnZXREaXJlY3Rpb25OYW1lID0gZnVuY3Rpb24oZGlyZWN0aW9uOiBEaXJlY3Rpb25zKSB7XG4gICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgY2FzZSBEaXJlY3Rpb25zLlVQOlxuICAgICAgICAgICAgcmV0dXJuICd1cCc7XG4gICAgICAgIGNhc2UgRGlyZWN0aW9ucy5ET1dOOlxuICAgICAgICAgICAgcmV0dXJuICdkb3duJztcbiAgICAgICAgY2FzZSBEaXJlY3Rpb25zLkxFRlQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnbGVmdCc7XG4gICAgICAgIGNhc2UgRGlyZWN0aW9ucy5SSUdIVDpcbiAgICAgICAgICAgIHJldHVybiAncmlnaHQnO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgJ0VSUk9SOiBnZXR0aW5nIGRpcmVjdGlvbiBuYW1lIG9mIHVuZXhpc3RpbmcgZGlyZWN0aW9uJztcbiAgICB9XG59OyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9teS10eXBpbmdzL2xpYi5lczYuZC50c1wiIC8+XG5leHBvcnQgaW50ZXJmYWNlIElDYWxsYmFjayB7XG4gICAgKG5ld1ZhbHVlOiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBPYnNlcnZhYmxlIHtcbiAgICBwcml2YXRlIG9ic2VydmVyczogU2V0PElDYWxsYmFjaz47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjazogSUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLmFkZChjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcmVtb3ZlT2JzZXJ2ZXIoY2FsbGJhY2s6IElDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLm9ic2VydmVycy5kZWxldGUoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJlbW92ZUFsbE9ic2VydmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBub3RpZnlPYnNlcnZlcnMgKHZhbHVlIDogYW55KSA6IHZvaWQge1xuICAgICAgICB0aGlzLm9ic2VydmVycy5mb3JFYWNoKChvYnNlcnZlcjogSUNhbGxiYWNrKT0+IHtcbiAgICAgICAgICAgIG9ic2VydmVyKHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCB7IElQb2ludCB9IGZyb20gJy4vSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBTZWdtZW50IH0gZnJvbSAnLi9TZWdtZW50JztcblxuY29uc3QgTUlERExFX1BPSU5UU19UT19DSEVDSyA9IDEwO1xuY29uc3QgTUlOX0RJU1RBTkNFX1RPX0JFX0lOX0xJTkUgPSAxO1xuXG5mdW5jdGlvbiBzb3J0ZXJCeVhUaGVuWShwb2ludEE6IElQb2ludCwgcG9pbnRCOiBJUG9pbnQpOiBudW1iZXIge1xuICAgIGlmKHBvaW50QS54ID09PSBwb2ludEIueCkge1xuICAgICAgICByZXR1cm4gcG9pbnRBLnkgLSBwb2ludEIueTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcG9pbnRBLnggLSBwb2ludEIueDtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gY3Jvc3MocG9pbnRPOiBJUG9pbnQsIHBvaW50QTogSVBvaW50LCBwb2ludEI6IElQb2ludCk6IG51bWJlciB7XG4gICAgcmV0dXJuIChwb2ludEEueCAtIHBvaW50Ty54KSAqIChwb2ludEIueSAtIHBvaW50Ty55KSAtIChwb2ludEEueSAtIHBvaW50Ty55KSAqIChwb2ludEIueCAtIHBvaW50Ty54KTtcbn1cblxuXG5mdW5jdGlvbiBsaW5lU2VnbWVudHNDcm9zcyhhOiBJUG9pbnQsIGI6IElQb2ludCwgYzogSVBvaW50LCBkOiBJUG9pbnQpOiBCb29sZWFuIHtcbiAgICBsZXQgZGVub21pbmF0b3IgPSAoKGIueCAtIGEueCkgKiAoZC55IC0gYy55KSkgLSAoKGIueSAtIGEueSkgKiAoZC54IC0gYy54KSk7XG4gICAgaWYgKGRlbm9taW5hdG9yID09PSAwKXtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBudW1lcmF0b3IxID0gKChhLnkgLSBjLnkpICogKGQueCAtIGMueCkpIC0gKChhLnggLSBjLngpICogKGQueSAtIGMueSkpO1xuICAgIGxldCBudW1lcmF0b3IyID0gKChhLnkgLSBjLnkpICogKGIueCAtIGEueCkpIC0gKChhLnggLSBjLngpICogKGIueSAtIGEueSkpO1xuXG4gICAgaWYgKG51bWVyYXRvcjEgPT09IDAgfHwgbnVtZXJhdG9yMiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHIgPSBudW1lcmF0b3IxIC8gZGVub21pbmF0b3I7XG4gICAgbGV0IHMgPSBudW1lcmF0b3IyIC8gZGVub21pbmF0b3I7XG5cbiAgICByZXR1cm4gKHIgPiAwICYmIHIgPCAxKSAmJiAocyA+IDAgJiYgcyA8IDEpO1xufVxuXG5leHBvcnQgY2xhc3MgUG9seWdvbiB7XG5cbiAgICBwcml2YXRlIGNvbnZleEh1bGw6IFBvbHlnb247XG4gICAgcHJpdmF0ZSBfc2VnbWVudHM6IEFycmF5PFNlZ21lbnQ+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcG9pbnRzOiBBcnJheTxJUG9pbnQ+KSB7XG4gICAgICAgIGlmKCFfcG9pbnRzLmxlbmd0aCB8fCBfcG9pbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgIHRocm93ICdFUlJPUiBjcmVhdGluZyBwb2x5Z29uLCBpdCBuZWVkcyBhdCBsZWFzdCAzIHBvaW50cyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgcG9pbnRzKCk6IEFycmF5PElQb2ludD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9pbnRzO1xuICAgIH1cblxuICAgIGdldCBzZWdtZW50cygpOiBBcnJheTxTZWdtZW50PiB7XG4gICAgICAgIGlmKCF0aGlzLl9zZWdtZW50cykge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWdtZW50cygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWdtZW50cztcbiAgICB9XG5cbiAgICBnZXRDb252ZXhIdWxsKCk6IFBvbHlnb24ge1xuICAgICAgICBpZighdGhpcy5jb252ZXhIdWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnZleEh1bGwgPSB0aGlzLmNhbGN1bGF0ZUNvbnZleEh1bGwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXhIdWxsO1xuICAgIH1cblxuICAgIC8vQ29uY2F2ZSB2ZXJ0ZXggYXJlIHRoZSBvbmVzIHRoYXQgZG8gbm90IGJlbG9uZyB0byB0aGUgY29udmV4SHVsbFxuICAgIGdldENvbmNhdmVWZXJ0ZXgoKTogQXJyYXk8SVBvaW50PiB7XG4gICAgICAgIGxldCBjb252ZXhIdWxsID0gdGhpcy5nZXRDb252ZXhIdWxsKCk7XG4gICAgICAgIGxldCByZXN1bHQ6IEFycmF5PElQb2ludD4gPSBbXTtcblxuICAgICAgICBmb3IobGV0IHBvaW50IG9mIHRoaXMuX3BvaW50cykge1xuICAgICAgICAgICAgaWYoIWNvbnZleEh1bGwuaGFzUG9pbnQocG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocG9pbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBoYXNQb2ludChwb2ludFRvU2VhcmNoOiBJUG9pbnQpOiBCb29sZWFuIHtcbiAgICAgICAgZm9yKGxldCBwb2ludCBvZiB0aGlzLl9wb2ludHMpIHtcbiAgICAgICAgICAgIGlmKChwb2ludC54ID09PSBwb2ludFRvU2VhcmNoLngpICYmIChwb2ludC55ID09PSBwb2ludFRvU2VhcmNoLnkpICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpc1BvaW50SW5zaWRlKHBvaW50OiBJUG9pbnQpOiBCb29sZWFuIHtcbiAgICAgICAgaWYodGhpcy5oYXNQb2ludChwb2ludCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMuc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmKHRoaXMuc2VnbWVudHNbaV0uZGlzdGFuY2VUb1BvaW50KHBvaW50KSA8IE1JTl9ESVNUQU5DRV9UT19CRV9JTl9MSU5FKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBoYXNlclBvbHlnb24gPSBuZXcgUGhhc2VyLlBvbHlnb24odGhpcy5wb2ludHMubWFwKChlYWNoUG9pbnQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGhhc2VyLlBvaW50KGVhY2hQb2ludC54LCBlYWNoUG9pbnQueSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIHBoYXNlclBvbHlnb24uY29udGFpbnMocG9pbnQueCwgcG9pbnQueSk7XG4gICAgfVxuXG5cblxuICAgIGdldENsb3Nlc3RQb2ludFRvKHBvaW50OiBJUG9pbnQpOiBJUG9pbnQge1xuICAgICAgICB2YXIgY2xvc2VzdFNlZ21lbnQgPSB0aGlzLmdldENsb3Nlc3RTZWdtZW50KHBvaW50KTtcbiAgICAgICAgcmV0dXJuIGNsb3Nlc3RTZWdtZW50LmdldENsb3Nlc3RQb2ludFRvKHBvaW50KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENsb3Nlc3RTZWdtZW50KHBvaW50OiBJUG9pbnQpOiBTZWdtZW50IHtcbiAgICAgICAgbGV0IHNlZ21lbnRzID0gdGhpcy5zZWdtZW50cztcbiAgICAgICAgbGV0IGNsb3Nlc3RTZWdtZW50ID0gdGhpcy5zZWdtZW50c1swXTtcbiAgICAgICAgbGV0IG1pbkRpc3RhbmNlID0gY2xvc2VzdFNlZ21lbnQuZGlzdGFuY2UyVG9Qb2ludChwb2ludCk7XG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGk8c2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuZXh0U2VnbWVudCA9IHNlZ21lbnRzW2ldO1xuICAgICAgICAgICAgbGV0IG5leHREaXN0YW5jZSA9IG5leHRTZWdtZW50LmRpc3RhbmNlMlRvUG9pbnQocG9pbnQpO1xuICAgICAgICAgICAgaWYobmV4dERpc3RhbmNlIDwgbWluRGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBjbG9zZXN0U2VnbWVudCA9IG5leHRTZWdtZW50O1xuICAgICAgICAgICAgICAgIG1pbkRpc3RhbmNlID0gbmV4dERpc3RhbmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsb3Nlc3RTZWdtZW50O1xuICAgIH1cblxuICAgIHBvaW50c0NhblNlZUVhY2hPdGhlcihwb2ludEE6IElQb2ludCwgcG9pbnRCOiBJUG9pbnQpOiBCb29sZWFuIHtcbiAgICAgICAgaWYoIXRoaXMuaXNQb2ludEluc2lkZShwb2ludEEpIHx8ICF0aGlzLmlzUG9pbnRJbnNpZGUocG9pbnRCKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmKCF0aGlzLm1pZGRsZVBvaW50c0FyZUluc2lkZShwb2ludEEsIHBvaW50QikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZWdtZW50cyA9IHRoaXMuc2VnbWVudHM7XG4gICAgICAgIGxldCBzZWdtZW50QmV0d2VlblBvaW50cyA9IG5ldyBTZWdtZW50KHBvaW50QSwgcG9pbnRCKTtcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8c2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmKHNlZ21lbnRzW2ldLmlzQ3Jvc3NlZEJ5KHNlZ21lbnRCZXR3ZWVuUG9pbnRzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1pZGRsZVBvaW50c0FyZUluc2lkZShwb2ludEE6IElQb2ludCwgcG9pbnRCOiBJUG9pbnQsIHBvaW50c1RvQ2hlY2s6IG51bWJlciA9IE1JRERMRV9QT0lOVFNfVE9fQ0hFQ0spOiBCb29sZWFuIHtcbiAgICAgICAgbGV0IHBvaW50MSA9IG5ldyBQaGFzZXIuUG9pbnQocG9pbnRBLngsIHBvaW50QS55KTtcbiAgICAgICAgbGV0IHBvaW50MiA9IG5ldyBQaGFzZXIuUG9pbnQocG9pbnRCLngsIHBvaW50Qi55KTtcblxuICAgICAgICBmb3IobGV0IGk9MTsgaTw9cG9pbnRzVG9DaGVjazsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcmF0aW8gPSBpLyhwb2ludHNUb0NoZWNrICsgMSk7XG4gICAgICAgICAgICBsZXQgcG9pbnRJbkJldHdlZW4gPSBQaGFzZXIuUG9pbnQuaW50ZXJwb2xhdGUocG9pbnQxLCBwb2ludDIsIHJhdGlvKTtcbiAgICAgICAgICAgIGlmKCF0aGlzLmlzUG9pbnRJbnNpZGUoeyB4OiBwb2ludEluQmV0d2Vlbi54LCB5OiBwb2ludEluQmV0d2Vlbi55fSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIFxuICAgIH1cblxuICAgIC8vIFVzaW5nIGh0dHBzOi8vZW4ud2lraWJvb2tzLm9yZy93aWtpL0FsZ29yaXRobV9JbXBsZW1lbnRhdGlvbi9HZW9tZXRyeS9Db252ZXhfaHVsbC9Nb25vdG9uZV9jaGFpblxuICAgIHByaXZhdGUgY2FsY3VsYXRlQ29udmV4SHVsbCgpOiBQb2x5Z29uIHtcbiAgICAgICAgbGV0IG9yZGVyZWRQb2ludHMgPSBBcnJheS5mcm9tKHRoaXMuX3BvaW50cyk7XG4gICAgICAgIG9yZGVyZWRQb2ludHMuc29ydChzb3J0ZXJCeVhUaGVuWSk7XG5cbiAgICAgICAgdmFyIGxvd2VyIDogQXJyYXk8SVBvaW50PiA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9yZGVyZWRQb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHdoaWxlIChsb3dlci5sZW5ndGggPj0gMiAmJiBjcm9zcyhsb3dlcltsb3dlci5sZW5ndGggLSAyXSwgbG93ZXJbbG93ZXIubGVuZ3RoIC0gMV0sIG9yZGVyZWRQb2ludHNbaV0pIDw9IDApIHtcbiAgICAgICAgICAgICAgICBsb3dlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvd2VyLnB1c2gob3JkZXJlZFBvaW50c1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdXBwZXIgOiBBcnJheTxJUG9pbnQ+ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSBvcmRlcmVkUG9pbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB3aGlsZSAodXBwZXIubGVuZ3RoID49IDIgJiYgY3Jvc3ModXBwZXJbdXBwZXIubGVuZ3RoIC0gMl0sIHVwcGVyW3VwcGVyLmxlbmd0aCAtIDFdLCBvcmRlcmVkUG9pbnRzW2ldKSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdXBwZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cHBlci5wdXNoKG9yZGVyZWRQb2ludHNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHVwcGVyLnBvcCgpO1xuICAgICAgICBsb3dlci5wb3AoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2x5Z29uKGxvd2VyLmNvbmNhdCh1cHBlcikpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlU2VnbWVudHMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3NlZ21lbnRzID0gW107XG4gICAgICAgIGZvcihsZXQgaT0wOyBpIDwgKHRoaXMuX3BvaW50cy5sZW5ndGggLSAxKTsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9zZWdtZW50cy5wdXNoKG5ldyBTZWdtZW50KHRoaXMuX3BvaW50c1tpXSwgdGhpcy5fcG9pbnRzW2krMV0pKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZWdtZW50cy5wdXNoKG5ldyBTZWdtZW50KHRoaXMuX3BvaW50c1t0aGlzLl9wb2ludHMubGVuZ3RoIC0gMV0sIHRoaXMuX3BvaW50c1swXSkpO1xuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9teS10eXBpbmdzL2xpYi5lczYuZC50c1wiIC8+XG5cbmNsYXNzIFJhbmRvbVRleHQge1xuICAgIHByaXZhdGUgb3JpZ2luYWxQaHJhc2VzOiBBcnJheTxzdHJpbmc+O1xuICAgIHByaXZhdGUgcGhyYXNlczogQXJyYXk8c3RyaW5nPjtcbiAgICBwcml2YXRlIGxhc3RUZXh0OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihwaHJhc2VzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWxQaHJhc2VzID0gcGhyYXNlcztcbiAgICAgICAgdGhpcy5jcmVhdGVTZXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNldCgpIHtcbiAgICAgICAgdGhpcy5waHJhc2VzID0gdGhpcy5vcmlnaW5hbFBocmFzZXMuc2xpY2UoKTtcbiAgICB9XG5cbiAgICBnZXRSYW5kb21UZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGxldCByZXN1bHQ6IHN0cmluZztcblxuICAgICAgICBpZiAodGhpcy5waHJhc2VzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5waHJhc2VzWzBdO1xuICAgICAgICAgICAgdGhpcy5sYXN0VGV4dCA9IHJlc3VsdDtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2V0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKHRoaXMucGhyYXNlcy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBocmFzZXNbcmFuZG9tSW5kZXhdID09PSB0aGlzLmxhc3RUZXh0KSB7XG4gICAgICAgICAgICAgICAgcmFuZG9tSW5kZXggPSAocmFuZG9tSW5kZXggKyAxKSAlIHRoaXMucGhyYXNlcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLnBocmFzZXNbcmFuZG9tSW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5waHJhc2VzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gICAgICAgICAgICB0aGlzLmxhc3RUZXh0ID0gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG5cbmNsYXNzIFJhbmRvbVRleHRGYWN0b3J5IHtcbiAgICBwcml2YXRlIGdlbmVyYXRvcnM6IE1hcDxzdHJpbmcsIFJhbmRvbVRleHQ+O1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmdlbmVyYXRvcnMgPSBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tVGV4dCguLi5waHJhc2VzOiBBcnJheTxzdHJpbmc+KTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHBocmFzZXNJZCA9IHRoaXMuZ2V0SWRGcm9tUGhyYXNlcyhwaHJhc2VzKTtcbiAgICAgICAgbGV0IGdlbmVyYXRvciA9IHRoaXMuZ2VuZXJhdG9ycy5nZXQocGhyYXNlc0lkKTtcbiAgICAgICAgaWYgKCFnZW5lcmF0b3IpIHtcbiAgICAgICAgICAgIGdlbmVyYXRvciA9IG5ldyBSYW5kb21UZXh0KHBocmFzZXMpO1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0b3JzLnNldChwaHJhc2VzSWQsIGdlbmVyYXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdlbmVyYXRvci5nZXRSYW5kb21UZXh0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJZEZyb21QaHJhc2VzKHBocmFzZXM6IEFycmF5PHN0cmluZz4gPSBbXSk6IHN0cmluZyB7XG4gICAgICAgIGxldCBpZCA9IHBocmFzZXMuam9pbignIycpO1xuICAgICAgICBpZiAoaWQgPT09ICcnKSB7XG4gICAgICAgICAgICBpZCA9ICcjJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuXG59XG5jb25zdCB0ZXh0RmFjdG9yeSA9IG5ldyBSYW5kb21UZXh0RmFjdG9yeSgpO1xuZXhwb3J0IGNvbnN0IHJhbmRvbVRleHQgPSAoLi4ucGhyYXNlczogQXJyYXk8c3RyaW5nPikgPT4ge1xuICAgIHJldHVybiB0ZXh0RmFjdG9yeS5nZXRSYW5kb21UZXh0KC4uLnBocmFzZXMpO1xufTsiLCJpbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuL0ludGVyZmFjZXMnO1xuXG5mdW5jdGlvbiBzcXIoeDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4geCAqIHg7XG59XG5cbmZ1bmN0aW9uIGRpc3RhbmNlMihwb2ludEE6IElQb2ludCwgcG9pbnRCOiBJUG9pbnQpOiBudW1iZXIge1xuICAgIHJldHVybiBzcXIocG9pbnRBLnggLSBwb2ludEIueCkgKyBzcXIocG9pbnRBLnkgLSBwb2ludEIueSk7XG59XG5cbmV4cG9ydCBjbGFzcyBTZWdtZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwb2ludEE6IElQb2ludCwgcHVibGljIHBvaW50QjogSVBvaW50KSB7fVxuXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGRpc3RhbmNlMih0aGlzLnBvaW50QSwgdGhpcy5wb2ludEIpKTtcbiAgICB9XG5cbiAgICAvL0Jhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE1MDE3MjUvMzQ5MzM4OFxuICAgIGRpc3RhbmNlVG9Qb2ludChwb2ludDogSVBvaW50KTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRpc3RhbmNlMlRvUG9pbnQocG9pbnQpKTtcbiAgICB9XG5cbiAgICBkaXN0YW5jZTJUb1BvaW50KHBvaW50OiBJUG9pbnQpOiBudW1iZXIge1xuICAgICAgICB2YXIgbGVuZ3RoMiA9IGRpc3RhbmNlMih0aGlzLnBvaW50QSwgdGhpcy5wb2ludEIpO1xuICAgICAgICBpZihsZW5ndGgyID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZGlzdGFuY2UyKHRoaXMucG9pbnRBLCB0aGlzLnBvaW50Qik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQgPSAoKHBvaW50LnggLSB0aGlzLnBvaW50QS54KSAqICh0aGlzLnBvaW50Qi54IC0gdGhpcy5wb2ludEEueCkgKyAocG9pbnQueSAtIHRoaXMucG9pbnRBLnkpICogKHRoaXMucG9pbnRCLnkgLSB0aGlzLnBvaW50QS55KSkgLyBsZW5ndGgyO1xuICAgICAgICB0ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgdCkpO1xuXG4gICAgICAgIHJldHVybiBkaXN0YW5jZTIocG9pbnQsIHtcbiAgICAgICAgICAgIHg6IHRoaXMucG9pbnRBLnggKyB0ICogKHRoaXMucG9pbnRCLnggLSB0aGlzLnBvaW50QS54KSxcbiAgICAgICAgICAgIHk6IHRoaXMucG9pbnRBLnkgKyB0ICogKHRoaXMucG9pbnRCLnkgLSB0aGlzLnBvaW50QS55KVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8vQmFzZWQgb24gaHR0cDovL3d3dy5qYXZhMnMuY29tL0NvZGUvSmF2YS8yRC1HcmFwaGljcy1HVUkvUmV0dXJuc2Nsb3Nlc3Rwb2ludG9uc2VnbWVudHRvcG9pbnQuaHRtXG4gICAgZ2V0Q2xvc2VzdFBvaW50VG8ocG9pbnQ6IElQb2ludCk6IElQb2ludCB7XG4gICAgICAgIGxldCB4RGVsdGEgPSB0aGlzLnBvaW50Qi54IC0gdGhpcy5wb2ludEEueDtcbiAgICAgICAgbGV0IHlEZWx0YSA9IHRoaXMucG9pbnRCLnkgLSB0aGlzLnBvaW50QS55O1xuXG4gICAgICAgIGlmKCh4RGVsdGEgPT09IDApICYmICh5RGVsdGEgPT09IDApKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb2ludEE7IC8vTGluZSBpcyBhY3R1YWxseSBhIHBvaW50XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdSA9ICgocG9pbnQueCAtIHRoaXMucG9pbnRBLngpICogeERlbHRhICsgKHBvaW50LnkgLSB0aGlzLnBvaW50QS55KSAqIHlEZWx0YSkgLyAoeERlbHRhICogeERlbHRhICsgeURlbHRhICogeURlbHRhKTtcblxuICAgICAgICBpZih1IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRBO1xuICAgICAgICB9XG4gICAgICAgIGlmKHUgPiAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb2ludEI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMucG9pbnRBLnggKyB1ICogeERlbHRhLFxuICAgICAgICAgICAgeTogdGhpcy5wb2ludEEueSArIHUgKiB5RGVsdGFcbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIGlzQ3Jvc3NlZEJ5KHNlZ21lbnQ6IFNlZ21lbnQpOiBCb29sZWFuIHtcbiAgICAgICAgaWYodGhpcy5pc0VxdWFsKHNlZ21lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxpbmUxID0gbmV3IFBoYXNlci5MaW5lKHRoaXMucG9pbnRBLngsIHRoaXMucG9pbnRBLnksIHRoaXMucG9pbnRCLngsIHRoaXMucG9pbnRCLnkpO1xuICAgICAgICBsZXQgbGluZTIgPSBuZXcgUGhhc2VyLkxpbmUoc2VnbWVudC5wb2ludEEueCwgc2VnbWVudC5wb2ludEEueSwgc2VnbWVudC5wb2ludEIueCwgc2VnbWVudC5wb2ludEIueSk7XG5cbiAgICAgICAgdmFyIG90aGVyU2VnbWVudEluc2lkZVRoaXMgPSBsaW5lMS5wb2ludE9uU2VnbWVudChzZWdtZW50LnBvaW50QS54LCBzZWdtZW50LnBvaW50QS55KSB8fCBsaW5lMS5wb2ludE9uU2VnbWVudChzZWdtZW50LnBvaW50Qi54LCBzZWdtZW50LnBvaW50Qi55KTtcbiAgICAgICAgaWYob3RoZXJTZWdtZW50SW5zaWRlVGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0aGlzU2VnbWVudEluc2lkZU90aGVyID0gbGluZTIucG9pbnRPblNlZ21lbnQodGhpcy5wb2ludEEueCwgdGhpcy5wb2ludEEueSkgfHwgbGluZTIucG9pbnRPblNlZ21lbnQodGhpcy5wb2ludEIueCwgdGhpcy5wb2ludEIueSk7XG4gICAgICAgIGlmKHRoaXNTZWdtZW50SW5zaWRlT3RoZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbnRlcnNlY3Rpb24gPSBsaW5lMS5pbnRlcnNlY3RzKGxpbmUyLCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gISFpbnRlcnNlY3Rpb247XG4gICAgfVxuXG4gICAgLy8gcHJpdmF0ZSBsaW5lVG9TdHJpbmcobGluZTogUGhhc2VyLkxpbmUpOiBzdHJpbmcge1xuICAgIC8vICAgICByZXR1cm4gJ1soJyArIGxpbmUuc3RhcnQueCArICcsJyArIGxpbmUuc3RhcnQueSArICcpLSgnICsgbGluZS5lbmQueCArICcsJyArIGxpbmUuZW5kLnkgKyAnKV0nO1xuICAgIC8vIH1cblxuICAgIGlzRXF1YWwoc2VnbWVudDogU2VnbWVudCk6IEJvb2xlYW4ge1xuICAgICAgICBpZih0aGlzLnBvaW50c0FyZUVxdWFsKHRoaXMucG9pbnRBLCBzZWdtZW50LnBvaW50QSkgJiYgdGhpcy5wb2ludHNBcmVFcXVhbCh0aGlzLnBvaW50Qiwgc2VnbWVudC5wb2ludEIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLnBvaW50c0FyZUVxdWFsKHRoaXMucG9pbnRCLCBzZWdtZW50LnBvaW50QSkgJiYgdGhpcy5wb2ludHNBcmVFcXVhbCh0aGlzLnBvaW50QSwgc2VnbWVudC5wb2ludEIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb2ludHNBcmVFcXVhbChwb2ludEE6IElQb2ludCwgcG9pbnRCOiBJUG9pbnQpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChwb2ludEEueCA9PT0gcG9pbnRCLngpICYmIChwb2ludEEueSA9PT0gcG9pbnRCLnkpO1xuICAgIH1cblxuICAgIC8vIGdldE1pZGRsZVBvaW50KCk6IElQb2ludCB7XG4gICAgLy8gICAgIHJldHVybiB7XG4gICAgLy8gICAgICAgICB4OiAodGhpcy5wb2ludEEueCArIHRoaXMucG9pbnRCLngpIC8gMixcbiAgICAvLyAgICAgICAgIHk6ICh0aGlzLnBvaW50QS55ICsgdGhpcy5wb2ludEIueSkgLyAyXG4gICAgLy8gICAgIH07XG4gICAgLy8gfVxuXG5cbn1cblxuXG4vLyBwdWJsaWMgc3RhdGljIFBvaW50IGdldENsb3Nlc3RQb2ludE9uU2VnbWVudChpbnQgc3gxLCBpbnQgc3kxLCBpbnQgc3gyLCBpbnQgc3kyLCBpbnQgcHgsIGludCBweSlcbi8vICAge1xuLy8gICAgIGRvdWJsZSB4RGVsdGEgPSBzeDIgLSBzeDE7XG4vLyAgICAgZG91YmxlIHlEZWx0YSA9IHN5MiAtIHN5MTtcblxuLy8gICAgIGlmICgoeERlbHRhID09IDApICYmICh5RGVsdGEgPT0gMCkpXG4vLyAgICAge1xuLy8gICAgICAgdGhyb3cgbmV3IElsbGVnYWxBcmd1bWVudEV4Y2VwdGlvbihcIlNlZ21lbnQgc3RhcnQgZXF1YWxzIHNlZ21lbnQgZW5kXCIpO1xuLy8gICAgIH1cblxuLy8gICAgIGRvdWJsZSB1ID0gKChweCAtIHN4MSkgKiB4RGVsdGEgKyAocHkgLSBzeTEpICogeURlbHRhKSAvICh4RGVsdGEgKiB4RGVsdGEgKyB5RGVsdGEgKiB5RGVsdGEpO1xuXG4vLyAgICAgZmluYWwgUG9pbnQgY2xvc2VzdFBvaW50O1xuLy8gICAgIGlmICh1IDwgMClcbi8vICAgICB7XG4vLyAgICAgICBjbG9zZXN0UG9pbnQgPSBuZXcgUG9pbnQoc3gxLCBzeTEpO1xuLy8gICAgIH1cbi8vICAgICBlbHNlIGlmICh1ID4gMSlcbi8vICAgICB7XG4vLyAgICAgICBjbG9zZXN0UG9pbnQgPSBuZXcgUG9pbnQoc3gyLCBzeTIpO1xuLy8gICAgIH1cbi8vICAgICBlbHNlXG4vLyAgICAge1xuLy8gICAgICAgY2xvc2VzdFBvaW50ID0gbmV3IFBvaW50KChpbnQpIE1hdGgucm91bmQoc3gxICsgdSAqIHhEZWx0YSksIChpbnQpIE1hdGgucm91bmQoc3kxICsgdSAqIHlEZWx0YSkpO1xuLy8gICAgIH1cblxuLy8gICAgIHJldHVybiBjbG9zZXN0UG9pbnQ7XG4vLyAgIH1cbi8vIH1cbiIsImNsYXNzIEFuYWx5dGljcyB7XG5cbiAgICBzZW5kRXZlbnQoY2F0ZWdvcnk6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcsIGxhYmVsOiBzdHJpbmcgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICAgICAgaWYoKDxhbnk+d2luZG93KS5nYSkge1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5nYSgnc2VuZCcsICdldmVudCcsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFuYWx5dGljcyA9IG5ldyBBbmFseXRpY3MoKTsiLCJjb25zdCBJTUFHRVNfUk9PVCA9ICdhc3NldHMvaW1hZ2VzLydcbmNvbnN0IFNPVU5EU19ST09UID0gJ2Fzc2V0cy9zb3VuZHMvJ1xuXG5pbnRlcmZhY2UgSUltYWdlc0luZm8ge1xuICAgIFtpbmRleCA6IHN0cmluZ10gOiBzdHJpbmc7XG59O1xuXG5pbnRlcmZhY2UgSUF1ZGlvSW5mbyB7XG4gICAgW2luZGV4IDogc3RyaW5nXSA6IHN0cmluZztcbn07XG5cbmludGVyZmFjZSBJU3ByaXRlc0luZm8ge1xuICAgIFtpbmRleCA6IHN0cmluZ10gOiAoc3RyaW5nfG51bWJlcilbXTtcbn07XG5cbmludGVyZmFjZSBJRm9udHNJbmZvIHtcbiAgICBbaW5kZXggOiBzdHJpbmddIDogQXJyYXk8c3RyaW5nPjtcbn07XG5cbmNvbnN0IFNQUklURVM6IElTcHJpdGVzSW5mbyA9IHtcbiAgICAvLyBVSVxuICAgICdCVVRUT05fQkcnOiBbSU1BR0VTX1JPT1QgKyAndWkvQlVUVE9OX0JHX1NQUklURS5wbmcnLDc1LCAxOCwgM10sXG4gICAgJ1JFRkxFQ1RfQlVUVE9OX0JHJzogW0lNQUdFU19ST09UICsgJ3VpL1JFRkxFQ1RfQlVUVE9OX0JHX1NQUklURS5wbmcnLCA3NSwgNTYsIDNdLFxuICAgICdDT05WRVJTQVRJT05fTElORV9CRyc6IFtJTUFHRVNfUk9PVCArICd1aS9DT05WRVJTQVRJT05fTElORV9CRy5wbmcnLCA1MDgsIDIwXSxcbiAgICAnUEFHSU5BVElPTl9CVVRUT05fVVAnOiBbSU1BR0VTX1JPT1QgKyAndWkvUEFHSU5BVElPTl9CVVRUT05fVVAucG5nJywgMTYsIDI1LCA0XSxcbiAgICAnRU5HTElTSF9CVVRUT04nOiBbSU1BR0VTX1JPT1QgKyAndWkvRU5HTElTSF9CVVRUT04ucG5nJywgMTM2LCAyNywgM10sXG4gICAgJ1NQQU5JU0hfQlVUVE9OJzogW0lNQUdFU19ST09UICsgJ3VpL1NQQU5JU0hfQlVUVE9OLnBuZycsIDEzNiwgMjcsIDNdLFxuICAgICdFTkFCTEVfQlVUVE9OX0JHJzogW0lNQUdFU19ST09UICsgJ3VpL0VOQUJMRV9TT1VORF9CVVRUT04ucG5nJywgMzYsIDM2LCAzXSxcbiAgICAnRElTQUJMRV9CVVRUT05fQkcnOiBbSU1BR0VTX1JPT1QgKyAndWkvRElTQUJMRV9TT1VORF9CVVRUT04ucG5nJywgMzYsIDM2LCAzXSxcblxuICAgIC8vIFBMQVlFUlxuICAgICdET0NUT1JUSUxMQV9QTEFZRVJfU1BSSVRFJzogW0lNQUdFU19ST09UICsgJ3BsYXllci9ET0NUT1JUSUxMQV9QTEFZRVJfU1BSSVRFLnBuZycsIDQ0LCA2MSwgNDFdLFxuICAgIFxuICAgIC8vIEJBQ0tTVEFHRVxuICAgICdWRU5ESU5HX01BQ0hJTkVfU1BSSVRFJzogW0lNQUdFU19ST09UICsgJ2JhY2tzdGFnZS9WRU5ESU5HX01BQ0hJTkVfU1BSSVRFLnBuZycsIDQ5LCA3MiwgM10sXG4gICAgJ0JBTkRfSU5fU09GQV9TUFJJVEUnOiBbSU1BR0VTX1JPT1QgKyAnYmFja3N0YWdlL0JBTkRfSU5fU09GQV9TUFJJVEUucG5nJywgNzAsIDc4LCAyM10sXG4gICAgJ0dMQVNTX0lOVl9TUFJJVEUnOiBbSU1BR0VTX1JPT1QgKyAnYmFja3N0YWdlL0dMQVNTX0lOVl9TUFJJVEUucG5nJywgNjgsIDI2LCA0XSxcbiAgICAnQ09TVFVNRV9JTlZfU1BSSVRFJzogW0lNQUdFU19ST09UICsgJ2JhY2tzdGFnZS9DT1NUVU1FX0lOVl9TUFJJVEUucG5nJywgNjgsIDI2LCA0XSxcbiAgICAnQkFDS1NUQUdFX0RPT1JfVE9fQkFDS1lBUkRfU1BSSVRFJzogW0lNQUdFU19ST09UICsgJ2JhY2tzdGFnZS9CQUNLU1RBR0VfRE9PUl9UT19CQUNLWUFSRF9TUFJJVEUucG5nJywgNjEsIDEwNCwgMl0sXG5cbiAgICAvL0JhY2t5YXJkXG4gICAgJ0JBQ0tZQVJEX0RPT1JfVE9fQkFDS1NUQUdFX1NQUklURSc6IFtJTUFHRVNfUk9PVCArICdiYWNreWFyZC9CQUNLWUFSRF9ET09SX1RPX0JBQ0tTVEFHRV9TUFJJVEUucG5nJywgMzEsIDEwNCwgMl0sXG4gICAgJ0JJTElfU1BSSVRFJzogW0lNQUdFU19ST09UICsgJ2JhY2t5YXJkL0JJTElfU1BSSVRFLnBuZycsIDQzLCA3MCwgMjRdLFxuICAgICdCQUxMT09OX1NQUklURSc6IFtJTUFHRVNfUk9PVCArICdiYWNreWFyZC9CQUxMT09OX1NQUklURS5wbmcnLCAyOCwgNTksIDEwXVxufTtcblxuY29uc3QgSU1BR0VTOiBJSW1hZ2VzSW5mbyA9IHtcbiAgICAvLyBVSVxuICAgICdVSV9CRyc6IElNQUdFU19ST09UICsgJ3VpL1VJX0JHLnBuZycsXG4gICAgJ1VJX0lOVl9CRyc6IElNQUdFU19ST09UICsgJ3VpL1VJX0lOVl9CRy5wbmcnLFxuICAgICdVSV9DT05WRVJTQVRJT05fQkcnOiBJTUFHRVNfUk9PVCArICd1aS9VSV9DT05WRVJTQVRJT05fQkcucG5nJyxcbiAgICAnTE9HTyc6IElNQUdFU19ST09UICsgJ3VpL0xPR08ucG5nJyxcbiAgICAnVEhFX0dBTUUnOiBJTUFHRVNfUk9PVCArICd1aS9USEVfR0FNRS5wbmcnLFxuICAgICdDUkVESVRTJzogSU1BR0VTX1JPT1QgKyAndWkvQ1JFRElUUy5wbmcnLFxuXG4gICAgLy8gQmFja3N0YWdlIHNjZW5lOlxuICAgICdCQUNLU1RBR0VfQkcnOiBJTUFHRVNfUk9PVCArICdiYWNrc3RhZ2UvQkFDS1NUQUdFX0JHLnBuZycsXG4gICAgJ0NBQkxFJzogSU1BR0VTX1JPT1QgKyAnYmFja3N0YWdlL0NBQkxFLnBuZycsXG4gICAgJ0NBQkxFX0lOVic6IElNQUdFU19ST09UICsgJ2JhY2tzdGFnZS9DQUJMRV9JTlYucG5nJyxcbiAgICAnU0tJUlQnOiBJTUFHRVNfUk9PVCArICdiYWNrc3RhZ2UvU0tJUlRfSU5WLnBuZycsXG4gICAgJ0JST09NJzogSU1BR0VTX1JPT1QgKyAnYmFja3N0YWdlL0JST09NLnBuZycsXG4gICAgJ0JST09NX0lOVic6IElNQUdFU19ST09UICsgJ2JhY2tzdGFnZS9CUk9PTV9JTlYucG5nJyxcbiAgICAnQkFDS1lBUkRfQkcnOiBJTUFHRVNfUk9PVCArICdiYWNreWFyZC9CQUNLWUFSRF9CRy5wbmcnLFxuICAgICdDQU5fSU5WJzogSU1BR0VTX1JPT1QgKyAnYmFja3N0YWdlL0NBTl9JTlYucG5nJyxcbiAgICAnQ09JTl9JTlYnOiBJTUFHRVNfUk9PVCArICdiYWNrc3RhZ2UvQ09JTl9JTlYucG5nJyxcbiAgICAnU0NJU1NPUlMnOiBJTUFHRVNfUk9PVCArICdiYWNrc3RhZ2UvU0NJU1NPUlMucG5nJyxcbiAgICAnU0NJU1NPUlNfSU5WJzogSU1BR0VTX1JPT1QgKyAnYmFja3N0YWdlL1NDSVNTT1JTX0lOVi5wbmcnLFxuICAgICdCT0NBRElMTE8nOiBJTUFHRVNfUk9PVCArICdiYWNrc3RhZ2UvQk9DQURJTExPLnBuZycsXG4gICAgJ0JPQ0FESUxMT19JTlYnOiBJTUFHRVNfUk9PVCArICdiYWNrc3RhZ2UvQk9DQURJTExPX0lOVi5wbmcnLFxuICAgICdCUkVBRF9JTlYnOiBJTUFHRVNfUk9PVCArICdiYWNrc3RhZ2UvQlJFQURfSU5WLnBuZycsXG4gICAgJ0JBQ09OX0lOVic6IElNQUdFU19ST09UICsgJ2JhY2tzdGFnZS9CQUNPTl9JTlYucG5nJyxcbiAgICAnQ09DT05VVCc6IElNQUdFU19ST09UICsgJ2JhY2tzdGFnZS9DT0NPTlVULnBuZycsXG4gICAgJ0NPQ09OVVRfSU5WJzogSU1BR0VTX1JPT1QgKyAnYmFja3N0YWdlL0NPQ09OVVRfSU5WLnBuZycsXG4gICAgJ0RVU1QnOiBJTUFHRVNfUk9PVCArICdiYWNrc3RhZ2UvRFVTVC5wbmcnLFxuICAgICdEVVNUX0lOVic6IElNQUdFU19ST09UICsgJ2JhY2tzdGFnZS9EVVNUX0lOVi5wbmcnLFxuICAgICdHTEFTUyc6IElNQUdFU19ST09UICsgJ2JhY2tzdGFnZS9HTEFTUy5wbmcnLFxuICAgICdMQU1QJzogSU1BR0VTX1JPT1QgKyAnYmFja3N0YWdlL0xBTVAucG5nJyxcbiAgICAnQkFDS1NUQUdFX0RPT1JfVE9fU1RSRUVUJzogSU1BR0VTX1JPT1QgKyAnYmFja3N0YWdlL0JBQ0tTVEFHRV9ET09SX1RPX1NUUkVFVC5wbmcnLFxuICAgICdCQUNLU1RBR0VfRE9PUl9UT19TVEFHRSc6IElNQUdFU19ST09UICsgJ2JhY2tzdGFnZS9CQUNLU1RBR0VfRE9PUl9UT19TVEFHRS5wbmcnLFxuICAgICdGTFlfQ0FTRSc6IElNQUdFU19ST09UICsgJ2JhY2tzdGFnZS9GTFlfQ0FTRS5wbmcnLFxuXG4gICAgLy8gQmFja3lhcmQ6XG4gICAgJ0ZMT1dFUlMnOiBJTUFHRVNfUk9PVCArICdiYWNreWFyZC9GTE9XRVJTLnBuZycsXG4gICAgJ0ZMT1dFUlNfSU5WJzogSU1BR0VTX1JPT1QgKyAnYmFja3lhcmQvRkxPV0VSU19JTlYucG5nJyxcbiAgICAnTEFNUF9CQUNLWUFSRCc6IElNQUdFU19ST09UICsgJ2JhY2t5YXJkL0xBTVBfQkFDS1lBUkQucG5nJyxcbiAgICAnTU9PTic6IElNQUdFU19ST09UICsgJ2JhY2t5YXJkL01PT04ucG5nJyxcbiAgICAnU1RBUic6IElNQUdFU19ST09UICsgJ2JhY2t5YXJkL1NUQVIucG5nJyxcbiAgICAnQ1VUX0ZMT1dFUlMnOiBJTUFHRVNfUk9PVCArICdiYWNreWFyZC9DVVRfRkxPV0VSUy5wbmcnXG59O1xuXG5jb25zdCBGT05UUzogSUZvbnRzSW5mbyA9IHtcbiAgICAnRk9OVF8zMl9CTEFDSyc6IFtJTUFHRVNfUk9PVCArICdmb250cy9mb250XzMyX2JsYWNrLnBuZycsIElNQUdFU19ST09UICsgJ2ZvbnRzL2ZvbnRfMzJfYmxhY2suZm50J10sXG4gICAgJ0ZPTlRfMzJfV0hJVEUnOiBbSU1BR0VTX1JPT1QgKyAnZm9udHMvZm9udF8zMl93aGl0ZS5wbmcnLCBJTUFHRVNfUk9PVCArICdmb250cy9mb250XzMyX3doaXRlLmZudCddLFxuICAgICdGT05UXzMyX09SQU5HRSc6IFtJTUFHRVNfUk9PVCArICdmb250cy9mb250XzMyX29yYW5nZS5wbmcnLCBJTUFHRVNfUk9PVCArICdmb250cy9mb250XzMyX29yYW5nZS5mbnQnXSxcbiAgICAnRk9OVF8zMl9CTFVFJzogW0lNQUdFU19ST09UICsgJ2ZvbnRzL2ZvbnRfMzJfYmx1ZS5wbmcnLCBJTUFHRVNfUk9PVCArICdmb250cy9mb250XzMyX2JsdWUuZm50J10sXG4gICAgJ0ZPTlRfMzJfUkVEJzogW0lNQUdFU19ST09UICsgJ2ZvbnRzL2ZvbnRfMzJfcmVkLnBuZycsIElNQUdFU19ST09UICsgJ2ZvbnRzL2ZvbnRfMzJfcmVkLmZudCddLFxuICAgICdGT05UXzMyX1lFTExPVyc6IFtJTUFHRVNfUk9PVCArICdmb250cy9mb250XzMyX3llbGxvdy5wbmcnLCBJTUFHRVNfUk9PVCArICdmb250cy9mb250XzMyX3llbGxvdy5mbnQnXSxcbiAgICAnRk9OVF8zMl9QVVJQTEUnOiBbSU1BR0VTX1JPT1QgKyAnZm9udHMvZm9udF8zMl9wdXJwbGUucG5nJywgSU1BR0VTX1JPT1QgKyAnZm9udHMvZm9udF8zMl9wdXJwbGUuZm50J11cbn07XG5cbmNvbnN0IEFVRElPOiBJQXVkaW9JbmZvID0ge1xuICAgICdTVUJFVEUnOiBTT1VORFNfUk9PVCArICdzdWJldGVfZWxfbWlkaS5vZ2cnLFxuICAgICdBTExJX0RPTkRFJzogU09VTkRTX1JPT1QgKyAnYWxsaV9kb25kZV9nYW1lLm9nZydcbn07XG5cbmNsYXNzIEFzc2V0c01hbmFnZXIge1xuXG4gICAgbG9hZEFzc2V0cyhnYW1lOiBQaGFzZXIuR2FtZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvYWRJbWFnZXMoZ2FtZSk7XG4gICAgICAgIHRoaXMubG9hZFNwcml0ZXMoZ2FtZSk7XG4gICAgICAgIHRoaXMubG9hZEZvbnRzKGdhbWUpO1xuICAgICAgICB0aGlzLmxvYWRTb3VuZHMoZ2FtZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkSW1hZ2VzKGdhbWU6IFBoYXNlci5HYW1lKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGltYWdlS2V5IGluIElNQUdFUykge1xuICAgICAgICAgICAgZ2FtZS5sb2FkLmltYWdlKGltYWdlS2V5LCBJTUFHRVNbaW1hZ2VLZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZFNwcml0ZXMoZ2FtZTogUGhhc2VyLkdhbWUpOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQgc3ByaXRlS2V5IGluIFNQUklURVMpIHtcbiAgICAgICAgICAgIGdhbWUubG9hZC5zcHJpdGVzaGVldChcbiAgICAgICAgICAgICAgICBzcHJpdGVLZXksXG4gICAgICAgICAgICAgICAgPHN0cmluZz4gU1BSSVRFU1tzcHJpdGVLZXldWzBdLFxuICAgICAgICAgICAgICAgIDxudW1iZXI+IFNQUklURVNbc3ByaXRlS2V5XVsxXSxcbiAgICAgICAgICAgICAgICA8bnVtYmVyPiBTUFJJVEVTW3Nwcml0ZUtleV1bMl0sXG4gICAgICAgICAgICAgICAgPG51bWJlcj4gU1BSSVRFU1tzcHJpdGVLZXldWzNdXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkRm9udHMoZ2FtZTogUGhhc2VyLkdhbWUpOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQgZm9udEtleSBpbiBGT05UUykge1xuICAgICAgICAgICAgZ2FtZS5sb2FkLmJpdG1hcEZvbnQoXG4gICAgICAgICAgICAgICAgZm9udEtleSxcbiAgICAgICAgICAgICAgICBGT05UU1tmb250S2V5XVswXSxcbiAgICAgICAgICAgICAgICBGT05UU1tmb250S2V5XVsxXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZFNvdW5kcyhnYW1lOiBQaGFzZXIuR2FtZSk6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBzb3VuZEtleSBpbiBBVURJTykge1xuICAgICAgICAgICAgZ2FtZS5sb2FkLmF1ZGlvKHNvdW5kS2V5LCBBVURJT1tzb3VuZEtleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbmV4cG9ydCBjb25zdCBhc3NldHNNYW5hZ2VyID0gbmV3IEFzc2V0c01hbmFnZXIoKTtcbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1BsYXllcic7XG5cbmV4cG9ydCBjbGFzcyBDb2luIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkOiAnY29pbicsXG4gICAgICAgICAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQ09JTl9JTlYnLFxuICAgICAgICAgICAgbmFtZTogJ0NPSU4nLFxuICAgICAgICAgICAgZGlyZWN0bHlJbkludmVudG9yeTogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdJX0FNX05PVF9SSUNIX0JVVF9JVF9JU19BX1NUQVJUJyk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vZW5naW5lL21vZGVscy9HYW1lJztcbmltcG9ydCB7IERPQ1RPUlRJTExBX0xBQkVMUyB9IGZyb20gJy4vRG9jdG9ydGlsbGFMYWJlbHMnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IEJhY2tzdGFnZVNjZW5lIH0gZnJvbSAnLi9iYWNrc3RhZ2VTY2VuZS9CYWNrc3RhZ2VTY2VuZSc7XG5pbXBvcnQgeyBCYWNreWFyZFNjZW5lIH0gZnJvbSAnLi9iYWNreWFyZFNjZW5lL0JhY2t5YXJkU2NlbmUnO1xuaW1wb3J0IHsgRGlyZWN0aW9ucyB9IGZyb20gJy4uL2VuZ2luZS91dGlscy9EaXJlY3Rpb25zJztcbmltcG9ydCB7IHVpQmxvY2tlciB9IGZyb20gJy4uL2VuZ2luZS91aS9VSUJsb2NrZXIuc2luZ2xldG9uJztcblxuZXhwb3J0IGNsYXNzIERvY3RvcnRpbGxhR2FtZSBleHRlbmRzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGxhYmVsczogRE9DVE9SVElMTEFfTEFCRUxTLFxuICAgICAgICAgICAgcGxheWVyOiBuZXcgRG9jdG9ydGlsbGFQbGF5ZXIoKSxcbiAgICAgICAgICAgIHNjZW5lczogW1xuICAgICAgICAgICAgICAgIG5ldyBCYWNrc3RhZ2VTY2VuZSgpLFxuICAgICAgICAgICAgICAgIG5ldyBCYWNreWFyZFNjZW5lKClcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpbml0aWFsU2NlbmVJZDogJ0JBQ0tTVEFHRScsXG4gICAgICAgICAgICBzb25nczogWydBTExJX0RPTkRFJywgJ1NVQkVURSddXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvblN0YXJ0KCk6IHZvaWQge1xuICAgICAgICB1aUJsb2NrZXIuYmxvY2soKTtcbiAgICAgICAgbGV0IHBsYXllciA9IHRoaXMub3B0aW9ucy5wbGF5ZXI7XG4gICAgICAgIHBsYXllci5tb3ZlVG8oeyB4OiAxMTUsIHk6IDE4N30pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLndhaXQoMTAwMCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHBsYXllci5sb29rQXQoRGlyZWN0aW9ucy5ET1dOKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnTEFURV9GT1JfQ09OQ0VSVCcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIud2FpdCgxMDAwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnQUdBSU4nKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLndhaXQoMTAwMCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1RIRV9PVEhFUlNfV0lMTF9CRV9SRUFEWScpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIubW92ZVRvKHsgeDogMzgzLCB5OiAxODN9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdWlCbG9ja2VyLnVuYmxvY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IElMYWJlbHMgIH0gZnJvbSAnLi4vZW5naW5lL3N0b3Jlcy9MYWJlbHMuc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgRE9DVE9SVElMTEFfTEFCRUxTOiBJTGFiZWxzID0ge1xuICAgICdlcyc6IHtcbiAgICAgICAgJ0FfQlJPT01fVEhFX1BFUkZFQ1RfQ0xFQU5JTkdfSU5TVFJVTUVOVCc6ICdVbmEgZXNjb2JhLCBlbCBpbnN0cnVtZW50byBkZSBsaW1waWV6YSBwZXJmZWN0by4nLFxuICAgICAgICAnQV9SQU5DSURfQU5EX0dSRUFTWV9TQU5EV0hJQ0gnOiAnVW4gYm9jYWRpbGxvIHJhbmNpbyB5IEdSQVNJRU5UTy4nLFxuICAgICAgICAnQUdBSU4nOiAnT3RyYSB2ZXouLi4nLFxuICAgICAgICAnQUxMX0lOX0FMTF9IRV9JU19BX0dPT0RfR1VZJzogJ0J1ZW5hIGdlbnRlIGVsIEJpbGkuJyxcbiAgICAgICAgJ0FMTF9SRUFEWV9GSU5EX0JJTEknOiAnwqFUb2RvIGFycmVnbGFkbyEgVm95IGEgYnVzY2FyIGEgQmlsaSB5IGVtcGV6YW1vcy4nLFxuICAgICAgICAnQU5EX0VYUEVOU0lWRSc6ICcuLi4geSBjYXJhcy4nLFxuICAgICAgICAnQU5EX0lfQU1fTk9UX0dPSU5HX1RPX0dJVkVfSElNX0FOWSc6ICdZIG5vIGxlIHZveSBhIGRhciBtw6FzLicsXG4gICAgICAgICdBTkRfV0VfTEVBUk5FRCc6ICd5IGhlbW9zIGFwcmVuZGlkby4nLFxuICAgICAgICAnQVJHSCc6ICfCoUFyZ2ghJyxcbiAgICAgICAgJ0FTS19BQk9VVF9DQUJMRSc6ICfCv1kgYWhvcmEgZMOzbmRlIGVuY3VlbnRybyB1biBjYWJsZSwgc28gdmFnb3M/JyxcbiAgICAgICAgJ0FTS19BQk9VVF9DT1NUVU1FJzogJ0RpbWUgbcOhcyBhY2VyY2EgZGVsIGRpc2ZyYXogcXVlIGZhbHRhLicsXG4gICAgICAgICdBU0tfQUJPVVRfU0FOVEknOiAnwr9RdcOpIHRlIHBhc2EsIFNhbnRpPycsXG4gICAgICAgICdCQUNLU1RBR0UnOiAnYmFja3N0YWdlJyxcbiAgICAgICAgJ0JBQ0tZQVJEJzogJ2Rlc2NhbXBhZG8nLFxuICAgICAgICAnQkFDT04nOiAncGFuY2V0YScsXG4gICAgICAgICdCQUxMT09OJzogJ2dsb2JvJyxcbiAgICAgICAgJ0JBUkVMWV9UQVNURURfTElLRV9EUlVHJzogJ0JhaCwgbm8gc2Fiw61hIGEgZHJvZ2EgYXBlbmFzLi4uJyxcbiAgICAgICAgJ0JFQVVUSUZVTF9TT01FVEhJTkcnOiAnRXMgdW4gY29zbyBtdXkgYm9uaXRvLicsXG4gICAgICAgICdCSUxJJzogJ0JpbGknLFxuICAgICAgICAnQklMSV9NVVNUX0JFX09VVF9USEVSRV9TTU9LSU5HJzogJ0JpbGkgZGViZSBlc3RhciBmdWVyYSBmdW1hbmRvLicsXG4gICAgICAgICdCT0NBRElMTE8nOiAnYm9jYWRpbGxvIGRlIHBhbmNldGEnLFxuICAgICAgICAnQlVSUCc6ICfCoUJ1cnAhJyxcbiAgICAgICAgJ0JSRUFEJzogJ3BhbicsXG4gICAgICAgICdCUkVBRF9MRUZUT1ZFUlNfTk9UX1VTRUZVTCc6ICdTb2JyYXMgZGUgcGFuLCBuYWRhIMO6dGlsLicsXG4gICAgICAgICdCUk9PTSc6ICdlc2NvYmEnLFxuICAgICAgICAnQ0FCTEUnOiAnY2FibGUnLFxuICAgICAgICAnQ0FOJzogJ2xhdGEgZGUgcmVmcmVzY28nLFxuICAgICAgICAnQ0FOTk9UX1BJQ0tfQV9ET09SX1VQJzogJ05vIHB1ZWRvIGNvZ2VyIGxhIHB1ZXJ0YSwgcm9tcGVyw61hIHRvZG8gZWwgZWRpZmljaW8uJyxcbiAgICAgICAgJ0NMT05LJzogJ0Nsb25rXFxuICAgY2xvbmtcXG4gICAgICBjbG9uaycsXG4gICAgICAgICdDT0NPTlVUJzogJ2NvY28nLFxuICAgICAgICAnQ09JTic6ICdtb25lZGEnLFxuICAgICAgICAnQ09PTF9OT1dfSV9TSE9VTERfR0lWRV9JVF9UT19USEVfR1VZUyc6ICdCaWVuLCBhaG9yYSBkZWJlcsOtYSBkw6Fyc2VsbyBhIGxvcyBjaGljb3MuJyxcbiAgICAgICAgJ0NPTVBBUkVfQ09NUFJBTUVfVU5fQ09DTyc6ICdDb21wYXJlIGPDs21wcmFtZSB1biBjb2NvLicsXG4gICAgICAgICdDT1NUVU1FJzogJ2Rpc2ZyYXonLFxuICAgICAgICAnREVMSUNJT1VTX0FORF9HUkVBU1knIDogJ8KhRGVsaWNpb3NvIHkgR1JBU0lFTlRPIScsXG4gICAgICAgICdET0VTX0lUX0xPT0tfTElLRV9BX1BBSVJfT0ZfVElUUyc6ICfCv05vIHBhcmVjZW4gZG9zIHRldGFzPycsXG4gICAgICAgICdET09SX1RPX0JBQ0tTVEFHRSc6ICdwdWVydGEgYWwgYmFja3N0YWdlJyxcbiAgICAgICAgJ0RPT1JfVE9fQkFDS1lBUkQnOiAncHVlcnRhIGFsIGRlc2NhbXBhZG8nLFxuICAgICAgICAnRE9PUl9UT19TVEFHRSc6ICdwdWVydGEgYWwgZXNjZW5hcmlvJyxcbiAgICAgICAgJ0RPT1JfVE9fU1RSRUVUJzogJ3B1ZXJ0YSBhIGxhIGNhbGxlJyxcbiAgICAgICAgJ0RSVUdTX0FSRV9CQUQnOiAnLi4uIHPDrSB0w61vIGxhcyBkcm9nYXMgc29uIG1hbGFzIC4uLicsXG4gICAgICAgICdEUlVOS18xJzogJ0VmdG95IGRlIGZsdXRhIG1hcmVlZWUuJyxcbiAgICAgICAgJ0RSVU5LXzInOiAnwr9HSEpTSEo/IHRkb28gZnRlbm5ubiBtcGFlZWUhJyxcbiAgICAgICAgJ0RSVU5LXzMnOiAnwqFBIG9wZSBlbiBsYXMgZHJpamlqaWppaWppcyEnLFxuICAgICAgICAnRFJVTktfNCc6ICfCoUJpcnJycnJycnJhYWFhYWFhYWFtYXNzc3Nzc3MhJyxcbiAgICAgICAgJ0RSVU5LXzUnOiAnwr9CZXJyZXJlcmVyZXJiZXJlY2hvISDCoUNhdGFmYWZhc3Ryb2ZpY28hJyxcbiAgICAgICAgJ0RSVU5LXzYnOiAnTXN0YWFhbiBmdXNjYW5kaW8gcmVwdGxpYW5kZXJlZS4nLFxuICAgICAgICAnRFJVTktfQklMSSc6ICdCaWxpIGJvcnJhY2hvJyxcbiAgICAgICAgJ0ZJTkFMTFlfSV9HT1RfVEhFX0NBQkxFJzogJ8KhUG9yIGZpbiB0ZW5nbyBlbCBjYWJsZSEnLFxuICAgICAgICAnRklSU1RfQU5HRUxfQ0FCTEUnIDogJ1ByaW1lcm8sIG5lY2VzaXRhbW9zIHVuIGNhYmxlIHBhcmEgZWwgYW1wbGkgZGUgw4FuZ2VsJyxcbiAgICAgICAgJ0ZJUlNUX0lfTkVFRF9UT19HRVRfVEhFX0JBTkRfUkVBRFknIDogJ1ByaW1lcm8gdGVuZ28gcXVlIHByZXBhcmFyIGEgbGEgYmFuZGEuJyxcbiAgICAgICAgJ0ZJUlNUX09GX0FMTF9JX1NIT1VMRF9UQUxLX1RPX1RIRV9CQU5EJzogJ1ByaW1lcm8gZGViZXLDrWEgaGFibGFyIGNvbiBlbCBncnVwby4nLFxuICAgICAgICAnRkxPV0VSUyc6ICdmbG9yZXMnLFxuICAgICAgICAnRk9VTkRfVEhFX0NBQkxFJzogJ8KhVGVuZ28gdW4gY2FibGUhJyxcbiAgICAgICAgJ0dMQVNTJzogJ3Zhc28nLFxuICAgICAgICAnR09UX1RIRV9DT1NUVU1FJzogJ1RlIGhlIGhlY2hvIHVuIGRpc2ZyYXouJyxcbiAgICAgICAgJ0dVTFBfR1VMUF9HVUxQJzogJ0dsdXBcXG4gICBHbHVwXFxuICAgICAgR2x1cCcsXG4gICAgICAgICdIQVZFX0FfRFJJTktfU0FOVEknOiAnRWggU2FudGksIHRvbWEgZXN0YSBiZWJpZGEuJyxcbiAgICAgICAgJ0hBVkVfSV9FVkVSX0ZBSUxFRF9ZT1UnOiAnwr9UZSBoZSBmYWxsYWRvIGFsZ3VuYSB2ZXogKGhveSk/JyxcbiAgICAgICAgJ0hBVkVfWU9VX1NFRU5fQklMSSc6ICdNbW0sIMK/ZMOzbmRlIGVzdMOhIEJpbGk/JyxcbiAgICAgICAgJ0hFX0lTX0JFSU5HX0dPT0RfRk9SX05PV19OT19ORUVEX1RPX0VYUExPREVfSVQnOiAnU2UgZXN0w6EgcG9ydGFuZG8gYmllbiBwb3IgYWhvcmEsIG5vIGhhY2UgZmFsdGEgZXhwbG90YXJsZSBlbCBnbG9iby4nLFxuICAgICAgICAnSEVfSVNfRFJJTktJTkdfTElLRV9BX01BTklBQyc6ICdFc3TDoSBiZWJpZW5kbyBjb21vIHNpIG5vIGh1YmllcmEgdW4gbWHDsWFuYSwgaGFicsOtYSBxdWUgZW1wZXphciBlbCBjb25jaWVydG8geWEuJyxcbiAgICAgICAgJ0hFX0lTX09VVF9TTU9LSU5HJzogJ0VzdMOhIGZ1ZXJhLCBmdW1hbmRvIHkgYmViaWVuZG8uIE8gZW1wZXphbW9zIHByb250byBvIHNlIHZhIGEgcG9uZXIgY29tbyBsYXMgR3JlY2FzLicsXG4gICAgICAgICdIRV9JU19EUlVOS19BU19BX1NLVU5LJzogJ1NpcCwgY2llZ28gY29tbyB1bmEgcGVycmEuJyxcbiAgICAgICAgJ0hFWV9CSUxJX0hPV19JU19JVF9HT0lORyc6ICfCoUV5IEJpbGkhIMK/Q8OzbW8gdmEgZXNvPycsXG4gICAgICAgICdIRVlfQklMSV9SRUFEWV9UT19QTEFZJzogJ8KhRXkgQmlsaSEgwr9MaXN0byBwYXJhIHRvY2FyPycsXG4gICAgICAgICdISV9ET09SX0hPV19BUkVfWU9VX1RPREFZJzogJ8KhSG9sYSBwdWVydGEhIMK/Q8OzbW8gYW5kYXMgaG95PycsXG4gICAgICAgICdISV9USEVSRSc6ICdIb2xhIGhvbGl0YS4nLFxuICAgICAgICAnSE9XX0lTX0JJTElfRE9JTkcnOiAnwr9Dw7NtbyB2YSBCaWxpLCBwb3IgY2llcnRvPycsXG4gICAgICAgICdJX0FMUkVBRFlfSEFWRV9JVCc6ICdZYSBlc3TDoSBlbiBtaSBwb3Nlc2nDs24uJyxcbiAgICAgICAgJ0lfQUxSRUFEWV9QVVNIRURfSVQnOiAnWWEgbGEgaGUgZW1wdWphZG8gbm8gcXVlcnLDrWEgcGFzYXJtZS4nLFxuICAgICAgICAnSV9BTV9BV0FLRSc6ICfCoUFoaGhoaCEgwqHCocKhRVNUT1kgREVTUElFUlRPISEhJyxcbiAgICAgICAgJ0lfQU1fSlVTVF9LRUVQSU5HX01ZX1RIUk9BVF9XQVJNJzogJ1NvbG8gZXN0b3kgY2FsZW50YW5kbyBsYSBnYXJnYW50YSwgbm8gdGUgcHJlb2N1cGVzLicsXG4gICAgICAgICdJX0FNX05PVF9EUlVOS19BTllNT1JFJzogJ8KhR3VhdSEgWWEgbm8gZXN0b3kgYm9ycmFjaG8uJyxcbiAgICAgICAgJ0lfQU1fTk9UX1JJQ0hfQlVUX0lUX0lTX0FfU1RBUlQnOiAnTm8gc295IHJpY28sIHBlcm8gcG9yIGFsZ28gc2UgZW1waWV6YS4nLFxuICAgICAgICAnSV9BTV9OT1RfR09JTkdfVE9fQVNLX1dIRVJFX1RISVNfQ09NRVNfRlJPTSc6ICdObyB0ZSB2b3kgYSBwcmVndW50YXIgZGUgZMOzbmRlIGxvIGhhcyBzYWNhZG8uLi4nLFxuICAgICAgICAnSV9BTV9TVEFUUklOR19UT19GRUVMX1JFQURZX1RPX1BMQVknOiAnUXXDqSByYXJvLCBkZSByZXBlbnRlIG1lIG5vdG8gbGlzdG8gcGFyYSB0b2Nhci4nLFxuICAgICAgICAnSV9CRVRfSV9DT1VMRF9ET19BX0JFQVVUSUZVTF9DT1NUVU1FX1dJVEhfSVQnOiAnQ3JlbyBxdWUgcG9kcsOtYSBoYWNlciB1biBidWVuIGRpc2ZyYXogY29uIGVzdG8uJyxcbiAgICAgICAgJ0lfQkVUX1RIQVRfU1VTUElDSU9TX1dISVRFX1BPV0RFUl9GUk9NX1RIRV9UQUJMRV9DQU5fTUFLRV9TT01FQk9EWV9MRVNTX1NIWSc6ICdTZWd1cm8gcXVlIGVzZSBwb2x2byBzb3NwZWNob3NvIGRlIGxhIG1lc2EgcHVlZGUgaGFjZXIgcXVlIFwiYWxndWllblwiIHNlYSBtZW5vcyB0w61taWRvLicsXG4gICAgICAgICdJX0JFVF9USElTX0RVU1RfQ0FOX01BS0VfU09NRUJPRFlfTEVTU19TSFknOiAnU2VndXJvIHF1ZSBlc3RlIFwicG9sdm9cIiBwdWVkZSBoYWNlciBhIFwiYWxndWllblwiIG1lbm9zIHTDrW1pZG8uJyxcbiAgICAgICAgJ0lfQ0FOX0hFQVJfVEhFX0NST1dEX1dBSVRJTkdfRk9SX1VTJzogJ1B1ZWRvIG9pciBhIGxhIG11Y2hlZHVtYnJlIGdyaXRhbmRvLCBtZW5vcyBtYWwgcXVlIGVzdGEgcHVlcnRhIG5vcyBwcm90ZWdlLicsXG4gICAgICAgICdJX0NBTlRfTU9WRV9USEFUJzogJ05vIHB1ZWRvIG1vdmVyIGVzby4nLFxuICAgICAgICAnSV9DQU5UX0RPX1RIQVQnOiAnTm8gcHVlZG8gaGFjZXIgZXNvLicsXG4gICAgICAgICdJX0NPVUxEX01BS0VfQV9IQVdBSUlBTl9DT1NUVU1FJzogJ1BvZHLDrWEgaGFjZXIgdW4gZGlzZnJheiBkZSBoYXdhaWFuYS4nLFxuICAgICAgICAnSV9DT1VMRF9NQUtFX0FfV0lHX1dJVEhfVEhJUyc6ICdQb2Ryw61hIGhhY2VyIHVuYSBwZWx1Y2EgcnViaWEgY29uIGVzdG8uJyxcbiAgICAgICAgJ0lfRE9OVF9LTk9XX0hPV19UT19ET19USEFUJzogJ05vIHPDqSBoYWNlciBlc28uJyxcbiAgICAgICAgJ0lfRE9OVF9LTk9XX0hPV19UT19VU0VfVEhBVF9XSVRIX1ZFTkRJTkdfTUFDSElORSc6ICdObyBzw6kgY8OzbW8gdXNhciBlc28gY29uIHVuYSBtw6FxdWluYSBleHBlbmRlZG9yYS4uLicsXG4gICAgICAgICdJX0hBVkVfQV9DT05DRVJUX1RPX1BMQVknOiAnwqFUZW5nbyB1biBjb25jaWVydG8gcXVlIHRvY2FyIScsXG4gICAgICAgICdJX0hBVkVfQkVUVEVSX1RISU5HU19UT19ET19USEFOX1RBTEtJTkcnOiAnVGVuZ28gY29zYXMgbWVqb3JlcyBxdWUgaGFjZXIgcXVlIGhhYmxhciBjb24gb2JqZXRvcy4nLFxuICAgICAgICAnSV9IQVZFX1RPX0ZJTkRfQV9XQVlfVE9fU09CRVJfSElNX1VQJzogJ1RlbmdvIHF1ZSBlbmNvbnRyYXIgdW5hIGZvcm1hIGRlIGVzcGFiaWxhcmxvLicsXG4gICAgICAgICdJX0hBVkVfVE9fRklOSVNIX1RIRV9DT1NUVU1FX0ZJUlNUJzogJ1RlbmdvIHF1ZSB0ZXJtaW5hciBlbCBkaXNmcmF6IHByaW1lcm8uJyxcbiAgICAgICAgJ0lfSEFWRV9UT19QSUNLX0lUX1VQX0ZJUlNUJzogJ1RlbmdvIHF1ZSBjb2dlcmxvIHByaW1lcm8uJyxcbiAgICAgICAgJ0lfSEVBUkRfVEhFX0dVWVNfQVJFX0hBVklOR19TT01FX1BST0JMRU1TJzogJ0hlIG/DrWRvIHF1ZSBsb3MgY2hpY29zIGVzdMOhbiB0ZW5pZW5kbyBhbGd1bm9zIHByb2JsZW1hcy4nLFxuICAgICAgICAnSV9TSE9VTERfQUREX0FfU0tJUlRfVE9fSVQnOiAnRGViZXLDrWEgYcOxYWRpcmxlIHVuYSBmYWxkYS4nLFxuICAgICAgICAnSV9TSE9VTERfR09fRklORF9CSUxJJzogJ1RlbmdvIHF1ZSBidXNjYXIgYSBCaWxpIHBhcmEgcXVlIGVtcGVjZW1vcyBhIHRvY2FyLicsXG4gICAgICAgICdJX1NIT1VMRF9QUk9CQUJMWV9NSVhfSVRfSU5fQV9HTEFTUyc6ICdEZWJlcsOtYSBtZXpjbGFybG8gZW4gdW4gdmFzbywgY29tbyBsYXMgcGVyc29uYXMuJyxcbiAgICAgICAgJ0lfU0hPVUxEX1BVVF9TT01FVEhJTkdfTU9SRV9JTlRFUkVTVElOR19JTl9USEVfR0xBU1MnOiAnRGViZXLDrWEgcG9uZXIgY29zYXMgbcOhcyBpbnRlcmVzYW50ZXMgZW4gZWwgdmFzby4nLFxuICAgICAgICAnSV9TSE9VTERfU09CRVJfQklMSV9VUCc6ICdEZWJlcsOtYSBoYWNlciBxdWUgQmlsaSBzZSBsZSBwYXNhciBsYSBjb2dvcnphLicsXG4gICAgICAgICdJX1NIT1VMRF9UQUtFX1RIRV9CQUNPTl9PVVRfT0ZfVEhFX0JSRUFEX0ZJUlNUJzogJ0RlYmVyw61hIHNhY2FyIGxhIHBhbmNldGEgZGVsIHBhbi4nLFxuICAgICAgICAnSV9USElOS19JX0NBTl9PUEVOX0lUX0FORF9UQUtFX1RIRV9CQUNPTic6ICdDcmVvIHF1ZSBwdWVkbyBhYnJpcmxvIHkgc2FjYXIgbGEgcGFuY2V0YS4nLFxuICAgICAgICAnSV9USElOS19NWV9NQVNURVJQSUVDRV9JU19DT01QTEVURSc6ICdNaSBvYnJhIGRlIGFydGUgZXN0w6EgdGVybWluYWRhLicsXG4gICAgICAgICdJX1dJTExfV0FJVF9GT1JfVEhFTV9UT19CRV9TT0xWRUQnOiAnRXNwZXJhcsOpIHF1ZSBzZSByZXN1ZWx2YSB0b2RvIHBvciBhcnRlIGRlIG1hZ2lhLicsXG4gICAgICAgICdJX1dPTkRFUl9JRl9USEVfR1VZU19IQVZFX0VWRVJZVEhJTkdfUkVBRFknOiAnTWUgcHJlZ3VudG8gc2kgbG9zIGNoaWNvcyBsbyB0ZW5kcsOhbiB0b2RvIGxpc3RvLi4uJyxcbiAgICAgICAgJ0lfV09VTERfRE9fSVRfTVlTRUxGJzogJ0xvIGhhcsOtYSB5bywgcGVybyBlcyB1biBwb2NvIGlsZWdhbC4uLicsXG4gICAgICAgICdJX1dPVUxETlRfS05PV19XSEFUX1RPX1NBWSc6ICdObyBzYWJyw61hIHF1w6kgZGVjaXIuJyxcbiAgICAgICAgJ0lGX0lfQUREX1NPTUVfQk9PQlNfSVRfV0lMTF9MT09LX0xJS0VfQV9IQVdBSUlBTl9EUkVTUyc6ICdTaSBsZSBhw7FhZG8gdW5hcyB0ZXRhcywgcGFyZWNlIHVuIGRpc2ZyYXogaGF3YWlhbm8uJyxcbiAgICAgICAgJ0lGX0lfQ09VTERfUFVUX0dSRUFTRV9CRUxPVyc6ICdTaSBwdWRpZXJhIGVuZ3Jhc2FybGEgdW4gcG9jby4uLicsXG4gICAgICAgICdJTVBMSUVTX01PVkVNRU5UJzogJy4uLiB5IHJlcXVpZXJlIHVuYSBjaWVydGEgY2FudGlkYWQgZGUgZXNmdWVyem8geSBtb3ZpbWllbnRvLicsXG4gICAgICAgICdJVF9JU19BX0xPTkdfVElNRV9UUkFESVRJT05fVEhBVF9XRV9BTExfRFJFU1NFRF9VUCc6ICdFcyB1bmEgdHJhZGljacOzbiBxdWUgZW1wZXphbW9zIGhhY2UgdGllbXBvLCBkaXNmcmF6YXJub3MgcGFyYSBsb3MgY29uY2llcnRvcy4uLicsXG4gICAgICAgICdJVF9JU19BTFJFQURZX0NMT1NFRCc6ICdZYSBlc3TDoSBjZXJyYWRhLicsXG4gICAgICAgICdJVF9JU19BTFJFQURZX0ZVTEwnOiAnWWEgZXN0w6EgbGxlbm8uJyxcbiAgICAgICAgJ0lUX0lTX0lOREVFRF9BX0dMQVNTJzogJ0VzIHVuIHZhc28uIFVuIHZhc28gZmV0w6luLicsXG4gICAgICAgICdJVF9JU19TVFVDS19CRUhJTkRfVEhFX1ZFTkRJTkdfTUFDSElORSc6ICdFc3TDoSBhdHJhcGFkbyBkZXRyw6FzIGRlIGxhIG3DoXF1aW5hIGV4cGVuZGVkb3JhLCBuZWNlc2l0byBtb3ZlcmxhIGRlIGFsZ3VuYSBmb3JtYS4nLFxuICAgICAgICAnSVRfV0FTX0NPV0JPWV9DT1NUVU1FJzogJ1VuIGRpc2ZyYXogZGUgdmFxdWVybywgZGUgbG9zIGJ1ZW5vcy4nLFxuICAgICAgICAnSVNfU09NRUhPV19EQU5HRVJPVVMnOiAnLi4uIG1hcmdpbmFsbWVudGUgcGVsaWdyb3NvLCBkaXLDrWEgeW8gLi4uJyxcbiAgICAgICAgJ0lTX1RIQVRfQV9DQUJMRV9CRUhJTkRfVEhFX1ZFTkRJTkdfTUFDSElORSc6ICfCv0hheSB1biBjYWJsZSBkZXRyw6FzIGRlIGxhIG3DoXF1aW5hIGV4cGVuZGVkb3JhPycsXG4gICAgICAgICdKVVNUX1NURUFMX09ORSc6ICdObyBzw6kgdMOtbywgcm9iYSBhbGd1bm8gZG9uZGUgc2VhLicsXG4gICAgICAgICdMQVRFX0ZPUl9DT05DRVJUJzogJ1B1ZmYsIGxsZWdvIGRvcyBob3JhcyB0YXJkZSBhIG1pIHByb3BpbyBjb25jaWVydG8uJyxcbiAgICAgICAgJ0xFVF9TX1NBWV9JX0hBVkVfTVlfU09VUkNFUyc6ICdEaWdhbW9zIHF1ZSB0ZW5nbyBtaXMgcmVjdXJzb3MuLi4nLFxuICAgICAgICAnTEVUU19GSVhfVEhJU19NRVNTJzogJ1ZhbGUsIG1lIHZveSBhIHZlciBzaSBhcnJlZ2xvIGVzdG8uJyxcbiAgICAgICAgJ01BREVfT0ZfTUVUQUxfUlVTVF9BTkRfU1RJQ0tZX1NUVUZGJzogJ1B1ZXJ0YS4gQ29tcG9zaWNpw7NuOiA4MCUgbWV0YWwsIDE1JSDDs3hpZG8sIDUlIGFsZ28gcGVnYWpvc28gc2luIGlkZW50aWZpY2FyLicsXG4gICAgICAgICdNQU5fWU9VX1NIT1VMRF9LTk9XX1RISVMnOiAnwqFDb21wYWUsIGRlYmVyw61hcyBzYWJlcmxvLCBsbyBlbXBlemFzdGUgdMO6IScsXG4gICAgICAgICdNQVlCRV9JX0NBTl9CVUlMRF9BX0NPU1RVTUVfTVlTRUxGJzogJ0EgbG8gbWVqb3IgcHVlZG8gaGFjZXIgdW4gZGlzZnJheiBjb24gbGFzIGNvc2FzIHF1ZSBoYXkgcG9yIGFxdcOtLicsXG4gICAgICAgICdNQVlCRV9JX0NBTl9TQ0FSRV9ISU1fU09fSEVfR0VUU19TT0JFUic6ICdJZ3VhbCBsbyBwdWVkbyBhc3VzdGFyIGEgdmVyIHNpIHNlIGVzcGFiaWxhLicsXG4gICAgICAgICdNQVlCRV9TQU5USV9ORUVEU19TT01FVEhJTkdfVE9fRFJJTksnOiAnQ3JlbyBxdWUgU2FudGkgbmVjZXNpdGEgYWxnbyBkZSBiZWJlci4nLFxuICAgICAgICAnTUlORV9XQVNfV0FZX0JFVFRFUic6ICdFbCBtw61vIGVyYSBtdWNobyBtZWpvci4nLFxuICAgICAgICAnTU1NX0FfUkVGUkVTSElOR19CRVZFUkFHRSc6ICfCoU1tbSB1biByZWZyZXNjYW50ZSByZWZyZXNjbyEgwqFHcmFjaWFzIScsXG4gICAgICAgICdNWV9HUkFOREZBVEhFUl9TQUlEX0FfQ09TVFVNRV9NVVNUX0hBVkVfM19USElOR1MnOiAnTWkgYWJ1ZWxvIHNpZW1wcmUgZGVjw61hOiBcIlVuIGJ1ZW4gZGlzZnJheiBkZWJlIHRlbmVyIGFsIG1lbm9zIDMgY29tcG9uZW50ZXNcIi4nLFxuICAgICAgICAnTklDRV9DT1NUVU1FX0hFX01BREUnOiAnwqFFc3RhIHZlIHNlIGhhIGN1cnJhZG8gZWwgZGlzZnJheiEnLFxuICAgICAgICAnTklDRV9JVF9XSUxMX1NMSURFX1JFQUxMWV9XRUxMX05PVyc6ICdCaWVuLCBhaG9yYSBlc2N1cnJpcsOhIHNpbiBwcm9ibGVtYS4uLicsXG4gICAgICAgICdOSUNFX09CSkVDVCc6ICdQcmVjaW9zbyBvYmpldG8uJyxcbiAgICAgICAgJ05JQ0VfU0FGRV9ET09SJzogJ0VzIHVuYSBwdWVydGEuIMOadGlsIHBhcmEgZGVsaW1pdGFyIMOhcmVhcy4nLFxuICAgICAgICAnTk9QRV9JX0NBTk5PVF9HT19UT19USEVfU1RSRUVUJzogJ05vLCBubyBwdWVkbyBpciBhIGxhIGNhbGxlIGHDum4uJyxcbiAgICAgICAgJ05PUEVfSV9DQU5OT1RfR09fVE9fVEhFX1NUQUdFJzogJ05vLCBubyBwdWVkbyBpciBhbCBlc2NlbmFyaW8gYcO6bi4nLFxuICAgICAgICAnTk9QRV9JX0RPTlRfV0FOVF9UT19UQUtFX0JJTElTX0JBTExPT04nOiAnTm8sIG5vIHF1aWVybyBjb2dlciBlbCBnbG9ibyBkZSBCaWxpLCBsZSBxdWVkYSBiaWVuIGVuIHN1IGRpc2ZyYXouJyxcbiAgICAgICAgJ05PVF9UT19CQURfQUxMX1RISU5HU19DT05TSURFUkVEJzogJ05vIHZhIG1hbCBsYSBjb3NhLicsXG4gICAgICAgICdOT1RfU0FGRV9IQVZJTkdfU0NJU1NPUlNfQVJPVU5EX01VU0lDSUFOUyc6ICdObyBlcyBzZWd1cm8gZGVqYXIgdW5hcyB0aWplcmFzIGVuIHVuIHNpdGlvIGNvbiBtw7pzaWNvcy4nLFxuICAgICAgICAnTk9UX1NBWUlOR19XRV9TSE9VTERfVVNFX1RIRU0nOiAnTm8gZGlnbyBxdWUgbGFzIHVzZW1vcywgcGVyby4uLicsXG4gICAgICAgICdOT1dfSV9DT1VMRF9QVVNIX1RISVNfTUFDSElORSc6ICdBaG9yYSBwdWVkbyBlbXB1amFyIGxhIG3DoXF1aW5hLicsXG4gICAgICAgICdOT1dfSV9TSE9VTERfU0FZX1NPTUVUSElOR19TTUFSVF9USEFUX0hFTFBTJzogJ0Fob3JhIGRlYmVyw61hIGRlY2lyIGFsZ28gaW50ZWxpZ2VudGUgcXVlIGF5dWRhcmEuJyxcbiAgICAgICAgJ09IX0xPT0tfQVRfVEhBVCc6ICfCoUFuZGEhIMKhTWlyYSBlc28hJyxcbiAgICAgICAgJ09IX01ZX1lPVV9BUkVfRFJVTktfQVJFTlRfWU9VJzogJ01hZHJlIG3DrWEsIMK/ZXN0w6FzIGNvbW8gdW5hIGN1YmEsIG5vPycsXG4gICAgICAgICdPS19JX0xMX1BVVF9JVF9PTic6ICdWYWxlIGplZmUsIG1lIGxvIHBvbmdvLicsXG4gICAgICAgICdPS19TRUVfWU9VX0xBVEVSJzogJ1ZlbmdhLCBub3MgdmVtb3MuJyxcbiAgICAgICAgJ09ORV9DT05DRVJUX0FfWUVBUl9JU19UT09fTVVDSF9QUkVTU1VSRSc6ICdVbiBjb25jaWVydG8gYWwgYcOxbywgcXXDqSBwcmVzacOzbi4nLFxuICAgICAgICAnUExFQVNFX0RPTlRfRFJJTktfVE9PX01VQ0gnOiAnUG9yIGZhdm9yLCBubyBiZWJhcyBtdWNobywgdG9jYW1vcyBlbiBicmV2ZS4nLFxuICAgICAgICAnUFJPQkFCTFlfSUZfSV9TQ0FSRV9ISU1fSEVfV0lMTF9XQUtFX1VQJzogJ1NlZ3VybyBxdWUgc2kgbG8gYXN1c3RvIHVuIHBvY28gc2UgZXNwYWJpbGEuJyxcbiAgICAgICAgJ1BST0JMRU1TX0lfQU1fT1VUJzogJ8K/UHJvYmxlbWFzPyDCv0NvbXBsaWNhY2lvbmVzPyBZbyBwYXNvIGRlIGVzdG8uLi4nLFxuICAgICAgICAnUFJPQkxFTVNfTEVUX01FX0hFTFAnOiAnwr9Qcm9ibGVtYXM/IFBvciBmYXZvciwgY29udGFkbWUgbcOhcywgYW1pZ3VpdG9zLicsXG4gICAgICAgICdSRUFEWV9UT19QTEFZJzogJ8KhRWggY2hhdmFsZXMhIMK/VG9kbyBsaXN0bz8nLFxuICAgICAgICAnUkVBTExZX1VTRUZVTF9UT19QVVRfTElRVUlEU19JTlNJREUnOiAnTXV5IMO6dGlsIHBhcmEgcG9uZXIgbMOtcXVpZG9zIHkgb3RyYXMgY29zYXMgZGVudHJvLicsXG4gICAgICAgICdSRVNUX09GX1RIRV9CQU5EJzogJ3Jlc3RvIGRlbCBncnVwbywgSnVhbiwgw4FuZ2VsIHkgU2FudGknLFxuICAgICAgICAnU0VDT05EX0pVQU5fQ09TVFVNRSc6ICdMbyBzZWd1bmRvLCBuZWNlc2l0YW1vcyB1biBkaXNmcmF6IHBhcmEgSnVhbiwgcXVlIHNlIGxvIGhhIGRlamFkbyBlbiBjYXNhLicsXG4gICAgICAgICdTRUVfWU9VX1NPT04nOiAnwqFOb3MgdmVtb3MhJyxcbiAgICAgICAgJ1NDSVNTT1JTJzogJ3RpamVyYXMnLFxuICAgICAgICAnU0hFX0lTX1NIWV9ET0VTTlRfV0FOVF9UT19UQUxLX1RPX01FJzogJ0VzIHTDrW1pZGEsIG5vIHF1aWVyZSBoYWJsYXIgY29ubWlnby4nLFxuICAgICAgICAnU0hJTllfQU5EX1NIQVJQJzogJ8KhQnJpbGxhbnRlcyB5IGFmaWxhZGFzIScsXG4gICAgICAgICdTS0lSVCc6ICdmYWxkYScsXG4gICAgICAgICdTT19QTEVBU0VfRklORF9NRV9TT01FVEhJTkdfRUxFR0FOVF9JX0NBTl9VU0UnOiAnQXPDrSBxdWUgYsO6c2NhbWUgdW5vIGJ1ZW5vIHF1ZSBjdW1wbGEgbWlzIGV4cGVjdGF0aXZhcy4nLFxuICAgICAgICAnU09fVEhJU19JU19USEVfRU5EX0ZPTEtTJzogJ0VzdG8gZXMgdG9kbyBhbWlnb3MuJyxcbiAgICAgICAgJ1NPX1dFX1NPTUVIT1dfRElTVFJBQ1RfVEhFX0FUVEVOVElPTic6ICcuLi4geSBhc8OtIGxhIGdlbnRlIG5vIHNlIGRhIGN1ZW50YSBkZSBxdWUgbm8gc2FiZW1vcyB0b2Nhci4nLFxuICAgICAgICAnU09NRV9DVUxUVVJFU19VU0VEX0RSVUdTJzogJ1NhYmVzLCBhbGd1bmFzIGN1bHR1cmFzIHV0aWxpemFuIGRyb2dhcyBwYXJhIGluc3BpcmFyIGEgbG9zIGd1ZXJyZXJvcy4uLicsXG4gICAgICAgICdTT01FX0ZMT1dFUlNfV09VTERfQkVfTklDRSc6ICdVbmFzIGZsb3JlcyBsZSBxdWVkYXLDrWFuIGJpZW4uJyxcbiAgICAgICAgJ1NVUkVfQk9TUyc6ICfCoVPDrSwgYndhbmEhJyxcbiAgICAgICAgJ1NVU1BJQ0lPVVNfRFVTVCc6ICdwb2x2byBzb3NwZWNob3NvJyxcbiAgICAgICAgJ1RBTEtfVE9fWU9VX0xBVEVSJzogJ8KhTWUgdm95LCBub3MgdmVtb3MgbHVlZ28hJyxcbiAgICAgICAgJ1RIQU5LU19GT1JfSEVMUElOR19NRV9JTl9USElTX0FEVkVOVFVSRSc6ICfCoUdyYWNpYXMgcG9yIGF5dWRhcm1lIGVuIGVzdGEgYXZlbnR1cmEhJyxcbiAgICAgICAgJ1RIQVRfQ0FOTk9UX0JFX0NMT1NFRCc6ICdFc28gbm8gc2UgcHVlZGUgY2VycmFyLicsXG4gICAgICAgICdUSEFUX0NBTk5PVF9CRV9PUEVORUQnOiAnRXNvIG5vIHNlIHB1ZWRlIGFicmlyLicsXG4gICAgICAgICdUSEFUX0lTX0FfSFVHRV9CQUxMT09OX1FVSVRFX1NDQVJZX0lGX0lUX0VYUExPREVTJzogJ1VuIGdsb2JvIGVub3JtZSwgbWVudWRvIHN1c3RvIHNpIGV4cGxvdGFzZS4nLFxuICAgICAgICAnVEhBVF9JU19BX1NUVVBJRF9DT1NUVU1FJzogJ1ZheWEgZGlzZnJheiBwZW5jby4nLFxuICAgICAgICAnVEhBVF9JU19NWV9CQU5EXzEnOiAnTWkgZ3J1cG86IHZhZ29zLCBubyB0b2NhbiBtdXkgYmllbiwgcGVybyBzb24gYnVlbmEgZ2VudGUuJyxcbiAgICAgICAgJ1RIQVRfSVNfTVlfQkFORF8yJzogJ8KhUXXDqSBwZWRhem8gZGUgZ3J1cG8hIMKhTG8gbWVqb3IgZGUgbG8gbWVqb3IhJyxcbiAgICAgICAgJ1RIQVRfSVNfTVlfQkFORF8zJzogJ03DrXJhbG9zLCB0YW4gYnVlbm9zLCBzaW4gbW92ZXIgdW4gZGVkby4uLicsXG4gICAgICAgICdUSEFUX1NfU09NRV9ISUdITFlfU1VTUElDSU9VU19XSElURV9QT1dERVInOiAnRXMgdW4gcG9sdm8gYmxhbmNvIG11eSBzb3NwZWNob3NvLicsXG4gICAgICAgICdUSEFUX1NfVEhFX0RPT1JfVE9fR09fQkFDS19UT19USEVfQkFDS1NUQUdFJzogJ0VzYSBlcyBsYSBwdWVydGEgcGFyYSB2b2x2ZXIgYWwgYmFja3N0YWdlLicsXG4gICAgICAgICdUSEFUX1NfVEhFX1NQSVJJVCc6ICfCoUVzYSBlcyBsYSBhY3RpdHVkIScsXG4gICAgICAgICdUSEVfRkxPT1JfSVNfU1RJQ0tZJzogJ0VsIHN1ZWxvIGVzdMOhIHRhbiBwZWdham9zbyBxdWUgZXMgaW1wb3NibGUgbW92ZXJsYS4nLFxuICAgICAgICAnVEhFX09OTFlfVEhJTkdfSEVfV0FOVFNfUklHSFRfTk9XX0lTX0JFRVInOiAnTG8gw7puaWNvIHF1ZSBxdWllcmUgYWhvcmEgZXMgbcOhcyBjZXJ2ZXphLicsXG4gICAgICAgICdUSEVfT1RIRVJTX1dJTExfQkVfUkVBRFknOiAnUGVybyBzZWd1cm8gcXVlIGVsIHJlc3RvIGRlbCBncnVwbyBlc3TDoSBsaXN0bywgdm95IGEgaGFibGFyIGNvbiBlbGxvcy4nLFxuICAgICAgICAnVEhFUkVfQVJFX1NPTUVfUFJPQkxFTVNfMSc6ICdQdWVzIGhhbiBoYWJpZG8gdW5hcyBwZXF1ZcOxYXMgY29tcGxpY2FjaW9uZXMuLi4nLFxuICAgICAgICAnVEhFUkVfQVJFX1NPTUVfUFJPQkxFTVNfMic6ICcuLi4gbWludWNpYXMsIHBlcXVlw7FlY2VzIC4uLicsXG4gICAgICAgICdUSEVSRV9BUkVfU09NRV9QUk9CTEVNU18zJzogJy4uLiBwcm9ibGVtYXMgQlUtUlUtVEFMRVMuJyxcbiAgICAgICAgJ1RIRVJFX0lTX0FfQ0FCTEVfU1RVQ0tfQkVISU5EX1RIRV9NQUNISU5FJzogJ0hheSB1biBjYWJsZSBwaWxsYWRvIGRldHLDoXMgZGUgbGEgbcOhcXVpbmEuJyxcbiAgICAgICAgJ1RISU5LX1BBQ09fVEhJTksnOiAnUGllbnNhLCBQYWNvLCBwaWVuc2EuJyxcbiAgICAgICAgJ1RISVJEX1NBTlRJX1NIWSc6ICdZIHBvciDDumx0aW1vLCBTYW50aSBzZSBoYSBwdWVzdG8gdMOtbWlkby4gTm8gcXVpZXJlIHRvY2FyLi4uJyxcbiAgICAgICAgJ1RISVNfQ0FCTEVfQ09VTERfQkVfVVNFRlVMJzogJ0VzdGUgY2FibGUgcGFyZWNlIMO6dGlsLCBpZ3VhbCBsbyBwdWVkbyBcInBlZGlyIHByZXN0YWRvXCInLFxuICAgICAgICAnVEhJU19JU19ZT1VSX1NUQU5EQVJEX1ZFTkRJTkdfTUFDSElORSc6ICdFcyB1bmEgbcOhcXVpbmEgZXhwZW5kZWRvcmEgbm9ybWFsLiBTaSBhY2FzbyBtw6FzIHN1Y2lhIHF1ZSBsYSBtZWRpYS4nLFxuICAgICAgICAnVElNRV9UT19HSVZFX0lUX1RPX0pVQU4nOiAnWWEgc2UgbG8gcHVlZG8gZGFyIGEgSnVhbi4nLFxuICAgICAgICAnVkVORElOR19NQUNISU5FJzogJ23DoXF1aW5hIGV4cGVuZGVkb3JhJyxcbiAgICAgICAgJ1ZFUllfQkVBVVRJRlVMX0ZMT1dFUlMnOiAnVW5hcyBmbG9yZXMgbXV5IGJvbml0YXMuJyxcbiAgICAgICAgJ1ZJTlRBR0VfUFJFTUlVTV9DT1NUVU1FJzogJ1VuIGRpc2ZyYXogdmludGFnZSwgbXV5IHByZW1pdW0uJyxcbiAgICAgICAgJ1dFX0NBTl9QTEFZX1RIRV9DT05DRVJUX05PVyc6ICdZYSBwb2RlbW9zIGRhciBlbCBjb25jaWVydG8sIGFtaWdvIG3DrW8uJyxcbiAgICAgICAgJ1dFX0NSSUVEJzogJ2hlbW9zIGxsb3JhZG8nLFxuICAgICAgICAnV0VfRE9OVF9SRUhFQVJTRV9FTk9VR0gnOiAnR2HDsWFudGUsIG5vIGhlbW9zIGVuc2F5YWRvIGxvIHN1ZmljaWVudGUsIG5vIGVzdGFtb3MgbGlzdG9zIScsXG4gICAgICAgICdXRV9IQVZFX1RIUkVFX1BST0JMRU1TJzogJ0LDoXNpY2FtZW50ZSB0ZW5lbW9zIHRyZXMgcHJvYmxlbWFzLi4uJyxcbiAgICAgICAgJ1dFX0hBVkVOVF9QUkFDVElTRURfU0lOQ0VfMjAxMic6ICdDcmVvIHF1ZSBlbCDDumx0aW1vIGVuc2F5byBmdWUgZW4gZWwgMjAxMi4nLFxuICAgICAgICAnV0VfTEFVR0hFRCc6ICdIZW1vcyByZcOtZG8sJyxcbiAgICAgICAgJ1dFTExfSV9IQURfQU5fQVdFU09NRV9DT1NUVU1FJzogJ1RlbsOtYSB1biBkaXNmcmF6IGJydXRhbCwgwr9zYWJlcz8nLFxuICAgICAgICAnV0hBVF9DQU5fV0VfRE9fR1VZUyc6ICfCv1F1w6kgcG9kZW1vcyBoYWNlcj8gwr9BbGd1bmEgaWRlYT8nLFxuICAgICAgICAnV0hFUkVfQ09VTERfSV9GSU5EX0FfQ0FCTEUnOiAnwr9Ew7NuZGUgcHVlZG8gZW5jb250cmFyIHVuIGNhYmxlIHBhcmEgw4FuZ2VsPycsXG4gICAgICAgICdXSFlfQ09TVFVNRVMnOiAnwr9Qb3IgcXXDqSB2YW1vcyB0b2RvcyBkaXNmcmF6YWRvcz8nLFxuICAgICAgICAnV0hZX0lTX0VWRVJZVEhJTkdfU09fUElYRUxZJzogJ8K/UG9yIHF1w6kgZXN0w6EgdG9kbyBwaXhlbGFkbz8nLFxuICAgICAgICAnV0lTRV9QVVJDSEFTRSc6ICdCdWVuYSBjb21wcmEuJyxcbiAgICAgICAgJ1lFUF9JX0NPVUxEX0JVSUxEX0FfQ09TVFVNRV9XSVRIX1RISVMnOiAnU2lwLCBwb2Ryw61hIGhhY2VyIHVuIGRpc2ZyYXogY29uIGVzdG8uJyxcbiAgICAgICAgJ1lFU19NT00nOiAnU8OtIG1hbcOhLicsXG4gICAgICAgICdZT1VfQkVUVEVSX1BVVF9JVF9PTic6ICdPIHRlIGxvIHBvbmVzIG8gdGUgbG8gcG9uZ28uJyxcbiAgICAgICAgJ1lPVV9BUkVfQV9DT1dBUkRfTUFOX1dFX0hBVkVfQ09TVFVNRVMnOiAnTm8gc2VhcyBwdXNpbMOhbmltZSwgaG9tYnJlLiBUZW5lbW9zIG51ZXN0cm9zIGRpc2ZyYWNlcywgbmFkaWUgc2UgdmEgYSBkYXIgY3VlbnRhIGRlIGPDs21vIHRvY2Ftb3MuJyxcbiAgICAgICAgJ1lPVV9TVE9MRV9JVCc6ICfCv0RlIGTDs25kZSBsbyBoYXMgc2FjYWRvPyDCv0xvIGhhcyByb2JhZG8/JyxcbiAgICAgICAgJ1lPVVJfTEFDS19PRl9DT05GSURFTkNFX0RJU1NBUE9JTlRTX01FJzogJ8KhVmVuZ2EsIGhvbWJyZSEgVHUgZmFsdGEgZGUgY29uZmlhbnphIGVzIHVuIGluc3VsdG8gYSBtaSBwZXJzb25hLidcbiAgICB9LFxuICAgICdlbic6IHtcbiAgICAgICAgJ0FfQlJPT01fVEhFX1BFUkZFQ1RfQ0xFQU5JTkdfSU5TVFJVTUVOVCc6ICdBIGJyb29tLCB0aGUgcGVyZmVjdCBjbGVhbmluZyBpbnN0cnVtZW50LicsXG4gICAgICAgICdBX1JBTkNJRF9BTkRfR1JFQVNZX1NBTkRXSElDSCc6ICdBIHJhbmNpZCBhbmQgR1JFQVNZIHNhbmR3aGljaC4nLFxuICAgICAgICAnQUdBSU4nOiAnQWdhaW4uLi4nLFxuICAgICAgICAnQUxMX0lOX0FMTF9IRV9JU19BX0dPT0RfR1VZJzogJ0EgbmljZSBndXksIHRoaXMgQmlsaS4nLFxuICAgICAgICAnQUxMX1JFQURZX0ZJTkRfQklMSSc6ICdBbGwgaXMgc29sdmVkIG5vdyEgTGV0IG1lIGdyYWIgQmlsaSBhbmQgd2VcXCdsbCBzdGFydC4nLFxuICAgICAgICAnQU5EX0VYUEVOU0lWRSc6ICcuLi4gYW5kIGV4cGVuc2l2ZS4nLFxuICAgICAgICAnQU5EX0lfQU1fTk9UX0dPSU5HX1RPX0dJVkVfSElNX0FOWSc6ICdBbmQgSSBhbSBub3QgcGxhbm5pbmcgb24gZ2l2aW5nIGhpbSBhbnkgbW9yZS4nLFxuICAgICAgICAnQU5EX1dFX0xFQVJORUQnOiAnYW5kIHdlIGxlYXJuZWQuJyxcbiAgICAgICAgJ0FSR0gnOiAnQXJnaCEnLFxuICAgICAgICAnQVNLX0FCT1VUX0NBQkxFJzogJ1doZXJlIGRvIEkgZmluZCBhIGNhYmxlIG5vdywgeW91IGxhenkgYmFzdGFyZHM/JyxcbiAgICAgICAgJ0FTS19BQk9VVF9DT1NUVU1FJzogJ1RlbGwgbWUgbW9yZSBhYm91dCB0aGF0IG1pc3NpbmcgY29zdHVtZS4nLFxuICAgICAgICAnQVNLX0FCT1VUX1NBTlRJJzogJ1doYXRcXCdzIHRoZSBtYXR0ZXIgd2l0aCB5b3UgU2FudGk/JyxcbiAgICAgICAgJ0JBQ0tTVEFHRSc6ICdiYWNrc3RhZ2UnLFxuICAgICAgICAnQkFDS1lBUkQnOiAnYmFja3lhcmQnLFxuICAgICAgICAnQkFDT04nOiAnYmFjb24nLFxuICAgICAgICAnQkFMTE9PTic6ICdiYWxsb29uJyxcbiAgICAgICAgJ0JBUkVMWV9UQVNURURfTElLRV9EUlVHJzogJ1dlbGwsIGl0IGJhcmVseSB0YXN0ZWQgbGlrZSBkcnVncy4uLicsXG4gICAgICAgICdCRUFVVElGVUxfU09NRVRISU5HJzogJ1RoYXQgaXMgYSBiZWF1dGlmdWwgc29tZXRoaW5nLicsXG4gICAgICAgICdCSUxJJzogJ0JpbGknLFxuICAgICAgICAnQklMSV9NVVNUX0JFX09VVF9USEVSRV9TTU9LSU5HJzogJ0JpbGkgbXVzdCBiZSBvdXQgdGhlcmUgc21va2luZy4nLFxuICAgICAgICAnQk9DQURJTExPJzogJ2JhY29uIHNhbmR3aGljaCcsXG4gICAgICAgICdCVVJQJzogJ0J1cnAhJyxcbiAgICAgICAgJ0JSRUFEJzogJ2JyZWFkJyxcbiAgICAgICAgJ0JSRUFEX0xFRlRPVkVSU19OT1RfVVNFRlVMJzogJ0JyZWFkIGxlZnRvdmVycywgbm90IHZlcnkgdXNlZnVsLicsXG4gICAgICAgICdCUk9PTSc6ICdicm9vbScsXG4gICAgICAgICdDQUJMRSc6ICdjYWJsZScsXG4gICAgICAgICdDQU4nOiAnc29kYSBjYW4nLFxuICAgICAgICAnQ0FOTk9UX1BJQ0tfQV9ET09SX1VQJzogJ0kgb2J2aW91c2x5IGNhbm5vdCBwaWNrIHRoZSBkb29yIHVwLiBJIHdvdWxkIGRlc3Ryb3kgdGhlIGJ1aWxkaW5nLicsXG4gICAgICAgICdDTE9OSyc6ICdDbG9ua1xcbiAgIGNsb25rXFxuICAgICAgY2xvbmsnLFxuICAgICAgICAnQ09DT05VVCc6ICdjb2NvbnV0JyxcbiAgICAgICAgJ0NPSU4nOiAnY29pbicsXG4gICAgICAgICdDT09MX05PV19JX1NIT1VMRF9HSVZFX0lUX1RPX1RIRV9HVVlTJzogJ0Nvb2wsIG5vdyBJIHNob3VsZCBnaXZlIHRoYXQgdG8gdGhlIGd1eXMuJyxcbiAgICAgICAgJ0NPTVBBUkVfQ09NUFJBTUVfVU5fQ09DTyc6ICdBIGNvY29udXQsIHJvdWdoIHNraW4sIGRlbGljaW91cyBjb250ZW50LicsXG4gICAgICAgICdDT1NUVU1FJzogJ2Nvc3R1bWUnLFxuICAgICAgICAnREVMSUNJT1VTX0FORF9HUkVBU1knIDogJ0RlbGljaW91cyBhbmQgR1JFQVNZIScsXG4gICAgICAgICdET0VTX0lUX0xPT0tfTElLRV9BX1BBSVJfT0ZfVElUUyc6ICdEb2VzIGl0IGxvb2sgbGlrZSBhIHBhaXIgb2YgdGl0cz8nLFxuICAgICAgICAnRE9PUl9UT19CQUNLU1RBR0UnOiAnZG9vciB0byBiYWNrc3RhZ2UnLFxuICAgICAgICAnRE9PUl9UT19CQUNLWUFSRCc6ICdkb29yIHRvIGJhY2t5YXJkJyxcbiAgICAgICAgJ0RPT1JfVE9fU1RBR0UnOiAnZG9vciB0byBzdGFnZScsXG4gICAgICAgICdET09SX1RPX1NUUkVFVCc6ICdkb29yIHRvIHN0cmVldCcsXG4gICAgICAgICdEUlVHU19BUkVfQkFEJzogJy4uLiB5ZWFoIG1hbiBkcnVncyBhcmUgcmVhbGx5IGJhZCAuLi4nLFxuICAgICAgICAnRFJVTktfMSc6ICdOcG8gYW1uIHRpIGFtIHBlcmZlY3l0bHkgZmFpbmUuJyxcbiAgICAgICAgJ0RSVU5LXzInOiAnU3RoZSBmdWNrPyBpIGhhdnVlIG5ldmVyIGJlZmVuIG1vcmUgb3NyYmUhJyxcbiAgICAgICAgJ0RSVU5LXzMnOiAnVGhpcyBpcyBlYSBsa2VnZW5kYXJ5IGV2ZW5uZ2kgcm9mIGhzZXggYW5kIGRydWdmcyEnLFxuICAgICAgICAnRFJVTktfNCc6ICdTaHV0IHVqcCBrYW5kIGJyaW5nIG1lIG1vYXJlIGIuZXJlJyxcbiAgICAgICAgJ0RSVU5LXzUnOiAnWXVvIGFzcmUga215IGJzZXN0IHRmcm5laWQgYW5jZCBzaSBsZG92ZSB5b2l1LicsXG4gICAgICAgICdEUlVOS182JzogJ1R0aGUgbXJlcHRpbGluYXMgaWFyZSBjb21uaWcgZm9yIHl1byBub3cuJyxcbiAgICAgICAgJ0RSVU5LX0JJTEknOiAnZHJ1bmsgQmlsaScsXG4gICAgICAgICdGSU5BTExZX0lfR09UX1RIRV9DQUJMRSc6ICdGaW5hbGx5IEkgZ290IHRoZSBjYWJsZSEnLFxuICAgICAgICAnRklSU1RfQU5HRUxfQ0FCTEUnIDogJ0ZpcnN0LCB3ZSBuZWVkIGEgY2FibGUgdG8gcGx1ZyBBbmdlbFxcJ3MgYW1wLicsXG4gICAgICAgICdGSVJTVF9JX05FRURfVE9fR0VUX1RIRV9CQU5EX1JFQURZJyA6ICdGaXJzdCBJIG5lZWQgdG8gZ2V0IHRoZSBiYW5kIHJlYWR5LicsXG4gICAgICAgICdGSVJTVF9PRl9BTExfSV9TSE9VTERfVEFMS19UT19USEVfQkFORCc6ICdGaXJzdCBvZiBhbGwgSSBzaG91bGQgdGFsayB3aXRoIHRoZSBiYW5kLicsXG4gICAgICAgICdGTE9XRVJTJzogJ2Zsb3dlcnMnLFxuICAgICAgICAnRk9VTkRfVEhFX0NBQkxFJzogJ0kgZm91bmQgYSBjYWJsZSEnLFxuICAgICAgICAnR0xBU1MnOiAnZ2xhc3MnLFxuICAgICAgICAnR09UX1RIRV9DT1NUVU1FJzogJ0kganVzdCBtYWRlIGEgY29zdHVtZSBmb3IgeW91LicsXG4gICAgICAgICdHVUxQX0dVTFBfR1VMUCc6ICdHdWxwXFxuICAgR3VscFxcbiAgICAgIEd1bHAnLFxuICAgICAgICAnSEFWRV9BX0RSSU5LX1NBTlRJJzogJ0hleSBTYW50aSwgaGVyZSwgaGF2ZSB0aGlzIGRyaW5rLicsXG4gICAgICAgICdIQVZFX0lfRVZFUl9GQUlMRURfWU9VJzogJ0hhdmUgSSBldmVyIGZhaWxlZCB5b3U/JyxcbiAgICAgICAgJ0hBVkVfWU9VX1NFRU5fQklMSSc6ICdNbW0sIElcXCdtIG1pc3NpbmcgQmlsaSwgd2hlcmUgaXMgaGU/JyxcbiAgICAgICAgJ0hFX0lTX0JFSU5HX0dPT0RfRk9SX05PV19OT19ORUVEX1RPX0VYUExPREVfSVQnOiAnSGUgaXMgYmVpbmcgZ29vZCBmb3Igbm93LCBubyBuZWVkIHRvIGV4cGxvZGUgaGlzIGJhbGxvb24uJyxcbiAgICAgICAgJ0hFX0lTX0RSSU5LSU5HX0xJS0VfQV9NQU5JQUMnOiAnSGUgaXMgZHJpbmtpbmcgbGlrZSBhIG1hbmlhYywgSSBuZWVkIHRvIHN0YXJ0IHRoZSBjb25jZXJ0IGFzIHNvb24gYXMgcG9zc2libGUuJyxcbiAgICAgICAgJ0hFX0lTX09VVF9TTU9LSU5HJzogJ0hlXFwncyBvdXRzaWRlLCBkcmlua2luZyBhbmQgc21va2luZy4gSWYgd2UgbGV0IGhpbSB0aGVyZSB0b28gbXVjaCB0aW1lIGhlXFwnbGwgYmUgZHJ1bmsgYXMgYSBza3Vuay4nLFxuICAgICAgICAnSEVfSVNfRFJVTktfQVNfQV9TS1VOSyc6ICdZdXAsIG5vdyBoZSBpcyBkcnVuayBhcyBhIHNrdW5rLicsXG4gICAgICAgICdIRVlfQklMSV9IT1dfSVNfSVRfR09JTkcnOiAnSGV5IEJpbGkgaG93IGlzIGl0IGdvaW5nPycsXG4gICAgICAgICdIRVlfQklMSV9SRUFEWV9UT19QTEFZJzogJ0hleSBCaWxpLCByZWFkeSB0byBwbGF5PycsXG4gICAgICAgICdISV9ET09SX0hPV19BUkVfWU9VX1RPREFZJzogJ0hpIGRvb3IhIEhvdyBhcmUgeW91IHRvZGF5PycsXG4gICAgICAgICdISV9USEVSRSc6ICdIaSB0aGVyZS4nLFxuICAgICAgICAnSE9XX0lTX0JJTElfRE9JTkcnOiAnSG93IGlzIEJpbGkgZG9pbmcsIGJ5IHRoZSB3YXk/JyxcbiAgICAgICAgJ0lfQUxSRUFEWV9IQVZFX0lUJzogJ0kgYWxyZWFkeSBoYXZlIGl0LicsXG4gICAgICAgICdJX0FMUkVBRFlfUFVTSEVEX0lUJzogJ0kgYWxyZWFkeSBwdXNoZWQgaXQsIEkgZG9uXFwndCB3YW5uYSBvdmVyIGRvIGl0LicsXG4gICAgICAgICdJX0FNX0FXQUtFJzogJ0FoaGhoaCEgSSBBTSBBV0FLRSEhIScsXG4gICAgICAgICdJX0FNX0pVU1RfS0VFUElOR19NWV9USFJPQVRfV0FSTSc6ICdJIGFtIGp1c3Qga2VlcGluZyBteSB0aHJvYXQgd2FybSwgbm8gd29ycmllcy4nLFxuICAgICAgICAnSV9BTV9OT1RfRFJVTktfQU5ZTU9SRSc6ICdXb3chIEkgYW0gbm90IGRydW5rIGFueW1vcmUuJyxcbiAgICAgICAgJ0lfQU1fTk9UX1JJQ0hfQlVUX0lUX0lTX0FfU1RBUlQnOiAnSVxcJ20gbm90IGV4YWN0bHkgcmljaCwgYnV0IGl0XFwncyBhIHN0YXJ0IScsXG4gICAgICAgICdJX0FNX05PVF9HT0lOR19UT19BU0tfV0hFUkVfVEhJU19DT01FU19GUk9NJzogJ0lcXCdtIG5vdCBnb2luZyB0byBhc2sgd2hlcmUgeW91IGdvdCB0aGlzIGZyb20uJyxcbiAgICAgICAgJ0lfQU1fU1RBVFJJTkdfVE9fRkVFTF9SRUFEWV9UT19QTEFZJzogJ0l0XFwncyB3ZWlyZCwgSSBhbSBzdWRkZW5kbHkgc3RhcnRpbmcgdG8gZmVlbCByZWFkeSB0byBwbGF5LicsXG4gICAgICAgICdJX0JFVF9JX0NPVUxEX0RPX0FfQkVBVVRJRlVMX0NPU1RVTUVfV0lUSF9JVCc6ICdJIGJldCBJIGNvdWxkIGRvIGEgYmVhdXRpZnVsIGNvc3R1bWUgd2l0aCB0aGlzLicsXG4gICAgICAgICdJX0JFVF9USEFUX1NVU1BJQ0lPU19XSElURV9QT1dERVJfRlJPTV9USEVfVEFCTEVfQ0FOX01BS0VfU09NRUJPRFlfTEVTU19TSFknOiAnSSBiZXQgdGhhdCBzdXNwaWNpb3VzIHdoaXRlIHBvd2RlciBmcm9tIHRoZSB0YWJsZSBjYW4gbWFrZSBcInNvbWVib2R5XCIgbGVzcyBzaHknLFxuICAgICAgICAnSV9CRVRfVEhJU19EVVNUX0NBTl9NQUtFX1NPTUVCT0RZX0xFU1NfU0hZJzogJ0kgYmV0IHRoaXMgXCJkdXN0XCIgY2FuIG1ha2UgXCJzb21lYm9keVwiIGxlc3Mgc2h5JyxcbiAgICAgICAgJ0lfQ0FOX0hFQVJfVEhFX0NST1dEX1dBSVRJTkdfRk9SX1VTJzogJ0kgY2FuIGhlYXIgdGhlIGNyb3dkIHdhaXRpbmcgZm9yIHVzLCBnb29kIHRoaW5nIHRoaXMgZG9vciBpcyBwcm90ZWN0aW5nIHVzLicsXG4gICAgICAgICdJX0NBTlRfTU9WRV9USEFUJzogJ0kgY2FuXFwndCBtb3ZlIHRoYXQuJyxcbiAgICAgICAgJ0lfQ0FOVF9ET19USEFUJzogJ0kgY2FuXFwndCBkbyB0aGF0LicsXG4gICAgICAgICdJX0NPVUxEX01BS0VfQV9IQVdBSUlBTl9DT1NUVU1FJzogJ0kgY291bGQgbWFrZSBhIGhhd2FpaWFuIGNvc3R1bWUnLFxuICAgICAgICAnSV9DT1VMRF9NQUtFX0FfV0lHX1dJVEhfVEhJUyc6ICdJIHRoaW5rIEkgY291bGQgbWFrZSBhIGJsb25kZSB3aWcgd2l0aCB0aGlzLicsXG4gICAgICAgICdJX0RPTlRfS05PV19IT1dfVE9fRE9fVEhBVCc6ICdJIGRvblxcJ3Qga25vdyBob3cgdG8gZG8gdGhhdC4nLFxuICAgICAgICAnSV9ET05UX0tOT1dfSE9XX1RPX1VTRV9USEFUX1dJVEhfVkVORElOR19NQUNISU5FJzogJ0kgZG9uXFx0IGtub3cgaG93IHRvIHVzZSB0aGF0IHdpdGggYSB2ZW5kaW5nIG1hY2hpbmUuLi4nLFxuICAgICAgICAnSV9IQVZFX0FfQ09OQ0VSVF9UT19QTEFZJzogJ0kgaGF2ZSBhIGNvbmNlcnQgdG8gcGxheSEnLFxuICAgICAgICAnSV9IQVZFX0JFVFRFUl9USElOR1NfVE9fRE9fVEhBTl9UQUxLSU5HJzogJ0kgaGF2ZSBiZXR0ZXIgdGhpbmdzIHRvIGRvIHRoYW4gdGFsa2luZyB0byBvYmplY3RzLicsXG4gICAgICAgICdJX0hBVkVfVE9fRklORF9BX1dBWV9UT19TT0JFUl9ISU1fVVAnOiAnSSBoYXZlIHRvIGZpbmQgYSB3YXkgdG8gc29iZXIgaGltIHVwLicsXG4gICAgICAgICdJX0hBVkVfVE9fRklOSVNIX1RIRV9DT1NUVU1FX0ZJUlNUJzogJ0kgaGF2ZSB0byBmaW5pc2ggdGhlIGNvc3R1bWUgZmlyc3QuJyxcbiAgICAgICAgJ0lfSEFWRV9UT19QSUNLX0lUX1VQX0ZJUlNUJzogJ0kgaGF2ZSB0byBwaWNrIGl0IHVwIGZpcnN0LicsXG4gICAgICAgICdJX0hFQVJEX1RIRV9HVVlTX0FSRV9IQVZJTkdfU09NRV9QUk9CTEVNUyc6ICdJIGhlYXJkIHRoZSBndXlzIGFyZSBoYXZpbmcgc29tZSBwcm9ibGVtcy4nLFxuICAgICAgICAnSV9TSE9VTERfQUREX0FfU0tJUlRfVE9fSVQnOiAnSSBzaG91bGQgYWRkIGEgc2tpcnQgdG8gaXQuJyxcbiAgICAgICAgJ0lfU0hPVUxEX0dPX0ZJTkRfQklMSSc6ICdJIG11c3QgZmluZCBCaWxpIHNvIHdlIGNhbiBzdGFydCBwbGF5aW5nLicsXG4gICAgICAgICdJX1NIT1VMRF9QUk9CQUJMWV9NSVhfSVRfSU5fQV9HTEFTUyc6ICdJIHNob3VsZCBwcm9iYWJseSBtaXggaXQgaW4gYSBnbGFzcy4nLFxuICAgICAgICAnSV9TSE9VTERfUFVUX1NPTUVUSElOR19NT1JFX0lOVEVSRVNUSU5HX0lOX1RIRV9HTEFTUyc6ICdJIHNob3VsZCBwdXQgc29tZXRoaW5nIG1vcmUgaW50ZXJlc3RpbmcgaW4gdGhlIGdsYXNzIGJlZm9yZSBnaXZpbmcgaXQgdG8gdGhlbS4nLFxuICAgICAgICAnSV9TSE9VTERfU09CRVJfQklMSV9VUCc6ICdJIHNob3VsZCBzb2JlciBCaWxpIHVwIHNvIHdlIGNhbiBwbGF5LicsXG4gICAgICAgICdJX1NIT1VMRF9UQUtFX1RIRV9CQUNPTl9PVVRfT0ZfVEhFX0JSRUFEX0ZJUlNUJzogJ0kgc2hvdWxkIHRha2UgdGhlIGJhY29uIG91dCBvZiB0aGUgYnJlYWQgZmlyc3QnLFxuICAgICAgICAnSV9USElOS19JX0NBTl9PUEVOX0lUX0FORF9UQUtFX1RIRV9CQUNPTic6ICdJIHRoaW5rIEkgY2FuIG9wZW4gaXQgYW5kIHRha2UgdGhlIGJhY29uLicsXG4gICAgICAgICdJX1RISU5LX01ZX01BU1RFUlBJRUNFX0lTX0NPTVBMRVRFJzogJ0kgdGhpbmsgbXkgbWFzdGVycGllY2UgaXMgY29tcGxldGUuJyxcbiAgICAgICAgJ0lfV0lMTF9XQUlUX0ZPUl9USEVNX1RPX0JFX1NPTFZFRCc6ICdJIHdpbGwgd2FpdCBmb3IgdGhlbSB0byBiZSBzb2x2ZWQgYXV0b21hZ2ljYWxseS4nLFxuICAgICAgICAnSV9XT05ERVJfSUZfVEhFX0dVWVNfSEFWRV9FVkVSWVRISU5HX1JFQURZJzogJ0kgd29uZGVyIGlmIHRoZSBndXlzIGhhdmUgZXZlcnl0aGluZyByZWFkeS4uLicsXG4gICAgICAgICdJX1dPVUxEX0RPX0lUX01ZU0VMRic6ICdJIHdvdWxkIGRvIGl0IG15c2VsZiwgYnV0IGl0IGlzIGtpbmQgb2YgaWxsZWdhbC4uLicsXG4gICAgICAgICdJX1dPVUxETlRfS05PV19XSEFUX1RPX1NBWSc6ICdJIHdvdWxkblxcJ3Qga25vdyB3aGF0IHRvIHNheS4nLFxuICAgICAgICAnSUZfSV9BRERfU09NRV9CT09CU19JVF9XSUxMX0xPT0tfTElLRV9BX0hBV0FJSUFOX0RSRVNTJzogJ0lmIEkgYWRkIHNvbWUgYm9vYnMgaXQgd2lsbCBsb29rIGxpa2UgYSBoYXdhaWlhbiBkcmVzcy4nLFxuICAgICAgICAnSUZfSV9DT1VMRF9QVVRfR1JFQVNFX0JFTE9XJzogJ0lmIEkgY291bGQganVzdCBwdXQgc29tZSBncmVhc2UgYmVsb3cgaXQuLi4nLFxuICAgICAgICAnSU1QTElFU19NT1ZFTUVOVCc6ICcuLi4gYW5kIGl0IGltcGxpZXMgYSBjZXJ0YWluIGFtbW91bnQgb2YgZWZmb3J0IGFuZCBtb3ZlbWVudC4nLFxuICAgICAgICAnSVRfSVNfQV9MT05HX1RJTUVfVFJBRElUSU9OX1RIQVRfV0VfQUxMX0RSRVNTRURfVVAnOiAnSXQgaXMgYSB0cmFkaXRpb24gdGhhdCBzdGFydGVkIGxvbmcgdGltZSBhZ28sIGRyZXNzaW5nIHVwIGZvciBvdXIgY29uY2VydHMuLi4nLFxuICAgICAgICAnSVRfSVNfQUxSRUFEWV9DTE9TRUQnOiAnSXQgaXMgYWxyZWFkeSBjbG9zZWQuJyxcbiAgICAgICAgJ0lUX0lTX0FMUkVBRFlfRlVMTCc6ICdJdCBpcyBhbHJlYWR5IGZ1bGwuJyxcbiAgICAgICAgJ0lUX0lTX0lOREVFRF9BX0dMQVNTJzogJ0l0IGlzIGluZGVlZCBhIGdsYXNzLicsXG4gICAgICAgICdJVF9JU19TVFVDS19CRUhJTkRfVEhFX1ZFTkRJTkdfTUFDSElORSc6ICdJdCBpcyBzdHVjayBiZWhpbmQgdGhlIHZlbmRpbmcgbWFjaGluZSwgSSBuZWVkIHRvIG1vdmUgaXQgc29tZWhvdy4nLFxuICAgICAgICAnSVRfV0FTX0NPV0JPWV9DT1NUVU1FJzogJ0l0IHdhcyBhIGNvd2JveSBjb3N0dW1lLCBtYW4uIEEgY29vbCBvbmUuJyxcbiAgICAgICAgJ0lTX1NPTUVIT1dfREFOR0VST1VTJzogJy4uLiBtYXJnaW5hbGx5IGRhbmdlcm91cywgSSB3b3VsZCBzYXkuLi4nLFxuICAgICAgICAnSVNfVEhBVF9BX0NBQkxFX0JFSElORF9USEVfVkVORElOR19NQUNISU5FJzogJ0lzIHRoYXQgYSBjYWJsZSBiZWhpbmQgdGhlIHZlbmRpbmcgbWFjaGluZT8nLFxuICAgICAgICAnSlVTVF9TVEVBTF9PTkUnOiAnRG9uXFwndCBrbm93IG1hbiwganVzdCBzdGVhbCBvbmUgc29tZXdoZXJlLicsXG4gICAgICAgICdMQVRFX0ZPUl9DT05DRVJUJzogJ01hbiBJIGFtIHR3byBob3VycyBsYXRlIHRvIG15IG93biBjb25jZXJ0LicsXG4gICAgICAgICdMRVRfU19TQVlfSV9IQVZFX01ZX1NPVVJDRVMnOiAnTGV0XFwncyBzYXkgSSBoYXZlIG15IHNvdXJjZXMuLi4nLFxuICAgICAgICAnTEVUU19GSVhfVEhJU19NRVNTJzogJ09LLCBsZXRcXCdzIHNlZSBpZiBJIGNhbiBmaXggdGhpcyBkaXNhc3Rlci4nLFxuICAgICAgICAnTUFERV9PRl9NRVRBTF9SVVNUX0FORF9TVElDS1lfU1RVRkYnOiAnRG9vci4gQ29tcG9zaXRpb246IDgwJSBtZXRhbCwgMTUlIHJ1c3QsIDUlIHVuaWRlbnRpZmllZCBzdGlja3kgc3R1ZmYuJyxcbiAgICAgICAgJ01BTl9ZT1VfU0hPVUxEX0tOT1dfVEhJUyc6ICdNYW4sIHlvdSBzaG91bGQga25vdyB0aGlzLCB5b3Ugc3RhcnRlZCBpdCEnLFxuICAgICAgICAnTUFZQkVfSV9DQU5fQlVJTERfQV9DT1NUVU1FX01ZU0VMRic6ICdNYXliZSBJIGNhbiBidWlsZCBhIGNvc3R1bWUgbXlzZWxmIHdpdGggd2hhdGV2ZXIgSSBmaW5kIGFyb3VuZC4nLFxuICAgICAgICAnTUFZQkVfSV9DQU5fU0NBUkVfSElNX1NPX0hFX0dFVFNfU09CRVInOiAnTWF5YmUgSSBjYW4gc2NhcmUgaGltIHNvIGhlIGdldHMgc29iZXIuJyxcbiAgICAgICAgJ01BWUJFX1NBTlRJX05FRURTX1NPTUVUSElOR19UT19EUklOSyc6ICdNYXliZSBTYW50aSBuZWVkcyBzb21ldGhpbmcgdG8gZHJpbmsuJyxcbiAgICAgICAgJ01JTkVfV0FTX1dBWV9CRVRURVInOiAnTWluZSB3YXMgV0FZIGJldHRlci4nLFxuICAgICAgICAnTU1NX0FfUkVGUkVTSElOR19CRVZFUkFHRSc6ICdNbW0gYSByZWZyZXNoaW5nIGJldmVyYWdlISBUaGFua3MhJyxcbiAgICAgICAgJ01ZX0dSQU5ERkFUSEVSX1NBSURfQV9DT1NUVU1FX01VU1RfSEFWRV8zX1RISU5HUyc6ICdNeSBncmFuZGZhdGhlciBhbHdheXMgc2FpZDogXCJBIGdvb2QgY29zdHVtZSBtdXN0IGhhdmUgYXQgbGVhc3QgMyBlbGVtZW50c1wiLicsXG4gICAgICAgICdOSUNFX0NPU1RVTUVfSEVfTUFERSc6ICdIZXkhIEhlIG1hZGUgYSByZWFsbHkgZ29vZCBjb3N0dW1lIHRoaXMgdGltZSEnLFxuICAgICAgICAnTklDRV9JVF9XSUxMX1NMSURFX1JFQUxMWV9XRUxMX05PVyc6ICdOaWNlLCBpdCB3aWxsIHNsaWRlIHJlYWxseSB3ZWxsIG5vdy4uLicsXG4gICAgICAgICdOSUNFX09CSkVDVCc6ICdOaWNlIG9iamVjdC4nLFxuICAgICAgICAnTklDRV9TQUZFX0RPT1InOiAnSXQgaXMgZG9vci4gVXNlZnVsIHRvIG1ha2UgcGVvcGxlIGZlZWwgc2FmZSBhbmQgY296eSBpbnNpZGUgb2YgcGxhY2VzLicsXG4gICAgICAgICdOT1BFX0lfQ0FOTk9UX0dPX1RPX1RIRV9TVFJFRVQnOiAnTm9wZSwgSSBjYW5cXCd0IGdvIHRvIHRoZSBzdHJlZXQgeWV0LicsXG4gICAgICAgICdOT1BFX0lfQ0FOTk9UX0dPX1RPX1RIRV9TVEFHRSc6ICdOb3BlLCBJIGNhblxcJ3QgZ28gdG8gdGhlIHN0YWdlIHlldC4nLFxuICAgICAgICAnTk9QRV9JX0RPTlRfV0FOVF9UT19UQUtFX0JJTElTX0JBTExPT04nOiAnTm9wZSwgSSBkb25cXCd0IHdhbm5hIHRha2UgQmlsaVxcJ3MgYmFsbG9vbi4gSGUgbmVlZHMgaXQgZm9yIGhpcyBjb3N0dW1lLicsXG4gICAgICAgICdOT1RfVE9fQkFEX0FMTF9USElOR1NfQ09OU0lERVJFRCc6ICdOb3QgYmFkIGFsbCB0aGluZ3MgY29uc2lkZXJlZC4nLFxuICAgICAgICAnTk9UX1NBRkVfSEFWSU5HX1NDSVNTT1JTX0FST1VORF9NVVNJQ0lBTlMnOiAnTm90IHNhZmUgaGF2aW5nIHNjaXNzb3JzIGFyb3VuZCBtdXNpY2lhbnMuJyxcbiAgICAgICAgJ05PVF9TQVlJTkdfV0VfU0hPVUxEX1VTRV9USEVNJzogJ0kgYW0gbm90IHNheWluZyB3ZSBzaG91bGQgdXNlZCB0aGVtLCBidXQuLi4nLFxuICAgICAgICAnTk9XX0lfQ09VTERfUFVTSF9USElTX01BQ0hJTkUnOiAnTm93IEkgY291bGQgcHVzaCB0aGlzIG1hY2hpbmUuJyxcbiAgICAgICAgJ05PV19JX1NIT1VMRF9TQVlfU09NRVRISU5HX1NNQVJUX1RIQVRfSEVMUFMnOiAnTm93IEkgc2hvdWxkIHNvbWV0aGluZyBzbWFydCB0aGF0IGhlbHBzLicsXG4gICAgICAgICdPSF9MT09LX0FUX1RIQVQnOiAnT2ghIExvb2sgYXQgdGhhdC4nLFxuICAgICAgICAnT0hfTVlfWU9VX0FSRV9EUlVOS19BUkVOVF9ZT1UnOiAnT2ggbXkhIFlvdXIgYXJlIHRvdGFsbHkgZHJ1bmssIGFyZW5cXCd0IHlvdT8nLFxuICAgICAgICAnT0tfSV9MTF9QVVRfSVRfT04nOiAnT2ssIGJvc3MsIElcXCdsbCBwdXQgaXQgb24uJyxcbiAgICAgICAgJ09LX1NFRV9ZT1VfTEFURVInOiAnT2sgbWFuLCBzZWUgeW91IGxhdGVyIScsXG4gICAgICAgICdPTkVfQ09OQ0VSVF9BX1lFQVJfSVNfVE9PX01VQ0hfUFJFU1NVUkUnOiAnT25lIGNvbmNlcnQgYSB5ZWFyLCB0b28gbXVjaCBwcmVzc3VyZS4uLicsXG4gICAgICAgICdQTEVBU0VfRE9OVF9EUklOS19UT09fTVVDSCc6ICdQbGVhc2UgZG9uXFwndCBkcmluayB0b28gbXVjaCwgSSB3aWxsIHNvbHZlIHRoaXMgcmVhbGx5IHNvb24hJyxcbiAgICAgICAgJ1BST0JBQkxZX0lGX0lfU0NBUkVfSElNX0hFX1dJTExfV0FLRV9VUCc6ICdQcm9iYWJseSBpZiBJIHNjYXJlZCBoaW0gaGUgd291bGQgc29iZXIgdXAuJyxcbiAgICAgICAgJ1BST0JMRU1TX0lfQU1fT1VUJzogJ1Byb2JsZW1zPyBDb21wbGljYXRpb25zPyBJXFwnbSBvdXR0YSBoZXJlIG1hbi4uLicsXG4gICAgICAgICdQUk9CTEVNU19MRVRfTUVfSEVMUCc6ICdQcm9ibGVtcz8gUGxlYXNlIHRlbGwgbWUgbW9yZSwgZGVhciBmcmllbmRzLicsXG4gICAgICAgICdSRUFEWV9UT19QTEFZJzogJ0hleSBndXlzISBSZWFkeSB0byByb2NrPyEnLFxuICAgICAgICAnUkVBTExZX1VTRUZVTF9UT19QVVRfTElRVUlEU19JTlNJREUnOiAnUmVhbGx5IHVzZWZ1bCB0byBwdXQgbGlxdWlkcyBvciBvdGhlciBzdWJzdGFuY2VzIGluc2lkZS4nLFxuICAgICAgICAnUkVTVF9PRl9USEVfQkFORCc6ICdyZXN0IG9mIHRoZSBiYW5kJyxcbiAgICAgICAgJ1NFQ09ORF9KVUFOX0NPU1RVTUUnOiAnU2Vjb25kLCB3ZSBuZWVkIGEgY29zdHVtZSBmb3IgSnVhbiwgaGUgZm9yZ290IGhpcyBhdCBob21lLicsXG4gICAgICAgICdTRUVfWU9VX1NPT04nOiAnU2VlIHlvdSBzb29uIScsXG4gICAgICAgICdTQ0lTU09SUyc6ICdzY2lzc29ycycsXG4gICAgICAgICdTSEVfSVNfU0hZX0RPRVNOVF9XQU5UX1RPX1RBTEtfVE9fTUUnOiAnU2hlIGlzIHNoeSwgZG9lc25cXCd0IHdhbnQgdG8gdGFsayB3aXRoIG1lIHRvZGF5LicsXG4gICAgICAgICdTSElOWV9BTkRfU0hBUlAnOiAnU2hpbnkgYW5kIHNoYXJwIScsXG4gICAgICAgICdTS0lSVCc6ICdza2lydCcsXG4gICAgICAgICdTT19QTEVBU0VfRklORF9NRV9TT01FVEhJTkdfRUxFR0FOVF9JX0NBTl9VU0UnOiAnU28gcGxlYXNlIGZpbmQgYSByZWFsbHkgZWxlZ2FudCBjb3N0dW1lIHRoYXQgbGl2ZXMgdXAgdG8gbXkgZXhwZWN0YXRpb25zLicsXG4gICAgICAgICdTT19USElTX0lTX1RIRV9FTkRfRk9MS1MnOiAnU28gdGhpcyBpcyB0aGUgZW5kLCBmb2xrcy4nLFxuICAgICAgICAnU09fV0VfU09NRUhPV19ESVNUUkFDVF9USEVfQVRURU5USU9OJzogJy4uLiBzbyB3ZSBkaXN0cmFjdCBwZW9wbGUgZnJvbSB0aGUgZmFjdCB0aGF0IHdlIGRvblxcJ3Qga25vdyBob3cgdG8gcGxheS4nLFxuICAgICAgICAnU09NRV9DVUxUVVJFU19VU0VEX0RSVUdTJzogJ1lvdSBrbm93LCBzb21lIGN1bHR1cmVzIHVzZWQgZHJ1Z3MgdG8gZW5jb3VyYWdlIHdhcnJpb3JzLi4uJyxcbiAgICAgICAgJ1NPTUVfRkxPV0VSU19XT1VMRF9CRV9OSUNFJzogJ1NvbWUgZmxvd2VycyB3b3VsZCBiZSBuaWNlLicsXG4gICAgICAgICdTVVJFX0JPU1MnOiAnWWVzLCBzdXJlIGJvc3MhJyxcbiAgICAgICAgJ1NVU1BJQ0lPVVNfRFVTVCc6ICdzdXNwaWNpb3VzIGR1c3QnLFxuICAgICAgICAnVEFMS19UT19ZT1VfTEFURVInOiAnSSBoYXZlIHRvIGdvLCBzZWUgeW91IGxhdGVyIScsXG4gICAgICAgICdUSEFOS1NfRk9SX0hFTFBJTkdfTUVfSU5fVEhJU19BRFZFTlRVUkUnOiAnVGhhbmtzIGZvciBoZWxwaW5nIG1lIGluIHRoaXMgYWR2ZW50dXJlIScsXG4gICAgICAgICdUSEFUX0NBTk5PVF9CRV9DTE9TRUQnOiAnVGhhdCBjYW5ub3QgYmUgY2xvc2VkLicsXG4gICAgICAgICdUSEFUX0NBTk5PVF9CRV9PUEVORUQnOiAnVGhhdCBjYW5ub3QgYmUgb3BlbmVkLicsXG4gICAgICAgICdUSEFUX0lTX0FfSFVHRV9CQUxMT09OX1FVSVRFX1NDQVJZX0lGX0lUX0VYUExPREVTJzogJ1RoYXQgaXMgYSBodWdlIGJhbGxvb24sIGl0IHdvdWxkIGJlIHF1aXRlIHNjYXJ5IGlmIGl0IGV4cGxvZGVkLicsXG4gICAgICAgICdUSEFUX0lTX0FfU1RVUElEX0NPU1RVTUUnOiAnV2VsbCwgdGhhdCBpcyBhIHN0dXBpZCBjb3N0dW1lIGlmIEkgZXZlciBzYXcgb25lLicsXG4gICAgICAgICdUSEFUX0lTX01ZX0JBTkRfMSc6ICdUaGF0IGlzIG15IGJhbmQuIFRoZXkgbWF5IGJlIGxhenkgYW5kIG5vdCBzcGVjaWFsbHkgc2tpbGxlZCwgYnV0IHRoZXkgYXJlIG5pY2UgcGVvcGxlLicsXG4gICAgICAgICdUSEFUX0lTX01ZX0JBTkRfMic6ICdPaCBteSwgd2hhdCBhIGJhbmQhIFRoZSBiZXN0IGZyb20gdGhlIGJlc3QhJyxcbiAgICAgICAgJ1RIQVRfSVNfTVlfQkFORF8zJzogJ0xvb2sgYXQgdGhlbSwgc28gcGVhY2VmdWwsIG5vdCBtb3ZpbmcgYSBmaW5nZXIuLi4nLFxuICAgICAgICAnVEhBVF9TX1NPTUVfSElHSExZX1NVU1BJQ0lPVVNfV0hJVEVfUE9XREVSJzogJ1RoYXRcXCdzIHNvbWUgaGlnaGx5IHN1c3BpY2lvdXMgd2hpdGUgcG93ZGVyLicsXG4gICAgICAgICdUSEFUX1NfVEhFX0RPT1JfVE9fR09fQkFDS19UT19USEVfQkFDS1NUQUdFJzogJ1RoYXRcXCdzIHRoZSBkb29yIHRvIGdvIEJBQ0sgdG8gdGhlIEJBQ0tzdGFnZS4nLFxuICAgICAgICAnVEhBVF9TX1RIRV9TUElSSVQnOiAnVGhhdFxcJ3MgdGhlIHNwaXJpdCEnLFxuICAgICAgICAnVEhFX0ZMT09SX0lTX1NUSUNLWSc6ICdUaGUgZmxvb3IgaXMgc28gc3RpY2t5IGl0IGlzIGltcG9zc2libGUgdG8gbW92ZSBpdC4nLFxuICAgICAgICAnVEhFX09OTFlfVEhJTkdfSEVfV0FOVFNfUklHSFRfTk9XX0lTX0JFRVInOiAnVGhlIG9ubHkgdGhpbmcgaGUgd2FudHMgcmlnaHQgbm93IGlzIGJlZXIuJyxcbiAgICAgICAgJ1RIRV9PVEhFUlNfV0lMTF9CRV9SRUFEWSc6ICdCdXQgSSBhbSBzdXJlIHRoZSByZXN0IG9mIHRoZSBiYW5kIHdpbGwgYmUgcmVhZHksIGxldFxcJ3MgdGFsayB0byB0aGVtLicsXG4gICAgICAgICdUSEVSRV9BUkVfU09NRV9QUk9CTEVNU18xJzogJ0FjdHVhbGx5IHNvbWUgc21hbGwgcHJvYmxlbXMgaGF2ZSBhcmlzZWQuLi4nLFxuICAgICAgICAnVEhFUkVfQVJFX1NPTUVfUFJPQkxFTVNfMic6ICcuLi4gcmVhbGx5IG1pbm9yIGNvbXBsaWNhdGlvbnMgLi4uJyxcbiAgICAgICAgJ1RIRVJFX0FSRV9TT01FX1BST0JMRU1TXzMnOiAnLi4uIGEgQ1JBWlkgTUVTUy4nLFxuICAgICAgICAnVEhFUkVfSVNfQV9DQUJMRV9TVFVDS19CRUhJTkRfVEhFX01BQ0hJTkUnOiAnVGhlcmUgaXMgYSBjYWJsZSBzdHVjayBiZWhpbmQgdGhlIG1hY2hpbmUuJyxcbiAgICAgICAgJ1RISU5LX1BBQ09fVEhJTksnOiAnVGhpbmssIFBhY28sIHRoaW5rIScsXG4gICAgICAgICdUSElSRF9TQU5USV9TSFknOiAnQW5kIHRoaXJkLCBTYW50aSBqdXN0IGdvdCBzaHkuIEhlIHJlZnVzZXMgdG8gcGxheS4uLicsXG4gICAgICAgICdUSElTX0NBQkxFX0NPVUxEX0JFX1VTRUZVTCc6ICdUaGlzIGNhYmxlIGNvdWxkIGJlIHVzZWZ1bCwgbWF5YmUgSSBjYW4gXCJib3Jyb3dcIiBpdC4nLFxuICAgICAgICAnVEhJU19JU19ZT1VSX1NUQU5EQVJEX1ZFTkRJTkdfTUFDSElORSc6ICdJdCBpcyBqdXN0IGEgc3RhbmRhcmQgdmVuZGluZyBtYWNoaW5lLiBPbmx5IGRpcnRpZXIgdGhhbiBhdmVyYWdlLicsXG4gICAgICAgICdUSU1FX1RPX0dJVkVfSVRfVE9fSlVBTic6ICdUaW1lIHRvIGdpdmUgaXQgdG8gSnVhbi4nLFxuICAgICAgICAnVkVORElOR19NQUNISU5FJzogJ3ZlbmRpbmcgbWFjaGluZScsXG4gICAgICAgICdWRVJZX0JFQVVUSUZVTF9GTE9XRVJTJzogJ1ZlcnkgYmVhdXRpZnVsIGZsb3dlcnMuJyxcbiAgICAgICAgJ1ZJTlRBR0VfUFJFTUlVTV9DT1NUVU1FJzogJ0EgdmludGFnZSwgcmVhbGx5IHByZW1pdW0gY29zdHVtZSBJIG11c3Qgc2F5LicsXG4gICAgICAgICdXRV9DQU5fUExBWV9USEVfQ09OQ0VSVF9OT1cnOiAnV2UgY2FuIHBsYXkgdGhlIGNvbmNlcnQgbm93LCBteSBmcmllbmQuJyxcbiAgICAgICAgJ1dFX0NSSUVEJzogJ3dlIGNyaWVkJyxcbiAgICAgICAgJ1dFX0RPTlRfUkVIRUFSU0VfRU5PVUdIJzogJ01hbiwgd2UgaGF2ZW5cXCd0IHByYWN0aWNlZCBlbm91Z2gsIHdlIGFyZSBub3QgcmVhZHkgdG8gcGxheSEnLFxuICAgICAgICAnV0VfSEFWRV9USFJFRV9QUk9CTEVNUyc6ICdCYXNpY2FsbHkgd2UgaGF2ZSB0aHJlZSBwcm9ibGVtcy4uLicsXG4gICAgICAgICdXRV9IQVZFTlRfUFJBQ1RJU0VEX1NJTkNFXzIwMTInOiAnSSB0aGluayBsYXN0IHJlaGVhcnNhbCB3YXMgaW4gMjAxMi4nLFxuICAgICAgICAnV0VfTEFVR0hFRCc6ICdXZSBsYXVnaGVkLCcsXG4gICAgICAgICdXRUxMX0lfSEFEX0FOX0FXRVNPTUVfQ09TVFVNRSc6ICdXZWxsIEkgaGFkIGFuIGF3ZXNvbWUgY29zdHVtZSwgeW91IGtub3c/JyxcbiAgICAgICAgJ1dIQVRfQ0FOX1dFX0RPX0dVWVMnOiAnV2hhdCBjYW4gd2UgZG8gZ3V5cz8gQW55IGlkZWFzPycsXG4gICAgICAgICdXSEVSRV9DT1VMRF9JX0ZJTkRfQV9DQUJMRSc6ICdXaGVyZSBjb3VsZCBJIGZpbmQgYSBjYWJsZSBmb3Igw4FuZ2VsPycsXG4gICAgICAgICdXSFlfQ09TVFVNRVMnOiAnV2h5IGFyZSB3ZSBhbGwgZHJlc3NlZCB1cCBhbnlob3c/JyxcbiAgICAgICAgJ1dIWV9JU19FVkVSWVRISU5HX1NPX1BJWEVMWSc6ICdXaHkgaXMgZXZlcnl0aGluZyBzbyBwaXhlbHk/JyxcbiAgICAgICAgJ1dJU0VfUFVSQ0hBU0UnOiAnVGhhdCB3YXMgYSB3aXNlIHB1cmNoYXNlLicsXG4gICAgICAgICdZRVBfSV9DT1VMRF9CVUlMRF9BX0NPU1RVTUVfV0lUSF9USElTJzogJ1llcCwgSSBjb3VsZCBidWlsZCBhIGNvc3R1bWUgd2l0aCB0aGlzLicsXG4gICAgICAgICdZRVNfTU9NJzogJ1llcywgbW9tLicsXG4gICAgICAgICdZT1VfQkVUVEVSX1BVVF9JVF9PTic6ICdZb3UgYmV0dGVyIHB1dCBpdCBvbmUgYmVmb3JlIEkgZ2V0IGFuZ3J5LicsXG4gICAgICAgICdZT1VfQVJFX0FfQ09XQVJEX01BTl9XRV9IQVZFX0NPU1RVTUVTJzogJ0RvblxcJ3QgYmUgYSBwdXNzeSBtYW4uLi4gV2UgaGF2ZSBvdXIgY29zdHVtZXMsIHBlb3BsZSBqdXN0IHdvblxcJ3QgcGF5IGF0dGVudGlvbiB0byB0aGUgbXVzaWMuJyxcbiAgICAgICAgJ1lPVV9TVE9MRV9JVCc6ICdZb3Ugc3RvbGUgaXQsIHJpZ2h0PycsXG4gICAgICAgICdZT1VSX0xBQ0tfT0ZfQ09ORklERU5DRV9ESVNTQVBPSU5UU19NRSc6ICdPaCBwbGVhc2UhIFlvdXIgbGFjayBvZiBjb25maWRlbmNlIGRpc3NhcG9pbnRzIG1lLidcbiAgICB9XG59O1xuIiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgcmFuZG9tVGV4dCB9IGZyb20gJy4uL2VuZ2luZS91dGlscy9SYW5kb21UZXh0JztcbmltcG9ydCB7IENvaW4gfSBmcm9tICcuL0JhY2tzdGFnZVNjZW5lL0NvaW4nO1xuaW1wb3J0IHsgYWN0aXZlSW52ZW50b3J5IH0gZnJvbSAnLi4vZW5naW5lL3N0YXRlL0FjdGl2ZUludmVudG9yeS5zaW5nbGV0b24nO1xuaW1wb3J0IHsgc3R5bGUgfSBmcm9tICcuLi9lbmdpbmUvdWkvU3R5bGUnO1xuaW1wb3J0IHsgc2NlbmVzIH0gZnJvbSAnLi4vZW5naW5lL3N0YXRlL1NjZW5lcy5zaW5nbGV0b24nO1xuXG5sZXQgc3ByaXRlT3B0aW9ucyA9IG5ldyBNYXAoKTtcblxuc3ByaXRlT3B0aW9ucy5zZXQoJ3N0YW5kX3JpZ2h0JywgeyBmcmFtZXM6IFswXX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3dhbGtfcmlnaHQnLCB7IGZyYW1lczogWzEsIDIsIDMsIDQsIDUsIDZdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgndGFsa19yaWdodCcsIHsgZnJhbWVzOiBbMjEsIDIyLCAyMywgMjQsIDI1LCAyNl19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCdzdGFuZF9sZWZ0JywgeyBmcmFtZXM6IFswXSwgaW52ZXJzZTogdHJ1ZX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3dhbGtfbGVmdCcsIHsgZnJhbWVzOiBbMSwgMiwgMywgNCwgNSwgNl0sIGludmVyc2U6IHRydWV9KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCd0YWxrX2xlZnQnLCB7IGZyYW1lczogWzIxLCAyMiwgMjMsIDI0LCAyNSwgMjZdLCBpbnZlcnNlOiB0cnVlfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnc3RhbmRfdXAnLCB7IGZyYW1lczogWzE0XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3dhbGtfdXAnLCB7IGZyYW1lczogWzE1LCAxNiwgMTcsIDE4LCAxOSwgMjBdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgndGFsa191cCcsIHsgZnJhbWVzOiBbMTRdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnc3RhbmRfZG93bicsIHsgZnJhbWVzOiBbN119KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCd3YWxrX2Rvd24nLCB7IGZyYW1lczogWzgsIDksIDEwLCAxMSwgMTIsIDEzXX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ3RhbGtfZG93bicsIHsgZnJhbWVzOiBbMjcsIDI4LCAyOSwgMzAsIDMxLCAzMl19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCdnaXZlX2dsYXNzJywgeyBmcmFtZXM6IFszMywgMzQsIDM1LCAzNl19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCdwaWVyY2VfYmFsbG9vbicsIHsgZnJhbWVzOiBbMzcsIDM4LCAzOSwgNDBdfSk7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgc3ByaXRlSWQ6ICdET0NUT1JUSUxMQV9QTEFZRVJfU1BSSVRFJyxcbiAgICBpbml0aWFsWDogOTMsXG4gICAgaW5pdGlhbFk6IDE4NCxcbiAgICB4U3BlZWQ6IDgwLCAvL3B4L3NcbiAgICB5U3BlZWQ6IDU1LCAvL3B4L3NcbiAgICBhbmltYXRpb25TcGVlZDogc3R5bGUuREVGQVVMVF9BTklNQVRJT05fU1BFRUQsXG4gICAgc3ByaXRlT3B0aW9uczogc3ByaXRlT3B0aW9uc1xufTtcblxuY29uc3QgTUlOX1JFRkxFQ1RfQU5TV0VSUyA9IDQ7XG5cbmV4cG9ydCBjbGFzcyBEb2N0b3J0aWxsYVBsYXllciBleHRlbmRzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQobmV3IENvaW4oKSk7XG4gICAgfVxuXG4gICAgcmVmbGVjdCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHBvc3NpYmxlUmVmbGVjdGlvbnMgPSB0aGlzLmdldFBvc3NpYmxlUmVmbGVjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5zYXkocmFuZG9tVGV4dC5hcHBseSh0aGlzLCBwb3NzaWJsZVJlZmxlY3Rpb25zKSk7XG4gICAgfVxuXG4gICAgaGFzQ29tcGxldGVDb3N0dW1lKCk6IEJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBdHRyKCdDT1NUVU1FX0NPTVBMRVRFJyk7XG4gICAgfVxuXG4gICAgaGFzQ2FibGUoKTogQm9vbGVhbiB7XG4gICAgICAgIGxldCBpbnZlbnRvcnkgPSBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCk7XG4gICAgICAgIGxldCBjYWJsZSA9IGludmVudG9yeS5nZXRCeUlkKCdjYWJsZScpO1xuICAgICAgICByZXR1cm4gISFjYWJsZTtcbiAgICB9XG5cbiAgICBoYXNGdW5ueURyaW5rKCk6IEJvb2xlYW4ge1xuICAgICAgICBsZXQgaW52ZW50b3J5ID0gYWN0aXZlSW52ZW50b3J5LmdldEFjdGl2ZUludmVudG9yeSgpO1xuICAgICAgICBsZXQgZ2xhc3MgPSA8YW55PiBpbnZlbnRvcnkuZ2V0QnlJZCgnZ2xhc3MnKTtcbiAgICAgICAgcmV0dXJuIGdsYXNzICYmIGdsYXNzLmlzRnVubnkoKTtcbiAgICB9XG5cbiAgICByZW1vdmVDb3N0dW1lKCk6IHZvaWQge1xuICAgICAgICBsZXQgaW52ZW50b3J5ID0gYWN0aXZlSW52ZW50b3J5LmdldEFjdGl2ZUludmVudG9yeSgpO1xuICAgICAgICBsZXQgY29zdHVtZSA9IGludmVudG9yeS5nZXRCeUlkKCdjb3N0dW1lJyk7XG4gICAgICAgIGludmVudG9yeS5yZW1vdmUoY29zdHVtZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2FibGUoKTogdm9pZCB7XG4gICAgICAgIGxldCBpbnZlbnRvcnkgPSBhY3RpdmVJbnZlbnRvcnkuZ2V0QWN0aXZlSW52ZW50b3J5KCk7XG4gICAgICAgIGxldCBjYWJsZSA9IGludmVudG9yeS5nZXRCeUlkKCdjYWJsZScpO1xuICAgICAgICBpbnZlbnRvcnkucmVtb3ZlKGNhYmxlKTtcbiAgICB9XG5cbiAgICByZW1vdmVHbGFzcygpOiB2b2lkIHtcbiAgICAgICAgbGV0IGludmVudG9yeSA9IGFjdGl2ZUludmVudG9yeS5nZXRBY3RpdmVJbnZlbnRvcnkoKTtcbiAgICAgICAgbGV0IGdsYXNzID0gaW52ZW50b3J5LmdldEJ5SWQoJ2dsYXNzJyk7XG4gICAgICAgIGludmVudG9yeS5yZW1vdmUoZ2xhc3MpO1xuICAgIH1cblxuICAgIGRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKTogQm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHIoJ0RFTElWRVJFRF9DQUJMRScpICYmIHRoaXMuZ2V0QXR0cignREVMSVZFUkVEX0NPU1RVTUUnKSAmJiB0aGlzLmdldEF0dHIoJ0RFTElWRVJFRF9EUklOSycpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvblN0YXRlQ2hhbmdlKCkge1xuICAgICAgICBpZih0aGlzLmRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKSkge1xuICAgICAgICAgICAgbGV0IGJpbGkgPSBzY2VuZXMuZ2V0U2NlbmVCeUlkKCdCQUNLWUFSRCcpLmdldFRoaW5nQnlJZCgnYmlsaScpO1xuICAgICAgICAgICAgYmlsaS5jaGFuZ2VBdHRyKCdEUlVOSycsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQb3NzaWJsZVJlZmxlY3Rpb25zKCk6IEFycmF5PHN0cmluZz4ge1xuXG4gICAgICAgIGNvbnN0IEZJTExFUlMgPSBbXG4gICAgICAgICAgICAnTk9XX0lfU0hPVUxEX1NBWV9TT01FVEhJTkdfU01BUlRfVEhBVF9IRUxQUycsXG4gICAgICAgICAgICAnV0hZX0lTX0VWRVJZVEhJTkdfU09fUElYRUxZJyxcbiAgICAgICAgICAgICdPTkVfQ09OQ0VSVF9BX1lFQVJfSVNfVE9PX01VQ0hfUFJFU1NVUkUnLFxuICAgICAgICAgICAgJ1RISU5LX1BBQ09fVEhJTksnXG4gICAgICAgIF07XG5cbiAgICAgICAgbGV0IHRoaW5nc1RvU2F5ID0gdGhpcy5nZXRUaGluZ3NUb1NheUZvclNpdHVhdGlvbigpO1xuXG4gICAgICAgIHJldHVybiBmaWxsQXJyYXlXaXRoRmlsbGVycyh0aGluZ3NUb1NheSwgRklMTEVSUyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaGluZ3NUb1NheUZvclNpdHVhdGlvbigpOiBBcnJheTxzdHJpbmc+IHtcblxuXG4gICAgICAgIGlmKCF0aGlzLmdldEF0dHIoJ1RBTEtFRF9UT19USEVfQkFORCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gWydGSVJTVF9PRl9BTExfSV9TSE9VTERfVEFMS19UT19USEVfQkFORCcsICdJX1dPTkRFUl9JRl9USEVfR1VZU19IQVZFX0VWRVJZVEhJTkdfUkVBRFknXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCF0aGlzLmRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKSkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdDogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgICAgICAgICAgaWYoIXRoaXMuZ2V0QXR0cignREVMSVZFUkVEX0NBQkxFJykpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCgnV0hFUkVfQ09VTERfSV9GSU5EX0FfQ0FCTEUnKTtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCgnSVNfVEhBVF9BX0NBQkxFX0JFSElORF9USEVfVkVORElOR19NQUNISU5FJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZighdGhpcy5nZXRBdHRyKCdERUxJVkVSRURfQ09TVFVNRScpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goJ01ZX0dSQU5ERkFUSEVSX1NBSURfQV9DT1NUVU1FX01VU1RfSEFWRV8zX1RISU5HUycpO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCdNQVlCRV9JX0NBTl9CVUlMRF9BX0NPU1RVTUVfTVlTRUxGJyk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goJ0lfQ09VTERfTUFLRV9BX0hBV0FJSUFOX0NPU1RVTUUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCF0aGlzLmdldEF0dHIoJ0RFTElWRVJFRF9EUklOSycpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goJ01BWUJFX1NBTlRJX05FRURTX1NPTUVUSElOR19UT19EUklOSycpO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCdJX0JFVF9USEFUX1NVU1BJQ0lPU19XSElURV9QT1dERVJfRlJPTV9USEVfVEFCTEVfQ0FOX01BS0VfU09NRUJPRFlfTEVTU19TSFknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0aGlzLmdldEF0dHIoJ1RBTEtFRF9UT19EUlVOS19CSUxJJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWydJX1NIT1VMRF9TT0JFUl9CSUxJX1VQJywgJ01BWUJFX0lfQ0FOX1NDQVJFX0hJTV9TT19IRV9HRVRTX1NPQkVSJ107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBbJ0lfU0hPVUxEX0dPX0ZJTkRfQklMSSddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59XG5cblxuZnVuY3Rpb24gZmlsbEFycmF5V2l0aEZpbGxlcnMoYXJyYXlUb0ZpbGw6IEFycmF5PHN0cmluZz4sIGZpbGxlcnM6IEFycmF5PHN0cmluZz4sIG1pblNpemU6IG51bWJlciA9IE1JTl9SRUZMRUNUX0FOU1dFUlMpOiBBcnJheTxzdHJpbmc+IHtcbiAgICBsZXQgcmVzdWx0ID0gYXJyYXlUb0ZpbGwuc2xpY2UoKTtcbiAgICBpZigocmVzdWx0Lmxlbmd0aCArIGZpbGxlcnMubGVuZ3RoKSA8IG1pblNpemUpIHtcbiAgICAgICAgdGhyb3cgJ0VSUk9SIHRoZXJlIGFyZSBub3QgZW5vdWdoIGZpbGxlcnMuJztcbiAgICB9XG4gICAgbGV0IGZpbGxlcnNDb3B5ID0gZmlsbGVycy5zbGljZSgpO1xuICAgIHdoaWxlKHJlc3VsdC5sZW5ndGggPCBtaW5TaXplKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGV4dHJhY3RSYW5kb21NZW1iZXJPZkFycmF5KGZpbGxlcnNDb3B5KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RSYW5kb21NZW1iZXJPZkFycmF5KG11dGFibGVBcnJheTogQXJyYXk8c3RyaW5nPik6IHN0cmluZyB7XG4gICAgaWYoIW11dGFibGVBcnJheSB8fCAhbXV0YWJsZUFycmF5Lmxlbmd0aCkge1xuICAgICAgICB0aHJvdyAnRVJST1IgdHJ5aW5nIHRvIGV4dHJhY3QgZWxlbWVudCBmcm9tIGVtcHR5IGFycmF5JztcbiAgICB9XG4gICAgbGV0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbXV0YWJsZUFycmF5Lmxlbmd0aCk7XG4gICAgbGV0IHJlc3VsdCA9IG11dGFibGVBcnJheVtyYW5kb21JbmRleF07XG4gICAgbXV0YWJsZUFycmF5LnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn0iLCJpbXBvcnQgeyBEb29yIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9Eb29yJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IHJhbmRvbVRleHQgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvUmFuZG9tVGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBCYWNrc3RhZ2VEb29yVG9CYWNreWFyZCBleHRlbmRzIERvb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkOiAnQkFDS1NUQUdFX1RPX0JBQ0tZQVJEJyxcbiAgICAgICAgICAgIG5hbWU6ICdET09SX1RPX0JBQ0tZQVJEJyxcbiAgICAgICAgICAgIHg6IDczOSxcbiAgICAgICAgICAgIHk6IDExMSxcbiAgICAgICAgICAgIHNwcml0ZUlkOiAnQkFDS1NUQUdFX0RPT1JfVE9fQkFDS1lBUkRfU1BSSVRFJyxcbiAgICAgICAgICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDc0MyxcbiAgICAgICAgICAgICAgICB5OiAyMTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0aW5hdGlvblNjZW5lSWQ6ICdCQUNLWUFSRCcsXG4gICAgICAgICAgICByZWxhdGVkRG9vcklkOiAnQkFDS1lBUkRfVE9fQkFDS1NUQUdFJ1xuICAgICAgICB9O1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignT1BFTicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ0JBQ0tZQVJEJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnRE9PUl9UT19CQUNLWUFSRCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdGFrZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnQ0FOTk9UX1BJQ0tfQV9ET09SX1VQJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNwZWFrQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAnSElfRE9PUl9IT1dfQVJFX1lPVV9UT0RBWScsXG4gICAgICAgICAgICAnU0hFX0lTX1NIWV9ET0VTTlRfV0FOVF9UT19UQUxLX1RPX01FJyxcbiAgICAgICAgICAgICdJX0hBVkVfQkVUVEVSX1RISU5HU19UT19ET19USEFOX1RBTEtJTkcnXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KCdCSUxJX01VU1RfQkVfT1VUX1RIRVJFX1NNT0tJTkcnKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuXG5sZXQgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2JhY2tzdGFnZV9kb29yX3RvX3N0YWdlJyxcbiAgICB4OiAzMzAsXG4gICAgeTogNjcsXG4gICAgc3ByaXRlSWQ6ICdCQUNLU1RBR0VfRE9PUl9UT19TVEFHRScsXG4gICAgbmFtZTogJ0RPT1JfVE9fU1RBR0UnLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiAzNzgsXG4gICAgICAgIHk6IDE2M1xuICAgIH1cbn07XG5cbmV4cG9ydCBjbGFzcyBCYWNrc3RhZ2VEb29yVG9TdGFnZSBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9wZW5BY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5sb29rQXQoRGlyZWN0aW9ucy5ET1dOKTtcbiAgICAgICAgcGxheWVyLnNheSgnTk9QRV9JX0NBTk5PVF9HT19UT19USEVfU1RBR0UnKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdGSVJTVF9JX05FRURfVE9fR0VUX1RIRV9CQU5EX1JFQURZJyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY2xvc2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0lUX0lTX0FMUkVBRFlfQ0xPU0VEJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRha2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0NBTk5PVF9QSUNLX0FfRE9PUl9VUCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwdXNoQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIubG9va0F0KERpcmVjdGlvbnMuRE9XTik7XG4gICAgICAgIHBsYXllci5zYXkoJ05PUEVfSV9DQU5OT1RfR09fVE9fVEhFX1NUQUdFJylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnRklSU1RfSV9ORUVEX1RPX0dFVF9USEVfQkFORF9SRUFEWScpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNwZWFrQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAnSElfRE9PUl9IT1dfQVJFX1lPVV9UT0RBWScsXG4gICAgICAgICAgICAnU0hFX0lTX1NIWV9ET0VTTlRfV0FOVF9UT19UQUxLX1RPX01FJyxcbiAgICAgICAgICAgICdJX0hBVkVfQkVUVEVSX1RISU5HU19UT19ET19USEFOX1RBTEtJTkcnXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAnTklDRV9TQUZFX0RPT1InLFxuICAgICAgICAgICAgJ01BREVfT0ZfTUVUQUxfUlVTVF9BTkRfU1RJQ0tZX1NUVUZGJyxcbiAgICAgICAgICAgICdJX0NBTl9IRUFSX1RIRV9DUk9XRF9XQUlUSU5HX0ZPUl9VUydcbiAgICAgICAgKSk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgRGlyZWN0aW9ucyB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9EaXJlY3Rpb25zJztcbmltcG9ydCB7IHJhbmRvbVRleHQgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvUmFuZG9tVGV4dCc7XG5cbmxldCBvcHRpb25zID0ge1xuICAgIGlkOiAnYmFjc2t0YWdlX2Rvb3JfdG9fc3RyZWV0JyxcbiAgICB4OiA1OSxcbiAgICB5OiAxMDAsXG4gICAgc3ByaXRlSWQ6ICdCQUNLU1RBR0VfRE9PUl9UT19TVFJFRVQnLFxuICAgIG5hbWU6ICdET09SX1RPX1NUUkVFVCcsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDEwMSxcbiAgICAgICAgeTogMTg1XG4gICAgfVxufTtcblxuZXhwb3J0IGNsYXNzIEJhY2tzdGFnZURvb3JUb1N0cmVldCBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9wZW5BY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5sb29rQXQoRGlyZWN0aW9ucy5ET1dOKTtcbiAgICAgICAgcGxheWVyLnNheSgnTk9QRV9JX0NBTk5PVF9HT19UT19USEVfU1RSRUVUJylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnSV9IQVZFX0FfQ09OQ0VSVF9UT19QTEFZJyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY2xvc2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0lUX0lTX0FMUkVBRFlfQ0xPU0VEJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRha2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0NBTk5PVF9QSUNLX0FfRE9PUl9VUCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwdXNoQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIubG9va0F0KERpcmVjdGlvbnMuRE9XTik7XG4gICAgICAgIHBsYXllci5zYXkoJ05PUEVfSV9DQU5OT1RfR09fVE9fVEhFX1NUUkVFVCcpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ0lfSEFWRV9BX0NPTkNFUlRfVE9fUExBWScpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNwZWFrQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBwbGF5ZXIubG9va0F0KERpcmVjdGlvbnMuTEVGVCk7XG4gICAgICAgIHBsYXllci5zYXkocmFuZG9tVGV4dChcbiAgICAgICAgICAgICdISV9ET09SX0hPV19BUkVfWU9VX1RPREFZJyxcbiAgICAgICAgICAgICdTSEVfSVNfU0hZX0RPRVNOVF9XQU5UX1RPX1RBTEtfVE9fTUUnLFxuICAgICAgICAgICAgJ0lfSEFWRV9CRVRURVJfVEhJTkdTX1RPX0RPX1RIQU5fVEFMS0lORydcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5sb29rQXQoRGlyZWN0aW9ucy5MRUZUKTtcbiAgICAgICAgcGxheWVyLnNheShyYW5kb21UZXh0KFxuICAgICAgICAgICAgJ05JQ0VfU0FGRV9ET09SJyxcbiAgICAgICAgICAgICdNQURFX09GX01FVEFMX1JVU1RfQU5EX1NUSUNLWV9TVFVGRicsXG4gICAgICAgICAgICAnSV9DQU5fSEVBUl9USEVfQ1JPV0RfV0FJVElOR19GT1JfVVMnXG4gICAgICAgICkpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFNjZW5lIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9TY2VuZSc7XG5pbXBvcnQgeyBCcm9vbSB9IGZyb20gJy4vQnJvb20nO1xuaW1wb3J0IHsgVmVuZGluZ01hY2hpbmUgfSBmcm9tICcuL1ZlbmRpbmdNYWNoaW5lJztcbmltcG9ydCB7IEJhY2tzdGFnZURvb3JUb0JhY2t5YXJkIH0gZnJvbSAnLi9CYWNrc3RhZ2VEb29yVG9CYWNreWFyZCc7XG5pbXBvcnQgeyBCYWNrc3RhZ2VEb29yVG9TdHJlZXQgfSBmcm9tICcuL0JhY2tzdGFnZURvb3JUb1N0cmVldCc7XG5pbXBvcnQgeyBCYWNrc3RhZ2VEb29yVG9TdGFnZSB9IGZyb20gJy4vQmFja3N0YWdlRG9vclRvU3RhZ2UnO1xuaW1wb3J0IHsgQmFuZEluU29mYSB9IGZyb20gJy4vQmFuZEluU29mYSc7XG5pbXBvcnQgeyBTY2lzc29ycyB9IGZyb20gJy4vU2Npc3NvcnMnO1xuaW1wb3J0IHsgQm9jYWRpbGxvIH0gZnJvbSAnLi9Cb2NhZGlsbG8nO1xuaW1wb3J0IHsgQ2FibGUgfSBmcm9tICcuL0NhYmxlJztcbmltcG9ydCB7IENvY29udXQgfSBmcm9tICcuL0NvY29udXQnO1xuaW1wb3J0IHsgRHVzdCB9IGZyb20gJy4vRHVzdEluVGFibGUnO1xuaW1wb3J0IHsgR2xhc3MgfSBmcm9tICcuL0dsYXNzJztcbmltcG9ydCB7IExhbXBMZWZ0IH0gZnJvbSAnLi9MYW1wTGVmdCc7XG5pbXBvcnQgeyBMYW1wUmlnaHQgfSBmcm9tICcuL0xhbXBSaWdodCc7XG5pbXBvcnQgeyBGbHlDYXNlIH0gZnJvbSAnLi9GbHlDYXNlJztcbmltcG9ydCB7IFBvbHlnb24gfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvUG9seWdvbic7XG5cbmNvbnN0IHNjZW5lT3B0aW9ucyA9IHtcbiAgICBpZDogJ0JBQ0tTVEFHRScsXG4gICAgYmFja2dyb3VuZElkOiAnQkFDS1NUQUdFX0JHJyxcbiAgICBib3VuZGFyaWVzQ29uZmlnOiBuZXcgUG9seWdvbihbXG4gICAgICAgIHt4OiA1NSwgeTogMjE4fSxcbiAgICAgICAge3g6IDEwMSwgeTogMTY4fSxcbiAgICAgICAge3g6IDE0MiwgeTogMTYzfSxcbiAgICAgICAge3g6IDEzMCwgeTogMTc0fSxcbiAgICAgICAge3g6IDE5NSwgeTogMTcxfSxcbiAgICAgICAge3g6IDIxMywgeTogMTU4fSxcbiAgICAgICAge3g6IDIyOSwgeTogMTU4fSxcbiAgICAgICAge3g6IDIyMiwgeTogMTc2fSxcbiAgICAgICAge3g6IDMwOCwgeTogMTgwfSxcbiAgICAgICAge3g6IDMzMiwgeTogMTU4fSxcbiAgICAgICAge3g6IDQ2NSwgeTogMTU4fSxcbiAgICAgICAge3g6IDQ2OSwgeTogMTgzfSxcbiAgICAgICAge3g6IDQ5NCwgeTogMTkzfSxcbiAgICAgICAge3g6IDU1MywgeTogMTg5fSxcbiAgICAgICAge3g6IDU2OSwgeTogMTgxfSxcbiAgICAgICAge3g6IDU2OCwgeTogMTU4fSxcbiAgICAgICAge3g6IDYwOCwgeTogMTYwfSxcbiAgICAgICAge3g6IDYyNywgeTogMTg1fSxcbiAgICAgICAge3g6IDY5MSwgeTogMTg0fSxcbiAgICAgICAge3g6IDcwNiwgeTogMjAyfSxcbiAgICAgICAge3g6IDc2MiwgeTogMjAwfSxcbiAgICAgICAge3g6IDc5MCwgeTogMjE4fVxuICAgIF0pLFxuICAgIHRoaW5nczogW1xuICAgICAgICBcbiAgICAgICAgbmV3IEJhY2tzdGFnZURvb3JUb0JhY2t5YXJkKCksXG4gICAgICAgIG5ldyBCYWNrc3RhZ2VEb29yVG9TdHJlZXQoKSxcbiAgICAgICAgbmV3IEJhY2tzdGFnZURvb3JUb1N0YWdlKCksXG4gICAgICAgIG5ldyBDYWJsZSgpLFxuICAgICAgICBuZXcgVmVuZGluZ01hY2hpbmUoKSxcbiAgICAgICAgbmV3IEJhbmRJblNvZmEoKSxcbiAgICAgICAgbmV3IExhbXBMZWZ0KCksXG4gICAgICAgIG5ldyBMYW1wUmlnaHQoKSxcbiAgICAgICAgbmV3IEZseUNhc2UoKSxcbiAgICAgICAgbmV3IEJyb29tKCksXG4gICAgICAgIG5ldyBTY2lzc29ycygpLFxuICAgICAgICBuZXcgQm9jYWRpbGxvKCksXG4gICAgICAgIG5ldyBHbGFzcygpLFxuICAgICAgICBuZXcgRHVzdCgpLFxuICAgICAgICBuZXcgQ29jb251dCgpXG4gICAgICAgIFxuICAgIF1cbn07XG5cbmV4cG9ydCBjbGFzcyBCYWNrc3RhZ2VTY2VuZSBleHRlbmRzIFNjZW5lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoc2NlbmVPcHRpb25zKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2JhY29uJyxcbiAgICBzcHJpdGVJZDogJ0JBQ09OJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQkFDT05fSU5WJyxcbiAgICBuYW1lOiAnQkFDT04nLFxuICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk6IHRydWVcbn1cblxuZXhwb3J0IGNsYXNzIEJhY29uIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5zYXkoJ0RFTElDSU9VU19BTkRfR1JFQVNZJyk7XG4gICAgfVxufSIsImltcG9ydCB7IFNwZWVjaEJ1YmJsZSB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9TcGVlY2hCdWJibGUnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbldpdGhCYW5kIH0gZnJvbSAnLi9Db252ZXJzYXRpb25XaXRoQmFuZCc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyBzdHlsZSB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9TdHlsZSc7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgSVBvaW50IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL0ludGVyZmFjZXMnO1xuaW1wb3J0IHsgYW5hbHl0aWNzIH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL2FuYWx5dGljcyc7XG5cbmxldCBzcHJpdGVPcHRpb25zID0gbmV3IE1hcCgpO1xuXG5zcHJpdGVPcHRpb25zLnNldCgncXVpZXQnLCB7IGZyYW1lczogWzBdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnanVhbl90YWxraW5nJywgeyBmcmFtZXM6IFsxLCAyLCAzLCA0LCA1LCA2XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ2FuZ2VsX3RhbGtpbmcnLCB7IGZyYW1lczogWzcsIDgsIDksIDEwLCAxMSwgMTJdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnc2FudGlfdGFsa2luZycsIHsgZnJhbWVzOiBbMTMsIDE0LCAxNSwgMTYsIDE3LCAxOF19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCdzYW50aV9kcmlua2luZycsIHsgZnJhbWVzOiBbMTksIDIwLCAyMSwgMjJdfSk7XG5cbmV4cG9ydCBjbGFzcyBCYW5kSW5Tb2ZhIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBzcGVlY2hCdWJibGU6IFNwZWVjaEJ1YmJsZTtcbiAgICBwcml2YXRlIGxhc3RQZXJzb25UYWxraW5nOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZDogJ2JhbmRJblNvZmEnLFxuICAgICAgICAgICAgeDogNDgxLFxuICAgICAgICAgICAgeTogMTA1LFxuICAgICAgICAgICAgc3ByaXRlSWQ6ICdCQU5EX0lOX1NPRkFfU1BSSVRFJyxcbiAgICAgICAgICAgIG5hbWU6ICdSRVNUX09GX1RIRV9CQU5EJyxcbiAgICAgICAgICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDQ1OSxcbiAgICAgICAgICAgICAgICB5OiAxODFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXJlY3Rpb25Ub0xvb2s6IERpcmVjdGlvbnMuUklHSFQsXG4gICAgICAgICAgICBzcHJpdGVPcHRpb25zOiBzcHJpdGVPcHRpb25zLFxuICAgICAgICAgICAgYW5pbWF0aW9uU3BlZWQ6IHN0eWxlLkRFRkFVTFRfQU5JTUFUSU9OX1NQRUVEXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZSA9IG5ldyBTcGVlY2hCdWJibGUoe1xuICAgICAgICAgICAgb3duZXI6IHRoaXNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5zYXkocmFuZG9tVGV4dChcbiAgICAgICAgICAgICdUSEFUX0lTX01ZX0JBTkRfMScsXG4gICAgICAgICAgICAnVEhBVF9JU19NWV9CQU5EXzInLFxuICAgICAgICAgICAgJ1RIQVRfSVNfTVlfQkFORF8zJ1xuICAgICAgICApKTtcbiAgICB9XG5cbiAgICBzcGVha0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5jaGFuZ2VBdHRyKCdUQUxLRURfVE9fVEhFX0JBTkQnLCB0cnVlKTtcbiAgICAgICAgYW5hbHl0aWNzLnNlbmRFdmVudCgnZ2FtZScsICd0YWxrX3RvX2JhbmQnKTtcbiAgICAgICAgdGhpcy5zdGFydENvbnZlcnNhdGlvbihwbGF5ZXIpO1xuICAgIH1cblxuICAgIHNheSh0ZXh0OiBzdHJpbmcsIHdob1RhbGtzOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uKHdob1RhbGtzICsgJ190YWxraW5nJyk7XG4gICAgICAgIHRoaXMudXBkYXRlU3BlZWNoQnViYmxlU3R5bGUod2hvVGFsa3MpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnNwZWVjaEJ1YmJsZS5zYXkodGV4dCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsYXlBbmltYXRpb24oJ3F1aWV0Jyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9uT25Ub3AoKTogSVBvaW50IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuc3ByaXRlLngsXG4gICAgICAgICAgICB5OiBNYXRoLnJvdW5kKHRoaXMuc3ByaXRlLmdldEJvdW5kcygpLnkpIC0gMTBcbiAgICAgICAgfTtcbiAgICAgICAgaWYodGhpcy5sYXN0UGVyc29uVGFsa2luZyA9PT0gJ3NhbnRpJykge1xuICAgICAgICAgICAgcmVzdWx0LnggKz0gNzA7XG4gICAgICAgICAgICByZXN1bHQueSArPSAxMDtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmxhc3RQZXJzb25UYWxraW5nID09PSAnYW5nZWwnKSB7XG4gICAgICAgICAgICByZXN1bHQueCArPSAzMDtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmxhc3RQZXJzb25UYWxraW5nID09PSAnanVhbicpIHtcbiAgICAgICAgICAgIHJlc3VsdC54IC09IDIwO1xuICAgICAgICAgICAgcmVzdWx0LnkgKz0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2l2ZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHZhciB0aGluZyA9IHNlbGVjdGVkVGhpbmcudGhpbmc7XG4gICAgICAgIGlmICh0aGluZy5pZCA9PT0gJ2NhYmxlJykge1xuICAgICAgICAgICAgdGhpcy5zdGFydENvbnZlcnNhdGlvbihwbGF5ZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaW5nLmlkID09PSAnZ2xhc3MnKSB7XG4gICAgICAgICAgICBpZih0aGluZy5nZXRBdHRyKCdGSUxMRUQnKSAmJiB0aGluZy5nZXRBdHRyKCdQT1dERVJfSU5TSURFJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0Q29udmVyc2F0aW9uKHBsYXllcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfU0hPVUxEX1BVVF9TT01FVEhJTkdfTU9SRV9JTlRFUkVTVElOR19JTl9USEVfR0xBU1MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGluZy5pZCA9PT0gJ2Nvc3R1bWUnKSB7XG4gICAgICAgICAgICBpZihwbGF5ZXIuZ2V0QXR0cignQ09TVFVNRV9DT01QTEVURScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydENvbnZlcnNhdGlvbihwbGF5ZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX0hBVkVfVE9fRklOSVNIX1RIRV9DT1NUVU1FX0ZJUlNUJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdXBlci51c2VBY3Rpb24ocGxheWVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlU3BlZWNoQnViYmxlU3R5bGUod2hvVGFsa3M6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmxhc3RQZXJzb25UYWxraW5nID0gd2hvVGFsa3M7XG4gICAgICAgIGlmKHdob1RhbGtzID09PSAnc2FudGknKSB7XG4gICAgICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZS5zZXRGb3JlZ3JvdW5kVGV4dFN0eWxlKCdGT05UXzMyX0JMVUUnKTtcbiAgICAgICAgICAgIHRoaXMuc3BlZWNoQnViYmxlLnNldFNoYWRvd1RleHRTdHlsZSgnRk9OVF8zMl9CTEFDSycpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHdob1RhbGtzID09PSAnanVhbicpIHtcbiAgICAgICAgICAgIHRoaXMuc3BlZWNoQnViYmxlLnNldEZvcmVncm91bmRUZXh0U3R5bGUoJ0ZPTlRfMzJfT1JBTkdFJyk7XG4gICAgICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZS5zZXRTaGFkb3dUZXh0U3R5bGUoJ0ZPTlRfMzJfQkxBQ0snKTtcbiAgICAgICAgfVxuICAgICAgICBpZih3aG9UYWxrcyA9PT0gJ2FuZ2VsJykge1xuICAgICAgICAgICAgdGhpcy5zcGVlY2hCdWJibGUuc2V0Rm9yZWdyb3VuZFRleHRTdHlsZSgnRk9OVF8zMl9ZRUxMT1cnKTtcbiAgICAgICAgICAgIHRoaXMuc3BlZWNoQnViYmxlLnNldFNoYWRvd1RleHRTdHlsZSgnRk9OVF8zMl9CTEFDSycpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuXG4gICAgcHJpdmF0ZSBzdGFydENvbnZlcnNhdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKSA6IHZvaWQge1xuICAgICAgICBwbGF5ZXIuZ29Ub1RoaW5nKHRoaXMpLnRoZW4oXG4gICAgICAgICAgICAoKSA9PiBuZXcgQ29udmVyc2F0aW9uV2l0aEJhbmQocGxheWVyLCB0aGlzKVxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IEJyZWFkIH0gZnJvbSAnLi9CcmVhZCc7XG5pbXBvcnQgeyBCYWNvbiB9IGZyb20gJy4vQmFjb24nO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnYm9jYWRpbGxvJyxcbiAgICB4OiA3MDUsXG4gICAgeTogMTQ1LFxuICAgIHNwcml0ZUlkOiAnQk9DQURJTExPJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQk9DQURJTExPX0lOVicsXG4gICAgbmFtZTogJ0JPQ0FESUxMTycsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDY5MixcbiAgICAgICAgeTogMTkwXG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufVxuXG5leHBvcnQgY2xhc3MgQm9jYWRpbGxvIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSV9USElOS19JX0NBTl9PUEVOX0lUX0FORF9UQUtFX1RIRV9CQUNPTicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnQV9SQU5DSURfQU5EX0dSRUFTWV9TQU5EV0hJQ0gnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvcGVuQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBuZXcgQmFjb24oKTtcbiAgICAgICAgICAgIG5ldyBCcmVhZCgpO1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX0hBVkVfVE9fUElDS19JVF9VUF9GSVJTVCcpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnYnJlYWQnLFxuICAgIHNwcml0ZUlkOiAnQlJFQUQnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdCUkVBRF9JTlYnLFxuICAgIG5hbWU6ICdCUkVBRCcsXG4gICAgZGlyZWN0bHlJbkludmVudG9yeTogdHJ1ZVxufVxuXG5leHBvcnQgY2xhc3MgQnJlYWQgZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGxvb2tBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLnNheSgnQlJFQURfTEVGVE9WRVJTX05PVF9VU0VGVUwnKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgVmVyYnMgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RvcmVzL1ZlcmJzLnN0b3JlJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyBTa2lydCB9IGZyb20gJy4vU2tpcnQnO1xuaW1wb3J0IHsgcmFuZG9tVGV4dCB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9SYW5kb21UZXh0JztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2Jyb29tJyxcbiAgICB4OiAxMDMsXG4gICAgeTogMTE5LFxuICAgIHNwcml0ZUlkOiAnQlJPT00nLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdCUk9PTV9JTlYnLFxuICAgIG5hbWU6ICdCUk9PTScsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDExNyxcbiAgICAgICAgeTogMTc2XG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICBwcmVmZXJyZWRBY3Rpb246IFZlcmJzLlRBS0UsXG4gICAgcHJlZmVycmVkSW52ZW50b3J5QWN0aW9uOiBWZXJicy5MT09LXG59O1xuXG5leHBvcnQgY2xhc3MgQnJvb20gZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfQ09VTERfTUFLRV9BX1dJR19XSVRIX1RISVMnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkocmFuZG9tVGV4dChcbiAgICAgICAgICAgICAgICAnQV9CUk9PTV9USEVfUEVSRkVDVF9DTEVBTklOR19JTlNUUlVNRU5UJyxcbiAgICAgICAgICAgICAgICAnSV9DT1VMRF9NQUtFX0FfV0lHX1dJVEhfVEhJUydcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnc2Npc3NvcnMnKSB7XG4gICAgICAgICAgICB0aGlzLmN1dFdpdGhTY2lzc29ycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSV9ET05UX0tOT1dfSE9XX1RPX0RPX1RIQVQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGN1dFdpdGhTY2lzc29ycygpIHtcbiAgICAgICAgbmV3IFNraXJ0KCk7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IHNjZW5lcyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TY2VuZXMuc2luZ2xldG9uJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2NhYmxlJyxcbiAgICB4OiAxODcsXG4gICAgeTogMTI1LFxuICAgIHNwcml0ZUlkOiAnQ0FCTEUnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdDQUJMRV9JTlYnLFxuICAgIG5hbWU6ICdDQUJMRScsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDIxOSxcbiAgICAgICAgeTogMTY1XG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIENhYmxlIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdGFrZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgdmVuZGluZ01hY2hpbmUgPSBzY2VuZXMuY3VycmVudFNjZW5lLmdldFRoaW5nQnlJZCgndmVuZGluZycpO1xuICAgICAgICAgICAgaWYgKCF2ZW5kaW5nTWFjaGluZSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdFUlJPUjogdmVuZGluZyBtYWNoaW5lIHNob3VsZCBiZSBwcmVzZW50IGluIGN1cnJlbnQgc2NlbmUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmVuZGluZ01hY2hpbmUuZ2V0QXR0cignUFVTSEVEJykpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc2F5KCdGSU5BTExZX0lfR09UX1RIRV9DQUJMRScpO1xuICAgICAgICAgICAgICAgIHRoaXMubGV0UGxheWVyQ29tZUFuZFRha2VJdChwbGF5ZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc2F5KCdJVF9JU19TVFVDS19CRUhJTkRfVEhFX1ZFTkRJTkdfTUFDSElORScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnQ09PTF9OT1dfSV9TSE9VTERfR0lWRV9JVF9UT19USEVfR1VZUycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnVEhJU19DQUJMRV9DT1VMRF9CRV9VU0VGVUwnKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcblxuZXhwb3J0IGNsYXNzIENhbiBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZDogJ2NhbicsXG4gICAgICAgICAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQ0FOX0lOVicsXG4gICAgICAgICAgICBuYW1lOiAnQ0FOJyxcbiAgICAgICAgICAgIGRpcmVjdGx5SW5JbnZlbnRvcnk6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2dsYXNzJykge1xuICAgICAgICAgICAgbGV0IGdsYXNzID0gPGFueT4gc2VsZWN0ZWRUaGluZy50aGluZztcbiAgICAgICAgICAgIGdsYXNzLmZpbGxXaXRoRHJpbmsocGxheWVyLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnZHVzdCcpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfU0hPVUxEX1BST0JBQkxZX01JWF9JVF9JTl9BX0dMQVNTJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdXBlci51c2VBY3Rpb24ocGxheWVyKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgY29zdHVtZUNyZWF0b3IgfSBmcm9tICcuLi91dGlscy9Db3N0dW1lQ3JlYXRvcic7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnY29jb251dCcsXG4gICAgeDogOTIsXG4gICAgeTogMTk1LFxuICAgIHNwcml0ZUlkOiAnQ09DT05VVCcsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ0NPQ09OVVRfSU5WJyxcbiAgICBuYW1lOiAnQ09DT05VVCcsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDExMCxcbiAgICAgICAgeTogMjAzXG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICBpc0ZvcmVncm91bmQ6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBDb2NvbnV0IGV4dGVuZHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdET0VTX0lUX0xPT0tfTElLRV9BX1BBSVJfT0ZfVElUUycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnQ09NUEFSRV9DT01QUkFNRV9VTl9DT0NPJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdmbG93ZXJzJykge1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkRmxvd2VycyhwbGF5ZXIpO1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkQ29jb251dChwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnc2tpcnQnKSB7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRTa2lydChwbGF5ZXIpO1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkQ29jb251dChwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY29zdHVtZScpIHtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZENvY29udXQocGxheWVyKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIudXNlQWN0aW9uKHBsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbnZlcnNhdGlvbiwgSUNvbnZlcnNhdGlvblNjcmlwdCB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvQ29udmVyc2F0aW9uJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbkxpbmUgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL0NvbnZlcnNhdGlvbkxpbmUnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgQmFuZEluU29mYSB9IGZyb20gJy4vQmFuZEluU29mYSc7XG5cbmNvbnN0IHNjcmlwdDogSUNvbnZlcnNhdGlvblNjcmlwdCA9IHtcbiAgICAnaW5pdGlhbCc6IFtcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ1JFQURZX1RPX1BMQVknLCAnTElTVF9PRl9QUk9CTEVNUycsIHNheVByb2JsZW1zSW50cm8pLFxuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnSEFWRV9ZT1VfU0VFTl9CSUxJJywgJ2luaXRpYWwnLCBzYXlCaWxpU2l0dWF0aW9uKSxcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ1RBTEtfVE9fWU9VX0xBVEVSJywgJ2VuZCcpXG4gICAgXSxcbiAgICAnTElTVF9PRl9QUk9CTEVNUyc6IFtcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ1BST0JMRU1TX0xFVF9NRV9IRUxQJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0lOSVRJQUxfQUZURVJfRklSU1RfVEFMSycsIHNheUxpc3RPZlByb2JsZW1zKSxcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ1BST0JMRU1TX0lfQU1fT1VUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0lOSVRJQUxfQUZURVJfRklSU1RfVEFMSycsIHNheUxpc3RPZlByb2JsZW1zKVxuICAgIF0sXG4gICAgJ0lOSVRJQUxfQUZURVJfRklSU1RfVEFMSyc6IFtcbiAgICAgICAgbmV3IENvbnZlcnNhdGlvbkxpbmUoJ0hPV19JU19CSUxJX0RPSU5HJywgJ0lOSVRJQUxfQUZURVJfRklSU1RfVEFMSycsIHNheUJpbGlTaXR1YXRpb24pLFxuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnTEVUU19GSVhfVEhJU19NRVNTJywgJ2VuZCcpXG4gICAgXSxcbiAgICAnV0VfQVJFX1JFQURZJzogW1xuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnQUxMX1JFQURZX0ZJTkRfQklMSScsICdlbmQnKVxuICAgIF1cbn07XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJzYXRpb25XaXRoQmFuZCBleHRlbmRzIENvbnZlcnNhdGlvbiB7XG5cblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBwcm90ZWN0ZWQgb3RoZXJQZXJzb246IFRoaW5nKSB7XG4gICAgICAgIHN1cGVyKHBsYXllciwgb3RoZXJQZXJzb24pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0U3RhdGUoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllci5nZXRBdHRyKCdUQUxLRURfVE9fQkFORF9BQk9VVF9QUk9CTEVNUycpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXRTdGF0ZUlmUGxheWVyRGVsaXZlcmVkRXZlcnl0aGluZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdpbml0aWFsJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb2FkU2NyaXB0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNjcmlwdCA9IE9iamVjdC5hc3NpZ24oe30sIHNjcmlwdCk7XG4gICAgICAgIGxldCBkaWFsb2dQYXJ0OiBBcnJheTxDb252ZXJzYXRpb25MaW5lPiA9IFtdO1xuICAgICAgICBkaWFsb2dQYXJ0ID0gdGhpcy5zY3JpcHRbJ0lOSVRJQUxfQUZURVJfRklSU1RfVEFMSyddLmNvbmNhdChkaWFsb2dQYXJ0KTtcblxuICAgICAgICB0aGlzLmxvYWRFeHRyYU9wdGlvbnNJbkluaXRpYWxGaXJzdFRhbGsoZGlhbG9nUGFydCk7XG4gICAgICAgIHRoaXMuc2NyaXB0WydJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnXSA9IGRpYWxvZ1BhcnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkRXh0cmFPcHRpb25zSW5Jbml0aWFsRmlyc3RUYWxrKGRpYWxvZ1BhcnQ6IEFycmF5PENvbnZlcnNhdGlvbkxpbmU+KSB7XG4gICAgICAgIHRoaXMuYWRkQ29zdHVtZUxpbmUoZGlhbG9nUGFydCk7XG4gICAgICAgIHRoaXMuYWRkQ2FibGVMaW5lKGRpYWxvZ1BhcnQpO1xuICAgICAgICB0aGlzLmFkZERyaW5rTGluZShkaWFsb2dQYXJ0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZENvc3R1bWVMaW5lKGRpYWxvZ1BhcnQ6IEFycmF5PENvbnZlcnNhdGlvbkxpbmU+KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllci5oYXNDb21wbGV0ZUNvc3R1bWUoKSkge1xuICAgICAgICAgICAgZGlhbG9nUGFydC51bnNoaWZ0KG5ldyBDb252ZXJzYXRpb25MaW5lKFxuICAgICAgICAgICAgICAgICdHT1RfVEhFX0NPU1RVTUUnLFxuICAgICAgICAgICAgICAgICgpID0+IHsgcmV0dXJuIHRoaXMuZ2V0U3RhdGVJZlBsYXllckRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKTsgfSxcbiAgICAgICAgICAgICAgICBzYXlDb3N0dW1lSXNPa1xuICAgICAgICAgICAgKSk7XG4gICAgICAgIH0gZWxzZSBpZighdGhpcy5wbGF5ZXIuZ2V0QXR0cignREVMSVZFUkVEX0NPU1RVTUUnKSkge1xuICAgICAgICAgICAgZGlhbG9nUGFydC51bnNoaWZ0KG5ldyBDb252ZXJzYXRpb25MaW5lKFxuICAgICAgICAgICAgICAgICdXSFlfQ09TVFVNRVMnLFxuICAgICAgICAgICAgICAgICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnLFxuICAgICAgICAgICAgICAgIHNheVdoeUNvc3R1bWVzXG4gICAgICAgICAgICApKTtcbiAgICAgICAgICAgIGRpYWxvZ1BhcnQudW5zaGlmdChuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICAgICAnQVNLX0FCT1VUX0NPU1RVTUUnLFxuICAgICAgICAgICAgICAgICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnLFxuICAgICAgICAgICAgICAgIHRhbGtBYm91dENvc3R1bWVcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRDYWJsZUxpbmUoZGlhbG9nUGFydDogQXJyYXk8Q29udmVyc2F0aW9uTGluZT4pOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmhhc0NhYmxlKCkpIHtcbiAgICAgICAgICAgIGRpYWxvZ1BhcnQudW5zaGlmdChuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICAgICAnRk9VTkRfVEhFX0NBQkxFJyxcbiAgICAgICAgICAgICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmdldFN0YXRlSWZQbGF5ZXJEZWxpdmVyZWRFdmVyeXRoaW5nKCk7IH0sXG4gICAgICAgICAgICAgICAgc2F5Q2FibGVJc09rXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfSBlbHNlIGlmKCF0aGlzLnBsYXllci5nZXRBdHRyKCdERUxJVkVSRURfQ0FCTEUnKSkge1xuICAgICAgICAgICAgZGlhbG9nUGFydC51bnNoaWZ0KG5ldyBDb252ZXJzYXRpb25MaW5lKFxuICAgICAgICAgICAgICAgICdBU0tfQUJPVVRfQ0FCTEUnLFxuICAgICAgICAgICAgICAgICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnLFxuICAgICAgICAgICAgICAgIHRhbGtBYm91dENhYmxlXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkRHJpbmtMaW5lKGRpYWxvZ1BhcnQ6IEFycmF5PENvbnZlcnNhdGlvbkxpbmU+KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllci5oYXNGdW5ueURyaW5rKCkpIHtcbiAgICAgICAgICAgIGRpYWxvZ1BhcnQudW5zaGlmdChuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICAgICAnSEFWRV9BX0RSSU5LX1NBTlRJJyxcbiAgICAgICAgICAgICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmdldFN0YXRlSWZQbGF5ZXJEZWxpdmVyZWRFdmVyeXRoaW5nKCk7IH0sXG4gICAgICAgICAgICAgICAgc2F5RHJpbmtJc09rXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfSBlbHNlIGlmKCF0aGlzLnBsYXllci5nZXRBdHRyKCdERUxJVkVSRURfRFJJTksnKSkge1xuICAgICAgICAgICAgZGlhbG9nUGFydC51bnNoaWZ0KG5ldyBDb252ZXJzYXRpb25MaW5lKFxuICAgICAgICAgICAgICAgICdBU0tfQUJPVVRfU0FOVEknLFxuICAgICAgICAgICAgICAgICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnLFxuICAgICAgICAgICAgICAgIHRhbGtBYm91dFNhbnRpXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3RhdGVJZlBsYXllckRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmRlbGl2ZXJlZEV2ZXJ5dGhpbmcoKSkge1xuICAgICAgICAgICAgcmV0dXJuICdXRV9BUkVfUkVBRFknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICdJTklUSUFMX0FGVEVSX0ZJUlNUX1RBTEsnO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHNheVByb2JsZW1zSW50cm8ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmFuZDogQmFuZEluU29mYSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGJhbmQuc2F5KCdUSEVSRV9BUkVfU09NRV9QUk9CTEVNU18xJywgJ2FuZ2VsJylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnVEhFUkVfQVJFX1NPTUVfUFJPQkxFTVNfMicsICdzYW50aScpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1RIRVJFX0FSRV9TT01FX1BST0JMRU1TXzMnLCAnanVhbicpO1xuICAgICAgICAgICAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzYXlMaXN0T2ZQcm9ibGVtcyhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiYW5kOiBCYW5kSW5Tb2ZhKTogUHJvbWlzZTxhbnk+IHtcbiAgICBwbGF5ZXIuY2hhbmdlQXR0cignVEFMS0VEX1RPX0JBTkRfQUJPVVRfUFJPQkxFTVMnLCB0cnVlKTtcbiAgICByZXR1cm4gYmFuZC5zYXkoJ1dFX0hBVkVfVEhSRUVfUFJPQkxFTVMnLCAnYW5nZWwnKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdGSVJTVF9BTkdFTF9DQUJMRScsICdqdWFuJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnU0VDT05EX0pVQU5fQ09TVFVNRScsICdhbmdlbCcpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1RISVJEX1NBTlRJX1NIWScsICdqdWFuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNheUJpbGlTaXR1YXRpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmFuZDogQmFuZEluU29mYSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGJhbmQuc2F5KCdIRV9JU19PVVRfU01PS0lORycsICdhbmdlbCcpO1xufVxuXG5mdW5jdGlvbiBzYXlDb3N0dW1lSXNPayhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiYW5kOiBCYW5kSW5Tb2ZhKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gYmFuZC5zYXkoJ1RIQVRfSVNfQV9TVFVQSURfQ09TVFVNRScsICdqdWFuJylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnTUlORV9XQVNfV0FZX0JFVFRFUicsICdqdWFuJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdZT1VfQkVUVEVSX1BVVF9JVF9PTicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBiYW5kLmNoYW5nZUF0dHIoJ0hBU19DT1NUVU1FJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5jaGFuZ2VBdHRyKCdERUxJVkVSRURfQ09TVFVNRScsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucmVtb3ZlQ29zdHVtZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ09LX0lfTExfUFVUX0lUX09OJywgJ2p1YW4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gdGFsa0Fib3V0Q29zdHVtZShwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiYW5kOiBCYW5kSW5Tb2ZhKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gYmFuZC5zYXkoJ1dFTExfSV9IQURfQU5fQVdFU09NRV9DT1NUVU1FJywgJ2p1YW4nKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdJVF9XQVNfQ09XQk9ZX0NPU1RVTUUnLCAnanVhbicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1ZJTlRBR0VfUFJFTUlVTV9DT1NUVU1FJywgJ2p1YW4nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdTT19QTEVBU0VfRklORF9NRV9TT01FVEhJTkdfRUxFR0FOVF9JX0NBTl9VU0UnLCAnanVhbicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnU1VSRV9CT1NTJyk7XG4gICAgICAgICAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHRhbGtBYm91dENhYmxlKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJhbmQ6IEJhbmRJblNvZmEpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBiYW5kLnNheSgnSlVTVF9TVEVBTF9PTkUnLCAnanVhbicpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ0lfV09VTERfRE9fSVRfTVlTRUxGJywgJ2p1YW4nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdJU19TT01FSE9XX0RBTkdFUk9VUycsICdhbmdlbCcpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ0lNUExJRVNfTU9WRU1FTlQnLCAnc2FudGknKTtcbiAgICAgICAgICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gdGFsa0Fib3V0U2FudGkocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmFuZDogQmFuZEluU29mYSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGJhbmQuc2F5KCdXRV9ET05UX1JFSEVBUlNFX0VOT1VHSCcsICdzYW50aScpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1dFX0hBVkVOVF9QUkFDVElTRURfU0lOQ0VfMjAxMicsICdzYW50aScpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnWU9VX0FSRV9BX0NPV0FSRF9NQU5fV0VfSEFWRV9DT1NUVU1FUycpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnV0hBVF9DQU5fV0VfRE9fR1VZUycpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1NPTUVfQ1VMVFVSRVNfVVNFRF9EUlVHUycsICdhbmdlbCcpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ05PVF9TQVlJTkdfV0VfU0hPVUxEX1VTRV9USEVNJywgJ2FuZ2VsJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnRFJVR1NfQVJFX0JBRCcsICdqdWFuJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnQU5EX0VYUEVOU0lWRScsICdhbmdlbCcpO1xuICAgICAgICAgICAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzYXlXaHlDb3N0dW1lcyhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiYW5kOiBCYW5kSW5Tb2ZhKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gYmFuZC5zYXkoJ01BTl9ZT1VfU0hPVUxEX0tOT1dfVEhJUycsICdzYW50aScpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ0lUX0lTX0FfTE9OR19USU1FX1RSQURJVElPTl9USEFUX1dFX0FMTF9EUkVTU0VEX1VQJywgJ2p1YW4nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdTT19XRV9TT01FSE9XX0RJU1RSQUNUX1RIRV9BVFRFTlRJT04nLCAnYW5nZWwnKTtcbiAgICAgICAgICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2F5Q2FibGVJc09rKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIsIGJhbmQ6IEJhbmRJblNvZmEpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBiYW5kLnNheSgnSV9BTV9OT1RfR09JTkdfVE9fQVNLX1dIRVJFX1RISVNfQ09NRVNfRlJPTScsICdhbmdlbCcpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ1lPVV9TVE9MRV9JVCcsICdzYW50aScpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBiYW5kLmNoYW5nZUF0dHIoJ0hBU19DQUJMRScsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY2hhbmdlQXR0cignREVMSVZFUkVEX0NBQkxFJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5yZW1vdmVDYWJsZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnTEVUX1NfU0FZX0lfSEFWRV9NWV9TT1VSQ0VTJyk7XG4gICAgICAgICAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNheURyaW5rSXNPayhwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiYW5kOiBCYW5kSW5Tb2ZhKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gcGxheWVyLnBsYXlBbmltYXRpb25PbmNlKCdnaXZlX2dsYXNzJylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5wbGF5U3RhbmRBbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdNTU1fQV9SRUZSRVNISU5HX0JFVkVSQUdFJywgJ3NhbnRpJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnBsYXlBbmltYXRpb25PbmNlKCdzYW50aV9kcmlua2luZycpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLndhaXQoMjAwMCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYW5kLnNheSgnQlVSUCcsICdzYW50aScpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFuZC5zYXkoJ0JBUkVMWV9UQVNURURfTElLRV9EUlVHJywgJ3NhbnRpJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIud2FpdCgyMDAwKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhbmQuc2F5KCdJX0FNX1NUQVRSSU5HX1RPX0ZFRUxfUkVBRFlfVE9fUExBWScsICdzYW50aScpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBiYW5kLmNoYW5nZUF0dHIoJ0hBU19EUklOSycsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY2hhbmdlQXR0cignREVMSVZFUkVEX0RSSU5LJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5yZW1vdmVHbGFzcygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnVEhBVF9TX1RIRV9TUElSSVQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IHNlbGVjdGVkVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2VsZWN0ZWRPYmplY3RzJztcblxuY29uc3QgRlVMTF9GUkFNRSA9IDM7XG5jb25zdCBGTE9XRVJfQU5EX0NPQ09OVVRfRlJBTUUgPSAxO1xuY29uc3QgRkxPV0VSX0FORF9TS0lSVF9GUkFNRSA9IDI7XG5jb25zdCBTS0lSVF9BTkRfQ09DT05VVF9GUkFNRSA9IDA7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdjb3N0dW1lJyxcbiAgICB4OiAxMzcsXG4gICAgeTogMTMwLFxuICAgIHNwcml0ZUlkOiAnQ09TVFVNRV9JTlZfU1BSSVRFJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnQ09TVFVNRV9JTlZfU1BSSVRFJyxcbiAgICBuYW1lOiAnQ09TVFVNRScsXG4gICAgZGlyZWN0bHlJbkludmVudG9yeTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIENvc3R1bWUgZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB1c2VBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX0hBVkVfVE9fUElDS19JVF9VUF9GSVJTVCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY29jb251dCcpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ29jb251dChwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2Zsb3dlcnMnKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEZsb3dlcnMocGxheWVyKTtcbiAgICAgICAgICAgIHNlbGVjdGVkVGhpbmcudGhpbmcuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdza2lydCcpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkU2tpcnQocGxheWVyKTtcbiAgICAgICAgICAgIHNlbGVjdGVkVGhpbmcudGhpbmcuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIudXNlQWN0aW9uKHBsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9va0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzQ29tcGxldGUoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSV9USElOS19NWV9NQVNURVJQSUVDRV9JU19DT01QTEVURScpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnVElNRV9UT19HSVZFX0lUX1RPX0pVQU4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdIQVNfQ09DT05VVCcpICYmIHRoaXMuZ2V0QXR0cignSEFTX0ZMT1dFUlMnKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSV9TSE9VTERfQUREX0FfU0tJUlRfVE9fSVQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdIQVNfQ09DT05VVCcpICYmIHRoaXMuZ2V0QXR0cignSEFTX1NLSVJUJykpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ1NPTUVfRkxPV0VSU19XT1VMRF9CRV9OSUNFJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignSEFTX1NLSVJUJykgJiYgdGhpcy5nZXRBdHRyKCdIQVNfRkxPV0VSUycpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJRl9JX0FERF9TT01FX0JPT0JTX0lUX1dJTExfTE9PS19MSUtFX0FfSEFXQUlJQU5fRFJFU1MnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEZyYW1lRm9ySW52ZW50b3J5KCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmlzQ29tcGxldGUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIEZVTExfRlJBTUU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignSEFTX0NPQ09OVVQnKSAmJiB0aGlzLmdldEF0dHIoJ0hBU19GTE9XRVJTJykpIHtcbiAgICAgICAgICAgIHJldHVybiBGTE9XRVJfQU5EX0NPQ09OVVRfRlJBTUU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignSEFTX0NPQ09OVVQnKSAmJiB0aGlzLmdldEF0dHIoJ0hBU19TS0lSVCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gU0tJUlRfQU5EX0NPQ09OVVRfRlJBTUU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignSEFTX1NLSVJUJykgJiYgdGhpcy5nZXRBdHRyKCdIQVNfRkxPV0VSUycpKSB7XG4gICAgICAgICAgICByZXR1cm4gRkxPV0VSX0FORF9TS0lSVF9GUkFNRTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRlVMTF9GUkFNRTtcbiAgICB9XG5cbiAgICBhZGRDb2NvbnV0KHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VBdHRyKCdIQVNfQ09DT05VVCcsIHRydWUpO1xuICAgICAgICB0aGlzLmluZm9ybVBsYXllcklmQ29tcGxldGUocGxheWVyKTtcbiAgICB9XG5cbiAgICBhZGRGbG93ZXJzKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VBdHRyKCdIQVNfRkxPV0VSUycsIHRydWUpO1xuICAgICAgICB0aGlzLmluZm9ybVBsYXllcklmQ29tcGxldGUocGxheWVyKTtcbiAgICB9XG5cbiAgICBhZGRTa2lydChwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlQXR0cignSEFTX1NLSVJUJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuaW5mb3JtUGxheWVySWZDb21wbGV0ZShwbGF5ZXIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNDb21wbGV0ZSgpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cignSEFTX0NPQ09OVVQnKSAmJiB0aGlzLmdldEF0dHIoJ0hBU19GTE9XRVJTJykgJiYgdGhpcy5nZXRBdHRyKCdIQVNfU0tJUlQnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluZm9ybVBsYXllcklmQ29tcGxldGUocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZih0aGlzLmlzQ29tcGxldGUoKSkge1xuICAgICAgICAgICAgcGxheWVyLmNoYW5nZUF0dHIoJ0NPU1RVTUVfQ09NUExFVEUnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgR2xhc3MgfSBmcm9tICcuL0dsYXNzJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2R1c3QnLFxuICAgIHg6IDI0NyxcbiAgICB5OiAxMjgsXG4gICAgc3ByaXRlSWQ6ICdEVVNUJyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnRFVTVF9JTlYnLFxuICAgIG5hbWU6ICdTVVNQSUNJT1VTX0RVU1QnLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiAyNDgsXG4gICAgICAgIHk6IDE3N1xuICAgIH0sXG4gICAgcGlja2FibGU6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBEdXN0IGV4dGVuZHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX0JFVF9USElTX0RVU1RfQ0FOX01BS0VfU09NRUJPRFlfTEVTU19TSFknKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ1RIQVRfU19TT01FX0hJR0hMWV9TVVNQSUNJT1VTX1dISVRFX1BPV0RFUicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVzZUFjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfSEFWRV9UT19QSUNLX0lUX1VQX0ZJUlNUJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdnbGFzcycpIHtcbiAgICAgICAgICAgIGxldCBnbGFzcyA9IDxHbGFzcz4gc2VsZWN0ZWRUaGluZy50aGluZztcbiAgICAgICAgICAgIGdsYXNzLmZpbGxXaXRoRHVzdChwbGF5ZXIsIHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjYW4nKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX1NIT1VMRF9QUk9CQUJMWV9NSVhfSVRfSU5fQV9HTEFTUycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIudXNlQWN0aW9uKHBsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuXG5sZXQgb3B0aW9ucyA9IHtcbiAgICBpZDogJ2ZseV9jYXNlJyxcbiAgICB4OiA2MixcbiAgICB5OiAxOTgsXG4gICAgc3ByaXRlSWQ6ICdGTFlfQ0FTRScsXG4gICAgbmFtZTogJ2ZseSBjYXNlJyxcbiAgICBqdXN0RGVjb3JhdGlvbjogdHJ1ZSxcbiAgICBpc0ZvcmVncm91bmQ6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBGbHlDYXNlIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBhY3RpdmVJbnZlbnRvcnkgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvQWN0aXZlSW52ZW50b3J5LnNpbmdsZXRvbic7XG5pbXBvcnQgeyBDYW4gfSBmcm9tICcuL0Nhbic7XG5cbmNvbnN0IE5PUk1BTF9GUkFNRSA9IDA7XG5jb25zdCBQT1dERVJfRlJBTUUgPSAxO1xuY29uc3QgRklMTEVEX0ZSQU1FID0gMjtcbmNvbnN0IFBPV0RFUl9GSUxMRURfRlJBTUUgPSAzO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiAnZ2xhc3MnLFxuICAgIHg6IDY0MSxcbiAgICB5OiAxMjgsXG4gICAgc3ByaXRlSWQ6ICdHTEFTUycsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ0dMQVNTX0lOVl9TUFJJVEUnLFxuICAgIG5hbWU6ICdHTEFTUycsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDYzOSxcbiAgICAgICAgeTogMTg5XG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIEdsYXNzIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5JbnZlbnRvcnkoKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSV9IQVZFX1RPX1BJQ0tfSVRfVVBfRklSU1QnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2R1c3QnKSB7XG4gICAgICAgICAgICBsZXQgZHVzdCA9IHNlbGVjdGVkVGhpbmcudGhpbmc7XG4gICAgICAgICAgICB0aGlzLmZpbGxXaXRoRHVzdChwbGF5ZXIsIGR1c3QpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjYW4nKSB7XG4gICAgICAgICAgICBsZXQgY2FuID0gPENhbj4gc2VsZWN0ZWRUaGluZy50aGluZztcbiAgICAgICAgICAgIHRoaXMuZmlsbFdpdGhEcmluayhwbGF5ZXIsIGNhbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdXBlci51c2VBY3Rpb24ocGxheWVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdSRUFMTFlfVVNFRlVMX1RPX1BVVF9MSVFVSURTX0lOU0lERScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyLnNheSgnSVRfSVNfSU5ERUVEX0FfR0xBU1MnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxXaXRoRHVzdChwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBkdXN0OiBUaGluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ1BPV0RFUl9JTlNJREUnLCB0cnVlKTtcbiAgICAgICAgZHVzdC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZpbGxXaXRoRHJpbmsocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgY2FuOiBDYW4pIHtcbiAgICAgICAgaWYgKCF0aGlzLmdldEF0dHIoJ0ZJTExFRCcpKSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ0ZJTExFRCcsIHRydWUpO1xuICAgICAgICAgICAgYWN0aXZlSW52ZW50b3J5LnJlZnJlc2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lUX0lTX0FMUkVBRFlfRlVMTCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNGdW5ueSgpOiBCb29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cignRklMTEVEJykgJiYgdGhpcy5nZXRBdHRyKCdQT1dERVJfSU5TSURFJyk7XG4gICAgfVxuXG4gICAgZ2V0RnJhbWVGb3JJbnZlbnRvcnkoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignRklMTEVEJykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ1BPV0RFUl9JTlNJREUnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQT1dERVJfRklMTEVEX0ZSQU1FO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRklMTEVEX0ZSQU1FO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0QXR0cignUE9XREVSX0lOU0lERScpKSB7XG4gICAgICAgICAgICByZXR1cm4gUE9XREVSX0ZSQU1FO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE5PUk1BTF9GUkFNRTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5cbmxldCBvcHRpb25zID0ge1xuICAgIGlkOiAnbGFtcF9sZWZ0JyxcbiAgICB4OiAxMzYsXG4gICAgeTogMjksXG4gICAgc3ByaXRlSWQ6ICdMQU1QJyxcbiAgICBuYW1lOiAnbGFtcCBsZWZ0JyxcbiAgICBqdXN0RGVjb3JhdGlvbjogdHJ1ZSxcbiAgICBpc0ZvcmVncm91bmQ6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBMYW1wTGVmdCBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdsYW1wX3JpZ2h0JyxcbiAgICB4OiA0NTAsXG4gICAgeTogMjksXG4gICAgc3ByaXRlSWQ6ICdMQU1QJyxcbiAgICBuYW1lOiAnbGFtcCByaWdodCcsXG4gICAganVzdERlY29yYXRpb246IHRydWUsXG4gICAgaXNGb3JlZ3JvdW5kOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgTGFtcFJpZ2h0IGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBCcm9vbSB9IGZyb20gJy4vQnJvb20nO1xuaW1wb3J0IHsgcmFuZG9tVGV4dCB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9SYW5kb21UZXh0JztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ3NjaXNzb3JzJyxcbiAgICB4OiAyOTEsXG4gICAgeTogMTI4LFxuICAgIHNwcml0ZUlkOiAnU0NJU1NPUlMnLFxuICAgIGludmVudG9yeUltYWdlSWQ6ICdTQ0lTU09SU19JTlYnLFxuICAgIG5hbWU6ICdTQ0lTU09SUycsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDMwMCxcbiAgICAgICAgeTogMTgwXG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIFNjaXNzb3JzIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbkludmVudG9yeSgpKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdTSElOWV9BTkRfU0hBUlAnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkocmFuZG9tVGV4dChcbiAgICAgICAgICAgICAgICAnU0hJTllfQU5EX1NIQVJQJyxcbiAgICAgICAgICAgICAgICAnTk9UX1NBRkVfSEFWSU5HX1NDSVNTT1JTX0FST1VORF9NVVNJQ0lBTlMnXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCB1c2VBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcikge1xuICAgICAgICBsZXQgb3RoZXJPYmplY3QgPSBzZWxlY3RlZFRoaW5nLnRoaW5nO1xuICAgICAgICBpZiAob3RoZXJPYmplY3QuaWQgPT09ICdicm9vbScpIHtcbiAgICAgICAgICAgIGxldCBicm9vbSA9IDxCcm9vbT4gb3RoZXJPYmplY3Q7XG4gICAgICAgICAgICBicm9vbS5jdXRXaXRoU2Npc3NvcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1cGVyLnVzZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRG9jdG9ydGlsbGFQbGF5ZXIgfSBmcm9tICcuLi9Eb2N0b3J0aWxsYVBsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBjb3N0dW1lQ3JlYXRvciB9IGZyb20gJy4uL3V0aWxzL0Nvc3R1bWVDcmVhdG9yJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogJ3NraXJ0JyxcbiAgICBzcHJpdGVJZDogJ3NraXJ0JyxcbiAgICBpbnZlbnRvcnlJbWFnZUlkOiAnU0tJUlQnLFxuICAgIG5hbWU6ICdTS0lSVCcsXG4gICAgZGlyZWN0bHlJbkludmVudG9yeTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIFNraXJ0IGV4dGVuZHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgcGxheWVyLnNheSgnWUVQX0lfQ09VTERfQlVJTERfQV9DT1NUVU1FX1dJVEhfVEhJUycpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB1c2VBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2Zsb3dlcnMnKSB7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRTa2lydChwbGF5ZXIpO1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkRmxvd2VycyhwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY29jb251dCcpIHtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZFNraXJ0KHBsYXllcik7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRDb2NvbnV0KHBsYXllcik7XG4gICAgICAgICAgICBzZWxlY3RlZFRoaW5nLnRoaW5nLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjb3N0dW1lJykge1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkU2tpcnQocGxheWVyKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIudXNlQWN0aW9uKHBsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1BsYXllcic7XG5pbXBvcnQgeyBzZWxlY3RlZFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NlbGVjdGVkT2JqZWN0cyc7XG5pbXBvcnQgeyBTcGVlY2hCdWJibGUgfSBmcm9tICcuLi8uLi9lbmdpbmUvdWkvU3BlZWNoQnViYmxlJztcbmltcG9ydCB7IENhbiB9IGZyb20gJy4vQ2FuJztcbmltcG9ydCB7IHVpQmxvY2tlciB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9VSUJsb2NrZXIuc2luZ2xldG9uJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuXG5jb25zdCBOT1JNQUxfRlJBTUUgPSAwO1xuY29uc3QgR1JFQVNFRF9GUkFNRSA9IDE7XG5jb25zdCBHUkVBU0VEX0FORF9QVVNIRURfRlJBTUUgPSAyO1xuXG5leHBvcnQgY2xhc3MgVmVuZGluZ01hY2hpbmUgZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBwcml2YXRlIHNwZWVjaEJ1YmJsZTogU3BlZWNoQnViYmxlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgaWQ6ICd2ZW5kaW5nJyxcbiAgICAgICAgICAgIHg6IDE1NSxcbiAgICAgICAgICAgIHk6IDk4LFxuICAgICAgICAgICAgc3ByaXRlSWQ6ICdWRU5ESU5HX01BQ0hJTkVfU1BSSVRFJyxcbiAgICAgICAgICAgIG5hbWU6ICdWRU5ESU5HX01BQ0hJTkUnLFxuICAgICAgICAgICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMTY3LFxuICAgICAgICAgICAgICAgIHk6IDE3OFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpcmVjdGlvblRvTG9vazogRGlyZWN0aW9ucy5VUFxuICAgICAgICB9O1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5zcGVlY2hCdWJibGUgPSBuZXcgU3BlZWNoQnViYmxlKHtcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgZm9yZWdyb3VuZFRleHRTdHlsZTogJ0ZPTlRfMzJfQkxBQ0snLFxuICAgICAgICAgICAgc2hhZG93VGV4dFN0eWxlOiAnRk9OVF8zMl9QVVJQTEUnXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwdXNoQWN0aW9uKHBsYXllcjogUGxheWVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ1BVU0hFRCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnSV9BTFJFQURZX1BVU0hFRF9JVCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0QXR0cignR1JFQVNFRCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGxheWVyLmdvVG9UaGluZyh0aGlzKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnNheSgnQVJHSCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ1BVU0hFRCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBsYXllci5nb1RvVGhpbmcodGhpcylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdUSEVfRkxPT1JfSVNfU1RJQ0tZJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIuc2F5KCdJRl9JX0NPVUxEX1BVVF9HUkVBU0VfQkVMT1cnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCB1c2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdiYWNvbicpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JlYXNlV2l0aEJhY29uKHBsYXllcik7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUaGluZy50aGluZy5pZCA9PT0gJ2NvaW4nKSB7XG4gICAgICAgICAgICB0aGlzLmdldENhbihwbGF5ZXIsIHNlbGVjdGVkVGhpbmcudGhpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdib2NhZGlsbG8nKSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX1NIT1VMRF9UQUtFX1RIRV9CQUNPTl9PVVRfT0ZfVEhFX0JSRUFEX0ZJUlNUJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdJX0RPTlRfS05PV19IT1dfVE9fVVNFX1RIQVRfV0lUSF9WRU5ESU5HX01BQ0hJTkUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2F5KHRleHQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGVlY2hCdWJibGUuc2F5KHRleHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ3JlYXNlV2l0aEJhY29uKHBsYXllcjogUGxheWVyKTogdm9pZCB7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ0dSRUFTRUQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc2F5KCdOSUNFX0lUX1dJTExfU0xJREVfUkVBTExZX1dFTExfTk9XJyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENhbihwbGF5ZXI6IFBsYXllciwgY29pbjogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdWlCbG9ja2VyLmJsb2NrKCk7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb2luLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zYXkoJ0NMT05LJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBDYW4oKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc2F5KCdXSVNFX1BVUkNIQVNFJyk7XG4gICAgICAgICAgICAgICAgdWlCbG9ja2VyLnVuYmxvY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb29rQWN0aW9uKHBsYXllcjogUGxheWVyKTogdm9pZCAge1xuICAgICAgICBpZighdGhpcy5nZXRBdHRyKCdHUkVBU0VEJykpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ1RIRVJFX0lTX0FfQ0FCTEVfU1RVQ0tfQkVISU5EX1RIRV9NQUNISU5FJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdQVVNIRUQnKSkge1xuICAgICAgICAgICAgICAgIHBsYXllci5zYXkoJ1RISVNfSVNfWU9VUl9TVEFOREFSRF9WRU5ESU5HX01BQ0hJTkUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnNheSgnTk9XX0lfQ09VTERfUFVTSF9USElTX01BQ0hJTkUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvblN0YXRlQ2hhbmdlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuc3ByaXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdHUkVBU0VEJykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldEF0dHIoJ1BVU0hFRCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWUgPSBHUkVBU0VEX0FORF9QVVNIRURfRlJBTUU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lID0gR1JFQVNFRF9GUkFNRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lID0gTk9STUFMX0ZSQU1FO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IERvb3IgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL0Rvb3InO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgcmFuZG9tVGV4dCB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9SYW5kb21UZXh0JztcblxuZXhwb3J0IGNsYXNzIEJhY2t5YXJkRG9vclRvQmFja3N0YWdlIGV4dGVuZHMgRG9vciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgaWQ6ICdCQUNLWUFSRF9UT19CQUNLU1RBR0UnLFxuICAgICAgICAgICAgbmFtZTogJ0RPT1JfVE9fQkFDS1NUQUdFJyxcbiAgICAgICAgICAgIHg6IDM2LFxuICAgICAgICAgICAgeTogMTE1LFxuICAgICAgICAgICAgc3ByaXRlSWQ6ICdCQUNLWUFSRF9ET09SX1RPX0JBQ0tTVEFHRV9TUFJJVEUnLFxuICAgICAgICAgICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogNzgsXG4gICAgICAgICAgICAgICAgeTogMjA3XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzdGluYXRpb25TY2VuZUlkOiAnQkFDS1NUQUdFJyxcbiAgICAgICAgICAgIHJlbGF0ZWREb29ySWQ6ICdCQUNLU1RBR0VfVE9fQkFDS1lBUkQnXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdPUEVOJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnQkFDS1NUQUdFJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnRE9PUl9UT19CQUNLU1RBR0UnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRha2VBY3Rpb24ocGxheWVyOiBQbGF5ZXIpOiB2b2lkICB7XG4gICAgICAgIHBsYXllci5zYXkoJ0NBTk5PVF9QSUNLX0FfRE9PUl9VUCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzcGVha0FjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheShyYW5kb21UZXh0KFxuICAgICAgICAgICAgJ0hJX0RPT1JfSE9XX0FSRV9ZT1VfVE9EQVknLFxuICAgICAgICAgICAgJ1NIRV9JU19TSFlfRE9FU05UX1dBTlRfVE9fVEFMS19UT19NRScsXG4gICAgICAgICAgICAnSV9IQVZFX0JFVFRFUl9USElOR1NfVE9fRE9fVEhBTl9UQUxLSU5HJ1xuICAgICAgICApKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9va0FjdGlvbihwbGF5ZXI6IFBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnVEhBVF9TX1RIRV9ET09SX1RPX0dPX0JBQ0tfVE9fVEhFX0JBQ0tTVEFHRScpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTY2VuZSB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvU2NlbmUnO1xuaW1wb3J0IHsgQmFja3lhcmREb29yVG9CYWNrc3RhZ2UgfSBmcm9tICcuL0JhY2t5YXJkRG9vclRvQmFja3N0YWdlJztcbmltcG9ydCB7IEZsb3dlcnMgfSBmcm9tICcuL0Zsb3dlcnMnO1xuaW1wb3J0IHsgQmlsaSB9IGZyb20gJy4vQmlsaSc7XG5pbXBvcnQgeyBMYW1wQmFja3lhcmQgfSBmcm9tICcuL0xhbXBCYWNreWFyZCc7XG5pbXBvcnQgeyBNb29uIH0gZnJvbSAnLi9Nb29uJztcbmltcG9ydCB7IFN0YXIgfSBmcm9tICcuL1N0YXInO1xuaW1wb3J0IHsgQ3V0Rmxvd2VycyB9IGZyb20gJy4vQ3V0Rmxvd2Vycyc7XG5pbXBvcnQgeyBCYWxsb29uIH0gZnJvbSAnLi9CYWxsb29uJztcbmltcG9ydCB7IFBvbHlnb24gfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvUG9seWdvbic7XG5pbXBvcnQgeyBJUG9pbnQgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvSW50ZXJmYWNlcyc7XG5cbmNvbnN0IHNjZW5lT3B0aW9ucyA9IHtcbiAgICBpZDogJ0JBQ0tZQVJEJyxcbiAgICBiYWNrZ3JvdW5kSWQ6ICdCQUNLWUFSRF9CRycsXG4gICAgYm91bmRhcmllc0NvbmZpZzogbmV3IFBvbHlnb24oW1xuICAgICAgICB7eDogNjAsIHk6IDIxNn0sXG4gICAgICAgIHt4OiAxMTcsIHk6IDE3M30sXG4gICAgICAgIHt4OiAyNDMsIHk6IDE3M30sXG4gICAgICAgIHt4OiAyNDMsIHk6IDE5N30sXG4gICAgICAgIHt4OiA0MTUsIHk6IDE5N30sXG4gICAgICAgIHt4OiA0MTUsIHk6IDIxNn1cbiAgICBdKSxcbiAgICB0aGluZ3M6IFtcbiAgICAgICAgbmV3IEJhY2t5YXJkRG9vclRvQmFja3N0YWdlKCksXG4gICAgICAgIG5ldyBDdXRGbG93ZXJzKCksXG4gICAgICAgIG5ldyBGbG93ZXJzKCksXG4gICAgICAgIG5ldyBCYWxsb29uKCksXG4gICAgICAgIG5ldyBCaWxpKCksXG4gICAgICAgIG5ldyBMYW1wQmFja3lhcmQoKSxcbiAgICAgICAgbmV3IE1vb24oKVxuICAgIF1cbn07XG5cblxuY29uc3QgU1RBUl9OVU1CRVIgPSA3MDtcbmNvbnN0IFNLWV9TVEFSVCA6IElQb2ludCA9IHsgeDogMTA4LCB5OiAxfTtcbmNvbnN0IFNLWV9FTkQgOiBJUG9pbnQgPSB7IHg6IDQzNiwgeTogNzR9O1xuY29uc3QgTUlOX09QQUNJVFkgPSAwLjI7XG5jb25zdCBNQVhfT1BBQ0lUWSA9IDAuODtcblxuZXhwb3J0IGNsYXNzIEJhY2t5YXJkU2NlbmUgZXh0ZW5kcyBTY2VuZSB7XG4gICAgcHJpdmF0ZSBzdGFyczogQXJyYXk8U3Rhcj47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoc2NlbmVPcHRpb25zKTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgc3VwZXIuc2hvdygpO1xuICAgICAgICB0aGlzLmNyZWF0ZVNreSgpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5kZXN0cm95U2t5KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTa3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhcnMgPSBbXTtcblxuICAgICAgICBmb3IobGV0IGk9MDsgaTxTVEFSX05VTUJFUjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV3U3RhciA9IG5ldyBTdGFyKHtcbiAgICAgICAgICAgICAgICB4OiBTS1lfU1RBUlQueCArIE1hdGgucmFuZG9tKCkqKFNLWV9FTkQueCAtIFNLWV9TVEFSVC54KSxcbiAgICAgICAgICAgICAgICB5OiBTS1lfU1RBUlQueSArIE1hdGgucmFuZG9tKCkqKFNLWV9FTkQueSAtIFNLWV9TVEFSVC55KSxcbiAgICAgICAgICAgICAgICBpZDogJ3N0YXJfJyArIGksXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogTUlOX09QQUNJVFkgKyBNYXRoLnJhbmRvbSgpKihNQVhfT1BBQ0lUWSAtIE1JTl9PUEFDSVRZKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdTdGFyLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnMucHVzaChuZXdTdGFyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVzdHJveVNreSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGFycyA9IHRoaXMuc3RhcnMgfHwgW107XG4gICAgICAgIHRoaXMuc3RhcnMuZm9yRWFjaChzdGFyID0+IHN0YXIuZGVzdHJveSgpKTtcbiAgICAgICAgdGhpcy5zdGFycyA9IFtdO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvVGhpbmcnO1xuaW1wb3J0IHsgRGlyZWN0aW9ucyB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9EaXJlY3Rpb25zJztcbmltcG9ydCB7IHN0eWxlIH0gZnJvbSAnLi4vLi4vZW5naW5lL3VpL1N0eWxlJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgc2NlbmVzIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1NjZW5lcy5zaW5nbGV0b24nO1xuaW1wb3J0IHsgQmlsaSB9IGZyb20gJy4vQmlsaSc7XG5pbXBvcnQgeyB1aUJsb2NrZXIgfSBmcm9tICcuLi8uLi9lbmdpbmUvdWkvVUlCbG9ja2VyLnNpbmdsZXRvbic7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi4vLi4vZW5naW5lL3N0YXRlL1BoYXNlckdhbWUuc2luZ2xldG9uJztcbmltcG9ydCB7IGFuYWx5dGljcyB9IGZyb20gJy4uLy4uL2VuZ2luZS91dGlscy9hbmFseXRpY3MnO1xuXG5sZXQgc3ByaXRlT3B0aW9ucyA9IG5ldyBNYXAoKTtcblxuc3ByaXRlT3B0aW9ucy5zZXQoJ3F1aWV0JywgeyBmcmFtZXM6IFswXX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ2Zsb2F0aW5nJywgeyBmcmFtZXM6IFswLCAxLCAyLCAzLCA0LCA1XX0pO1xuc3ByaXRlT3B0aW9ucy5zZXQoJ2V4cGxvZGUnLCB7IGZyYW1lczogWzYsIDcsIDgsIDldfSk7XG5jb25zdCBFWFBMT0RFRF9GUkFNRSA9IDk7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdiYWxsb29uJyxcbiAgICB4OiAyNTIsXG4gICAgeTogOTYsXG4gICAgc3ByaXRlSWQ6ICdCQUxMT09OX1NQUklURScsXG4gICAgbmFtZTogJ0JBTExPT04nLFxuICAgIGdvVG9Qb3NpdGlvbjoge1xuICAgICAgICB4OiAyMzksXG4gICAgICAgIHk6IDE4NVxuICAgIH0sXG4gICAgZGlyZWN0aW9uVG9Mb29rOiBEaXJlY3Rpb25zLlJJR0hULFxuICAgIHNwcml0ZU9wdGlvbnM6IHNwcml0ZU9wdGlvbnMsXG4gICAgYW5pbWF0aW9uU3BlZWQ6IHN0eWxlLkRFRkFVTFRfQU5JTUFUSU9OX1NQRUVEXG59O1xuXG5jb25zdCBNSU5fVElNRV9GT1JfQU5JTUFUSU9OID0gMzAwO1xuY29uc3QgTUFYX1RJTUVfRk9SX0FOSU1BVElPTiA9IDUwMDA7XG5cbmV4cG9ydCBjbGFzcyBCYWxsb29uIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBsYXN0VGltZW91dDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHNob3coKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnNob3coKTtcbiAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uU29tZXRpbWUoKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0b3BFdmVyeXRoaW5nKCk7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdzY2lzc29ycycpIHtcbiAgICAgICAgICAgIGxldCBiaWxpID0gPEJpbGk+IHNjZW5lcy5nZXRTY2VuZUJ5SWQoJ0JBQ0tZQVJEJykuZ2V0VGhpbmdCeUlkKCdiaWxpJyk7XG4gICAgICAgICAgICBpZihiaWxpLmdldEF0dHIoJ0RSVU5LJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cGxvZGVCYWxsb29uKHBsYXllciwgYmlsaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBsYXllci5zYXkoJ0hFX0lTX0JFSU5HX0dPT0RfRk9SX05PV19OT19ORUVEX1RPX0VYUExPREVfSVQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1cGVyLnVzZUFjdGlvbihwbGF5ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBwbGF5ZXIuc2F5KCdUSEFUX0lTX0FfSFVHRV9CQUxMT09OX1FVSVRFX1NDQVJZX0lGX0lUX0VYUExPREVTJyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRha2VBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQgIHtcbiAgICAgICAgcGxheWVyLnNheSgnTk9QRV9JX0RPTlRfV0FOVF9UT19UQUtFX0JJTElTX0JBTExPT04nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBsYXlBbmltYXRpb25Tb21ldGltZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmdldEF0dHIoJ0VYUExPREVEJykpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUFuaW1hdGlvbigncXVpZXQnKTtcbiAgICAgICAgICAgIHRoaXMubGFzdFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBbmltYXRpb25PbmNlKCdmbG9hdGluZycpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlBbmltYXRpb25Tb21ldGltZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcy5nZXRUaW1lRm9yTmV4dEFuaW1hdGlvbigpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGltZUZvck5leHRBbmltYXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1JTl9USU1FX0ZPUl9BTklNQVRJT04gKyBNYXRoLnJhbmRvbSgpKihNQVhfVElNRV9GT1JfQU5JTUFUSU9OIC0gTUlOX1RJTUVfRk9SX0FOSU1BVElPTik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBleHBsb2RlQmFsbG9vbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBiaWxpOiBCaWxpKTogdm9pZCB7XG4gICAgICAgIGFuYWx5dGljcy5zZW5kRXZlbnQoJ2dhbWUnLCAnZXhwbG9kZV9iYWxsb29uJyk7XG4gICAgICAgIGFuYWx5dGljcy5zZW5kRXZlbnQoJ2dhbWUnLCAnZW5kX2dhbWUnKTtcbiAgICAgICAgdWlCbG9ja2VyLmJsb2NrKCk7XG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnBsYXlBbmltYXRpb25PbmNlKCdwaWVyY2VfYmFsbG9vbicpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUF0dHIoJ0VYUExPREVEJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wRXZlcnl0aGluZygpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXlBbmltYXRpb25PbmNlKCdleHBsb2RlJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhwbG9kZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBiaWxpLnNheSgnSV9BTV9BV0FLRScpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmlsaS5zYXkoJ0lfQU1fTk9UX0RSVU5LX0FOWU1PUkUnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbGkuc2F5KCdXRV9DQU5fUExBWV9USEVfQ09OQ0VSVF9OT1cnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5tb3ZlVG8oeyB4OiAxODEsIHk6IDIxMn0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIubG9va0F0KERpcmVjdGlvbnMuRE9XTik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1NPX1RISVNfSVNfVEhFX0VORF9GT0xLUycpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnV0VfTEFVR0hFRCcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnV0VfQ1JJRUQnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ0FORF9XRV9MRUFSTkVEJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXIud2FpdCgxMDAwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ1RIQU5LU19GT1JfSEVMUElOR19NRV9JTl9USElTX0FEVkVOVFVSRScpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyLnNheSgnU0VFX1lPVV9TT09OJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFuYWx5dGljcy5zZW5kRXZlbnQoJ2dhbWUnLCAnZW5kX2dhbWUnKTtcbiAgICAgICAgICAgICAgICB1aUJsb2NrZXIudW5ibG9jaygpO1xuICAgICAgICAgICAgICAgIHBoYXNlckdhbWUudmFsdWUuc3RhdGUuc3RhcnQoJ2NyZWRpdHMnKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXhwbG9kZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWUgPSBFWFBMT0RFRF9GUkFNRTtcbiAgICAgICAgdGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5zdG9wKCk7XG4gICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lID0gRVhQTE9ERURfRlJBTUU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdG9wRXZlcnl0aGluZygpOiB2b2lkIHtcbiAgICAgICBcbiAgICAgICAgaWYodGhpcy5sYXN0VGltZW91dCkge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmxhc3RUaW1lb3V0KTtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLnNwcml0ZS5hbmltYXRpb25zLmN1cnJlbnRBbmltKSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5hbmltYXRpb25zLmN1cnJlbnRBbmltLnN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNwcml0ZS5hbmltYXRpb25zLnN0b3AoKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcbmltcG9ydCB7IFNwZWVjaEJ1YmJsZSB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9TcGVlY2hCdWJibGUnO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uV2l0aEJpbGkgfSBmcm9tICcuL0NvbnZlcnNhdGlvbldpdGhCaWxpJztcbmltcG9ydCB7IERpcmVjdGlvbnMgfSBmcm9tICcuLi8uLi9lbmdpbmUvdXRpbHMvRGlyZWN0aW9ucyc7XG5pbXBvcnQgeyBzdHlsZSB9IGZyb20gJy4uLy4uL2VuZ2luZS91aS9TdHlsZSc7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuaW1wb3J0IHsgYW5hbHl0aWNzIH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL2FuYWx5dGljcyc7XG5cbmxldCBzcHJpdGVPcHRpb25zID0gbmV3IE1hcCgpO1xuXG5zcHJpdGVPcHRpb25zLnNldCgncXVpZXQnLCB7IGZyYW1lczogWzAsIDEsIDIsIDMsIDQsIDVdfSk7XG5zcHJpdGVPcHRpb25zLnNldCgnc21va2luZycsIHsgZnJhbWVzOiBbNiwgNywgOCwgOSwgMTAsIDExLCAxMl19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCdkcmlua2luZycsIHsgZnJhbWVzOiBbMTMsIDE0LCAxNSwgMTYsIDE3LCAxOF19KTtcbnNwcml0ZU9wdGlvbnMuc2V0KCd0YWxraW5nJywgeyBmcmFtZXM6IFsxOSwgMjAsIDIxLCAyMiwgMjNdfSk7XG5cbmxldCBvcHRpb25zID0ge1xuICAgIGlkOiAnYmlsaScsXG4gICAgeDogMjY1LFxuICAgIHk6IDEyMSxcbiAgICBzcHJpdGVJZDogJ0JJTElfU1BSSVRFJyxcbiAgICBuYW1lOiAnQklMSScsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDIzOSxcbiAgICAgICAgeTogMTg1XG4gICAgfSxcbiAgICBkaXJlY3Rpb25Ub0xvb2s6IERpcmVjdGlvbnMuUklHSFQsXG4gICAgc3ByaXRlT3B0aW9uczogc3ByaXRlT3B0aW9ucyxcbiAgICBhbmltYXRpb25TcGVlZDogc3R5bGUuREVGQVVMVF9BTklNQVRJT05fU1BFRURcbn07XG5cbmNvbnN0IE1JTl9USU1FX0ZPUl9BTklNQVRJT04gPSAxMDAwO1xuY29uc3QgTUFYX1RJTUVfRk9SX0FOSU1BVElPTiA9IDUwMDA7XG5cbmV4cG9ydCBjbGFzcyBCaWxpIGV4dGVuZHMgVGhpbmcge1xuXG4gICAgcHJpdmF0ZSBzcGVlY2hCdWJibGU6IFNwZWVjaEJ1YmJsZTtcbiAgICBwcml2YXRlIGlzVGFsa2luZzogQm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgY3VycmVudFRpbWVvdXQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5zcGVlY2hCdWJibGUgPSBuZXcgU3BlZWNoQnViYmxlKHtcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgZm9yZWdyb3VuZFRleHRTdHlsZTogJ0ZPTlRfMzJfWUVMTE9XJyxcbiAgICAgICAgICAgIHNoYWRvd1RleHRTdHlsZTogJ0ZPTlRfMzJfQkxBQ0snXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICBpZiAodGhpcy5nZXRBdHRyKCdEUlVOSycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ0RSVU5LX0JJTEknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICdCSUxJJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBsb29rQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cignRFJVTksnKSkge1xuICAgICAgICAgICAgcGxheWVyLnNheShyYW5kb21UZXh0KFxuICAgICAgICAgICAgICAgICdIRV9JU19EUlVOS19BU19BX1NLVU5LJyxcbiAgICAgICAgICAgICAgICAnUFJPQkFCTFlfSUZfSV9TQ0FSRV9ISU1fSEVfV0lMTF9XQUtFX1VQJyxcbiAgICAgICAgICAgICAgICAnSV9IQVZFX1RPX0ZJTkRfQV9XQVlfVE9fU09CRVJfSElNX1VQJ1xuICAgICAgICAgICAgKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KHJhbmRvbVRleHQoXG4gICAgICAgICAgICAgICAgJ0hFX0lTX0RSSU5LSU5HX0xJS0VfQV9NQU5JQUMnLFxuICAgICAgICAgICAgICAgICdBTExfSU5fQUxMX0hFX0lTX0FfR09PRF9HVVknLFxuICAgICAgICAgICAgICAgICdOSUNFX0NPU1RVTUVfSEVfTUFERSdcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzcGVha0FjdGlvbihwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMuZ2V0QXR0cignRFJVTksnKSkge1xuICAgICAgICAgICAgcGxheWVyLmNoYW5nZUF0dHIoJ1RBTEtFRF9UT19EUlVOS19CSUxJJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHBsYXllci5nb1RvVGhpbmcodGhpcykudGhlbihcbiAgICAgICAgICAgICgpID0+IG5ldyBDb252ZXJzYXRpb25XaXRoQmlsaShwbGF5ZXIsIHRoaXMpXG4gICAgICAgICk7XG4gICAgICAgIGFuYWx5dGljcy5zZW5kRXZlbnQoJ2dhbWUnLCAndGFsa190b19iaWxpJyk7XG4gICAgfVxuXG4gICAgc2F5KHRleHQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLmlzVGFsa2luZyA9IHRydWU7XG4gICAgICAgIHRoaXMuZGVzdHJveUN1cnJlbnRUaW1lb3V0KCk7XG4gICAgICAgIHRoaXMucGxheUFuaW1hdGlvbigndGFsa2luZycpO1xuICAgICAgICByZXR1cm4gdGhpcy5zcGVlY2hCdWJibGUuc2F5KHRleHQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc1RhbGtpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucGxheUFuaW1hdGlvblNvbWV0aW1lKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNob3coKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnNob3coKTtcbiAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uU29tZXRpbWUoKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuZGVzdHJveUN1cnJlbnRUaW1lb3V0KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdpdmVBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcik6IHZvaWQge1xuICAgICAgICBwbGF5ZXIuc2F5KCdUSEVfT05MWV9USElOR19IRV9XQU5UU19SSUdIVF9OT1dfSVNfQkVFUicpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5zYXkoJ0FORF9JX0FNX05PVF9HT0lOR19UT19HSVZFX0hJTV9BTlknKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vRHVwbGljYXRlZCBpbiBCYWxsb29uLCBpZiB3ZSBhZGQgbW9yZSBvYmplY3RzIGxpa2UgdGhpcywgY29uc2lkZXIgbW92aW5nIHRvIFRoaW5nIG1vZGVsXG4gICAgcHJpdmF0ZSBwbGF5QW5pbWF0aW9uU29tZXRpbWUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGxheUFuaW1hdGlvbigncXVpZXQnKTtcbiAgICAgICAgdGhpcy5jdXJyZW50VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uT25jZSh0aGlzLmdldFJhbmRvbUFuaW1hdGlvbigpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBbmltYXRpb25Tb21ldGltZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIHRoaXMuZ2V0VGltZUZvck5leHRBbmltYXRpb24oKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaW1lRm9yTmV4dEFuaW1hdGlvbigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTUlOX1RJTUVfRk9SX0FOSU1BVElPTiArIE1hdGgucmFuZG9tKCkqKE1BWF9USU1FX0ZPUl9BTklNQVRJT04gLSBNSU5fVElNRV9GT1JfQU5JTUFUSU9OKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJhbmRvbUFuaW1hdGlvbigpOiBzdHJpbmcge1xuICAgICAgICBpZihNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICAgICAgICByZXR1cm4gJ3Ntb2tpbmcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICdkcmlua2luZyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lDdXJyZW50VGltZW91dCgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VGltZW91dCkge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmN1cnJlbnRUaW1lb3V0KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbnZlcnNhdGlvbiwgSUNvbnZlcnNhdGlvblNjcmlwdCB9IGZyb20gJy4uLy4uL2VuZ2luZS9tb2RlbHMvQ29udmVyc2F0aW9uJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbkxpbmUgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL0NvbnZlcnNhdGlvbkxpbmUnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9QbGF5ZXInO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgQmlsaSB9IGZyb20gJy4vQmlsaSc7XG5pbXBvcnQgeyBzY2VuZXMgfSBmcm9tICcuLi8uLi9lbmdpbmUvc3RhdGUvU2NlbmVzLnNpbmdsZXRvbic7XG5pbXBvcnQgeyByYW5kb21UZXh0IH0gZnJvbSAnLi4vLi4vZW5naW5lL3V0aWxzL1JhbmRvbVRleHQnO1xuXG5jb25zdCBzY3JpcHQ6IElDb252ZXJzYXRpb25TY3JpcHQgPSB7XG4gICAgJ2luaXRpYWwnOiBbXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAnSEVZX0JJTElfSE9XX0lTX0lUX0dPSU5HJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnaW5pdGlhbCcsXG4gICAgICAgICAgICAocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmlsaTogQmlsaSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaWxpLnNheSgnTk9UX1RPX0JBRF9BTExfVEhJTkdTX0NPTlNJREVSRUQnKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmlsaS5zYXkoJ0lfSEVBUkRfVEhFX0dVWVNfQVJFX0hBVklOR19TT01FX1BST0JMRU1TJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiaWxpLnNheSgnSV9XSUxMX1dBSVRfRk9SX1RIRU1fVE9fQkVfU09MVkVEJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApLFxuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1BMRUFTRV9ET05UX0RSSU5LX1RPT19NVUNIJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnaW5pdGlhbCcsXG4gICAgICAgICAgICAocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmlsaTogQmlsaSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaWxpLnNheShyYW5kb21UZXh0KFxuICAgICAgICAgICAgICAgICAgICAnWUVTX01PTScsXG4gICAgICAgICAgICAgICAgICAgICdJX0FNX0pVU1RfS0VFUElOR19NWV9USFJPQVRfV0FSTScsXG4gICAgICAgICAgICAgICAgICAgICdIQVZFX0lfRVZFUl9GQUlMRURfWU9VJyxcbiAgICAgICAgICAgICAgICAgICAgJ1lPVVJfTEFDS19PRl9DT05GSURFTkNFX0RJU1NBUE9JTlRTX01FJ1xuICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgfVxuICAgICAgICApLFxuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZSgnT0tfU0VFX1lPVV9MQVRFUicsICdlbmQnKVxuICAgIF0sXG4gICAgJ2RydW5rJzogW1xuICAgICAgICBuZXcgQ29udmVyc2F0aW9uTGluZShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ0hFWV9CSUxJX1JFQURZX1RPX1BMQVknO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdkcnVuaycsXG4gICAgICAgICAgICAocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmlsaTogQmlsaSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaWxpLnNheShyYW5kb21UZXh0KFxuICAgICAgICAgICAgICAgICAgICAnRFJVTktfMScsXG4gICAgICAgICAgICAgICAgICAgICdEUlVOS18yJyxcbiAgICAgICAgICAgICAgICAgICAgJ0RSVU5LXzMnLFxuICAgICAgICAgICAgICAgICAgICAnRFJVTktfNCcsXG4gICAgICAgICAgICAgICAgICAgICdEUlVOS181JyxcbiAgICAgICAgICAgICAgICAgICAgJ0RSVU5LXzYnXG4gICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICksXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAnT0hfTVlfWU9VX0FSRV9EUlVOS19BUkVOVF9ZT1UnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdkcnVuaycsXG4gICAgICAgICAgICAocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllciwgYmlsaTogQmlsaSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaWxpLnNheShyYW5kb21UZXh0KFxuICAgICAgICAgICAgICAgICAgICAnRFJVTktfMScsXG4gICAgICAgICAgICAgICAgICAgICdEUlVOS18yJyxcbiAgICAgICAgICAgICAgICAgICAgJ0RSVU5LXzMnLFxuICAgICAgICAgICAgICAgICAgICAnRFJVTktfNCcsXG4gICAgICAgICAgICAgICAgICAgICdEUlVOS181JyxcbiAgICAgICAgICAgICAgICAgICAgJ0RSVU5LXzYnXG4gICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICksXG4gICAgICAgIG5ldyBDb252ZXJzYXRpb25MaW5lKCdPS19TRUVfWU9VX0xBVEVSJywgJ2VuZCcpXG4gICAgXVxufTtcblxuZXhwb3J0IGNsYXNzIENvbnZlcnNhdGlvbldpdGhCaWxpIGV4dGVuZHMgQ29udmVyc2F0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBwbGF5ZXI6IERvY3RvcnRpbGxhUGxheWVyLCBwcm90ZWN0ZWQgb3RoZXJQZXJzb246IFRoaW5nKSB7XG4gICAgICAgIHN1cGVyKHBsYXllciwgb3RoZXJQZXJzb24pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0U3RhdGUoKTogdm9pZCB7XG4gICAgICAgIGxldCBiaWxpID0gc2NlbmVzLmdldFNjZW5lQnlJZCgnQkFDS1lBUkQnKS5nZXRUaGluZ0J5SWQoJ2JpbGknKTtcbiAgICAgICAgaWYgKGJpbGkuZ2V0QXR0cignRFJVTksnKSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdkcnVuayc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2luaXRpYWwnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvYWRTY3JpcHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2NyaXB0ID0gc2NyaXB0O1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcblxubGV0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdjdXRfZmxvd2VycycsXG4gICAgeDogMTI3LFxuICAgIHk6IDE0OCxcbiAgICBzcHJpdGVJZDogJ0NVVF9GTE9XRVJTJyxcbiAgICBuYW1lOiAnQ1VUX0ZMT1dFUlMnLFxuICAgIGp1c3REZWNvcmF0aW9uOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgQ3V0Rmxvd2VycyBleHRlbmRzIFRoaW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuLi8uLi9lbmdpbmUvbW9kZWxzL1RoaW5nJztcbmltcG9ydCB7IERvY3RvcnRpbGxhUGxheWVyIH0gZnJvbSAnLi4vRG9jdG9ydGlsbGFQbGF5ZXInO1xuaW1wb3J0IHsgc2VsZWN0ZWRUaGluZyB9IGZyb20gJy4uLy4uL2VuZ2luZS9zdGF0ZS9TZWxlY3RlZE9iamVjdHMnO1xuaW1wb3J0IHsgY29zdHVtZUNyZWF0b3IgfSBmcm9tICcuLi91dGlscy9Db3N0dW1lQ3JlYXRvcic7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6ICdmbG93ZXJzJyxcbiAgICB4OiAxMjcsXG4gICAgeTogMTQ4LFxuICAgIHNwcml0ZUlkOiAnRkxPV0VSUycsXG4gICAgaW52ZW50b3J5SW1hZ2VJZDogJ0ZMT1dFUlNfSU5WJyxcbiAgICBuYW1lOiAnRkxPV0VSUycsXG4gICAgZ29Ub1Bvc2l0aW9uOiB7XG4gICAgICAgIHg6IDEzNixcbiAgICAgICAgeTogMTc4XG4gICAgfSxcbiAgICBwaWNrYWJsZTogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIEZsb3dlcnMgZXh0ZW5kcyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGxvb2tBY3Rpb24ocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcikge1xuICAgICAgICBpZiAodGhpcy5pc0luSW52ZW50b3J5KCkpIHtcbiAgICAgICAgICAgIHBsYXllci5zYXkoJ0lfQkVUX0lfQ09VTERfRE9fQV9CRUFVVElGVUxfQ09TVFVNRV9XSVRIX0lUJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIuc2F5KCdWRVJZX0JFQVVUSUZVTF9GTE9XRVJTJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXNlQWN0aW9uKHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVGhpbmcudGhpbmcuaWQgPT09ICdjb2NvbnV0Jykge1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkQ29jb251dChwbGF5ZXIpO1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkRmxvd2VycyhwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnc2tpcnQnKSB7XG4gICAgICAgICAgICBjb3N0dW1lQ3JlYXRvci5hZGRTa2lydChwbGF5ZXIpO1xuICAgICAgICAgICAgY29zdHVtZUNyZWF0b3IuYWRkRmxvd2VycyhwbGF5ZXIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRUaGluZy50aGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRoaW5nLnRoaW5nLmlkID09PSAnY29zdHVtZScpIHtcbiAgICAgICAgICAgIGNvc3R1bWVDcmVhdG9yLmFkZEZsb3dlcnMocGxheWVyKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIudXNlQWN0aW9uKHBsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5cbmxldCBvcHRpb25zID0ge1xuICAgIGlkOiAnbGFtcF9kb29yJyxcbiAgICB4OiAyNixcbiAgICB5OiA3NSxcbiAgICBzcHJpdGVJZDogJ0xBTVBfQkFDS1lBUkQnLFxuICAgIG5hbWU6ICdMQU1QX0JBQ0tZQVJEJyxcbiAgICBqdXN0RGVjb3JhdGlvbjogdHJ1ZSxcbiAgICBpc0ZvcmVncm91bmQ6IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBMYW1wQmFja3lhcmQgZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5cbmxldCBvcHRpb25zID0ge1xuICAgIGlkOiAnbW9vbicsXG4gICAgeDogMzgxLFxuICAgIHk6IDIyLFxuICAgIHNwcml0ZUlkOiAnTU9PTicsXG4gICAgbmFtZTogJ01PT04nLFxuICAgIGp1c3REZWNvcmF0aW9uOiB0cnVlLFxuICAgIGlzRm9yZWdyb3VuZDogdHJ1ZVxufTtcblxuZXhwb3J0IGNsYXNzIE1vb24gZXh0ZW5kcyBUaGluZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi4vLi4vZW5naW5lL21vZGVscy9UaGluZyc7XG5cbmxldCBvcHRpb25zID0ge1xuICAgIGlkOiAnc3RhcicsXG4gICAgeDogMSxcbiAgICB5OiAxLFxuICAgIHNwcml0ZUlkOiAnU1RBUicsXG4gICAgbmFtZTogJ1NUQVInLFxuICAgIGp1c3REZWNvcmF0aW9uOiB0cnVlXG59O1xuXG5pbnRlcmZhY2UgSVN0YXJPcHRpb25zIHtcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIGlkOiBzdHJpbmcsXG4gICAgb3BhY2l0eTogbnVtYmVyXG59XG5cbmV4cG9ydCBjbGFzcyBTdGFyIGV4dGVuZHMgVGhpbmcge1xuICAgIGNvbnN0cnVjdG9yKGV4dHJhT3B0aW9uczogSVN0YXJPcHRpb25zKSB7XG4gICAgICAgIGxldCBjb3JyZWN0T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIGV4dHJhT3B0aW9ucyk7XG4gICAgICAgIHN1cGVyKGNvcnJlY3RPcHRpb25zKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb3N0dW1lIH0gZnJvbSAnLi4vYmFja3N0YWdlU2NlbmUvQ29zdHVtZSc7XG5pbXBvcnQgeyBEb2N0b3J0aWxsYVBsYXllciB9IGZyb20gJy4uL0RvY3RvcnRpbGxhUGxheWVyJztcblxuY2xhc3MgQ29zdHVtZUNyZWF0b3Ige1xuICAgIHByaXZhdGUgY29zdHVtZTogQ29zdHVtZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNvc3R1bWUgPSBudWxsO1xuICAgIH1cblxuICAgIGFkZEZsb3dlcnMocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcikge1xuICAgICAgICB0aGlzLmNyZWF0ZUNvc3R1bWVJZk5lZWRlZCgpO1xuICAgICAgICB0aGlzLmNvc3R1bWUuYWRkRmxvd2VycyhwbGF5ZXIpO1xuICAgIH1cblxuICAgIGFkZENvY29udXQocGxheWVyOiBEb2N0b3J0aWxsYVBsYXllcikge1xuICAgICAgICB0aGlzLmNyZWF0ZUNvc3R1bWVJZk5lZWRlZCgpO1xuICAgICAgICB0aGlzLmNvc3R1bWUuYWRkQ29jb251dChwbGF5ZXIpO1xuICAgIH1cblxuICAgIGFkZFNraXJ0KHBsYXllcjogRG9jdG9ydGlsbGFQbGF5ZXIpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVDb3N0dW1lSWZOZWVkZWQoKTtcbiAgICAgICAgdGhpcy5jb3N0dW1lLmFkZFNraXJ0KHBsYXllcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVDb3N0dW1lSWZOZWVkZWQoKTogdm9pZCB7XG4gICAgICAgIGlmKCF0aGlzLmNvc3R1bWUpIHtcbiAgICAgICAgICAgIHRoaXMuY29zdHVtZSA9IG5ldyBDb3N0dW1lKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IGNvc3R1bWVDcmVhdG9yID0gbmV3IENvc3R1bWVDcmVhdG9yKCk7IiwiaW1wb3J0IHsgcGhhc2VyIH0gZnJvbSAnLi9QaGFzZXInO1xuaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSAnLi9lbmdpbmUvdWkvTGF5b3V0TWFuYWdlci5zaW5nbGV0b24nO1xuaW1wb3J0IHsgQm9vdFNjZW5lIH0gZnJvbSAnLi9Cb290U2NlbmUnO1xuaW1wb3J0IHsgUHJlbG9hZGVyU2NlbmUgfSBmcm9tICcuL1ByZWxvYWRlclNjZW5lJztcbmltcG9ydCB7IFN0YXJ0TWVudVNjZW5lIH0gZnJvbSAnLi9TdGFydE1lbnVTY2VuZSc7XG5pbXBvcnQgeyBDcmVkaXRzU2NlbmUgfSBmcm9tICcuL0NyZWRpdHNTY2VuZSc7XG5pbXBvcnQgeyBwbGF5U2NlbmUgfSBmcm9tICcuL1BsYXlTY2VuZSc7XG5pbXBvcnQgeyBwaGFzZXJHYW1lIH0gZnJvbSAnLi9lbmdpbmUvc3RhdGUvUGhhc2VyR2FtZS5zaW5nbGV0b24nO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYoIWlzTW9iaWxlKCkpIHtcbiAgICAgICAgbGV0IGdhbWUgPSBuZXcgcGhhc2VyLkdhbWUobGF5b3V0LldJRFRILCBsYXlvdXQuSEVJR0hULCBwaGFzZXIuQVVUTywgJ2dhbWUnKTtcblxuICAgICAgICBwaGFzZXJHYW1lLnZhbHVlID0gZ2FtZTtcblxuICAgICAgICBnYW1lLnN0YXRlLmFkZCgnYm9vdCcsIEJvb3RTY2VuZSk7XG4gICAgICAgIGdhbWUuc3RhdGUuYWRkKCdwcmVsb2FkZXInLCBQcmVsb2FkZXJTY2VuZSk7XG4gICAgICAgIGdhbWUuc3RhdGUuYWRkKCdzdGFydE1lbnUnLCBTdGFydE1lbnVTY2VuZSk7XG4gICAgICAgIGdhbWUuc3RhdGUuYWRkKCdwbGF5JywgcGxheVNjZW5lKTtcbiAgICAgICAgZ2FtZS5zdGF0ZS5hZGQoJ2NyZWRpdHMnLCBDcmVkaXRzU2NlbmUpO1xuXG4gICAgICAgIGdhbWUuc3RhdGUuc3RhcnQoJ2Jvb3QnKTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBpc01vYmlsZSgpIHtcbiAgICBjb25zdCBNSU5fV0lEVEggPSA0MDA7XG4gICAgY29uc3QgTUlOX0hFSUdIVCA9IDQwMDtcbiAgICBsZXQgdyA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XG4gICAgbGV0IGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMCk7XG5cbiAgICByZXR1cm4gKHcgPCBNSU5fSEVJR0hUKSB8fCAoaCA8IE1JTl9IRUlHSFQpO1xufVxuIl19
