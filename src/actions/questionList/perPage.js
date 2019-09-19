export const CHANGE_PERPAGE = 'CHANGE_PERPAGE'
export const RESET_PERPAGE = 'RESET_PERPAGE'

export function changePerPage(newPerPage) {
  return {
    type: CHANGE_PERPAGE,
    newPerPage
  }
}

export function resetPerPage() {
  return {
    type: RESET_PERPAGE
  }
}