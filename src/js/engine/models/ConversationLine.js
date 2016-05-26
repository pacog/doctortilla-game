/* global Promise */
const emptyFunctionWithPromise = function () {
    'use strict';

    var result = {};
    let deferred = new Promise(function (resolve) {
        result.resolveCallback = resolve;
    });
    result.resolveCallback();

    return deferred;
};

class ConversationLine {
    constructor(text, nextState, afterCallback) {
        if (!text) {
            throw 'ERROR: missing text for conversation line';
        }
        if (!nextState) {
            throw 'ERROR: missing next state for conversation line';
        }
        this._text = text;
        this._nextState = nextState;
        this._afterCallback = afterCallback;
    }

    get text() {
        if (typeof this._text === 'string') {
            return (() => {return this._text; });
        } else if (typeof this._text === 'function') {
            return this._text;
        }
        throw 'ERROR: getting text of conversation line, with incorrect type';
    }

    get afterCallback() {
        if (this._afterCallback) {
            return this._afterCallback;
        } else {
            return emptyFunctionWithPromise;
        }
    }

    get nextState() {
        return this._nextState;
    }
}

module.exports = ConversationLine;