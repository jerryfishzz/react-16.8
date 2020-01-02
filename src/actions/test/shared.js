import { 
  nextQuestion, 
  previousQuestion, 
  shrinkFromDelete, 
  resetNumber
} from "./currentQuestionNumber";
import { resetEdit } from "./editQuestion";
import { 
  removeQuestion, 
  submitQuestion, 
  createQuestion, 
  resetTestquestions,
} from "./testQuestions";
import { removeQuestionFromWp, getQuestionFromWp, getAnswersForQuestionFromWp } from "../../utils/api";
import { startDeleting } from "../appStatus";
import { handleFormatQuestionFromWordPress, addAnswersToQuestion } from "../../utils/helpers";

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
      } else {
        const answers = await getAnswersForQuestionFromWp(id)
        const questionWithouAnswers = handleFormatQuestionFromWordPress(data)
        const question = addAnswersToQuestion(answers, questionWithouAnswers)

        dispatch(createQuestion(question))

        // Here need to return a throwing error function 
        // but not throw directly;
        // Otherwise, the error will go to the next catch,
        // making the logic messy
        return () => {
          const RECORD_NOT_MATCHED_ERROR = 998
          throw RECORD_NOT_MATCHED_ERROR
        }
      }
    } catch (err) { // This catch only deals with errors from the await above
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
