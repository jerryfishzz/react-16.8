import React, { Fragment, useState } from 'react'
import { 
  IconButton, 
  AppBar, 
  Toolbar,
  withStyles, 
  Tooltip
} from '@material-ui/core';
import { Add, Home, List } from '@material-ui/icons';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom';

import CreateDialog from '../tests/Dialog'
import { getRoute, postTypes } from '../../utils/helpers';
import FabIcon from './FabIcon';

const styles = theme => ({
  title: {
    flexGrow: 1
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'end'
  },
  fabIcon: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  }
})

const Header = ({ 
  classes,
  postType,
  route,
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
    <AppBar position="fixed">
      <Toolbar className={classes.toolBar}>
        {!isLoading && (
          <Fragment>
            {!is404 && route !== 'add' &&
              <Tooltip title="Add Question">
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  to={postTypes.indexOf(route) !== -1
                    ? `/add/${route}`
                    : `/add/${postType}`}>
                  <Add />
                </IconButton>
              </Tooltip>
            }
            {postTypes.indexOf(route) !== -1 
              ? <Tooltip title="Question List">
                  <IconButton color="inherit" component={Link} to={`/questionlist/${route}`}>
                    <List />
                  </IconButton>
                </Tooltip>
              : route !== 'add' && 
                  <Tooltip title="Home">
                    <IconButton 
                      color="inherit" 
                      component={Link} 
                      to={route === 'questionlist' && !is404
                        ? `/${postType}`
                        : '/'}>
                      <Home />
                    </IconButton>
                  </Tooltip>
            }
            {route === 'add' &&
              <Fragment>
                <Tooltip title="Home">
                  <IconButton 
                    color="inherit" 
                    component={Link} 
                    to={`/${postType}`}>
                    <Home />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Question List">
                  <IconButton color="inherit" component={Link} to={`/questionlist/${postType}`}>
                    <List />
                  </IconButton>
                </Tooltip>
              </Fragment>
            }
            
            <CreateDialog 
              comeFrom="header"
              open={dialogOpen}
              onClose={onClose}
            />
          </Fragment>
        )}

        {/* Nav Icon when breakpoint below sm */}
        <div className={classes.fabIcon}>
          <FabIcon header={true} />
        </div>
      </Toolbar>
    </AppBar>
  )
}

const mapStateToProps = ({ appStatus, test, questionList }, { location: { pathname }}) => {
  const is404 = test.testQuestions === null && questionList.totalQuestions === -1

  return { 
    route: getRoute(pathname),
    isLoading: appStatus.isLoading,
    is404,
    postType: pathname.split('/')[2]
    // Here cannot use match property 
    // since Header is not among any component under routes created by React Router
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Header)))
