import React, { Component, Fragment } from 'react'
import * as R from 'ramda'
import shuffle from 'shuffle-array'
import { questionLibrary } from './store.js'
import { CssBaseline } from '@material-ui/core';
import { Header } from './component/layouts';
import Tests from './component/tests';

// Necessary properties for the question with answers
const propertiesForAnswers = {
  "submittedAnswer": null,
  "selectedAnswer": null,
  "isSubmitted": false,
  "hasAnswers": true
}

export default class App extends Component {
  state = {
    testQuestions: [],
    currentQuestionNumber: 0,
    currentQuestion: ''
  }

  // If the question has answers, add some proprerties for it
  addPropertiesForAnswers = obj => {
    const hasAnswers = R.has('answers')

    if (!hasAnswers(obj)) return obj
    return R.merge(obj)(propertiesForAnswers)
  }

  // Get the questions from the library, shuffling and taking the first 10 only
  initializeQuestions = () => {
    const randomizeQuestions = R.compose(R.take(10), shuffle)
    const randomizedQuestions = randomizeQuestions(questionLibrary)

    this.setState({
      testQuestions: R.map(this.addPropertiesForAnswers)(randomizedQuestions),
      currentQuestionNumber: 0
    }, this.updateCurrentQuestion)
  }
  
  nextQuestion = () => {
    this.setState((prevState) => (
      {
        currentQuestionNumber: prevState.currentQuestionNumber + 1
      }
    ), this.updateCurrentQuestion)
  }

  previousQuestion = () => {
    this.setState((prevState) => (
      {
        currentQuestionNumber: prevState.currentQuestionNumber - 1
      }
    ), this.updateCurrentQuestion)
  }

  updateCurrentQuestion = () => {
    const {currentQuestionNumber, testQuestions} = this.state
    this.setState({
      currentQuestion: R.nth(currentQuestionNumber)(testQuestions)
    })
  }

  // This for two actions from Answers component: submit and click
  handleAnswerActions = (action, i) => {
    const { currentQuestion, currentQuestionNumber } = this.state

    // Makes a shallow clone of an object
    let newCurrentQuestion = R.assoc(action, i)(currentQuestion) 

    if (action === 'submittedAnswer') newCurrentQuestion.isSubmitted = true

    this.setState(prevState => {
      let currentTestQuestions = prevState.testQuestions

      currentTestQuestions.splice(currentQuestionNumber, 1, newCurrentQuestion)

      return {
        testQuestions: currentTestQuestions,
        currentQuestion: newCurrentQuestion
      }
    })
  }

  componentDidMount() {
    this.initializeQuestions()
  }

  render () {
    const { testQuestions, currentQuestion, currentQuestionNumber } = this.state

    return (
      <Fragment>
        <CssBaseline />
        <Header 
          shuffleQuestions={this.initializeQuestions}
        />
        <Tests 
          testQuestions={testQuestions} 
          currentQuestion={currentQuestion}
          currentQuestionNumber={currentQuestionNumber}
          handleAnswerActions={this.handleAnswerActions}
          nextQuestion={this.nextQuestion}
          previousQuestion={this.previousQuestion}
        />
      </Fragment>
    )
  }
}
