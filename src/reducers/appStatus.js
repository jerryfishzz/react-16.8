import { STOP_LOADING } from "../actions/appStatus"

const initialAppStatus = {
  isLoading: true,
  errorFromAPI: '',
  networkError: false,
}

export default function appStatus(state = initialAppStatus, action) {
  switch (action.type) {
    case STOP_LOADING:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}