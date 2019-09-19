import { CHANGE_PERPAGE, RESET_PERPAGE } from "../../actions/questionList/perPage"
import { initialQuestionListState } from "./questionList"

export default function perPage(state, action) {
  switch (action.type) {
    case CHANGE_PERPAGE:
      return action.newPerPage
    case RESET_PERPAGE:
      return initialQuestionListState.perPage
    default:
      return state
  }
}