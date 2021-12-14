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
    tileMaxSpeed: number;
    showValue: boolean;
    startTime: MilliSecs | null;
    status: GameStatus;
    tileCount: number;
}>;

export const initGameState = (): GameState => {
    // TODO: Pass this data as argument and refactor this
    // and have dom related code to someting like `dom.ts`.
    // It definitely needs to go in a object for a controlled game.
    const searchParams = new URLSearchParams(location.search);
    const tileCount = Number(searchParams.get("tileCount")) || 6;
    const endGameAfterInSecs = Number(searchParams.get("endGameAfter")) || 4;
    const tileMaxSpeed = Number(searchParams.get("tileMaxSpeed")) || 5;
    const hideAfterInSecs = Number(searchParams.get("hideAfter")) || 4;

    const game: GameState = Record({
        endGameAfter: endGameAfterInSecs * 1000,
        hideAfter: hideAfterInSecs * 1000,
        lastTileClicked: null,
        tileMaxSpeed,
        showValue: true,
        startTime: null,
        status: GameStatus.INIT,
        tileCount,
    })();

    const newSearchParams = new URLSearchParams({
        tileCount: String(tileCount),
        hideAfter: String(hideAfterInSecs),
        tileMaxSpeed: String(tileMaxSpeed),
        endGameAfter: String(endGameAfterInSecs),
    }).toString();

    const inputTileCount = document.getElementById(
        "input-tile-count"
    ) as HTMLInputElement;
    const inputHideAfter = document.getElementById(
        "input-hide-after"
    ) as HTMLInputElement;
    const inpuTileMaxSpeed = document.getElementById(
        "input-tile-max-speed"
    ) as HTMLInputElement;
    const inputTileEndAfter = document.getElementById(
        "input-end-game-after"
    ) as HTMLInputElement;

    inputTileCount.value = String(tileCount);
    inputHideAfter.value = String(hideAfterInSecs);
    inpuTileMaxSpeed.value = String(tileMaxSpeed);
    inputTileEndAfter.value = String(endGameAfterInSecs);

    const newRelativePathQuery =
        location.pathname + "?" + newSearchParams.toString();
    history.pushState(null, "", newRelativePathQuery);

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
