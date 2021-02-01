import { storageFactory } from './storageFactory'

export const localStorageFallback = storageFactory(() => localStorage)
