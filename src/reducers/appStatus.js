import { 
  STOP_LOADING, 
  GET_ERROR, 
  RESET_APPSTATUS, 
  START_EDITING, 
  START_DELETING,
  RESET_ERROR_FROM_API, 
} from "../actions/appStatus"

const initialAppStatus = {
  isLoading: true, 
  // Mainly for header. The loading status of Main pages still need to be decided
  // by their own key elements.

  errorFromAPI: 0,
  networkError: false,
  lastAction: ''
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
    case START_EDITING:
      return {
        ...state,
        lastAction: 'Editing'
      }
    case START_DELETING:
      return {
        ...state,
        lastAction: 'Deleting'
      }
    case RESET_ERROR_FROM_API:
      return {
        ...state,
        errorFromAPI: 0
      }
    default:
      return state
  }
}