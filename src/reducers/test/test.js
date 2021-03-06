import { 
  NEXT_QUESTION, 
  PREVIOUS_QUESTION, 
  SHRINK_FROM_DELETE, 
  RESET_NUMBER, 
  EXPAND_FROM_RESTORE
} from "../../actions/test/currentQuestionNumber";
import currentQuestionNumber from "./currentQuestionNumber";
import { TOGGLE_EDIT, RESET_EDIT } from "../../actions/test/editQuestion";
import editQuestion from "./editQuestion";
import { 
  RECEIVE_QUESTIONS, 
  CLICK_ANSWER, 
  SUBMIT_QUESTION, 
  REMOVE_QUESTION, 
  SAVE_QUESTION, 
  CREATE_QUESTION,
  RESET_TESTQUESTIONS,
  RESTORE_QUESTION
} from "../../actions/test/testQuestions";
import testQuestions from "./testQuestions";
import { PLUS_OFFSET, MINUS_OFFSET, RESET_TEST_OFFSET } from "../../actions/test/offset";
import offset from "./offset";

const initialState = { 
  currentQuestionNumber: 0, 
  editQuestion: false,
  testQuestions: null,
  offset: 0
}

export default function test(state = initialState, action) {
  switch (action.type) {
    case NEXT_QUESTION:
    case PREVIOUS_QUESTION:
    case SHRINK_FROM_DELETE:
    case EXPAND_FROM_RESTORE:
    case RESET_NUMBER:
      return {
        ...state,
        currentQuestionNumber: 
          currentQuestionNumber(state.currentQuestionNumber, action)
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
    case REMOVE_QUESTION:
    case SAVE_QUESTION:
    case CREATE_QUESTION:
    case RESET_TESTQUESTIONS:
    case RESTORE_QUESTION:
      return {
        ...state,
        testQuestions: testQuestions(state.testQuestions, action)
      }
    case PLUS_OFFSET:
    case MINUS_OFFSET:
    case RESET_TEST_OFFSET:
      return {
        ...state,
        offset: offset(state.offset, action)
      }
    default:
      return state
  }
}