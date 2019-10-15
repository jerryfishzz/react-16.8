import React, { Component } from 'react'
import { 
  Dialog,
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  withStyles,
  withWidth,
  IconButton,
  Typography,
  Grid
} from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';

import Form from './Form'

const styles = theme => ({
  form: {
    marginBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1
  },
  iconButton: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
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
    const { 
      suggestions, 
      onAddSuggestion, 
      open, 
      comeFrom, 
      classes, 
      width, 
      ...other 
    } = this.props

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        fullWidth
        maxWidth='md'
        fullScreen={width === 'xs'}
      >
        <DialogTitle>
          <Grid container alignItems="center">
            <Typography variant="h6" className={classes.title}>
              {comeFrom === 'header' 
                ? 'New Question'
                : 'Edit Question'
              }
            </Typography>
            <IconButton 
              color="primary" 
              className={classes.iconButton} 
              onClick={this.handleClose}
            >
              <ExitToApp />
            </IconButton>
          </Grid>
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

export default withWidth()(withStyles(styles)(CreateDialog))
