import React, { Component, Fragment } from 'react'
import { 
  Typography, 
  Grid, 
  Paper, 
  withStyles, 
  Button,
  IconButton,
} from '@material-ui/core';
import { Edit, Delete, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';

import Question from './Question'
import Notes from './Notes';
import Form from './Form'
import { toggleEdit } from '../../actions/test/editQuestion';
import {
  handleSubmitQuestion, 
  handleRemoveQuestionFromWp,
  handleNext,
  handleBack
} from '../../actions/test/shared';
import { initializeAppFromWordPress } from '../../actions/shared';
import { getType, errorGenerator, BLANK_POSTTYPE } from '../../utils/helpers';
import WrongParams from '../../pages/WrongParams';
import { stopLoading, getError, resetAppStatus } from '../../actions/appStatus';
import LoadingPage from '../../pages/LoadingPage';
import NetworkErrorPage from '../../pages/NetworkErrorPage';
import FabIcon from '../layouts/FabIcon';
import InfoPage from '../../pages/InfoPage';
import LeftSide from './LeftSide';
import RightSide from './RightSide';

const styles = theme => ({
	container: {
    height: 'calc(100% - 64px)',
    position: 'relative'
  },
  item: {
    // [theme.breakpoints.up('sm')]: {
    //   height: '100%'
    // },
		// [theme.breakpoints.down('xs')]: {
    //   height: '90%'
    // }
  },
	paper: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(5),
    },
		[theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
		height: 'calc(100% - 5px)',
    marginTop: 5,
  },
  
  messageContainer: {
    marging: 20,
    padding: 20,
    textAlign: 'center'
  },
  fabIcon: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
})

class Tests extends Component {
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
      errorFromAPI,
      handleNext,
      handleBack
    } = this.props 

    // Wrong parameter for post type
    if (errorFromAPI === 404) {
      return <WrongParams error={errorGenerator(errorFromAPI)} />
    }

    if (errorFromAPI === 999) {
      return <NetworkErrorPage error={errorGenerator(errorFromAPI)} />
    }
    
    if (isLoading) return <LoadingPage />

    if(!testQuestions.length) { 
      const info = 'No questions in this test'
      return <InfoPage info={info} />
    }

    return (
      <Grid container className={classes.container}>

        {/* Left */}
        <Grid item xs={12} sm={6} className={classes.item}>
          <Paper className={classes.paper}>
            <LeftSide />
          </Paper>
        </Grid>
        
        {/* Right */}
        <Grid item xs={12} sm={6} className={classes.item}>
          <Paper className={classes.paper}>
            <RightSide />
          </Paper>
        </Grid>
      
        <Grid item className={classes.fabIcon}>
          <FabIcon />
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

export default withRouter(connect(
  mapStateToProps,
  { 
    toggleEdit, 
    handleSubmitQuestion,
    handleRemoveQuestionFromWp,
    initializeAppFromWordPress,
    stopLoading,
    getError,
    resetAppStatus,
    handleNext, 
    handleBack
  }
)(withStyles(styles)(Tests)))
