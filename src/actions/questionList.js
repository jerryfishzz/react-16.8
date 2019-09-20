import { getQuestionsForListAxios } from "../utils/api"

export const GET_LIST = 'GET_LIST' 

export function getList(list) {
  return {
    type: GET_LIST,
    list
  }
}

export function handleGetList(postType, offset, rowsPerPage) {
  return async (dispatch, getState) => {
    let { questionList: { page } } = getState()

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