# react-browser-storage
Simple, Easy, Local (or Session) Storage in React

* Simple API
* Easily Composable
* Fully Typed
* Thoroughly Tested

# Installation
This project requires react to work.

Add with NPM or Yarn.

`npm install -save react-browser-storage`

`yarn add react-browser-storage`

# Usage

```
//MyComponent.ts
import { withStorage, StorageOperations } from 'react-browser-storage';

const MyComponent = ({ myKey: StorageOperations }) => {
    const [ myValue, setMyKey, clearMyKey ] = myKey;

    return (<div>myKey currently has the value {myValue}</div>);
};

export default withStorage(['myKey'])(MyComponent);
```

# API
### `withStorage`
HOC to help manage persistent storage for your component. Accepts a list of keys which are managed. For each key an identically named prop will be passed to your component with the current value, a setter function, and a delete function. 

#### Parameters
- `keys` __required__ An array of strings which you want to manage. Must be a valid object property (i.e. no spaces, reserved characters, etc.)
- `storageType` either 'local' or 'session'. Defaults to 'local'
- `prefix` _optional_ Allows you to prefix common keys such as 'auth' to avoid collisions

#### Returns
- A function which accepts a Component to wrap

#### Example
```
const MyComponentWithStorage = withStorage(['myKey'], 'session', 'my_app')(MyComponent);
```

# Examples
```
import { withStorage } from 'react-browser-storage';

const Counter = ({ count }) => {
    const [ currentCount, setCount, clearCount ] = count;

    return (
        <div>
            <div>Count: {currentCount}</div>
            <button onClick={() => setCount(currentCount + 1)}>Increment</button>
            <button onClick={() => setCount(currentCount - 1)}>Increment</button>
            <button onClick={() => clearCount}>Reset</button>
        </div>);
}

export default withStorage(['count'])(Counter);
```