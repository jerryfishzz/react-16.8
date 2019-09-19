import { NEXT_PAGE, PREVIOUS_PAGE, RESET_PAGE } from "../../actions/questionList/currentPage"
import { initialQuestionListState } from "./questionList"

export default function currentPage(state, action) {
  switch (action.type) {
    case NEXT_PAGE:
      return state + 1
    case PREVIOUS_PAGE:
      return state - 1
    case RESET_PAGE:
      return initialQuestionListState.currentPage
    default:
      return state
  }
}