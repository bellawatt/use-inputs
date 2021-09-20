import {useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react';
import useMergeQueryHistory from './useMergeQueryHistory';

const encodeValue = value => (value && typeof value === 'object') ? JSON.stringify(value) : value
const parseValue = value => {
  try {
    return JSON.parse(value)
  } catch (_err) {
    return value
  }
}

function useQueryString(namespace) {
  const location = useLocation();
  const [queryParams, setQueryParams] = useState([]);
  const currentSearchQuery = new URLSearchParams(location.search);
  const mergeQueryHistory = useMergeQueryHistory();

  useEffect(() => {
    setQueryParams([...currentSearchQuery.entries()].reduce(
    (qs, [key, value]) => {
      let parsedKey = key;

      if (namespace) {
        parsedKey = key.split(`${namespace}_`)[1];

        if (! parsedKey) {
          return qs;
        }
      }

      return {...qs, [parsedKey]: parseValue(value)};
    },
    {}
  ))}, [location.search]);

  function setQueryString (params) {
    const processedParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      processedParams.set(namespace ? `${namespace}_${key}` : key, encodeValue(params[key]));
    }, {});

    mergeQueryHistory(`${processedParams}`)
  }

  return [queryParams, setQueryString]
}

export default useQueryString
