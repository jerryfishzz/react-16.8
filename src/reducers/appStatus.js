import { STOP_LOADING, GET_ERROR, RESET_APPSTATUS } from "../actions/appStatus"

const initialAppStatus = {
  isLoading: true,
  errorFromAPI: 0,
  networkError: false,
}

export default function appStatus(state = initialAppStatus, action) {
  switch (action.type) {
    case STOP_LOADING:
      return {
        ...state,
        isLoading: false
      }
    case GET_ERROR:
      return {
        ...state,
        errorFromAPI: action.err
      }
    case RESET_APPSTATUS:
      return initialAppStatus
    default:
      return state
  }
}