import {
    BG_COLOR,
    TILE_BG_COLOR,
    TILE_HEIGHT,
    TILE_SELECTED_BG_COLOR,
    TILE_WIDTH,
} from "./constants";
import { endGame, hasGameEnded, startGame } from "./game";
import { initState, nextState, setState, state } from "./state";
import { registerTileTouchListeners, spawnTiles } from "./tile";

import Stats from "stats.js";

export const canvas: HTMLCanvasElement = document.getElementById(
    "game-canvas"
) as HTMLCanvasElement;
export const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
) as CanvasRenderingContext2D;

const stats = new Stats();
document.body.appendChild(stats.dom);

const draw = () => {
    // Clear the canvas
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tiles = state.get("tile");

    // Draw the tiles
    tiles.forEach((tile) => {
        if (tile.get("selected")) {
            ctx.fillStyle = TILE_SELECTED_BG_COLOR;
        } else {
            ctx.fillStyle = TILE_BG_COLOR;
        }

        const pos = tile.get("position");
        ctx.fillRect(pos.x, pos.y, TILE_WIDTH, TILE_HEIGHT);

        if (state.get("game").get("showValue") || hasGameEnded(state)) {
            ctx.font = "32px Roboto";
            ctx.fillStyle = "#fff";

            ctx.fillText(
                String(tile.get("value")),
                pos.x + TILE_WIDTH / 2.6,
                pos.y + TILE_HEIGHT / 1.6
            );
        }
    });
};

const step = (t1: number) => (t2: number) => {
    stats.begin();

    if (t2 - t1 > 16.66) {
        if (hasGameEnded(state)) {
            // We will probably show a "restart" game screen.
            console.log("GAME ENDED");
        }
        setState(nextState(state));
        draw();
        requestAnimationFrame(step(t2));
    } else {
        requestAnimationFrame(step(t1));
    }

    stats.end();
};

setState(initState());
setState(spawnTiles(4, state));
setState(startGame(state));

draw();
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
