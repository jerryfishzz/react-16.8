import React, { Component } from 'react'
import { 
  Grid, 
  Paper, 
  withStyles, 
} from '@material-ui/core';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';

import { initializeAppFromWordPress } from '../../actions/shared';
import { errorGenerator, getRoute } from '../../utils/helpers';
import WrongParams from '../../pages/WrongParams';
import { stopLoading, getError, resetAppStatus } from '../../actions/appStatus';
import LoadingPage from '../../pages/LoadingPage';
import NetworkErrorPage from '../../pages/NetworkErrorPage';
import FabIcon from '../layouts/FabIcon';
import InfoPage from '../../pages/InfoPage';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import ErrorAlert from '../layouts/ErrorAlert';
import { openAlert } from '../../actions/errorAlert';

const styles = theme => ({
	container: {
    minHeight: '100%'
  },
  content: {
    paddingTop: '64px'
  },
	paper: {
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
      paddingLeft: 0,
      paddingRight: 0,
    },
		[theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
    height: '100%',
    overflowX: 'hidden' // To get rid of the limit caused by the negative margin for implementing spacing value in Grid
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
      .then(() => stopLoading())
      .catch(err => {
        getError(err)
        stopLoading()
      })
  }

  render() {
    const {
      classes,
      testQuestions,
      isLoading,
      errorFromAPI,
      openAlert
    } = this.props 

    switch (errorFromAPI) {
      // Wrong parameters for post type or bad URL. Redirect.
      case 400:
      case 404:
      case 997:
        return <WrongParams error={errorGenerator(errorFromAPI)} />

      // Records mismatched with the server. Alert pop up.
      case 401:
      case 998:
        openAlert()
        break
        
      // Network error. Redirect.
      case 999:
        return <NetworkErrorPage error={errorGenerator(errorFromAPI)} />
      default:
        break
    }
    
    if (!testQuestions || isLoading) return <LoadingPage />

    if(!testQuestions.length) { 
      const info = 'No questions in this test'
      return <InfoPage info={info} />
    }

    return (
      <Grid container className={classes.container}>
        {/* Left */}
        <Grid item xs={12} sm={6} className={classes.content}>
          <Paper className={classes.paper} elevation={3}>
            <LeftSide />
          </Paper>
        </Grid>
        
        {/* Right */}
        <Grid item xs={12} sm={6} className={classes.content}>
          <Paper className={classes.paper} elevation={3}>
            <RightSide />
          </Paper>
        </Grid>
      
        <Grid item className={classes.fabIcon}>
          <FabIcon />
        </Grid>

        <ErrorAlert error={errorGenerator(errorFromAPI)} />
      </Grid>
    )
  }
}

const mapStateToProps = (
  { test: { testQuestions }, appStatus: { isLoading, errorFromAPI }},
  { location: { pathname }}) => ({
    testQuestions,
    postType: getRoute(pathname),
    isLoading,
    errorFromAPI
  })

export default withRouter(connect(
  mapStateToProps,
  { 
    initializeAppFromWordPress,
    stopLoading,
    getError,
    resetAppStatus,
    openAlert
  }
)(withStyles(styles)(Tests)))
