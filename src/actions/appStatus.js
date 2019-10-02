export const STOP_LOADING = 'STOP_LOADING'
export const GET_ERROR = 'GET_ERROR'
export const RESET_APPSTATUS = 'RESET_APPSTATUS'

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

export function resetAppStatus() {
  return {
    type: RESET_APPSTATUS
  }
}