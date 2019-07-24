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
  Divider
} from '@material-ui/core';
import { getTheAlphanumericOrder } from '../../../store';
import Tags from './Tags';
import indigo from '@material-ui/core/colors/indigo';

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

const AnswerForm = ({ 
  answers, 
  classes,
  onAnswerChange,
  onDelete,
  onNewAnswer,
  editQuestion
}) => {
  const handleAnswerChange = (index, prop) => ({ target: { value } }) => { // target is event.target
    onAnswerChange(index, prop, value)
  }

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
            md={editQuestion ? null : 1}
            xl={editQuestion ? 1 : null}
            
            className={editQuestion
              ? classes.answerHeaderEdit
              : classes.answerHeader
            }
          >
            <Grid
              item 
              container 
              justify="center" 
              className={editQuestion
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
                  className={editQuestion
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
            md={editQuestion ? null : 11}
            xl={editQuestion ? 11 : null} 
            className={editQuestion
              ? classes.answersEdit
              : classes.answers
            }
          >
            <TextField
              label="Answer"
              multiline
              rows="2"
              variant="outlined"
              value={answers[i].content}
              required
              className={classes.textField}
              onChange={handleAnswerChange(i, 'content')}
            /> 
            <FormControl fullWidth className={classes.correctness}>
              <InputLabel>
                Correctness
              </InputLabel>
              <Select
                value={answers[i].correctness}
                onChange={handleAnswerChange(i, 'correctness')}
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
              onChange={handleAnswerChange(i, 'note')}
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

export default withStyles(styles)(AnswerForm)
