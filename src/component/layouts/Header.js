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
import { withContext } from '../../context.js';
import CreateDialog from '../tests/Dialog'

const styles = theme => ({
  flex: {
    flex: 1
  },
  fab: {
    marginRight: theme.spacing.unit,
  }
})

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
          onClick={() => shuffleQuestions(questionLibrary)}
        >
          <Shuffle />
        </Fab>
      </Tooltip>
      <CreateDialog />
    </Toolbar>
  </AppBar>
)

export default withContext(withStyles(styles)(Header)) 
