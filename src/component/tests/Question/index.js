import React from "react";
import Answers from './Answers';
import { withStyles, Typography, Grid } from '@material-ui/core';
import { connect } from 'react-redux'
import { Editor } from "draft-js";
import { generateData } from "../Form/dataGenerator";
import MarkdownEditor from "../Form/MarkdownEditor";

const mdConfig = {
  config: {
    view: {
      menu: false, 
      md: false, 
      html: true 
    },
    canView: { 
      menu: true, 
      md: true, 
      html: true, 
      fullScreen: false, 
      hideMenu: false 
    }
  },
  isReadOnly: true,
  style: {
    border: 0
  }
}

const styles = {
	content: {
    width: '100%',
  }
}

const Question = ({ classes, currentQuestion }) => {
  const { question: { draft, md }} = generateData(currentQuestion)
  // console.log(data)

  return (
    <Grid container direction="column">
      <Grid item className={classes.content}>
        <Typography variant="subtitle1">
          {!md 
            ? <Editor editorState={draft} readOnly={true} />
            : <MarkdownEditor mdConfig={mdConfig} text={md} />}
        </Typography>
      </Grid>
      <Grid item className={classes.content}>
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
