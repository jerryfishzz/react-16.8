import { GET_LIST, NEXT_PAGE, PREVIOUS_PAGE } from "../actions/questionList"

export const initialQuestionListState = {
  rowsPerPage: 5,
  page : 0,
  offset: 0,
  totalQuestions: null,
  totalPages: 0,
  list: []
}

export default function questionList(state = initialQuestionListState, action) {
  switch (action.type) {
    case GET_LIST:
      return action.list
    case NEXT_PAGE:
      return {
        ...state,
        page: state.page + 1,
        offset: state.offset + action.rowsPerPage
      }
    case PREVIOUS_PAGE:
      return {
        ...state,
        page: state.page - 1,
        offset: state.offset - action.rowsPerPage
      }
    default:
      return state
  }
}
