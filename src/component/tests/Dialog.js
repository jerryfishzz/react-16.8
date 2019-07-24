import React, { Component, Fragment } from 'react'
import { withContext } from '../../context.js'
import { 
  Dialog,
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  DialogActions,
  Button,
  Fab,
  Tooltip
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Form from './Form'

class CreateDialog extends Component {
  state = {
    open: false
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false })
  };

  handleSubmit = test => {
    this.props.onSubmit(test)
  }

  render() {
    const { open } = this.state

    return (
      <Fragment>
        <Fab 
          onClick={this.handleClickOpen} 
          size="small"
          color="secondary"
        >
          <AddIcon />
        </Fab>
        <Dialog
          open={open}
          onClose={this.handleClose}
          fullWidth
          maxWidth='md'
        >
          <DialogTitle>
            Create a New Question
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill out the form below. Items with * are required.
            </DialogContentText>
            <Form 
              editQuestion={false} 
              onSubmit={this.handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </Fragment>
    )
  }
}

export default withContext(CreateDialog)
