import { MilliSecs } from "./types";
import { Record } from "immutable";
import { State } from "./state";
import { Tile } from "./tile";
import { rightNow } from "./utils";

export enum GameStatus {
    INIT = "INIT",
    RUNNING = "RUNNING",
    ENDED = "ENDED",
}

export type GameState = Record<{
    endGameAfter: MilliSecs;
    hideAfter: MilliSecs;
    lastTileClicked: Tile | null;
    showValue: boolean;
    startTime: MilliSecs | null;
    status: GameStatus;
    totalTiles: number;
}>;

export const initGameState = (): GameState => {
    const game: GameState = Record({
        endGameAfter: 5000,
        hideAfter: 3000,
        lastTileClicked: null,
        showValue: true,
        startTime: null,
        status: GameStatus.INIT,
        totalTiles: 0,
    })();
    return game;
};

export const startGame = (state: State): State => {
    let gameState = state.get("game");

    gameState = gameState.set("status", GameStatus.RUNNING);
    gameState = gameState.set("startTime", rightNow());

    return state.set("game", gameState);
};

export const endGame = (state: State): State => {
    let gameState = state.get("game");
    gameState = gameState.set("status", GameStatus.ENDED);
    return state.set("game", gameState);
};

export const isGameRunning = (state: State): boolean => {
    return state.get("game").get("status") === GameStatus.RUNNING;
};

export const hasGameEnded = (state: State): boolean => {
    return state.get("game").get("status") === GameStatus.ENDED;
};
