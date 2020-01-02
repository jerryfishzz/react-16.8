import React from 'react'
import { 
  Button,
  Dialog, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  withStyles,
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { connect } from 'react-redux'
// import { closeAlert } from '../../actions/errorAlert'
import { handleCloseAlert } from '../../actions/shared'

const style = theme => ({
  dialogTitle: {
    color: theme.palette.secondary.main
  }
})

// Customize DialogTitle font color
const DialogTitle = withStyles(style)(props => {
  const { children, classes, ...other } = props

  return (
    <MuiDialogTitle 
      className={classes.dialogTitle} 
      {...other}
    >
      {children}
    </MuiDialogTitle>
  )
})

const ErrorAlert = props => {
  const { 
    error,
    errorAlert: { isOpen },
    appStatus: { lastAction },
    handleCloseAlert
  } = props

  const handleClose = () => {
    handleCloseAlert()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>
        {`${lastAction} Error`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {error}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = ({ errorAlert, appStatus }) => {
  return {
    errorAlert,
    appStatus
  }
}

export default connect(mapStateToProps, { handleCloseAlert })(ErrorAlert)
