import React, { Fragment, useState } from 'react'
import { 
  IconButton, 
  AppBar, 
  Toolbar,
  withStyles, 
  Tooltip,
  Grid,
  Typography
} from '@material-ui/core';
import { Add, Home, List } from '@material-ui/icons';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom';

import CreateDialog from '../tests/Dialog'
import { getRoute, postTypes, getQueryString, getPostType } from '../../utils/helpers';
import FabIcon from './FabIcon';

const styles = theme => ({
  title: {
    paddingLeft: theme.spacing(2)
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
            {/* Page title section */}
            {!is404 && (
              <Grid container alignItems="center">
                {postTypes.indexOf(route) !== -1 && (
                  <Fragment>
                    <Home />
                    <Typography variant="h6" className={classes.title}>HOME</Typography>
                  </Fragment>
                )}
                {route === 'add' && (
                  <Fragment>
                    <Add />
                    <Typography variant="h6" className={classes.title}>NEW</Typography>
                  </Fragment>
                )}
                {route === 'questionlist' && (
                  <Fragment>
                    <List />
                    <Typography variant="h6" className={classes.title}>LIST</Typography>
                  </Fragment>
                )}
              </Grid>
            )}

            {/* Nav section */}
            {!is404 && route !== 'add' &&
              <Tooltip title="Add Question">
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  to={postTypes.indexOf(route) !== -1
                    ? `/add?type=${route}`
                    : `/add?type=${postType}`}>
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
                    to={!is404 ? `/${postType}` : '/'}>
                    <Home />
                  </IconButton>
                </Tooltip>
                {!is404 && 
                  <Tooltip title="Question List">
                    <IconButton color="inherit" component={Link} to={`/questionlist/${postType}`}>
                      <List />
                    </IconButton>
                  </Tooltip>}
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

const mapStateToProps = ({ appStatus, test, questionList }, { location }) => {
  const route = getRoute(location.pathname)

  const is404 = route !== 'add'
    ? test.testQuestions === null && questionList.totalQuestions === -1
    : postTypes.indexOf(getQueryString(location)) === -1

  return { 
    route,
    isLoading: appStatus.isLoading,
    is404,
    postType: route !== 'add' 
      ? getPostType(location.pathname) 
      : getQueryString(location)
    // Here cannot use match property 
    // since Header is not among any component under routes created by React Router
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Header)))
