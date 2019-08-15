const questionStatusForTest = {
  submittedAnswer: null,
  selectedAnswer: null,
  isSubmitted: false,
}

export function formatQuestion(question) {
  return {
    ...question,
    ...questionStatusForTest
  }
}