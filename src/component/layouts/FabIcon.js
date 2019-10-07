import React, { Fragment } from 'react'
import { Fab, Tooltip, makeStyles } from '@material-ui/core'
import { Home, List } from '@material-ui/icons'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import { getType, BLANK_POSTTYPE } from '../../utils/helpers';

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
    location: { pathname }, 
    isWrongParams, 
    isNetworkError, 
    isLoading, 
    type, 
    is404 
  } = props

  const classes = useStyles(props)

  return (
    <Fragment>
      {(pathname === '/tests' || pathname === '/') && !isWrongParams && 
        !isNetworkError && !isLoading && 
        <Tooltip title="Question List">
          <Fab 
            className={classes.fab}
            href={type === 'examples'
              ? '/questionlist'
              : `/questionlist?type=${type}`
            }
            size={props.header ? 'small' : 'large'}
          >
            <List />
          </Fab>
        </Tooltip>
      }
      
      {(pathname === '/questionlist' || is404) && !isLoading &&
        <Fab 
          className={classes.fab}
          href={type === 'examples' || is404 || isNetworkError || isWrongParams
            ? '/'
            : `/tests?type=${type}`
          }
          size={props.header ? 'small' : 'large'}
        >
          <Home />
        </Fab>
      }
    </Fragment>
  )
}

const mapStateToProps = (
  { appStatus, test, questionList }, 
  { location }
) => {
  const type = getType(location) ? getType(location) : BLANK_POSTTYPE
  const is404 = test.testQuestions === null && questionList.totalQuestions === -1
  const isWrongParams = appStatus.errorFromAPI === 404
  const isNetworkError = appStatus.errorFromAPI === 999

  return { 
    type,
    isLoading: appStatus.isLoading,
    is404,
    isWrongParams,
    isNetworkError,
    location
  }
}

export default withRouter(connect(mapStateToProps)(FabIcon)) 
