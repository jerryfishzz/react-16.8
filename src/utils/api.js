import { _getQuestions, _getTags, _updateQuestion, _addTagToDB } from "./store";

export function getQuestions() {
  return _getQuestions()
}


export function getTags() {
  return _getTags()
}

export function updateQuestion(question) {
  return _updateQuestion(question)
}

export function addTagToDB(newTag) {
  return _addTagToDB(newTag)
}