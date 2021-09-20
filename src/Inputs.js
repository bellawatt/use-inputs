import React, {useState} from 'react'
import PropTypes from 'prop-types'
import useQueryString from './hooks/useQueryString';
import useLocalStorage from './hooks/useLocalStorage';
import useDebounceEffect from '@bellawatt/use-debounce-effect';
import InputContext from './context'
import { omit } from './helpers';

const Inputs = ({defaults, children, options, namespace, watch = {}, computed = {}, ignore = []}) => {
  const { debounceDelay = 500, localStorageName = 'inputs' } = options || {}

  const [urlInputs, updateQueryString] = useQueryString(namespace)
  const [localInputs, setLocalInputs] = useLocalStorage(`${localStorageName}${namespace ? `.${namespace}` : ''}`)
  const hasUrlInputs = Object.keys(urlInputs).length > 0
  const computedParams = Object.keys(computed);
  const fieldsToNotStore = ignore;
  const [computedInputs, setComputedInputs] = useState({});

  const [loading, setLoading] = useState(defaults instanceof Promise);

  const getComputedValues = (originalObj) => computedParams.reduce((fields, key) => {
    return {...fields, [key]: computed[key]({...originalObj})};
  }, {});

  const [inputs, setInputs] = useState(() => {
    if (defaults instanceof Promise) { 
      defaults.then(data => {
        const newInputs = {...data, ...(hasUrlInputs ? urlInputs : localInputs)};
        setInputs(newInputs);
        setComputedInputs(() => getComputedValues(newInputs));

        setLoading(false);
      });
    
      return {};
    }

    const newInputs = {...defaults, ...(hasUrlInputs ? urlInputs : localInputs)};
    setComputedInputs(getComputedValues(newInputs));
    return newInputs;
  });


  const setInput = obj => {
    const newComputedInputs = getComputedValues({...inputs, ...obj});

    const watcherChanges = Object.keys(obj).reduce((changes, key) => {
      if (! watch[key]) return changes;

      return {...changes, ...(watch[key]({...inputs, ...obj, ...changes, ...newComputedInputs}))}
    }, {});

    const objWithWatcher = {...obj, ...watcherChanges};

    setInputs(current => {
      const newInputs = {...current, ...objWithWatcher}
      setComputedInputs(getComputedValues(newInputs));
      return newInputs;
    });
  }

  useDebounceEffect(
    () => {
      const fieldsToUpdate = omit(fieldsToNotStore, inputs);
      updateQueryString(fieldsToUpdate); 
      setLocalInputs(fieldsToUpdate);
    },
    debounceDelay,
    [inputs]
  )

  return (
    <InputContext.Provider value={{...inputs, ...computedInputs, setInput, loading}}>
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
  namespace: PropTypes.string,
}

export default Inputs
