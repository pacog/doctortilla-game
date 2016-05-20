const actions = Object.freeze({
    ACTION_APPLIED: Symbol(),
    CLICK_STAGE: Symbol(),
    CURSOR_OUT_THING: Symbol(),
    CURSOR_OVER_THING: Symbol(),
    GO_TO_SCENE: Symbol(),
    SELECT_THING: Symbol(),
    SELECT_VERB: Symbol(),
    TAKE_OBJECT: Symbol(),
    UPDATE_INVENTORY: Symbol()
});
module.exports = actions;