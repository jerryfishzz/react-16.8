import React, { Fragment } from 'react'
import { 
  TextField,
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
  isNewlyCreated
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
            md={isNewlyCreated ? null : 1}
            xl={isNewlyCreated ? 1 : null}
            
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
                    onClick={() => onDelete(i)} 
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
            md={isNewlyCreated ? null : 11}
            xl={isNewlyCreated ? 11 : null} 
            className={isNewlyCreated
              ? classes.answersEdit
              : classes.answers
            }
          >
            

            <DraftEditor 
              contents={answers[i].content} 
              handleDraftChange={handleContentChange(i)}
            />

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
            <TextField
              label="Note"
              multiline
              rows="4"
              variant="outlined"
              value={answers[i].note}
              className={classes.textField}
              onChange={handleNoteChange(i)}
            />
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
    height: 307.2,
    overflowY: 'auto',
  },
  headerContainer: {
    marginBottom: 15
  },
  delete: {
    [theme.breakpoints.up('md')]: {
      marginTop: 30,
    }
  },
  deleteEdit: {
    [theme.breakpoints.up('xl')]: {
      marginTop: 30,
    }
  },
  answers: {
    [theme.breakpoints.up('md')]: {
      paddingLeft: 20
    }
  },
  answersEdit: {
    [theme.breakpoints.up('xl')]: {
      paddingLeft: 20
    }
  },
  correctness: {
    marginTop: 15,
    paddingBottom: 20
  },
  avatarContainer: {
    [theme.breakpoints.down('sm')]: {
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
    [theme.breakpoints.up('md')]: {
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "flex-start"
    },
    [theme.breakpoints.down('sm')]: {
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
