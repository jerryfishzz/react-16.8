import React from 'react'
import {
  Snackbar,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux'
import { closeBar } from '../../actions/snackBar';

const useStyles = makeStyles(theme => ({
  close: {
    padding: theme.spacing(0.5),
  },
}))

function SnackBar(props) {
  const classes = useStyles()
  const { snackBar: { isOpen, message }, closeBar } = props

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    closeBar()
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      action={[
        <IconButton
          key="close"
          color="inherit"
          className={classes.close}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  )
}

const mapStateToProps = ({ snackBar }) => {
  return {
    snackBar
  }
}

export default connect(mapStateToProps, { closeBar })(SnackBar)
