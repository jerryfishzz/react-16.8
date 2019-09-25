import React, { Component } from 'react'
import { withContext } from '../../context.js'
import { 
  Dialog,
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
} from '@material-ui/core';

import Form from './Form'

class CreateDialog extends Component {
  handleClose = () => {
    this.props.onClose()
  };

  handleSubmit = test => {
    this.props.onSubmit(test)
  }

  render() {
    const { suggestions, onAddSuggestion, open, comeFrom, ...other } = this.props

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
          <Form 
            suggestions={suggestions}
            isNewlyCreated={comeFrom === "header"} 
            onSubmit={this.handleSubmit}
            onAddSuggestion={onAddSuggestion}
            {...other}
          />
        </DialogContent>
      </Dialog>
    )
  }
}

export default withContext(CreateDialog)
