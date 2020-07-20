import React, { Fragment } from 'react'
import { Fab, Tooltip, makeStyles } from '@material-ui/core'
import { Home, List, Shuffle } from '@material-ui/icons'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import { getRoute, postTypes } from '../../utils/helpers';
import { shuffleQuestions } from '../../actions/shared';

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
    is404,
    shuffleQuestions,
    test: { testQuestions }
  } = props

  const classes = useStyles(props)

  const handleShuffleQuestions = () => {
    shuffleQuestions(route, testQuestions)
  }

  return (
    <Fragment>
      <Tooltip title="Shuffle Questions">
        <Fab 
          className={classes.fab}
          onClick={handleShuffleQuestions}
        >
          <Shuffle />
        </Fab>
      </Tooltip>
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
    postType: props.match.params.postType,
    test
  }
}

export default withRouter(connect(mapStateToProps, { shuffleQuestions })(FabIcon)) 
