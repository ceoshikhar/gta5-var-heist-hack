import { Map, Record } from 'immutable';

import { Id } from './types';
import { generateId } from './utils';

interface Entity extends Record<any> {}
type Entities = Map<Id, Entity>;

let globalEntities: Entities = Map();

export const addEntity = (entity: Entity): Id => {
    const id: Id = generateId();
    globalEntities = globalEntities.set(id, entity);
    return id;
};

export const getEntity = <T extends Entity>(id: Id): T => {
    const entity = globalEntities.get(id);

    if (!entity) {
        throw new Error(`No entity found with id: ${id}`);
    }

    return entity as T;
};

export const setEntity = (id: Id, entity: Entity): void => {
    globalEntities = globalEntities.set(id, entity);
};
