import { 
  _getQuestions, 
  _getTags, 
  _updateQuestion, 
  _addTagToDB, 
  _addQuestionToDB 
} from "./store";
import { handleErrors } from "./helpers";
import Axios from 'axios';

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

const WP_SERVER = 'https://www.jerryfishzz.com'

export function getToken() {
  
  return fetch(`${WP_SERVER}/wp-json/jwt-auth/v1/token`, {
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

export function getQuestionsFromWordPress(postType) {
  return fetch(`${WP_SERVER}/wp-json/wp/v2/${postType}?per_page=50&orderby=rand`) // orderby can make sure the 50 questions won't be always the same 50 questions
    .then(handleErrors)
    .then(response => response.json())
}

export function getQuestionsForList(postType) {
  return fetch(`${WP_SERVER}/wp-json/wp/v2/${postType}?per_page=10`) // orderby can make sure the 50 questions won't be always the same 50 questions
    .then(handleErrors)
    .then(response => response.json())
}

export function getQuestionsForListAxios(postType) {
  return Axios.get(`${WP_SERVER}/wp-json/wp/v2/${postType}?per_page=10`) 
    // .then(handleErrors)
    // .then(response => console.log(response))
}

export function getAnswersForQuestionFromWp(id) {
  return fetch(`${WP_SERVER}/wp-json/wp/v2/comments?post=${id}`)
    .then(handleErrors)
    .then(response => response.json())
}

export function getInitialDataFromWordPress(postType) {
  return Promise.all([
    getQuestionsFromWordPress(postType),
    _getTags()
  ])
}

export function addQuestionToWp(newQuestion, postType) {
  return fetch(`${WP_SERVER}/wp-json/wp/v2/${postType}`, {
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
  return fetch(`${WP_SERVER}/wp-json/wp/v2/comments`, {
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
  return fetch(`${WP_SERVER}/wp-json/acf/v3/comments/${id}`, {
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

export function removeQuestionFromWp(id, postType) {
  return fetch(`${WP_SERVER}/wp-json/wp/v2/${postType}/${id}`, {
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

export function updateQuestionToWp(id, updatedQuestion, postType) {
  return fetch(`${WP_SERVER}/wp-json/wp/v2/${postType}/${id}`, {
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
  return fetch(`${WP_SERVER}/wp-json/wp/v2/comments/${id}`, {
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