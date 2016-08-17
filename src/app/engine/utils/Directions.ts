export enum Directions {
    UP = 1,
    DOWN,
    LEFT,
    RIGHT
};

export const getDirectionName = function(direction: Directions) {
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