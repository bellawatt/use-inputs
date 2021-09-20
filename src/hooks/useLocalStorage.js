export default function useLocalStorage(key) {
  const storage = window.localStorage
  const value = JSON.parse(storage.getItem(key))

  const set = newValue => {
    storage.setItem(key, JSON.stringify(newValue))
  }

  return [value, set]
}
