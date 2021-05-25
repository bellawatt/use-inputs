import React from 'react'
import Report from './Report'
import Textbox from './Textbox'
import { Inputs } from '@bellawatt/use-inputs'

export default () => {
  const defaults = {
    name: '',
    animal: 'platypus',
  }

  const watchers = {
    name: ({name}) => {
      if (name.length % 2 === 0) {
        return {animal: 'playtpus'};
      }

      return {animal: 'manatee'};
    }
  }

  const computed = {
    animals: ({animal, greeting}) => ['stringray', animal, greeting],
  };

  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve({...defaults, greeting: 'hello'});
    }, 3000)
  });

  return (
    <Inputs defaults={promise} watch={watchers} computed={computed} ignore={['greeting']} >
      <Textbox />
      <Report />
    </Inputs>
  )
}
