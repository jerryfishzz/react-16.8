import * as R from 'ramda'
import { EditorState } from "draft-js";
import { 
  getEditorStateFromContent, 
  strToObj,
  objToStr,
  curriedGetObjKeyValue,
  decodeString,
  decodeSpecialCharacters
} from "../../../utils/helpers";

const editors = ['draft', 'md']

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
      md: decodeSpecialCharacters(questionObj('md'))
    },
    answers: answers.map(answer => ({
      ...answer,
      content: getEditorStateFromContent(answer.content),
      note: getEditorStateFromContent(answer.note)
    })),
    otherNotes: {
      draft: otherNotesObj('draft'),
      md: decodeSpecialCharacters(otherNotesObj('md'))
    },
  }
}

const generateDataForMDEditor = currentQuestion => {
  const { data: { question, answers, otherNotes }} = currentQuestion

  return {
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
}

/**
 * Take the raw data from the server
 * and return the data object that can be used by the state directly.
 * Can deal with either when both editors exist or only md editor available.
 * @param {object} currentQuestion Raw data from the server
 * @return {object} data The data object which can be used by state directly
 */
export const generateData = currentQuestion => {
  return editors.length === 1 
    ? generateDataForMDEditor(currentQuestion)
    : generateDataForMultiEditors(currentQuestion)
}