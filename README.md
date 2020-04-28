# use-inputs

> Opinionated Inputs Hook with Context, Query Strings, and Local Storage

[![NPM](https://img.shields.io/npm/v/@bellawatt/use-inputs.svg)](https://www.npmjs.com/package/use-inputs) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @bellawatt/use-inputs
```

## Usage

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

## License

MIT © [@bellawatt](https://github.com/@bellawatt)
