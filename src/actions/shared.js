import shuffle from 'shuffle-array'
import * as R from 'ramda'

import { receiveQuestions } from "./test/testQuestions";
import { receiveTags } from "./tags";
import { 
  getInitialDataFromWordPress, 
  getAnswersForQuestionFromWp  
} from "../utils/api";
import { 
  formatQuestion, 
  formatQuestionsFromWordPress, 
  addAnswersToQuestion, 
  QUESTION_COUNTS,
  EXTRA_PREPARED
} from "../utils/helpers";
import { handleResetTest } from './test/shared';
import { closeAlert } from './errorAlert';
import { resetErrorFromAPI } from './appStatus';

export function initializeAppFromWordPress(cb = null, postType) {
  return async dispatch => {
    try {
      dispatch(handleResetTest())

      // Get tags and all the records of the postType
      let [questions, tags] = await getInitialDataFromWordPress(postType) 

      let testQuestions = []
      
      if (questions.length) {
        questions = formatQuestionsFromWordPress(questions) // an object

        // an array of objects
        const formattedQuestions = 
          Object.keys(questions).map(id => formatQuestion(questions[id])) 
          // Object.key will order elements ascendingly by their keys
        
        const randomizedQuestions = postType !== 'temps'
          ? shuffle(formattedQuestions, { 'copy': true })
          : formattedQuestions

        const preparedQuestionCounts = 
          randomizedQuestions.length >= QUESTION_COUNTS + EXTRA_PREPARED
            ? QUESTION_COUNTS + EXTRA_PREPARED
            : randomizedQuestions.length > QUESTION_COUNTS
              ? randomizedQuestions.length
              : QUESTION_COUNTS

        testQuestions = await Promise.all(
          randomizedQuestions.map(async (question, index) => {
            if (index < preparedQuestionCounts) {
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
      }
      
      dispatch(receiveQuestions(testQuestions))
      dispatch(receiveTags(tags))

      if (cb) dispatch(cb())
    } catch(err) {
      throw err
    }
  }
}

export function handleCloseAlert() {
  return dispatch => {
    dispatch(closeAlert())
    dispatch(resetErrorFromAPI())
  }
}