import { PLUS_OFFSET, MINUS_OFFSET } from "../../actions/test/offset"

export default function offset(state, action) {
  switch (action.type) {
    case PLUS_OFFSET:
      return state + 1
    case MINUS_OFFSET:
      return state - 1
    default:
      return state
  }
}