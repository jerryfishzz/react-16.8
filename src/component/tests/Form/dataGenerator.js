import * as R from 'ramda'
import { EditorState } from "draft-js";
import { getEditorStateFromContent } from "../../../utils/helpers";

const editors = ['draft', 'md']

const strToObj = str => JSON.parse(str)
const objToStr = obj => JSON.stringify(obj)
const getObjKeyValue = (obj, key) => obj[key]

/**
 * @param {object}
 * @return {function} Take key to return its value
 */
const curriedGetObjKeyValue = R.curry(getObjKeyValue)

/**
 * Turn input string to object which contains draft editor content
 * which can be used directly by the component state 
 * @param {string} inputStr
 * @return {object}
 */
const makeDraftReadable = inputStr => {
  const inputObj = strToObj(inputStr)
  return !inputObj.draft && !inputObj.md
    ? { draft: getEditorStateFromContent(inputStr), md: '' }
    : { draft: getEditorStateFromContent(objToStr(inputObj.draft)), md: inputObj.md }
}

/**
 * @param {string}
 * @return {function}
 */
const getInputObj = R.pipe(makeDraftReadable, curriedGetObjKeyValue)

const generateDataForMultiEditors = currentQuestion => {
  const { data: { question, answers, otherNotes }} = currentQuestion

  const questionObj = getInputObj(question)
  const otherNotesObj = getInputObj(otherNotes)

  return {
    ...currentQuestion.data,
    question: {
      draft: questionObj('draft'),
      md: questionObj('md')
    },
    answers: answers.map(answer => ({
      ...answer,
      content: getEditorStateFromContent(answer.content),
      note: getEditorStateFromContent(answer.note)
    })),
    otherNotes: {
      draft: otherNotesObj('draft'),
      md: otherNotesObj('md')
    },
  }
}

const generateDataForMDEditor = currentQuestion => {
  const { data: { question, answers, otherNotes }} = currentQuestion

  const data = {
    ...currentQuestion.data,
    question: {
      draft: EditorState.createEmpty(),
      md: question
    },
    answers: answers.map(answer => ({
      ...answer,
      content: getEditorStateFromContent(answer.content),
      note: getEditorStateFromContent(answer.note)
    })),
    otherNotes: {
      draft: EditorState.createEmpty(),
      md: otherNotes
    },
  }

  return data
}

export const generateData = currentQuestion => {
  return editors.length === 1 
    ? generateDataForMDEditor(currentQuestion)
    : generateDataForMultiEditors(currentQuestion)
}