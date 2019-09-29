import React from 'react'
import { Grid, Typography, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  item: {
    paddingTop: theme.spacing(3)
  },
}))

function Loading() {
  const classes = useStyles()

  return (
    <Grid container justify="center">
      <Grid item container className={classes.item} direction="column" alignItems="center" spacing={1}>
        <Grid item>
          <CircularProgress />
        </Grid>
        <Grid item>
          <Typography variant="button">Loading...</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Loading
