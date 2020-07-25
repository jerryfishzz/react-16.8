import React, { Fragment, useEffect } from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import { red } from '@material-ui/core/colors';

import Form from './Form'
import { connect } from 'react-redux';
import LoadingPage from '../../pages/LoadingPage';
import { stopLoading, resetAppStatus } from '../../actions/appStatus';

const useStyles = makeStyles(theme => ({
  columnContainer: {
    height: '100%',
    width: '70%',
  },
  contentWidth: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '85%'
    }
  },
  titleContainer: {
    minHeight: 72
  },
  astra: {
    color: red[500]
  }
}))

function CreateQuestion(props) {
  const classes = useStyles()
  const { appStatus: { isLoading }, stopLoading, resetAppStatus } = props

  useEffect(() => {
    resetAppStatus()
    stopLoading()
  }, [])

  if (isLoading) return <LoadingPage />

  return (
    <Grid container justify="center">
      <Grid 
        item
        container 
        direction="column"
        alignItems="center"
        spacing={3} 
        className={classes.columnContainer}
      >
        <Grid 
          item 
          container 
          alignItems="center" 
          className={`${classes.titleContainer} ${classes.contentWidth}`}
        >
          <Typography variant='h5'>
            Add Question
          </Typography>
        </Grid>	

        <Grid item xs className={classes.contentWidth}>
          <Fragment>
            <Typography variant="subtitle1" gutterBottom>
              Items with <span className={classes.astra}>*</span> are required.
            </Typography>
            <Form isNewlyCreated={true} />
          </Fragment>
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = ({ appStatus }, { location }) => {
  console.log(location)

  return { 
    appStatus,
    // postType: 
  }
}

export default connect(mapStateToProps, { stopLoading, resetAppStatus })(CreateQuestion)
