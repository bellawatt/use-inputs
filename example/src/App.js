import React from 'react'
import Report from './Report'
import Textbox from './Textbox'
import { Inputs } from '@bellawatt/use-inputs'

export default () => {
  const defaults = {
    name: '',
    animal: 'platypus',
  }

  const readOnly = {
    someData: 'hello',
  }

  const watchers = {
    name: ({name}) => {
      if (name.length % 2 === 0) {
        return {animal: 'platypus'};
      }

      return {animal: 'manatee'};
    }
  }

  const computed = {
    animals: ({animal, greeting}) => ['stringray', animal, greeting],
  };

  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve({...defaults, greeting: 'hello', ...readOnly});
    }, 3000)
  });

  return (
    <div>
      <Inputs namespace="n1" defaults={promise} watch={watchers} computed={computed} ignore={['greeting', ...Object.keys(readOnly)]} >
        <Textbox />
        <Report />
      </Inputs>
      <Inputs namespace="n2" defaults={promise} watch={watchers} computed={computed} ignore={['greeting', ...Object.keys(readOnly)]} >
        <Textbox />
        <Report />
      </Inputs>
    </div>
  )
}
