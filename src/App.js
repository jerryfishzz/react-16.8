import React, { Component } from 'react'
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import { Header } from './component/layouts';
import Tests from './component/tests';
import ForTest from './component/ForTest';
import { initializeAppFromWordPress } from './actions/shared';
import WpTest from './component/WpTest';
import BookPage from './component/wptest/BookPage';
import { getToken } from './utils/api';

class App extends Component {
  componentDidMount() {
    getToken()
      .then(token => {
        console.log(token)
        localStorage.setItem('token', token)
      })
      .catch(err => alert(err))
    
    this.props.initializeAppFromWordPress()
      .catch(err => alert(err))
  }

  render () {
    const { testQuestions } = this.props

    if (!testQuestions) {
      return <div>Loading</div>
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

export default connect(
  mapStateToProps, 
  { initializeAppFromWordPress }
)(App)
