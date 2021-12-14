import { endGame, startGame } from "./game";
import { initState, nextState, setState, state } from "./state";
import { registerTileTouchListeners, spawnTiles } from "./tile";

import Stats from "stats.js";
import { draw } from "./draw";

export const canvas: HTMLCanvasElement = document.getElementById(
    "game-canvas"
) as HTMLCanvasElement;
export const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
) as CanvasRenderingContext2D;

const stats = new Stats();
document.body.appendChild(stats.dom);

const step = (t1: number) => (t2: number) => {
    stats.begin();

    if (t2 - t1 > 16.66) {
        setState(nextState(state));
        draw(state, canvas, ctx);
        requestAnimationFrame(step(t2));
    } else {
        requestAnimationFrame(step(t1));
    }

    stats.end();
};

setState(initState());
setState(spawnTiles(state));
setState(startGame(state));

draw(state, canvas, ctx);
requestAnimationFrame(step(0));
registerTileTouchListeners();

setTimeout(() => {
    let gameState = state.get("game");
    gameState = gameState.set("showValue", false);
    setState(state.set("game", gameState));
}, state.get("game").get("hideAfter"));

setTimeout(() => {
    setState(endGame(state));
}, state.get("game").get("endGameAfter") + state.get("game").get("hideAfter"));
