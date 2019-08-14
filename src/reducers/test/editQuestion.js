import { TOGGLE_EDIT, RESET_EDIT } from "../../actions/test/editQuestion";

export default function editQuestion(state, action) {
  switch (action.type) {
    case TOGGLE_EDIT:
      return !state
    case RESET_EDIT:
      return false
    default:
     return state
  }
}