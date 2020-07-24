import React from 'react'
import { 
  Paper, 
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import FabIcon from './FabIcon'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { postTypes, getRoute } from '../../utils/helpers';

const useStyles = makeStyles(theme => ({
  container: {
    minHeight: '100%'
  },
  content: {
    paddingTop: '64px'
  },
  fabIcon: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
}))

function Main({ Component, route, isLoading, ...other }) {
  const classes = useStyles()

  return (
    <Grid container className={classes.container}>
      <Grid item xs className={classes.content}>
        <Component {...other} />
      </Grid>
      {postTypes.indexOf(route) !== -1 && !isLoading &&
        <Grid item className={classes.fabIcon}>
          <FabIcon />
        </Grid>
      }
    </Grid>
  )
}

const mapStateToProps = ({ appStatus: { isLoading }}, { location: { pathname }}) => ({
  route: getRoute(pathname),
  isLoading
})

export default withRouter(connect(mapStateToProps)(Main)) 