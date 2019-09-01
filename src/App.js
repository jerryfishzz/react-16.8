import React, { Component } from 'react'
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import { Header } from './component/layouts';
import Tests from './component/tests';
import ForTest from './component/ForTest';
import { initializeApp } from './actions/shared';
import WpTest from './component/WpTest';
import BookPage from './component/wptest/BookPage';
import { getToken, getQuestionsFromWordPress } from './utils/api';
import { formatQuestionsFromWordPress } from './utils/helpers';

class App extends Component {
  componentDidMount() {
    this.props.initializeApp()
      .catch(err => alert(err))
    
    getToken()
      .then(token => {
        localStorage.setItem('token', token)
      })
      .catch(err => alert(err))
    
    getQuestionsFromWordPress()
      .then(questions => {
        console.log(formatQuestionsFromWordPress(questions))
      })
  }

  render () {
    // console.log(localStorage.getItem('token'))
    const { testQuestions } = this.props

    if (!testQuestions) {
      return <div>Loading</div>
    }

    if(!testQuestions.length) { // Need to consider when no questions
      return <div>No questions</div>
    }

    return (
      <Router>
        <CssBaseline />
        <Header />
        <Switch>
          <Route path='/' exact component={Tests} />
          <Route path='/fortest' component={ForTest} />
          <Route path='/wptest/:id' component={BookPage} />
          <Route path='/wptest' component={WpTest} />
        </Switch>
      </Router>
    )
  }
}

const mapStateToProps = ({ 
  test: { currentQuestionNumber, testQuestions } 
}) => {
  return {
    currentQuestion: testQuestions
      ? testQuestions.length 
          ? testQuestions
              .filter((q, index) => index === currentQuestionNumber)[0]
          : {}
      : null,
    testQuestions
  }
}

export default connect(mapStateToProps, { initializeApp })(App)
