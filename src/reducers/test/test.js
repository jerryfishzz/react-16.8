import { NEXT_QUESTION, PREVIOUS_QUESTION } from "../../actions/test/currentQuestionNumber";
import currentQuestionNumber from "./currentQuestionNumber";
import { TOGGLE_EDIT, RESET_EDIT } from "../../actions/test/editQuestion";
import editQuestion from "./editQuestion";

const initialState = { 
  currentQuestionNumber: 0, 
  editQuestion: false
}

export default function test(state = initialState, action) {
  switch (action.type) {
    case NEXT_QUESTION:
    case PREVIOUS_QUESTION:
      return {
        ...state,
        currentQuestionNumber: currentQuestionNumber(state.currentQuestionNumber, action)
      }
    case TOGGLE_EDIT:
    case RESET_EDIT:
      return {
        ...state,
        editQuestion: editQuestion(state.editQuestion, action)
      }
    default:
      return state
  }
}