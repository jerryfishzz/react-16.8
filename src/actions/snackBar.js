export const OPEN_BAR = 'OPEN_BAR'
export const CLOSE_BAR = 'CLOSE_BAR'

export function openBar(message) {
  return {
    type: OPEN_BAR,
    message
  }
}

export function closeBar() {
  return {
    type: CLOSE_BAR
  }
}