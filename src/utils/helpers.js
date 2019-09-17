import * as R from 'ramda'
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import uniqid from 'uniqid'

const alphanumericString = 'ABCDEFG'
export const getTheAlphanumericOrder = R.flip(R.nth)(alphanumericString)

const questionStatusForTest = {
  submittedAnswer: null,
  selectedAnswer: null,
  isSubmitted: false,
}

export function formatQuestion(question) {
  return {
    id: question.id,
    data: question,
    ...questionStatusForTest
  }
}

export function formatForDB(storeQuestion) {
  return {
    id: storeQuestion.id,
    question: storeQuestion.data.question,
    tags: storeQuestion.data.tags,
    answers: storeQuestion.data.answers,
    otherNotes: storeQuestion.data.otherNotes
  }
}

export const isExisted = x => x ? true : false

export const validateDraft = name => {
  const { blocks } = convertToRaw(name.getCurrentContent())
  const arrayOfName = blocks.map(block => block.text)

  return R.any(isExisted)(arrayOfName)
}

export const validateDraftFromString = name => {
  // console.log(name)
  const { blocks } = JSON.parse(name)
  // console.log(blocks)
  const arrayOfName = blocks.map(block => block.text)
// console.log(arrayOfName)
  return R.any(isExisted)(arrayOfName)
}

export function formatQuestionsFromWordPress(questions) {
  const reducer = (acc, cur) => ({
    ...acc,
    [cur.id]: {
      id: cur.id,
      question: cur.acf.title,
      tags: cur.acf.tags !== '' ? cur.acf.tags.split(',') : [],
      otherNotes: cur.acf.other_notes
    }
  })
  return questions.reduce(reducer, {})
}

export function addAnswersToQuestion(answers, question) {
  const organizedAnswers = answers.map(answer => ({
    id: answer.id,
    content: answer.acf.content,
    correctness: answer.acf.correctness,
    note: answer.acf.note
  }))

  return {
    ...question,
    data: {
      ...question.data,
      answers: organizedAnswers
    }
  }
}

export function formatForWp(newQuestion) {
  return {
    title: newQuestion.data.question,
    fields: {
      title: newQuestion.data.question,
      tags: newQuestion.data.tags.join(),
      other_notes: newQuestion.data.otherNotes
    },
    status: "publish"
  }
}

export function formatAnswer(answer) {
  return {
    fields: {
      content: answer.content,
      correctness: answer.correctness,
      note: answer.note
    }
  }
}

export function createAnswerContainer(id) {
  return {
    post: id,
    content: uniqid()
  }
}

export function handleErrors(response) {
  if (!response.ok) {
      throw Error(response.statusText);
  }
  return response;
}

export function escapeAndStringify(content) {
  const contentState = content.getCurrentContent()
  const contentObject = convertToRaw(contentState)
  const escapedContentObject = {
    ...contentObject,
    blocks: contentObject.blocks.map(block => ({
      ...block,
      text: encodeURIComponent(block.text)
    }))
  }

  return JSON.stringify(escapedContentObject)
}

function objectizeAndUnescape(string) {
  const objectFromString = JSON.parse(string)
  // console.log(objectFromString)
  const unescapedObject = {
    ...objectFromString,
    blocks: objectFromString.blocks.map(block => ({
      ...block,
      text: decodeURIComponent(block.text)
    }))
  }

  return unescapedObject
}

export function getEditorStateFromContent(content) {
  return EditorState.createWithContent(convertFromRaw(objectizeAndUnescape(content)))
}

function getTypeFromParams(search) {
  const query = new URLSearchParams(search)
  return query.get('type')
}

export const getType = ({ pathname, search }) => {
  switch (pathname) {
    case '/test':
      return search === '' ? 'examples' : getTypeFromParams(search)
    default:
      return 'examples'
  }
}