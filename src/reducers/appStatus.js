import { 
  STOP_LOADING, 
  GET_ERROR, 
  RESET_APPSTATUS, 
  START_EDITING, 
  START_DELETING, 
} from "../actions/appStatus"

const initialAppStatus = {
  isLoading: true,
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
    default:
      return state
  }
}