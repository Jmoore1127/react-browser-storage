import { useState } from 'react';
import { StorageType, StorageMap, StorageValue, StorageOperations, Storable } from './types';

const serialize = (val: StorageValue) => JSON.stringify(val);
const deserialize = (val: string|null): Storable => val ? JSON.parse(val) : null;

export const useStorage = <T extends string>(keys: T[] = [], storageType: StorageType = 'local', prefix = '') => {
    const storage: Storage = storageType === 'local' ? localStorage : sessionStorage;
    const prefixKey = (key: string) => !!prefix ? `${prefix}.${key}` : key;
    const [storageMap, setState] = useState({});    

    const getItem = (key: string): StorageValue => {
        const prefixedKey = prefixKey(key);
        const currentJson = storage.getItem(prefixedKey);
        return deserialize(currentJson);
    }

    const updateItem = (key: string, val: StorageValue) => {
        const prefixedKey = prefixKey(key);                
        storage.setItem(prefixedKey, serialize(val));
        // setState({[key]: getOperationsForKey(key)});
    }

    const removeItem = (key: string) => {
        const prefixedKey = prefixKey(key);
        storage.removeItem(prefixedKey);
        // setState({[key]: getOperationsForKey(key)});
    }

    const getOperationsForKey = (key: string): StorageOperations => ([
        getItem(key),
        (val: StorageValue) => updateItem(key, val),
        () => removeItem(key),
    ]);

    const setupStorage = () => keys.reduce((agg: StorageMap, key: T) => {
        agg[key] = getOperationsForKey(key);
        return agg;
    }, {} as StorageMap);

    setState(setupStorage())

    return {...storageMap};
}