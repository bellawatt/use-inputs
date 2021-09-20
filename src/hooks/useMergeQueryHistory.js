import {useHistory} from 'react-router-dom';

export default function useMergeQueryHistory() {
  const history = useHistory();

  return (newParams) => {
    const queryString = (
      new URLSearchParams({
        ...Object.fromEntries(new URLSearchParams(history.location.search)),
        ...Object.fromEntries(new URLSearchParams(newParams)),
      })
    );
    history.replace(`?${queryString}`);
  };
}
