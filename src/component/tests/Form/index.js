import React from "react";
import { 
  withStyles,
  Typography
} from '@material-ui/core';
import * as R from 'ramda'
import AnswerForm from './AnswerForm';
import uniqid from 'uniqid'
import classNames from 'classnames';
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import { connect } from 'react-redux'

import Tags from "./Tags";
import CreateSnackbar from '../Snackbar'
import { handleSaveQuestion, handleCreateQuestion, handleCreateQuestionToWp, handleSaveQuestionToWp } from "../../../actions/test/testQuestions";
import DraftEditor from "./DraftEditor";
import { isExisted } from "../../../utils/helpers";

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
      isFormValidate: false,
      isFocus: false,
      countsOfAnswer: 0
    }
  }

  componentDidMount() {
    const { isNewlyCreated, currentQuestion } = this.props

    if (!isNewlyCreated) {
      this.setState({
        test: {
          ...currentQuestion,
          data: {
            ...currentQuestion.data,
            question: EditorState.createWithContent(convertFromRaw(JSON.parse(currentQuestion.data.question))),
            answers: currentQuestion.data.answers.map(answer => ({
              ...answer,
              content: EditorState.createWithContent(convertFromRaw(JSON.parse(answer.content))),
              note: EditorState.createWithContent(convertFromRaw(JSON.parse(answer.note)))
            })),
            otherNotes: EditorState.createWithContent(convertFromRaw(JSON.parse(currentQuestion.data.otherNotes))),
          }
        },
        isFormValidate: true,
        countsOfAnswer: currentQuestion.data.answers.length
      })
    } else {
      const id = uniqid()

      this.setState(({ test }) => ({
        test: {
          ...test,
          id,
          data: {
            ...test.data,
            id
          }
        },
        countsOfAnswer: 1
      }))
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

  onAnswerChange = prop => index => editorState => {
    this.setState(({ test, test: { data: { answers } } }) => ({
      test: {
        ...test,
        data: {
          ...test.data,
          answers: answers.map((a, i) => {
            if (i === index) {
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

  onDelete = index => {
    this.setState(({ test, test : { data: { answers } }, countsOfAnswer }) => ({
      test: {
        ...test,
        data: {
          ...test.data,
          answers: answers.filter((a, i) => i !== index)
        }
      },
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
    const { test } = this.state,
          { handleSaveQuestion, handleCreateQuestion, isNewlyCreated, handleCreateQuestionToWp, handleSaveQuestionToWp } = this.props
    
    const contentState = test.data.otherNotes.getCurrentContent();
    const newOtherNotes = JSON.stringify(convertToRaw(contentState))
    const newQuestion = JSON.stringify(convertToRaw(test.data.question.getCurrentContent()))

    const newAnswers = test.data.answers.map(answer => ({
      ...answer,
      content: JSON.stringify(convertToRaw(answer.content.getCurrentContent())),
      note: JSON.stringify(convertToRaw(answer.note.getCurrentContent()))
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

    // if (isNewlyCreated) {
    //   return handleCreateQuestion(finalTest, this.resetForm)
    // } else {
    //   return handleSaveQuestion(test.id, finalTest)
    // }

    if (isNewlyCreated) {
      return handleCreateQuestionToWp(finalTest, this.resetForm)
        // .catch(err => alert(err))
    } else {
      return handleSaveQuestionToWp(test.id, finalTest)
        // .catch(err => alert(err))
    }
  }

  resetForm = () => {
    const id = uniqid()

    this.setState({
      test: {
        id,
        data: {
          id,
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

  
  onToggleCode = (e) => {
    e.preventDefault()
    this.handleDraftChange(RichUtils.toggleCode(this.state.test.data.otherNotes));
  };

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
  { 
    handleSaveQuestion, 
    handleCreateQuestion, 
    handleCreateQuestionToWp,
    handleSaveQuestionToWp
  }
)(withStyles(styles)(Form));
