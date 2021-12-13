import { TileState, initTileState, updateTileState } from './tile';

import { Record } from 'immutable';

export type State = Record<{
    tileState: TileState;
}>;

export let state: State;

export const setState = (_state: State): void => {
    state = _state;
    (globalThis as any).state = state;
};

export const initState = (): State => {
    const state: State = Record({ tileState: initTileState() })();
    return state;
};

export const nextState = (state: State): State => {
    state = updateTileState(state);
    return state;
};
