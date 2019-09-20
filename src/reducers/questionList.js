import { GET_LIST } from "../actions/questionList"

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
    default:
      return state
  }
}
