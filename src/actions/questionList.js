import { getQuestionsForListAxios } from "../utils/api"

export const GET_LIST = 'GET_LIST' 
export const NEXT_PAGE = 'NEXT_PAGE'
export const PREVIOUS_PAGE = 'PREVIOUS_PAGE'
export const FIRST_PAGE = 'FIRST_PAGE'
export const LAST_PAGE = 'LAST_PAGE'

function getList(list) {
  return {
    type: GET_LIST,
    list
  }
}

export function handleGetList(postType) {
  return async (dispatch, getState) => {
    let { questionList: { page, offset, rowsPerPage } } = getState()

    try {
      const { data, headers } = await getQuestionsForListAxios(postType, offset, rowsPerPage)

      const totalQuestions = Number(headers['x-wp-total'])

      const previousPages = Math.ceil(offset / rowsPerPage)
      const leftPages = Math.ceil((totalQuestions - offset) / rowsPerPage)
      const totalPages = previousPages + leftPages

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