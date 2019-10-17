import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Snackbar,
  IconButton,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { getError } from '../../actions/appStatus';
import { openBar, closeBar } from '../../actions/snackBar';
import SnackBar from '../layouts/SnackBar';

const styles = theme => ({
  close: {
    padding: theme.spacing(0.5),
  },
});

class CreateSnackbar extends React.Component {
  state = {
    open: false,
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
      isNewlyCreated
    } = this.props

    this.toggleSubmitting()

    try {
      await handleSubmit()

      this.setState({ 
        isSubmitting: false,
        dialogOpen: false
      });

      const message= !isNewlyCreated
        ? "Question has been editted."
        : "Question has been submitted."

      openBar(message)
    } catch(err) {
      openBar(err)
      getError(err)
      this.toggleSubmitting()
      initializeFromContent(currentQuestion)
    }
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
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
      <div>
        <Button 
          fullWidth
          color="primary" 
          variant="contained" 
          onClick={this.handleClickOpen}
          disabled={!isFormValidate || isSubmitting}
        >
          {!isNewlyCreated ? "Edit" : "Create" }
        </Button>
        <Dialog
          open={dialogOpen}
          onClose={this.handleDialogClose}
        >
          <DialogTitle>{!isNewlyCreated ? "Edit " : "Create "}Question</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {!isNewlyCreated 
                ? "This will update all the modifications to the server. Are you sure to proceed?" 
                : "The question will be added to the server. Are you sure to proceed?"
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary" autoFocus>
              No
            </Button>
            <Button 
              onClick={this.handleConfirm} 
              color="secondary" 
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
  if (location.pathname === '/questionlist') {
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

CreateSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(
  mapStateToProps,
  { getError, openBar, closeBar }
)(withStyles(styles)(CreateSnackbar)));
