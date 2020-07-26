import React, { Component } from 'react'
import { CssBaseline, withStyles } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import { Header } from './component/layouts';
import Tests from './component/tests';
import ForTest from './component/ForTest';
import { getToken } from './utils/api';
import QuestionList from './component/tests/QuestionList';
import PageNotFound from './pages/PageNotFound';
import { getError, stopLoading } from './actions/appStatus';
import LoadingPage from './pages/LoadingPage';
import NetworkErrorPage from './pages/NetworkErrorPage';
import { errorGenerator, postTypes } from './utils/helpers';
import './App.css'
import AddQuestion from './pages/AddQuestion';

const styles = ({
	'@global': {
    'html, body, #root': {
      height: '100%'
    } 
	},
})

class App extends Component {
  state = {
    isLoading: true
  }

  componentDidMount() {
    const { getError, stopLoading } = this.props

    getToken()
      .then(token => {
        localStorage.setItem('token', token)
        this.setState({isLoading: false})
      })
      .catch(err => {
        getError(err)
        stopLoading()
        this.setState({isLoading: false})
      })
  }

  render () {
    const { appStatus: { errorFromAPI } } = this.props
    const { isLoading } = this.state

    return (
      <Router>
        <CssBaseline />
        <Header />
        {isLoading
          ? <LoadingPage />
          : errorFromAPI === 999
            ? <NetworkErrorPage error={errorGenerator(errorFromAPI)} />
            : <Switch>
                <Route path='/' exact component={Tests} />
                {postTypes.map(postType => 
                  <Route key={postType} path={`/${postType}`} exact component={Tests} />
                )}
                <Route path='/fortest' component={ForTest} />
                <Route path='/questionlist/:postType' component={QuestionList} />
                <Route path='/add' component={AddQuestion} />
                <Route component={PageNotFound} />
              </Switch>
        }
      </Router>
    )
  }
}

const mapStateToProps = ({ appStatus }) => {
  return { 
    appStatus
  }
}

export default connect(
  mapStateToProps, 
  { getError, stopLoading }
)(withStyles(styles)(App))
