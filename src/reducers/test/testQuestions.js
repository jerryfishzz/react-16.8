import { RECEIVE_QUESTIONS, CLICK_ANSWER, SUBMIT_QUESTION } from "../../actions/test/testQuestions";

export default function testQuestions(state, action) {
  switch (action.type) {
    case RECEIVE_QUESTIONS:
      return action.questions
    case CLICK_ANSWER:
      return state.map(question => {
        if (question.id === action.id) {
          question.selectedAnswer = action.index
        }
        return question
      })
    case SUBMIT_QUESTION:
        return state.map(question => {
          if (question.id === action.id) {
            question.submittedAnswer = action.index
            question.isSubmitted = true
          }
          return question
        })
    default:
      break;
  }
}