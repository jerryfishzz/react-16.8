import React, { Fragment } from 'react';
import {
  withStyles,
  Button,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
} from '@material-ui/core';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { getError } from '../../actions/appStatus';
import { openBar, closeBar } from '../../actions/snackBar';
import SnackBar from '../layouts/SnackBar';
import { removeList } from '../../actions/questionList';
import { getRoute } from '../../utils/helpers';

const styles = theme => ({
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2)
  }
});

class ActionButton extends React.Component {
  state = {
    isSubmitting: false,
    dialogOpen: false
  };

  handleClickOpen = () => {
    this.setState({
      dialogOpen: true
    })
  }

  handleConfirm = async () => {
    const { 
      openBar, 
      handleSubmit, 
      getError, 
      initializeFromContent, 
      currentQuestion,
      isNewlyCreated,
      onClose,
      removeList
    } = this.props

    this.toggleSubmitting()

    try {
      await handleSubmit()

      this.setState({ 
        dialogOpen: false,
        isSubmitting: false,
      })

      const message= !isNewlyCreated
        ? "Question has been editted."
        : "Question has been submitted."

      openBar(message)
    } catch(err) {
      this.setState({ 
        dialogOpen: false,
        isSubmitting: false,
      })

      if (err !== 401) {
        // Restore the original question
        initializeFromContent(currentQuestion)
      } else {
        // Close the Form dialog and remove the already non-existing question from the store
        onClose() 
        removeList(currentQuestion.id)
      }

      getError(err)
    }
  };

  toggleSubmitting = () => {
    this.setState(({ isSubmitting }) => ({
      isSubmitting: !isSubmitting
    }))
  }

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false
    })
  }

  render() {
    const { classes, isFormValidate, isNewlyCreated } = this.props;
    const { isSubmitting, dialogOpen } = this.state
    
    return (
      <div className={classes.container}>
        <Button 
          fullWidth
          color="primary" 
          variant="contained" 
          onClick={!isNewlyCreated ? this.handleClickOpen : this.handleConfirm}
          disabled={!isFormValidate || isSubmitting}
        >
          {!isNewlyCreated ? "Edit" : "Create" }
        </Button>
        <Dialog open={dialogOpen}>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action will update all the modifications to the server. Are you sure to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={this.handleDialogClose} 
              color="primary" 
              autoFocus
              disabled={isSubmitting}
            >
              No
            </Button>
            <Button 
              onClick={this.handleConfirm} 
              color="secondary" 
              disabled={isSubmitting}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <SnackBar />
      </div>
    );
  }
}

const mapStateToProps = (
  { test: { currentQuestionNumber, testQuestions } },
  { location, editedQuestion }
) => {
  const route = getRoute(location.pathname)
  if (route === 'add') return {}

  if (route === 'questionlist') {
    return {
      currentQuestion: editedQuestion
    }
  }

  const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}

  return {
    currentQuestion,
  }
}

export default withRouter(connect(
  mapStateToProps,
  { getError, openBar, closeBar, removeList}
)(withStyles(styles)(ActionButton)));