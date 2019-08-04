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
import { getTheAlphanumericOrder } from '../../store';
import { withContext } from '../../context';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";

const Notes = ({ currentQuestion, classes }) => {
  let hasNotes = false

  if (currentQuestion.answers) {
    for (let i = 0; i < currentQuestion.answers.length; i++) {
      if (currentQuestion.answers[i].note) {
        hasNotes = true
        break
      }
    }

    if (!hasNotes) {
      if (currentQuestion.otherNotes) hasNotes = true
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

  const otherNotes = currentQuestion.otherNotes 
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
          
          {isJson(currentQuestion.otherNotes)
            ? <ListItemText>
                <Editor
                  editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(currentQuestion.otherNotes)))}
                  readOnly={true}
                />
              </ListItemText>
            : <ListItemText 
                primary={currentQuestion.otherNotes}
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
              {currentQuestion.answers.map((a, i) => {
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

export default withContext(withStyles(styles)(Notes))  
