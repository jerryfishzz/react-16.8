import { 
  _getQuestions, 
  _getTags, 
  _updateQuestion, 
  _addTagToDB, 
  _addQuestionToDB 
} from "./store";
import { handleErrors } from "./helpers";
// import { resolve } from "url";
// import { reject } from "q";

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
  .then(res => {
    // console.log(res)
    if (res.ok) return res.json()
    throw Error(res.statusText) 
  })
  .then(res => {
    return res.token
  })
}

export function getQuestionsFromWordPress() {
  return fetch('/wp-json/wp/v2/questions')
    .then(res => {
      if (res.ok) return res.json()
      throw Error(res.statusText) 
    })
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