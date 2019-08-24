import { nextQuestion, previousQuestion, shrinkFromDelete } from "./currentQuestionNumber";
import { resetEdit } from "./editQuestion";
import { removeQuestion, submitQuestion } from "./testQuestions";

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

