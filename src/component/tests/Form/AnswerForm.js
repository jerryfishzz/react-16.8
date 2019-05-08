import React, { Fragment } from 'react'
import { 
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  withStyles
} from '@material-ui/core';
import { getTheAlphanumericOrder } from '../../../store';
import Tags from './Tags';

const styles = theme => ({
  textField: {
    width: '50%',
  }
});

const AnswerForm = ({ 
  answers, 
  classes,
  onAnswerChange,
  onDelete,
  onNewAnswer
}) => {
  const handleAnswerChange = (index, prop) => ({ target: { value } }) => { // target is event.target
    onAnswerChange(index, prop, value)
  }

  const answerContent = answers.map((a, i) => {
    const orderCode = getTheAlphanumericOrder(i)

    return (
      <Fragment key={i}>
        <Typography>
          Answer {orderCode}
        </Typography>
        <Button
          onClick={() => onDelete(i)}
        >
          Delete
        </Button>
        <TextField
          label="Answer"
          multiline
          rows="2"
          variant="outlined"
          value={answers[i].content}
          className={classes.textField}
          onChange={handleAnswerChange(i, 'content')}
        /> {/** handleAnswerChange(i, 'content') doesn't finish the function but return an environment waiting for the event to happen. This returned environment doesn't need any outside argument to invoke. So no needs to use () =>  */}
        <TextField
          label="Note"
          multiline
          rows="2"
          variant="outlined"
          value={answers[i].note}
          className={classes.textField}
          onChange={handleAnswerChange(i, 'note')}
        />
        <FormControl fullWidth>
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
      </Fragment>
    )
  })
  
  return (
    <Fragment>
      {answerContent}
      <Button
        onClick={onNewAnswer}
      >
        New
      </Button>
      <Tags />
    </Fragment>
  )
}

export default withStyles(styles)(AnswerForm)
