import shuffle from 'shuffle-array'
import * as R from 'ramda'

import { receiveQuestions } from "./test/testQuestions";
import { receiveTags } from "./tags";
import { getInitialData, getInitialDataFromWordPress } from "../utils/api";
import { formatQuestion, formatQuestionsFromWordPress } from "../utils/helpers";

export function initializeApp(cb = null) {
  return async dispatch => {
    try {
      const [questions, tags] = await getInitialData()
      
      const formattedQuestionArray = 
        Object.keys(questions).map(id => formatQuestion(questions[id]))

      const shuffleArrayThenTakeFirstTen = R.compose(R.take(10), shuffle)
      const randomizedQuestionsForTest = 
        shuffleArrayThenTakeFirstTen(formattedQuestionArray)

      dispatch(receiveQuestions(randomizedQuestionsForTest))
      dispatch(receiveTags(tags))

      if (cb) dispatch(cb())
    } catch(err) {
      throw Error('Initialize error')
    }
  }
}

export function initializeAppFromWordPress(cb = null) {
  return async dispatch => {
    try {
      let [questions, tags] = await getInitialDataFromWordPress()
      let randomizedQuestionsForTest = []
      
      if (questions.length) {
        questions = formatQuestionsFromWordPress(questions)

        const formattedQuestionArray = 
          Object.keys(questions).map(id => formatQuestion(questions[id]))

        const shuffleArrayThenTakeFirstTen = R.compose(R.take(10), shuffle)

        randomizedQuestionsForTest = shuffleArrayThenTakeFirstTen(formattedQuestionArray)
      }
      
      dispatch(receiveQuestions(randomizedQuestionsForTest))
      dispatch(receiveTags(tags))

      if (cb) dispatch(cb())
    } catch(err) {
      throw Error('Initialize error')
    }
  }
}