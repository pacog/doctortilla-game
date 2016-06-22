import { Inventory } from './Inventory';
import { uiLayers } from '../ui/UILayers.singleton';

interface IPlayerOptions {
    spriteId: string,
    initialX: number,
    initialY: number,
    xSpeed: number, //px/s
    ySpeed: number, //px/s
    animationSpeed: number
}

export abstract class Player {

    private inventory: Inventory;
    private sprite: Phaser.Sprite;

    constructor(private options : IPlayerOptions) {
        this.inventory = new Inventory();
        this.createSprite();
    }

    private createSprite(): void {
        this.sprite = uiLayers.player.create(
            this.options.initialX,
            this.options.initialY,
            this.options.spriteId
        );
        this.sprite.anchor.setTo(0.5, 0.99);
        this.sprite.inputEnabled = true;
        uiLayers.player.sort('z', Phaser.Group.SORT_ASCENDING);
    }

}