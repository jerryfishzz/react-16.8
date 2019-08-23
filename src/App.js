import React, { Component } from 'react'
import * as R from 'ramda'
import shuffle from 'shuffle-array'
import { questionLibrary, tags } from './utils/store'
import { CssBaseline } from '@material-ui/core';
import { Header } from './component/layouts';
import Tests from './component/tests';
import { Provider } from './context';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ForTest from './component/ForTest';
import { connect } from 'react-redux'
import { nextQuestion, previousQuestion } from './actions/test/currentQuestionNumber';
import { toggleEdit, resetEdit } from './actions/test/editQuestion';
import { handleReceiveQuestions } from './actions/test/testQuestions';
import { handleReceiveTags } from './actions/tags';

// Necessary properties for the question with answers
const propertiesForAnswers = {
  "submittedAnswer": null,
  "selectedAnswer": null,
  "isSubmitted": false,
}

class App extends Component {
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

  resetQuestion = question => ({
    ...question,
    submittedAnswer: null,
    selectedAnswer: null,
    isSubmitted: false,
  })

  // Get the questions from the library, shuffling and taking the first 10 only
  initializeQuestions = questions => {
    const questionsForInitializing = questions 
      ? questions.map(q => this.resetQuestion(q))
      : questionLibrary

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
  
  // nextQuestion = () => {
  //   this.setState((prevState) => (
  //     {
  //       currentQuestionNumber: prevState.currentQuestionNumber + 1,
  //       editQuestion: false
  //     }
  //   ), this.updateCurrentQuestion)

  //   this.props.nextQuestion()
  //   this.props.resetEdit()
  // }

  // previousQuestion = () => {
  //   this.setState((prevState) => (
  //     {
  //       currentQuestionNumber: prevState.currentQuestionNumber - 1,
  //       editQuestion: false
  //     }
  //   ), this.updateCurrentQuestion)

  //   this.props.previousQuestion()
  //   this.props.resetEdit()
  // }

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
  // handleAnswerActions = (action, i) => {
  //   const { currentQuestion, currentQuestionNumber } = this.state

  //   // Makes a shallow clone of an object
  //   let newCurrentQuestion = R.assoc(action, i)(currentQuestion) 

  //   if (action === 'submittedAnswer') newCurrentQuestion.isSubmitted = true

  //   this.setState(prevState => {
  //     let currentTestQuestions = prevState.testQuestions

  //     currentTestQuestions.splice(currentQuestionNumber, 1, newCurrentQuestion)

  //     return {
  //       testQuestions: currentTestQuestions,
  //       currentQuestion: newCurrentQuestion,
  //       editQuestion: false
  //     }
  //   })
  // }

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

  // toggleEdit = () => {
  //   this.setState(({ editQuestion }) => ({
  //     editQuestion: !editQuestion
  //   }))

  //   this.props.toggleEdit()
  // }

  // deleteQuestion = id => {
  //   this.setState(({ testQuestions }) => ({
  //     testQuestions: testQuestions.filter(q => q.id !== id),
  //     editQuestion: false,
  //   }), this.updateCurrentQuestion)
  // }

  addSuggestion = newSuggestion => {
    this.setState(prevState => ({
      suggestions: [...prevState.suggestions, newSuggestion]
    }), this.updateCurrentQuestion)
  }

  componentDidMount() {
    this.initializeQuestions()
    
    this.props.handleReceiveQuestions()
      .catch(err => alert(err))

    this.props.handleReceiveTags()
      .catch(err => alert(err))
  }

  getContext = () => ({
    ...this.state,
    shuffleQuestions: this.initializeQuestions,
    // handleAnswerActions: this.handleAnswerActions,
    handleNext: this.nextQuestion,
    handleBack: this.previousQuestion,
    onSubmit: this.submitQuestion,
    // toggleEdit: this.toggleEdit,
    onEdit: this.editQuestion,
    // onDelete: this.deleteQuestion,
    onAddSuggestion: this.addSuggestion,
  })

  render () {
    const { currentQuestion } = this.state
    const { testQuestions } = this.props

    if (!currentQuestion) {
      return <div>Loading</div>
    }

    if(!testQuestions.length) { // Need to consider when no questions
      return <div>Loading</div>
    }

    return (
      <Router>
        <Provider value={this.getContext()}>
          <CssBaseline />
          <Header />
          <Switch>
            <Route path='/' exact component={Tests} />
            <Route path='/fortest' component={ForTest} />
          </Switch>
        </Provider>
      </Router>
    )
  }
}

const mapStateToProps = ({ test: { currentQuestionNumber, testQuestions } }) => {
  return {
    currentQuestion: testQuestions.length 
      ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
      : {},
    testQuestions
  }
}

export default connect(
  mapStateToProps, 
  { 
    nextQuestion, 
    previousQuestion,
    // toggleEdit,
    resetEdit,
    handleReceiveQuestions,
    handleReceiveTags
  }
)(App)
