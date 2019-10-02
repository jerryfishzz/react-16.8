export const STOP_LOADING = 'STOP_LOADING'
export const GET_ERROR = 'GET_ERROR'

export function stopLoading() {
  return {
    type: STOP_LOADING
  }
}

export function getError(err) {
  return {
    type: GET_ERROR,
    err
  }
}