import { _getQuestions, _getTags, _updateQuestion } from "./store";

export function getQuestions() {
  return _getQuestions()
}


export function getTags() {
  return _getTags()
}

export function updateQuestion(question) {
  return _updateQuestion(question)
}