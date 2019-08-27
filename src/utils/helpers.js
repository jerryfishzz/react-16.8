import * as R from 'ramda'
import { convertToRaw, convertFromRaw } from "draft-js";

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