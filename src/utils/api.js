import { _getQuestions, _getTags } from "./store";

export function getQuestions() {
  return _getQuestions()
}


export function getTags() {
  return _getTags()
}