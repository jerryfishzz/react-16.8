import * as R from 'ramda'

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