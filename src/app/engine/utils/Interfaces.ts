export interface IPoint {
    x: number,
    y: number
}

export interface ISpriteInfo {
    frames: Array<number>,
    inverse?: Boolean
}

export interface IRectangle {
    x: number,
    y: number,
    width: number,
    height: number
}

export interface IGoToSceneOptions {
    sceneId: string,
    relatedDoorId: string
}

export interface ITimeoutWithPromise {
    timeoutId: number,
    promise: Promise<any>,
    resolveCallback: () => void,
    rejectCallback: () => void
}