import { 
  nextQuestion, 
  previousQuestion, 
  shrinkFromDelete, 
  resetNumber
} from "./currentQuestionNumber";
import { resetEdit } from "./editQuestion";
import { removeQuestion, submitQuestion, createQuestion, resetTestquestions } from "./testQuestions";
import { removeQuestionFromWp } from "../../utils/api";
import { resetAppStatus } from "../appStatus";

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

export function handleSubmitQuestion(id, index) {
  return dispatch => {
    dispatch(submitQuestion(id, index))
    dispatch(resetEdit())
  }
}

export function handleRemoveQuestionFromWp(id, postType) {
  return (dispatch, getState) => {
    const { test: { testQuestions } } = getState()
    const currentQuestion = 
      testQuestions.filter(question => question.id === id)[0]

    dispatch(removeQuestion(id))
    dispatch(resetEdit())

    const { test: { 
      currentQuestionNumber, 
      testQuestions: testQuestionsAfterDeleting } 
    } = getState()
    
    if (currentQuestionNumber === testQuestionsAfterDeleting.length) {
      dispatch(shrinkFromDelete())
    }

    return removeQuestionFromWp(id, postType)
      .catch(err => {
        dispatch(createQuestion(currentQuestion))
        throw err
      })
  }
}

export function handleResetTest() {
  return dispatch => {
    dispatch(resetTestquestions())
    dispatch(resetEdit())
    dispatch(resetNumber())
    dispatch(resetAppStatus())
  }
}
