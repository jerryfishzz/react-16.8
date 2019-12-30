import * as R from 'ramda'
import dateTime from 'date-time'

import { 
  _getQuestions, 
  _getTags, 
  _updateQuestion, 
  _addTagToDB, 
  _addQuestionToDB 
} from "./store";
import { handleErrors, handleNetworkError } from "./helpers";
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
    .then(handleErrors, handleNetworkError)
    .then(response => response.json())
    .then(res => res.token)
}

// Get all the posts of postType from the server
export async function getQuestionsFromWordPress(postType) {
  try {
    const perPage = 100
    const { data, headers } = await Axios.get(`${WP_SERVER}/wp-json/wp/v2/${postType}?per_page=${perPage}`)

    const firstPageData = data
    const totalPages = Number(headers['x-wp-totalpages'])

    let restPages = []
    for (var i = 1; i < totalPages; i++) {
      restPages.push(i)
    }

    const fromPagesToOffsets = p => p * perPage
    const getPageOffsets = R.map(fromPagesToOffsets)

    const requestDataWithOffset = offset => 
      Axios.get(`${WP_SERVER}/wp-json/wp/v2/${postType}?offset=${offset}&per_page=${perPage}`)
    const generatePromisesForRestPagesData = R.map(requestDataWithOffset)

    const getRestPagesPromises = R.pipe(getPageOffsets, generatePromisesForRestPagesData)
    const restPagesPromises = getRestPagesPromises(restPages)
    const restPagesResponses = await Promise.all(restPagesPromises)

    const selectRestPagesData = R.map(R.prop('data'))
    const concatTwoPagesData = (a, b) => R.concat(a)(b)
    const concatFirstPageDataWithOtherPages = R.reduce(concatTwoPagesData, firstPageData)
    const getAllPagesData = R.pipe(selectRestPagesData, concatFirstPageDataWithOtherPages)
    const allPagesData = getAllPagesData(restPagesResponses)




console.log(allPagesData)
    console.log(allPagesData[0].date)
    console.log(allPagesData[0].date_gmt)
    console.log(allPagesData[0].modified)
    console.log(typeof allPagesData[0].modified_gmt)

    console.log(allPagesData[0].modified > allPagesData[0].date ? true : false)
    console.log(new Date())
    console.log(new Date().getTime())
    console.log(dateTime({local: false}).replace(' ', 'T'))

    return allPagesData
  } catch (err) {
    if (err.response) throw err.response.status
    return handleNetworkError(err)
  }
}

export function getQuestionsForList(postType) {
  return fetch(`${WP_SERVER}/wp-json/wp/v2/${postType}?per_page=10`)
    .then(handleErrors, handleNetworkError)
    .then(response => response.json())
}

export function getQuestionsForListAxios(postType, offset, perPage, search) {
  return Axios.get(`${WP_SERVER}/wp-json/wp/v2/${postType}?search=${search}&offset=${offset}&per_page=${perPage}`)
    .catch(err => {
      if (err.response) throw err.response.status
      return handleNetworkError(err)
    })
}

export function getAnswersForQuestionFromWp(id) {
  return fetch(`${WP_SERVER}/wp-json/wp/v2/comments?post=${id}`)
    .then(handleErrors, handleNetworkError)
    .then(response => response.json())
}

export function getInitialDataFromWordPress(postType) {
  console.log(postType)
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
    .then(handleErrors, handleNetworkError)
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
    .then(handleErrors, handleNetworkError)
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
    .then(handleErrors, handleNetworkError)
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
    .then(handleErrors, handleNetworkError)
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
    .then(handleErrors, handleNetworkError)
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
    .then(handleErrors, handleNetworkError)
    .then(response => response.json())
}

export function getQuestionFromWp(postType, id) {
  return Axios.get(`${WP_SERVER}/wp-json/wp/v2/${postType}/${id}`) 
    .catch(err => {
      if (err.response) throw err.response.status
      return handleNetworkError(err)
    })
}