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
    case RESTORE_QUESTION:
      return state.reduce((acc, cur, index) => {
        if (index === action.index) {
          acc.push(action.question)
          acc.push(cur)
          return acc
        }
        // Handle the case when the deleting one is the last
        if (index + 1 === action.index && index + 1 === state.length) {
          acc.push(cur)
          acc.push(action.question)
          return acc
        }
        acc.push(cur)
        return acc
      }, [])
    case RESET_TESTQUESTIONS:
      return null
    default:
      break;
  }
}