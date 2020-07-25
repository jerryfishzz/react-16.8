import * as R from 'ramda'
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import uniqid from 'uniqid'
import { getQuestionFromWp, getAnswersForQuestionFromWp } from './api';

export const strToObj = str => JSON.parse(str)
export const objToStr = obj => JSON.stringify(obj)
const getObjKeyValue = (obj, key) => obj[key]

/**
 * @param {object}
 * @return {function} Get key and return its value
 */
export const curriedGetObjKeyValue = R.curry(getObjKeyValue)

// Line feed \n is always saved as 'n' in WP.
// So need to replace it by other characters before saving.
// All the HTML code used here is modified slightly to
// avoid conflicting when the code appears in text content.
const lineFeedToCode = str => str.replace(/\n/g, '&#_10;')

// Back slash and quote cannot be deal with properly
// when saving directly in WP. Need to escape.
const escapeBackSlash = str => str.replace(/\\/g, '&#_92;')
const escapeQuote = str => str.replace(/"/g, '&#_34;')

/**
 * Encode three special characters: \n, \, and ".
 * \n must be the first to be encoded. Other two have no priority.
 * @param {string}
 * @return {string}
 */
const encodeSpecialCharacters = R.pipe(lineFeedToCode, escapeBackSlash, escapeQuote)

const codeToLineFeed = str => str.replace(/&#_10;/g, '\n')
const codeToBackSlash = str => str.replace(/&#_92;/g, '\\')
const codeToQuote = str => str.replace(/&#_34;/g, '"')

// Decode three special characters. No priority when decoding.
export const decodeSpecialCharacters = R.pipe(codeToLineFeed, codeToBackSlash, codeToQuote)

const encodeString = str => encodeURIComponent(str)
export const decodeString = str => decodeURIComponent(str)

const alphanumericString = 'ABCDEFG'
export const getTheAlphanumericOrder = R.flip(R.nth)(alphanumericString)
export const QUESTION_COUNTS = 10
export const PROMISE_ALL_ERROR = 997
export const postTypes = ['examples', 'temps', 'questions']

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

/**
 * Check draft string to see if it is blank
 * @param {string} draftString Strigified draft object
 * @return {boolean}
 */
export const validateDraftFromString = draftString => {
  const { blocks } = JSON.parse(draftString)
  const draftStrings = blocks.map(block => block.text)
  return R.any(isExisted)(draftStrings)
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
  const draft = content.draft ? content.draft : content

  const contentState = draft.getCurrentContent()
  const contentObject = convertToRaw(contentState)
  const escapedContentObject = {
    ...contentObject,
    blocks: contentObject.blocks.map(block => ({
      ...block,
      text: encodeString(block.text)
    }))
  }

  const processedContent = content.draft 
    ? {draft: escapedContentObject, md: encodeSpecialCharacters(content.md)}
    : escapedContentObject

  return JSON.stringify(processedContent)
}

/**
 * This function only takes string from draft editor
 * @param {string} draftString
 * @return {object} Draft object
 */
function objectizeAndUnescape(draftString) {
  const objectFromString = JSON.parse(draftString)
  
  return {
    ...objectFromString,
    blocks: objectFromString.blocks.map(block => ({
      ...block,
      text: decodeString(block.text)
    }))
  }
}

// content is string
export function getEditorStateFromContent(content) {
  return EditorState.createWithContent(convertFromRaw(objectizeAndUnescape(content)))
}

function getTypeFromParams(search) {
  const query = new URLSearchParams(search)
  return query.get('type')
}

// This should be delete after routes are re-organized
export const getType = ({ pathname, search }) => {
  switch (pathname) {
    case '/tests':
    case '/questionlist':
      return search === '' ? 'examples' : getTypeFromParams(search)
    default:
      return 'examples'
  }
}

/**
 * Take pathname from React router to get the route (post type in WP or questionlist)
 * @param {string} pathname 
 */
export const getRoute = pathname => {
  const route = pathname.split('/')[1]
  return route === '' ? 'examples' : route
}

/**
 * For questionlist route /questionlist/:postType
 * to get the route param postType
 * @param {string} pathname 
 */
export const getPostType = pathname => pathname.split('/')[2]

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

export function errorGenerator(err = 404) {
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