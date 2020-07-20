import React, { Fragment } from 'react'
import { Fab, Tooltip, makeStyles } from '@material-ui/core'
import { Home, List } from '@material-ui/icons'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import { getRoute, postTypes } from '../../utils/helpers';

const useStyles = makeStyles(theme => ({
  fab: {
    position: props => 
      props.header ? 'static' : 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    marginLeft: props => 
      props.header 
        ? theme.spacing(1)
        : 0,
  }
}))

function FabIcon(props) {
  const { 
    isWrongParams, 
    isNetworkError, 
    isLoading, 
    route, 
    is404 
  } = props

  const classes = useStyles(props)

  return (
    <Fragment>
      {(postTypes.indexOf(route) !== -1) && !isWrongParams && 
        !isNetworkError && !isLoading && 
        <Tooltip title="Question List">
          <Fab 
            className={classes.fab}
            href={`/questionlist/${route}`}
            size={props.header ? 'small' : 'large'}
          >
            <List />
          </Fab>
        </Tooltip>
      }
      
      {(route === 'questionlist' || is404) && !isLoading &&
        <Fab 
          className={classes.fab}
          href={'/'}
          size={props.header ? 'small' : 'large'}
        >
          <Home />
        </Fab>
      }
    </Fragment>
  )
}

const mapStateToProps = ({ appStatus, test, questionList }, props) => {
  const is404 = test.testQuestions === null && questionList.totalQuestions === -1
  const isWrongParams = appStatus.errorFromAPI === 404
  const isNetworkError = appStatus.errorFromAPI === 999

  return { 
    route: getRoute(props.location.pathname),
    isLoading: appStatus.isLoading,
    is404,
    isWrongParams,
    isNetworkError,
    postType: props.match.params.postType
  }
}

export default withRouter(connect(mapStateToProps)(FabIcon)) 
