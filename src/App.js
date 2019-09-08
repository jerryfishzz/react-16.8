import React, { Component } from 'react'
import { CssBaseline, withStyles } from '@material-ui/core';
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
        localStorage.setItem('token', token)
      })
      .catch(err => alert(err))
    
    this.props.initializeAppFromWordPress()
      .catch(err => alert(err))
  }

  render () {
    const { testQuestions, classes } = this.props

    if (!testQuestions) {
      return (
        <div className={classes.container}>
          <p>
            This site is still under construction and currently using 
            self-signed certificate that does not make the browser happy.
          </p>
          <p>
            If you end up here, that means the browser security setting blocks
            the API request.
          </p>
          <p>
            Please go to <a href='https://149.28.94.113/wp-json/wp/v2/posts/'>
               https://149.28.94.113/wp-json/wp/v2/posts/
            </a>.
          </p>
          <p>
            When the security warning comes out, choose ignore and go on visiting. You 
            will see JSON strings output on the screen. Now your browser won't 
            block API requests.
          </p>
          <p>Revisit this page again. My app comes back.</p>
          <p>
            Will solve this problem soon. Sorry for the trouble and thanks for 
            collaboration : )
          </p>
        </div>
      )
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

const styles = theme => ({
	'@global': {
    'html, body, #root': {
      height: '100%'
    } 
	},
	container: {
    marging: 20,
    padding: 20,
    textAlign: 'center'
  },
	paper: {
    [theme.breakpoints.up('sm')]: {
      padding: 40,
    },
		[theme.breakpoints.down('xs')]: {
      padding: 20,
    },
		height: 'calc(100% - 5px)',
    marginTop: 5,
  },
	item: {
    [theme.breakpoints.up('sm')]: {
      height: '100%'
    },
		[theme.breakpoints.down('xs')]: {
      height: '80%'
    }
  },
  submitBtn: {
    margin: '10px 0'
  },
  flex: {
    flex: 1
  }
})

export default connect(
  mapStateToProps, 
  { initializeAppFromWordPress }
)(withStyles(styles)(App))
