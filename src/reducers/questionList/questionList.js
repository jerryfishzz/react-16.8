import { CHANGE_PERPAGE, RESET_PERPAGE } from "../../actions/questionList/perPage";
import perPage from "./perPage";
import { NEXT_PAGE, PREVIOUS_PAGE, RESET_PAGE } from "../../actions/questionList/currentPage";
import currentPage from "./currentPage";

export const initialQuestionListState = {
  perPage: 5,
  currentPage : 1
}

export default function questionList(state = initialQuestionListState, action) {
  switch (action.type) {
    case CHANGE_PERPAGE:
    case RESET_PERPAGE:
      return {
        ...state,
        perPage: perPage(state.perPage, action)
      }
    case NEXT_PAGE:
    case PREVIOUS_PAGE:
    case RESET_PAGE:
      return {
        ...state,
        currentPage: currentPage(state.currenPage, action)
      }
    default:
      return state
  }
}