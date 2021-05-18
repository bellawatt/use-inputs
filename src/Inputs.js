import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { useQueryString, useLocalStorage, useDebounceEffect } from '@bellawatt/react-hooks'
import InputContext from './context'
import { omit } from './helpers';

const Inputs = ({defaults, children, options, watch = {}, computed = {}, ignore = []}) => {
  const { debounceDelay = 500, localStorageName = 'inputs' } = options || {}

  const [urlInputs, updateQueryString] = useQueryString()
  const [localInputs, setLocalInputs] = useLocalStorage(localStorageName)
  const hasUrlInputs = Object.keys(urlInputs).length > 0
  const computedParams = Object.keys(computed);
  const fieldsToNotStore = ignore.concat(computedParams);

  const getComputedValues = (originalObj) => computedParams.reduce((fields, key) => {
    return {...fields, [key]: computed[key]({...originalObj})};
  }, {});

  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState(() => {
    if (defaults instanceof Promise) { 
      defaults.then(data => {
        const originalValues = {...data, ...(hasUrlInputs ? urlInputs : localInputs)};

        setInputs({...originalValues, ...getComputedValues(originalValues)});
        setLoading(false);
      });
    
      return {};
    }

    const originalValues = {...defaults, ...(hasUrlInputs ? urlInputs : localInputs)};

    return {...originalValues, ...getComputedValues(originalValues)};
  });


  const setInput = obj => {
    const watcherChanges = Object.keys(obj).reduce((changes, key) => {
      if (! watch[key]) return changes;

      return {...changes, ...(watch[key]({...inputs, ...obj, ...changes}))}
    }, {});

    const objWithWatcher = {...obj, ...watcherChanges};

    setInputs(current => ({...current, ...objWithWatcher, ...getComputedValues({...current, ...objWithWatcher})}))
  }

  useDebounceEffect(
    () => {
      updateQueryString(omit(fieldsToNotStore, inputs))
      setLocalInputs(omit(fieldsToNotStore, inputs))
    },
    debounceDelay,
    [inputs]
  )

  return (
    <InputContext.Provider value={{...inputs, setInput, loading}}>
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
  watch: PropTypes.object,
  computed: PropTypes.object,
  options: PropTypes.shape({
    debounceDelay: PropTypes.number,
    localStorageName: PropTypes.string,
  }),
}

export default Inputs
