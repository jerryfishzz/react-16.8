import React, { Component } from 'react'
import { 
  Typography, 
  Grid, 
  Paper, 
  withStyles, 
  Button 
} from '@material-ui/core';
import Question from './Question';
import ProgressingBar from './ProgressingBar';
import Notes from './Notes';

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
   }
})

export default withStyles(styles)(class extends Component {
  state = {
		numberOfQuestion: 0
	}
  
  componentDidMount() {
		this.setState((prevState) => ({
			questionNumber: prevState.questionNumber + 1
		}))
	}

	nextQuestion = () => {
		this.props.nextQuestion();
	}

	previousQuestion = () => {
		this.props.previousQuestion();
	}

	handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
	};
	
	submitAnswer = (i = null) => {
		if (i === null) return null
		
    this.props.handleAnswerActions('submittedAnswer', i)
  }
  
  render() {
    const {
      classes,
      currentQuestionNumber,
      testQuestions,
      currentQuestion,
      handleAnswerActions
     } = this.props 
  
    return (
      <Grid container className={classes.container}>
        <Grid item xs={12} sm={6} className={classes.item}>
          <Paper className={classes.paper}>
            <Grid container alignItems="center">
              <Typography
                variant='h5'
                inline={true}
                gutterBottom
              >
                Question {currentQuestionNumber + 1} / {testQuestions.length}
              </Typography>
            </Grid>	

            <Question
              currentQuestion={currentQuestion}
              handleAnswerActions={handleAnswerActions}
            />
            
            <Button 
              className={classes.submitBtn}
              variant="contained"
              color='primary'
              onClick={() => this.submitAnswer(currentQuestion.selectedAnswer)}
              disabled={!currentQuestion.hasAnswers || currentQuestion.isSubmitted}
            >
              Submit
            </Button>

            <ProgressingBar 
              key={currentQuestionNumber}
              testQuestions={testQuestions} 
              currentQuestionNumber={currentQuestionNumber}
              handleNext={this.nextQuestion}
              handleBack={this.previousQuestion}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.item}>
          <Paper className={classes.paper}>
            <Grid container alignItems="center">
              <Typography variant='h5' gutterBottom>
                Notes
              </Typography>
            </Grid>

            <Notes 
              currentQuestion={currentQuestion}
            />
          </Paper>
        </Grid>
      </Grid>
    )
  }
})
