import { CoordX, CoordY, Position, Velocity } from './types';
import { List, Record } from 'immutable';
import { State, setState, state } from './state';
import { TILE_HEIGHT, TILE_WIDTH } from './constants';

import { canvas } from './index';
import { random } from './utils';

type Tile = Record<{
    position: Position;
    selected: boolean;
    value: number;
    velocity: Velocity;
}>;

export type TileState = List<Tile>;

export const initTileState = (): TileState => {
    return List();
};

const giveRandomDirection = (speed: number): number => {
    if (random() > 0.5) {
        return speed;
    } else {
        return -speed;
    }
};

const randomVelocity = (maxV: number): Velocity => {
    const max = random(maxV, 3);
    const min = 1;

    return {
        x: giveRandomDirection(random(max, min)),
        y: giveRandomDirection(random(max, min)),
    };
};

const shouldChangeVelocity = (): boolean => {
    if (random() > 0.995) {
        return true;
    } else {
        return false;
    }
};

const createTile = (
    value: number,
    totalWidth: number,
    totalHeight: number
): Tile => {
    const maxW = totalWidth - TILE_WIDTH;
    const maxH = totalHeight - TILE_HEIGHT;
    const x = Math.random() * maxW;
    const y = Math.random() * maxH;

    const tile: Tile = Record({
        value,
        position: { x, y },
        selected: false,
        velocity: randomVelocity(7),
    })();

    return tile;
};

export const spawnTiles = (howMany: number) => {
    let tiles: TileState = List([]);

    for (let i = 0; i < howMany; i++) {
        const value = i + 1;
        const tile = createTile(value, canvas.width, canvas.height);
        tiles = tiles.push(tile);
    }

    setState(state.set('tileState', tiles));
};

export const updateTileState = (state: State): State => {
    let tileState: TileState = state.get('tileState');

    tileState.forEach((tile, idx) => {
        const position = tile.get('position');
        const velocity = tile.get('velocity');

        const tileBottom = position.y + TILE_WIDTH;
        const tileTop = position.y;
        const tileRight = position.x + TILE_HEIGHT;
        const tileLeft = position.x;

        if (shouldChangeVelocity()) {
            const rndVel = randomVelocity(7);
            velocity.x = rndVel.x;
            velocity.y = rndVel.y;
        }

        if (tileBottom > canvas.height || tileTop < 0) {
            velocity.y = -velocity.y;
        } else if (tileRight > canvas.width || tileLeft < 0) {
            velocity.x = -velocity.x;
        }

        position.x += velocity.x;
        position.y += velocity.y;

        tile = tile.set('position', position);
        tile = tile.set('velocity', velocity);
        tileState = tileState.set(idx, tile);
    });

    state = state.set('tileState', tileState);
    return state;
};

const contains =
    (tile: Tile) =>
    (x: CoordX, y: CoordY): boolean => {
        const pos = tile.get('position');
        const minX = pos.x;
        const maxX = pos.x + TILE_WIDTH;
        const minY = pos.y;
        const maxY = pos.y + TILE_HEIGHT;

        if (x > minX && x < maxX && y > minY && y < maxY) {
            return true;
        } else {
            return false;
        }
    };

export const registerTileTouchListeners = () => {
    canvas.addEventListener('pointerdown', (event) => {
        const x = event.offsetX;
        const y = event.offsetY;

        let tileState = state.get('tileState');

        tileState = tileState.map((tile) => {
            if (contains(tile)(x, y)) {
                tile = tile.set('selected', !tile.get('selected'));
            }

            return tile;
        });

        setState(state.set('tileState', tileState));
    });
};
