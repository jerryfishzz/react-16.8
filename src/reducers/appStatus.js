import { 
  STOP_LOADING, 
  GET_ERROR, 
  RESET_APPSTATUS, 
  START_EDITING, 
  START_DELETING, 
  RESET_USER_BEHAVIOR
} from "../actions/appStatus"

const BROWSING = 'Browsing'
const DELETING = 'Deleting'
const EDITING = 'Editing'

const initialAppStatus = {
  isLoading: true,
  errorFromAPI: 0,
  networkError: false,
  userBehavior: BROWSING
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
        userBehavior: EDITING
      }
    case START_DELETING:
      return {
        ...state,
        userBehavior: DELETING
      }
    case RESET_USER_BEHAVIOR:
      return {
        ...state,
        userBehavior: BROWSING
      }
    default:
      return state
  }
}