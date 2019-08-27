import React from "react";
import Answers from './Answers';
import { withStyles, Typography } from '@material-ui/core';
import { connect } from 'react-redux'
import { Editor, EditorState, convertFromRaw } from "draft-js";

const Question = ({ classes, currentQuestion }) => {
  return (
    <div className={classes.question}>
      <Typography
        variant="subtitle1"
      >
        <Editor
          editorState={
            EditorState.createWithContent(
              convertFromRaw(JSON.parse(currentQuestion.data.question))
            )
          }
          readOnly={true}
        />
      </Typography>
      <Answers />
    </div>
  )
}

const styles = theme => ({
	question: {
    [theme.breakpoints.up('sm')]: {
      height: '60%',
    },
		[theme.breakpoints.down('xs')]: {
      height: '45%',
    },
    
    overflowY: 'auto',
	}
})

const mapStateToProps = ({ 
  test: { currentQuestionNumber, testQuestions } 
}) => {
  const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}

  return {
    currentQuestion,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Question))
