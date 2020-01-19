import React from 'react'
import { 
  Grid,
  Typography,
  IconButton,
  Button,
  makeStyles,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
} from '@material-ui/core'
import { 
  Edit, 
  Delete, 
  KeyboardArrowLeft, 
  KeyboardArrowRight 
} from '@material-ui/icons'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { 
  handleNext, 
  handleBack, 
  handleSubmitQuestion, 
  handleRemoveQuestionFromWp
} from '../../actions/test/shared'
import Question from './Question'
import { toggleEdit } from '../../actions/test/editQuestion'
import { getType, BLANK_POSTTYPE, QUESTION_COUNTS } from '../../utils/helpers'
import { getError } from '../../actions/appStatus'
import { openBar } from '../../actions/snackBar'
import SnackBar from '../layouts/SnackBar'

const useStyles = makeStyles(theme => ({
  columnContainer: {
    height: '100%'
  },
  contentWidth: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '75%'
    }
  },
  title: {
    flexGrow: 1
  },
  itemQuestion: {
    overflowY: 'auto',
  },
  bottomContainer: {
    marginTop: theme.spacing(3)
  },
  navBtn: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  subContainer: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    maxWidth: '75%'
  },
}))

function LeftSide(props) {
  const classes = useStyles()
  const { 
    currentQuestionNumber,
    testQuestions,
    editQuestion,
    offset,
    currentQuestion,
    handleNext, 
    handleBack, 
    handleSubmitQuestion,
    toggleEdit,
    postType,
    handleRemoveQuestionFromWp,
    getError,
    openBar,
  } = props

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // This should be used to prevent this question being chosen again from database. 
  // Implement the simple delete first. Later will work on the above requiremnet.
  const handleDelete = id => {
    handleRemoveQuestionFromWp(id, postType)
      .then(res => {
        handleClose()

        // When res is a function, run it.
        // The return from the function will be an error.
        // Then it will jump to the catch block directly
        if (typeof res === 'function') res()

        const message = 'The question has been deleted.'
        openBar(message)
      })
      .catch(err => {
        handleClose()
        getError(err)
      })
  }

  return (
    <Grid 
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
        className={classes.contentWidth}
      >
        <Typography
          variant='h5'
          className={classes.title}
        >
          {`Question ${currentQuestionNumber + 1} / 
            ${testQuestions.length >= QUESTION_COUNTS - offset
              ? QUESTION_COUNTS - offset : testQuestions.length}`}
        </Typography>
        <IconButton 
          color={!editQuestion ? 'primary' : 'default'} 
          onClick={toggleEdit}
        >
          <Edit />
        </IconButton>
        <IconButton 
          color='secondary' 
          onClick={handleClickOpen}
        >
          <Delete />
        </IconButton>
        <Dialog
          open={open}
          fullWidth
          maxWidth='sm'
        >
          <DialogTitle>Delete Question</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure to delete this question?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              No
            </Button>
            <Button 
              onClick={() => handleDelete(currentQuestion.id)} 
              color="secondary" 
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <SnackBar />
      </Grid>	

      <Grid 
        item 
        xs 
        className={`${classes.itemQuestion} ${classes.contentWidth}`}
      >
        <Question />
      </Grid>  
      
      <Grid 
        item 
        container 
        justify="space-between" 
        className={classes.bottomContainer}
      >
        <Grid item>
          <Button
            onClick={handleBack} 
            disabled={currentQuestionNumber === 0}
            className={classes.navBtn}
            disableRipple
          >
            <KeyboardArrowLeft />
            Back
          </Button>
        </Grid>
        <Grid item xs className={classes.subContainer}>
          <Button 
            fullWidth
            variant="contained"
            color='primary'
            onClick={() => handleSubmitQuestion(currentQuestion.id)}
            disabled={
              currentQuestion.isSubmitted || 
              !currentQuestion.selectedAnswers.length
            }
          >
            Submit
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={handleNext} 
            disabled={testQuestions.length >= QUESTION_COUNTS - offset
              ? currentQuestionNumber === QUESTION_COUNTS - offset - 1
              : currentQuestionNumber === testQuestions.length - 1}
            className={classes.navBtn}
            disableRipple
          >
            Next
            <KeyboardArrowRight />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (
  { test: { editQuestion, currentQuestionNumber, testQuestions, offset } },
  { location }
) => {
  const currentQuestion = testQuestions
    ? testQuestions.length 
        ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
        : {}
    : null
  
  const postType = getType(location) ? getType(location) : BLANK_POSTTYPE
  
  return { 
    editQuestion,
    currentQuestionNumber,
    testQuestions,
    currentQuestion,
    offset,
    postType
  }
}

export default withRouter(connect(
  mapStateToProps,
  { 
    handleNext, 
    handleBack, 
    handleSubmitQuestion, 
    toggleEdit,
    handleRemoveQuestionFromWp,
    getError,
    openBar,
  }
)(LeftSide))