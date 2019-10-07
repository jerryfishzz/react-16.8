import React, { Fragment, useState } from 'react'
import { 
  IconButton, 
  AppBar, 
  Toolbar, 
  Typography, 
  withStyles, 
  Tooltip
} from '@material-ui/core';
import {Shuffle, Add} from '@material-ui/icons';

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import CreateDialog from '../tests/Dialog'
import { initializeAppFromWordPress } from '../../actions/shared.js';
import { getType, BLANK_POSTTYPE } from '../../utils/helpers';
import { stopLoading, getError, resetAppStatus } from '../../actions/appStatus';
import FabIcon from './FabIcon';


const styles = theme => ({
  title: {
    flexGrow: 1
  },
  fabIcon: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  }
})

const Header = ({ 
  classes, 
  shuffleQuestions, 
  type, 
  pathname,
  isLoading,
  is404,
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

        <div className={classes.fabIcon}>
          <FabIcon header={true} />
        </div>
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

  return { 
    type,
    pathname,
    isLoading: appStatus.isLoading,
    is404,
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
