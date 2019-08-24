import React, { Component } from 'react'
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import { Header } from './component/layouts';
import Tests from './component/tests';
import ForTest from './component/ForTest';
import { initializeApp } from './actions/shared';

class App extends Component {
  componentDidMount() {
    this.props.initializeApp()
      .catch(err => alert(err))
  }

  render () {
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
