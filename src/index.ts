import * as PIXI from 'pixi.js';

import { createTiles, renderTiles } from './tile';

import { BG_COLOR } from './constants';
import Stats from 'stats.js';

export const app = new PIXI.Application({
    width: 960,
    height: 540,
    backgroundColor: BG_COLOR,
});

app.view.id = 'game-canvas';
document.body.appendChild(app.view);

const stats = new Stats();
document.body.appendChild(stats.dom);

const container = new PIXI.Container();
app.stage.addChild(container);

const tileIds = createTiles(6, app.view.width, app.view.height);

app.ticker.add(() => {
    stats.begin();

    app.stage.removeChildren();
    renderTiles(tileIds);

    stats.end();
});
