import React from "react";
import { 
  withStyles,
  Typography,
  TextField,
  Grid,
  Paper
} from '@material-ui/core';
import * as R from 'ramda'
import AnswerForm from './AnswerForm';
import { EditorState, convertToRaw } from "draft-js";
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { red } from '@material-ui/core/colors';

import Tags from './Tags';
import ActionButton from '../ActionButton'
import {  
  handleCreateQuestion, 
  handleCreateQuestionToWp, 
  handleSaveQuestionToWp 
} from "../../../actions/test/testQuestions";
import DraftEditor from "./DraftEditor";
import { 
  isExisted, 
  escapeAndStringify, 
  getEditorStateFromContent, 
  getType, 
  getQuestionFromWPForEditting 
} from "../../../utils/helpers";
import { getError } from "../../../actions/appStatus";
import MarkdownEditor from "./MarkdownEditor";
import { generateData } from "./dataGenerator";

const styles = theme => ({
  item: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default
  },
  required: {
    marginRight: theme.spacing(0.5)
  },
  astra: {
    color: red[500]
  },
  field: {
    backgroundColor: theme.palette.background.paper,
  },
});

const mdConfig = {
  // config: {
  //   view: {
  //     menu: false, 
  //     md: false, 
  //     html: true 
  //   },
  //   canView: { 
  //     menu: true, 
  //     md: true, 
  //     html: true, 
  //     fullScreen: false, 
  //     hideMenu: false 
  //   }
  // },
  config: {},
  isReadOnly: false
}

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      test: {
        id: '',
        data: {
          id: '',
          question: {
            draft: EditorState.createEmpty(),
            md: ''
          },
          title: '',
          tags: [],
          answers: [{
            content: EditorState.createEmpty(),
            correctness: false,
            note: EditorState.createEmpty()
          }],
          otherNotes: {
            draft: EditorState.createEmpty(),
            md: ''
          },
        },
        selectedAnswers: [],
        isSubmitted: false,
      },
      removed: [],
      isFormValidate: false,
      isFocus: false,
      countsOfAnswer: 0,
      isLoading: true,
      editedQuestion: null // For question list
    }
  }

  componentDidMount() {
    const { isNewlyCreated, currentQuestion, qid, postType, getError } = this.props

    if (!isNewlyCreated) {
      if (qid !== undefined) { // Under questionlist route
        getQuestionFromWPForEditting(postType, qid)
          .then(res => {
            this.initializeFromContent(res)
            this.setState({
              editedQuestion: res
            })
          })
          .catch(err => {
            // alert(err)
            getError(err)
          })
      } else { // Under test route
        this.initializeFromContent(currentQuestion)
      }
    } else {
      this.setState({
        isLoading: false,
        countsOfAnswer: 1 
      })
    }
  }

  initializeFromContent = currentQuestion => {
    const data = generateData(currentQuestion)

    this.setState({
      test: {
        ...currentQuestion,
        data
      },
      isFormValidate: true,
      countsOfAnswer: currentQuestion.data.answers.length,
      isLoading: false,
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
    
    const newOtherNotes = escapeAndStringify(test.data.otherNotes)
    const newQuestion = escapeAndStringify(test.data.question)

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
          title: '',
          tags: [],
          answers: [{
            content: EditorState.createEmpty(),
            correctness: false,
            note: EditorState.createEmpty()
          }],
          otherNotes: EditorState.createEmpty()
        },
        selectedAnswers: [],
        isSubmitted: false,
      },
      removed: [],
      isFormValidate: false,
      isFocus: false,
      countsOfAnswer: 0,
      isLoading: false,
      editedQuestion: null
    })
  }

  validateDraft = name => {
    const { blocks } = convertToRaw(name.getCurrentContent())
    const arrayOfName = blocks.map(block => block.text)

    return R.any(isExisted)(arrayOfName)
  }

  validateForm = () => {
    const { test: { data: { question, answers }}} = this.state
    
    // Validate question not blank
    const isQuestionValidate = this.validateDraft(question.draft)

    // Validate all the answers not blank
    const contentValidatingStates = answers.map(answer => this.validateDraft(answer.content))
    const isAnswerValidate = R.all(isExisted)(contentValidatingStates)

    this.setState({
      isFormValidate: (isQuestionValidate && isAnswerValidate)
        ? true
        : false
    }) 
  }

  validateFormForMd = () => {
    const { test: { data: { question, answers }}} = this.state
    
    const regex = /^\s*$/g
    // Validate question not blank
    const isQuestionValidate = !regex.test(question.md)

    // Validate all the answers not blank
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
            [name]: {
              ...prevState.test.data[name],
              draft: editorState,
            }
          }
        }
      }), 
      () => {
        if (name === 'question') this.validateForm()
      }  
    );
  };

  handleMdChange = name => text => {
    this.setState(
      (prevState) => ({
        test: {
          ...prevState.test,
          data: {
            ...prevState.test.data,
            [name]: {
              ...prevState.test.data[name],
              md: text,
            }
          }
        }
      }), 
      () => {
        if (name === 'question') this.validateFormForMd()
      }  
    );
  };

  render() {
    const { classes, isNewlyCreated, onClose } = this.props
    const { 
      test: { data: { question, tags, answers, title, otherNotes }}, 
      isFormValidate, 
      countsOfAnswer, 
      isLoading,
      editedQuestion 
    } = this.state

    const handleOtherNotesChange = this.handleDraftChange('otherNotes')
    const handleQuestionChange = this.handleDraftChange('question')

    const handleOtherNotesChangeForMd = this.handleMdChange('otherNotes')
    const handleQuestionChangeForMd = this.handleMdChange('question')

    if (isLoading) {
      return <div>Loading...</div>
    }

    console.log(otherNotes)

    return (
      <Grid container direction="column">
        <Grid item className={classes.item} style={{width: '100%'}}>
          <Paper className={classes.paper}>
            <Grid container direction="column">
              <Typography variant="subtitle1"> 
                <span className={classes.required}>Question</span><span className={classes.astra}>*</span>
              </Typography>
              <DraftEditor 
                contents={question.draft} 
                handleDraftChange={handleQuestionChange}
              />
              <MarkdownEditor 
                mdConfig={mdConfig} 
                handleMdChange={handleQuestionChangeForMd}
                text={question.md}
              />
            </Grid>
          </Paper>
        </Grid>

        <Grid item className={classes.item} style={{width: '100%'}}>
          <Paper className={classes.paper}>
            <Grid container direction="column">
              <Typography variant="subtitle1"> 
                <span className={classes.required}>Title</span>
              </Typography>
              <TextField
                variant="outlined"
                className={classes.field}
                value={title}
                onChange={this.handleChange('title')}
              />
            </Grid>
          </Paper>
        </Grid>

        <Grid item className={classes.item}>
          <Paper className={classes.paper}>
            <Tags 
              ownedTags={tags} 
              onTagChange={this.onTagChange}
            />
          </Paper>
        </Grid>

        <Grid item className={classes.item}>
          <Paper className={classes.paper}>
            <AnswerForm 
              answers={answers}
              isNewlyCreated={isNewlyCreated}
              onAnswerChange={this.onAnswerChange}
              onDelete={this.onDelete}
              onNewAnswer={this.onNewAnswer}
              countsOfAnswer={countsOfAnswer}
            />
          </Paper>
        </Grid>

        <Grid item className={classes.item}>
          <Paper className={classes.paper}>
            <Grid container direction="column">
              <Typography variant="subtitle1"> 
                Other Notes
              </Typography>
              <DraftEditor 
                contents={otherNotes.draft} 
                handleDraftChange={handleOtherNotesChange}
              />
              <MarkdownEditor 
                mdConfig={mdConfig} 
                handleMdChange={handleOtherNotesChangeForMd}
                text={otherNotes.md}
              />
            </Grid>
          </Paper>
        </Grid>

        <Grid item className={classes.item}>
          <ActionButton 
            handleSubmit={this.handleSubmit}
            isFormValidate={isFormValidate}
            isNewlyCreated={isNewlyCreated}
            initializeFromContent={this.initializeFromContent}
            editedQuestion={editedQuestion}
            onClose={onClose}
          />
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (
  { test: { currentQuestionNumber, testQuestions, editQuestion } },
  { isNewlyCreated, location, qid }
) => {
  const postType = getType(location)
  
  if (location.pathname === '/questionlist') {
    return {
      isNewlyCreated,
      qid,
      postType
    }
  }

  const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}
  
  return {
    currentQuestion,
    currentQuestionNumber,
    editQuestion,
    isNewlyCreated,
    postType,
    location
  }
}

export default withRouter(connect(
  mapStateToProps,
  { 
    handleCreateQuestion, 
    handleCreateQuestionToWp,
    handleSaveQuestionToWp,
    getError
  }
)(withStyles(styles)(Form)));
