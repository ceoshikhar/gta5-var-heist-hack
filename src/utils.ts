import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789', 10);

export const generateId = (): string => {
    return nanoid();
};

export const random = (max = 1, min = 0): number => {
    return Math.random() * (max - min) + min;
};
