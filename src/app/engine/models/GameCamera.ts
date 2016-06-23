import { phaserGame } from '../state/PhaserGame.singleton';
import { Player } from './Player';
import { IPoint } from '../utils/Interfaces';
import { style } from '../ui/Style';

export class GameCamera {
    private camera: Phaser.Camera;
    private cameraPosition: IPoint;

    constructor(private player: Player) {
        if (!this.player) {
            throw 'ERROR: a camera needs a player to follow';
        }
        this.camera = phaserGame.value.camera;
        this.updatePosition();
    }

    updatePosition(): void {
        this.cameraPosition = this.cameraPosition || new Phaser.Point(0, 0);

        let player = this.player.sprite;
        this.cameraPosition.x += (player.x - this.cameraPosition.x) * style.CAMERA_EASING_FACTOR;
        this.cameraPosition.x = Math.round(this.cameraPosition.x);
        this.cameraPosition.y += (player.y - this.cameraPosition.y) * style.CAMERA_EASING_FACTOR;
        this.cameraPosition.y = Math.round(this.cameraPosition.y);
        this.camera.focusOnXY(this.cameraPosition.x, this.cameraPosition.y);
    }
}