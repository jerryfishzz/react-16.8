export const PLUS_OFFSET = 'PLUS_OFFSET'
export const MINUS_OFFSET = 'MINUS_OFFSET'

export function plusOffset() {
  return {
    type: PLUS_OFFSET
  }
}

export function minusOffset() {
  return {
    type: MINUS_OFFSET
  }
}