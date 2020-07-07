import { EditorState } from "draft-js";
import { getEditorStateFromContent } from "../../../utils/helpers";

const editors = ['draft', 'md']

const getInputValue = input => editor => {
  const inputObj = JSON.parse(input)
  const value = !inputObj.draft && !inputObj.md
    ? { draft: getEditorStateFromContent(input), md: '' }
    : { draft: getEditorStateFromContent(JSON.stringify(inputObj.draft)), md: inputObj.md }
  
  return value[editor]
}

const generateDataForMultiEditors = currentQuestion => {
  const { data: { question, answers, otherNotes }} = currentQuestion

  const questionValue = getInputValue(question)
  const otherNotesValue = getInputValue(otherNotes)

  return {
    ...currentQuestion.data,
    question: {
      draft: questionValue('draft'),
      md: questionValue('md')
    },
    answers: answers.map(answer => ({
      ...answer,
      content: getEditorStateFromContent(answer.content),
      note: getEditorStateFromContent(answer.note)
    })),
    otherNotes: {
      draft: otherNotesValue('draft'),
      md: otherNotesValue('md')
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