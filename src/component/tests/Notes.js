import React, {Fragment} from 'react';
import { 
  withStyles, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  ListItemAvatar, 
  Avatar, 
  Divider, 
  Tooltip 
} from '@material-ui/core';
import NotesIcon from '@material-ui/icons/Notes';
import indigo from '@material-ui/core/colors/indigo';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { getTheAlphanumericOrder } from '../../utils/store';
// import { withContext } from '../../context';
import { Editor, EditorState, convertFromRaw } from "draft-js";
import { connect } from 'react-redux'

const Notes = ({ testQuestions, currentQuestionNumber, classes }) => {
  // Must do it here because the parent component re-rendering won't necessarily make its child component re-render if there is no props related with state change passing down to the child directly
  const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}

  let hasNotes = false
  const { data } = currentQuestion

  if (data.answers) {
    for (let i = 0; i < data.answers.length; i++) {
      if (data.answers[i].note) {
        hasNotes = true
        break
      }
    }

    if (!hasNotes) {
      if (data.otherNotes) hasNotes = true
    }
  } 

  const isJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  const otherNotes = data.otherNotes 
    ? <Fragment>
        <Divider variant="inset" className={classes.divider} />
        
        <ListItem alignItems="flex-start">
          <Tooltip title="Other Notes">
            <ListItemAvatar>
              <Avatar className={classes.avatarOther}>
                <NotesIcon />
              </Avatar>
            </ListItemAvatar>
          </Tooltip> 
          
          {isJson(data.otherNotes)
            ? <ListItemText>
                <Editor
                  editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(data.otherNotes)))}
                  readOnly={true}
                />
              </ListItemText>
            : <ListItemText 
                primary={data.otherNotes}
              />
          }
            
          
        </ListItem>
        
      </Fragment>
    : null

  return (
    <div className={classes.root}>
      {hasNotes
        ? currentQuestion.isSubmitted
          ? <List>
              {data.answers.map((a, i) => {
                if (!a.note) return null

                return (
                  <ListItem 
                    key={i}
                    alignItems="flex-start"
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.avatar}>
                        {getTheAlphanumericOrder(i)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={a.note} />
                  </ListItem>
                )
              })}
              {otherNotes}
            </List>
          : <Typography
              variant="subtitle1"
            >
              Contents will be displayed after choosing an answer and submitting.
            </Typography>
        : <Typography
            variant="subtitle1"
          >
            Nothing to show.
          </Typography>
      }
    </div> 
  )
}

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    height: 'calc(100% - 39.391px)',
    overflowY: 'auto',
  },
  avatar: {
    backgroundColor: indigo[500]
  },
  avatarOther: {
    backgroundColor: deepPurple[500]
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 40
  },
});

const mapStateToProps = ({ test: { currentQuestionNumber, testQuestions } }) => {
  const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}

  return { 
    // editQuestion,
    currentQuestionNumber,
    testQuestions,
    // currentQuestion
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Notes))
