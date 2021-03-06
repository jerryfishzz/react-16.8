import shuffle from 'shuffle-array'

import { receiveQuestions } from "./test/testQuestions";
import { receiveTags } from "./tags";
import { 
  getInitialDataFromWordPress, 
  getAnswersForQuestionFromWp,
  getQuestionFromWp
} from "../utils/api";
import { 
  formatQuestion, 
  formatQuestionsFromWordPress, 
  addAnswersToQuestion, 
  QUESTION_COUNTS,
  handleFormatQuestionFromWordPress,
  PROMISE_ALL_ERROR
} from "../utils/helpers";
import { handleResetTest } from './test/shared';
import { closeAlert } from './errorAlert';
import { resetErrorFromAPI, resetAppStatus, stopLoading, getError } from './appStatus';

export function initializeAppFromWordPress(cb = null, postType) {
  return async dispatch => {
    try {
      dispatch(handleResetTest())

      // Get tags and all the records of the postType
      let [questions, tags] = await getInitialDataFromWordPress(postType) 

      // let testQuestions = []
      
      if (questions.length) {
        questions = formatQuestionsFromWordPress(questions) // an object

        // an array of objects
        const formattedQuestions = 
          Object.keys(questions).map(id => formatQuestion(questions[id])) 
          // Object.key will order elements ascendingly by their keys
        
        const randomizedQuestions = postType !== 'temps'
          ? shuffle(formattedQuestions, { 'copy': true })
          : formattedQuestions

        const testQuestions = await Promise.all(
          randomizedQuestions.map(async (question, index) => {
            if (index < QUESTION_COUNTS || postType === 'temps') {
              try {
                const answers = await getAnswersForQuestionFromWp(question.id)

                return addAnswersToQuestion(answers, question)
              } catch(err) {
                throw err
              }
            }
            return question
          })
        )

        dispatch(receiveQuestions(testQuestions))
        dispatch(receiveTags(tags))
      }

      if (cb) dispatch(cb())
    } catch(err) {
      throw err
    }
  }
}

export function shuffleQuestions(postType, questionsInStoreBeforeShuffling) {
  return async dispatch => {
    try {
      dispatch(handleResetTest())
      dispatch(resetAppStatus())

      const shuffledQuestions = shuffle(questionsInStoreBeforeShuffling)

      const testQuestions = await Promise.all(
        shuffledQuestions.map(async (question, index) => {
          if (index < QUESTION_COUNTS) {
            if (question.hasAnswers) {
              // Remove the question history
              return {
                ...question,
                isSubmitted: false,
                selectedAnswers: []
              }
            } else {
              try {
                const { data } = await getQuestionFromWp(postType, question.id)
                const answers = await getAnswersForQuestionFromWp(question.id)

                const questionWithoutAnswers = handleFormatQuestionFromWordPress(data)
                const updatedQuestion = addAnswersToQuestion(answers, questionWithoutAnswers)

                return addAnswersToQuestion(answers, updatedQuestion)
              } catch(err) {
                throw err
              }
            }
          }
          return question
        })
      )
      
      dispatch(receiveQuestions(testQuestions))
      dispatch(stopLoading())
    } catch(err) {
      console.log(err)

      dispatch(getError(PROMISE_ALL_ERROR))
      dispatch(stopLoading())
    }
  }
}

export function handleCloseAlert() {
  return dispatch => {
    dispatch(closeAlert())
    dispatch(resetErrorFromAPI())
  }
}