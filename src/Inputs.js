import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { useQueryString, useLocalStorage, useDebounceEffect } from '@bellawatt/react-hooks'
import InputContext from './context'

const Inputs = ({defaults, children, options}) => {
  const { debounceDelay = 500, localStorageName = 'inputs' } = options || {}

  const [urlInputs, updateQueryString] = useQueryString()
  const [localInputs, setLocalInputs] = useLocalStorage(localStorageName)
  const hasUrlInputs = Object.keys(urlInputs).length > 0

  const [inputs, setInputs] = useState({
    ...defaults,
    ...(hasUrlInputs ? urlInputs : localInputs),
  })

  const setInput = obj => setInputs(current => ({...current, ...obj}))

  useDebounceEffect(
    () => {
      updateQueryString(inputs)
      setLocalInputs(inputs)
    },
    debounceDelay,
    [inputs]
  )

  return (
    <InputContext.Provider value={{...inputs, setInput}}>
      {children}
    </InputContext.Provider>
  )
}

Inputs.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  defaults: PropTypes.object,
  options: PropTypes.shape({
    debounceDelay: PropTypes.number,
    localStorageName: PropTypes.string,
  }),
}

export default Inputs
