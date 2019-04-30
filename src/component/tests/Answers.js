import React from 'react';
import { 
  withStyles, 
  List, 
  ListItem, 
  ListItemText, 
  Icon 
} from '@material-ui/core';
import classNames from 'classnames';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import { getTheAlphanumericOrder } from '../../store';
import { withContext } from '../../context';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class Answers extends React.Component {
  handleListItemClick = i => {
    this.props.handleAnswerActions('selectedAnswer', i)
  };

  componentDidMount() {
    // For Font Awesome
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#insertion-point-jss'),
    );
  }

  // Render the check and cross icon
  renderIcon = (i) => {
    const { classes, currentQuestion } = this.props

    if (currentQuestion.selectedAnswer === null) return null
    if (currentQuestion.submittedAnswer === null) return null

    let icon

    if (i === currentQuestion.selectedAnswer) {
      icon = currentQuestion.answers[i].correctness
        ? <Icon className={classNames(classes.icon, 'far fa-check-square')} />
        : <Icon className={classNames(classes.icon, 'far fa-times-circle')} />
    } else {
      icon = currentQuestion.answers[i].correctness
        ? <Icon className={classNames(classes.icon, 'far fa-check-square')} />
        : null
    }

    return icon
  }

  render() {
    const { classes, currentQuestion } = this.props;

    if (!currentQuestion.answers) return null

    return (
      <div className={classes.root}>
        <List component="nav">
          {currentQuestion.answers.map((a, i) => {
            const answerContent = getTheAlphanumericOrder(i) + '. ' + a.content
            
            return (
              <ListItem 
                key={i}
                button={!currentQuestion.isSubmitted} 
                selected={currentQuestion.selectedAnswer === i}
                onClick={
                  currentQuestion.isSubmitted 
                  ? null 
                  : () => this.handleListItemClick(i)
                }
              >
                <ListItemText primary={answerContent} />
                {this.renderIcon(i)}
              </ListItem>
            )
          })}
        </List>
      </div>  
    );
  }
}

export default withContext(withStyles(styles)(Answers))   
