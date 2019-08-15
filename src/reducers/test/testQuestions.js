import { RECEIVE_QUESTIONS } from "../../actions/test/testQuestions";

export default function testQuestions(state, action) {
  switch (action.type) {
    case RECEIVE_QUESTIONS:
      return action.questions
    default:
      break;
  }
}