import React, { Fragment, useState, useEffect} from 'react'
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
import { getType } from '../../utils/helpers';

const Header = ({ classes, shuffleQuestions, type, pathname }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClickOpen = () => {
    setDialogOpen(true)
  };

  const onClose = () => {
    setDialogOpen(false)
  };

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolBar}>
        <Typography 
          className={classes.flex} 
          variant="h5" 
          color="inherit"
        >
          CODE TEST
        </Typography>
        {pathname !== '/questionlist' && (
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
        
        {pathname !== '/questionlist'
          ? <Tooltip title="Question List">
              <Fab 
                color="primary"
                size="small"
                className={classes.link}
                onClick={shuffleQuestions}
                href={type === 'examples' || type === null
                  ? '/questionlist'
                  : `/questionlist?type=${type}`
                }
              >
                <ListIcon />
              </Fab>
            </Tooltip>
          : <Fab 
              color="primary"
              size="small"
              className={classes.link}
              onClick={shuffleQuestions}
              href={type === 'examples' || type === null
                ? '/'
                : `/test?type=${type}`
              }
            >
              <HomeIcon />
            </Fab>
        }
      </Toolbar>
    </AppBar>
  )
}

const mapStateToProps = (state, { location: { search, pathname } }) => {
  const query = new URLSearchParams(search)
  const type = query.get('type')

  return { 
    type,
    pathname
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

const styles = theme => ({
  flex: {
    flex: 1
  },
  fab: {
    marginRight: 8,
  },
  toolBar: {
    marginLeft: 10,
    marginRight: 10
  },
  link: {
    marginLeft: 16,
    backgroundColor: '#3e71bf'
  }
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Header)))
