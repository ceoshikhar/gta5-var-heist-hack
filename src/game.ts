import { Id } from './types';
import { Record } from 'immutable';
import { getEntity } from './entity';

enum GameStatus {
    INIT = 'INIT',
    RUNNING = 'RUNNING',
}

export type Game = Record<{
    status: GameStatus;
}>;

export const createGame = (): Game => {
    const game: Game = Record({ status: GameStatus.INIT })();
    return game;
};

export const startGame = (game: Game): Game => {
    return game.set('status', GameStatus.RUNNING);
};

export const isGameRunning = (game: Game): boolean => {
    return game.get('status') === GameStatus.RUNNING ? true : false;
};
