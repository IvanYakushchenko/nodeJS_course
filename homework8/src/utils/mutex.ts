import { Mutex } from 'async-mutex';

export const globalMutex = new Mutex();