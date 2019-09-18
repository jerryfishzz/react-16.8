import React, { Component } from 'react'
import { CssBaseline, withStyles } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Header } from './component/layouts';
import Tests from './component/tests';
import ForTest from './component/ForTest';
import { getToken } from './utils/api';
import QuestionList from './component/tests/QuestionList';

class App extends Component {
  state = {
    willHaveToken: true 
  }

  componentDidMount() {
    getToken()
      .then(token => {
        localStorage.setItem('token', token)
        this.setState({
          willHaveToken: true
        })
      })
      .catch(err => {
        this.setState({
          willHaveToken: false
        })
        alert(err)
      })
  }

  render () {
    const { classes } = this.props
    const { willHaveToken } = this.state

    if (!willHaveToken) {
      return (
        <div className={classes.container}>
          <p>Network error</p>
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
          <Route path='/test' exact component={Tests} />
          <Route path='/questionlist' exact component={QuestionList} />
        </Switch>
      </Router>
    )
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

export default withStyles(styles)(App)
