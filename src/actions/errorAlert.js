export const OPEN_ALERT = 'OPEN_ALERT'
export const CLOSE_ALERT = 'CLOSE_ALERT'

export function openAlert() {
  return {
    type: OPEN_ALERT
  }
}

export function closeAlert() {
  return {
    type: CLOSE_ALERT
  }
}