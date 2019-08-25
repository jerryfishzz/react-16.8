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
import { connect } from 'react-redux'
import { handleSaveQuestion } from "../../../actions/test/testQuestions";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.setDomEditorRef = ref => this.domEditor = ref

    this.state = {
      test: {
        id: '',
        data: {
          id: '',
          question: '',
          tages: [],
          answers: [{"correctness": false}],
          otherNotes: EditorState.createEmpty()
        }
      },
      isFormValidate: false,
      isFocus: false
    }
  }

  componentDidMount(){
    this.domEditor.focus()

    const { isNewlyCreated, currentQuestion } = this.props

    if (!isNewlyCreated) {
      this.setState({
        test: {
          id: currentQuestion.id,
          data: {
            ...currentQuestion.data,
            otherNotes: EditorState.createWithContent(convertFromRaw(JSON.parse(currentQuestion.data.otherNotes)))
          }
        },
        isFormValidate: true,
      })
    }
  }

  handleChange = name => ({ target: { value } }) => {
    this.setState(({ test }) => 
      ({
        test: {
          ...test,
          data: {
            ...test.data,
            [name]: value
          }
          
        },
      }), 
      () => {
        if (name === 'question') this.validateForm()
      }
    )
  }

  onAnswerChange = (index, prop, value) => {
    this.setState(({ test, test: { data: { answers } } }) => ({
      test: {
        ...test,
        data: {
          ...test.data,
          answers: answers.map((a, i) => {
            if (i === index) a[prop] = value
            return a
          })
        }
      }
    }), this.validateForm)
  }
  
  onNewAnswer = () => {
    this.setState(({ test, test : { data: { answers } } }) => ({
      test: {
        ...test,
        data: {
          ...test.data,
          answers: [...answers, {"correctness": false}]
        }
      }
    }), this.validateForm)
  }

  onDelete = index => {
    this.setState(({ test, test : { data: { answers } } }) => ({
      test: {
        ...test,
        data: {
          ...test.data,
          answers: answers.filter((a, i) => i !== index)
        }
        
      }
    }), this.validateForm)
  }

  onTagChange = newTagArr => {
    this.setState(prevState => ({
      test: {
        ...prevState.test,
        data: {
          ...prevState.test.data,
          tags: newTagArr.map(tag => tag.value)
        }
        
      }
    }))
  }

  handleSubmit = () => {
    const { test } = this.state,
          { editQuestion, handleSaveQuestion } = this.props
    
    const contentState = test.data.otherNotes.getCurrentContent();
    const newOther = JSON.stringify(convertToRaw(contentState))
    const finalTest = {
      ...test,
      data: {
        ...test.data,
        otherNotes: newOther
      }
      
    }

    handleSaveQuestion(test.id, finalTest)
      .catch(err => alert(err))
    
    if (!editQuestion) { // If not in editing mode (create new: editQuestion is null), reset state
      this.setState({
        test: {
          id: uniqid(),
          data: {
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
          }
          
        },
        isFormValidate: false
      })
    }
  }

  validateForm = () => {
    // todo: validate answer content

    const { test: { data: { question, answers } } } = this.state

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
        data: {
          ...prevState.test.data,
          otherNotes: editorState
        }
        
      }
    }));
  };

  onToggleCode = (e) => {
    e.preventDefault()
    this.handleDraftChange(RichUtils.toggleCode(this.state.test.data.otherNotes));
  };

  getFocus = e => {
    setTimeout(this.setState({isFocus: true}), 500)
    
  }

  loseFocus = e => {
    this.setState({isFocus: false})
  }

  render() {
    const { classes, paddingRight, editQuestion } = this.props,
          { test: { data: { question, tags, answers } }, isFormValidate } = this.state

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
            onTagChange={this.onTagChange}
            
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
                <div 
                  className={classes.draftContent} 
                  onClick={this.getFocus} 
                  onBlur={this.loseFocus}
                >
                  <div className={this.state.isFocus ? classes.editor : classes.editor1}>
                    
                    <Editor
                      editorState={this.state.test.data.otherNotes}
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

const mapStateToProps = (
  { test: { currentQuestionNumber, testQuestions, editQuestion } },
  { isNewlyCreated }
) => {
  const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}

  return {
    currentQuestion,
    currentQuestionNumber,
    editQuestion,
    isNewlyCreated
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

export default connect(
  mapStateToProps,
  { handleSaveQuestion }
)(withStyles(styles)(Form));
