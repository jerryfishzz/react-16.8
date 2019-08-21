import { RECEIVE_QUESTIONS, CLICK_ANSWER } from "../../actions/test/testQuestions";

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
    default:
      break;
  }
}