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
import * as R from 'ramda'
import NotesIcon from '@material-ui/icons/Notes';
import indigo from '@material-ui/core/colors/indigo';
import deepPurple from '@material-ui/core/colors/deepPurple';


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

const alphanumericString = 'ABCDEFG'

const gotTheAlphanumericOrder = R.flip(R.nth)(alphanumericString)

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
          <ListItemText 
            primary={currentQuestion.otherNotes}
          />
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
                    <Avatar className={classes.avatar}>{gotTheAlphanumericOrder(i)}</Avatar>
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
          Nothing for this question.
        </Typography>
      }
    </div> 
  )
}

export default withStyles(styles)(Notes)
