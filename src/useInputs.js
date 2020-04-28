import {useContext} from 'react'
import InputContext from './context'

export default function useInputs() {
  return useContext(InputContext)
}
