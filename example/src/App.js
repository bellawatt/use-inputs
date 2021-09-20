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
      resolve({...defaults, greeting: 'hello', vehicles: [{make: 'Ford', model: 'hide this'}, {make: 'Toyota', model: 'hide this'}], super: {secret: {stuff: 'hey', x: 'keep this'}, y: 'keep this, too'}, secret: {keep: 'hey', stuff: 'hey again'}});
    }, 3000)
  });

  return (
    <Inputs defaults={promise} watch={watchers} computed={computed} ignore={['greeting', 'vehicles.[].model', 'vehicles.[].color', 'secret.stuff', 'super.secret.stuff', 'secret.other', 'super.secret.other']} >
      <Textbox />
      <Report />
    </Inputs>
  )
}
