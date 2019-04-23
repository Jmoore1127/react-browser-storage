import React from 'react';
import { shallow } from 'enzyme';
import { withStorage } from "./with-storage.hoc";

const TestComponent = () => <div />;

const renderComponent = (storageType, prefix) => {
    const StorageComponent = withStorage(['test'], storageType, prefix)(TestComponent);
    const wrapper = shallow(<StorageComponent />);
    const props = wrapper.find(TestComponent).props();
    return {
        StorageComponent,
        wrapper,
        props
    };
}

describe('WithLocalStorage', () => {
    afterEach(() => {
        jest.restoreAllMocks();
        localStorage.clear();
    });

    it('returns a function from hoc', () => {
        const actual = typeof withStorage();
        const expected = 'function';
        expect(actual).toBe(expected);
    });

    it('has a useful display name', () => {
        const StorageComponent = withStorage(['test'], 'session')(TestComponent);
        expect(StorageComponent.displayName).toContain("withStorage");
    });

    it('renders the subcomponent specified', () => {
        const StorageComponent = withStorage(['test'])(TestComponent);
        const wrapper = shallow(<StorageComponent />);
        expect(wrapper.find(TestComponent)).toHaveLength(1);
    });

    it('passes props based on keys', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => true);
        const { props: { test }} = renderComponent();
        expect(test).toBeDefined;
        expect(test).toHaveLength(3);
        expect(test[0]).toBeTruthy();
        expect(typeof test[1]).toBe('function');
        expect(typeof test[2]).toBe('function');
    });

    it('used the prefix for keys', () => {
        const spy = jest.spyOn(Storage.prototype, 'setItem');
        const { props: { test }} = renderComponent('local', 'testPrefix');
        expect(test).toHaveLength(3);
        test[1](true);
        expect(spy).toHaveBeenCalledWith('testPrefix.test', 'true');
    });

    it('doesn\'t use prefix by default', () => {
        const spy = jest.spyOn(Storage.prototype, 'setItem');
        const { props: { test }} = renderComponent();
        expect(test).toHaveLength(3);
        test[1](true);
        expect(spy).toHaveBeenCalledWith('test', 'true');
    });

    it('decodes json objects on read', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => '{"myKey": true}');
        const { props: { test }} = renderComponent('local', 'testPrefix');        
        expect(test[0]).toMatchObject({myKey: true});
    });

    it('encodes objects to json on write', () => {
        const spy = jest.spyOn(Storage.prototype, 'setItem');
        const { props: { test }} = renderComponent('local', 'testPrefix');
        test[1]({k: 'testVal'});
        expect(spy).toHaveBeenCalledWith('testPrefix.test', '{"k":"testVal"}');
    });

    it('clears keys from storage', () => {
        const spy = jest.spyOn(Storage.prototype, 'removeItem');
        const { props: { test }} = renderComponent('local', 'testPrefix');
        test[2]();
        expect(spy).toHaveBeenCalled;
    });

    it('can use session storage based on hoc params', () => {
        const StorageComponent = withStorage(['test'], 'session')(TestComponent);
        const instance = new StorageComponent();
        expect(instance.storage).toStrictEqual(sessionStorage);
    });

    it('can use local storage based on hoc params', () => {
        const StorageComponent = withStorage(['test'], 'local')(TestComponent);
        const instance = new StorageComponent();
        expect(instance.storage).toStrictEqual(localStorage);
    });
});