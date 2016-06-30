import { Scene } from '../models/Scene';

class ScenesSet {
    private scenes: Map<string, Scene>;
    private _currentScene: Scene;

    init(scenes: Array<Scene>): void {
        this.scenes = new Map();
        scenes.forEach((scene) => {
            this.scenes.set(scene.id, scene);
        });
    }

    get currentScene(): Scene {
        return this._currentScene;
    }

    setCurrentSceneById(newCurrentSceneId: string): void {
        this.destroyCurrentScene();
        let scene = this.scenes.get(newCurrentSceneId);
        if (!scene) {
            throw `ERROR trying to init scene that is not present (${newCurrentSceneId})`;
        }
        this._currentScene = scene;
        scene.show();
    }

    private destroyCurrentScene(): void {
        if (this._currentScene) {
            this._currentScene.destroy();
            this._currentScene = null;
        }
    }
}

export const scenes = new ScenesSet();
