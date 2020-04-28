import React from 'react'
import { useInputs } from '@bellawatt/use-inputs'

const Report = () => {
  const { name, animal } = useInputs()

  return (
    <div>
      <h1>Data I am Holding</h1>
      <pre>
        name: {name} <br />
        animal: {animal}
      </pre>
    </div>
  )
}

export default Report;
