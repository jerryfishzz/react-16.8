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
  addAnswersToQuestion 
} from "../utils/helpers";

export function initializeAppFromWordPress(cb = null) {
  return async dispatch => {
    try {
      let [questions, tags] = await getInitialDataFromWordPress()
      let randomizedQuestionsForTest = []
      
      if (questions.length) {
        questions = formatQuestionsFromWordPress(questions) // an object

        // an array of objects
        const formattedQuestionArray = 
          Object.keys(questions).map(id => formatQuestion(questions[id])) 

        const shuffleArrayThenTakeFirstTen = R.compose(R.take(10), shuffle)

        randomizedQuestionsForTest = 
          shuffleArrayThenTakeFirstTen(formattedQuestionArray)
        
        randomizedQuestionsForTest = await Promise.all(
          randomizedQuestionsForTest.map(async question => {
            try {
              const answers = await getAnswersForQuestionFromWp(question.id)

              return addAnswersToQuestion(answers, question)
            } catch(err) {
              throw err
            }
          })
        )
      }
      
      dispatch(receiveQuestions(randomizedQuestionsForTest))
      dispatch(receiveTags(tags))

      if (cb) dispatch(cb())
    } catch(err) {
      throw Error('Initialize error')
    }
  }
}