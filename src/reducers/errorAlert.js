import { OPEN_ALERT, CLOSE_ALERT } from "../actions/errorAlert";

const initialState = {
  isOpen: false
}

export default function errorAlert(state = initialState, action) {
  switch (action.type) {
    case OPEN_ALERT:
      return {
        isOpen: true
      }
    case CLOSE_ALERT:
      return initialState
    default:
      return state
  }
}