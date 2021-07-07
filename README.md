# use-inputs

> Opinionated Inputs Hook with Context, Query Strings, and Local Storage

[![NPM](https://img.shields.io/npm/v/@bellawatt/use-inputs.svg)](https://www.npmjs.com/package/use-inputs) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @bellawatt/use-inputs
```

## Basic Usage
In its simplest form, `use-inputs` allows you to set and modify app-wide data using React's built in context api. 

To get started, simply wrap your application in the `Inputs` component and provide an object of `defaults`. Out of the box,
`use-inputs` provides you with app-wide state that is automatically kept up to date with url-params and local storage.

```jsx
import React from 'react'
import { Inputs } from '@bellawatt/use-inputs'
import ChildComponent from './ChildComponent'

const ParentComponent = () => (
  <Inputs defaults={{name: 'Brandon'}}>
    <ChildComponent />
  </Inputs>
)

export default ParentComponent

```

```jsx
import React from 'react'
import { useInputs } from '@bellawatt/use-inputs'

const ChildComponent = () => {
  const { setInput, name } = useInputs()

  return (
    <label>
      Name
      <input type="text" value={name} onChange={e => setInput({name: e.currentTarget.value})} />
    </label>
  )
}

export default ChildComponent
```

### useInputs hook
As shown above, the `useInputs()` hook returns an object intended to be destructured. The object keys will always have a 
`setInput` method that can be called to change any number of inputs and the remaining keys will be each value you've stored.

### setInput method
`setInput` is always available to be destructured from the `useInputs` hook. It accepts an object of key-values to be changed and supports changing any number of values at once. `setInput` automatically handles merging changes in with existing values, so you only ever need to send the specific values you want to be changed.

## Advanced Usage

While basic state changes and static defaults cover the majority of use-cases, sometimes our apps need to model state in a more complicated way. 
`use-inputs` provides a few advanced tools to help cover these edge cases.

### Computed Properties

Computed properties allow you to either create new properties or manipulate existing properties before they reach your components. 

```jsx
  const computed = {
    fullName: ({firstName, lastName}) => `${firstName} ${lastName}`,
    birthdate: ({birthdate}) => new Date(`${birthdate} 00:00:00`),
  };

  <Inputs defaults={{firstName: 'Brandon', lastName: 'Shar', birthdate: '1989-03-29'}} computed={computed}>
    <App />
  </Inputs>

  // Inside of the app component:
  const {fullName, birthdate} = useInputs();
  const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365;
  
  return (
    <div>{fullName} is {((new Date()) - birthdate) / millisecondsPerYear} years old!</div>
  );
```


Computed properties functions are passed all of the currently stored **raw** state. Computed properties never receive already computed results and should not be assumed to executed in any particular order.

**Computed properties are never stored in the URL or Local Storage and are always calculated in real time. In the case that an existing property is overwritten, like the "birthdate" example above, the original string value will still be stored in both the URL and Local Storage, NOT the value returned from computed**


### Watched Properties

Sometimes, you may have pieces of tightly coupled state that need to change together, but you still want to store each piece of state independently. For example, imagine selecting a vehicle make & model. When the make switches, you may want to update the currently selected model, but you still want the model to be able to be selected independently, so a computed property isn't the right choice. In this case, we can use `watchers`.

```jsx
  import getModelsByMake from '../functions/getModelsByMake';

  const watchers = {
    make: ({make}) => {
      const firstModelByMake = getModelsByMake(make)[0];

      return {
        model: firstModelByMake,
      };
    }
  };

  <Inputs defaults={{make: 'Toyota', model: 'Tacoma'}} watch={watchers}>
    <App />
  </Inputs>
```
Watchers are defined similarly to computed properties and also receive all current state as an argument, but because they are changing state, they return an object that will be merged in with the existing state. A single watcher can change multiple state values if need be.

Contrary to computed properties, watched properties are stored in both URL params and Local Storage because they are considered normal state.

In the above example, both `make` and `model` can be read and overwritten normally.

**Watchers ONLY execute when the watched value is CHANGED. They will not fire on initial load**

**When working with both watchers and computed properties, do not assume they will be executed in any particular order.**

### Ignored Properties

Sometimes you may want to store some information in global state that you don't to store locally for the user. Maybe it's because of size, maybe it's because it may change or comes from an API, etc. In this case, you can use `ignored properties`.

```jsx
  import hugeListOfVehicles from '../data/vehicles';
  const defaults = {name: 'Brandon', vehicles: hugeListOfVehicles};

  <Inputs defaults={defaults} ignored={['vehicles']}>
    <App />
  </Inputs>
```  

Ignored properties will never be added to the URL or Local Storage, but they can be accessed and edited the same as any other state. 

### Promise Defaults

Sometimes your defaults aren't ready when your app first loads. Perhaps they come from an API or a particularly slow function. In this case, you can pass a promise as your initital default.

```jsx
  const getDefaultsFromApi = '../functions/getDefaultsFromApi';
  // this must return a promise/async function
  
  <Inputs defaults={getDefaultsFromApi()}>
    <App />
  </Inputs>
```

If you pass a promise, you can use the additional state property `loading` to determine whether or not the promise has resolved.

```jsx
  const App = () => {
    const { loading, name } = useInputs();

    return (
      <div>
        {loading ? '...' : name}
      </div>
    )
  }
```

To avoid tricky guard clause situations, when using default promises computed properties will also not be available until the promise resolves.

### Options
An options object can be passed to the initial inputs component. The options provided are as follows:

**debounceDelay**: How long to wait between changes before updating both the URL and Local Storage in milliseconds. Default: `500`.

**localStorageName**: Name of the local storage key that `use-inputs` stores internal data in. Default: `inputs'`.

```jsx
  <Inputs defaults={{name: 'Brandon'}} options={{debounceDelay: 1000, localStorageName: 'storedInputs'}}>
    <App />
  </Inputs>
```
## License

MIT © [@bellawatt](https://github.com/bellawatt)
