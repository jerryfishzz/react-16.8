import * as R from 'ramda'
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import uniqid from 'uniqid'
import { getQuestionFromWp, getAnswersForQuestionFromWp } from './api';

const alphanumericString = 'ABCDEFG'
export const getTheAlphanumericOrder = R.flip(R.nth)(alphanumericString)

const questionStatusForTest = {
  submittedAnswer: null,
  selectedAnswer: null,
  isSubmitted: false,
}

export const BLANK_POSTTYPE = 'BLANK_POSTTYPE'

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
      title: cur.title.rendered,
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
  // console.log(1111111111)
  // console.log(response)
  if (!response.ok) {
      throw response.status
  }
  return response;
}

export const NETWORK_ERROR = 'Network error'

export function handleNetworkError(err) {
  console.log(err)
  throw Error(NETWORK_ERROR)
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
    throw Error('Get question error')
  }
}

export function errorGenerator(err = null) {
  switch (err) {
    case 404:
      return 'Parameter error in the URL'
    default:
      return '404 Page Not Found'
  }
}