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
import { deepPurple, green, red } from '@material-ui/core/colors';
import { Editor } from "draft-js";
import { connect } from 'react-redux'

import { 
  getTheAlphanumericOrder, 
  validateDraftFromString, 
  getEditorStateFromContent,
  strToObj,
  objToStr
} from '../../utils/helpers';
import { generateData } from './Form/dataGenerator';
import MarkdownEditor from './Form/MarkdownEditor';

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

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    height: 'calc(100% - 39.391px)',
    overflowY: 'auto',
  },
  avatarCorrect: {
    backgroundColor: green[500]
  },
  avatarWrong: {
    backgroundColor: red[500]
  },
  avatarOther: {
    backgroundColor: deepPurple[500]
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10
  },
});

/**
 * Take out the draft editor object string from input string
 * @param {string} inputString 
 * @return {string} Draft object string
 */
const getDraftString = inputString => {
  const obj = strToObj(inputString)
  return obj.draft ? objToStr(obj.draft) : inputString
}

const getAnswerNoteCounts = answers => {
  let counts = 0
  answers.map(answer => {
    if(validateDraftFromString(answer.note)) counts++
  })
  return counts
}

const Notes = ({ currentQuestion, classes }) => {
  let hasNotes = false, hasAnswerNotes = false

  const { data: { answers, otherNotes: otherNotesString }} = currentQuestion
  const otherNotesDraftString = getDraftString(otherNotesString)
  const answerNoteCounts = getAnswerNoteCounts(answers)

  const { otherNotes: { draft, md }} = generateData(currentQuestion)
  
  if (answers.length) {
    for (let i = 0; i < answers.length; i++) {
      if (validateDraftFromString(answers[i].note)) {
        hasAnswerNotes = true
        hasNotes = true
        break
      }
    }

    if (!hasNotes) {
      if (validateDraftFromString(otherNotesDraftString)) hasNotes = true
    }
  } 

  const otherNotes = validateDraftFromString(otherNotesDraftString) || md
    ? <Fragment>
        {hasAnswerNotes && <Divider className={classes.divider} />}
        <ListItem alignItems="flex-start">
          <Tooltip title="Other Notes">
            <ListItemAvatar>
              <Avatar className={classes.avatarOther}>
                <NotesIcon />
              </Avatar>
            </ListItemAvatar>
          </Tooltip> 
          <ListItemText>
            {!md 
              ? <Editor editorState={draft} readOnly={true} />
              : <MarkdownEditor mdConfig={mdConfig} text={md} />}
          </ListItemText>
        </ListItem>
      </Fragment>
    : null

  let renderedDividerCounts = 0

  return (
    <div className={classes.root}>
      {hasNotes
        ? currentQuestion.isSubmitted
          ? <List>
              {answers.map((a, i) => {
                if (!validateDraftFromString(a.note)) return null

                renderedDividerCounts++

                return (
                  <Fragment key={i}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar 
                          className={a.correctness
                            ? classes.avatarCorrect
                            : classes.avatarWrong}>
                          {getTheAlphanumericOrder(i)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Editor
                            editorState={getEditorStateFromContent(a.note)}
                            readOnly={true}
                          />
                        } 
                      />
                    </ListItem>
                    {renderedDividerCounts !== answerNoteCounts && 
                      <Divider variant="inset" light className={classes.divider} component="li" />}
                  </Fragment>
                )
              })}
              {otherNotes}
            </List>
          : <Typography variant="subtitle1">
              Contents will be displayed after choosing an answer and submitting.
            </Typography>
        : <Typography variant="subtitle1">
            Nothing to show.
          </Typography>
      }
    </div> 
  )
}



const mapStateToProps = ({ 
  test: { currentQuestionNumber, testQuestions } 
}) => {
  const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}

  return { 
    currentQuestion
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Notes))
