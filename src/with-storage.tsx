import React from 'react';
import { Component, ComponentType } from 'react';
import { StorageType, StorageMap, StorageOperations, StorageValue } from './types';

export const withStorage = <T extends string>(keys: T[] = [], storageType: StorageType = 'local', prefix = '') =>
    <WrappedProps extends object>(WrappedComponent: ComponentType<WrappedProps>): ComponentType<WrappedProps> =>
        (class WithStorageHoc extends Component<WrappedProps,StorageMap> {
            static displayName = `withStorage(${WrappedComponent.displayName || 'Component'})`;
            private storage: Storage = storageType === 'local' ? localStorage : sessionStorage;

            constructor(props: WrappedProps) {
                super(props);
                this.state = this.setupStorage();
            }

            setupStorage = () => keys.reduce((agg: StorageMap, key: T) => {
                agg[key] = this.getOperationsForKey(key);
                return agg;
            }, {} as StorageMap);

            getOperationsForKey = (key: string): StorageOperations=> ([
                this.getItem(key),
                (val: StorageValue) => this.updateItem(key, val),
                () => this.removeItem(key),
            ]);

            prefixKey = (key: string) => !!prefix ? `${prefix}.${key}` : key;
            
            getItem = (key: string): StorageValue => {
                const prefixedKey = this.prefixKey(key);
                const currentJson = this.storage.getItem(prefixedKey);
                return currentJson ? JSON.parse(currentJson) : null;
            }

            updateItem = (key: string, val: StorageValue) => {
                const prefixedKey = this.prefixKey(key);                
                this.storage.setItem(prefixedKey, JSON.stringify(val));
                this.setState({[key]: this.getOperationsForKey(key)});
            }

            removeItem = (key: string) => {
                const prefixedKey = this.prefixKey(key);
                this.storage.removeItem(prefixedKey);
                this.setState({[key]: this.getOperationsForKey(key)});
            }

            render() {
                return (
                    <WrappedComponent {...this.props} {...this.state}/>
                );
            }
        });
