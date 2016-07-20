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
    type: PaginationButtonType
}

export class InventoryPaginationButton {

    private button: Phaser.Button;
    private clickObservable: Observable;

    constructor(private options: IInventoryPaginationButtonOptions) {
        this.clickObservable = new Observable();
        this.createButton();
    }

    subscribeToClick(callback: ICallback) {
        this.clickObservable.registerObserver(callback);
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
        uiLayers.verbButtons.add(this.button);
        this.button.fixedToCamera = true;
    }

    private onClick(): void {
        this.clickObservable.notifyObservers(null);
    }
}