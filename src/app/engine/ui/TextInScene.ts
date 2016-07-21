/// <reference path="../../../../my-typings/lib.es6.d.ts" />
import { IPoint } from '../utils/Interfaces';
import { style } from './Style';
import { TextWithShadow } from './TextWithShadow';
import { uiLayers } from './UILayers.singleton';
import { scenes } from '../state/Scenes.singleton';

interface ITextInSceneOptions {
    text: string,
    position: IPoint,
    timePerLetter?: number,
    minDestroyTime?: number,
    width?: number,
    autoDestroy?: Boolean,
    anchor?: IPoint,
    paddingInScreen?: number
}

const DEFAULT_TEXT_OPTIONS = Object.freeze({
    timePerLetter: 50,
    minDestroyTime: 2000,
    text: '',
    position: { x: 100, y: 100},
    width: 30,
    autoDestroy: false,
    anchor: { x: 0, y: 0},
    paddingInScreen: 5
});

export class TextInScene {

    private currentText: TextWithShadow;
    private promiseToDestroy: Promise<any>;
    private resolveCallback: () => void;
    private timeoutToDestroy: number;
    private textInLines: string;
    private position: IPoint;

    constructor(private options: ITextInSceneOptions) {
        this.options = Object.assign({}, DEFAULT_TEXT_OPTIONS, this.options);
        this.position = Object.assign({}, this.options.position);
        this.createText();
        if (this.options.autoDestroy) {
            this.promiseToDestroy = this.autoDestroy();
        }
    }

    get promise(): Promise<void> {
        return this.promiseToDestroy;
    }

    setPosition(newPosition: IPoint): void {
        this.position = newPosition;
        if(this.currentText) {
            let position = this.getPosition();
            this.currentText.setPosition(position);
        }

    }

    destroy() {
        if (this.currentText) {
            this.currentText.destroy();
            this.currentText = null;
        }
        if (this.resolveCallback) {
            this.resolveCallback();
            this.resolveCallback = null;
        }
    }

    private getPosition(): IPoint {
        return {
            x: this.getXPositionForText(this.textInLines),
            y: this.getYPositionForText(this.textInLines)
        }
    }

    private createText(): void {
        this.textInLines = this.addLinesSeparators(this.options.text, this.options.width);

        this.currentText = new TextWithShadow({
            position: this.getPosition(),
            layer: uiLayers.textInScene,
            initialText: this.textInLines,
            align: 'center',
            anchor: this.options.anchor
        });
    }

    private addLinesSeparators(text: string, maxLineLength: number): string {

        let words = text.split(' ');
        let lines = [''];
        let currentLine = 0;

        for (let i = 0; i < words.length; i++) {
            //If a word is too big for this line, add to next
            if ((lines[currentLine].length + words[i].length) >= maxLineLength) {
                lines.push('' + words[i]);
                currentLine ++;
            } else {
                lines[currentLine] += ' ' + words[i];
            }
        }
        return lines.join('\n');
    }

    private getXPositionForText(text: string): number {
        let longestLineLength = this.getLongestLineLength(text);
        let maxWidth = longestLineLength * style.DEFAULT_FONT_SIZE;
        let result = this.position.x - (maxWidth / 2);

        result = Math.max(result, this.options.paddingInScreen);
        result = Math.min(result, this.getMaxXForText(maxWidth));

        return result;
    }

    private getMaxXForText(textWidth: number): number {
        let sceneWidth = scenes.currentScene.sceneBounds.width;
        return sceneWidth - this.options.paddingInScreen - textWidth;
    }

    private getYPositionForText(text: string): number {
        let lines = text.split('\n').length;
        let totalHeight = lines * style.DEFAULT_FONT_SIZE;
        return this.position.y - totalHeight;
    }

    private getLongestLineLength(text: string): number {
        let lines = text.split('\n');
        let maxLength = 0;
        for (let i = 0; i < lines.length; i++) {
            maxLength = Math.max(maxLength, lines[i].length);
        }
        return maxLength;
    }

    private autoDestroy(): Promise<any> {
        let deferred = new Promise((resolveCallback) => {
            this.resolveCallback = resolveCallback;
        });
        let timeToDestroy = this.getTimeToDestroyFromText(this.options.text);
        this.timeoutToDestroy = setTimeout(() => this.destroy(), timeToDestroy);
        return deferred;
    }

    private getTimeToDestroyFromText(text: string): number {
        let timeToDestroy = this.options.timePerLetter * text.length;
        return Math.max(this.options.minDestroyTime, timeToDestroy);
    }

}
