import React, { Component, Fragment } from 'react'
import { 
  Typography, 
  Grid, 
  Paper, 
  withStyles, 
  Button,
  IconButton
} from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';

import Question from './Question'
import ProgressingBar from './ProgressingBar';
import Notes from './Notes';
import Form from './Form'
import { toggleEdit } from '../../actions/test/editQuestion';
import {
  handleSubmitQuestion, 
  handleRemoveQuestionFromWp
} from '../../actions/test/shared';
import { initializeAppFromWordPress } from '../../actions/shared';
import { getType, errorGenerator, BLANK_POSTTYPE } from '../../utils/helpers';
import WrongParams from '../../pages/WrongParams';
import { stopLoading, getError, resetAppStatus } from '../../actions/appStatus';
import LoadingPage from '../../pages/LoadingPage';
import NetworkErrorPage from '../../pages/NetworkErrorPage';

class Tests extends Component {
  state = {
    willBeInitialized: true,
    wrongParams: ''
  }

  handleEdit = () => {
    const { toggleEdit } = this.props
    toggleEdit()
  }

  // This should be used to prevent this question being chosen again from database. 
  // Implement the simple delete first. Later will work on the above requiremnet.
  handleDelete = id => {
    const { handleRemoveQuestionFromWp, postType, getError } = this.props
    handleRemoveQuestionFromWp(id, postType)
      .catch(err => {
        getError(err)
        // alert(err)
      })
  }

  componentDidMount() {
    const { 
      postType, 
      stopLoading, 
      getError,
      initializeAppFromWordPress,
      resetAppStatus
    } = this.props

    resetAppStatus()
    initializeAppFromWordPress(null, postType)
      .then(res => stopLoading())
      .catch(err => {
        getError(err)
        stopLoading()
      })
  }

  render() {
    const {
      classes,
      currentQuestionNumber,
      testQuestions,
      currentQuestion,
      editQuestion,
      handleSubmitQuestion,
      isLoading,
      errorFromAPI
    } = this.props 

    const { willBeInitialized } = this.state

    if (!willBeInitialized) {
      return (
        <div className={classes.messageContainer}>
          <p>Initialize error</p>
        </div>
      )
    }

    // Wrong parameter for post type
    if (errorFromAPI === 404) {
      return <WrongParams error={errorGenerator(errorFromAPI)} />
    }

    if (errorFromAPI === 999) {
      return <NetworkErrorPage error={errorGenerator(errorFromAPI)} />
    }
    
    if (isLoading) return <LoadingPage />

    if(!testQuestions.length) { // Need to consider when no questions
      return <div className={classes.messageContainer}>No questions</div>
    }

    return (
      <Grid container className={classes.container}>

        {/* Left */}
        <Grid item xs={12} sm={6} className={classes.item}>
          <Paper className={classes.paper}>
            <Grid container alignItems="center">
              <Typography
                variant='h5'
                className={classes.flex}
                display="inline"
                gutterBottom
              >
                {testQuestions.length 
                  ? `Question ${currentQuestionNumber + 1} / ${testQuestions.length}`
                  : 'No questions to diplay'
                }
              </Typography>
              {testQuestions.length !== 0 && 
                <Fragment>
                  <IconButton 
                    color={!editQuestion ? 'primary' : 'secondary'} 
                    onClick={this.handleEdit}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color='primary' 
                    onClick={() => this.handleDelete(currentQuestion.id)}
                  >
                    <Delete />
                  </IconButton>
                </Fragment>
              }
            </Grid>	

            {testQuestions.length !== 0 &&
              <Fragment>
                <Question />
                
                <Button 
                  className={classes.submitBtn}
                  variant="contained"
                  color='primary'
                  onClick={
                    () => handleSubmitQuestion(
                      currentQuestion.id, 
                      currentQuestion.selectedAnswer
                    )
                  }
                  disabled={
                    currentQuestion.isSubmitted || 
                    currentQuestion.selectedAnswer === null
                  }
                >
                  Submit
                </Button>

                <ProgressingBar key={currentQuestionNumber} />
              </Fragment>
            }
          </Paper>
        </Grid>
        
        {/* Right */}
        <Grid item xs={12} sm={6} className={classes.item}>
          <Paper className={classes.paper}>
            <Grid container alignItems="center">
              <Typography variant='h5' gutterBottom>
                {editQuestion
                  ? "Edit Question"
                  : "Notes"
                }
              </Typography>
            </Grid>
            {editQuestion
              ? <Fragment>
                  <Typography
                    variant="subtitle1"
                  >
                    Items with * are required.
                  </Typography>
                  <Form paddingRight={10} />
                </Fragment>
              : <Notes />
            }
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (
  { 
    test: { editQuestion, currentQuestionNumber, testQuestions },
    appStatus: { isLoading, errorFromAPI } 
  },
  { location }
) => {
  const currentQuestion = testQuestions
    ? testQuestions.length 
        ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
        : {}
    : null
  const postType = getType(location) ? getType(location) : BLANK_POSTTYPE
  
  return { 
    editQuestion,
    currentQuestionNumber,
    testQuestions,
    currentQuestion,
    postType,
    isLoading,
    errorFromAPI
  }
}

const styles = theme => ({
	container: {
    height: 'calc(100% - 64px)'
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
      height: '90%'
    }
  },
  submitBtn: {
    margin: '10px 0'
  },
  flex: {
    flex: 1
  },
  messageContainer: {
    marging: 20,
    padding: 20,
    textAlign: 'center'
  },
})

export default withRouter(connect(
  mapStateToProps,
  { 
    toggleEdit, 
    handleSubmitQuestion,
    handleRemoveQuestionFromWp,
    initializeAppFromWordPress,
    stopLoading,
    getError,
    resetAppStatus
  }
)(withStyles(styles)(Tests)))
