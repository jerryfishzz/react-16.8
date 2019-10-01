import React from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import sad from '../../images/sad.png'

const useStyles = makeStyles(theme => ({
  container: {
    padding: 12,
  },
  item: {
    paddingTop: theme.spacing(5),
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  img: {
    width: '40%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  }
}))

const ErrorFound = ({ error }) => {
  const classes = useStyles()

  return (
    <Grid container justify="center" className={classes.container}>
      <Grid 
        item 
        container 
        className={classes.item} 
        direction="column" 
        alignItems="center" 
        spacing={3}
      >
        <Grid item>
          <Typography variant="h5">{error}</Typography>
        </Grid>
        <Grid item container justify="center">
          <img alt="error" src={sad} className={classes.img} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ErrorFound
