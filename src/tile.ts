import * as PIXI from 'pixi.js';

import { TILE_BG_COLOR, TILE_SELECTED_BG_COLOR } from './constants';
import { addEntity, getEntity, setEntity } from './entity';

import { Id } from './types';
import { Record } from 'immutable';

type TileOptions = {
    value: number;
    selected: boolean;
    shape: PIXI.Rectangle;
};

type Tile = Record<TileOptions>;

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

    const selected = false;
    const tile: Tile = Record({ value, selected, shape })();
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

export const renderTiles = (
    ids: Id[],
    app: PIXI.Application
): PIXI.Graphics => {
    const tileGraphics = new PIXI.Graphics();

    for (const id of ids) {
        const tile = getEntity<Tile>(id);
        const shape = tile.get('shape');

        if (tile.get('selected')) {
            tileGraphics.beginFill(TILE_SELECTED_BG_COLOR);
        } else {
            tileGraphics.beginFill(TILE_BG_COLOR);
        }

        tileGraphics.drawRect(shape.x, shape.y, shape.width, shape.height);
        tileGraphics.endFill();
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

    app.stage.addChild(tileGraphics);

    return tileGraphics;
};
