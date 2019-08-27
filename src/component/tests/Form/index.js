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
import { handleSaveQuestion, handleCreateQuestion } from "../../../actions/test/testQuestions";
import DraftEditor from "./DraftEditor";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.setDomEditorRef = ref => this.domEditor = ref

    this.state = {
      test: {
        id: uniqid(),
        data: {
          id: '',
          question: '',
          tages: [],
          answers: [{
            content: '',
            correctness: false,
            note: ''
          }],
          otherNotes: EditorState.createEmpty()
        },
        submittedAnswer: null,
        selectedAnswer: null,
        isSubmitted: false,
      },
      isFormValidate: false,
      isFocus: false
    }
  }

  componentDidMount() {
    // this.domEditor.focus()

    const { isNewlyCreated, currentQuestion } = this.props

    if (!isNewlyCreated) {
      this.setState({
        test: {
          ...currentQuestion,
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

  onAnswerChange = prop => index => ({ target: { value } }) => {
    this.setState(({ test, test: { data: { answers } } }) => ({
      test: {
        ...test,
        data: {
          ...test.data,
          answers: answers.map((a, i) => {
            if (i === index) {
              return {
                ...a,
                [prop]: value
              }
            }
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
          { handleSaveQuestion, handleCreateQuestion, isNewlyCreated } = this.props
    
    const contentState = test.data.otherNotes.getCurrentContent();
    const newOther = JSON.stringify(convertToRaw(contentState))
    const finalTest = {
      ...test,
      data: {
        ...test.data,
        otherNotes: newOther
      }
    }

    if (isNewlyCreated) {
      return handleCreateQuestion(finalTest, this.resetForm)
    } else {
      return handleSaveQuestion(test.id, finalTest)
    }
  }

  resetForm = () => {
    this.setState({
      test: {
        id: uniqid(),
        data: {
          id: '',
          question: '',
          tages: [],
          answers: [{
            content: '',
            correctness: false,
            note: ''
          }],
          otherNotes: EditorState.createEmpty()
        },
        submittedAnswer: null,
        selectedAnswer: null,
        isSubmitted: false,
      },
      isFormValidate: false,
      isFocus: false
    })
  }

  validateForm = () => {
    // todo: validate answer content

    const { test: { data: { question, answers } } } = this.state

    const emptyDraftString = JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent()))
    console.log(emptyDraftString)

    // const contentState = this.state.test.data.otherNotes.getCurrentContent();
    // const newOther = JSON.stringify(convertToRaw(contentState))
    // console.log(newOther)

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
    const { classes, paddingRight, isNewlyCreated } = this.props
    const { test: { data: { question, tags, answers } }, isFormValidate } = this.state

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
            ownedTags={tags} 
            onTagChange={this.onTagChange}
          />
        </div>

        <div className={classNames(classes.background, classes.lower)}>
          <AnswerForm 
            answers={answers}
            isNewlyCreated={isNewlyCreated}
            onAnswerChange={this.onAnswerChange}
            onDelete={this.onDelete}
            onNewAnswer={this.onNewAnswer}
          />
        </div>

        <div className={classes.background}>
          <Typography> 
            Other Notes
          </Typography>

          
          
            
          

          <DraftEditor 
            otherNotes={this.state.test.data.otherNotes} 
            handleDraftChange={this.handleDraftChange}
          />
        </div>

        
        
        <CreateSnackbar 
          handleSubmit={this.handleSubmit}
          isFormValidate={isFormValidate}
          isNewlyCreated={isNewlyCreated}
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
  { handleSaveQuestion, handleCreateQuestion }
)(withStyles(styles)(Form));
