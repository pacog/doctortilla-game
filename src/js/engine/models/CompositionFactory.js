'use strict';
const compositionFactory = {
    applyModifier: function (modifier, otherClass) {
        if (!modifier || !modifier.methods) {
            throw 'ERROR: apply a modifier nees to have a modifier with methods inside';
        }
        for (let methodName in modifier.methods) {
            otherClass.prototype[methodName] = modifier.methods[methodName];
        }
    }
};
module.exports = compositionFactory;