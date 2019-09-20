import { getQuestionsForListAxios } from "../utils/api"

export const GET_LIST = 'GET_LIST' 
export const NEXT_PAGE = 'NEXT_PAGE'
export const PREVIOUS_PAGE = 'PREVIOUS_PAGE'

function getList(list) {
  return {
    type: GET_LIST,
    list
  }
}

export function handleGetList(postType, offset, rowsPerPage) {
  return async (dispatch, getState) => {
    let { questionList: { page } } = getState()
console.log(222222)
    try {
      const { data, headers } = await getQuestionsForListAxios(postType, offset, rowsPerPage)

      const totalQuestions = Number(headers['x-wp-total'])

      const previousPages = Math.ceil(offset / rowsPerPage)
      const leftPages = Math.ceil((totalQuestions - offset) / rowsPerPage)
      const totalPages = previousPages + leftPages

      page = page ? page : (totalQuestions ? 1 : 0)

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

export function nextPage(rowsPerPage) {
  // console.log(223333)
  return {
    type: NEXT_PAGE,
    rowsPerPage
  }
}

export function previousPage() {
  return {
    type: PREVIOUS_PAGE,
  }
}

export function handleNextPage(postType, rowsPerPage) {
  return (dispatch, getState) => {
    dispatch(nextPage(rowsPerPage))

    const { questionList: { offset } } = getState()
    console.log(postType, offset, rowsPerPage)
    dispatch(handleGetList(postType, offset, rowsPerPage))
  }
}