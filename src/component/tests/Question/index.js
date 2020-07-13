import React from "react";
import Answers from './Answers';
import { withStyles, Typography, Grid } from '@material-ui/core';
import { connect } from 'react-redux'
import { Editor } from "draft-js";
import { getEditorStateFromContent } from "../../../utils/helpers";


const styles = {
	question: {
    overflowX: 'auto',
	}
}

const Question = ({ classes, currentQuestion }) => {
  console.log(currentQuestion)

  return (
    <Grid container direction="column">
      <Grid item className={classes.question}>
        <Typography variant="subtitle1">
          <Editor
            editorState={getEditorStateFromContent(currentQuestion.data.question)}
            readOnly={true}
          />
        </Typography>
      </Grid>
      <Grid item>
        <Answers />
      </Grid>
    </Grid>
  )
}

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
