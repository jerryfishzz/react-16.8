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
    this.toggleSubmitting()

    try {
      await this.props.handleSubmit()

      this.setState({ 
        open: true,
        isSubmitting: false,
        dialogOpen: false
      });
    } catch(err) {
      // alert(err)
      this.props.getError(err)
      this.toggleSubmitting()
      this.setState({ 
        open: false,
      });
      this.props.initializeFromContent(this.props.currentQuestion)
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
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={
            !isNewlyCreated
              ? "Question has been editted."
              : "Question has been submitted."
          }
          action={[
            <IconButton
              key="close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
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
  { getError }
)(withStyles(styles)(CreateSnackbar)));
