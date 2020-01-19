import * as R from 'ramda'
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import uniqid from 'uniqid'
import { getQuestionFromWp, getAnswersForQuestionFromWp } from './api';

const alphanumericString = 'ABCDEFG'
export const getTheAlphanumericOrder = R.flip(R.nth)(alphanumericString)
export const QUESTION_COUNTS = 10
export const PROMISE_ALL_ERROR = 997

const questionStatusForTest = {
  selectedAnswers: [],
  isSubmitted: false,
  hasAnswers: false
}

export const BLANK_POSTTYPE = 'BLANK_POSTTYPE'

export function formatQuestion(question) {
  return {
    id: question.id,
    data: question,
    ...questionStatusForTest
  }
}

export function formatQuestionsFromWordPress(questions) {
  const reducer = (acc, cur) => ({
    ...acc,
    [cur.id]: {
      id: cur.id,
      question: cur.acf.title,
      title: cur.title.rendered,
      tags: cur.acf.tags !== '' ? cur.acf.tags.split(',') : [],
      otherNotes: cur.acf.other_notes,
      modified_gmt: cur.modified_gmt
    }
  })
  return questions.reduce(reducer, {})
}

export function handleFormatQuestionFromWordPress(question) {
  const expectedForm = {
    id: question.id,
    question: question.acf.title,
    title: question.title.rendered,
    tags: question.acf.tags !== '' ? question.acf.tags.split(',') : [],
    otherNotes: question.acf.other_notes,
    modified_gmt: question.modified_gmt
  }

  return formatQuestion(expectedForm)
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
  const { blocks } = JSON.parse(name)
  const arrayOfName = blocks.map(block => block.text)

  return R.any(isExisted)(arrayOfName)
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
    hasAnswers: true,
    data: {
      ...question.data,
      answers: organizedAnswers
    }
  }
}

export function formatForWp(newQuestion) {
  return {
    title: newQuestion.data.title,
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
    throw response.status
  }
  return response;
}

export const NETWORK_ERROR = 999

export function handleNetworkError(err) {
  console.log(err)
  throw NETWORK_ERROR
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
    case '/tests':
    case '/questionlist':
      return search === '' ? 'examples' : getTypeFromParams(search)
    default:
      return 'examples'
  }
}

export function truncateString(content) {
  const length = 60
  const string = content.toString()
  return string.length > length
    ? string.toString().substring(0, length) + '...'
    : string
}

export async function getQuestionFromWPForEditting(postType, id) {
  try {
    let { data: question } = await getQuestionFromWp(postType, id) 
    
    question = {
      id: question.id,
      question: question.acf.title,
      title: question.title.rendered,
      tags: question.acf.tags !== '' ? question.acf.tags.split(',') : [],
      otherNotes: question.acf.other_notes
    }

    const formattedQuestion = formatQuestion(question)
    const answers = await getAnswersForQuestionFromWp(formattedQuestion.id)
    const formattedQuestionWithAnswers = addAnswersToQuestion(answers, formattedQuestion)

    return formattedQuestionWithAnswers
  } catch(err) {
    throw err
  }
}

export function errorGenerator(err = null) {
  switch (err) {
    case 400: // URL error
      return '400 Parameter Error In The URL'
    case 401: // Record has been removed. API request error.
      return '401 The record has been removed from the server'
    case 404: // The record path is not existed. URL error.
      return '404 Page Not Found'
    case 997: // The error from promise all. API request error but need to redirect.
      return 'Something wrong occurs. Please refresh.'
    case 998: // Record has been edited. API request error.
      return 'The currently operating record is not matched with the correspondent one on the server. Syncing from the database now.'
    case 999:
      return 'Network Error'
    default:
      return ''
  }
}