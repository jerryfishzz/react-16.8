import React from "react";
import Answers from './Answers';
import { withStyles, Typography, Grid } from '@material-ui/core';
import { connect } from 'react-redux'
import { Editor } from "draft-js";
import { getEditorStateFromContent } from "../../../utils/helpers";
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
	question: {
    overflowX: 'auto',
	}
}

const Question = ({ classes, currentQuestion }) => {
  console.log(currentQuestion)
  const { question: { draft, md }} = generateData(currentQuestion)
  // console.log(data)

  return (
    <Grid container direction="column">
      <Grid item className={classes.question}>
        <Typography variant="subtitle1">
          {!md 
            ? <Editor editorState={draft} readOnly={true} />
            : <MarkdownEditor mdConfig={mdConfig} text={md} />}
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
