import React from "react";
import { 
  withStyles,
  TextField, 
  Typography
} from '@material-ui/core';
import * as R from 'ramda'
import AnswerForm from './AnswerForm';
import uniqid from 'uniqid'
import Tags from "./Tags";
import classNames from 'classnames';
import CreateSnackbar from '../Snackbar'

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
            tages: [],
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

  onTagChange = newTagArr => {
    this.setState(prevState => ({
      test: {
        ...prevState.test,
        tags: newTagArr.map(tag => tag.value)
      }
    }))
  }

  handleSubmit = () => {
    const { test } = this.state,
      { editQuestion } = this.props

    this.props.onSubmit(test)
    
    if (!editQuestion) {
      this.setState({
        test: {
          id: uniqid(),
          question: '',
          tags: [],
          answers: [
            {
              "content": '',
              "correctness": false,
              "note": ''
            }
          ],
          otherNotes: ''
        },
        isFormValidate: false
      })
    }
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
    const { classes, paddingRight, editQuestion, onAddSuggestion, suggestions } = this.props,
      { test: { question, tags, answers, otherNotes }, isFormValidate } = this.state

    return (
      <form 
        className={classes.container}
        style={paddingRight ? {paddingRight: paddingRight} : null}
      >
        <div className={classes.background}>
          <Typography> 
            <span className={classes.required}>Question</span>*
          </Typography>
          <TextField
            multiline
            rows="2"
            margin="normal"
            fullWidth
            variant="outlined"
            value={question}
            required
            className={classes.white}
            onChange={this.handleChange('question')}
          />
        </div>
        
        <div className={classes.background}> 
          <Tags 
            tags={tags} 
            suggestions={suggestions}
            onTagChange={this.onTagChange}
            onAddSuggestion={onAddSuggestion}
          />
        </div>

        <div className={classNames(classes.background, classes.lower)}>
          <AnswerForm 
            answers={answers}
            editQuestion={editQuestion}
            onAnswerChange={this.onAnswerChange}
            onDelete={this.onDelete}
            onNewAnswer={this.onNewAnswer}
          />
        </div>

        <div className={classes.background}>
          <Typography> 
            Other Notes
          </Typography>
          <TextField
            multiline
            rows="4"
            margin="normal"
            fullWidth
            variant="outlined"
            value={otherNotes}
            className={classes.white}
            onChange={this.handleChange('otherNotes')}
          />
        </div>
        
        <CreateSnackbar 
          handleSubmit={this.handleSubmit}
          isFormValidate={isFormValidate}
          editQuestion={editQuestion}
        />
      </form>
    )
  }
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    height: 'calc(100% - 39.6px - 28px)',
    overflowY: 'auto',
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
  lower: {
    zIndex: 0
  },
  required: {
    marginRight: 3
  },
  form: {
    height: 500,
    overflowY: 'auto',
  },
  createBtn: {
    marginTop: 10
  },
  white: {
    backgroundColor: 'white'
  }
});

export default withStyles(styles)(Form);
