import React, { Component, Fragment } from 'react'
import { withContext } from '../../context.js'
import { 
  Dialog,
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Fab 
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Form from './Form'

class CreateDialog extends Component {
  state = {
    open: false
  }

  handleToggle = () => {
    this.setState({
      open : !this.state.open
    })
  }

  handleSubmit = test => {
    this.handleToggle()
    this.props.onSubmit(test)
  }

  render() {
    const { open } = this.state,
      { editQuestion, currentQuestion, tags, addTag } = this.props

    return (
      <Fragment>
        <Fab 
          onClick={this.handleToggle} 
          size="small"
          color="secondary"
        > {/** Tutorial uses Button variant="fab". This will be depreciated soon. Here is the recommended way. */}
          <AddIcon />
        </Fab>
        <Dialog
          open={open}
          onClose={this.handleToggle}
          fullWidth
          maxWidth='md'
        > {/** Decide the max width */}
          <DialogTitle>
            Create a New Question
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill out the form below.
            </DialogContentText>
            <Form 
              editQuestion={editQuestion} 
              currentQuestion={currentQuestion}
              onSubmit={this.handleSubmit}
              tags={tags}
              addTag={addTag}
            />
          </DialogContent>
        </Dialog>
      </Fragment>
    )
  }
}

export default withContext(CreateDialog)
