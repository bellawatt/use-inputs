import React from 'react'
import Report from './Report'
import Textbox from './Textbox'
import { Inputs } from '@bellawatt/use-inputs'

export default () => {
  const defaults = {
    name: '',
    animal: 'platypus',
  }

  return (
    <Inputs defaults={defaults}>
      <Textbox />
      <Report />
    </Inputs>
  )
}
