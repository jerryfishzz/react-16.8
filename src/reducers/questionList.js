import { GET_LIST, NEXT_PAGE, PREVIOUS_PAGE, FIRST_PAGE, LAST_PAGE, CHANGE_ROWSPERPAGE, RESET_QUESTIONLIST, UPDATE_RECORD } from "../actions/questionList"

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
        offset: state.offset + state.rowsPerPage
      }
    case PREVIOUS_PAGE:
      return {
        ...state,
        page: state.page - 1,
        offset: state.offset - state.rowsPerPage >= 0
          ? state.offset - state.rowsPerPage
          : 0
      }
    case FIRST_PAGE:
      return {
        ...state,
        page: initialQuestionListState.page,
        offset: initialQuestionListState.offset
      }
    case LAST_PAGE:
      return {
        ...state,
        page: state.page + Math.floor((state.totalQuestions - state.offset) / state.rowsPerPage),
        offset: state.offset + Math.floor((state.totalQuestions - state.offset) / state.rowsPerPage) * state.rowsPerPage
      }
    case CHANGE_ROWSPERPAGE:
      return {
        ...state,
        rowsPerPage: action.newRowsPerPage,
        page: initialQuestionListState.page,
        offset: initialQuestionListState.offset
      }
    case RESET_QUESTIONLIST:
      return initialQuestionListState
    case UPDATE_RECORD:
      return {
        ...state,
        list: state.list.map(row => {
          if (row.id === action.updatedRecord.id) {
            return {
              ...row,
              title: action.updatedRecord.title,
              modified: action.updatedRecord.modified
            }
          }

          return row
        })
      }
    default:
      return state
  }
}
