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