/// <reference path="../../../../my-typings/lib.es6.d.ts" />

export enum Verbs {
    GO_TO,
    LOOK,
    CLOSE,
    PUSH,
    TAKE,
    USE,
    SPEAK,
    GIVE,
    OPEN
};

interface IVerbInfo {
    label: string,
    singleObject: Boolean,
    conjuction?: string
}

let verbsInfo : Map<Verbs, IVerbInfo> = new Map();

verbsInfo.set(Verbs.GO_TO, {
    label: 'Go to',
    singleObject: true
});
verbsInfo.set(Verbs.LOOK, {
    label: 'Look at',
    singleObject: true
});
verbsInfo.set(Verbs.CLOSE, {
    label: 'Close',
    singleObject: true
});
verbsInfo.set(Verbs.PUSH, {
    label: 'Push',
    singleObject: true
});
verbsInfo.set(Verbs.TAKE, {
    label: 'Take',
    singleObject: true
});
verbsInfo.set(Verbs.USE, {
    label: 'Use',
    singleObject: false,
    conjuction: 'with'
});
verbsInfo.set(Verbs.SPEAK, {
    label: 'Speak to',
    singleObject: true
});
verbsInfo.set(Verbs.GIVE, {
    label: 'Give',
    singleObject: false,
    conjuction: 'to'
});
verbsInfo.set(Verbs.OPEN, {
    label: 'Open',
    singleObject: true
});
export const VerbsInfo = verbsInfo;
