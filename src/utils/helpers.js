import * as R from 'ramda'
import { convertToRaw } from "draft-js";

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

export function formatQuestionsFromWordPress(questions) {
  const reducer = (acc, cur) => ({
    ...acc,
    [cur.id]: {
      id: cur.id,
      question: cur.title.rendered,
      tags: cur.acf.tags.split(','),
      answers: [
        {
          content: cur.acf.answer_a,
          correctness: cur.acf.answer_a_correctness,
          note: cur.acf.answer_a_comment
        },
        {
          content: cur.acf.answer_b,
          correctness: cur.acf.answer_b_correctness,
          note: cur.acf.answer_b_comment
        },
        {
          content: cur.acf.answer_c,
          correctness: cur.acf.answer_c_correctness,
          note: cur.acf.answer_c_comment
        },
        {
          content: cur.acf.answer_d,
          correctness: cur.acf.answer_d_correctness,
          note: cur.acf.answer_d_comment
        }
      ],
      otherNotes: cur.acf.other_notes
    }
  })
  return questions.reduce(reducer, {})
}