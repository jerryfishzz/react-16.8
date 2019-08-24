import { receiveQuestions } from "./test/testQuestions";
import { receiveTags } from "./tags";
import { getInitialData } from "../utils/api";
import shuffle from 'shuffle-array'
import * as R from 'ramda'
import { formatQuestion } from "../utils/helpers";

export function initializeApp() {
  return async dispatch => {
    try {
      const [questions, tags] = await getInitialData()
      
      const formattedQuestionArray = Object.keys(questions).map(id => formatQuestion(questions[id]))

      const shuffleArrayThenTakeFirstTen = R.compose(R.take(10), shuffle)
      const randomizedQuestionsForTest = shuffleArrayThenTakeFirstTen(formattedQuestionArray)

      dispatch(receiveQuestions(randomizedQuestionsForTest))
      dispatch(receiveTags(tags))
    } catch(err) {
      throw Error('Initialize error')
    }
  }
}