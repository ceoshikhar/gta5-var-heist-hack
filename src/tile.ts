import * as PIXI from 'pixi.js';

import { Id, Velocity } from './types';
import { TILE_BG_COLOR, TILE_SELECTED_BG_COLOR } from './constants';
import { addEntity, getEntity, setEntity } from './entity';

import { Record } from 'immutable';
import { app } from './index';
import { random } from './utils';

type TileOptions = {
    value: number;
    selected: boolean;
    shape: PIXI.Rectangle;
    velocity: Velocity;
};

type Tile = Record<TileOptions>;

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
    if (random() > 0.993) {
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
    const size = 75;
    const maxW = totalWidth - size;
    const maxH = totalHeight - size;

    const x = Math.random() * maxW;
    const y = Math.random() * maxH;
    const shape = new PIXI.Rectangle(x, y, size, size);
    const velocity = randomVelocity(7);

    const selected = false;
    const tile: Tile = Record({
        value,
        selected,
        shape,
        velocity,
    })();
    return tile;
};

export const createTiles = (
    howMany: number,
    totalWidth: number,
    totalHeight: number
): Id[] => {
    const ids: Id[] = [];

    for (let i = 0; i < howMany; i++) {
        const value = i + 1;
        const tile = createTile(value, totalWidth, totalHeight);
        const id = addEntity(tile);
        ids.push(id);
    }

    return ids;
};

export const renderTiles = (ids: Id[]): PIXI.Graphics => {
    const tileGraphics = new PIXI.Graphics();

    for (const id of ids) {
        const tile = getEntity<Tile>(id);
        const shape = tile.get('shape');
        const velocity = tile.get('velocity');

        if (tile.get('selected')) {
            tileGraphics.beginFill(TILE_SELECTED_BG_COLOR);
        } else {
            tileGraphics.beginFill(TILE_BG_COLOR);
        }

        tileGraphics.drawRect(shape.x, shape.y, shape.width, shape.height);
        tileGraphics.endFill();

        shape.x = shape.x + velocity.x;
        shape.y = shape.y + velocity.y;

        const newTile = tile.set('shape', shape);
        setEntity(id, newTile);

        if (shape.bottom > app.screen.bottom || shape.top < app.screen.top) {
            const newTile = tile.set('velocity', {
                ...velocity,
                y: -velocity.y,
            });
            setEntity(id, newTile);
        }

        if (shape.right > app.screen.right || shape.left < app.screen.left) {
            const newTile = tile.set('velocity', {
                ...velocity,
                x: -velocity.x,
            });
            setEntity(id, newTile);
        }

        if (shouldChangeVelocity()) {
            console.log('CHanging velocity');
            const newTile = tile.set('velocity', randomVelocity(7));
            setEntity(id, newTile);
        }
    }

    tileGraphics.interactive = true;

    tileGraphics.on('pointerdown', (e: PIXI.InteractionEvent) => {
        const { x, y } = e.data.global;

        for (const id of ids) {
            const tile = getEntity<Tile>(id);
            const shape = tile.get('shape');

            if (shape.contains(x, y)) {
                const newTile = tile.set('selected', !tile.get('selected'));
                setEntity(id, newTile);
            }
        }
    });

    return tileGraphics;
};
