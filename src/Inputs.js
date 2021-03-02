import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { useQueryString, useLocalStorage, useDebounceEffect } from '@bellawatt/react-hooks'
import InputContext from './context'
import { omit } from './helpers';

const Inputs = ({defaults, children, options, watch = {}, computed = {}}) => {
  const { debounceDelay = 500, localStorageName = 'inputs' } = options || {}

  const [urlInputs, updateQueryString] = useQueryString()
  const [localInputs, setLocalInputs] = useLocalStorage(localStorageName)
  const hasUrlInputs = Object.keys(urlInputs).length > 0
  const computedParams = Object.keys(computed);

  const getComputedValues = (originalObj) => computedParams.reduce((fields, key) => {
    return {...fields, [key]: computed[key]({...originalObj})};
  }, {});

  const [inputs, setInputs] = useState({
    ...defaults,
    ...(hasUrlInputs ? urlInputs : localInputs),
    ...getComputedValues({...defaults, ...(hasUrlInputs ? urlInputs : localInputs)}),
  })

  const setInput = obj => {
    const watcherChanges = Object.keys(obj).reduce((changes, key) => {
      if (! watch[key]) return changes;

      return {...changes, ...(watch[key]({...inputs, ...obj, ...changes}))}
    }, {});

    const objWithWatcher = {...obj, ...watcherChanges};

    const computedValues = getComputedValues(objWithWatcher);

    setInputs(current => ({...current, ...objWithWatcher, ...computedValues}))
  }

  useDebounceEffect(
    () => {
      updateQueryString(omit(computedParams, inputs))
      setLocalInputs(omit(computedParams, inputs))
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
