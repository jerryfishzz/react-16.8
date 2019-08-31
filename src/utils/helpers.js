import * as R from 'ramda'
import { EditorState, convertToRaw } from "draft-js";

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
      question: cur.acf.title,
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

const getReadyToFormat = answers => name => {
  return index => {
    const len = answers.length

    if (index >= len) {
      if (name === 'correctness') return false
      
      const blankState = EditorState.createEmpty().getCurrentContent()
      const blankStateString = JSON.stringify(convertToRaw(blankState))
      return blankStateString
    }
    
    return answers.map(answer => answer[name])[index]
  }
}

export function formatForWp(newQuestion) {
  const getAnswers = getReadyToFormat(newQuestion.data.answers)
  const getAnswerContent = getAnswers('content')
  const getAnswerCorrectness = getAnswers('correctness')
  const getAnswerNote = getAnswers('note')

  return {
    title: newQuestion.data.question,
    fields: {
      title: newQuestion.data.question,
      tags: newQuestion.data.tags.join(),
      answer_a: getAnswerContent(0),
      answer_a_correctness: getAnswerCorrectness(0),
      answer_a_comment: getAnswerNote(0),
      answer_b: getAnswerContent(1),
      answer_b_correctness: getAnswerCorrectness(1),
      answer_b_comment: getAnswerNote(1),
      answer_c: getAnswerContent(2),
      answer_c_correctness: getAnswerCorrectness(2),
      answer_c_comment: getAnswerNote(2),
      answer_d: getAnswerContent(3),
      answer_d_correctness: getAnswerCorrectness(3),
      answer_d_comment: getAnswerNote(3),
      other_notes: newQuestion.data.otherNotes
    },
    status: "publish"
  }
}
