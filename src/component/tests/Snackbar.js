import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

class CreateSnackbar extends React.Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.props.handleSubmit()
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { classes, isFormValidate, editQuestion } = this.props;
    return (
      <div>
        <Button 
          color="primary" 
          variant="contained" 
          onClick={this.handleClick}
          disabled={!isFormValidate}
          className={classes.button}
        >
          {editQuestion
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
            editQuestion
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

CreateSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
  button: {
    marginTop: 10
  }
});

export default withStyles(styles)(CreateSnackbar);
