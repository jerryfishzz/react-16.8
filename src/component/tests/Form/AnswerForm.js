import React, { Fragment } from 'react'
import { 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  withStyles,
  Grid,
  Avatar,
} from '@material-ui/core';
import { getTheAlphanumericOrder } from '../../../utils/helpers';
import indigo from '@material-ui/core/colors/indigo';

import DraftEditor from './DraftEditor';

const AnswerForm = ({ 
  answers, 
  classes,
  onAnswerChange,
  onDelete,
  onNewAnswer,
  isNewlyCreated,
  countsOfAnswer
}) => {
  const handleContentChange = onAnswerChange('content')
  const handleCorrectnessChange = onAnswerChange('correctness')
  const handleNoteChange = onAnswerChange('note')

  const answerContent = answers.map((a, i) => {
    const orderCode = getTheAlphanumericOrder(i)

    return (
      <Fragment key={i}>
        {i ? <div className={classes.space}></div> : null}
        <Grid 
          container 
          key={i} 
          className={classes.contentContainer}
        >
          <Grid 
            item
            container 
            xs={12}
            lg={isNewlyCreated ? null : 2}
            xl={isNewlyCreated ? 2 : null}
            
            className={isNewlyCreated
              ? classes.answerHeaderEdit
              : classes.answerHeader
            }
          >
            <Grid
              item 
              container 
              justify="center" 
              className={isNewlyCreated
                ? classes.avatarContainerEdit
                : classes.avatarContainer
              }
            >
              <Avatar className={classes.avatar}>
                {orderCode}
              </Avatar>
            </Grid>
            {answers.length > 1
              ? <Grid 
                  item 
                  className={isNewlyCreated
                    ? classes.deleteEdit
                    : classes.delete
                  }
                >
                  <Button 
                    onClick={() => onDelete(i, a.id)} 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                  >
                    Delete
                  </Button>
                </Grid>
              : null
            }
          </Grid>
          <Grid 
            item 
            xs={12} 
            lg={isNewlyCreated ? null : 10}
            xl={isNewlyCreated ? 10 : null} 
            className={isNewlyCreated
              ? classes.answersEdit
              : classes.answers
            }
          >
            <FormControl fullWidth>
              <div className={classes.draftLabel}>
                Answer
              </div>
              <DraftEditor 
                contents={answers[i].content} 
                handleDraftChange={handleContentChange(i)}
              />
            </FormControl>

            <FormControl fullWidth className={classes.correctness}>
              <InputLabel>
                Correctness
              </InputLabel>
              <Select
                value={answers[i].correctness}
                onChange={handleCorrectnessChange(i)}
              >
                <MenuItem value={true}>
                  <em>True</em>
                </MenuItem>
                <MenuItem value={false}>
                  <em>False</em>
                </MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <div className={classes.draftLabel}>
                Comment
              </div>
              <DraftEditor 
                contents={answers[i].note} 
                handleDraftChange={handleNoteChange(i)}
              />
            </FormControl>

          </Grid>
        </Grid>
      </Fragment>
    )
  })
  
  return (
    <div className={classes.root}>
      <Grid 
        container 
        justify="space-between" 
        alignItems="center"
        className={classes.headerContainer}
      >
        <Typography>
          Answers
        </Typography>
        <Button 
          onClick={onNewAnswer}
          color="primary"
          variant="contained"
          size="small"
          disabled={countsOfAnswer >= 4}
        >
          Add
        </Button>
      </Grid>
      <Grid className={classes.sectionContainer}>
        {answerContent}
      </Grid>
    </div>
  )
}

const styles = theme => ({
  textField: {
    width: '100%',
  },
  root: {
    zIndex: 0
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: '20px 15px',
    borderRadius: 5,
  },
  sectionContainer: {
    // height: 307.2,
    // overflowY: 'auto',
  },
  headerContainer: {
    marginBottom: 15
  },
  delete: {
    [theme.breakpoints.up('lg')]: {
      marginTop: 30,
    }
  },
  deleteEdit: {
    [theme.breakpoints.up('xl')]: {
      marginTop: 30,
    }
  },
  answers: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 20
    }
  },
  answersEdit: {
    [theme.breakpoints.up('xl')]: {
      paddingLeft: 20
    }
  },
  draftLabel: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.54)',
    lineHeight: 1,
    letterSpacing: 0
  },
  correctness: {
    marginTop: 15,
    paddingBottom: 20
  },
  avatarContainer: {
    [theme.breakpoints.down('md')]: {
      width: '50%',
      flex: 1,
      justifyContent: 'flex-start'
    }
  },
  avatarContainerEdit: {
    [theme.breakpoints.down('lg')]: {
      width: '50%',
      flex: 1,
      justifyContent: 'flex-start'
    }
  },
  avatar: {
    backgroundColor: indigo[500]
  },
  space: {
    height: 16
  },
  answerHeader: {
    [theme.breakpoints.up('lg')]: {
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "flex-start"
    },
    [theme.breakpoints.down('md')]: {
      alignItems: "center",
      marginTop: -5,
      marginBottom: 10
    }
  },
  answerHeaderEdit: {
    [theme.breakpoints.up('xl')]: {
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "flex-start"
    },
    [theme.breakpoints.down('lg')]: {
      alignItems: "center",
      marginTop: -5,
      marginBottom: 10
    }
  }
});

export default withStyles(styles)(AnswerForm)
