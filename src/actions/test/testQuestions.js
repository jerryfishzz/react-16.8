import { updateQuestion } from "../../utils/api";
// import shuffle from 'shuffle-array'
// import * as R from 'ramda'
// import { formatQuestion } from "../../utils/helpers";

export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS'
export const CLICK_ANSWER = 'CLICK_ANSWER'
export const SUBMIT_QUESTION = 'SUBMIT_QUESTION'
export const REMOVE_QUESTION = 'REMOVE_QUESTION'
export const SAVE_QUESTION = 'SAVE_QUESTION'

export function receiveQuestions(questions) {
  return {
    type: RECEIVE_QUESTIONS,
    questions
  }
}

// export function handleReceiveQuestions() {
//   return async dispatch => {
//     try {
//       const questionsObj = await getQuestions()
//       const questionsArr = Object.keys(questionsObj).map(id => formatQuestion(questionsObj[id]))

//       const shuffleArrayThenTakeFirstTen = R.compose(R.take(10), shuffle)
//       const randomizedQuestionsForTest = shuffleArrayThenTakeFirstTen(questionsArr)

//       dispatch(receiveQuestions(randomizedQuestionsForTest))
//     } catch(err) {
//       throw Error('Get questions error')
//     }
//   }
// }

export function clickAnswer(id, index) {
  return {
    type: CLICK_ANSWER,
    id,
    index
  }
}

export function submitQuestion(id, index) {
  return {
    type: SUBMIT_QUESTION,
    id,
    index
  }
}

export function removeQuestion(id) {
  return {
    type: REMOVE_QUESTION,
    id
  }
}

function saveQuestion(updatedQuestion) {
  return {
    type: SAVE_QUESTION,
    updatedQuestion
  }
}

export function handleSaveQuestion(id, updatedQuestion) {
  return async (dispatch, getState) => {
    const { test: { testQuestions } } = getState()
    const currentQuestion = 
      testQuestions.filter(question => question.id === id)[0]

    dispatch(saveQuestion(updatedQuestion))

    try {
      await updateQuestion(updatedQuestion)
    } catch(err) {
      dispatch(saveQuestion(currentQuestion))
      throw Error('Update error')
    }
  }
}