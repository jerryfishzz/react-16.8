export const TOGGLE_EDIT = 'TOGGLE_EDIT'
export const RESET_EDIT = 'RESET_EDIT'

export function toggleEdit() {
  return {
    type: TOGGLE_EDIT
  }
}

export function resetEdit() {
  return {
    type: RESET_EDIT,
  }
}