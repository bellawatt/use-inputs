import React from 'react'
import { useInputs } from '@bellawatt/use-inputs'

const Report = () => {
  const { name, animal, animals } = useInputs()

  return (
    <div>
      <h1>Data I am Holding</h1>
      <pre>
        name: {name} <br />
        animal: {animal}
      </pre>
      <h3>Cool Animals</h3>
      <ol>
        {animals.map(coolAnimal => (
          <li key={coolAnimal}>{coolAnimal}</li>
        ))}
      </ol>
    </div>
  )
}

export default Report;
