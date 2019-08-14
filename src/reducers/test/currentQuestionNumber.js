import { NEXT_QUESTION, PREVIOUS_QUESTION } from "../../actions/test/currentQuestionNumber";

export default function currentQuestionNumber(state, action) {
  switch (action.type) {
    case NEXT_QUESTION:
      return state + 1
    case PREVIOUS_QUESTION:
      return state - 1
    default:
      return state
  }
}