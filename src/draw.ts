import {
    BG_COLOR,
    TILE_BG_COLOR,
    TILE_HEIGHT,
    TILE_SELECTED_BG_COLOR,
    TILE_WIDTH,
} from "./constants";

import { State } from "./state";
import { hasGameEnded } from "./game";

export const draw = (
    state: State,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) => {
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
