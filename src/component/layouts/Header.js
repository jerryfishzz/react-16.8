import React from 'react'
import { 
  Fab, 
  AppBar, 
  Toolbar, 
  Typography, 
  withStyles, 
  Tooltip 
} from '@material-ui/core';
import Shuffle from '@material-ui/icons/Shuffle';
import CreateDialog from '../tests/Dialog'
import { connect } from 'react-redux'
import { initializeApp } from '../../actions/shared.js';
import { resetNumber } from '../../actions/test/currentQuestionNumber.js';

const Header = ({ classes, shuffleQuestions }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography 
        className={classes.flex} 
        variant="h5" 
        color="inherit"
      >
        CODE TEST
      </Typography>
      <Tooltip title="Shuffle Questions">
        <Fab 
          color="secondary"
          size="small"
          className={classes.fab}
          onClick={shuffleQuestions}
        >
          <Shuffle />
        </Fab>
      </Tooltip>
      <CreateDialog />
    </Toolbar>
  </AppBar>
)



const mapDispatchToProps = dispatch => {
  return {
    shuffleQuestions: () => {
      dispatch(initializeApp(resetNumber))
    }
  }
}

const styles = theme => ({
  flex: {
    flex: 1
  },
  fab: {
    marginRight: theme.spacing.unit,
  }
})

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Header))
