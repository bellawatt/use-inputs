import {useLocation, useHistory} from 'react-router-dom'

const encodeValue = value => (value && typeof value === 'object') ? JSON.stringify(value) : value
const parseValue = value => {
  try {
    return JSON.parse(value)
  } catch(err) {
    return value
  }
}

function useQueryString() {
  const currentQueryString = new URLSearchParams(useLocation().search)
  const queryParams = [...currentQueryString.entries()].reduce(
    (qs, [key, value]) => ({...qs, [key]: parseValue(value)}),
    {}
  )
  const history = useHistory()

  const setQueryString = (params) => {
    const processedParams = Object.keys(params).reduce((processing, key) => {
      return {...processing, [key]: encodeValue(params[key])}
    }, {})
    const newParams = new URLSearchParams({...currentQueryString, ...processedParams})
    history.replace(`?${newParams}`)
  }

  return [queryParams, setQueryString]
}

export default useQueryString
