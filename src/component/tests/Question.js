import React from "react";
import Answers from './Answers';
import { withStyles, Typography } from '@material-ui/core';
import { withContext } from "../../context";

const styles = theme => ({
	question: {
    [theme.breakpoints.up('sm')]: {
      height: '60%',
    },
		[theme.breakpoints.down('xs')]: {
      height: '45%',
    },
    
    overflowY: 'auto',
	}
})

const Question = ({ classes, currentQuestion }) => (
  <div className={classes.question}>
    <Typography
      variant="subtitle1"
    >
      {currentQuestion.question}
    </Typography>
    <Answers />
  </div>
)

export default withContext(withStyles(styles)(Question))  
