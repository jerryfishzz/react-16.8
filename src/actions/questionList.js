import { getQuestionsForListAxios } from "../utils/api"

export const GET_LIST = 'GET_LIST' 
export const NEXT_PAGE = 'NEXT_PAGE'
export const PREVIOUS_PAGE = 'PREVIOUS_PAGE'
export const FIRST_PAGE = 'FIRST_PAGE'
export const LAST_PAGE = 'LAST_PAGE'
export const CHANGE_ROWSPERPAGE = 'CHANGE_ROWSPERPAGE'
export const RESET_QUESTIONLIST = 'RESET_QUESTIONLIST'

function getList(list) {
  return {
    type: GET_LIST,
    list
  }
}

export function handleGetList(postType) {
  return async (dispatch, getState) => {
    const { questionList: { page, offset, rowsPerPage } } = getState()

    try {
      const { data, headers } = await getQuestionsForListAxios(postType, offset, rowsPerPage)

      const totalQuestions = Number(headers['x-wp-total'])
      const totalPages = Number(headers['x-wp-totalpages'])
      
      const list = {
        rowsPerPage,
        page,
        offset,
        totalQuestions,
        totalPages,
        list: data
      }

      dispatch(getList(list))
    } catch(err) {
      throw Error('Get list error')
    }
  }
}

function nextPage() {
  // console.log(223333)
  return {
    type: NEXT_PAGE,
  }
}

function previousPage() {
  return {
    type: PREVIOUS_PAGE,
  }
}

// function getCurrentList(postType) {
//   return dispatch => {
//     dispatch(handleGetList(postType))
//   }
// }

export function handleNextPage(postType) {
  return dispatch => {
    dispatch(nextPage())
    dispatch(handleGetList(postType))
  }
}

export function handlePreviousPage(postType) {
  return dispatch => {
    dispatch(previousPage())
    dispatch(handleGetList(postType))
  }
}

function firstPage() {
  return {
    type: FIRST_PAGE
  }
}

export function handleFirstPage(postType) {
  return dispatch => {
    dispatch(firstPage())
    dispatch(handleGetList(postType))
  }
}

function lastPage() {
  return {
    type: LAST_PAGE,
  }
}

export function handleLastPage(postType) {
  return dispatch => {
    dispatch(lastPage())
    dispatch(handleGetList(postType))
  }
}

function changeRowsPerPage(newRowsPerPage) {
  return {
    type: CHANGE_ROWSPERPAGE,
    newRowsPerPage
  }
}

export function handleChangeRowsPerPage(postType, newRowsPerPage) {
  return dispatch => {
    dispatch(changeRowsPerPage(newRowsPerPage))
    dispatch(handleGetList(postType))
  }
}

function resetQuestionList() {
  return {
    type: RESET_QUESTIONLIST
  }
}

export function handleResetQuestionList() {
  return dispatch => {
    dispatch(resetQuestionList())
  }
}