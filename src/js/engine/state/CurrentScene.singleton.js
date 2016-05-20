class CurrentScene {

    get value() {
        return this._currentScene;
    }

    set value(newValue) {
        this._currentScene = newValue;
    }
}

let currentScene = new CurrentScene();
module.exports = currentScene;