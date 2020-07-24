import React from 'react';
import { 
  withStyles, 
  List, 
  ListItem, 
  ListItemText,
  Grid,
  ListItemIcon
} from '@material-ui/core';
import { connect } from 'react-redux'
import { Editor } from "draft-js";
import { CheckCircle, Cancel } from '@material-ui/icons';
import { green, red, indigo } from '@material-ui/core/colors';

import { 
  getTheAlphanumericOrder, 
  getEditorStateFromContent
} from '../../../utils/helpers';
import { clickAnswer } from '../../../actions/test/testQuestions';

const styles = theme => ({
  check: {
    color: green[500]
  },
  cancel: {
    color: red[500]
  },
  listItemIcon: {
    justifyContent: 'center'
  },
  root: {
    marginTop: 4,
    marginBottom: 4,
    border: '1px solid transparent',
    borderRadius: 4,
    '&$selected': {
      backgroundColor: indigo[50],
      '&:hover': {
        backgroundColor: indigo[50]
      }
    },
  },
  button: {
    '&$selected': {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      }
    }
  },
  selected: {},
  answer: {
    overflowX: 'auto'
  }
});

class Answers extends React.Component {
  // Render the check or cross icon
  renderIcon = (i) => {
    const { classes, currentQuestion } = this.props

    if (!currentQuestion.isSubmitted) return null

    let icon = currentQuestion.data.answers[i].correctness
      ? <CheckCircle className={classes.check} />
      : <Cancel className={classes.cancel} />

    return (
      <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>
    )
  }

  render() {
    const { clickAnswer, currentQuestion, classes } = this.props;
    
    return (
      <List component="nav">
        {currentQuestion.data.answers.map((a, i) => {
          return (
            <ListItem 
              key={i}
              button={!currentQuestion.isSubmitted} 
              selected={currentQuestion.selectedAnswers.indexOf(i) !== -1}
              onClick={currentQuestion.isSubmitted 
                ? null 
                : () => clickAnswer(currentQuestion.id, i)
              }
              classes={{
                root: classes.root,
                selected: classes.selected,
                button: classes.button
              }}
            >
              <ListItemText 
                primary={
                  <Grid container>
                    <Grid item sm={1}>{getTheAlphanumericOrder(i) + '. '}</Grid>
                    <Grid item sm={11} className={classes.answer}>
                      <Editor
                        editorState={getEditorStateFromContent(a.content)}
                        readOnly={true}
                      />
                    </Grid>
                  </Grid>
                } 
              />
              {this.renderIcon(i)}
            </ListItem>
          )
        })}
      </List>
    );
  }
}

const mapStateToProps = ({ test: { currentQuestionNumber, testQuestions } }) => {
  const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}

  return {
    currentQuestion,
  }
}

export default connect(
  mapStateToProps,
  { clickAnswer }
)(withStyles(styles)(Answers))
