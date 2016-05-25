var actionDispatcher = require('../ActionDispatcher.singleton.js');
var actions = require('../stores/Actions.store.js');
var Verbs = require('../stores/Verbs.store.js');

class Thing {

    constructor(phaserGame, options) {
        this.options = options;
        this.phaserGame = phaserGame;
        this._createSprite();
        this._state = new Map();
        this._onStateChange();
    }

    get id() {
        return this.options.id;
    }

    get name() {
        return this.options.name || 'thing';
    }

    applyAction(verb, player) {

        switch (verb) {

        case Verbs.GO_TO:
            if (!this.isInInventory()) {
                this.goToAction(player);
            }
            break;
        case Verbs.TAKE:
            if (!this.isInInventory()) {
                this.takeAction(player);
            }
            break;
        case Verbs.LOOK:
            this.lookAction(player);
            break;
        case Verbs.OPEN:
            this.openAction(player);
            break;
        case Verbs.CLOSE:
            this.closeAction(player);
            break;
        case Verbs.PUSH:
            this.pushAction(player);
            break;
        case Verbs.USE:
            //Implement use action (two objects)
            this.useAction(player);
            break;
        case Verbs.SPEAK:
            this.speakAction(player);
            break;
        case Verbs.GIVE:
            this.giveAction(player);
            break;
        default:
            throw 'ERROR, unknown action ' + verb;
        }
    }

    //Default actions, can be overwritten by child classes

    goToAction(player) {
        player.goToThing(this);
    }

    takeAction(player) {
        player.say('I cannot pick that up');
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

    get state() {
        return this._state;
    }

    set state(newState) {
        if (newState) {
            this._state = newState;
            this._onStateChange();
        }
    }

    changeAttr(attrName, value) {
        this._state.set(attrName, value);
        this._onStateChange();
    }

    getAttr(attrName) {
        return this._state.get(attrName);
    }

    getPreferredAction() {
        return this.options.preferredAction || Verbs.LOOK;
    }

    get inventoryImage() {
        return this.options.inventoryImageId || this.options.spriteId;
    }

    isInInventory() {
        return this.state && this.state.get('IS_IN_INVENTORY');
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

    destroy() {
        this.sprite.destroy();
    }
}

module.exports = Thing;