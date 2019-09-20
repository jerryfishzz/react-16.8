import { getQuestionsForListAxios } from "../utils/api"

export const GET_LIST = 'GET_LIST' 

export function getList(list) {
  return {
    type: GET_LIST,
    list
  }
}

export function handleGetList(postType, offset, perPage) {
  return async (dispatch, getState) => {
    let { questionList: { currentPage } } = getState()
// console.log(8888888)
    try {
      const { data, headers } = await getQuestionsForListAxios(postType, offset, perPage)
// console.log(data, headers)
      const totalQuestions = Number(headers['x-wp-total'])

      const previousPages = Math.ceil(offset / perPage)
      const leftPages = Math.ceil((totalQuestions - offset) / perPage)
      const totalPages = previousPages + leftPages

      currentPage = currentPage 
        ? currentPage 
        : totalQuestions ? 1 : 0

      const list = {
        perPage,
        currentPage,
        offset,
        totalQuestions,
        totalPages,
        list: data
      }
// console.log(list)
      dispatch(getList(list))
    } catch(err) {
      throw Error('Get list error')
    }
  }
}