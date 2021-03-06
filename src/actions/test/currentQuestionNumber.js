export const NEXT_QUESTION = 'NEXT_QUESTION'
export const PREVIOUS_QUESTION = 'PREVIOUS_QUESTION'
export const SHRINK_FROM_DELETE = 'SHRINK_FROM_DELETE'
export const EXPAND_FROM_RESTORE = 'EXPAND_FROM_RESTORE'
export const RESET_NUMBER = 'RESET_NUMBER'

export function nextQuestion() {
  return {
    type: NEXT_QUESTION
  }
}

export function previousQuestion() {
  return {
    type: PREVIOUS_QUESTION
  }
}

export function shrinkFromDelete() {
  return {
    type: SHRINK_FROM_DELETE
  }
}

export function expandFromRestore() {
  return {
    type: EXPAND_FROM_RESTORE
  }
}

export function resetNumber() {
  return {
    type: RESET_NUMBER
  }
}