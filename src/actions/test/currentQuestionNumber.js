export const NEXT_QUESTION = 'NEXT_QUESTION'
export const PREVIOUS_QUESTION = 'PREVIOUS_QUESTION'
export const SHRINK_FROM_DELETE = 'SHRINK_FROM_DELETE'

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