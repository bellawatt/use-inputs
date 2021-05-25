import React from 'react'
import { useInputs } from '@bellawatt/use-inputs'

const Textbox = () => {
  const { setInput, name, loading } = useInputs()

  return loading ? null : (
    <label>
      Name
      <input type="text" value={name} onChange={e => setInput({name: e.currentTarget.value})} />
    </label>
  )
}

export default Textbox
