import React from 'react'
import { 
  Paper, 
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(({
  container: {
    marginTop: 5,
    minHeight: 'calc(100% - 64px - 5px)',
  },
  paper: {
    height: '100%'
  },
}))

export default function Main({ Component, ...other }) {
  const classes = useStyles()

  return (
    <Grid container className={classes.container}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Component {...other} />
        </Paper>
      </Grid>
    </Grid>
  )
}
