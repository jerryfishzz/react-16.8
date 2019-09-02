import { 
  nextQuestion, 
  previousQuestion, 
  shrinkFromDelete 
} from "./currentQuestionNumber";
import { resetEdit } from "./editQuestion";
import { removeQuestion, submitQuestion, createQuestion } from "./testQuestions";
import { removeQuestionFromWp } from "../../utils/api";

export function handleNext() {
  return dispatch => {
    dispatch(nextQuestion())
    dispatch(resetEdit())
  }
}

export function handleBack() {
  return dispatch => {
    dispatch(previousQuestion())
    dispatch(resetEdit())
  }
}

export function handleRemoveQuestion(id) {
  return (dispatch, getState) => {
    dispatch(removeQuestion(id))
    dispatch(resetEdit())

    const { test: { currentQuestionNumber, testQuestions } } = getState()
    if (currentQuestionNumber === testQuestions.length) {
      dispatch(shrinkFromDelete())
    }
  }
}

export function handleSubmitQuestion(id, index) {
  return dispatch => {
    dispatch(submitQuestion(id, index))
    dispatch(resetEdit())
  }
}

export function handleRemoveQuestionFromWp(id) {
  return (dispatch, getState) => {
    const { test: { currentQuestionNumber, testQuestions } } = getState()
    const currentQuestion = 
      testQuestions.filter(question => question.id === id)[0]

    dispatch(removeQuestion(id))
    dispatch(resetEdit())
    
    if (currentQuestionNumber === testQuestions.length) {
      dispatch(shrinkFromDelete())
    }

    return removeQuestionFromWp(id)
      .catch(err => {
        dispatch(createQuestion(currentQuestion))
        throw err
      })
  }
}
