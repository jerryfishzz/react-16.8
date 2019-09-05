import { 
  _getQuestions, 
  _getTags, 
  _updateQuestion, 
  _addTagToDB, 
  _addQuestionToDB 
} from "./store";
import { handleErrors } from "./helpers";

export function getQuestions() {
  return _getQuestions()
}

export function getTags() {
  return _getTags()
}

export function getInitialData() {
  return Promise.all([
    _getQuestions(),
    _getTags()
  ])
}

export function updateQuestion(question) {
  return _updateQuestion(question)
}

export function addTagToDB(newTag) {
  return _addTagToDB(newTag)
}

export function addQuestionToDB(newQuestion) {
  return _addQuestionToDB(newQuestion)
}

export function getToken() {
  return fetch('/wp-json/jwt-auth/v1/token', {
    method: "POST",
    headers:{
        'Content-Type': 'application/json',
        'accept': 'application/json',
    },
    body:JSON.stringify({
        username: 'jerryfishzz',
        password: 'tj22K5dTBOGQ1I7G*h'
    })
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(res => res.token)
}

export function getQuestionsFromWordPress() {
  return fetch('/wp-json/wp/v2/questions')
    .then(handleErrors)
    .then(response => response.json())
}

export function getAnswersForQuestionFromWp(id) {
  return fetch(`/wp-json/wp/v2/comments?post=${id}`)
    .then(handleErrors)
    .then(response => response.json())
}

export function getInitialDataFromWordPress() {
  return Promise.all([
    getQuestionsFromWordPress(),
    _getTags()
  ])
}

export function addQuestionToWp(newQuestion) {
  return fetch('/wp-json/wp/v2/questions', {
    method: "POST",
    headers:{
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body:JSON.stringify(newQuestion)
  })
    .then(handleErrors)
    .then(response => response.json())
}

export function createAnswerContainerToWp(container) {
  return fetch('/wp-json/wp/v2/comments', {
    method: "POST",
    headers:{
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body:JSON.stringify(container)
  })
    .then(handleErrors)
    .then(response => response.json())
}

export function updateAnswerContentToWp(id, answer) {
  return fetch(`/wp-json/acf/v3/comments/${id}`, {
    method: "POST",
    headers:{
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body:JSON.stringify(answer)
  })
    .then(handleErrors)
    .then(response => response.json())
}

export function removeQuestionFromWp(id) {
  return fetch(`/wp-json/wp/v2/questions/${id}`, {
    method: "DELETE",
    headers:{
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
  })
    .then(handleErrors)
    .then(response => response.json())
}

export function updateQuestionToWp(id, updatedQuestion) {
  return fetch(`/wp-json/wp/v2/questions/${id}`, {
    method: "POST",
    headers:{
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body:JSON.stringify(updatedQuestion)
  })
    .then(handleErrors)
    .then(response => response.json())
}

export function removeAnswerFromWp(id) {
  return fetch(`/wp-json/wp/v2/comments/${id}`, {
    method: "DELETE",
    headers:{
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
  })
    .then(handleErrors)
    .then(response => response.json())
}