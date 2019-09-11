import React from "react";
import { 
  withStyles,
  Typography
} from '@material-ui/core';
import * as R from 'ramda'
import AnswerForm from './AnswerForm';
import classNames from 'classnames';
import { EditorState, convertToRaw } from "draft-js";
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import Tags from './Tags';
import CreateSnackbar from '../Snackbar'
import {  
  handleCreateQuestion, 
  handleCreateQuestionToWp, 
  handleSaveQuestionToWp 
} from "../../../actions/test/testQuestions";
import DraftEditor from "./DraftEditor";
import { isExisted, escapeAndStringify, getEditorStateFromContent } from "../../../utils/helpers";

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      test: {
        id: '',
        data: {
          id: '',
          question: EditorState.createEmpty(),
          tags: [],
          answers: [{
            content: EditorState.createEmpty(),
            correctness: false,
            note: EditorState.createEmpty()
          }],
          otherNotes: EditorState.createEmpty()
        },
        submittedAnswer: null,
        selectedAnswer: null,
        isSubmitted: false,
      },
      removed: [],
      isFormValidate: false,
      isFocus: false,
      countsOfAnswer: 0
    }
  }

  componentDidMount() {
    const { isNewlyCreated, currentQuestion } = this.props

    if (!isNewlyCreated) {
      this.initializeFromContent(currentQuestion)
    } else {
      this.setState(({ test }) => ({
        test: {
          ...test,
          data: {
            ...test.data,
          }
        },
        countsOfAnswer: 1
      }))
    }
  }

  initializeFromContent = currentQuestion => {
    this.setState({
      test: {
        ...currentQuestion,
        data: {
          ...currentQuestion.data,
          question: getEditorStateFromContent(currentQuestion.data.question),
          answers: currentQuestion.data.answers.map(answer => ({
            ...answer,
            content: getEditorStateFromContent(answer.content),
            note: getEditorStateFromContent(answer.note)
          })),
          otherNotes: getEditorStateFromContent(currentQuestion.data.otherNotes),
        }
      },
      isFormValidate: true,
      countsOfAnswer: currentQuestion.data.answers.length
    })
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

  onAnswerChange = prop => index => editorState => {
    this.setState(({ test, test: { data: { answers } } }) => ({
      test: {
        ...test,
        data: {
          ...test.data,
          answers: answers.map((a, i) => {
            if (i === index) {
              if (prop === 'correctness') {
                const { target: { value } } = editorState
                return {
                  ...a,
                  [prop]: value
                }
              }
              return {
                ...a,
                [prop]: editorState
              }
            }
            return a
          })
        }
      }
    }), this.validateForm)
  }
  
  onNewAnswer = () => {
    this.setState(({ test, test : { data: { answers } }, countsOfAnswer }) => ({
      test: {
        ...test,
        data: {
          ...test.data,
          answers: [
            ...answers, 
            {
              content: EditorState.createEmpty(),
              correctness: false,
              note: EditorState.createEmpty()
            }
          ]
        }
      },
      countsOfAnswer: countsOfAnswer + 1
    }), this.validateForm)
  }

  onDelete = (index, id) => {
    this.setState(({ 
      test, 
      test : { data: { answers } }, 
      removed,
      countsOfAnswer 
    }) => ({
      test: {
        ...test,
        data: {
          ...test.data,
          answers: answers.filter((a, i) => i !== index)
        }
      },
      removed: id ? [...removed, id] : removed,
      countsOfAnswer: countsOfAnswer - 1
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
    const { test, removed } = this.state,
          { 
            isNewlyCreated, 
            handleCreateQuestionToWp, 
            handleSaveQuestionToWp,
          } = this.props
    
    // const contentState = test.data.otherNotes.getCurrentContent();
    // const newOtherNotes = JSON.stringify(convertToRaw(contentState))
    // const newQuestion = JSON.stringify(convertToRaw(test.data.question.getCurrentContent()))

    const newOtherNotes = escapeAndStringify(test.data.otherNotes)
    const newQuestion = escapeAndStringify(test.data.question)

    // const newAnswers = test.data.answers.map(answer => ({
    //   ...answer,
    //   content: JSON.stringify(convertToRaw(answer.content.getCurrentContent())),
    //   note: JSON.stringify(convertToRaw(answer.note.getCurrentContent()))
    // }))

    const newAnswers = test.data.answers.map(answer => ({
      ...answer,
      content: escapeAndStringify(answer.content),
      note: escapeAndStringify(answer.note)
    }))

    const finalTest = {
      ...test,
      data: {
        ...test.data,
        question: newQuestion,
        otherNotes: newOtherNotes,
        answers: newAnswers
      }
    }

    if (isNewlyCreated) {
      return handleCreateQuestionToWp(finalTest, this.resetForm, this.props.postType)
    } else {
      return handleSaveQuestionToWp(test.id, finalTest, removed, this.resetRemoved, this.initializeFromContent, this.props.postType)
    }
  }

  resetRemoved = () => {
    this.setState({
      removed: []
    })
  }

  resetForm = () => {
    this.setState({
      test: {
        data: {
          question: EditorState.createEmpty(),
          tags: [],
          answers: [{
            content: EditorState.createEmpty(),
            correctness: false,
            note: EditorState.createEmpty()
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

  validateDraft = name => {
    const { blocks } = convertToRaw(name.getCurrentContent())
    const arrayOfName = blocks.map(block => block.text)

    return R.any(isExisted)(arrayOfName)
  }

  validateForm = () => {
    // todo: validate answer content

    const { test: { data: { question, answers } } } = this.state
    
    const isQuestionValidate = this.validateDraft(question)

    const contentValidatingStates = answers.map(answer => this.validateDraft(answer.content))
    const isAnswerValidate = R.all(isExisted)(contentValidatingStates)

    this.setState({
      isFormValidate: (isQuestionValidate && isAnswerValidate)
        ? true
        : false
    }) 
  }

  handleDraftChange = name => editorState => {
    this.setState(
      (prevState) => ({
        test: {
          ...prevState.test,
          data: {
            ...prevState.test.data,
            [name]: editorState
          }
        }
      }), 
      () => {
        if (name === 'question') this.validateForm()
      }  
    );
  };

  // onToggleCode = (e) => {
  //   e.preventDefault()
  //   this.handleDraftChange(RichUtils.toggleCode(this.state.test.data.otherNotes));
  // };

  // getFocus = e => {
  //   setTimeout(this.setState({isFocus: true}), 500)
    
  // }

  // loseFocus = e => {
  //   this.setState({isFocus: false})
  // }

  render() {
    const { classes, paddingRight, isNewlyCreated } = this.props
    const { test: { data: { question, tags, answers } }, isFormValidate, countsOfAnswer } = this.state

    const handleOtherNotesChange = this.handleDraftChange('otherNotes')
    const handleQuestionChange = this.handleDraftChange('question')

    return (
      <form 
        className={classes.container}
        style={paddingRight ? {paddingRight: paddingRight} : null}
      >
        <div className={classes.background}>
          <Typography> 
            <span className={classes.required}>Question</span>*
          </Typography>

          <DraftEditor 
            contents={question} 
            handleDraftChange={handleQuestionChange}
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
            countsOfAnswer={countsOfAnswer}
          />
        </div>

        <div className={classes.background}>
          <Typography> 
            Other Notes
          </Typography>

          <DraftEditor 
            contents={this.state.test.data.otherNotes} 
            handleDraftChange={handleOtherNotesChange}
          />
        </div>

        <CreateSnackbar 
          handleSubmit={this.handleSubmit}
          isFormValidate={isFormValidate}
          isNewlyCreated={isNewlyCreated}
          initializeFromContent={this.initializeFromContent}
        />
      </form>
    )
  }
}

const mapStateToProps = (
  { test: { currentQuestionNumber, testQuestions, editQuestion } },
  { isNewlyCreated, location: { pathname } }
) => {
  const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}
    const postType = pathname === '/' ? 'questions' : 'temps'

  return {
    currentQuestion,
    currentQuestionNumber,
    editQuestion,
    isNewlyCreated,
    postType
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

export default withRouter(connect(
  mapStateToProps,
  { 
    handleCreateQuestion, 
    handleCreateQuestionToWp,
    handleSaveQuestionToWp
  }
)(withStyles(styles)(Form)));
