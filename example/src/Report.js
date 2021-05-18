import React from 'react'
import { useInputs } from '@bellawatt/use-inputs'

const Report = () => {
  const { name, animal, animals, greeting, loading } = useInputs()

  return loading ? <div>Loading...</div> : (
    <div>
      <h1>{greeting} {name}!</h1>
      <h1>Data I am Holding</h1>
      <pre>
        name: {name} <br />
        animal: {animal}
      </pre>
      <h3>Cool Animals</h3>
      <ol>
        {animals.map((coolAnimal, i) => (
          <li key={i}>{coolAnimal}</li>
        ))}
      </ol>
    </div>
  )
}

export default Report;
