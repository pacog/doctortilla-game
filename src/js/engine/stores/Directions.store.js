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
