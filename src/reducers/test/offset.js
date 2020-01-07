import { PLUS_OFFSET, MINUS_OFFSET, RESET_TEST_OFFSET } from "../../actions/test/offset"

export default function offset(state, action) {
  switch (action.type) {
    case PLUS_OFFSET:
      return state + 1
    case MINUS_OFFSET:
      return state - 1
    case RESET_TEST_OFFSET:
      return 0
    default:
      return state
  }
}