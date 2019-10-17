import { OPEN_BAR, CLOSE_BAR } from "../actions/snackBar"

const initialState = {
  isOpen: false,
  message: '' 
}

export default function snackBar(state = initialState, action) {
  switch (action.type) {
    case OPEN_BAR:
      return {
        isOpen: true,
        message: action.message
      }
    case CLOSE_BAR:
      return initialState
    default:
      return state
  }
}