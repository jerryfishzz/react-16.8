import { EditorState } from "draft-js";
import { getEditorStateFromContent } from "../../../utils/helpers";

const editors = ['draft', 'md']

const generateDataForMultiEditors = currentQuestion => {
  const { data: { question, answers, otherNotes }} = currentQuestion
  let data, draftQuestion, mdQuestion, draftOtherNotes, mdOtherNotes

  if (!question.draft && !question.md) {
    draftQuestion = getEditorStateFromContent(question)
    mdQuestion = ''
  } else {
    draftQuestion = getEditorStateFromContent(question.draft)
    mdQuestion = question.md
  }

  if (!otherNotes.draft && !otherNotes.md) {
    draftOtherNotes = getEditorStateFromContent(otherNotes)
    mdOtherNotes = ''
  } else {
    draftOtherNotes = getEditorStateFromContent(otherNotes.draft)
    mdOtherNotes = otherNotes.md
  }

  data = {
    ...currentQuestion.data,
    question: {
      draft: draftQuestion,
      md: mdQuestion
    },
    answers: answers.map(answer => ({
      ...answer,
      content: getEditorStateFromContent(answer.content),
      note: getEditorStateFromContent(answer.note)
    })),
    otherNotes: {
      draft: draftOtherNotes,
      md: mdOtherNotes
    },
  }

  return data
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