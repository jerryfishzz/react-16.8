import { 
  RECEIVE_QUESTIONS, 
  CLICK_ANSWER, 
  SUBMIT_QUESTION, 
  REMOVE_QUESTION, 
  SAVE_QUESTION, 
  CREATE_QUESTION,
  RESET_TESTQUESTIONS
} from "../../actions/test/testQuestions";

export default function testQuestions(state, action) {
  switch (action.type) {
    case RECEIVE_QUESTIONS:
      return action.questions
    case CLICK_ANSWER:
      return state.map(question => {
        if (question.id === action.id) {
          // Need to use immutable way
          return {
            ...question,
            selectedAnswers: question.selectedAnswers.indexOf(action.index) !== -1
              ? question.selectedAnswers.filter(selectedAnswer => selectedAnswer !== action.index)
              : [...question.selectedAnswers, action.index]
          }
        }
        return question
      })
    case SUBMIT_QUESTION:
      return state.map(question => {
        if (question.id === action.id) {
          return {
            ...question,
            isSubmitted: true
          }
        }
        return question
      })
    case REMOVE_QUESTION: 
      return state.filter(question => question.id !== action.id )
    case SAVE_QUESTION: 
      return state.map(question => {
        if (question.id === action.updatedQuestion.id) {
          return action.updatedQuestion
        }
        return question
      })
    case CREATE_QUESTION:
      return [
        ...state,
        action.newQuestion
      ]
    case RESET_TESTQUESTIONS:
      return null
    default:
      break;
  }
}