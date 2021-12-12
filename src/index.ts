import * as PIXI from 'pixi.js';

import { createTiles, renderTiles } from './tile';

import { BG_COLOR } from './constants';

export const app = new PIXI.Application({
    width: 960,
    height: 540,
    backgroundColor: BG_COLOR,
});

app.view.id = 'game-canvas';
document.body.appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

const tileIds = createTiles(6, app.view.width, app.view.height);

app.ticker.add(() => {
    app.stage.removeChildren();
    app.stage.addChild(renderTiles(tileIds));
});
