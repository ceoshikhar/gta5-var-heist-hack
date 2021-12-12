import * as PIXI from 'pixi.js';

import { createTiles, renderTiles } from './tile';

import { BG_COLOR } from './constants';

const app = new PIXI.Application({
    width: 960,
    height: 540,
    backgroundColor: BG_COLOR,
});

const container = new PIXI.Container();

app.stage.addChild(container);
app.view.id = 'game-canvas';
document.body.appendChild(app.view);

const tileIds = createTiles(2, app.view.width, app.view.height);

app.ticker.add(() => {
    renderTiles(tileIds, app);
});
