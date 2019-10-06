import React, { Fragment, useState } from 'react'
import { 
  IconButton, 
  AppBar, 
  Toolbar, 
  Typography, 
  withStyles, 
  Tooltip
} from '@material-ui/core';
import {Shuffle, List, Home, Add} from '@material-ui/icons';

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import CreateDialog from '../tests/Dialog'
import { initializeAppFromWordPress } from '../../actions/shared.js';
import { getType, BLANK_POSTTYPE } from '../../utils/helpers';
import { stopLoading, getError, resetAppStatus } from '../../actions/appStatus';


const styles = ({
  title: {
    flexGrow: 1
  },
})

const Header = ({ 
  classes, 
  shuffleQuestions, 
  type, 
  pathname,
  isLoading,
  is404,
  isWrongParams,
  isNetworkError,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClickOpen = () => {
    setDialogOpen(true)
  };

  const onClose = () => {
    setDialogOpen(false)
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          className={classes.title} 
          variant="h5" 
        >
          CODE TEST
        </Typography>

        {pathname !== '/questionlist' && !is404 && !isLoading && (
          <Fragment>
            {type !== 'temps' && (
              <Tooltip title="Shuffle Questions">
                <IconButton 
                  color="inherit"
                  onClick={shuffleQuestions}
                >
                  <Shuffle />
                </IconButton>
              </Tooltip>
            )}
            <IconButton 
              onClick={handleClickOpen} 
              color="inherit"
            >
              <Add />
            </IconButton>
            <CreateDialog 
              comeFrom="header"
              open={dialogOpen}
              onClose={onClose}
            />
          </Fragment>
        )}
        
        {(pathname === '/tests' || pathname === '/') && !isWrongParams && !isNetworkError && !isLoading && 
          <Tooltip title="Question List">
            <IconButton 
              color="inherit"
              className={classes.link}
              href={type === 'examples'
                ? '/questionlist'
                : `/questionlist?type=${type}`
              }
            >
              <List />
            </IconButton>
          </Tooltip>
        }
        
        {(pathname === '/questionlist' || is404) && !isLoading &&
          <IconButton 
            color="inherit"
            className={classes.link}
            href={type === 'examples' || is404 || isNetworkError || isWrongParams
              ? '/'
              : `/tests?type=${type}`
            }
          >
            <Home />
          </IconButton>
        }
      </Toolbar>
    </AppBar>
  )
}

const mapStateToProps = (
  { appStatus, test, questionList }, 
  { location: { pathname }, location }
) => {
  const type = getType(location) ? getType(location) : BLANK_POSTTYPE
  const is404 = test.testQuestions === null && questionList.totalQuestions === -1
  const isWrongParams = appStatus.errorFromAPI === 404
  const isNetworkError = appStatus.errorFromAPI === 999

  return { 
    type,
    pathname,
    isLoading: appStatus.isLoading,
    is404,
    isWrongParams,
    isNetworkError
  }
}

const mapDispatchToProps = (dispatch, { location }) => {
  const postType = getType(location)

  return {
    shuffleQuestions: async () => {
      dispatch(resetAppStatus())

      try {
        await dispatch(initializeAppFromWordPress(null, postType))
        dispatch(stopLoading())
      } catch(err) {
        // alert(err)
        dispatch(getError(err))
      }
    },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Header)))
