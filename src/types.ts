export type StorageType = 'local'|'session';
export type Storable = boolean|string|number|object;
export type StorageValue<T = Storable> = T|null;
export type StorageSetter<T = Storable> = (a: T) => void;
export type StorageRemover = () => void;
export type StorageOperations<T = Storable> = [StorageValue<T>, StorageSetter<T>, StorageRemover];

export interface StorageMap {
    [key: string]: StorageOperations<Storable>;
};
