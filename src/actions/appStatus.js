export const STOP_LOADING = 'STOP_LOADING'
export const GET_ERROR = 'GET_ERROR'
export const RESET_APPSTATUS = 'RESET_APPSTATUS'
export const START_DELETING = 'START_DELETING'
export const START_EDITING = 'START_EDITING'
export const RESET_ERROR_FROM_API = 'RESET_ERROR_FROM_API'

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

export function startDeleting() {
  return {
    type: START_DELETING
  }
}

export function startEditing() {
  return {
    type: START_EDITING
  }
}

export function resetErrorFromAPI() {
  return {
    type: RESET_ERROR_FROM_API
  }
}