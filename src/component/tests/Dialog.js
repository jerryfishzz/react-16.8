import React, { Component } from 'react'
import { 
  Dialog,
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  withStyles,
} from '@material-ui/core';

import Form from './Form'

const styles = theme => ({
  form: {
    marginBottom: theme.spacing(2),
  }
});

class CreateDialog extends Component {
  handleClose = () => {
    this.props.onClose()
  };

  handleSubmit = test => {
    this.props.onSubmit(test)
  }

  render() {
    const { suggestions, onAddSuggestion, open, comeFrom, classes, ...other } = this.props

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        fullWidth
        maxWidth='md'
      >
        <DialogTitle>
          {comeFrom === 'header' 
            ? 'Create a New Question'
            : 'Edit Question'
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {comeFrom === 'header' 
              ? 'Please fill out the form below. Items with * are required.'
              : 'Items with * are required.'
            }
          </DialogContentText>
          <div className={classes.form}>
            <Form 
              suggestions={suggestions}
              isNewlyCreated={comeFrom === "header"} 
              onSubmit={this.handleSubmit}
              onAddSuggestion={onAddSuggestion}
              {...other}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(styles)(CreateDialog)
