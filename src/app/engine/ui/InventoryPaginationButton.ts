import { IPoint } from '../utils/Interfaces';
import { layout } from './LayoutManager.singleton';
import { phaserGame } from '../state/PhaserGame.singleton';
import { phaser } from '../../Phaser';
import { uiLayers } from './UILayers.singleton';
import { style } from './Style';
import { Observable, ICallback } from '../utils/Observable';

export enum PaginationButtonType {
    UP = 1,
    DOWN
};

interface IInventoryPaginationButtonOptions {
    type: PaginationButtonType,
    layer?: Phaser.Group
}

export class InventoryPaginationButton {

    private button: Phaser.Button;
    private clickObservable: Observable;

    constructor(private options: IInventoryPaginationButtonOptions) {
        this.clickObservable = new Observable();
        this.options.layer = this.options.layer || uiLayers.verbButtons;
        this.createButton();
    }

    hide(): void {
        this.button.alpha = 0;
    }

    show(): void {
        this.button.alpha = 1;
    }

    subscribeToClick(callback: ICallback) {
        this.clickObservable.registerObserver(callback);
    }

    destroy(): void {
        this.clickObservable.removeAllObservers();
        this.button.destroy();
    }

    private createButton(): void {
        let position: IPoint;
        if(this.options.type === PaginationButtonType.UP) {
            position = layout.getPaginationButtonUp();
        } else {
            position = layout.getPaginationButtonDown();
        }
        this.button = phaserGame.value.add.button(
            position.x,
            position.y,
            'PAGINATION_BUTTON_UP',
            this.onClick,
            this,
            1,
            0,
            2,
            1
        );
        if(this.options.type === PaginationButtonType.DOWN) {
            this.button.scale.y = -1;
            this.button.anchor.setTo(0, 1);
        }
        this.options.layer.add(this.button);
        this.button.fixedToCamera = true;
    }

    private onClick(): void {
        this.clickObservable.notifyObservers(null);
    }
}