'use strict';

const JustDecorationModifier = {
    methods: {
        _applyModifier() {
            this.sprite.inputEnabled = false;
        }
    }
};

module.exports = JustDecorationModifier;