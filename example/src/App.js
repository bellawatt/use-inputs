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

  return (
    <Inputs defaults={defaults} watch={watchers}>
      <Textbox />
      <Report />
    </Inputs>
  )
}
