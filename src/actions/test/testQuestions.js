import { getQuestions } from "../../utils/api";
import shuffle from 'shuffle-array'
import * as R from 'ramda'
import { formatQuestion } from "../../utils/helpers";

export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS'
export const CLICK_ANSWER = 'CLICK_ANSWER'

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
      const questionsArr = Object.keys(questionsObj).map(id => formatQuestion(questionsObj[id]))

      const shuffleArrayThenTakeFirstTen = R.compose(R.take(10), shuffle)
      const randomizedQuestionsForTest = shuffleArrayThenTakeFirstTen(questionsArr)

      dispatch(receiveQuestions(randomizedQuestionsForTest))
    } catch(err) {
      throw Error('Get questions error')
    }
  }
}

export function clickAnswer(id, index) {
  return {
    type: CLICK_ANSWER,
    id,
    index
  }
}