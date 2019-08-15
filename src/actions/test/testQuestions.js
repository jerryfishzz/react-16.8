import { getQuestions } from "../../utils/api";
import shuffle from 'shuffle-array'
import * as R from 'ramda'

export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS'

function receiveQuestions(questions) {
  return {
    type: RECEIVE_QUESTIONS,
    questions
  }
}

export function handleReceiveQuestions() {
  return async dispatch => {
    try {
      const questionsObj = await getQuestions()
      const questionsArr = Object.keys(questionsObj).map(id => questionsObj[id])

      const shuffleArrayThenTakeFirstTen = R.compose(R.take(10), shuffle)
      const randomizedQuestionsForTest = shuffleArrayThenTakeFirstTen(questionsArr)

      dispatch(receiveQuestions(randomizedQuestionsForTest))
    } catch(err) {
      throw Error('Get questions error')
    }
  }
}