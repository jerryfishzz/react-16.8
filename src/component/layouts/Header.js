import React, { Fragment, useState } from 'react'
import { 
  Fab, 
  AppBar, 
  Toolbar, 
  Typography, 
  withStyles, 
  Tooltip 
} from '@material-ui/core';
import Shuffle from '@material-ui/icons/Shuffle';
import ListIcon from '@material-ui/icons/List';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import CreateDialog from '../tests/Dialog'
import { initializeAppFromWordPress } from '../../actions/shared.js';
import { resetNumber } from '../../actions/test/currentQuestionNumber.js';
import { resetEdit } from '../../actions/test/editQuestion';
import { getType, BLANK_POSTTYPE } from '../../utils/helpers';


const styles = ({
  flex: {
    flex: 1
  },
  fab: {
    marginRight: 8,
  },
  link: {
    marginLeft: 16,
    backgroundColor: '#3e71bf'
  }
})

const Header = ({ 
  classes, 
  shuffleQuestions, 
  type, 
  pathname,
  isLoading,
  is404,
  isWrongParams,
  isNetworkError
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
          className={classes.flex} 
          variant="h5" 
          color="inherit"
        >
          CODE TEST
        </Typography>

        {pathname !== '/questionlist' && !is404 && !isLoading && (
          <Fragment>
            <Tooltip title="Shuffle Questions">
              <Fab 
                color="secondary"
                size="small"
                className={classes.fab}
                onClick={shuffleQuestions}
                disabled={type === 'temps'}
              >
                <Shuffle />
              </Fab>
            </Tooltip>
            <Fab 
              onClick={handleClickOpen} 
              size="small"
              color="secondary"
            >
              <AddIcon />
            </Fab>
            <CreateDialog 
              comeFrom="header"
              open={dialogOpen}
              onClose={onClose}
            />
          </Fragment>
        )}
        
        {(pathname === '/tests' || pathname === '/') && !isWrongParams && !isNetworkError && !isLoading && 
          <Tooltip title="Question List">
            <Fab 
              color="primary"
              size="small"
              className={classes.link}
              onClick={shuffleQuestions}
              href={type === 'examples'
                ? '/questionlist'
                : `/questionlist?type=${type}`
              }
            >
              <ListIcon />
            </Fab>
          </Tooltip>
        }
        
        {(pathname === '/questionlist' || is404) && !isLoading &&
          <Fab 
            color="primary"
            size="small"
            className={classes.link}
            onClick={shuffleQuestions}
            href={type === 'examples' || is404 || isNetworkError || isWrongParams
              ? '/'
              : `/tests?type=${type}`
            }
          >
            <HomeIcon />
          </Fab>
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
  const resetNumberAndEdit = () => {
    return dispatch => {
      dispatch(resetNumber())
      dispatch(resetEdit())
    }
  }

  const postType = getType(location)

  return {
    shuffleQuestions: () => {
      dispatch(initializeAppFromWordPress(resetNumberAndEdit, postType))
    }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Header)))
