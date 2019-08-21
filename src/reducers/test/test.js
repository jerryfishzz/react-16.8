import { NEXT_QUESTION, PREVIOUS_QUESTION } from "../../actions/test/currentQuestionNumber";
import currentQuestionNumber from "./currentQuestionNumber";
import { TOGGLE_EDIT, RESET_EDIT } from "../../actions/test/editQuestion";
import editQuestion from "./editQuestion";
import { RECEIVE_QUESTIONS, CLICK_ANSWER, SUBMIT_QUESTION } from "../../actions/test/testQuestions";
import testQuestions from "./testQuestions";

const initialState = { 
  currentQuestionNumber: 0, 
  editQuestion: false,
  testQuestions: []
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
    case RECEIVE_QUESTIONS:
    case CLICK_ANSWER:
    case SUBMIT_QUESTION:
      return {
        ...state,
        testQuestions: testQuestions(state.testQuestions, action)
      }
    default:
      return state
  }
}