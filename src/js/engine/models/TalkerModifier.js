'use strict';

var Text = require('../ui/Text.js');

const TalkerModifier = {
    methods: {
        say: function (text) {
            //TODO handle animations
            this._destroyPrevText();
            this._textBeingSaid = new Text(this.phaserGame, {
                text: text,
                position: this._getPositionOnTop(),
                autoDestroy: true
            });
            return this._textBeingSaid.promise;
        },

        _destroyPrevText() {
            if (this._textBeingSaid) {
                this._textBeingSaid.destroy();
                this._textBeingSaid = null;
            }
        },

        _getPositionOnTop: function () {
            var result = {
                x: this.sprite.x,
                y: Math.round(this.sprite.getBounds().y) - 10
            };
            return result;
        }
    }
};

module.exports = TalkerModifier;