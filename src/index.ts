import {
    BG_COLOR,
    TILE_BG_COLOR,
    TILE_HEIGHT,
    TILE_SELECTED_BG_COLOR,
    TILE_WIDTH,
} from './constants';
import { initState, nextState, setState, state } from './state';
import { registerTileTouchListeners, spawnTiles } from './tile';

import Stats from 'stats.js';

setState(initState());

export const canvas: HTMLCanvasElement = document.getElementById(
    'game-canvas'
) as HTMLCanvasElement;
export const ctx: CanvasRenderingContext2D = canvas.getContext(
    '2d'
) as CanvasRenderingContext2D;

const stats = new Stats();
document.body.appendChild(stats.dom);

spawnTiles(6);

const draw = () => {
    // Clear the canvas
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tiles = state.get('tileState');

    // Draw the tiles
    tiles.forEach((tile) => {
        if (tile.get('selected')) {
            ctx.fillStyle = TILE_SELECTED_BG_COLOR;
        } else {
            ctx.fillStyle = TILE_BG_COLOR;
        }

        const pos = tile.get('position');
        const valueText = String(tile.get('value'));
        ctx.fillRect(pos.x, pos.y, TILE_WIDTH, TILE_HEIGHT);

        ctx.font = '32px Roboto';
        ctx.fillStyle = '#fff';

        const w = ctx.measureText(valueText).width;
        ctx.fillText(
            String(tile.get('value')),
            pos.x + w * 1.5,
            pos.y + w * 2.5
        );
    });
};

const step = (t1: number) => (t2: number) => {
    stats.begin();

    if (t2 - t1 > 16.66) {
        // TODO: UPDATE STATE
        setState(nextState(state));
        draw();
        requestAnimationFrame(step(t2));
    } else {
        requestAnimationFrame(step(t1));
    }

    stats.end();
};

draw();
registerTileTouchListeners();
requestAnimationFrame(step(0));
