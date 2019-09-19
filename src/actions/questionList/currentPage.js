export const NEXT_PAGE = 'NEXT_PAGE'
export const PREVIOUS_PAGE = 'PREVIOUS_PAGE'
export const RESET_PAGE = 'RESET_PAGE'

export function nextPage() {
  return {
    type: NEXT_PAGE,
  }
}

export function previousPage() {
  return {
    type: PREVIOUS_PAGE,
  }
}

export function resetPage() {
  return {
    type: RESET_PAGE
  }
}