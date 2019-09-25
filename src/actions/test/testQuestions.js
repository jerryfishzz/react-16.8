import { 
  addQuestionToDB, 
  addQuestionToWp, 
  updateQuestionToWp,
  createAnswerContainerToWp,
  updateAnswerContentToWp,
  removeAnswerFromWp
} from "../../utils/api";
import { 
  formatForDB, 
  formatForWp, 
  formatAnswer, 
  createAnswerContainer 
} from "../../utils/helpers";
import { updateRecord } from "../questionList";

export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS'
export const CLICK_ANSWER = 'CLICK_ANSWER'
export const SUBMIT_QUESTION = 'SUBMIT_QUESTION'
export const REMOVE_QUESTION = 'REMOVE_QUESTION'
export const SAVE_QUESTION = 'SAVE_QUESTION'
export const CREATE_QUESTION = 'CREATE_QUESTION'
export const RESET_TESTQUESTIONS = 'RESET_TESTQUESTIONS'

export function receiveQuestions(questions) {
  return {
    type: RECEIVE_QUESTIONS,
    questions
  }
}

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

export function handleSaveQuestionToWp(id, updatedQuestion, removed, cb1, cb2, postType) {
  return async (dispatch, getState) => {
    const { test: { testQuestions } } = getState()
    const currentQuestion = testQuestions
      ? testQuestions.filter(question => question.id === id)[0]
      : null

    let answersWithId = [], updatedQuestionWithAnswerIds = {}
    
    try {
      const questionForWp = formatForWp(updatedQuestion)
      
      const updatingAnswersPromises = 
        updatedQuestion.data.answers.map(async answer => {
          try {
            const formattedAnswer = formatAnswer(answer)
            let containerId = answer.id

            if (!containerId) {
              const container = createAnswerContainer(id)
              const {id: aid} = await createAnswerContainerToWp(container)
              containerId = aid
            }

            answersWithId = [
              ...answersWithId,
              {
                ...answer,
                id: containerId
              }
            ]

            return updateAnswerContentToWp(containerId, formattedAnswer)
          } catch(err) {
            throw err
          }
        })

      const removingAnswersPromise = removed.length
        ? removed.map(removeAnswerFromWp)
        : []

      const promisesCollection = [
        ...updatingAnswersPromises,
        ...removingAnswersPromise,
        updateQuestionToWp(id, questionForWp, postType)
      ]
      
      const promises = await Promise.all(promisesCollection)
      
      updatedQuestionWithAnswerIds = {
        ...updatedQuestion,
        data: {
          ...updatedQuestion.data,
          answers: answersWithId
        }
      }
      
      if (currentQuestion !== null) dispatch(saveQuestion(updatedQuestionWithAnswerIds))

      cb1()
      cb2(updatedQuestionWithAnswerIds)

      if (currentQuestion === null) dispatch(updateRecord(promises[promises.length - 1]))
    } catch(err) {
      if (currentQuestion !== null) dispatch(saveQuestion(currentQuestion))
      throw err
    }
  }
}

export function createQuestion(newQuestion) {
  return {
    type: CREATE_QUESTION,
    newQuestion
  }
}

export function handleCreateQuestion(newQuestion, cb) {
  return async dispatch => {
    try {
      const questionForDB = formatForDB(newQuestion)
      await addQuestionToDB(questionForDB)

      dispatch(createQuestion(newQuestion))
      cb()
    } catch(err) {
      throw Error('Create question error')
    }
  }
}

async function createAnswerToWp(answer, id) {
  try {
    const formattedAnswer = formatAnswer(answer)
    const container = createAnswerContainer(id)
    const {id: aid} = await createAnswerContainerToWp(container)

    updateAnswerContentToWp(aid, formattedAnswer)

    return {
      ...answer,
      id: aid
    }
  } catch(err) {
    throw Error('Add answer error')
  }
}

export function handleCreateQuestionToWp(newQuestion, cb, postType) {
  return async dispatch => {
    try {
      const questionForWp = formatForWp(newQuestion)
      const { id } = await addQuestionToWp(questionForWp, postType)
      
      const answersWithId = await Promise.all(newQuestion.data.answers.map(answer => createAnswerToWp(answer, id)))

      const questionWithWpId = {
        ...newQuestion,
        id,
        data: {
          ...newQuestion.data,
          id,
          answers: answersWithId
        }
      }

      dispatch(createQuestion(questionWithWpId))
      cb()
    } catch(err) {
      throw err
    }
  }
}

export function resetTestquestions() {
  return {
    type: RESET_TESTQUESTIONS
  }
}
