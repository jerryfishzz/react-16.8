import React from 'react';
import { 
  withStyles, 
  List, 
  ListItem, 
  ListItemText, 
  Icon,
  Grid
} from '@material-ui/core';
import classNames from 'classnames';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import { connect } from 'react-redux'
import { Editor, EditorState, convertFromRaw } from "draft-js";

import { 
  getTheAlphanumericOrder, 
  validateDraftFromString,
  getEditorStateFromContent
} from '../../../utils/helpers';
import { clickAnswer } from '../../../actions/test/testQuestions';

class Answers extends React.Component {
  componentDidMount() {
    // For Font Awesome
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#insertion-point-jss'),
    );
  }

  // Render the check and cross icon
  renderIcon = (i) => {
    const { classes, currentQuestion } = this.props

    if (currentQuestion.selectedAnswer === null) return null
    if (currentQuestion.submittedAnswer === null) return null

    let icon

    if (i === currentQuestion.selectedAnswer) {
      icon = currentQuestion.data.answers[i].correctness
        ? <Icon className={classNames(classes.icon, 'far fa-check-square')} />
        : <Icon className={classNames(classes.icon, 'far fa-times-circle')} />
    } else {
      icon = currentQuestion.data.answers[i].correctness
        ? <Icon className={classNames(classes.icon, 'far fa-check-square')} />
        : null
    }

    return icon
  }

  render() {
    const { classes, clickAnswer, currentQuestion } = this.props;
    // console.log(currentQuestion)
    return (
      <div className={classes.root}>
        <List component="nav">
          {currentQuestion.data.answers.map((a, i) => {
            

            return (
              <ListItem 
                key={i}
                button={!currentQuestion.isSubmitted} 
                selected={currentQuestion.selectedAnswer === i}
                onClick={
                  currentQuestion.isSubmitted 
                  ? null 
                  : () => clickAnswer(currentQuestion.id, i)
                }
              >
                <ListItemText 
                  primary={
                    <Grid container>
                      <Grid item sm={1}>{getTheAlphanumericOrder(i) + '. '}</Grid>
                      <Grid item sm={11}>
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
      </div>  
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

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

export default connect(
  mapStateToProps,
  {clickAnswer}
)(withStyles(styles)(Answers))
