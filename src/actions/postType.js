export const CHANGE_TYPE = 'CHANGE_TYPE'
export const RESET_TYPE = 'RESET_TYPE'

export function changeType(newType) {
  return {
    type: CHANGE_TYPE,
    newType
  }
}

export function resetType() {
  return {
    type: RESET_TYPE
  }
}