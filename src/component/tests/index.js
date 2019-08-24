import React, { Component, Fragment } from 'react'
import { 
  Typography, 
  Grid, 
  Paper, 
  withStyles, 
  Button,
  IconButton
} from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import { connect } from 'react-redux'

import Question from './Question'
import ProgressingBar from './ProgressingBar';
import Notes from './Notes';
import Form from './Form'
import { toggleEdit } from '../../actions/test/editQuestion';
import { 
  handleRemoveQuestion, 
  handleSubmitQuestion 
} from '../../actions/test/shared';


class Tests extends Component {
  handleEdit = () => {
    const { toggleEdit } = this.props
    toggleEdit()
  }

  // This should be used to prevent this question being chosen again from database. 
  // Implement the simple delete first. Later will work on the above requiremnet.
  handleDelete = id => {
    const { handleRemoveQuestion } = this.props
    handleRemoveQuestion(id)
  }

  render() {
    const {
      classes,
      currentQuestionNumber,
      testQuestions,
      currentQuestion,
      editQuestion,
      handleSubmitQuestion,
    } = this.props 

    return (
      <Grid container className={classes.container}>

        {/* Left */}
        <Grid item xs={12} sm={6} className={classes.item}>
          <Paper className={classes.paper}>
            <Grid container alignItems="center">
              <Typography
                variant='h5'
                className={classes.flex}
                display="inline"
                gutterBottom
              >
                {testQuestions.length 
                  ? `Question ${currentQuestionNumber + 1} / ${testQuestions.length}`
                  : 'No questions to diplay'
                }
              </Typography>
              {testQuestions.length !== 0 && 
                <Fragment>
                  <IconButton 
                    color={!editQuestion ? 'primary' : 'secondary'} 
                    onClick={this.handleEdit}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color='primary' 
                    onClick={() => this.handleDelete(currentQuestion.id)}
                  >
                    <Delete />
                  </IconButton>
                </Fragment>
              }
            </Grid>	

            {testQuestions.length !== 0 &&
              <Fragment>
                <Question />
                
                <Button 
                  className={classes.submitBtn}
                  variant="contained"
                  color='primary'
                  onClick={
                    () => handleSubmitQuestion(
                      currentQuestion.id, 
                      currentQuestion.selectedAnswer
                    )
                  }
                  disabled={
                    currentQuestion.isSubmitted || 
                    currentQuestion.selectedAnswer === null
                  }
                >
                  Submit
                </Button>

                <ProgressingBar key={currentQuestionNumber} />
              </Fragment>
            }
          </Paper>
        </Grid>
        
        {/* Right */}
        <Grid item xs={12} sm={6} className={classes.item}>
          <Paper className={classes.paper}>
            <Grid container alignItems="center">
              <Typography variant='h5' gutterBottom>
                {editQuestion
                  ? "Edit Question"
                  : "Notes"
                }
              </Typography>
            </Grid>
            {editQuestion
              ? <Fragment>
                  <Typography
                    variant="subtitle1"
                  >
                    Items with * are required.
                  </Typography>
                  <Form paddingRight={10} />
                </Fragment>
              : <Notes />
            }
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = ({ 
  test: { editQuestion, currentQuestionNumber, testQuestions } 
}) => {
  const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}

  return { 
    editQuestion,
    currentQuestionNumber,
    testQuestions,
    currentQuestion
  }
}

const styles = theme => ({
	'@global': {
    'html, body, #root': {
      height: '100%'
    } 
	},
	container: {
    height: 'calc(100% - 64px)'
  },
	paper: {
    [theme.breakpoints.up('sm')]: {
      padding: 40,
    },
		[theme.breakpoints.down('xs')]: {
      padding: 20,
    },
		height: 'calc(100% - 5px)',
    marginTop: 5,
  },
	item: {
    [theme.breakpoints.up('sm')]: {
      height: '100%'
    },
		[theme.breakpoints.down('xs')]: {
      height: '50%'
    }
  },
  submitBtn: {
    margin: '10px 0'
  },
  flex: {
    flex: 1
  }
})

export default connect(
  mapStateToProps,
  { toggleEdit, handleRemoveQuestion, handleSubmitQuestion }
)(withStyles(styles)(Tests))
