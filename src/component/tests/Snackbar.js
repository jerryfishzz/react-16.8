import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
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
    isSubmitting: false
  };

  handleClick = async () => {
    this.toggleSubmitting()

    try {
      await this.props.handleSubmit()

      this.setState({ 
        open: true,
        isSubmitting: false
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

  render() {
    const { classes, isFormValidate, isNewlyCreated } = this.props;
    const { isSubmitting } = this.state
    
    return (
      <div>
        <Button 
          fullWidth
          color="primary" 
          variant="contained" 
          onClick={this.handleClick}
          disabled={!isFormValidate || isSubmitting}
        >
          {!isNewlyCreated
            ? "Edit"
            : "Create"
          }
        </Button>
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
