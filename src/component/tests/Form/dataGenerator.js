import * as R from 'ramda'
import { EditorState } from "draft-js";
import { 
  getEditorStateFromContent, 
  codeToLineFeed,
  strToObj,
  objToStr,
  curriedGetObjKeyValue
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
      md: codeToLineFeed(questionObj('md'))
    },
    answers: answers.map(answer => ({
      ...answer,
      content: getEditorStateFromContent(answer.content),
      note: getEditorStateFromContent(answer.note)
    })),
    otherNotes: {
      draft: otherNotesObj('draft'),
      md: codeToLineFeed(otherNotesObj('md'))
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

export const generateData = currentQuestion => {
  return editors.length === 1 
    ? generateDataForMDEditor(currentQuestion)
    : generateDataForMultiEditors(currentQuestion)
}