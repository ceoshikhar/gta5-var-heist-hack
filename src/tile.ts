import { CoordX, CoordY, Position, Velocity } from "./types";
import { List, Record } from "immutable";
import { State, setState, state } from "./state";
import { TILE_HEIGHT, TILE_WIDTH } from "./constants";
import { endGame, hasGameEnded } from "./game";

import { canvas } from "./index";
import { random } from "./utils";

export type Tile = Record<{
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
        x: giveRandomDirection(Math.floor(random(max, min))),
        y: giveRandomDirection(Math.floor(random(max, min))),
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

export const spawnTiles = (howMany: number, state: State): State => {
    let tileState = state.get("tile");
    let gameState = state.get("game");

    for (let i = 0; i < howMany; i++) {
        const value = i + 1;
        const tile = createTile(value, canvas.width, canvas.height);
        tileState = tileState.push(tile);
    }

    gameState = gameState.set("totalTiles", howMany);
    state = state.set("game", gameState);
    return state.set("tile", tileState);
};

export const updateTileState = (state: State): State => {
    if (hasGameEnded(state)) {
        return state;
    }

    let tileState: TileState = state.get("tile");

    tileState.forEach((tile, idx) => {
        const position = tile.get("position");
        const velocity = tile.get("velocity");

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

        tile = tile.set("position", position);
        tile = tile.set("velocity", velocity);
        tileState = tileState.set(idx, tile);
    });

    state = state.set("tile", tileState);
    return state;
};

const contains =
    (tile: Tile) =>
    (x: CoordX, y: CoordY): boolean => {
        const pos = tile.get("position");
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

// NOTE: Huge side effect. Accesses and Mutates the `State` directly.
// TODO: Put these type of functions in a better place?
export const registerTileTouchListeners = () => {
    canvas.addEventListener("pointerdown", (event) => {
        if (hasGameEnded(state) || state.get("game").get("showValue")) {
            return;
        }

        const x = event.offsetX;
        const y = event.offsetY;

        let tileState = state.get("tile");
        let gameState = state.get("game");

        tileState.forEach((tile, idx) => {
            if (contains(tile)(x, y)) {
                const totalTiles = gameState.get("totalTiles");
                const currTileValue = tile.get("value");
                const lastTileValue = gameState
                    .get("lastTileClicked")
                    ?.get("value");

                tile = tile.set("selected", true);
                tileState = tileState.set(idx, tile);
                gameState = gameState.set("lastTileClicked", tile);
                setState(state.set("tile", tileState));
                setState(state.set("game", gameState));

                if (!lastTileValue) {
                    if (currTileValue !== 1) {
                        setState(endGame(state));
                        return;
                    }
                } else {
                    if (
                        currTileValue !== lastTileValue + 1 ||
                        currTileValue === totalTiles
                    ) {
                        setState(endGame(state));
                        return;
                    }
                }
            }
        });
    });
};
