import React, { Fragment } from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import { connect } from 'react-redux'

import Form from './Form'
import Notes from './Notes'

const useStyles = makeStyles(theme => ({
  columnContainer: {
    height: '100%'
  },
  titleContainer: {
    minHeight: 72
  },
  itemQuestion: {
    overflowY: 'auto'
  },
  bottomContainer: {
    marginTop: theme.spacing(3)
  },
  navBtn: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  submitBtn: {
    width: '95%'
  },
}))

function RightSide(props) {
  const classes = useStyles()
  const { test: { editQuestion } } = props

  return (
    <Grid container direction="column" spacing={3} className={classes.columnContainer}>
      <Grid item container alignItems="center" className={classes.titleContainer}>
        <Typography variant='h5'>
          {editQuestion ? "Edit Question" : "Notes"}
        </Typography>
      </Grid>	

      <Grid item xs className={classes.itemQuestion}>
        {editQuestion
          ? <Fragment>
              <Typography variant="subtitle1">
                Items with * are required.
              </Typography>
              <Form />
            </Fragment>
          : <Notes />
        }
      </Grid>
    </Grid>
  )
}

const mapStateToProps = ({ test }) => {
  return { 
    test
  }
}

export default connect(mapStateToProps)(RightSide)
