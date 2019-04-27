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
import { questionLibrary } from '../../store.js'

const styles = {
  flex: {
    flex: 1
  }
}

const Header = ({ classes, shuffleQuestions }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography className={classes.flex} variant="h5" color="inherit">
        CODE TEST
      </Typography>
      <Tooltip title="Shuffle Questions">
        <Fab 
          color="secondary"
          size="small"
          onClick={() => shuffleQuestions(questionLibrary)}
        >
          <Shuffle />
        </Fab>
      </Tooltip>
    </Toolbar>
  </AppBar>
)

export default withStyles(styles)(Header)
