import { GameState, initGameState } from "./game";
import { TileState, initTileState, updateTileState } from "./tile";

import { Record } from "immutable";

export type State = Record<{
    tile: TileState;
    game: GameState;
}>;

export let state: State;

export const setState = (_state: State): void => {
    state = _state;
    globalThis.state = state;
};

export const initState = (): State => {
    const state: State = Record({
        tile: initTileState(),
        game: initGameState(),
    })();
    return state;
};

export const nextState = (state: State): State => {
    state = updateTileState(state);
    return state;
};
