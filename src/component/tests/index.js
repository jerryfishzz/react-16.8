import React, { Component } from 'react'
import { 
  Grid, 
  Paper, 
  withStyles, 
} from '@material-ui/core';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';

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
import ErrorAlert from '../layouts/ErrorAlert';

const styles = theme => ({
	container: {
    height: 'calc(100% - 64px)',
    position: 'relative'
  },
  item: {
    height: '100%'
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
      testQuestions,
      isLoading,
      errorFromAPI,
    } = this.props 

    // Wrong parameter for post type
    if (errorFromAPI === 404 || errorFromAPI === 400) {
      console.log(890)
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

        <ErrorAlert error={errorGenerator(errorFromAPI)} />
      </Grid>
    )
  }
}

const mapStateToProps = (
  { 
    test: { testQuestions },
    appStatus: { isLoading, errorFromAPI } 
  },
  { location }
) => {
  const postType = getType(location) ? getType(location) : BLANK_POSTTYPE
  
  return { 
    testQuestions,
    postType,
    isLoading,
    errorFromAPI
  }
}

export default withRouter(connect(
  mapStateToProps,
  { 
    initializeAppFromWordPress,
    stopLoading,
    getError,
    resetAppStatus,
  }
)(withStyles(styles)(Tests)))
