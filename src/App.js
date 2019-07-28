import React, { Component } from 'react'
import * as R from 'ramda'
import shuffle from 'shuffle-array'
import { questionLibrary, tags } from './store'
import { CssBaseline } from '@material-ui/core';
import { Header } from './component/layouts';
import Tests from './component/tests';
import { Provider } from './context';

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
    currentQuestion: null,
    editQuestion: false,
    suggestions: tags
  }

  // If the question has answers, add some proprerties for it
  addPropertiesForAnswers = obj => {
    const hasAnswers = R.has('answers')

    if (!hasAnswers(obj)) return obj
    return R.merge(obj)(propertiesForAnswers)
  }

  // Get the questions from the library, shuffling and taking the first 10 only
  initializeQuestions = questions => {
    const questionsForInitializing = questions ? questions : questionLibrary

    const randomizeQuestions = R.compose(R.take(10), shuffle)
    const randomizedQuestions = randomizeQuestions(questionsForInitializing)

    this.setState({
      testQuestions: !questions 
        ? R.map(this.addPropertiesForAnswers)(randomizedQuestions)
        : randomizedQuestions,
      currentQuestionNumber: 0,
      editQuestion: false
    }, this.updateCurrentQuestion)
  }
  
  nextQuestion = () => {
    this.setState((prevState) => (
      {
        currentQuestionNumber: prevState.currentQuestionNumber + 1,
        editQuestion: false
      }
    ), this.updateCurrentQuestion)
  }

  previousQuestion = () => {
    this.setState((prevState) => (
      {
        currentQuestionNumber: prevState.currentQuestionNumber - 1,
        editQuestion: false
      }
    ), this.updateCurrentQuestion)
  }

  updateCurrentQuestion = () => {
    const {currentQuestionNumber, testQuestions} = this.state

    if (!testQuestions.length) {
      this.setState({
        currentQuestion: {},
      })
    } else {
      const position = currentQuestionNumber === testQuestions.length
        ? currentQuestionNumber - 1
        : currentQuestionNumber

      this.setState({
        currentQuestion: R.nth(position)(testQuestions),
        currentQuestionNumber: position
      })
    }
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
        currentQuestion: newCurrentQuestion,
        editQuestion: false
      }
    })
  }

  submitQuestion = question => {
    this.setState(({testQuestions}) => ({
      testQuestions: [
        ...testQuestions, 
        this.addPropertiesForAnswers(question)
      ],
      editQuestion: false,
    }))
  }

  editQuestion = question => {
    this.setState(({testQuestions}) => ({
      testQuestions: [
        ...testQuestions.filter(q => q.id !== question.id),
        question
      ],
      currentQuestion: question
    }))
  }

  enableEdit = () => {
    this.setState({
      editQuestion: true
    })
  }

  deleteQuestion = id => {
    this.setState(({ testQuestions }) => ({
      testQuestions: testQuestions.filter(q => q.id !== id),
      editQuestion: false,
    }), this.updateCurrentQuestion)
  }

  addSuggestion = newSuggestion => {
    this.setState(prevState => ({
      suggestions: [...prevState.suggestions, newSuggestion]
    }), this.updateCurrentQuestion)
  }

  componentDidMount() {
    this.initializeQuestions()
  }

  getContext = () => ({
    ...this.state,
    shuffleQuestions: this.initializeQuestions,
    handleAnswerActions: this.handleAnswerActions,
    handleNext: this.nextQuestion,
    handleBack: this.previousQuestion,
    onSubmit: this.submitQuestion,
    enableEdit: this.enableEdit,
    onEdit: this.editQuestion,
    onDelete: this.deleteQuestion,
    onAddSuggestion: this.addSuggestion,
  })

  render () {
    const { currentQuestion } = this.state

    if (!currentQuestion) {
      return <div>Loading</div>
    }

    return (
      <Provider value={this.getContext()}>
        <CssBaseline />
        <Header />
        <Tests />
      </Provider>
    )
  }
}
