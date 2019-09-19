import { CHANGE_TYPE, RESET_TYPE } from "../actions/postType"

export default function postType(state = 'examples', action) {
  switch (action.type) {
    case CHANGE_TYPE:
      return action.newType
    case RESET_TYPE:
      return 'examples'
    default:
      return state
  }
}