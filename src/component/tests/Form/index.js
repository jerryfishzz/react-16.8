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
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.setDomEditorRef = ref => this.domEditor = ref
  }


  getInitialState = () => {
    const { editQuestion, currentQuestion } = this.props

    return editQuestion 
      ? {
          test: {
            ...currentQuestion,
            otherNotes: EditorState.createWithContent(convertFromRaw(JSON.parse(currentQuestion.otherNotes)))
          },
          isFormValidate: true,
          isFocus: false,
          
        }
      : {
          test: {
            id: uniqid(),
            question: '',
            tages: [],
            answers: [{"correctness": false}],
            otherNotes: EditorState.createEmpty()
          },
          isFormValidate: false,
          isFocus: false
        }
  }

  state = this.getInitialState()

  componentDidMount(){
    this.domEditor.focus()
  }

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
    
    const contentState = test.otherNotes.getCurrentContent();
    const newOther = JSON.stringify(convertToRaw(contentState))
    const finalTest = {
      ...test,
      otherNotes: newOther
    }

    this.props.onSubmit(finalTest)
    
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
          otherNotes: EditorState.createEmpty()
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

  handleDraftChange = editorState => {
    // const contentState = editorState.getCurrentContent();
    this.setState((prevState) => ({
      test: {
        ...prevState.test,
        otherNotes: editorState
      }
    }));
  };

  onToggleCode = (e) => {
    e.preventDefault()
    this.handleDraftChange(RichUtils.toggleCode(this.state.test.otherNotes));
  };

  getFocus = e => {
    setTimeout(this.setState({isFocus: true}), 500)
    
  }

  loseFocus = e => {
    this.setState({isFocus: false})
  }

  render() {
    const { classes, paddingRight, editQuestion, onAddSuggestion, suggestions } = this.props,
      { test: { question, tags, answers }, isFormValidate } = this.state

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

          <button onClick={this.onToggleCode}>Code Block</button>
          <TextField
            multiline
            rows="4"
            margin="normal"
            fullWidth
            variant="outlined"
            className={classes.white}
            InputProps={{
              endAdornment: (
                <div className={classes.draftContent} onClick={this.getFocus} onBlur={this.loseFocus}>
                  <div className={this.state.isFocus ? classes.editor : classes.editor1}>
                    
                    <Editor
                      editorState={this.state.test.otherNotes}
                      handleKeyCommand={this.handleKeyCommand}
                      onChange={this.handleDraftChange}
                      placeholder='Hello'
                      ref={this.setDomEditorRef}
                    />
                  </div>
                </div>
              ),
            }}
          >
            
          </TextField>

          
          
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
  },
  draftContent: {
    width: '100%',
    margin: '0 auto'
  },
  editor: {
    border: '2px solid red',
    padding: 6,
    
  },
  editor1: {
    border: '1px solid green',
    padding: 6,
    '&:hover': {
      border: '1px solid black',
    }
  }
});

export default withStyles(styles)(Form);
