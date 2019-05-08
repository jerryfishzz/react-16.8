import React, { Fragment } from "react";
import { 
  withStyles, 
  Typography, 
  Button, 
  Select, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  TextField 
} from '@material-ui/core';
import { getTheAlphanumericOrder } from '../../../store'
import * as R from 'ramda'
import AnswerForm from './AnswerForm';
import { withContext } from '../../../context';
import uniqid from 'uniqid'
import Tags from "./Tags";

const styles = theme => ({
  container: {
    margin: '24px 0',
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: '50%',
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  background: {
    backgroundColor: '#eeeeee',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    margin: '10px 0'
  },
  answer: {
    zIndex: 1
  },
  otherNotes: {
    zIndex: 0
  }
});

class Form extends React.Component {
  getInitialState = () => {
    const { editQuestion, currentQuestion } = this.props

    return editQuestion 
      ? {
          test: currentQuestion,
          isFormValidate: true
        }
      : {
          test: {
            id: uniqid(),
            question: '',
            answers: [{"correctness": false}],
            otherNotes: ''
          },
          isFormValidate: false
        }
  }

  state = this.getInitialState()

  handleChange = name => ({ target: { value } }) => {
    this.setState(({ test }) => 
      ({
        test: {
          ...test,
          [name]: value
        },
      }), 
      () => {
        if (name === 'question') this.validateForm()
      }
    )
  }

  onAnswerChange = (index, prop, value) => {
    this.setState(({ test, test: { answers } }) => ({
      test: {
        ...test,
        answers: answers.map((a, i) => {
          if (i === index) a[prop] = value
          return a
        })
      }
    }), this.validateForm)
  }
  
  onNewAnswer = () => {
    this.setState(({ test, test : { answers } }) => ({
      test: {
        ...test,
        answers: [...answers, {"correctness": false}]
      }
    }), this.validateForm)
  }

  onDelete = index => {
    this.setState(({ test, test : { answers } }) => ({
      test: {
        ...test,
        answers: answers.filter((a, i) => i !== index)
      }
    }), this.validateForm)
  }

  handleSubmit = () => {
    const { test } = this.state
    this.props.onSubmit(test)
  }

  validateForm = () => {
    // todo: validate answer content

    const { test: { question, answers } } = this.state

    const isExisted = x => x ? true : false
    const arrOfcontent = answers.map(a => a.content)
    const isAnswerValidate = R.all(isExisted)(arrOfcontent)

    this.setState({
      isFormValidate: (question && isAnswerValidate)
        ? true
        : false
    }) 
  }

  render() {
    const { classes } = this.props,
      { test: { question, answers, otherNotes }, isFormValidate } = this.state

    return (
      <form className={classes.container}>
        <div className={classes.background}>
          <TextField
            label="Question"
            multiline
            rows="2"
            margin="normal"
            fullWidth
            variant="outlined"
            value={question}
            required
            onChange={this.handleChange('question')}
          />
        </div>
        
        <div className={classes.background}>
          <AnswerForm 
            answers={answers}
            className={classes.answer}
            onAnswerChange={this.onAnswerChange}
            onDelete={this.onDelete}
            onNewAnswer={this.onNewAnswer}
          />
        </div>

        <div className={classes.background}>
          <TextField
            className={classes.otherNotes}
            label="Other Notes"
            multiline
            rows="2"
            margin="normal"
            fullWidth
            variant="outlined"
            value={otherNotes}
            onChange={this.handleChange('otherNotes')}
          />
        </div>

        <Button
          color="primary" 
          variant="contained" 
          onClick={this.handleSubmit}
          disabled={!isFormValidate}
        >
          Create
        </Button>
      </form>
    )
  }
}

export default withStyles(styles)(Form);
