import { 
  nextQuestion, 
  previousQuestion, 
  shrinkFromDelete, 
  resetNumber
} from "./currentQuestionNumber";
import { resetEdit } from "./editQuestion";
import { removeQuestion, submitQuestion, createQuestion, resetTestquestions } from "./testQuestions";
import { removeQuestionFromWp, getQuestionFromWp } from "../../utils/api";
import { startDeleting } from "../appStatus";

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

export function handleSubmitQuestion(id) {
  return dispatch => {
    dispatch(submitQuestion(id))
    dispatch(resetEdit())
  }
}

export function handleRemoveQuestionFromWp(id, postType) {
  return async (dispatch, getState) => {
    dispatch(startDeleting())

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

    try {
      const { data } = await getQuestionFromWp(postType, id)

      if (currentQuestion.data.modified_gmt === data.modified_gmt) {
        return removeQuestionFromWp(id, postType)
          .catch(err => {
            dispatch(createQuestion(currentQuestion))
            throw err
          })
      }
    } catch (err) {
      if (err !== 401) dispatch(createQuestion(currentQuestion))
      throw err
    }
  }
}

export function handleResetTest() {
  return dispatch => {
    dispatch(resetTestquestions())
    dispatch(resetEdit())
    dispatch(resetNumber())
  }
}
